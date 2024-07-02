---
title: Utbyttekalkulator
---

```js
const priceFormat = d3.format(",");
const facts = await FileAttachment("data/facts.json").json();
```


Utbyttekalkulator
-----------------

Utbyttet for forrige måned blir typisk annonsert litt ut i andre uka i måneden. På dette tidspunktet vet man ratene 
for alle dagene. 

**Obs!** Denne kalkulatoren fungerer bare så lenge alle skipene er på spot-kontrakter. Dersom de begynner å sikre 
deler av flåten på faste kontrakter igjen må denne kalkulatoren oppdateres. 


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

## Scrubber benefit

Ta en titt på [nyhetssiden](https://2020bulkers.com/investor-relations/) for forrige måneds "commercial update" for en ide
om hva slags premie de får for scrubbere for tiden. Alternativt teste [kalkulatoren](/scrubber-calculator).

```js
const scrubberSpreadPerDayUsd = view(Inputs.range([0, 5000], {step: 1, value: 2400, label: "Per day per ship (USD)"}));
```

## Break even

"Following the refinancing of the Term Loan Facility, the Company’s estimated cash breakeven will be US$11,800 per day per vessel." - [April 2024](https://news.cision.com/2020-bulkers-limited/r/2020-bulkers-ltd---2020----financing-update-and-special-dividend,c3958291)

**Todo:** Tror jeg bruker denne feil... Nå ganger jeg denne med operational days, men selskapet har jo utgifter uavhengig av om skipet er i bruk eller ikke.. 

```js
const breakEvenPerShipUsd = view(Inputs.range([0, 20000], {step: 100, value: 11800, label: "Break even per skip (USD)"}));
```

## Premium

Skipene til 2020 Bulkers er større enn en standard capesize så de tjener en premium til de vanlige capesize ratene. I april
2024 ble [39% brukt som et eksempel](https://x.com/2Bulkers/status/1777660327372484831/photo/1).

```js
const premiumToBciPercent = view(Inputs.range([0, 100], {step: 1, value: 39, label: "Premium percentage to standard capesize rate (%)"}));
```

## BCI - Baltic capesize index

Skulle gjerne hatt en bedre kilde til denne. Beste jeg har funnet så langt er det [2020 Bulkers poster på Twitter](https://x.com/2Bulkers) hver dag.

```js
const bci = view(Inputs.range([0, 100000], {step: 100, value: 25000, label: "BCI (USD)"}));
```

## Output

```js
const premiumAdjustedRate = bci + (bci * (premiumToBciPercent / 100));
const sumScrubberBenefit = scrubberSpreadPerDayUsd * operationalDaysTotal;
const sumBreakEven = breakEvenPerShipUsd * operationalDaysTotal;
const sumRatesForOperationalDays = operationalDaysTotal * premiumAdjustedRate;

const sum = sumScrubberBenefit + sumRatesForOperationalDays - sumBreakEven;

```

**Total number of operational days:** ${operationalDaysTotal}

**Premium adjusted rate:** ${priceFormat(premiumAdjustedRate)} USD

**Sum scrubber benefit:** ${priceFormat(sumScrubberBenefit)} USD

**Sum rates for operational days:** ${priceFormat(sumRatesForOperationalDays)} USD



**Sum:**<br/> ${priceFormat(sum)} USD

**Sum per share:**<br/> ${priceFormat(sum/facts.numberOfShares)} USD