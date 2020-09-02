import {animate, query, sequence, style, transition, trigger} from "@angular/animations";

export const slideInAnimation =
  trigger("routeAnimations", [
    transition((fromState, toState) => +fromState > +toState, [
      sequence([
        query(":enter", style({height: 0, overflow: "hidden"}), {optional: true}),
        query(":leave", [style({overflow: "hidden"})], {optional: true}),
        query(".questionary-component-card-container", [
          animate("600ms ease-in", style({transform: "translateX(100%)"})),
        ]),
        query(":enter", style({height: "*"}), {optional: true}),
        query(":leave", style({height: 0}), {optional: true}),
        query(".questionary-component-card-container",
          [style({transform: "translateX(-100%)"}), animate("600ms ease-out", style({transform: "translateX(0)"}))]),
      ])
    ]),
    transition((fromState, toState) => +fromState < +toState, [
      sequence([
        query(":enter", style({height: 0, overflow: "hidden"}), {optional: true}),
        query(":leave", [style({overflow: "hidden"})], {optional: true}),
        query(".questionary-component-card-container", [
          animate("600ms ease-in", style({transform: "translateX(-100%)"})),
        ]),
        query(":enter", style({height: "*"}), {optional: true}),
        query(":leave", style({height: 0}), {optional: true}),
        query(".questionary-component-card-container",
          [style({transform: "translateX(100%)"}), animate("600ms ease-out", style({transform: "translateX(0)"}))]),
      ])
    ]),
    transition("* => void", [
      query(".questionary-component-card-container", [
        animate("200ms ease-in", style({opacity: 0})),
      ])
    ]),
    transition("void => *", [
      query(".questionary-component-card-container", [
        style({opacity: 0}),
        animate("200ms ease-in", style({opacity: 1})),
      ])
    ])
  ]);
