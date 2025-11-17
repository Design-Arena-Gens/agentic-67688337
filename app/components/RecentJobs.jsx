function formatTimestamp(value) {
  try {
    return new Intl.DateTimeFormat('en', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    }).format(new Date(value));
  } catch (error) {
    return value;
  }
}

export default function RecentJobs({ jobs }) {
  if (!jobs?.length) {
    return null;
  }

  return (
    <section className="panel">
      <header className="panel-header">
        <div>
          <h2>Recent renders</h2>
          <p>Track Veo jobs and iterate with shot-level metadata for your production slate.</p>
        </div>
      </header>

      <div className="jobs">
        {jobs.map((job) => (
          <article key={job.jobId} className={`job ${job.status}`}>
            <header>
              <span>{job.prompt.slice(0, 96)}{job.prompt.length > 96 ? '…' : ''}</span>
              <small>{job.status.toUpperCase()}</small>
            </header>
            <dl>
              <div>
                <dt>Created</dt>
                <dd>{formatTimestamp(job.createdAt)}</dd>
              </div>
              <div>
                <dt>Duration</dt>
                <dd>{job.duration}s</dd>
              </div>
              <div>
                <dt>Aspect</dt>
                <dd>{job.aspectRatio}</dd>
              </div>
              {job.videoUrl && (
                <div>
                  <dt>Master</dt>
                  <dd>
                    <a href={job.videoUrl} target="_blank" rel="noreferrer">
                      Open
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
