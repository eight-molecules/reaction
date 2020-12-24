import { create, Observable } from "../Observable";
import { Observer } from "../Observer";
import { Operator, OperatorFactory } from "./Operator";

export const tap: OperatorFactory = <T>(tapFn: Function): Operator<T> => (observable: Observable<T>) => create<T>(({ next, error, complete }: Observer<T>) => {
  let { unsubscribe } = observable.subscribe({
    next: (value: T) => {
      tapFn(value);
      next(value);
    },
    error,
    complete
  });

  return { unsubscribe };
});