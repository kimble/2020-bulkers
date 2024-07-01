---
title: Experiment
---

# 2020 Bulkers

```js
const nokusd = await FileAttachment("data/nok-vs-usd.csv").csv({ typed: true });
const nokUsdByDate = nokusd.reduce((a, v) => ({ ...a, [v.date]: v.value}), {});

const round = (n) => Math.round(n * 100) / 100;

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
const mappedDividend = dividend.map((d) => ({ ...d, amountNokAtExDate: round(nokToUsdAtDate(d.exDate) * d.amount) }))
    .sort((a, b) => d3.ascending(a.exDate, b.exDate))
    .reduce((a, d, i) => ([...a, {
        ...d, 
        cumulativeAmount: i == 0  ? d.amount : a[i-1].cumulativeAmount + d.amount,
        cumulativeAmountNok: i == 0  ? d.amountNokAtExDate : round(a[i-1].cumulativeAmountNok + d.amountNokAtExDate)
    }]), []);
;
```

```js
display(mappedDividend);
```