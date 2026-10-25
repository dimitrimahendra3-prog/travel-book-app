import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { server } = require('../server.js');

test('server serves index.html on / with 200 OK and text/html', async () => {
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  try {
    const res = await fetch(`http://127.0.0.1:${port}/`);
    assert.equal(res.status, 200);
    assert.match(res.headers.get('content-type'), /text\/html/);
    const body = await res.text();
    assert.ok(body.includes('Jejak Nusantara'));
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});

test('server returns 404 for missing file', async () => {
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  try {
    const res = await fetch(`http://127.0.0.1:${port}/non-existent-page.xyz`);
    assert.equal(res.status, 404);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});

test('server blocks path traversal attempts', async () => {
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  try {
    const res = await fetch(`http://127.0.0.1:${port}/../package.json`);
    assert.ok(res.status === 403 || res.status === 404);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});
