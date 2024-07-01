import {csvFormat, dsvFormat} from "d3-dsv";

async function text(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
    return response.text();
}

// Fetcher from
// https://divvydiary.com/en/2020-bulkers-stock-BMG9156K1018

const uri = "https://api.divvydiary.com/symbols/BMG9156K1018/dividends/csv";
const raw = await text(uri);
const parser = dsvFormat(";");
const parsed = parser.parse(raw);

console.log(csvFormat(parsed));