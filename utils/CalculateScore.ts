import { AnswerSheet } from "@/interfaces/AnswerSheet";
import { Question } from "@/interfaces/Question";
import { UserAnswer } from "@/interfaces/UserAnswer";
import { Option } from "@/types/Option";

/**
 * Computes an answer sheet for a question catalogue by evaluating the user's responses.
 *
 * The function compares each user answer with the corresponding correct answer based on the question identifier.
 * If a user's answer exists and matches the correct option, the score is incremented. The resulting answer sheet
 * includes the catalogue identifier, total score, total number of questions, and an array of answer records where each
 * record contains the user's chosen option and its associated question. It is assumed that each user answer corresponds
 * to a valid question in the correct answers list.
 *
 * @param catalogueId - The identifier for the question catalogue.
 * @param correctAnswers - An array of question objects representing the correct answers.
 * @param userAnswers - An array of user answer objects containing the question identifier and chosen answer.
 * @returns An answer sheet containing the catalogue ID, calculated score, total number of questions, and answer details.
 */
export function calculateScore(
  catalogueId: string,
  correctAnswers: Question[],
  userAnswers: UserAnswer[]
): AnswerSheet {
  let answerSheet: AnswerSheet = {
    catalogueId: catalogueId,
    score: 0,
    total: correctAnswers.length,
    answers: [],
  };

  for (let userAnswer of userAnswers) {
    const correctAnswer = correctAnswers.find(
      (c) => c.id === userAnswer.question_id
    );
    if (userAnswer.answer && correctAnswer?.correctOption === userAnswer.answer)
      answerSheet.score += 1;
    answerSheet.answers.push({
      user_choice: userAnswer.answer as Option,
      question: correctAnswer!,
    });
  }

  return answerSheet;
}
