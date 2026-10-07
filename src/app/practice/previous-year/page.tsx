"use client";

import Link from "next/link";
import { useState } from "react";

const subjects = [
  {
    name: "Reasoning",
    value: "Reasoning",
    description: "Practice SSC CGL General Intelligence and Reasoning questions.",
  },
  {
    name: "General Awareness",
    value: "General Studies",
    description: "Practice SSC CGL General Awareness previous year questions.",
  },
  {
    name: "Quantitative Aptitude",
    value: "Quantitative Aptitude",
    description: "Practice SSC CGL Maths previous year questions.",
  },
  {
    name: "English",
    value: "English",
    description: "Practice SSC CGL English previous year questions.",
  },
];

export default function PreviousYearPracticePage() {
  const [year, setYear] = useState("2025");

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
            href="/practice"
            className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back to Practice
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Page heading */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            SSC CGL Previous Year Practice
          </h1>

          <p className="mt-2 text-gray-600">
            Practice previous year SSC CGL questions by year and subject.
          </p>
        </div>

        {/* Year Selection */}
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            1. Select Year
          </h2>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* 2025 */}
            <button
              onClick={() => setYear("2025")}
              className={`rounded-xl border p-5 text-left transition ${
                year === "2025"
                  ? "border-blue-600 bg-blue-50 ring-2 ring-blue-200"
                  : "border-gray-200 bg-white hover:border-blue-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  SSC CGL 2025
                </h3>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  Available
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-600">
                Practice questions from SSC CGL 2025.
              </p>
            </button>

            {/* 2024 */}
            <div className="cursor-not-allowed rounded-xl border border-gray-200 bg-white p-5 opacity-60">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  SSC CGL 2024
                </h3>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                  Coming Soon
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-600">
                Previous year questions will be added soon.
              </p>
            </div>

            {/* 2023 */}
            <div className="cursor-not-allowed rounded-xl border border-gray-200 bg-white p-5 opacity-60">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">
                  SSC CGL 2023
                </h3>

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                  Coming Soon
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-600">
                Previous year questions will be added soon.
              </p>
            </div>
          </div>
        </section>

        {/* Subject Selection */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            2. Select Subject
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            {subjects.map((subject) => (
              <Link
                key={subject.value}
                href={`/practice/previous-year/questions?year=${year}&subject=${encodeURIComponent(
                  subject.value
                )}`}
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-400 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600">
                    {subject.name}
                  </h3>

                  <span className="text-2xl">→</span>
                </div>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {subject.description}
                </p>

                <div className="mt-5 text-sm font-semibold text-blue-600">
                  Choose subject →
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}