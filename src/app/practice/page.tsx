"use client";

import Link from "next/link";
import { useState } from "react";

const subjects = [
  {
    name: "General Awareness",
    description:
      "History, Geography, Polity, Economy, Science and Static GK",
    icon: "📚",
    href: "/practice/general-awareness",
    available: true,
  },
  {
    name: "English",
    description:
      "Grammar, Vocabulary, Reading Comprehension and more",
    icon: "✍️",
    href: "/practice/english",
    available: true,
  },
  {
    name: "Reasoning",
    description:
      "Analogy, Series, Coding-Decoding, Logic and more",
    icon: "🧠",
    href: "/practice/reasoning",
    available: true,
  },
  {
    name: "Quantitative Aptitude",
    description:
      "Arithmetic, Algebra, Geometry, Data Interpretation and more",
    icon: "🔢",
    href: "/practice/quantitative-aptitude",
    available: true,
  },
];

export default function PracticePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">

      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-6xl px-5">

          <div className="flex items-center justify-between py-4">

            {/* Logo */}
            <Link
              href="/"
              className="text-2xl font-extrabold tracking-tight text-blue-800"
              onClick={() => setMenuOpen(false)}
            >
              SSC PREP
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-7 text-base font-semibold sm:flex">

              <Link
                href="/practice"
                className="text-blue-700"
              >
                Practice
              </Link>

              <Link
                href="/mock-tests"
                className="text-gray-700 transition hover:text-blue-700"
              >
                Mock Tests
              </Link>

              <Link
                href="/dashboard"
                className="text-gray-700 transition hover:text-blue-700"
              >
                Dashboard
              </Link>

            </nav>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-2xl text-gray-800 shadow-sm transition hover:bg-gray-50 sm:hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? "✕" : "☰"}
            </button>

          </div>

          {/* Mobile Navigation */}
          {menuOpen && (
            <nav className="border-t border-gray-100 pb-4 pt-3 sm:hidden">

              <Link
                href="/practice"
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl bg-blue-50 px-4 py-3 text-base font-semibold text-blue-700"
              >
                📚 Practice
              </Link>

              <Link
                href="/mock-tests"
                onClick={() => setMenuOpen(false)}
                className="mt-1 block rounded-xl px-4 py-3 text-base font-semibold text-gray-800 transition hover:bg-blue-50 hover:text-blue-700"
              >
                📝 Mock Tests
              </Link>

              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="mt-1 block rounded-xl px-4 py-3 text-base font-semibold text-gray-800 transition hover:bg-blue-50 hover:text-blue-700"
              >
                📊 Dashboard
              </Link>

            </nav>
          )}

        </div>
      </header>

      {/* Main */}
      <div className="mx-auto max-w-6xl px-5 py-12">

        {/* Title */}
        <div className="text-center">

          <div className="text-5xl">
            📚
          </div>

          <h1 className="mt-5 text-4xl font-extrabold text-blue-900 sm:text-5xl">
            Practice Questions
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-700">
            Practice SSC questions by subject and topic.
            Choose a subject below to get started.
          </p>

        </div>

        {/* Subjects */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2">

          {subjects.map((subject) => {

            if (subject.available) {
              return (
                <Link
                  key={subject.name}
                  href={subject.href}
                  className="group rounded-3xl border-2 border-transparent bg-white p-7 shadow-md transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                >

                  <div className="flex items-start justify-between">

                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-4xl">
                      {subject.icon}
                    </div>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                      Available
                    </span>

                  </div>

                  <h2 className="mt-6 text-2xl font-bold text-gray-900 group-hover:text-blue-700">
                    {subject.name}
                  </h2>

                  <p className="mt-3 leading-7 text-gray-700">
                    {subject.description}
                  </p>

                  <div className="mt-6 font-bold text-blue-700">
                    Start Practicing →
                  </div>

                </Link>
              );
            }

            return (
              <div
                key={subject.name}
                className="rounded-3xl border-2 border-gray-200 bg-white p-7 shadow-sm"
              >

                <div className="flex items-start justify-between">

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-4xl grayscale">
                    {subject.icon}
                  </div>

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-bold text-gray-600">
                    Coming Soon
                  </span>

                </div>

                <h2 className="mt-6 text-2xl font-bold text-gray-700">
                  {subject.name}
                </h2>

                <p className="mt-3 leading-7 text-gray-600">
                  {subject.description}
                </p>

                <div className="mt-6 font-semibold text-gray-500">
                  Questions will be added soon
                </div>

              </div>
            );
          })}

        </div>

        {/* Mock Test Section */}
        <Link
          href="/mock-tests"
          className="group mt-12 block rounded-3xl bg-blue-900 p-7 text-white shadow-xl transition hover:-translate-y-1 hover:bg-blue-950 hover:shadow-2xl sm:p-10"
        >

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="font-semibold text-green-300">
                Available
              </p>

              <h2 className="mt-2 text-3xl font-extrabold group-hover:text-blue-100">
                SSC Mock Tests
              </h2>

              <p className="mt-3 max-w-xl leading-7 text-blue-100">
                Full exam-style tests with mixed questions,
                sectional timing, question navigation,
                mark for review and detailed performance review.
              </p>

              <div className="mt-5 font-bold text-white">
                Start a Mock Test →
              </div>

            </div>

            <div className="shrink-0 text-6xl">
              📝
            </div>

          </div>

        </Link>

      </div>

    </main>
  );
}