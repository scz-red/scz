const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/usdt-rate', async (req, res) => {
  try {
    const url = 'https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search';

    const fetchRates = async (tradeType) => {
      const response = await axios.post(url, {
        page: 1,
        rows: 10,
        payTypes: [],
        asset: 'USDT',
        fiat: 'BOB',
        tradeType: tradeType
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      const prices = response.data.data.map(item => parseFloat(item.adv.price));
      const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
      return avg;
    };

    const buyAvg = await fetchRates('BUY');
    const sellAvg = await fetchRates('SELL');
    const avgTotal = ((buyAvg + sellAvg) / 2).toFixed(2);

    res.json({
      buy_avg: buyAvg.toFixed(2),
      sell_avg: sellAvg.toFixed(2),
      total_avg: avgTotal
    });

  } catch (err) {
    res.status(500).json({ error: 'Error al obtener datos de Binance', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`API escuchando en puerto ${PORT}`);
});
