function simName(){ return (typeof PORTALS!=='undefined' && PORTALS[curSim()]) ? PORTALS[curSim()].name : 'Demo control'; }

/* ======================= CONSTANTS ======================= */
const TODAY = new Date(2026, 9, 6);
const DAY = 864e5;
const _raw = {};
const RULES_VER = 'Rule set v0.3 (placeholder weights)';
const DEFAULT_CFG = { w:{S:35,P:20,Q:15,M:10,B:10,C:10}, bandA:76.5, bandB:47.1, attA:95, attB:88, vcurAsWL:3, wlNotRec:2, leniency:40, launchBefore:7 };
const BUCKETS = {S:'Safety & compliance',P:'Productivity',Q:'Quality',M:'Improvement & skill',B:'Behaviour',C:'Manager comment'};
const ATTRS = [
 {id:2,b:'S',src:'mgr',name:'Discipline',short:'Discip.',what:'Follows rules and work instructions',d5:'Follows rules, regulations & work instructions all the time',d3:'Follows them most of the time',d1:'Frequently violates rules, regulations & work instructions'},
 {id:3,b:'S',src:'rec',name:'Attendance & punctuality',what:'Present days as % of scheduled',source:'Time system'},
 {id:5,b:'S',src:'mgr',name:'Safety & housekeeping',short:'Safety',what:'PPE, safe methods, clean station (5S)',d5:'Follows safety & housekeeping standards all the time; has submitted a safety poster / slogan / essay',d3:'Follows them most of the time',d1:'Frequently violates safety & housekeeping standards'},
 {id:19,b:'S',src:'conduct',name:'Conduct record',what:'Closed cases in the conduct log',source:'Conduct cases'},
 {id:1,b:'P',src:'mgr',name:'Quantity of output',short:'Output',what:'Output at the line rate',d5:'Achieves targets all the time (always works at the required production rate)',d3:'Achieves targets most of the time (usually at the required rate)',d1:'Does not achieve targets most of the time'},
 {id:6,b:'P',src:'rec',name:'Productivity improvement',short:'Prod. impr.',what:'Task time reduction (IE)',source:'IE time study'},
 {id:12,b:'Q',src:'mgr',name:'Quality orientation',short:'Quality',what:'Follows quality standards, reports defects',d5:'Follows quality standards meticulously; flags or helps fix defects',d3:'Follows quality standards most of the time',d1:'Frequent quality lapses, or does not report defects he notices'},
 {id:8,b:'M',src:'rec',name:'TPM / JH',short:'TPM/JH',what:'Jishu Hozen step certified',source:'TPM register'},
 {id:9,b:'M',src:'rec',name:'Kaizens',what:'Improvement ideas per month',source:'Kaizen register'},
 {id:10,b:'M',src:'rec',name:'Multiskilling',what:'Stages operated independently',source:'Skill matrix'},
 {id:11,b:'M',src:'rec',name:'One-point lessons',what:'OPLs per month',source:'OPL register'},
 {id:15,b:'M',src:'mgr',name:'Adapting to new procedures',short:'Adapting',what:'Learning new tasks / model changes',d5:'Adapts very quickly to new work procedures / tasks',d3:'Adapts fairly quickly',d1:'Is slow in adapting to new procedures / tasks'},
 {id:16,b:'M',src:'rec',name:'Imparting training',short:'Training',what:'People trained per month',source:'Training records'},
 {id:4,b:'B',src:'mgr',name:'Attitude towards work',short:'Attitude',what:'Willingness to cooperate',d5:'Co-operative, good team player',d3:'Limited co-operation',d1:'Un-cooperative'},
 {id:7,b:'B',src:'mgr',name:'Initiative',what:'Acts on his own',d5:'Self-starter; initiates positive actions',d3:'Displays initiative occasionally',d1:'Limited initiative'},
 {id:13,b:'B',src:'mgr',name:'Interpersonal skills',short:'Interpers.',what:'Gets along with people',d5:'Gets along well with people all the time',d3:'Gets along well most of the time',d1:'Does not get along with others'},
 {id:14,b:'B',src:'mgr',name:'Dependability',short:'Depend.',what:'Can be relied on',d5:'Dependable; works as instructed without checking',d3:'Needs occasional follow-up',d1:'Not reliable'},
 {id:17,b:'B',src:'rec',name:'Extra activities',short:'Activities',what:'Sports, clubs, plant events',source:'HR / club records'},
 {id:18,b:'C',src:'agent',name:'Comment sentiment',what:'Agent reads the comments',source:'Agent'}
];
const REC_KEY = {6:'prod',8:'jh',9:'kz',10:'st',11:'opl',16:'tr',17:'ex'};
const REC_RULES = {
 3:{d5:'Rare absence or late reporting: \u2265 95% present (old form: 290+ days)',d3:'Occasional: 88\u201394% present (270\u2013289 days)',d1:'Frequent: < 88% present (< 270 days)'},
 6:{d5:'High improvement: 10% or more time reduction',d3:'Limited improvement: above 0% and under 10%',d1:'No time reduction'},
 8:{d5:'Daily & weekly PM thorough; machine excellent; JH Step 3',d3:'PM most of the time; machine good; JH Step 2',d1:'PM irregular; machine needs improvement; no step'},
 9:{d5:'2 or more kaizens per month',d3:'At least 1 but under 2 per month',d1:'Under 1 kaizen per month'},
 10:{d5:'Can work on more than 12 stages',d3:'Can work on 3\u201312 stages',d1:'Can work on fewer than 3 stages'},
 11:{d5:'More than 2 one-point lessons per month',d3:'1\u20132 per month',d1:'Under 1 per month'},
 16:{d5:'Has trained 4 or more persons per month',d3:'Has trained 2\u20133 persons per month',d1:'Has trained fewer than 2 persons per month'},
 17:{d5:'Participates actively in sports / cultural clubs',d3:'Participates occasionally',d1:'Does not participate'},
 19:{d5:'No misconduct on record',d3:'Only verbal counselling / underwriting',d1:'Warning letter, show cause or suspension'},
 18:{d5:'Comments read positive',d3:'Neutral or mixed',d1:'Comments read negative'}};
const descOf = a => a.src==='mgr' ? a : REC_RULES[a.id];
const MIS = [
 {k:'mob',no:'1',name:'Mobile / earphone use during work',cat:'Work indiscipline',tier:1,lad:[['VC / UR','vcur'],['Warning letter','wl'],['Discontinuation','end']]},
 {k:'uni',no:'4',name:'Not wearing uniform',cat:'Work indiscipline',tier:1,lad:[['VC / UR; sent home, marked absent','vcur']]},
 {k:'ref',no:'3',name:'Refusing to work at stage',cat:'Work indiscipline',tier:2,lad:[['Warning letter + confession','wl'],['Termination after 7 days if unresolved','end']]},
 {k:'slp',no:'5',name:'Sleeping on duty',cat:'Work indiscipline',tier:2,lad:[['Show cause + 5-day suspension','wl'],['Termination','end']]},
 {k:'sho',no:'2',name:'Not wearing safety shoes',cat:'Safety',tier:1,lad:[['VC / UR','vcur'],['Warning letter','wl'],['Discontinuation','end']]},
 {k:'drv',no:'11',name:'Driving without licence',cat:'Safety',tier:3,lad:[['Termination','end']]},
 {k:'hab',no:'8',name:'Habitual absenteeism',cat:'Attendance',tier:1,lad:[['VC / UR','vcur'],['Warning letter','wl'],['Discontinuation','end']]},
 {k:'stg',no:'12',name:'Absent from stage without approval',cat:'Attendance',tier:1,lad:[['VC / UR','vcur'],['Warning letter','wl'],['Discontinuation','end']]},
 {k:'cua',no:'9',name:'Continuous unauthorised absence (> 3 days)',cat:'Attendance',tier:2,lad:[['Warning letter (Day 4); calls Day 6 and 11','wl'],['Discontinuation if unresolved','end']]},
 {k:'vrb',no:'14',name:'Verbal fight / abusive language',cat:'Behaviour',tier:2,lad:[['VC / UR + warning letter','wl'],['Discontinuation','end']]},
 {k:'phy',no:'7',name:'Physical fight',cat:'Behaviour',tier:3,lad:[['Termination','end']]},
 {k:'tob',no:'15',name:'Tobacco / smoking on premises',cat:'Substance',tier:2,lad:[['VC / UR + warning letter','wl'],['Discontinuation','end']]},
 {k:'alc',no:'16',name:'Alcohol on duty',cat:'Substance',tier:3,lad:[['Discontinuation','end']]},
 {k:'prx',no:'6',name:'Proxy punching',cat:'Integrity & security',tier:3,lad:[['Termination','end']]},
 {k:'thf',no:'10',name:'Theft',cat:'Integrity & security',tier:3,lad:[['Termination','end']]},
 {k:'dmg',no:'11',name:'Damage to company property',cat:'Integrity & security',tier:3,lad:[['Termination','end']]},
 {k:'pho',no:'13',name:'Photo / video on premises',cat:'Integrity & security',tier:3,lad:[['Discontinuation','end']]},
 {k:'neg',no:'New',name:'Work negligence / quality lapse',cat:'Work negligence (proposed)',tier:1,lad:[['VC / UR (proposed)','vcur'],['Warning letter (proposed)','wl'],['Discontinuation (proposed)','end']]},
 {k:'acc',no:'New',name:'Accident (no violation found)',cat:'Incident \u2013 non-disciplinary',tier:0,lad:[['Record only; no penalty','none']]}
];
const MISK = Object.fromEntries(MIS.map(m=>[m.k,m]));
const ACTIONS = [['VC / UR','vcur'],['Warning letter','wl'],['Show cause notice','wl'],['Suspension','wl'],['Discontinuation / termination','end'],['Record only (no penalty)','none']];
const CSTATUS = ['','Reported','Validated','Action decided','Letter issued','Closed'];
const MANAGERS = {m1:{name:'S. Kulkarni',dept:'Engine Assembly',div:'MCD',hod:'h1'},m2:{name:'R. Joshi',dept:'Vehicle Assembly',div:'MCD',hod:'h1'},m3:{name:'A. Naik',dept:'Frame Shop',div:'CVD',hod:'h2'},m4:{name:'M. Rao',dept:'Packing & Dispatch',div:'SPD',hod:'h2'}};
const HODS = {h1:{name:'D. Mehta',divs:['MCD']},h2:{name:'P. Iyer',divs:['CVD','SPD']}};
const PERSONAS = [['m3','A. Naik','manager'],['m1','S. Kulkarni','manager'],['m2','R. Joshi','manager'],['m4','M. Rao','manager'],['h1','D. Mehta','hod'],['h2','P. Iyer','hod'],['hr','N. Sharma','hr']];
const ROLE_TXT = {manager:'Line manager',hod:'HoD',hr:'Plant HR'};
const COMMENTS = {
 strong:['Very sincere and hardworking. Quick learner, picks up new models fast and helps new joiners on the line.','Can take more initiative in kaizen documentation.'],
 good:['Good attitude and punctual. Follows SOP and safety rules on the line.','Needs to improve speed at model change. Should give more kaizens.'],
 avg:['Mehnati hai, works fine when supervised.','Output is slow some days. Needs follow-up on quality checks. Mobile use noticed once.'],
 weak:['Attendance is okay.','Frequently careless, argues with seniors, does not follow instructions. Repeated mistakes on torque checks.'],
 lenient:['Excellent trainee. Very good worker.','Nothing major.'],
 vishal:['Excellent output, quick learner, good team player.','Mobile use during shift, warned. Must improve discipline.'],
 rahul:['Good at his stage when present.','Frequently absent, tobacco on premises, careless about safety rules.'],
 sneha:['Steady and dependable. Improved a lot since M6, punctual.','Needs more speed at model change.']
};

/* ======================= HELPERS ======================= */
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const d = s => { const [y,m,dd] = s.split('-').map(Number); return new Date(y, m-1, dd); };
const addM = (dt,n) => { const x = new Date(dt); x.setMonth(x.getMonth()+n); return x; };
const fmt = dt => dt ? new Date(dt).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) : '';
const fmtS = dt => dt ? new Date(dt).toLocaleDateString('en-GB',{day:'2-digit',month:'short'}) : '';
const days = (a,b) => Math.round((b-a)/DAY);
const pct = v => (Math.round(v*10)/10).toFixed(1)+'%';
const clone = o => JSON.parse(JSON.stringify(o));
function rng(seed){ return function(){ seed|=0; seed=seed+0x6D2B79F5|0; let t=Math.imul(seed^seed>>>15,1|seed); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
let _clockMin = 0;
const stamp = () => { const t = new Date(); return fmtS(TODAY)+' '+t.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}); };
const dateKey = dt => { const x = new Date(dt); return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0'); };

/* ======================= SEED ======================= */
function genAtt(doj, ab, la, streak, s){
 const R = rng(s*7919), out = [];
 for(let t = doj.getTime(); t <= TODAY.getTime(); t += DAY){
  const dt = new Date(t);
  if(dt.getDay()===0){ out.push({d:dateKey(dt),s:'W'}); continue; }
  const r = R(); const st = r < ab ? 'A' : (R() < la ? 'L' : 'P');
  out.push({d:dateKey(dt), s:st, in: st==='A' ? '' : (st==='L' ? '07:'+String(12+Math.floor(R()*30)).padStart(2,'0') : '06:'+String(40+Math.floor(R()*18)).padStart(2,'0'))});
 }
 let k = streak, i = out.length-1;
 while(k>0 && i>=0){ if(out[i].s!=='W'){ out[i].s='A'; out[i].in=''; k--; } i--; }
 return out;
}
function ratingsFor(prof, tid, s, rec){
 const R = rng(s*104729+13);
 const P = {strong:[.75,.25],vgood:[.85,.15],good:[.45,.5],avg:[.15,.75],weak:[.05,.55],lenient:[.95,.05]}[prof] || [.3,.6];
 const pick = () => { const r = R(); return r < P[0] ? 5 : (r < P[0]+P[1] ? 3 : 1); };
 const out = {};
 ATTRS.forEach(a=>{ if(a.src==='mgr' || (a.src==='rec' && a.id!==3 && rec[REC_KEY[a.id]]==null)) out[a.id] = pick(); });
 if(prof==='lenient') out[2]=5;
 if(tid==='t03'){ out[2]=3; out[5]=3; }
 if(tid==='t12'){ out[2]=1; out[13]=1; }
 if(tid==='t04'){ [1,12,15,7,13,14].forEach(i=>out[i]=3); }
 return out;
}
function seed(){
 const T = [
  ['t01','Rohan Shinde','TTA','m1','2025-10-06','E-Line 2','strong',{prod:12,jh:3,kz:2.3,st:14,opl:2.5,tr:4,ex:'active'},.02,.02,0,[3,6,9],'strong'],
  ['t02','Vishal Gaikwad','TTA','m2','2025-09-22','V-Line 1','vgood',{prod:11,jh:3,kz:2.1,st:13,opl:2.2,tr:3,ex:'active'},.03,.03,0,[3,6,9,12],'vishal'],
  ['t03','Rahul Bhosale','WILP','m2','2025-09-15','V-Line 3','avg',{prod:4,jh:2,kz:1.1,st:6,opl:1,tr:1,ex:'none'},.10,.06,0,[3,6,9,12],'rahul'],
  ['t04','Sneha Patil','TTA','m4','2025-09-29','Dispatch Bay 2','avg',{prod:7,jh:2,kz:1.4,st:8,opl:1.5,tr:2,ex:'occasional'},.04,.03,0,[3,6,9,12],'sneha'],
  ['t05','Nikhil More','WILP','m1','2026-03-02','E-Line D','avg',{prod:3,jh:2,kz:1,st:5,opl:1,tr:0,ex:'occasional'},.05,.04,0,[3,6],'avg'],
  ['t06','Ganesh Wagh','TTA','m3','2026-01-12','Frame Weld 1','lenient',{prod:5,jh:2,kz:1.2,st:6,opl:1,tr:1,ex:'occasional'},.06,.05,0,[3,6],'lenient'],
  ['t07','Pooja Kale','TTA','m3','2025-12-15','Frame Paint','lenient',{prod:10,jh:3,kz:2,st:9,opl:2.4,tr:3,ex:'active'},.02,.02,0,[3,6,9],'lenient'],
  ['t08','Akash Pawar','WILP','m3','2026-04-06','Frame Weld 2','good',{prod:6,jh:2,kz:1.5,st:5,opl:1.2,tr:2,ex:'occasional'},.03,.03,0,[3],'good'],
  ['t09','Kiran Salunkhe','WILP','m4','2026-02-16','Packing L1','avg',{prod:2,jh:1,kz:.8,st:4,opl:.5,tr:0,ex:'none'},.07,.05,5,[3,6],'avg'],
  ['t10','Amol Thorat','TTA','m4','2026-06-01','Dispatch Bay 1','good',{prod:5,jh:2,kz:1.3,st:4,opl:1,tr:2,ex:'active'},.03,.02,0,[3],'good'],
  ['t11','Priya Deshmukh','WILP','m2','2026-07-01','V-Line 2','good',{prod:2,jh:1,kz:.6,st:2,opl:.3,tr:0,ex:null},.02,.02,0,[],'good'],
  ['t12','Suraj Kamble','TTA','m1','2026-05-04','E-Line 1','weak',{prod:0,jh:1,kz:.4,st:3,opl:.5,tr:0,ex:'none'},.08,.08,0,[3],'weak'],
  ['t13','Mahesh Kadam','TTA','m3','2026-03-23','Frame Weld 1','lenient',{prod:9,jh:2,kz:1.8,st:7,opl:2,tr:2,ex:'active'},.02,.02,0,[3,6],'lenient'],
  ['t14','Sagar Jadhav','WILP','m4','2026-01-05','Packing L2','weak',{prod:null,jh:null,kz:.5,st:3,opl:.4,tr:0,ex:'occasional'},.06,.07,0,[3,6],'weak']
 ];
 const S = {cfg:clone(DEFAULT_CFG), people:{}, sfLen:{}, dev:{}, forms:[], cases:[], assess:{}, decisions:{}, log:[], triggers:{}, alerts:{}, absTrack:{}, notes:[], tour:{}, seq:{case:111,form:1,aa:1,p:200},
  tl:{file:'TL_Waluj_joiners_2026-10-05.csv', imported:false, rows:[
   {name:'Ajinkya Lokhande',tl:'TR10498812',doj:'2026-10-05',mgr:'m3',line:'Frame Weld 2',course:'B.Voc Manufacturing'},
   {name:'Neha Shirsat',tl:'TR10498877',doj:'2026-10-05',mgr:'m4',line:'Packing L1',course:'B.Voc Logistics'}]},
  reg:{month:'Sep 2026', uploaded:false, rows:[]}};
 T.forEach((r,i)=>{
  const [id,name,type,mgr,doj,line,prof,rec,ab,la,streak,done,ck] = r;
  S.people[id] = {id,name,type,mgr,doj,line,prof,ck,ticket:'T'+(48200+i*37),tl:type==='WILP'?'TR10'+(496500+i*113):'',status:'Active',empClass:type==='WILP'?'Contingent worker (TeamLease)':'Trainee (TTA)'};
  S.people[id].gen = {ab,la,streak,s:i+7};
  S.sfLen[id] = rawOf(id, S).length - 2;
  S.dev[id] = {...rec, month:'Aug 2026', by:'Coordinator upload'};
  done.forEach(n=>{
   const cpDate = addM(d(doj), n);
   const cm = COMMENTS[ck];
   S.forms.push({id:'PF-'+(S.seq.form++), tid:id, cp:'M'+n, cpDate:cpDate.toISOString(), launched:new Date(cpDate.getTime()-7*DAY).toISOString(), status:'Completed',
     ratings:ratingsFor(prof,id,i*10+n,rec), strengths:cm[0], improve:cm[1], tech:'', beh:'', pri:'Medium', discussed:true, submitted:fmt(cpDate), signed:fmt(new Date(cpDate.getTime()+2*DAY)), by:MANAGERS[mgr].name});
  });
  // Sept register row (what coordinators will upload)
  const R = rng(i*31+5);
  const bump = (v,step) => v==null ? null : Math.round((v + (R()<.5?0:step))*10)/10;
  S.reg.rows.push({ticket:'T'+(48200+i*37), name, kz:bump(rec.kz,.3), opl:bump(rec.opl,.2), st:rec.st==null?null:rec.st+(R()<.4?1:0), jh:rec.jh, prod:bump(rec.prod,1), tr:rec.tr, ex:rec.ex});
 });
 S.reg.rows.push({ticket:'T99999', name:'(not found)', kz:1, opl:1, st:3, jh:1, prod:2, tr:0, ex:'none'});
 autoLaunch(S, true);
 // cases
 const C = (id,tid,k,date,time,place,desc,status,action,extra={}) => {
  const c = {id,tid,k,date,time,place,desc,other:'',evidence:extra.ev||[],reporter:extra.rep||'Security (line tablet)',status,channel:extra.ch||'Line tablet',steps:{reported:{by:extra.rep||'Security',at:fmt(d(date))}}};
  const at = n => fmt(new Date(d(date).getTime()+n*DAY));
  if(status>=2) c.steps.validated = {by:extra.val||'Shift-in-charge',at:at(1),remarks:extra.vr||'Confirmed with line supervisor.'};
  if(status>=3) c.steps.action = {by:'Dept head',at:at(2),label:action[0],level:action[1],reason:''};
  if(status>=4) c.steps.letter = {by:'Personnel',at:at(3),ack:true};
  if(status>=5){ c.steps.closed = {by:'Personnel',at:at(4),note:'Closed.'}; c.closedAt = new Date(d(date).getTime()+4*DAY).toISOString(); }
  S.cases.push(c);
 };
 C('C-101','t02','mob','2026-03-11','10:40','V-Line 1','Found using mobile phone during working hours in security round.',5,['VC / UR','vcur']);
 C('C-102','t02','mob','2026-06-18','15:05','V-Line 1','Second instance: mobile phone with earphones at stage during shift.',5,['Warning letter','wl']);
 C('C-103','t05','neg','2026-09-20','14:15','E-Line D','During model change did not check the piston as per model; after knowing it was wrong, did not inform anyone.',1,null,{rep:'S. Kulkarni (line manager)'});
 C('C-104','t06','sho','2026-03-02','08:20','Frame Weld 1','Found without safety shoes at the station.',5,['VC / UR','vcur']);
 C('C-105','t06','uni','2026-05-14','07:55','Main gate','Reported without uniform; sent home and marked absent.',5,['VC / UR','vcur']);
 C('C-106','t06','stg','2026-08-07','11:30','Frame Weld 1','Left stage for 40 minutes without approval.',5,['VC / UR','vcur']);
 C('C-107','t12','vrb','2026-09-29','16:10','E-Line 1','Verbal argument with senior operator; abusive language used.',2,null,{rep:'S. Kulkarni (line manager)',vr:'Two witnesses confirm abusive language.'});
 C('C-108','t10','acc','2026-07-22','13:00','Dispatch Bay 1','Minor cut on hand while opening packing strap. First aid given. Gloves were worn.',5,['Record only (no penalty)','none'],{rep:'M. Rao (line manager)'});
 C('C-109','t03','tob','2026-02-09','12:50','Canteen area','Found consuming tobacco on company premises.',5,['Warning letter','wl']);
 C('C-110','t03','cua','2026-05-04','09:00','\u2014','Absent without information for 5 continuous days. Day 4 call made, warning letter issued.',5,['Warning letter','wl']);
 // decisions
 S.decisions.t02 = {mgr:{agree:true,choice:null,reason:'',by:'R. Joshi',at:'25 Sept 10:12'}};
 S.decisions.t03 = {mgr:{agree:true,choice:null,reason:'',by:'R. Joshi',at:'25 Sept 10:20'}};
 S.decisions.t04 = {mgr:{agree:true,choice:null,reason:'',by:'M. Rao',at:'01 Oct 09:30'},hod:{choice:'Convert',reason:'B overall but steady rise from M6 to M12 and a clean conduct record.',by:'P. Iyer',at:'02 Oct 11:05'},hr:{choice:'Convert',by:'N. Sharma',at:'03 Oct 16:40'},ec:{at:'03 Oct 16:41',event:'Job change: Trainee \u2192 Permanent operator (effective 01 Nov 2026)'}};
 return S;
}
function autoLaunch(S, silent){
 const n = [];
 Object.values(S.people).filter(p=>p.status==='Active').forEach(p=>{
  const have = new Set(S.forms.filter(f=>f.tid===p.id).map(f=>f.cp));
  [3,6,9,12].forEach(m=>{
   const cp = 'M'+m; if(have.has(cp)) return;
   const cpDate = addM(d(p.doj), m), launch = new Date(cpDate.getTime()-S.cfg.launchBefore*DAY);
   const prevDone = m===3 || have.has('M'+(m-3));
   if(launch<=TODAY && prevDone){
    S.forms.push({id:'PF-'+(S.seq.form++), tid:p.id, cp, cpDate:cpDate.toISOString(), launched:launch.toISOString(), status:'Not started', ratings:{}, strengths:'', improve:'', tech:'', beh:'', pri:'Medium', by:MANAGERS[p.mgr].name});
    have.add(cp); n.push(p.name+' '+cp);
   }
  });
 });
 return n;
}

/* ======================= STATE ======================= */
let _len = null;
let S = seed();
const UI = {sys:'flow', page:{capture:'time', sf:'home', agent:'console'}, id:null, persona:'m3', drawer:null, pipe:{tid:null, step:0, timer:null}, toast:null, tab:{}};

function seedLog(){
 S.log = [];
 const L = (at,dir,from,to,what) => S.log.push({at,dir,from,to,what});
 L('05 Oct 23:00','sys','Scheduler','SF','Nightly checks: 3 forms auto-launched (Sagar Jadhav M9, Ganesh Wagh M9, Rohan Shinde M12 queued), 1 overdue reminder (Priya Deshmukh M3).');
 L('05 Oct 06:00','in','Time system','SF Attendance','Daily attendance file for 03 Oct: 14 trainees, 14 records accepted.');
 L('03 Oct 16:41','out','SF','EC Job info','Sneha Patil: job change Trainee \u2192 Permanent operator (effective 01 Nov 2026).');
 L('03 Oct 16:40','wf','Plant HR','SF Decision','Sneha Patil: final decision Convert.');
 L('02 Oct 11:05','wf','HoD','SF Decision','Sneha Patil: HoD decided Convert (agent said Refer to HoD).');
 L('01 Sept 09:00','in','Coordinators','SF Development record','August registers uploaded: 14 rows accepted.');
}

/* ======================= LOGIC ======================= */
function attStats(tid){
 const a = sfAttOf(tid);
 const work = a.filter(x=>x.s!=='W');
 const pres = work.filter(x=>x.s!=='A').length;
 const last30 = a.slice(-30).map(x=>x.s);
 let cont = 0; for(let i=a.length-1;i>=0;i--){ if(a[i].s==='W') continue; if(a[i].s==='A') cont++; else break; }
 return {sched:work.length, pres, pct: work.length ? pres/work.length*100 : 100, late30:last30.filter(x=>x==='L').length, abs30:last30.filter(x=>x==='A').length, last30, cont, syncedTo: a.length ? a[a.length-1].d : '\u2014'};
}
function rawOf(tid, st){ const P = (st||S).people[tid]; if(!P || !P.gen) return []; const k = tid+'|'+P.doj; if(!_raw[k]) _raw[k] = genAtt(d(P.doj), P.gen.ab, P.gen.la, P.gen.streak, P.gen.s); return _raw[k]; }
function sfAttOf(tid){ return rawOf(tid).slice(0, S.sfLen[tid] ?? 0); }
function pendingDays(tid){ return rawOf(tid).length - (S.sfLen[tid] ?? 0); }
function recPoints(p){
 const r = S.dev[p.id] || {}, C = S.cfg, out = {}, as = attStats(p.id);
 out[3] = {pts: as.pct>=C.attA?5:as.pct>=C.attB?3:1, val: pct(as.pct)+' ('+as.pres+'/'+as.sched+' days)'};
 const f = (id,v,fn,lab) => out[id] = (v===null||v===undefined) ? {missing:true} : {pts:fn(v),val:lab(v)};
 f(6,r.prod,v=>v>=10?5:v>0?3:1,v=>v+'% time reduction');
 f(8,r.jh,v=>v>=3?5:v===2?3:1,v=>v?('Step '+v):'No step');
 f(9,r.kz,v=>v>=2?5:v>=1?3:1,v=>v+' / month');
 f(10,r.st,v=>v>12?5:v>=3?3:1,v=>v+' stages');
 f(11,r.opl,v=>v>2?5:v>=1?3:1,v=>v+' / month');
 f(16,r.tr,v=>v>=4?5:v>=2?3:1,v=>v+' / month');
 f(17,r.ex,v=>v==='active'?5:v==='occasional'?3:1,v=>({active:'Active',occasional:'Occasional',none:'None'})[v]);
 return out;
}
function tapIds(p){ const rp = recPoints(p); return ATTRS.filter(a=>a.src==='mgr' || (a.src==='rec' && rp[a.id].missing)).map(a=>a.id); }
function conduct(tid, asOf){
 const lim = asOf ? new Date(asOf) : null;
 const cs = S.cases.filter(c=>c.tid===tid);
 const closed = cs.filter(c=>c.status===5 && (!lim || new Date(c.closedAt)<=lim));
 const lv = l => closed.filter(c=>c.steps.action && c.steps.action.level===l).length;
 const vcur = lv('vcur'), wl = lv('wl'), end = lv('end'), open = cs.filter(c=>c.status<5).length;
 const eff = wl + (vcur>=S.cfg.vcurAsWL ? 1 : 0);
 return {vcur,wl,end,open,eff,closed:closed.length, pts: end?1:(eff>=1?1:vcur>=1?3:5)};
}
const LEX = {
 pos:['excellent','very good','good','sincere','hardworking','hard working','quick learner','punctual','helpful','helps','dependable','reliable','disciplined','improving','improved','steady','team player','initiative','accha','achha','badhiya','mehnati','chan','hushar'],
 neg:['slow','careless','late','absent','mistake','mistakes','lazy','argues','argue','not follow','does not','needs follow-up','follow-up','poor','weak','mobile','casual','aalsi','kharab','dhyan nahi','galti'],
 red:['unsafe','fight','abuse','abusive','refuses','refused','tobacco','alcohol','drunk','theft','frequently absent','sleeping','safety violation']
};
const THEMES = {S:['safety','ppe','discipline','sop','rules','late','absent','mobile','tobacco','punctual'],P:['output','speed','target','slow','productivity'],Q:['quality','defect','torque','check','mistake','mistakes'],M:['learn','learner','kaizen','model','skill','train','new joiners'],B:['attitude','team','argues','seniors','cooperat','initiative','helps','dependable','sincere']};
function sentiment(a,b){
 const hits = {pos:[],neg:[],red:[]};
 const scan = (txt, w) => {
  let s = ' '+String(txt||'').toLowerCase()+' '; let score = 0;
  [...LEX.red.map(x=>['red',x]),...LEX.neg.map(x=>['neg',x]),...LEX.pos.map(x=>['pos',x])].sort((x,y)=>y[1].length-x[1].length).forEach(([k,x])=>{
   const re = new RegExp('(^|[^a-z])'+x.replace(/-/g,'\\-').replace(/ /g,'\\s+')+'(?=[^a-z]|$)','g');
   s = s.replace(re,(m,p)=>{ hits[k].push(x); score += k==='pos'?1:k==='red'?-2:-w; return p+' '.repeat(m.length-p.length); });
  });
  return score;
 };
 const net = scan(a,1)+scan(b,.5);
 const all = (String(a||'')+' '+String(b||'')).toLowerCase();
 const words = all.trim().split(/\s+/).filter(Boolean).length;
 const themes = Object.entries(THEMES).filter(([k,ws])=>ws.some(w=>all.includes(w))).map(([k])=>k);
 const label = net>=1.5?'Positive':net<=-1?'Negative':'Neutral';
 return {label, pts:label==='Positive'?5:label==='Negative'?1:3, net, hits, words, themes};
}
function highlight(txt, hits){
 let h = esc(txt); const done = new Set();
 [...hits.red.map(x=>['r',x]),...hits.neg.map(x=>['n',x]),...hits.pos.map(x=>['p',x])].sort((a,b)=>b[1].length-a[1].length).forEach(([c,x])=>{
  if(done.has(x)) return; done.add(x);
  const re = new RegExp('(^|[^a-zA-Z>])('+x.replace(/-/g,'\\-').replace(/ /g,'\\s+')+')(?=[^a-zA-Z<]|$)','gi');
  h = h.replace(re,(m,p,w)=>p+'<mark class="'+c+'">'+w+'</mark>');
 });
 return h;
}
function formsOf(tid){ return S.forms.filter(f=>f.tid===tid).sort((a,b)=>new Date(a.cpDate)-new Date(b.cpDate)); }
function lastSubmitted(tid){ const f = formsOf(tid).filter(f=>f.status==='With HoD'||f.status==='Completed'); return f[f.length-1]||null; }
function openForm(tid){ return formsOf(tid).find(f=>f.status==='Not started'||f.status==='In progress')||null; }
const RANK = {A:3,B:2,C:1};
function evaluate(p, f, opts={}){
 const C = S.cfg, rp = recPoints(p), cd = conduct(p.id, opts.asOf), sen = sentiment(f.strengths, f.improve);
 const rows = ATTRS.map(a=>{
  let pts, val='', src='';
  if(a.src==='mgr'){ pts=f.ratings[a.id]; src='Manager form'; }
  else if(a.src==='rec'){ const x = rp[a.id]; if(x.missing){ pts=f.ratings[a.id]; src='Manager (no record)'; } else { pts=x.pts; val=x.val; src=a.source; } }
  else if(a.src==='conduct'){ pts=cd.pts; src='Conduct cases'; val=cd.closed?(cd.wl+' WL, '+cd.vcur+' VC/UR'):'Clean'; }
  else { pts=sen.pts; src='Agent (AI)'; val=sen.label; }
  return {a,pts,val,src};
 });
 const bk = Object.keys(BUCKETS).map(b=>{ const rs = rows.filter(x=>x.a.b===b); const sum = rs.reduce((s,x)=>s+(x.pts||0),0), max = rs.length*5; return {b,w:Number(C.w[b])||0,sum,max,p:max?sum/max*100:0}; });
 const wsum = bk.reduce((s,x)=>s+x.w,0)||1;
 const overall = bk.reduce((s,x)=>s+x.w*x.p,0)/wsum;
 const band = overall>=C.bandA?'A':overall>=C.bandB?'B':'C';
 let fb = band, capped=false;
 if(cd.end) fb='X'; else if(cd.eff>=C.wlNotRec){ fb='C'; capped = band!=='C'; } else if(cd.eff>=1 && band==='A'){ fb='B'; capped=true; }
 const reasons = ['Overall '+pct(overall)+' \u2192 band '+band+' (A \u2265 '+C.bandA+'%, B \u2265 '+C.bandB+'%).'];
 if(cd.end) reasons.push('Gross misconduct closed with termination: training ended.');
 else if(cd.eff>=C.wlNotRec) reasons.push(cd.eff+' warning-level actions on record (limit '+C.wlNotRec+'): not recommended unless HoD and HR override with a reason.');
 else if(cd.eff===1) reasons.push((cd.wl?'1 warning letter / show cause / suspension':cd.vcur+' VC/UR across categories (treated as a warning letter)')+': band capped at B; HoD must review.');
 else if(cd.vcur) reasons.push(cd.vcur+' VC/UR on record (minor).'); else reasons.push('Clean conduct record.');
 if(cd.open) reasons.push(cd.open+' open case(s): not counted until closed; HoD to note.');
 reasons.push('Manager comment reads '+sen.label.toLowerCase()+'.');
 const weak = bk.filter(x=>x.b!=='C'&&x.p<50).map(x=>BUCKETS[x.b]); if(weak.length) reasons.push('Weak area(s): '+weak.join(', ')+'.');
 const strong = bk.filter(x=>x.b!=='C'&&x.p>=85).map(x=>BUCKETS[x.b]); if(strong.length) reasons.push('Strong area(s): '+strong.join(', ')+'.');
 let rec;
 if(cd.end) rec='Training ended'; else if(cd.eff>=C.wlNotRec || fb==='C') rec='Not recommended'; else if(fb==='A' && cd.eff===0 && !cd.open) rec='Recommend conversion'; else rec='Refer to HoD: convert or extend 3 months';
 const status = cd.end?'Training ended':(fb==='C'||cd.eff>=1||cd.open)?'At risk':'On track';
 const flags = [];
 const mv = ATTRS.filter(a=>a.src==='mgr').map(a=>f.ratings[a.id]).filter(Boolean); const avg = mv.reduce((s,v)=>s+v,0)/(mv.length||1);
 if(avg>=4.2 && sen.label==='Negative') flags.push(['bad','Rating\u2013comment mismatch','Ratings are high but the comment is negative.']);
 if(avg<=2.2 && sen.label==='Positive') flags.push(['warn','Rating\u2013comment mismatch','Ratings are low but the comment is positive.']);
 if(f.ratings[2]===5 && cd.eff>=1) flags.push(['bad','Rating\u2013conduct mismatch','Discipline rated 5 but the conduct log has warning-level action.']);
 if(f.ratings[2]===1 || f.ratings[5]===1) flags.push(['bad','Safety / discipline red flag','A 1-point score in Discipline or Safety & housekeeping.']);
 const len = !opts.noLen && leniency()[p.mgr]; if(len && len.flag) flags.push(['warn','Leniency',MANAGERS[p.mgr].name+' rates '+Math.round(len.share)+'% of reviewed trainees as A (limit '+C.leniency+'%).']);
 if(!opts.noPrev){ const prev = formsOf(p.id).filter(x=>(x.status==='Completed'||x.status==='With HoD') && new Date(x.cpDate)<new Date(f.cpDate)).pop(); if(prev){ const pe = evaluate(p, prev, {asOf:prev.cpDate,noPrev:true,noLen:true}); if(RANK[pe.band]>RANK[band]) flags.push(['warn','Sharp drop','Band fell from '+pe.band+' at '+prev.cp+' to '+band+'.']); } }
 if(sen.words<10) flags.push(['info','Thin comment','Only '+sen.words+' words; too short to judge the manager\u2019s view reliably.']);
 if(cd.open) flags.push(['info','Pending case',cd.open+' open case(s) in the conduct log.']);
 if((S.dev[p.id]||{}).jh===1) flags.push(['info','JH Step 1','Step 1 fits no level on the current form; scored 1 until TPM confirms.']);
 return {rows,bk,overall,band,fb,capped,cd,sen,rec,reasons,status,flags,rp};
}
function bandQuick(p,f){
 const C = S.cfg, rp = recPoints(p), cd = conduct(p.id, f.cpDate), sen = sentiment(f.strengths,f.improve);
 const pts = a => a.src==='mgr'?f.ratings[a.id]:a.src==='rec'?(rp[a.id].missing?f.ratings[a.id]:rp[a.id].pts):a.src==='conduct'?cd.pts:sen.pts;
 let ws=0,tot=0; Object.keys(BUCKETS).forEach(b=>{ const as=ATTRS.filter(a=>a.b===b); const p2=as.reduce((s,a)=>s+(pts(a)||0),0)/(as.length*5)*100; ws+=Number(C.w[b])||0; tot+=(Number(C.w[b])||0)*p2; });
 const o = tot/(ws||1); return o>=C.bandA?'A':o>=C.bandB?'B':'C';
}
function leniency(){
 if(_len) return _len; _len = {};
 Object.keys(MANAGERS).forEach(m=>{ const ps = Object.values(S.people).filter(p=>p.mgr===m && lastSubmitted(p.id)); const a = ps.filter(p=>bandQuick(p,lastSubmitted(p.id))==='A').length; const share = ps.length?a/ps.length*100:0; _len[m] = {n:ps.length,a,share,flag:ps.length>=3&&share>S.cfg.leniency}; });
 return _len;
}
function snapshot(p, f, e){ return {tid:p.id, formId:f.id, cp:f.cp, overall:e.overall, band:e.band, fb:e.fb, rec:e.rec, status:e.status, sen:e.sen.label, flags:e.flags.map(x=>x[1]), reasons:e.reasons, rules:RULES_VER}; }
function initAssess(silent){
 _len = null;
 Object.values(S.people).forEach(p=>{ const f = lastSubmitted(p.id); if(!f) return; const e = evaluate(p,f); S.assess[p.id] = {id:'AA-'+(S.seq.aa++), runAt:fmtS(new Date(new Date(f.cpDate).getTime()+DAY))+' 09:15', trigger:'Form submitted', ...snapshot(p,f,e)}; });
}
function assessState(p){
 const f = lastSubmitted(p.id); if(!f) return {state:'No form yet'};
 const a = S.assess[p.id];
 if(!a || a.formId!==f.id) return {state:'Queued', reason:S.triggers[p.id]||'New form submitted', f};
 const e = evaluate(p,f);
 if(Math.abs(e.overall-a.overall)>0.05 || e.fb!==a.fb || e.rec!==a.rec || e.flags.length!==a.flags.length) return {state:'Queued', reason:S.triggers[p.id]||'Input data changed since last run', f};
 return {state:'Up to date', f, a};
}
function queue(){ return Object.values(S.people).map(p=>({p,...assessState(p)})).filter(x=>x.state==='Queued'); }
function suggest(tid,k){ const m = MISK[k]; const prior = S.cases.filter(c=>c.tid===tid&&c.k===k&&c.status===5&&c.steps.action&&c.steps.action.level!=='none').length; const i = Math.min(prior,m.lad.length-1); return {label:m.lad[i][0],level:m.lad[i][1],prior,step:i+1,of:m.lad.length}; }
function log(dir,from,to,what){ S.log.unshift({at:stamp(),dir,from,to,what,ts:Date.now(),sim:curSim()}); if(S.log.length>80) S.log.length = 80; }
function persona(){ return PERSONAS.find(x=>x[0]===UI.persona); }
function prole(){ return persona()[2]; }
function myPeople(){ const [id,,r] = persona(); if(r==='manager') return Object.values(S.people).filter(p=>p.mgr===id); if(r==='hod') return Object.values(S.people).filter(p=>HODS[id].divs.includes(MANAGERS[p.mgr].div)); return Object.values(S.people); }
function hodOf(p){ return MANAGERS[p.mgr].hod; }
function absAlerts(){ return Object.values(S.people).filter(p=>p.status==='Active').map(p=>({p,a:attStats(p.id)})).filter(x=>x.a.cont>=4); }
function tick(k){ if(!S.tour[k]){ S.tour[k]=true; } }

/* ======================= UI BITS ======================= */
const bandChip = b => `<span class="band ${b||'X'}">${b==='X'||!b?'\u2014':b}</span>`;
function recChip(rec, short){ const c = rec==='Recommend conversion'?'good':(rec==='Not recommended'||rec==='Training ended')?'bad':'warn'; return `<span class="chip ${c}">${esc(short&&rec.startsWith('Refer')?'Refer to HoD':rec)}</span>`; }
function caseChip(c){ return `<span class="chip ${c.status===5?'good':c.status>=3?'info':'warn'}">${CSTATUS[c.status]}</span>`; }
function formChip(f){ const c = {Completed:'good','With HoD':'info','In progress':'warn','Not started':''}[f.status]; return `<span class="chip ${c}">${f.status}</span>`; }
function tierChip(t){ return t===0?'<span class="chip">No penalty</span>':`<span class="chip ${t===3?'bad':t===2?'warn':'info'}">Tier ${t} \u00b7 ${['','Minor','Serious','Gross'][t]}</span>`; }
const dirTxt = {in:'INBOUND',ag:'AGENT',out:'OUTBOUND',sys:'SCHEDULER',wf:'WORKFLOW'};
function toast(m){ UI.toast=m; $('#toast-root').innerHTML=`<div class="toast" role="status">${esc(m)}</div>`; clearTimeout(toast.t); toast.t=setTimeout(()=>{$('#toast-root').innerHTML='';},3400); }
function ids(p){ return `<span class="chip mono">Ticket ${esc(p.ticket)}</span>${p.tl?`<span class="chip mono">TeamLease ${esc(p.tl)}</span>`:''}<span class="chip ${p.type==='WILP'?'info':'acc'}">${p.type==='WILP'?'WILP (TeamLease)':'TTA (ITI)'}</span>`; }
function can(roles, what){ return roles.includes(prole()) ? '' : `disabled title="Switch persona to ${roles.map(r=>ROLE_TXT[r]).join(' or ')} to ${what}"`; }

/* ======================= TOP NAV ======================= */
const ART_URL = 'https://claude.ai/artifact/MUisYTGNhNx1akqfeneFhy';
const SIMS = {
 hub:{name:'Data flow hub',tag:'MAP',desc:'The whole chain on one screen, the live movement log and the walkthrough.'},
 time:{name:'Plant time system',tag:'SOURCE',desc:'Gate punches. Sends the daily attendance file to SF.'},
 registers:{name:'Register upload portal',tag:'SOURCE',desc:'TPM, IE and Training coordinators upload monthly registers.'},
 teamlease:{name:'TeamLease partner feed',tag:'SOURCE',desc:'Weekly joiner file creates WILP trainees in EC.'},
 tablet:{name:'Line tablet',tag:'SOURCE',desc:'Supervisor or security reports an incident from the line.'},
 sf:{name:'HR Suite (SF / EC stand-in)',tag:'CORE',desc:'People, appraisal forms, Team Rater, conduct cases, conversions, integration log.'},
 agent:{name:'Scoring agent',tag:'AI',desc:'Reads from SF, scores with fixed rules, reads comments, writes back.'}
};
function curSim(){ const h = (location.hash||'').slice(1); return SIMS[h] ? h : 'hub'; }
function renderTop(){
 const k = curSim(), m = SIMS[k], last = S.log[0], q = queue().length;
 const sb = store.mode==='db' ? '<span class="sync db" title="All simulators share one live store. Open other simulators in other tabs or devices.">LIVE · SHARED</span>' : store.mode==='local' ? '<span class="sync local" title="Shared store unavailable here; tabs in this browser still sync.">LOCAL · THIS BROWSER</span>' : '<span class="sync wait">CONNECTING</span>';
 $('#top').innerHTML = `<div class="brand"><span class="k" style="font:600 10px/1 var(--f-mono);letter-spacing:.06em;color:var(--top-muted);border:1px solid #3b4945;border-radius:4px;padding:3px 5px;margin-right:8px;vertical-align:3px">${m.tag}</span>${esc(m.name)}<small>Trainee data flow · simulator ${Object.keys(SIMS).indexOf(k)+1} of ${Object.keys(SIMS).length} · sample data</small></div>
  <label class="sr" for="simsel" style="position:absolute;left:-9999px">Switch simulator</label>
  <select id="simsel" class="simsel">${Object.entries(SIMS).map(([id,x])=>`<option value="${id}" ${id===k?'selected':''}>${x.tag==='MAP'?'':x.tag==='SOURCE'?'Source · ':x.tag==='CORE'?'Core · ':'Agent · '}${esc(x.name)}${id==='agent'&&q?' ('+q+' queued)':''}</option>`).join('')}</select>
  <span class="spacer"></span>
  ${last?`<span class="lastmove" title="${esc(last.what)}">Last movement ${esc(last.at)} · <b>${esc(last.from)} → ${esc(last.to)}</b></span>`:''}
  ${sb}
  <span class="clock">Plant date ${fmt(TODAY)}</span>`;
}

/* ======================= FLOW MAP ======================= */
function vFlow(){
 const hot = new Set(); S.log.slice(0,2).filter(l=>l.ts && Date.now()-l.ts < 45000).forEach(l=>{ hot.add(l.from); hot.add(l.to); });
 const H = (...k) => k.some(x=>[...hot].some(h=>h && h.startsWith(x))) ? 'hot' : '';
 const pend = Object.keys(S.people).reduce((s,k)=>s+(pendingDays(k)>0?1:0),0);
 const openF = S.forms.filter(f=>f.status==='Not started'||f.status==='In progress').length;
 const withHod = S.forms.filter(f=>f.status==='With HoD').length;
 const openC = S.cases.filter(c=>c.status<5).length;
 const q = queue().length;
 const m12 = Object.values(S.people).filter(p=>S.forms.some(f=>f.tid===p.id&&f.cp==='M12'&&f.status!=='Not started'&&f.status!=='In progress'));
 const pendDec = m12.filter(p=>!(S.decisions[p.id]&&S.decisions[p.id].hr)).length;
 const node = (go, cls, title, sub, feed) => `<button type="button" class="node ${cls}" data-go="${go}"><b>${title}</b><span>${sub}</span>${feed?`<div class="feed">${feed}</div>`:''}</button>`;
 const T = [
  ['t1','Send today\u2019s punches to SF','Capture \u203a Time system','capture:time'],
  ['t2','Upload September registers','Capture \u203a Coordinator uploads','capture:reg'],
  ['t3','Import new TeamLease joiners','Capture \u203a TeamLease feed','capture:tl'],
  ['t4','Report an incident from the line tablet','Capture \u203a Line tablet','capture:tablet'],
  ['t5','Rate your team in Team Rater (as A. Naik)','SF \u203a Performance','sf:rater'],
  ['t6','Run the agent on the queue','Agent \u203a Console','agent:console'],
  ['t7','Sign forms and decide as HoD (P. Iyer / D. Mehta)','SF \u203a Home','sf:home'],
  ['t8','Finalise a conversion as Plant HR \u2192 EC job change','SF \u203a Conversions','sf:conv'],
 ];
 const launch = portalCards();
 return `<div class="wrap">
 <section class="card" style="margin-bottom:16px"><h2>Stakeholder portals</h2>
  <p class="sub" style="margin-top:-6px">Each stakeholder has a separate link and login. Open them in separate browser windows: data entered in one portal appears in the others within a second.</p>
  ${launch}
  <div class="row" style="margin-top:12px"><button class="btn danger sm" data-act="reset" type="button">Reset demo data (all portals)</button></div>
 </section>
 <div class="head"><div><div class="eyebrow">How data moves</div><h1>From the shop floor to a conversion decision</h1><p>Plant systems capture the data. SF/EC holds it. The agent reads it, scores it with fixed rules and writes its analysis back. People decide in SF. Click any box to open that system; the most recent movement is highlighted.</p></div>
  <button class="btn" data-act="nightly" type="button">Run nightly checks</button></div>
 <div class="card" style="margin-bottom:16px"><div class="flow">
  <div class="col"><h3>1 \u00b7 Capture</h3>
   ${node('capture:time',H('Time system'),'Punch machines \u2192 time system','Daily attendance per trainee',`daily file \u2192 Attendance${pend?' \u00b7 '+pend+' pending':''}`)}
   ${node('capture:reg',H('Coordinators'),'TPM / IE / Training registers','Kaizen, OPL, skill matrix, JH, time study',`monthly upload \u2192 Development record${S.reg.uploaded?'':' \u00b7 Sep due'}`)}
   ${node('capture:tl',H('TeamLease'),'TeamLease (WILP)','New joiners, trainee codes',`weekly file \u2192 EC person${S.tl.imported?'':' \u00b7 2 waiting'}`)}
   ${node('capture:tablet',H('Line tablet'),'Line tablet / mobile','Supervisor or security reports an incident','real time \u2192 Conduct case')}
  </div>
  <div class="arrowcol" aria-hidden="true">\u2192</div>
  <div class="col"><div class="sfbox"><h3>2 \u00b7 SF / EC (system of record)</h3>
   ${node('sf:people',H('EC','SF'),'EC person record','One record, ticket no. + TeamLease code',Object.keys(S.people).length+' trainees')}
   ${node('sf:people',H('SF Attendance'),'Attendance (time data)','% present, late-ins, absence streak','synced to '+attStats('t01').syncedTo)}
   ${node('sf:people',H('SF Development'),'Development record (custom object)','Records-based attributes',S.reg.uploaded?'Sep 2026 loaded':'Aug 2026 loaded')}
   ${node('sf:cases',H('SF Conduct'),'Conduct cases (custom object)','5-step workflow',openC+' open')}
   ${node('sf:forms',H('SF Form','Manager form'),'Performance forms','Auto-launched at M3/6/9/12; manager \u2192 HoD',openF+' open \u00b7 '+withHod+' with HoD')}
  </div></div>
  <div class="arrowcol a2" aria-hidden="true">\u21c4</div>
  <div class="col c3"><h3>3 \u00b7 Agent</h3>
   ${node('agent:console',H('Agent'),'Agent (reads via API)','Rules score + AI reads comments',q?q+' queued':'queue empty')}
   ${node('agent:console',H('SF Assessment'),'Agent assessment (written back)','Score, band, reasons, flags',Object.keys(S.assess).length+' on file')}
   ${node('agent:rules','', 'Rule set','Weights, cut-offs, conduct cap',RULES_VER.split(' (')[0])}
  </div>
  <div class="arrowcol a3" aria-hidden="true">\u2192</div>
  <div class="col c4"><h3>4 \u00b7 Decide & act</h3>
   ${node('sf:home',H('HoD'),'HoD signs and decides','Sees agent analysis inside SF',withHod+' forms to sign')}
   ${node('sf:conv',H('Plant HR'),'Plant HR finalises','Every override logged',pendDec+' Month 12 pending')}
   ${node('sf:integ',H('EC Job'),'EC job change','Permanent / extension / exit','outbound event')}
  </div>
 </div></div>
 <div class="grid g2">
  <section class="card"><h2>Data movements</h2>${logTable(10)}<div class="row" style="margin-top:10px"><button class="btn sm" data-go="sf:integ" type="button">Full integration log</button></div></section>
  <section class="card"><h2>Walkthrough</h2><p class="sub" style="margin-top:-6px">Do these in order to see data travel end to end. Steps tick themselves when done.</p>
   <div class="tour">${T.map(([k,t,w,go],i)=>`<div class="ts ${S.tour[k]?'done':''}"><span class="n">${S.tour[k]?'\u2713':i+1}</span><div><b>${t}</b><span>${w}</span></div><button class="btn sm" type="button" data-go="${go}" ${k==='t5'?'data-persona="m3"':k==='t7'?'data-persona="h2"':k==='t8'?'data-persona="hr"':''}>Go</button></div>`).join('')}</div>
  </section>
 </div></div>`;
}
function logTable(n){
 const rows = n ? S.log.slice(0,n) : S.log;
 return `<div class="tw log"><table class="t"><thead><tr><th>When</th><th>Type</th><th>From \u2192 To</th><th>What moved</th></tr></thead><tbody>
 ${rows.map(l=>`<tr><td class="mono">${esc(l.at)}</td><td><span class="dir ${l.dir}">${dirTxt[l.dir]}</span></td><td style="white-space:nowrap">${esc(l.from)} \u2192 ${esc(l.to)}</td><td>${esc(l.what)}</td></tr>`).join('')}
 </tbody></table></div>`;
}

/* ======================= CAPTURE ======================= */
function cTime(){
 const ps = Object.values(S.people).filter(p=>p.status==='Active');
 const pend = ps.filter(p=>pendingDays(p.id)>0);
 const todayK = dateKey(TODAY), yK = dateKey(new Date(TODAY.getTime()-DAY));
 const rec = (p,k) => rawOf(p.id).find(x=>x.d===k) || {s:'\u2014'};
 return `<div class="head"><div><div class="eyebrow">Source system \u00b7 no manual entry</div><h1>Punch machines \u2192 plant time system</h1><p>Trainees punch in at the gate. Every morning at 06:00 the time system sends one file to SF with each trainee\u2019s status per day. The manager never types attendance.</p></div>
  <button class="btn pri" data-act="timesync" type="button" ${pend.length?'':'disabled'}>Send daily file to SF${pend.length?' ('+pend.length+' trainees, '+pendingDays(pend[0].id)+' days)':''}</button></div>
 <div class="terminal"><div class="hd"><span>TIME SYSTEM \u00b7 GATE PUNCHES \u00b7 WALUJ</span><span>SF synced up to ${esc(attStats('t01').syncedTo)}</span></div>
  <div style="overflow-x:auto"><table><thead><tr><th>Ticket</th><th>TeamLease</th><th>Name</th><th>${fmtS(new Date(TODAY.getTime()-DAY))}</th><th>${fmtS(TODAY)} (today)</th><th>In SF?</th></tr></thead><tbody>
  ${ps.map(p=>{ const y=rec(p,yK), t=rec(p,todayK); return `<tr><td>${esc(p.ticket)}</td><td>${esc(p.tl||'\u2014')}</td><td>${esc(p.name)}</td><td class="${y.s}">${y.s==='A'?'ABSENT':y.s==='W'?'OFF':esc((y.in||'')+' '+(y.s==='L'?'LATE':''))}</td><td class="${t.s}">${t.s==='A'?'ABSENT':t.s==='W'?'OFF':esc((t.in||'')+' '+(t.s==='L'?'LATE':''))}</td><td>${pendingDays(p.id)?'pending':'yes'}</td></tr>`; }).join('')}
  </tbody></table></div></div>
 <div class="note" style="margin-top:12px">What SF does with it: recalculates attendance % (attribute #3), late-ins, and the absence streak. A streak of 4+ working days raises the Day 4 alert (misconduct #9). If attendance points change, the agent re-scores that trainee.</div>`;
}
function cReg(){
 const R = S.reg, cols = [['kz','Kaizens / mo'],['opl','OPLs / mo'],['st','Stages'],['jh','JH step'],['prod','Time red. %'],['tr','Trained / mo'],['ex','Activities']];
 const known = new Set(Object.values(S.people).map(p=>p.ticket));
 return `<div class="head"><div><div class="eyebrow">Source \u00b7 TPM, IE and Training coordinators</div><h1>Monthly register upload</h1><p>Coordinators already keep these registers in Excel. Once a month they paste them into one template and upload it. SF rejects rows it cannot match, and blanks stay blank so the manager rates that attribute instead.</p></div>
  <button class="btn pri" data-act="regup" type="button" ${R.uploaded?'disabled':''}>${R.uploaded?'September uploaded':'Validate and upload to SF'}</button></div>
 <div class="file" style="margin-bottom:12px"><span class="ic">XLSX</span><div><b>Trainee_registers_${R.month.replace(' ','_')}.xlsx</b><div class="sub">${R.rows.length} rows \u00b7 edit any cell below before uploading</div></div></div>
 <div class="tw sheet"><table class="t"><thead><tr><th>Ticket</th><th>Name</th>${cols.map(c=>`<th class="r">${c[1]}</th>`).join('')}</tr></thead><tbody>
 ${R.rows.map((r,i)=>{ const bad = !known.has(r.ticket); return `<tr class="${bad?'bad':''}"><td class="mono">${esc(r.ticket)}${bad?'<div class="err">No such trainee in EC</div>':''}</td><td>${esc(r.name)}</td>${cols.map(([k])=>`<td><input aria-label="${esc(r.name)} ${k}" data-reg="${i}.${k}" value="${r[k]==null?'':esc(r[k])}" placeholder="blank" ${R.uploaded?'disabled':''}></td>`).join('')}</tr>`; }).join('')}
 </tbody></table></div>
 <div class="legend"><span>JH step 0\u20133 \u00b7 Activities: active / occasional / none \u00b7 blank = no record (manager rates)</span></div>`;
}
function cTL(){
 const T = S.tl;
 return `<div class="head"><div><div class="eyebrow">Source \u00b7 TeamLease</div><h1>TeamLease joiner feed</h1><p>WILP trainees are employed through TeamLease. Their weekly joiner file creates the person in EC with both IDs, so attendance, cases and forms all land on one record.</p></div>
  <button class="btn pri" data-act="tlimport" type="button" ${T.imported?'disabled':''}>${T.imported?'Imported':'Validate and import to EC'}</button></div>
 <div class="file" style="margin-bottom:12px"><span class="ic">CSV</span><div><b>${esc(T.file)}</b><div class="sub">Received ${fmt(new Date(TODAY.getTime()-DAY))} 18:30 \u00b7 SFTP</div></div></div>
 <div class="tw"><table class="t"><thead><tr><th>Name</th><th>TeamLease code</th><th>Date of joining</th><th>Line</th><th>Reporting manager</th><th>Course</th><th>Will create</th></tr></thead><tbody>
 ${T.rows.map(r=>`<tr><td class="name">${esc(r.name)}</td><td class="mono">${esc(r.tl)}</td><td>${fmt(d(r.doj))}</td><td>${esc(r.line)}</td><td>${esc(MANAGERS[r.mgr].name)}</td><td>${esc(r.course)}</td><td class="sub">EC person, Bajaj ticket no., M3 form on ${fmtS(addM(d(r.doj),3))}</td></tr>`).join('')}
 </tbody></table></div>`;
}
function cTablet(){
 const D = UI.tablet || (UI.tablet = {tid:'',k:'',place:'',desc:'',time:''});
 const p = D.tid ? S.people[D.tid] : null;
 const sg = (D.tid && D.k) ? suggest(D.tid, D.k) : null;
 return `<div class="head"><div><div class="eyebrow">Source \u00b7 supervisor or security</div><h1>Line tablet: report an incident</h1><p>Replaces the paper misconduct report and the TeamLease incident form. The report lands in SF as a conduct case and starts the 5-step workflow.</p></div></div>
 <div class="tablet"><div class="screen">
  <div class="bar2"><span>Incident report</span><span>${fmtS(TODAY)} \u00b7 Waluj</span></div>
  <div class="fld"><label for="tb-t">Trainee (scan ID card or pick)</label><select id="tb-t" data-tb="tid"><option value="">Select trainee</option>${Object.values(S.people).filter(x=>x.status==='Active').map(x=>`<option value="${x.id}" ${x.id===D.tid?'selected':''}>${esc(x.name)} \u00b7 ${x.ticket}${x.tl?' \u00b7 '+x.tl:''}</option>`).join('')}</select></div>
  ${p?`<div class="note"><div class="row" style="gap:6px">${ids(p)}</div><div style="margin-top:6px">${esc(MANAGERS[p.mgr].dept)} \u00b7 ${esc(p.line)} \u00b7 earlier cases: ${S.cases.filter(c=>c.tid===p.id).length}</div></div>`:''}
  <div class="fld"><label for="tb-k">What happened</label><select id="tb-k" data-tb="k"><option value="">Select</option>${[...new Set(MIS.map(m=>m.cat))].map(cat=>`<optgroup label="${esc(cat)}">${MIS.filter(m=>m.cat===cat).map(m=>`<option value="${m.k}" ${m.k===D.k?'selected':''}>${esc(m.name)}</option>`).join('')}</optgroup>`).join('')}</select></div>
  ${D.k?`<div class="row">${tierChip(MISK[D.k].tier)}${sg?`<span class="chip acc">Ladder step ${sg.step}: ${esc(sg.label)}</span>`:''}</div>`:''}
  <div class="fgrid"><div class="fld"><label for="tb-h">Time</label><input id="tb-h" type="time" data-tb="time" value="${esc(D.time)}"></div><div class="fld"><label for="tb-p">Place</label><input id="tb-p" data-tb="place" value="${esc(D.place||(p?p.line:''))}"></div></div>
  <div class="fld"><label for="tb-x">Description</label><textarea id="tb-x" data-tb="desc" placeholder="What was seen and by whom">${esc(D.desc)}</textarea></div>
  <div class="fld"><label for="tb-e">Photo / evidence</label><input id="tb-e" type="file" accept="image/*" multiple></div>
  <div class="err" id="tb-err"></div>
  <button class="btn pri" style="justify-content:center" data-act="tbsubmit" type="button">Submit to SF</button>
 </div></div>
 <p class="sub" style="text-align:center;margin-top:12px">Fallback for managers without SF access: the same tablet can hold a 2-minute review form that posts into the SF form. Shown here as an option, not the default.</p>`;
}

/* ======================= SF ======================= */
function vSF(){
 const pg = UI.page.sf, [pid,pname,pr] = persona();
 const nav = [['home','Home'],['people','People'],['forms','Performance forms'],['rater','Team Rater'],['cases','Conduct cases'],['conv','Conversions'],['integ','Integration Center']];
 const todo = todos().length;
 let body;
 if(pg==='home') body = sfHome(); else if(pg==='people') body = sfPeople(); else if(pg==='profile') body = sfProfile(UI.id); else if(pg==='forms') body = sfForms(); else if(pg==='form') body = sfForm(UI.id); else if(pg==='rater') body = sfRater(); else if(pg==='cases') body = sfCases(); else if(pg==='case') body = sfCase(UI.id); else if(pg==='conv') body = sfConv(); else body = sfInteg();
 const cur = ({profile:'people',form:'forms',case:'cases'})[pg]||pg;
 return `<div class="sf"><aside class="sfnav"><div class="tag"><b>HR Suite</b>Stands in for SF / EC \u00b7 simulated</div>
  <label for="persona">Logged in as</label>
  <select id="persona">${PERSONAS.map(([id,n,r])=>`<option value="${id}" ${id===pid?'selected':''}>${n} \u00b7 ${ROLE_TXT[r]}</option>`).join('')}</select>
  <nav aria-label="HR suite">${nav.map(([k,l])=>`<button type="button" data-go="sf:${k}" ${cur===k?'aria-current="page"':''}><span>${l}</span>${k==='home'&&todo?`<span class="cnt">${todo}</span>`:''}</button>`).join('')}</nav></aside>
  <div class="sfbody">${body}</div></div>`;
}
function todos(){
 const [pid,,r] = persona(), mine = new Set(myPeople().map(p=>p.id)), out = [];
 if(r==='manager'){
  S.forms.filter(f=>mine.has(f.tid)&&(f.status==='Not started'||f.status==='In progress')).forEach(f=>{ const p=S.people[f.tid]; const late = new Date(f.cpDate)<TODAY; out.push([late?'bad':'warn',`Complete ${f.cp} form: ${p.name}`,`${late?'Overdue since':'Due'} ${fmt(f.cpDate)} \u00b7 or use Team Rater`,'sf:form',f.id]); });
  S.cases.filter(c=>mine.has(c.tid)&&c.status===1).forEach(c=>out.push(['warn',`Validate ${c.id}: ${S.people[c.tid].name}`,MISK[c.k].name,'sf:case',c.id]));
  absAlerts().filter(x=>mine.has(x.p.id)).forEach(({p,a})=>out.push(['bad',`${p.name} absent ${a.cont} working days`,'Day 4: call / message and warning letter','sf:profile',p.id]));
  Object.values(S.people).filter(p=>mine.has(p.id)&&S.assess[p.id]&&S.assess[p.id].cp==='M12'&&!(S.decisions[p.id]&&S.decisions[p.id].mgr)).forEach(p=>out.push(['info',`Month 12 view needed: ${p.name}`,'Agree with the agent or override with a reason','sf:form',S.assess[p.id].formId]));
 }
 if(r==='hod'){
  S.forms.filter(f=>mine.has(f.tid)&&f.status==='With HoD').forEach(f=>{ const p=S.people[f.tid], a=S.assess[p.id]; out.push(['info',`Sign ${f.cp} form: ${p.name}`, a&&a.formId===f.id?`Agent: ${pct(a.overall)}, band ${a.fb==='X'?'\u2014':a.fb}${a.flags.length?', '+a.flags.length+' flag(s)':''}`:'Agent analysis pending','sf:form',f.id]); });
  S.cases.filter(c=>mine.has(c.tid)&&c.status===2).forEach(c=>out.push(['warn',`Decide action ${c.id}: ${S.people[c.tid].name}`,MISK[c.k].name,'sf:case',c.id]));
  Object.values(S.people).filter(p=>mine.has(p.id)&&S.decisions[p.id]&&S.decisions[p.id].mgr&&!S.decisions[p.id].hod).forEach(p=>out.push(['info',`Month 12 decision: ${p.name}`,'Manager has responded; HoD decides','sf:form',S.assess[p.id].formId]));
 }
 if(r==='hr'){
  S.cases.filter(c=>c.status===3||c.status===4).forEach(c=>out.push(['warn',`${c.status===3?'Issue letter':'Close case'} ${c.id}: ${S.people[c.tid].name}`,MISK[c.k].name,'sf:case',c.id]));
  Object.values(S.people).filter(p=>S.decisions[p.id]&&S.decisions[p.id].hod&&!S.decisions[p.id].hr).forEach(p=>out.push(['info',`Finalise Month 12: ${p.name}`,'HoD decided '+S.decisions[p.id].hod.choice,'sf:form',S.assess[p.id].formId]));
  absAlerts().forEach(({p,a})=>out.push(['bad',`${p.name} absent ${a.cont} working days`,'Continuous absence rule (#9)','sf:profile',p.id]));
  if(queue().length) out.push(['info',`${queue().length} trainee(s) waiting for the agent`,'Runs automatically on form submit; run now from the Agent console','agent:console','']);
 }
 return out;
}
function sfHome(){
 const [pid,pname,r] = persona(), T = todos();
 const mine = myPeople();
 return `<div class="head"><div><div class="eyebrow">${ROLE_TXT[r]}</div><h1>Good morning, ${esc(pname)}</h1><p>${r==='manager'?'Your trainees: '+mine.length+'. Forms open automatically 7 days before each checkpoint.':r==='hod'?'Trainees in '+HODS[pid].divs.join(' & ')+': '+mine.length+'.':'All trainees: '+mine.length+'.'}</p></div></div>
 <div class="grid g2"><section class="card"><h2>To do</h2><div class="todo">${T.length?T.map(([c,b,s,go,id])=>`<div class="it ${c}" role="button" tabindex="0" data-go="${go}" data-id="${id}"><div><b>${esc(b)}</b><span>${esc(s)}</span></div><span aria-hidden="true">\u203a</span></div>`).join(''):'<div class="empty">Nothing waiting for you.</div>'}</div></section>
 <section class="card"><h2>Your trainees</h2><div class="tw"><table class="t"><tbody>${mine.map(p=>{ const a=S.assess[p.id]; return `<tr class="click" data-go="sf:profile" data-id="${p.id}"><td class="name">${esc(p.name)}<div class="sub">${esc(p.line)}</div></td><td>${a?bandChip(a.fb):'<span class="sub">\u2014</span>'}</td><td>${a?`<span class="chip ${a.status==='On track'?'good':a.status==='At risk'?'warn':'bad'}">${a.status}</span>`:'<span class="sub">No review</span>'}</td></tr>`; }).join('')}</tbody></table></div></section></div>`;
}
function sfPeople(){
 return `<div class="head"><div><h1>People</h1><p>EC person records. WILP trainees come from the TeamLease feed; both IDs live on one record.</p></div></div>
 <div class="tw"><table class="t"><thead><tr><th>Name</th><th>IDs</th><th>Employee class</th><th>Manager</th><th>Joined</th><th class="r">Attendance</th><th>Dev. record</th><th>Agent</th></tr></thead><tbody>
 ${myPeople().map(p=>{ const a=attStats(p.id), as=S.assess[p.id], dv=S.dev[p.id]; return `<tr class="click" data-go="sf:profile" data-id="${p.id}"><td class="name">${esc(p.name)}${p.status!=='Active'?`<div class="sub">${esc(p.status)}</div>`:''}</td><td class="mono">${esc(p.ticket)}${p.tl?'<br>'+esc(p.tl):''}</td><td class="sub">${esc(p.empClass)}</td><td>${esc(MANAGERS[p.mgr].name)}</td><td>${fmtS(d(p.doj))}</td><td class="r num">${a.sched?pct(a.pct):'\u2014'}</td><td class="sub">${esc(dv.month||'none')}</td><td>${as?bandChip(as.fb):'<span class="sub">\u2014</span>'}</td></tr>`; }).join('')}
 </tbody></table></div>`;
}
function sfProfile(id){
 const p = S.people[id]; if(!p) return '';
 const a = attStats(id), dv = S.dev[id], rp = recPoints(p), cs = S.cases.filter(c=>c.tid===id), fs = formsOf(id), as = S.assess[id], st = assessState(p);
 return `<button class="btn sm" data-go="sf:people" type="button" style="margin-bottom:10px">\u2190 People</button>
 <div class="card" style="margin-bottom:16px"><div class="row" style="justify-content:space-between;align-items:flex-start">
  <div><div style="font:700 26px/1.05 var(--f-display)">${esc(p.name)}</div><div class="row" style="gap:6px;margin-top:8px">${ids(p)}</div></div>
  <dl class="kv"><dt>Employee class</dt><dd>${esc(p.empClass)}</dd><dt>Dept / line</dt><dd>${esc(MANAGERS[p.mgr].dept)} (${MANAGERS[p.mgr].div}) \u00b7 ${esc(p.line)}</dd><dt>Manager / HoD</dt><dd>${esc(MANAGERS[p.mgr].name)} / ${esc(HODS[hodOf(p)].name)}</dd><dt>Joined</dt><dd>${fmt(d(p.doj))}</dd><dt>Status</dt><dd>${esc(p.status)}</dd></dl>
 </div></div>
 <div class="grid g2"><div class="grid" style="align-content:start">
  <section class="card"><h2>Agent assessment</h2>${as?`<div class="row" style="gap:16px"><div class="big">${pct(as.overall)}</div>${bandChip(as.band)}${as.fb!==as.band?'\u2192 '+bandChip(as.fb):''}${recChip(as.cp==='M12'?as.rec:as.status,true)}</div>
   <p class="sub">${esc(as.id)} \u00b7 ${esc(as.cp)} form \u00b7 run ${esc(as.runAt)} \u00b7 ${esc(as.rules)}</p>
   <ul style="margin:6px 0 0;padding-left:18px">${as.reasons.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
   ${as.flags.length?`<div class="row" style="margin-top:8px">${as.flags.map(x=>`<span class="chip warn">${esc(x)}</span>`).join('')}</div>`:''}
   ${st.state==='Queued'?`<div class="flag info" style="margin-top:10px"><b>Out of date</b><span>${esc(st.reason)}. The agent will re-score on its next run.</span></div>`:''}
   <div class="row" style="margin-top:10px"><button class="btn sm" data-go="agent:console" data-id="${p.id}" type="button">Open in agent console</button>${as.cp==='M12'?`<button class="btn sm" data-go="sf:form" data-id="${as.formId}" type="button">Open M12 form & decision</button>`:''}</div>`:`<div class="empty">${st.state==='Queued'?'Waiting for the agent.':'No submitted form yet.'}</div>`}</section>
  <section class="card"><h2>Performance forms</h2>${fs.length?`<div class="tw"><table class="t"><tbody>${fs.map(f=>`<tr class="click" data-go="sf:form" data-id="${f.id}"><td>${f.cp}</td><td>${fmt(f.cpDate)}</td><td>${formChip(f)}</td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">First form launches '+fmt(new Date(addM(d(p.doj),3).getTime()-S.cfg.launchBefore*DAY))+'.</div>'}</section>
 </div><div class="grid" style="align-content:start">
  <section class="card"><h2>Attendance (from time system)</h2><div class="row"><span class="big" style="font-size:30px">${a.sched?pct(a.pct):'\u2014'}</span><span class="sub">${a.pres}/${a.sched} days \u00b7 synced to ${esc(a.syncedTo)}${pendingDays(id)?' \u00b7 '+pendingDays(id)+' day(s) not yet received':''}</span></div>
   ${a.cont>=4?`<div class="flag bad" style="margin-top:8px"><b>Absent ${a.cont} days in a row</b><span>Day 4 rule: call / message + warning letter.</span></div>`:''}
   <div class="strip" style="margin-top:8px">${a.last30.map(x=>`<i class="d-${x}"></i>`).join('')}${Array.from({length:pendingDays(id)}).map(()=>'<i class="d-Q" title="Not yet received"></i>').join('')}</div>
   <div class="legend"><span><i class="sw d-P"></i>Present</span><span><i class="sw d-L"></i>Late</span><span><i class="sw d-A"></i>Absent</span><span><i class="sw d-W"></i>Off</span><span><i class="sw d-Q"></i>Not yet in SF</span></div></section>
  <section class="card"><h2>Development record \u00b7 ${esc(dv.month||'none')}</h2><div class="tw"><table class="t"><tbody>${[6,8,9,10,11,16,17].map(i=>{ const at=ATTRS.find(x=>x.id===i), x=rp[i]; return `<tr><td>${esc(at.name)}</td><td>${x.missing?'<span class="tag">No record \u2014 manager rates</span>':esc(x.val)}</td><td class="r num">${x.missing?'\u2014':'<b>'+x.pts+'</b>'}</td></tr>`; }).join('')}</tbody></table></div></section>
  <section class="card"><h2>Conduct cases</h2>${cs.length?`<div class="tw"><table class="t"><tbody>${cs.map(c=>`<tr class="click" data-go="sf:case" data-id="${c.id}"><td class="mono">${c.id}</td><td>${esc(MISK[c.k].name)}<div class="sub">${fmt(d(c.date))}</div></td><td>${c.steps.action?esc(c.steps.action.label):caseChip(c)}</td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">No cases.</div>'}</section>
 </div></div>`;
}
function sfForms(){
 const mine = new Set(myPeople().map(p=>p.id));
 const fs = S.forms.filter(f=>mine.has(f.tid)).sort((a,b)=>({'Not started':0,'In progress':0,'With HoD':1,'Completed':2}[a.status]-{'Not started':0,'In progress':0,'With HoD':1,'Completed':2}[b.status]) || new Date(b.cpDate)-new Date(a.cpDate));
 return `<div class="head"><div><h1>Performance forms</h1><p>Template \u201cTrainee review (DTE to CT)\u201d. Route: Manager rates \u2192 HoD signs \u2192 Completed. Launched automatically ${S.cfg.launchBefore} days before each checkpoint.</p></div>${prole()==='manager'?'<button class="btn pri" data-go="sf:rater" type="button">Rate my team in one screen</button>':''}</div>
 <div class="tw"><table class="t"><thead><tr><th>Form</th><th>Trainee</th><th>Checkpoint date</th><th>Status</th><th>Agent</th></tr></thead><tbody>
 ${fs.map(f=>{ const p=S.people[f.tid], a=S.assess[p.id]; return `<tr class="click" data-go="sf:form" data-id="${f.id}"><td class="mono">${f.id} \u00b7 ${f.cp}</td><td class="name">${esc(p.name)}</td><td>${fmt(f.cpDate)}${(f.status==='Not started'||f.status==='In progress')&&new Date(f.cpDate)<TODAY?' <span class="chip bad">Overdue</span>':''}</td><td>${formChip(f)}</td><td>${a&&a.formId===f.id?bandChip(a.fb):'<span class="sub">\u2014</span>'}</td></tr>`; }).join('')||'<tr><td colspan="5" class="empty">No forms for this persona.</td></tr>'}
 </tbody></table></div>`;
}
function routeMap(f){
 const st = ['Manager rates','HoD signs','Completed'], cur = {'Not started':0,'In progress':0,'With HoD':1,'Completed':2}[f.status];
 return `<div class="route">${st.map((s,i)=>`${i?'<span aria-hidden="true" style="background:none;border:0;padding:0">\u2192</span>':''}<span class="${i<cur?'done':i===cur&&f.status!=='Completed'?'on':f.status==='Completed'?'done':''}">${s}</span>`).join('')}</div>`;
}
function formPts(p,f,a,rp,cd,sen){
 if(a.src==='mgr') return {pts:f.ratings[a.id], kind:'mgr'};
 if(a.src==='rec'){ const x = rp[a.id]; return x.missing ? {pts:f.ratings[a.id], kind:'mgr', missing:true} : {pts:x.pts, kind:'rec', val:x.val}; }
 if(a.src==='conduct') return {pts:cd.pts, kind:'rec', val: cd.closed ? (cd.wl+' WL, '+cd.vcur+' VC/UR'+(cd.open?', '+cd.open+' open':'')) : 'Clean'+(cd.open?' ('+cd.open+' open)':'')};
 const ok = f.strengths.trim() && f.improve.trim();
 return {pts: ok ? sen.pts : null, kind:'agent', val: ok ? sen.label : 'Filled from Section C'};
}
function sfForm(id){
 const f = S.forms.find(x=>x.id===id); if(!f) return '';
 const p = S.people[f.tid], rp = recPoints(p), cd = conduct(p.id), r = prole(), as = attStats(p.id), dv = S.dev[p.id];
 const editable = (f.status==='Not started'||f.status==='In progress') && r==='manager' && p.mgr===UI.persona;
 const sen = sentiment(f.strengths, f.improve);
 const taps = tapIds(p);
 const a = S.assess[p.id], aOk = a && a.formId===f.id;
 const e = (f.status==='With HoD'||f.status==='Completed') ? evaluate(p,f) : null;
 const leave = as.sched - as.pres;
 let total = 0, max = 0;
 const rows = Object.keys(BUCKETS).map(b=>{
  const at = ATTRS.filter(x=>x.b===b); let sub=0, subMax=0;
  const body = at.map(x=>{
   const fp = formPts(p,f,x,rp,cd,sen), ds = descOf(x);
   if(fp.pts){ sub += fp.pts; } subMax += 5;
   const isTap = fp.kind==='mgr';
   const cell = v => isTap
    ? (editable ? `<button type="button" class="opt" data-act="tapf" data-f="${f.id}" data-a="${x.id}" data-v="${v}" aria-pressed="${f.ratings[x.id]===v}"><b>${v}</b> · ${esc(ds['d'+v])}</button>`
                : `<div class="opt ${f.ratings[x.id]===v?'lock sel':'lock'}"><b>${v}</b> · ${esc(ds['d'+v])}</div>`)
    : `<div class="opt lock ${fp.pts===v?'sel':''}"><b>${v}</b> · ${esc(ds['d'+v])}</div>`;
   const srcTxt = fp.kind==='rec' ? (x.source||'Record')+': '+fp.val : fp.kind==='agent' ? (fp.pts ? 'Agent reads Section C: '+fp.val : 'Agent scores this once Section C is filled') : fp.missing ? 'No record found — rate manually' : 'Your rating';
   return `<tr class="${isTap?'mg':'rec'}"><td class="mono">${x.id}</td><td><div class="an">${esc(x.name)}</div><div class="aw">${esc(x.what)}</div><span class="src" ${fp.missing?'style="color:var(--warn)"':''}>${esc(srcTxt)}</span></td><td class="o">${cell(5)}</td><td class="o">${cell(3)}</td><td class="o">${cell(1)}</td><td class="pts">${fp.pts||'—'}</td></tr>`;
  }).join('');
  total += sub; max += subMax;
  return `<tr class="bh"><td colspan="6">${b} · ${BUCKETS[b]} · weight ${S.cfg.w[b]}%</td></tr>${body}<tr class="st"><td></td><td colspan="4">Subtotal ${BUCKETS[b]}</td><td class="pts" style="font-size:14px">${sub}/${subMax}</td></tr>`;
 }).join('');
 const done = taps.filter(i=>f.ratings[i]).length;
 const filled = {...f.ratings}; taps.forEach(i=>{ if(!filled[i]) filled[i]=3; });
 const prov = evaluate(p, {...f, ratings:filled}, {noPrev:true});
 const pri = (k,v) => `<select data-ff="${f.id}" data-k="${k}" ${editable?'':'disabled'} aria-label="Priority">${['High','Medium','Low'].map(o=>`<option ${v===o?'selected':''}>${o}</option>`).join('')}</select>`;
 return `<button class="btn sm" data-go="sf:forms" type="button" style="margin-bottom:10px">← Forms</button>
 <div class="head"><div><div class="eyebrow">${f.id} · Appraisal form for trainees (DTE to CT)</div><h1>${f.cp} review · ${esc(p.name)}</h1><p>All 19 attributes on one form. Rows marked in blue are filled from plant records or by the agent and are locked; teal rows are yours to rate.</p></div>${routeMap(f)}</div>
 <div class="grid g2" style="grid-template-columns:minmax(0,2.2fr) minmax(0,1fr)"><div class="grid" style="align-content:start">
  <section class="card"><h2>A · Trainee and period</h2>
   <dl class="kv" style="grid-template-columns:auto minmax(0,1fr) auto minmax(0,1fr)"><dt>Name</dt><dd>${esc(p.name)}</dd><dt>Ticket / TeamLease</dt><dd class="mono">${esc(p.ticket)}${p.tl?' / '+esc(p.tl):''}</dd>
   <dt>Department</dt><dd>${esc(MANAGERS[p.mgr].dept)} (${MANAGERS[p.mgr].div}) · ${esc(p.line)}</dd><dt>Category</dt><dd>${esc(p.empClass)}</dd>
   <dt>Date of joining</dt><dd>${fmt(d(p.doj))}</dd><dt>Appraisal period</dt><dd>${fmt(d(p.doj))} – ${fmt(f.cpDate)}</dd>
   <dt>Appraiser</dt><dd>${esc(MANAGERS[p.mgr].name)}</dd><dt>Reviewing officer</dt><dd>${esc(HODS[hodOf(p)].name)}</dd></dl>
   <h3>Man-days information (from records)</h3>
   <div class="mdays"><div><b>${as.sched}</b><span>Scheduled working days</span></div><div><b>${as.pres}</b><span>Days present</span></div><div><b>${leave}</b><span>Leave / WP / absent</span></div><div><b>${as.late30}</b><span>Late-ins, last 30 days</span></div><div><b>${dv.kz??'—'}</b><span>Kaizens per month</span></div><div><b>${dv.opl??'—'}</b><span>One-point lessons / month</span></div></div>
  </section>
  <section class="card"><h2>B · Attributes (${ATTRS.length})</h2>
   <p class="sub" style="margin-top:-6px">Score each attribute 5, 3 or 1. ${taps.length} need your rating; the other ${ATTRS.length-taps.length} come from the time system, registers, conduct log and the agent.</p>
   <div class="tw"><table class="t af"><thead><tr><th>#</th><th>Attribute</th><th>5 points</th><th>3 points</th><th>1 point</th><th class="r">Pts</th></tr></thead><tbody>${rows}
   <tr class="bh"><td colspan="5">Total</td><td class="pts" style="font-size:15px;color:var(--ink)">${total}/${max}</td></tr></tbody></table></div>
  </section>
  <section class="card"><h2>C · Evaluation of performance during the period</h2><div class="fgrid">
   <div class="fld full"><label for="ff-s">Key strengths and achievements</label><textarea id="ff-s" data-ff="${f.id}" data-k="strengths" ${editable?'':'disabled'} placeholder="What does this trainee do well? Hindi, Marathi or English.">${esc(f.strengths)}</textarea></div>
   <div class="fld full"><label for="ff-i">Areas to improve</label><textarea id="ff-i" data-ff="${f.id}" data-k="improve" ${editable?'':'disabled'} placeholder="Be specific: what, how often, what you want to see.">${esc(f.improve)}</textarea></div>
  </div><p class="sub" style="margin-bottom:0">The agent reads both boxes to score attribute #18.</p></section>
  <section class="card"><h2>D · Training needs</h2>
   <div class="tw"><table class="t"><thead><tr><th>Type</th><th>Training need</th><th>Priority</th></tr></thead><tbody>
    <tr><td>Technical</td><td><input class="mono" style="width:100%;border:1px solid var(--line);border-radius:6px;padding:6px 8px;background:var(--surface)" data-ff="${f.id}" data-k="tech" value="${esc(f.tech)}" ${editable?'':'disabled'} placeholder="e.g. Torque tool calibration" aria-label="Technical training need"></td><td>${pri('techPri',f.techPri||'Medium')}</td></tr>
    <tr><td>Behavioural</td><td><input class="mono" style="width:100%;border:1px solid var(--line);border-radius:6px;padding:6px 8px;background:var(--surface)" data-ff="${f.id}" data-k="beh" value="${esc(f.beh)}" ${editable?'':'disabled'} placeholder="e.g. Communication with seniors" aria-label="Behavioural training need"></td><td>${pri('behPri',f.behPri||'Medium')}</td></tr>
   </tbody></table></div></section>
  <section class="card"><h2>E · Sign-off</h2><div class="sign">
   <div><h4>Appraisee</h4>${f.discussed?'<span class="chip good">Review discussed with trainee</span>':editable?`<label class="row" style="font-size:13px"><input type="checkbox" data-ffc="${f.id}" data-k="discussed"> I have discussed this review with the trainee</label>`:'<span class="sub">Not yet discussed</span>'}</div>
   <div><h4>Appraiser</h4>${f.submitted?`<b>${esc(MANAGERS[p.mgr].name)}</b><div class="sub">${esc(f.submitted)}</div>`:'<span class="sub">Signs on sending</span>'}</div>
   <div><h4>Reviewing officer</h4>${f.signed?`<b>${esc(HODS[hodOf(p)].name)}</b><div class="sub">${esc(f.signed)}</div>`:'<span class="sub">HoD signs after review</span>'}</div>
  </div></section>
 </div><div class="grid" style="align-content:start">
  <section class="card sticky" style="position:sticky;top:76px">${editable?`<h2>Your progress</h2>
   <div class="row" style="gap:12px"><div class="big">${done}/${taps.length}</div><span class="sub">ratings done</span></div>
   <h3>Provisional score</h3><div class="row" style="gap:10px"><b class="num" style="font-size:20px">${pct(prov.overall)}</b>${bandChip(prov.fb)}<span class="sub">${done<taps.length?'untapped counted as 3':''}</span></div>
   ${prov.bk.map(x=>`<div class="bucket" style="grid-template-columns:110px minmax(0,1fr) 38px"><span>${BUCKETS[x.b]}</span><div class="bar"><i style="width:${x.p}%"></i></div><span class="num">${Math.round(x.p)}%</span></div>`).join('')}
   <p class="sub">Comment reads ${f.strengths.trim()&&f.improve.trim()?sen.label.toLowerCase():'— (fill Section C)'} · ${sen.words} words</p>
   <div class="err" id="ff-err"></div><button class="btn pri" style="width:100%;justify-content:center" data-act="sendhod" data-id="${f.id}" type="button">Sign and send to HoD</button>
   <p class="sub" style="margin-bottom:0">Sends to ${esc(HODS[hodOf(p)].name)} and queues the agent.</p>`:
   f.status==='Not started'||f.status==='In progress'?`<h2>Waiting for appraiser</h2><p class="sub">Switch persona to ${esc(MANAGERS[p.mgr].name)} to fill this form.</p>`:
   `<h2>Agent analysis</h2>${aOk?`<div class="row" style="gap:14px"><div class="big">${pct(a.overall)}</div>${bandChip(a.band)}${a.fb!==a.band?'→ '+bandChip(a.fb):''}</div><p class="sub">${esc(a.id)} · run ${esc(a.runAt)}</p>
    ${e.flags.map(([c,h,s2])=>`<div class="flag ${c==='warn'?'':c}"><b>${esc(h)}</b><span>${esc(s2)}</span></div>`).join('')}
    <h3>Comment · ${e.sen.label}</h3><div class="quote">${highlight(f.strengths,e.sen.hits)}</div><div class="quote">${highlight(f.improve,e.sen.hits)}</div>`:'<div class="flag info"><b>Agent pending</b><span>Queued. Run it from the Agent console.</span></div>'}
    ${f.status==='With HoD'?`<button class="btn pri" style="width:100%;justify-content:center;margin-top:12px" data-act="signform" data-id="${f.id}" type="button" ${prole()==='hod'&&hodOf(p)===UI.persona?'':`disabled title="Switch persona to ${esc(HODS[hodOf(p)].name)} (HoD) to sign"`}>Sign as reviewing officer</button>`:`<p class="sub" style="margin-top:10px">Signed ${esc(f.signed||'')}.</p>`}`}
  </section>
  ${f.cp==='M12' && aOk ? decisionCard(p,a) : ''}
 </div></div>`;
}
function decisionCard(p,a){
 const dc = S.decisions[p.id]||{}, opts=['Convert','Extend 3 months','Do not convert'];
 const agentMap = a.rec==='Recommend conversion'?'Convert':(a.rec==='Not recommended'||a.rec==='Training ended')?'Do not convert':null;
 const isMgr = prole()==='manager'&&p.mgr===UI.persona, isHod = prole()==='hod'&&hodOf(p)===UI.persona, isHr = prole()==='hr';
 return `<section class="card"><h2>Month 12 conversion</h2><div class="grid">
  <div class="dstep done"><h4>1 \u00b7 Agent</h4>${recChip(a.rec)}<span class="sub">${pct(a.overall)}, band ${a.fb==='X'?'\u2014':a.fb}</span></div>
  <div class="dstep ${dc.mgr?'done':''}"><h4>2 \u00b7 Manager</h4>${dc.mgr?`<span>${dc.mgr.agree?'Agreed with agent':'Override: '+esc(dc.mgr.choice)}</span>${dc.mgr.reason?`<span class="sub">${esc(dc.mgr.reason)}</span>`:''}<span class="sub">${esc(dc.mgr.by)} \u00b7 ${esc(dc.mgr.at)}</span>`:
   isMgr?`<div class="fld"><label for="dm-c">Your view</label><select id="dm-c"><option value="agree">Agree with agent</option>${opts.map(o=>`<option>${o}</option>`).join('')}</select></div><div class="fld"><label for="dm-r">Reason (if override)</label><textarea id="dm-r" rows="2"></textarea></div><button class="btn pri sm" data-act="dmgr" data-id="${p.id}" type="button">Submit</button>`:`<span class="sub">Waiting for ${esc(MANAGERS[p.mgr].name)}.</span>`}</div>
  <div class="dstep ${dc.hod?'done':''}"><h4>3 \u00b7 HoD</h4>${dc.hod?`<span><b>${esc(dc.hod.choice)}</b></span>${dc.hod.reason?`<span class="sub">${esc(dc.hod.reason)}</span>`:''}<span class="sub">${esc(dc.hod.by)} \u00b7 ${esc(dc.hod.at)}</span>`:
   !dc.mgr?'<span class="sub">Waiting for manager.</span>':isHod?`<div class="fld"><label for="dh-c">Decision</label><select id="dh-c">${opts.map(o=>`<option ${o===(agentMap||'Extend 3 months')?'selected':''}>${o}</option>`).join('')}</select></div><div class="fld"><label for="dh-r">Reason${agentMap?' (if different from agent)':''}</label><textarea id="dh-r" rows="2"></textarea></div><button class="btn pri sm" data-act="dhod" data-id="${p.id}" type="button">Approve</button>`:`<span class="sub">Waiting for ${esc(HODS[hodOf(p)].name)}.</span>`}</div>
  <div class="dstep ${dc.hr?'done':''}"><h4>4 \u00b7 Plant HR \u2192 EC</h4>${dc.hr?`<span><b>Final: ${esc(dc.hr.choice)}</b></span><span class="sub">${esc(dc.hr.by)} \u00b7 ${esc(dc.hr.at)}</span>${dc.ec?`<span class="chip good">EC: ${esc(dc.ec.event)}</span>`:''}`:
   !dc.hod?'<span class="sub">Waiting for HoD.</span>':isHr?`<span class="sub">Confirm: <b>${esc(dc.hod.choice)}</b>. This sends a job change to EC.</span><button class="btn pri sm" data-act="dhr" data-id="${p.id}" type="button">Confirm and update EC</button>`:'<span class="sub">Waiting for Plant HR.</span>'}</div>
 </div></section>`;
}
function sfRater(){
 if(prole()!=='manager') return `<div class="head"><div><h1>Team Rater</h1><p>Team Rater is the appraiser’s view. Switch persona to a line manager (A. Naik has the most open forms).</p></div></div>`;
 const fs = S.forms.filter(f=>(f.status==='Not started'||f.status==='In progress') && S.people[f.tid].mgr===UI.persona);
 const groups = Object.keys(BUCKETS).map(b=>({b, at:ATTRS.filter(x=>x.b===b)}));
 return `<div class="head"><div><h1>Team Rater</h1><p>All ${ATTRS.length} attributes for every open form on one screen. Teal cells are yours to tap (hover for the 5 / 3 / 1 meaning); grey cells come from records or the agent. Open the full form for descriptions, comments and sign-off.</p></div></div>
 ${fs.length?`<div class="tw"><table class="t rater"><thead>
  <tr><th rowspan="2">Trainee</th>${groups.map(g=>`<th colspan="${g.at.length}" style="text-align:center;border-left:1px solid var(--line)">${g.b} · ${BUCKETS[g.b]}</th>`).join('')}<th rowspan="2">Comments</th><th rowspan="2"></th></tr>
  <tr>${groups.map(g=>g.at.map((a,i)=>`<th title="${esc(a.name)}" style="${i===0?'border-left:1px solid var(--line);':''}font-size:10.5px">#${a.id}<br>${esc(a.short||a.name)}</th>`).join('')).join('')}</tr></thead><tbody>
 ${fs.map(f=>{ const p=S.people[f.tid], taps=tapIds(p), rp=recPoints(p), cd=conduct(p.id), sen=sentiment(f.strengths,f.improve); const done = taps.filter(i=>f.ratings[i]).length; const cm = f.strengths.trim()&&f.improve.trim();
  return `<tr><td><span class="name">${esc(p.name)}</span><div class="sub">${f.cp} · ${fmtS(f.cpDate)}</div><button class="btn sm" style="margin-top:4px" data-go="sf:form" data-id="${f.id}" type="button">Full form</button></td>
   ${groups.map(g=>g.at.map((a,i)=>{ const fp = formPts(p,f,a,rp,cd,sen); const bl = i===0?'style="border-left:1px solid var(--line)"':'';
    if(fp.kind==='mgr'){ const ds = descOf(a); return `<td ${bl}><span class="tri">${[5,3,1].map(v=>`<button type="button" data-act="tapf" data-f="${f.id}" data-a="${a.id}" data-v="${v}" aria-pressed="${f.ratings[a.id]===v}" title="${esc(a.name)}: ${v} = ${esc(ds['d'+v])}" aria-label="${esc(a.name)} ${v}">${v}</button>`).join('')}</span>${fp.missing?'<div class="tag">no record</div>':''}</td>`; }
    return `<td ${bl} title="${esc(a.name)}: ${esc(fp.val||'')}"><span class="chip" style="font-family:var(--f-mono)">${fp.pts||'—'}</span><div class="na">${fp.kind==='agent'?'agent':'record'}</div></td>`; }).join('')).join('')}
   <td><button class="btn sm" data-act="cmt" data-id="${f.id}" type="button">${cm?'Edit':'Add'}</button>${f.discussed?'<div class="na">discussed ✓</div>':''}</td>
   <td><span class="sub">${done}/${taps.length}</span> <button class="btn pri sm" data-act="sendhod" data-id="${f.id}" type="button" ${done===taps.length&&cm&&f.discussed?'':'disabled title="Rate all, add both comments and confirm discussion first"'}>Send</button></td></tr>`; }).join('')}
 </tbody></table></div><p class="sub">Each row is the same SF form the appraiser could open one by one. Sending moves it to the HoD and queues the agent.</p>`:'<div class="card empty">No open forms for your team.</div>'}`;
}
function sfCases(){
 const mine = new Set(myPeople().map(p=>p.id));
 const cs = S.cases.filter(c=>mine.has(c.tid)).sort((a,b)=>(a.status===5)-(b.status===5) || d(b.date)-d(a.date));
 return `<div class="head"><div><h1>Conduct cases</h1><p>Custom object. Created from the line tablet; one record per case with a 5-step workflow. Only closed cases count in the conduct score.</p></div><button class="btn" data-go="capture:tablet" type="button">Open line tablet</button></div>
 <div class="tw"><table class="t"><thead><tr><th>Case</th><th>Date</th><th>Trainee</th><th>Type</th><th>Status</th><th>Outcome</th></tr></thead><tbody>
 ${cs.map(c=>`<tr class="click" data-go="sf:case" data-id="${c.id}"><td class="mono">${c.id}</td><td>${fmtS(d(c.date))}</td><td class="name">${esc(S.people[c.tid].name)}</td><td>${esc(MISK[c.k].name)}<div class="sub">${tierChip(MISK[c.k].tier)}</div></td><td>${caseChip(c)}</td><td>${c.steps.action?esc(c.steps.action.label):'\u2014'}</td></tr>`).join('')}
 </tbody></table></div>`;
}
function sfCase(id){
 const c = S.cases.find(x=>x.id===id); if(!c) return '';
 const p = S.people[c.tid], m = MISK[c.k], sg = suggest(c.tid,c.k), r = prole();
 const step = (n,t,body,meta) => `<div class="step ${c.status>=n?'done':c.status===n-1?'cur':''}"><div class="dot">${c.status>=n?'\u2713':n}</div><div><h4>${t}</h4>${meta?`<div class="meta">${meta}</div>`:''}${c.status===n-1?body:''}</div></div>`;
 const lvl = c.steps.action ? c.steps.action.level : sg.level;
 return `<button class="btn sm" data-go="sf:cases" type="button" style="margin-bottom:10px">\u2190 Conduct cases</button>
 <div class="head"><div><div class="eyebrow">${c.id} \u00b7 via ${esc(c.channel)}</div><h1>${esc(m.name)}</h1><p>${esc(p.name)} \u00b7 ${fmt(d(c.date))} ${esc(c.time)} \u00b7 ${esc(c.place)}</p></div><div class="row">${tierChip(m.tier)}${caseChip(c)}</div></div>
 <div class="grid g2"><section class="card"><h2>Details</h2><dl class="kv"><dt>Trainee</dt><dd><div class="row" style="gap:6px">${ids(p)}</div></dd><dt>Reported by</dt><dd>${esc(c.reporter)}</dd><dt>Description</dt><dd>${esc(c.desc)}</dd><dt>Evidence</dt><dd>${c.evidence.length?c.evidence.map(esc).join(', '):'<span class="sub">None</span>'}</dd><dt>Ladder</dt><dd>${m.lad.map((l,i)=>`<span class="chip ${i===sg.step-1&&c.status<3?'acc':''}" style="margin:0 4px 4px 0">${i+1}. ${esc(l[0])}</span>`).join('')}</dd></dl></section>
 <section class="card"><h2>Workflow</h2><div class="steps">
  ${step(1,'Reported','',`${esc(c.steps.reported.by)} \u00b7 ${esc(c.steps.reported.at)}`)}
  ${step(2,'Validated',`<div class="fld" style="margin-top:8px"><label for="cv-r">Validator remarks</label><textarea id="cv-r"></textarea></div><div class="row" style="margin-top:8px"><button class="btn pri sm" data-act="cvalid" data-id="${c.id}" type="button" ${can(['manager','hod'],'validate')}>Validate</button><button class="btn sm danger" data-act="cnot" data-id="${c.id}" type="button" ${can(['manager','hod'],'close it')}>Not substantiated</button></div><div class="err" id="cv-e"></div>`, c.steps.validated?`${esc(c.steps.validated.by)} \u00b7 ${esc(c.steps.validated.at)} \u00b7 \u201c${esc(c.steps.validated.remarks)}\u201d`:'Line manager or shift-in-charge')}
  ${step(3,'Action decided',`<div class="note" style="margin-top:8px">Ladder suggests <b>${esc(sg.label)}</b> (step ${sg.step} of ${sg.of}).</div><div class="fld" style="margin-top:8px"><label for="ca-a">Action</label><select id="ca-a">${ACTIONS.map(([l,v])=>`<option ${v===sg.level&&l!=='Show cause notice'&&l!=='Suspension'?'selected':''}>${l}</option>`).join('')}</select></div><div class="fld" style="margin-top:8px"><label for="ca-r">Reason (if different)</label><textarea id="ca-r"></textarea></div><button class="btn pri sm" style="margin-top:8px" data-act="caction" data-id="${c.id}" type="button" ${can(['hod','hr'],'decide')}>Record action</button><div class="err" id="ca-e"></div>`, c.steps.action?`<b>${esc(c.steps.action.label)}</b> \u00b7 ${esc(c.steps.action.by)} \u00b7 ${esc(c.steps.action.at)}`:'HoD / Personnel')}
  ${step(4,'Letter issued', lvl==='none'?`<button class="btn pri sm" style="margin-top:8px" data-act="cletter" data-id="${c.id}" type="button" ${can(['hr'],'continue')}>No letter needed \u2014 continue</button>`:`<div class="letter" style="margin-top:8px">${esc(letter(c,p))}</div><button class="btn pri sm" style="margin-top:8px" data-act="cletter" data-id="${c.id}" type="button" ${can(['hr'],'issue the letter')}>Mark issued</button>`, c.steps.letter?`${esc(c.steps.letter.by)} \u00b7 ${esc(c.steps.letter.at)}`:'Personnel / TeamLease legal')}
  ${step(5,'Closed',`<button class="btn pri sm" style="margin-top:8px" data-act="cclose" data-id="${c.id}" type="button" ${can(['hr'],'close')}>Close case</button>`, c.steps.closed?`${esc(c.steps.closed.by)} \u00b7 ${esc(c.steps.closed.at)} \u00b7 counts in conduct score; agent re-scores`:'Counts in the conduct score once closed')}
 </div></section></div>`;
}
function letter(c,p){
 const a = c.steps.action || {label:'Warning letter',level:'wl'};
 return `${a.level==='end'?'TERMINATION OF TRAINING':a.level==='vcur'?'RECORD OF COUNSELLING / UNDERTAKING':a.label.toUpperCase()}
Ref ${c.id} \u00b7 ${fmt(TODAY)}
To: ${p.name}, Ticket ${p.ticket}${p.tl?', TeamLease '+p.tl:''}
On ${fmt(d(c.date))} at ${c.place}: ${MISK[c.k].name.toLowerCase()}.
${a.level==='end'?'Training is discontinued. Return ID card, punch card and bus pass.':a.level==='vcur'?'You were counselled and gave a written undertaking.':'Any repetition will lead to discontinuation of training.'}
Personnel Dept.${p.type==='WILP'?' \u00b7 Copy: TeamLease (Annexure 2)':''}`;
}
function sfConv(){
 const ps = Object.values(S.people).filter(p=>S.assess[p.id]&&S.assess[p.id].cp==='M12');
 return `<div class="head"><div><h1>Conversions</h1><p>Month 12 trainees: agent recommendation, manager view, HoD decision, HR final, and the EC job change it triggers.</p></div></div>
 <div class="tw"><table class="t"><thead><tr><th>Trainee</th><th>Agent</th><th>Manager</th><th>HoD</th><th>HR final</th><th>EC event</th></tr></thead><tbody>
 ${ps.map(p=>{ const a=S.assess[p.id], dc=S.decisions[p.id]||{}; return `<tr class="click" data-go="sf:form" data-id="${a.formId}"><td class="name">${esc(p.name)}</td><td>${recChip(a.rec,true)}<div class="sub">${pct(a.overall)}</div></td><td>${dc.mgr?(dc.mgr.agree?'Agreed':'Override: '+esc(dc.mgr.choice)):'<span class="sub">Pending</span>'}</td><td>${dc.hod?esc(dc.hod.choice):'<span class="sub">Pending</span>'}</td><td>${dc.hr?'<b>'+esc(dc.hr.choice)+'</b>':'<span class="sub">Pending</span>'}</td><td class="sub">${dc.ec?esc(dc.ec.event):'\u2014'}</td></tr>`; }).join('')}
 </tbody></table></div>`;
}
function sfInteg(){
 const jobs = [
  ['Daily attendance import','Time system \u2192 SF Attendance','Daily 06:00','timesync'],
  ['TeamLease joiner import','TeamLease SFTP \u2192 EC person','Weekly, Mon 07:00','tlimport'],
  ['Register upload','Coordinators \u2192 Development record','Monthly, by 5th','go:capture:reg'],
  ['Nightly checks','Auto-launch forms, absence alerts, reminders, agent re-score','Daily 23:00','nightly'],
  ['Agent trigger','Form submitted / case closed \u2192 Agent','Real time','go:agent:console'],
  ['Job change event','HR final decision \u2192 EC Job info','Real time','']
 ];
 return `<div class="head"><div><h1>Integration Center</h1><p>Every inbound file, agent read/write and outbound event, with time and record counts.</p></div></div>
 <section class="card" style="margin-bottom:16px"><h2>Scheduled jobs</h2><div class="tw"><table class="t"><thead><tr><th>Job</th><th>Route</th><th>Schedule</th><th></th></tr></thead><tbody>
 ${jobs.map(([n,r,s,a])=>`<tr><td class="name">${n}</td><td>${r}</td><td class="mono">${s}</td><td class="r">${a?(a.startsWith('go:')?`<button class="btn sm" data-go="${a.slice(3)}" type="button">Open</button>`:`<button class="btn sm" data-act="${a}" type="button">Run now</button>`):''}</td></tr>`).join('')}
 </tbody></table></div></section>
 <section class="card"><h2>Log</h2>${logTable(0)}</section>`;
}

/* ======================= AGENT ======================= */
function vAgent(){
 const pg = UI.page.agent;
 return `<div class="wrap"><div class="subnav"><button type="button" data-go="agent:console" ${pg==='console'?'aria-current="page"':''}>Console</button><button type="button" data-go="agent:rules" ${pg==='rules'?'aria-current="page"':''}>Rule set</button><button type="button" data-go="agent:how" ${pg==='how'?'aria-current="page"':''}>How it works</button></div>
 ${pg==='console'?aConsole():pg==='rules'?aRules():aHow()}</div>`;
}
const PSTEPS = [
 ['Read from SF','API read: person, attendance, development record, conduct cases, form'],
 ['Check completeness','What is missing and who covers it'],
 ['Score records','Fixed rules turn records into 5 / 3 / 1'],
 ['Score conduct','Closed cases only; conduct points and cap'],
 ['Read the comments','AI: tone, themes, red flags (Hindi / Marathi / English)'],
 ['Combine','Weights \u2192 overall score \u2192 band \u2192 cap \u2192 recommendation'],
 ['Explain and flag','Plain reasons; flags for human review'],
 ['Write back to SF','Assessment record + notify HoD']
];
function aConsole(){
 const ps = Object.values(S.people);
 const sel = UI.pipe.tid || (queue()[0]&&queue()[0].p.id) || 't02';
 UI.pipe.tid = sel;
 const p = S.people[sel], f = lastSubmitted(sel), st = assessState(p), q = queue();
 const n = UI.pipe.step;
 return `<div class="head"><div><div class="eyebrow">Agent \u00b7 ${esc(RULES_VER)}</div><h1>Agent console</h1><p>The agent wakes when a form is submitted or input data changes. It reads from SF, scores with fixed rules, uses AI only to read comments, and writes its analysis back. It never makes the decision.</p></div>
  <button class="btn pri" data-act="runall" type="button" ${q.length?'':'disabled'}>Run queue (${q.length})</button></div>
 <div class="grid g2" style="grid-template-columns:minmax(0,.8fr) minmax(0,1.6fr)">
  <section class="card"><h2>Trainees</h2><div class="tw"><table class="t"><tbody>
   ${ps.map(x=>{ const s = assessState(x); return `<tr class="click" data-act="pick" data-id="${x.id}" ${x.id===sel?'style="outline:2px solid var(--accent);outline-offset:-2px"':''}><td class="name">${esc(x.name)}<div class="sub">${s.f?s.f.cp+' form':'no form'}</div></td><td>${s.state==='Queued'?`<span class="chip warn" title="${esc(s.reason)}">Queued</span>`:s.state==='Up to date'?'<span class="chip good">Up to date</span>':'<span class="chip">\u2014</span>'}</td></tr>`; }).join('')}
  </tbody></table></div></section>
  <section class="card"><div class="row" style="justify-content:space-between;margin-bottom:10px"><h2 style="margin:0">${esc(p.name)} \u00b7 ${f?f.cp+' form':'no submitted form'}</h2>
   <div class="row">${st.state==='Queued'?`<span class="chip warn">${esc(st.reason)}</span>`:''}<button class="btn sm" data-act="pstep" type="button" ${f&&n<8?'':'disabled'}>Next step</button><button class="btn pri sm" data-act="prun" type="button" ${f?'':'disabled'}>Run all steps</button></div></div>
   ${f?`<div class="pipe">${PSTEPS.map((s,i)=>`<div class="ps ${i<n?'done':i===n?'cur':''}"><div class="ph"><span class="n">${i<n?'\u2713':i+1}</span><div><b>${s[0]}</b><span class="sub">${s[1]}</span></div><span class="chip ${i===4||i===6?'acc':''}">${i===4?'AI':i===6?'Rules + AI wording':i===0||i===7?'API':'Rules'}</span></div>${i<n?`<div class="pb">${pdetail(i,p,f)}</div>`:''}</div>`).join('')}</div>`:'<div class="empty">This trainee has no submitted form yet, so there is nothing to score.</div>'}
  </section>
 </div>`;
}
function pdetail(i,p,f){
 const e = evaluate(p,f), rp = e.rp, a = attStats(p.id), dv = S.dev[p.id], cd = e.cd;
 if(i===0){ const obj = {person:{id:p.ticket,teamlease:p.tl||null,class:p.empClass,manager:MANAGERS[p.mgr].name,doj:p.doj},attendance:{scheduled:a.sched,present:a.pres,pct:+a.pct.toFixed(1),streak:a.cont,synced_to:a.syncedTo},development:{month:dv.month,kaizen_pm:dv.kz,opl_pm:dv.opl,stages:dv.st,jh_step:dv.jh,time_reduction_pct:dv.prod,trained_pm:dv.tr,activities:dv.ex},conduct_cases:S.cases.filter(c=>c.tid===p.id).map(c=>({id:c.id,type:c.k,status:CSTATUS[c.status],action:c.steps.action?c.steps.action.label:null})),form:{id:f.id,checkpoint:f.cp,status:f.status,ratings:f.ratings,strengths:f.strengths,improve:f.improve}}; return `<pre class="json">${esc(JSON.stringify(obj,null,2))}</pre>`; }
 if(i===1){ const miss = ATTRS.filter(x=>x.src==='rec'&&rp[x.id].missing); return miss.length?`<ul style="margin:0;padding-left:18px">${miss.map(x=>`<li>No ${esc(x.name.toLowerCase())} record \u2192 manager\u2019s rating used (${f.ratings[x.id]??'missing'})</li>`).join('')}</ul>`:'All records present. Form complete.'; }
 if(i===2) return `<div class="tw"><table class="t"><tbody>${ATTRS.filter(x=>x.src==='rec'&&!rp[x.id].missing).map(x=>`<tr><td>${esc(x.name)}</td><td>${esc(rp[x.id].val)}</td><td class="r num"><b>${rp[x.id].pts}</b></td></tr>`).join('')}</tbody></table></div>`;
 if(i===3) return `Closed cases: ${cd.closed} (VC/UR ${cd.vcur}, warning-level ${cd.wl}${cd.end?', termination '+cd.end:''}) \u00b7 open: ${cd.open}<br>Effective warning-level count: <b>${cd.eff}</b> (${S.cfg.vcurAsWL}+ VC/UR counts as one) \u2192 conduct points <b>${cd.pts}</b>${cd.eff>=S.cfg.wlNotRec?' \u2192 not recommended':cd.eff===1?' \u2192 band capped at B':''}`;
 if(i===4) return `<div class="row"><span class="chip ${e.sen.label==='Positive'?'good':e.sen.label==='Negative'?'bad':''}">${e.sen.label} \u2192 ${e.sen.pts} points</span><span class="sub">Themes: ${e.sen.themes.map(t=>BUCKETS[t]).join(', ')||'none'} \u00b7 ${e.sen.words} words</span></div><div class="quote">${highlight(f.strengths,e.sen.hits)}</div><div class="quote">${highlight(f.improve,e.sen.hits)}</div><p class="sub" style="margin:6px 0 0">Simulated here with keyword rules. In production a language model does this step, using the same output format.</p>`;
 if(i===5) return `${e.bk.map(b=>`<div class="bucket"><span>${BUCKETS[b.b]}</span><span class="sub num">${b.w}%</span><div class="bar"><i style="width:${b.p}%"></i></div><span class="num">${Math.round(b.p)}%</span></div>`).join('')}<div class="row" style="margin-top:8px"><b>Overall ${pct(e.overall)}</b>${bandChip(e.band)}${e.fb!==e.band?'\u2192 '+bandChip(e.fb)+'<span class="sub">capped by conduct</span>':''}${recChip(f.cp==='M12'?e.rec:e.status)}</div>`;
 if(i===6) return `<ul style="margin:0 0 6px;padding-left:18px">${e.reasons.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>${e.flags.map(([c,h,s])=>`<div class="flag ${c==='warn'?'':c}"><b>${esc(h)}</b><span>${esc(s)}</span></div>`).join('')||'<span class="sub">No flags.</span>'}`;
 if(i===7){ const a2 = S.assess[p.id]; return a2&&a2.formId===f.id?`<pre class="json">${esc(JSON.stringify({object:'Agent assessment',id:a2.id,trainee:p.ticket,form:a2.formId,run_at:a2.runAt,overall:+a2.overall.toFixed(1),band:a2.band,final_band:a2.fb,recommendation:a2.rec,flags:a2.flags,rules:a2.rules},null,2))}</pre><p class="sub" style="margin:6px 0 0">Notified ${esc(HODS[hodOf(p)].name)} (HoD).</p>`:'Writing\u2026'; }
 return '';
}
function aRules(){
 const C = S.cfg, tot = Object.values(C.w).reduce((s,v)=>s+Number(v||0),0);
 return `<div class="head"><div><h1>Rule set</h1><p>The only place numbers are decided. Placeholder values, to be agreed with the plant teams. Changing anything puts affected trainees back in the agent queue.</p></div><button class="btn" data-act="cfgreset" type="button">Restore placeholders</button></div>
 <div class="grid g2e"><section class="card"><h2>Bucket weights</h2><div class="fgrid">${Object.keys(BUCKETS).map(b=>`<div class="fld"><label for="w-${b}">${BUCKETS[b]}</label><input id="w-${b}" type="number" step="5" data-cfg="w.${b}" value="${C.w[b]}"></div>`).join('')}</div><p class="${tot===100?'sub':'err'}">Total ${tot}%</p></section>
 <section class="card"><h2>Cut-offs</h2><div class="fgrid">
  <div class="fld"><label for="c1">Band A from (%)</label><input id="c1" type="number" step="0.1" data-cfg="bandA" value="${C.bandA}"></div>
  <div class="fld"><label for="c2">Band B from (%)</label><input id="c2" type="number" step="0.1" data-cfg="bandB" value="${C.bandB}"></div>
  <div class="fld"><label for="c3">Attendance 5 points from (%)</label><input id="c3" type="number" step="0.5" data-cfg="attA" value="${C.attA}"></div>
  <div class="fld"><label for="c4">Attendance 3 points from (%)</label><input id="c4" type="number" step="0.5" data-cfg="attB" value="${C.attB}"></div>
  <div class="fld"><label for="c5">VC/UR count = one warning letter</label><input id="c5" type="number" data-cfg="vcurAsWL" value="${C.vcurAsWL}"></div>
  <div class="fld"><label for="c6">Warning-level actions = not recommended</label><input id="c6" type="number" data-cfg="wlNotRec" value="${C.wlNotRec}"></div>
  <div class="fld"><label for="c7">Leniency flag above (% at A)</label><input id="c7" type="number" data-cfg="leniency" value="${C.leniency}"></div>
  <div class="fld"><label for="c8">Launch forms N days before checkpoint</label><input id="c8" type="number" data-cfg="launchBefore" value="${C.launchBefore}"></div>
 </div></section></div>`;
}
function aHow(){
 return `<div class="head"><div><h1>How the agent works</h1><p>Two kinds of work, kept apart on purpose.</p></div></div>
 <div class="grid g2e">
  <section class="card"><h2>Rules (auditable)</h2><ul style="padding-left:18px;margin:0">
   <li>Every score: records to 5/3/1, conduct points, weights, band, cap, recommendation.</li>
   <li>Rules live in one versioned rule set; the version is stamped on every assessment.</li>
   <li>Same inputs always give the same output, so any result can be re-checked by HR or IR.</li></ul></section>
  <section class="card"><h2>AI (language only)</h2><ul style="padding-left:18px;margin:0">
   <li>Reads the manager\u2019s Strengths and Areas to improve; returns tone (5/3/1), themes and red-flag words.</li>
   <li>Writes the plain-language reasons from the rule results.</li>
   <li>Never changes a number the rules produced. HoD can edit the tone label with a reason.</li></ul></section>
  <section class="card"><h2>When it runs</h2><ul style="padding-left:18px;margin:0">
   <li>A form is sent to the HoD (real time).</li><li>A conduct case closes, registers are uploaded, or attendance points change (nightly check).</li><li>The rule set changes (everyone affected is re-queued).</li></ul></section>
  <section class="card"><h2>What it may and may not do</h2><ul style="padding-left:18px;margin:0">
   <li>May read trainee data from SF and write an assessment record and a notification.</li>
   <li>May not change ratings, close cases, or record any decision.</li>
   <li>Decisions are made by manager, HoD and HR in SF; overrides need a reason and are logged.</li></ul></section>
 </div>`;
}

/* ======================= DRAWER ======================= */
function renderDrawer(){
 const root = $('#drawer-root');
 if(!UI.drawer){ root.innerHTML=''; return; }
 const f = S.forms.find(x=>x.id===UI.drawer.id), p = S.people[f.tid];
 root.innerHTML = `<div class="drawer-bg" data-act="close"></div><div class="drawer" role="dialog" aria-modal="true" aria-label="Comments"><div class="dh"><h2>${esc(p.name)} \u00b7 ${f.cp} comments</h2><button class="btn sm" data-act="close" type="button">Close</button></div>
 <div class="db"><div class="fld"><label for="dr-s">Key strengths</label><textarea id="dr-s" data-ff="${f.id}" data-k="strengths">${esc(f.strengths)}</textarea></div>
 <div class="fld"><label for="dr-i">Areas to improve</label><textarea id="dr-i" data-ff="${f.id}" data-k="improve">${esc(f.improve)}</textarea></div>
 <div class="fld"><label for="dr-t">Training need: technical</label><input id="dr-t" data-ff="${f.id}" data-k="tech" value="${esc(f.tech)}"></div>
 <div class="fld"><label for="dr-b">Training need: behavioural</label><input id="dr-b" data-ff="${f.id}" data-k="beh" value="${esc(f.beh)}"></div>
 <label class="row" style="font-size:13px"><input type="checkbox" data-ffc="${f.id}" data-k="discussed" ${f.discussed?'checked':''}> I have discussed this review with the trainee</label>
 <p class="sub">Hindi, Marathi or English. Ten words or more help the agent read your view.</p></div>
 <div class="df"><button class="btn pri" data-act="close" type="button">Done</button></div></div>`;
}

/* ======================= RENDER ======================= */
function render(){
 _len = null; UI.pendingRender = false;
 const k = curSim();
 renderTop();
 const w = h => `<div class="wrap">${h}</div>`;
 $('#app').innerHTML = k==='hub'?vFlow(): k==='time'?w(cTime()): k==='registers'?w(cReg()): k==='teamlease'?w(cTL()): k==='tablet'?w(cTablet()): k==='sf'?vSF(): vAgent();
 renderDrawer();
 document.title = SIMS[k].name + ' · Trainee Data Flow';
}
function go(target, id){
 const [sys,page] = target.split(':');
 let h = sys==='flow'||sys==='hub' ? 'hub' : sys==='capture' ? ({time:'time',reg:'registers',tl:'teamlease',tablet:'tablet'})[page] : sys;
 if(sys==='sf' && page) UI.page.sf = page;
 if(sys==='agent' && page) UI.page.agent = page;
 if(['time','registers','teamlease','tablet'].includes(sys)) h = sys;
 UI.id = id || null;
 if(sys==='agent' && id) UI.pipe = {tid:id, step:0};
 if(curSim()!==h){ location.hash = h; } else { render(); }
 window.scrollTo(0,0);
}
window.addEventListener('hashchange', ()=>{ render(); window.scrollTo(0,0); });
function scheduleRender(){
 const ae = document.activeElement;
 if(ae && ae.closest && ae.closest('#app, #drawer-root') && (ae.tagName==='TEXTAREA' || (ae.tagName==='INPUT' && !['checkbox','radio','file','button'].includes(ae.type)))){ UI.pendingRender = true; return; }
 render();
}
document.addEventListener('focusout', ()=>{ if(UI.pendingRender) setTimeout(()=>{ const ae = document.activeElement; if(!ae || !['TEXTAREA','INPUT'].includes(ae.tagName)) render(); }, 50); });

/* ======================= SHARED STORE ======================= */
const TAB = Math.random().toString(36).slice(2,10);
const LKEY = 'trainee-portal-demo-v1';
const store = {mode:'wait', ref:null, empty:false};
let rev = 0, saving = false, dirty = false, _ptimer = null;
async function initStore(){
 let db = null;
 try{ db = (window.claude && typeof window.claude.use==='function') ? await window.claude.use('db') : null; }catch(e){ db = null; }
 if(db){
  store.mode = 'db'; store.ref = db.doc('sim/state');
  store.ref.onSnapshot(snap=>{
   if(!snap.exists){ store.empty = true; renderTop(); if(curSim()==='hub') scheduleRender(); return; }
   const dd = snap.data(); if(!dd || !dd.state) return;
   if(dd.writer===TAB && (dd.rev||0) <= rev) return;
   applyRemote(dd, false);
  }, err=>{ store.mode = 'local'; toast('Shared store disconnected; continuing in this browser only.'); renderTop(); });
 } else {
  store.mode = 'local';
  try{ const raw = localStorage.getItem(LKEY); if(raw) applyRemote(JSON.parse(raw), true); }catch(e){}
  window.addEventListener('storage', e=>{ if(e.key===LKEY && e.newValue){ try{ applyRemote(JSON.parse(e.newValue), false); }catch(_){} } });
 }
 renderTop(); scheduleRender();
}
function applyRemote(dd, initial){
 const first = store.empty || initial;
 S = clone(dd.state); rev = Math.max(rev, dd.rev||0); store.empty = false;
 const last = S.log && S.log[0];
 if(!initial && dd.writer!==TAB && last && (typeof ME==='undefined' || ME)) toast('↓ '+(dd.by||'Another simulator')+': '+last.what.slice(0,110));
 scheduleRender();
}
function persist(){
 rev++;
 const payload = {v:3, rev, writer:TAB, by:simName(), at:Date.now(), state:S};
 if(store.mode==='db' && store.ref){
  store.empty = false;
  if(saving){ dirty = true; return; }
  saving = true;
  store.ref.set(JSON.parse(JSON.stringify(payload))).catch(e=>{ toast('Could not save to the shared store ('+((e&&e.code)||'error')+'). Your changes stay in this tab.'); }).finally(()=>{ saving = false; if(dirty){ dirty = false; persist(); } });
 } else {
  try{ localStorage.setItem(LKEY, JSON.stringify(payload)); }catch(e){}
 }
 renderTop();
}
function persistSoon(){ clearTimeout(_ptimer); _ptimer = setTimeout(persist, 900); }

/* ======================= ACTIONS ======================= */
const val = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
function queueReason(tid, why){ S.triggers[tid] = why; }
function afterDataChange(why, tids){ (tids||Object.keys(S.people)).forEach(t=>{ if(assessState(S.people[t]).state==='Queued') queueReason(t, why); }); }
function runAgent(tid, trig){
 const p = S.people[tid], f = lastSubmitted(tid); if(!f) return false;
 const e = evaluate(p,f);
 S.assess[tid] = {id:'AA-'+(S.seq.aa++), runAt:stamp(), trigger:trig||S.triggers[tid]||'Manual run', ...snapshot(p,f,e)};
 delete S.triggers[tid];
 log('ag','SF','Agent',`Read ${p.name}: person, attendance, development record, ${S.cases.filter(c=>c.tid===tid).length} case(s), ${f.cp} form.`);
 log('ag','Agent','SF Assessment',`${S.assess[tid].id} written for ${p.name}: ${pct(e.overall)}, band ${e.fb==='X'?'\u2014':e.fb}, ${f.cp==='M12'?e.rec:e.status}${e.flags.length?', '+e.flags.length+' flag(s)':''}. HoD ${HODS[hodOf(p)].name} notified.`);
 return true;
}
function selectText(id){ const n = document.getElementById(id); if(!n) return; const r = document.createRange(); r.selectNodeContents(n); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); }
const NOSAVE = new Set(['cmt','pick','pstep','prun','copylink']);
const A = {
 reset(){ S = seed(); initAssess(true); seedLog(); UI.pipe={tid:null,step:0}; UI.tablet=null; UI.drawer=null; toast('Simulation reset'); render(); },
 timesync(){
  let n=0, days=0; Object.keys(S.people).forEach(t=>{ const pd = pendingDays(t); if(pd>0){ S.sfLen[t] = rawOf(t).length; n++; days=Math.max(days,pd); } });
  if(!n){ toast('Nothing pending'); return; }
  log('in','Time system','SF Attendance',`Daily file: ${n} trainees \u00d7 ${days} day(s) accepted, 0 rejected.`);
  const al = absAlerts(); al.forEach(({p,a})=>{ if(!S.alerts[p.id]){ S.alerts[p.id]=true; log('sys','SF','Manager / HR',`Absence alert: ${p.name} absent ${a.cont} working days. Day 4 action due (call + warning letter).`); } });
  afterDataChange('Attendance updated'); tick('t1'); toast(`Attendance synced${al.length?'. '+al.length+' absence alert(s) raised':''}`); render();
 },
 regup(){
  const known = Object.fromEntries(Object.values(S.people).map(p=>[p.ticket,p.id]));
  let ok=0, rej=0, vals=0;
  S.reg.rows.forEach(r=>{ const tid = known[r.ticket]; if(!tid){ rej++; return; } const nv = {kz:r.kz,opl:r.opl,st:r.st,jh:r.jh,prod:r.prod,tr:r.tr,ex:r.ex}; Object.values(nv).forEach(v=>{ if(v!==null&&v!==''&&v!==undefined) vals++; }); S.dev[tid] = {...nv, month:S.reg.month, by:'Coordinator upload'}; ok++; });
  S.reg.uploaded = true;
  log('in','Coordinators','SF Development record',`${S.reg.month} registers: ${ok} rows accepted (${vals} values), ${rej} rejected (ticket not found in EC).`);
  afterDataChange('Development record updated'); tick('t2'); toast(`${ok} rows uploaded, ${rej} rejected`); render();
 },
 tlimport(){
  S.tl.rows.forEach((r,i)=>{ const id = 'p'+(S.seq.p++); S.people[id] = {id,name:r.name,type:'WILP',mgr:r.mgr,doj:r.doj,line:r.line,prof:'good',ck:'good',ticket:'T'+(49001+i),tl:r.tl,status:'Active',empClass:'Contingent worker (TeamLease)'}; S.people[id].gen = {ab:.02,la:.02,streak:0,s:300+i}; S.sfLen[id] = rawOf(id).length - 1; S.dev[id] = {prod:null,jh:null,kz:null,st:null,opl:null,tr:null,ex:null,month:'none'}; });
  S.tl.imported = true;
  log('in','TeamLease','EC person',`${S.tl.rows.length} WILP joiners created with Bajaj ticket no. + TeamLease code; M3 forms scheduled.`);
  tick('t3'); toast('2 joiners created in EC'); render();
 },
 tbsubmit(){
  const D = UI.tablet, err=[]; D.desc = val('tb-x'); D.place = val('tb-p'); D.time = val('tb-h');
  if(!D.tid) err.push('pick the trainee'); if(!D.k) err.push('choose what happened'); if(D.desc.length<10) err.push('describe what happened');
  if(err.length){ $('#tb-err').textContent='Please '+err.join(', ')+'.'; return; }
  const files = [...(document.getElementById('tb-e').files||[])].map(x=>x.name);
  const c = {id:'C-'+(S.seq.case++), tid:D.tid, k:D.k, date:dateKey(TODAY), time:D.time||'\u2014', place:D.place||'\u2014', desc:D.desc, other:'', evidence:files, reporter:'Supervisor (line tablet)', status:1, channel:'Line tablet', steps:{reported:{by:'Supervisor (line tablet)',at:stamp()}}};
  S.cases.push(c); const p = S.people[D.tid];
  log('in','Line tablet','SF Conduct case',`${c.id} created for ${p.name}: ${MISK[D.k].name}. Waiting for validation by ${MANAGERS[p.mgr].name}.`);
  UI.tablet = null; tick('t4'); toast(c.id+' sent to SF'); render();
 },
 tapf(el){
  const f = S.forms.find(x=>x.id===el.dataset.f); f.ratings[Number(el.dataset.a)] = Number(el.dataset.v); if(f.status==='Not started') f.status='In progress';
  render();
 },
 cmt(el){ UI.drawer = {id:el.dataset.id}; renderDrawer(); },
 close(){ UI.drawer=null; render(); },
 sendhod(el){
  const f = S.forms.find(x=>x.id===el.dataset.id), p = S.people[f.tid], taps = tapIds(p);
  const miss = taps.filter(i=>!f.ratings[i]).length;
  if(miss || !f.strengths.trim() || !f.improve.trim() || !f.discussed){ const msg = 'Before sending: '+[miss?miss+' rating(s) left':'', !f.strengths.trim()||!f.improve.trim()?'fill both boxes in Section C':'', !f.discussed?'confirm you discussed it with the trainee (Section E)':''].filter(Boolean).join('; ')+'.'; const e = document.getElementById('ff-err'); if(e) e.textContent = msg; else toast(msg); return; }
  f.status='With HoD'; f.submitted=stamp();
  log('wf','Manager form','SF Form',`${f.id} ${f.cp} for ${p.name} sent to HoD ${HODS[hodOf(p)].name}.`);
  queueReason(p.id,'Form submitted'); log('sys','SF','Agent',`Trigger: ${p.name} ${f.cp} form submitted \u2192 agent queued.`);
  tick('t5');
  toast(p.name+' sent to HoD. Agent queued.'); render();
 },
 signform(el){
  const f = S.forms.find(x=>x.id===el.dataset.id), p = S.people[f.tid];
  f.status='Completed'; f.signed=stamp();
  log('wf','HoD','SF Form',`${f.id} ${f.cp} for ${p.name} signed by ${HODS[hodOf(p)].name}.`); tick('t7');
  toast('Form signed'); render();
 },
 copylink(el){ const t = ART_URL+'#'+el.dataset.id; const done = ()=>toast('Link copied: open it in another tab or device'); try{ navigator.clipboard.writeText(t).then(done, ()=>{ selectText('lnk-'+el.dataset.id); toast('Press Ctrl/Cmd+C to copy the selected link'); }); }catch(e){ selectText('lnk-'+el.dataset.id); toast('Press Ctrl/Cmd+C to copy the selected link'); } },
 pick(el){ UI.pipe = {tid:el.dataset.id, step:0}; render(); },
 pstep(){ const n = UI.pipe.step+1; if(n===8){ runAgent(UI.pipe.tid,'Manual run'); tick('t6'); persist(); } UI.pipe.step = Math.min(8,n); render(); },
 prun(){
  clearInterval(UI.pipe.timer); UI.pipe.step = 0; render();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce){ runAgent(UI.pipe.tid,'Manual run'); tick('t6'); UI.pipe.step=8; persist(); render(); return; }
  UI.pipe.timer = setInterval(()=>{ UI.pipe.step++; if(UI.pipe.step===8){ clearInterval(UI.pipe.timer); runAgent(UI.pipe.tid,'Manual run'); tick('t6'); persist(); toast('Assessment written to SF'); } if(curSim()==='agent') render(); }, 380);
 },
 runall(){ const q = queue(); q.forEach(x=>runAgent(x.p.id, x.reason)); if(q.length) tick('t6'); toast(q.length+' assessment(s) written to SF'); render(); },
 nightly(){
  const launched = autoLaunch(S);
  if(launched.length) log('sys','Scheduler','SF Form',`Auto-launched: ${launched.join(', ')}.`);
  const al = absAlerts(); al.forEach(({p,a})=>{ if(!S.alerts[p.id]){ S.alerts[p.id]=true; log('sys','SF','Manager / HR',`Absence alert: ${p.name} absent ${a.cont} working days.`); } });
  const od = S.forms.filter(f=>(f.status==='Not started'||f.status==='In progress')&&new Date(f.cpDate)<TODAY);
  if(od.length) log('sys','Scheduler','Manager',`Reminder: ${od.length} overdue form(s): ${od.map(f=>S.people[f.tid].name+' '+f.cp).join(', ')}.`);
  afterDataChange('Nightly re-check');
  const q = queue().length;
  log('sys','Scheduler','Agent',`Nightly checks done: ${launched.length} form(s) launched, ${al.length} absence alert(s), ${q} trainee(s) queued for the agent.`);
  toast('Nightly checks done'); render();
 },
 cvalid(el){ const c = S.cases.find(x=>x.id===el.dataset.id), r = val('cv-r'); if(r.length<5){ $('#cv-e').textContent='Add validator remarks.'; return; } c.steps.validated={by:persona()[1],at:stamp(),remarks:r}; c.status=2; log('wf','Manager','SF Conduct case',`${c.id} validated by ${persona()[1]}.`); render(); },
 cnot(el){ const c = S.cases.find(x=>x.id===el.dataset.id), r = val('cv-r'); if(r.length<5){ $('#cv-e').textContent='Add remarks explaining why.'; return; } c.steps.validated={by:persona()[1],at:stamp(),remarks:r}; c.steps.action={by:persona()[1],at:stamp(),label:'Not substantiated',level:'none',reason:r}; c.steps.letter={by:'\u2014',at:stamp()}; c.steps.closed={by:persona()[1],at:stamp()}; c.status=5; c.closedAt=TODAY.toISOString(); log('wf','Manager','SF Conduct case',`${c.id} closed as not substantiated.`); render(); },
 caction(el){ const c = S.cases.find(x=>x.id===el.dataset.id), sg = suggest(c.tid,c.k), label = val('ca-a'), level = ACTIONS.find(a=>a[0]===label)[1], reason = val('ca-r'); if(level!==sg.level && reason.length<5){ $('#ca-e').textContent='Differs from the ladder ('+sg.label+'). Add a reason.'; return; } c.steps.action={by:persona()[1],at:stamp(),label,level,reason}; c.status=3; log('wf','HoD','SF Conduct case',`${c.id}: action ${label}.`); render(); },
 cletter(el){ const c = S.cases.find(x=>x.id===el.dataset.id); c.steps.letter={by:persona()[1],at:stamp()}; c.status=4; log('wf','Plant HR','SF Conduct case',`${c.id}: ${c.steps.action.level==='none'?'no letter needed':'letter issued'}.`); render(); },
 cclose(el){ const c = S.cases.find(x=>x.id===el.dataset.id), p = S.people[c.tid]; c.steps.closed={by:persona()[1],at:stamp()}; c.status=5; c.closedAt=TODAY.toISOString(); if(c.steps.action.level==='end'){ p.status='Training ended'; log('out','SF','EC Job info',`${p.name}: training ended (${c.id}).`); } log('wf','Plant HR','SF Conduct case',`${c.id} closed; counts in conduct score.`); afterDataChange('Conduct case closed',[c.tid]); if(assessState(p).state==='Queued') log('sys','SF','Agent',`Trigger: ${p.name} conduct changed \u2192 agent queued.`); toast(c.id+' closed. Agent will re-score.'); render(); },
 dmgr(el){ const p = S.people[el.dataset.id], c = val('dm-c'), r = val('dm-r'); if(c!=='agree' && r.length<5){ toast('Add a reason for the override'); return; } S.decisions[p.id] = {mgr:{agree:c==='agree',choice:c==='agree'?null:c,reason:r,by:persona()[1],at:stamp()}}; log('wf','Manager','SF Decision',`${p.name}: manager ${c==='agree'?'agreed with agent':'override \u2192 '+c+' \u2014 '+r}.`); render(); },
 dhod(el){ const p = S.people[el.dataset.id], a = S.assess[p.id], c = val('dh-c'), r = val('dh-r'); const am = a.rec==='Recommend conversion'?'Convert':(a.rec==='Not recommended'||a.rec==='Training ended')?'Do not convert':null; if(((am && c!==am) || !am) && r.length<5){ toast('Add a reason for this decision'); return; } S.decisions[p.id].hod = {choice:c,reason:r,by:persona()[1],at:stamp()}; log('wf','HoD','SF Decision',`${p.name}: HoD decided ${c} (agent: ${a.rec})${r?' \u2014 '+r:''}.`); tick('t7'); render(); },
 dhr(el){ const p = S.people[el.dataset.id], dc = S.decisions[p.id]; dc.hr = {choice:dc.hod.choice,by:persona()[1],at:stamp()}; const ev = dc.hod.choice==='Convert'?'Job change: Trainee \u2192 Permanent operator (effective 01 Nov 2026)':dc.hod.choice==='Extend 3 months'?'Contract end date extended by 3 months':'Training end: separation recorded'; dc.ec = {at:stamp(),event:ev}; log('wf','Plant HR','SF Decision',`${p.name}: final decision ${dc.hod.choice}.`); log('out','SF','EC Job info',`${p.name}: ${ev}.`); tick('t8'); toast('EC updated: '+ev); render(); },
 cfgreset(){ S.cfg = clone(DEFAULT_CFG); afterDataChange('Rule set changed'); toast('Placeholders restored'); render(); }
};

document.addEventListener('click', e=>{
 const el = e.target.closest('[data-act],[data-go]'); if(!el || el.disabled) return;
 if(el.dataset.persona){ UI.persona = el.dataset.persona; }
 if(el.dataset.go){ e.preventDefault(); go(el.dataset.go, el.dataset.id); return; }
 const f = A[el.dataset.act]; if(f){ e.preventDefault(); f(el,e); if(!NOSAVE.has(el.dataset.act)) persist(); }
});
document.addEventListener('keydown', e=>{
 if((e.key==='Enter'||e.key===' ') && e.target.matches('[role=button][data-go]')){ e.preventDefault(); go(e.target.dataset.go, e.target.dataset.id); }
 if(e.key==='Escape' && UI.drawer){ UI.drawer=null; render(); }
});
document.addEventListener('change', e=>{
 const el = e.target;
 if(el.id==='simsel'){ location.hash = el.value; return; }
 if(el.id==='persona'){ UI.persona = el.value; toast('Logged in as '+persona()[1]); render(); return; }
 if(el.dataset.tb){ UI.tablet[el.dataset.tb] = el.value; if(el.dataset.tb==='tid'||el.dataset.tb==='k'){ UI.tablet.desc = val('tb-x'); UI.tablet.time = val('tb-h'); if(el.dataset.tb==='tid') UI.tablet.place=''; render(); } return; }
 if(el.dataset.cfg){ const [a,b] = el.dataset.cfg.split('.'); const n = Number(el.value); if(b) S.cfg[a][b]=n; else S.cfg[a]=n; afterDataChange('Rule set changed'); log('sys','HR admin','Rule set',`${el.dataset.cfg} set to ${n}.`); persist(); render(); return; }
 if(el.dataset.ffc){ const f = S.forms.find(x=>x.id===el.dataset.ffc); f[el.dataset.k] = el.checked; if(f.status==='Not started') f.status='In progress'; persist(); if(!UI.drawer) render(); return; }
 if(el.dataset.reg){ const [i,k] = el.dataset.reg.split('.'); const v = el.value.trim(); S.reg.rows[i][k] = v==='' ? null : (k==='ex' ? v.toLowerCase() : Number(v)); persistSoon(); return; }
});
document.addEventListener('input', e=>{
 const el = e.target;
 if(el.dataset.ff){ const f = S.forms.find(x=>x.id===el.dataset.ff); f[el.dataset.k] = el.value; if(f.status==='Not started') f.status='In progress'; persistSoon(); }
});
/* boot in portal.js */
