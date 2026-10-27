import {ArrowRight,BriefcaseBusiness,Building2,ChevronRight,ShieldCheck} from 'lucide-react';
import {Shell} from '../components/Shell';
import {Link} from '../router';
import '../styles/role-auth.css';

/** Public identity selection. Selecting a card does not grant account permissions. */
export function AuthChoicePage(){
 const requested=new URLSearchParams(location.search).get('next');
 const candidateSuffix=requested==='/candidate/official-outbound'?'?next=%2Fcandidate%2Fofficial-outbound':'';
 return <Shell user={null}>
  <section className="hhba-role-auth" aria-labelledby="role-auth-title">
   <div className="hhba-role-intro">
    <span className="hhba-role-eyebrow">HHBA · HUMAN CAPABILITY NETWORK</span>
    <h1 id="role-auth-title">欢迎来到 HHBA</h1>
    <p>请选择您的身份，进入相应的登录或注册入口。</p>
   </div>
   <div className="hhba-role-grid">
    <article className="hhba-role-card hhba-role-candidate">
     <span className="hhba-role-icon"><BriefcaseBusiness size={29} aria-hidden="true"/></span>
     <span className="hhba-role-label">FOR JOB SEEKERS</span>
     <h2>我是求职者</h2>
     <p>发现工作机会，收藏感兴趣的职位，管理简历与求职进度。</p>
     <div className="hhba-role-features"><span>职位与企业发现</span><span>收藏与求职偏好</span><span>我的简历与申请</span></div>
     <Link className="hhba-role-primary" to={'/candidate/login'+candidateSuffix}>求职者登录 <ArrowRight size={17}/></Link>
     <Link className="hhba-role-secondary" to={'/candidate/register'+candidateSuffix}>还没有账户？求职者注册 <ChevronRight size={15}/></Link>
    </article>
    <article className="hhba-role-card hhba-role-enterprise">
     <span className="hhba-role-icon"><Building2 size={29} aria-hidden="true"/></span>
     <span className="hhba-role-label">FOR EMPLOYERS</span>
     <h2>我是招聘方</h2>
     <p>建立企业账户，完成企业认证，管理招聘、员工关怀和平台帮扶。</p>
     <div className="hhba-role-features"><span>企业身份与资质认证</span><span>招聘与人才管理</span><span>企业治理与发展帮扶</span></div>
     <Link className="hhba-role-primary" to="/recruiter/login">招聘方登录 <ArrowRight size={17}/></Link>
     <Link className="hhba-role-secondary" to="/recruiter/register">还没有账户？招聘方注册 <ChevronRight size={15}/></Link>
    </article>
   </div>
   <div className="hhba-role-footnote"><ShieldCheck size={17} aria-hidden="true"/><p>求职与企业服务采用同一账户体系，但企业业务权限需要独立认证。选择身份不会自动获得企业管理权限。</p></div>
   <Link className="hhba-role-browse" to="/candidate/jobs">暂不登录，先浏览招聘市场 <ArrowRight size={15}/></Link>
  </section>
 </Shell>;
}
