import { NextResponse } from 'next/server';
import { getVeoJob } from '../../../../lib/veo';

export async function GET(_request, { params }) {
  try {
    const jobId = params?.jobId;
    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required.' }, { status: 400 });
    }

    const job = await getVeoJob(jobId);
    return NextResponse.json({ job });
  } catch (error) {
    console.error('[veo:poll]', error);
    return NextResponse.json({ error: error.message ?? 'Failed to fetch job status.' }, { status: 500 });
  }
}
