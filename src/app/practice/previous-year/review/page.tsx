"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ReviewQuestion = {
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
  selected_option: string | null;
  correct_option: string;
  explanation: string | null;
  status: "correct" | "wrong" | "unanswered";
};

type Result = {
  year: string;
  subject: string;
  count: number;
  total_questions: number;
  attempted: number;
  correct: number;
  wrong: number;
  unanswered: number;
  percentage: number;
  accuracy: number;
  review: ReviewQuestion[];
};

const optionLabels = {
  A: "option_a",
  B: "option_b",
  C: "option_c",
  D: "option_d",
} as const;

export default function PreviousYearPracticeReviewPage() {
  const [result, setResult] =
    useState<Result | null>(null);

  const [statusFilter, setStatusFilter] =
    useState<
      "all" | "correct" | "wrong" | "unanswered"
    >("all");

  useEffect(() => {
    const stored = sessionStorage.getItem(
      "ssc_previous_year_practice_result"
    );

    if (!stored) return;

    try {
      setResult(JSON.parse(stored));
    } catch {
      setResult(null);
    }
  }, []);

  const filteredQuestions = useMemo(() => {
    if (!result) return [];

    if (statusFilter === "all") {
      return result.review;
    }

    return result.review.filter(
      (question) =>
        question.status === statusFilter
    );
  }, [result, statusFilter]);

  if (!result) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            No Practice Result Found
          </h1>

          <p className="mt-2 text-gray-600">
            Complete a Previous Year Practice test first.
          </p>

          <Link
            href="/practice/previous-year"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white"
          >
            Back to Previous Year Practice
          </Link>
        </div>
      </main>
    );
  }

  function optionText(
    question: ReviewQuestion,
    option: string | null
  ) {
    if (!option) return "Not answered";

    const normalized =
      option.toUpperCase() as keyof typeof optionLabels;

    const field = optionLabels[normalized];

    return question[field];
  }

  function statusLabel(
    status: ReviewQuestion["status"]
  ) {
    if (status === "correct") return "Correct";
    if (status === "wrong") return "Wrong";
    return "Unanswered";
  }

  function statusClass(
    status: ReviewQuestion["status"]
  ) {
    if (status === "correct") {
      return "bg-green-100 text-green-700";
    }

    if (status === "wrong") {
      return "bg-red-100 text-red-700";
    }

    return "bg-gray-100 text-gray-700";
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link
            href="/practice"
            className="text-xl font-bold text-gray-900"
          >
            SSC PREP
          </Link>

          <Link
            href="/practice/previous-year"
            className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back to Practice
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Result heading */}
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
            ✓
          </div>

          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Practice Completed
          </h1>

          <p className="mt-2 text-gray-600">
            SSC CGL {result.year} •{" "}
            {result.subject === "General Studies"
              ? "General Awareness"
              : result.subject}
          </p>
        </div>

        {/* Result cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl bg-white p-5 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              Total
            </p>
            <p className="mt-1 text-2xl font-bold">
              {result.total_questions}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              Attempted
            </p>
            <p className="mt-1 text-2xl font-bold">
              {result.attempted}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              Correct
            </p>
            <p className="mt-1 text-2xl font-bold text-green-600">
              {result.correct}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              Wrong
            </p>
            <p className="mt-1 text-2xl font-bold text-red-600">
              {result.wrong}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              Unanswered
            </p>
            <p className="mt-1 text-2xl font-bold text-gray-600">
              {result.unanswered}
            </p>
          </div>
        </div>

        {/* Score */}
        <div className="mt-6 rounded-2xl bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Accuracy
          </p>

          <p className="mt-1 text-4xl font-bold text-blue-600">
            {result.accuracy.toFixed(1)}%
          </p>

          <p className="mt-2 text-sm text-gray-500">
            {result.correct} correct out of{" "}
            {result.attempted} attempted
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/practice/previous-year"
            className="rounded-lg border bg-white px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Back to Previous Year Practice
          </Link>

          <Link
            href={`/practice/previous-year/questions?year=${encodeURIComponent(
              result.year
            )}&subject=${encodeURIComponent(
              result.subject
            )}`}
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Practice Again
          </Link>
        </div>

        {/* Review */}
        <section className="mt-10">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Review Answers
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                Check your answers and explanations.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["all", "All"],
                  ["correct", "Correct"],
                  ["wrong", "Wrong"],
                  ["unanswered", "Unanswered"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() =>
                    setStatusFilter(value)
                  }
                  className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                    statusFilter === value
                      ? "bg-blue-600 text-white"
                      : "border bg-white text-gray-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {filteredQuestions.map(
              (question, index) => (
                <article
                  key={question.question_id}
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                        Question {index + 1}
                      </span>

                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {question.question_id}
                      </span>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass(
                        question.status
                      )}`}
                    >
                      {statusLabel(question.status)}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-semibold leading-8 text-gray-900">
                    {question.question_text}
                  </h3>

                  <div className="mt-5 space-y-2">
                    {(["A", "B", "C", "D"] as const).map(
                      (option) => {
                        const text =
                          question[
                            optionLabels[option]
                          ];

                        const isCorrect =
                          question.correct_option.toUpperCase() ===
                          option;

                        const isSelected =
                          question.selected_option?.toUpperCase() ===
                          option;

                        let classes =
                          "border-gray-200 bg-white";

                        if (isCorrect) {
                          classes =
                            "border-green-500 bg-green-50";
                        } else if (
                          isSelected &&
                          !isCorrect
                        ) {
                          classes =
                            "border-red-500 bg-red-50";
                        }

                        return (
                          <div
                            key={option}
                            className={`rounded-xl border p-4 ${classes}`}
                          >
                            <div className="flex gap-3">
                              <span className="font-bold">
                                {option}.
                              </span>

                              <span className="text-gray-800">
                                {text}
                              </span>
                            </div>

                            <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
                              {isSelected && (
                                <span className="rounded-full bg-gray-200 px-2 py-1">
                                  Your Answer
                                </span>
                              )}

                              {isCorrect && (
                                <span className="rounded-full bg-green-200 px-2 py-1 text-green-800">
                                  Correct Answer
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-xs font-semibold uppercase text-gray-500">
                        Your Answer
                      </p>

                      <p className="mt-1 font-semibold text-gray-900">
                        {question.selected_option
                          ? `${question.selected_option.toUpperCase()}. ${optionText(
                              question,
                              question.selected_option
                            )}`
                          : "Not answered"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-green-50 p-4">
                      <p className="text-xs font-semibold uppercase text-green-700">
                        Correct Answer
                      </p>

                      <p className="mt-1 font-semibold text-green-800">
                        {question.correct_option.toUpperCase()}.{" "}
                        {optionText(
                          question,
                          question.correct_option
                        )}
                      </p>
                    </div>
                  </div>

                  {question.explanation && (
                    <div className="mt-5 rounded-xl bg-blue-50 p-4">
                      <p className="text-sm font-bold text-blue-900">
                        Explanation
                      </p>

                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-blue-900">
                        {question.explanation}
                      </p>
                    </div>
                  )}
                </article>
              )
            )}

            {filteredQuestions.length === 0 && (
              <div className="rounded-xl bg-white p-8 text-center text-gray-500">
                No questions match this filter.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}