import { Subject } from './Subject';
import { Subscription } from './Subscription';
import { Observer } from './Observer';

export class ValueSubject<T> extends Subject<T> {
  get value(): T {
    return this._value!;
  }

  constructor(private _value?: T) { super(); }
  
  next(value: T) {
    if (this.closed) { return; }

    this._value = value;
    super.next(value);
  }

  subscribe(observer: Observer<T>): Subscription {
    if (!this.closed) { 
      observer.next(this.value); 
    }
   
    return super.subscribe(observer);
  }
}