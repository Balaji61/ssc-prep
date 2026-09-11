"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">

      <div className="mx-auto max-w-md">

        <div className="mb-8 text-center">

          <div className="text-5xl">
            🔐
          </div>

          <h1 className="mt-4 text-3xl font-extrabold text-gray-900">
            Admin Login
          </h1>

          <p className="mt-2 text-gray-600">
            Sign in to manage the SSC question bank.
          </p>

        </div>

        <div className="rounded-3xl bg-white p-6 shadow-lg sm:p-8">

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            <div>

              <label
                htmlFor="email"
                className="mb-2 block font-semibold text-gray-800"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
                autoComplete="email"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                placeholder="Admin email"
              />

            </div>

            <div>

              <label
                htmlFor="password"
                className="mb-2 block font-semibold text-gray-800"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                required
                autoComplete="current-password"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
                placeholder="Admin password"
              />

            </div>

            {error && (
              <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-700 py-3.5 font-bold text-white transition hover:bg-blue-800 disabled:cursor-wait disabled:bg-blue-400"
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </button>

          </form>

        </div>

      </div>

    </main>
  );
}