import { Operator, OperatorFactory } from "./Operator";
import { create, Observable } from "../Observable";
import { Observer } from "../Observer";

export const map: OperatorFactory = <T, U>(mapFn: <T, U>(value: T) => U): Operator<T> => (observable: Observable<U>) => create<T>(({ next, error, complete }: Observer<T>) => {
  observable.subscribe({
    next: (value: U) => next(mapFn(value)),
    error: error,
    complete: complete
  });
});