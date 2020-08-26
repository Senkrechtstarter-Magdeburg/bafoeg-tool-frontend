import {AfterViewInit, ChangeDetectionStrategy, Component, TrackByFunction} from "@angular/core";
import {AppBarService} from "./app-bar.service";
import {Observable} from "rxjs";
import {Portal} from "@angular/cdk/portal";

@Component({
  selector: "app-app-bar",
  templateUrl: "./app-bar.component.html",
  styleUrls: ["./app-bar.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppBarComponent implements AfterViewInit {

  public readonly portalOutletsRight$: Observable<{ id: string, portal: Portal<any> }[]>;
  public readonly portalOutletsCenter$: Observable<{ id: string, portal: Portal<any> }[]>;
  public readonly portalOutletsLeft$: Observable<{ id: string, portal: Portal<any> }[]>;
  public readonly portalOutletsMore$: Observable<{ id: string, portal: Portal<any> }[]>;

  constructor(private appBarService: AppBarService) {
    this.portalOutletsLeft$ = this.appBarService.portalOutletsLeft$;
    this.portalOutletsCenter$ = this.appBarService.portalOutletsCenter$;
    this.portalOutletsRight$ = this.appBarService.portalOutletsRight$;
    this.portalOutletsMore$ = this.appBarService.portalOutletsMoreMenu$;
  }

  public trackByFn: TrackByFunction<{ id: string, portal: Portal<any> }> = (i, obj) => obj.id;

  public ngAfterViewInit(): void {
  }
}
