import { Observable } from "./Observable";

export const interval = (delay: number= 1000) => {
  return new Observable<void>(({ next , complete }) => {
    const interval = setInterval(() => next(), delay);

    return { 
      unsubscribe: () => {
        clearInterval(interval);
        complete?.();
      }
    };
  });
}