/* PRAGATI · screens. Every function returns HTML for #app. */

/* ======================= SMALL PARTS ======================= */
const ICONS = {
 home:'<path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z"/>',
 users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.6 3.3-5.5 6.5-5.5s5.9 1.9 6.5 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M16.5 14.6c2.6.2 4.4 1.9 5 5.4"/>',
 clip:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9zM9 12h6M9 16h4"/>',
 bulb:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
 shield:'<path d="M12 3 4.5 6v6c0 4.5 3.2 7.8 7.5 9 4.3-1.2 7.5-4.5 7.5-9V6z"/>',
 chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
 check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>',
 alert:'<path d="M12 4 2.5 20h19z"/><path d="M12 10v4.5M12 17.5v.01"/>',
 db:'<ellipse cx="12" cy="5.5" rx="7.5" ry="2.5"/><path d="M4.5 5.5v13c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5v-13M4.5 12c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5"/>',
 upload:'<path d="M12 16V4M7 9l5-5 5 5M4 16v4h16v-4"/>',
 clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
 flag:'<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
 chev:'<path d="m6 9 6 6 6-6"/>',
 arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
 x:'<path d="M6 6l12 12M18 6 6 18"/>',
 search:'<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4-4"/>',
 cog:'<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M4.2 6.2l2.1 2.1M17.7 15.7l2.1 2.1M2.5 12h3M18.5 12h3M4.2 17.8l2.1-2.1M17.7 8.3l2.1-2.1"/>',
 tablet:'<rect x="5" y="2.5" width="14" height="19" rx="2.5"/><path d="M11 18h2"/>',
 agent:'<rect x="4" y="7" width="16" height="12" rx="3"/><path d="M12 3v4M9 12v1.5M15 12v1.5M9.5 16h5"/>',
 flow:'<circle cx="5" cy="6" r="2.5"/><circle cx="5" cy="18" r="2.5"/><circle cx="19" cy="12" r="2.5"/><path d="M7.5 6H12a3 3 0 0 1 3 3v0a3 3 0 0 0 1.5 2.5M7.5 18H12a3 3 0 0 0 3-3"/>',
 tl:'<path d="M3 7h18v13H3zM8 7V4h8v3"/>',
 plant:'<path d="M2 21V10l6 4V10l6 4V6l8 4v11z"/>',
 eye:'<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 download:'<path d="M12 4v12M7 11l5 5 5-5M4 20h16"/>'
};
const ic = (n, s=18) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n]||''}</svg>`;
const bandChip = (b, lg) => `<span class="band ${b||'X'} ${lg?'lg':''}" title="Band ${b&&b!=='X'?b:'none'}">${b&&b!=='X'?b:'—'}</span>`;
const av = n => `<span class="avatar" aria-hidden="true">${esc(initials(n))}</span>`;
const SRC = {sf:['sf','SAP SF/EC'],time:['time','Time system'],tl:['tl','TeamLease'],coord:['coord','Coordinator upload'],kz:['kz','Kaizen register'],tab:['tab','Line tablet'],app:['app','PRAGATI review'],ag:['ag','Agent'],case:['tab','Conduct log']};
const srcTag = k => { const [c,l] = SRC[k]||['app',k]; return `<span class="src ${c}"><i></i>${esc(l)}</span>`; };
const PSRC = {att:'time',kz:'kz',ie:'coord',jh:'coord',skill:'coord',safety:'case',qlapse:'case',conduct:'case',sent:'ag'};
function formChip(f){ const m = {'Not started':'','In progress':'info','With HoD':'warn','Completed':'good'}; return `<span class="chip ${m[f.status]||''}">${f.returned&&f.status==='In progress'?'Returned by HoD':esc(f.status)}</span>`; }
function caseChip(c){ const cl = c.status===5?'good':c.status===1?'bad':'warn'; return `<span class="chip ${cl}">${esc(CSTATUS[c.status])}</span>`; }
function kzChip(k){ const m = {Submitted:'info',Approved:'brand',Implemented:'warn',Verified:'good','Not sustained':'bad',Rework:'warn',Rejected:''}; return `<span class="chip ${m[k.status]||''}">${esc(k.status)}</span>`; }
function statusChip(s){ return `<span class="chip ${s==='On track'?'good':s==='At risk'?'bad':''}"><span class="dot"></span>${esc(s)}</span>`; }
function recChip(r){ const c = r==='Recommend conversion'?'good':r==='Not recommended'||r==='Training ended'?'bad':'warn'; return `<span class="chip ${c}">${esc(r)}</span>`; }
function ids(p){ return `<span class="chip">Ticket ${esc(p.ticket)}</span>${p.tl?`<span class="chip">TeamLease ${esc(p.tl)}</span>`:''}<span class="chip brand">${esc(p.type)}</span>`; }
const dueTxt = dt => { const n = Math.round((new Date(dt)-TODAY)/DAY); return n<0 ? `<span class="bad">${-n} day${n===-1?'':'s'} overdue</span>` : n===0 ? '<span class="warn">due today</span>' : `due in ${n} day${n===1?'':'s'}`; };
const mo = p => Math.min(12, Math.floor(monthsIn(p.doj, TODAY)));
function bar(v, max=100, cls=''){ const w = clamp(v/max*100,0,100); return `<div class="bar ${cls}"><i style="width:${w}%"></i></div>`; }
const scoreCls = v => v==null?'':v>=3.8?'good':v>=2.6?'warn':'bad';
function crumb(items){ return `<div class="crumb">${items.map((x,i)=>i<items.length-1?`<a href="#/${x[1]}">${esc(x[0])}</a><span>›</span>`:`<span>${esc(x[0])}</span>`).join('')}</div>`; }
function ph(title, sub, right='', cr=''){ return `<div class="ph"><div>${cr}<h1>${title}</h1>${sub?`<p>${sub}</p>`:''}</div>${right?`<div class="row">${right}</div>`:''}</div>`; }
function kpi(l, v, s='', go=''){ return go ? `<button class="kpi" type="button" data-go="${go}"><div class="l">${l}</div><div class="v">${v}</div>${s?`<div class="s">${s}</div>`:''}</button>` : `<div class="kpi"><div class="l">${l}</div><div class="v">${v}</div>${s?`<div class="s">${s}</div>`:''}</div>`; }
const vis = (role, k) => !!(S.cfg.vis[role] && S.cfg.vis[role][k]);
function cdTxt(cd){ if(!cd.wl&&!cd.vcur&&!cd.end&&!cd.open) return '<span class="good">Clean</span>'; return `<span class="${cd.eff||cd.end?'bad':'warn'}">${[cd.wl?cd.wl+' WL':'',cd.vcur?cd.vcur+' VC/UR':'',cd.open?cd.open+' open':''].filter(Boolean).join(' \u00b7 ')}</span>`; }
function deptOf(p){ return MANAGERS[p.mgr].dept; }

/* ======================= LANDING ======================= */
function vLanding(){
 const ps = Object.values(S.people), act = ps.filter(p=>p.status==='Active');
 const ev = act.map(p=>latestEval(p)).filter(Boolean);
 const k3 = S.kaizens.filter(k=>k.implAt && d(k.implAt) >= new Date(TODAY.getTime()-91*DAY)).length;
 const group = (title, sub, keys) => `<section class="pgroup"><h2>${title}</h2><p>${sub}</p><div class="grid g4">${keys.map(k=>{ const x = PORTALS[k]; const creds = Object.entries(USERS).filter(([u,v])=>x.roles.includes(v.role)).map(([u])=>u); return `<a class="portal" href="${x.file}"><span class="ico">${ic(x.icon,22)}</span><b>${esc(x.name)}</b><span class="who">${esc(x.who)}</span><span class="cred">Demo login: <span class="mono">${esc(creds.slice(0,3).join(', '))}${creds.length>3?' …':''}</span></span><span class="go">Open portal →</span></a>`; }).join('')}</div></section>`;
 return `<div class="land-hero"><div class="in"><div>
  <div class="eyebrow">Bajaj Auto · ${PLANT} plant · Apprentice programme</div>
  <h1><span>PRAGATI</span><br>One record for every apprentice, from joining to conversion.</h1>
  <p class="exp"><b>P</b>erformance & <b>R</b>ecords of <b>A</b>pprentices: <b>G</b>rowth, <b>A</b>ttendance, <b>T</b>raining, <b>I</b>ntegrity. Reviews, attendance, kaizens, skills and conduct in one place. Data flows in from SAP SF/EC and plant systems; the final decision flows back to SF/EC.</p>
  <div class="acro">${[['P','Performance'],['R','Records'],['A','Apprentices'],['G','Growth'],['A','Attendance'],['T','Training'],['I','Integrity']].map(([a,b])=>`<div><b>${a}</b><span>${b}</span></div>`).join('')}</div>
 </div>
 <div class="heroboard"><div class="between"><h3>Today at ${PLANT}</h3><span class="muted sm">${fmt(TODAY)}</span></div>
  <div class="grid g2 mt16">${kpi('Active apprentices', act.length)}${kpi('Reviews waiting for HoD', S.forms.filter(f=>f.status==='With HoD').length)}${kpi('Kaizens implemented (90 days)', k3)}${kpi('Open conduct cases', S.cases.filter(c=>c.status<5).length)}</div>
  <div class="mt16"><div class="between sm muted"><span>Band mix, latest reviews</span><span>${ev.length} reviewed</span></div>${bandMix(ev.map(x=>x.e.fb))}</div>
 </div></div></div>
 <div class="page" style="padding-top:8px">
  ${group('People managers','Review, sign off and decide. Each role sees what HR has configured for it.',['manager','hod','plant','hr'])}
  ${group('Shop floor','Capture at the source: incidents and kaizens from the line, registers from coordinators.',['tablet','coordinator'])}
  ${group('Source systems (simulated)','Stand-ins for the systems that feed PRAGATI. In production these are automated interfaces.',['timesystem','teamlease','agent','monitor'])}
  <section class="pgroup"><div class="note">All demo accounts use the password <span class="mono">${DEMO_PW}</span>. Portals open in separate tabs and stay in sync in this browser. Names and numbers are sample data. <button class="linkbtn" data-act="reset" type="button">Reset demo data</button></div></section>
 </div>`;
}
function bandMix(bands){
 const n = bands.length||1, c = b => bands.filter(x=>x===b).length;
 const A = c('A'), B = c('B'), C = c('C')+c('X');
 return `<div class="stackbar mt8" role="img" aria-label="A ${A}, B ${B}, C ${C}"><i class="A" style="width:${A/n*100}%"></i><i class="B" style="width:${B/n*100}%"></i><i class="C" style="width:${C/n*100}%"></i></div>
 <div class="legend mt8"><span><i style="background:#43A877"></i>A ${A}</span><span><i style="background:#E3B341"></i>B ${B}</span><span><i style="background:#D9645E"></i>C ${C}</span></div>`;
}

/* ======================= LOGIN ======================= */
function vLogin(){
 const accts = Object.entries(USERS).filter(([u,x])=>P.roles.includes(x.role));
 return `<div class="login"><div class="l"><div style="font-weight:700;letter-spacing:.16em;font-size:14px;opacity:.85">PRAGATI</div><h2 style="margin-top:14px">${esc(P.name)}</h2><p>${esc(P.pitch||P.who)}</p><ul>${(P.points||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
 <div class="r"><form id="loginf" novalidate>
  <h1>Sign in</h1><p class="sub">${esc(P.who)}</p>
  <div class="fld"><label for="lg-u">User ID</label><input id="lg-u" autocomplete="username" autocapitalize="none" spellcheck="false"></div>
  <div class="fld"><label for="lg-p">Password</label><input id="lg-p" type="password" autocomplete="current-password"></div>
  <div class="err" id="lg-e" role="alert"></div>
  <button class="btn pri lg" type="submit">Sign in</button>
  <div class="demo"><b class="ink">Demo accounts</b> · password <span class="mono">${DEMO_PW}</span><div class="row">${accts.map(([u,x])=>`<button class="btn sm" type="button" data-act="fill" data-id="${u}" title="${esc(x.title)}">${u}</button>`).join('')}</div></div>
  <p class="sm muted">Prototype with sample data · <a href="index.html">All portals</a></p>
 </form></div></div>`;
}

/* ======================= MANAGER ======================= */
function vMgrHome(){
 const ps = myPeople(), fs = S.forms.filter(f=>ps.some(p=>p.id===f.tid));
 const due = fs.filter(f=>f.status==='Not started'||f.status==='In progress').sort((a,b)=>new Date(a.cpDate)-new Date(b.cpDate));
 const kzE = S.kaizens.filter(k=>ps.some(p=>p.id===k.tid) && (k.status==='Submitted'||k.status==='Approved')).sort((a,b)=>(a.status==='Submitted'?0:1)-(b.status==='Submitted'?0:1)||b.date.localeCompare(a.date));
 const cs = S.cases.filter(c=>ps.some(p=>p.id===c.tid) && c.status===1);
 const m12 = ps.filter(p=>formsOf(p.id).some(f=>f.cp==='M12'));
 const me = USERS[ME];
 return `${ph('Good morning, '+esc(me.name), esc(me.title)+' · '+ps.length+' apprentices in your team')}
 <div class="grid g4">${kpi('Reviews to complete', due.length, due.filter(f=>new Date(f.cpDate)<TODAY).length+' overdue','reviews')}${kpi('Kaizens to evaluate', kzE.filter(k=>k.status==='Submitted').length, kzE.filter(k=>k.status==='Approved').length+' approved, awaiting implementation','kaizen')}${kpi('Incidents to validate', cs.length, 'Reported from the line tablet','cases')}${kpi('Month 12 apprentices', m12.length, 'Conversion stage','m12')}</div>
 <div class="grid g21 mt24">
  <section class="card"><div class="card-h"><div><h2>Reviews due</h2><p class="sub">Each review takes about 3 minutes: 16 statements on a 1–5 scale, in six PQCDSM buckets.</p></div><button class="btn sm" data-go="quick" type="button">Quick rate the team</button></div>
   <div class="list">${due.map(f=>{ const p = S.people[f.tid]; const n = ALL_ST.filter(k=>f.ans[k]).length; return `<div class="li click" data-go="review/${f.id}" role="button" tabindex="0">${av(p.name)}<div class="sp"><div class="t1">${esc(p.name)} · ${f.cp}</div><div class="t2">${esc(p.line)} · checkpoint ${fmt(f.cpDate)} · ${dueTxt(f.cpDate)}</div></div><div style="width:140px">${bar(n,ALL_ST.length)}<div class="t2 mt8">${n} of ${ALL_ST.length} rated</div></div>${formChip(f)}</div>`; }).join('') || '<div class="empty-s">No reviews due. New reviews open automatically 7 days before each checkpoint.</div>'}</div>
  </section>
  <section class="stack">
   <div class="card"><h2>Kaizens waiting for you</h2><div class="list mt8">${kzE.slice(0,5).map(k=>`<div class="li click" data-act="kzopen" data-id="${k.seq}" role="button" tabindex="0"><span class="pq">${k.cat}</span><div class="sp"><div class="t1">${esc(k.title)}</div><div class="t2">${esc(S.people[k.tid].name)} · ${fmtS(d(k.date))}</div></div>${kzChip(k)}</div>`).join('')||'<div class="empty-s">Nothing waiting.</div>'}</div>${kzE.length>5?`<button class="btn ghost sm mt8" data-go="kaizen" type="button">All ${kzE.length} →</button>`:''}</div>
   <div class="card"><h2>Incidents to validate</h2><div class="list mt8">${cs.map(c=>`<div class="li click" data-go="case/${c.id}" role="button" tabindex="0"><span class="ico bad">${ic('alert')}</span><div class="sp"><div class="t1">${esc(S.people[c.tid].name)}</div><div class="t2">${esc(MISK[c.k].name)} · ${fmtS(d(c.date))}</div></div></div>`).join('')||'<div class="empty-s">Nothing to validate.</div>'}</div></div>
  </section>
 </div>`;
}
function vTeam(){
 const ps = myPeople().slice().sort((a,b)=>a.name.localeCompare(b.name));
 const role = USERS[ME].role;
 const q = (UI.q||'').toLowerCase();
 const list = ps.filter(p=>!q || p.name.toLowerCase().includes(q) || p.ticket.toLowerCase().includes(q));
 const showScore = role!=='plant' || vis('plant','scores');
 return `${ph(role==='manager'?'My apprentices':'Apprentices', list.length+' apprentices'+(role==='hod'?' in '+HODS[USER().persona].divs.join(' & '):'')+'. Open anyone for the full record.', `<div class="search"><span>${ic('search',16)}</span><input id="q" type="search" placeholder="Search name or ticket" value="${esc(UI.q||'')}" aria-label="Search apprentices" style="width:260px"></div>`)}
 <div class="tw"><table class="t"><thead><tr><th>Apprentice</th><th>Department · line</th><th>Month</th><th>Latest review</th>${showScore?'<th class="r">Score</th>':''}<th>Band</th><th>Attendance</th><th>Kaizens (3 mo)</th><th>Conduct</th><th>Status</th></tr></thead><tbody>
 ${list.map(p=>{ const le = latestEval(p), a = attStats(p.id), k = kzStats(p.id), cd = conduct(p.id); return `<tr class="click" data-go="person/${p.id}"><td class="nm">${esc(p.name)}<small>${esc(p.ticket)} · ${p.type}</small></td><td>${esc(deptOf(p))}<div class="sm muted">${esc(p.line)}</div></td><td>M${mo(p)}</td><td>${le?le.f.cp+' · '+fmtS(le.f.cpDate):'<span class="muted">None yet</span>'}</td>${showScore?`<td class="r">${le?pct(le.e.overall):'—'}</td>`:''}<td>${le?bandChip(le.e.fb):bandChip()}</td><td>${pct(a.pct)}</td><td>${k.impl3}</td><td>${cdTxt(cd)}</td><td>${p.status!=='Active'?`<span class="chip">${esc(p.status)}</span>`:le?statusChip(le.e.status):'<span class="chip">New</span>'}</td></tr>`; }).join('')||'<tr><td colspan="10" class="empty">No match.</td></tr>'}
 </tbody></table></div>`;
}
function vReviews(){
 const role = USERS[ME].role, ps = myPeople();
 let fs = S.forms.filter(f=>ps.some(p=>p.id===f.tid));
 const tabs = role==='hod' ? [['sign','To sign'],['done','Signed'],['open','With managers']] : [['open','To complete'],['sent','Sent to HoD'],['done','Completed']];
 const t = UI.rtab && tabs.some(x=>x[0]===UI.rtab) ? UI.rtab : tabs[0][0];
 const F = {open:f=>f.status==='Not started'||f.status==='In progress', sent:f=>f.status==='With HoD', sign:f=>f.status==='With HoD', done:f=>f.status==='Completed'};
 const list = fs.filter(F[t]).sort((a,b)=>t==='done'?new Date(b.cpDate)-new Date(a.cpDate):new Date(a.cpDate)-new Date(b.cpDate));
 return `${ph(role==='hod'?'Reviews to sign':'Reviews', role==='hod'?'Line managers appraise; you see a summary of each apprentice with the records PRAGATI pulls in, then sign or return.':'Reviews open automatically 7 days before each checkpoint (Month 3, 6, 9, 12).')}
 <div class="viewtabs" role="group" aria-label="Filter reviews">${tabs.map(([k,l])=>`<button type="button" data-act="rtab" data-id="${k}" aria-pressed="${k===t}">${l} (${fs.filter(F[k]).length})</button>`).join('')}</div>
 <div class="tw"><table class="t"><thead><tr><th>Apprentice</th><th>Checkpoint</th><th>Date</th><th>Line manager</th><th>Progress</th><th class="r">Score</th><th>Band</th><th>Status</th></tr></thead><tbody>
 ${list.map(f=>{ const p = S.people[f.tid], n = ALL_ST.filter(k=>f.ans[k]).length, e = isDone(f) ? evaluate(p,f) : null; return `<tr class="click" data-go="review/${f.id}"><td class="nm">${esc(p.name)}<small>${esc(deptOf(p))} · ${esc(p.line)}</small></td><td><b class="ink">${f.cp}</b></td><td>${fmt(f.cpDate)}<div class="sm muted">${isDone(f)?'Submitted '+esc(f.submitted):dueTxt(f.cpDate)}</div></td><td>${esc(f.by)}</td><td style="min-width:120px">${bar(n,ALL_ST.length)}<div class="sm muted mt8">${n}/${ALL_ST.length}</div></td><td class="r">${e?pct(e.overall):'—'}</td><td>${e?bandChip(e.fb):bandChip()}</td><td>${formChip(f)}</td></tr>`; }).join('')||'<tr><td colspan="8" class="empty">Nothing here.</td></tr>'}
 </tbody></table></div>`;
}

/* ----- review form (line manager) ----- */
function likert(f, k, ro){
 const v = f.ans[k];
 return `<div class="lk ${ro?'ro':''}" role="radiogroup" aria-label="${esc(STATEMENTS[k])}">${LIKERT.map(([n,l])=>`<button type="button" ${ro?'tabindex="-1"':`data-act="lk" data-f="${f.id}" data-k="${k}" data-v="${n}"`} aria-pressed="${v===n}" role="radio" aria-checked="${v===n}"><b>${n}</b><span>${l}</span></button>`).join('')}</div>`;
}
function dataRow(r){
 if(!r.dt) return '';
 if(r.par.data==='sent') return `<div class="datarow">${srcTag('ag')}<span>Agent reads your comments below: <b>${esc(r.dt.val)}</b></span><span class="pts">${r.dpts!=null?r.dpts+' / 5':'—'}</span></div>`;
 return `<div class="datarow">${srcTag(PSRC[r.par.data])}<span>From records: <b>${esc(r.dt.val)}</b></span><span class="pts" title="${esc(DATA_RULES[r.par.data])}">${r.dt.missing?'No record':r.dpts+' / 5'}</span></div>`;
}
function vReviewForm(f){
 const p = S.people[f.tid], e = evaluate(p, f), last = lastSubmitted(p.id);
 const n = ALL_ST.filter(k=>f.ans[k]).length, miss = UI.showMiss;
 const a = attStats(p.id), k = kzStats(p.id), dv = devAsOf(p), cd = conduct(p.id);
 const firstOpen = BORDER.find(b=>PARAMS.filter(x=>x.b===b).some(x=>x.st.some(s=>!f.ans[s])));
 const accs = BORDER.map(b=>{
  const ps = PARAMS.filter(x=>x.b===b), sts = ps.flatMap(x=>x.st), done = sts.filter(s=>f.ans[s]).length;
  const key = f.id+':'+b, open = UI.open[key] ?? (b===firstOpen);
  return `<details class="acc" data-acc="${key}" ${open?'open':''}><summary><span class="pq lg">${b}</span><div><h3>${BUCKETS[b].name}</h3><div class="sub">${esc(BUCKETS[b].hint)}</div></div><span class="prog">${sts.length?`${done} of ${sts.length} answered ${done===sts.length?`<span class="chip good">${ic('check',14)} Done</span>`:''}`:'<span class="chip info">From records only</span>'}${ic('chev')}</span></summary>
  <div class="body">${ps.map(par=>{ const r = e.rows.find(x=>x.par.k===par.k); return `<div class="param"><div class="param-h"><b>${esc(par.name)}</b><span>Covers: ${esc(par.clubbed)}</span></div>
   ${par.st.map(s=>`<div class="stmt ${miss&&!f.ans[s]?'miss':''}"><p>${esc(STATEMENTS[s])}</p>${likert(f,s)}</div>`).join('')}
   ${dataRow(r)}</div>`; }).join('')}</div></details>`;
 }).join('');
 const m12 = f.cp==='M12';
 return `${crumb([['Reviews','reviews'],[p.name+' · '+f.cp,'']])}
 <div class="ph"><div class="hero">${av(p.name)}<div><h1>${esc(p.name)} · ${f.cp} review</h1><div class="meta"><span>${esc(deptOf(p))} · ${esc(p.line)}</span><span>Joined ${fmt(d(p.doj))}</span><span>Checkpoint ${fmt(f.cpDate)} (${dueTxt(f.cpDate)})</span></div><div class="idrow">${ids(p)}${formChip(f)}</div></div></div>
  <div class="row"><button class="btn" data-go="person/${p.id}" type="button">${ic('eye',16)} Full record</button></div></div>
 ${f.returned?`<div class="note warn" style="margin-bottom:16px"><b>Returned by ${esc(f.returned.by)}:</b> ${esc(f.returned.note)}</div>`:''}
 <div class="grid rvg">
  <div>
   <div class="card" style="padding:16px 22px;margin-bottom:16px"><div class="between"><div class="lkey">${LIKERT.map(([n,l])=>`<span><b>${n}</b> ${l}</span>`).join('')}</div><span class="sm muted">Rate what you have seen in the last 3 months.</span></div></div>
   ${accs}
   <section class="card mt16"><h2>Comments</h2><p class="sub">The agent reads these for the readiness parameter. Hindi or Marathi words are fine.</p>
    <div class="fgrid mt16"><div class="fld"><label for="ff-s">Strengths</label><textarea id="ff-s" data-ff="${f.id}" data-k="strengths" placeholder="What does this apprentice do well?">${esc(f.strengths)}</textarea></div>
    <div class="fld"><label for="ff-i">Areas to improve</label><textarea id="ff-i" data-ff="${f.id}" data-k="improve" placeholder="What should improve before the next checkpoint?">${esc(f.improve)}</textarea></div></div>
    <div class="fld mt16"><span class="lbl">Training needed</span><div class="colpick">${TRAINING.map(t=>`<label><input type="checkbox" data-tr="${f.id}" value="${esc(t)}" ${f.train.includes(t)?'checked':''}>${esc(t)}</label>`).join('')}</div></div>
    ${m12?`<div class="fld mt16"><span class="lbl">Your recommendation at Month 12</span><div class="seg" role="group">${['Convert','Extend 3 months','Do not convert'].map(x=>`<button type="button" data-act="mrec" data-f="${f.id}" data-id="${x}" aria-pressed="${f.mrec===x}">${x}</button>`).join('')}</div><span class="hint">The HoD sees this next to the agent’s recommendation and makes the call.</span></div>`:''}
    <label class="check mt16"><input type="checkbox" data-ffc="${f.id}" data-k="discussed" ${f.discussed?'checked':''}> I have discussed this review with the apprentice.</label>
   </section>
  </div>
  <aside class="stack rva">
   <div class="card"><h3>At a glance</h3><p class="sub">Pulled in automatically; you do not type these.</p>
    <div class="list mt8">
     <div class="li"><div class="sp"><div class="t2">Attendance</div><div class="t1">${pct(a.pct)}</div></div>${srcTag('time')}</div>
     <div class="li"><div class="sp"><div class="t2">Kaizens implemented (3 months)</div><div class="t1">${k.impl3} · ${k.rate.toFixed(1)} / month</div></div>${srcTag('kz')}</div>
     <div class="li"><div class="sp"><div class="t2">Stations certified · JH step</div><div class="t1">${dv.st??'—'} · ${dv.jh!=null?'Step '+dv.jh:'—'}</div></div>${srcTag('coord')}</div>
     <div class="li"><div class="sp"><div class="t2">Conduct</div><div class="t1">${cdTxt(cd)}</div></div>${srcTag('case')}</div>
     <div class="li"><div class="sp"><div class="t2">Previous review</div><div class="t1">${last?last.cp+' · '+pct(evaluate(p,last).overall)+' · band '+evaluate(p,last).fb:'None'}</div></div>${srcTag('app')}</div>
    </div></div>
   <div class="card"><h3>Progress</h3><div class="mt8">${bar(n,ALL_ST.length, n===ALL_ST.length?'good':'')}</div><p class="sub mt8">${n} of ${ALL_ST.length} statements rated</p></div>
  </aside>
 </div>
 <div class="formbar"><div class="formbar-in"><span class="sm muted">Saved automatically</span><span class="sp"></span><span class="err" id="ff-err"></span><button class="btn pri lg" data-act="submitform" data-id="${f.id}" type="button">Submit to HoD ${ic('arrow',16)}</button></div></div>`;
}

/* ----- candidate overview (HoD summary; read-only for others) ----- */
function vOverview(f){
 const p = S.people[f.tid], e = evaluate(p, f), role = USERS[ME].role;
 const showAgent = role==='hr' || role==='agent' || (role==='hod' && vis('hod','agent')) || (role==='plant') || (role==='manager' && vis('manager','agent'));
 const showCmt = role==='hr' || role==='manager' || (role==='hod' && vis('hod','comments')) || (role==='plant' && vis('plant','comments'));
 const showScores = role!=='plant' || vis('plant','scores');
 const showData = role!=='hod' || vis('hod','data');
 const tr = trend(p), a = attStats(p.id, e.asOf), k = kzStats(p.id, e.asOf), dv = devAsOf(p, e.asOf), cd = e.cd;
 const dec = S.decisions[p.id] || {};
 const canSign = role==='hod' && f.status==='With HoD';
 const tile = (lab, v, s, src) => `<div class="kpi"><div class="between"><span class="l">${lab}</span>${srcTag(src)}</div><div class="v" style="font-size:24px">${v}</div><div class="s">${s}</div></div>`;
 return `${crumb([[role==='hod'?'Reviews to sign':'Reviews','reviews'],[p.name+' · '+f.cp,'']])}
 <section class="card"><div class="between" style="align-items:flex-start"><div class="hero">${av(p.name)}<div><h1>${esc(p.name)}</h1><div class="meta"><span>${esc(deptOf(p))} · ${esc(p.line)}</span><span>Line manager ${esc(MANAGERS[p.mgr].name)}</span><span>Joined ${fmt(d(p.doj))} · Month ${mo(p)} of 12</span></div><div class="idrow">${ids(p)}<span class="chip">${f.cp} review · ${fmt(f.cpDate)}</span>${formChip(f)}</div></div></div>
  <div class="row" style="gap:20px">${showScores?`<div style="text-align:right"><div class="muted sm">Overall</div><div style="font-size:34px;font-weight:600;color:var(--ink);line-height:1.1">${pct(e.overall)}</div>${e.capped?`<div class="sm warn">Capped from ${e.band} by conduct</div>`:''}</div>`:''}${bandChip(e.fb,true)}</div></div>
  <div class="grid g3 mt24" style="align-items:end">
   <div><div class="section-t">Agent recommendation</div>${f.cp==='M12'?recChip(e.rec):statusChip(e.status)}${f.mrec?`<div class="sm mt8">Line manager recommends: <b class="ink">${esc(f.mrec)}</b></div>`:''}</div>
   <div><div class="section-t">Score by checkpoint</div>${showScores?`<div class="spark">${tr.map(t=>`<div class="c ${t.cp===f.cp?'cur':''}"><b>${Math.round(t.v)}%</b><i style="height:${Math.max(6,t.v*0.6)}px"></i><span>${t.cp}</span></div>`).join('')||'<span class="muted sm">First review</span>'}</div>`:'<span class="muted sm">Hidden by HR view settings</span>'}</div>
   <div class="row" style="justify-content:flex-end"><button class="btn" data-go="person/${p.id}" type="button">${ic('eye',16)} Full apprentice record</button></div>
  </div>
 </section>
 <div class="grid g21 mt24" style="align-items:start">
  <section class="card"><div class="card-h"><div><h2>PQCDSM parameters</h2><p class="sub">Each parameter blends the line manager’s average rating with what the records say (${S.cfg.blend}/${100-S.cfg.blend}). Equal weights.</p></div></div>
   <div class="pbars">${BORDER.map(b=>e.rows.filter(r=>r.par.b===b).map(r=>`<div class="pbar"><span class="pq">${b}</span><div class="n">${esc(r.par.name)}<small>${esc(BUCKETS[b].name)}</small></div><div>${showScores?bar(r.score||0,5,scoreCls(r.score)):''}<div class="ticks">${r.mgr!=null?`<span>Manager ${r.mgr.toFixed(1)}</span>`:''}${r.dt&&showData?`<span>${r.dt.missing?'No record':'Records '+r.dpts}: ${esc(r.dt.val)}</span>`:''}</div></div><div class="v">${showScores&&r.score!=null?r.score.toFixed(1):''}</div></div>`).join('')).join('')}</div>
  </section>
  <div class="stack">
   ${showAgent?`<section class="card"><div class="between"><h2>Agent summary</h2>${srcTag('ag')}</div><p class="narr mt12">${esc(e.narrative)}</p>
    ${e.flags.length?`<div class="mt16"><div class="section-t">Flags for the reviewer</div>${e.flags.map(([c,t,x])=>`<div class="flag ${c}"><span class="fi"></span><div><b>${esc(t)}</b>${esc(x)}</div></div>`).join('')}</div>`:'<div class="note good mt16">No flags.</div>'}</section>`:''}
   <section class="card"><h2>Key records</h2><div class="grid g2 mt12">
    ${tile('Attendance', pct(a.pct), a.late30+' late-in'+(a.late30===1?'':'s')+' in 30 days', 'time')}
    ${tile('Kaizens', k.impl3+' <small>in 3 mo</small>', k.verified+' verified'+(vis('plant','kaizen')||role!=='plant'?' · '+lakh(k.saving)+'/yr':''), 'kz')}
    ${tile('Skills', (dv.st??'—')+' <small>stations</small>', dv.jh!=null?'JH Step '+dv.jh:'No JH record', 'coord')}
    ${tile('Conduct', cd.wl||cd.vcur||cd.open?cd.wl+' WL':'Clean', cd.vcur+' VC/UR'+(cd.open?' · '+cd.open+' open':''), 'case')}
   </div></section>
  </div>
 </div>
 <div class="grid g2 mt24" style="align-items:start">
  <section class="card"><div class="between"><h2>Line manager’s input</h2>${srcTag('app')}</div>
   ${showCmt?`<div class="mt16"><div class="section-t">Strengths</div><div class="quote">${highlight(f.strengths||'—', e.sen.hits)}</div></div>
   <div class="mt16"><div class="section-t">Areas to improve</div><div class="quote">${highlight(f.improve||'—', e.sen.hits)}</div></div>
   <div class="row mt16"><span class="sm muted">Reads:</span><span class="chip ${e.sen.label==='Positive'?'good':e.sen.label==='Negative'?'bad':''}">${e.sen.label}</span>${f.train.length?`<span class="sm muted" style="margin-left:12px">Training:</span>${f.train.map(t=>`<span class="chip brand">${esc(t)}</span>`).join('')}`:''}</div>`:'<p class="muted mt12">Comments are hidden for your role by HR view settings.</p>'}
   <p class="sm muted mt16">${esc(f.by)} · submitted ${esc(f.submitted||'—')}${f.discussed?' · discussed with the apprentice':''}${f.signed?' · signed '+esc(f.signed):''}</p>
  </section>
  <section class="card"><h2>Statement ratings</h2><p class="sub">What the line manager selected, by bucket.</p>
   <div class="mt12">${BORDER.map(b=>PARAMS.filter(x=>x.b===b).flatMap(x=>x.st).map(s=>`<div class="between" style="padding:8px 0;border-bottom:1px solid var(--line-2);gap:16px;flex-wrap:nowrap"><span style="font-size:14px;color:var(--ink)"><span class="pq" style="width:22px;height:22px;font-size:11.5px;margin-right:8px">${b}</span>${esc(STATEMENTS[s])}</span><b class="ink" style="white-space:nowrap">${f.ans[s]||'—'} <span class="sm muted" style="font-weight:400">${f.ans[s]?LIKERT[f.ans[s]-1][1]:''}</span></b></div>`).join('')).join('')}</div>
  </section>
 </div>
 ${canSign ? `<section class="card mt24"><h2>${f.cp==='M12'?'Your decision':'Sign off'}</h2><p class="sub">${f.cp==='M12'?'Decide on conversion. A decision that differs from the agent needs a reason. Plant HR finalises and PRAGATI sends it to SAP SF/EC.':'Sign the review, or return it to the line manager with a note.'}</p>
  ${f.cp==='M12'?`<div class="fgrid mt16"><div class="fld"><label for="dh-c">Decision</label><select id="dh-c">${['Convert','Extend 3 months','Do not convert'].map(x=>`<option ${x===(e.rec==='Recommend conversion'?'Convert':e.rec==='Not recommended'?'Do not convert':f.mrec||'Extend 3 months')?'selected':''}>${x}</option>`).join('')}</select></div><div class="fld"><label for="dh-r">Reason</label><input id="dh-r" placeholder="Required if it differs from the agent"></div></div>`:`<div class="fld mt16"><label for="rt-n">Note (only if returning)</label><input id="rt-n" placeholder="What should the manager look at again?"></div>`}
  <div class="err mt8" id="dh-e"></div>
  <div class="row mt16"><button class="btn pri lg" data-act="${f.cp==='M12'?'hoddecide':'signform'}" data-id="${f.id}" type="button">${ic('check',16)} ${f.cp==='M12'?'Sign and decide':'Sign review'}</button><button class="btn lg" data-act="returnform" data-id="${f.id}" type="button">Return to line manager</button></div>
 </section>` : dec.hod && f.cp==='M12' ? `<section class="card mt24"><h2>Decision</h2>${decisionTrail(p)}</section>` : ''}`;
}
function decisionTrail(p){
 const dc = S.decisions[p.id] || {}, f = formsOf(p.id).find(x=>x.cp==='M12');
 const st = [
  ['Agent', S.assess[p.id] ? S.assess[p.id].rec : '—', S.assess[p.id] ? 'Run '+S.assess[p.id].runAt : ''],
  ['Line manager', (f&&f.mrec) || (dc.mgr&&dc.mgr.choice) || '—', f&&f.submitted ? MANAGERS[p.mgr].name+' · '+f.submitted : ''],
  ['HoD', dc.hod ? dc.hod.choice : 'Pending', dc.hod ? dc.hod.by+' · '+dc.hod.at+(dc.hod.reason?' · “'+dc.hod.reason+'”':'') : ''],
  ['Plant HR', dc.hr ? 'Finalised: '+dc.hr.choice : 'Pending', dc.hr ? dc.hr.by+' · '+dc.hr.at : ''],
  ['SAP SF/EC', dc.ec ? dc.ec.event : 'Not sent', dc.ec ? 'Sent '+dc.ec.at : '']
 ];
 return `<div class="grid g5 mt12">${st.map(([a,b,c])=>`<div class="kpi" style="padding:14px 16px"><div class="l">${a}</div><div class="ink" style="font-weight:600;margin-top:4px">${esc(b)}</div><div class="s">${esc(c)}</div></div>`).join('')}</div>`;
}
function vReview(id){
 const f = S.forms.find(x=>x.id===id); if(!f) return notFound();
 const p = S.people[f.tid]; if(!canSee(p)) return notFound();
 if(USERS[ME].role==='manager' && (f.status==='Not started'||f.status==='In progress')) return vReviewForm(f);
 if(!isDone(f)) return `${crumb([['Reviews','reviews'],[p.name,'']])}${ph(esc(p.name)+' · '+f.cp, 'This review is still with the line manager ('+esc(f.by)+'). '+ALL_ST.filter(k=>f.ans[k]).length+' of '+ALL_ST.length+' statements rated; '+dueTxt(f.cpDate)+'.', `<button class="btn" data-go="person/${p.id}" type="button">Full record</button>`)}`;
 return vOverview(f);
}

/* ----- quick rate ----- */
function vQuick(){
 const b = UI.qb || 'P';
 const fs = S.forms.filter(f=>(f.status==='Not started'||f.status==='In progress') && myPeople().some(p=>p.id===f.tid));
 const sts = PARAMS.filter(x=>x.b===b).flatMap(x=>x.st);
 return `${ph('Quick rate', 'Rate the whole team one bucket at a time. Answers go straight into each apprentice’s review; open the review to add comments and submit.')}
 <div class="viewtabs" role="group" aria-label="Bucket">${BORDER.map(x=>`<button type="button" data-act="qb" data-id="${x}" aria-pressed="${x===b}">${x} · ${BUCKETS[x].name}</button>`).join('')}</div>
 ${sts.length ? `<div class="tw"><table class="t"><thead><tr><th style="min-width:180px">Apprentice</th>${sts.map(s=>`<th style="white-space:normal;min-width:300px;font-weight:500;color:var(--ink);font-size:13px;letter-spacing:0">${esc(STATEMENTS[s])}</th>`).join('')}<th></th></tr></thead><tbody>
 ${fs.map(f=>{ const p = S.people[f.tid]; return `<tr><td class="nm">${esc(p.name)}<small>${f.cp} · ${dueTxt(f.cpDate)}</small></td>${sts.map(s=>`<td><div class="lk" style="gap:4px">${LIKERT.map(([n,l])=>`<button type="button" style="width:44px;height:40px" title="${l}" data-act="lk" data-f="${f.id}" data-k="${s}" data-v="${n}" aria-pressed="${f.ans[s]===n}"><b>${n}</b></button>`).join('')}</div></td>`).join('')}<td><button class="btn sm" data-go="review/${f.id}" type="button">Open</button></td></tr>`; }).join('')||`<tr><td colspan="${sts.length+2}" class="empty">No open reviews.</td></tr>`}
 </tbody></table></div><div class="lkey mt12">${LIKERT.map(([n,l])=>`<span><b>${n}</b> ${l}</span>`).join('')}</div>`
 : `<div class="note">The ${BUCKETS[b].name} bucket comes from records only (attendance from the time system). Nothing to rate.</div>`}`;
}

/* ======================= KAIZEN ======================= */
function kzRows(list, opts={}){
 return `<div class="tw"><table class="t"><thead><tr><th>Kaizen no.</th><th>Title</th><th>Apprentice</th><th>Cat.</th><th>Date</th>${opts.dept?'<th>Department</th>':''}<th class="r">Saving / yr</th><th>Grade</th><th>Status</th></tr></thead><tbody>
 ${list.map(k=>`<tr class="click" data-act="kzopen" data-id="${k.seq}"><td class="mono" style="white-space:nowrap">${esc(k.id)}</td><td class="nm" style="max-width:340px">${esc(k.title)}<small>${esc(k.type)} · ${esc(k.line)}</small></td><td>${esc(S.people[k.tid].name)}${k.team.length?` <span class="muted sm">+${k.team.length}</span>`:''}</td><td><span class="pq">${k.cat}</span></td><td>${fmtS(d(k.date))}</td>${opts.dept?`<td>${esc(k.dept)}</td>`:''}<td class="r">${k.saving?inr(k.verify?k.verify.saving:k.saving):'<span class="muted">Intangible</span>'}</td><td>${k.eval?`<span class="grade ${kzGrade(k.eval.pts)}">${kzGrade(k.eval.pts)}</span>`:''}</td><td>${kzChip(k)}</td></tr>`).join('')||`<tr><td colspan="9" class="empty">No kaizens.</td></tr>`}
 </tbody></table></div>`;
}
function kzKpis(list){
 const impl = list.filter(k=>['Implemented','Verified','Not sustained'].includes(k.status)).length, ver = list.filter(k=>k.status==='Verified').length, ns = list.filter(k=>k.status==='Not sustained').length;
 const sav = list.filter(k=>k.status==='Verified').reduce((s,k)=>s+k.verify.saving,0);
 return `<div class="grid g5">${kpi('Submitted', list.length)}${kpi('Implemented', impl, list.length?pct0(impl/list.length*100)+' of submitted':'')}${kpi('Verified as sustained', ver, impl?pct0(ver/Math.max(1,ver+ns)*100)+' of those checked':'')}${kpi('Horizontal deployment', list.filter(k=>k.horiz.yes).length, 'Applied to other lines')}${kpi('Verified saving', lakh(sav), 'per year')}</div>`;
}
function vKzEval(){
 const ps = myPeople(), mine = S.kaizens.filter(k=>ps.some(p=>p.id===k.tid));
 const sub = mine.filter(k=>k.status==='Submitted'), app = mine.filter(k=>k.status==='Approved'), rw = mine.filter(k=>k.status==='Rework');
 return `${ph('Kaizen evaluation', 'Apprentices submit kaizens on the line tablet. You score impact and originality, approve, then mark them implemented. The kaizen coordinator verifies after '+S.cfg.kzVerifyDays+' days that the change is still in place.')}
 <div class="grid g4">${kpi('To evaluate', sub.length)}${kpi('Approved, not yet implemented', app.length)}${kpi('Sent back for rework', rw.length)}${kpi('Your team, last 90 days', mine.filter(k=>d(k.date)>=new Date(TODAY.getTime()-91*DAY)).length, 'submitted')}</div>
 <h2 class="mt24" style="margin-bottom:12px">To evaluate</h2>${kzRows(sub)}
 <h2 class="mt24" style="margin-bottom:12px">Approved: mark implemented when done</h2>${kzRows(app)}
 <h2 class="mt24" style="margin-bottom:12px">All kaizens from your team</h2>${kzRows(mine.slice().reverse().slice(0,40))}`;
}
function kzFilters(list){
 const F = UI.kzf || (UI.kzf = {st:'',cat:'',dept:'',q:''});
 const out = list.filter(k=>(!F.st||k.status===F.st)&&(!F.cat||k.cat===F.cat)&&(!F.dept||k.dept===F.dept)&&(!F.q||(k.title+' '+k.id+' '+S.people[k.tid].name).toLowerCase().includes(F.q.toLowerCase())));
 const bar_ = `<div class="toolbar"><div class="fld search"><label for="kzq">Search</label><span style="position:absolute;left:11px;bottom:10px;color:var(--muted)">${ic('search',16)}</span><input id="kzq" data-kzf="q" value="${esc(F.q)}" placeholder="Title, number or name" style="padding-left:36px;width:260px"></div>
  <div class="fld"><label for="kzs">Status</label><select id="kzs" data-kzf="st"><option value="">All</option>${KZ_STATUS.map(s=>`<option ${F.st===s?'selected':''}>${s}</option>`).join('')}</select></div>
  <div class="fld"><label for="kzc">PQCDSM</label><select id="kzc" data-kzf="cat"><option value="">All</option>${BORDER.map(b=>`<option value="${b}" ${F.cat===b?'selected':''}>${b} · ${BUCKETS[b].name}</option>`).join('')}</select></div>
  <div class="fld"><label for="kzd">Department</label><select id="kzd" data-kzf="dept"><option value="">All</option>${DEPTS.map(x=>`<option ${F.dept===x?'selected':''}>${x}</option>`).join('')}</select></div>
  <span class="sp"></span><button class="btn" data-act="kzcsv" type="button">${ic('download',16)} Export CSV</button></div>`;
 return {out, bar:bar_};
}
function vKzReg(){
 const {out, bar:tb} = kzFilters(S.kaizens.slice().reverse());
 return `${ph('Kaizen register', 'The digital register replaces the paper kaizen sheets. One record per idea: problem and countermeasure with before / after photos, PQCDSM category, measured benefit, cost, standardisation and horizontal deployment, then a sustain check.')}
 ${kzKpis(out)}<div class="mt24">${tb}</div>${kzRows(out.slice(0,80),{dept:true})}${out.length>80?`<p class="sm muted mt12">Showing 80 of ${out.length}. Narrow the filters or export the full list.</p>`:''}`;
}
function vKzDash(){
 const L = S.kaizens, now = TODAY.getTime();
 const months = [...Array(6)].map((_,i)=>{ const m = addM(new Date(TODAY.getFullYear(), TODAY.getMonth(), 1), i-5); const k = dateKey(m).slice(0,7); return {m, k, sub:L.filter(x=>x.date.slice(0,7)===k).length, impl:L.filter(x=>x.implAt&&x.implAt.slice(0,7)===k).length}; });
 const mx = Math.max(...months.map(x=>x.sub),1);
 const by = DEPTS.map(dp=>{ const ps = Object.values(S.people).filter(p=>deptOf(p)===dp), ks = L.filter(k=>k.dept===dp && d(k.date)>=new Date(now-91*DAY)); return {dp, n:ps.length, ks, impl:ks.filter(k=>k.implAt).length, ver:L.filter(k=>k.dept===dp&&k.status==='Verified').reduce((s,k)=>s+k.verify.saving,0)}; });
 const top = L.filter(k=>k.status==='Verified').sort((a,b)=>b.verify.saving-a.verify.saving).slice(0,6);
 return `${ph('Kaizen', 'Improvement activity from the digital register across the plant.')}
 ${kzKpis(L.filter(k=>d(k.date)>=new Date(now-182*DAY)))}<p class="sm muted mt8">Last 6 months.</p>
 <div class="grid g2 mt24" style="align-items:start">
  <section class="card"><h2>Submitted and implemented by month</h2><div class="spark mt16" style="height:180px">${months.map(x=>`<div class="c"><b>${x.sub}</b><div style="display:flex;gap:4px;align-items:flex-end;width:100%;justify-content:center;height:130px"><i style="height:${x.sub/mx*120}px;max-width:22px"></i><i style="height:${x.impl/mx*120}px;max-width:22px;background:var(--brand)"></i></div><span>${fmtM(x.m).split(' ')[0]}</span></div>`).join('')}</div><div class="legend mt12"><span><i style="background:var(--brand-100)"></i>Submitted</span><span><i style="background:var(--brand)"></i>Implemented</span></div></section>
  <section class="card"><h2>By department, last 90 days</h2><div class="tw mt12"><table class="t"><thead><tr><th>Department</th><th class="r">Apprentices</th><th class="r">Submitted</th><th class="r">Implemented</th><th class="r">Per apprentice / mo</th>${vis('plant','kaizen')||USERS[ME].role!=='plant'?'<th class="r">Verified saving</th>':''}</tr></thead><tbody>${by.map(x=>`<tr><td class="nm">${esc(x.dp)}</td><td class="r">${x.n}</td><td class="r">${x.ks.length}</td><td class="r">${x.impl}</td><td class="r">${(x.impl/Math.max(1,x.n)/3).toFixed(2)}</td>${vis('plant','kaizen')||USERS[ME].role!=='plant'?`<td class="r">${lakh(x.ver)}</td>`:''}</tr>`).join('')}</tbody></table></div></section>
 </div>
 <section class="mt24"><h2 style="margin-bottom:12px">Top verified kaizens</h2>${kzRows(top,{dept:true})}</section>`;
}
function kzDrawer(seq){
 const k = S.kaizens.find(x=>x.seq===Number(seq)); if(!k) return '';
 const p = S.people[k.tid], role = USERS[ME].role;
 const canEval = role==='manager' && myPeople().some(x=>x.id===k.tid) && (k.status==='Submitted'||k.status==='Rework');
 const canImpl = role==='manager' && myPeople().some(x=>x.id===k.tid) && k.status==='Approved';
 const due = k.implAt ? new Date(d(k.implAt).getTime()+S.cfg.kzVerifyDays*DAY) : null;
 const canVer = role==='coordinator' && k.status==='Implemented';
 const E = UI.kze || {};
 const m = k.metric;
 return `<div class="scrim" data-act="close" data-self="1"><aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="kz-t">
  <div class="dh"><span class="pq lg">${k.cat}</span><div><div class="mono sm muted">${esc(k.id)}</div><h2 id="kz-t">${esc(k.title)}</h2><div class="row mt8">${kzChip(k)}<span class="chip">${esc(k.type)}</span>${k.eval?`<span class="grade ${kzGrade(k.eval.pts)}">${kzGrade(k.eval.pts)} · ${k.eval.pts} pts</span>`:''}</div></div><button class="x" data-act="close" type="button" aria-label="Close">${ic('x')}</button></div>
  <div class="db">
   <dl class="kv"><dt>Apprentice</dt><dd>${esc(p.name)} · ${esc(p.ticket)}${k.team.length?' · with '+k.team.map(t=>esc(S.people[t].name)).join(', '):''}</dd><dt>Where</dt><dd>${esc(k.dept)} · ${esc(k.line)} · ${esc(k.station)}</dd><dt>Category</dt><dd>${k.cat} · ${BUCKETS[k.cat].name}</dd><dt>Submitted</dt><dd>${fmt(d(k.date))} via ${esc(k.channel)}</dd></dl>
   <div class="ba"><div class="side"><h4>Before · problem</h4><div class="photo">${k.photos.before?'Photo attached':'No photo'}</div><p>${esc(k.before)}</p></div><div class="side after"><h4>After · countermeasure</h4><div class="photo ${k.photos.after?'':'none'}">${k.photos.after?'Photo attached':'After photo due on implementation'}</div><p>${esc(k.after)}</p></div></div>
   <div><div class="section-t">Root cause (why-why)</div><p class="ink">${esc(k.root)}</p></div>
   <div class="card" style="padding:18px"><div class="grid g3"><div><div class="section-t">${esc(m.name)}</div><div class="metric"><span class="mv">${m.before}</span><span class="arrow">→</span><span class="mv" style="color:var(--good)">${m.after}</span><span class="muted">${esc(m.unit)}</span></div></div><div><div class="section-t">Benefit</div><div class="ink" style="font-weight:600">${k.benefit==='Tangible'?inr(k.saving)+' / yr (estimated)':'Intangible'}</div>${k.verify&&k.verify.sustained&&k.saving?`<div class="sm good">Verified ${inr(k.verify.saving)} / yr</div>`:''}</div><div><div class="section-t">Cost</div><div class="ink" style="font-weight:600">${k.cost?inr(k.cost):'Nil'}</div></div></div></div>
   <dl class="kv"><dt>Standardised</dt><dd>${esc(k.std)}</dd><dt>Horizontal deployment</dt><dd>${k.horiz.yes?'Yes · '+esc(k.horiz.where||'to be listed'):'Not applicable'}</dd>${k.eval?`<dt>Evaluation</dt><dd>Impact ${k.eval.impact} × originality ${k.eval.orig} = ${k.eval.pts} points · ${esc(k.eval.by)}${k.eval.remarks?' · “'+esc(k.eval.remarks)+'”':''}</dd>`:''}${k.implAt?`<dt>Implemented</dt><dd>${fmt(d(k.implAt))}${due&&!k.verify?' · sustain check due '+fmt(due):''}</dd>`:''}${k.verify?`<dt>Sustain check</dt><dd>${k.verify.sustained?'Sustained':'Not sustained'} · ${esc(k.verify.by)} · ${esc(k.verify.at)}${k.verify.remarks?' · “'+esc(k.verify.remarks)+'”':''}</dd>`:''}</dl>
   ${canEval?`<div class="card" style="padding:18px"><h3>Evaluate</h3><p class="sub">Points = impact × originality. Bronze under 9, Silver 9–15, Gold 16+ (placeholder).</p>
    <div class="grid g2 mt12"><div class="fld"><span class="lbl">Impact</span><div class="score5">${[1,2,3,4,5].map(n=>`<button type="button" data-act="kzs" data-k="impact" data-v="${n}" aria-pressed="${E.impact===n}">${n}</button>`).join('')}</div></div><div class="fld"><span class="lbl">Originality</span><div class="score5">${[1,2,3,4,5].map(n=>`<button type="button" data-act="kzs" data-k="orig" data-v="${n}" aria-pressed="${E.orig===n}">${n}</button>`).join('')}</div></div></div>
    ${E.impact&&E.orig?`<p class="mt12">${E.impact*E.orig} points · <span class="grade ${kzGrade(E.impact*E.orig)}">${kzGrade(E.impact*E.orig)}</span></p>`:''}
    <div class="fld mt12"><label for="kz-r">Remarks</label><input id="kz-r" placeholder="Optional for approval; required for rework or rejection"></div><div class="err mt8" id="kz-e"></div>
    <div class="row mt12"><button class="btn pri" data-act="kzdecide" data-id="${k.seq}" data-v="Approved" type="button">Approve</button><button class="btn" data-act="kzdecide" data-id="${k.seq}" data-v="Rework" type="button">Send back for rework</button><button class="btn danger" data-act="kzdecide" data-id="${k.seq}" data-v="Rejected" type="button">Reject</button></div></div>`:''}
   ${canImpl?`<div class="card" style="padding:18px"><h3>Implementation</h3><p class="sub">Mark implemented once the change is in place at the station. The after photo is added from the line tablet.</p><div class="row mt12"><button class="btn pri" data-act="kzimpl" data-id="${k.seq}" type="button">${ic('check',16)} Mark implemented today</button></div></div>`:''}
   ${canVer?`<div class="card" style="padding:18px"><h3>Sustain check</h3><p class="sub">${due<=TODAY?'Due since '+fmt(due):'Due '+fmt(due)+' (early check allowed)'}. Visit the station and confirm the change is still in use.</p>
    <div class="fgrid mt12"><div class="fld"><label for="kv-s">Verified saving ₹ / yr</label><input id="kv-s" type="number" value="${k.saving}"></div><div class="fld"><label for="kv-r">Remarks</label><input id="kv-r" placeholder="What you checked"></div></div>
    <label class="check mt12"><input type="checkbox" id="kv-h" ${k.horiz.yes?'checked':''}> Horizontal deployment applies</label>
    <div class="row mt12"><button class="btn good" data-act="kzverify" data-id="${k.seq}" data-v="1" type="button">Sustained</button><button class="btn danger" data-act="kzverify" data-id="${k.seq}" data-v="0" type="button">Not sustained</button></div></div>`:''}
   <div><div class="section-t">History</div><div class="hist">${k.hist.map(h=>`<div><b>${esc(h.what)}</b><span>${esc(h.at)} · ${esc(h.by)}</span></div>`).join('')}</div></div>
  </div></aside></div>`;
}
function vKzVerify(){
 const list = S.kaizens.filter(k=>k.status==='Implemented').sort((a,b)=>a.implAt.localeCompare(b.implAt));
 const due = list.filter(k=>new Date(d(k.implAt).getTime()+S.cfg.kzVerifyDays*DAY)<=TODAY);
 return `${ph('Kaizen verification', 'A kaizen counts as sustained only after a station visit '+S.cfg.kzVerifyDays+' days after implementation. Benchmarks show this is where most kaizen schemes leak: ideas implemented but not kept.')}
 <div class="grid g4">${kpi('Due for sustain check', due.length)}${kpi('Implemented, not yet due', list.length-due.length)}${kpi('Verified this year', S.kaizens.filter(k=>k.status==='Verified').length)}${kpi('Not sustained', S.kaizens.filter(k=>k.status==='Not sustained').length)}</div>
 <h2 class="mt24" style="margin-bottom:12px">Due now</h2>${kzRows(due,{dept:true})}
 <h2 class="mt24" style="margin-bottom:12px">Coming up</h2>${kzRows(list.filter(k=>!due.includes(k)),{dept:true})}`;
}

/* ======================= CONDUCT ======================= */
function vCases(){
 const ps = myPeople(), role = USERS[ME].role;
 const cs = S.cases.filter(c=>ps.some(p=>p.id===c.tid)).sort((a,b)=>a.status-b.status || d(b.date)-d(a.date));
 const mine = c => (role==='manager'&&c.status===1)||(role==='hod'&&c.status===2)||(role==='hr'&&(c.status===3||c.status===4));
 const showDetail = role!=='plant' || vis('plant','conduct');
 return `${ph('Conduct', 'Incidents reported on the line tablet. Line manager validates → HoD decides the action (the misconduct ladder suggests it) → Plant HR issues the letter and closes. Only closed cases count in scoring.')}
 <div class="grid g4">${[1,2,3,4].map(s=>kpi(CSTATUS[s], cs.filter(c=>c.status===s).length, s===1?'Line manager to validate':s===2?'HoD to decide':s===3?'HR to issue letter':'HR to close')).join('')}</div>
 <div class="tw mt24"><table class="t"><thead><tr><th>Case</th><th>Date</th><th>Apprentice</th><th>What happened</th><th>Category</th><th>Action</th><th>Status</th></tr></thead><tbody>
 ${cs.map(c=>{ const p = S.people[c.tid]; return `<tr class="click" data-go="case/${c.id}"><td class="mono">${c.id}${mine(c)?' <span class="chip info" style="height:20px;font-size:11px">Your step</span>':''}</td><td>${fmtS(d(c.date))}</td><td class="nm">${esc(p.name)}<small>${esc(deptOf(p))}</small></td><td>${showDetail?esc(MISK[c.k].name):'<span class="muted">Hidden</span>'}</td><td>${esc(MISK[c.k].cat)}</td><td>${c.steps.action?esc(c.steps.action.label):'<span class="muted">—</span>'}</td><td>${caseChip(c)}</td></tr>`; }).join('')||'<tr><td colspan="7" class="empty">No cases.</td></tr>'}
 </tbody></table></div>`;
}
function vCase(id){
 const c = S.cases.find(x=>x.id===id); if(!c) return notFound();
 const p = S.people[c.tid]; if(!canSee(p)) return notFound();
 const role = USERS[ME].role, m = MISK[c.k], sg = suggest(c.tid, c.k);
 const step = n => `<div class="s ${c.status>=n?'done':''} ${c.status+1===n?'cur':''}">${CSTATUS[n]}</div>`;
 const can = (role==='manager'&&c.status===1&&myPeople().some(x=>x.id===c.tid)) ? 'validate' : (role==='hod'&&c.status===2) ? 'action' : (role==='hr'&&c.status===3) ? 'letter' : (role==='hr'&&c.status===4) ? 'close' : '';
 const showDetail = role!=='plant' || vis('plant','conduct');
 return `${crumb([['Conduct','cases'],[c.id,'']])}
 ${ph(esc(c.id)+' · '+(showDetail?esc(m.name):'Conduct case'), esc(p.name)+' · '+esc(deptOf(p))+' · '+fmt(d(c.date))+' '+esc(c.time), `<button class="btn" data-go="person/${p.id}" type="button">Full record</button>`)}
 <section class="card"><div class="steps">${[1,2,3,4,5].map(step).join('')}</div></section>
 <div class="grid g21 mt24" style="align-items:start">
  <section class="card"><h2>Report</h2>
   ${showDetail?`<dl class="kv mt12"><dt>What happened</dt><dd>${esc(m.name)} · ${esc(m.cat)} (misconduct no. ${esc(m.no)})</dd><dt>Place</dt><dd>${esc(c.place)}</dd><dt>Description</dt><dd>${esc(c.desc)}</dd><dt>Reported by</dt><dd>${esc(c.reporter)} via ${esc(c.channel)}</dd><dt>Evidence</dt><dd>${c.evidence.length?c.evidence.map(esc).join(', '):'None attached'}</dd></dl>`:'<p class="muted mt12">Details are hidden for your role by HR view settings.</p>'}
   <div class="hist mt24">${[['reported','Reported'],['validated','Validated'],['action','Action decided'],['letter','Letter issued'],['closed','Closed']].filter(([k])=>c.steps[k]).map(([k,l])=>{ const s = c.steps[k]; return `<div><b>${l}${s.label?': '+esc(s.label):''}</b><span>${esc(s.at)} · ${esc(s.by)}${s.remarks?' · “'+esc(s.remarks)+'”':''}${s.reason?' · “'+esc(s.reason)+'”':''}</span></div>`; }).join('')}</div>
  </section>
  <div class="stack">
   <section class="card"><h3>Misconduct ladder</h3><p class="sub">Earlier closed cases of this type: ${sg.prior}. Suggested: step ${sg.step} of ${sg.of}.</p><div class="list mt8">${m.lad.map((l,i)=>`<div class="li"><span class="pq" style="${i+1===sg.step?'':'background:var(--line-2);color:var(--muted)'}">${i+1}</span><span class="${i+1===sg.step?'ink':''}">${esc(l[0])}</span></div>`).join('')}</div></section>
   ${can==='validate'?`<section class="card"><h3>Validate</h3><p class="sub">Confirm with the line supervisor and witnesses.</p><div class="fld mt12"><label for="cv-r">Remarks</label><textarea id="cv-r" style="min-height:72px"></textarea></div><div class="err" id="cv-e"></div><div class="row mt12"><button class="btn pri" data-act="cvalid" data-id="${c.id}" type="button">Validate</button><button class="btn" data-act="cnot" data-id="${c.id}" type="button">Not substantiated</button></div></section>`:''}
   ${can==='action'?`<section class="card"><h3>Decide the action</h3><div class="fld mt12"><label for="ca-a">Action</label><select id="ca-a">${ACTIONS.map(a=>`<option ${a[1]===sg.level&&a[0].startsWith(sg.label.split(' ')[0])?'selected':''}>${a[0]}</option>`).join('')}</select></div><div class="fld mt12"><label for="ca-r">Reason (required if it differs from the ladder)</label><input id="ca-r"></div><div class="err" id="ca-e"></div><button class="btn pri mt12" data-act="caction" data-id="${c.id}" type="button">Confirm action</button></section>`:''}
   ${can==='letter'?`<section class="card"><h3>Issue the letter</h3><p class="sub">${c.steps.action.level==='none'?'No letter needed for this action.':'Generate the letter from the template and record the apprentice’s acknowledgement.'}</p><button class="btn pri mt12" data-act="cletter" data-id="${c.id}" type="button">${c.steps.action.level==='none'?'Confirm, no letter':'Letter issued and acknowledged'}</button></section>`:''}
   ${can==='close'?`<section class="card"><h3>Close the case</h3><p class="sub">Once closed, the case counts in Safety, Discipline or Quality scoring and the conduct cap.</p><button class="btn pri mt12" data-act="cclose" data-id="${c.id}" type="button">Close case</button></section>`:''}
  </div>
 </div>`;
}

/* ======================= MONTH 12 ======================= */
function vM12(){
 const role = USERS[ME].role, ps = myPeople().filter(p=>formsOf(p.id).some(f=>f.cp==='M12') || mo(p)>=11);
 const row = p => { const f = formsOf(p.id).find(x=>x.cp==='M12'), e = f&&isDone(f)?evaluate(p,f):null, dc = S.decisions[p.id]||{};
  const stage = !f ? 'Review opens '+fmtS(new Date(addM(d(p.doj),12).getTime()-7*DAY)) : !isDone(f) ? 'With line manager' : f.status==='With HoD' ? 'With HoD' : !dc.hr ? 'With Plant HR' : 'Finalised';
  return `<tr class="click" data-go="${f&&isDone(f)?'review/'+f.id:'person/'+p.id}"><td class="nm">${esc(p.name)}<small>${esc(deptOf(p))} · ${esc(p.ticket)}</small></td><td>${fmt(addM(d(p.doj),12))}</td><td class="r">${e?pct(e.overall):'—'}</td><td>${e?bandChip(e.fb):bandChip()}</td><td>${e?recChip(e.rec):'—'}</td><td>${esc((f&&f.mrec)||'—')}</td><td>${dc.hod?`<b class="ink">${esc(dc.hod.choice)}</b>`:'—'}</td><td><span class="chip ${stage==='Finalised'?'good':stage.startsWith('With')?'warn':''}">${esc(stage)}</span>${role==='hr'&&dc.hod&&!dc.hr?` <button class="btn sm pri" data-act="hrfinal" data-id="${p.id}" type="button">Finalise → SF/EC</button>`:''}</td></tr>`; };
 return `${ph(role==='manager'?'Month 12':'Conversions', 'At Month 12 the line manager recommends, the agent scores, the HoD decides and Plant HR finalises. PRAGATI then sends the job change to SAP SF/EC. Open any row for the full record behind the decision.')}
 <div class="tw"><table class="t"><thead><tr><th>Apprentice</th><th>Month 12 date</th><th class="r">Score</th><th>Band</th><th>Agent</th><th>Line manager</th><th>HoD decision</th><th>Stage</th></tr></thead><tbody>${ps.sort((a,b)=>a.doj.localeCompare(b.doj)).map(row).join('')||'<tr><td colspan="8" class="empty">Nobody at Month 12 yet.</td></tr>'}</tbody></table></div>`;
}

/* ======================= HOD / PLANT / HR HOMES ======================= */
function vHodHome(){
 const ps = myPeople(), sign = S.forms.filter(f=>f.status==='With HoD' && ps.some(p=>p.id===f.tid));
 const cs = S.cases.filter(c=>c.status===2 && ps.some(p=>p.id===c.tid));
 const ev = ps.map(latestEval).filter(Boolean), risk = ev.filter(x=>x.e.status==='At risk');
 const me = USERS[ME];
 return `${ph('Good morning, '+esc(me.name), esc(me.title)+' · '+ps.length+' apprentices across '+[...new Set(ps.map(deptOf))].length+' departments')}
 <div class="grid g4">${kpi('Reviews to sign', sign.length, 'Appraised by line managers','reviews')}${kpi('Conduct actions to decide', cs.length,'Validated by line managers','cases')}${kpi('At risk', risk.length, 'Band C, warning-level conduct or open case','team')}${kpi('Month 12 decisions', ps.filter(p=>{ const f = formsOf(p.id).find(x=>x.cp==='M12'); return f && f.status==='With HoD'; }).length, 'Waiting for you','m12')}</div>
 <div class="grid g21 mt24" style="align-items:start">
  <section class="card"><h2>Waiting for your sign-off</h2><p class="sub">Open one to see the summary: scores, records, agent flags and the manager’s comments on one page.</p>
   <div class="list mt12">${sign.map(f=>{ const p = S.people[f.tid], e = evaluate(p,f); return `<div class="li click" data-go="review/${f.id}" role="button" tabindex="0">${av(p.name)}<div class="sp"><div class="t1">${esc(p.name)} · ${f.cp}</div><div class="t2">${esc(deptOf(p))} · ${esc(f.by)} · submitted ${esc(f.submitted)}</div></div>${e.flags.filter(x=>x[0]!=='info').length?`<span class="chip warn">${e.flags.filter(x=>x[0]!=='info').length} flag(s)</span>`:''}<b class="ink" style="width:60px;text-align:right">${pct0(e.overall)}</b>${bandChip(e.fb)}</div>`; }).join('')||'<div class="empty-s">All signed.</div>'}</div></section>
  <section class="card"><h2>Band mix</h2><p class="sub">Latest review per apprentice</p>${bandMix(ev.map(x=>x.e.fb))}
   <div class="mt24"><div class="section-t">By line manager</div>${Object.entries(MANAGERS).filter(([k,m])=>HODS[me.persona].divs.includes(m.div)).map(([k,m])=>{ const l = leniency()[k], es = ev.filter(x=>x.f && S.people[x.f.tid].mgr===k); return `<div class="li"><div class="sp"><div class="t1">${esc(m.name)}</div><div class="t2">${esc(m.dept)} · ${es.length} reviewed</div></div>${l.flag?'<span class="chip warn">Lenient</span>':''}<div style="width:120px">${bandMix(es.map(x=>x.e.fb)).split('<div class="legend')[0]}</div></div>`; }).join('')}</div></section>
 </div>`;
}
function cycleStats(ps){
 const win = f => { const t = new Date(f.cpDate); return t >= new Date(TODAY.getTime()-30*DAY) && t <= new Date(TODAY.getTime()+7*DAY); };
 const fs = S.forms.filter(f=>ps.some(p=>p.id===f.tid) && win(f));
 return {due:fs.length, done:fs.filter(f=>f.status==='Completed').length, hod:fs.filter(f=>f.status==='With HoD').length, open:fs.filter(f=>!isDone(f)).length};
}
function vPlantDash(){
 const ps = Object.values(S.people), act = ps.filter(p=>p.status==='Active');
 const ev = act.map(latestEval).filter(Boolean);
 const cyc = cycleStats(act), risk = ev.filter(x=>x.e.status==='At risk');
 const k90 = S.kaizens.filter(k=>k.implAt && d(k.implAt)>=new Date(TODAY.getTime()-91*DAY));
 const sav = S.kaizens.filter(k=>k.status==='Verified').reduce((s,k)=>s+k.verify.saving,0);
 const m12 = act.filter(p=>formsOf(p.id).some(f=>f.cp==='M12') || mo(p)>=11);
 const pipe = [['Due in next 60 days', act.filter(p=>{ const t = addM(d(p.doj),12); return t>TODAY && t<=new Date(TODAY.getTime()+60*DAY); }).length],['With line manager', m12.filter(p=>{ const f = formsOf(p.id).find(x=>x.cp==='M12'); return f && !isDone(f); }).length],['With HoD', m12.filter(p=>{ const f = formsOf(p.id).find(x=>x.cp==='M12'); return f && f.status==='With HoD'; }).length],['With Plant HR', m12.filter(p=>S.decisions[p.id]&&S.decisions[p.id].hod&&!S.decisions[p.id].hr).length],['Finalised', ps.filter(p=>S.decisions[p.id]&&S.decisions[p.id].hr).length]];
 const showScores = USERS[ME].role!=='plant' || vis('plant','scores');
 return `${ph('Plant overview', `${PLANT} · all apprentices · ${fmt(TODAY)}`)}
 <div class="grid g5">${kpi('Active apprentices', act.length, act.filter(p=>p.type==='TTA').length+' TTA · '+act.filter(p=>p.type==='WILP').length+' WILP','team')}${kpi('Review cycle', pct0(cyc.due?cyc.done/cyc.due*100:100)+'<small>signed</small>', cyc.due+' due in this window · '+cyc.hod+' with HoD · '+cyc.open+' with managers')}${kpi('At risk', risk.length, 'Band C, warning-level conduct or open case')}${kpi('Kaizens implemented', k90.length+'<small>90 days</small>', vis('plant','kaizen')||USERS[ME].role!=='plant'?lakh(sav)+' verified saving / yr':'', 'kzdash')}${kpi('Open conduct cases', S.cases.filter(c=>c.status<5).length, '', USERS[ME].role==='hr'?'cases':'')}</div>
 <section class="card mt24"><div class="card-h"><div><h2>By department</h2><p class="sub">Latest review per apprentice.</p></div></div>
  <div class="tw"><table class="t"><thead><tr><th>Department</th><th>HoD</th><th class="r">Apprentices</th><th>Review cycle</th>${showScores?'<th class="r">Avg score</th>':''}<th style="min-width:200px">Band mix</th><th class="r">At risk</th><th class="r">Attendance</th><th class="r">Kaizens / person (90 d)</th></tr></thead><tbody>
  ${DEPTS.map(dp=>{ const dps = act.filter(p=>deptOf(p)===dp), de = dps.map(latestEval).filter(Boolean), c = cycleStats(dps), mk = Object.values(MANAGERS).find(m=>m.dept===dp); const att = dps.reduce((s,p)=>s+attStats(p.id).pct,0)/Math.max(1,dps.length); return `<tr><td class="nm">${esc(dp)}<small>${esc(mk.name)}</small></td><td>${esc(HODS[mk.hod].name)}</td><td class="r">${dps.length}</td><td>${c.done}/${c.due} signed</td>${showScores?`<td class="r">${de.length?pct(de.reduce((s,x)=>s+x.e.overall,0)/de.length):'—'}</td>`:''}<td>${bandMix(de.map(x=>x.e.fb)).split('<div class="legend')[0]}</td><td class="r ${de.filter(x=>x.e.status==='At risk').length?'bad':''}">${de.filter(x=>x.e.status==='At risk').length}</td><td class="r">${pct(att)}</td><td class="r">${(dps.reduce((s,p)=>s+kzStats(p.id).impl3,0)/Math.max(1,dps.length)).toFixed(1)}</td></tr>`; }).join('')}
  </tbody></table></div></section>
 <div class="grid g2 mt24" style="align-items:start">
  <section class="card"><h2>Conversion pipeline</h2><p class="sub">Month 12 apprentices, line manager → HoD → Plant HR → SAP SF/EC.</p>
   <div class="grid g5 mt16">${pipe.map(([l,n],i)=>`<div class="kpi" style="padding:14px;${i===4?'border-top:3px solid var(--good)':''}"><div class="l" style="font-size:12.5px">${l}</div><div class="v" style="font-size:24px">${n}</div></div>`).join('')}</div>
   <button class="btn ghost sm mt12" data-go="m12" type="button">Open conversions →</button></section>
  <section class="card"><h2>Needs attention</h2><div class="list mt8">${risk.slice(0,7).map(({f,e})=>{ const p = S.people[f.tid]; return `<div class="li click" data-go="person/${p.id}" role="button" tabindex="0">${av(p.name)}<div class="sp"><div class="t1">${esc(p.name)}</div><div class="t2">${esc(deptOf(p))} · ${f.cp} · ${esc(e.reasons[1]||'')}</div></div>${bandChip(e.fb)}</div>`; }).join('')||'<div class="empty-s">Nobody at risk.</div>'}</div></section>
 </div>`;
}
function vHrHome(){
 const ps = Object.values(S.people);
 const hrCases = S.cases.filter(c=>c.status===3||c.status===4);
 const fin = ps.filter(p=>S.decisions[p.id]&&S.decisions[p.id].hod&&!S.decisions[p.id].hr);
 const od = S.forms.filter(f=>!isDone(f) && new Date(f.cpDate)<TODAY);
 const warnS = Object.entries(S.sources).filter(([k,v])=>v.status==='warn');
 return `${ph('Plant HR', 'Everything about apprentices at '+PLANT+' in one place.')}
 <div class="grid g4">${kpi('Letters to issue / cases to close', hrCases.length, '', 'cases')}${kpi('Decisions to finalise', fin.length, 'HoD decided; send to SAP SF/EC', 'm12')}${kpi('Overdue reviews', od.length, 'Past the checkpoint date', 'master')}${kpi('Data feeds needing attention', warnS.length, warnS.map(([k])=>SOURCES.find(s=>s.k===k).short).join(', ')||'All feeds on time', 'sources')}</div>
 <div class="grid g2 mt24" style="align-items:start">
  <section class="card"><h2>Overdue reviews</h2><div class="list mt8">${od.slice(0,8).map(f=>{ const p = S.people[f.tid]; return `<div class="li click" data-go="review/${f.id}" role="button" tabindex="0">${av(p.name)}<div class="sp"><div class="t1">${esc(p.name)} · ${f.cp}</div><div class="t2">${esc(f.by)} · ${dueTxt(f.cpDate)}</div></div>${formChip(f)}</div>`; }).join('')||'<div class="empty-s">None overdue.</div>'}</div></section>
  <section class="card"><h2>Recent data movements</h2>${logTable(7)}<button class="btn ghost sm mt12" data-go="log" type="button">Audit log →</button></section>
 </div>`;
}

/* ======================= APPRENTICE 360 ======================= */
function vPerson(id, tab){
 const p = S.people[id]; if(!p || !canSee(p)) return notFound();
 tab = tab || 'overview';
 const T = [['overview','Overview'],['reviews','Reviews'],['attendance','Attendance'],['kaizens','Kaizens'],['skills','Skills & TPM'],['conduct','Conduct'],['timeline','Timeline']];
 const le = latestEval(p), role = USERS[ME].role, showScores = role!=='plant' || vis('plant','scores');
 const body = ({overview:pOverview, reviews:pReviews, attendance:pAtt, kaizens:pKz, skills:pSkills, conduct:pConduct, timeline:pTimeline})[tab](p, le);
 return `${crumb([[role==='manager'?'My apprentices':'Apprentices', role==='hr'?'master':'team'],[p.name,'']])}
 <section class="card"><div class="between" style="align-items:flex-start"><div class="hero">${av(p.name)}<div><h1>${esc(p.name)}</h1><div class="meta"><span>${esc(deptOf(p))} · ${esc(p.line)}</span><span>Line manager ${esc(MANAGERS[p.mgr].name)} · HoD ${esc(HODS[hodOf(p)].name)}</span><span>Joined ${fmt(d(p.doj))} · Month ${mo(p)} of 12</span></div><div class="idrow">${ids(p)}<span class="chip">${esc(p.course)}</span>${p.status!=='Active'?`<span class="chip bad">${esc(p.status)}</span>`:le?statusChip(le.e.status):''}</div></div></div>
  <div class="row" style="gap:20px">${le&&showScores?`<div style="text-align:right"><div class="muted sm">Latest · ${le.f.cp}</div><div style="font-size:30px;font-weight:600;color:var(--ink);line-height:1.1">${pct(le.e.overall)}</div></div>`:''}${le?bandChip(le.e.fb,true):''}</div></div>
  <p class="sm muted mt16">${srcTag('sf')} Master data synced from SAP SF/EC ${esc(S.sources.sf.last)} · PRAGATI is the record for reviews, kaizens and conduct.</p>
 </section>
 <nav class="itabs" aria-label="Record sections">${T.map(([k,l])=>`<a href="#/person/${p.id}/${k}" ${k===tab?'aria-current="page"':''}>${l}</a>`).join('')}</nav>
 ${body}`;
}
function pOverview(p, le){
 const a = attStats(p.id), k = kzStats(p.id), dv = devAsOf(p), cd = conduct(p.id), tr = trend(p), nx = nextCp(p), role = USERS[ME].role;
 const showScores = role!=='plant' || vis('plant','scores');
 const tile = (lab, v, s, src, tab) => `<button class="kpi" type="button" data-go="person/${p.id}/${tab}"><div class="between"><span class="l">${lab}</span>${srcTag(src)}</div><div class="v" style="font-size:26px">${v}</div><div class="s">${s}</div></button>`;
 return `<div class="grid g5">${tile('Attendance', pct(a.pct), a.pres+' of '+a.sched+' days · '+a.late30+' late (30 d)','time','attendance')}${tile('Kaizens', k.implAll+' <small>implemented</small>', k.impl3+' in 3 months · '+k.verified+' verified','kz','kaizens')}${tile('Stations certified', dv.st??'—', 'Skill matrix · '+(dv.month||''),'coord','skills')}${tile('JH step', dv.jh!=null?'Step '+dv.jh:'—', 'TPM register','coord','skills')}${tile('Conduct', cd.wl||cd.vcur||cd.open?cd.wl+' WL · '+cd.vcur+' VC/UR':'Clean', cd.open?cd.open+' open case(s)':'Closed cases only','case','conduct')}</div>
 <div class="grid g21 mt24" style="align-items:start">
  <section class="card"><div class="card-h"><div><h2>PQCDSM at the latest review</h2><p class="sub">${le?le.f.cp+' · '+fmt(le.f.cpDate)+' · '+esc(le.f.by):'No review submitted yet'}</p></div>${le?`<button class="btn sm" data-go="review/${le.f.id}" type="button">Open review</button>`:''}</div>
   ${le?`<div class="pbars">${BORDER.map(b=>{ const x = le.e.bk.find(y=>y.b===b); return `<div class="pbar"><span class="pq">${b}</span><div class="n">${BUCKETS[b].name}<small>${PARAMS.filter(q=>q.b===b).map(q=>q.name).join(' · ')}</small></div><div>${showScores?bar(x.v||0,5,scoreCls(x.v)):''}</div><div class="v">${showScores&&x.v!=null?x.v.toFixed(1):''}</div></div>`; }).join('')}</div>`:'<div class="empty-s">The first review opens 7 days before Month 3.</div>'}
  </section>
  <div class="stack">
   <section class="card"><h2>Progress</h2>${showScores&&tr.length?`<div class="spark mt16">${tr.map((t,i)=>`<div class="c ${i===tr.length-1?'cur':''}"><b>${Math.round(t.v)}%</b><i style="height:${Math.max(6,t.v*.6)}px"></i><span>${t.cp}</span></div>`).join('')}</div>`:'<p class="muted mt8">No scores to show.</p>'}<p class="sm muted mt12">${nx?'Next: '+nx.cp+' on '+fmt(nx.date):'All four checkpoints done.'}</p></section>
   ${le&&(role!=='hod'||vis('hod','agent'))&&(role!=='manager'||vis('manager','agent'))?`<section class="card"><div class="between"><h2>Agent summary</h2>${srcTag('ag')}</div><p class="narr mt12">${esc(le.e.narrative)}</p></section>`:''}
  </div>
 </div>`;
}
function pReviews(p){
 const fs = formsOf(p.id);
 return `<div class="tw"><table class="t"><thead><tr><th>Checkpoint</th><th>Date</th><th>Line manager</th><th>Status</th>${BORDER.map(b=>`<th class="r">${b}</th>`).join('')}<th class="r">Overall</th><th>Band</th></tr></thead><tbody>
 ${fs.map(f=>{ const e = isDone(f)?evaluate(p,f):null; return `<tr class="click" data-go="review/${f.id}"><td><b class="ink">${f.cp}</b></td><td>${fmt(f.cpDate)}</td><td>${esc(f.by)}</td><td>${formChip(f)}</td>${BORDER.map(b=>{ const x = e&&e.bk.find(y=>y.b===b); return `<td class="r">${x&&x.v!=null?x.v.toFixed(1):'—'}</td>`; }).join('')}<td class="r">${e?pct(e.overall):'—'}</td><td>${e?bandChip(e.fb):bandChip()}</td></tr>`; }).join('')||'<tr><td colspan="12" class="empty">No reviews yet.</td></tr>'}
 </tbody></table></div><p class="sm muted mt12">Bucket scores out of 5. Reviews open 7 days before Month 3, 6, 9 and 12.</p>`;
}
function pAtt(p){
 const a = attStats(p.id), last = a.days.slice(-91);
 const months = {}; a.days.forEach(x=>{ if(x.s==='W') return; const k = x.d.slice(0,7); (months[k] ||= {n:0,p:0,l:0}); months[k].n++; if(x.s!=='A') months[k].p++; if(x.s==='L') months[k].l++; });
 return `<div class="grid g4">${kpi('Present', pct(a.pct), a.pres+' of '+a.sched+' working days')}${kpi('Late-ins, last 30 days', a.late30)}${kpi('Absent, last 30 days', a.abs30)}${kpi('Current absence streak', a.cont+' <small>days</small>', a.cont>=4?'<span class="bad">Day 4 action due</span>':'')}</div>
 <section class="card mt24"><div class="between"><h2>Last 13 weeks</h2>${srcTag('time')}</div><p class="sub">Daily status from gate punches. Synced to ${esc(a.syncedTo)}.</p><div class="att-grid mt16">${last.map(x=>`<i class="${x.s}" title="${x.d}: ${({P:'Present',L:'Late '+x.in,A:'Absent',W:'Weekly off'})[x.s]}"></i>`).join('')}</div>
  <div class="legend mt12"><span><i style="background:#C9E7D7"></i>Present</span><span><i style="background:#F1D08E"></i>Late</span><span><i style="background:#E8A19D"></i>Absent</span><span><i style="background:var(--line-2)"></i>Weekly off</span></div></section>
 <section class="card mt24"><h2>By month</h2><div class="tw mt12"><table class="t"><thead><tr><th>Month</th><th class="r">Working days</th><th class="r">Present</th><th class="r">Late</th><th class="r">%</th></tr></thead><tbody>${Object.entries(months).reverse().map(([k,v])=>`<tr><td>${fmtM(d(k+'-01'))}</td><td class="r">${v.n}</td><td class="r">${v.p}</td><td class="r">${v.l}</td><td class="r">${pct(v.p/v.n*100)}</td></tr>`).join('')}</tbody></table></div></section>`;
}
function pKz(p){
 const L = kzOf(p.id).slice().reverse(), k = kzStats(p.id);
 return `<div class="grid g4">${kpi('Submitted', L.length)}${kpi('Implemented, last 3 months', k.impl3, k.rate.toFixed(1)+' per month (scores M1)')}${kpi('Verified as sustained', k.verified)}${kpi('Verified saving', lakh(k.saving), 'per year')}</div><div class="mt24">${kzRows(L)}</div>`;
}
function pSkills(p){
 const v = S.dev[p.id]||{}, dv = devAsOf(p);
 return `<div class="grid g3">${kpi('Stations certified', dv.st??'—', 'Skill matrix')}${kpi('Jishu Hozen step', dv.jh!=null?'Step '+dv.jh:'—', 'TPM register')}${kpi('Task-time reduction', dv.ie!=null?dv.ie+'%':'—', 'IE time study')}</div>
 <section class="card mt24"><div class="between"><h2>Source</h2>${srcTag('coord')}</div><p class="sub mt8">Uploaded by the TPM, IE and training coordinators every month (${esc(v.month||'—')}, ${esc(v.by||'')}). A blank in the upload stays blank, and the review then relies on the manager’s rating for that parameter.</p>
 <dl class="kv mt16"><dt>Course</dt><dd>${esc(p.course)}</dd><dt>Line</dt><dd>${esc(p.line)}</dd><dt>Training needs raised</dt><dd>${[...new Set(formsOf(p.id).flatMap(f=>f.train))].map(t=>`<span class="chip brand" style="margin-right:6px">${esc(t)}</span>`).join('')||'None'}</dd></dl></section>`;
}
function pConduct(p){
 const cs = S.cases.filter(c=>c.tid===p.id).sort((a,b)=>d(b.date)-d(a.date)), cd = conduct(p.id);
 const showDetail = USERS[ME].role!=='plant' || vis('plant','conduct');
 return `<div class="grid g4">${kpi('Warning-level actions', cd.wl, 'Warning letter, show cause, suspension')}${kpi('VC / UR', cd.vcur, cd.vcur>=S.cfg.vcurAsWL?'Counts as a warning':'Minor')}${kpi('Open cases', cd.open, 'Not counted until closed')}${kpi('Conduct cap', cd.end?'Training ended':cd.eff>=S.cfg.wlNotRec?'Not recommended':cd.eff?'Max band B':'None')}</div>
 <div class="tw mt24"><table class="t"><thead><tr><th>Case</th><th>Date</th><th>What happened</th><th>Action</th><th>Status</th></tr></thead><tbody>${cs.map(c=>`<tr class="click" data-go="case/${c.id}"><td class="mono">${c.id}</td><td>${fmt(d(c.date))}</td><td>${showDetail?esc(MISK[c.k].name):esc(MISK[c.k].cat)}</td><td>${c.steps.action?esc(c.steps.action.label):'—'}</td><td>${caseChip(c)}</td></tr>`).join('')||'<tr><td colspan="5" class="empty">No cases on record.</td></tr>'}</tbody></table></div>`;
}
function pTimeline(p){
 const ev = [];
 ev.push({t:d(p.doj), w:'Joined '+PLANT+' as '+p.type+' apprentice ('+p.course+')', s:'sf'});
 formsOf(p.id).forEach(f=>{ if(f.submitted && isDone(f)) ev.push({t:new Date(f.cpDate), w:f.cp+' review submitted by '+f.by+(f.status==='Completed'?'; signed '+f.signed:'; with HoD'), s:'app'}); });
 kzOf(p.id).forEach(k=>{ ev.push({t:d(k.date), w:'Kaizen submitted: '+k.title, s:'kz'}); if(k.verify) ev.push({t:new Date(d(k.implAt).getTime()+30*DAY), w:'Kaizen '+(k.verify.sustained?'verified as sustained':'not sustained')+': '+k.title, s:'kz'}); });
 S.cases.filter(c=>c.tid===p.id).forEach(c=>ev.push({t:d(c.date), w:'Conduct case '+c.id+' reported'+(c.steps.action?' → '+c.steps.action.label:''), s:'case'}));
 const dc = S.decisions[p.id]; if(dc&&dc.hod) ev.push({t:TODAY, w:'HoD decision: '+dc.hod.choice, s:'app'}); if(dc&&dc.ec) ev.push({t:TODAY, w:'Sent to SAP SF/EC: '+dc.ec.event, s:'sf'});
 ev.sort((a,b)=>b.t-a.t);
 return `<section class="card"><div class="hist">${ev.slice(0,60).map(x=>`<div><b>${esc(x.w)}</b><span>${fmt(x.t)} · ${SRC[x.s][1]}</span></div>`).join('')}</div></section>`;
}

/* ======================= HR MASTER (configurable views) ======================= */
const COLS = {
 ticket:['Ticket', p=>esc(p.ticket), p=>p.ticket], tl:['TeamLease code', p=>esc(p.tl||'—'), p=>p.tl], name:['Name', p=>`<span class="nm">${esc(p.name)}</span>`, p=>p.name], type:['Type', p=>p.type, p=>p.type],
 dept:['Department', p=>esc(deptOf(p)), p=>deptOf(p)], mgr:['Line manager', p=>esc(MANAGERS[p.mgr].name), p=>MANAGERS[p.mgr].name], line:['Line', p=>esc(p.line), p=>p.line], doj:['Joined', p=>fmt(d(p.doj)), p=>p.doj],
 month:['Month', p=>'M'+mo(p), p=>mo(p)], band:['Band', p=>{ const l = latestEval(p); return l?bandChip(l.e.fb):bandChip(); }, p=>{ const l = latestEval(p); return l?l.e.fb:''; }],
 overall:['Score', p=>{ const l = latestEval(p); return l?pct(l.e.overall):'—'; }, p=>{ const l = latestEval(p); return l?l.e.overall:-1; }],
 att:['Attendance', p=>pct(attStats(p.id).pct), p=>attStats(p.id).pct], kz3:['Kaizens 3 mo', p=>kzStats(p.id).impl3, p=>kzStats(p.id).impl3], skills:['Stations', p=>S.dev[p.id].st??'—', p=>S.dev[p.id].st??-1],
 jh:['JH step', p=>S.dev[p.id].jh??'—', p=>S.dev[p.id].jh??-1], conduct:['Conduct', p=>cdTxt(conduct(p.id)), p=>conduct(p.id).eff],
 next:['Next review', p=>{ const n = nextCp(p); return n?n.cp+' · '+fmtS(n.date):'Done'; }, p=>{ const n = nextCp(p); return n?n.date.getTime():9e15; }],
 rec:['Agent', p=>{ const l = latestEval(p); return l&&l.f.cp==='M12'?recChip(l.e.rec):'—'; }, p=>{ const l = latestEval(p); return l?l.e.rec:''; }],
 decision:['Decision', p=>{ const dc = S.decisions[p.id]; return dc&&dc.hr?'<span class="chip good">'+esc(dc.hr.choice)+'</span>':dc&&dc.hod?esc(dc.hod.choice)+' (HoD)':'—'; }, p=>{ const dc = S.decisions[p.id]; return dc&&dc.hod?dc.hod.choice:''; }],
 status:['Status', p=>{ const l = latestEval(p); return p.status!=='Active'?esc(p.status):l?statusChip(l.e.status):'New'; }, p=>p.status],
 flags:['Flags', p=>{ const l = latestEval(p); const n = l?l.e.flags.filter(x=>x[0]!=='info').length:0; return n?`<span class="chip warn">${n}</span>`:''; }, p=>{ const l = latestEval(p); return l?l.e.flags.length:0; }]
};
function vMaster(){
 const V = S.views.find(v=>v.id===UI.vid) || S.views[0]; UI.vid = V.id;
 const F = Object.assign({}, V.f, UI.mf||{});
 let ps = Object.values(S.people).filter(p=>{
  const l = latestEval(p);
  if(F.type && p.type!==F.type) return false;
  if(F.dept && deptOf(p)!==F.dept) return false;
  if(F.band && (!l || l.e.fb!==F.band)) return false;
  if(F.m12 && !(formsOf(p.id).some(f=>f.cp==='M12') || mo(p)>=11)) return false;
  if(F.risk && !(l && l.e.status==='At risk')) return false;
  if(UI.q && !(p.name+' '+p.ticket+' '+p.tl).toLowerCase().includes(UI.q.toLowerCase())) return false;
  return true;
 });
 const sk = COLS[V.sort] ? COLS[V.sort][2] : COLS.name[2];
 ps.sort((a,b)=>{ const x = sk(a), y = sk(b); return typeof x==='number' ? (V.sort==='overall'?y-x:x-y) : String(x).localeCompare(String(y)); });
 let rows = '';
 const tr = p => `<tr class="click" data-go="person/${p.id}">${V.cols.map(c=>`<td>${COLS[c][1](p)}</td>`).join('')}</tr>`;
 if(V.group){ const g = {name:p=>p.name, dept:deptOf, mgr:p=>MANAGERS[p.mgr].name, type:p=>p.type, band:p=>{ const l = latestEval(p); return l?'Band '+l.e.fb:'No review'; }}[V.group]; const groups = {}; ps.forEach(p=>(groups[g(p)] ||= []).push(p)); rows = Object.keys(groups).sort().map(k=>`<tr class="grp"><td colspan="${V.cols.length}">${esc(k)} · ${groups[k].length}</td></tr>`+groups[k].map(tr).join('')).join(''); }
 else rows = ps.map(tr).join('');
 return `${ph('Apprentice master', 'Every apprentice, with data from all sources on one row. Choose a view, filter, pick columns and group; save it as your own view.', `<button class="btn" data-act="mastercsv" type="button">${ic('download',16)} Export CSV</button>`)}
 <div class="viewtabs" role="group" aria-label="Saved views">${S.views.map(v=>`<button type="button" data-act="vsel" data-id="${v.id}" aria-pressed="${v.id===V.id}">${esc(v.name)}</button>`).join('')}</div>
 <section class="card" style="padding:18px 20px;margin-bottom:16px">
  <div class="toolbar" style="margin-bottom:0"><div class="fld"><label for="q">Search</label><input id="q" type="search" value="${esc(UI.q||'')}" placeholder="Name, ticket or TeamLease code" style="width:240px"></div>
   <div class="fld"><label for="mf-dept">Department</label><select id="mf-dept" data-mf="dept"><option value="">All</option>${DEPTS.map(x=>`<option ${F.dept===x?'selected':''}>${x}</option>`).join('')}</select></div>
   <div class="fld"><label for="mf-type">Type</label><select id="mf-type" data-mf="type"><option value="">All</option>${['TTA','WILP'].map(x=>`<option ${F.type===x?'selected':''}>${x}</option>`).join('')}</select></div>
   <div class="fld"><label for="mf-band">Band</label><select id="mf-band" data-mf="band"><option value="">All</option>${['A','B','C'].map(x=>`<option ${F.band===x?'selected':''}>${x}</option>`).join('')}</select></div>
   <div class="fld"><label for="v-group">Group by</label><select id="v-group" data-vset="group"><option value="">None</option>${[['dept','Department'],['mgr','Line manager'],['type','Type'],['band','Band']].map(([k,l])=>`<option value="${k}" ${V.group===k?'selected':''}>${l}</option>`).join('')}</select></div>
   <div class="fld"><label for="v-sort">Sort by</label><select id="v-sort" data-vset="sort">${Object.entries(COLS).map(([k,c])=>`<option value="${k}" ${V.sort===k?'selected':''}>${c[0]}</option>`).join('')}</select></div>
   <span class="sp"></span><button class="btn" data-act="colsbtn" type="button" aria-expanded="${!!UI.cols}">${ic('cog',16)} Columns</button></div>
  ${UI.cols?`<div class="mt16"><div class="colpick">${Object.entries(COLS).map(([k,c])=>`<label><input type="checkbox" data-col="${k}" ${V.cols.includes(k)?'checked':''}>${c[0]}</label>`).join('')}</div>
   <div class="row mt16"><input id="v-name" placeholder="Name for a new view" style="width:260px;height:38px"><button class="btn sm pri" data-act="vsave" type="button">Save as new view</button>${!V.sys?`<button class="btn sm danger" data-act="vdel" type="button">Delete “${esc(V.name)}”</button>`:''}<span class="sm muted">Changes to columns, grouping and sort are kept on the current view.</span></div></div>`:''}
 </section>
 <div class="tw"><table class="t"><thead><tr>${V.cols.map(c=>`<th>${COLS[c][0]}</th>`).join('')}</tr></thead><tbody>${rows||`<tr><td colspan="${V.cols.length}" class="empty">No apprentices match.</td></tr>`}</tbody></table></div>
 <p class="sm muted mt12">${ps.length} apprentices</p>`;
}
function vAccess(){
 const R = [['hod','Head of Department',[['agent','Agent summary and flags'],['comments','Line manager’s comments'],['data','Record values next to each parameter']]],['plant','Plant head',[['scores','Individual scores (otherwise bands only)'],['comments','Line manager’s comments'],['conduct','Conduct case details (otherwise counts only)'],['kaizen','Kaizen savings in rupees']]],['manager','Line manager',[['agent','Agent summary for own team after submitting']]]];
 return `${ph('Role views', 'Plant HR decides what each role sees. Changes apply immediately in every portal.')}
 <div class="grid g3">${R.map(([r,l,items])=>`<section class="card"><h2>${l}</h2><div class="list mt12">${items.map(([k,t])=>`<label class="check li"><input type="checkbox" data-vis="${r}.${k}" ${vis(r,k)?'checked':''}><span>${esc(t)}</span></label>`).join('')}</div></section>`).join('')}</div>
 <div class="note mt24">Line managers always see their own team only. HoDs see their divisions. Plant head and HR see the whole plant. The apprentice master views on the HR home are saved per plant.</div>`;
}
function vRules(){
 const ro = USERS[ME].role!=='hr', C = S.cfg, wsum = PARAMS.reduce((s,p)=>s+(Number(C.w[p.k])||0),0)||1;
 const num = (k, v, step=1, w=110) => `<input type="number" step="${step}" style="width:${w}px;height:36px;text-align:right" data-cfg="${k}" value="${v}" ${ro?'disabled':''} aria-label="${k}">`;
 return `${ph('Scoring rules', RULES_VER+'. Weights start equal and can be changed while the plant agrees them.', ro?'':`<button class="btn" data-act="cfgreset" type="button">Reset to equal weights</button>`)}
 <div class="grid g21" style="align-items:start">
  <section class="card"><h2>Parameters and weights</h2><p class="sub">11 parameters, clubbed from the 19 on the old appraisal form into Bajaj’s PQCDSM buckets.</p>
   <div class="mt12">${PARAMS.map(p=>`<div class="wt"><span class="pq">${p.b}</span><div><div class="ink" style="font-weight:500">${esc(p.name)}</div><div class="sm muted">${p.st.length?p.st.length+' statement'+(p.st.length>1?'s':''):'Records only'}${p.data?' + '+esc(p.src):''} · clubs: ${esc(p.clubbed)}</div></div>${num('w.'+p.k, C.w[p.k])}<span class="share">${pct((Number(C.w[p.k])||0)/wsum*100)}</span></div>`).join('')}</div></section>
  <div class="stack">
   <section class="card"><h2>Blend</h2><p class="sub">Share of the manager’s rating where a parameter also has records.</p><div class="row mt12">${num('blend', C.blend, 5, 90)}<span>% manager · ${100-C.blend}% records</span></div></section>
   <section class="card"><h2>Bands</h2><p class="sub">Overall = weighted average ÷ 5. Cut-offs keep the old form’s ratios (65/85 and 40/85).</p><div class="list mt8"><div class="li"><span class="sp">Band A from</span>${num('bandA',C.bandA,.1,90)}<span>%</span></div><div class="li"><span class="sp">Band B from</span>${num('bandB',C.bandB,.1,90)}<span>%</span></div></div></section>
   <section class="card"><h2>Conduct cap</h2><div class="list mt8"><div class="li"><span class="sp">VC/URs that count as one warning</span>${num('vcurAsWL',C.vcurAsWL,1,80)}</div><div class="li"><span class="sp">Warnings that make it “not recommended”</span>${num('wlNotRec',C.wlNotRec,1,80)}</div></div><p class="sm muted mt8">One warning caps the band at B. Termination ends training.</p></section>
   <section class="card"><h2>Other</h2><div class="list mt8"><div class="li"><span class="sp">Leniency flag above % band A</span>${num('leniency',C.leniency,1,80)}</div><div class="li"><span class="sp">Open reviews days before checkpoint</span>${num('launchBefore',C.launchBefore,1,80)}</div><div class="li"><span class="sp">Kaizen sustain check after days</span>${num('kzVerifyDays',C.kzVerifyDays,1,80)}</div></div></section>
  </div>
 </div>
 <section class="card mt24"><h2>How records turn into a 1–5 score</h2><div class="tw mt12"><table class="t"><thead><tr><th>Parameter</th><th>Source</th><th>Rule (placeholder)</th></tr></thead><tbody>${PARAMS.filter(p=>p.data).map(p=>`<tr><td class="nm">${p.b} · ${esc(p.name)}</td><td>${srcTag(PSRC[p.data])}</td><td>${esc(DATA_RULES[p.data])}</td></tr>`).join('')}</tbody></table></div></section>`;
}

/* ======================= DATA SOURCES ======================= */
const SOURCES = [
 {k:'sf',short:'SF/EC master',name:'SAP SuccessFactors Employee Central',dir:'in',what:'Employee master: ticket no., name, date of joining, department, line, reporting manager, HoD, employee class, status, exits.',how:'OData v2 API pull (EmpJob, EmpEmployment, PerPersonal, User) through SAP Integration Suite. Delta by lastModifiedDateTime.',when:'Daily 05:30 and on demand',run:'sfsync',
  map:[['User.userId','Ticket no.','Primary key for every record'],['PerPersonal.firstName + lastName','Name',''],['EmpEmployment.startDate','Date of joining','Drives M3/M6/M9/M12 dates'],['EmpJob.department / division','Department, division','Routes to HoD'],['EmpJob.managerId','Line manager','Who appraises'],['EmpJob.employeeClass','Type (TTA / WILP)','Contingent worker = WILP'],['EmpJob.customString (line)','Line','If maintained in SF'],['EmpEmployment.endDate','Exit','Closes open reviews']]},
 {k:'sfout',short:'SF/EC conversion',name:'SAP SF/EC · conversion events',dir:'out',what:'Final Month 12 decision: job change to permanent operator, 3-month extension, or separation.',how:'OData upsert to EmpJob with event reason, or a workflow request so HR in SF approves. One call per finalised decision.',when:'Real time, when Plant HR finalises',run:null,
  map:[['Decision = Convert','EmpJob event: Job change','Effective first of next month'],['Decision = Extend 3 months','EmpEmployment / contract end date + 3 months',''],['Decision = Do not convert','Termination event (end of apprenticeship)',''],['PRAGATI assessment ID','Attachment / comment','Audit link back to PRAGATI']]},
 {k:'time',short:'Time system',name:'Plant time system (gate punches)',dir:'in',what:'Daily status per apprentice: present, late (with in-time), absent, weekly off.',how:'CSV file dropped on SFTP by the time system; PRAGATI picks it up, validates ticket numbers and loads. API if the vendor supports it.',when:'Daily 06:00',run:'timesync',
  map:[['EMP_CODE','Ticket no.','Rows with unknown codes rejected'],['ATT_DATE','Date',''],['STATUS (P/A/WO)','Status',''],['IN_TIME','In-time','After 07:10 = late-in']]},
 {k:'tl',short:'TeamLease',name:'TeamLease joiner and exit file',dir:'in',what:'WILP joiners and exits with the TeamLease trainee code.',how:'CSV on SFTP. Matched to the SF/EC record by ticket no.; the TeamLease code is kept as a second ID.',when:'Weekly, Monday 18:30',run:'tlimport',
  map:[['TL_CODE','TeamLease code','Second ID'],['NAME','Name','Checked against SF'],['DOJ','Date of joining',''],['REPORTING_MGR','Line manager','Checked against SF'],['COURSE','Course','']]},
 {k:'coord',short:'Coordinator uploads',name:'Coordinator registers: skill matrix, JH, IE',dir:'in',what:'Stations certified, Jishu Hozen step, task-time reduction from IE studies.',how:'Excel template uploaded in PRAGATI by the coordinators. Validated row by row; blanks stay blank.',when:'Monthly, by the 5th',run:'regup',
  map:[['Ticket','Ticket no.',''],['Stations certified','Skill & multiskilling (M2)',''],['JH step 0–3','Machine & material care (C1)',''],['Time reduction %','Output & line rate (P1)','']]},
 {k:'lms',short:'Training (LMS)',name:'Training records (LMS)',dir:'in',what:'Classroom and on-the-job training completed.',how:'To confirm with IT: API or monthly file. Not used in scoring yet.',when:'To confirm',run:null,map:[]},
 {k:'native',short:'Captured in PRAGATI',name:'Captured in PRAGATI',dir:'native',what:'Reviews (Likert statements and comments), kaizen register, conduct cases, decisions, agent assessments.',how:'Entered once in PRAGATI portals and the line tablet. PRAGATI is the system of record for these.',when:'Real time',run:null,map:[]}
];
function vSources(){
 const ro = USERS[ME].role!=='hr' && USERS[ME].role!=='agent';
 return `${ph('Data sources', 'PRAGATI holds the apprentice record. It is coupled to SAP SF/EC for master data in and the conversion decision out, and to plant systems for attendance and registers. Everything else is captured here once.')}
 <section class="card flush">${SOURCES.map(s=>{ const st = S.sources[s.k] || {last:'Always on',rec:'',status:'ok',note:''}; return `<div class="conn"><span class="ico ${st.status==='warn'?'warn':st.status==='plan'?'':'good'}">${ic(s.k==='native'?'db':s.dir==='out'?'upload':'download')}</span>
  <div><div class="row" style="gap:8px"><span class="t1">${esc(s.name)}</span><span class="dir ${s.dir}">${s.dir==='in'?'INBOUND':s.dir==='out'?'OUTBOUND':'NATIVE'}</span></div><div class="t2 mt8">${esc(s.what)}</div>${s.map.length?`<details class="map"><summary>Field mapping</summary><table class="t"><thead><tr><th>Source field</th><th>PRAGATI field</th><th>Note</th></tr></thead><tbody>${s.map.map(m=>`<tr><td class="mono">${esc(m[0])}</td><td>${esc(m[1])}</td><td class="muted">${esc(m[2])}</td></tr>`).join('')}</tbody></table></details>`:''}</div>
  <div><div class="t2">How</div><div style="font-size:13.5px">${esc(s.how)}</div></div>
  <div><div class="t2">When · last run</div><div style="font-size:13.5px"><b class="ink">${esc(s.when)}</b><br>${esc(st.last)}${st.note?' · '+esc(st.note):''}</div></div>
  <div class="row">${st.status==='warn'?'<span class="chip warn">Attention</span>':st.status==='plan'?'<span class="chip">Planned</span>':'<span class="chip good">On time</span>'}${s.run&&!ro?`<button class="btn sm" data-act="${s.run}" type="button">Run now</button>`:''}</div></div>`; }).join('')}</section>
 <div class="grid g3 mt24">
  <section class="card"><h3>One key</h3><p class="sub mt8">The Bajaj ticket no. (SF userId) joins every source. WILP apprentices also carry the TeamLease code. Rows that do not match are rejected and listed for the sender.</p></section>
  <section class="card"><h3>Who owns what</h3><p class="sub mt8">SF/EC owns who the person is and who they report to. Plant systems own attendance and registers. PRAGATI owns reviews, kaizens, conduct and the decision until it is sent back to SF/EC.</p></section>
  <section class="card"><h3>What happens on change</h3><p class="sub mt8">Any inbound change re-queues the affected apprentices for the agent, so the HoD always sees a score built on current data.</p></section>
 </div>`;
}
function logTable(n){
 const rows = n ? S.log.slice(0,n) : S.log;
 const dt = {in:'INBOUND',ag:'AGENT',out:'OUTBOUND',sys:'SCHEDULER',wf:'WORKFLOW'};
 return `<div class="tw mt12"><table class="t"><thead><tr><th>When</th><th>Type</th><th>From → to</th><th>What</th></tr></thead><tbody>${rows.map(l=>`<tr><td class="mono" style="white-space:nowrap">${esc(l.at)}</td><td><span class="dir ${l.dir}">${dt[l.dir]}</span></td><td style="white-space:nowrap">${esc(l.from)} → ${esc(l.to)}</td><td>${esc(l.what)}</td></tr>`).join('')}</tbody></table></div>`;
}
function vLog(){ return `${ph('Audit log', 'Every data movement and decision, newest first.')}${logTable()}`; }

/* ======================= LINE TABLET ======================= */
function tabletShell(title, inner){ return `<div class="tablet"><div class="screen"><div class="tb"><b>${title}</b><span>${fmtS(TODAY)} · ${PLANT}</span></div>${inner}</div></div>`; }
function vReport(){
 const D = UI.tablet || (UI.tablet = {tid:'',k:'',place:'',desc:'',time:''});
 const p = D.tid ? S.people[D.tid] : null, sg = (D.tid && D.k) ? suggest(D.tid, D.k) : null;
 return `${ph('Report an incident', 'Replaces the paper misconduct report and the TeamLease incident form. The report goes to the line manager to validate.')}
 ${tabletShell('Incident report', `
  <div class="fld"><label for="tb-t">Apprentice (scan ID card or pick)</label><select id="tb-t" data-tb="tid"><option value="">Select apprentice</option>${Object.values(S.people).filter(x=>x.status==='Active').sort((a,b)=>a.name.localeCompare(b.name)).map(x=>`<option value="${x.id}" ${x.id===D.tid?'selected':''}>${esc(x.name)} · ${x.ticket}</option>`).join('')}</select></div>
  ${p?`<div class="note">${esc(deptOf(p))} · ${esc(p.line)} · line manager ${esc(MANAGERS[p.mgr].name)} · earlier cases: ${S.cases.filter(c=>c.tid===p.id).length}</div>`:''}
  <div class="fld"><label for="tb-k">What happened</label><select id="tb-k" data-tb="k"><option value="">Select</option>${[...new Set(MIS.map(m=>m.cat))].map(cat=>`<optgroup label="${esc(cat)}">${MIS.filter(m=>m.cat===cat).map(m=>`<option value="${m.k}" ${m.k===D.k?'selected':''}>${esc(m.name)}</option>`).join('')}</optgroup>`).join('')}</select></div>
  ${sg?`<div class="row"><span class="chip info">Ladder step ${sg.step} of ${sg.of}: ${esc(sg.label)}</span></div>`:''}
  <div class="fgrid"><div class="fld"><label for="tb-h">Time</label><input id="tb-h" type="time" data-tb="time" value="${esc(D.time)}"></div><div class="fld"><label for="tb-p">Place</label><input id="tb-p" data-tb="place" value="${esc(D.place||(p?p.line:''))}"></div></div>
  <div class="fld"><label for="tb-x">Description</label><textarea id="tb-x" data-tb="desc" placeholder="What was seen and by whom">${esc(D.desc)}</textarea></div>
  <div class="fld"><label for="tb-e">Photo / evidence</label><input id="tb-e" type="file" accept="image/*" multiple></div>
  <div class="err" id="tb-err"></div><button class="btn pri lg" data-act="tbsubmit" type="button">Submit report</button>`)}`;
}
function vKzSubmit(){
 const D = UI.kzd || (UI.kzd = {tid:'',team:'',cat:'',type:'Kaizen'});
 const p = D.tid ? S.people[D.tid] : null;
 return `${ph('Submit a kaizen', 'Apprentices submit ideas at the line kiosk or tablet. Fields follow the standard kaizen sheet used in Indian auto plants: problem, root cause, countermeasure, before / after, measured benefit, cost, standardisation and horizontal deployment.')}
 ${tabletShell('Kaizen sheet', `
  <div class="fgrid"><div class="fld"><label for="kd-t">Apprentice</label><select id="kd-t" data-kzd="tid"><option value="">Select</option>${Object.values(S.people).filter(x=>x.status==='Active').sort((a,b)=>a.name.localeCompare(b.name)).map(x=>`<option value="${x.id}" ${x.id===D.tid?'selected':''}>${esc(x.name)} · ${x.ticket}</option>`).join('')}</select></div>
  <div class="fld"><label for="kd-m">Team member (optional)</label><select id="kd-m" data-kzd="team"><option value="">None</option>${p?Object.values(S.people).filter(x=>x.mgr===p.mgr&&x.id!==p.id).map(x=>`<option value="${x.id}" ${x.id===D.team?'selected':''}>${esc(x.name)}</option>`).join(''):''}</select></div></div>
  ${p?`<div class="note">${esc(deptOf(p))} · ${esc(p.line)} · evaluated by ${esc(MANAGERS[p.mgr].name)}</div>`:''}
  <div class="fld"><span class="lbl">Category (PQCDSM)</span><div class="cat-pick">${BORDER.map(b=>`<button type="button" data-act="kzcat" data-id="${b}" aria-pressed="${D.cat===b}"><b>${b}</b><span>${BUCKETS[b].name}</span></button>`).join('')}</div></div>
  <div class="fgrid"><div class="fld"><label for="kd-ty">Type</label><select id="kd-ty" data-kzd="type">${KZ_TYPES.map(t=>`<option ${D.type===t?'selected':''}>${t}</option>`).join('')}</select></div><div class="fld"><label for="kd-st">Station / machine</label><input id="kd-st" placeholder="e.g. Stn 7, torque gun"></div></div>
  <div class="fld"><label for="kd-ti">Title</label><input id="kd-ti" placeholder="Short name for the idea"></div>
  <div class="fld"><label for="kd-b">Problem / before</label><textarea id="kd-b" style="min-height:72px" placeholder="What was wrong, and how often"></textarea></div>
  <div class="fld"><label for="kd-r">Root cause (why-why)</label><input id="kd-r"></div>
  <div class="fld"><label for="kd-a">Idea / after</label><textarea id="kd-a" style="min-height:72px" placeholder="What you changed or propose to change"></textarea></div>
  <div class="fgrid c3"><div class="fld"><label for="kd-mn">Measure</label><input id="kd-mn" placeholder="e.g. Cycle time"></div><div class="fld"><label for="kd-mb">Before</label><input id="kd-mb" type="number"></div><div class="fld"><label for="kd-ma">After (expected)</label><input id="kd-ma" type="number"></div></div>
  <div class="fgrid c3"><div class="fld"><label for="kd-u">Unit</label><input id="kd-u" placeholder="sec, nos/month"></div><div class="fld"><label for="kd-s">Saving ₹ / yr (est.)</label><input id="kd-s" type="number" placeholder="0 if intangible"></div><div class="fld"><label for="kd-c">Cost ₹</label><input id="kd-c" type="number"></div></div>
  <div class="fgrid"><label class="check"><input type="checkbox" id="kd-h"> Can be applied on other lines</label><label class="check"><input type="checkbox" id="kd-sd"> SOP / OPL needs updating</label></div>
  <div class="fgrid"><div class="fld"><label for="kd-pb">Before photo</label><input id="kd-pb" type="file" accept="image/*"></div><div class="fld"><label for="kd-pa">After photo (if done)</label><input id="kd-pa" type="file" accept="image/*"></div></div>
  <div class="err" id="kd-err"></div><button class="btn pri lg" data-act="kzsubmit" type="button">Submit kaizen</button>`)}`;
}
function vSent(){
 const cs = S.cases.filter(c=>c.channel==='Line tablet').sort((a,b)=>d(b.date)-d(a.date)).slice(0,15);
 const ks = S.kaizens.filter(k=>k.channel==='Line tablet').slice(-15).reverse();
 return `${ph('My submissions', 'Where each report and kaizen from this tablet is now.')}
 <div class="grid g2" style="align-items:start"><section><h2 style="margin-bottom:12px">Kaizens</h2><div class="tw"><table class="t"><thead><tr><th>Kaizen</th><th>Apprentice</th><th>Status</th></tr></thead><tbody>${ks.map(k=>`<tr class="click" data-act="kzopen" data-id="${k.seq}"><td class="nm">${esc(k.title)}<small class="mono">${esc(k.id)}</small></td><td>${esc(S.people[k.tid].name)}</td><td>${kzChip(k)}</td></tr>`).join('')}</tbody></table></div></section>
 <section><h2 style="margin-bottom:12px">Incident reports</h2><div class="tw"><table class="t"><thead><tr><th>Case</th><th>Apprentice</th><th>Status</th></tr></thead><tbody>${cs.map(c=>`<tr><td class="nm">${esc(MISK[c.k].name)}<small class="mono">${c.id} · ${fmtS(d(c.date))}</small></td><td>${esc(S.people[c.tid].name)}</td><td>${caseChip(c)}</td></tr>`).join('')}</tbody></table></div></section></div>`;
}

/* ======================= COORDINATOR UPLOAD ======================= */
function vUpload(){
 const R = S.reg, cols = [['st','Stations certified'],['jh','JH step (0–3)'],['ie','Time reduction %']];
 const known = new Set(Object.values(S.people).map(p=>p.ticket));
 return `${ph('Monthly register upload', 'Skill matrix, TPM (JH) and IE registers in one template. PRAGATI rejects rows it cannot match; blanks stay blank. Kaizens and OPLs no longer come through here: they live in the digital kaizen register.', `<button class="btn pri" data-act="regup" type="button" ${R.uploaded?'disabled':''}>${R.uploaded?'September uploaded':'Validate and upload'}</button>`)}
 <div class="card" style="padding:16px 20px;margin-bottom:16px"><div class="file"><span class="ext">XLSX</span><div><b class="ink">Apprentice_registers_${R.month.replace(' ','_')}.xlsx</b><div class="sm muted">${R.rows.length} rows · edit any cell before uploading</div></div></div></div>
 <div class="tw"><table class="t"><thead><tr><th>Ticket</th><th>Name</th>${cols.map(c=>`<th class="r">${c[1]}</th>`).join('')}</tr></thead><tbody>
 ${R.rows.map((r,i)=>{ const bad = !known.has(r.ticket); return `<tr class="${bad?'bad':''}"><td class="mono">${esc(r.ticket)}${bad?'<div class="err">No such apprentice in SF/EC</div>':''}</td><td>${esc(r.name)}</td>${cols.map(([k])=>`<td class="r"><input aria-label="${esc(r.name)} ${k}" data-reg="${i}.${k}" value="${r[k]==null?'':esc(r[k])}" placeholder="blank" style="width:110px;text-align:right" ${R.uploaded?'disabled':''}></td>`).join('')}</tr>`; }).join('')}
 </tbody></table></div>`;
}

/* ======================= SOURCE SIMULATORS ======================= */
function vPunches(){
 const ps = Object.values(S.people).filter(p=>p.status==='Active');
 const pend = ps.filter(p=>pendingDays(p.id)>0);
 const tk = dateKey(TODAY), yk = dateKey(new Date(TODAY.getTime()-DAY));
 const rec = (p,k) => rawOf(p.id).find(x=>x.d===k) || {s:'—'};
 const cell = x => x.s==='A'?'Absent':x.s==='W'?'Off':esc((x.in||'')+(x.s==='L'?' late':''));
 return `${ph('Gate punches', 'Apprentices punch in at the gate. Every morning at 06:00 the time system sends PRAGATI one file with each apprentice’s status per day. Nobody types attendance.', `<button class="btn pri" data-act="timesync" type="button" ${pend.length?'':'disabled'}>Send daily file${pend.length?' ('+pend.length+' apprentices)':''}</button>`)}
 <div class="feedbox"><div class="hd"><span><b>TIME SYSTEM</b> · ${PLANT} gate</span><span>PRAGATI synced to ${esc(attStats(ps[0].id).syncedTo)}</span></div>
 <div style="overflow-x:auto"><table class="t"><thead><tr><th>EMP_CODE</th><th>Name</th><th>${fmtS(new Date(TODAY.getTime()-DAY))}</th><th>${fmtS(TODAY)}</th><th>In PRAGATI</th></tr></thead><tbody>
 ${ps.map(p=>{ const y = rec(p,yk), t = rec(p,tk); return `<tr><td class="mono">${esc(p.ticket)}</td><td>${esc(p.name)}</td><td class="${y.s}">${cell(y)}</td><td class="${t.s}">${cell(t)}</td><td>${pendingDays(p.id)?'<span class="chip warn">Pending</span>':'<span class="chip good">Yes</span>'}</td></tr>`; }).join('')}
 </tbody></table></div></div>`;
}
function vJoiners(){
 const T = S.tl;
 return `${ph('Joiner file', 'WILP apprentices are employed through TeamLease. The weekly joiner file adds the TeamLease code to the record created from SAP SF/EC, so attendance, kaizens, cases and reviews all land on one record.', `<button class="btn pri" data-act="tlimport" type="button" ${T.imported?'disabled':''}>${T.imported?'Imported':'Validate and import'}</button>`)}
 <div class="card" style="padding:16px 20px;margin-bottom:16px"><div class="file"><span class="ext" style="background:var(--warn-50);color:var(--warn)">CSV</span><div><b class="ink">${esc(T.file)}</b><div class="sm muted">Received ${fmt(new Date(TODAY.getTime()-DAY))} 18:30 · SFTP</div></div></div></div>
 <div class="tw"><table class="t"><thead><tr><th>Name</th><th>TeamLease code</th><th>Joined</th><th>Line</th><th>Line manager</th><th>Course</th><th>PRAGATI will</th></tr></thead><tbody>
 ${T.rows.map(r=>`<tr><td class="nm">${esc(r.name)}</td><td class="mono">${esc(r.tl)}</td><td>${fmt(d(r.doj))}</td><td>${esc(r.line)}</td><td>${esc(MANAGERS[r.mgr].name)}</td><td>${esc(r.course)}</td><td class="sm muted">Create the record, schedule the M3 review for ${fmtS(addM(d(r.doj),3))}</td></tr>`).join('')}
 </tbody></table></div>`;
}

/* ======================= AGENT ======================= */
const PSTEPS = [
 ['Read the record','Master data, attendance, skills & TPM, kaizens, cases and the latest review from PRAGATI.'],
 ['Check completeness','All 16 statements rated, both comments present, records found for each data parameter.'],
 ['Score the records','Turn attendance, kaizens, skills, JH, IE and cases into 1–5 scores with the rule set.'],
 ['Blend with the manager','Blend each parameter: manager average and record score, '+'50/50 by default.'],
 ['Read the comments (AI)','Classify the comments as positive, neutral or negative; mark the words that drove it.'],
 ['Combine','Weighted average over 11 parameters → overall % → band; apply the conduct cap.'],
 ['Explain and flag','Write the summary for the HoD; raise mismatch, leniency, drop and missing-data flags.'],
 ['Write back','Save the assessment to the record; the HoD sees it with the review.']
];
function vConsole(){
 const q = queue(), pid = UI.pipe.tid || (q[0] && q[0].p.id) || 't01', p = S.people[pid], f = lastSubmitted(pid);
 const e = f ? evaluate(p, f) : null, st = UI.pipe.tid===pid ? UI.pipe.step : 0;
 const out = i => { if(!e) return ''; const a = attStats(pid), k = kzStats(pid);
  return [`${formsOf(pid).length} reviews, ${kzOf(pid).length} kaizens, ${S.cases.filter(c=>c.tid===pid).length} cases, ${a.sched} attendance days`,
   `${ALL_ST.filter(s=>f.ans[s]).length}/16 statements · comments ${e.sen.words} words · ${e.rows.filter(r=>r.dt&&r.dt.missing).length} missing record(s)`,
   e.rows.filter(r=>r.dpts!=null).map(r=>r.par.k+' '+r.dpts).join(' · '),
   e.rows.map(r=>r.par.k+' '+(r.score!=null?r.score.toFixed(1):'—')).join(' · '),
   'Reads '+e.sen.label.toLowerCase()+' · positive: '+(e.sen.hits.pos.join(', ')||'none')+' · negative: '+([...e.sen.hits.neg,...e.sen.hits.red].join(', ')||'none'),
   pct(e.overall)+' → band '+e.band+(e.capped?' → capped to '+e.fb:'')+' · '+(f.cp==='M12'?e.rec:e.status),
   e.flags.length+' flag(s): '+(e.flags.map(x=>x[1]).join('; ')||'none'),
   'Assessment written · HoD '+HODS[hodOf(p)].name+' notified'][i]; };
 return `${ph('Agent console', 'The agent runs whenever a review is submitted or the data behind one changes. It applies the published rule set; people still decide.', `<button class="btn" data-act="nightly" type="button">Run nightly checks</button><button class="btn pri" data-act="runall" type="button" ${q.length?'':'disabled'}>Run queue (${q.length})</button>`)}
 <div class="grid g12" style="align-items:start">
  <section class="card"><h2>Queue</h2><div class="list mt8">${q.map(x=>`<div class="li click" data-act="pick" data-id="${x.p.id}" role="button" tabindex="0">${av(x.p.name)}<div class="sp"><div class="t1">${esc(x.p.name)}</div><div class="t2">${esc(x.reason)}</div></div></div>`).join('')||'<div class="empty-s">Queue empty. Change some data (close a case, sync attendance) to queue apprentices.</div>'}</div>
   <div class="fld mt16"><label for="ag-p">Or pick anyone</label><select id="ag-p" data-act2="pick">${Object.values(S.people).filter(x=>lastSubmitted(x.id)).sort((a,b)=>a.name.localeCompare(b.name)).map(x=>`<option value="${x.id}" ${x.id===pid?'selected':''}>${esc(x.name)}</option>`).join('')}</select></div></section>
  <section class="card"><div class="between"><div><h2>${esc(p.name)}${f?' · '+f.cp:''}</h2><p class="sub">${S.assess[pid]?'Last assessment '+esc(S.assess[pid].id)+' · '+esc(S.assess[pid].runAt):'No assessment yet'}</p></div><button class="btn pri" data-act="prun" data-id="${pid}" type="button" ${f?'':'disabled'}>Run step by step</button></div>
   <div class="pipe mt12">${PSTEPS.map(([t,x],i)=>`<div class="ps ${st>i?'done':st===i&&UI.pipe.timer?'cur':''}"><span class="n">${st>i?ic('check',14):i+1}</span><div class="sp"><b>${t}</b><span>${esc(x)}</span>${st>i?`<div class="out">${esc(out(i))}</div>`:''}</div></div>`).join('')}</div></section>
 </div>`;
}
function vHow(){
 return `${ph('How the agent works', 'Rules decide the score. AI only reads the free-text comments, and every output shows its reasons.')}
 <div class="grid g2"><section class="card"><h2>Inputs</h2><div class="list mt8">${SOURCES.filter(s=>s.dir!=='out').map(s=>`<div class="li"><span class="ico">${ic('db')}</span><div><div class="t1">${esc(s.short)}</div><div class="t2">${esc(s.what)}</div></div></div>`).join('')}</div></section>
 <section class="card"><h2>Guardrails</h2><div class="list mt8">${['The rule set is published and versioned; HR changes it, not the agent.','Only closed conduct cases count. Open cases are flagged, never scored.','A missing record is never guessed: the manager’s rating stands and a flag is raised.','The agent recommends at Month 12. The HoD decides and Plant HR finalises.','Every run is logged with its inputs, so any score can be reproduced.'].map(x=>`<div class="li"><span class="ico good">${ic('check')}</span><div class="t1" style="font-weight:400">${x}</div></div>`).join('')}</div></section></div>`;
}

/* ======================= FLOW MAP ======================= */
function vFlow(){
 const hot = new Set(); S.log.slice(0,2).filter(l=>l.ts && Date.now()-l.ts < 45000).forEach(l=>{ hot.add(l.from); hot.add(l.to); });
 const H = (...k) => k.some(x=>[...hot].some(h=>h && h.startsWith(x))) ? 'hot' : '';
 const node = (href, cls, t, s, feed) => `<a class="node ${cls}" href="${href}" target="_blank" rel="noopener" style="text-decoration:none"><b>${t}</b><span>${s}</span>${feed?`<span class="feed">${feed}</span>`:''}</a>`;
 const pend = Object.keys(S.people).filter(k=>pendingDays(k)>0).length;
 const T = [['Send today’s punches','Time system','timesystem.html'],['Upload September registers','Coordinator','coordinator.html'],['Import TeamLease joiners','TeamLease','teamlease.html'],['Submit a kaizen and report an incident','Line tablet','supervisor.html'],['Evaluate the kaizen and complete a review (anaik)','Line manager','manager.html'],['Sign the review with the summary (piyer)','HoD','hod.html'],['See the plant summary (vdeshpande)','Plant head','plant.html'],['Finalise a conversion → SF/EC (nsharma)','Plant HR','hr.html']];
 return `${ph('How data moves', 'From the shop floor and SAP SF/EC into PRAGATI, through the agent, to a decision that goes back to SAP SF/EC. Boxes light up when data moves; each opens its portal.', `<button class="btn" data-act="nightly" type="button">Run nightly checks</button><button class="btn danger" data-act="reset" type="button">Reset demo data</button>`)}
 <section class="card"><div class="flow">
  <div class="col"><h3>Sources</h3>
   ${node('hr.html#/sources',H('SAP SF/EC'),'SAP SF/EC','Employee master in, daily','OData API')}
   ${node('timesystem.html',H('Time system'),'Time system','Gate punches, daily 06:00',pend?pend+' pending':'up to date')}
   ${node('teamlease.html',H('TeamLease'),'TeamLease','WILP joiners, weekly',S.tl.imported?'imported':'2 waiting')}
   ${node('coordinator.html',H('Coordinators'),'Coordinators','Skill matrix, JH, IE, monthly',S.reg.uploaded?'Sep loaded':'Sep due')}
   ${node('supervisor.html',H('Line tablet'),'Line tablet','Incidents and kaizens, real time','')}
  </div><div class="arr">→</div>
  <div class="col"><div class="hub"><h3>PRAGATI · apprentice record</h3>
   ${node('hr.html#/master',H('PRAGATI Master','PRAGATI'),'Master & attendance',Object.keys(S.people).length+' apprentices','')}
   ${node('coordinator.html#/kzreg',H('PRAGATI Kaizen'),'Kaizen register',S.kaizens.length+' kaizens','')}
   ${node('hr.html#/cases',H('PRAGATI Conduct'),'Conduct cases',S.cases.filter(c=>c.status<5).length+' open','')}
   ${node('manager.html#/reviews',H('PRAGATI Review','Manager'),'Reviews (Likert, PQCDSM)',S.forms.filter(f=>!isDone(f)).length+' open · '+S.forms.filter(f=>f.status==='With HoD').length+' with HoD','')}
   ${node('agent.html',H('Agent','PRAGATI Assessment'),'Agent ⇄ assessment',queue().length+' queued','rules + AI on comments')}
  </div></div><div class="arr">→</div>
  <div class="col"><h3>Decide & act</h3>
   ${node('manager.html',H('Line manager'),'Line manager','Appraises, validates, evaluates kaizens','')}
   ${node('hod.html',H('HoD'),'HoD (skip level)','Summary view; signs and decides','')}
   ${node('plant.html','','Plant head','Plant summary','')}
   ${node('hr.html#/m12',H('Plant HR'),'Plant HR','Finalises; owns the rules and views','')}
   ${node('hr.html#/sources',H('PRAGATI','SAP SF/EC Job'),'SAP SF/EC job change','Outbound on finalise','')}
  </div>
 </div></section>
 <div class="grid g2 mt24" style="align-items:start"><section class="card"><h2>Walkthrough</h2><p class="sub">Open each portal in its own tab; changes appear everywhere within a second.</p><div class="list mt8">${T.map(([t,w,h],i)=>`<a class="li click" href="${h}" target="_blank" rel="noopener" style="text-decoration:none;color:inherit"><span class="pq">${i+1}</span><div class="sp"><div class="t1">${t}</div><div class="t2">${w}</div></div>${ic('arrow',16)}</a>`).join('')}</div></section>
 <section class="card"><h2>Data movements</h2>${logTable(10)}</section></div>`;
}
function vSettings(id){ const t = ['rules','access','log'].includes(id)?id:'rules'; return `<nav class="itabs" style="margin-top:0" aria-label="Settings">${[['rules','Scoring rules'],['access','Role views'],['log','Audit log']].map(([k,l])=>`<a href="#/settings/${k}" ${k===t?'aria-current="page"':''}>${l}</a>`).join('')}</nav>`+({rules:vRules,access:vAccess,log:vLog})[t](); }
function notFound(){ return `${ph('Not available', 'This record does not exist or is outside your access.')}<a class="btn" href="#/">Back to home</a>`; }
