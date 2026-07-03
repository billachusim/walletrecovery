
-- Assessments table
CREATE TABLE public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_email TEXT,
  wallet_type TEXT NOT NULL,
  loss_reason TEXT NOT NULL,
  details TEXT,
  partial_phrase TEXT,
  partial_password_hints TEXT,
  estimated_value NUMERIC(18, 2),
  recovery_probability INTEGER,
  status TEXT NOT NULL DEFAULT 'pending',
  fee_percentage NUMERIC(5, 2),
  staff_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.assessments TO authenticated;
GRANT ALL ON public.assessments TO service_role;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own assessments" ON public.assessments FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Staff can read all assessments" ON public.assessments FOR SELECT
  USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can update assessments" ON public.assessments FOR UPDATE
  USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

-- Cases table
CREATE TABLE public.cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  wallet_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'submitted',
  estimated_value NUMERIC(18, 2),
  fee_percentage NUMERIC(5, 2),
  fee_amount NUMERIC(18, 2),
  recovered_amount NUMERIC(18, 2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  closed_at TIMESTAMP WITH TIME ZONE
);

GRANT SELECT, INSERT, UPDATE ON public.cases TO authenticated;
GRANT ALL ON public.cases TO service_role;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own cases" ON public.cases FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Staff can read all cases" ON public.cases FOR SELECT
  USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Staff can update all cases" ON public.cases FOR UPDATE
  USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

-- Case updates table
CREATE TABLE public.case_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  stage TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.case_updates TO authenticated;
GRANT ALL ON public.case_updates TO service_role;
ALTER TABLE public.case_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own case updates" ON public.case_updates FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.cases WHERE cases.id = case_updates.case_id AND cases.user_id = auth.uid()
  ));

CREATE POLICY "Staff can manage case updates" ON public.case_updates FOR ALL
  USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

-- Case messages table
CREATE TABLE public.case_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_internal BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.case_messages TO authenticated;
GRANT ALL ON public.case_messages TO service_role;
ALTER TABLE public.case_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own case messages" ON public.case_messages FOR SELECT
  USING (
    (EXISTS (
      SELECT 1 FROM public.cases WHERE cases.id = case_messages.case_id AND cases.user_id = auth.uid()
    ) AND is_internal = false)
    OR public.has_role(auth.uid(), 'staff')
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Users can send messages to own cases" ON public.case_messages FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.cases WHERE cases.id = case_messages.case_id AND cases.user_id = auth.uid()
  ));

CREATE POLICY "Staff can manage case messages" ON public.case_messages FOR ALL
  USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

-- Documents table
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.documents TO authenticated;
GRANT ALL ON public.documents TO service_role;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own case documents" ON public.documents FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.cases WHERE cases.id = documents.case_id AND cases.user_id = auth.uid()
  ));

CREATE POLICY "Users can upload to own cases" ON public.documents FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.cases WHERE cases.id = documents.case_id AND cases.user_id = auth.uid()
  ));

CREATE POLICY "Staff can manage documents" ON public.documents FOR ALL
  USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

-- Articles table
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  category TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.articles TO anon;
GRANT SELECT ON public.articles TO authenticated;
GRANT ALL ON public.articles TO service_role;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published articles are public" ON public.articles FOR SELECT
  USING (published = true);

CREATE POLICY "Staff can manage articles" ON public.articles FOR ALL
  USING (public.has_role(auth.uid(), 'staff') OR public.has_role(auth.uid(), 'admin'));

-- Triggers for updated_at on new tables
CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON public.assessments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON public.cases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
