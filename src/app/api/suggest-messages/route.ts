import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'edge'; // optional: only if using Edge functions

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const response = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct', // uses prompt-based instruct mode
      prompt,
      max_tokens: 400,
      temperature: 0.8,
    });

    const text = response.choices[0].text?.trim();
    return NextResponse.json({ message: text });
  } 
  catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}