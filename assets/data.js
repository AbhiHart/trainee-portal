/* PRAGATI · data model, sample seed and scoring rules.
   Sample (fictional) data only. Nothing here comes from real employees. */

/* ======================= CONSTANTS ======================= */
const TODAY = (()=>{ const t = new Date(); t.setHours(0,0,0,0); return t; })();
const SHIFT = Math.round((TODAY - new Date(2026, 9, 7)) / 864e5);
const sh = s => { const [y,m,dd] = s.split('-').map(Number); const x = new Date(y, m-1, dd + SHIFT); return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0'); };
const DAY = 864e5;
const PLANTS = {WLJ:'Waluj'};
const RULES_VER = 'Rule set v1.2';

const BUCKETS = {
 P:{name:'Productivity', hint:'Output at the line rate'},
 Q:{name:'Quality', hint:'Checks at the station and defect reporting'},
 C:{name:'Cost', hint:'Care of machine, tools and material'},
 D:{name:'Delivery', hint:'Attendance and dependability'},
 S:{name:'Safety', hint:'Safety, 5S and discipline'},
 M:{name:'Morale', hint:'Improvement, skill, teamwork and overall performance'}
};
const BORDER = ['P','Q','C','D','S','M'];

const PARAMS = [
 {k:'P1',b:'P',name:'Output & line rate',what:'Meets station targets and keeps pace with the line',st:['P1a','P1b'],data:'ie',src:'IE time study',clubbed:'Quantity of output · Productivity improvement'},
 {k:'Q1',b:'Q',name:'Quality & defect reporting',what:'Does every check; reports defects including own mistakes',st:['Q1a','Q1b'],data:'qlapse',src:'Conduct log · quality lapses',clubbed:'Quality orientation · Work negligence'},
 {k:'C1',b:'C',name:'Machine & material care',what:'Jishu Hozen: cleans, oils, inspects, reports abnormalities',st:['C1a'],data:'jh',src:'TPM register · JH step',clubbed:'TPM / JH'},
 {k:'D1',b:'D',name:'Attendance & punctuality',what:'Present days and late-ins from gate punches',st:[],data:'att',src:'Time system',clubbed:'Attendance & punctuality'},
 {k:'D2',b:'D',name:'Dependability',what:'Finishes work on time and can be relied on unsupervised',st:['D2a','D2b'],data:null,clubbed:'Dependability · Initiative'},
 {k:'S1',b:'S',name:'Safety & 5S',what:'PPE, safe methods, clean and organised station',st:['S1a','S1b'],data:'safety',src:'Conduct log · safety cases',clubbed:'Safety & housekeeping'},
 {k:'S2',b:'S',name:'Discipline & conduct',what:'SOPs, plant rules and the conduct record',st:['S2a','S2b'],data:'conduct',src:'Conduct log',clubbed:'Discipline · Conduct record'},
 {k:'M1',b:'M',name:'Kaizen & improvement',what:'Ideas raised and kaizens implemented',st:['M1a'],data:'kz',src:'Kaizen register',clubbed:'Kaizens · One-point lessons'},
 {k:'M2',b:'M',name:'Skill & multiskilling',what:'Learns new stations and models; stations certified',st:['M2a'],data:'skill',src:'Skill matrix',clubbed:'Multiskilling · Adapting to new procedures · Imparting training'},
 {k:'M3',b:'M',name:'Teamwork & attitude',what:'Cooperation and response to feedback',st:['M3a','M3b'],data:null,clubbed:'Attitude towards work · Interpersonal skills · Extra activities'},
 {k:'M4',b:'M',name:'Overall performance',what:'Manager\u2019s overall view against expectations, read with the comments',st:['M4a'],data:'sent',src:'Agent reads comments',clubbed:'Manager comment'}
];
const PK = Object.fromEntries(PARAMS.map(p=>[p.k,p]));
const STATEMENTS = {
 P1a:'Meets the production target for the station in most shifts.',
 P1b:'Keeps pace with the line rate without slowing the line down.',
 Q1a:'Does every quality check at the station without skipping steps.',
 Q1b:'Reports defects or wrong parts immediately, including own mistakes.',
 C1a:'Takes care of the machine and tools: cleans, oils and reports abnormalities.',
 D2a:'Completes assigned work on time without needing follow-up.',
 D2b:'Can be relied on to work as instructed when not supervised.',
 S1a:'Wears all required PPE (safety shoes, gloves, goggles) without being reminded.',
 S1b:'Keeps the workstation clean, organised and free of hazards (5S).',
 S2a:'Follows SOPs and work instructions without taking shortcuts.',
 S2b:'Follows plant rules on mobile phones, uniform and shift timings.',
 M1a:'Suggests ideas to make the work safer, easier or faster.',
 M2a:'Learns new stations, models and procedures quickly.',
 M3a:'Cooperates willingly with supervisors and co-workers.',
 M3b:'Accepts feedback and corrects mistakes once they are pointed out.',
 M4a:'Overall, this apprentice has performed to the expectations of the role.'
};
const ALL_ST = PARAMS.flatMap(p=>p.st);
const LIKERT = [[1,'Strongly disagree'],[2,'Disagree'],[3,'Neutral'],[4,'Agree'],[5,'Strongly agree']];
const DATA_RULES = {
 safety:'No closed safety case = 5 \u00b7 1 VC/UR = 3 \u00b7 warning letter or more = 1',
 conduct:'Clean = 5 \u00b7 1 VC/UR = 4 \u00b7 2 VC/UR = 3 \u00b7 3+ VC/UR or 1 warning = 2 \u00b7 2+ warnings = 1. Safety and quality cases count under their own parameters.',
 ie:'Task-time reduction \u2265 10% = 5 \u00b7 5\u201310% = 4 \u00b7 1\u20135% = 3 \u00b7 0% = 2',
 qlapse:'No closed quality lapse = 5 \u00b7 1 = 3 \u00b7 2 or more = 1',
 jh:'JH Step 3 = 5 \u00b7 Step 2 = 4 \u00b7 Step 1 = 3 \u00b7 no step = 2',
 att:'\u2265 95% = 5 \u00b7 92\u201395% = 4 \u00b7 88\u201392% = 3 \u00b7 85\u201388% = 2 \u00b7 < 85% = 1; minus 1 if more than 12 late-ins over the 12 months (more than one a month on average)',
 kz:'Kaizens implemented per month over the apprenticeship (up to 12 months): \u2265 2 = 5 \u00b7 1.5\u20132 = 4 \u00b7 1\u20131.5 = 3 \u00b7 0.5\u20131 = 2 \u00b7 < 0.5 = 1',
 skill:'Stations certified on the skill matrix: > 12 = 5 \u00b7 9\u201312 = 4 \u00b7 6\u20138 = 3 \u00b7 3\u20135 = 2 \u00b7 < 3 = 1',
 sent:'Manager comments read positive = 5 \u00b7 neutral or mixed = 3 \u00b7 negative = 1'
};
const OUTCOME = {A:'Exceeds expectations', B:'Meets expectations', C:'Below expectations', X:'Training ended'};
const OUTCOMES = ['Exceeds expectations','Meets expectations','Below expectations'];

const MIS = [
 {k:'mob',no:'MC-01',name:"Mobile / earphone use during work",cat:"Work indiscipline",tier:1,docs:"Incident report",kw:"mobile usage, headphones, earbuds, watching IPL / videos on phone",lad:[["VC / UR; confiscate, return after shift (call security if refused)","vcur"],["Warning letter","wl"],["Discontinuation","end"]]},
 {k:'sho',no:'MC-02',name:"Not wearing safety shoes / PPE",cat:"Safety",tier:1,docs:"Incident report",kw:"without safety shoes, saftey shoes, no gloves / goggles",lad:[["VC / UR","vcur"],["Warning letter","wl"],["Discontinuation","end"]]},
 {k:'ref',no:'MC-03',name:"Refusing to work at stage",cat:"Work indiscipline",tier:2,docs:"Incident report; confession",kw:"refused to work, not working at stage",lad:[["VC / UR + incident report","vcur"],["Warning letter + confession; collect ID; termination after 7 days if unresolved","wl"]]},
 {k:'uni',no:'MC-04',name:"Not wearing uniform",cat:"Work indiscipline",tier:1,docs:"Incident report",kw:"without uniform, improper dress, not wearing company dress",lad:[["VC / UR; sent home, marked absent","vcur"]]},
 {k:'slp',no:'MC-05',name:"Sleeping on duty",cat:"Work indiscipline",tier:2,docs:"Incident report; confession",kw:"slept on shop floor, sleeping",lad:[["Show cause + confession; 5-day suspension","wl"],["Termination on the day","end"]]},
 {k:'prx',no:'MC-06',name:"Proxy punching (machine or TeamLease app)",cat:"Integrity & security",tier:3,docs:"Confession; ID, punch card, bus pass collected",kw:"proxy punching, proxy in TL app, punching for another trainee",lad:[["Termination on the day (confession; ID, punch card, bus pass collected)","end"]]},
 {k:'phy',no:'MC-07',name:"Physical fight",cat:"Behaviour",tier:3,docs:"Confession; ID, punch card, bus pass collected",kw:"physical fight, fighting, engaged in a fight",lad:[["Termination on the day (confession; ID collected)","end"]]},
 {k:'hab',no:'MC-08',name:"Habitual absenteeism",cat:"Attendance",tier:1,docs:"Incident report; time-system extract",kw:"absent without intimation, unplanned leave, unauthorised absence (threshold below)",lad:[["VC / UR; entry in habitual record","vcur"],["Warning letter","wl"],["Discontinuation","end"]]},
 {k:'cua',no:'MC-09',name:"Continuous unauthorised absence (> 3 days)",cat:"Attendance",tier:2,docs:"Call log; warning letter",kw:"continuous absence, long absence, absent since <date>",lad:[["Day 4 call + warning letter; Day 6 call; Day 11 call","wl"],["Discontinuation if not resumed by Day 11 (if resumed: HRD meeting + underwriting)","end"]]},
 {k:'thf',no:'MC-10',name:"Theft",cat:"Integrity & security",tier:3,docs:"Confession; ID, punch card, bus pass collected",kw:"theft, stealing",lad:[["Termination on the day (confession; ID collected)","end"]]},
 {k:'dmg',no:'MC-11',name:"Damage to company property",cat:"Integrity & security",tier:3,docs:"Incident report; confession; ID collected",kw:"damaged vehicle / property",lad:[["Termination on the day (incident report + confession; ID collected)","end"]]},
 {k:'stg',no:'MC-12',name:"Absent from work stage without approval",cat:"Attendance",tier:1,docs:"Incident report",kw:"absent on stage, away from stage, punched in but not at stage",lad:[["VC / UR","vcur"],["Warning letter","wl"],["Discontinuation","end"]]},
 {k:'pho',no:'MC-13',name:"Photo / video in company premises",cat:"Integrity & security",tier:3,docs:"Confession; ID collected",kw:"captured video, recording, photo on shop floor",lad:[["Discontinuation on the day (confession; ID collected)","end"]]},
 {k:'vrb',no:'MC-14',name:"Verbal fight / abusive language / misbehaviour",cat:"Behaviour",tier:2,docs:"Incident report; confession on repeat",kw:"verbal fight, abusive language, misbehave with supervisor / engineer, insubordination",lad:[["Incident report + VC / UR + warning letter","wl"],["Confession; ID collected; discontinuation on the day","end"]]},
 {k:'tob',no:'MC-15',name:"Tobacco / smoking in company premises",cat:"Substance",tier:2,docs:"Incident report; confession on repeat",kw:"tobacco, gutkha, smoking",lad:[["Incident report + VC / UR + warning letter","wl"],["Confession; ID collected; discontinuation on the day","end"]]},
 {k:'alc',no:'MC-16',name:"Alcohol consumption on duty",cat:"Substance",tier:3,docs:"Confession; ID collected",kw:"alcohol, drunk",lad:[["Confession / misconduct report; ID collected; discontinuation on the day","end"]]},
 {k:'drv',no:'MC-17',name:"Driving without licence",cat:"Safety",tier:3,docs:"Incident report; confession; ID collected",kw:"drove vehicle without driving licence",lad:[["Termination on the day (incident report + confession; ID collected)","end"]]},
 {k:'neg',no:'MC-18',name:"Work negligence / quality / SOP lapse",cat:"Quality",tier:1,docs:"Incident report",kw:"SOP violation, not following SOPs, wrong part fitted, mistake in work, skipped inspection",lad:[["VC / UR","vcur"],["Warning letter","wl"],["Discontinuation","end"]]},
 {k:'brk',no:'MC-19',name:"Break-time / shift-timing violation",cat:"Work indiscipline",tier:1,docs:"Incident report",kw:"lunch break time violation, late from break, timepass during working hours",lad:[["VC / UR","vcur"],["Warning letter","wl"],["Discontinuation","end"]]},
 {k:'chg',no:'MC-20',name:"Unapproved change of shift, stage or department",cat:"Work indiscipline",tier:1,docs:"Incident report",kw:"changed shift without informing, came to general shift, worked in other department without permission",lad:[["VC / UR","vcur"],["Warning letter","wl"],["Discontinuation","end"]]},
 {k:'reg',no:'MC-21',name:"Attendance regularisation misuse",cat:"Integrity & security",tier:1,docs:"Incident report; system log",kw:"applied regularisation instead of leave, miss punching TL portal",lad:[["VC / UR","vcur"],["Warning letter","wl"],["Discontinuation","end"]]},
 {k:'hyg',no:'MC-22',name:"Hygiene / 5S breach (e.g. spitting)",cat:"Safety",tier:1,docs:"Incident report",kw:"spitting on shop floor",lad:[["VC / UR","vcur"],["Warning letter","wl"],["Discontinuation","end"]]},
 {k:'stop',no:'MC-23',name:"Stopping the line / instigating others",cat:"Work indiscipline",tier:2,docs:"Incident report; confession",kw:"stopped line by creating group",lad:[["Warning letter + confession","wl"],["Discontinuation","end"]]},
 {k:'posh',no:'MC-24',name:"POSH complaint",cat:"Separate route: Internal Committee",tier:0,docs:"Complaint; IC reference no.",kw:"POSH case",lad:[["Refer to the Internal Committee (POSH Act, 2013); restricted access; no conduct action until IC concludes","ic"]]},
 {k:'acc',no:'MC-25',name:"Accident (no violation found)",cat:"Incident \u2013 non-disciplinary",tier:0,docs:"Accident report; first-aid / medical record",kw:"accident in premises / on the way",lad:[["Record only; no penalty (if a violation caused it, log that misconduct instead)","none"]]},
 {k:'oth',no:'MC-99',name:"Other (describe)",cat:"To be classified by HR",tier:0,docs:"Incident report",kw:"anything not listed; never \"policy violation\" alone",lad:[["HR assigns a code within 7 days","none"]]}
];
const MISK = Object.fromEntries(MIS.map(m=>[m.k,m]));
const SAFETY_K = ['sho','drv','hyg'], QUALITY_K = ['neg'];
const ACTIONS = [['VC / UR','vcur'],['Warning letter','wl'],['Show cause notice','wl'],['Suspension','wl'],['Discontinuation / termination','end'],['Refer to Internal Committee','ic'],['Record only (no penalty)','none']];
/* how phrases used in the current registers map to a code (first match wins; generic words map to nothing) */
const CODE_RULES = [
 ['posh',/posh|sexual harass/],['prx',/proxy|miss punch|punching for/],['alc',/alcohol|drunk/],['tob',/tobacco|smok|gutkha|cigarette/],
 ['vrb',/verbal|abus|miss?behav|insubordinat|argu|inappropriate language|rude/],['phy',/physical|engaged in a fight|fighting|\bfight\b|beat/],
 ['thf',/theft|stole|stealing/],['dmg',/damag|broke/],['drv',/driv\w* .*licen|without driving|licence|license/],['pho',/photo|video|recording|reel/],
 ['slp',/sleep|slept/],['ref',/refus|not working at stage/],['sho',/safety shoe|saftey shoe|shoes|ppe|gloves|goggle|helmet/],['uni',/uniform|dress/],
 ['mob',/mobile|headphone|earbud|earphone|\bipl\b|phone/],['brk',/lunch|break time|tea break|late from break|timepass/],
 ['stg',/absent on stage|absent from (work )?stage|away from stage|left stage|not at stage|instead of reporting/],
 ['cua',/continuous|continuously absent|long absence|absent since/],['hab',/habit|absent without|unplanned leave|unauthori[sz]ed abs|absenteeism|absent|without intimation/],
 ['neg',/\bsop\b|wrong|negligen|quality|not following|inspection|mistake|torque|defect/],['chg',/change(d)? (of )?shift|other department|stage change|general shift|without permission/],
 ['reg',/regulari/],['hyg',/spit|5s|hygien/],['stop',/stopped (the )?line|creating group|instigat/],['acc',/accident|injur|first aid/]
];
const GENERIC_RX = /indiscip|indicip|policy violation|misconduct|act of|warning/;
function classify(text){ const t = String(text||'').toLowerCase(); if(!t.trim()) return null; if(/absent (on|from) (work )?stage|away from stage|left stage/.test(t)) return 'stg'; const r = CODE_RULES.find(([k,rx])=>rx.test(t)); return r ? r[0] : null; }
function codeOf(s){ const t = String(s||'').trim().toUpperCase(); const m = MIS.find(x=>x.no===t || x.no.replace('-','')===t.replace('-','')); return m ? m.k : null; }
function actLevel(text){ const t = String(text||'').toLowerCase(); if(!t.trim()) return ''; if(/terminat|discontinu/.test(t)) return 'end'; if(/internal committee|\bic\b/.test(t)) return 'ic'; if(/suspension|show cause|warning|letter|latter/.test(t)) return 'wl'; if(/counsel|underwrit|vc|\bur\b/.test(t)) return 'vcur'; if(/no action|record only|not substantiated/.test(t)) return 'none'; return '?'; }
/* search the code list the way people describe incidents on the floor */
function findCodes(q){
 const t = String(q||'').toLowerCase().trim(); if(t.length<2) return [];
 const hit = classify(t), words = t.split(/[^a-z0-9]+/).filter(w=>w.length>1);
 if(!hit && GENERIC_RX.test(t)) return [MISK.oth];
 const score = m => { const hay = (m.no+' '+m.name+' '+m.kw+' '+m.cat).toLowerCase(); let s = words.filter(w=>hay.includes(w)).length; if(m.k===hit) s += 5; if(m.no.toLowerCase().replace('-','')===t.replace('-','')) s += 10; return s; };
 return MIS.map(m=>({m,s:score(m)})).filter(x=>x.s>0).sort((a,b)=>b.s-a.s).slice(0,5).map(x=>x.m);
}
const CSTATUS = ['','Reported','Validated','Action decided','Letter issued','Closed'];

const MANAGERS = {
 m1:{name:'S. Kulkarni',dept:'Engine Assembly',div:'MCD',hod:'h1',plant:'WLJ',lines:['E-Line 1','E-Line 2','E-Line D']},
 m2:{name:'R. Joshi',dept:'Vehicle Assembly',div:'MCD',hod:'h1',plant:'WLJ',lines:['V-Line 1','V-Line 2','V-Line 3']},
 m5:{name:'M. Sawant',dept:'Machine Shop',div:'MCD',hod:'h1',plant:'WLJ',lines:['CNC Cell 1','CNC Cell 2','CNC Cell 3']},
 m3:{name:'A. Naik',dept:'Frame Shop',div:'CVD',hod:'h2',plant:'WLJ',lines:['Frame Weld 1','Frame Weld 2','Frame Paint']},
 m6:{name:'K. Pillai',dept:'Paint Shop',div:'CVD',hod:'h2',plant:'WLJ',lines:['Paint Booth 1','Paint Booth 2','Pretreatment']},
 m4:{name:'M. Rao',dept:'Packing & Dispatch',div:'SPD',hod:'h2',plant:'WLJ',lines:['Packing L1','Packing L2','Dispatch Bay 1','Dispatch Bay 2']}
};
const HODS = {h1:{name:'D. Mehta',divs:['MCD']},h2:{name:'P. Iyer',divs:['CVD','SPD']}};
const DEPTS = [...new Set(Object.values(MANAGERS).map(m=>m.dept))];

const KZ_STATUS = ['Submitted','Approved','Implemented','Verified','Not sustained','Rework','Rejected'];
const KZ_TYPES = ['Kaizen','Quick kaizen','One-point lesson'];
const KZ_TPL = [
 ['P','Kaizen','Magnetic bolt tray at the assembly station','M8 bolts were picked from a loose bin below the conveyor; bolts fell and the operator searched for them.','Magnetic tray at elbow height holds one 10-piece set per cycle.','Bin placed below the conveyor; no fixed quantity per cycle.','Cycle time','sec',48,42,38000,1200],
 ['P','Kaizen','Pre-kitting of wiring harness clips','Clips were counted out at the station for every vehicle.','Clips arrive pre-kitted in a tray per vehicle from the supermarket.','Counting done at the line instead of at the store.','Cycle time','sec',62,55,52000,0],
 ['P','Kaizen','Balancer for the wheel-nut air gun','Heavy air gun lifted from the table each cycle; operator fatigue late in shift.','Spring balancer holds the gun at working height.','No support for a 3 kg tool used 400 times a shift.','Cycle time','sec',35,31,30000,4500],
 ['P','Quick kaizen','Torque wrench rack moved next to the station','Operator walked to the end of the line to collect the torque wrench.','Rack fixed at the station pillar.','Rack placed by a previous layout.','Walking','m/shift',420,150,26000,800],
 ['P','Kaizen','Two-hand fixture for clip insertion','Clips pushed one at a time by thumb.','Fixture inserts four clips in one press.','Manual method not reviewed since model launch.','Cycle time','sec',28,22,41000,3000],
 ['Q','Kaizen','Poka-yoke pin to stop wrong-side handlebar fitting','Left and right brackets look alike; wrong-side fitting found at end-of-line audit.','Locating pin on the jig accepts only the correct side.','No physical stop; relied on the operator noticing.','Defects','nos/month',6,0,85000,2500],
 ['Q','Quick kaizen','Paint mark on axle nut after torque check','Missed torque checks could not be seen after the station.','Operator marks the nut with a paint pen after the torque check.','No visible proof that the check was done.','Escapes','nos/month',3,0,60000,300],
 ['Q','Kaizen','Go / no-go gauge for brake cable length','Cable length checked by eye against a sample.','Go / no-go gauge fixed at the station.','No measuring aid at the station.','Defects','nos/month',9,1,70000,1800],
 ['Q','Quick kaizen','Model-change checklist sticker at the piston station','Wrong piston variant fitted after model change.','Checklist sticker with the variant code at the bin; operator ticks at change-over.','Model change steps not written at the station.','Wrong parts','nos/month',2,0,45000,100],
 ['Q','Kaizen','Magnifier lamp for paint defect inspection','Small paint defects missed under normal light.','Magnifier lamp at the inspection table.','Lighting at the table was too low.','Paint rework','nos/month',14,5,52000,2800],
 ['C','Kaizen','Coolant reuse after filtration at the CNC','Coolant drained and replaced every week.','Bag filter added; coolant reused for three weeks.','Chips in the coolant shortened its life.','Coolant use','L/month',220,140,64000,6000],
 ['C','Quick kaizen','Compressed-air leak stopped at the weld jig','Hissing leak at the jig hose joint.','Joint replaced and a leak tag check added to daily JH.','Worn push-fit joint.','Air leak','CFM',12,2,48000,900],
 ['C','Kaizen','LED lamps at the packing table','Old tube lights at the packing table.','LED lamps with a separate switch per table.','Old fittings; lights on in empty bays.','Power','kWh/month',180,95,21000,3200],
 ['C','Kaizen','Reusable separators instead of cardboard','Cardboard separators thrown away after one use.','Plastic separators returned by the dealer with the crate.','One-way packaging.','Packaging cost','Rs/month',9000,3500,66000,7000],
 ['D','Kaizen','Visual kanban for fastener bins','Line stopped while waiting for fasteners.','Two-bin kanban card; empty bin triggers refill.','No signal to the feeder until the bin was empty.','Line stoppage','min/month',95,20,40000,1500],
 ['D','Kaizen','Shadow board for change-over tools','Tools searched for at every model change.','Shadow board at the station with every change-over tool outlined.','Tools kept in a common drawer.','Change-over time','min',22,14,55000,2200],
 ['D','Quick kaizen','Route labels at the dispatch dock','Crates loaded on the wrong truck.','Colour route labels on the crate and the dock.','Route written only on the delivery note.','Mis-loads','nos/month',4,0,30000,600],
 ['S','Kaizen','Guard on the conveyor drive pulley','Open pulley at knee height near the walkway.','Mesh guard fixed over the pulley.','Guard removed during maintenance and not refitted.','Pinch-point exposures','nos',1,0,0,3500],
 ['S','Quick kaizen','Anti-slip mat at the booth exit','Floor slippery from overspray at the exit.','Anti-slip mat with weekly cleaning in the 5S checklist.','Overspray settles at the exit.','Near misses','nos/month',2,0,0,1800],
 ['S','Kaizen','Spark curtain between weld stations','Sparks reached the next station.','Fire-retardant curtain between stations.','Stations too close after a layout change.','Near misses','nos/month',3,0,0,5200],
 ['S','Quick kaizen','Glove holder at the strap-cutting table','Gloves taken off and left aside while cutting straps.','Glove holder at the table and a cutter with a hidden blade.','Gloves not kept at the point of use.','Cut injuries','nos/quarter',1,0,0,700],
 ['M','One-point lesson','OPL: daily torque gun calibration check','New operators did not know the daily check.','One-page lesson with photos, taught at the start of shift.','Check was passed on by word of mouth.','Operators trained','nos',0,12,0,0],
 ['M','One-point lesson','Picture SOP for new-model wheel fitment','Text-only SOP for the new model.','Picture SOP at the station in Marathi and Hindi.','SOP not updated for the new model.','Operators trained','nos',0,15,0,0],
 ['M','Kaizen','5S zone marking at the sub-assembly area','Trolleys and bins left anywhere; searching for parts.','Floor zones marked for trolleys, bins and WIP.','No fixed place for material.','Search time','min/shift',15,4,18000,2500]
];

const COMMENTS = {
 strong:[['Very sincere and hardworking. Quick learner, picks up new models fast and helps new joiners on the line.','Can take more initiative in kaizen documentation.'],['Excellent output and very dependable. Good team player, follows safety rules.','Should document more kaizens.']],
 good:[['Good attitude and punctual. Follows SOP and safety rules on the line.','Needs to improve speed at model change. Should give more kaizens.'],['Steady worker, good with quality checks.','Needs follow-up on 5S sometimes.']],
 avg:[['Mehnati hai, works fine when supervised.','Output is slow some days. Needs follow-up on quality checks.'],['Attendance is okay. Learning the station.','Slow at model change, needs follow-up.']],
 weak:[['Attendance is okay.','Frequently careless, argues with seniors, does not follow instructions. Repeated mistakes on torque checks.'],['Comes on time.','Careless about quality checks, needs follow-up every day.']],
 lenient:[['Excellent trainee. Very good worker.','Nothing major.']],
 vishal:[['Excellent output, quick learner, good team player.','Mobile use during shift, warned. Must improve discipline.']],
 rahul:[['Good at his stage when present.','Frequently absent, tobacco on premises, careless about safety rules.']],
 sneha:[['Steady and dependable. Improved a lot over the year, punctual.','Needs more speed at model change.']]
};

const DEFAULT_CFG = {
 w:{P:10,Q:10,C:10,D:10,S:10,M:10}, blend:50,
 bandA:76.5, bandB:47.1, vcurAsWL:3, wlNotRec:2, leniency:40, launchBefore:14, kzVerifyDays:30, habN:3, histCount:1,
 vis:{
  hod:{agent:true, comments:true, data:true},
  plant:{scores:true, comments:false, conduct:true, kaizen:true},
  manager:{agent:false, peers:false}
 }
};

/* ======================= HELPERS ======================= */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const d = s => { const [y,m,dd] = s.split('-').map(Number); return new Date(y, m-1, dd); };
const addM = (dt,n) => { const x = new Date(dt); x.setMonth(x.getMonth()+n); return x; };
const fmt = dt => dt ? new Date(dt).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) : '';
const fmtS = dt => dt ? new Date(dt).toLocaleDateString('en-GB',{day:'2-digit',month:'short'}) : '';
const fmtM = dt => dt ? new Date(dt).toLocaleDateString('en-GB',{month:'short',year:'numeric'}) : '';
const pct = v => (Math.round(v*10)/10).toFixed(1)+'%';
const pct0 = v => Math.round(v)+'%';
const clone = o => JSON.parse(JSON.stringify(o));
const r1 = v => Math.round(v*10)/10;
const inr = v => '\u20b9'+Math.round(v).toLocaleString('en-IN');
const lakh = v => v>=100000 ? '\u20b9'+(v/100000).toFixed(1)+' lakh' : inr(v);
const dateKey = dt => { const x = new Date(dt); return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0'); };
const monthsIn = (doj, at) => Math.max(0, (at - d(doj)) / (30.44*DAY));
function rng(seed){ return function(){ seed|=0; seed=seed+0x6D2B79F5|0; let t=Math.imul(seed^seed>>>15,1|seed); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
const stamp = () => fmtS(TODAY)+' '+new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
const clamp = (v,a,b) => Math.max(a, Math.min(b, v));
const initials = n => n.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase();

/* ======================= SEED ======================= */
const _raw = {};
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
function rawOf(tid, st){ const P = (st||S).people[tid]; if(!P || !P.gen) return []; const k = tid+'|'+P.doj+'|'+P.gen.s; if(!_raw[k]) _raw[k] = genAtt(d(P.doj), P.gen.ab, P.gen.la, P.gen.streak, P.gen.s); return _raw[k]; }

const FIRST = ['Aditya','Omkar','Pratik','Sachin','Tushar','Yogesh','Swapnil','Shubham','Akshay','Vaibhav','Rushikesh','Pravin','Sandip','Ajay','Vikas','Mangesh','Kunal','Harshal','Sumit','Rutuja','Komal','Ashwini','Snehal','Gaurav','Nitin','Ravindra','Vinod','Sanket','Ketan','Abhijit','Prasad','Rohit','Sushant','Bhushan','Avinash','Dnyaneshwar','Pallavi','Tejas'];
const LAST = ['Jadhav','Pawar','Borade','Gawande','Sonawane','Chavan','Mane','Shaikh','Tayde','Kharat','Ingle','Dhage','Raut','Lokhande','Bhalerao','Suryawanshi','Thakur','Patil','Nikam','Wankhede','Gholap','Kshirsagar','Datir','Bankar'];
const COURSES = {TTA:['ITI Fitter','ITI Electrician','ITI Machinist','ITI Welder','ITI Turner','ITI Mechanic (Motor Vehicle)'], WILP:['B.Voc Manufacturing','B.Voc Automobile','B.Voc Logistics','B.Voc Mechatronics']};

function ansFor(mu, R, over){
 const out = {};
 ALL_ST.forEach(k=>{ const v = Math.round(mu + (R()-0.5)*1.6); out[k] = clamp(v,1,5); });
 return Object.assign(out, over||{});
}
function profFromMu(mu){ return mu>=4.4?'strong':mu>=3.7?'good':mu>=2.9?'avg':'weak'; }

function seed(){
 const S = {cfg:clone(DEFAULT_CFG), people:{}, sfLen:{}, dev:{}, forms:[], cases:[], kaizens:[], assess:{}, decisions:{}, log:[], triggers:{}, alerts:{}, views:[], tour:{},
  seq:{case:131,form:1,aa:1,p:200,kz:1}, sources:{}, sfDelta:{done:false},
  tl:{file:'TL_Waluj_joiners_2026-10-06.csv', imported:false, rows:[
   {name:'Ajinkya Lokhande',tl:'TR10498812',doj:sh('2026-10-05'),mgr:'m3',line:'Frame Weld 2',course:'B.Voc Manufacturing'},
   {name:'Neha Shirsat',tl:'TR10498877',doj:sh('2026-10-05'),mgr:'m4',line:'Packing L1',course:'B.Voc Logistics'}]},
  reg:{month:'Sep 2026', uploaded:false, rows:[]}};
 // hand-built storylines (kept from the earlier prototype)
 const T = [
  ['t01','Rohan Shinde','TTA','m1','2025-10-06','E-Line 2','strong',4.6,{ie:12,jh:3,st:14},2.3,.02,.02,0,[],'strong'],
  ['t02','Vishal Gaikwad','TTA','m2','2025-09-22','V-Line 1','strong',4.6,{ie:11,jh:3,st:13},2.1,.03,.03,0,[12],'vishal'],
  ['t03','Rahul Bhosale','WILP','m2','2025-09-15','V-Line 3','avg',3.2,{ie:4,jh:2,st:6},1.1,.10,.06,0,[12],'rahul'],
  ['t04','Sneha Patil','TTA','m4','2025-09-29','Dispatch Bay 2','avg',3.6,{ie:7,jh:2,st:8},1.4,.04,.03,0,[12],'sneha'],
  ['t05','Nikhil More','WILP','m1','2025-10-19','E-Line D','avg',3.3,{ie:3,jh:2,st:5},1.0,.05,.04,0,[],'avg'],
  ['t06','Ganesh Wagh','TTA','m3','2025-09-08','Frame Weld 1','lenient',4.95,{ie:5,jh:2,st:6},1.2,.06,.05,0,[12],'lenient'],
  ['t07','Pooja Kale','TTA','m3','2025-09-01','Frame Paint','lenient',4.95,{ie:10,jh:3,st:9},2.0,.02,.02,0,[12],'lenient'],
  ['t08','Akash Pawar','WILP','m3','2025-10-13','Frame Weld 2','good',3.9,{ie:6,jh:2,st:5},1.5,.03,.03,0,[],'good'],
  ['t09','Kiran Salunkhe','WILP','m4','2026-02-16','Packing L1','avg',3.0,{ie:2,jh:1,st:4},.8,.07,.05,5,[],'avg'],
  ['t10','Amol Thorat','TTA','m4','2026-06-01','Dispatch Bay 1','good',3.9,{ie:5,jh:2,st:4},1.3,.03,.02,0,[],'good'],
  ['t11','Priya Deshmukh','WILP','m2','2026-07-01','V-Line 2','good',3.9,{ie:2,jh:1,st:2},.6,.02,.02,0,[],'good'],
  ['t12','Suraj Kamble','TTA','m1','2025-09-08','E-Line 1','weak',2.3,{ie:0,jh:1,st:3},.4,.08,.08,0,[12],'weak'],
  ['t13','Mahesh Kadam','TTA','m3','2025-08-25','Frame Weld 1','lenient',4.95,{ie:9,jh:2,st:7},1.8,.02,.02,0,[12],'lenient'],
  ['t14','Sagar Jadhav','WILP','m4','2025-08-18','Packing L2','weak',2.6,{ie:null,jh:null,st:3},.5,.06,.07,0,[12],'weak']
 ];
 const OVER = {t03:{S2a:3,S1a:3}, t12:{S2a:1,S2b:2,M3a:1,M3b:2}, t04:{P1a:3,P1b:3,Q1a:3,M2a:3,D2a:3,D2b:4,M3a:3}};
 const add = (r,i,gen) => {
  const [id,name,type,mgr,doj0,line,prof,mu,dev,kz,ab,la,streak,done,ck] = r; const doj = gen ? doj0 : sh(doj0);
  const R = rng(i*977+31);
  S.people[id] = {id,name,type,mgr,doj,line,prof,mu,kzRate:kz,ck,ticket:'T'+(48200+i*37),tl:type==='WILP'?'TR10'+(496500+i*113):'',status:'Active',
   empClass:type==='WILP'?'Contingent worker (TeamLease)':'Apprentice (TTA)', course:COURSES[type][Math.floor(R()*COURSES[type].length)], gen:{ab,la,streak,s:i+7}};
  S.sfLen[id] = rawOf(id, S).length - 1;
  S.dev[id] = {...dev, month:'Aug 2026', by:'Coordinator upload'};
  const cms = COMMENTS[ck] || COMMENTS[profFromMu(mu)];
  done.forEach((n,j)=>{
   const cpDate = addM(d(doj), n);
   const cm = cms[(i+j)%cms.length];
   const ans = ansFor(Math.min(5, mu + j*0.12), rng(i*101+n), prof==='lenient' ? Object.fromEntries(ALL_ST.map(k=>[k,5])) : OVER[id]);
   let status = 'Completed';
   if(gen && TODAY - cpDate < 21*DAY){ const x = R(); status = x<.4?'With HoD':x<.65?'In progress':'Completed'; }
   const f = {id:'PF-'+(S.seq.form++), tid:id, cp:'M'+n, cpDate:cpDate.toISOString(), launched:new Date(cpDate.getTime()-14*DAY).toISOString(), status,
    ans: status==='In progress' ? Object.fromEntries(Object.entries(ans).slice(0,7)) : ans, strengths:status==='In progress'?'':cm[0], improve:status==='In progress'?'':cm[1], train:'', discussed:status!=='In progress',
    submitted: status==='In progress' ? '' : fmt(cpDate), signed: status==='Completed' ? fmt(new Date(cpDate.getTime()+2*DAY)) : '', by:MANAGERS[mgr].name};
   if(mu<3.4 && status!=='In progress') f.train = 'Refresher on station quality checks and the SOP for model change; buddy with a senior operator for two weeks.';
   else if(mu<4.2 && status!=='In progress') f.train = 'Second-station certification on the line; kaizen writing session.';
   S.forms.push(f);
  });
 };
 T.forEach((r,i)=>add(r,i,false));
 // generated apprentices so plant-level dashboards look realistic
 const R0 = rng(4242), mgrs = Object.keys(MANAGERS);
 const used = new Set(T.map(t=>t[1]));
 for(let i=0;i<36;i++){
  let name; do { name = FIRST[Math.floor(R0()*FIRST.length)]+' '+LAST[Math.floor(R0()*LAST.length)]; } while(used.has(name)); used.add(name);
  const mgr = mgrs[i % mgrs.length], M = MANAGERS[mgr];
  const type = R0()<.55?'TTA':'WILP';
  const doj = dateKey(R0()<.55 ? new Date(2025,7,4+SHIFT).getTime() + Math.floor(R0()*80)*DAY : new Date(2026,0,5+SHIFT).getTime() + Math.floor(R0()*220)*DAY);
  const q = R0(), mu = r1(2.4 + 2.3*q);
  const done = [12].filter(n=>addM(d(doj),n) <= TODAY);
  const dev = {ie: q>.15 ? Math.round(q*13) : 0, jh: Math.min(3, 1+Math.floor(q*3)), st: 2+Math.round(q*12)};
  if(R0()<.08) dev.ie = null;
  const row = ['g'+String(i+1).padStart(2,'0'), name, type, mgr, doj, M.lines[Math.floor(R0()*M.lines.length)], profFromMu(mu), mu, dev, r1(.3+q*2), Math.round((.012+(1-q)*.07)*1000)/1000, Math.round((.015+(1-q)*.06)*1000)/1000, 0, done, null];
  add(row, 14+i, true);
 }
 S.forms.filter(f=>f.cp==='M12' && (f.tid==='t02'||f.tid==='t03')).forEach(f=>{ f.status='With HoD'; f.signed=''; });
 autoLaunch(S);
 seedKaizens(S);
 seedCases(S);
 // decisions on completed M12s
 // completed Month 12 reviews: HoD confirmed the outcome; older ones already recorded in SF/EC
 Object.values(S.people).forEach(p=>{ const f = S.forms.find(x=>x.tid===p.id&&x.cp==='M12'&&x.status==='Completed'); if(!f) return; const at = fmtS(new Date(new Date(f.cpDate).getTime()+3*DAY)); S.decisions[p.id] = {hod:{choice:null,reason:'',by:HODS[MANAGERS[p.mgr].hod].name,at}}; if(TODAY - new Date(f.cpDate) > 10*DAY) S.decisions[p.id].hr = {by:'N. Sharma',at}; });
 // reg upload rows for September
 Object.values(S.people).forEach((p,i)=>{ const v = S.dev[p.id], R = rng(i*31+5); S.reg.rows.push({ticket:p.ticket, name:p.name, st: v.st==null?null:v.st+(R()<.4?1:0), jh:v.jh, ie: v.ie==null?null:v.ie+(R()<.5?1:0)}); });
 S.reg.rows.push({ticket:'T99999', name:'(not found)', st:3, jh:1, ie:2});
 S.views = [
  {id:'v1',name:'All apprentices',cols:['ticket','name','type','plant','dept','mgr','month','band','overall','att','kz3','conduct','next'],f:{},group:'',sort:'name',sys:true},
  {id:'v2',name:'Month 12 outcomes',cols:['ticket','name','dept','mgr','month','band','overall','rec','decision'],f:{m12:true},group:'dept',sort:'overall',sys:false},
  {id:'v3',name:'At risk',cols:['ticket','name','dept','mgr','band','att','conduct','flags'],f:{risk:true},group:'',sort:'overall',sys:false},
  {id:'v4',name:'WILP (TeamLease)',cols:['ticket','tl','name','dept','month','band','att','next'],f:{type:'WILP'},group:'mgr',sort:'name',sys:false}
 ];
 S.sources = {
  sf:{last:'07 Oct 05:30',rec:Object.keys(S.people).length,status:'ok',note:'Delta: 0 new, 0 changed'},
  sfout:{last:'03 Oct 16:41',rec:1,status:'ok',note:'1 job change sent'},
  time:{last:'07 Oct 06:00',rec:Object.keys(S.people).length,status:'ok',note:'File for 06 Oct accepted'},
  tl:{last:'29 Sep 18:30',rec:0,status:'warn',note:'New weekly file received; not imported'},
  coord:{last:'05 Sep 11:20',rec:Object.keys(S.people).length,status:'warn',note:'September upload due by 05 Oct'},
  lms:{last:'\u2014',rec:0,status:'plan',note:'Interface to confirm with IT'}
 };
 return S;
}
function autoLaunch(S){
 const n = [];
 Object.values(S.people).filter(p=>p.status==='Active').forEach(p=>{
  const have = new Set(S.forms.filter(f=>f.tid===p.id).map(f=>f.cp));
  [12].forEach(m=>{
   const cp = 'M'+m; if(have.has(cp)) return;
   const cpDate = addM(d(p.doj), m), launch = new Date(cpDate.getTime()-S.cfg.launchBefore*DAY);
   if(launch<=TODAY){
    S.forms.push({id:'PF-'+(S.seq.form++), tid:p.id, cp, cpDate:cpDate.toISOString(), launched:launch.toISOString(), status:'Not started', ans:{}, strengths:'', improve:'', train:'', discussed:false, by:MANAGERS[p.mgr].name});
    have.add(cp); n.push(p.name+' '+cp);
   }
  });
 });
 return n;
}
function kzId(cat, dt, seq, plant){ return 'KZ/'+(plant||'WLJ')+'/'+cat+'/'+dateKey(dt).slice(0,7)+'/'+String(seq).padStart(4,'0'); }
function kzGrade(pts){ return pts>=16?'Gold':pts>=9?'Silver':'Bronze'; }
function seedKaizens(S){
 const list = [];
 Object.values(S.people).forEach((p,i)=>{
  const R = rng(i*733+9), start = Math.max(d(p.doj).getTime()+20*DAY, TODAY.getTime()-270*DAY);
  for(let t = start; t < TODAY.getTime(); t += 30*DAY){
   const lam = p.kzRate/0.85; let n = Math.floor(lam) + (R() < lam%1 ? 1 : 0);
   while(n-->0){
    const dt = new Date(Math.min(TODAY.getTime()-DAY, t + Math.floor(R()*30)*DAY));
    const tp = KZ_TPL[Math.floor(R()*KZ_TPL.length)];
    const age = (TODAY - dt)/DAY;
    let status;
    const x = R();
    if(age > 50) status = x<.78?'Verified':x<.86?'Implemented':x<.9?'Not sustained':'Rejected';
    else if(age > 14) status = x<.62?'Implemented':x<.84?'Approved':x<.9?'Rework':'Rejected';
    else status = x<.6?'Submitted':'Approved';
    list.push({p, dt, tp, status, R:R()});
   }
  }
 });
 list.sort((a,b)=>a.dt-b.dt);
 list.forEach(({p,dt,tp,status,R:rr})=>{
  const [cat,type,title,before,after,root,mn,unit,mb,ma,saving,cost] = tp;
  const R = rng(Math.floor(rr*1e9));
  const seq = S.seq.kz++;
  const mates = Object.values(S.people).filter(x=>x.mgr===p.mgr && x.id!==p.id);
  const team = R()<.25 && mates.length ? [mates[Math.floor(R()*mates.length)].id] : [];
  const k = {id:kzId(cat,dt,seq,MANAGERS[p.mgr].plant), seq, tid:p.id, team, date:dateKey(dt), dept:MANAGERS[p.mgr].dept, line:p.line, station:'Stn '+(2+Math.floor(R()*14)), cat, type, title, before, after, root,
   benefit: saving>0 ? 'Tangible' : 'Intangible', metric:{name:mn, unit, before:mb, after:ma}, saving: saving ? Math.round(saving*(0.7+R()*0.6)/1000)*1000 : 0, cost,
   horiz:{yes:R()<.35, where:''}, std: type==='One-point lesson' ? 'OPL issued' : (R()<.6 ? 'SOP updated' : 'None'), photos:{before:true, after:status!=='Submitted' && status!=='Approved'},
   status, hist:[{at:fmt(dt),by:'Line tablet',what:'Submitted'}], channel:'Line tablet'};
  if(k.horiz.yes) k.horiz.where = MANAGERS[p.mgr].lines.filter(l=>l!==p.line).slice(0,2).join(', ');
  if(status!=='Submitted'){
   const imp = 2+Math.floor(R()*4), org = 2+Math.floor(R()*4);
   k.eval = {impact:imp, orig:org, pts:imp*org, by:MANAGERS[p.mgr].name, at:fmt(new Date(dt.getTime()+3*DAY)), remarks: status==='Rejected' ? 'Duplicate of an earlier kaizen on this line.' : status==='Rework' ? 'Add the before / after measurement.' : 'Good idea. Approved.'};
   k.hist.push({at:k.eval.at, by:k.eval.by, what: status==='Rejected'?'Rejected':status==='Rework'?'Sent back for rework':'Approved \u00b7 '+kzGrade(k.eval.pts)});
  }
  if(['Implemented','Verified','Not sustained'].includes(status)){
   const ia = new Date(Math.min(TODAY.getTime()-DAY, dt.getTime()+(7+Math.floor(R()*10))*DAY));
   k.implAt = dateKey(ia); k.hist.push({at:fmt(ia), by:MANAGERS[p.mgr].name, what:'Marked implemented'});
  }
  if(status==='Verified' || status==='Not sustained'){
   const va = new Date(d(k.implAt).getTime()+(30+Math.floor(R()*8))*DAY);
   k.verify = {by:'Kaizen coordinator', at:fmt(va), sustained:status==='Verified', saving:status==='Verified'?k.saving:0, remarks: status==='Verified' ? 'Checked at the station; still in use.' : 'Change not in use at the station.'};
   k.hist.push({at:k.verify.at, by:'Kaizen coordinator', what: status==='Verified'?'Verified \u00b7 sustained':'Not sustained'});
  }
  S.kaizens.push(k);
 });
}
function seedCases(S){
 const C = (id,tid,k,date0,time,place,desc,status,action,extra={}) => {
  const date = date0.length===10 && /^\d{4}-/.test(date0) && extra.abs!==true ? sh(date0) : date0;
  const c = {id,tid,k,date,time,place,desc,evidence:extra.ev||[],reporter:extra.rep||'Security (line tablet)',status,channel:extra.ch||'Line tablet',steps:{reported:{by:extra.rep||'Security',at:fmt(d(date))}}};
  const at = n => fmt(new Date(d(date).getTime()+n*DAY));
  if(status>=2) c.steps.validated = {by:extra.val||MANAGERS[S.people[tid].mgr].name,at:at(1),remarks:extra.vr||'Confirmed with line supervisor.'};
  if(status>=3) c.steps.action = {by:HODS[MANAGERS[S.people[tid].mgr].hod].name,at:at(2),label:action[0],level:action[1],reason:''};
  if(status>=4) c.steps.letter = action[1]==='none' ? {by:'N. Sharma',at:at(3),type:'No letter'} : {by:'N. Sharma',at:at(3),type:{vcur:'Verbal counselling / underwriting record',wl:'Warning letter',end:'Termination / discontinuation letter'}[action[1]],ref:'HR/CON/'+date.slice(0,4)+'/'+id.replace('C-',''),ack:true};
  c.imm = ({oth:['Supervisor and HR informed'],brk:['Supervisor and HR informed'],mob:['Mobile phone confiscated','Mobile returned after shift'],tob:['Statement / confession taken'],uni:['Sent home and marked absent'],sho:['Supervisor and HR informed'],acc:['First aid given'],vrb:['Statement / confession taken'],neg:['Supervisor and HR informed']})[k]||[];
  if(k==='acc') c.injury = {what:'Minor cut on hand', days:0, cause:'No: record only'};
  if(extra.wit) c.wit = extra.wit;
  if(status>=5){ c.steps.closed = {by:'N. Sharma',at:at(4)}; c.closedAt = new Date(d(date).getTime()+4*DAY).toISOString(); }
  S.cases.push(c);
 };
 C('C-101','t02','mob','2026-03-11','10:40','V-Line 1','Found using mobile phone during working hours in security round.',5,['VC / UR','vcur']);
 C('C-102','t02','mob','2026-06-18','15:05','V-Line 1','Second instance: mobile phone with earphones at stage during shift.',5,['Warning letter','wl']);
 C('C-103','t05','neg','2026-09-20','14:15','E-Line D','During model change did not check the piston variant; after knowing it was wrong, did not inform anyone.',1,null,{rep:'S. Kulkarni (line manager)'});
 C('C-104','t06','sho','2026-03-02','08:20','Frame Weld 1','Found without safety shoes at the station.',5,['VC / UR','vcur']);
 C('C-105','t06','uni','2026-05-14','07:55','Main gate','Reported without uniform; sent home and marked absent.',5,['VC / UR','vcur']);
 C('C-106','t06','stg','2026-08-07','11:30','Frame Weld 1','Left stage for 40 minutes without approval.',5,['VC / UR','vcur']);
 C('C-107','t12','vrb','2026-09-29','16:10','E-Line 1','Verbal argument with senior operator; abusive language used.',2,null,{rep:'S. Kulkarni (line manager)',vr:'Two witnesses confirm abusive language.'});
 C('C-108','t10','acc','2026-07-22','13:00','Dispatch Bay 1','Minor cut on hand while opening packing strap. First aid given. Gloves were worn.',5,['Record only (no penalty)','none'],{rep:'M. Rao (line manager)'});
 C('C-109','t03','tob','2026-02-09','12:50','Canteen area','Found consuming tobacco on company premises.',5,['Warning letter','wl']);
 C('C-110','t03','cua','2026-05-04','09:00','\u2014','Absent without information for 5 continuous days. Day 4 call made, warning letter issued.',5,['Warning letter','wl']);
 C('C-111','t12','neg','2026-07-15','10:20','E-Line 1','Torque check skipped on two engines; found at end-of-line audit.',5,['VC / UR','vcur'],{rep:'S. Kulkarni (line manager)'});
 C('C-120','t11','oth','2026-10-03','15:40','Scrap yard','Found in the scrap yard during shift without a gate pass; no reason given. Not on the code list as described; HR to classify.',1,null,{rep:'Security (line tablet)'});
 C('C-121','t09','brk','2026-08-12','13:35','Packing L1','Came back 25 minutes late from the lunch break; second time this week per the line leader.',5,['VC / UR','vcur'],{rep:'M. Rao (line manager)'});
 // a few on generated apprentices
 const R = rng(77), gs = Object.values(S.people).filter(p=>p.id[0]==='g' && p.mu<3.6);
 const opts = [['mob','Mobile phone use at the station during shift.'],['stg','Away from stage for 30 minutes without approval.'],['sho','Working without safety gloves at the station.'],['hab','Absent on 4 Mondays this month without information.'],['neg','Wrong part fitted and not reported; found at quality gate.']];
 gs.slice(0,7).forEach((p,i)=>{
  const [k,desc] = opts[i%opts.length];
  const dt = new Date(Math.max(d(p.doj).getTime()+40*DAY, TODAY.getTime()-(10+Math.floor(R()*150))*DAY));
  const st = i<5 ? 5 : (i===5 ? 2 : 1);
  C('C-'+(112+i), p.id, k, dateKey(dt), '1'+Math.floor(R()*6)+':'+String(Math.floor(R()*60)).padStart(2,'0'), p.line, desc, st, ['VC / UR','vcur'], {abs:true, rep: R()<.5?'Security (line tablet)':MANAGERS[p.mgr].name+' (line manager)'});
 });
}

/* ======================= LOOK-UPS ======================= */
function attStats(tid, asOf){
 let a = rawOf(tid).slice(0, S.sfLen[tid] ?? 0);
 if(asOf){ const k = dateKey(asOf); a = a.filter(x=>x.d<=k); }
 const work = a.filter(x=>x.s!=='W');
 const pres = work.filter(x=>x.s!=='A').length;
 const last30 = a.slice(-30).map(x=>x.s);
 let cont = 0; for(let i=a.length-1;i>=0;i--){ if(a[i].s==='W') continue; if(a[i].s==='A') cont++; else break; }
 return {sched:work.length, pres, pct: work.length ? pres/work.length*100 : 100, late30:last30.filter(x=>x==='L').length, lateY:a.slice(-366).filter(x=>x.s==='L').length, abs30:last30.filter(x=>x==='A').length, last30, cont, syncedTo: a.length ? a[a.length-1].d : '\u2014', days:a};
}
function pendingDays(tid){ return rawOf(tid).length - (S.sfLen[tid] ?? 0); }
function kzOf(tid){ return S.kaizens.filter(k=>k.tid===tid || (k.team||[]).includes(tid)); }
const KZ_DONE = ['Implemented','Verified'];
function kzStats(tid, asOf){
 const at = asOf ? new Date(asOf) : TODAY, from = new Date(at.getTime()-91*DAY);
 const p = S.people[tid], mos3 = clamp(monthsIn(p.doj, at), 1, 3), mos = clamp(monthsIn(p.doj, at), 1, 12), from12 = new Date(at.getTime()-366*DAY);
 const all = kzOf(tid).filter(k=>d(k.date)<=at);
 const impl = all.filter(k=>k.implAt && KZ_DONE.includes(k.status) && d(k.implAt)<=at && d(k.implAt)>=from);
 const ver = all.filter(k=>k.status==='Verified');
 const saving = ver.reduce((s,k)=>s+(k.verify?k.verify.saving:0),0);
 const implY = all.filter(k=>k.implAt && KZ_DONE.includes(k.status) && d(k.implAt)<=at && d(k.implAt)>=from12).length;
 return {all:all.length, impl3:impl.length, implY, rate:implY/mos, mos, mos3, implAll:all.filter(k=>KZ_DONE.includes(k.status)||k.status==='Not sustained').length, verified:ver.length, saving};
}
function devAsOf(p, asOf){
 const v = S.dev[p.id] || {}, at = asOf ? new Date(asOf) : TODAY;
 const ratio = clamp(monthsIn(p.doj, at) / Math.max(1, monthsIn(p.doj, TODAY)), 0, 1);
 return {ie: v.ie==null?null:r1(v.ie*ratio), jh: v.jh==null?null:Math.min(v.jh, Math.max(0, Math.floor(monthsIn(p.doj,at)/3))), st: v.st==null?null:Math.max(1, Math.round(v.st*ratio)), month:v.month, by:v.by};
}
function conduct(tid, asOf){
 const lim = asOf ? new Date(asOf) : null;
 const cs = S.cases.filter(c=>c.tid===tid);
 const closed = cs.filter(c=>c.status===5 && (!lim || new Date(c.closedAt)<=lim) && (S.cfg.histCount!==0 || !c.hist));
 const lvl = (arr,l) => arr.filter(c=>c.steps.action && c.steps.action.level===l).length;
 const disc = closed.filter(c=>MISK[c.k].tier>0);
 const vcur = lvl(disc,'vcur'), wl = lvl(disc,'wl'), end = lvl(disc,'end'), open = cs.filter(c=>c.status<5).length;
 const eff = wl + (vcur>=S.cfg.vcurAsWL ? 1 : 0);
 const saf = closed.filter(c=>SAFETY_K.includes(c.k)), qual = closed.filter(c=>QUALITY_K.includes(c.k)), other = disc.filter(c=>!SAFETY_K.includes(c.k)&&!QUALITY_K.includes(c.k));
 return {vcur,wl,end,open,eff,closed:closed.length,cases:cs,
  saf:{n:saf.length, wl:lvl(saf,'wl')+lvl(saf,'end'), vcur:lvl(saf,'vcur')},
  qual:{n:qual.length},
  oth:{vcur:lvl(other,'vcur'), wl:lvl(other,'wl')+lvl(other,'end')}};
}
const LEX = {
 pos:['excellent','very good','good','sincere','hardworking','hard working','quick learner','punctual','helpful','helps','dependable','reliable','disciplined','improving','improved','steady','team player','initiative','accha','achha','badhiya','mehnati','chan','hushar'],
 neg:['slow','careless','late','absent','mistake','mistakes','lazy','argues','argue','not follow','does not','needs follow-up','follow-up','poor','weak','mobile','casual','aalsi','kharab','dhyan nahi','galti','warned'],
 red:['unsafe','fight','abuse','abusive','refuses','refused','tobacco','alcohol','drunk','theft','frequently absent','sleeping','safety violation']
};
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
 const words = (String(a||'')+' '+String(b||'')).trim().split(/\s+/).filter(Boolean).length;
 const label = !words ? 'None' : net>=1.5?'Positive':net<=-1?'Negative':'Neutral';
 return {label, pts:label==='Positive'?5:label==='Negative'?1:label==='None'?null:3, net, hits, words};
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

/* ======================= SCORING ======================= */
function dataScore(par, p, f, asOf){
 const C = S.cfg;
 switch(par.data){
  case 'att': { const a = attStats(p.id, asOf); let s = a.pct>=95?5:a.pct>=92?4:a.pct>=88?3:a.pct>=85?2:1; const pen = a.lateY>12; if(pen) s = Math.max(1, s-1);
   return {pts:s, val:pct(a.pct)+' present over the apprenticeship \u00b7 '+a.lateY+' late-in'+(a.lateY===1?'':'s')+' in the year'+(pen?' \u2212 1':'')}; }
  case 'kz': { const k = kzStats(p.id, asOf); const r = k.rate; return {pts: r>=2?5:r>=1.5?4:r>=1?3:r>=.5?2:1, val:k.implY+' implemented in '+Math.round(k.mos)+' month'+(Math.round(k.mos)===1?'':'s')+' \u00b7 '+r.toFixed(1)+' / month'}; }
  case 'ie': { const v = devAsOf(p, asOf).ie; if(v==null) return {missing:true, val:'No IE study on record'}; return {pts: v>=10?5:v>=5?4:v>=1?3:2, val:v+'% task-time reduction'}; }
  case 'jh': { const v = devAsOf(p, asOf).jh; if(v==null) return {missing:true, val:'No TPM record'}; return {pts: v>=3?5:v===2?4:v===1?3:2, val: v?'JH Step '+v+' certified':'No JH step yet'}; }
  case 'skill': { const v = devAsOf(p, asOf).st; if(v==null) return {missing:true, val:'No skill matrix row'}; return {pts: v>12?5:v>=9?4:v>=6?3:v>=3?2:1, val:v+' station'+(v===1?'':'s')+' certified'}; }
  case 'safety': { const c = conduct(p.id, asOf).saf; return {pts: c.wl?1:c.vcur?3:5, val: c.n ? c.n+' safety case(s): '+(c.wl?c.wl+' warning':c.vcur+' VC/UR') : 'No safety case'}; }
  case 'qlapse': { const c = conduct(p.id, asOf).qual; return {pts: c.n>=2?1:c.n===1?3:5, val: c.n ? c.n+' quality lapse(s) closed' : 'No quality lapse'}; }
  case 'conduct': { const c = conduct(p.id, asOf).oth; const eff = c.wl + (c.vcur>=C.vcurAsWL?1:0); const pts = c.wl>=2?1:(eff>=1?2:c.vcur===2?3:c.vcur===1?4:5); return {pts, val: (c.wl||c.vcur) ? [c.wl?c.wl+' warning letter'+(c.wl>1?'s':''):'', c.vcur?c.vcur+' VC/UR':''].filter(Boolean).join(', ') : 'Clean record'}; }
  case 'sent': { const s = sentiment(f.strengths, f.improve); if(s.pts==null) return {missing:true, val:'No comments yet'}; return {pts:s.pts, val:'Comments read '+s.label.toLowerCase()}; }
 }
 return null;
}
const RANK = {A:3,B:2,C:1,X:0};
let _ev = new Map(), _len = null;
function resetMemo(){ _ev = new Map(); _len = null; }
function evaluate(p, f, opts={}){
 const key = f.id+'|'+(opts.noPrev?1:0)+(opts.noLen?1:0)+'|'+JSON.stringify(f.ans)+f.strengths+f.improve;
 if(_ev.has(key)) return _ev.get(key);
 const C = S.cfg, asOf = new Date(Math.min(new Date(f.cpDate).getTime(), TODAY.getTime()));
 const rows = PARAMS.map(par=>{
  const vals = par.st.map(k=>f.ans[k]).filter(v=>v);
  const mgr = vals.length ? vals.reduce((s,v)=>s+v,0)/vals.length : null;
  const dt = par.data ? dataScore(par, p, f, asOf) : null;
  const dpts = dt && !dt.missing ? dt.pts : null;
  let score = null;
  if(mgr!=null && dpts!=null) score = (mgr*C.blend + dpts*(100-C.blend))/100; else score = mgr!=null ? mgr : dpts;
  return {par, mgr, dt, dpts, score, answered:vals.length, of:par.st.length};
 });
 const bk = BORDER.map(b=>{ const rs = rows.filter(r=>r.par.b===b && r.score!=null); const v = rs.length ? rs.reduce((s,r)=>s+r.score,0)/rs.length : null; return {b, v, p: v==null?null:v/5*100, w:Number(C.w[b])||0}; });
 const wsum = bk.reduce((s,x)=>s+(x.v!=null?x.w:0),0)||1;
 const overall = bk.reduce((s,x)=>s+(x.v!=null?x.w*x.v:0),0)/wsum/5*100;
 const band = overall>=C.bandA?'A':overall>=C.bandB?'B':'C';
 const cd = conduct(p.id, asOf), sen = sentiment(f.strengths, f.improve);
 let fb = band, capped = false;
 if(cd.end) fb = 'X'; else if(cd.eff>=C.wlNotRec){ fb='C'; capped = band!=='C'; } else if(cd.eff>=1 && band==='A'){ fb='B'; capped = true; }
 const reasons = ['Overall '+pct(overall)+' \u2192 band '+band+' (A \u2265 '+C.bandA+'%, B \u2265 '+C.bandB+'%).'];
 if(cd.end) reasons.push('Gross misconduct closed with termination: training ended.');
 else if(cd.eff>=C.wlNotRec) reasons.push(cd.eff+' warning-level actions on record (limit '+C.wlNotRec+'): outcome is Below expectations unless the HoD overrides with a reason.');
 else if(cd.eff===1) reasons.push((cd.wl?'1 warning letter / show cause / suspension':cd.vcur+' VC/UR across categories (treated as a warning letter)')+': band capped at B.');
 else if(cd.vcur) reasons.push(cd.vcur+' VC/UR on record (minor).'); else reasons.push('Clean conduct record.');
 if(cd.open) reasons.push(cd.open+' open case(s): not counted until closed.');
 const weak = bk.filter(x=>x.p!=null && x.p<60).map(x=>BUCKETS[x.b].name);
 const strong = bk.filter(x=>x.p!=null && x.p>=85).map(x=>BUCKETS[x.b].name);
 const rec = OUTCOME[fb];
 const status = cd.end?'Training ended':(fb==='C'||cd.eff>=1||cd.open)?'At risk':'On track';
 const flags = [];
 const mv = ALL_ST.map(k=>f.ans[k]).filter(Boolean); const avg = mv.reduce((s,v)=>s+v,0)/(mv.length||1);
 if(avg>=4.2 && sen.label==='Negative') flags.push(['bad','Rating\u2013comment mismatch','Statements are rated high but the comments read negative.']);
 if(avg<=2.4 && sen.label==='Positive') flags.push(['warn','Rating\u2013comment mismatch','Statements are rated low but the comments read positive.']);
 rows.forEach(r=>{ if(r.mgr!=null && r.dpts!=null && Math.abs(r.mgr-r.dpts)>=2.5) flags.push(['warn','Rating\u2013record gap: '+r.par.name,'Manager average '+r.mgr.toFixed(1)+' but records give '+r.dpts+' ('+r.dt.val+').']); });
 if((f.ans.S1a||5)<=1 || (f.ans.S2a||5)<=1) flags.push(['bad','Safety / discipline red flag','A statement on PPE or SOPs was rated Strongly disagree.']);
 const len = !opts.noLen && leniency()[p.mgr]; if(len && len.flag) flags.push(['warn','Leniency',MANAGERS[p.mgr].name+' rates '+Math.round(len.share)+'% of reviewed apprentices as band A (limit '+C.leniency+'%).']);
 let prev = null;
 if(!opts.noPrev){ const pf = formsOf(p.id).filter(x=>isDone(x) && new Date(x.cpDate)<new Date(f.cpDate)).pop(); if(pf){ prev = evaluate(p, pf, {noPrev:true,noLen:true}); if(RANK[prev.band]>RANK[band]) flags.push(['warn','Sharp drop','Band fell from '+prev.band+' at '+pf.cp+' to '+band+'.']); } }
 if(sen.words && sen.words<10) flags.push(['info','Thin comment','Only '+sen.words+' words; too short to read the manager\u2019s view reliably.']);
 if(cd.open) flags.push(['info','Pending case',cd.open+' open case(s) in the conduct log.']);
 rows.filter(r=>r.dt && r.dt.missing && r.par.data!=='sent').forEach(r=>flags.push(['info','No record: '+r.par.name, r.dt.val+'; scored on the manager\u2019s rating only.']));
 const e = {rows,bk,overall,band,fb,capped,cd,sen,rec,reasons,status,flags,weak,strong,prev,asOf};
 e.narrative = narrative(p, f, e);
 _ev.set(key, e);
 return e;
}
const andList = a => a.length<2 ? a.join('') : a.slice(0,-1).join(', ')+' and '+a[a.length-1];
function narrative(p, f, e){
 const first = p.name.split(' ')[0];
 const a = attStats(p.id, e.asOf), k = kzStats(p.id, e.asOf), dv = devAsOf(p, e.asOf);
 const parts = [];
 parts.push(`${first} scores ${pct(e.overall)} at ${f.cp} (band ${e.fb==='X'?'\u2014':e.fb}${e.capped?', capped from '+e.band:''}).`);
 if(e.strong.length) parts.push(`Strongest in ${andList(e.strong)}.`);
 if(e.weak.length) parts.push(`Needs work in ${andList(e.weak)}.`);
 parts.push(`Attendance ${pct(a.pct)} over the apprenticeship, with ${a.lateY} late-in${a.lateY===1?'':'s'} in the year.`);
 parts.push(`${k.implY} kaizen${k.implY===1?'':'s'} implemented over the apprenticeship (${k.rate.toFixed(1)} a month)${k.verified?', '+k.verified+' verified as sustained overall':''}${k.saving?' (verified saving '+lakh(k.saving)+' a year)':''}.`);
 if(dv.st!=null) parts.push(`${dv.st} stations certified${dv.jh?', JH Step '+dv.jh:''}.`);
 parts.push(e.cd.closed||e.cd.open ? `Conduct: ${e.cd.wl} warning${e.cd.wl===1?'':'s'}, ${e.cd.vcur} VC/UR${e.cd.open?', '+e.cd.open+' open':''}.` : 'Clean conduct record.');
 if(e.sen.label!=='None') parts.push(`Manager comments read ${e.sen.label.toLowerCase()}.`);
 if(e.prev) parts.push(`Previous checkpoint: ${pct(e.prev.overall)} (${e.overall>=e.prev.overall?'up':'down'} ${Math.abs(e.overall-e.prev.overall).toFixed(1)} points).`);
 return parts.join(' ');
}
function paramShare(k){ const C = S.cfg, b = PK[k].b, tot = BORDER.reduce((s,x)=>s+(Number(C.w[x])||0),0)||1; return (Number(C.w[b])||0)/tot / PARAMS.filter(p=>p.b===b).length; }
function bucketShare(b){ const C = S.cfg, tot = BORDER.reduce((s,x)=>s+(Number(C.w[x])||0),0)||1; return (Number(C.w[b])||0)/tot; }
function formsOf(tid){ return S.forms.filter(f=>f.tid===tid).sort((a,b)=>new Date(a.cpDate)-new Date(b.cpDate)); }
const isDone = f => f.status==='With HoD' || f.status==='Completed';
function lastSubmitted(tid){ const f = formsOf(tid).filter(isDone); return f[f.length-1]||null; }
function openForm(tid){ return formsOf(tid).find(f=>f.status==='Not started'||f.status==='In progress')||null; }
function leniency(){
 if(_len) return _len; _len = {};
 Object.keys(MANAGERS).forEach(m=>{ const ps = Object.values(S.people).filter(p=>p.mgr===m && lastSubmitted(p.id)); const a = ps.filter(p=>evaluate(p,lastSubmitted(p.id),{noPrev:true,noLen:true}).band==='A').length; const share = ps.length?a/ps.length*100:0; _len[m] = {n:ps.length,a,share,flag:ps.length>=3&&share>S.cfg.leniency}; });
 return _len;
}
function latestEval(p){ const f = lastSubmitted(p.id); return f ? {f, e:evaluate(p,f)} : null; }
function attMonths(p, asOf){ const a = attStats(p.id, asOf), m = {}; a.days.forEach(x=>{ if(x.s==='W') return; const k = x.d.slice(0,7); (m[k] ||= {n:0,p:0}); m[k].n++; if(x.s!=='A') m[k].p++; }); return Object.entries(m).slice(-12).map(([k,v])=>({k, v:v.p/v.n*100})); }
function trend(p){ return formsOf(p.id).filter(isDone).map(f=>({cp:f.cp, v:evaluate(p,f,{noPrev:true,noLen:true}).overall})); }
function nextCp(p){ const done = new Set(formsOf(p.id).filter(isDone).map(f=>f.cp)); for(const m of [12]){ if(!done.has('M'+m)) return {cp:'M'+m, date:addM(d(p.doj),m)}; } return null; }
function suggest(tid,k,excl){ const m = MISK[k], cur = excl ? S.cases.find(c=>c.id===excl) : null; const prior = S.cases.filter(c=>c.tid===tid&&c.k===k&&c.id!==excl&&c.status===5&&c.steps.action&&!['none','?'].includes(c.steps.action.level)&&(!cur||c.date<cur.date||(c.date===cur.date&&c.id<cur.id))).length; const i = Math.min(prior,m.lad.length-1); return {label:m.lad[i][0],level:m.lad[i][1],prior,step:i+1,of:m.lad.length}; }
function hodOf(p){ return MANAGERS[p.mgr].hod; }
function absAlerts(){ return Object.values(S.people).filter(p=>p.status==='Active').map(p=>({p,a:attStats(p.id)})).filter(x=>x.a.cont>=4); }
/* attendance-driven prompts to log MC-08 / MC-09, from the time system */
function attPrompts(ps){
 const since = n => dateKey(new Date(TODAY.getTime()-n*DAY));
 return ps.filter(p=>p.status==='Active').map(p=>{ const a = attStats(p.id), has = (k,n) => S.cases.some(c=>c.tid===p.id && c.k===k && c.date>=since(n));
  if(a.cont>=4 && !has('cua',30)) return {p, k:'cua', why:a.cont+' working days absent in a row'};
  if(a.abs30>=(S.cfg.habN||3) && !has('hab',30)) return {p, k:'hab', why:a.abs30+' unplanned absences in the last 30 days'};
  return null; }).filter(Boolean);
}
/* record-standard checks on one case */
function caseIssues(c){
 const out = [], age = Math.round((TODAY - d(c.date))/DAY), a = c.steps.action, L = c.steps.letter;
 if(c.k==='oth' && c.status<5) out.push(age>7 ? 'Code not assigned in 7 days' : 'HR to assign a code');
 if((c.desc||'').trim().length<10) out.push('Description missing');
 if(!c.hist){ const due = {1:[3,'Validation overdue'],2:[6,'Action overdue'],3:[9,'Letter overdue'],4:[10,'Closure overdue']}[c.status]; if(due && age>due[0] && c.k!=='posh') out.push(due[1]); }
 if(a && a.level==='?') out.push('Action not recorded');
 if(a && !c.hist && !['none','ic'].includes(a.level) && c.k!=='oth'){ const sg = suggest(c.tid,c.k,c.id); if(sg.level!==a.level && !(a.reason||'').trim()) out.push('Differs from ladder, no reason'); }
 if(L && a && !c.hist && ['vcur','wl','end'].includes(a.level) && L.type!=='No letter' && (!L.ref || !L.ack)) out.push('Letter ref / acknowledgement missing');
 return out;
}
function log(dir,from,to,what){ S.log.unshift({at:stamp(),dir,from,to,what,ts:Date.now()}); if(S.log.length>120) S.log.length = 120; }
function seedLog(){
 S.log = [];
 const L = (at,dir,from,to,what) => S.log.push({at,dir,from,to,what});
 L('07 Oct 06:00','in','Time system','PRAGATI Attendance','Daily attendance file for 06 Oct: '+Object.keys(S.people).length+' apprentices, all records accepted.');
 L('07 Oct 05:30','in','SAP SF/EC','PRAGATI Master','Employee master delta: 0 new, 0 changed, 0 exits.');
 L('06 Oct 23:00','sys','Scheduler','PRAGATI Reviews','Nightly checks: Month 12 reviews opened 14 days before the date; reminders sent for overdue reviews.');
 L('03 Oct 16:41','out','PRAGATI','SAP SF/EC Performance','Sneha Patil: Month 12 rating recorded (Meets expectations).');
 L('02 Oct 11:05','wf','HoD','PRAGATI Review','Sneha Patil: Month 12 review signed; outcome Meets expectations confirmed.');
 L('05 Sep 11:20','in','Coordinators','PRAGATI Skills & TPM','August registers uploaded: '+Object.keys(S.people).length+' rows accepted.');
}
function snapshot(p, f, e){ return {tid:p.id, formId:f.id, cp:f.cp, overall:e.overall, band:e.band, fb:e.fb, rec:e.rec, status:e.status, sen:e.sen.label, flags:e.flags.map(x=>x[1]), reasons:e.reasons, narrative:e.narrative, rules:RULES_VER}; }
function initAssess(){
 resetMemo();
 Object.values(S.people).forEach(p=>{ const f = lastSubmitted(p.id); if(!f) return; const e = evaluate(p,f); S.assess[p.id] = {id:'AA-'+(S.seq.aa++), runAt:fmtS(new Date(Math.min(TODAY.getTime(), new Date(f.cpDate).getTime()+DAY)))+' 09:15', trigger:'Review submitted', ...snapshot(p,f,e)}; });
}
function assessState(p){
 const f = lastSubmitted(p.id); if(!f) return {state:'No review yet'};
 const a = S.assess[p.id];
 if(!a || a.formId!==f.id) return {state:'Queued', reason:S.triggers[p.id]||'New review submitted', f};
 const e = evaluate(p,f);
 if(Math.abs(e.overall-a.overall)>0.05 || e.fb!==a.fb || e.rec!==a.rec || e.flags.length!==a.flags.length) return {state:'Queued', reason:S.triggers[p.id]||'Input data changed since last run', f};
 return {state:'Up to date', f, a};
}
function queue(){ return Object.values(S.people).map(p=>({p,...assessState(p)})).filter(x=>x.state==='Queued'); }
function runAgent(tid, trig){
 const p = S.people[tid], f = lastSubmitted(tid); if(!f) return false;
 resetMemo();
 const e = evaluate(p,f);
 S.assess[tid] = {id:'AA-'+(S.seq.aa++), runAt:stamp(), trigger:trig||S.triggers[tid]||'Manual run', ...snapshot(p,f,e)};
 delete S.triggers[tid];
 log('ag','PRAGATI','Agent',`Read ${p.name}: master, attendance, skills & TPM, ${kzOf(tid).length} kaizen(s), ${S.cases.filter(c=>c.tid===tid).length} case(s), ${f.cp} review.`);
 log('ag','Agent','PRAGATI Assessment',`${S.assess[tid].id} for ${p.name}: ${pct(e.overall)}, band ${e.fb==='X'?'\u2014':e.fb}, ${f.cp==='M12'?e.rec:e.status}${e.flags.length?', '+e.flags.length+' flag(s)':''}.`);
 return true;
}
function queueReason(tid, why){ S.triggers[tid] = why; }
function afterDataChange(why, tids){ resetMemo(); (tids||Object.keys(S.people)).forEach(t=>{ if(assessState(S.people[t]).state==='Queued') queueReason(t, why); }); }
