const { NextResponse } = require("next/server");

export async function POST(req) {
    try {
      // Read the request body as text
      const body = await req.text();
  
      // Optionally, if you're expecting JSON, you can parse the text to JSON
      const jsonBody = JSON.parse(body);
    
      const OPENROUTER_API_KEY = jsonBody.apiKey;
      const MODEL = jsonBody.model;
      const USER_MESSAGE = jsonBody.text;

  
      if (OPENROUTER_API_KEY) {
        // Exchange the code for a token
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: 'POST',
          headers: {
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            // "HTTP-Referer": `${YOUR_SITE_URL}`, // Optional, for including your app on openrouter.ai rankings.
            // "X-Title": `${YOUR_SITE_NAME}`, // Optional. Shows in rankings on openrouter.ai.
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "model": MODEL, // Optional (user controls the default),
            "messages": [
              {"role": "system", "content": "You are a helpful assistant that only responds in gen-z slang like no cap and that's fire. You will always try to respond in Gen-Z slang when you give a response."},
              {"role": "user", "content": USER_MESSAGE},
            ]
          })
        });
  
        const data = await response.json();
          return NextResponse.json(data); // Send back the data or a confirmation message
      } else {
        // Handle the case where 'code' is not provided
        return NextResponse.json({ error: "Code not provided" });
      }
    } catch (error) {
      // Handle errors, such as JSON parsing errors
      console.error(error);
      return new Response('Error processing request', { status: 500 });
    }
  }