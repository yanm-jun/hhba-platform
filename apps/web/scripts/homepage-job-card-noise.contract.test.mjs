import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

const home = readFileSync(new URL('../src/pages/HomePage.tsx', import.meta.url), 'utf8');

test('homepage keeps recruitment navigation but does not render third-party job cards', () => {
  assert.doesNotMatch(home, /UnifiedJobMarket/);
  assert.match(home, /to="\/candidate\/jobs"/);
  assert.match(home, /先浏览招聘市场/);
});
