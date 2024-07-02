---
title: Utbyttekalkulator
---

```js
const facts = await FileAttachment("data/facts.json").json();
```


Utbyttekalkulator
-----------------

Utbyttet for forrige måned blir typisk annonsert litt ut i andre uka i måneden. På dette tidspunktet vet man ratene 
for alle dagene. Denne kalkulatoren fungerer bare så lenge alle skipene er på spot-kontrakter. 


## Operational days

Bruk dette for å ta høyde for dry dockings etc. 

```js
const operationalDays1 = view(Inputs.range([0, 31], {step: 1, value: 30, label: "Bulk Sandefjord"}));
```

```js
const operationalDays2 = view(Inputs.range([0, 31], {step: 1, value: 30, label: "Bulk Santiago"}));
```

```js
const operationalDays3 = view(Inputs.range([0, 31], {step: 1, value: 30, label: "Bulk Shenzhen"}));
```

```js
const operationalDays4 = view(Inputs.range([0, 31], {step: 1, value: 30, label: "Bulk Sydney"}));
```

```js
const operationalDays5 = view(Inputs.range([0, 31], {step: 1, value: 30, label: "Bulk Sao Paulo"}));
```

```js
const operationalDays6 = view(Inputs.range([0, 31], {step: 1, value: 30, label: "Bulk Santos"}));
```

```js
const operationalDaysTotal = operationalDays1 + operationalDays2 + operationalDays3 + operationalDays4 + operationalDays5 + operationalDays6;
```

Sum: ${operationalDaysTotal}

## Scrubber spread

Ta en titt på [nyhetssiden](https://2020bulkers.com/investor-relations/) for forrige måneds "commercial update" for en ide
om hva slags premie de får for scrubbere for tiden.

```js
const scrubberSpreadPerDayUsd = view(Inputs.range([0, 5000], {step: 1, value: 2400, label: "Per day per ship (USD)"}));
```

## Break even

I april 2024 estimerer de at de trenger Baltic 5TC Capesize index på 6.800USD for å gå i null. Dette inkluderer scrubber-fordel
som var på 145 USD/mt når de skrev det.

```js
const breakEvenUsd = view(Inputs.range([0, 5000], {step: 1, value: 2400, label: "Break even (USD)"}));
```




