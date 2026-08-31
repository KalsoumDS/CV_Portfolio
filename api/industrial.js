const { createHandler } = require('../lib/http');
const industrial = require('../lib/industrial');

module.exports = createHandler((body) => Promise.resolve(industrial.analyze(body)));
