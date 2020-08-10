import {Directive, OnDestroy} from "@angular/core";
import {Observable, Subscription} from "rxjs";

@Directive()
export abstract class SafeSubscriptionComponent implements OnDestroy {
  protected subscription: Subscription = new Subscription();

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  protected subscribe<T>(observable: Observable<T> | Subscription,
                         next?: (value: T) => void,
                         error?: (error: any) => void,
                         complete?: () => void) {
    if (!(observable instanceof Subscription)) {
      observable = observable.subscribe(next, error, complete);
    }

    this.subscription.add(observable);
  }

}
