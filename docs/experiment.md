---
title: Experiment
---


```js
const nokusd = await FileAttachment("data/nok-vs-usd.csv").csv({ typed: true });
const nokUsdByDate = nokusd.reduce((a, v) => ({ ...a, [v.date]: v.value}), {});

const nokToUsdAtDate = (date) => {
    const value = nokUsdByDate[date];
    
    if (value === undefined) {
        throw("Missing usd/nok at " + date);
    }
    
    return value;
};
```

```js
const dividend = await FileAttachment("data/2020-dividend.csv").csv({ typed: true });
```

```js
const mappedDividend = dividend.map((d) => ({
    ...d,
   amountNokAtExDate: nokToUsdAtDate(d.exDate) * d.amount    
}));
```

```js
display(mappedDividend);
```