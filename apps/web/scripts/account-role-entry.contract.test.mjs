import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const auth = readFileSync(new URL('../src/pages/AuthPage.tsx', import.meta.url), 'utf8');

test('the shared account entry lets people choose candidate or recruiter', () => {
  assert.match(auth, /你想使用 HHBA 做什么？/);
  assert.match(auth, /to="\/candidate\/register"/);
  assert.match(auth, /to="\/recruiter\/register"/);
  assert.match(auth, /location\.pathname === '\/auth'/);
});
