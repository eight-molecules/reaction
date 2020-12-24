import { OperatorFactory } from "./Operator";
import { create, Observable } from "../Observable";
import { Observer } from "../Observer";

export const swap: OperatorFactory = (swapFn: <T, U>(value: T) => Observable<U>) => <T, U>(source: Observable<T>) => create<U>((observer: Observer<U>) => {
  source.subscribe({ 
    next: (value: T) => swapFn(value).subscribe({ 
      next: (value: U) => observer.next(value) 
    })
  })
});