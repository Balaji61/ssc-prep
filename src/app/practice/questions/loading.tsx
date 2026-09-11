export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-5">
      <div className="flex flex-col items-center text-center">

        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-700" />

        <h1 className="mt-6 text-xl font-bold text-gray-900">
          Loading questions...
        </h1>

        <p className="mt-2 text-gray-600">
          Please wait a moment.
        </p>

      </div>
    </main>
  );
}