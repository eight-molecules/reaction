import { Observable } from "./Observable";
import { Observer } from "./Observer";

export const fromPromise = <T>(promise: Promise<T>) => new Observable<T>((observer: Observer<T>) => {
  (async () => {
    try {
      const result = await promise;
      observer.next(result);
      observer.complete();
    } catch (e) {
      observer.error?.(e);
    }
  })();
});