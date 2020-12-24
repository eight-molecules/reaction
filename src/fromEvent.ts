import { create } from './Observable';
import { Observer } from './Observer';

export const fromEvent = (type: string, target: EventTarget = document) => create<Event>((observer: Observer<Event>) => {
  const listener = (event: Event) => observer.next(event);
  target.addEventListener(type, listener);

  const unsubscribe = () => target?.removeEventListener(type, listener);
  return { unsubscribe };
});