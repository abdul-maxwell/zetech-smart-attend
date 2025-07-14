import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  to: string;
  subject: string;
  prompt?: string;
  useAI?: boolean;
  content?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, prompt, useAI = false, content = '' }: EmailRequest = await req.json();
    
    let emailContent = content;
    
    // Generate AI content if requested
    if (useAI && prompt) {
      const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { 
              role: 'system', 
              content: 'You are a helpful assistant that generates professional email content. Return only the email body content in HTML format.' 
            },
            { role: 'user', content: prompt }
          ],
          max_tokens: 1000,
        }),
      });

      if (!openAIResponse.ok) {
        throw new Error('Failed to generate AI content');
      }

      const aiData = await openAIResponse.json();
      emailContent = aiData.choices[0].message.content;
    }

    // Send email via Brevo
    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': Deno.env.get('BREVO_API_KEY'),
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: "School Attendance System",
          email: "noreply@schoolattendance.com"
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: emailContent,
        type: "classic"
      }),
    });

    if (!brevoResponse.ok) {
      const errorData = await brevoResponse.text();
      throw new Error(`Brevo API error: ${errorData}`);
    }

    const result = await brevoResponse.json();
    console.log('Email sent successfully:', result);

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: result.messageId,
        content: emailContent 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in send-ai-email function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});