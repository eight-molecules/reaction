import { Observable } from "../Observable";

const timeoutScheduler = { schedule: (scheduledFn: Function, timeout: number) => setTimeout(scheduledFn, timeout) };
export const delay = (timeout: number, scheduler: { schedule: (...params: any[]) => any } = timeoutScheduler) => <T>(source: Observable<T>) => {
  return new Observable<T>((observer) => {
    source.subscribe({
      next: (v: T) => scheduler.schedule(() => observer.next(v), timeout)
    });
  });
};