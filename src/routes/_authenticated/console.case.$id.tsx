import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/console/case/$id")({
  component: CaseDetail,
});

function CaseDetail() {
  const { id } = Route.useParams();
  const qc = useQueryClient();

  const { data: caseRow } = useQuery({
    queryKey: ["console-case", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("cases").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: updates } = useQuery({
    queryKey: ["console-case-updates", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("case_updates")
        .select("*")
        .eq("case_id", id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: messages } = useQuery({
    queryKey: ["console-case-messages", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("case_messages")
        .select("*")
        .eq("case_id", id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const [newStatus, setNewStatus] = useState("");
  const [updateNote, setUpdateNote] = useState("");
  const [msg, setMsg] = useState("");
  const [isInternal, setIsInternal] = useState(false);

  const postUpdate = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("no session");
      if (newStatus && caseRow) {
        const { error: e1 } = await supabase.from("cases").update({ status: newStatus }).eq("id", id);
        if (e1) throw e1;
      }
      if (updateNote.trim()) {
        const { error: e2 } = await supabase.from("case_updates").insert({
          case_id: id,
          author_id: user.id,
          status_change: newStatus || null,
          note: updateNote,
        });
        if (e2) throw e2;
      }
    },
    onSuccess: () => {
      toast.success("Update posted");
      setNewStatus("");
      setUpdateNote("");
      qc.invalidateQueries({ queryKey: ["console-case", id] });
      qc.invalidateQueries({ queryKey: ["console-case-updates", id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const sendMsg = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("no session");
      const { error } = await supabase.from("case_messages").insert({
        case_id: id,
        sender_id: user.id,
        body: msg,
        is_internal: isInternal,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setMsg("");
      qc.invalidateQueries({ queryKey: ["console-case-messages", id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!caseRow) return <p className="font-mono text-sm text-muted-foreground">&gt; loading case...</p>;

  const ref = String(caseRow.id).slice(0, 8).toUpperCase();

  return (
    <div className="space-y-6">
      <Link to="/console/cases" className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-3 w-3" /> back to cases
      </Link>

      <div className="rounded border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-mono text-lg text-primary">case / {ref}</h2>
            <p className="mt-0.5 text-sm text-card-foreground">{caseRow.title}</p>
          </div>
          <Badge className="border border-primary/30 bg-primary/10 font-mono text-[10px] text-primary">
            {caseRow.status}
          </Badge>
        </div>
        {caseRow.description && (
          <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">{caseRow.description}</p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded border border-border bg-card p-6">
          <h3 className="mb-3 font-mono text-sm text-primary">&gt; post_update</h3>
          <div className="space-y-3">
            <div>
              <Label className="font-mono text-xs">Change status (optional)</Label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="">— no change —</option>
                <option value="submitted">submitted</option>
                <option value="investigating">investigating</option>
                <option value="in_progress">in_progress</option>
                <option value="recovered">recovered</option>
                <option value="unrecoverable">unrecoverable</option>
                <option value="closed">closed</option>
              </select>
            </div>
            <div>
              <Label className="font-mono text-xs">Note (visible to client)</Label>
              <Textarea rows={3} value={updateNote} onChange={(e) => setUpdateNote(e.target.value)} />
            </div>
            <Button
              onClick={() => postUpdate.mutate()}
              disabled={postUpdate.isPending || (!newStatus && !updateNote.trim())}
            >
              {postUpdate.isPending ? "posting..." : "post update"}
            </Button>
          </div>

          <div className="mt-6 space-y-2">
            <h4 className="font-mono text-xs text-muted-foreground">timeline</h4>
            {updates && updates.length > 0 ? (
              updates.map((u) => (
                <div key={u.id} className="rounded border border-border/50 p-3 text-sm">
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {new Date(u.created_at).toLocaleString()}
                    {u.status_change && ` · → ${u.status_change}`}
                  </p>
                  {u.note && <p className="mt-1 whitespace-pre-wrap">{u.note}</p>}
                </div>
              ))
            ) : (
              <p className="font-mono text-xs text-muted-foreground">&gt; no updates yet</p>
            )}
          </div>
        </div>

        <div className="rounded border border-border bg-card p-6">
          <h3 className="mb-3 font-mono text-sm text-primary">&gt; messages</h3>
          <div className="max-h-80 space-y-2 overflow-y-auto">
            {messages && messages.length > 0 ? (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`rounded border p-3 text-sm ${
                    m.is_internal ? "border-yellow-500/30 bg-yellow-500/5" : "border-border/50"
                  }`}
                >
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {new Date(m.created_at).toLocaleString()}
                    {m.is_internal && " · internal"}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap">{m.body}</p>
                </div>
              ))
            ) : (
              <p className="font-mono text-xs text-muted-foreground">&gt; no messages</p>
            )}
          </div>

          <div className="mt-4 space-y-2 border-t border-border pt-4">
            <Textarea rows={3} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="type message..." />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={isInternal}
                  onChange={(e) => setIsInternal(e.target.checked)}
                />
                internal only
              </label>
              <Button size="sm" onClick={() => sendMsg.mutate()} disabled={sendMsg.isPending || !msg.trim()}>
                <Send className="mr-1 h-3 w-3" />
                {sendMsg.isPending ? "sending..." : "send"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
