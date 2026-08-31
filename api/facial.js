const { createHandler } = require('../lib/http');
const facial = require('../lib/facial');

module.exports = createHandler((body) => Promise.resolve(facial.analyze(body)));
