import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=(path)=>readFileSync(new URL('../src/'+path,import.meta.url),'utf8');
test('public auth entry selects an identity, not a demo account',()=>{
 const main=read('main.tsx'), shell=read('components/Shell.tsx'), selector=read('pages/AuthChoicePage.tsx');
 assert.match(main,/route==='\/auth'\)return <AuthChoicePage/);
 assert.match(shell,/to="\/auth">登录 \/ 注册/);
 assert.match(selector,/\/candidate\/login/);
 assert.match(selector,/\/recruiter\/login/);
 assert.doesNotMatch(main,/DemoAuthPage/);
});
test('phone auth requires trusted backend, never grants local demo identity',()=>{
 const api=read('services/api.ts'), auth=read('pages/PhoneAuthPage.tsx');
 assert.match(api,/phoneAuthReady = employerApiReady && import\.meta\.env\.VITE_HHBA_PHONE_AUTH_ENABLED==='1'/);
 assert.match(auth,/disabled=\{!phoneAuthReady\|\|!mobileValid\|\|sending\|\|seconds>0\}/);
 assert.match(auth,/disabled=\{!phoneAuthReady\|\|!mobileValid\|\|!codeValid\|\|busy\}/);
 assert.match(auth,/current\.account_types\?\.includes\(accountType\)/);
 assert.doesNotMatch(auth,/createDemoAccount|enterDemoAccount|localStorage/);
});
test('legacy email credentials remain accessible when backend is configured',()=>{
 const main=read('main.tsx'), auth=read('pages/PhoneAuthPage.tsx');
 assert.match(main,/\/candidate\/email-login/);
 assert.match(main,/\/recruiter\/email-login/);
 assert.match(auth,/已有邮箱密码账户/);
});
