import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Questionary} from "@models";
import {Injectable} from "@angular/core";
import {questions} from "@questions/questions";
import {ROUTE_PARAMETER_CURRENT_QUESTIONARY} from "../routing-params";
import {getParams} from "./routeHelpers";

@Injectable({providedIn: "root"})
export class QuestionaryResolver implements Resolve<Questionary> {
  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Questionary {
    return questions.find(q => q.id === getParams(route)[ROUTE_PARAMETER_CURRENT_QUESTIONARY]) ?? null;
  }
}
