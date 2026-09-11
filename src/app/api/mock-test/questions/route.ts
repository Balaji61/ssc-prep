import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

const MOCK_SECTIONS = [
  {
    name: "General Intelligence and Reasoning",
    shortName: "Reasoning",
    subject: "reasoning",
  },
  {
    name: "General Awareness",
    shortName: "General Awareness",
    subject: "General Studies",
  },
  {
    name: "Quantitative Aptitude",
    shortName: "Quantitative Aptitude",
    subject: "Quantitative Aptitude",
  },
  {
    name: "English Comprehension",
    shortName: "English",
    subject: "English",
  },
];

function shuffle<T>(array: T[]): T[] {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [result[i], result[j]] = [
      result[j],
      result[i],
    ];
  }

  return result;
}

// ==========================================================
// GET — LOAD MOCK TEST
// ==========================================================

export async function GET() {
  try {
    const sections = [];

    for (const section of MOCK_SECTIONS) {
      const { data, error } = await supabase
        .from("questions")
        .select(`
          question_id,
          subject,
          category,
          topic,
          question_text,
          option_a,
          option_b,
          option_c,
          option_d
        `)
        .eq("subject", section.subject)
        .not("question_text", "is", null)
        .not("option_a", "is", null)
        .not("option_b", "is", null)
        .not("option_c", "is", null)
        .not("option_d", "is", null)
        .not("correct_option", "is", null);

      if (error) {
        console.error(
          `Supabase error for ${section.shortName}:`,
          error
        );

        return NextResponse.json(
          {
            error:
              `Database error while loading ${section.shortName}: ${error.message}`,
          },
          { status: 500 }
        );
      }

      if (!data || data.length < 25) {
        return NextResponse.json(
          {
            error:
              `${section.shortName} has only ${
                data?.length ?? 0
              } usable questions. 25 are required.`,
          },
          { status: 500 }
        );
      }

      const selectedQuestions =
        shuffle(data).slice(0, 25);

      sections.push({
        name: section.name,
        shortName: section.shortName,
        duration: 15 * 60,
        questions: selectedQuestions,
      });
    }

    return NextResponse.json({
      sections,
    });
  } catch (error) {
    console.error(
      "Mock test GET error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load mock test.",
      },
      { status: 500 }
    );
  }
}

// ==========================================================
// POST — CALCULATE RESULT + REVIEW DATA
// ==========================================================

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();

    const answers =
      (body?.answers || {}) as Record<
        string,
        string | null
      >;

    const questionIds =
      (body?.questionIds || []) as string[];

    const marked =
      (body?.marked || {}) as Record<
        string,
        boolean
      >;

    if (
      !Array.isArray(questionIds) ||
      questionIds.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Question IDs were not provided.",
        },
        { status: 400 }
      );
    }

    // ======================================================
    // GET QUESTIONS + CORRECT ANSWERS
    // ======================================================

    const { data, error } =
      await supabase
        .from("questions")
        .select(`
          question_id,
          subject,
          category,
          topic,
          question_text,
          option_a,
          option_b,
          option_c,
          option_d,
          correct_option,
          explanation
        `)
        .in(
          "question_id",
          questionIds
        );

    if (error) {
      console.error(
        "Supabase review error:",
        error
      );

      return NextResponse.json(
        {
          error:
            `Database error while calculating result: ${error.message}`,
        },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          error:
            "Questions could not be found.",
        },
        { status: 500 }
      );
    }

    // ======================================================
    // CREATE QUESTION LOOKUP
    // ======================================================

    const questionMap =
      new Map(
        data.map((question) => [
          question.question_id,
          question,
        ])
      );

    // ======================================================
    // RESULT COUNTS
    // ======================================================

    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    // ======================================================
    // REVIEW DATA
    // ======================================================

    const review = questionIds
      .map((questionId) => {
        const question =
          questionMap.get(questionId);

        if (!question) {
          return null;
        }

        const selectedAnswer =
          answers[questionId];

        const isUnanswered =
          selectedAnswer ===
            null ||
          selectedAnswer ===
            undefined ||
          selectedAnswer === "";

        let status:
          | "correct"
          | "wrong"
          | "unanswered";

        if (isUnanswered) {
          unanswered++;
          status = "unanswered";
        } else {
          const selected =
            String(
              selectedAnswer
            ).toLowerCase();

          const correctAnswer =
            String(
              question.correct_option
            ).toLowerCase();

          if (
            selected ===
            correctAnswer
          ) {
            correct++;
            status = "correct";
          } else {
            wrong++;
            status = "wrong";
          }
        }

        return {
          question_id:
            question.question_id,

          subject:
            question.subject,

          category:
            question.category,

          topic:
            question.topic,

          question_text:
            question.question_text,

          option_a:
            question.option_a,

          option_b:
            question.option_b,

          option_c:
            question.option_c,

          option_d:
            question.option_d,

          selected_option:
            isUnanswered
              ? null
              : selectedAnswer,

          correct_option:
            question.correct_option,

          explanation:
            question.explanation || null,

          status,

          marked:
            Boolean(
              marked[questionId]
            ),
        };
      })
      .filter(
        (
          question
        ): question is NonNullable<
          typeof question
        > => question !== null
      );

    // ======================================================
    // MARKING
    // ======================================================

    const attempted =
      correct + wrong;

    const positiveMarks =
      correct * 2;

    const negativeMarks =
      wrong * 0.5;

    const finalScore =
      positiveMarks -
      negativeMarks;

    const maxMarks = 200;

    const percentage =
      (finalScore / maxMarks) *
      100;

    const accuracy =
      attempted > 0
        ? (correct / attempted) *
          100
        : 0;

    return NextResponse.json({
      totalQuestions: 100,
      attempted,
      correct,
      wrong,
      unanswered,
      positiveMarks,
      negativeMarks,
      finalScore,
      maxMarks,
      percentage,
      accuracy,
      review,
    });
  } catch (error) {
    console.error(
      "Mock test POST error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to calculate mock test result.",
      },
      { status: 500 }
    );
  }
}