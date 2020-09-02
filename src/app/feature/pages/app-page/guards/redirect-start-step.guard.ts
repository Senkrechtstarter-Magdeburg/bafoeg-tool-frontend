import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";
import {ROUTE_MAGIC_QUESTIONARY_START, ROUTE_PARAMETER_CURRENT_STEP} from "../routing-params";
import {QuestionaryResolver} from "./questionaryResolver";
import {getParams} from "./routeHelpers";

@Injectable({
  providedIn: "root"
})
export class RedirectStartStepGuard implements CanActivate {

  constructor(private router: Router, private questionaryResolver: QuestionaryResolver) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (getParams(next)[ROUTE_PARAMETER_CURRENT_STEP] === ROUTE_MAGIC_QUESTIONARY_START) {
      const questionary = this.questionaryResolver.resolve(next, state);
      const newId = questionary.questionContainers[0].id;

      const newUrlsParts = [...next.pathFromRoot.flatMap(x => x.url.map(u => u.path)).slice(0, -1), newId];

      return this.router.createUrlTree(newUrlsParts);
    }

    return true;
  }

}
