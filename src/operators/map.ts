import { Operator } from "../types/Operator";
import { Observable } from "../Observable";

export const map = (mapFn: (value: any) => any): Operator => {
  return (observable) => new Observable((observer) => {
    observable.subscribe({
      next: (value: any) => observer.next(mapFn(value))
    });
  });
};