"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { approveQuestion, getQuestions } from "@/lib/api";
import { Check, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Question {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  status: string;
}

export default function CatalogueDetails() {
  const { catalogueId } = useParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const onApproveClick = async (approve: boolean, questionId: string) => {
    try {
      if (!catalogueId || Array.isArray(catalogueId)) return;
      const data = await approveQuestion(catalogueId, questionId, approve);

      if (data) {
        // Find the question by questionId
        const updatedQuestions = questions
          .map((question) => {
            if (question.id === questionId) {
              if (approve)
                return {
                  ...question,
                  status: "success",
                };
              else return null;
            }
            return question;
          })
          .filter((question) => question !== null);

        setQuestions(updatedQuestions);
      }
    } catch (error) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "Failed to perform your request.",
      });
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [catalogueId]);

  const fetchQuestions = async () => {
    if (!catalogueId || Array.isArray(catalogueId)) return;
    setLoading(true);
    try {
      const data = await getQuestions(catalogueId);
      setQuestions(data);
    } catch (error) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "Failed to fetch questions.",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      {!loading ? (
        <div className="p-6">
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold mb-4">Catalogue Questions</p>
            <Link href={`/admin/catalogues/${catalogueId}/questions/generate`}>
              <Button className="mb-4">Generate New Questions</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questions.map((q) => (
              <Card key={q.id} className="p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{q.question}</p>

                  {q.status === "PENDING" ? (
                    <div className="flex gap-x-2">
                      <Button onClick={() => onApproveClick(true, q.id)}>
                        <Check />
                      </Button>

                      <Button
                        onClick={() => onApproveClick(false, q.id)}
                        variant={"outline"}
                      >
                        <X />
                      </Button>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                <p>A: {q.optionA}</p>
                <p>B: {q.optionB}</p>
                <p>C: {q.optionC}</p>
                <p>D: {q.optionD}</p>
                <p className="mt-2 font-semibold">Correct: {q.correctOption}</p>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
        </div>
      )}
    </>
  );
}
