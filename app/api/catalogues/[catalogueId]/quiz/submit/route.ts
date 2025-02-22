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
 * Processes a POST request to submit quiz answers and compute the quiz score.
 *
 * This function parses the incoming request's JSON payload and validates it against a defined answer schema.
 * Upon successful validation, it retrieves the correct answers from the database using the provided catalogue
 * identifier, calculates the quiz score, and returns the result as a JSON response.
 *
 * If the payload fails validation, it returns a 400 status with the validation errors. Any other errors result
 * in a 500 status with a generic error message.
 *
 * @param req - The HTTP request containing the quiz submission data.
 * @param params - An object resolving to route parameters including the catalogue identifier.
 * @returns A JSON response with the quiz score or an error message.
 */

export async function POST(
  req: Request,
  { params }: { params: { catalogueId: string } }
) {
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
      { error: "Failed to submit quiz." },
      { status: 500 }
    );
  }
}
