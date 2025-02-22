import { Option } from "@/types/Option";
import { calculateScore } from "@/utils/CalculateScore";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const answerSchema = z.array(
  z.object({
    question_id: z.string().uuid(),
    answer: z.nullable(
      z.enum([
        Option.OPTION_A,
        Option.OPTION_B,
        Option.OPTION_C,
        Option.OPTION_D,
      ])
    ),
  })
);

const prisma = new PrismaClient();

/**
 * Handles the submission of quiz answers.
 *
 * This function parses the request's JSON payload, validates the answers against a predefined schema, and retrieves
 * the correct answers for the quiz associated with the provided catalogueId route parameter. It calculates the quiz score
 * using the validated input and returns the result as a JSON response. If the validation fails, it responds with a 400 status
 * and detailed error information; if an unexpected error occurs during processing, it responds with a 500 status and a generic error message.
 *
 * @returns A JSON response containing the calculated score or error details.
 */

export async function POST(req: Request, { params }: { params: Promise<any> }) {
  try {
    const body = await req.json();
    const { catalogueId } = await params;

    const validatedResult = answerSchema.safeParse(body);

    if (!validatedResult.success) {
      return NextResponse.json(
        { error: validatedResult.error.errors },
        { status: 400 }
      );
    }

    const correctAnswers = await prisma.question.findMany({
      where: {
        catalogueId: catalogueId,
      },
    });

    const response = calculateScore(
      catalogueId,
      correctAnswers,
      validatedResult.data
    );

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create catalogue." },
      { status: 500 }
    );
  }
}
