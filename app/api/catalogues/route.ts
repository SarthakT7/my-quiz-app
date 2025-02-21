import { Catalogue } from "@/types/Catalogue";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient();

const catalogueSchema = z.object({
  category: z.nativeEnum(Catalogue),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

// GET all catalogues
export async function GET() {
  try {
    const catalogues = await prisma.catalogue.findMany();
    return NextResponse.json(catalogues);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get catalogues." },
      { status: 500 }
    );
  }
}

// POST a new catalogue
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedResult = catalogueSchema.safeParse(body);

    if (!validatedResult.success) {
      return NextResponse.json(
        { error: validatedResult.error.errors },
        { status: 400 }
      );
    }

    const newCatalogue = await prisma.catalogue.create({
      data: validatedResult.data,
    });

    return NextResponse.json({ catalogue: newCatalogue });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create catalogue." },
      { status: 500 }
    );
  }
}
