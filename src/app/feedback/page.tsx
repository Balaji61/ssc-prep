"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function FeedbackPage() {
  const [feedbackType, setFeedbackType] = useState("general");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!message.trim()) {
      setError("Please enter your feedback.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {

      const { error: insertError } = await supabase
        .from("feedback")
        .insert({
          feedback_type: feedbackType,
          message: message.trim(),
          email: email.trim() || null,
        });

      if (insertError) {
        throw insertError;
      }

      setMessage("");
      setEmail("");
      setFeedbackType("general");
      setSuccess(true);
    } catch (err) {
      console.error("Feedback submission error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Help us improve SSC PREP
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Found a problem or have an idea? Send us your feedback.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="feedbackType"
                className="mb-2 block text-sm font-medium text-slate-800"
              >
                What would you like to tell us?
              </label>

              <select
                id="feedbackType"
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-slate-500"
              >
                <option value="general">General feedback</option>
                <option value="website_problem">Website problem</option>
                <option value="feature_request">Feature suggestion</option>
                <option value="question_error">Question error</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-slate-800"
              >
                Your feedback
              </label>

              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what happened or what you would like improved..."
                rows={6}
                required
                className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-800"
              >
                Email <span className="font-normal text-slate-500">(optional)</span>
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-500"
              />

              <p className="mt-2 text-xs text-slate-500">
                Only provide your email if you would like a response.
              </p>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                Thank you! Your feedback has been submitted.
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}