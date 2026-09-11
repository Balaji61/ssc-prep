"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type Question = {
  question_id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  explanation: string | null;
};

type Answer = {
  question_id: string;
  selected_option: string | null;
};

type ReviewItem = {
  question_id: string;
  selected_option: string | null;
  correct_option: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  explanation: string | null;
  status: "correct" | "wrong" | "unanswered";
};

type Result = {
  correct: number;
  wrong: number;
  unanswered: number;
  score: number;
  review: ReviewItem[];
};

export default function QuestionsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const subject =
    searchParams.get("subject") || "General Studies";

  const category =
    searchParams.get("category") || "";

  const topic =
    searchParams.get("topic") || "";

  const count =
    Number(searchParams.get("count")) || 20;

  const timerMinutes =
    searchParams.get("timer") || "15";

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [secondsLeft, setSecondsLeft] = useState(
    timerMinutes === "none"
      ? 0
      : Number(timerMinutes) * 60
  );

  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [result, setResult] =
    useState<Result | null>(null);

  // ==========================================================
  // BACK TO SUBJECT PAGE
  // ==========================================================

  function getPracticePath() {
    if (subject === "English") {
      return "/practice/english";
    }

    if (subject === "Reasoning") {
      return "/practice/reasoning";
    }

    if (subject === "Quantitative Aptitude") {
      return "/practice/quantitative-aptitude";
    }

    return "/practice/general-awareness";
  }

  // ==========================================================
  // LOAD QUESTIONS
  // ==========================================================

  useEffect(() => {
    async function loadQuestions() {
      try {
        const response = await fetch(
          `/api/practice/questions?subject=${encodeURIComponent(
            subject
          )}&category=${encodeURIComponent(
            category
          )}&topic=${encodeURIComponent(
            topic
          )}&count=${count}`
        );

        const data = await response.json();

        const loadedQuestions: Question[] =
          data.questions || [];

        setQuestions(loadedQuestions);

        setAnswers(
          loadedQuestions.map((question) => ({
            question_id: question.question_id,
            selected_option: null,
          }))
        );
      } catch (error) {
        console.error(
          "Error loading questions:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadQuestions();
  }, [subject, category, topic, count]);

  // ==========================================================
  // TIMER
  // ==========================================================

  useEffect(() => {
    if (
      timerMinutes === "none" ||
      submitted ||
      secondsLeft <= 0
    ) {
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    secondsLeft,
    timerMinutes,
    submitted,
  ]);

  // ==========================================================
  // AUTO SUBMIT
  // ==========================================================

  useEffect(() => {
    if (
      timerMinutes !== "none" &&
      secondsLeft === 0 &&
      questions.length > 0 &&
      !submitted &&
      !submitting
    ) {
      submitTest();
    }
  }, [
    secondsLeft,
    questions.length,
    submitted,
    submitting,
    timerMinutes,
  ]);

  // ==========================================================
  // SELECT / UNSELECT ANSWER
  // ==========================================================

  function selectAnswer(option: string) {
    setAnswers((previous) => {
      const updated = [...previous];

      if (updated[currentQuestion]) {
        const currentAnswer =
          updated[currentQuestion].selected_option;

        updated[currentQuestion] = {
          ...updated[currentQuestion],

          // Clicking the same option again removes the answer.
          selected_option:
            currentAnswer === option
              ? null
              : option,
        };
      }

      return updated;
    });
  }

  // ==========================================================
  // FORMAT TIMER
  // ==========================================================

  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);

    const remainingSeconds =
      seconds % 60;

    return `${minutes}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }

  // ==========================================================
  // SUBMIT TEST
  // ==========================================================

  async function submitTest() {
    if (submitted || submitting) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        "/api/practice/questions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answers,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Submission failed"
        );
      }

      setResult(data);
      setSubmitted(true);
    } catch (error) {
      console.error(
        "Error submitting test:",
        error
      );

      alert(
        "There was a problem submitting the test. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <p className="text-lg font-medium text-gray-700">
          Loading questions...
        </p>
      </main>
    );
  }

  // ==========================================================
  // NO QUESTIONS
  // ==========================================================

  if (questions.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            No questions available
          </h1>

          <p className="mt-3 text-gray-700">
            There are not enough complete questions
            for this topic.
          </p>

          <button
            onClick={() => router.back()}
            className="mt-6 rounded-xl bg-blue-700 px-6 py-3 font-bold text-white hover:bg-blue-800"
          >
            ← Back
          </button>
        </div>
      </main>
    );
  }

  // ==========================================================
  // REVIEW PAGE
  // ==========================================================

  if (
    submitted &&
    showReview &&
    result
  ) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-4xl">

          <button
            onClick={() => setShowReview(false)}
            className="mb-6 text-base font-bold text-blue-700 hover:text-blue-900"
          >
            ← Back to Results
          </button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Review Answers
            </h1>

            <p className="mt-2 text-lg font-medium text-gray-700">
              {topic}
            </p>

            <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold">
              <span className="text-red-700">
                🔴 Your wrong answer
              </span>

              <span className="text-green-700">
                🟢 Correct answer
              </span>
            </div>
          </div>

          <div className="space-y-6">

            {result.review.map(
              (item, index) => {

                const question =
                  questions.find(
                    (q) =>
                      q.question_id ===
                      item.question_id
                  );

                if (!question) {
                  return null;
                }

                const optionTexts: {
                  [key: string]: string;
                } = {
                  A: item.option_a,
                  B: item.option_b,
                  C: item.option_c,
                  D: item.option_d,
                };

                return (
                  <div
                    key={item.question_id}
                    className="rounded-2xl bg-white p-5 shadow-md sm:p-7"
                  >

                    {/* Question header */}
                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <span className="text-lg font-bold text-gray-900">
                          Question {index + 1}
                        </span>

                        {/* Question ID */}
                        <p className="mt-1 text-sm font-medium text-gray-500">
                          ID: {item.question_id}
                        </p>

                      </div>

                      {item.status === "correct" && (
                        <span className="text-base font-bold text-green-700">
                          ✓ Correct
                        </span>
                      )}

                      {item.status === "wrong" && (
                        <span className="text-base font-bold text-red-700">
                          ✗ Wrong
                        </span>
                      )}

                      {item.status === "unanswered" && (
                        <span className="text-base font-bold text-gray-700">
                          — Unanswered
                        </span>
                      )}

                    </div>

                    {/* Question */}
                    <p className="mt-6 text-lg font-bold leading-8 text-gray-900">
                      {question.question_text}
                    </p>

                    {/* Options */}
                    <div className="mt-6 space-y-3">

                      {["A", "B", "C", "D"].map(
                        (letter) => {

                          const isCorrect =
                            item.correct_option ===
                            letter;

                          const isSelected =
                            item.selected_option ===
                            letter;

                          let optionClass =
                            "border-gray-300 bg-white";

                          if (isCorrect) {
                            optionClass =
                              "border-green-500 bg-green-50";
                          } else if (isSelected) {
                            optionClass =
                              "border-red-500 bg-red-50";
                          }

                          return (
                            <div
                              key={letter}
                              className={`rounded-xl border-2 p-4 ${optionClass}`}
                            >

                              <div className="flex items-start gap-3">

                                <span className="font-bold text-gray-900">
                                  {letter}.
                                </span>

                                <span className="font-semibold text-gray-900">
                                  {optionTexts[letter]}
                                </span>

                              </div>

                              {isCorrect && (
                                <div className="mt-2 ml-7 text-sm font-bold text-green-700">
                                  ✓ Correct
                                </div>
                              )}

                              {isSelected &&
                                !isCorrect && (
                                  <div className="mt-2 ml-7 text-sm font-bold text-red-700">
                                    ✗ Your answer
                                  </div>
                                )}

                            </div>
                          );
                        }
                      )}

                    </div>

                    {/* Explanation */}
                    {item.explanation &&
                      item.explanation.trim() !== "" && (
                        <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5">

                          <h3 className="font-bold text-blue-900">
                            Explanation
                          </h3>

                          <p className="mt-2 leading-7 text-gray-800">
                            {item.explanation}
                          </p>

                        </div>
                      )}

                  </div>
                );
              }
            )}

          </div>

          {/* Back to Practice */}
          <button
            onClick={() =>
              router.push(getPracticePath())
            }
            className="mt-8 w-full rounded-xl bg-blue-700 py-4 text-lg font-bold text-white hover:bg-blue-800"
          >
            Back to Practice
          </button>

        </div>
      </main>
    );
  }

  // ==========================================================
  // RESULT PAGE
  // ==========================================================

  if (
    submitted &&
    result
  ) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-4xl">

          <div className="rounded-3xl bg-white p-6 shadow-lg sm:p-8">

            <div className="text-center">

              <div className="text-5xl">
                🎉
              </div>

              <h1 className="mt-4 text-3xl font-bold text-gray-900">
                Practice Complete
              </h1>

              <p className="mt-3 text-lg font-medium text-gray-700">
                {topic}
              </p>

            </div>

            {/* Score */}
            <div className="mt-8 text-center">

              <div className="text-6xl font-bold text-blue-700">
                {result.score}%
              </div>

              <p className="mt-2 text-lg font-medium text-gray-700">
                {result.correct} /{" "}
                {questions.length} correct
              </p>

            </div>

            {/* Statistics */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">

              <div className="rounded-xl bg-green-50 p-5 text-center">
                <div className="text-3xl font-bold text-green-700">
                  {result.correct}
                </div>

                <p className="mt-1 font-semibold text-gray-800">
                  Correct
                </p>
              </div>

              <div className="rounded-xl bg-red-50 p-5 text-center">
                <div className="text-3xl font-bold text-red-700">
                  {result.wrong}
                </div>

                <p className="mt-1 font-semibold text-gray-800">
                  Wrong
                </p>
              </div>

              <div className="rounded-xl bg-gray-100 p-5 text-center">
                <div className="text-3xl font-bold text-gray-800">
                  {result.unanswered}
                </div>

                <p className="mt-1 font-semibold text-gray-800">
                  Unanswered
                </p>
              </div>

            </div>

            {/* Review */}
            <button
              onClick={() =>
                setShowReview(true)
              }
              className="mt-8 w-full rounded-xl bg-blue-700 py-4 text-lg font-bold text-white hover:bg-blue-800"
            >
              Review Answers
            </button>

            {/* Back */}
            <button
              onClick={() =>
                router.push(getPracticePath())
              }
              className="mt-3 w-full rounded-xl border-2 border-gray-300 py-4 text-lg font-bold text-gray-800 hover:bg-gray-50"
            >
              Back to Practice
            </button>

          </div>

        </div>
      </main>
    );
  }

  // ==========================================================
  // QUESTION SCREEN
  // ==========================================================

  const question =
    questions[currentQuestion];

  const selectedAnswer =
    answers[currentQuestion]
      ?.selected_option;

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="border-b bg-white px-4 py-4 shadow-sm sm:px-6">

        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">

          <div>
            <h1 className="font-bold text-gray-900">
              {topic}
            </h1>

            <p className="text-sm font-medium text-gray-700">
              {category}
            </p>
          </div>

          {timerMinutes !== "none" && (
            <div
              className={`rounded-xl px-4 py-2 font-mono text-lg font-bold ${
                secondsLeft <= 60
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              ⏱ {formatTime(secondsLeft)}
            </div>
          )}

        </div>

      </header>

      {/* Question area */}
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">

        {/* Question Palette */}
        <div className="mx-auto mb-6 max-w-4xl">

          <div className="rounded-2xl bg-white p-4 shadow-md">

            <div className="mb-3 flex items-center justify-between">

              <h2 className="font-bold text-gray-900">
                Questions
              </h2>

              <span className="text-sm font-medium text-gray-600">
                {answers.filter(
                  (answer) =>
                    answer.selected_option
                ).length}{" "}
                answered
              </span>

            </div>

            <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">

              {questions.map(
                (question, index) => {

                  const isAnswered =
                    answers[index]
                      ?.selected_option;

                  const isCurrent =
                    currentQuestion === index;

                  let buttonClass =
                    "border-gray-300 bg-white text-gray-800 hover:border-blue-500";

                  if (isCurrent) {
                    buttonClass =
                      "border-blue-700 bg-blue-700 text-white";
                  } else if (isAnswered) {
                    buttonClass =
                      "border-green-500 bg-green-100 text-green-800";
                  }

                  return (
                    <button
                      key={question.question_id}
                      type="button"
                      onClick={() =>
                        setCurrentQuestion(index)
                      }
                      className={`flex h-10 items-center justify-center rounded-lg border-2 text-sm font-bold transition ${buttonClass}`}
                    >
                      {index + 1}
                    </button>
                  );
                }
              )}

            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-gray-700">

              <div className="flex items-center gap-1">
                <span className="h-3 w-3 rounded bg-blue-700" />
                Current
              </div>

              <div className="flex items-center gap-1">
                <span className="h-3 w-3 rounded bg-green-500" />
                Answered
              </div>

              <div className="flex items-center gap-1">
                <span className="h-3 w-3 rounded border border-gray-400 bg-white" />
                Not answered
              </div>

            </div>

          </div>

        </div>

        {/* Question Card */}
        <div className="rounded-3xl bg-white p-5 shadow-lg sm:p-8">

          {/* Question number */}
          <div className="flex items-center justify-between">

            <p className="font-bold text-blue-700">
              Question {currentQuestion + 1} of{" "}
              {questions.length}
            </p>

            <p className="font-medium text-gray-700">
              {
                answers.filter(
                  (answer) =>
                    answer.selected_option
                ).length
              }{" "}
              answered
            </p>

          </div>

          {/* Question text */}
          <h2 className="mt-7 text-lg font-bold leading-8 text-gray-900 sm:text-xl">
            {question.question_text}
          </h2>

          {/* Options */}
          <div className="mt-7 space-y-3">

            {[
              ["A", question.option_a],
              ["B", question.option_b],
              ["C", question.option_c],
              ["D", question.option_d],
            ].map(([letter, text]) => (

              <button
                key={letter}
                type="button"
                onClick={() =>
                  selectAnswer(letter)
                }
                className={`flex w-full items-center rounded-xl border-2 p-4 text-left transition ${
                  selectedAnswer === letter
                    ? "border-blue-700 bg-blue-50"
                    : "border-gray-300 bg-white hover:border-blue-500"
                }`}
              >

                <span
                  className={`mr-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 font-bold ${
                    selectedAnswer === letter
                      ? "border-blue-700 bg-blue-700 text-white"
                      : "border-gray-400 text-gray-800"
                  }`}
                >
                  {letter}
                </span>

                <span className="font-medium text-gray-900">
                  {text}
                </span>

              </button>

            ))}

          </div>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between gap-3">

            <button
              type="button"
              onClick={() => {
                setCurrentQuestion(
                  (previous) =>
                    Math.max(
                      previous - 1,
                      0
                    )
                );
              }}
              disabled={
                currentQuestion === 0
              }
              className="rounded-xl border-2 border-gray-300 px-4 py-3 font-bold text-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Previous
            </button>

            {currentQuestion <
            questions.length - 1 ? (

              <button
                type="button"
                onClick={() => {
                  setCurrentQuestion(
                    (previous) =>
                      previous + 1
                  );
                }}
                className="rounded-xl bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800"
              >
                Next →
              </button>

            ) : (

              <button
                type="button"
                onClick={submitTest}
                disabled={submitting}
                className="rounded-xl bg-green-600 px-5 py-3 font-bold text-white hover:bg-green-700 disabled:opacity-60"
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Test"}
              </button>

            )}

          </div>

        </div>

      </div>

    </main>
  );
}