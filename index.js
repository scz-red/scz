const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

async function promP2P(type) {
  const res = await fetch('https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search', {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
      page:1, rows:10, payTypes:[], asset:'USDT',
      tradeType: type, fiat:'BOB', merchantCheck: false
    })
  });
  const data = await res.json();
  const prices = data.data.map(o => parseFloat(o.adv.price));
  return prices.reduce((a, b) => a + b, 0) / prices.length;
}

async function fetchSpot(symbol) {
  const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
  const json = await res.json();
  return parseFloat(json.price);
}

app.get('/api/usdt-bob', async (_, res) => {
  const buy = await promP2P('BUY'), sell = await promP2P('SELL');
  const avg = (buy + sell) / 2;
  res.json({
    USDT_BOB: +avg.toFixed(4),
    compra_usdt: +buy.toFixed(4),
    venta_usdt: +sell.toFixed(4),
    actualizado: new Date().toISOString()
  });
});

app.get('/api/tasas', async (_, res) => {
  const { USDT_BOB } = (await fetch(`http://localhost:${PORT}/api/usdt-bob`).then(r => r.json()));
  const symbols = ['BTCUSDT','ETHUSDT','BNBUSDT','EURUSDT','GBPUSDT','PENUSDT','COPUSDT','MXNUSDT','ARSUSDT','CLPUSDT','CNYUSDT'];
  const rates = {};
  for (let s of symbols) {
    const v = await fetchSpot(s);
    const code = s.replace('USDT','');
    rates[`${code}_BOB`] = + (v * USDT_BOB).toFixed(4);
  }
  res.json({ tasas: rates });
});

app.listen(PORT,()=>console.log('API activa en puerto', PORT));
