import { Observable } from "./Observable";
import { Observer } from "./Observer";

export const fromPromise = <T>(promise: Promise<T>) => new Observable<T>((observer: Observer<T>) => {
  promise.then((value: T) => observer.next(value));
});