import { Observer } from "./Observer";
import { Subscription } from "./Subscription";

export class Observable<T> {
  constructor(private onSubscribe: (observer: Observer<T>) => Subscription | void = (observer) => observer.complete?.()) { }

  async toPromise(): Promise<T> {
    let subscription: Subscription;
    
    return new Promise<T>((resolve, reject) => {
      subscription = this.subscribe({
        next: (value: T) => {
          resolve(value);
        },
        error: (err: Error) => reject(err)
      });
    }).then((v) => {
      subscription.unsubscribe();
      return v;
    });
  }

  subscribe(observer: Observer<T>): Subscription {
    const subscription = this.onSubscribe(observer);
    return subscription || { unsubscribe(): void { } };
  }
}