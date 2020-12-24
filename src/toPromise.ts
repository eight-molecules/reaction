import { Observable } from "./Observable";

export const toPromise = async <T>(source: Observable<T>) => new Promise<T>((resolve, reject) => {
  const subscription = source.subscribe({
    next: (value: T) => {
      resolve(value);
      setTimeout(() => subscription.unsubscribe());
    },
    error: (err: Error) => reject(err)
  });
});