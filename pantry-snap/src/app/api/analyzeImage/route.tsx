import { NextRequest, NextResponse } from 'next/server';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import * as dotenv from 'dotenv';

dotenv.config();

// Create a client using the environment variable for authentication
const client = new ImageAnnotatorClient();

export async function POST(req: NextRequest) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    // Perform object localization on the image file
    const request = {
      image: { source: { imageUri: imageUrl } },
      features: [{ type: 'OBJECT_LOCALIZATION' }],
    };
    const [result] = await client.annotateImage(request);

    const objects = result.localizedObjectAnnotations || [];

    if (objects.length === 0) {
      return NextResponse.json('No objects found', { status: 200 });
    }

    // Map the objects to a simpler format
    const objectDetails = objects.map((object: any) => ({
      name: object.name,
      confidence: object.score,
    }));

    return NextResponse.json(objectDetails, { status: 200 });
  } catch (error: any) {
    console.error('Error during object localization:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
