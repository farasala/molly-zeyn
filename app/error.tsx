'use client';

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="shell">
      <div className="page">
        <section className="card">
          <h1 className="card-title">Something went wrong</h1>
          <p className="card-text">{error.message || 'The page could not be loaded.'}</p>
          <p className="card-text">Try again — if it keeps happening, reload the page.</p>
          <div>
            <button className="auth-submit" type="button" onClick={reset} style={{ maxWidth: 200 }}>
              Try Again
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
