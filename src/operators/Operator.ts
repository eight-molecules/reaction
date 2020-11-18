import { Observable } from "../Observable";

export type OperatorFactory = (...args: any[]) => Operator
export type Operator = <T>(observable: Observable<T>) => Observable<T>