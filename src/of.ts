import { create } from "./Observable";
import { Observer } from "./Observer";

export const of = <T>(value: T) => create<T>(({ next, complete }: Observer<T>) => {
  next(value);
  complete();
});