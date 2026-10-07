import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const SUBJECTS = [
  { dbSubject: "reasoning", section: "Reasoning" },
  { dbSubject: "General Studies", section: "General Awareness" },
  { dbSubject: "Quantitative Aptitude", section: "Quantitative Aptitude" },
  { dbSubject: "English", section: "English" },
];

const QUESTIONS_PER_SECTION = 25;

const CORRECT_MARKS = 2;
const NEGATIVE_MARKS = 0.5;

// ======================================================
// GET — CREATE PREVIOUS YEAR MOCK TEST
// ======================================================

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");

    if (!year) {
      return NextResponse.json(
        { error: "Year is required." },
        { status: 400 }
      );
    }

    const examName = `SSC CGL ${year}`;

    const allQuestions: any[] = [];

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
        .not("option_d", "is", null);

      if (error) {
        console.error(
          `Error fetching ${subject.section} questions:`,
          error
        );

        return NextResponse.json(
          {
            error: `Failed to load ${subject.section} questions.`,
          },
          { status: 500 }
        );
      }

      if (!data || data.length < QUESTIONS_PER_SECTION) {
        return NextResponse.json(
          {
            error: `Not enough ${subject.section} questions available for ${examName}.`,
            available: data?.length ?? 0,
            required: QUESTIONS_PER_SECTION,
          },
          { status: 400 }
        );
      }

      // Randomize only inside this section.
      const shuffled = [...data].sort(() => Math.random() - 0.5);

      const selected = shuffled
        .slice(0, QUESTIONS_PER_SECTION)
        .map((question, index) => ({
          ...question,
          section: subject.section,
          question_number: index + 1,
        }));

      allQuestions.push(...selected);
    }

    const numberedQuestions = allQuestions.map((question, index) => ({
      ...question,
      test_question_number: index + 1,
    }));

    return NextResponse.json({
      success: true,
      year,
      exam_name: examName,
      total_questions: numberedQuestions.length,
      questions: numberedQuestions,
    });
  } catch (error) {
    console.error("Previous year mock GET error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while creating the previous year test.",
      },
      { status: 500 }
    );
  }
}

// ======================================================
// POST — GRADE PREVIOUS YEAR MOCK TEST
// ======================================================

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const year = body.year;
    const answers = body.answers ?? {};
    const marked = body.marked ?? {};
    const questionIds = body.questionIds ?? [];

    if (!year) {
      return NextResponse.json(
        { error: "Year is required." },
        { status: 400 }
      );
    }

    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return NextResponse.json(
        { error: "Question IDs are required." },
        { status: 400 }
      );
    }

    if (questionIds.length !== 100) {
      return NextResponse.json(
        {
          error: "A complete previous year test must contain 100 questions.",
        },
        { status: 400 }
      );
    }

    const examName = `SSC CGL ${year}`;

    // --------------------------------------------------
    // FETCH CORRECT ANSWERS FROM SUPABASE
    // --------------------------------------------------

    const { data: questions, error } = await supabase
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
      .in("question_id", questionIds);

    if (error) {
      console.error("Error fetching grading questions:", error);

      return NextResponse.json(
        {
          error: "Failed to retrieve answers for grading.",
        },
        { status: 500 }
      );
    }

    if (!questions || questions.length !== questionIds.length) {
      return NextResponse.json(
        {
          error:
            "Some questions could not be found. The test cannot be graded safely.",
        },
        { status: 400 }
      );
    }

    // --------------------------------------------------
    // CREATE LOOKUP
    // --------------------------------------------------

    const questionMap = new Map(
      questions.map((question) => [
        question.question_id,
        question,
      ])
    );

    // --------------------------------------------------
    // GRADE
    // --------------------------------------------------

    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    let positiveMarks = 0;
    let negativeMarks = 0;

    const review: any[] = [];

    for (const questionId of questionIds) {
      const question = questionMap.get(questionId);

      if (!question) {
        continue;
      }

      const userAnswer = answers[questionId] ?? null;

      const normalizedUserAnswer =
        typeof userAnswer === "string"
          ? userAnswer.trim().toUpperCase()
          : null;

      const correctOption =
        typeof question.correct_option === "string"
          ? question.correct_option.trim().toUpperCase()
          : "";

      let status: "correct" | "wrong" | "unanswered";

      if (!normalizedUserAnswer) {
        unanswered++;
        status = "unanswered";
      } else if (normalizedUserAnswer === correctOption) {
        correct++;
        positiveMarks += CORRECT_MARKS;
        status = "correct";
      } else {
        wrong++;
        negativeMarks += NEGATIVE_MARKS;
        status = "wrong";
      }

      review.push({
        question_id: question.question_id,
        exam_name: question.exam_name,
        subject: question.subject,
        category: question.category,
        topic: question.topic,
        question_text: question.question_text,
        option_a: question.option_a,
        option_b: question.option_b,
        option_c: question.option_c,
        option_d: question.option_d,
        selected_option: normalizedUserAnswer,
        correct_option: correctOption,
        explanation: question.explanation,
        marked: Boolean(marked[questionId]),
        status,
      });
    }

    // --------------------------------------------------
    // FINAL SCORE
    // --------------------------------------------------

    const finalScore = positiveMarks - negativeMarks;

    const percentage = Number(
      ((finalScore / 200) * 100).toFixed(2)
    );

    const accuracy =
      correct + wrong > 0
        ? Number(
            ((correct / (correct + wrong)) * 100).toFixed(2)
          )
        : 0;

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    return NextResponse.json({
      success: true,

      year,
      exam_name: examName,

      total_questions: questionIds.length,

      answered: correct + wrong,
      unanswered,

      correct,
      wrong,

      positive_marks: positiveMarks,
      negative_marks: negativeMarks,

      final_score: finalScore,
      max_score: 200,

      percentage,
      accuracy,

      review,

      marked_count: Object.values(marked).filter(Boolean).length,
    });
  } catch (error) {
    console.error("Previous year mock POST error:", error);

    return NextResponse.json(
      {
        error:
          "Something went wrong while submitting the previous year test.",
      },
      { status: 500 }
    );
  }
}