import Link from "next/link";

export default function MockTestsPage() {
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

          <nav className="flex items-center gap-5 text-sm font-semibold text-gray-700 sm:gap-7 sm:text-base">

            <Link
              href="/practice"
              className="transition hover:text-blue-700"
            >
              Practice
            </Link>

            <Link
              href="/dashboard"
              className="transition hover:text-blue-700"
            >
              Dashboard
            </Link>

          </nav>

        </div>
      </header>

      {/* Main */}
      <div className="mx-auto max-w-5xl px-5 py-12 sm:py-16">

        {/* Hero */}
        <div className="text-center">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-100 text-5xl">
            📝
          </div>

          <p className="mt-6 font-bold tracking-wide text-blue-700">
            SSC CGL TIER-I
          </p>

          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-blue-950 sm:text-5xl">
            Full Mock Test
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-700">
            Attempt a complete SSC CGL Tier-I style examination
            with sectional timing, negative marking and
            detailed performance analysis.
          </p>

        </div>

        {/* Exam Overview */}
        <div className="mt-10 rounded-3xl bg-white p-6 shadow-lg sm:p-8">

          <h2 className="text-center text-2xl font-extrabold text-gray-900">
            Exam Pattern
          </h2>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <InfoCard
              value="100"
              label="Questions"
            />

            <InfoCard
              value="200"
              label="Maximum Marks"
            />

            <InfoCard
              value="60 min"
              label="Total Time"
            />

            <InfoCard
              value="−0.50"
              label="Negative Mark"
            />

          </div>

        </div>

        {/* Sections */}
        <div className="mt-8 rounded-3xl bg-white p-6 shadow-lg sm:p-8">

          <h2 className="text-2xl font-extrabold text-gray-900">
            Sections
          </h2>

          <p className="mt-2 text-gray-600">
            Each section contains 25 questions and has its own
            15-minute timer.
          </p>

          <div className="mt-6 space-y-3">

            <SectionRow
              number="1"
              title="General Intelligence & Reasoning"
              questions="25 Questions"
              time="15 Minutes"
            />

            <SectionRow
              number="2"
              title="General Awareness"
              questions="25 Questions"
              time="15 Minutes"
            />

            <SectionRow
              number="3"
              title="Quantitative Aptitude"
              questions="25 Questions"
              time="15 Minutes"
            />

            <SectionRow
              number="4"
              title="English Comprehension"
              questions="25 Questions"
              time="15 Minutes"
            />

          </div>

        </div>

        {/* Important Rules */}
        <div className="mt-8 rounded-3xl border border-blue-200 bg-blue-50 p-6 sm:p-8">

          <h2 className="text-2xl font-extrabold text-blue-950">
            Important Rules
          </h2>

          <div className="mt-5 space-y-4">

            <Rule
              icon="⏱️"
              text="Each section has a separate 15-minute timer."
            />

            <Rule
              icon="🔒"
              text="A section becomes locked when its 15-minute time expires."
            />

            <Rule
              icon="➡️"
              text="The test automatically moves to the next section when time expires."
            />

            <Rule
              icon="🚫"
              text="You cannot return to a previous section after it is locked."
            />

            <Rule
              icon="➕"
              text="Each correct answer gives 2 marks."
            />

            <Rule
              icon="➖"
              text="Each wrong answer carries a penalty of 0.50 marks."
            />

            <Rule
              icon="0️⃣"
              text="Unanswered questions receive 0 marks."
            />

            <Rule
              icon="🔖"
              text="You can mark questions for review and revisit them while the current section is active."
            />

          </div>

        </div>

        {/* Start */}
        <div className="mt-10 text-center">

          <Link
             href="/mock-tests/test"
            className="inline-flex w-full max-w-md items-center justify-center rounded-2xl bg-blue-700 px-8 py-4 text-lg font-extrabold text-white shadow-lg transition hover:bg-blue-800"
          >
            Start Mock Test →
          </Link>

          <p className="mt-4 text-sm font-medium text-gray-500">
            You will see the detailed instructions before the test begins.
          </p>

        </div>

        {/* Back */}
        <div className="mt-8 text-center">

          <Link
            href="/"
            className="font-semibold text-gray-600 transition hover:text-blue-700"
          >
            ← Back to Home
          </Link>

        </div>

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
   INFO CARD
================================ */

function InfoCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl bg-gray-50 p-5 text-center">

      <div className="text-2xl font-extrabold text-blue-700">
        {value}
      </div>

      <p className="mt-1 text-sm font-semibold text-gray-600">
        {label}
      </p>

    </div>
  );
}


/* ================================
   SECTION ROW
================================ */

function SectionRow({
  number,
  title,
  questions,
  time,
}: {
  number: string;
  title: string;
  questions: string;
  time: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-700 font-bold text-white">
        {number}
      </div>

      <div className="min-w-0 flex-1">

        <h3 className="font-bold text-gray-900">
          {title}
        </h3>

        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium text-gray-600">
          <span>{questions}</span>
          <span>•</span>
          <span>{time}</span>
        </div>

      </div>

    </div>
  );
}


/* ================================
   RULE
================================ */

function Rule({
  icon,
  text,
}: {
  icon: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3">

      <span className="mt-0.5 text-xl">
        {icon}
      </span>

      <p className="font-medium leading-6 text-gray-800">
        {text}
      </p>

    </div>
  );
}