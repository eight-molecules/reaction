import { OperatorFactory } from "./Operator";
import { create, Observable } from "../Observable";
import { Observer } from "../Observer";
import { Subscription } from "src/Subscription";

export const swap: OperatorFactory = (swapFn: <T, U>(value: T) => Observable<U>) => <T, U>(source: Observable<T>) => create<U>(({ next, error, complete }: Observer<U>) => {
  let innerSub: Subscription;

  const sourceSub = source.subscribe({ 
    next: (value: T) => {
      innerSub?.unsubscribe();
      innerSub = swapFn(value).subscribe({
        next: (value: U) => next(value),
        error: (err: Error) => error(err),
        complete: () => innerSub?.unsubscribe()
      });
    },
    error,
    complete
  });



  return { 
    unsubscribe: () => {
      innerSub?.unsubscribe();
      sourceSub.unsubscribe();
    }
  }
});