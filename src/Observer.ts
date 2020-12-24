export interface Observer<T> {
  next(value: T): void;
  error(err: Error): void;
  complete(): void;
};

export const createObserver = <T>({ next, error, complete }: Partial<Observer<T>>) => ({
  next: (value: T) => { if (next) next(value) },
  error: (err: Error) => { if (error) error(err) },
  complete: () => { if (complete) complete() }
})