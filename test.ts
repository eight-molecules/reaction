import { Observable } from './src/Observable';
import { fromPromise } from './src/fromPromise';
import { interval } from './src/interval';
import { pipe } from './src/pipe';
import { map } from './src/operators/map';

export const test = async (msg: string, should: () => Promise<void> = async () => {}) => {
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

test('The Observable\'s toPromise method should return a promise that resolves the next emission from the source observable.', async () => {
  return new Promise((resolve, reject) => {
    const source = new Observable(({ next }) => next());
    source.toPromise().then(() => resolve()).catch((err: Error) => reject(err));
  });
});

test('The Observable\'s toPromise method should return a promise that rejects when an error occurs.', async () => {
  return new Promise((resolve, reject) => {
    const source = new Observable(({ error = () => { } }) => error());
    source.toPromise().then((value: any) => reject(`The promise resolved when it should have rejected! (value: ${value})`)).catch((err: Error) => resolve());
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

        resolve();
      }
    });
  });
});

test('Map should apply a change to the source', async () => {
  return new Promise((resolve, reject) => {
    const source = new Observable(({ next }) => next());
    pipe(source, 
      map(() => 1),
      map((x) => x * 2),
      map((result) => result.toString())
    ).subscribe({
      next: (value: any) => {
        if (value !== '2') {
          reject(`Incorrect value mapped! (value: ${value})`);
        }

        resolve();
      }
    });
  });
})