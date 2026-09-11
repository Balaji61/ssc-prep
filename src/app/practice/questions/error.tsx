"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-5">

      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-lg">

        <div className="text-5xl">
          ⚠️
        </div>

        <h1 className="mt-5 text-2xl font-bold text-gray-900">
          Something went wrong
        </h1>

        <p className="mt-3 leading-7 text-gray-600">
          We couldn't load the questions right now.
          Please try again.
        </p>

        <button
          onClick={() => reset()}
          className="mt-7 w-full rounded-xl bg-blue-700 py-3.5 font-bold text-white transition hover:bg-blue-800"
        >
          Try Again
        </button>

      </div>

    </main>
  );
}