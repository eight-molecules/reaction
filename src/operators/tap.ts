import { Observable } from "../Observable";
import { Observer } from "../Observer";

export const tap = (tapFn: Function) => (observable: Observable<any>) => new Observable<any>(({ next, error = () => {}, complete = () => {}}: Observer<any>) => {
  let { unsubscribe } = observable.subscribe({
    next: (value: any) => {
      tapFn(value);
      next(value);
    },
    error: (err: Error) => error(err),
    complete: () => complete()
  });

  return { unsubscribe };
});