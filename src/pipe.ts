import { Observable } from "./Observable";
import { Operator } from "./operators/Operator";

export const pipe = (source: Observable<any>, ...operators: Operator<any>[]): Observable<any> => {
  return operators.reduce((source: Observable<any>, operator: (observable: Observable<any>) => Observable<any>) => operator(source), source);
}