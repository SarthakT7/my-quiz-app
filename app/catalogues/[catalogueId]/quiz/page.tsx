"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { UserAnswer } from "@/interfaces/UserAnswer";
import { getQuestions, submitQuiz } from "@/lib/api";
import { Question } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function QuizPage() {
  const { catalogueId } = useParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<UserAnswer[]>([]); // Initialize as empty
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      if (!catalogueId || Array.isArray(catalogueId) || !answers) return;
      const response = await submitQuiz(catalogueId, answers);
      toast({ title: "Success", description: "Quiz submitted successfully!" });

      localStorage.setItem("quizResults", JSON.stringify(response));
      router.push(`/catalogues/${catalogueId}/quiz/result`);
    } catch (error) {
      toast({ title: "Error", description: "Failed to submit quiz." });
    }
  };

  useEffect(() => {
    async function fetchQuestions() {
      try {
        if (!catalogueId || Array.isArray(catalogueId)) return;
        const data = await getQuestions(catalogueId);
        setQuestions(data);

        // Initialize answers based on questions
        const initialAnswers: UserAnswer[] = data.map((question: Question) => ({
          question_id: question.id,
          answer: null,
        }));
        setAnswers(initialAnswers);
      } catch (error) {
        toast({ title: "Error", description: "Failed to load questions." });
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [catalogueId, toast]);

  const handleSelect = (questionId: string, option: string) => {
    const updatedAnswers = answers.map((answerObj) => {
      if (answerObj.question_id === questionId) {
        return { ...answerObj, answer: option } as UserAnswer;
      }
      return answerObj;
    });
    setAnswers(updatedAnswers);
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
              >
                <div key="A" className="flex items-center space-x-2">
                  <RadioGroupItem value={"Option A"} id={q.id + "A"} />
                  <label htmlFor={q.id + "A"}>{q.optionA}</label>
                </div>
                <div key="B" className="flex items-center space-x-2">
                  <RadioGroupItem value={"Option B"} id={q.id + "B"} />
                  <label htmlFor={q.id + "B"}>{q.optionB}</label>
                </div>{" "}
                <div key="C" className="flex items-center space-x-2">
                  <RadioGroupItem value={"Option C"} id={q.id + "C"} />
                  <label htmlFor={q.id + "C"}>{q.optionC}</label>
                </div>{" "}
                <div key="D" className="flex items-center space-x-2">
                  <RadioGroupItem value={"Option D"} id={q.id + "D"} />
                  <label htmlFor={q.id + "D"}>{q.optionD}</label>
                </div>
              </RadioGroup>
            </Card>
          ))}
          <Button onClick={handleSubmit} className="w-full mt-4">
            Submit
          </Button>
        </div>
      )}
    </div>
  );
}
