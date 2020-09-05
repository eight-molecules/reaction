import { Observable } from "../Observable"
import { Observer } from "../Observer"
import { Operator, OperatorFactory } from "./Operator";

export const startWith: OperatorFactory = <T, U>(value: U): Operator => (observable: Observable<T>) => new Observable<T | U>((observer: Observer<T | U>) => {
  observer.next(value);
  return observable.subscribe(observer);
});