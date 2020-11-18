import { Operator, OperatorFactory } from "./Operator";
import { Observable } from "../Observable";
import { Observer } from "../Observer";

export const map: OperatorFactory = <T, U>(mapFn: <U, T>(value: U) => T): Operator<T> => (observable: Observable<U>) => new Observable<T>((observer: Observer<T>) => {
  observable.subscribe({
    next: (value) => observer.next(mapFn(value))
  });
});