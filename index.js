const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/usdt-rate', async (req, res) => {
  try {
    const response = await axios.post(
      'https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search',
      {
        page: 1,
        rows: 10,
        payTypes: [],
        asset: 'USDT',
        fiat: 'BOB',
        tradeType: 'SELL'
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const prices = response.data.data.map(adv => parseFloat(adv.adv.price));
    const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
    res.json({ averageRate: avg.toFixed(2), source: 'Binance P2P' });
  } catch (error) {
    res.status(500).json({ error: 'No se pudo obtener el tipo de cambio' });
  }
});

app.listen(PORT, () => console.log(`API escuchando en puerto ${PORT}`));
