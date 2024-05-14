const { NextResponse } = require("next/server");

export async function POST(req) {
    try {
      // Read the request body as text
      const body = await req.text();
      const jsonBody = JSON.parse(body);
      const code = jsonBody.code;
  
      if (code) {
        // Exchange the code for a token
        const response = await fetch("https://openrouter.ai/api/v1/auth/keys", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: code,
            // code_verifier: jsonBody.code_verifier // Assuming this is also part of the request
          })
        });
  
        const data = await response.json();
  
        return NextResponse.json(data); // Send back the token
      } else {
        return NextResponse.json({ error: "Code not provided" });
      }
    } catch (error) {
      console.error(error);
      return new Response('Error processing request', { status: 500 });
    }
  }