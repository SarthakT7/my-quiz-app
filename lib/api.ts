import { AnswerSheet } from "@/interfaces/AnswerSheet";
import { UserAnswer } from "@/interfaces/UserAnswer";

export async function getCatalogues() {
  const response = await fetch("/api/catalogues");
  if (!response.ok) throw new Error("Failed to fetch catalogues");
  return response.json();
}

export async function getCatalogue(catalogueId: string) {
  const response = await fetch(`/api/catalogues/${catalogueId}`);
  if (!response.ok) throw new Error("Failed to fetch catalogue");
  return response.json();
}

export async function getQuestions(catalogueId: string) {
  const response = await fetch(`/api/catalogues/${catalogueId}/questions`);
  if (!response.ok) throw new Error("Failed to fetch questions");
  return response.json();
}

export async function generateQuestions(catalogueId: string, text: string) {
  const response = await fetch(
    `/api/catalogues/${catalogueId}/questions/generate`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    }
  );

  if (!response.ok) throw new Error("Failed to generate questions");
  return response.json();
}

export async function approveQuestion(
  catalogueId: string,
  questionId: string,
  approve: boolean
) {
  const response = await fetch(
    `/api/catalogues/${catalogueId}/questions/${questionId}/approve`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approve }),
    }
  );

  if (!response.ok) throw new Error("Failed to approve question");
  return response.json();
}

export async function submitQuiz(
  catalogueId: string,
  userAnswers: UserAnswer[]
): Promise<AnswerSheet> {
  const response = await fetch(`/api/catalogues/${catalogueId}/quiz/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userAnswers),
  });

  if (!response.ok) throw new Error("Failed to submit quiz.");
  return response.json();
}
