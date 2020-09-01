import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {
  ROUTE_DATA_QUESTIONARY,
  ROUTE_DATA_STEP,
  ROUTE_MAGIC_QUESTIONARY_FINISHED,
  ROUTE_MAGIC_QUESTIONARY_START,
  ROUTE_PARAMETER_CURRENT_QUESTIONARY,
  ROUTE_PARAMETER_CURRENT_STEP
} from "./routing-params";
import {AppPageComponent} from "./app-page.component";
import {questions} from "@questions/questions";
import {FinishedScreenComponent} from "./finished-screen/finished-screen.component";
import {QuestionaryScreenComponent} from "./questionary-screen/questionary-screen.component";
import {QuestionaryResolver} from "./guards/questionaryResolver";
import {StepResolver} from "./guards/stepResolver";
import {RedirectStartStepGuard} from "./guards/redirect-start-step.guard";
import {AnimationResolver} from "./guards/animationResolver";


const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: questions[0].id
  },
  {
    path: "app",
    children: [
      {
        path: `:${ROUTE_PARAMETER_CURRENT_QUESTIONARY}`,
        resolve: {[ROUTE_DATA_QUESTIONARY]: QuestionaryResolver},
        children: [
          {
            path: "",
            pathMatch: "full",
            redirectTo: ROUTE_MAGIC_QUESTIONARY_START
          },
          {
            path: "",
            component: AppPageComponent,
            children: [
              {
                path: ROUTE_MAGIC_QUESTIONARY_FINISHED,
                pathMatch: "full",
                component: FinishedScreenComponent
              },
              {
                path: `:${ROUTE_PARAMETER_CURRENT_STEP}`,
                canActivate: [RedirectStartStepGuard],
                resolve: {
                  [ROUTE_DATA_STEP]: StepResolver, animation: AnimationResolver,
                },
                component: QuestionaryScreenComponent,
              }
            ]
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppPageRoutingModule {
}
