import { create } from "./Observable";
import { Observer } from "./Observer";

export const error = (value?: string) => create<never>(({ error }: Observer<never>) => {
  error(new Error(value));
});