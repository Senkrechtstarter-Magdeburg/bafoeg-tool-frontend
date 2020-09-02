import {ActivatedRoute, ActivatedRouteSnapshot, Data, Params} from "@angular/router";
import {combineLatest, Observable} from "rxjs";
import {delay, map} from "rxjs/operators";


export function getData(route: ActivatedRoute): Observable<Data>;
export function getData(route: ActivatedRouteSnapshot): Data;
export function getData(route: ActivatedRouteSnapshot | ActivatedRoute): Data | Observable<Data> {
  if (route instanceof ActivatedRoute) {
    return get(route, "data");
  } else {
    return get(route, "data");
  }
}

export function getAllParams(route: ActivatedRouteSnapshot): Params {
  return route.children.flatMap(c => getAllParams(c)).reduce((prev, cur) => ({...prev, ...cur}), {...route.params});
}

export function getParams(route: ActivatedRoute): Observable<Params>;
export function getParams(route: ActivatedRouteSnapshot): Params;
export function getParams(route: ActivatedRouteSnapshot | ActivatedRoute): Params | Observable<Params> {
  if (route instanceof ActivatedRoute) {
    return get(route, "params");
  } else {
    return get(route, "params");
  }
}

export function get(route: ActivatedRoute, prop: "data"): Observable<Data>;
export function get(route: ActivatedRouteSnapshot, prop: "data"): Data;
export function get(route: ActivatedRoute, prop: "params"): Observable<Params>;
export function get(route: ActivatedRouteSnapshot, prop: "params"): Params;
export function get(route: ActivatedRouteSnapshot | ActivatedRoute,
                    prop: "params" | "data"): Params | Data | Observable<Params> | Observable<Data> {
  if (route instanceof ActivatedRoute) {
    return combineLatest(route.pathFromRoot.map(r => r[prop])).pipe(delay(0), map(rs => rs.reduce((prev, cur) => ({...prev, ...cur}), {})));
  } else {
    return route.pathFromRoot.reduce((prev, cur) => ({...prev, ...cur[prop]}), {});
  }
}
