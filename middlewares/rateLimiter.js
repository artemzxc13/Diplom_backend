const rateLimit = require('express-rate-limit');

const rateLimita = rateLimit({
  windowMs: 15 * 60 * 1000, // 15m
  max: 100,
  message: 'Слишком много запросов с этого IP',
});

module.exports = { rateLimita };
