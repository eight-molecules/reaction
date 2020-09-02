import { Observable } from "./Observable";

export const pipe = (source: Observable<any>, ...operators: ((observable: Observable<any>) => Observable<any>)[]): Observable<any> => {
  return operators.reduce((source: Observable<any>, operator: (observable: Observable<any>) => Observable<any>) => operator(source), source);
}