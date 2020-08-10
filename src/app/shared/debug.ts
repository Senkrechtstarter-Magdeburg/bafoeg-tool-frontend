import {tap} from "rxjs/operators";
import {MonoTypeOperatorFunction} from "rxjs";

export function debug<T>(tag: string): MonoTypeOperatorFunction<T> {
  return source$ => source$.pipe(tap(
    val => console.log(`[${tag}] Next: `, val),
    val => console.log(`[${tag}] Error: `, val),
    () => console.log(`[${tag}] Completed`),
  ));
}
