# Reaction
A reactive programming library

## Install
NPM: `npm install --save @gelliott181/reactionjs`
CDN: `<script type="text/javascript" src="https://unpkg.com/@gelliott181/reactionjs@1.0.0"></script>`

## NodeJS
```
const { of } = require('@gelliott181/reactionjs');

of('Hello world').subscribe({ 
  next: str => console.log(str) 
});
```

## Browser
```
<html>
<head>
  <script type="text/javascript" src="https://unpkg.com/@gelliott181/reactionjs@1.0.0/dist/reaction.js"></script>
  
  <script type="text/javascript">
    const { Observable, pipe, map } = reaction;
    const fromEvent = (event, el = document) => new Observable(observer => {
      const listener = (e) => observer.next(e);
      if (typeof el === 'string') {
        document.querySelector(el).addEventListener(event, listener);
      } else {
        el.addEventListener(event, listener);
      }
    });
    
    fromEvent('DOMContentLoaded', window).subscribe({
      next: () => {
        const app = document.querySelector('p#name-output');
        
        pipe(
        fromEvent('input', `input[name='name-input']`),
        map(e => e.target.value)
        ).subscribe({next: (str) => app.innerHTML = `<p>${str}</p>`});
      }
    });
  </script>
</head>

<body>
  <div id="app">
    <input name="name-input" autocomplete="off"/>
    <p id="name-output"></p>
  </div>
</body>
</html>
```
