import { AnswerSheet } from "@/interfaces/AnswerSheet";
import { Option } from "@/types/Option";
import { Question } from "@prisma/client";

export function calculateScore(
  catalogueId: string,
  correctAnswers: Question[],
  userAnswers: {
    question_id: string;
    answer: Option;
  }[]
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

    if (correctAnswer?.correctOption === userAnswer.answer) {
      answerSheet.score += 1;
      answerSheet.answers.push({
        correct_choice: correctAnswer.correctOption,
        questionId: userAnswer.question_id,
        user_choice: userAnswer.answer,
      });
    }
  }

  return answerSheet;
}
