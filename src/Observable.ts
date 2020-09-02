import { Observer } from "./Observer";
import { Subscription } from "./Subscription";

export class Observable<T> {
  constructor(private onSubscribe: (observer: Observer<T>) => Subscription | void = ({ complete = () => {} }) => complete()) { }

  toPromise(): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const { unsubscribe } = this.subscribe({
        next: (value: any) => {
          setTimeout(() => unsubscribe(), 0);
          resolve(value);
        },
        error: (err: Error) => reject(err)
      });
    });
  }

  subscribe(observer: Observer<T>): Subscription {
    const subscription = this.onSubscribe(observer);
    return subscription || { unsubscribe(): void { } };
  }
}