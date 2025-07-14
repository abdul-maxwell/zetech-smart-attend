-- Fix infinite recursion in profiles RLS policies
-- Drop the problematic admin policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Add force_password_change column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS force_password_change BOOLEAN NOT NULL DEFAULT false;

-- Create a security definer function to check user role without RLS recursion
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid uuid)
RETURNS user_role
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE user_id = user_uuid LIMIT 1;
$$;

-- Create a new admin policy using the security definer function
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  public.get_user_role(auth.uid()) = 'admin'::user_role
);

-- Update existing policies to use the security definer function where needed
DROP POLICY IF EXISTS "Students can manage their absence requests" ON public.absence_requests;
CREATE POLICY "Students can manage their absence requests"
ON public.absence_requests
FOR ALL
TO authenticated
USING (
  (student_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())) 
  OR 
  (public.get_user_role(auth.uid()) IN ('admin'::user_role, 'lecturer'::user_role))
);

DROP POLICY IF EXISTS "Students can view their own attendance" ON public.attendance_logs;
CREATE POLICY "Students can view their own attendance"
ON public.attendance_logs
FOR SELECT
TO authenticated
USING (
  (student_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())) 
  OR 
  (public.get_user_role(auth.uid()) IN ('admin'::user_role, 'lecturer'::user_role))
);

DROP POLICY IF EXISTS "Students can view enrolled classes" ON public.classes;
CREATE POLICY "Students can view enrolled classes"
ON public.classes
FOR SELECT
TO authenticated
USING (
  (EXISTS (
    SELECT 1 FROM student_classes 
    WHERE class_id = classes.id 
    AND student_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  )) 
  OR 
  (public.get_user_role(auth.uid()) IN ('admin'::user_role, 'lecturer'::user_role))
);