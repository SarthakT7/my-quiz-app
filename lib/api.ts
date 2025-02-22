import { AnswerSheet } from "@/interfaces/AnswerSheet";
import { UserAnswer } from "@/interfaces/UserAnswer";

/**
 * Retrieves a list of catalogues from the API.
 *
 * Makes an HTTP GET request to the "/api/catalogues" endpoint and returns the parsed JSON response.
 * Throws an error if the response is not successful.
 *
 * @returns The JSON data from the API response.
 * @throws Error if fetching the catalogues fails.
 */
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

/**
 * Approves or disapproves a specific question in a catalogue.
 *
 * Sends a POST request to update the approval status of the specified question. If the request is unsuccessful,
 * an error is thrown. On success, the parsed JSON response from the API is returned.
 *
 * @param catalogueId - Identifier of the catalogue containing the question.
 * @param questionId - Identifier of the question to update.
 * @param approve - Set to true to approve the question or false to disapprove it.
 *
 * @returns The parsed JSON response from the API.
 *
 * @throws Error if the API request fails.
 */
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

/**
 * Submits user answers for a quiz.
 *
 * Sends a POST request with the provided user answers to the quiz submission endpoint of the specified catalogue.
 * Throws an error if the request is unsuccessful.
 *
 * @param catalogueId - Unique identifier of the catalogue to which the quiz belongs.
 * @param userAnswers - Array of user answer objects to be submitted.
 * @returns A promise resolving with the answer sheet generated from the quiz submission.
 *
 * @throws Error if the quiz submission request fails.
 */
export async function submitQuiz(
  catalogueId: string,
  userAnswers: UserAnswer[]
): Promise<AnswerSheet> {
  const response = await fetch(`/api/catalogues/${catalogueId}/quiz/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userAnswers),
  });

  if (!response.ok) throw new Error("Failed to approve question");
  return response.json();
}
