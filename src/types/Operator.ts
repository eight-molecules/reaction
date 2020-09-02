import { Observable } from "../Observable";

export type Operator = (observable: Observable<any>) => Observable<any>