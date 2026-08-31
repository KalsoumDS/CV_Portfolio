const { createHandler } = require('../lib/http');
const rag = require('../lib/rag');

module.exports = createHandler((body) => rag.analyze(body));
