import {QuestionBuilder} from "./questionBuilder";
import {CalendarQuestion} from "@models/questions/calendarQuestion";

export class CalendarQuestionBuilder extends QuestionBuilder<CalendarQuestion> {
  private calendarType: "textBox" | "embedded" | "popup";

  public showAsTextBox(): this {
    this.calendarType = "textBox";
    return this;
  }

  public showAsEmbedded(): this {
    this.calendarType = "embedded";
    return this;
  }

  public showAsPopup(): this {
    this.calendarType = "popup";
    return this;
  }

  public build(): CalendarQuestion {
    return new CalendarQuestion({
      ...this.buildBaseOptions(),
      calendarType: this.calendarType
    });
  }
}
