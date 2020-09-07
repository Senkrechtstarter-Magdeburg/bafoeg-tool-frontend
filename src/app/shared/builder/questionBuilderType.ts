import {Questions} from "@models/questions";
import {FormBuilder} from "@shared/builder/formBuilder";
import {QuestionBuilder} from "@shared/builder/questionBuilder";
import {QuestionContextFactory} from "@shared";

export type QuestionBuilderType<Q extends Questions, TAliases extends string> =
  new(id: string,
      namespace: string,
      formBuilder: { [alias: string]: FormBuilder },
      questionContextFactory: QuestionContextFactory)
    => QuestionBuilder<Q, TAliases>
