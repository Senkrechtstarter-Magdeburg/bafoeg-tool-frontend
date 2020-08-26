import {AfterViewInit, Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from "@angular/core";
import {AppBarService, Position} from "./app-bar.service";
import {TemplatePortal} from "@angular/cdk/portal";

@Directive({
  selector: "[appAppBarElement]"
})
export class AppBarElementDirective implements OnInit, AfterViewInit, OnDestroy {

  private static lastOrder = 100;

  @Input("appAppBarElementOrder")
  private order = AppBarElementDirective.lastOrder++;

  @Input("appAppBarElement")
  private position: Position = "left";
  private readonly portal: TemplatePortal;
  private id: string;

  constructor(private appBarService: AppBarService,
              private templateRef: TemplateRef<any>,
              private viewContainer: ViewContainerRef) {
    this.portal = new TemplatePortal<any>(templateRef, viewContainer);
  }

  ngOnInit(): void {
  }

  public ngAfterViewInit(): void {
    this.id = this.appBarService.attachPortal(this.portal, this.position, this.order);
  }

  public ngOnDestroy(): void {
    this.appBarService.detachPortal(this.id);
  }

}
