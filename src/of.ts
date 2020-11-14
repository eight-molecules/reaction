import { Observable } from "./Observable";
import { Observer } from "./Observer";

export const of = <T>(value: T) => new Observable<T>((observer: Observer<T>) => {
  observer.next(value);
  observer.complete?.();
});