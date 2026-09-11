"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Question = {
  question_id: string;
  subject: string;
  category: string;
  topic: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
};

type Section = {
  name: string;
  shortName: string;
  duration: number;
  questions: Question[];
};

type Answers = Record<
  string,
  string | null
>;

type Marked = Record<
  string,
  boolean
>;

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

export default function MockTestPage() {
  const router = useRouter();

  const [sections, setSections] =
    useState<Section[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [sectionIndex, setSectionIndex] =
    useState(0);

  const [questionIndex, setQuestionIndex] =
    useState(0);

  const [timeLeft, setTimeLeft] =
    useState(15 * 60);

  const [answers, setAnswers] =
    useState<Answers>({});

  const [marked, setMarked] =
    useState<Marked>({});

  const [submitted, setSubmitted] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [result, setResult] =
    useState<Result | null>(null);

  // ==========================================================
  // LOAD TEST OR PREVIOUS RESULT
  // ==========================================================

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
        setSubmitted(true);
        setLoading(false);

        return;
      } catch {
        sessionStorage.removeItem(
          "ssc_mock_test_result"
        );
      }
    }

    async function loadMockTest() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "/api/mock-test/questions",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Unable to load mock test."
          );
        }

        const loadedSections:
          Section[] =
          data.sections || [];

        if (
          loadedSections.length !== 4
        ) {
          throw new Error(
            "Mock test sections could not be loaded correctly."
          );
        }

        const invalidSection =
          loadedSections.find(
            (section) =>
              section.questions.length !==
              25
          );

        if (invalidSection) {
          throw new Error(
            `${invalidSection.shortName} does not contain exactly 25 questions.`
          );
        }

        setSections(
          loadedSections
        );

        setSectionIndex(0);
        setQuestionIndex(0);

        setTimeLeft(
          loadedSections[0]?.duration ||
            15 * 60
        );
      } catch (err) {
        console.error(
          "Mock test loading error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load mock test."
        );
      } finally {
        setLoading(false);
      }
    }

    loadMockTest();
  }, []);

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
  // ANSWERED COUNT
  // ==========================================================

  const answeredCount =
    useMemo(() => {
      if (!currentSection) {
        return 0;
      }

      return currentSection.questions.filter(
        (question) =>
          answers[
            question.question_id
          ] !== undefined &&
          answers[
            question.question_id
          ] !== null
      ).length;
    }, [
      answers,
      currentSection,
    ]);

  const totalAnswered =
    useMemo(() => {
      return Object.values(
        answers
      ).filter(
        (answer) =>
          answer !== null &&
          answer !== undefined
      ).length;
    }, [answers]);

  // ==========================================================
  // TIMER
  // ==========================================================

  useEffect(() => {
    if (
      loading ||
      submitted ||
      !currentSection
    ) {
      return;
    }

    if (timeLeft <= 0) {
      moveToNextSection();
      return;
    }

    const timer =
      setInterval(() => {
        setTimeLeft(
          (previous) =>
            previous - 1
        );
      }, 1000);

    return () =>
      clearInterval(timer);
  }, [
    timeLeft,
    loading,
    submitted,
    sectionIndex,
    currentSection,
  ]);

  // ==========================================================
  // SELECT ANSWER
  // ==========================================================

  function selectAnswer(
    option: string
  ) {
    if (!currentQuestion) {
      return;
    }

    setAnswers(
      (previous) => ({
        ...previous,

        [currentQuestion.question_id]:
          previous[
            currentQuestion.question_id
          ] === option
            ? null
            : option,
      })
    );
  }

  // ==========================================================
  // MARK
  // ==========================================================

  function toggleMark() {
    if (!currentQuestion) {
      return;
    }

    setMarked(
      (previous) => ({
        ...previous,

        [currentQuestion.question_id]:
          !previous[
            currentQuestion.question_id
          ],
      })
    );
  }

  // ==========================================================
  // NEXT QUESTION
  // ==========================================================

  function nextQuestion() {
    if (!currentSection) {
      return;
    }

    if (
      questionIndex <
      currentSection.questions.length -
        1
    ) {
      setQuestionIndex(
        (previous) =>
          previous + 1
      );
    }
  }

  // ==========================================================
  // PREVIOUS QUESTION
  // ==========================================================

  function previousQuestion() {
    if (questionIndex > 0) {
      setQuestionIndex(
        (previous) =>
          previous - 1
      );
    }
  }

  // ==========================================================
  // NEXT SECTION
  // ==========================================================

  function moveToNextSection() {
    if (
      sectionIndex <
      sections.length - 1
    ) {
      const nextSection =
        sectionIndex + 1;

      setSectionIndex(
        nextSection
      );

      setQuestionIndex(0);

      setTimeLeft(
        sections[nextSection]
          .duration
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    finishTest();
  }

  // ==========================================================
  // FINISH SECTION
  // ==========================================================

  function finishSection() {
    if (!currentSection) {
      return;
    }

    const isLastSection =
      sectionIndex ===
      sections.length - 1;

    const message = isLastSection
      ? "Are you sure you want to finish this section and submit the mock test?"
      : "Are you sure you want to finish this section and move to the next section?";

    const confirmed =
      window.confirm(message);

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
      submitted
    ) {
      return;
    }

    try {
      setSubmitting(true);

      const allQuestionIds =
        sections.flatMap(
          (section) =>
            section.questions.map(
              (question) =>
                question.question_id
            )
        );

      const response =
        await fetch(
          "/api/mock-test/questions",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              answers,
              marked,
              questionIds:
                allQuestionIds,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to calculate result."
        );
      }

      // ======================================================
      // SAVE RESULT FOR BACK BUTTON / REVIEW
      // ======================================================

      sessionStorage.setItem(
        "ssc_mock_test_result",
        JSON.stringify(data)
      );

      setResult(data);
      setSubmitted(true);

      /*
       * Replace current history entry.
       * The completed test is now represented by the result.
       */
      window.history.replaceState(
        null,
        "",
        "/mock-tests/test"
      );
    } catch (err) {
      console.error(
        "Mock test submission error:",
        err
      );

      alert(
        err instanceof Error
          ? err.message
          : "Unable to submit mock test."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ==========================================================
  // MANUAL SUBMIT
  // ==========================================================

  function handleSubmit() {
    const confirmed =
      window.confirm(
        "Are you sure you want to submit the mock test?"
      );

    if (confirmed) {
      finishTest();
    }
  }

  // ==========================================================
  // FORMAT TIME
  // ==========================================================

  function formatTime(
    seconds: number
  ) {
    const minutes =
      Math.floor(
        seconds / 60
      );

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
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
        <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="text-4xl">
            📝
          </div>

          <h1 className="mt-4 text-xl font-bold text-gray-900">
            Loading Mock Test
          </h1>

          <p className="mt-2 text-gray-600">
            Preparing 100 questions...
          </p>
        </div>
      </main>
    );
  }

  // ==========================================================
  // SUBMITTING
  // ==========================================================

  if (submitting) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
        <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="text-4xl">
            ⏳
          </div>

          <h1 className="mt-4 text-xl font-bold text-gray-900">
            Calculating Your Result
          </h1>

          <p className="mt-2 text-gray-600">
            Please wait...
          </p>
        </div>
      </main>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
        <div className="max-w-lg rounded-2xl bg-white p-8 text-center shadow-lg">
          <div className="text-5xl">
            ⚠️
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Unable to Load Mock Test
          </h1>

          <p className="mt-3 text-gray-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="mt-6 rounded-xl bg-blue-700 px-6 py-3 font-bold text-white hover:bg-blue-800"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  // ==========================================================
  // RESULTS
  // ==========================================================

  if (
    submitted &&
    result
  ) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">

        <header className="border-b bg-white">
          <div className="mx-auto max-w-6xl px-5 py-4">
            <Link
              href="/"
              className="text-2xl font-extrabold text-blue-800"
            >
              SSC PREP
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-5xl px-5 py-10 sm:py-14">

          <div className="rounded-3xl bg-white p-6 shadow-xl sm:p-10">

            <div className="text-center">
              <div className="text-6xl">
                🎉
              </div>

              <h1 className="mt-5 text-3xl font-extrabold text-blue-950 sm:text-4xl">
                Mock Test Completed
              </h1>

              <p className="mt-3 text-gray-600">
                Here is your SSC CGL Tier-I mock test result.
              </p>
            </div>

            {/* SCORE */}

            <div className="mt-8 rounded-2xl bg-blue-50 p-6 text-center">

              <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
                Final Score
              </p>

              <div className="mt-2 text-5xl font-extrabold text-blue-900">
                {result.finalScore.toFixed(2)}
                <span className="text-2xl text-gray-500">
                  {" "}
                  / {result.maxMarks}
                </span>
              </div>

              <p className="mt-2 text-lg font-bold text-blue-700">
                {result.percentage.toFixed(2)}%
              </p>

            </div>

            {/* STATS */}

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <ResultCard
                value={result.correct}
                label="Correct"
                className="bg-green-50 text-green-700"
              />

              <ResultCard
                value={result.wrong}
                label="Wrong"
                className="bg-red-50 text-red-700"
              />

              <ResultCard
                value={result.unanswered}
                label="Unanswered"
                className="bg-gray-100 text-gray-700"
              />

              <ResultCard
                value={result.attempted}
                label="Attempted"
                className="bg-blue-50 text-blue-700"
              />

            </div>

            {/* MARKS */}

            <div className="mt-6 grid gap-4 sm:grid-cols-3">

              <div className="rounded-2xl border border-green-200 p-5">
                <div className="text-sm font-semibold text-gray-500">
                  Positive Marks
                </div>

                <div className="mt-2 text-2xl font-extrabold text-green-700">
                  +{result.positiveMarks.toFixed(2)}
                </div>

                <div className="mt-1 text-xs text-gray-500">
                  {result.correct} × 2
                </div>
              </div>

              <div className="rounded-2xl border border-red-200 p-5">
                <div className="text-sm font-semibold text-gray-500">
                  Negative Marks
                </div>

                <div className="mt-2 text-2xl font-extrabold text-red-700">
                  -{result.negativeMarks.toFixed(2)}
                </div>

                <div className="mt-1 text-xs text-gray-500">
                  {result.wrong} × 0.50
                </div>
              </div>

              <div className="rounded-2xl border border-blue-200 p-5">
                <div className="text-sm font-semibold text-gray-500">
                  Accuracy
                </div>

                <div className="mt-2 text-2xl font-extrabold text-blue-700">
                  {result.accuracy.toFixed(2)}%
                </div>

                <div className="mt-1 text-xs text-gray-500">
                  Correct ÷ Attempted
                </div>
              </div>

            </div>

            {/* SUMMARY */}

            <div className="mt-8 rounded-2xl border bg-gray-50 p-5">

              <h2 className="font-bold text-gray-900">
                Result Summary
              </h2>

              <div className="mt-4 space-y-3 text-sm">

                <SummaryRow
                  label="Total Questions"
                  value="100"
                />

                <SummaryRow
                  label="Attempted"
                  value={String(
                    result.attempted
                  )}
                />

                <SummaryRow
                  label="Correct"
                  value={String(
                    result.correct
                  )}
                />

                <SummaryRow
                  label="Wrong"
                  value={String(
                    result.wrong
                  )}
                />

                <SummaryRow
                  label="Unanswered"
                  value={String(
                    result.unanswered
                  )}
                />

              </div>

            </div>

            {/* BUTTONS */}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/mock-tests/review"
                  )
                }
                className="rounded-xl bg-blue-700 px-7 py-3 font-bold text-white hover:bg-blue-800"
              >
                Review Answers
              </button>

              <Link
                href="/mock-tests"
                className="rounded-xl border-2 border-blue-700 bg-white px-7 py-3 text-center font-bold text-blue-700 hover:bg-blue-50"
              >
                Back to Mock Tests
              </Link>

            </div>

          </div>

        </div>

      </main>
    );
  }

  // ==========================================================
  // SAFETY CHECK
  // ==========================================================

  if (
    !currentSection ||
    !currentQuestion
  ) {
    return null;
  }

  const options = [
    ["A", currentQuestion.option_a],
    ["B", currentQuestion.option_b],
    ["C", currentQuestion.option_c],
    ["D", currentQuestion.option_d],
  ];

  const selectedAnswer =
    answers[
      currentQuestion.question_id
    ];

  // ==========================================================
  // TEST INTERFACE
  // ==========================================================

  return (
    <main className="min-h-screen bg-gray-100">

      <header className="sticky top-0 z-50 border-b bg-white shadow-sm">

        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-3 sm:px-6">

          <div>
            <div className="text-lg font-extrabold text-blue-800 sm:text-xl">
              SSC PREP
            </div>

            <div className="text-xs font-semibold text-gray-500 sm:text-sm">
              SSC CGL Mock Test
            </div>
          </div>

          <div className="text-center">
            <div className="text-xs font-semibold text-gray-500">
              CURRENT SECTION
            </div>

            <div className="font-bold text-gray-900">
              {currentSection.shortName}
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs font-semibold text-gray-500">
              TIME LEFT
            </div>

            <div
              className={`text-xl font-extrabold sm:text-2xl ${
                timeLeft <= 60
                  ? "text-red-600"
                  : "text-blue-800"
              }`}
            >
              {formatTime(timeLeft)}
            </div>
          </div>

        </div>

      </header>

      {/* SECTION BAR */}

      <div className="border-b bg-blue-900 text-white">

        <div className="mx-auto max-w-[1500px] px-4 sm:px-6">

          <div className="flex overflow-x-auto">

            {sections.map(
              (section, index) => {

                const isCurrent =
                  index ===
                  sectionIndex;

                const isPast =
                  index <
                  sectionIndex;

                return (
                  <div
                    key={
                      section.name
                    }
                    className={`min-w-[170px] border-r border-blue-800 px-4 py-3 text-center text-sm font-bold ${
                      isCurrent
                        ? "bg-white text-blue-900"
                        : isPast
                        ? "bg-blue-800 text-blue-100"
                        : "text-blue-200"
                    }`}
                  >

                    <div>
                      {index + 1}.{" "}
                      {section.shortName}
                    </div>

                    <div className="mt-1 text-xs font-medium">
                      {isCurrent
                        ? "In Progress"
                        : isPast
                        ? "Completed"
                        : "Locked"}
                    </div>

                  </div>
                );
              }
            )}

          </div>

        </div>

      </div>

      {/* MAIN */}

      <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6">

        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">

          {/* QUESTION */}

          <section className="rounded-2xl bg-white shadow-sm">

            <div className="border-b px-5 py-4">

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <h1 className="font-bold text-gray-900">
                    Question{" "}
                    {questionIndex + 1}{" "}
                    of{" "}
                    {currentSection.questions.length}
                  </h1>

                  <p className="text-sm text-gray-500">
                    {currentSection.name}
                  </p>

                </div>

                {marked[
                  currentQuestion.question_id
                ] && (
                  <span className="w-fit rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-800">
                    Marked for Review
                  </span>
                )}

              </div>

            </div>

            <div className="p-5 sm:p-8">

              <div className="min-h-[180px]">

                <p className="text-lg font-semibold leading-8 text-gray-900 sm:text-xl">
                  {currentQuestion.question_text}
                </p>

              </div>

              <div className="space-y-3">

                {options.map(
                  ([letter, text]) => {

                    const selected =
                      selectedAnswer ===
                      letter;

                    return (
                      <button
                        key={letter}
                        type="button"
                        onClick={() =>
                          selectAnswer(
                            letter
                          )
                        }
                        className={`flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition ${
                          selected
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/40"
                        }`}
                      >

                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 font-bold ${
                            selected
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-gray-300 text-gray-600"
                          }`}
                        >
                          {letter}
                        </span>

                        <span
                          className={`font-medium ${
                            selected
                              ? "text-blue-900"
                              : "text-gray-800"
                          }`}
                        >
                          {text}
                        </span>

                      </button>
                    );
                  }
                )}

              </div>

            </div>

            {/* CONTROLS */}

            <div className="border-t bg-gray-50 px-5 py-4 sm:px-8">

              <div className="flex flex-col gap-3">

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                  <button
                    type="button"
                    onClick={
                      toggleMark
                    }
                    className={`rounded-xl border px-5 py-3 text-sm font-bold transition ${
                      marked[
                        currentQuestion
                          .question_id
                      ]
                        ? "border-yellow-400 bg-yellow-100 text-yellow-900"
                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {marked[
                      currentQuestion
                        .question_id
                    ]
                      ? "★ Unmark Review"
                      : "☆ Mark for Review"}
                  </button>

                  <div className="flex gap-3">

                    <button
                      type="button"
                      onClick={
                        previousQuestion
                      }
                      disabled={
                        questionIndex ===
                        0
                      }
                      className="rounded-xl border border-gray-300 bg-white px-5 py-3 font-bold text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      ← Previous
                    </button>

                    <button
                      type="button"
                      onClick={
                        nextQuestion
                      }
                      disabled={
                        questionIndex ===
                        currentSection
                          .questions
                          .length -
                          1
                      }
                      className="rounded-xl bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Save & Next →
                    </button>

                  </div>

                </div>

                {/* KEEP EARLY FINISH */}

                <button
                  type="button"
                  onClick={
                    finishSection
                  }
                  className="w-full rounded-xl border-2 border-blue-700 bg-white px-5 py-3 font-bold text-blue-700 transition hover:bg-blue-50"
                >
                  {sectionIndex ===
                  sections.length - 1
                    ? "Finish Section & Submit Test"
                    : "Finish Section & Continue →"}
                </button>

              </div>

            </div>

          </section>

          {/* SIDEBAR */}

          <aside className="space-y-5">

            <div className="rounded-2xl bg-white p-5 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl">
                  👤
                </div>

                <div>
                  <div className="font-bold text-gray-900">
                    Candidate
                  </div>

                  <div className="text-sm text-gray-500">
                    SSC CGL Mock Test
                  </div>
                </div>

              </div>

            </div>

            {/* PROGRESS */}

            <div className="rounded-2xl bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <h2 className="font-bold text-gray-900">
                  Test Progress
                </h2>

                <span className="text-sm font-semibold text-gray-500">
                  {totalAnswered}/100
                </span>

              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-200">

                <div
                  className="h-full rounded-full bg-blue-600 transition-all"
                  style={{
                    width: `${totalAnswered}%`,
                  }}
                />

              </div>

              <p className="mt-2 text-xs text-gray-500">
                {totalAnswered} of 100 questions answered
              </p>

            </div>

            {/* PALETTE */}

            <div className="rounded-2xl bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <h2 className="font-bold text-gray-900">
                  Question Palette
                </h2>

                <span className="text-sm font-semibold text-gray-500">
                  {answeredCount}/25
                </span>

              </div>

              <div className="mt-4 grid grid-cols-5 gap-2">

                {currentSection.questions.map(
                  (
                    question,
                    index
                  ) => {

                    const isCurrent =
                      index ===
                      questionIndex;

                    const isAnswered =
                      answers[
                        question.question_id
                      ] !==
                        undefined &&
                      answers[
                        question.question_id
                      ] !== null;

                    const isMarked =
                      marked[
                        question.question_id
                      ];

                    let className =
                      "border-gray-300 bg-white text-gray-700";

                    if (isCurrent) {
                      className =
                        "border-blue-700 bg-blue-700 text-white";
                    } else if (
                      isAnswered &&
                      isMarked
                    ) {
                      className =
                        "border-yellow-500 bg-yellow-400 text-yellow-950";
                    } else if (
                      isMarked
                    ) {
                      className =
                        "border-yellow-400 bg-yellow-100 text-yellow-900";
                    } else if (
                      isAnswered
                    ) {
                      className =
                        "border-green-500 bg-green-100 text-green-800";
                    }

                    return (
                      <button
                        key={
                          question.question_id
                        }
                        type="button"
                        onClick={() =>
                          setQuestionIndex(
                            index
                          )
                        }
                        className={`h-10 rounded-lg border-2 text-sm font-bold transition ${className}`}
                      >
                        {index + 1}
                      </button>
                    );
                  }
                )}

              </div>

              <div className="mt-5 space-y-2 text-xs text-gray-600">

                <Legend
                  className="bg-green-100 border-green-500"
                  text="Answered"
                />

                <Legend
                  className="bg-yellow-100 border-yellow-400"
                  text="Marked for Review"
                />

                <Legend
                  className="bg-white border-gray-300"
                  text="Not Answered"
                />

                <Legend
                  className="bg-blue-700 border-blue-700"
                  text="Current Question"
                />

              </div>

            </div>

            {/* SECTION INFO */}

            <div className="rounded-2xl bg-blue-50 p-5">

              <h2 className="font-bold text-blue-900">
                Section Information
              </h2>

              <div className="mt-4 space-y-3 text-sm">

                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Questions
                  </span>

                  <span className="font-bold text-gray-900">
                    25
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Section Time
                  </span>

                  <span className="font-bold text-gray-900">
                    15 minutes
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Answered
                  </span>

                  <span className="font-bold text-green-700">
                    {answeredCount}
                  </span>
                </div>

              </div>

            </div>

            <button
              type="button"
              onClick={
                handleSubmit
              }
              disabled={submitting}
              className="w-full rounded-xl bg-red-600 px-5 py-4 font-bold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Submit Test
            </button>

          </aside>

        </div>

      </div>

      {/* NOTICE */}

      <div className="mx-auto max-w-[1500px] px-4 pb-8 sm:px-6">

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">

          <strong>
            {currentSection.shortName}
          </strong>{" "}
          has a maximum time of{" "}
          <strong>
            15 minutes
          </strong>
          .

          <br />

          You may finish the section early using{" "}
          <strong>
            Finish Section & Continue
          </strong>
          .

          <br />

          The next section remains locked until you finish the current section or its timer expires.

        </div>

      </div>

    </main>
  );
}

// ==========================================================
// RESULT CARD
// ==========================================================

function ResultCard({
  value,
  label,
  className,
}: {
  value: number;
  label: string;
  className: string;
}) {
  return (
    <div
      className={`rounded-2xl p-5 ${className}`}
    >
      <div className="text-3xl font-extrabold">
        {value}
      </div>

      <div className="mt-1 text-sm font-bold">
        {label}
      </div>
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
    <div className="flex justify-between border-b pb-3 last:border-0">
      <span className="text-gray-600">
        {label}
      </span>

      <span className="font-bold text-gray-900">
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
  text,
}: {
  className: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2">

      <span
        className={`h-4 w-4 rounded border-2 ${className}`}
      />

      <span>
        {text}
      </span>

    </div>
  );
}