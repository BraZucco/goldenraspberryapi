const express = require('express');
const { getProducerIntervals, getRepeatedProducers, getAllProducers } = require('../config/database');

const router = express.Router();

// Rota para produtores repetidos
router.get('/repeated', async (req, res) => {
  const results = await getRepeatedProducers();
  res.json(results);
});

// Rota para todos os produtores
router.get('/all', async (req, res) => {
  const results = await getAllProducers();
  res.json(results);
});

// Rota para intervalos entre vitórias
router.get('/intervals', async (req, res) => {
  const results = await getProducerIntervals();

  const minInterval = Math.min(...results.map((r) => r.interval));
  const maxInterval = Math.max(...results.map((r) => r.interval));

  const response = {
    min: results.filter((r) => r.interval === minInterval),
    max: results.filter((r) => r.interval === maxInterval),
  };

  res.json(response);
});

module.exports = router;
