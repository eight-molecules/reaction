import { Subject } from './Subject';
import { Subscription } from './Subscription';
import { Observer } from './Observer';

export class Store<T> extends Subject<T> {
  constructor(private _value: T) {
    super();
  }

  get value() {
    return this._value;
  }

  next(value: T) {
    this._value = value;
    super.next(value);
  }

  subscribe(observer: Observer<T>): Subscription {
    observer.next(this._value);
    return super.subscribe(observer);
  }
}