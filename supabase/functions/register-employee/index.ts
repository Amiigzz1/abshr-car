import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { admin_id, employee_email, employee_password, employee_full_name, employee_role } = await req.json()

    // Verify admin role
    const { data: adminProfile, error: adminError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', admin_id)
      .single()

    if (adminError || !adminProfile || adminProfile.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Only admins can register employees' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create user
    const { data: userData, error: createUserError } = await supabaseClient.auth.admin.createUser({
      email: employee_email,
      password: employee_password,
      email_confirm: true
    })

    if (createUserError) throw createUserError

    // Create profile
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .upsert({
        id: userData.user.id,
        full_name: employee_full_name,
        role: employee_role,
        password: employee_password
      })

    if (profileError) throw profileError

    // If role is sales, create sales agent record
    if (employee_role === 'sales') {
      const { error: salesAgentError } = await supabaseClient
        .from('sales_agents')
        .insert({ id: userData.user.id })

      if (salesAgentError) throw salesAgentError
    }

    return new Response(
      JSON.stringify({ id: userData.user.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})