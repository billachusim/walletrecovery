import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { sendCaseOpenedEmail } from "@/lib/emails.functions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Briefcase } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/console/assessment/$id")({
  component: AssessmentDetail,
});

function AssessmentDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: assessment, isLoading } = useQuery({
    queryKey: ["console-assessment", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assessments")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const [status, setStatus] = useState<string>("pending");
  const [probability, setProbability] = useState<string>("");
  const [feePct, setFeePct] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    if (assessment) {
      setStatus(assessment.status ?? "pending");
      setProbability(assessment.recovery_probability?.toString() ?? "");
      setFeePct(assessment.fee_percentage?.toString() ?? "");
      setNotes(assessment.staff_notes ?? "");
    }
  }, [assessment]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("assessments")
        .update({
          status,
          recovery_probability: probability === "" ? null : Number(probability),
          fee_percentage: feePct === "" ? null : Number(feePct),
          staff_notes: notes || null,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Assessment updated");
      qc.invalidateQueries({ queryKey: ["console-assessment", id] });
      qc.invalidateQueries({ queryKey: ["console-assessments"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const convertMutation = useMutation({
    mutationFn: async () => {
      if (!assessment) throw new Error("no assessment loaded");
      if (!assessment.user_id) {
        throw new Error(
          "Cannot convert: assessment has no linked user. Ask the lead to create an account first.",
        );
      }
      const { data, error } = await supabase
        .from("cases")
        .insert({
          user_id: assessment.user_id,
          assessment_id: assessment.id,
          title: `${assessment.wallet_type} — ${assessment.loss_reason}`,
          description: assessment.details,
          wallet_type: assessment.wallet_type,
          status: "submitted",
          estimated_value: assessment.estimated_value,
          fee_percentage: assessment.fee_percentage,
        })
        .select("id")
        .single();
      if (error) throw error;
      await supabase.from("assessments").update({ status: "converted" }).eq("id", assessment.id);
      return data.id as string;
    },
    onSuccess: (caseId) => {
      toast.success("Case opened");
      qc.invalidateQueries({ queryKey: ["console-assessments"] });
      qc.invalidateQueries({ queryKey: ["console-cases"] });
      navigate({ to: "/console/case/$id", params: { id: caseId } });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <p className="font-mono text-sm text-muted-foreground">&gt; loading...</p>;
  if (!assessment) return <p className="font-mono text-sm text-muted-foreground">&gt; not found</p>;

  const ref = String(assessment.id).slice(0, 8).toUpperCase();

  return (
    <div className="space-y-6">
      <Link to="/console" className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-3 w-3" /> back to queue
      </Link>

      <div className="rounded border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-mono text-lg text-primary">assessment / {ref}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Submitted {new Date(assessment.created_at).toLocaleString()}
            </p>
          </div>
          <Badge className="border border-primary/30 bg-primary/10 font-mono text-[10px] text-primary">
            {assessment.status}
          </Badge>
        </div>

        <dl className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
          <Field label="Contact" value={assessment.guest_email ?? "—"} />
          <Field label="Linked user" value={assessment.user_id ? "yes" : "guest"} />
          <Field label="Wallet type" value={assessment.wallet_type} />
          <Field label="Loss reason" value={assessment.loss_reason} />
          <Field label="Estimated value" value={assessment.estimated_value ? `$${Number(assessment.estimated_value).toLocaleString()}` : "—"} />
          <Field label="Partial phrase" value={assessment.partial_phrase ?? "—"} />
          <Field label="Password hints" value={assessment.partial_password_hints ?? "—"} className="md:col-span-2" />
          <Field label="Details" value={assessment.details ?? "—"} className="md:col-span-2" />
        </dl>
      </div>

      <div className="rounded border border-border bg-card p-6">
        <h3 className="mb-4 font-mono text-sm text-primary">&gt; operator_actions</h3>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <Label className="font-mono text-xs">Status</Label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="pending">pending</option>
              <option value="quoted">quoted</option>
              <option value="converted">converted</option>
              <option value="declined">declined</option>
            </select>
          </div>
          <div>
            <Label className="font-mono text-xs">Recovery probability (%)</Label>
            <Input
              type="number"
              min={0}
              max={100}
              value={probability}
              onChange={(e) => setProbability(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="font-mono text-xs">Fee (%)</Label>
            <Input
              type="number"
              min={0}
              max={100}
              step="0.1"
              value={feePct}
              onChange={(e) => setFeePct(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <div className="mt-4">
          <Label className="font-mono text-xs">Staff notes (internal)</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="mt-1 font-mono text-sm"
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? "saving..." : "save changes"}
          </Button>
          <Button
            variant="outline"
            onClick={() => convertMutation.mutate()}
            disabled={convertMutation.isPending || !assessment.user_id}
            title={!assessment.user_id ? "Guest assessment — user must create an account first" : undefined}
          >
            <Briefcase className="mr-1.5 h-3.5 w-3.5" />
            {convertMutation.isPending ? "opening..." : "convert to case"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 whitespace-pre-wrap text-sm text-card-foreground">{value}</dd>
    </div>
  );
}
