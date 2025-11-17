import { NextResponse } from 'next/server';
import { createVeoJob } from '../../../lib/veo';

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body?.prompt) {
      return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
    }

    const job = await createVeoJob(body);

    return NextResponse.json({ job });
  } catch (error) {
    console.error('[veo:create]', error);
    return NextResponse.json({ error: error.message ?? 'Failed to create Veo render.' }, { status: 500 });
  }
}
