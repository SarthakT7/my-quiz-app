"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { generateQuestions, getCatalogue } from "@/lib/api";
import { Catalogue } from "@prisma/client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function GenerateQuestions() {
  const params = useParams<{ catalogueId: string }>();
  const router = useRouter();
  const [input, setInput] = useState<string>("");
  const [catalogue, setCatalogue] = useState<Catalogue>();

  const onGenerateClick = async () => {
    try {
      await generateQuestions(params.catalogueId, input);
      router.push(`/admin/catalogues/${params.catalogueId}/questions`);
    } catch (error) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "Failed to perform your request.",
      });
    }
  };

  useEffect(() => {
    async function fetchCatalogue() {
      const data = await getCatalogue(params.catalogueId);
      setCatalogue(data);
    }

    fetchCatalogue();
  }, [params.catalogueId]);

  const handleTextAreaInputChange = (
    e: any
  ) => {
    setInput(e.target.value);
  };
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-[600px] h-[420px]">
        <CardHeader>
          <CardTitle>Generate Questions for {catalogue?.title} </CardTitle>
          <CardDescription>
            Give some input and leave AI to the rest.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4 ">
              <Textarea
                onChange={handleTextAreaInputChange}
                placeholder="Feed some data."
                className="h-[250px]"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href={`/admin/catalogues/${params.catalogueId}`}>
            <Button variant="outline">Back</Button>
          </Link>
          <Button onClick={() => onGenerateClick()}>Generate</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
