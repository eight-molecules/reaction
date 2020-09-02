import { Observable } from './src/Observable';
import { fromPromise } from './src/fromPromise';
import { interval } from './src/interval';
import { pipe } from './src/pipe';

const test = async (msg: string, should: () => Promise<void> = async () => {}) => {
  try {
    await should();
    console.log(`✅ ${msg}`);
  } catch (e) {
    console.error(`💔 ${msg}`);
    console.error(`\t ${e}`);
  }
}

test('The Observable class should create an observable that immediately completes.', () => {
  return new Promise<void>((resolve, reject) => {
    const observable = new Observable<void>();
    observable.subscribe({
      next: () => reject(),
      error: (err: Error) => reject(err),
      complete: () => resolve()
    })
  });
});

test('The fromPromise method should return an observable that emits the resolved value then completes.', async () => {
  return new Promise<void>((resolve, reject) => {
    const promise = new Promise(resolve => resolve());

    fromPromise(promise).subscribe({
      next: () => resolve(),
      error: (err: Error) => reject(err)
    });
  });
});

test('The interval method should return an observable that emits multiple values over a set period of time.', async () => {
  return new Promise((resolve, reject) => {
    let count = 0;
    const intervalSubscription = interval(1).subscribe({
      next: () => {
        count += 1;
        if (count === 3) {
          intervalSubscription.unsubscribe();
        } else if (count > 3) {
          reject(`Too many emissions! (count: ${count})`);
        }
      },
      error: (err: Error) => reject(err),
      complete: () => resolve()
    });
  });
});

test('Pipe should apply operators to a source', async () => {
  return new Promise((resolve, reject) => {
    const toOne = (observable: Observable<void>) => new Observable<number>((observer) => {
      observable.subscribe({
        next: () => observer.next(1)
      });
    });
  
    const source = new Observable(({ next }) => next());
    pipe(source, 
      toOne
    ).subscribe({
      next: (value: any) => {
        if (value !== 1) {
          reject(`Incorrect value mapped! (value: ${value})`);
        }

        console.log(value);
        resolve();
      }
    });
  })
})