import { create } from "./Observable";
import { Observer } from "./Observer";

export const fromPromise = <T>(promise: Promise<T>) => create<T>(({ next, error, complete }: Observer<T>) => {
  promise.then(next).catch(error).finally(complete);
});