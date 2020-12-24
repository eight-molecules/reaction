import { create, Observable } from "./Observable";
import { createObserver, Observer } from "./Observer";

export type Subject<T> = (Observable<T> & Observer<T>);

export const createSubject = <T>(): Subject<T> => {
  const observers: Observer<T>[] = [];
  let closed = false;

  const onSubscribe = (unsafeObserver: Partial<Observer<T>>) => {
    const observer = createObserver(unsafeObserver);
    observers.push(observer);

    return { 
      unsubscribe: () => {
        const index = observers.indexOf(observer);

        if (index < 0) {
          observers.splice(index);
        }
      } 
    }
  };
  
  const next = (value: T): void => {
    if (closed) { return; }

    for (const observer of observers) {
      observer.next(value);
    }
  };

  const error = (error: Error): void => {
    if (closed) { return; }
    
    for (const observer of observers) {
      observer.error(error);
    }
  };

  const complete = (): void => {
    if (closed) { return; }
    closed = true;

    while (observers.length > 0) {
      const observer = observers.pop()!;
      observer.complete();
    }
  };

  return {
    ...create(onSubscribe),
    ...createObserver({ next, error, complete })
  };
};