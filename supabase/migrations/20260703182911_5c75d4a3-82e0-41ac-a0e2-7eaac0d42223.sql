
-- 1. case_messages: enforce sender_id = auth.uid()
DROP POLICY IF EXISTS "Users can send messages to own cases" ON public.case_messages;
CREATE POLICY "Users can send messages to own cases"
ON public.case_messages
FOR INSERT
TO authenticated
WITH CHECK (
  sender_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.cases
    WHERE cases.id = case_messages.case_id AND cases.user_id = auth.uid()
  )
);

-- 2. documents: enforce uploaded_by = auth.uid()
DROP POLICY IF EXISTS "Users can upload to own cases" ON public.documents;
CREATE POLICY "Users can upload to own cases"
ON public.documents
FOR INSERT
TO authenticated
WITH CHECK (
  uploaded_by = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.cases
    WHERE cases.id = documents.case_id AND cases.user_id = auth.uid()
  )
);

-- 3. cases: split ALL policy; prevent user_id reassignment
DROP POLICY IF EXISTS "Users can manage their own cases" ON public.cases;

CREATE POLICY "Users can select own cases"
ON public.cases FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cases"
ON public.cases FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cases"
ON public.cases FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own cases"
ON public.cases FOR DELETE TO authenticated
USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.prevent_cases_user_id_change()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.user_id IS DISTINCT FROM OLD.user_id THEN
    RAISE EXCEPTION 'user_id cannot be modified';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_cases_user_id_change ON public.cases;
CREATE TRIGGER prevent_cases_user_id_change
BEFORE UPDATE ON public.cases
FOR EACH ROW EXECUTE FUNCTION public.prevent_cases_user_id_change();

-- 4. assessments: split ALL policy; prevent user_id reassignment
DROP POLICY IF EXISTS "Users can manage their own assessments" ON public.assessments;

CREATE POLICY "Users can select own assessments"
ON public.assessments FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessments"
ON public.assessments FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assessments"
ON public.assessments FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own assessments"
ON public.assessments FOR DELETE TO authenticated
USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.prevent_assessments_user_id_change()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.user_id IS DISTINCT FROM OLD.user_id THEN
    RAISE EXCEPTION 'user_id cannot be modified';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_assessments_user_id_change ON public.assessments;
CREATE TRIGGER prevent_assessments_user_id_change
BEFORE UPDATE ON public.assessments
FOR EACH ROW EXECUTE FUNCTION public.prevent_assessments_user_id_change();

-- 5. Revoke public EXECUTE on SECURITY DEFINER has_role; grant only to authenticated
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
