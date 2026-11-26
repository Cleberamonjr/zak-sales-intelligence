import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/worker.js';
test('demo home is HTML and contains brand',async()=>{const r=await worker.fetch(new Request('https://example.test/'));assert.equal(r.status,200);assert.match(await r.text(),/ZAK Sales Intelligence/);assert.ok(r.headers.get('content-security-policy'));});
test('health reports no live sending',async()=>{const r=await worker.fetch(new Request('https://example.test/health'));assert.equal((await r.json()).liveSending,false);});
test('write requests and unknown paths rejected',async()=>{assert.equal((await worker.fetch(new Request('https://example.test/',{method:'POST'}))).status,405);assert.equal((await worker.fetch(new Request('https://example.test/private'))).status,404);});
