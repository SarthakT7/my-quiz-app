import { Option } from "@/types/Option";

export interface UserAnswer {
  question_id: string;
  answer: Option.OPTION_A | Option.OPTION_B | Option.OPTION_C | Option.OPTION_D | null;
}
