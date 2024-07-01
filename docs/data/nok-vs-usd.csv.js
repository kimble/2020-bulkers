import {csvFormat, dsvFormat} from "d3-dsv";

async function text(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
    return response.text();
}

// Norges Bank has a lovely API for this!
// https://app.norges-bank.no/query/index.html#/no/currency
const uri = "https://data.norges-bank.no/api/data/EXR/B.USD.NOK.SP?apisrc=qb&format=csv&startPeriod=2020-01-01&endPeriod=2024-07-01&locale=no&bom=include";
const raw = await text(uri);
const parser = dsvFormat(";")

const parsed = parser.parse(raw, (d) => {
    return {
        date: d["TIME_PERIOD"],
        value: parseFloat(d["OBS_VALUE"].replace(",", "."))
    }
});

process.stdout.write(csvFormat(parsed));