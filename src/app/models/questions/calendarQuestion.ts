import {QuestionOptions} from "./questionOptions";
import {BaseQuestion} from "@models/questions/baseQuestion";

export class CalendarQuestion extends BaseQuestion {

  public readonly type: "calendar" = "calendar";
  public calendarType: "textBox" | "embedded" | "popup";

  constructor(config: QuestionOptions & {
    calendarType?: "textBox" | "embedded" | "popup"
  }) {
    super(config);

    config = {
      calendarType: "textBox",
      ...config,
    };

    this.calendarType = config.calendarType;
  }
}
