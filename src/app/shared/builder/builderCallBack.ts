import {Question} from "@models/questions";
import {QuestionBuilder} from "@shared/builder/questionBuilder";

export type BuilderCallBack<T extends Question, B extends QuestionBuilder<T>> = (builder: B) => B;
