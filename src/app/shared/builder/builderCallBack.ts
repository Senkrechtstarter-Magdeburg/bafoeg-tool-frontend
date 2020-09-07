import {Question} from "@models/questions";
import {QuestionBuilder} from "@shared/builder/questionBuilder";

export type BuilderCallBack<T extends Question, TAliases extends string, B extends QuestionBuilder<T, TAliases>> = (builder: B) => B;
