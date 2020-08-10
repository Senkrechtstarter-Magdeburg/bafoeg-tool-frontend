import {animate, group, query, style, transition, trigger} from "@angular/animations";

export const prevCurNextAnimation = trigger("prevCurNext", [
  transition("cur => prev", [
    group([
      query(".previous-question-container", [
        style({display: "block"}),
        animate(".5s ease-out", style({left: 0}))
      ]),
      query(".current-question-container", [
        animate(".5s ease-out", style({transform: "translate(100vw)"}))
      ]),
    ])
  ]),
  transition("cur => next", [
    group([
      query(".next-question-container", [
        style({display: "block"}),
        animate(".5s ease-out", style({right: 0}))
      ]),
      query(".current-question-container", [
        animate(".5s ease-out", style({transform: "translate(-100vw)"}))
      ]),
    ])
  ]),
]);
