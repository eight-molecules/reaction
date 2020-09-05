import { Observable } from "./Observable";
import { Operator } from "./types/Operator";

export const pipe = <T, U>(source: Observable<T>, ...operators: Operator[]): Observable<U> => {
  return operators.reduce((source: Observable<any>, operator: (observable: Observable<any>) => Observable<any>) => operator(source), source);
}