import { Option } from "@/types/Option";
import { Question } from "./Question";

export interface AnswerSheet {
  catalogueId: string;
  score: number;
  total: number;
  answers: {
    question: Question;
    user_choice: Option | null;
  }[];
}
