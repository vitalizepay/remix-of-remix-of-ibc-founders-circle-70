-- Create monk_registrations table for The Monk event registrations
CREATE TABLE public.monk_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  company_name TEXT NOT NULL,
  company_website TEXT,
  role_designation TEXT NOT NULL,
  is_ibc_member BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.monk_registrations ENABLE ROW LEVEL SECURITY;

-- Allow public insert (registration)
CREATE POLICY "Anyone can register for the event"
ON public.monk_registrations
FOR INSERT
WITH CHECK (true);

-- Allow admins to view all registrations
CREATE POLICY "Admins can view all registrations"
ON public.monk_registrations
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));