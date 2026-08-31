/** Helpers partagés pour les routes API Vercel. */

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

async function readBody(req) {
  if (req.body) {
    return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  }
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

function createHandler(run) {
  return async (req, res) => {
    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      res.end();
      return;
    }
    if (req.method !== 'POST') {
      json(res, 405, { error: 'Method not allowed' });
      return;
    }
    try {
      const body = await readBody(req);
      const result = await run(body);
      json(res, 200, result);
    } catch (err) {
      json(res, err.status || 500, { error: err.message || 'Internal error' });
    }
  };
}

module.exports = { json, readBody, createHandler };
