"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AnswerSheet } from "@/interfaces/AnswerSheet";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function QuizResultsPage() {
  const { catalogueId } = useParams();
  const [results, setResults] = useState<AnswerSheet>({} as AnswerSheet);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function fetchResults() {
      try {
        if (!catalogueId || Array.isArray(catalogueId)) return;
        const results = localStorage.getItem("quizResults");
        if (!results) return;
        setResults(JSON.parse(results) as AnswerSheet);
        localStorage.removeItem("quizResults");
      } catch (_) {
        toast({ title: "Error", description: "Failed to load results." });
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [catalogueId, toast]);

  if (loading) {
    return <p className="text-center">Loading results...</p>;
  }

  if (!results.answers?.length) {
    return <p className="text-center text-red-500">No results found.</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
      <Card className="p-4 mb-4">
        <p className="font-semibold">
          Score: {results.score} / {results.total}
        </p>
      </Card>

      <div className="space-y-4">
        {results.answers.map((ans) => {
          const { question } = ans;
          const options = [
            { key: "Option A", value: question.optionA },
            { key: "Option B", value: question.optionB },
            { key: "Option C", value: question.optionC },
            { key: "Option D", value: question.optionD },
          ];

          return (
            <Card key={question.id} className="p-4">
              <p className="font-semibold mb-2">{question.question}</p>

              {/* Display all options with clear labels */}
              <div className="grid grid-cols-1 gap-2">
                {options.map((option) => (
                  <div
                    key={option.key}
                    className={`p-2 rounded-md border ${
                      option.key === question.correctOption
                        ? "border-green-500 bg-green-100"
                        : option.key === ans.user_choice
                        ? "border-red-500 bg-red-100"
                        : "border-gray-300"
                    }`}
                  >
                    <span className="font-medium">{option.key}: </span>
                    {option.value}
                  </div>
                ))}
              </div>

              {/* User's Choice & Correct Choice */}
              <div className="mt-3">
                <p className="text-blue-600 font-semibold">
                  Your Answer: {ans.user_choice}
                </p>
                <p className="text-green-600 font-semibold">
                  Correct Answer: {question.correctOption}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      <Button
        className="w-full mt-4"
        onClick={() => router.push(`/catalogues/${catalogueId}/quiz`)}
      >
        Retry Quiz
      </Button>
    </div>
  );
}
