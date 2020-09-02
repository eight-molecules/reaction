import { Observable } from "./Observable";
import { Observer } from "./Observer";

export const fromPromise = (promise: Promise<any>) => new Observable((observer: Observer<any>) => {
  promise.then((value: any) => observer.next(value));
});