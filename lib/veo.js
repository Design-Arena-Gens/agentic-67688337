const API_HOST = 'https://generativelanguage.googleapis.com/v1beta';
const FALLBACK_VIDEO = 'https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4';
const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80';

const memoryStore = new Map();

function now() {
  return Date.now();
}

function buildPromptPayload(options) {
  const {
    prompt,
    camera,
    lens,
    lighting,
    aspectRatio,
    duration,
    frameRate,
    negativePrompt,
    seed
  } = options;

  const directives = [
    `Cinematic prompt: ${prompt}`,
    `Camera direction: ${camera}`,
    `Lens and format: ${lens}`,
    `Lighting notes: ${lighting}`,
    `Aspect ratio: ${aspectRatio}`,
    `Target duration: ${duration} seconds`,
    `Frame rate: ${frameRate} fps`
  ];

  if (negativePrompt) {
    directives.push(`Exclude: ${negativePrompt}`);
  }

  if (seed) {
    directives.push(`Seed: ${seed}`);
  }

  return directives.join('\n');
}

export async function createVeoJob(options) {
  const apiKey = process.env.GOOGLE_VEO_API_KEY;
  const jobId = `veo_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;
  const timestamp = now();

  if (!apiKey) {
    const simulatedJob = {
      jobId,
      status: 'in_progress',
      createdAt: timestamp,
      prompt: options.prompt,
      duration: options.duration,
      frameRate: options.frameRate,
      aspectRatio: options.aspectRatio,
      resolution: '7680x4320',
      quality: options.quality,
      etaSeconds: 20,
      posterUrl: FALLBACK_POSTER,
      videoUrl: null
    };

    memoryStore.set(jobId, simulatedJob);
    return simulatedJob;
  }

  const payload = {
    config: {
      quality: options.quality ?? 'veo-3.1-ultra',
      aspectRatio: options.aspectRatio,
      frameRate: Number(options.frameRate) || 24,
      durationSeconds: Number(options.duration) || 8,
      outputFormat: {
        container: 'MP4',
        resolution: options.resolution ?? '7680x4320'
      }
    },
    prompt: {
      text: buildPromptPayload(options)
    }
  };

  if (options.seed) {
    payload.config.seed = Number(options.seed);
  }

  if (options.negativePrompt) {
    payload.prompt.safety = {
      negativeText: options.negativePrompt
    };
  }

  const response = await fetch(`${API_HOST}/videos:generate?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.error?.message ?? 'Veo API error while creating job');
  }

  const result = await response.json();

  const job = {
    jobId: result?.operation?.name ?? jobId,
    status: 'in_progress',
    createdAt: timestamp,
    prompt: options.prompt,
    duration: options.duration,
    frameRate: options.frameRate,
    aspectRatio: options.aspectRatio,
    resolution: options.resolution ?? '7680x4320',
    quality: options.quality,
    etaSeconds: result?.metadata?.etaSeconds ?? 120,
    posterUrl: result?.metadata?.previewFrameUrl ?? null,
    videoUrl: null
  };

  memoryStore.set(job.jobId, job);

  return job;
}

export async function getVeoJob(jobId) {
  const apiKey = process.env.GOOGLE_VEO_API_KEY;
  const stored = memoryStore.get(jobId);

  if (!apiKey) {
    if (!stored) {
      throw new Error('Job not found.');
    }

    if (stored.status === 'completed' || stored.status === 'failed') {
      return stored;
    }

    const elapsed = (now() - stored.createdAt) / 1000;
    if (elapsed > 8) {
      const finished = {
        ...stored,
        status: 'completed',
        completedAt: now(),
        etaSeconds: 0,
        videoUrl: FALLBACK_VIDEO,
        posterUrl: FALLBACK_POSTER
      };
      memoryStore.set(jobId, finished);
      return finished;
    }

    return {
      ...stored,
      status: 'in_progress',
      etaSeconds: Math.max(0, Math.round(8 - elapsed))
    };
  }

  if (!stored) {
    const response = await fetch(`${API_HOST}/${jobId}?key=${apiKey}`);
    if (!response.ok) {
      const message = await response.json().catch(() => null);
      throw new Error(message?.error?.message ?? 'Failed to fetch Veo job status');
    }

    const result = await response.json();
    const job = {
      jobId,
      status: result?.done ? 'completed' : 'in_progress',
      createdAt: result?.metadata?.createTime ?? now(),
      completedAt: result?.done ? result?.metadata?.updateTime ?? now() : null,
      prompt: stored?.prompt ?? 'Shot',
      duration: stored?.duration ?? result?.metadata?.durationSeconds ?? 8,
      frameRate: stored?.frameRate ?? result?.metadata?.frameRate ?? 24,
      aspectRatio: stored?.aspectRatio ?? result?.metadata?.aspectRatio ?? '21:9',
      resolution: stored?.resolution ?? result?.metadata?.resolution ?? '7680x4320',
      etaSeconds: result?.metadata?.etaSeconds ?? 0,
      videoUrl: result?.response?.result?.videoUrl ?? null,
      posterUrl: result?.response?.result?.previewFrameUrl ?? stored?.posterUrl ?? null
    };

    if (job.status === 'completed' && !job.videoUrl) {
      job.status = 'failed';
    }

    memoryStore.set(jobId, job);
    return job;
  }

  if (stored.status === 'completed' || stored.status === 'failed') {
    return stored;
  }

  const response = await fetch(`${API_HOST}/${jobId}?key=${apiKey}`);
  if (!response.ok) {
    const message = await response.json().catch(() => null);
    throw new Error(message?.error?.message ?? 'Failed to fetch Veo job status');
  }

  const result = await response.json();

  const job = {
    ...stored,
    status: result?.done ? 'completed' : 'in_progress',
    completedAt: result?.done ? result?.metadata?.updateTime ?? now() : stored.completedAt,
    etaSeconds: result?.metadata?.etaSeconds ?? stored.etaSeconds,
    videoUrl: result?.response?.result?.videoUrl ?? stored.videoUrl,
    posterUrl: result?.response?.result?.previewFrameUrl ?? stored.posterUrl
  };

  if (job.status === 'completed' && !job.videoUrl) {
    job.status = 'failed';
  }

  memoryStore.set(jobId, job);
  return job;
}
