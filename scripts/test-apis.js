#!/usr/bin/env node
/** Test local des moteurs (sans Vercel). */
const finsight = require('../lib/finsight');
const industrial = require('../lib/industrial');
const automl = require('../lib/automl');
const rag = require('../lib/rag');
const facial = require('../lib/facial');

(async () => {
  console.log('industrial', (await industrial.analyze({})).metrics);
  console.log('automl', automl.analyze({ prompt: 'churn' }).model);
  console.log('rag', (await rag.analyze({ question: 'obligations ESG reporting' })).sources[0].title);
  const f = await finsight.analyze({ tickers: 'AAPL,MSFT', years: 1 });
  console.log('finsight', f.metrics);
  const face = await facial.analyze({});
  console.log('facial', face.metrics);
})().catch(console.error);
