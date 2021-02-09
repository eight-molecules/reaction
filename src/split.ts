import { create, Observable } from './Observable';
export const split = <T>(iterable: Iterable<T>): Observable<T> => create(({ next, complete }) => {
  for (const value of iterable) {
    next(value);
  }

  complete();
});