import { AnswerSheet } from "@/interfaces/AnswerSheet";
import { Question } from "@/interfaces/Question";
import { UserAnswer } from "@/interfaces/UserAnswer";
import { Option } from "@/types/Option";

/**
 * Computes an answer sheet by comparing user responses with the correct answers.
 *
 * Iterates through the provided user answers, matches each answer to its corresponding question by ID, and increments the score if the user's answer matches the correct option. The resulting answer sheet includes the catalogue ID, the computed score, the total number of questions, and details mapping each user choice to its corresponding question.
 *
 * @param catalogueId - Identifier for the question catalogue.
 * @param correctAnswers - An array of questions with their correct options.
 * @param userAnswers - An array of user responses.
 * @returns An answer sheet containing the catalogue ID, score, total questions, and answer details.
 *
 * @remark Assumes every user answer corresponds to a valid question in the correct answers list.
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

    if (!correctAnswer) {
      throw new Error(`Question ${userAnswer.question_id} not found`);
    }
    if (userAnswer.answer && correctAnswer?.correctOption === userAnswer.answer)
      answerSheet.score += 1;
    answerSheet.answers.push({
      user_choice: userAnswer.answer as Option,
      question: correctAnswer
    });
  }

  return answerSheet;
}
