---
title: Scrap value
---

# Scrap value

Dette er ting jeg ikke har peiling på, men om jeg har forstått det rett så beregner man skrapverdi ut fra [LDT](https://en.wikipedia.org/wiki/Displacement_(ship)#Light_displacement). 
Det er overraskende vanskelig å finne ut hvor mange LDT 2020 Bulkers sin skip er, noen sier 25.000, mens andre kilder på 
nett mener Newcastlemax skip er mellom 40-50.000 tonn. 

Prisen man får per tonn avhenger åpenbart av dagens stålpris og tilstanden til skipet. På nett ser det ut som dette har 
svingt mellom 400 og [600](https://www.lloydslist.com/LL1144331/Eighth-capesize-bulker-sold-for-recycling) USD/LDT de siste årene. 

```js
const facts = await FileAttachment("../data/2020-bulkers/facts.json").json();
```

```js
const nokusd = await FileAttachment("../data/nok-vs-usd.csv").csv({ typed: true });
const lastNokUsd = nokusd[nokusd.length-1];
```


## Forutsetninger 

Antall aksjer og skip er lett å finne, men jeg skulle gjerne hatt bedre data på LDT.

Den forhåndsvalgte dollarkursen er basert på kursen den ${lastNokUsd.date.toLocaleString(undefined, {
"month": "2-digit",
"day": "2-digit",
"year": "numeric"
})}.

```js
const nokPerUsd = view(Inputs.range([6, 14], {step: 0.1, value: lastNokUsd.value, label: "Dollarkurs"}));
```

```js
const numberOfShips = view(Inputs.range([1, facts.numberOfShips+2], {step: 1, value: facts.numberOfShips, label: "Antall skip"}));
```

```js
const numberOfShares = view(Inputs.range([20000000, 30000000], {step: 1, value: facts.numberOfShares, label: "Antall aksjer"}));
```

```js
const ldtPerShip = view(Inputs.range([20000, 50000], {step: 1, value: 25000, label: "LDT per skip"}));
```


<div class="grid grid-cols-2">
  <div>


## Beregnet skrapverdi 

Både per skip og for hele flåten.

```js
const prices = [ 300, 350, 400, 450, 500, 550, 600, 650, 700 ];
const data = prices.map((p) => ({ pricePerLdt: p, fleetScrapValue: p * numberOfShips * ldtPerShip, perShipScrapValue: p * ldtPerShip }));
const priceFormat = d3.format(",");

display(
    resize((width) => Plot.plot({
        marginLeft: 60,
        width,
        y: {grid: true, label: "NOK", tickFormat: (d, i, _) => (priceFormat(Math.round((d * nokPerUsd) / 1000000)) +" mill")},
        x: {label: "Scrap price in USD/LDT"},
        marks: [
            Plot.ruleY([0]),
            Plot.lineY(data, {x: "pricePerLdt", y: "fleetScrapValue", strokeWidth: 2, stroke: "black", tip: true}),
            Plot.lineY(data, {x: "pricePerLdt", y: "perShipScrapValue", strokeWidth: 2, stroke: "black", tip: true}),
        ]
    }))
);

```

</div>
<div>

## Beregnet skrapverdi per aksje

Både per skip og for hele flåten.

```js
const prices = [ 300, 350, 400, 450, 500, 550, 600, 650, 700 ];
const data = prices.map((p) => ({ pricePerLdt: p, fleetScrapValuePerShare: (p * numberOfShips * ldtPerShip) / numberOfShares, shipScrapValuePerShare: (p * ldtPerShip) / numberOfShares }));
const priceFormat = d3.format(",");

display(
    resize((width) => Plot.plot({
        marginLeft: 60,
        width,
        y: {grid: true, label: "NOK", tickFormat: (d, i, _) => (priceFormat(Math.round((d * nokPerUsd))) +" kr")},
        x: {label: "Scrap price in USD/LDT"},
        marks: [
            Plot.ruleY([0]),
            Plot.lineY(data, {x: "pricePerLdt", y: "fleetScrapValuePerShare", strokeWidth: 2, stroke: "black", tip: true}),
            Plot.lineY(data, {x: "pricePerLdt", y: "shipScrapValuePerShare", strokeWidth: 2, stroke: "black", tip: true}),
        ]
    }))
);

```

</div>
</div>