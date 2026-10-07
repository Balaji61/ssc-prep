"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type Question = {
  question_id: string;
  exam_name: string;
  subject: string;
  category: string | null;
  topic: string | null;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  question_number: number;
};

const OPTIONS = [
  { key: "A", field: "option_a" },
  { key: "B", field: "option_b" },
  { key: "C", field: "option_c" },
  { key: "D", field: "option_d" },
] as const;

export default function PreviousYearPracticeQuestionsPage() {
  const searchParams = useSearchParams();

  const year = searchParams.get("year") || "2025";
  const subject = searchParams.get("subject") || "";

  const [availableCounts, setAvailableCounts] =
    useState<number[]>([]);

  const [selectedCount, setSelectedCount] =
    useState<number | null>(null);

  const [questions, setQuestions] =
    useState<Question[]>([]);

  const [answers, setAnswers] = useState<
    Record<string, string>
  >({});

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [loadingCounts, setLoadingCounts] =
    useState(true);

  const [loadingQuestions, setLoadingQuestions] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  const [started, setStarted] = useState(false);

  useEffect(() => {
    async function loadCounts() {
      try {
        setLoadingCounts(true);
        setError("");

        const response = await fetch(
          `/api/practice/previous-year?year=${encodeURIComponent(
            year
          )}&subject=${encodeURIComponent(subject)}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to load question counts."
          );
        }

        setAvailableCounts(
          data.available_counts || []
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load question counts."
        );
      } finally {
        setLoadingCounts(false);
      }
    }

    if (subject) {
      loadCounts();
    }
  }, [year, subject]);

  const currentQuestion = questions[currentIndex];

  const answeredCount = useMemo(() => {
    return Object.keys(answers).length;
  }, [answers]);

  async function startPractice(count: number) {
    try {
      setLoadingQuestions(true);
      setError("");

      const response = await fetch(
        `/api/practice/previous-year?year=${encodeURIComponent(
          year
        )}&subject=${encodeURIComponent(
          subject
        )}&count=${count}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to load questions."
        );
      }

      setQuestions(data.questions || []);
      setSelectedCount(count);
      setCurrentIndex(0);
      setAnswers({});
      setStarted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load questions."
      );
    } finally {
      setLoadingQuestions(false);
    }
  }

  function selectAnswer(
    questionId: string,
    option: string
  ) {
    setAnswers((previous) => {
      const next = { ...previous };

      if (next[questionId] === option) {
        delete next[questionId];
      } else {
        next[questionId] = option;
      }

      return next;
    });
  }

  function goPrevious() {
    if (currentIndex > 0) {
      setCurrentIndex((index) => index - 1);
    }
  }

  function goNext() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((index) => index + 1);
    }
  }

  async function submitPractice() {
    if (submitting) return;

    const confirmed = window.confirm(
      "Are you sure you want to submit this practice test?"
    );

    if (!confirmed) return;

    try {
      setSubmitting(true);
      setError("");

      const questionIds = questions.map(
        (question) => question.question_id
      );

      const response = await fetch(
        "/api/practice/previous-year",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            year,
            subject,
            answers,
            questionIds,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to submit practice."
        );
      }

      sessionStorage.setItem(
        "ssc_previous_year_practice_result",
        JSON.stringify({
          ...data,
          year,
          subject,
          count: selectedCount,
        })
      );

      window.location.href =
        `/practice/previous-year/review?year=${encodeURIComponent(
          year
        )}&subject=${encodeURIComponent(subject)}`;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit practice."
      );

      setSubmitting(false);
    }
  }

  const subjectDisplay =
    subject === "General Studies"
      ? "General Awareness"
      : subject;

  if (!subject) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold">
            Subject not selected
          </h1>

          <Link
            href="/practice/previous-year"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white"
          >
            Select Subject
          </Link>
        </div>
      </main>
    );
  }

  if (!started) {
    return (
      <main className="min-h-screen bg-gray-50">
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link
              href="/practice/previous-year"
              className="text-xl font-bold text-gray-900"
            >
              SSC PREP
            </Link>

            <Link
              href="/practice/previous-year"
              className="rounded-lg border px-4 py-2 text-sm font-medium"
            >
              Back
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-4xl px-4 py-10">
          <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-8">
              <p className="text-sm font-semibold text-blue-600">
                SSC CGL {year}
              </p>

              <h1 className="mt-2 text-3xl font-bold text-gray-900">
                {subjectDisplay}
              </h1>

              <p className="mt-2 text-gray-600">
                Choose how many previous year questions
                you want to practice.
              </p>
            </div>

            {loadingCounts ? (
              <div className="py-10 text-center text-gray-600">
                Checking available questions...
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[10, 25, 30].map((count) => {
                    const available =
                      availableCounts.includes(count);

                    return (
                      <button
                        key={count}
                        disabled={!available || loadingQuestions}
                        onClick={() =>
                          available &&
                          startPractice(count)
                        }
                        className={`rounded-xl border p-6 text-center transition ${
                          available
                            ? "border-gray-200 bg-white hover:border-blue-500 hover:bg-blue-50"
                            : "cursor-not-allowed border-gray-200 bg-gray-100 opacity-50"
                        }`}
                      >
                        <div className="text-3xl font-bold text-gray-900">
                          {count}
                        </div>

                        <div className="mt-1 text-sm text-gray-600">
                          Questions
                        </div>

                        <div className="mt-3 text-xs font-semibold">
                          {available
                            ? "Available"
                            : "Not enough questions"}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
                  <strong>No negative marking.</strong>{" "}
                  This practice mode is for learning and
                  revision.
                </div>
              </>
            )}

            {error && (
              <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-600">
                SSC CGL {year}
              </p>

              <h1 className="text-lg font-bold text-gray-900">
                {subjectDisplay}
              </h1>
            </div>

            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900">
                {answeredCount} / {questions.length}
              </div>

              <div className="text-xs text-gray-500">
                Answered
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6">
        {/* Progress */}
        <div className="mb-5">
          <div className="mb-2 flex justify-between text-sm text-gray-600">
            <span>
              Question {currentIndex + 1} of{" "}
              {questions.length}
            </span>

            <span>
              {Math.round(
                ((currentIndex + 1) /
                  questions.length) *
                  100
              )}
              %
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-blue-600 transition-all"
              style={{
                width: `${
                  ((currentIndex + 1) /
                    questions.length) *
                  100
                }%`,
              }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
              Q{currentQuestion.question_number}
            </span>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {currentQuestion.question_id}
            </span>
          </div>

          <h2 className="text-lg font-semibold leading-8 text-gray-900">
            {currentQuestion.question_text}
          </h2>

          <div className="mt-7 space-y-3">
            {OPTIONS.map((option) => {
              const value =
                currentQuestion[
                  option.field
                ];

              const selected =
                answers[
                  currentQuestion.question_id
                ] === option.key;

              return (
                <button
                  key={option.key}
                  onClick={() =>
                    selectAnswer(
                      currentQuestion.question_id,
                      option.key
                    )
                  }
                  className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition ${
                    selected
                      ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                      : "border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${
                      selected
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-gray-300 text-gray-700"
                    }`}
                  >
                    {option.key}
                  </span>

                  <span className="pt-1 text-gray-800">
                    {value}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            onClick={goPrevious}
            disabled={currentIndex === 0}
            className="rounded-lg border bg-white px-5 py-3 font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          {currentIndex === questions.length - 1 ? (
            <button
              onClick={submitPractice}
              disabled={submitting}
              className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-60"
            >
              {submitting
                ? "Submitting..."
                : "Submit Practice"}
            </button>
          ) : (
            <button
              onClick={goNext}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Next
            </button>
          )}
        </div>

        {/* Question Palette */}
        <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-bold text-gray-900">
            Questions
          </h3>

          <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
            {questions.map((question, index) => {
              const answered =
                Boolean(
                  answers[question.question_id]
                );

              const current =
                index === currentIndex;

              return (
                <button
                  key={question.question_id}
                  onClick={() =>
                    setCurrentIndex(index)
                  }
                  className={`h-10 rounded-lg border text-sm font-semibold ${
                    current
                      ? "border-blue-600 bg-blue-600 text-white"
                      : answered
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-200 bg-gray-50 text-gray-700"
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="mt-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>
    </main>
  );
}