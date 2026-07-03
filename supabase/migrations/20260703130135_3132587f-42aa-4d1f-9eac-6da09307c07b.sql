
-- Allow anonymous users to submit guest assessments (user_id IS NULL)
CREATE POLICY "Anyone can submit guest assessments" ON public.assessments FOR INSERT
  WITH CHECK (user_id IS NULL);
