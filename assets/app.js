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
 vdeshpande:{name:'V. Deshpande',role:'plant',title:'Head of Manufacturing'},
 nsharma:{name:'N. Sharma',role:'hr',title:'HR \u00b7 Apprentice programme'},
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
  points:['Month 6 learning review (feedback, not scored) and the Month 12 review: 16 plain statements on a 1–5 scale','Attendance, kaizens, skills and conduct pulled in for you','Quick rate the whole team one bucket at a time'],
  nav:[['home','Home'],['team','My apprentices'],['reviews','Reviews'],['quick','Quick rate'],['kaizen','Kaizen'],['cases','Conduct']]},
 hod:{file:'hod.html',name:'Head of Department',icon:'users',who:'Skip-level managers (reviewing officers)',roles:['hod'],
  pitch:'See each apprentice on one page: the line manager’s appraisal with every record behind it.',
  points:['Summary per apprentice with the year\u2019s records and agent flags','Sign or return reviews; decide conduct actions','Sign Month 12 outcomes with the full record'],
  nav:[['home','Home'],['reviews','Reviews to sign'],['team','Apprentices'],['cases','Conduct'],['m12','Outcomes']]},
 plant:{file:'plant.html',name:'Leadership',icon:'plant',who:'Plant heads and business leadership',roles:['plant'],
  pitch:'The whole apprentice programme at a glance.',
  points:['Review cycle, band mix and risk by department','Month 12 outcomes by department','Kaizen activity and verified savings'],
  nav:[['dash','Overview'],['team','Apprentices'],['kzdash','Kaizen'],['cases','Conduct'],['m12','Outcomes']]},
 hr:{file:'hr.html',name:'HR',icon:'shield',who:'HR and Personnel',roles:['hr'],
  pitch:'Own the apprentice record: views, rules, conduct, conversions and data feeds.',
  points:['Configurable apprentice master and role views','Scoring rules with equal, editable weights','Record Month 12 outcomes in SAP SF/EC'],
  nav:[['home','Home'],['dash','Overview'],['master','Apprentice master'],['cases','Conduct'],['m12','Outcomes'],['kzreg','Kaizens'],['sources','Data sources'],['settings','Settings']]},
 tablet:{file:'supervisor.html',name:'Line Tablet',icon:'tablet',who:'Supervisors, security and apprentices at the line',roles:['tablet'],
  pitch:'Capture at the source: incidents and kaizen ideas, straight from the line.',points:['Report an incident in under a minute','Submit a kaizen sheet with photos','Track where each submission is'],
  nav:[['kzsubmit','Submit kaizen'],['report','Report incident'],['sent','My submissions']]},
 coordinator:{file:'coordinator.html',name:'Coordinator',icon:'bulb',who:'Kaizen, TPM, IE and training coordinators',roles:['coordinator'],
  pitch:'Verify kaizens are sustained and upload the monthly registers.',points:['Sustain checks 30 days after implementation','Skill matrix, JH and IE in one upload','The full digital kaizen register'],
  nav:[['kzverify','Kaizen verification'],['kzreg','Kaizen register'],['upload','Monthly upload']]},
 timesystem:{file:'timesystem.html',name:'Time System',icon:'clock',who:'Time office',roles:['timesystem'],pitch:'Daily attendance from gate punches into PRAGATI.',points:[],nav:[['punches','Gate punches']]},
 teamlease:{file:'teamlease.html',name:'TeamLease',icon:'tl',who:'TeamLease partner desk',roles:['teamlease'],pitch:'Weekly WILP joiner and exit file into PRAGATI.',points:[],nav:[['joiners','Joiner file']]},
 agent:{file:'agent.html',name:'Scoring Agent',icon:'agent',who:'HRIS and AI administrators',roles:['agent'],pitch:'Watch the agent score a review step by step.',points:['Rules for records, AI only for comments','Every run logged and reproducible'],
  nav:[['console','Agent console'],['rules','Rule set'],['how','How it works'],['sources','Data sources'],['log','Integration log']]},
 monitor:{file:'monitor.html',name:'Data Flow',icon:'flow',who:'System administrators',roles:['monitor','hr','agent'],pitch:'See data move between sources, PRAGATI, the agent and SAP SF/EC.',points:[],nav:[['flow','Data flow'],['log','Integration log']]}
};
const P = PORTALS[PORTAL];
const VIEWS = {
 home:()=>({manager:vMgrHome,hod:vHodHome,hr:vHrHome})[PORTAL](), team:vTeam, reviews:vReviews, quick:vQuick, kaizen:vKzEval, cases:vCases, m12:vM12,
 dash:vPlantDash, kzdash:vKzDash, master:vMaster, kzreg:vKzReg, rules:vRules, access:vAccess, sources:vSources, log:vLog,
 report:vReport, kzsubmit:vKzSubmit, sent:vSent, kzverify:vKzVerify, upload:vUpload, punches:vPunches, joiners:vJoiners,
 console:vConsole, how:vHow, flow:vFlow, settings:vSettings, person:vPerson, review:vReview, case:vCase, mid:vMid
};
const DETAIL = ['person','review','case','mid'];
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
 if(u.role==='manager'){ if(k==='reviews') return S.forms.filter(f=>has(f)&&!isDone(f)).length + (S.mids||[]).filter(m=>has(m)&&!midDone(m)).length; if(k==='kaizen') return S.kaizens.filter(x=>x.status==='Submitted'&&ps.some(p=>p.id===x.tid)).length; if(k==='cases') return S.cases.filter(c=>c.status===1&&ps.some(p=>p.id===c.tid)).length; }
 if(u.role==='hod'){ if(k==='reviews') return S.forms.filter(f=>has(f)&&f.status==='With HoD').length; if(k==='cases') return S.cases.filter(c=>c.status===2&&c.k!=='oth'&&ps.some(p=>p.id===c.tid)).length; }
 if(u.role==='hr'){ if(k==='cases') return S.cases.filter(c=>c.status===3||c.status===4||(c.k==='oth'&&c.status<5)).length; if(k==='m12') return Object.values(S.decisions).filter(x=>x.hod&&!x.hr).length; }
 if(u.role==='coordinator' && k==='kzverify') return S.kaizens.filter(x=>x.status==='Implemented' && new Date(d(x.implAt).getTime()+S.cfg.kzVerifyDays*DAY)<=TODAY).length;
 if(u.role==='agent' && k==='console') return queue().length;
 return 0;
}
function renderTop(){
 const cur = UI.route ? UI.route.v : '';
 const navCur = ({person:PORTAL==='hr'?'master':'team', review:'reviews', case:'cases', conduct:'cases', rules:'settings', access:'settings', log:PORTAL==='hr'?'settings':'log'})[cur] || cur;
 const u = USER();
 $('#top').innerHTML = `<div class="hdr-in"><a class="logo" href="index.html" title="Home: all PRAGATI portals"><img src="assets/bajaj-logo.png" alt="Bajaj · The World’s Favourite Indian — home"></a>
  <div class="appid"><b>PRAGATI</b><span>${PORTAL==='home'?'Apprentice record':esc(P.name)}</span></div>
  <nav class="tabs" aria-label="${esc(P.name)}">${ME?P.nav.map(([k,l])=>{ const n = navCount(k); return `<a href="#/${k}" ${navCur===k?'aria-current="page"':''}>${l}${n?`<span class="cnt">${n}</span>`:''}</a>`; }).join(''):''}</nav>
  <div class="hdr-r">${u?`<div class="user" title="${esc(u.title)}">${av(u.name)}<div class="nm"><b>${esc(u.name)}</b></div></div><button class="linkbtn" data-act="logout" type="button">Sign out</button>`:''}</div></div>`;
}
function renderDrawer(){ $('#drawer-root').innerHTML = UI.drawer && UI.drawer.type==='kz' ? kzDrawer(UI.drawer.id) : ''; }
let _lastRouteKey = '';
function render(){
 syncCodes(); resetMemo(); UI.pendingRender = false;
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
function footer(){ return `<footer class="footer"><span>PRAGATI · Performance & Records of Apprentices: Growth, Attendance, Training, Integrity</span><span>PRAGATI v1.1 \u00b7 ${esc(RULES_VER)}</span></footer>`; }
function scheduleRender(){
 const ae = document.activeElement;
 if(ae && ae.closest && ae.closest('#app, #drawer-root') && (ae.tagName==='TEXTAREA' || (ae.tagName==='INPUT' && !['checkbox','radio','file','button'].includes(ae.type)))){ UI.pendingRender = true; return; }
 render();
}
document.addEventListener('focusout', ()=>{ if(UI.pendingRender) setTimeout(()=>{ const ae = document.activeElement; if(!ae || !['TEXTAREA','INPUT'].includes(ae.tagName)) render(); }, 50); });
function toast(msg){ const n = document.createElement('div'); n.className = 'toast'; n.setAttribute('role','status'); n.textContent = msg; $('#toast-root').appendChild(n); setTimeout(()=>n.remove(), 3800); }
function go(path){ location.hash = '#/'+path; }

/* ----- shared store (this browser; all portals) ----- */
const TAB = Math.random().toString(36).slice(2,10), LKEY = 'pragati-v8';
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
const NOSAVE = new Set(['rkind','mtab','nfcat','cpreset','lgfor','lgpick','lgimmsop','codenew','codeedit','codecancel','cnewfrom','imptpl','impsample','impclear','casecsv','fill','logout','rtab','qb','kzopen','close','kzs','kzcat','colsbtn','pick','kzcsv','mastercsv','vsel']);
const formOf = id => S.forms.find(x=>x.id===id);
const A = {
 fill(el){ $('#lg-u').value = el.dataset.id; $('#lg-p').value = DEMO_PW; $('#lg-p').focus(); },
 logout(){ try{ sessionStorage.removeItem('pragati-sess-'+PORTAL); }catch(e){} ME = null; history.replaceState(null,'',location.pathname); render(); },
 reset(){ S = seed(); seedLog(); initAssess(); UI.drawer = null; UI.tablet = null; UI.kzd = null; persist(); toast('Data reset in all portals'); render(); },
 lk(el){ const f = formOf(el.dataset.f); if(!f || isDone(f)) return; f.ans[el.dataset.k] = Number(el.dataset.v); if(f.status==='Not started') f.status = 'In progress'; render(); },
 submitform(el){
  const f = formOf(el.dataset.id), p = S.people[f.tid];
  const miss = ALL_ST.filter(k=>!f.ans[k]).length, errs = [];
  if(miss) errs.push(miss+' statement'+(miss>1?'s':'')+' not rated');
  if(!f.strengths.trim() || !f.improve.trim()) errs.push('fill both comment boxes');
  if(!f.discussed) errs.push('confirm you discussed it with the apprentice');
  if(errs.length){ UI.showMiss = true; BORDER.forEach(b=>{ if(PARAMS.filter(x=>x.b===b).some(x=>x.st.some(s=>!f.ans[s]))) UI.open[f.id+':'+b] = true; }); render(); $('#ff-err').textContent = 'Before submitting: '+errs.join('; ')+'.'; return false; }
  UI.showMiss = false;
  f.status = 'With HoD'; f.submitted = stamp(); delete f.returned;
  log('wf','Line manager','PRAGATI Review',`${f.id} ${f.cp} for ${p.name} submitted to HoD ${HODS[hodOf(p)].name}.`);
  runAgent(p.id, 'Review submitted');
  toast(p.name+' sent to '+HODS[hodOf(p)].name+'. Agent summary ready.'); go('reviews');
 },
 signform(el){ const f = formOf(el.dataset.id), p = S.people[f.tid], e = evaluate(p,f), c = val('dh-c') || e.rec, r = val('dh-r');
  if(c!==e.rec && r.length<5){ $('#dh-e').textContent = 'You changed the outcome from '+e.rec+'. Add a reason.'; return false; }
  S.decisions[p.id] = Object.assign(S.decisions[p.id]||{}, {hod:{choice:c===e.rec?null:c, reason:c===e.rec?'':r, by:USER().name, at:stamp()}});
  f.status = 'Completed'; f.signed = stamp();
  log('wf','HoD','PRAGATI Review',`${f.id} ${f.cp} for ${p.name} signed by ${USER().name}: ${c}${c!==e.rec?' (agent: '+e.rec+') \u2014 '+r:''}.`); toast('Review signed: '+c); go('reviews'); },
 returnform(el){ const f = formOf(el.dataset.id), p = S.people[f.tid], n = val('rt-n') || val('dh-r'); if(n.length<5){ $('#dh-e').textContent = 'Add a note for the line manager.'; return false; } f.status = 'In progress'; f.returned = {by:USER().name, note:n, at:stamp()}; f.submitted = ''; log('wf','HoD','Line manager',`${f.id} ${f.cp} for ${p.name} returned: ${n}`); toast('Returned to '+f.by); go('reviews'); },
 hrfinal(el){
  const p = S.people[el.dataset.id], dc = S.decisions[p.id], out = hodOutcome(p); dc.hr = {by:USER().name, at:stamp()};
  log('out','PRAGATI','SAP SF/EC Performance',`${p.name}: Month 12 outcome recorded \u2014 ${out}.`);
  S.sources.sfout = {last:stamp(), rec:(S.sources.sfout.rec||0)+1, status:'ok', note:'Recorded: '+p.name};
  toast('Recorded in SAP SF/EC: '+out); render();
 },
 rtab(el){ UI.rtab = el.dataset.id; render(); },
 rkind(el){ UI.rk = el.dataset.id; if(el.dataset.goto) go(el.dataset.goto); else render(); },
 mtab(el){ UI.mtab = el.dataset.id; render(); },
 midset(el){ const m = S.mids.find(x=>x.id===el.dataset.id), k = el.dataset.k, v = el.dataset.v; m.ans[k] = v; if(m.status==='Not started') m.status = 'In progress';
  if(v==='well') m.focus = m.focus.filter(x=>x!==k); else if(v==='focus' && !m.focus.includes(k) && m.focus.length<3) m.focus.push(k);
  const y = window.scrollY; render(); window.scrollTo(0,y); },
 midsubmit(el){ const m = S.mids.find(x=>x.id===el.dataset.id), err = [];
  const miss = MID_ITEMS.filter(x=>!m.ans[x.k]).length; if(miss) err.push(miss+' item'+(miss>1?'s':'')+' not answered');
  if(MID_ITEMS.some(x=>m.ans[x.k]&&m.ans[x.k]!=='well') && !m.focus.length) err.push('pick at least one focus area');
  if((m.well||'').trim().length<5) err.push('say what is going well');
  if(!m.discussedOn) err.push('add the date you discussed it with the apprentice');
  if(err.length){ UI.showMiss = !!miss; UI.mdErr = 'Please: '+err.join('; ')+'.'; render(); return false; }
  UI.mdErr = '';
  m.status = 'Completed'; m.submitted = fmt(TODAY); UI.showMiss = false; const p = S.people[m.tid], st = midStatus(m)[0];
  log('wf',m.by,'PRAGATI Reviews',`${p.name}: Month 6 learning review completed (${st}).`);
  if(st.startsWith('Needs')) log('wf','PRAGATI','HoD '+HODS[hodOf(p)].name,`${p.name} needs a support plan after the Month 6 review.`);
  toast('Month 6 review completed: '+st); window.scrollTo(0,0); render(); },
 nfcat(el){ keepNf(); UI.nf.cat = el.dataset.id; render(); },
 noteadd(el){ keepNf(); const N = UI.nf, tid = el.dataset.id || N.tid, txt = (N.text||'').trim();
  if(!tid){ $('#nf-e').textContent = 'Pick the apprentice.'; return false; } if(txt.length<10){ $('#nf-e').textContent = 'Write a line or two about what happened.'; return false; }
  const p = S.people[tid]; S.notes.push({id:'N-'+(S.seq.note = (S.seq.note||500)+1), tid, cat:N.cat, date:dateKey(TODAY), text:txt, by:USER().name});
  log('in',USER().name,'PRAGATI Record',`Note on ${p.name}: ${NOTEK[N.cat][1]}.`); UI.nf = {cat:'good'}; toast('Note added to '+p.name+'’s record'); render(); },
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
 cvalid(el){ const c = S.cases.find(x=>x.id===el.dataset.id), r = val('cv-r'), nk = val('cv-k'); if(r.length<5){ $('#cv-e').textContent = 'Add validation remarks.'; return false; } if(nk && nk!==c.k){ c.steps.validated = {by:USER().name,at:stamp(),remarks:r+' (misconduct corrected from '+MISK[c.k].name+')'}; c.k = nk; } else c.steps.validated = {by:USER().name,at:stamp(),remarks:r}; c.status = 2; log('wf','Line manager','PRAGATI Conduct',`${c.id} validated by ${USER().name}; HoD to decide the action.`); render(); },
 cnot(el){ const c = S.cases.find(x=>x.id===el.dataset.id), r = val('cv-r'); if(r.length<5){ $('#cv-e').textContent = 'Add remarks explaining why.'; return false; } const by = USER().name; c.steps.validated = {by,at:stamp(),remarks:r}; c.steps.action = {by,at:stamp(),label:'Not substantiated',level:'none',reason:r}; c.steps.letter = {by:'—',at:stamp()}; c.steps.closed = {by,at:stamp()}; c.status = 5; c.closedAt = TODAY.toISOString(); log('wf','Line manager','PRAGATI Conduct',`${c.id} closed as not substantiated.`); render(); },
 caction(el){ const c = S.cases.find(x=>x.id===el.dataset.id), sg = suggest(c.tid,c.k,c.id), label = val('ca-a'), level = ACTIONS.find(a=>a[0]===label)[1], reason = val('ca-r'); if(level!==sg.level && reason.length<5){ $('#ca-e').textContent = 'Differs from the ladder ('+sg.label+'). Add a reason.'; return false; } c.steps.action = {by:USER().name,at:stamp(),label,level,reason}; c.status = 3; log('wf','HoD','PRAGATI Conduct',`${c.id}: action ${label}.`); render(); },
 cletter(el){ const c = S.cases.find(x=>x.id===el.dataset.id), lvl = c.steps.action.level;
  if(lvl==='ic'){ const ref = val('cl-r'); if(ref.length<3){ $('#cl-e').textContent = 'Add the IC reference no.'; return false; } c.steps.letter = {by:USER().name,at:stamp(),type:'Internal Committee referral',ref}; c.status = 4; log('wf','HR','PRAGATI Conduct',`${c.id}: referred to the Internal Committee.`); render(); return; }
  if(lvl!=='none'){ const ref = val('cl-r'), ack = $('#cl-a').checked; if(ref.length<3){ $('#cl-e').textContent = 'Add the letter reference no.'; return false; } if(!ack){ $('#cl-e').textContent = 'Record the apprentice\u2019s acknowledgement first.'; return false; } c.steps.letter = {by:USER().name,at:stamp(),type:val('cl-t'),ref,ack:true}; }
  else c.steps.letter = {by:USER().name,at:stamp(),type:'No letter'};
  c.status = 4; log('wf','HR','PRAGATI Conduct',`${c.id}: ${lvl==='none'?'no letter needed':c.steps.letter.type+' '+c.steps.letter.ref+' issued and acknowledged'}.`); render(); },
 cclose(el){ const c = S.cases.find(x=>x.id===el.dataset.id), p = S.people[c.tid]; c.steps.closed = {by:USER().name,at:stamp()}; c.status = 5; c.closedAt = TODAY.toISOString(); if(c.steps.action.level==='end'){ p.status = 'Training ended'; log('out','PRAGATI','SAP SF/EC Job info',`${p.name}: training ended (${c.id}).`); } log('wf','HR','PRAGATI Conduct',`${c.id} closed; counts in scoring.`); afterDataChange('Conduct case closed',[c.tid]); toast(MISK[c.k].tier ? c.id+' closed. The agent will re-score '+p.name+'.' : c.id+' closed.'); render(); },
 cpreset(el){ UI.cf.preset = el.dataset.id; render(); },
 lgfor(el){ UI.lg = {tid:el.dataset.id, k:el.dataset.k||'', imm:[], q:''}; go('cases/log'); },
 lgpick(el){ keepLg(); UI.lg.k = el.dataset.id; UI.lg.othSug = null; render(); },
 lgimmsop(){ keepLg(); const G = UI.lg; G.imm = [...new Set([...G.imm, ...immSop(G.k)])]; render(); },
 cacc(el){ codeCase(el.dataset.id, el.dataset.k); render(); },
 caccall(){ const q = othQueue().map(c=>[c, classify(c.desc)]).filter(x=>x[1]&&x[1]!=='oth'); q.forEach(([c,k])=>codeCase(c.id,k,true)); toast(q.length+' case'+(q.length>1?'s':'')+' coded'); render(); },
 cqpick(el){ const k = val('cq-'+el.dataset.id); if(!k){ toast('Pick a code first'); return false; } codeCase(el.dataset.id, k); render(); },
 cnewfrom(el){ const c = S.cases.find(x=>x.id===el.dataset.id); UI.cform = {from:c.id, tier:1, kwx:'', imm:[]}; go('cases/codes'); setTimeout(()=>{ const f = document.getElementById('cfm-n'); if(f){ f.scrollIntoView({block:'center'}); f.focus(); } }, 50); },
 codenew(){ UI.cform = {tier:1, kwx:'', imm:[]}; render(); setTimeout(()=>{ const f = document.getElementById('cform'); if(f) f.scrollIntoView({block:'start'}); }, 30); },
 codeedit(el){ const m = MISK[el.dataset.id]; UI.cform = {k:m.k, name:m.name, cat:m.cat, tier:m.tier, lad:m.lad.map(x=>x[0]), docs:m.docs, kwx:m.kwx, imm:(m.imm||[]).slice()}; render(); setTimeout(()=>{ const f = document.getElementById('cform'); if(f) f.scrollIntoView({block:'start'}); }, 30); },
 codecancel(){ UI.cform = null; render(); },
 codesave(){
  const F = UI.cform, C = S.codes, m = F.k ? MISK[F.k] : null, base = m && !m.custom, kwx = val('cfm-k').replace(/\s+/g,' ').trim(), who = USER().name, off = $('#cfm-off') ? $('#cfm-off').checked : false;
  if(base){ const e = C.edit[m.k] || (C.edit[m.k] = {}); const ch = []; if(kwx!==(e.kwx||'')) ch.push('phrases'); if(off!==!!e.off) ch.push(off?'retired':'restored'); e.kwx = kwx; e.off = off;
   if(ch.length) C.log.push({at:stamp(), by:who, what:`${m.no} ${m.name}: ${ch.join(', ')}`}); }
  else {
   const name = val('cfm-n').trim(), tier = Number(val('cfm-t')), cat = val('cfm-c'), docs = val('cfm-d').trim() || 'Incident report';
   if(name.length<5){ $('#cfm-e').textContent = 'Give the misconduct a clear name.'; return false; }
   if(MIS.some(x=>x.k!==(m&&m.k) && x.name.toLowerCase()===name.toLowerCase())){ $('#cfm-e').textContent = 'A code with this name already exists.'; return false; }
   if(!kwx){ $('#cfm-e').textContent = 'Add at least one phrase, so PRAGATI can suggest this code.'; return false; }
   const lad = TIER_LADDER[tier].map((x,i)=>[val('cfm-l'+i).trim()||x[0], x[1]]), imm = $$('[data-cfimm]').filter(x=>x.checked).map(x=>x.value);
   if(m){ const a = C.add.find(x=>x.k===m.k); Object.assign(a, {name, cat, tier, lad, docs, kwx, imm}); const e = C.edit[m.k] || (C.edit[m.k] = {}); e.off = off; C.log.push({at:stamp(), by:who, what:`${m.no} ${name}: edited${off?' (retired)':''}`}); }
   else { const no = nextCode(), k = 'u'+no.slice(3); C.add.push({k, no, name, cat, tier, lad, docs, kw:'', kwx, imm, custom:true, by:who, at:stamp()}); C.log.push({at:stamp(), by:who, what:`${no} ${name} created (${TIER[tier][0]})`}); F.newK = k; }
  }
  syncCodes(); log('sys','HR','Code list', C.log[C.log.length-1] ? C.log[C.log.length-1].what : 'Code list saved');
  let msg = 'Code list saved';
  if(F.newK){ msg = MISK[F.newK].no+' created'; if(F.from && $('#cfm-apply') && $('#cfm-apply').checked){ const ids = [F.from, ...othQueue().filter(c=>c.id!==F.from && classify(c.desc)===F.newK).map(c=>c.id)]; ids.forEach(id=>codeCase(id, F.newK, true)); msg += ' and assigned to '+ids.join(', '); } }
  const back = F.from && !UI.cform.k; UI.cform = null; afterDataChange('Code list changed'); toast(msg); if(back) go('cases/classify'); else render();
 },
 cclass(el){ const k = val('cc-k'); if(!k){ $('#cc-e').textContent = 'Pick a code.'; return false; } codeCase(el.dataset.id, k); render(); },
 imptpl(){ download('conduct_history_template.csv', [IMP_COLS]); },
 impsample(){ const rows = impSample(); UI.imp = {name:'sample_register.csv', rows:impRows(rows)}; render(); },
 impclear(){ UI.imp = null; render(); },
 impgo(){ const I = UI.imp; if(!I) return false; const ok = I.rows.filter(r=>!r.err); const tids = new Set();
  ok.forEach(r=>{ const lv = r.lv || '?', label = ({vcur:'VC / UR',wl:/show cause/i.test(r.raw[4])?'Show cause notice':/suspen/i.test(r.raw[4])?'Suspension':'Warning letter',end:'Discontinuation / termination',ic:'Refer to Internal Committee',none:'Record only (no penalty)','?':'Not recorded'})[lv];
   const at = fmt(d(r.date)), by = 'Earlier register';
   const c = {id:'H-'+(S.seq.hist = (S.seq.hist||1000)+1), tid:r.p.id, k:r.k, date:r.date, time:'\u2014', place:'\u2014', desc:r.raw[6]||r.raw[2]||'', evidence:[], imm:[], reporter:by, status:5, channel:'Import', hist:I.name, raw:r.raw[2],
    steps:{reported:{by,at}, validated:{by,at,remarks:'Imported; recorded as “'+(r.raw[2]||'')+'”'}, action:{by,at,label,level:lv,reason:''}, letter:r.raw[5]?{by,at,type:LETTERS[lv]||'Letter',ref:r.raw[5],ack:false}:{by,at,type:'No letter'}, closed:{by:USER().name,at:stamp()}}, closedAt:new Date(d(r.date).getTime()+DAY).toISOString()};
   if(['vcur','wl','end'].includes(lv) && !r.raw[5]) c.steps.letter = {by,at,type:LETTERS[lv]};
   S.cases.push(c); tids.add(r.p.id); });
  log('in','HR','PRAGATI Conduct',`${ok.length} case(s) imported from ${I.name}; ${ok.filter(r=>r.k==='oth').length} need a code.`);
  afterDataChange('Conduct history imported',[...tids]); UI.imp = null; UI.cf = Object.assign(UI.cf||{q:'',cat:'',tier:'',st:'',plant:''}, {preset:'hist'}); toast(ok.length+' cases imported'); go('cases/register'); },
 lgsubmit(){
  const G = UI.lg; keepLg(); const err = [];
  if(!G.tid) err.push('pick the apprentice'); if(!G.k) err.push('choose the misconduct'); if((G['lg-desc']||'').trim().length<10) err.push('describe what happened'); if(!G['lg-date']) err.push('give the date');
  if(err.length){ $('#lg-err').textContent = 'Please '+err.join(', ')+'.'; return false; }
  const p = S.people[G.tid], u = USER(), isLM = u.role==='manager' && p.mgr===u.persona, posh = G.k==='posh';
  const files = [...(($('#lg-ev')||{}).files||[])].map(x=>x.name);
  if(G.k==='oth' && !G.othSeen){ const s = classify(G['lg-desc']); G.othSeen = true; if(s && s!=='oth'){ G.othSug = s; render(); return false; } }
  const immo = (G['lg-immo']||'').trim(); if(immo) G.imm = [...G.imm, 'Other: '+immo];
  const c = {id:'C-'+(S.seq.case++), tid:p.id, k:G.k, date:G['lg-date'], time:G['lg-time']||'\u2014', place:G['lg-place']||p.line, desc:G['lg-desc'].trim(), other:G['lg-oth']||'', wit:G['lg-wit']||'', imm:G.imm.slice(), evidence:files, reporter:u.name+' ('+u.title+')', status:posh?3:isLM?2:1, channel:'Desktop', steps:{reported:{by:u.name,at:stamp()}}};
  if(posh){ c.steps.action = {by:'PRAGATI',at:stamp(),label:'Refer to Internal Committee',level:'ic',reason:'POSH complaint'}; }
  if(G.k==='acc') c.injury = {what:G['lg-inj']||'\u2014', days:Number(G['lg-days'])||0, cause:G['lg-cause']||'No: record only'};
  if(isLM && !posh) c.steps.validated = {by:u.name,at:stamp(),remarks:'Logged by the line manager.'};
  S.cases.push(c); UI.lg = null;
  if(posh){ log('in',u.name,'PRAGATI Conduct',`${c.id}: POSH complaint sent to HR for Internal Committee referral.`); toast(c.id+' sent to HR'); go(u.role==='hr'?'case/'+c.id:'cases/register'); return; }
  log('in',u.name,'PRAGATI Conduct',`${c.id} logged for ${p.name}: ${MISK[c.k].no} ${MISK[c.k].name}. ${isLM?'Validated; HoD '+HODS[hodOf(p)].name+' to decide the action.':'Waiting for '+MANAGERS[p.mgr].name+' to validate.'}`);
  toast(c.id+' logged'); go('case/'+c.id);
 },
 casecsv(){ const all = visCases().filter(c=>myPeople().some(p=>p.id===c.tid)); download('conduct_register.csv', [['Case','Date','Time','Place','Apprentice','Ticket','TeamLease code','Plant','Department','MC code','Misconduct','Category','Tier','Description','Witnesses','Immediate action','Reported by','Validated by','Action','Action by','Letter','Letter ref','Acknowledged','Status','Closed on','Record check','Source']].concat(caseFilter(all).map(c=>{ const p = S.people[c.tid], m = MISK[c.k], st = c.steps; return [c.id,c.date,c.time,c.place,p.name,p.ticket,p.tl||'',PLANTS[plantOf(p)],deptOf(p),m.no,m.name,m.cat,TIER[m.tier][0],c.desc,c.wit||'',(c.imm||[]).join('; '),c.reporter,st.validated?st.validated.by:'',st.action?st.action.label:'',st.action?st.action.by:'',st.letter?st.letter.type||'':'',st.letter?st.letter.ref||'':'',st.letter&&st.letter.ack?'Yes':'',CSTATUS[c.status],st.closed?st.closed.at:'',caseIssues(c).join('; '),c.hist?'Imported':'']; }))); },
 vsel(el){ UI.vid = el.dataset.id; UI.mf = {}; render(); },
 colsbtn(){ UI.cols = !UI.cols; render(); },
 vsave(){ const n = val('v-name'); if(n.length<2){ toast('Give the view a name'); return false; } const V = S.views.find(v=>v.id===UI.vid)||S.views[0]; const nv = {id:'v'+Date.now().toString(36), name:n, cols:V.cols.slice(), f:Object.assign({}, V.f, UI.mf||{}), group:V.group, sort:V.sort, sys:false}; S.views.push(nv); UI.vid = nv.id; UI.mf = {}; toast('View “'+n+'” saved'); render(); },
 vdel(){ S.views = S.views.filter(v=>v.id!==UI.vid); UI.vid = S.views[0].id; toast('View deleted'); render(); },
 cfgreset(){ S.cfg.w = clone(DEFAULT_CFG.w); S.cfg.blend = DEFAULT_CFG.blend; afterDataChange('Rule set changed'); log('sys','HR','Rule set','Bucket weights reset to equal.'); toast('Equal bucket weights restored'); render(); },
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
  const launched = [...midLaunch(S), ...autoLaunch(S)]; if(launched.length) log('sys','Scheduler','PRAGATI Reviews',`Reviews opened: ${launched.join(', ')}.`);
  const al = absAlerts(); al.forEach(({p,a})=>{ if(!S.alerts[p.id]){ S.alerts[p.id] = true; log('sys','PRAGATI','Line manager / HR',`Absence alert: ${p.name} absent ${a.cont} working days.`); } });
  const od = S.forms.filter(f=>!isDone(f) && new Date(f.cpDate)<TODAY);
  if(od.length) log('sys','Scheduler','Line managers',`Reminder: ${od.length} overdue review(s).`);
  afterDataChange('Nightly re-check'); const q = queue(); q.forEach(x=>runAgent(x.p.id, x.reason));
  const kd = S.kaizens.filter(x=>x.status==='Implemented' && new Date(d(x.implAt).getTime()+S.cfg.kzVerifyDays*DAY)<=TODAY).length;
  log('sys','Scheduler','PRAGATI',`Nightly checks: ${launched.length} review(s) opened, ${al.length} absence alert(s), ${q.length} re-scored, ${kd} kaizen sustain check(s) due.`);
  toast('Nightly checks done'); render();
 }
};
function keepNf(){ const N = UI.nf || (UI.nf = {cat:'good'}); const t = $('#nf-t'), x = $('#nf-x'); if(t) N.tid = t.value; if(x) N.text = x.value; }
function keepLg(){ const G = UI.lg; if(!G) return; $$('[id^="lg-"]').forEach(el=>{ if(el.id!=='lg-tid' && el.id!=='lg-k' && el.type!=='file') G[el.id] = el.value; }); }
function keepKzd(){ const D = UI.kzd; if(!D) return; ['kd-ti','kd-b','kd-a','kd-r','kd-st','kd-mn','kd-mb','kd-ma','kd-u','kd-s','kd-c'].forEach(id=>{ const el = document.getElementById(id); if(el) D[id] = el.value; }); }
function restoreKzd(){ const D = UI.kzd; if(!D) return; Object.keys(D).filter(k=>k.startsWith('kd-')).forEach(id=>{ const el = document.getElementById(id); if(el) el.value = D[id]; }); }
function codeCase(id, k, quiet){ const c = S.cases.find(x=>x.id===id); if(!c || !MISK[k]) return; c.steps.coded = {by:USER().name, at:stamp(), label:MISK[k].no+' '+MISK[k].name}; c.k = k; log('wf','HR','PRAGATI Conduct',`${c.id} coded as ${MISK[k].no} ${MISK[k].name}.`); if(!quiet) toast(c.id+' coded as '+MISK[k].no); }
function parseCSV(t){ const out = []; let row = [], cur = '', q = false; t = t.replace(/^\ufeff/,''); for(let i=0;i<t.length;i++){ const ch = t[i]; if(q){ if(ch==='"'){ if(t[i+1]==='"'){ cur+='"'; i++; } else q = false; } else cur += ch; } else if(ch==='"') q = true; else if(ch===','){ row.push(cur); cur=''; } else if(ch==='\n'||ch==='\r'){ if(ch==='\r'&&t[i+1]==='\n') i++; row.push(cur); out.push(row); row=[]; cur=''; } else cur += ch; } if(cur||row.length){ row.push(cur); out.push(row); } return out; }
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
 if(el.id==='pl-pick'){ UI.plant = el.value; render(); return; }
 if(el.id==='ag-p'){ UI.pipe = {tid:el.value, step:0}; render(); return; }
 if(ds.tb){ UI.tablet[ds.tb] = el.value; if(ds.tb==='tid'||ds.tb==='k'){ UI.tablet.desc = val('tb-x'); UI.tablet.time = val('tb-h'); if(ds.tb==='tid') UI.tablet.place = ''; render(); } return; }
 if(ds.lg){ keepLg(); UI.lg[ds.lg] = el.value; if(ds.lg==='k'){ UI.lg.othSeen = false; UI.lg.othSug = null; } if(ds.lg==='tid') delete UI.lg['lg-place']; render(); return; }
 if(el.matches('[data-lgimm]')){ const G = UI.lg; G.imm = el.checked ? [...new Set([...G.imm, el.value])] : G.imm.filter(x=>x!==el.value); return; }
 if(ds.cf && el.tagName==='SELECT'){ UI.cf[ds.cf] = el.value; render(); return; }
 if(ds.cft){ const F = UI.cform; F.name = val('cfm-n'); F.cat = val('cfm-c'); F.docs = val('cfm-d'); F.kwx = val('cfm-k'); F.imm = $$('[data-cfimm]').filter(x=>x.checked).map(x=>x.value); F.tier = Number(el.value); F.lad = null; render(); return; }
 if(ds.md){ const m = S.mids.find(x=>x.id===ds.md); m[ds.k] = el.value; persistSoon(); return; }
 if(ds.mdf){ const m = S.mids.find(x=>x.id===ds.mdf); if(el.checked){ if(m.focus.length>=3){ el.checked = false; toast('Keep it to three focus areas'); return; } m.focus.push(el.value); } else m.focus = m.focus.filter(x=>x!==el.value); persistSoon(); return; }
 if(ds.mds){ const m = S.mids.find(x=>x.id===ds.mds); m.support = el.checked ? [...new Set([...m.support, el.value])] : m.support.filter(x=>x!==el.value); persistSoon(); return; }
 if(el.id==='nf-t'){ keepNf(); return; }
 if(ds.imp){ const r = UI.imp.rows.find(x=>x.i===Number(ds.imp)); r.k = el.value; r.auto = false; render(); return; }
 if(ds.cfgchk){ S.cfg[ds.cfgchk] = el.checked ? 1 : 0; afterDataChange('Rule set changed'); log('sys','HR','Rule set',`Imported conduct cases ${el.checked?'count':'do not count'} in evaluation.`); persist(); render(); toast('Setting saved'); return; }
 if(el.id==='imp-f' && el.files && el.files[0]){ const f = el.files[0], rd = new FileReader(); rd.onload = () => { const rows = parseCSV(String(rd.result)).filter(r=>r.some(x=>String(x).trim())); if(rows.length && /ticket|teamlease/i.test(rows[0][0]||'')) rows.shift(); UI.imp = {name:f.name, rows:impRows(rows)}; render(); }; rd.readAsText(f); return; }
 if(ds.kzd){ keepKzd(); UI.kzd[ds.kzd] = el.value; if(ds.kzd==='tid') UI.kzd.team = ''; render(); restoreKzd(); return; }
 if(ds.cfg){ const [a,b] = ds.cfg.split('.'); const n = Number(el.value); if(isNaN(n)) return; if(b) S.cfg[a][b] = n; else S.cfg[a] = n; afterDataChange('Rule set changed'); log('sys','HR','Rule set',`${ds.cfg} set to ${n}.`); persist(); render(); return; }
 if(ds.vis){ const [r,k] = ds.vis.split('.'); S.cfg.vis[r][k] = el.checked; log('sys','HR','Role views',`${r}: ${k} ${el.checked?'shown':'hidden'}.`); persist(); render(); toast('View setting saved for all portals'); return; }
 if(ds.ffc){ const f = formOf(ds.ffc); f[ds.k] = el.checked; if(f.status==='Not started') f.status = 'In progress'; persist(); return; }
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
 if(ds.cf==='q'){ UI.cf.q = el.value; UI.refocus = el.id; render(); return; }
 if(ds.md){ const m = S.mids.find(x=>x.id===ds.md); m[ds.k] = el.value; if(m.status==='Not started') m.status = 'In progress'; persistSoon(); return; }
 if(ds.lgq){ keepLg(); UI.lg.q = el.value; UI.refocus = 'lgq'; render(); return; }
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
window.addEventListener('hashchange', ()=>{ UI.drawer = null; UI.showMiss = false; UI.mdErr = ''; render(); });

/* ----- boot ----- */
if(!loadStore()){ S = seed(); seedLog(); initAssess(); persist(); }
syncCodes();
try{ const u = sessionStorage.getItem('pragati-sess-'+PORTAL); if(u && USERS[u] && P.roles.includes(USERS[u].role)) ME = u; }catch(e){}
render();
