import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

// Website subject name -> exact Supabase subject name
const SUBJECT_MAP = {
  Reasoning: "reasoning",
  "General Studies": "General Studies",
  "Quantitative Aptitude": "Quantitative Aptitude",
  English: "English",
};

const ALLOWED_COUNTS = [10, 25, 30];

function shuffle(array) {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const year = searchParams.get("year");
    const subject = searchParams.get("subject");
    const countParam = searchParams.get("count");

    if (!year) {
      return NextResponse.json(
        { error: "Year is required." },
        { status: 400 }
      );
    }

    if (!subject) {
      return NextResponse.json(
        { error: "Subject is required." },
        { status: 400 }
      );
    }

    // Check that the selected website subject is valid
    if (!Object.prototype.hasOwnProperty.call(SUBJECT_MAP, subject)) {
      return NextResponse.json(
        { error: "Invalid subject." },
        { status: 400 }
      );
    }

    // Get the exact subject name stored in Supabase
    const databaseSubject = SUBJECT_MAP[subject];

    const examName = `SSC CGL ${year}`;

    /*
     * First request:
     * Check how many usable questions are available.
     */
    if (!countParam) {
      const { data, error } = await supabase
        .from("questions")
        .select("question_id")
        .eq("exam_name", examName)
        .eq("subject", databaseSubject)
        .not("question_text", "is", null)
        .not("option_a", "is", null)
        .not("option_b", "is", null)
        .not("option_c", "is", null)
        .not("option_d", "is", null)
        .not("correct_option", "is", null);

      if (error) {
        console.error("Question count error:", error);

        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }

      const total = data?.length ?? 0;

      const counts = ALLOWED_COUNTS.filter(
        (count) => total >= count
      );

      console.log(
        `Previous Year Practice: ${examName} / ${databaseSubject} = ${total} usable questions`
      );

      return NextResponse.json({
        year,
        exam_name: examName,
        subject,
        database_subject: databaseSubject,
        total_available: total,
        available_counts: counts,
      });
    }

    /*
     * Second request:
     * Actually load the requested number of questions.
     */

    const count = Number(countParam);

    if (!ALLOWED_COUNTS.includes(count)) {
      return NextResponse.json(
        { error: "Invalid question count." },
        { status: 400 }
      );
    }

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
        option_d
      `)
      .eq("exam_name", examName)
      .eq("subject", databaseSubject)
      .not("question_text", "is", null)
      .not("option_a", "is", null)
      .not("option_b", "is", null)
      .not("option_c", "is", null)
      .not("option_d", "is", null)
      .not("correct_option", "is", null);

    if (error) {
      console.error("Practice question error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length < count) {
      return NextResponse.json(
        {
          error: `Only ${
            data?.length ?? 0
          } usable questions are available. ${count} are required.`,
        },
        { status: 400 }
      );
    }

    // Randomly select the requested number
    const questions = shuffle(data)
      .slice(0, count)
      .map((question, index) => ({
        ...question,
        question_number: index + 1,
      }));

    return NextResponse.json({
      year,
      exam_name: examName,
      subject,
      total_questions: questions.length,
      questions,
    });
  } catch (error) {
    console.error(
      "Previous Year Practice GET error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load questions.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const questionIds = body?.questionIds || [];
    const answers = body?.answers || {};

    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return NextResponse.json(
        { error: "Question IDs were not provided." },
        { status: 400 }
      );
    }

    /*
     * Get the correct answers and explanations
     * only after the user submits.
     */
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
      .in("question_id", questionIds);

    if (error) {
      console.error("Practice result error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Questions could not be found." },
        { status: 500 }
      );
    }

    const questionMap = new Map(
      data.map((question) => [
        question.question_id,
        question,
      ])
    );

    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    const review = questionIds
      .map((questionId) => {
        const question = questionMap.get(questionId);

        if (!question) {
          return null;
        }

        const selectedAnswer = answers[questionId];

        const isUnanswered =
          selectedAnswer === null ||
          selectedAnswer === undefined ||
          selectedAnswer === "";

        let status;

        if (isUnanswered) {
          unanswered++;
          status = "unanswered";
        } else {
          const selected = String(
            selectedAnswer
          ).toLowerCase();

          const correctAnswer = String(
            question.correct_option
          ).toLowerCase();

          if (selected === correctAnswer) {
            correct++;
            status = "correct";
          } else {
            wrong++;
            status = "wrong";
          }
        }

        return {
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
          selected_option: isUnanswered
            ? null
            : selectedAnswer,
          correct_option: question.correct_option,
          explanation: question.explanation || null,
          status,
        };
      })
      .filter((question) => question !== null);

    const total = questionIds.length;
    const attempted = correct + wrong;

    const percentage =
      total > 0
        ? (correct / total) * 100
        : 0;

    const accuracy =
      attempted > 0
        ? (correct / attempted) * 100
        : 0;

    return NextResponse.json({
      success: true,
      total_questions: total,
      attempted,
      correct,
      wrong,
      unanswered,
      percentage,
      accuracy,
      review,
    });
  } catch (error) {
    console.error(
      "Previous Year Practice POST error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to calculate result.",
      },
      { status: 500 }
    );
  }
}