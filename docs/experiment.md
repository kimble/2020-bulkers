---
title: Experiment
---


```js
const nokusd = await FileAttachment("data/nok-vs-usd.csv").csv({ typed: true });
```

```js
const dividend = await FileAttachment("data/2020-dividend.csv").csv({ typed: true });
```


```js
display(nokusd);
```

```js
display(dividend);
```