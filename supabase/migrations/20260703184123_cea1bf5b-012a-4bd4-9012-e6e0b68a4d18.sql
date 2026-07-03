CREATE POLICY "Staff can insert cases"
ON public.cases FOR INSERT TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'staff'::app_role) OR has_role(auth.uid(), 'admin'::app_role)
);