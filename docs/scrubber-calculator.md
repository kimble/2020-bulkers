---
title: Scrubber kalkulator
---

```js
const priceFormat = d3.format(",");
const facts = await FileAttachment("data/facts.json").json();
```

# Scrubber kalkulator 

Skipene til 2020 har scrubbere som gjør at de kan brenne [billigere](https://integr8fuels.com/stable-prices-at-the-moment-but-wider-vlsfo-hsfo-spread-going-forward/) 
olje med høyere innhold av svovel enn skip uten scrubbere. Kontraktene 2020 inngår gir de en andel av besparelsen. 

Skulle ønske at man kunne linke direkte til innlegg på [Nordnet sitt forum](https://www.nordnet.no/market/stocks/16786171-2020-bulkers) for
spesielt [Eriksens Oppsparte](https://www.nordnet.no/aksjeforum/medlem/eriksens-oppsparte) har en del innlegg hvor han forklarer hvordan
en del av disse regnestykkene ser ut.

Det er en del ting som gjør det veldig vanskelig å regne på dette.

1. Prisene på drivstoff varierer fra sted til sted i verden
2. Vi aner ikke når, hvor eller hvor mye drivstoff hver skip fyller
3. Spread varierer ganske mye fra måned til måned
4. Drivstoffbehovet avhenger av fart, antall dager til kais, antall dager med last...

## Input

```js
const numberOfShips = view(Inputs.range([1, facts.numberOfShips+2], {step: 1, value: facts.numberOfShips, label: "Antall skip"}));
```

```js
const metricTonnsPerDayPerShip = view(Inputs.range([1, 100], {step: 1, value: 50, label: "Tonn drivstoff per skip per dag"}));
```

```js
const spreadPerTonnUsd = view(Inputs.range([0, 500], {step: 1, value: 150, label: "Spread i USD / mt"}));
```

```js
const shareOfSavings = view(Inputs.range([0, 100], {step: 1, value: 50, label: "Vår andel av besparelsen"}));
```


```js
const scrubberSavingsPerShip = (metricTonnsPerDayPerShip * spreadPerTonnUsd) * (shareOfSavings / 100);
const scrubberSavingsFleet = scrubberSavingsPerShip * numberOfShips; 
```

## Output

Her er 2020 Bulkers sin andel av besparelsen per dag. 

**Per skip:**<br/>${priceFormat(scrubberSavingsPerShip)} USD.

**Hele flåten:**<br/>${priceFormat(scrubberSavingsFleet)} USD.

