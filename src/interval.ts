import { create, Observable } from "./Observable";
import { Observer } from "./Observer";

export const interval = (delay: number= 1000) => create<void>(({ next, complete }: Observer<void>) => {
  const interval = setInterval(() => next(), delay);

  return { 
    unsubscribe() {
      clearInterval(interval);
      complete();
    }
  };
});