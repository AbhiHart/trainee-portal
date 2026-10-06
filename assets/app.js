/* PRAGATI · portal shell: login, routing, actions, shared store. */
const PORTAL = document.body.dataset.portal;
const USERS = {
 anaik:{name:'A. Naik',role:'manager',persona:'m3',title:'Line manager · Frame Shop'},
 skulkarni:{name:'S. Kulkarni',role:'manager',persona:'m1',title:'Line manager · Engine Assembly'},
 rjoshi:{name:'R. Joshi',role:'manager',persona:'m2',title:'Line manager · Vehicle Assembly'},
 msawant:{name:'M. Sawant',role:'manager',persona:'m5',title:'Line manager · Machine Shop'},
 kpillai:{name:'K. Pillai',role:'manager',persona:'m6',title:'Line manager · Paint Shop'},
 mrao:{name:'M. Rao',role:'manager',persona:'m4',title:'Line manager · Packing & Dispatch'},
 dmehta:{name:'D. Mehta',role:'hod',persona:'h1',title:'Head of Department · MCD'},
 piyer:{name:'P. Iyer',role:'hod',persona:'h2',title:'Head of Department · CVD & SPD'},
 vdeshpande:{name:'V. Deshpande',role:'plant',title:'Plant Head · '+PLANT},
 nsharma:{name:'N. Sharma',role:'hr',title:'Plant HR · Personnel'},
 supervisor:{name:'Line supervisor',role:'tablet',title:'Shift A supervisor'},
 security:{name:'Security officer',role:'tablet',title:'Plant security'},
 coordinator:{name:'Kaizen & TPM coordinator',role:'coordinator',title:'TPM / IE / Training'},
 timeoffice:{name:'Time office',role:'timesystem',title:'Time office operator'},
 teamlease:{name:'TeamLease desk',role:'teamlease',title:'TeamLease partner'},
 hrisadmin:{name:'HRIS admin',role:'agent',title:'HRIS / AI administrator'},
 presenter:{name:'Presenter',role:'monitor',title:'Project team'}
};
const DEMO_PW = 'Demo@123';
const PORTALS = {
 home:{file:'index.html',name:'Portals',roles:[],nav:[]},
 manager:{file:'manager.html',name:'Line Manager',icon:'clip',who:'Line managers on the shop floor (appraisers)',roles:['manager'],
  pitch:'Appraise your apprentices in minutes, evaluate their kaizens and validate incidents from your line.',
  points:['One review per apprentice, at Month 12: 16 plain statements on a 1–5 scale','Attendance, kaizens, skills and conduct pulled in for you','Quick rate the whole team one bucket at a time'],
  nav:[['home','Home'],['team','My apprentices'],['reviews','Reviews'],['quick','Quick rate'],['kaizen','Kaizen'],['cases','Conduct']]},
 hod:{file:'hod.html',name:'Head of Department',icon:'users',who:'Skip-level managers (reviewing officers)',roles:['hod'],
  pitch:'See each apprentice on one page: the line manager’s appraisal with every record behind it.',
  points:['Summary per apprentice with the year\u2019s records and agent flags','Sign or return reviews; decide conduct actions','Decide Month 12 conversions with the full record'],
  nav:[['home','Home'],['reviews','Reviews to sign'],['team','Apprentices'],['cases','Conduct'],['m12','Conversions']]},
 plant:{file:'plant.html',name:'Plant Head',icon:'plant',who:'Plant head and leadership',roles:['plant'],
  pitch:'The whole apprentice programme at a glance.',
  points:['Review cycle, band mix and risk by department','Conversion pipeline','Kaizen activity and verified savings'],
  nav:[['dash','Overview'],['team','Apprentices'],['kzdash','Kaizen'],['m12','Conversions']]},
 hr:{file:'hr.html',name:'Plant HR',icon:'shield',who:'Plant HR and Personnel',roles:['hr'],
  pitch:'Own the apprentice record: views, rules, conduct, conversions and data feeds.',
  points:['Configurable apprentice master and role views','Scoring rules with equal, editable weights','Finalise decisions and send them to SAP SF/EC'],
  nav:[['home','Home'],['dash','Plant overview'],['master','Apprentice master'],['cases','Conduct'],['m12','Conversions'],['kzreg','Kaizens'],['sources','Data sources'],['settings','Settings']]},
 tablet:{file:'supervisor.html',name:'Line Tablet',icon:'tablet',who:'Supervisors, security and apprentices at the line',roles:['tablet'],
  pitch:'Capture at the source: incidents and kaizen ideas, straight from the line.',points:['Report an incident in under a minute','Submit a kaizen sheet with photos','Track where each submission is'],
  nav:[['kzsubmit','Submit kaizen'],['report','Report incident'],['sent','My submissions']]},
 coordinator:{file:'coordinator.html',name:'Coordinator',icon:'bulb',who:'Kaizen, TPM, IE and training coordinators',roles:['coordinator'],
  pitch:'Verify kaizens are sustained and upload the monthly registers.',points:['Sustain checks 30 days after implementation','Skill matrix, JH and IE in one upload','The full digital kaizen register'],
  nav:[['kzverify','Kaizen verification'],['kzreg','Kaizen register'],['upload','Monthly upload']]},
 timesystem:{file:'timesystem.html',name:'Time System',icon:'clock',who:'Time office (simulated source)',roles:['timesystem'],pitch:'Simulates the plant time system that sends attendance to PRAGATI.',points:[],nav:[['punches','Gate punches']]},
 teamlease:{file:'teamlease.html',name:'TeamLease',icon:'tl',who:'TeamLease partner (simulated source)',roles:['teamlease'],pitch:'Simulates the weekly TeamLease joiner file.',points:[],nav:[['joiners','Joiner file']]},
 agent:{file:'agent.html',name:'Scoring Agent',icon:'agent',who:'HRIS and AI administrators',roles:['agent'],pitch:'Watch the agent score a review step by step.',points:['Rules for records, AI only for comments','Every run logged and reproducible'],
  nav:[['console','Agent console'],['rules','Rule set'],['how','How it works'],['sources','Data sources'],['log','Integration log']]},
 monitor:{file:'monitor.html',name:'Data Flow',icon:'flow',who:'Project team (for presenting)',roles:['monitor','hr','agent'],pitch:'See data move between sources, PRAGATI, the agent and SAP SF/EC.',points:[],nav:[['flow','Data flow'],['log','Integration log']]}
};
const P = PORTALS[PORTAL];
const VIEWS = {
 home:()=>({manager:vMgrHome,hod:vHodHome,hr:vHrHome})[PORTAL](), team:vTeam, reviews:vReviews, quick:vQuick, kaizen:vKzEval, cases:vCases, m12:vM12,
 dash:vPlantDash, kzdash:vKzDash, master:vMaster, kzreg:vKzReg, rules:vRules, access:vAccess, sources:vSources, log:vLog,
 report:vReport, kzsubmit:vKzSubmit, sent:vSent, kzverify:vKzVerify, upload:vUpload, punches:vPunches, joiners:vJoiners,
 console:vConsole, how:vHow, flow:vFlow, settings:vSettings, person:vPerson, review:vReview, case:vCase
};
const DETAIL = ['person','review','case'];
const HR_SET = ['rules','access','log'];
const PAGE_PORTAL = {punches:'timesystem',joiners:'teamlease',upload:'coordinator',kzverify:'coordinator',report:'tablet',kzsubmit:'tablet',console:'agent',flow:'monitor',quick:'manager',kaizen:'manager',master:'hr',access:'hr',sources:'hr',dash:'plant'};
let S = null, ME = null;
const UI = {open:{}, pipe:{tid:null,step:0,timer:null}, drawer:null, q:'', route:null};
const USER = () => USERS[ME];

function canSee(p){ const u = USER(); if(!u) return false; if(u.role==='manager') return p.mgr===u.persona; if(u.role==='hod') return HODS[u.persona].divs.includes(MANAGERS[p.mgr].div); return true; }
function myPeople(){ return Object.values(S.people).filter(canSee); }
function allowed(v){ return P.nav.some(n=>n[0]===v) || (PORTAL==='hr' && HR_SET.includes(v)) || (DETAIL.includes(v) && ['manager','hod','plant','hr','agent'].includes(PORTAL)); }
function parseHash(){ const h = location.hash.replace(/^#\/?/,'').split('/').filter(Boolean); return {v:h[0]||'', id:h[1]?decodeURIComponent(h[1]):null, tab:h[2]||null}; }

/* ----- header ----- */
function navCount(k){
 if(!ME) return 0; const u = USER(), ps = ['manager','hod'].includes(u.role) ? myPeople() : Object.values(S.people), has = f => ps.some(p=>p.id===f.tid);
 if(u.role==='manager'){ if(k==='reviews') return S.forms.filter(f=>has(f)&&!isDone(f)).length; if(k==='kaizen') return S.kaizens.filter(x=>x.status==='Submitted'&&ps.some(p=>p.id===x.tid)).length; if(k==='cases') return S.cases.filter(c=>c.status===1&&ps.some(p=>p.id===c.tid)).length; }
 if(u.role==='hod'){ if(k==='reviews') return S.forms.filter(f=>has(f)&&f.status==='With HoD').length; if(k==='cases') return S.cases.filter(c=>c.status===2&&ps.some(p=>p.id===c.tid)).length; }
 if(u.role==='hr'){ if(k==='cases') return S.cases.filter(c=>c.status===3||c.status===4).length; if(k==='m12') return Object.values(S.decisions).filter(x=>x.hod&&!x.hr).length; }
 if(u.role==='coordinator' && k==='kzverify') return S.kaizens.filter(x=>x.status==='Implemented' && new Date(d(x.implAt).getTime()+S.cfg.kzVerifyDays*DAY)<=TODAY).length;
 if(u.role==='agent' && k==='console') return queue().length;
 return 0;
}
function renderTop(){
 const cur = UI.route ? UI.route.v : '';
 const navCur = ({person:PORTAL==='hr'?'master':'team', review:'reviews', case:'cases', rules:'settings', access:'settings', log:PORTAL==='hr'?'settings':'log'})[cur] || cur;
 const u = USER();
 $('#top').innerHTML = `<div class="hdr-in"><a class="logo" href="index.html" title="Home: all PRAGATI portals"><img src="assets/bajaj-logo.png" alt="Bajaj · The World’s Favourite Indian — home"></a>
  <div class="appid"><b>PRAGATI</b><span>${PORTAL==='home'?'Apprentice record':esc(P.name)}</span></div>
  <nav class="tabs" aria-label="${esc(P.name)}">${ME?P.nav.map(([k,l])=>{ const n = navCount(k); return `<a href="#/${k}" ${navCur===k?'aria-current="page"':''}>${l}${n?`<span class="cnt">${n}</span>`:''}</a>`; }).join(''):''}</nav>
  <div class="hdr-r">${u?'':'<span class="proto">Prototype · sample data</span>'}${u?`<div class="user" title="${esc(u.title)}">${av(u.name)}<div class="nm"><b>${esc(u.name)}</b></div></div><button class="linkbtn" data-act="logout" type="button">Sign out</button>`:''}</div></div>`;
}
function renderDrawer(){ $('#drawer-root').innerHTML = UI.drawer && UI.drawer.type==='kz' ? kzDrawer(UI.drawer.id) : ''; }
let _lastRouteKey = '';
function render(){
 resetMemo(); UI.pendingRender = false;
 if(PORTAL==='home'){ ME = null; UI.route = {v:''}; renderTop(); $('#app').innerHTML = vLanding() + footer(); renderDrawer(); document.title = 'PRAGATI · Apprentice record'; return; }
 if(!ME){ UI.route = null; renderTop(); $('#app').innerHTML = vLogin(); renderDrawer(); document.title = 'Sign in · PRAGATI '+P.name; return; }
 let r = parseHash();
 if(!r.v){ r = {v:P.nav[0][0]}; history.replaceState(null,'','#/'+r.v); }
 if(!allowed(r.v)){ const other = PAGE_PORTAL[r.v]; $('#app').innerHTML = `<div class="page">${ph('Not in this portal', other?'That page lives in the '+esc(PORTALS[other].name)+' portal.':'This page is not available here.', other?`<a class="btn pri" href="${PORTALS[other].file}#/${r.v}" target="_blank" rel="noopener">Open ${esc(PORTALS[other].name)}</a>`:'')}</div>`; UI.route = r; renderTop(); return; }
 UI.route = r;
 renderTop();
 const key = r.v+'/'+(r.id||'')+'/'+(r.tab||'');
 $('#app').innerHTML = `<main class="page" id="main">${VIEWS[r.v](r.id, r.tab)}</main>${footer()}`;
 renderDrawer();
 if(key!==_lastRouteKey){ window.scrollTo(0,0); _lastRouteKey = key; }
 document.title = (document.querySelector('#main h1')||{}).textContent + ' · PRAGATI '+P.name;
 if(UI.refocus){ const el = document.getElementById(UI.refocus); if(el){ el.focus(); const n = el.value.length; try{ el.setSelectionRange(n,n); }catch(e){} } UI.refocus = null; }
}
function footer(){ return `<footer class="footer"><span>PRAGATI · Performance & Records of Apprentices: Growth, Attendance, Training, Integrity</span><span>Prototype for discussion · sample data only · ${esc(RULES_VER)}</span></footer>`; }
function scheduleRender(){
 const ae = document.activeElement;
 if(ae && ae.closest && ae.closest('#app, #drawer-root') && (ae.tagName==='TEXTAREA' || (ae.tagName==='INPUT' && !['checkbox','radio','file','button'].includes(ae.type)))){ UI.pendingRender = true; return; }
 render();
}
document.addEventListener('focusout', ()=>{ if(UI.pendingRender) setTimeout(()=>{ const ae = document.activeElement; if(!ae || !['TEXTAREA','INPUT'].includes(ae.tagName)) render(); }, 50); });
function toast(msg){ const n = document.createElement('div'); n.className = 'toast'; n.setAttribute('role','status'); n.textContent = msg; $('#toast-root').appendChild(n); setTimeout(()=>n.remove(), 3800); }
function go(path){ location.hash = '#/'+path; }

/* ----- shared store (this browser; all portals) ----- */
const TAB = Math.random().toString(36).slice(2,10), LKEY = 'pragati-demo-v2';
let rev = 0, _ptimer = null;
function persist(){
 rev++;
 try{ localStorage.setItem(LKEY, JSON.stringify({v:1, rev, writer:TAB, by:P.name, at:Date.now(), state:S})); }catch(e){ toast('Could not save in this browser; changes stay in this tab.'); }
}
function persistSoon(){ clearTimeout(_ptimer); _ptimer = setTimeout(persist, 700); }
function loadStore(){
 try{ const raw = localStorage.getItem(LKEY); if(raw){ const dd = JSON.parse(raw); if(dd && dd.state && dd.v===1){ S = dd.state; rev = dd.rev||0; return true; } } }catch(e){}
 return false;
}
window.addEventListener('storage', e=>{
 if(e.key!==LKEY || !e.newValue) return;
 try{ const dd = JSON.parse(e.newValue); S = dd.state; rev = Math.max(rev, dd.rev||0); const l = S.log[0]; if(ME && l && dd.writer!==TAB) toast((dd.by||'Another portal')+': '+l.what.slice(0,110)); scheduleRender(); }catch(_){}
});

/* ----- actions ----- */
const val = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
const NOSAVE = new Set(['fill','logout','rtab','qb','kzopen','close','kzs','kzcat','colsbtn','pick','kzcsv','mastercsv','vsel']);
const formOf = id => S.forms.find(x=>x.id===id);
const A = {
 fill(el){ $('#lg-u').value = el.dataset.id; $('#lg-p').value = DEMO_PW; $('#lg-p').focus(); },
 logout(){ try{ sessionStorage.removeItem('pragati-sess-'+PORTAL); }catch(e){} ME = null; history.replaceState(null,'',location.pathname); render(); },
 reset(){ S = seed(); seedLog(); initAssess(); UI.drawer = null; UI.tablet = null; UI.kzd = null; persist(); toast('Demo data reset in all portals'); render(); },
 lk(el){ const f = formOf(el.dataset.f); if(!f || isDone(f)) return; f.ans[el.dataset.k] = Number(el.dataset.v); if(f.status==='Not started') f.status = 'In progress'; render(); },
 mrec(el){ const f = formOf(el.dataset.f); f.mrec = el.dataset.id; if(f.status==='Not started') f.status='In progress'; render(); },
 submitform(el){
  const f = formOf(el.dataset.id), p = S.people[f.tid];
  const miss = ALL_ST.filter(k=>!f.ans[k]).length, errs = [];
  if(miss) errs.push(miss+' statement'+(miss>1?'s':'')+' not rated');
  if(!f.strengths.trim() || !f.improve.trim()) errs.push('fill both comment boxes');
  if(f.cp==='M12' && !f.mrec) errs.push('give your Month 12 recommendation');
  if(!f.discussed) errs.push('confirm you discussed it with the apprentice');
  if(errs.length){ UI.showMiss = true; BORDER.forEach(b=>{ if(PARAMS.filter(x=>x.b===b).some(x=>x.st.some(s=>!f.ans[s]))) UI.open[f.id+':'+b] = true; }); render(); $('#ff-err').textContent = 'Before submitting: '+errs.join('; ')+'.'; return false; }
  UI.showMiss = false;
  f.status = 'With HoD'; f.submitted = stamp(); delete f.returned;
  if(f.cp==='M12'){ S.decisions[p.id] = Object.assign(S.decisions[p.id]||{}, {mgr:{choice:f.mrec,by:USER().name,at:stamp()}}); }
  log('wf','Line manager','PRAGATI Review',`${f.id} ${f.cp} for ${p.name} submitted to HoD ${HODS[hodOf(p)].name}.`);
  runAgent(p.id, 'Review submitted');
  toast(p.name+' sent to '+HODS[hodOf(p)].name+'. Agent summary ready.'); go('reviews');
 },
 signform(el){ const f = formOf(el.dataset.id), p = S.people[f.tid]; f.status = 'Completed'; f.signed = stamp(); log('wf','HoD','PRAGATI Review',`${f.id} ${f.cp} for ${p.name} signed by ${USER().name}.`); toast('Review signed'); go('reviews'); },
 returnform(el){ const f = formOf(el.dataset.id), p = S.people[f.tid], n = val('rt-n') || val('dh-r'); if(n.length<5){ $('#dh-e').textContent = 'Add a note for the line manager.'; return false; } f.status = 'In progress'; f.returned = {by:USER().name, note:n, at:stamp()}; f.submitted = ''; log('wf','HoD','Line manager',`${f.id} ${f.cp} for ${p.name} returned: ${n}`); toast('Returned to '+f.by); go('reviews'); },
 hoddecide(el){
  const f = formOf(el.dataset.id), p = S.people[f.tid], e = evaluate(p,f), c = val('dh-c'), r = val('dh-r');
  const am = e.rec==='Recommend conversion'?'Convert':(e.rec==='Not recommended'||e.rec==='Training ended')?'Do not convert':null;
  if((!am || c!==am) && r.length<5){ $('#dh-e').textContent = am ? 'Your decision differs from the agent ('+am+'). Add a reason.' : 'The agent referred this to you. Add a reason for your decision.'; return false; }
  S.decisions[p.id] = Object.assign(S.decisions[p.id]||{}, {hod:{choice:c,reason:r,by:USER().name,at:stamp()}});
  f.status = 'Completed'; f.signed = stamp();
  log('wf','HoD','PRAGATI Decision',`${p.name}: HoD decided ${c} (agent: ${e.rec})${r?' — '+r:''}.`); toast('Decision recorded; Plant HR will finalise'); render();
 },
 hrfinal(el){
  const p = S.people[el.dataset.id], dc = S.decisions[p.id]; dc.hr = {choice:dc.hod.choice,by:USER().name,at:stamp()};
  const ev = dc.hod.choice==='Convert'?'Job change: Apprentice → Permanent operator (effective 01 Nov 2026)':dc.hod.choice==='Extend 3 months'?'Contract end date extended by 3 months':'End of apprenticeship: separation recorded';
  dc.ec = {at:stamp(), event:ev};
  log('wf','Plant HR','PRAGATI Decision',`${p.name}: final decision ${dc.hod.choice}.`); log('out','PRAGATI','SAP SF/EC Job info',`${p.name}: ${ev}.`);
  S.sources.sfout = {last:stamp(), rec:(S.sources.sfout.rec||0)+1, status:'ok', note:'Sent: '+p.name};
  toast('Sent to SAP SF/EC: '+ev); render();
 },
 rtab(el){ UI.rtab = el.dataset.id; render(); },
 qb(el){ UI.qb = el.dataset.id; render(); },
 kzopen(el){ UI.drawer = {type:'kz', id:el.dataset.id}; UI.kze = {}; renderDrawer(); const x = document.querySelector('.drawer .x'); if(x) x.focus(); },
 close(el, e){ if(el.dataset.self && e.target!==el) return; UI.drawer = null; renderDrawer(); },
 kzs(el){ UI.kze = UI.kze||{}; UI.kze[el.dataset.k] = Number(el.dataset.v); renderDrawer(); },
 kzdecide(el){
  const k = S.kaizens.find(x=>x.seq===Number(el.dataset.id)), dec = el.dataset.v, E = UI.kze||{}, r = val('kz-r');
  if(dec==='Approved' && !(E.impact&&E.orig)){ $('#kz-e').textContent = 'Score impact and originality first.'; return false; }
  if(dec!=='Approved' && r.length<5){ $('#kz-e').textContent = 'Add a remark for the apprentice.'; return false; }
  k.eval = {impact:E.impact||1, orig:E.orig||1, pts:(E.impact||1)*(E.orig||1), by:USER().name, at:stamp(), remarks:r};
  k.status = dec; k.hist.push({at:stamp(), by:USER().name, what: dec==='Approved'?'Approved · '+kzGrade(k.eval.pts):dec==='Rework'?'Sent back for rework':'Rejected'});
  log('wf','Line manager','PRAGATI Kaizen',`${k.id} ${dec.toLowerCase()} (${S.people[k.tid].name}).`);
  UI.kze = {}; toast('Kaizen '+dec.toLowerCase()); render();
 },
 kzimpl(el){ const k = S.kaizens.find(x=>x.seq===Number(el.dataset.id)); k.status = 'Implemented'; k.implAt = dateKey(TODAY); k.photos.after = true; k.hist.push({at:stamp(), by:USER().name, what:'Marked implemented'}); log('wf','Line manager','PRAGATI Kaizen',`${k.id} implemented; sustain check due ${fmt(new Date(TODAY.getTime()+S.cfg.kzVerifyDays*DAY))}.`); afterDataChange('Kaizen implemented',[k.tid]); toast('Marked implemented'); render(); },
 kzverify(el){ const k = S.kaizens.find(x=>x.seq===Number(el.dataset.id)), ok = el.dataset.v==='1'; k.status = ok?'Verified':'Not sustained'; k.verify = {by:USER().name, at:stamp(), sustained:ok, saving: ok?Number(val('kv-s'))||0:0, remarks:val('kv-r')}; k.horiz.yes = $('#kv-h').checked; k.hist.push({at:stamp(), by:USER().name, what: ok?'Verified · sustained':'Not sustained'}); log('wf','Coordinator','PRAGATI Kaizen',`${k.id} ${ok?'verified as sustained':'not sustained'}.`); afterDataChange('Kaizen verified',[k.tid]); UI.drawer = null; toast(ok?'Verified':'Marked not sustained'); render(); },
 kzcat(el){ UI.kzd.cat = el.dataset.id; keepKzd(); render(); },
 kzsubmit(){
  const D = UI.kzd; keepKzd(); const err = [];
  if(!D.tid) err.push('pick the apprentice'); if(!D.cat) err.push('choose a PQCDSM category'); if(val('kd-ti').length<5) err.push('give a title'); if(val('kd-b').length<10) err.push('describe the problem'); if(val('kd-a').length<10) err.push('describe the idea');
  if(err.length){ $('#kd-err').textContent = 'Please '+err.join(', ')+'.'; return false; }
  const p = S.people[D.tid], seq = S.seq.kz++, sv = Number(val('kd-s'))||0;
  const k = {id:kzId(D.cat, TODAY, seq), seq, tid:p.id, team:D.team?[D.team]:[], date:dateKey(TODAY), dept:deptOf(p), line:p.line, station:val('kd-st')||'—', cat:D.cat, type:D.type, title:val('kd-ti'), before:val('kd-b'), after:val('kd-a'), root:val('kd-r')||'—',
   benefit: sv>0?'Tangible':'Intangible', metric:{name:val('kd-mn')||'—', unit:val('kd-u'), before:val('kd-mb')||'—', after:val('kd-ma')||'—'}, saving:sv, cost:Number(val('kd-c'))||0, horiz:{yes:$('#kd-h').checked, where:''}, std:$('#kd-sd').checked?'SOP update needed':'None',
   photos:{before:!!($('#kd-pb').files||[]).length, after:!!($('#kd-pa').files||[]).length}, status:'Submitted', hist:[{at:stamp(), by:USER().name+' (line tablet)', what:'Submitted'}], channel:'Line tablet'};
  S.kaizens.push(k); UI.kzd = null;
  log('in','Line tablet','PRAGATI Kaizen',`${k.id} “${k.title}” by ${p.name}; waiting for ${MANAGERS[p.mgr].name} to evaluate.`);
  toast(k.id+' submitted'); render();
 },
 kzcsv(){ const {out} = kzFilters(S.kaizens.slice().reverse()); download('kaizen_register.csv', [['Kaizen no.','Date','Apprentice','Ticket','Department','Line','Category','Type','Title','Problem','Root cause','Countermeasure','Measure','Before','After','Unit','Saving est.','Saving verified','Cost','Standardised','Horizontal','Status','Points']].concat(out.map(k=>{ const p = S.people[k.tid]; return [k.id,k.date,p.name,p.ticket,k.dept,k.line,k.cat,k.type,k.title,k.before,k.root,k.after,k.metric.name,k.metric.before,k.metric.after,k.metric.unit,k.saving,k.verify?k.verify.saving:'',k.cost,k.std,k.horiz.yes?'Yes':'No',k.status,k.eval?k.eval.pts:'']; }))); },
 mastercsv(){ const V = S.views.find(v=>v.id===UI.vid)||S.views[0]; const strip = h => String(h).replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&#39;/g,"'"); download('apprentice_master.csv', [V.cols.map(c=>COLS[c][0])].concat(Object.values(S.people).map(p=>V.cols.map(c=>strip(COLS[c][1](p)))))); },
 tbsubmit(){
  const D = UI.tablet, err = []; D.desc = val('tb-x'); D.place = val('tb-p'); D.time = val('tb-h');
  if(!D.tid) err.push('pick the apprentice'); if(!D.k) err.push('choose what happened'); if(D.desc.length<10) err.push('describe what happened');
  if(err.length){ $('#tb-err').textContent = 'Please '+err.join(', ')+'.'; return false; }
  const files = [...(document.getElementById('tb-e').files||[])].map(x=>x.name);
  const c = {id:'C-'+(S.seq.case++), tid:D.tid, k:D.k, date:dateKey(TODAY), time:D.time||'—', place:D.place||'—', desc:D.desc, evidence:files, reporter:USER().name+' (line tablet)', status:1, channel:'Line tablet', steps:{reported:{by:USER().name,at:stamp()}}};
  S.cases.push(c); const p = S.people[D.tid];
  log('in','Line tablet','PRAGATI Conduct',`${c.id} for ${p.name}: ${MISK[D.k].name}. Waiting for ${MANAGERS[p.mgr].name} to validate.`);
  UI.tablet = null; toast(c.id+' sent to '+MANAGERS[p.mgr].name); render();
 },
 cvalid(el){ const c = S.cases.find(x=>x.id===el.dataset.id), r = val('cv-r'); if(r.length<5){ $('#cv-e').textContent = 'Add validation remarks.'; return false; } c.steps.validated = {by:USER().name,at:stamp(),remarks:r}; c.status = 2; log('wf','Line manager','PRAGATI Conduct',`${c.id} validated by ${USER().name}; HoD to decide the action.`); render(); },
 cnot(el){ const c = S.cases.find(x=>x.id===el.dataset.id), r = val('cv-r'); if(r.length<5){ $('#cv-e').textContent = 'Add remarks explaining why.'; return false; } const by = USER().name; c.steps.validated = {by,at:stamp(),remarks:r}; c.steps.action = {by,at:stamp(),label:'Not substantiated',level:'none',reason:r}; c.steps.letter = {by:'—',at:stamp()}; c.steps.closed = {by,at:stamp()}; c.status = 5; c.closedAt = TODAY.toISOString(); log('wf','Line manager','PRAGATI Conduct',`${c.id} closed as not substantiated.`); render(); },
 caction(el){ const c = S.cases.find(x=>x.id===el.dataset.id), sg = suggest(c.tid,c.k), label = val('ca-a'), level = ACTIONS.find(a=>a[0]===label)[1], reason = val('ca-r'); if(level!==sg.level && reason.length<5){ $('#ca-e').textContent = 'Differs from the ladder ('+sg.label+'). Add a reason.'; return false; } c.steps.action = {by:USER().name,at:stamp(),label,level,reason}; c.status = 3; log('wf','HoD','PRAGATI Conduct',`${c.id}: action ${label}.`); render(); },
 cletter(el){ const c = S.cases.find(x=>x.id===el.dataset.id); c.steps.letter = {by:USER().name,at:stamp()}; c.status = 4; log('wf','Plant HR','PRAGATI Conduct',`${c.id}: ${c.steps.action.level==='none'?'no letter needed':'letter issued'}.`); render(); },
 cclose(el){ const c = S.cases.find(x=>x.id===el.dataset.id), p = S.people[c.tid]; c.steps.closed = {by:USER().name,at:stamp()}; c.status = 5; c.closedAt = TODAY.toISOString(); if(c.steps.action.level==='end'){ p.status = 'Training ended'; log('out','PRAGATI','SAP SF/EC Job info',`${p.name}: training ended (${c.id}).`); } log('wf','Plant HR','PRAGATI Conduct',`${c.id} closed; counts in scoring.`); afterDataChange('Conduct case closed',[c.tid]); toast(c.id+' closed. The agent will re-score '+p.name+'.'); render(); },
 vsel(el){ UI.vid = el.dataset.id; UI.mf = {}; render(); },
 colsbtn(){ UI.cols = !UI.cols; render(); },
 vsave(){ const n = val('v-name'); if(n.length<2){ toast('Give the view a name'); return false; } const V = S.views.find(v=>v.id===UI.vid)||S.views[0]; const nv = {id:'v'+Date.now().toString(36), name:n, cols:V.cols.slice(), f:Object.assign({}, V.f, UI.mf||{}), group:V.group, sort:V.sort, sys:false}; S.views.push(nv); UI.vid = nv.id; UI.mf = {}; toast('View “'+n+'” saved'); render(); },
 vdel(){ S.views = S.views.filter(v=>v.id!==UI.vid); UI.vid = S.views[0].id; toast('View deleted'); render(); },
 cfgreset(){ S.cfg.w = clone(DEFAULT_CFG.w); S.cfg.blend = DEFAULT_CFG.blend; afterDataChange('Rule set changed'); log('sys','Plant HR','Rule set','Bucket weights reset to equal.'); toast('Equal bucket weights restored'); render(); },
 sfsync(){
  let note = 'Delta: 0 new, 0 changed';
  if(!S.sfDelta.done && S.people.t08){ S.people.t08.line = 'Frame Weld 1'; S.sfDelta.done = true; note = 'Delta: 0 new, 1 changed (Akash Pawar: line Frame Weld 2 → Frame Weld 1)'; }
  S.sources.sf = {last:stamp(), rec:Object.keys(S.people).length, status:'ok', note};
  log('in','SAP SF/EC','PRAGATI Master','Employee master pull: '+note+'.'); toast(note); render();
 },
 timesync(){
  let n = 0, mx = 0; Object.keys(S.people).forEach(t=>{ const pd = pendingDays(t); if(pd>0){ S.sfLen[t] = rawOf(t).length; n++; mx = Math.max(mx,pd); } });
  if(!n){ toast('Nothing pending'); return false; }
  S.sources.time = {last:stamp(), rec:n, status:'ok', note:'File for '+fmtS(TODAY)+' accepted'};
  log('in','Time system','PRAGATI Attendance',`Daily file: ${n} apprentices × ${mx} day(s) accepted, 0 rejected.`);
  const al = absAlerts(); al.forEach(({p,a})=>{ if(!S.alerts[p.id]){ S.alerts[p.id] = true; log('sys','PRAGATI','Line manager / HR',`Absence alert: ${p.name} absent ${a.cont} working days. Day 4 action due (call + warning letter).`); } });
  afterDataChange('Attendance updated'); toast(`Attendance loaded${al.length?'. '+al.length+' absence alert(s) raised':''}`); render();
 },
 regup(){
  const known = Object.fromEntries(Object.values(S.people).map(p=>[p.ticket,p.id])); let ok = 0, rej = 0;
  S.reg.rows.forEach(r=>{ const tid = known[r.ticket]; if(!tid){ rej++; return; } S.dev[tid] = {st:r.st, jh:r.jh, ie:r.ie, month:S.reg.month, by:'Coordinator upload'}; ok++; });
  S.reg.uploaded = true; S.sources.coord = {last:stamp(), rec:ok, status:'ok', note:S.reg.month+': '+ok+' accepted, '+rej+' rejected'};
  log('in','Coordinators','PRAGATI Skills & TPM',`${S.reg.month} registers: ${ok} rows accepted, ${rej} rejected (ticket not found).`);
  afterDataChange('Skills & TPM updated'); toast(`${ok} rows uploaded, ${rej} rejected`); render();
 },
 tlimport(){
  if(S.tl.imported){ toast('Already imported'); return false; }
  S.tl.rows.forEach((r,i)=>{ const id = 'p'+(S.seq.p++); S.people[id] = {id,name:r.name,type:'WILP',mgr:r.mgr,doj:r.doj,line:r.line,prof:'good',mu:3.9,kzRate:1,ticket:'T'+(49001+i),tl:r.tl,status:'Active',empClass:'Contingent worker (TeamLease)',course:r.course,gen:{ab:.02,la:.02,streak:0,s:300+i}}; S.sfLen[id] = rawOf(id).length - 1; S.dev[id] = {st:null,jh:null,ie:null,month:'—',by:'—'}; });
  S.tl.imported = true; S.sources.tl = {last:stamp(), rec:S.tl.rows.length, status:'ok', note:S.tl.rows.length+' joiners imported'};
  log('in','TeamLease','PRAGATI Master',`${S.tl.rows.length} WILP joiners added with TeamLease codes; Month 12 reviews scheduled.`); toast(S.tl.rows.length+' joiners added'); render();
 },
 pick(el){ UI.pipe = {tid:el.dataset.id, step:0}; render(); },
 prun(el){
  clearInterval(UI.pipe.timer); const tid = el.dataset.id; UI.pipe = {tid, step:0, timer:null};
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){ runAgent(tid,'Manual run'); UI.pipe.step = 8; persist(); render(); return false; }
  UI.pipe.timer = setInterval(()=>{ UI.pipe.step++; if(UI.pipe.step>=8){ clearInterval(UI.pipe.timer); UI.pipe.timer = null; runAgent(tid,'Manual run'); persist(); toast('Assessment written'); } render(); }, 420);
  render(); return false;
 },
 runall(){ const q = queue(); q.forEach(x=>runAgent(x.p.id, x.reason)); toast(q.length+' assessment(s) written'); render(); },
 nightly(){
  const launched = autoLaunch(S); if(launched.length) log('sys','Scheduler','PRAGATI Reviews',`Reviews opened: ${launched.join(', ')}.`);
  const al = absAlerts(); al.forEach(({p,a})=>{ if(!S.alerts[p.id]){ S.alerts[p.id] = true; log('sys','PRAGATI','Line manager / HR',`Absence alert: ${p.name} absent ${a.cont} working days.`); } });
  const od = S.forms.filter(f=>!isDone(f) && new Date(f.cpDate)<TODAY);
  if(od.length) log('sys','Scheduler','Line managers',`Reminder: ${od.length} overdue review(s).`);
  afterDataChange('Nightly re-check'); const q = queue(); q.forEach(x=>runAgent(x.p.id, x.reason));
  const kd = S.kaizens.filter(x=>x.status==='Implemented' && new Date(d(x.implAt).getTime()+S.cfg.kzVerifyDays*DAY)<=TODAY).length;
  log('sys','Scheduler','PRAGATI',`Nightly checks: ${launched.length} review(s) opened, ${al.length} absence alert(s), ${q.length} re-scored, ${kd} kaizen sustain check(s) due.`);
  toast('Nightly checks done'); render();
 }
};
function keepKzd(){ const D = UI.kzd; if(!D) return; ['kd-ti','kd-b','kd-a','kd-r','kd-st','kd-mn','kd-mb','kd-ma','kd-u','kd-s','kd-c'].forEach(id=>{ const el = document.getElementById(id); if(el) D[id] = el.value; }); }
function restoreKzd(){ const D = UI.kzd; if(!D) return; Object.keys(D).filter(k=>k.startsWith('kd-')).forEach(id=>{ const el = document.getElementById(id); if(el) el.value = D[id]; }); }
function download(name, rows){
 const csv = rows.map(r=>r.map(v=>{ const s = String(v??''); return /[",\n]/.test(s) ? '"'+s.replace(/"/g,'""')+'"' : s; }).join(',')).join('\n');
 const url = URL.createObjectURL(new Blob(['﻿'+csv], {type:'text/csv'})); const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url), 2000);
}

/* ----- events ----- */
document.addEventListener('click', e=>{
 const el = e.target.closest('[data-act],[data-go]'); if(!el || el.disabled) return;
 if(el.dataset.self && e.target!==el) return;
 if(el.dataset.go && !el.dataset.act){ e.preventDefault(); go(el.dataset.go); return; }
 const f = A[el.dataset.act]; if(f){ e.preventDefault(); const r = f(el, e); if(r!==false && !NOSAVE.has(el.dataset.act)) persist(); if(el.dataset.act==='kzcat') restoreKzd(); }
});
document.addEventListener('keydown', e=>{
 if((e.key==='Enter'||e.key===' ') && e.target.matches('[role=button][data-go],[role=button][data-act]')){ e.preventDefault(); e.target.click(); }
 if(e.key==='Escape' && UI.drawer){ UI.drawer = null; renderDrawer(); }
});
document.addEventListener('toggle', e=>{ const t = e.target; if(t && t.dataset && t.dataset.acc) UI.open[t.dataset.acc] = t.open; }, true);
document.addEventListener('change', e=>{
 const el = e.target, ds = el.dataset;
 if(el.id==='ag-p'){ UI.pipe = {tid:el.value, step:0}; render(); return; }
 if(ds.tb){ UI.tablet[ds.tb] = el.value; if(ds.tb==='tid'||ds.tb==='k'){ UI.tablet.desc = val('tb-x'); UI.tablet.time = val('tb-h'); if(ds.tb==='tid') UI.tablet.place = ''; render(); } return; }
 if(ds.kzd){ keepKzd(); UI.kzd[ds.kzd] = el.value; if(ds.kzd==='tid') UI.kzd.team = ''; render(); restoreKzd(); return; }
 if(ds.cfg){ const [a,b] = ds.cfg.split('.'); const n = Number(el.value); if(isNaN(n)) return; if(b) S.cfg[a][b] = n; else S.cfg[a] = n; afterDataChange('Rule set changed'); log('sys','Plant HR','Rule set',`${ds.cfg} set to ${n}.`); persist(); render(); return; }
 if(ds.vis){ const [r,k] = ds.vis.split('.'); S.cfg.vis[r][k] = el.checked; log('sys','Plant HR','Role views',`${r}: ${k} ${el.checked?'shown':'hidden'}.`); persist(); render(); toast('View setting saved for all portals'); return; }
 if(ds.ffc){ const f = formOf(ds.ffc); f[ds.k] = el.checked; if(f.status==='Not started') f.status = 'In progress'; persist(); return; }
 if(ds.tr){ const f = formOf(ds.tr); f.train = el.checked ? [...new Set([...f.train, el.value])] : f.train.filter(t=>t!==el.value); persist(); return; }
 if(ds.mf){ UI.mf = Object.assign(UI.mf||{}, {[ds.mf]:el.value}); render(); return; }
 if(ds.vset){ const V = S.views.find(v=>v.id===UI.vid)||S.views[0]; V[ds.vset] = el.value; persist(); render(); return; }
 if(ds.col){ const V = S.views.find(v=>v.id===UI.vid)||S.views[0]; V.cols = el.checked ? Object.keys(COLS).filter(k=>V.cols.includes(k)||k===ds.col) : V.cols.filter(c=>c!==ds.col); if(!V.cols.length) V.cols = ['name']; persist(); render(); return; }
 if(ds.kzf && el.tagName==='SELECT'){ UI.kzf[ds.kzf] = el.value; render(); return; }
 if(ds.reg){ const [i,k] = ds.reg.split('.'); const v = el.value.trim(); S.reg.rows[i][k] = v==='' ? null : Number(v); persistSoon(); return; }
});
document.addEventListener('input', e=>{
 const el = e.target, ds = el.dataset;
 if(ds.ff){ const f = formOf(ds.ff); f[ds.k] = el.value; if(f.status==='Not started') f.status = 'In progress'; persistSoon(); return; }
 if(el.id==='q'){ UI.q = el.value; UI.refocus = 'q'; render(); return; }
 if(ds.kzf==='q'){ UI.kzf.q = el.value; UI.refocus = el.id; render(); return; }
});
document.addEventListener('submit', e=>{
 if(e.target.id!=='loginf') return; e.preventDefault();
 const u = $('#lg-u').value.trim().toLowerCase(), pw = $('#lg-p').value, x = USERS[u];
 if(!x || pw!==DEMO_PW){ $('#lg-e').textContent = 'User ID or password is wrong.'; return; }
 if(!P.roles.includes(x.role)){ $('#lg-e').textContent = 'This account has no access to the '+P.name+' portal. Use the portal for your role.'; return; }
 ME = u; try{ sessionStorage.setItem('pragati-sess-'+PORTAL, u); }catch(_){}
 render();
});
window.addEventListener('hashchange', ()=>{ UI.drawer = null; UI.showMiss = false; render(); });

/* ----- boot ----- */
if(!loadStore()){ S = seed(); seedLog(); initAssess(); persist(); }
try{ const u = sessionStorage.getItem('pragati-sess-'+PORTAL); if(u && USERS[u] && P.roles.includes(USERS[u].role)) ME = u; }catch(e){}
render();
