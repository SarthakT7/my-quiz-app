import { generateQuestionsFromText } from "@/utils/GenerateQuestions";
import { PrismaClient, QuestionStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const textSchema = z.object({
  text: z.string().min(10, "Text must be of length 10"),
});

const prisma = new PrismaClient();
export async function POST(req: Request, { params }: { params: Promise<any> }) {
  try {
    const body = await req.json();
    
    const validatedRequest = textSchema.safeParse(body);

    const { catalogueId } = await params;

    if (!validatedRequest.success) {
      return NextResponse.json(
        { error: "Failed to validate input" },
        { status: 400 }
      );
    }

    const generatedQuestions = await generateQuestionsFromText(
      validatedRequest.data.text
    );


    if (!Array.isArray(generatedQuestions))
      return NextResponse.json(
        { error: "Not a valid JSON Array" },
        { status: 500 }
      );

    const mappedQuestions = generatedQuestions.map((question) => {
      return {
        catalogueId: catalogueId,
        topic: question["topic"],
        question: question["question"],
        optionA: question["optionA"],
        optionB: question["optionB"],
        optionC: question["optionC"],
        optionD: question["optionD"],
        correctOption: question["correctOption"],
        status: "PENDING" as QuestionStatus,
      };
    });

    const dbResponse = await prisma.question.createManyAndReturn({
      data: mappedQuestions,
    });

    return NextResponse.json({ questions: dbResponse });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 }
    );
  }
}
