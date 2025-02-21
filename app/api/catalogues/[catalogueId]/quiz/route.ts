import { Option } from "@/types/Option";
import { calculateScore } from "@/utils/CalculateScore";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const answerSchema = z.array(
  z.object({
    question_id: z.string().uuid(),
    answer: z.enum([
      Option.OPTION_A,
      Option.OPTION_B,
      Option.OPTION_C,
      Option.OPTION_D,
    ]),
  })
);

const prisma = new PrismaClient();

// Submit Quiz

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

    return calculateScore(catalogueId, correctAnswers, validatedResult.data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create catalogue." },
      { status: 500 }
    );
  }
}
