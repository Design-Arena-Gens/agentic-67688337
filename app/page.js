'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import PromptBuilder from './components/PromptBuilder';
import VideoPreview from './components/VideoPreview';
import ExperienceHighlights from './components/ExperienceHighlights';
import RecentJobs from './components/RecentJobs';

const POLL_INTERVAL = 4000;

export default function HomePage() {
  const [currentJob, setCurrentJob] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [jobs, setJobs] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const appendJob = useCallback((job) => {
    setJobs((prev) => {
      const existingIndex = prev.findIndex((item) => item.jobId === job.jobId);
      if (existingIndex >= 0) {
        const clone = [...prev];
        clone[existingIndex] = { ...clone[existingIndex], ...job };
        return clone;
      }

      return [job, ...prev].slice(0, 8);
    });
  }, []);

  const handleGenerate = useCallback(
    async (payload) => {
      setIsGenerating(true);
      setError('');

      try {
        const response = await fetch('/api/veo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...payload,
            resolution: '7680x4320',
            quality: 'veo-3.1-ultra'
          })
        });

        if (!response.ok) {
          const message = await response.json().catch(() => ({}));
          throw new Error(message?.error ?? 'Failed to create render job.');
        }

        const data = await response.json();
        setCurrentJob(data.job);
        setVideoUrl(data.job.videoUrl ?? '');
        setPosterUrl(data.job.posterUrl ?? '');
        appendJob(data.job);
      } catch (caughtError) {
        setError(caughtError.message ?? 'Unexpected error while generating video.');
      } finally {
        setIsGenerating(false);
      }
    },
    [appendJob]
  );

  useEffect(() => {
    if (!currentJob?.jobId) {
      return undefined;
    }

    if (['completed', 'failed'].includes(currentJob.status)) {
      return undefined;
    }

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/veo/${currentJob.jobId}`);
        if (!response.ok) {
          throw new Error('Unable to poll render status.');
        }

        const data = await response.json();
        setCurrentJob(data.job);
        setVideoUrl(data.job.videoUrl ?? '');
        setPosterUrl(data.job.posterUrl ?? '');
        appendJob(data.job);
      } catch (pollError) {
        console.error(pollError);
      }
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [appendJob, currentJob?.jobId, currentJob?.status]);

  const status = currentJob?.status ?? 'idle';

  const heroCopy = useMemo(
    () => [
      '8K Ultra Realistic Cinematic Rendering',
      'Physically based lighting, HDR pipelines, Dolby Vision ready masters',
      'Directed by your imagination, orchestrated by Veo 3.1'
    ],
    []
  );

  return (
    <main className="shell">
      <header className="hero">
        <span className="badge">Veo 3.1</span>
        <h1>
          {heroCopy[0]}<br />
          {heroCopy[1]}<br />
          <em>{heroCopy[2]}</em>
        </h1>
        <p>
          Design sequences with prompt-level control, cinematic metadata, and production-ready deliverables. Generate 8K masters ready for
          conform, grade, and finishing in under five minutes.
        </p>
      </header>

      <section className="grid main-grid">
        <PromptBuilder onGenerate={handleGenerate} disabled={isGenerating} />
        <VideoPreview status={status} videoUrl={videoUrl} posterUrl={posterUrl} job={currentJob} onDownload={(url) => window.open(url, '_blank', 'noopener')} />
      </section>

      {error && <p className="error">{error}</p>}

      <ExperienceHighlights />
      <RecentJobs jobs={jobs} />
    </main>
  );
}
