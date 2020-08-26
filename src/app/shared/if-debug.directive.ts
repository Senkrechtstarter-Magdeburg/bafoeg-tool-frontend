import {Directive, OnInit, TemplateRef, ViewContainerRef} from "@angular/core";
import {environment} from "../../environments/environment";

@Directive({
  selector: "[appIfDebug]"
})
export class IfDebugDirective implements OnInit {

  constructor(private templateRef: TemplateRef<any>,
              private viewContainer: ViewContainerRef) {
  }

  public ngOnInit(): void {
    if (!environment.production) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

}
