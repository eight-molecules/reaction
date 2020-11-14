import { Observer } from "./Observer";
import { Subscription } from "./Subscription";

export class Observable<T> {
  constructor(private onSubscribe: (observer: Observer<T>) => Subscription | void = (observer) => observer.complete?.()) { }

  async toPromise(): Promise<T> {
    let subscription: Subscription;
    
    const result = await new Promise<T>((resolve, reject) => {
      subscription = this.subscribe({
        next: (value: T) => {
          resolve(value);
        },
        error: (err: Error) => reject(err)
      });
    });

    subscription.unsubscribe();
    return result;
  }

  subscribe(observer: Observer<T>): Subscription {
    const subscription = this.onSubscribe(observer);
    return subscription || { unsubscribe(): void { } };
  }
}