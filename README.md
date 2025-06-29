# SCZ Red API

## Endpoints
- `/api/usdt-bob` → Promedio real de USDT ↔ BOB (10 ofertas BUY/SELL)
- `/api/tasas` → tasas cruzadas BOB basadas en ese promedio

## Deploy en Render
1. Crea repo con estos archivos.
2. En Render: New → Web Service → conecta repo.
3. Build: `npm install`
4. Start: `npm start`
5. Disponible en: `https://<tu-servicio>.onrender.com/api/tasas`
