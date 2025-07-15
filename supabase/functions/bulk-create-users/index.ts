import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Profile {
  id: string;
  email: string;
  admission_number: string | null;
  role: 'student' | 'lecturer' | 'admin';
  first_name: string;
  last_name: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get all profiles that don't have corresponding auth users
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('id, email, admission_number, role, first_name, last_name, user_id')
      .is('user_id', null);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      return new Response(JSON.stringify({ error: 'Failed to fetch profiles' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!profiles || profiles.length === 0) {
      return new Response(JSON.stringify({ message: 'No profiles need user creation', created: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const results = [];
    let created = 0;
    let errors = 0;

    for (const profile of profiles) {
      try {
        // Determine email and password based on role
        let authEmail: string;
        let defaultPassword: string;

        if (profile.role === 'student' && profile.admission_number) {
          authEmail = `${profile.admission_number}@zetech.ac.ke`;
          defaultPassword = profile.admission_number;
        } else if (profile.role === 'admin' || profile.role === 'lecturer') {
          authEmail = profile.email;
          defaultPassword = 'admin';
        } else {
          console.log(`Skipping profile ${profile.id} - insufficient data`);
          continue;
        }

        // Create auth user
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: authEmail,
          password: defaultPassword,
          email_confirm: true,
          user_metadata: {
            first_name: profile.first_name,
            last_name: profile.last_name,
            role: profile.role
          }
        });

        if (authError) {
          console.error(`Error creating auth user for profile ${profile.id}:`, authError);
          results.push({
            profile_id: profile.id,
            email: authEmail,
            success: false,
            error: authError.message
          });
          errors++;
          continue;
        }

        // Update profile with user_id and force password change
        const { error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({
            user_id: authUser.user.id,
            force_password_change: true
          })
          .eq('id', profile.id);

        if (updateError) {
          console.error(`Error updating profile ${profile.id}:`, updateError);
          results.push({
            profile_id: profile.id,
            email: authEmail,
            success: false,
            error: updateError.message
          });
          errors++;
        } else {
          results.push({
            profile_id: profile.id,
            email: authEmail,
            auth_user_id: authUser.user.id,
            success: true
          });
          created++;
        }

        console.log(`Created auth user for ${authEmail} (${profile.role})`);

      } catch (error) {
        console.error(`Unexpected error for profile ${profile.id}:`, error);
        results.push({
          profile_id: profile.id,
          success: false,
          error: error.message
        });
        errors++;
      }
    }

    return new Response(JSON.stringify({
      message: `Bulk user creation completed`,
      total_profiles: profiles.length,
      created,
      errors,
      results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in bulk-create-users function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

serve(handler);