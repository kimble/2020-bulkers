import yahooFinance from 'yahoo-finance2';

const results = await yahooFinance.quote('2020.OL');

process.stdout.write(JSON.stringify({
    price: results.regularMarketPrice,
    currency: results.currency,
    longName: results.longName,
}));