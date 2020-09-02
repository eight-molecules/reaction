import { Observer } from "./Observer";
import { Subscription } from "./Subscription";

export class Observable<T> {
  constructor(private onSubscribe: (observer: Observer<T>) => Subscription | void = ({ complete = () => {} }) => complete()) { }

  subscribe(observer: Observer<T>): Subscription {
    const subscription = this.onSubscribe(observer);
    return subscription || { unsubscribe(): void { } };
  }
}