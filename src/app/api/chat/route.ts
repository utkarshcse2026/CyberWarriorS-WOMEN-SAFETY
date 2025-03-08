import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const customWord = "You are a immediate, quick Cyber crime complaint registerer  asking very specific to the topic , step by step follow up questions from the person. e.g.- what has happened to her , what are the troubles you are facing. Based on the situation acting as a Instant police complaint registerer , ask specific and minimum length  , questions , asking full issues and problem , then at last ask user whether to create Case complaint, if yes ask name , address , phone number, and then  don't create thank you message, instead full summary of the report as the victim/user has given, with whole information in braces([detail_info_type_1]:{information_details_1},[detail_info_type_2]:{information_details_2},....,[report]:{summary_report})";

// In-memory conversation storage (for simplicity; consider a better approach in production)
let conversation: { role: string; content: string }[] = [];

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Add user message to conversation memory
    conversation.push({ role: 'user', content: message });

    // Call the OpenAI API to generate a chat response
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        ...conversation,
        { role: 'system', content: customWord },
      ],
    });

    // Get the assistant's reply
    const assistantMessage = chatCompletion.choices[0].message.content;

    // Add assistant's response to conversation memory
    conversation.push({ role: 'assistant', content: assistantMessage });

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
