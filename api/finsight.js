const { createHandler } = require('../lib/http');
const finsight = require('../lib/finsight');

module.exports = createHandler((body) => finsight.analyze(body));
