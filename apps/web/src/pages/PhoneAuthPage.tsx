import {type FormEvent,useEffect,useState} from 'react';
import {ArrowLeft,ArrowRight,Building2,CheckCircle2,LockKeyhole,MessageSquareText,ShieldCheck,Smartphone,UserRound} from 'lucide-react';
import {Shell} from '../components/Shell';
import {Link,navigate} from '../router';
import {api,ApiError,employerApiReady,phoneAuthReady,type AccountType,type User} from '../services/api';
import '../styles/role-auth.css';

type Mode='login'|'register';
type Props={user:User|null;onUser:(value:User)=>void;accountType:AccountType;initialMode:Mode};

/** Phone UI stays non-operational until a real trusted OTP backend is activated. */
export function PhoneAuthPage({user,onUser,accountType,initialMode}:Props){
 const [mode,setMode]=useState<Mode>(initialMode);
 const [phone,setPhone]=useState('');
 const [code,setCode]=useState('');
 const [name,setName]=useState('');
 const [seconds,setSeconds]=useState(0);
 const [error,setError]=useState('');
 const [notice,setNotice]=useState('');
 const [sending,setSending]=useState(false);
 const [busy,setBusy]=useState(false);
 const candidate=accountType==='candidate';
 const stem=candidate?'/candidate':'/recruiter';
 const requested=new URLSearchParams(location.search).get('next');
 const safeNext=candidate&&requested==='/candidate/official-outbound'
  ?'/candidate/official-outbound'
  :!candidate&&requested==='/recruiter/onboarding'
   ?'/recruiter/onboarding':candidate?'/candidate':'/employer/hub';
 const suffix=safeNext==='/candidate/official-outbound'?'?next=%2Fcandidate%2Fofficial-outbound'
  :safeNext==='/recruiter/onboarding'?'?next=%2Frecruiter%2Fonboarding':'';
 const title=candidate?'求职者':'招聘方';
 const mobileValid=/^1[3-9]\d{9}$/.test(phone);
 const codeValid=/^\d{6}$/.test(code);
 const accountHasRole=!!user?.account_types?.includes(accountType);

 useEffect(()=>{setMode(initialMode);setError('');setNotice('');setCode('');},[initialMode,accountType]);
 useEffect(()=>{if(seconds<=0)return;const timer=window.setTimeout(()=>setSeconds(seconds-1),1000);return()=>window.clearTimeout(timer);},[seconds]);
 useEffect(()=>{if(accountHasRole)navigate(safeNext);},[accountHasRole,safeNext]);

 async function sendCode(){
  setError('');setNotice('');
  if(!phoneAuthReady)return setError('真实短信服务尚未接通，暂时不能发送验证码。');
  if(!mobileValid)return setError('请输入正确的中国大陆 11 位手机号。');
  if(sending||seconds>0)return;
  setSending(true);
  try{
   const result=await api.sendPhoneCode(phone,accountType,mode);
   const cooldown=Math.min(120,Math.max(30,Number(result.retry_after_seconds)||60));
   setSeconds(cooldown);
   setNotice('验证码请求已提交，请查看手机短信。');
  }catch(e){setError(e instanceof ApiError?e.message:'验证码发送失败，请稍后再试。');}
  finally{setSending(false);}
 }
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();setError('');setNotice('');
  if(!phoneAuthReady)return setError('真实账户服务尚未接入，不能进行注册或登录。');
  if(!mobileValid||!codeValid)return setError('请核对手机号，并输入 6 位短信验证码。');
  if(mode==='register'&&name.trim().length<2)return setError('请填写至少两个字符的展示名称。');
  setBusy(true);
  try{
   await api.phoneSession({phone,code,mode,account_type:accountType,display_name:mode==='register'?name.trim():undefined});
   const current=await api.me();
   if(!current.account_types?.includes(accountType))throw new ApiError(403,'当前账号尚未开通该身份，请联系管理员核对权限。');
   onUser(current);navigate(safeNext);
  }catch(e){setError(e instanceof ApiError?e.message:'账户验证失败，请稍后重试。');}
  finally{setBusy(false);}
 }
 if(accountHasRole)return null;
 return <Shell user={user}>
  <section className="hhba-phone-auth" aria-labelledby="hhba-phone-title">
   <div className="hhba-phone-main">
    <Link className="hhba-phone-back" to="/auth"><ArrowLeft size={15}/> 返回身份选择</Link>
    <span className="hhba-role-eyebrow">{candidate?'HHBA · CANDIDATE ACCOUNT':'HHBA · EMPLOYER ACCOUNT'}</span>
    <span className="hhba-phone-icon">{candidate?<UserRound size={24}/>:<Building2 size={24}/>}</span>
    <h1 id="hhba-phone-title">{mode==='login'?title+'登录':title+'注册'}</h1>
    <p className="hhba-phone-description">使用中国大陆手机号和短信验证码{mode==='login'?'登录':'创建'} HHBA 账户。</p>
    <div className="hhba-phone-tabs" role="group" aria-label="切换注册或登录">
     <Link aria-current={mode==='login'?'page':undefined} className={mode==='login'?'active':''} to={stem+'/login'+suffix}>登录</Link>
     <Link aria-current={mode==='register'?'page':undefined} className={mode==='register'?'active':''} to={stem+'/register'+suffix}>注册</Link>
    </div>
    {!phoneAuthReady&&<div className="hhba-phone-status" role="status">
      <ShieldCheck size={19} aria-hidden="true"/>
      <div><strong>短信验证码功能待接入</strong><p>此页面是正式账户界面的开发预览。未接通受保护的后端及阿里云短信服务，不会发送短信、创建用户或模拟登录成功。</p></div>
    </div>}
    {user&&!accountHasRole&&<div className="hhba-phone-status" role="status">
      <LockKeyhole size={18} aria-hidden="true"/>
      <div><strong>当前账户尚无{title}权限</strong><p>不同身份共用账户，不会因点击入口自动获得企业权限；需通过后端开通相应身份。</p></div>
    </div>}
    <form className="hhba-phone-form" onSubmit={submit}>
      {mode==='register'&&<label htmlFor="hhba-auth-name">展示名称<input id="hhba-auth-name" maxLength={60} required minLength={2} autoComplete="name" value={name} onChange={e=>setName(e.target.value)} placeholder={candidate?'怎么称呼您':'企业联系人姓名'}/></label>}
      <label htmlFor="hhba-auth-phone">手机号<div className="hhba-phone-number"><span>+86</span><input id="hhba-auth-phone" type="tel" inputMode="numeric" maxLength={11} required autoComplete="tel-national" value={phone} onChange={e=>{setPhone(e.target.value.replace(/\D/g,''));setError('');}} placeholder="请输入 11 位手机号"/></div></label>
      <label htmlFor="hhba-auth-code">短信验证码<div className="hhba-phone-code"><input id="hhba-auth-code" type="text" inputMode="numeric" maxLength={6} required autoComplete="one-time-code" value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,''))} placeholder="请输入 6 位验证码"/><button type="button" disabled={!phoneAuthReady||!mobileValid||sending||seconds>0} onClick={()=>void sendCode()}>{sending?'发送中…':seconds>0?seconds+' 秒后重试':'获取验证码'}</button></div></label>
      {error&&<p className="hhba-phone-error" role="alert">{error}</p>}
      {notice&&<p className="hhba-phone-notice" role="status">{notice}</p>}
      <button className="hhba-phone-submit" type="submit" disabled={!phoneAuthReady||!mobileValid||!codeValid||busy}>{busy?'验证中…':mode==='login'?'登录并进入'+title+'端':'注册并进入'+title+'端'}<ArrowRight size={17}/></button>
    </form>
    {employerApiReady&&<Link className="hhba-phone-legacy" to={stem+'/email-'+mode+suffix}>已有邮箱密码账户？使用原登录方式</Link>}
    <p className="hhba-phone-hint"><LockKeyhole size={14}/> 验证码只用于身份验证；请勿将验证码透露给他人。</p>
    <Link className="hhba-phone-browse" to={candidate?'/candidate/jobs':'/employer/start'}>{candidate?'先浏览招聘市场':'先了解企业服务'} <ArrowRight size={15}/></Link>
   </div>
   <aside className="hhba-phone-aside">
     <span>{candidate?'YOUR CAREER WORKSPACE':'YOUR EMPLOYER WORKSPACE'}</span>
     <h2>{candidate?<>找到值得投入的机会。<br/>从 HHBA 开始。</>:<>让善待员工的企业，<br/>获得更多可能。</>}</h2>
     <p>{candidate?'发现、收藏、比较机会，在一个地方管理你的求职旅程。':'从真实招聘与企业认证出发，让企业信誉、人才与成长形成正向循环。'}</p>
     <div className="hhba-phone-aside-point"><CheckCircle2 size={20}/><span>{candidate?'职位、企业与专业探索':'企业身份与经办人认证'}</span></div>
     <div className="hhba-phone-aside-point"><Smartphone size={20}/><span>{candidate?'统一账户与个人中心':'企业招聘与人才工作台'}</span></div>
     <div className="hhba-phone-aside-point"><MessageSquareText size={20}/><span>{candidate?'简历、收藏和求职记录':'员工关怀、申诉与发展帮扶'}</span></div>
     <div className="hhba-phone-aside-brand"><strong>HHBA.</strong><small>Human Capability Network</small></div>
   </aside>
  </section>
 </Shell>;
}
