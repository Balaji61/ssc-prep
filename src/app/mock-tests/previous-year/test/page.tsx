"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type ApiQuestion = {
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
  explanation: string | null;
  section: string;
  question_number: number;
  test_question_number: number;
};

type Question = {
  question_id: string;
  question_text: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  section: string;
  question_number: number;
  test_question_number: number;
  explanation: string | null;
};

type Section = {
  name: string;
  questions: Question[];
};

type Answers = Record<string, string | null>;
type Marked = Record<string, boolean>;

type ReviewItem = {
  question_id: string;
  exam_name?: string;
  subject?: string;
  category?: string | null;
  topic?: string | null;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  selected_option: string | null;
  correct_option: string;
  explanation: string | null;
  status: "correct" | "wrong" | "unanswered";
  marked: boolean;
};

type Result = {
  success: boolean;
  year: string;
  exam_name: string;
  total_questions: number;
  answered: number;
  unanswered: number;
  correct: number;
  wrong: number;
  positive_marks: number;
  negative_marks: number;
  final_score: number;
  max_score: number;
  percentage: number;
  accuracy: number;
  marked_count: number;
  review: ReviewItem[];
};

const SECTION_NAMES = [
  "Reasoning",
  "General Awareness",
  "Quantitative Aptitude",
  "English",
];

const QUESTIONS_PER_SECTION = 25;
const SECTION_TIME = 15 * 60;

function buildSections(
  questions: ApiQuestion[]
): Section[] {
  return SECTION_NAMES.map((sectionName) => ({
    name: sectionName,

    questions: questions
      .filter(
        (question) =>
          question.section === sectionName
      )
      .sort(
        (a, b) =>
          a.question_number -
          b.question_number
      )
      .map((question) => ({
        question_id:
          question.question_id,

        question_text:
          question.question_text,

        options: {
          A: question.option_a,
          B: question.option_b,
          C: question.option_c,
          D: question.option_d,
        },

        section:
          question.section,

        question_number:
          question.question_number,

        test_question_number:
          question.test_question_number,

        explanation:
          question.explanation,
      })),
  }));
}

export default function PreviousYearTestPage() {
  const searchParams = useSearchParams();

  const year =
    searchParams.get("year") || "2025";

  const [sections, setSections] =
    useState<Section[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [sectionIndex, setSectionIndex] =
    useState(0);

  const [questionIndex, setQuestionIndex] =
    useState(0);

  const [timeLeft, setTimeLeft] =
    useState(SECTION_TIME);

  const [answers, setAnswers] =
    useState<Answers>({});

  const [marked, setMarked] =
    useState<Marked>({});

  const [submitting, setSubmitting] =
    useState(false);

  const [result, setResult] =
    useState<Result | null>(null);

  // ==========================================================
  // LOAD PREVIOUS YEAR QUESTIONS
  // ==========================================================

  useEffect(() => {
    async function loadQuestions() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/mock-test/previous-year?year=${encodeURIComponent(
            year
          )}`,
          {
            cache: "no-store",
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Failed to load previous year questions."
          );
        }

        if (
          !Array.isArray(data.questions)
        ) {
          throw new Error(
            "Invalid question data received."
          );
        }

        const builtSections =
          buildSections(
            data.questions
          );

        if (
          builtSections.length !== 4
        ) {
          throw new Error(
            "Invalid section data."
          );
        }

        const invalidSection =
          builtSections.find(
            (section) =>
              section.questions.length !==
              QUESTIONS_PER_SECTION
          );

        if (invalidSection) {
          throw new Error(
            `${invalidSection.name} does not contain exactly 25 questions.`
          );
        }

        setSections(
          builtSections
        );
      } catch (err) {
        console.error(
          "Previous year test loading error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading the test."
        );
      } finally {
        setLoading(false);
      }
    }

    loadQuestions();
  }, [year]);

  // ==========================================================
  // CURRENT SECTION
  // ==========================================================

  const currentSection =
    sections[sectionIndex];

  const currentQuestion =
    currentSection?.questions[
      questionIndex
    ];

  // ==========================================================
  // CURRENT SECTION ANSWERED
  // ==========================================================

  const currentSectionAnswered =
    useMemo(() => {
      if (!currentSection) {
        return 0;
      }

      return currentSection.questions.filter(
        (question) =>
          answers[
            question.question_id
          ]
      ).length;
    }, [
      currentSection,
      answers,
    ]);

  // ==========================================================
  // TOTAL ANSWERED
  // ==========================================================

  const totalAnswered =
    useMemo(() => {
      return sections.reduce(
        (total, section) => {
          return (
            total +
            section.questions.filter(
              (question) =>
                answers[
                  question.question_id
                ]
            ).length
          );
        },
        0
      );
    }, [sections, answers]);

  // ==========================================================
  // CURRENT SECTION MARKED
  // ==========================================================

  const currentSectionMarked =
    useMemo(() => {
      if (!currentSection) {
        return 0;
      }

      return currentSection.questions.filter(
        (question) =>
          marked[
            question.question_id
          ]
      ).length;
    }, [
      currentSection,
      marked,
    ]);

  // ==========================================================
  // TIMER
  // ==========================================================

  useEffect(() => {
    if (
      !currentSection ||
      result ||
      submitting
    ) {
      return;
    }

    const timer =
      window.setInterval(() => {
        setTimeLeft((previous) => {
          if (previous <= 1) {
            window.clearInterval(
              timer
            );

            setTimeout(() => {
              moveToNextSection();
            }, 0);

            return 0;
          }

          return previous - 1;
        });
      }, 1000);

    return () =>
      window.clearInterval(timer);
  }, [
    sectionIndex,
    currentSection,
    result,
    submitting,
  ]);

  // ==========================================================
  // FORMAT TIME
  // ==========================================================

  function formatTime(
    seconds: number
  ) {
    const minutes =
      Math.floor(seconds / 60);

    const remainingSeconds =
      seconds % 60;

    return `${String(
      minutes
    ).padStart(
      2,
      "0"
    )}:${String(
      remainingSeconds
    ).padStart(
      2,
      "0"
    )}`;
  }

  // ==========================================================
  // SELECT ANSWER
  // ==========================================================

  function selectAnswer(
    option: string
  ) {
    if (!currentQuestion) {
      return;
    }

    setAnswers((previous) => ({
      ...previous,

      [currentQuestion.question_id]:
        previous[
          currentQuestion.question_id
        ] === option
          ? null
          : option,
    }));
  }

  // ==========================================================
  // MARK FOR REVIEW
  // ==========================================================

  function toggleMark() {
    if (!currentQuestion) {
      return;
    }

    setMarked((previous) => ({
      ...previous,

      [currentQuestion.question_id]:
        !previous[
          currentQuestion.question_id
        ],
    }));
  }

  // ==========================================================
  // PREVIOUS QUESTION
  // ==========================================================

  function goToPreviousQuestion() {
    if (questionIndex === 0) {
      return;
    }

    setQuestionIndex(
      (previous) =>
        previous - 1
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // ==========================================================
  // NEXT QUESTION
  // ==========================================================

  function goToNextQuestion() {
    if (!currentSection) {
      return;
    }

    if (
      questionIndex >=
      currentSection.questions
        .length -
        1
    ) {
      return;
    }

    setQuestionIndex(
      (previous) =>
        previous + 1
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // ==========================================================
  // QUESTION PALETTE
  // ==========================================================

  function goToQuestion(
    index: number
  ) {
    setQuestionIndex(index);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // ==========================================================
  // MOVE TO NEXT SECTION
  // ==========================================================

  function moveToNextSection() {
    if (
      submitting ||
      result
    ) {
      return;
    }

    if (
      sectionIndex >=
      sections.length - 1
    ) {
      finishTest();
      return;
    }

    setSectionIndex(
      (previous) =>
        previous + 1
    );

    setQuestionIndex(0);

    setTimeLeft(
      SECTION_TIME
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // ==========================================================
  // FINISH SECTION
  // ==========================================================

  function finishSection() {
    const isLastSection =
      sectionIndex ===
      sections.length - 1;

    const confirmed =
      window.confirm(
        isLastSection
          ? "Are you sure you want to finish the test and submit it?"
          : "Are you sure you want to finish this section and continue to the next section?"
      );

    if (!confirmed) {
      return;
    }

    moveToNextSection();
  }

  // ==========================================================
  // SUBMIT TEST
  // ==========================================================

  async function finishTest() {
    if (
      submitting ||
      result
    ) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      // ------------------------------------------------------
      // GET ALL 100 QUESTION IDS
      // ------------------------------------------------------

      const questionIds =
        sections.flatMap(
          (section) =>
            section.questions.map(
              (question) =>
                question.question_id
            )
        );

      if (
        questionIds.length !== 100
      ) {
        throw new Error(
          `The test contains ${questionIds.length} questions instead of 100.`
        );
      }

      // ------------------------------------------------------
      // SEND TO PREVIOUS YEAR POST API
      // ------------------------------------------------------

      const response =
        await fetch(
          "/api/mock-test/previous-year",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              year,
              answers,
              marked,
              questionIds,
            }),
          }
        );

      const data =
        await response.json();

      // ------------------------------------------------------
      // HANDLE API ERROR
      // ------------------------------------------------------

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to calculate the test result."
        );
      }

      // ------------------------------------------------------
      // VERIFY RESULT
      // ------------------------------------------------------

      if (
        typeof data.final_score !==
        "number"
      ) {
        throw new Error(
          "The server did not return a valid test score."
        );
      }

      // ------------------------------------------------------
      // CREATE RESULT
      // ------------------------------------------------------

      const finalResult: Result = {
        success:
          data.success ?? true,

        year:
          String(
            data.year ?? year
          ),

        exam_name:
          data.exam_name ??
          `SSC CGL ${year}`,

        total_questions:
          data.total_questions ??
          100,

        answered:
          data.answered ?? 0,

        unanswered:
          data.unanswered ?? 0,

        correct:
          data.correct ?? 0,

        wrong:
          data.wrong ?? 0,

        positive_marks:
          data.positive_marks ??
          0,

        negative_marks:
          data.negative_marks ??
          0,

        final_score:
          data.final_score ?? 0,

        max_score:
          data.max_score ?? 200,

        percentage:
          data.percentage ?? 0,

        accuracy:
          data.accuracy ?? 0,

        marked_count:
          data.marked_count ??
          Object.values(
            marked
          ).filter(Boolean).length,

        review:
          Array.isArray(
            data.review
          )
            ? data.review
            : [],
      };

      // ------------------------------------------------------
      // SAVE RESULT FOR REVIEW PAGE
      // ------------------------------------------------------

      sessionStorage.setItem(
        "ssc_previous_year_mock_result",
        JSON.stringify(
          finalResult
        )
      );

      // ------------------------------------------------------
      // SHOW RESULT ON SAME PAGE
      // ------------------------------------------------------

      setResult(
        finalResult
      );

      setSubmitting(false);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error(
        "Previous year test submission error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while submitting the test."
      );

      setSubmitting(false);
    }
  }

  // ==========================================================
  // LOADING SCREEN
  // ==========================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
            <Link
              href="/"
              className="text-2xl font-extrabold text-blue-800"
            >
              SSC PREP
            </Link>

            <span className="font-semibold text-gray-700">
              SSC CGL {year} Previous Year Mock
            </span>
          </div>
        </header>

        <div className="flex min-h-[70vh] items-center justify-center px-5">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-700" />

            <h1 className="mt-6 text-xl font-bold text-gray-900">
              Loading questions...
            </h1>

            <p className="mt-2 text-gray-600">
              Preparing your SSC CGL {year} previous year mock test.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================================
  // INITIAL ERROR SCREEN
  // ==========================================================

  if (
    error &&
    !currentQuestion &&
    !result
  ) {
    return (
      <main className="min-h-screen bg-slate-50">
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
            <Link
              href="/"
              className="text-2xl font-extrabold text-blue-800"
            >
              SSC PREP
            </Link>

            <Link
              href="/mock-tests/previous-year"
              className="font-semibold text-blue-700"
            >
              ← Back
            </Link>
          </div>
        </header>

        <div className="flex min-h-[70vh] items-center justify-center px-5">
          <div className="max-w-lg rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <div className="text-4xl">
              ⚠️
            </div>

            <h1 className="mt-4 text-2xl font-extrabold text-gray-900">
              Unable to load test
            </h1>

            <p className="mt-3 text-gray-700">
              {error}
            </p>

            <Link
              href="/mock-tests/previous-year"
              className="mt-6 inline-block rounded-xl bg-blue-700 px-6 py-3 font-bold text-white"
            >
              Back to Previous Year Tests
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================================
  // SUBMITTING SCREEN
  // ==========================================================

  if (submitting) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="flex min-h-screen items-center justify-center px-5">
          <div className="text-center">
            <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-blue-200 border-t-blue-700" />

            <h1 className="mt-6 text-2xl font-extrabold text-gray-900">
              Submitting Test...
            </h1>

            <p className="mt-3 text-gray-600">
              Please wait while we calculate your SSC CGL result.
            </p>

            <p className="mt-2 text-sm font-semibold text-gray-500">
              Do not close this page.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================================
  // RESULT SCREEN
  // ==========================================================

  if (result) {
    return (
      <main className="min-h-screen bg-slate-50">
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
            <Link
              href="/"
              className="text-2xl font-extrabold text-blue-800"
            >
              SSC PREP
            </Link>

            <span className="text-sm font-bold text-gray-700">
              SSC CGL {year} Previous Year Test
            </span>
          </div>
        </header>

        <div className="mx-auto max-w-5xl px-5 py-10">
          {/* SUCCESS */}

          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl font-extrabold text-green-700">
              ✓
            </div>

            <h1 className="mt-5 text-3xl font-extrabold text-gray-900">
              Test Submitted Successfully
            </h1>

            <p className="mt-2 text-gray-600">
              SSC CGL {year} Previous Year Mock Test
            </p>
          </div>

          {/* SCORE */}

          <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-7 text-center shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
              Final Score
            </p>

            <p className="mt-2 text-5xl font-extrabold text-blue-800">
              {result.final_score}
              <span className="text-2xl text-gray-500">
                {" "}
                / {result.max_score}
              </span>
            </p>

            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-800">
                {result.percentage}% Score
              </span>

              <span className="rounded-full bg-green-50 px-4 py-2 text-sm font-bold text-green-800">
                {result.accuracy}% Accuracy
              </span>
            </div>
          </div>

          {/* COUNTS */}

          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <ResultCard
              label="Answered"
              value={result.answered}
              className="border-blue-100 bg-blue-50"
            />

            <ResultCard
              label="Unanswered"
              value={result.unanswered}
              className="border-gray-200 bg-gray-50"
            />

            <ResultCard
              label="Correct"
              value={result.correct}
              className="border-green-100 bg-green-50"
            />

            <ResultCard
              label="Wrong"
              value={result.wrong}
              className="border-red-100 bg-red-50"
            />
          </div>

          {/* MARKS */}

          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-gray-900">
              Marks Breakdown
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <MarkCard
                label="Positive Marks"
                value={`+${result.positive_marks}`}
                textClass="text-green-700"
              />

              <MarkCard
                label="Negative Marks"
                value={`-${result.negative_marks}`}
                textClass="text-red-700"
              />

              <MarkCard
                label="Final Score"
                value={`${result.final_score}`}
                textClass="text-blue-800"
              />
            </div>
          </div>

          {/* SUMMARY */}

          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-gray-900">
              Test Summary
            </h2>

            <div className="mt-5 space-y-3">
              <SummaryRow
                label="Total Questions"
                value={String(
                  result.total_questions
                )}
              />

              <SummaryRow
                label="Answered"
                value={String(
                  result.answered
                )}
              />

              <SummaryRow
                label="Unanswered"
                value={String(
                  result.unanswered
                )}
              />

              <SummaryRow
                label="Correct Answers"
                value={String(
                  result.correct
                )}
              />

              <SummaryRow
                label="Wrong Answers"
                value={String(
                  result.wrong
                )}
              />

              <SummaryRow
                label="Marked for Review"
                value={String(
                  result.marked_count
                )}
              />

              <SummaryRow
                label="Maximum Marks"
                value={String(
                  result.max_score
                )}
              />
            </div>
          </div>

          {/* BUTTONS */}

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Link
              href="/mock-tests/previous-year"
              className="flex items-center justify-center rounded-xl border-2 border-gray-300 bg-white px-6 py-4 text-center font-extrabold text-gray-800 transition hover:bg-gray-50"
            >
              ← Back to Previous Year Tests
            </Link>

            <Link
              href={`/mock-tests/previous-year/review?year=${encodeURIComponent(
                year
              )}`}
              className="flex items-center justify-center rounded-xl bg-blue-700 px-6 py-4 text-center font-extrabold text-white transition hover:bg-blue-800"
            >
              Review Answers →
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================================
  // SAFETY
  // ==========================================================

  if (
    !currentSection ||
    !currentQuestion
  ) {
    return null;
  }

  // ==========================================================
  // CURRENT QUESTION
  // ==========================================================

  const selectedAnswer =
    answers[
      currentQuestion.question_id
    ] ?? null;

  const isMarked =
    marked[
      currentQuestion.question_id
    ] ?? false;

  const isLastQuestion =
    questionIndex ===
    currentSection.questions.length -
      1;

  const isFirstQuestion =
    questionIndex === 0;

  const isLastSection =
    sectionIndex ===
    sections.length - 1;

  const totalProgress =
    Math.round(
      (totalAnswered / 100) *
        100
    );

  // ==========================================================
  // TEST PAGE
  // ==========================================================

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}

      <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-5">
          <Link
            href="/"
            className="shrink-0 text-xl font-extrabold text-blue-800 sm:text-2xl"
          >
            SSC PREP
          </Link>

          <div className="hidden text-center sm:block">
            <p className="text-sm font-bold text-gray-900">
              SSC CGL {year} Previous Year Mock Test
            </p>

            <p className="text-xs font-semibold text-gray-600">
              {currentSection.name}
            </p>
          </div>

          <div className="rounded-xl bg-blue-50 px-3 py-2 text-center sm:px-5">
            <p className="text-[10px] font-bold uppercase tracking-wide text-blue-700 sm:text-xs">
              Time Left
            </p>

            <p
              className={`text-lg font-extrabold sm:text-xl ${
                timeLeft <= 60
                  ? "text-red-600"
                  : "text-blue-900"
              }`}
            >
              {formatTime(
                timeLeft
              )}
            </p>
          </div>
        </div>
      </header>

      {/* MOBILE TITLE */}

      <div className="border-b bg-white px-4 py-3 sm:hidden">
        <p className="text-sm font-bold text-gray-900">
          SSC CGL {year} Previous Year Mock Test
        </p>

        <p className="mt-1 text-xs font-semibold text-blue-700">
          {currentSection.name}
        </p>
      </div>

      {/* SECTION BAR */}

      <div className="bg-blue-950 text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
          {sections.map(
            (section, index) => {
              const isCurrent =
                index ===
                sectionIndex;

              const isCompleted =
                index <
                sectionIndex;

              return (
                <div
                  key={
                    section.name
                  }
                  className={`border-b border-r border-blue-900 px-3 py-3 text-center sm:px-5 ${
                    isCurrent
                      ? "bg-blue-700"
                      : isCompleted
                      ? "bg-blue-900"
                      : "bg-blue-950"
                  }`}
                >
                  <p className="text-xs font-extrabold sm:text-sm">
                    {section.name}
                  </p>

                  <p className="mt-1 text-[10px] font-semibold text-blue-100 sm:text-xs">
                    {isCurrent
                      ? "In Progress"
                      : isCompleted
                      ? "Completed"
                      : "Locked"}
                  </p>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* SUBMISSION ERROR */}

      {error && (
        <div className="mx-auto mt-4 max-w-7xl px-4 sm:px-5">
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">
            {error}
          </div>
        </div>
      )}

      {/* MAIN */}

      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-5 sm:py-7">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* QUESTION */}

          <section>
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-gray-500">
                      Question{" "}
                      {questionIndex +
                        1}{" "}
                      of{" "}
                      {
                        currentSection
                          .questions
                          .length
                      }
                    </p>

                    <p className="mt-1 text-sm font-extrabold text-blue-700">
                      {currentSection.name}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-700">
                      {
                        currentQuestion.question_id
                      }
                    </span>

                    {isMarked && (
                      <span className="rounded-lg bg-orange-100 px-3 py-1.5 text-xs font-bold text-orange-800">
                        Marked for Review
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-7">
                <h2 className="text-lg font-bold leading-8 text-gray-900 sm:text-xl">
                  {
                    currentQuestion.question_text
                  }
                </h2>

                {/* OPTIONS */}

                <div className="mt-7 space-y-3">
                  {(
                    [
                      "A",
                      "B",
                      "C",
                      "D",
                    ] as const
                  ).map(
                    (option) => {
                      const selected =
                        selectedAnswer ===
                        option;

                      return (
                        <button
                          key={
                            option
                          }
                          type="button"
                          onClick={() =>
                            selectAnswer(
                              option
                            )
                          }
                          className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition ${
                            selected
                              ? "border-blue-700 bg-blue-50 ring-2 ring-blue-200"
                              : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/40"
                          }`}
                        >
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
                              selected
                                ? "bg-blue-700 text-white"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {
                              option
                            }
                          </span>

                          <span
                            className={`pt-1 text-sm font-semibold leading-6 sm:text-base ${
                              selected
                                ? "text-blue-900"
                                : "text-gray-800"
                            }`}
                          >
                            {
                              currentQuestion
                                .options[
                                option
                              ]
                            }
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>

                {/* CONTROLS */}

                <div className="mt-7 flex flex-col gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={
                      toggleMark
                    }
                    className={`rounded-xl border px-5 py-3 text-sm font-bold transition ${
                      isMarked
                        ? "border-orange-300 bg-orange-50 text-orange-800"
                        : "border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    {isMarked
                      ? "✓ Marked for Review"
                      : "⚑ Mark for Review"}
                  </button>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={
                        goToPreviousQuestion
                      }
                      disabled={
                        isFirstQuestion
                      }
                      className={`flex-1 rounded-xl px-5 py-3 text-sm font-bold sm:flex-none ${
                        isFirstQuestion
                          ? "cursor-not-allowed bg-gray-100 text-gray-400"
                          : "border border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
                      }`}
                    >
                      ← Previous
                    </button>

                    <button
                      type="button"
                      onClick={
                        goToNextQuestion
                      }
                      disabled={
                        isLastQuestion
                      }
                      className={`flex-1 rounded-xl px-5 py-3 text-sm font-bold sm:flex-none ${
                        isLastQuestion
                          ? "cursor-not-allowed bg-gray-100 text-gray-400"
                          : "bg-blue-700 text-white hover:bg-blue-800"
                      }`}
                    >
                      Save & Next →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* FINISH SECTION */}

            <button
              type="button"
              onClick={
                finishSection
              }
              className="mt-5 w-full rounded-xl bg-blue-900 px-5 py-4 text-sm font-extrabold text-white shadow-sm transition hover:bg-blue-950"
            >
              {isLastSection
                ? "Finish Section & Submit Test"
                : "Finish Section & Continue →"}
            </button>

            <p className="mt-3 text-center text-xs font-semibold text-gray-600">
              {isLastSection
                ? "Finishing this section will submit your complete test."
                : "You cannot return to this section after continuing."}
            </p>
          </section>

          {/* SIDEBAR */}

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            {/* CANDIDATE */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl">
                  👤
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500">
                    Candidate
                  </p>

                  <p className="font-extrabold text-gray-900">
                    SSC CGL Aspirant
                  </p>
                </div>
              </div>
            </div>

            {/* OVERALL PROGRESS */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-gray-900">
                  Overall Progress
                </h3>

                <span className="text-sm font-extrabold text-blue-700">
                  {totalAnswered}/100
                </span>
              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-blue-700 transition-all"
                  style={{
                    width: `${totalProgress}%`,
                  }}
                />
              </div>

              <p className="mt-3 text-xs font-semibold text-gray-600">
                {totalAnswered} questions answered
              </p>
            </div>

            {/* QUESTION PALETTE */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-gray-900">
                    Question Palette
                  </h3>

                  <p className="mt-1 text-xs font-semibold text-gray-600">
                    {currentSection.name}
                  </p>
                </div>

                <span className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-extrabold text-blue-700">
                  25
                </span>
              </div>

              <div className="mt-4 grid grid-cols-5 gap-2">
                {currentSection.questions.map(
                  (
                    question,
                    index
                  ) => {
                    const answered =
                      Boolean(
                        answers[
                          question.question_id
                        ]
                      );

                    const questionMarked =
                      Boolean(
                        marked[
                          question.question_id
                        ]
                      );

                    const current =
                      index ===
                      questionIndex;

                    return (
                      <button
                        key={
                          question.question_id
                        }
                        type="button"
                        onClick={() =>
                          goToQuestion(
                            index
                          )
                        }
                        className={`relative flex h-10 items-center justify-center rounded-lg border text-xs font-extrabold transition ${
                          current
                            ? "border-blue-700 bg-blue-700 text-white"
                            : answered
                            ? "border-green-300 bg-green-100 text-green-800"
                            : questionMarked
                            ? "border-orange-300 bg-orange-100 text-orange-800"
                            : "border-gray-200 bg-gray-50 text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                        }`}
                      >
                        {index + 1}

                        {questionMarked &&
                          !current && (
                            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-orange-500" />
                          )}
                      </button>
                    );
                  }
                )}
              </div>

              <div className="mt-5 space-y-2 text-xs font-semibold text-gray-700">
                <Legend
                  className="bg-blue-700"
                  label="Current"
                />

                <Legend
                  className="border border-green-300 bg-green-100"
                  label="Answered"
                />

                <Legend
                  className="border border-orange-300 bg-orange-100"
                  label="Marked for Review"
                />

                <Legend
                  className="border border-gray-200 bg-gray-50"
                  label="Not Answered"
                />
              </div>
            </div>

            {/* SECTION INFO */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="font-extrabold text-gray-900">
                Section Information
              </h3>

              <div className="mt-4 space-y-3">
                <SummaryRow
                  label="Section"
                  value={
                    currentSection.name
                  }
                />

                <SummaryRow
                  label="Questions"
                  value="25"
                />

                <SummaryRow
                  label="Time"
                  value="15 minutes"
                />

                <SummaryRow
                  label="Answered"
                  value={`${currentSectionAnswered}/25`}
                />

                <SummaryRow
                  label="Marked"
                  value={String(
                    currentSectionMarked
                  )}
                />
              </div>
            </div>

            {/* SUBMIT ENTIRE TEST */}

            <button
              type="button"
              onClick={() => {
                const confirmed =
                  window.confirm(
                    "Are you sure you want to submit the entire test? You will not be able to change your answers after submission."
                  );

                if (
                  confirmed
                ) {
                  finishTest();
                }
              }}
              className="w-full rounded-xl border-2 border-red-200 bg-white px-5 py-3 text-sm font-extrabold text-red-700 hover:bg-red-50"
            >
              Submit Test
            </button>

            {/* NOTICE */}

            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
              <p className="text-sm font-extrabold text-blue-900">
                Current Section
              </p>

              <p className="mt-2 text-xs font-semibold leading-5 text-blue-800">
                You are currently answering the{" "}
                {
                  currentSection.name
                }{" "}
                section. Finish the section or wait for the timer to move to the next section.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

// ==========================================================
// RESULT CARD
// ==========================================================

function ResultCard({
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
      className={`rounded-2xl border p-5 text-center ${className}`}
    >
      <p className="text-xs font-bold uppercase tracking-wide text-gray-600">
        {label}
      </p>

      <p className="mt-2 text-3xl font-extrabold text-gray-900">
        {value}
      </p>
    </div>
  );
}

// ==========================================================
// MARK CARD
// ==========================================================

function MarkCard({
  label,
  value,
  textClass,
}: {
  label: string;
  value: string;
  textClass: string;
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-5 text-center">
      <p className="text-xs font-bold text-gray-600">
        {label}
      </p>

      <p
        className={`mt-2 text-2xl font-extrabold ${textClass}`}
      >
        {value}
      </p>
    </div>
  );
}

// ==========================================================
// SUMMARY ROW
// ==========================================================

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0 last:pb-0">
      <span className="text-xs font-semibold text-gray-600">
        {label}
      </span>

      <span className="text-sm font-extrabold text-gray-900">
        {value}
      </span>
    </div>
  );
}

// ==========================================================
// LEGEND
// ==========================================================

function Legend({
  className,
  label,
}: {
  className: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-3 w-3 rounded-sm ${className}`}
      />

      <span>{label}</span>
    </div>
  );
}