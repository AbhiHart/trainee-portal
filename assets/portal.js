/* Portal shell: login, role-restricted navigation, cross-portal links.
   Loaded after core.js; function declarations here replace core.js ones of the same name. */
const PORTAL = document.body.dataset.portal;
const USERS = {
 anaik:{name:'A. Naik',role:'manager',persona:'m3',title:'Line manager · Frame Shop (CVD)'},
 skulkarni:{name:'S. Kulkarni',role:'manager',persona:'m1',title:'Line manager · Engine Assembly (MCD)'},
 rjoshi:{name:'R. Joshi',role:'manager',persona:'m2',title:'Line manager · Vehicle Assembly (MCD)'},
 mrao:{name:'M. Rao',role:'manager',persona:'m4',title:'Line manager · Packing & Dispatch (SPD)'},
 dmehta:{name:'D. Mehta',role:'hod',persona:'h1',title:'Head of Department · MCD'},
 piyer:{name:'P. Iyer',role:'hod',persona:'h2',title:'Head of Department · CVD & SPD'},
 nsharma:{name:'N. Sharma',role:'hr',persona:'hr',title:'Plant HR / Personnel'},
 supervisor:{name:'Line supervisor',role:'supervisor',title:'Shift A supervisor'},
 security:{name:'Security officer',role:'supervisor',title:'Plant security'},
 coordinator:{name:'Register coordinator',role:'coordinator',title:'TPM / IE / Training'},
 timeoffice:{name:'Time office',role:'timesystem',title:'Time office operator'},
 teamlease:{name:'TeamLease desk',role:'teamlease',title:'TeamLease partner'},
 hrisadmin:{name:'HRIS admin',role:'agent',title:'HRIS / AI administrator'},
 presenter:{name:'Presenter',role:'monitor',title:'Project team'}
};
const DEMO_PW = 'Demo@123';
const PORTALS = {
 manager:{file:'manager.html',name:'Line Manager Portal',who:'Shop floor managers (appraisers)',roles:['manager'],home:'sf:home',
  nav:[['sf:home','Home'],['sf:rater','Team Rater'],['sf:forms','Appraisal forms'],['sf:people','My trainees'],['sf:cases','Conduct cases']]},
 hod:{file:'hod.html',name:'HoD Portal',who:'Heads of department (reviewing officers)',roles:['hod'],home:'sf:home',
  nav:[['sf:home','Home'],['sf:forms','Forms to sign'],['sf:cases','Conduct cases'],['sf:conv','Month 12 conversions'],['sf:people','Trainees']]},
 hr:{file:'hr.html',name:'Plant HR Portal',who:'Plant HR / Personnel',roles:['hr'],home:'sf:home',
  nav:[['sf:home','Home'],['sf:people','Employee master'],['sf:cases','Conduct cases'],['sf:conv','Conversions'],['sf:forms','All appraisal forms'],['agent:rules','Scoring rules'],['sf:integ','Integration log']]},
 supervisor:{file:'supervisor.html',name:'Line Incident Reporting',who:'Supervisors and security (line tablet)',roles:['supervisor'],home:'capture:tablet',
  nav:[['capture:tablet','Report incident'],['sup:mine','Reports sent']]},
 coordinator:{file:'coordinator.html',name:'Register Upload Portal',who:'TPM, IE and Training coordinators',roles:['coordinator'],home:'capture:reg',nav:[['capture:reg','Monthly upload']]},
 timesystem:{file:'timesystem.html',name:'Plant Time System',who:'Time office',roles:['timesystem'],home:'capture:time',nav:[['capture:time','Gate punches']]},
 teamlease:{file:'teamlease.html',name:'TeamLease Partner Portal',who:'TeamLease',roles:['teamlease'],home:'capture:tl',nav:[['capture:tl','Joiner file']]},
 agent:{file:'agent.html',name:'Scoring Agent Console',who:'HRIS / AI administrators',roles:['agent'],home:'agent:console',
  nav:[['agent:console','Agent console'],['agent:rules','Rule set'],['agent:how','How it works'],['sf:integ','Integration log']]},
 monitor:{file:'monitor.html',name:'Data Flow Monitor',who:'Project team (for presenting)',roles:['monitor','hr','agent'],home:'flow',nav:[['flow','Data flow'],['sf:integ','Integration log']]}
};
const PAGE_PORTAL = {'capture:time':'timesystem','capture:reg':'coordinator','capture:tl':'teamlease','capture:tablet':'supervisor','agent:console':'agent','agent:how':'agent','flow':'monitor'};
const P = PORTALS[PORTAL];
let ME = null;
function allowed(page){
 if(P.nav.some(n=>n[0]===page)) return true;
 if(page==='sf:profile'||page==='sf:form'||page==='sf:case') return ['manager','hod','hr'].includes(PORTAL);
 return false;
}
function portalFor(page){
 if(PAGE_PORTAL[page]) return PAGE_PORTAL[page];
 if(page==='agent:rules') return 'hr';
 if(page.startsWith('sf:')) return ['sf:rater'].includes(page)?'manager':'hr';
 return 'monitor';
}
function curSim(){ return PORTAL; }
function portalCards(){
 const creds = r => Object.entries(USERS).filter(([u,x])=>PORTALS[r].roles.includes(x.role)).map(([u])=>u).join(', ');
 return `<div class="launch">${Object.entries(PORTALS).filter(([k])=>k!=='monitor').map(([k,x])=>`<div class="lcard"><span class="tg">${esc(x.who)}</span><b>${esc(x.name)}</b><span class="lnk">${esc(x.file)}</span><span class="sub">Log in as: <span class="mono">${esc(creds(k))}</span></span><div class="row"><a class="btn pri sm" href="${x.file}" target="_blank" rel="noopener">Open portal</a></div></div>`).join('')}</div><p class="sub">Password for every demo account: <span class="mono">${DEMO_PW}</span></p>`;
}
function renderTop(){
 const last = S.log[0];
 $('#top').innerHTML = `<div class="brand">${esc(P.name)}<small>Trainee Review & Conduct Platform · prototype · sample data</small></div>
  <span class="spacer"></span>
  ${last&&ME?`<span class="lastmove" title="${esc(last.what)}">Last data movement ${esc(last.at)} · <b>${esc(last.from)} → ${esc(last.to)}</b></span>`:''}
  <span class="sync db" title="Portals open in other windows of this browser update instantly">SYNCED</span>
  ${ME?`<span class="clock">${esc(USERS[ME].name)}</span><button class="linkbtn" data-act="logout" type="button">Log out</button>`:''}`;
}
function vLogin(){
 const accts = Object.entries(USERS).filter(([u,x])=>P.roles.includes(x.role));
 return `<div class="wrap" style="max-width:460px;margin-inline:auto;padding-top:48px">
 <form class="card" id="loginf" data-form="login" novalidate>
  <div class="eyebrow">${esc(P.who)}</div>
  <h1 style="font:700 28px/1.05 var(--f-display);letter-spacing:.03em;text-transform:uppercase;margin:0 0 14px">${esc(P.name)}</h1>
  <div class="fld"><label for="lg-u">User ID</label><input id="lg-u" autocomplete="username" autocapitalize="none" spellcheck="false"></div>
  <div class="fld" style="margin-top:10px"><label for="lg-p">Password</label><input id="lg-p" type="password" autocomplete="current-password"></div>
  <div class="err" id="lg-e" style="margin-top:8px"></div>
  <button class="btn pri" type="submit" style="width:100%;justify-content:center;margin-top:12px">Sign in</button>
  <div class="note" style="margin-top:14px"><b>Demo accounts for this portal</b> (password <span class="mono">${DEMO_PW}</span>):<div class="row" style="margin-top:6px">${accts.map(([u,x])=>`<button class="btn sm" type="button" data-act="fill" data-id="${u}" title="${esc(x.title)}">${u}</button>`).join('')}</div></div>
 </form>
 <p class="sub" style="text-align:center;margin-top:12px">Prototype with sample data. <a href="index.html">All portals</a></p></div>`;
}
function vSupMine(){
 const cs = S.cases.filter(c=>c.channel==='Line tablet').sort((a,b)=>d(b.date)-d(a.date));
 return `<div class="head"><div><h1>Reports sent</h1><p>Incident reports from the line tablet and where each one is in the HR workflow.</p></div></div>
 <div class="tw"><table class="t"><thead><tr><th>Case</th><th>Date</th><th>Trainee</th><th>What happened</th><th>Status</th></tr></thead><tbody>
 ${cs.map(c=>`<tr><td class="mono">${c.id}</td><td>${fmtS(d(c.date))}</td><td class="name">${esc(S.people[c.tid].name)}</td><td>${esc(MISK[c.k].name)}</td><td>${caseChip(c)}</td></tr>`).join('')||'<tr><td colspan="5" class="empty">No reports yet.</td></tr>'}</tbody></table></div>`;
}
function pageBody(page){
 const [sys,pg] = page.split(':');
 if(page==='flow') return vFlow();
 if(page==='sup:mine') return vSupMine();
 if(sys==='capture') return ({time:cTime,reg:cReg,tl:cTL,tablet:cTablet})[pg]();
 if(sys==='agent') return ({console:aConsole,rules:aRules,how:aHow})[pg]();
 return ({home:sfHome,people:sfPeople,profile:()=>sfProfile(UI.id),forms:sfForms,form:()=>sfForm(UI.id),rater:sfRater,cases:sfCases,case:()=>sfCase(UI.id),conv:sfConv,integ:sfInteg})[pg]();
}
function render(){
 _len = null; UI.pendingRender = false;
 renderTop();
 if(!ME){ $('#app').innerHTML = vLogin(); renderDrawer(); document.title = P.name; return; }
 const page = UI.view || P.home;
 const navCur = ({'sf:profile':'sf:people','sf:form':'sf:forms','sf:case':'sf:cases'})[page] || page;
 const todo = ['manager','hod','hr'].includes(PORTAL) ? todos().length : 0;
 const body = pageBody(page);
 const wide = page==='flow';
 $('#app').innerHTML = wide ? body : `<div class="sf"><aside class="sfnav"><div class="tag"><b>${esc(USERS[ME].name)}</b>${esc(USERS[ME].title)}</div>
  <nav aria-label="${esc(P.name)}">${P.nav.map(([k,l])=>`<button type="button" data-go="${k}" ${navCur===k?'aria-current="page"':''}><span>${l}</span>${k==='sf:home'&&todo?`<span class="cnt">${todo}</span>`:''}${k==='agent:console'&&queue().length?`<span class="cnt">${queue().length}</span>`:''}</button>`).join('')}</nav></aside>
  <div class="sfbody">${body}</div></div>`;
 renderDrawer();
 document.title = P.name;
}
function go(target, id){
 const page = target.includes(':') || target==='flow' ? target : target;
 if(allowed(page)){
  UI.view = page; UI.id = id || null;
  if(page==='agent:console' && id) UI.pipe = {tid:id, step:0};
  render(); window.scrollTo(0,0); return;
 }
 const other = PORTALS[portalFor(page)];
 window.open(other.file, '_blank', 'noopener');
 toast('Opened the '+other.name+' in a new tab');
}
A.fill = el => { $('#lg-u').value = el.dataset.id; $('#lg-p').value = DEMO_PW; $('#lg-p').focus(); };
A.logout = () => { try{ sessionStorage.removeItem('sess-'+PORTAL); }catch(e){} ME = null; UI.view = null; render(); };
NOSAVE.add('fill'); NOSAVE.add('logout');
document.addEventListener('submit', e=>{
 if(e.target.id!=='loginf') return;
 e.preventDefault();
 const u = $('#lg-u').value.trim().toLowerCase(), p = $('#lg-p').value;
 const x = USERS[u];
 if(!x || p!==DEMO_PW){ $('#lg-e').textContent = 'User ID or password is wrong.'; return; }
 if(!P.roles.includes(x.role)){ $('#lg-e').textContent = 'This account has no access to the '+P.name+'. Use the portal for your role.'; return; }
 ME = u; if(x.persona) UI.persona = x.persona;
 try{ sessionStorage.setItem('sess-'+PORTAL, u); }catch(e2){}
 UI.view = P.home; render();
});
// boot
initAssess(true); seedLog();
try{ const u = sessionStorage.getItem('sess-'+PORTAL); if(u && USERS[u] && P.roles.includes(USERS[u].role)){ ME = u; if(USERS[u].persona) UI.persona = USERS[u].persona; } }catch(e){}
if(!UI.persona || !PERSONAS.some(x=>x[0]===UI.persona)) UI.persona = 'hr';
render();
initStore();
