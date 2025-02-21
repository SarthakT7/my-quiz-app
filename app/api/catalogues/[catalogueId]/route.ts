import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function GET(req: Request, { params }: { params: Promise<any> }) {
  try {
    const { catalogueId } = await params;

    const catalogue = await prisma.catalogue.findUnique({
      where: { id: catalogueId },
    });
    return NextResponse.json(catalogue);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get catalogue." },
      { status: 500 }
    );
  }
}
