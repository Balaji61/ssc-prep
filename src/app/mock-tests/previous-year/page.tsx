import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "SSC CGL Previous Year Mock Tests | SSC PREP",
  description:
    "Practice SSC CGL previous year mock tests with real exam questions. Choose an exam year and attempt a 100-question timed mock test.",
  keywords: [
    "SSC CGL previous year mock test",
    "SSC CGL previous year questions",
    "SSC CGL 2025 mock test",
    "SSC CGL previous year paper",
    "SSC CGL online mock test",
  ],
};

const previousYearTests = [
  {
    year: "2025",
    available: true,
  },
  {
    year: "2024",
    available: false,
  },
  {
    year: "2023",
    available: false,
  },
];

export default function PreviousYearMockPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link
            href="/"
            className="text-2xl font-extrabold text-blue-800"
          >
            SSC PREP
          </Link>

          <nav className="flex items-center gap-5 text-sm font-semibold text-gray-700">
            <Link
              href="/practice"
              className="hover:text-blue-700"
            >
              Practice
            </Link>

            <Link
              href="/mock-tests"
              className="text-blue-700"
            >
              Mock Tests
            </Link>

            <Link
              href="/dashboard"
              className="hover:text-blue-700"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-gray-50 px-5 py-14">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            SSC CGL Previous Year Mock Tests
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-700">
            Practice with questions from previous SSC CGL exams.
            Select an exam year and attempt a complete 100-question
            mock test.
          </p>
        </div>
      </section>

      {/* Year Selection */}
      <section className="px-5 pb-16">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="text-center">
              <h2 className="text-2xl font-extrabold text-gray-900">
                Choose Exam Year
              </h2>

              <p className="mt-3 text-gray-700">
                Select a year to start a previous year question-based
                mock test.
              </p>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {previousYearTests.map((test) => (
                <div
                  key={test.year}
                  className={`rounded-2xl border p-6 ${
                    test.available
                      ? "border-blue-200 bg-blue-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="text-center">
                    <div
                      className={`text-3xl font-extrabold ${
                        test.available
                          ? "text-blue-800"
                          : "text-gray-500"
                      }`}
                    >
                      SSC CGL {test.year}
                    </div>

                    {test.available ? (
                      <>
                        <p className="mt-3 font-semibold text-green-700">
                          Available
                        </p>

                        <Link
                          href={`/mock-tests/previous-year/test?year=${test.year}`}
                          className="mt-5 block rounded-xl bg-blue-700 px-5 py-3 text-center font-bold text-white transition hover:bg-blue-800"
                        >
                          Start Mock Test
                        </Link>
                      </>
                    ) : (
                      <>
                        <p className="mt-3 font-semibold text-gray-600">
                          Coming Soon
                        </p>

                        <button
                          type="button"
                          disabled
                          className="mt-5 block w-full cursor-not-allowed rounded-xl bg-gray-300 px-5 py-3 font-bold text-gray-600"
                        >
                          Coming Soon
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Test Information */}
          <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-extrabold text-gray-900">
              Previous Year Mock Test Format
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                label="Duration"
              />

              <InfoCard
                value="−0.50"
                label="Negative Marking"
              />
            </div>

            <div className="mt-6 space-y-3 text-gray-700">
              <p>
                • 25 questions from General Intelligence &amp;
                Reasoning
              </p>

              <p>
                • 25 questions from General Awareness
              </p>

              <p>
                • 25 questions from Quantitative Aptitude
              </p>

              <p>
                • 25 questions from English Comprehension
              </p>

              <p>
                • Questions are selected from the available questions
                for the selected year.
              </p>

              <p>
                • Shift selection is not required.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 text-center">
            <Link
              href="/mock-tests"
              className="font-semibold text-gray-700 hover:text-blue-700"
            >
              ← Back to Mock Tests
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white px-5 py-8">
        <div className="mx-auto max-w-6xl text-center text-sm text-gray-700">
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

          <p className="mt-3">
            Built for SSC preparation
          </p>
        </div>
      </footer>
    </main>
  );
}

function InfoCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl bg-gray-50 p-4 text-center">
      <div className="text-xl font-extrabold text-gray-900">
        {value}
      </div>

      <div className="mt-1 text-sm font-semibold text-gray-700">
        {label}
      </div>
    </div>
  );
}