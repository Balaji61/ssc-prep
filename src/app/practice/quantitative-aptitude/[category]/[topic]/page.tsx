"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function QuantitativeAptitudePracticeSetupPage() {
  const params = useParams();
  const router = useRouter();

  const category = decodeURIComponent(
    String(params.category || "")
  );

  const topic = decodeURIComponent(
    String(params.topic || "")
  );

  const [availableQuestions, setAvailableQuestions] = useState(0);
  const [questionCount, setQuestionCount] = useState(10);
  const [timer, setTimer] = useState("15");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuestionCount() {
      try {
        const { count, error } = await supabase
          .from("questions")
          .select("question_id", {
            count: "exact",
            head: true,
          })
          .eq("subject", "Quantitative Aptitude")
          .eq("category", category)
          .eq("topic", topic)
          .not("question_text", "is", null)
          .not("option_a", "is", null)
          .not("option_b", "is", null)
          .not("option_c", "is", null)
          .not("option_d", "is", null)
          .not("correct_option", "is", null);

        if (error) {
          console.error(
            "Question count error:",
            error
          );
          return;
        }

        const availableCount = count || 0;

        console.log(
          "AVAILABLE QUESTIONS:",
          availableCount
        );

        setAvailableQuestions(availableCount);

        if (availableCount >= 20) {
          setQuestionCount(20);
        } else if (availableCount >= 10) {
          setQuestionCount(10);
        } else {
          setQuestionCount(availableCount);
        }

      } catch (error) {
        console.error(
          "Error loading question count:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadQuestionCount();
  }, [category, topic]);

  function getQuestionOptions() {
    const options = [10, 20, 30, 50];

    const availableOptions = options.filter(
      (option) => option <= availableQuestions
    );

    if (
      availableQuestions > 0 &&
      availableQuestions < 10
    ) {
      return [availableQuestions];
    }

    return availableOptions;
  }

  function startPractice() {
    if (
      availableQuestions === 0 ||
      questionCount === 0
    ) {
      return;
    }

    const url =
      `/practice/questions` +
      `?subject=${encodeURIComponent(
        "Quantitative Aptitude"
      )}` +
      `&category=${encodeURIComponent(category)}` +
      `&topic=${encodeURIComponent(topic)}` +
      `&count=${questionCount}` +
      `&timer=${encodeURIComponent(timer)}`;

    router.push(url);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-700" />

          <p className="mt-4 text-lg font-medium text-gray-700">
            Checking available questions...
          </p>

        </div>
      </main>
    );
  }

  if (availableQuestions === 0) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">

        <div className="mx-auto max-w-2xl text-center">

          <button
            onClick={() => router.back()}
            className="mb-8 font-bold text-blue-700 hover:text-blue-900"
          >
            ← Back
          </button>

          <div className="rounded-3xl bg-white p-10 shadow-lg">

            <div className="text-5xl">
              📚
            </div>

            <h1 className="mt-5 text-2xl font-bold text-gray-900">
              No Questions Available
            </h1>

            <p className="mt-3 text-gray-700">
              There are no complete questions available
              for this topic yet.
            </p>

          </div>

        </div>

      </main>
    );
  }

  const questionOptions = getQuestionOptions();

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-8 sm:px-6 sm:py-12">

      <div className="mx-auto max-w-2xl">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="mb-8 font-bold text-blue-700 hover:text-blue-900"
        >
          ← Back
        </button>

        {/* Header */}
        <div className="mb-8 text-center">

          <div className="text-5xl">
            🔢
          </div>

          <h1 className="mt-4 text-3xl font-bold text-blue-900 sm:text-4xl">
            {topic}
          </h1>

          <p className="mt-3 text-lg font-medium text-gray-700">
            {category}
          </p>

          <p className="mt-2 text-gray-600">
            {availableQuestions.toLocaleString()} questions available
          </p>

        </div>

        {/* Setup Card */}
        <div className="rounded-3xl bg-white p-6 shadow-lg sm:p-8">

          {/* Number of Questions */}
          <section>

            <h2 className="text-xl font-bold text-gray-900">
              Number of Questions
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Choose how many questions you want to practice.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">

              {questionOptions.map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  className={`rounded-xl border-2 py-3 font-bold transition ${
                    questionCount === count
                      ? "border-blue-700 bg-blue-700 text-white"
                      : "border-gray-300 bg-white text-gray-800 hover:border-blue-500"
                  }`}
                >
                  {count}
                </button>
              ))}

            </div>

          </section>

          {/* Timer */}
          <section className="mt-10">

            <h2 className="text-xl font-bold text-gray-900">
              Timer
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Choose whether you want a time limit.
            </p>

            <div className="mt-5 space-y-3">

              {[
                {
                  value: "none",
                  label: "No Timer",
                },
                {
                  value: "15",
                  label: "15 Minutes",
                },
                {
                  value: "30",
                  label: "30 Minutes",
                },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTimer(option.value)}
                  className={`flex w-full items-center justify-between rounded-xl border-2 p-4 text-left transition ${
                    timer === option.value
                      ? "border-blue-700 bg-blue-50"
                      : "border-gray-300 bg-white hover:border-blue-400"
                  }`}
                >

                  <span className="font-bold text-gray-900">
                    {option.label}
                  </span>

                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                      timer === option.value
                        ? "border-blue-700"
                        : "border-gray-400"
                    }`}
                  >
                    {timer === option.value && (
                      <span className="h-3 w-3 rounded-full bg-blue-700" />
                    )}
                  </span>

                </button>
              ))}

            </div>

          </section>

          {/* Start */}
          <button
            type="button"
            onClick={startPractice}
            className="mt-10 w-full rounded-xl bg-blue-700 py-4 text-lg font-bold text-white transition hover:bg-blue-800"
          >
            Start Practice →
          </button>

        </div>

      </div>

    </main>
  );
}