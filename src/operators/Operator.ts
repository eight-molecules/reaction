import { Observable } from "../Observable";

export type OperatorFactory = (...args: any[]) => Operator<any>
export type Operator<T> = (observable: Observable<any>) => Observable<T>