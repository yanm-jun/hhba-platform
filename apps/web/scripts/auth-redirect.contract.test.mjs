import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('登录或注册完成后默认回到首页',()=>{
 const accountAuth=read('src/pages/AuthPage.tsx');
 const demoAuth=read('src/pages/DemoAuthPage.tsx');
 assert.match(accountAuth,/const defaultNext='\/'/);
 assert.match(demoAuth,/\?returnPath:'\/'/);
 assert.doesNotMatch(accountAuth,/defaultNext=accountType==='recruiter'/);
 assert.doesNotMatch(demoAuth,/returnPath:'\/candidate\/account'/);
});

test('显式且受白名单保护的业务回跳仍被保留',()=>{
 const demoAuth=read('src/pages/DemoAuthPage.tsx');
 assert.match(demoAuth,/\['\/candidate\/account','\/candidate\/saved','\/candidate\/account\/preferences','\/candidate\/account\/profile','\/candidate\/official-outbound'\]/);
 const accountAuth=read('src/pages/AuthPage.tsx');
 assert.match(accountAuth,/next\?\.startsWith\('\/'\) && !next\.startsWith\('\/\/'\)/);
});
