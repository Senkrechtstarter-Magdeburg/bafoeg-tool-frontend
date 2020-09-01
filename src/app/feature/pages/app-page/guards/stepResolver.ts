import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Questionary, QuestionContainer} from "@models";
import {Injectable} from "@angular/core";
import {ROUTE_DATA_QUESTIONARY, ROUTE_PARAMETER_CURRENT_STEP} from "../routing-params";
import {getData, getParams} from "./routeHelpers";

@Injectable({providedIn: "root"})
export class StepResolver implements Resolve<QuestionContainer> {

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): QuestionContainer {
    return (getData(route)[ROUTE_DATA_QUESTIONARY] as Questionary)
      .questionContainers
      .find(c => c.id === getParams(route)[ROUTE_PARAMETER_CURRENT_STEP]
      );
  }
}


