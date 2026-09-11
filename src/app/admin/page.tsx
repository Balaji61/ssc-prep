"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type QuestionRow = {
  question_id: string;
  exam_name: string;
  subject: string;
  topic: string;
  category?: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
};

const REQUIRED_COLUMNS = [
  "question_id",
  "exam_name",
  "subject",
  "topic",
  "question_text",
  "option_a",
  "option_b",
  "option_c",
  "option_d",
  "correct_option",
];

function normalizeHeader(header: string) {
  return header
    .trim()
    .replace(/^"|"$/g, "")
    .toLowerCase()
    .replace(/\s+/g, "_");
}

function parseCSVLine(line: string) {
  const values: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const character = line[i];

    if (character === '"') {
      if (
        insideQuotes &&
        line[i + 1] === '"'
      ) {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (
      character === "," &&
      !insideQuotes
    ) {
      values.push(current.trim());
      current = "";
    } else {
      current += character;
    }
  }

  values.push(current.trim());

  return values;
}

export default function AdminPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] =
    useState(true);

  useEffect(() => {
    async function checkAdmin() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/admin/login");
        return;
      }

      setCheckingAuth(false);
    }

    checkAdmin();
  }, [router]);

  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-2xl bg-white px-8 py-6 shadow-lg">
          <p className="font-semibold text-gray-800">
            Checking admin access...
          </p>
        </div>
      </main>
    );
  }

  // your existing code continues here...
  const [fileName, setFileName] = useState("");

  const [rows, setRows] =
    useState<QuestionRow[]>([]);

  const [errors, setErrors] =
    useState<string[]>([]);

  const [message, setMessage] =
    useState("");

  const [importing, setImporting] =
    useState(false);

  const [importComplete, setImportComplete] =
    useState(false);

  function parseCSV(text: string) {
    const lines = text
      .split(/\r?\n/)
      .filter((line) => line.trim());

    if (lines.length < 2) {
      setErrors([
        "The file does not contain any question rows.",
      ]);
      return;
    }

    const originalHeaders =
      parseCSVLine(lines[0]);

    const headers =
      originalHeaders.map(normalizeHeader);

    const missingColumns =
      REQUIRED_COLUMNS.filter(
        (column) =>
          !headers.includes(column)
      );

    if (missingColumns.length > 0) {
      setErrors([
        `Missing columns: ${missingColumns.join(
          ", "
        )}`,
      ]);
      return;
    }

    const importedRows: QuestionRow[] = [];
    const validationErrors: string[] = [];

    for (
      let i = 1;
      i < lines.length;
      i++
    ) {
      const values =
        parseCSVLine(lines[i]);

      const row: Record<
        string,
        string
      > = {};

      headers.forEach(
        (header, index) => {
          row[header] =
            values[index] || "";
        }
      );

      const rowNumber = i + 1;

      const missingFields =
        REQUIRED_COLUMNS.filter(
          (column) =>
            !row[column] ||
            !row[column].trim()
        );

      if (
        missingFields.length > 0
      ) {
        validationErrors.push(
          `Row ${rowNumber}: missing ${missingFields.join(
            ", "
          )}`
        );

        continue;
      }

      const correctOption =
        row.correct_option
          .trim()
          .toUpperCase();

      if (
        !["A", "B", "C", "D"].includes(
          correctOption
        )
      ) {
        validationErrors.push(
          `Row ${rowNumber}: Correct_Option must be A, B, C or D`
        );

        continue;
      }

      importedRows.push({
        question_id:
          row.question_id.trim(),

        exam_name:
          row.exam_name.trim(),

        subject:
          row.subject.trim(),

        topic:
          row.topic.trim(),

        category:
          row.category?.trim() || undefined,

        question_text:
          row.question_text.trim(),

        option_a:
          row.option_a.trim(),

        option_b:
          row.option_b.trim(),

        option_c:
          row.option_c.trim(),

        option_d:
          row.option_d.trim(),

        correct_option:
          correctOption,
      });
    }

    setRows(importedRows);
    setErrors(validationErrors);
    setImportComplete(false);

    if (importedRows.length > 0) {
      setMessage(
        `${importedRows.length.toLocaleString()} valid questions ready for review.`
      );
    } else {
      setMessage("");
    }
  }

  function handleFile(file: File) {
    setFileName(file.name);
    setRows([]);
    setErrors([]);
    setMessage("");
    setImportComplete(false);

    if (
      !file.name
        .toLowerCase()
        .endsWith(".csv")
    ) {
      setErrors([
        "Please upload a CSV file.",
      ]);
      return;
    }

    const reader =
      new FileReader();

    reader.onload = (event) => {
      const text =
        event.target?.result;

      if (
        typeof text !== "string"
      ) {
        setErrors([
          "Could not read the file.",
        ]);
        return;
      }

      parseCSV(text);
    };

    reader.readAsText(file);
  }

  async function importQuestions() {
    if (
      rows.length === 0 ||
      importing
    ) {
      return;
    }

    setImporting(true);
    setMessage("");
    setErrors([]);

    try {
      // Get existing Question IDs first.
      const questionIds =
        rows.map(
          (row) => row.question_id
        );

      const { data: existingRows, error: existingError } =
        await supabase
          .from("questions")
          .select("question_id")
          .in(
            "question_id",
            questionIds
          );

      if (existingError) {
        throw existingError;
      }

      const existingIds = new Set(
        (existingRows || []).map(
          (row) => row.question_id
        )
      );

      const newRows =
        rows.filter(
          (row) =>
            !existingIds.has(
              row.question_id
            )
        );

      const duplicateCount =
        rows.length -
        newRows.length;

      if (newRows.length === 0) {
        setMessage(
          `Nothing imported. All ${rows.length.toLocaleString()} questions already exist in the database.`
        );

        setImportComplete(true);
        return;
      }

      // Insert in batches.
      const batchSize = 500;

      for (
        let i = 0;
        i < newRows.length;
        i += batchSize
      ) {
        const batch =
          newRows.slice(
            i,
            i + batchSize
          );

        const { error } =
          await supabase
            .from("questions")
            .insert(batch);

        if (error) {
          throw error;
        }
      }

      setMessage(
        `✓ ${newRows.length.toLocaleString()} questions imported successfully.${
          duplicateCount > 0
            ? ` ${duplicateCount.toLocaleString()} duplicate questions were skipped.`
            : ""
        }`
      );

      setImportComplete(true);

    } catch (error: any) {
      console.error("Import error:", error);

      const errorMessage =
        error?.message ||
        error?.details ||
        error?.hint ||
        "Unknown Supabase error";

      setErrors([
        `Import failed: ${errorMessage}`,
      ]);

    } finally {
      setImporting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 sm:py-12">

      <div className="mx-auto max-w-6xl">

        {/* Header */}

        <div className="mb-8">

          <p className="font-bold text-blue-700">
            ADMIN
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Question Bank Upload
          </h1>

          <p className="mt-3 max-w-2xl text-gray-700">
            Upload a CSV question bank,
            check the questions, and then
            import them into Supabase.
          </p>

        </div>

        {/* Upload card */}

        <div className="rounded-3xl bg-white p-6 shadow-lg sm:p-8">

          <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">

            <div className="text-5xl">
              📄
            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              Upload Question Bank
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              CSV files only
            </p>

            <label className="mt-6 inline-block cursor-pointer rounded-xl bg-blue-700 px-6 py-3 font-bold text-white transition hover:bg-blue-800">

              Choose CSV File

              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(event) => {
                  const file =
                    event.target
                      .files?.[0];

                  if (file) {
                    handleFile(file);
                  }
                }}
              />

            </label>

            {fileName && (
              <p className="mt-4 font-semibold text-gray-800">
                Selected: {fileName}
              </p>
            )}

          </div>

          {/* Success/message */}

          {message && (
            <div className="mt-6 rounded-xl border border-green-300 bg-green-50 p-4 font-semibold text-green-800">
              {message}
            </div>
          )}

          {/* Errors */}

          {errors.length > 0 && (
            <div className="mt-6 rounded-xl border border-red-300 bg-red-50 p-5">

              <h3 className="font-bold text-red-800">
                Issues found
              </h3>

              <ul className="mt-3 max-h-60 space-y-2 overflow-auto text-sm text-red-700">

                {errors.map(
                  (error, index) => (
                    <li key={index}>
                      • {error}
                    </li>
                  )
                )}

              </ul>

            </div>
          )}

        </div>

        {/* Preview */}

        {rows.length > 0 && (
          <div className="mt-8 rounded-3xl bg-white p-6 shadow-lg sm:p-8">

            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

              <div>

                <h2 className="text-2xl font-bold text-gray-900">
                  Preview
                </h2>

                <p className="mt-1 text-gray-600">
                  Showing the first 10 valid questions.
                </p>

              </div>

              <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-800">
                {rows.length.toLocaleString()} valid questions
              </div>

            </div>

            <div className="mt-6 overflow-x-auto">

              <table className="w-full min-w-[1000px] border-collapse text-sm">

                <thead>

                  <tr className="border-b bg-gray-100 text-left">

                    <th className="p-3">
                      ID
                    </th>

                    <th className="p-3">
                      Subject
                    </th>

                    <th className="p-3">
                      Topic
                    </th>

                    <th className="p-3">
                      Question
                    </th>

                    <th className="p-3">
                      Correct
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {rows
                    .slice(0, 10)
                    .map((row) => (

                      <tr
                        key={
                          row.question_id
                        }
                        className="border-b"
                      >

                        <td className="p-3 font-semibold">
                          {row.question_id}
                        </td>

                        <td className="p-3">
                          {row.subject}
                        </td>

                        <td className="p-3">
                          {row.topic}
                        </td>

                        <td className="max-w-xl p-3">
                          {row.question_text}
                        </td>

                        <td className="p-3 font-bold text-green-700">
                          {row.correct_option}
                        </td>

                      </tr>

                    ))}

                </tbody>

              </table>

            </div>

            {/* Import warning */}

            <div className="mt-6 rounded-xl border border-yellow-300 bg-yellow-50 p-4 text-sm text-yellow-900">

              <p className="font-bold">
                Before importing
              </p>

              <p className="mt-1">
                Only valid questions will be
                imported. Questions whose
                Question_ID already exists will
                automatically be skipped.
              </p>

            </div>

            {/* Import button */}

            <button
              onClick={importQuestions}
              disabled={
                importing ||
                importComplete
              }
              className={`mt-5 w-full rounded-xl py-4 font-bold text-white transition ${
                importComplete
                  ? "cursor-not-allowed bg-green-600"
                  : importing
                  ? "cursor-wait bg-blue-400"
                  : "bg-blue-700 hover:bg-blue-800"
              }`}
            >
              {importComplete
                ? "✓ Import Complete"
                : importing
                ? "Importing..."
                : `Import ${rows.length.toLocaleString()} Questions`}
            </button>

          </div>
        )}

      </div>

    </main>
  );
}