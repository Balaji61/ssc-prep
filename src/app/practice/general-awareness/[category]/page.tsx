import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Topic = {
  topic: string;
  question_count: number;
};

type PageProps = {
  params: Promise<{
    category: string;
  }>;
};

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;

  const decodedCategory = decodeURIComponent(category);

  const { data, error } = await supabase.rpc(
    "get_topic_counts",
    {
      p_subject: "General Studies",
      p_category: decodedCategory,
    }
  );

  const topics: Topic[] = (data ?? []).map((item: any) => ({
    topic: item.topic,
    question_count: Number(item.question_count),
  }));

  const totalQuestions = topics.reduce(
    (total, item) => total + item.question_count,
    0
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-6 py-12">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-10 text-center">

          <Link
            href="/practice/general-awareness"
            className="mb-5 inline-block text-sm font-medium text-blue-700 hover:text-blue-900"
          >
            ← Back to Categories
          </Link>

          <h1 className="text-4xl font-bold text-blue-900">
            {decodedCategory}
          </h1>

          <p className="mt-3 text-gray-600">
            {totalQuestions.toLocaleString()} questions available
          </p>

        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-center text-red-700">
            Unable to load topics. Please try again.
          </div>
        )}

        {/* All Questions */}
        {!error && topics.length > 0 && (
          <Link
            href={`/practice/general-awareness/${encodeURIComponent(
              decodedCategory
            )}/all`}
            className="mb-8 block rounded-2xl bg-blue-700 p-7 text-white shadow-md transition hover:-translate-y-1 hover:bg-blue-800 hover:shadow-xl"
          >
            <h2 className="text-2xl font-bold">
              All {decodedCategory}
            </h2>

            <p className="mt-2 text-blue-100">
              Practice questions from all topics in this category.
            </p>

            <div className="mt-5 font-semibold">
              {totalQuestions.toLocaleString()} questions →
            </div>
          </Link>
        )}

        {/* Topics */}
        {!error && topics.length > 0 && (
          <>
            <h2 className="mb-5 text-2xl font-bold text-gray-800">
              Choose a specific topic
            </h2>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {topics.map((item) => (
                <Link
                  key={item.topic}
                  href={`/practice/general-awareness/${encodeURIComponent(
                    decodedCategory
                  )}/${encodeURIComponent(item.topic)}`}
                  className="group rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="text-3xl">📚</div>

                  <h3 className="mt-4 text-xl font-bold text-gray-800 group-hover:text-blue-700">
                    {item.topic}
                  </h3>

                  <p className="mt-2 text-sm text-gray-600">
                    {item.question_count.toLocaleString()} questions
                  </p>

                  <div className="mt-5 font-semibold text-blue-700">
                    Practice →
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* No topics */}
        {!error && topics.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow">
            <p className="text-gray-600">
              No topics found in this category.
            </p>
          </div>
        )}

      </div>
    </main>
  );
}