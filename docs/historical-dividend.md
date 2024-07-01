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
  <div>

Alle utbytteutbetalinger
-------------------------

```js
function sparkbar(currency, max) {
    return (x) => htl.html`<div style="
    background: #f5f5f5;
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
<div>


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

</div>
</div>


<div class="grid grid-cols-2">
<div>

Utbytte per år
----------------

Legg merke til at utbyttet i 2021 var nesten 4x det i 2023 selv uten salg av et eneste skip. Det sier en del om hvor
hvor mye mer de tjener i et godt marked. 

En veldig stor andel av utbyttet i 2024 kommer av at [de solgte de to skipene Bulk Shanghai og Bulk Seoul for 127.5 mUSD](https://news.cision.com/2020-bulkers-limited/r/2020-bulkers-ltd---2020----sale-of-bulk-shanghai-and-bulk-seoul,c3926557) i februar.
Pengene fra salget gikk til gjeld og lavere break even + et heftig utbytte.

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
<div>

```js
display(
    resize((width) => Plot.plot({
        title: "Utbytte per år 🚀",
        subtitle: "Kronekurs basert på ex-date.",
        width,
        y: {grid: true, label: "NOK", tickFormat: (d, i, _) => (d +" kr")},
        x: {label: "Pay date"},
        marks: [
            Plot.ruleY([0]),
            Plot.rectY(mappedDividend, Plot.binX({y: "sum"}, {x: "payDate", y: "amountNokAtExDate", interval: "year", tip: true})),
        ]
    }))
);
```


</div>
</div>

