import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

export const runtime = 'edge';

console.log('API Key:', process.env.NEXT_PUBLIC_OPENAI_API_KEY);

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, 
});

const openai = new OpenAIApi(configuration);

export async function POST(request: Request) {
  try {
    const { image } = await request.json();
    console.log('Received image for analysis:', image);

    const response = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      stream: true,
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `What's in this image? ${image}`
        }
      ]
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Error during image analysis:', error);
    return new Response('Error processing the request', { status: 500 });
  }
}
