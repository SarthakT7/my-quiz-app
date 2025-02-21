"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { getQuestions } from "@/lib/api";
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

export default function QuizPage() {
  const { catalogueId } = useParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchQuestions() {
      try {
        if (!catalogueId || Array.isArray(catalogueId)) return;
        const data = await getQuestions(catalogueId);
        setQuestions(data);
      } catch (error) {
        toast({ title: "Error", description: "Failed to load questions." });
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [catalogueId, toast]);

  const handleSelect = (questionId: string, option: string) => {
    setAnswers((prev: any) => ({ ...prev, [questionId]: option }));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Quiz</h2>
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <Card key={q.id} className="p-4">
              <p className="font-semibold mb-2">{q.question}</p>
              <RadioGroup
                onValueChange={(value: any) => handleSelect(q.id, value)}
                value={answers[q.id] || ""}
              >
                <div key="A" className="flex items-center space-x-2">
                  <RadioGroupItem value={q.optionA} id={q.id + "A"} />
                  <label htmlFor={q.id + "A"}>{q.optionA}</label>
                </div>
                <div key="B" className="flex items-center space-x-2">
                  <RadioGroupItem value={q.optionB} id={q.id + "B"} />
                  <label htmlFor={q.id + "B"}>{q.optionB}</label>
                </div>{" "}
                <div key="C" className="flex items-center space-x-2">
                  <RadioGroupItem value={q.optionC} id={q.id + "C"} />
                  <label htmlFor={q.id + "C"}>{q.optionC}</label>
                </div>{" "}
                <div key="D" className="flex items-center space-x-2">
                  <RadioGroupItem value={q.optionD} id={q.id + "D"} />
                  <label htmlFor={q.id + "D"}>{q.optionD}</label>
                </div>
              </RadioGroup>
            </Card>
          ))}
          <Button className="w-full mt-4">Submit</Button>
        </div>
      )}
    </div>
  );
}
