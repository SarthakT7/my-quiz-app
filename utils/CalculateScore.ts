import { AnswerSheet } from "@/interfaces/AnswerSheet";
import { Question } from "@/interfaces/Question";
import { UserAnswer } from "@/interfaces/UserAnswer";
import { Option } from "@/types/Option";

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
