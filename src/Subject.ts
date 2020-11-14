import { Observable } from "./Observable";
import { Observer } from "./Observer";

export class Subject<T> extends Observable<T> implements Observer<T> {
  observers: Observer<T>[] = [];
  closed = false;

  constructor() {
    super((observer) => {
      this.observers.push(observer);

      return { 
        unsubscribe: () => {
          const index = this.observers.indexOf(observer);

          if (index < 0) {
            this.observers.splice(index);
          }
        } 
      };
    });
  }

  next(value: T) {
    if (this.closed) {
      return;
    }

    for (const observer of this.observers) {
      observer.next(value);
    }
  }

  error(error: Error) {
    for (const observer of this.observers) {
      observer.error?.(error);
    }
  }

  complete() {
    this.closed = true;

    while (this.observers.length > 0) {
      const observer = this.observers.pop();
      observer?.complete?.();
    }
  }
}