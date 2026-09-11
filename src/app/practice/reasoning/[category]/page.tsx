import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Topic = {
  topic: string;
  question_count: number;
};

export default async function ReasoningCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);

  const { data, error } = await supabase.rpc(
    "get_topic_counts",
    {
      p_subject: "reasoning",
      p_category: decodedCategory,
    }
  );

  const topics: Topic[] = (data ?? []).map((item: any) => ({
    topic: item.topic,
    question_count: Number(item.question_count),
  }));

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-6 py-12">
      <div className="mx-auto max-w-6xl">

        <div className="mb-10 text-center">
          <Link
            href="/practice/reasoning"
            className="mb-5 inline-block text-sm font-medium text-blue-700 hover:text-blue-900"
          >
            ← Back to Reasoning
          </Link>

          <h1 className="text-4xl font-bold capitalize text-blue-900">
            {decodedCategory}
          </h1>

          <p className="mt-3 text-gray-600">
            Choose a topic to start practicing.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-center text-red-700">
            Unable to load topics.
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((item) => (
            <Link
              key={item.topic}
              href={`/practice/reasoning/${encodeURIComponent(
                decodedCategory
              )}/${encodeURIComponent(item.topic)}`}
              className="group rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="text-4xl">
                🧠
              </div>

              <h2 className="mt-4 text-xl font-bold text-gray-800 group-hover:text-blue-700">
                {item.topic}
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                {item.question_count.toLocaleString()} questions available
              </p>

              <div className="mt-5 font-semibold text-blue-700">
                Practice →
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}