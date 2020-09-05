import { Operator, OperatorFactory } from "../types/Operator";
import { Observable } from "../Observable";
import { Observer } from "../Observer";

export const map: OperatorFactory = (mapFn: <T, U>(value: T) => U): Operator => <T, U>(observable: Observable<T>) => new Observable<U>((observer: Observer<U>) => {
  observable.subscribe({
    next: (value: T) => observer.next(mapFn(value))
  });
});