import Link from "next/link";
import { supabase } from "@/lib/supabase";

const categoryIcons: { [key: string]: string } = {
  History: "🏛️",
  Geography: "🌍",
  Polity: "⚖️",
  Economy: "💰",
  Agriculture: "🌾",
  Industries: "🏭",
  "Government & Education": "🏛️",
  Computer: "💻",
  "Static GK": "📚",
  Miscellaneous: "❓",
};

type Category = {
  category: string;
  question_count: number;
};

export default async function GeneralStudiesPage() {
  const { data, error } = await supabase.rpc(
    "get_category_counts",
    {
      p_subject: "General Studies",
    }
  );

  const categories: Category[] = (data ?? []).map((item: any) => ({
    category: item.category,
    question_count: Number(item.question_count),
  }));

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-6 py-12">
      <div className="mx-auto max-w-6xl">

        <div className="mb-10 text-center">
          <Link
            href="/practice"
            className="mb-5 inline-block text-sm font-medium text-blue-700 hover:text-blue-900"
          >
            ← Back to Subjects
          </Link>

          <h1 className="text-4xl font-bold text-blue-900">
            General Studies
          </h1>

          <p className="mt-3 text-gray-600">
            Choose a category to start practicing.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-center text-red-700">
            Unable to load categories.
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((item) => (
            <Link
              key={item.category}
              href={`/practice/general-awareness/${encodeURIComponent(
                item.category
              )}`}
              className="group rounded-2xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="text-4xl">
                {categoryIcons[item.category] || "📚"}
              </div>

              <h2 className="mt-4 text-xl font-bold text-gray-800 group-hover:text-blue-700">
                {item.category}
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