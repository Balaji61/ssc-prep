import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// ==========================================================
// GET QUESTIONS
// ==========================================================

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const subject = searchParams.get("subject");

  const category = searchParams.get("category");

  const topic = searchParams.get("topic");

  const count = Math.min(
    Math.max(Number(searchParams.get("count")) || 20, 1),
    50
  );

  if (!subject || !category || !topic) {
    return NextResponse.json(
      {
        error: "Missing practice information.",
      },
      {
        status: 400,
      }
    );
  }

  const { data, error } = await supabase.rpc(
    "get_random_questions",
    {
      p_subject: subject,
      p_category: category,
      p_topic: topic,
      p_count: count,
    }
  );

  if (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Unable to load questions.",
      },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json({
    questions: data ?? [],
  });
}

// ==========================================================
// SUBMIT ANSWERS
// ==========================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const answers = body.answers || [];

    if (!Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        {
          error: "No answers submitted.",
        },
        {
          status: 400,
        }
      );
    }

    const questionIds = answers.map(
      (answer: {
        question_id: string;
      }) => answer.question_id
    );

    // ======================================================
    // GET CORRECT ANSWERS + EXPLANATIONS
    // ======================================================

    const { data, error } = await supabase
      .from("questions")
      .select(
        `
        question_id,
        question_text,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_option,
        explanation
        `
      )
      .in("question_id", questionIds);

    if (error) {
      console.error(error);

      return NextResponse.json(
        {
          error: "Unable to check answers.",
        },
        {
          status: 500,
        }
      );
    }

    // ======================================================
    // CREATE QUESTION MAP
    // ======================================================

    const questionMap = new Map(
      (data ?? []).map(
        (question) => [
          question.question_id,
          question,
        ]
      )
    );

    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    // ======================================================
    // BUILD REVIEW
    // ======================================================

    const review = answers.map(
      (answer: {
        question_id: string;
        selected_option: string | null;
      }) => {
        const question = questionMap.get(
          answer.question_id
        );

        // --------------------------------------------------
        // IMPORTANT:
        // Normalize database answer and user answer
        // to uppercase so A/a, B/b, C/c, D/d match.
        // --------------------------------------------------

        const correctOption = question?.correct_option
          ? String(question.correct_option)
              .trim()
              .toUpperCase()
          : "";

        const selectedOption = answer.selected_option
          ? String(answer.selected_option)
              .trim()
              .toUpperCase()
          : null;

        let status:
          | "correct"
          | "wrong"
          | "unanswered";

        if (!selectedOption) {
          unanswered++;
          status = "unanswered";
        } else if (
          selectedOption === correctOption
        ) {
          correct++;
          status = "correct";
        } else {
          wrong++;
          status = "wrong";
        }

        return {
          question_id: answer.question_id,

          selected_option: selectedOption,

          // Always return the normalized correct answer
          // so the Review page can highlight it.
          correct_option: correctOption,

          option_a: question?.option_a || "",

          option_b: question?.option_b || "",

          option_c: question?.option_c || "",

          option_d: question?.option_d || "",

          explanation:
            question?.explanation || null,

          status,
        };
      }
    );

    // ======================================================
    // SCORE
    // ======================================================

    const total = answers.length;

    const score =
      total > 0
        ? Math.round((correct / total) * 100)
        : 0;

    return NextResponse.json({
      correct,
      wrong,
      unanswered,
      score,
      review,
    });
  } catch (error) {
    console.error(
      "Error submitting practice:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to submit practice test.",
      },
      {
        status: 500,
      }
    );
  }
}