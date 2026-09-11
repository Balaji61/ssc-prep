import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">

      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">

          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight text-blue-800"
          >
            SSC PREP
          </Link>

          <Link
            href="/practice"
            className="rounded-xl px-4 py-2 font-semibold text-gray-700 transition hover:bg-blue-50 hover:text-blue-700"
          >
            Practice →
          </Link>

        </div>
      </header>

      {/* Main */}
      <div className="mx-auto max-w-6xl px-5 py-10 sm:py-14">

        {/* Welcome */}
        <section>
          <p className="font-semibold text-blue-700">
            YOUR DASHBOARD
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-blue-950 sm:text-4xl">
            Welcome back! 👋
          </h1>

          <p className="mt-3 text-gray-700">
            Keep practicing and track your SSC preparation progress here.
          </p>
        </section>

        {/* Stats */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            icon="📚"
            title="Questions Attempted"
            value="0"
            subtitle="Start practicing"
          />

          <StatCard
            icon="✅"
            title="Correct Answers"
            value="0"
            subtitle="Keep going"
          />

          <StatCard
            icon="🎯"
            title="Accuracy"
            value="0%"
            subtitle="No attempts yet"
          />

          <StatCard
            icon="🔥"
            title="Current Streak"
            value="0"
            subtitle="Days"
          />

        </section>

        {/* Main dashboard grid */}
        <section className="mt-8 grid gap-6 lg:grid-cols-3">

          {/* Progress */}
          <div className="rounded-3xl bg-white p-7 shadow-md lg:col-span-2">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Your Progress
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  Your subject performance will appear here.
                </p>
              </div>

              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
                Coming Soon
              </span>

            </div>

            <div className="mt-8 space-y-5">

              <ProgressRow
                name="General Awareness"
                percentage={0}
              />

              <ProgressRow
                name="English"
                percentage={0}
              />

              <ProgressRow
                name="Reasoning"
                percentage={0}
              />

              <ProgressRow
                name="Quantitative Aptitude"
                percentage={0}
              />

            </div>

          </div>

          {/* Quick Actions */}
          <div className="rounded-3xl bg-blue-900 p-7 text-white shadow-md">

            <h2 className="text-2xl font-bold">
              Quick Practice
            </h2>

            <p className="mt-2 leading-6 text-blue-100">
              Jump back into your SSC preparation.
            </p>

            <Link
              href="/practice"
              className="mt-7 block rounded-xl bg-white px-5 py-4 text-center font-bold text-blue-900 transition hover:bg-blue-50"
            >
              Start Practicing →
            </Link>

          </div>

        </section>

        {/* Recent Activity */}
        <section className="mt-8 rounded-3xl bg-white p-7 shadow-md sm:p-8">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Recent Activity
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                Your latest practice sessions will appear here.
              </p>
            </div>

            <span className="hidden rounded-full bg-gray-100 px-3 py-1 text-sm font-bold text-gray-500 sm:block">
              No activity
            </span>

          </div>

          <div className="mt-8 rounded-2xl border-2 border-dashed border-gray-200 px-5 py-10 text-center">

            <div className="text-4xl">
              📖
            </div>

            <h3 className="mt-4 font-bold text-gray-900">
              No practice activity yet
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              Complete your first practice session and your activity will appear here.
            </p>

            <Link
              href="/practice"
              className="mt-5 inline-block rounded-xl bg-blue-700 px-5 py-3 font-bold text-white transition hover:bg-blue-800"
            >
              Start Your First Practice
            </Link>

          </div>

        </section>

      </div>

      {/* Footer */}
      <footer className="border-t bg-white px-5 py-8">

        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-sm text-gray-600 sm:flex-row">

          <p>
            © 2026 SSC PREP
          </p>

          <p>
            Built for SSC preparation
          </p>

        </div>

      </footer>

    </main>
  );
}


/* ================================
   Stat Card
================================ */

function StatCard({
  icon,
  title,
  value,
  subtitle,
}: {
  icon: string;
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-md">

      <div className="flex items-center justify-between">

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
          {icon}
        </div>

        <span className="text-2xl font-extrabold text-gray-900">
          {value}
        </span>

      </div>

      <h3 className="mt-5 font-bold text-gray-900">
        {title}
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        {subtitle}
      </p>

    </div>
  );
}


/* ================================
   Progress Row
================================ */

function ProgressRow({
  name,
  percentage,
}: {
  name: string;
  percentage: number;
}) {
  return (
    <div>

      <div className="flex items-center justify-between text-sm">

        <span className="font-semibold text-gray-800">
          {name}
        </span>

        <span className="font-bold text-gray-600">
          {percentage}%
        </span>

      </div>

      <div className="mt-2 h-3 overflow-hidden rounded-full bg-gray-100">

        <div
          className="h-full rounded-full bg-blue-600 transition-all"
          style={{ width: `${percentage}%` }}
        />

      </div>

    </div>
  );
}