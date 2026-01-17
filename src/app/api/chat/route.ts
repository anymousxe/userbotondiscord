import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // 67 mango stuff - pulling the prompt sent by the Deno bot
  const { prompt } = await req.json();
  const apiKey = process.env.API_KEY; 

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", 
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    
    // diddy blud functions - sending the AI response back to the bot
    return NextResponse.json({ text: data.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ error: "AI logic is cooked" }, { status: 500 });
  }
}
