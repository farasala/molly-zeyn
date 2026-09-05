import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="shell">
      <div className="page">
        <section className="card">
          <h1 className="card-title">Page not found</h1>
          <p className="card-text">
            That address does not exist. Go back to your dashboard and pick up where you left off.
          </p>
          <p>
            <Link href="/dashboard">Back to the dashboard</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
