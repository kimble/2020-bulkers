---
title: Historisk utbytte
---

# Historisk utbytte

Data hentes fra [divvydiary.com](https://divvydiary.com/en/2020-bulkers-stock-BMG9156K1018).

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


<div class="grid grid-cols-2">
  <div class="card">

Alle utbytteutbetalinger
-------------------------

```js
function sparkbar(currency, max) {
    return (x) => htl.html`<div style="
    background: #eee;
    color: black;
    font: 10px/1.6 var(--sans-serif);
    width: ${100 * x / max}%;
    float: right;
    padding-right: 3px;
    box-sizing: border-box;
    overflow: visible;
    display: flex;
    justify-content: end;">${x.toLocaleString("en-US")} ${currency}`
}

display(Inputs.table(
        mappedDividend,
        {
            columns: [
                "payDate",
                "exDate",
                "amountNokAtExDate"
            ],
            header: {
                payDate: "Pay date",
                exDate: "Ex date",
                amountNokAtExDate: "NOK",
            },
            format: {
                amountNokAtExDate: sparkbar("NOK", d3.max(mappedDividend, d => d.amountNokAtExDate))
            }
        }
));
```

</div>
<div class="card">

Utbytte per år
----------------



```js
const groupedByYear = d3.rollup(mappedDividend, (v) => round(d3.sum(v, d => d.amountNokAtExDate)), (d) => d.payDate.getFullYear());
const dividendPerYear = Array.from(groupedByYear, ([year, dividend]) => ({ year: year + "", dividend:dividend }));

display(
    Inputs.table(
        dividendPerYear,
        {
            columns: [
                "year",
                "dividend"
            ],
            header: {
                year: "År",
                dividend: "NOK"
            },
            format: {
                dividend: sparkbar("NOK", d3.max(dividendPerYear, d => d.dividend))
            }
        }
    )
);
```

</div>
</div>


```js
display(
    resize((width) => Plot.plot({
        title: "Utbyttegraf 🚀",
        subtitle: "Kronekurs basert på ex-date.",
        width,
        y: {grid: true, label: "NOK", tickFormat: (d, i, _) => (d +" kr")},
        x: {label: "Pay date"},
        marks: [
            Plot.ruleY([0]),
            Plot.lineY(mappedDividend, {x: "payDate", y: "cumulativeAmountNok", strokeWidth: 2, stroke: "black", curve: "step-after", tip: true}),
            Plot.rectY(mappedDividend, Plot.binX({y: "sum"}, {x: "payDate", y: "amountNokAtExDate", interval: "month", tip: true})),
        ]
    }))
);
```

