const express = require('express');
const cors = require('cors');
require('dotenv').config();
const habitsMock = require('./routes/habitsMock');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/habits', habitsMock);

app.get('/', (req, res) => res.json({ ok: true, version: '1.0' }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on ${port}`));
