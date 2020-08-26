import {Injectable} from "@angular/core";
import {Portal, TemplatePortal} from "@angular/cdk/portal";
import {asyncScheduler, BehaviorSubject, Observable, scheduled} from "rxjs";
import {v4 as uuid} from "uuid";
import {map} from "rxjs/operators";

export type Position = "left" | "right" | "center" | "more";

function portalOutletsPosition(source: Observable<{ [p: string]: { portal: Portal<any>, position: Position, order: number } }>,
                               position: Position): Observable<{ id: string; portal: Portal<any> }[]> {
  return scheduled(source.pipe(
    map(x => Object.entries(x)
      .filter(([, val]) => val.position === position)
      .sort(([, a], [, b]) => b.order - a.order)
      .map(([id, obj]) => ({id, portal: obj.portal}))
    ),
  ), asyncScheduler);

}

@Injectable({
  providedIn: "root"
})
export class AppBarService {
  private portalOutletsSource = new BehaviorSubject<{ [p: string]: { portal: Portal<any>, position: Position, order: number } }>({});

  public portalOutletsLeft$ = portalOutletsPosition(this.portalOutletsSource.asObservable(),
    "left");
  public portalOutletsCenter$ = portalOutletsPosition(this.portalOutletsSource.asObservable(),
    "center");
  public portalOutletsRight$ = portalOutletsPosition(this.portalOutletsSource.asObservable(),
    "right");
  public portalOutletsMoreMenu$ = portalOutletsPosition(this.portalOutletsSource.asObservable(),
    "more");

  constructor() {
  }

  public attachPortal<T>(portal: TemplatePortal, position: Position, order: number): string {
    const key = uuid();
    this.portalOutletsSource.next({...this.portalOutletsSource.getValue(), [key]: {portal, position, order}});

    return key;
  }

  public detachPortal(id: string) {
    const value = this.portalOutletsSource.getValue();
    delete value[id];
    this.portalOutletsSource.next({...value});
  }
}
