import {Questionary, QuestionContainer} from "@models";
import {Dict} from "@shared";


export function nextVisible(questionary: Questionary,
                            currentStep: QuestionContainer | "start" | "end",
                            context: Dict,
                            amount: number = 1): QuestionContainer | null {
  if (!questionary.questionContainers) {
    return null;
  }

  const direction = amount < 0 ? -1 : 1;
  if (currentStep === "start" || currentStep === "end") {
    currentStep = questionary.questionContainers[currentStep === "start" ? 0 : questionary.questionContainers.length - 1];

    if (!(currentStep.isHidden && currentStep.isHidden(context))) {
      amount -= direction;
    }
  }

  if (amount === 0) {
    return currentStep;
  }

  let next = questionary.questionContainers.indexOf(currentStep);
  while (amount !== 0) {
    next += direction;

    if (next < 0 || next >= questionary.questionContainers.length) {
      return null;
    }

    if (!(questionary.questionContainers[next].isHidden && questionary.questionContainers[next].isHidden(context))) {
      amount -= direction;
    }
  }

  return questionary.questionContainers[next];
}
