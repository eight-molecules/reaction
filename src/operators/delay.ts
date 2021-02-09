import { Observer } from "src/Observer";
import { create, Observable } from "../Observable";

const timeoutScheduler = { schedule: (scheduledFn: Function, timeout: number) => setTimeout(scheduledFn, timeout) };
export const delay = (timeout: number, scheduler: { schedule: (...params: any[]) => any } = timeoutScheduler) => <T>(source: Observable<T>) => {
  return create<T>(({ next, error, complete }: Observer<T>) => {
    source.subscribe({
      next: (v: T) => scheduler.schedule(() => next(v), timeout),
      error,
      complete
    });
  });
};