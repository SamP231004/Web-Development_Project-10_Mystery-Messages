import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY environment variable is not set. Please set it to your Gemini API key.');
}

const genAI = new GoogleGenerativeAI(apiKey);

export const runtime = 'edge';

export async function POST() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Create a list of **exactly three (3)** open-ended and engaging questions. Each question **MUST be separated by '||' (double pipe)**. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. **The entire output MUST strictly adhere to this format: 'Question 1||Question 2||Question 3' (with no extra text, numbering, or preamble).** For example: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('Raw Generated Text (from Gemini):', text);

    const specialChar = '||';
    const expectedQuestionsCount = 3;
    let messages = text.split(specialChar).map(s => s.trim()).filter(Boolean);

    if (messages.length < expectedQuestionsCount) {
      const sentenceSplit = text.split(/[\.?!]\s*/).map(s => s.trim()).filter(Boolean);
      messages = sentenceSplit.length >= expectedQuestionsCount
        ? sentenceSplit.slice(0, expectedQuestionsCount)
        : [
          "What's one thing you're looking forward to?",
          "If you could have any superpower, what would it be?",
          "What's a fun fact about yourself?"
        ];
    } 

    else if (messages.length > expectedQuestionsCount) {
      messages = messages.slice(0, expectedQuestionsCount);
    }

    console.log('Final messages:', messages);
    return NextResponse.json({ messages });
  } 
  catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json({ error: 'Something went wrong with the Gemini API request.' }, { status: 500 });
  }
}