import { AnswerSheet } from "@/interfaces/AnswerSheet";
import { UserAnswer } from "@/interfaces/UserAnswer";

/**
 * Fetches a list of catalogues from the API.
 *
 * Sends a GET request to the `/api/catalogues` endpoint and returns the parsed JSON response.
 * Throws an error if the fetch operation fails.
 *
 * @returns A promise that resolves with the catalogues data.
 * @throws Error if the response status is not OK.
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
 * Approves or disapproves a question within a catalogue.
 *
 * Sends a POST request to update the approval status of the specified question.
 * Returns the parsed JSON response if the request is successful, and throws an error otherwise.
 *
 * @param catalogueId - The unique identifier of the catalogue containing the question.
 * @param questionId - The unique identifier of the question.
 * @param approve - Indicates whether the question should be approved (true) or disapproved (false).
 * @returns The JSON-parsed response from the API.
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
 * Submits user answers for a quiz associated with a specific catalogue.
 *
 * Sends a POST request with the user answers in JSON format to the quiz submission endpoint.
 * Throws an error if the response is unsuccessful.
 *
 * @param catalogueId - The identifier for the catalogue containing the quiz.
 * @param userAnswers - An array of user answers to be submitted for the quiz.
 * @returns A promise that resolves to the answer sheet returned by the API.
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
