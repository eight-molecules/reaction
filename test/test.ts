import { Observable } from '../src/Observable';
import { fromPromise } from '../src/fromPromise';
import { interval } from '../src/interval';
import { pipe } from '../src/pipe';
import { map } from '../src/operators/map';
import { tap } from '../src/operators/tap';
import { startWith } from '../src/operators/startWith';
import { swap } from '../src/operators/swap';

import { of } from '../src/of';
import { Operator } from '../src/operators/Operator';
import { fromEvent } from '../src';

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

test('Observable.toPromise should return a promise that resolves the next emission from the source observable.', async () => {
  return new Promise((resolve, reject) => {
    const source = new Observable<void>(({ next }) => next());
    source.toPromise().then(() => resolve()).catch((err: Error) => reject(err));
  });
});

test('Observable.toPromise() should return a promise that rejects when an error occurs.', async () => {
  return new Promise((resolve, reject) => {
    const source = new Observable<void>(({ error }) => error?.(new Error('Purposeful failure.')));
    source.toPromise().then((value: any) => reject(`The promise resolved when it should have rejected! (value: ${value})`)).catch((err: Error) => resolve());
  });
});

test('fromPromise() should return an observable that emits the resolved value then completes.', async () => {
  return new Promise<void>((resolve, reject) => {
    const promise = new Promise<void>(resolve => resolve());

    fromPromise(promise).subscribe({
      next: () => resolve(),
      error: (err: Error) => reject(err)
    });
  });
});

test('fromPromise() should call the error method of the observer when the promise rejects.', async () => {
  return new Promise((resolve, reject) => {
    fromPromise((async () => { throw new Error('Intended failure.') })()).subscribe({
      next: reject,
      error: () => resolve()
    });
  })
})

test('fromEvent() should return an observable that emits events from the given source.', async () => {
  return new Promise((resolve, reject) => {
    const target: EventTarget = new class implements EventTarget {
      listeners: { [key: string]: EventListener[] } = { };
      addEventListener(type: string, listener: EventListener) {
        const key = type.toLowerCase();
        if (Array.isArray(this.listeners[key])) {
          this.listeners[key].push(listener);
        } else {
          this.listeners[key] = [ listener ];
        }
      }

      removeEventListener(type: string, listener: EventListener) {
        const key = type.toLowerCase();
        this.listeners[key]?.filter(listenerToCompare => listenerToCompare !== listener);
      }

      dispatchEvent(event: Event) {
        const key = event.type.toLowerCase();
        
        this.listeners[key]?.forEach(async (listener) => listener(event));
        return true;
      }
    };

    const testEvent = new class TestEvent implements Event {
      NONE = 0;
      CAPTURING_PHASE = 1;
      AT_TARGET = 2;
      BUBBLING_PHASE = 3;
      cancelBubble = false;
      _preventDefault = false;
      _phase = 0;
      _currentTarget: EventTarget;
      _originalTarget: EventTarget;
      _timestamp = Date.now();

      get bubbles(): boolean { return false; }
      get cancelable(): boolean { return false; }
      get composed(): boolean { return false; }
      get currentTarget(): EventTarget { return this._currentTarget; }
      get defaultPrevented(): boolean { return this._preventDefault; }
      get eventPhase(): number { return this._phase; }
      get returnValue(): any { return undefined; }
      get target(): EventTarget { return this._originalTarget; }
      get timeStamp(): number { return this._timestamp; }
      get type(): string { return 'test'; }
      get isTrusted(): boolean { return false; }

      get srcElement() { return this.target; }

      composedPath(): EventTarget[] {
        return [];
      }

      preventDefault() {
        this._preventDefault = true;
      }

      stopImmediatePropagation() { }
      stopPropagation() { }

      createEvent() { }
      initEvent() { }
    };

    fromEvent('test', target).subscribe({
      next: event => event === testEvent && resolve()
    });

    target.dispatchEvent(testEvent);
  });
});

test('interval() should return an observable that emits multiple values over a set period of time.', async () => {
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

test('pipe() should apply operators to a source', async () => {
  return new Promise((resolve, reject) => {
    const toOne: Operator = (observable: Observable<void>) => new Observable<number>((observer) => {
      observable.subscribe({
        next: () => observer.next(1)
      });
    });
  
    const source = new Observable<void>(({ next }) => next());
    pipe(source, 
      toOne
    ).subscribe({
      next: (value: number) => {
        if (value !== 1) {
          reject(`Incorrect value mapped! (value: ${value})`);
        }

        resolve();
      }
    });
  });
});

test('map() should apply a change to the source', async () => {
  return new Promise((resolve, reject) => {
    const source = new Observable<void>(({ next }) => next());
    pipe(source, 
      map(() => 1),
      map((x: number) => x * 2),
      map((result: number) => result.toString())
    ).subscribe({
      next: (value: any) => {
        if (value !== '2') {
          reject(`Incorrect value mapped! (value: ${value})`);
        }

        resolve();
      }
    });
  });
});

test('tap() should run a function and return the same value.', async () => {
  return new Promise((resolve, reject) => {
    const source = new Observable<void>(({ next, complete }) => { 
      for(let i = 0; i < 3; i++) { 
        next() ;
      }

      complete?.();
    });

    let sideEffectResult = 0;
    pipe(source,
      tap(() => sideEffectResult += 1)
    ).subscribe({
      next: (value: any) => value && reject(),
      error: (err: Error) => reject(err),
      complete: () => {
        if (sideEffectResult !== 3) {
          reject(`Incorrect number of calls to tapFn. (sideEffectResult: ${sideEffectResult})`);
        }

        resolve();
      }
    });
  });
});

test('startWith() should subscribe to an observable that immediately emits the starting value followed by the original observable emissions.', async () => {
  return new Promise((resolve, reject) => {
    const source = new Observable<number>((observer) => {
      for (const value of [1, 2, 3]) {
        observer.next(value);
      }

      observer.complete?.();
    });

    let emissions = 0;
    pipe(source,
      startWith(0)
    ).subscribe({
      next: (value) => {
        if (emissions === 0 && value !== 0) reject(`Incorrect starting emissions. (value: ${value}`);
        if (emissions !== value) reject(`Emissions should match the value emitted. (emissions: ${emissions}, value: ${value}`);
        if (emissions > 4) reject(`Too many emissions. (emissions: ${emissions})`);
        emissions++;
      },
      complete: () => emissions === 4 ? resolve() : reject(`Wrong number of emissions on completion. (emissions: ${emissions}`)
    })
  });
});

test('swap() should replace the sources with the new observable', async () => {
  return new Promise((resolve, reject) => {
    pipe(of(1), 
      swap((v: number) => of( ['a', 'b', 'c'][v] )),
    ).subscribe({
      next: (v: string) => v === 'b' && resolve()
    });
  })
});