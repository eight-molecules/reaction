import { Observable } from "../Observable";

export type OperatorFactory = (...args: any[]) => Operator
export type Operator = (observable: Observable<any>) => Observable<any>