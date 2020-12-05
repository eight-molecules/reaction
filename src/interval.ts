import { Observable } from "./Observable";
import { Observer } from "./Observer";

export const interval = (delay: number= 1000) => {
  return new Observable<void>((observer: Observer<void>) => {
    const interval = setInterval(() => observer.next(), delay);

    return { 
      unsubscribe: () => {
        clearInterval(interval);
        observer.complete?.();
      }
    };
  });
}