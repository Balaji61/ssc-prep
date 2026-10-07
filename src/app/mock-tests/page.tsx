import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "SSC CGL Mock Tests & Previous Year Mock Tests | SSC PREP",
  description:
    "Practice SSC CGL full mock tests and previous year mock tests with 100 questions, 200 marks, timed sections, and negative marking.",
  keywords: [
    "SSC CGL mock test",
    "SSC CGL previous year mock test",
    "SSC CGL 2025 mock test",
    "SSC CGL online mock test",
    "SSC CGL practice test",
    "SSC CGL previous year questions",
  ],
};

export default function MockTestsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-2xl font-extrabold text-blue-800">
            SSC PREP
          </Link>

          <nav className="flex items-center gap-5 text-sm font-semibold text-gray-700">
            <Link href="/practice" className="hover:text-blue-700">
              Practice
            </Link>

            <Link href="/mock-tests" className="text-blue-700">
              Mock Tests
            </Link>

            <Link href="/dashboard" className="hover:text-blue-700">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-gray-50 px-5 py-14">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            SSC CGL Mock Tests
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-600">
            Practice SSC CGL with full-length mock tests and previous year
            question-based mock tests.
          </p>
        </div>
      </section>

      {/* Mock Test Cards */}
      <section className="px-5 pb-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          {/* Full Mock Test */}
          <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
            <div className="mb-6">
              <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700">
                Full Mock Test
              </span>

              <h2 className="mt-4 text-2xl font-extrabold text-gray-900">
                SSC CGL Tier-I Full Mock Test
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                Take a complete SSC CGL Tier-I style mock test with all four
                sections and timed section-wise practice.
              </p>
            </div>

            {/* Overview */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <InfoCard value="100" label="Questions" />
              <InfoCard value="200" label="Marks" />
              <InfoCard value="60 min" label="Time" />
              <InfoCard value="−0.50" label="Negative" />
            </div>

            {/* Sections */}
            <div className="mt-7">
              <h3 className="text-lg font-bold text-gray-900">
                Sections
              </h3>

              <div className="mt-3 space-y-3">
                <SectionRow
                  title="General Intelligence & Reasoning"
                  questions="25 Questions"
                  time="15 min"
                />

                <SectionRow
                  title="General Awareness"
                  questions="25 Questions"
                  time="15 min"
                />

                <SectionRow
                  title="Quantitative Aptitude"
                  questions="25 Questions"
                  time="15 min"
                />

                <SectionRow
                  title="English Comprehension"
                  questions="25 Questions"
                  time="15 min"
                />
              </div>
            </div>

            {/* Rules */}
            <div className="mt-7">
              <h3 className="text-lg font-bold text-gray-900">
                Important Rules
              </h3>

              <div className="mt-3 space-y-2">
                <Rule text="Each section has a 15-minute time limit." />
                <Rule text="Each correct answer carries 2 marks." />
                <Rule text="0.50 marks will be deducted for each wrong answer." />
                <Rule text="You can mark questions for review." />
                <Rule text="Answers are evaluated after submission." />
              </div>
            </div>

            {/* Start */}
            <div className="mt-8">
              <Link
                href="/mock-tests/test"
                className="block w-full rounded-xl bg-blue-700 px-6 py-3 text-center font-bold text-white transition hover:bg-blue-800"
              >
                Start Full Mock Test
              </Link>
            </div>
          </div>

          {/* Previous Year Mock */}
          <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
            <div className="mb-6">
              <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                Previous Year Questions
              </span>

              <h2 className="mt-4 text-2xl font-extrabold text-gray-900">
                SSC CGL Previous Year Mock Tests
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                Practice questions collected from previous SSC CGL exams.
                Select an exam year and attempt a complete 100-question mock
                test.
              </p>
            </div>

            {/* Overview */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <InfoCard value="100" label="Questions" />
              <InfoCard value="200" label="Marks" />
              <InfoCard value="60 min" label="Time" />
              <InfoCard value="−0.50" label="Negative" />
            </div>

            {/* Sections */}
            <div className="mt-7">
              <h3 className="text-lg font-bold text-gray-900">
                Sections
              </h3>

              <div className="mt-3 space-y-3">
                <SectionRow
                  title="General Intelligence & Reasoning"
                  questions="25 Questions"
                  time="15 min"
                />

                <SectionRow
                  title="General Awareness"
                  questions="25 Questions"
                  time="15 min"
                />

                <SectionRow
                  title="Quantitative Aptitude"
                  questions="25 Questions"
                  time="15 min"
                />

                <SectionRow
                  title="English Comprehension"
                  questions="25 Questions"
                  time="15 min"
                />
              </div>
            </div>

            {/* Information */}
            <div className="mt-7 rounded-2xl bg-green-50 p-5">
              <h3 className="font-bold text-green-900">
                Previous Year Question Pool
              </h3>

              <p className="mt-2 text-sm leading-6 text-green-800">
                SSC CGL 2025 is currently available. 

                
              </p>
               <p className="mt-2 text-sm leading-6 text-green-800">
                
                
                Questions are selectedfrom the available questions for the selected year.
              </p>

              <p className="mt-2 text-sm leading-6 text-green-800">
                More previous exam years can
                be added later.
              </p>
            </div>

            {/* Start */}
            <div className="mt-8">
              <Link
                href="/mock-tests/previous-year"
                className="block w-full rounded-xl bg-green-700 px-6 py-3 text-center font-bold text-white transition hover:bg-green-800"
              >
                Previous Year Mock Tests
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <section className="px-5 pb-12">
        <div className="mx-auto max-w-6xl text-center">
          <Link
            href="/"
            className="font-semibold text-gray-600 hover:text-blue-700"
          >
            ← Back to Home
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white px-5 py-8">
        <div className="mx-auto max-w-6xl text-center text-sm text-gray-600">
          <div className="flex justify-center gap-5">
            <Link
              href="/feedback"
              className="font-semibold hover:text-blue-700"
            >
              Feedback
            </Link>

            <Link
              href="/contact"
              className="font-semibold hover:text-blue-700"
            >
              Contact
            </Link>
          </div>

          <p className="mt-3">Built for SSC preparation</p>
        </div>
      </footer>
    </main>
  );
}

/* ---------------- Helper Components ---------------- */

function InfoCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl bg-gray-50 p-4 text-center">
      <div className="text-xl font-extrabold text-gray-900">{value}</div>
      <div className="mt-1 text-xs font-semibold text-gray-500">
        {label}
      </div>
    </div>
  );
}

function SectionRow({
  title,
  questions,
  time,
}: {
  title: string;
  questions: string;
  time: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">
      <div>
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="mt-1 text-sm text-gray-500">{questions}</p>
      </div>

      <span className="shrink-0 rounded-full bg-white px-3 py-1 text-sm font-bold text-gray-700">
        {time}
      </span>
    </div>
  );
}

function Rule({ text }: { text: string }) {
  return (
    <div className="flex gap-3 text-sm leading-6 text-gray-600">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
      <span>{text}</span>
    </div>
  );
}