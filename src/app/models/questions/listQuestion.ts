import {QuestionOptions} from "@models/questions/questionOptions";
import {QuestionEntry} from "@models/questions/questionEntry";
import {BaseQuestion} from "@models/questions/baseQuestion";

export class ListQuestion extends BaseQuestion {
  public readonly type: "list" = "list";
  public itemQuestions: QuestionEntry[];
  public itemCaption: string;
  public addCaption: string;


  public constructor(config: QuestionOptions & {
    itemQuestions: QuestionEntry[];
    itemCaption?: string;
    addCaption?: string;
  }) {
    super(config);

    config = {
      addCaption: "app.questions.__default.list.add",
      ...config
    };

    this.itemQuestions = config.itemQuestions;
    this.addCaption = config.addCaption;
    this.itemCaption = config.itemCaption;
  }

}
