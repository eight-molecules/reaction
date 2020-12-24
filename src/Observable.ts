import { createObserver, Observer } from "./Observer";
import { Subscription } from "./Subscription";

export interface Observable<T> {
  subscribe(observer: Observer<T> | Partial<Observer<T>> | undefined): Subscription
};


export const create = <T>(onSubscribe: ((observer: Observer<T>) => Subscription | void) = ({ complete }) => { complete() }): Observable<T> => ({
  subscribe(unsafeObserver: Partial<Observer<T>>): Subscription {
    return onSubscribe(createObserver(unsafeObserver)) || { unsubscribe(): void { } };
  }
});