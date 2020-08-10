import {DocumentRequest} from "@models/questions/documentRequest";
import {Question} from "@models/questions/question";
import {QuestionOptions} from "@models/questions/questionOptions";
import {DisplayType} from "@models/questions/displayType";

export abstract class BaseQuestion implements Question {
  public documentRequests: DocumentRequest[] = [];
  public hint: string;
  public id: string;
  public placeholder: string;
  public text: string;
  public readonly abstract type: string;

  public displayType: DisplayType;

  protected constructor(config: QuestionOptions) {
    this.hint = config.hint;
    this.id = config.id;
    this.text = config.text;
    this.documentRequests = config.documents || [];
    this.placeholder = config.placeholder;
    this.displayType = config.displayType;
  }
}
