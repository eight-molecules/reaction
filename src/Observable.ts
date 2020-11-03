import { Observer } from "./Observer";
import { Subscription } from "./Subscription";

export class Observable<T> {
  constructor(private onSubscribe: (observer: Observer<T>) => Subscription | void = (observer) => observer.complete?.()) { }

  toPromise(options?: { resolveOnComplete: boolean }): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const subscription = this.subscribe({
        next: (value: T) => {
          setTimeout(() => subscription.unsubscribe(), 0);
          resolve(value);
        },
        error: (err: Error) => reject(err),
        complete: () => resolve()
      });
    });
  }

  subscribe(observer: Observer<T>): Subscription {
    const subscription = this.onSubscribe(observer);
    return subscription || { unsubscribe(): void { } };
  }
}