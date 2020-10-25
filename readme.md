# Reaction
A reactive programming library

## NodeJS
```
const { of } = require('@gelliott181/reactionjs');

of('Hello world').subscribe({ 
  next: str => console.log(str) 
});
```