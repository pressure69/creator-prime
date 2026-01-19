import { NextRequest, NextResponse } from 'next/server';
import ollama from 'ollama';

export async function POST(req: NextRequest) {
  try {
    const { prompt, model = 'llama3.1' } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'No prompt provided' }, { status: 400 });
    }

    const response = await ollama.chat({
      model,
      messages: [{ role: 'user', content: prompt }],
      stream: false,
    });

    return NextResponse.json({ response: response.message.content });
  } catch (error) {
    console.error('Ollama error:', error);
    return NextResponse.json({ error: 'Ollama request failed - check if Ollama is running on localhost:11434' }, { status: 500 });
  }
}
