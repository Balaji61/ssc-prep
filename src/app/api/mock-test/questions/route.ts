import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

const SUBJECTS = [
  {
    dbSubject: "reasoning",
    section: "Reasoning",
  },
  {
    dbSubject: "General Studies",
    section: "General Awareness",
  },
  {
    dbSubject: "Quantitative Aptitude",
    section: "Quantitative Aptitude",
  },
  {
    dbSubject: "English",
    section: "English",
  },
];

const QUESTIONS_PER_SECTION = 25;

const CORRECT_MARKS = 2;
const NEGATIVE_MARKS = 0.5;

// ==========================================================
// GET — LOAD PREVIOUS YEAR MOCK TEST
// ==========================================================

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const year = searchParams.get("year");

    if (!year) {
      return NextResponse.json(
        {
          error: "Year is required.",
        },
        { status: 400 }
      );
    }

    const examName = `SSC CGL ${year}`;

    const allQuestions: any[] = [];

    // ======================================================
    // LOAD EACH SECTION
    // ======================================================

    for (const subject of SUBJECTS) {
      const { data, error } = await supabase
        .from("questions")
        .select(`
          question_id,
          exam_name,
          subject,
          category,
          topic,
          question_text,
          option_a,
          option_b,
          option_c,
          option_d,
          explanation
        `)
        .eq("exam_name", examName)
        .eq("subject", subject.dbSubject)
        .not("question_text", "is", null)
        .not("option_a", "is", null)
        .not("option_b", "is", null)
        .not("option_c", "is", null)
        .not("option_d", "is", null)
        .not("correct_option", "is", null);

      if (error) {
        console.error(
          `Supabase error for ${subject.section}:`,
          error
        );

        return NextResponse.json(
          {
            error:
              `Database error while loading ${subject.section}: ${error.message}`,
          },
          { status: 500 }
        );
      }

      if (!data || data.length < QUESTIONS_PER_SECTION) {
        return NextResponse.json(
          {
            error:
              `${subject.section} has only ${
                data?.length ?? 0
              } usable questions for ${examName}. 25 are required.`,
          },
          { status: 400 }
        );
      }

      // ====================================================
      // RANDOMIZE ONLY INSIDE THIS SECTION
      // ====================================================

      const shuffled = [...data];

      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(
          Math.random() * (i + 1)
        );

        [shuffled[i], shuffled[j]] = [
          shuffled[j],
          shuffled[i],
        ];
      }

      const selectedQuestions = shuffled
        .slice(0, QUESTIONS_PER_SECTION)
        .map((question, index) => ({
          ...question,

          section: subject.section,

          question_number: index + 1,
        }));

      allQuestions.push(...selectedQuestions);
    }

    // ======================================================
    // ADD OVERALL QUESTION NUMBERS
    // ======================================================

    const numberedQuestions = allQuestions.map(
      (question, index) => ({
        ...question,

        test_question_number: index + 1,
      })
    );

    // ======================================================
    // RETURN TEST
    // ======================================================

    return NextResponse.json({
      success: true,

      year,

      exam_name: examName,

      total_questions: numberedQuestions.length,

      questions: numberedQuestions,
    });
  } catch (error) {
    console.error(
      "Previous year mock GET error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load previous year mock test.",
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

    // ======================================================
    // GET REQUEST DATA
    // ======================================================

    const year = body?.year;

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

    // ======================================================
    // VALIDATE YEAR
    // ======================================================

    if (!year) {
      return NextResponse.json(
        {
          error: "Year is required.",
        },
        { status: 400 }
      );
    }

    // ======================================================
    // VALIDATE QUESTION IDS
    // ======================================================

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

    if (questionIds.length !== 100) {
      return NextResponse.json(
        {
          error:
            "A complete previous year test must contain 100 questions.",
        },
        { status: 400 }
      );
    }

    const examName = `SSC CGL ${year}`;

    console.log(
      `Previous year test submission received: ${examName}`
    );

    console.log(
      `Questions to grade: ${questionIds.length}`
    );

    // ======================================================
    // GET QUESTIONS + CORRECT ANSWERS
    // ======================================================

    const { data, error } = await supabase
      .from("questions")
      .select(`
        question_id,
        exam_name,
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
      .eq("exam_name", examName)
      .in(
        "question_id",
        questionIds
      );

    // ======================================================
    // DATABASE ERROR
    // ======================================================

    if (error) {
      console.error(
        "Supabase previous year grading error:",
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

    // ======================================================
    // QUESTIONS NOT FOUND
    // ======================================================

    if (!data) {
      return NextResponse.json(
        {
          error:
            "Questions could not be found.",
        },
        { status: 500 }
      );
    }

    if (data.length !== questionIds.length) {
      console.error(
        `Expected ${questionIds.length} questions but received ${data.length}.`
      );

      return NextResponse.json(
        {
          error:
            `Some questions could not be found for SSC CGL ${year}. Expected ${questionIds.length}, received ${data.length}.`,
        },
        { status: 400 }
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

        // --------------------------------------------------
        // USER ANSWER
        // --------------------------------------------------

        const selectedAnswer =
          answers[questionId];

        const isUnanswered =
          selectedAnswer === null ||
          selectedAnswer === undefined ||
          selectedAnswer === "";

        // --------------------------------------------------
        // NORMALIZE ANSWERS
        // --------------------------------------------------

        const normalizedSelected =
          isUnanswered
            ? null
            : String(selectedAnswer)
                .trim()
                .toUpperCase();

        const normalizedCorrect =
          String(
            question.correct_option
          )
            .trim()
            .toUpperCase();

        // --------------------------------------------------
        // DETERMINE STATUS
        // --------------------------------------------------

        let status:
          | "correct"
          | "wrong"
          | "unanswered";

        if (isUnanswered) {
          unanswered++;

          status = "unanswered";
        } else if (
          normalizedSelected ===
          normalizedCorrect
        ) {
          correct++;

          status = "correct";
        } else {
          wrong++;

          status = "wrong";
        }

        // --------------------------------------------------
        // RETURN REVIEW QUESTION
        // --------------------------------------------------

        return {
          question_id:
            question.question_id,

          exam_name:
            question.exam_name,

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
            normalizedSelected,

          correct_option:
            normalizedCorrect,

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
        > =>
          question !== null
      );

    // ======================================================
    // MARKING
    // SSC CGL STYLE
    // +2 CORRECT
    // -0.50 WRONG
    // ======================================================

    const answered =
      correct + wrong;

    const positiveMarks =
      correct * CORRECT_MARKS;

    const negativeMarks =
      wrong * NEGATIVE_MARKS;

    const finalScore =
      positiveMarks -
      negativeMarks;

    const maxScore = 200;

    // ======================================================
    // PERCENTAGE
    // ======================================================

    const percentage =
      Number(
        (
          (finalScore / maxScore) *
          100
        ).toFixed(2)
      );

    // ======================================================
    // ACCURACY
    // ======================================================

    const accuracy =
      answered > 0
        ? Number(
            (
              (correct / answered) *
              100
            ).toFixed(2)
          )
        : 0;

    // ======================================================
    // MARKED COUNT
    // ======================================================

    const markedCount =
      Object.values(marked).filter(
        Boolean
      ).length;

    // ======================================================
    // LOG RESULT
    // ======================================================

    console.log(
      `Previous year result: Correct=${correct}, Wrong=${wrong}, Unanswered=${unanswered}, Score=${finalScore}`
    );

    // ======================================================
    // RETURN RESULT
    // ======================================================

    return NextResponse.json({
      success: true,

      year,

      exam_name: examName,

      total_questions: 100,

      answered,

      unanswered,

      correct,

      wrong,

      positive_marks: positiveMarks,

      negative_marks: negativeMarks,

      final_score: finalScore,

      max_score: maxScore,

      percentage,

      accuracy,

      marked_count: markedCount,

      review,
    });
  } catch (error) {
    console.error(
      "Previous year mock POST error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to calculate previous year mock test result.",
      },
      { status: 500 }
    );
  }
}