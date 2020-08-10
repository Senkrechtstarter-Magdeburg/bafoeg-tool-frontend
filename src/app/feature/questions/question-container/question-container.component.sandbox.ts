import {sandboxOf} from "angular-playground";
import {QuestionContainerComponent} from "./question-container.component";
import {QuestionsModule} from "../questions.module";
import {QuestionContainer} from "../../../models/questions/questionContainer";
import {TextQuestion} from "../../../models/questions/textQuestion";
import {MultipleChoiceQuestion} from "../../../models/questions/multipleChoiceQuestion";

export default sandboxOf(QuestionContainerComponent, {
  declareComponent: false,
  imports: [QuestionsModule]
})
  .add("default", {
    template: `<app-question-container [questionContainer]="questionContainer"></app-question-container>`,
    context: {
      questionContainer: {
        title: "testQuestionTitle",
        description: "testQuestionDescription",
        questionEntries: [
          {
            question: new TextQuestion({id: "textQuestion1", text: "enterSomeText"}),
          },
          {
            question: new MultipleChoiceQuestion({
              id: "multipleChoiceQuestion1", text: "whatDoYouChoose", choices: [
                {
                  value: "option1",
                  text: "Option1"
                }, {
                  value: "option2",
                  text: "Option2"
                },
              ]
            })
          }
        ]
      } as QuestionContainer
    }
  })
  .add("conditional questions", {
    template: `<app-question-container [questionContainer]="questionContainer"></app-question-container>`,
    context: {
      questionContainer: {
        title: "testQuestionTitle",
        description: "testQuestionDescription",
        questionEntries: [
          {
            question: new MultipleChoiceQuestion({
              id: "multipleChoiceQuestion1", text: "whatDoYouChoose", choices: [
                {
                  value: "option1",
                  text: "Option1"
                }, {
                  value: "option2",
                  text: "Option2"
                },
              ]
            })
          },
          {
            question: new TextQuestion({id: "textQuestion1", text: "enterSomeText"}),
            isHidden: context => context.multipleChoiceQuestion1 !== "option1"
          },
        ]
      } as QuestionContainer
    }
  })
  .add("conditional default", {
    template: `<app-question-container [questionContainer]="questionContainer"></app-question-container>`,
    context: {
      questionContainer: {
        title: "testQuestionTitle",
        description: "testQuestionDescription",
        questionEntries: [
          {
            question: new MultipleChoiceQuestion({
              id: "multipleChoiceQuestion1", text: "whatDoYouChoose", choices: [
                {
                  value: "option1",
                  text: "Option1"
                }, {
                  value: "option2",
                  text: "Option2"
                },
              ]
            })
          },
          {
            question: new TextQuestion({id: "textQuestion1", text: "enterSomeText"}),
            defaultValue: context => context.multipleChoiceQuestion1 === "option1" ? "You chose option1" : "You chose option2"
          },
        ]
      } as QuestionContainer
    }
  });
