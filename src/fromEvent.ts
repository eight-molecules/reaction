import { Observable } from './Observable';

export const fromEvent = (type: string, target: EventTarget = document) => new Observable<Event>(observer => {
  const listener = (event: Event) => observer.next(event);
  target.addEventListener(type, listener);

  const unsubscribe = () => target?.removeEventListener(type, listener);
  return { unsubscribe };
});