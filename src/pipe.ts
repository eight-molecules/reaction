import { Observable } from "./Observable";
import { Operator } from "./operators/Operator";

export const pipe = <T, U>(source: Observable<T>, ...operators: Operator<any>[]): Observable<U> => {
  return operators.reduce((source: Observable<any>, operator: (observable: Observable<any>) => Observable<any>) => operator(source), source);
}