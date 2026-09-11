"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";

type ReviewItem = {
  question_id: string;
  subject: string;
  category: string;
  topic: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  selected_option: string | null;
  correct_option: string;
  explanation: string | null;
  status:
    | "correct"
    | "wrong"
    | "unanswered";
  marked: boolean;
};

type Result = {
  totalQuestions: number;
  attempted: number;
  correct: number;
  wrong: number;
  unanswered: number;
  positiveMarks: number;
  negativeMarks: number;
  finalScore: number;
  maxMarks: number;
  percentage: number;
  accuracy: number;
  review: ReviewItem[];
};

const sections = [
  "All",
  "Reasoning",
  "General Awareness",
  "Quantitative Aptitude",
  "English",
];

const statuses = [
  "All",
  "Correct",
  "Wrong",
  "Unanswered",
];

export default function MockTestReviewPage() {
  const [result, setResult] =
    useState<Result | null>(null);

  const [sectionFilter, setSectionFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const savedResult =
      sessionStorage.getItem(
        "ssc_mock_test_result"
      );

    if (savedResult) {
      try {
        const parsedResult =
          JSON.parse(savedResult);

        setResult(parsedResult);
      } catch {
        console.error(
          "Unable to read saved mock test result."
        );
      }
    }

    setLoading(false);
  }, []);

  // ==========================================================
  // FILTER QUESTIONS
  // ==========================================================

  const filteredQuestions =
    useMemo(() => {
      if (!result) {
        return [];
      }

      return result.review.filter(
        (question) => {
          const sectionMatches =
            sectionFilter ===
              "All" ||
            question.subject ===
              getSubjectValue(
                sectionFilter
              );

          const statusMatches =
            statusFilter ===
              "All" ||
            question.status ===
              statusFilter.toLowerCase();

          return (
            sectionMatches &&
            statusMatches
          );
        }
      );
    }, [
      result,
      sectionFilter,
      statusFilter,
    ]);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="text-4xl">
            📖
          </div>

          <h1 className="mt-4 text-xl font-bold text-gray-900">
            Loading Review
          </h1>

          <p className="mt-2 text-gray-600">
            Preparing your answers...
          </p>
        </div>
      </main>
    );
  }

  // ==========================================================
  // NO RESULT
  // ==========================================================

  if (!result) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6">

        <div className="max-w-lg rounded-2xl bg-white p-8 text-center shadow-lg">

          <div className="text-5xl">
            📋
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            No Mock Test Review Found
          </h1>

          <p className="mt-3 text-gray-600">
            Complete a mock test first to see the detailed review.
          </p>

          <Link
            href="/mock-tests"
            className="mt-6 inline-block rounded-xl bg-blue-700 px-6 py-3 font-bold text-white hover:bg-blue-800"
          >
            Go to Mock Tests
          </Link>

        </div>

      </main>
    );
  }

  // ==========================================================
  // REVIEW PAGE
  // ==========================================================

  return (
    <main className="min-h-screen bg-gray-100">

      {/* HEADER */}

      <header className="sticky top-0 z-50 border-b bg-white shadow-sm">

        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 py-4 sm:px-6">

          <div>
            <Link
              href="/mock-tests/test"
              className="text-xl font-extrabold text-blue-800 sm:text-2xl"
            >
              SSC PREP
            </Link>

            <p className="text-xs font-semibold text-gray-500 sm:text-sm">
              Mock Test Review
            </p>
          </div>

          <Link
            href="/mock-tests/test"
            className="rounded-xl border border-blue-700 px-4 py-2 text-sm font-bold text-blue-700 hover:bg-blue-50"
          >
            ← Back to Results
          </Link>

        </div>

      </header>

      {/* PAGE */}

      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6">

        {/* RESULT SUMMARY */}

        <section className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                Detailed Review
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Review all 100 questions from your mock test.
              </p>
            </div>

            <div className="rounded-2xl bg-blue-50 px-6 py-4 text-center">

              <div className="text-xs font-bold uppercase tracking-wide text-blue-600">
                Final Score
              </div>

              <div className="mt-1 text-3xl font-extrabold text-blue-900">
                {result.finalScore.toFixed(2)}
                <span className="text-base text-gray-500">
                  {" "}
                  / 200
                </span>
              </div>

            </div>

          </div>

          {/* SUMMARY CARDS */}

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">

            <MiniStat
              label="Correct"
              value={result.correct}
              className="bg-green-50 text-green-700"
            />

            <MiniStat
              label="Wrong"
              value={result.wrong}
              className="bg-red-50 text-red-700"
            />

            <MiniStat
              label="Unanswered"
              value={result.unanswered}
              className="bg-gray-100 text-gray-700"
            />

            <MiniStat
              label="Attempted"
              value={result.attempted}
              className="bg-blue-50 text-blue-700"
            />

          </div>

        </section>

        {/* FILTERS */}

        <section className="mt-5 rounded-2xl bg-white p-5 shadow-sm">

          <h2 className="font-bold text-gray-900">
            Filter Review
          </h2>

          {/* SECTION FILTER */}

          <div className="mt-4">

            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">
              Section
            </p>

            <div className="flex gap-2 overflow-x-auto pb-2">

              {sections.map(
                (section) => (
                  <button
                    key={section}
                    type="button"
                    onClick={() =>
                      setSectionFilter(
                        section
                      )
                    }
                    className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-bold transition ${
                      sectionFilter ===
                      section
                        ? "bg-blue-700 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {section}
                  </button>
                )
              )}

            </div>

          </div>

          {/* STATUS FILTER */}

          <div className="mt-4">

            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">
              Answer Status
            </p>

            <div className="flex gap-2 overflow-x-auto pb-2">

              {statuses.map(
                (status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() =>
                      setStatusFilter(
                        status
                      )
                    }
                    className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-bold transition ${
                      statusFilter ===
                      status
                        ? "bg-blue-700 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status}
                  </button>
                )
              )}

            </div>

          </div>

          <p className="mt-4 text-sm text-gray-500">
            Showing{" "}
            <strong>
              {filteredQuestions.length}
            </strong>{" "}
            questions
          </p>

        </section>

        {/* QUESTIONS */}

        <div className="mt-5 space-y-5">

          {filteredQuestions.map(
            (
              question,
              index
            ) => (
              <ReviewQuestion
                key={
                  question.question_id
                }
                question={
                  question
                }
                displayNumber={
                  result.review.indexOf(
                    question
                  ) + 1
                }
              />
            )
          )}

        </div>

        {/* NO FILTER RESULTS */}

        {filteredQuestions.length ===
          0 && (
          <div className="mt-5 rounded-2xl bg-white p-10 text-center shadow-sm">

            <div className="text-4xl">
              🔍
            </div>

            <h2 className="mt-3 text-xl font-bold text-gray-900">
              No questions found
            </h2>

            <p className="mt-2 text-gray-500">
              Try another filter.
            </p>

          </div>
        )}

      </div>

    </main>
  );
}

// ==========================================================
// REVIEW QUESTION
// ==========================================================

function ReviewQuestion({
  question,
  displayNumber,
}: {
  question: ReviewItem;
  displayNumber: number;
}) {
  const options = [
    [
      "A",
      question.option_a,
    ],
    [
      "B",
      question.option_b,
    ],
    [
      "C",
      question.option_c,
    ],
    [
      "D",
      question.option_d,
    ],
  ];

  return (
    <article
      className={`overflow-hidden rounded-2xl border-l-4 bg-white shadow-sm ${
        question.status ===
        "correct"
          ? "border-green-500"
          : question.status ===
            "wrong"
          ? "border-red-500"
          : "border-gray-400"
      }`}
    >

      {/* QUESTION HEADER */}

      <div className="border-b bg-gray-50 px-5 py-4">

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex flex-wrap items-center gap-2">

            <span className="rounded-lg bg-blue-100 px-3 py-1 text-sm font-extrabold text-blue-800">
              Question {displayNumber}
            </span>

            <span className="rounded-lg bg-gray-200 px-3 py-1 text-xs font-bold text-gray-700">
              ID: {question.question_id}
            </span>

            {question.marked && (
              <span className="rounded-lg bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-800">
                ★ Marked
              </span>
            )}

          </div>

          <StatusBadge
            status={
              question.status
            }
          />

        </div>

        <p className="mt-2 text-xs font-semibold text-gray-500">
          {getDisplaySubject(
            question.subject
          )}
        </p>

      </div>

      {/* QUESTION BODY */}

      <div className="p-5 sm:p-7">

        <p className="text-base font-semibold leading-7 text-gray-900 sm:text-lg sm:leading-8">
          {question.question_text}
        </p>

        {/* OPTIONS */}

        <div className="mt-6 space-y-3">

          {options.map(
            ([letter, text]) => {

              const isSelected =
                question.selected_option?.toUpperCase() ===
                letter;

              const isCorrect =
                question.correct_option?.toUpperCase() ===
                letter;

              let className =
                "border-gray-200 bg-white";

              if (isCorrect) {
                className =
                  "border-green-500 bg-green-50";
              } else if (
                isSelected
              ) {
                className =
                  "border-red-500 bg-red-50";
              }

              return (
                <div
                  key={letter}
                  className={`rounded-xl border-2 p-4 ${className}`}
                >

                  <div className="flex items-start gap-3">

                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-extrabold ${
                        isCorrect
                          ? "border-green-600 bg-green-600 text-white"
                          : isSelected
                          ? "border-red-600 bg-red-600 text-white"
                          : "border-gray-300 text-gray-600"
                      }`}
                    >
                      {letter}
                    </span>

                    <div className="flex-1">

                      <p className="font-medium text-gray-800">
                        {text}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">

                        {isSelected && (
                          <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-bold text-red-700">
                            Your Answer
                          </span>
                        )}

                        {isCorrect && (
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                            Correct Answer
                          </span>
                        )}

                      </div>

                    </div>

                  </div>

                </div>
              );
            }
          )}

        </div>

        {/* UNANSWERED */}

        {question.status ===
          "unanswered" && (
          <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">

            <p className="text-sm font-bold text-gray-600">
              Your Answer
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Not Answered
            </p>

          </div>
        )}

        {/* EXPLANATION */}

        {question.explanation && (
          <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5">

            <h3 className="font-bold text-blue-900">
              Explanation
            </h3>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-blue-950">
              {question.explanation}
            </p>

          </div>
        )}

      </div>

    </article>
  );
}

// ==========================================================
// STATUS BADGE
// ==========================================================

function StatusBadge({
  status,
}: {
  status:
    | "correct"
    | "wrong"
    | "unanswered";
}) {
  if (status === "correct") {
    return (
      <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-extrabold text-green-700">
        ✓ Correct
      </span>
    );
  }

  if (status === "wrong") {
    return (
      <span className="w-fit rounded-full bg-red-100 px-3 py-1 text-xs font-extrabold text-red-700">
        ✕ Wrong
      </span>
    );
  }

  return (
    <span className="w-fit rounded-full bg-gray-200 px-3 py-1 text-xs font-extrabold text-gray-700">
      — Unanswered
    </span>
  );
}

// ==========================================================
// MINI STAT
// ==========================================================

function MiniStat({
  label,
  value,
  className,
}: {
  label: string;
  value: number;
  className: string;
}) {
  return (
    <div
      className={`rounded-xl p-4 ${className}`}
    >
      <div className="text-2xl font-extrabold">
        {value}
      </div>

      <div className="mt-1 text-xs font-bold">
        {label}
      </div>
    </div>
  );
}

// ==========================================================
// SUBJECT HELPERS
// ==========================================================

function getSubjectValue(
  section: string
) {
  if (section === "Reasoning") {
    return "reasoning";
  }

  if (
    section ===
    "General Awareness"
  ) {
    return "General Studies";
  }

  return section;
}

function getDisplaySubject(
  subject: string
) {
  if (subject === "reasoning") {
    return "Reasoning";
  }

  if (
    subject ===
    "General Studies"
  ) {
    return "General Awareness";
  }

  return subject;
}