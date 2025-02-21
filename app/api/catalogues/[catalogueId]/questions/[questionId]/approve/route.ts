import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient();

const approvalSchema = z.object({
  approve: z.boolean(),
});

export async function POST(req: Request, { params }: { params: Promise<any> }) {
  try {
    const body = await req.json();

    const { questionId } = await params;

    const validated = approvalSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors },
        { status: 400 }
      );
    }

    const { approve } = validated.data;

    if (approve) {
      await prisma.question.update({
        data: {
          status: "APPROVED",
        },
        where: {
          status: "PENDING",
          id: questionId,
        },
      });

      return NextResponse.json({
        message: "Question approved and added to database.",
      });
    } else {
      await prisma.question.delete({ where: { id: questionId } });
      return NextResponse.json({ message: "Question rejected." });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process question." },
      { status: 500 }
    );
  }
}
