import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../src/worker.js';
const req=(path,options)=>new Request('https://example.test'+path,options);
test('private shell contains no credentials',async()=>{const r=await worker.fetch(req('/private'));assert.equal(r.status,200);assert.match(await r.text(),/Token de acesso/);assert.match(r.headers.get('content-security-policy'),/connect-src 'self'/)});
test('unconfigured API fails closed',async()=>{assert.equal((await worker.fetch(req('/api/projects?company=alliva'),{})).status,503)});
test('incorrect token denied before DB access',async()=>{assert.equal((await worker.fetch(req('/api/projects?company=alliva',{headers:{Authorization:'Bearer wrong'}}),{ADMIN_TOKEN:'test-only-token',DB:{}})).status,401)});
test('AI disabled by default',async()=>{assert.equal((await worker.fetch(req('/api/sales-plan?company=alliva&project=x',{method:'POST',headers:{Authorization:'Bearer test-only-token'}}),{ADMIN_TOKEN:'test-only-token',DB:{}})).status,503)});
test('invalid company rejected',async()=>{assert.equal((await worker.fetch(req('/api/projects?company=invalid',{headers:{Authorization:'Bearer test-only-token'}}),{ADMIN_TOKEN:'test-only-token',DB:{}})).status,400)});
