import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { db } from '../../config/Firebase';
import { collection, getDocs } from 'firebase/firestore';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    // Fetch all items from the pantry collection
    const querySnapshot = await getDocs(collection(db, 'pantry'));
    const items = querySnapshot.docs.map((doc) => doc.data().name).join(', ');

    if (!items) {
      return NextResponse.json({ error: 'No items found in pantry' }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `Using the following ingredients: ${items}, generate detailed recipes. Each recipe should be structured with a title, ingredients, and instructions. Separate each recipe with a "%".`,
        },
      ],
      max_tokens: 1000,
    });

    const generatedRecipes = response.choices?.[0]?.message?.content?.split('%').map(recipe => recipe.trim()) || [];
    return NextResponse.json({ recipes: generatedRecipes });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
