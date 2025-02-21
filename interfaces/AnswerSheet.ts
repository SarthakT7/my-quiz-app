import { Option } from "@/types/Option";

export interface AnswerSheet {
  catalogueId: string;
  score: number;
  total: number;
  answers: {
    questionId: string;
    user_choice: Option;
    correct_choice: Option;
  }[];
}
