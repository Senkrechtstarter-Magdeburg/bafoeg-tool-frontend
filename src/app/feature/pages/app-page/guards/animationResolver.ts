import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {getAllParams} from "./routeHelpers";
import {Injectable} from "@angular/core";
import {ROUTE_PARAMETER_CURRENT_STEP} from "../routing-params";

@Injectable({providedIn: "root"})
export class AnimationResolver implements Resolve<string> {
  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<string> | Promise<string> | string {
    return getAllParams(route)[ROUTE_PARAMETER_CURRENT_STEP];
  }
}
