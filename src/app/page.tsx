"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">

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
            <nav className="hidden items-center gap-6 text-base font-semibold sm:flex">

              <Link
                href="/practice"
                className="text-gray-700 transition hover:text-blue-700"
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

              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-gray-700 transition hover:bg-blue-50 hover:text-blue-700"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="rounded-lg bg-blue-700 px-4 py-2 text-white transition hover:bg-blue-800"
              >
                Sign Up
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
                className="block rounded-xl px-4 py-3 text-base font-semibold text-gray-800 transition hover:bg-blue-50 hover:text-blue-700"
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

              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="mt-1 block rounded-xl px-4 py-3 text-base font-semibold text-gray-800 transition hover:bg-blue-50 hover:text-blue-700"
              >
                🔐 Login
              </Link>

              <Link
                href="/signup"
                onClick={() => setMenuOpen(false)}
                className="mt-1 block rounded-xl bg-blue-700 px-4 py-3 text-base font-semibold text-white transition hover:bg-blue-800"
              >
                ✨ Sign Up
              </Link>

            </nav>
          )}

        </div>
      </header>

      {/* Hero */}
      <section className="px-5 pb-12 pt-14 sm:pb-16 sm:pt-20">

        <div className="mx-auto max-w-4xl text-center">

          <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-800">
            🎯 SSC Exam Preparation
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-blue-950 sm:text-6xl">
            Prepare Smarter.
            <br />
            Practice Better.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-700 sm:text-xl">
            Practice SSC questions topic by topic and take
            realistic mock tests to prepare for your exam.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              href="/practice"
              className="rounded-xl bg-blue-700 px-7 py-4 text-lg font-bold text-white shadow-md transition hover:bg-blue-800"
            >
              Start Practicing →
            </Link>

            <Link
              href="/mock-tests"
              className="rounded-xl border-2 border-gray-300 bg-white px-7 py-4 text-lg font-bold text-gray-800 transition hover:border-blue-400 hover:bg-blue-50"
            >
              Take a Mock Test
            </Link>

          </div>

        </div>

      </section>

      {/* Main cards */}
      <section className="px-5 pb-16">

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">

          {/* Practice */}
          <Link
            href="/practice"
            className="group rounded-3xl bg-white p-7 shadow-lg transition hover:-translate-y-1 hover:shadow-xl sm:p-9"
          >

            <div className="flex items-start justify-between">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-4xl">
                📚
              </div>

              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                Available
              </span>

            </div>

            <h2 className="mt-7 text-2xl font-bold text-gray-900 group-hover:text-blue-700">
              Practice by Topic
            </h2>

            <p className="mt-3 leading-7 text-gray-700">
              Choose a subject, category and topic.
              Practice questions at your own pace with
              optional timers.
            </p>

            <div className="mt-6 font-bold text-blue-700">
              Start Practice →
            </div>

          </Link>

          {/* Mock Test */}
          <Link
            href="/mock-tests"
            className="group rounded-3xl bg-white p-7 shadow-lg transition hover:-translate-y-1 hover:shadow-xl sm:p-9"
          >

            <div className="flex items-start justify-between">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-4xl">
                📝
              </div>

              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                Available
              </span>

            </div>

            <h2 className="mt-7 text-2xl font-bold text-gray-900 group-hover:text-blue-700">
              SSC Mock Tests
            </h2>

            <p className="mt-3 leading-7 text-gray-700">
              Experience exam-style tests with mixed
              questions, timers, question navigation,
              results and detailed review.
            </p>

            <div className="mt-6 font-bold text-blue-700">
              Take a Mock Test →
            </div>

          </Link>

        </div>

      </section>

      {/* Account section */}
      <section className="border-y bg-blue-50 px-5 py-14">

        <div className="mx-auto max-w-4xl text-center">

          <p className="font-bold text-blue-700">
            YOUR PREPARATION
          </p>

          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Keep your SSC preparation organized
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-700">
            Create an SSC PREP account to prepare for your exams
            and access your personal dashboard. More progress
            tracking features will be added over time.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              href="/signup"
              className="rounded-xl bg-blue-700 px-6 py-3 font-bold text-white transition hover:bg-blue-800"
            >
              Create Free Account
            </Link>

            <Link
              href="/login"
              className="rounded-xl border-2 border-gray-300 bg-white px-6 py-3 font-bold text-gray-800 transition hover:border-blue-400 hover:bg-blue-50"
            >
              Login
            </Link>

          </div>

        </div>

      </section>

      {/* Features */}
      <section
        id="features"
        className="border-y bg-white px-5 py-16"
      >

        <div className="mx-auto max-w-6xl">

          <div className="text-center">

            <p className="font-bold text-blue-700">
              BUILT FOR SSC PREPARATION
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Everything you need to prepare
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-gray-700">
              Practice topic by topic and test yourself with
              realistic SSC mock tests.
            </p>

          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <Feature
              icon="🎯"
              title="Topic Practice"
              text="Practice exactly the topic you want to improve."
            />

            <Feature
              icon="⏱️"
              title="Timed Practice"
              text="Use timers when you want to simulate exam pressure."
            />

            <Feature
              icon="🧭"
              title="Question Navigation"
              text="Move between questions and use the question palette."
            />

            <Feature
              icon="📊"
              title="Review Answers"
              text="See your correct, wrong and unanswered questions."
            />

          </div>

        </div>

      </section>

      {/* Subjects preview */}
      <section className="px-5 py-16">

        <div className="mx-auto max-w-6xl">

          <div className="text-center">

            <p className="font-bold text-blue-700">
              SUBJECTS
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
              Your SSC preparation, in one place
            </h2>

          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">

            <SubjectCard
              icon="📚"
              name="General Awareness"
              href="/practice/general-awareness"
              available
            />

            <SubjectCard
              icon="✍️"
              name="English"
              href="/practice/english"
              available
            />

            <SubjectCard
              icon="🧠"
              name="Reasoning"
              href="/practice/reasoning"
              available
            />

            <SubjectCard
              icon="🔢"
              name="Quantitative Aptitude"
              href="/practice/quantitative-aptitude"
              available
            />

          </div>

        </div>

      </section>

      {/* Footer */}
      <footer className="border-t bg-white px-5 py-8">

        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-sm text-gray-600 sm:flex-row">

          <p>
            © 2026 SSC PREP
          </p>

          <div className="flex items-center gap-5">

            <Link
              href="/feedback"
              className="font-semibold text-gray-600 transition hover:text-blue-700"
            >
              Feedback
            </Link>

            <Link
              href="/contact"
              className="font-semibold text-gray-600 transition hover:text-blue-700"
            >
              Contact
            </Link>

            <p>
              Built for SSC preparation
            </p>

          </div>

        </div>

      </footer>

    </main>
  );
}


/* ================================
   Feature Card
================================ */

function Feature({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">

      <div className="text-3xl">
        {icon}
      </div>

      <h3 className="mt-4 font-bold text-gray-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-gray-700">
        {text}
      </p>

    </div>
  );
}


/* ================================
   Subject Card
================================ */

function SubjectCard({
  icon,
  name,
  href,
  available = false,
}: {
  icon: string;
  name: string;
  href: string;
  available?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-2xl border-2 p-5 transition hover:-translate-y-1 hover:shadow-md ${
        available
          ? "border-blue-200 bg-white"
          : "border-gray-200 bg-gray-50"
      }`}
    >

      <div className="text-3xl">
        {icon}
      </div>

      <h3
        className={`mt-4 font-bold ${
          available
            ? "text-gray-900"
            : "text-gray-600"
        }`}
      >
        {name}
      </h3>

      <p
        className={`mt-2 text-sm font-semibold ${
          available
            ? "text-green-700"
            : "text-gray-500"
        }`}
      >
        {available
          ? "Available"
          : "Coming Soon"}
      </p>

    </Link>
  );
}