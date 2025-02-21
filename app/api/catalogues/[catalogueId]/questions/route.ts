import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: any }) {
  const { catalogueId } = await params;

  if (!catalogueId) {
    return NextResponse.json(
      { error: "Invalid Catalogue ID" },
      { status: 400 }
    );
  }

  try {
    const questions = await prisma.question.findMany({
      where: { catalogueId },
    });

    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
