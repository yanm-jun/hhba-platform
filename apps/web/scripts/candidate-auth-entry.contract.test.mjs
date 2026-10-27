import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const app = readFileSync(new URL('../src/main.tsx', import.meta.url), 'utf8');

test('candidate login and registration use the standard account form', () => {
  assert.match(app, /route==='\/candidate\/register'\)return <AuthPage/);
  assert.doesNotMatch(app, /DemoAuthPage/);
  assert.doesNotMatch(app, /demoModeEnabled/);
});
