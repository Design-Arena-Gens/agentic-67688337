'use client';

import { useRef } from 'react';

export default function VideoPreview({ status, videoUrl, posterUrl, job, onDownload }) {
  const videoRef = useRef(null);
  const isReady = status === 'completed' && videoUrl;

  return (
    <aside className="panel">
      <header className="panel-header">
        <div>
          <h2>Output preview</h2>
          <p>{isReady ? 'Playback the finished render or download the master file.' : 'Render progress and reference frames appear here.'}</p>
        </div>
        {isReady && (
          <button type="button" className="secondary" onClick={() => onDownload?.(videoUrl)}>
            Download 8K MP4
          </button>
        )}
      </header>

      <div className="preview">
        {isReady ? (
          <video
            ref={videoRef}
            className="video"
            controls
            loop
            playsInline
            poster={posterUrl ?? '/fallback-poster.svg'}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support HTML video.
          </video>
        ) : (
          <div className="placeholder">
            <span className="pulse" />
            <p>{status === 'failed' ? 'Generation failed. Adjust the prompt and retry.' : 'Awaiting render from Veo 3.1…'}</p>
          </div>
        )}
      </div>

      <dl className="meta">
        <div>
          <dt>Status</dt>
          <dd className={`status ${status}`}>{status}</dd>
        </div>
        {job?.resolution && (
          <div>
            <dt>Resolution</dt>
            <dd>{job.resolution}</dd>
          </div>
        )}
        {job?.frameRate && (
          <div>
            <dt>Frame rate</dt>
            <dd>{job.frameRate} fps</dd>
          </div>
        )}
        {job?.duration && (
          <div>
            <dt>Duration</dt>
            <dd>{job.duration}s</dd>
          </div>
        )}
        {job?.jobId && (
          <div>
            <dt>Job ID</dt>
            <dd>{job.jobId}</dd>
          </div>
        )}
      </dl>
    </aside>
  );
}
