const { createHandler } = require('../lib/http');
const automl = require('../lib/automl');

module.exports = createHandler((body) => Promise.resolve(automl.analyze(body)));
