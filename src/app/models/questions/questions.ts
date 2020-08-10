import {CalendarQuestion} from "@models/questions/calendarQuestion";
import {MultipleChoiceQuestion} from "@models/questions/multipleChoiceQuestion";
import {TextBlockQuestion} from "@models/questions/textBlockQuestion";
import {TextQuestion} from "@models/questions/textQuestion";
import {YesNoQuestion} from "@models/questions/yesNoQuestion";
import {ListQuestion} from "@models/questions/listQuestion";

export type Questions = CalendarQuestion | MultipleChoiceQuestion | TextBlockQuestion | TextQuestion | YesNoQuestion | ListQuestion;
