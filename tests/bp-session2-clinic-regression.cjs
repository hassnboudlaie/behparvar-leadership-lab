/* Deep learning clinic contract; never claims psychometric validation. */
"use strict";
const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict");
const read=x=>fs.readFileSync(x,"utf8"),sandbox={window:{}};
for(const p of ["assets/bp-competency-s2-data-20261101.js","assets/bp-s2-pair-cases-20261101.js","assets/bp-s2-group-cases-20261101.js"]){
 const script=read(p);new vm.Script(script,{filename:p});vm.runInNewContext(script,sandbox,{filename:p,timeout:10000});
}
const D=sandbox.window.BPCompetencyData;
const cases=[...sandbox.window.BPS2PairCases,...sandbox.window.BPS2GroupCases];
assert.equal(cases.length,5,"two paired and three four-unit cases");
assert.equal(cases.filter(c=>c.format==="pair").length,2);
assert.equal(cases.filter(c=>c.format==="group").length,3);
assert.equal(new Set(cases.map(c=>c.id)).size,5);
const skills=new Map(D.skills.map(s=>[s.id,s]));
for(const c of cases){
 assert.ok(c.name.length>12);
 assert.ok(c.skills.length>=4);
 assert.ok(c.skills.every(s=>skills.has(s)));
 assert.ok(new Set(c.skills.map(s=>skills.get(s).domain)).size>=2);
 const participants=c.format==="pair"?2:4;
 for(const role of ["supervisors","managers"]){
  const p=c[role];
  assert.equal(p.roles.length,participants);
  assert.ok(p.scene.length>=750,"industrial cross-unit context must have depth "+c.id+" "+role);
  assert.equal(p.names.length,participants,"fictional character names + role");
  assert.ok(p.fictionalContext,"case must be clearly marked educational and fictional");
  assert.ok(p.scene.includes("خوراک")||p.scene.includes("پلت"),"context tied to feed production");
  assert.equal(p.signals.length,3);
  assert.equal(p.constraints.length,3);
  assert.ok(p.roles.every(x=>x.length===7&&x[0].length>=5&&x.slice(1).every(v=>v.length>=15)),"seven-part character profile");
  assert.ok(p.roles.every(x=>x[0].startsWith(role==="supervisors"?"سرپرست":"مدیر")),"peer-level participants only");
  assert.equal(new Set(p.roles.map(x=>x[0])).size,participants,"each participant represents a different unit");
  assert.ok(p.roles.every(x=>x[4].length>=30&&x[5].length>=25&&x[6].length>=30),"assumptions, style and private knowledge");
  assert.ok(p.improved.length>=16,"substantive multi-turn negotiation");
  assert.ok(p.improved.some(x=>/اگر|ولی|اما|به شرط|نمی‌توان|نمی‌تون|نگران/.test(x[1])),"dialogue includes tension or conditions");
  assert.ok(p.initial.length>=participants*2);
  assert.ok(p.improved.length>=participants*3);
  assert.ok(p.initial.every(x=>x.length===2&&Number.isInteger(x[0])&&x[0]>=0&&x[0]<participants&&x[1].length>=15));
  assert.ok(p.improved.every(x=>x.length===2&&Number.isInteger(x[0])&&x[0]>=0&&x[0]<participants&&x[1].length>=18));
  assert.equal(p.options.length,3);
  assert.ok(p.options.every(o=>o.length===3&&o.every(x=>x.length>=22)));
  assert.ok(p.twist.length>=100);
  assert.equal(p.debrief.length,3);
  assert.equal(p.checklist.length,5);
  assert.ok(p.debrief.every(x=>x.length>=45));
  assert.ok(p.checklist.every(x=>x.length>=35));
  assert.ok(p.action.length>=40);
  assert.deepEqual(Array.from(new Set(p.initial.map(x=>x[0]))).sort(),Array.from({length:participants},(_,i)=>i));
  assert.deepEqual(Array.from(new Set(p.improved.map(x=>x[0]))).sort(),Array.from({length:participants},(_,i)=>i));
 }
 assert.notEqual(c.supervisors.scene,c.managers.scene,"role-specific complexity "+c.id);
 assert.notEqual(c.supervisors.title,c.managers.title,"role-specific authority "+c.id);
}
const html=read("index.html"),app=read("assets/bp-simple-roleplays-20261102.js"),sw=read("sw.js");
new vm.Script(app,{filename:"bp-simple-roleplays-20261102.js"});
for(const p of ["bp-s2-pair-cases-20261101.js","bp-s2-group-cases-20261101.js","bp-simple-roleplays-20261102.js"]){
 assert.ok(html.includes("assets/"+p),"missing active script "+p);
 assert.ok(sw.includes("./assets/"+p),"missing offline script "+p);
}
assert.ok(html.includes('id="bp-c-clinic-2"'));
assert.ok(html.includes('"bp-c-clinic-2":"تمرین‌های دونفره و چهار‌نفره"'));
assert.ok(read("assets/bp-competency-path-20261101.js").includes('link("bp-c-clinic-2"'));
assert.ok(app.includes("data-simple-case"));
assert.ok(app.includes("data-simple-role"));
assert.ok(app.includes("bp-simple-dialogue"));
assert.ok(app.includes("bp-simple-private"),"private character detail");
assert.ok(!app.includes("bp-simple-twist"),"no facilitator twist card");
assert.ok(app.includes("bp-simple-script-section"),"example dialogue shown without extra action");
assert.ok(app.includes("bp-simple-feedback"),"behavioral feedback fields");
assert.ok(app.includes("bp-simple-criterion-row")&&app.includes("data-simple-evidence"),"observer scores plus verbatim evidence");
assert.ok(app.includes("data-simple-eval")&&app.includes("تا حدی مشاهده شد"),"graded classroom checklist");
assert.ok(app.includes("bp-simple-moment"),"skill turning points embedded in dialogue");
const anchorSource=app.match(/const turnAnchors=(\{[\s\S]*?\});\s*const expertNotes=/);
assert.ok(anchorSource,"skill-anchor definitions present");
const anchors=vm.runInNewContext("("+anchorSource[1]+")");
for(const c of cases){
 for(const role of ["supervisors","managers"]){
  const marks=anchors[c.id][role];
  assert.ok(Object.keys(marks).length>=4,"each case has at least four observable annotated moments");
  for(const [turn,skill] of Object.entries(marks)){
   assert.ok(Number(turn)<c[role].improved.length,"moment within actual dialogue "+c.id+" "+role);
   assert.ok(c.skills.includes(skill),"moment skill must be declared as target "+c.id+" "+role+" "+skill);
  }
 }
}
assert.ok(app.includes("bp-simple-reflection")&&app.includes("data-simple-answer"),"observer analyses all three debatable moments");
assert.ok(app.includes("data-simple-copy")&&app.includes("copyObserverReport"),"shareable observer report");
assert.ok(app.includes("observerDrafts=new Map()")&&app.includes("restoreObserverDraft"),"in-session observer notes retained while changing cases");
assert.ok(app.includes("data-simple-clear")&&app.includes("clearObserverDraft"),"separate observers can restart");
assert.ok(app.includes("data-simple-jump")&&app.includes("bp-s2-dialogue")&&app.includes("bp-s2-observer"),"classroom navigation to dialogue and checklist");
assert.ok(!app.includes("localStorage.setItem")&&!app.includes("sessionStorage.setItem"),"observer comments remain ephemeral and local only");
const aligned=read("assets/mml-aligned-ui-v1.js");
assert.ok(aligned.includes("n===2&&i===1")&&aligned.includes("n===2&&i===3")&&aligned.includes("n===2&&i===5"),"session-two canonical reader cases, method and evidence sections are isolated from other five sessions");
assert.ok(aligned.includes("session2StudioCases(role)")&&aligned.includes("data-simple-open-case"),"five canonical cross-unit peer dialogue choices accessible through reader");
const competency=read("assets/bp-competency-path-20261101.js");
assert.ok(competency.includes("تمرین مشاهده شایستگی")&&competency.includes("سرپرست هم‌سطح"),"competency detail uses cross-unit observation rather than subordinate roleplay");
for(const banned of ["نوبت شماست","کارت اتفاق تازه","اجرای دوباره","bp-simple-run","bp-simple-nobias"]){
 assert.ok(!app.includes(banned),"removed activity stage "+banned);
}
assert.ok(app.includes("return null}"),"role must not silently default to supervisor");
assert.ok(app.includes("bp-simple-analysis"));
assert.ok(app.includes("واقعی نیستند"),"explicit fiction status; no invented company facts portrayed as observed history");
assert.ok(app.includes("bp-simple-empower"),"six-element delegation process visible");
assert.ok(cases.some(c=>c.id==="group-empowerment"&&c.skills.includes("delegation")),"four-unit empowerment scenario must exist");
assert.ok(app.includes("شایستگی‌های قابل مشاهده"),"skill targets in the visible dialogue");
assert.ok(app.includes("شخصیت‌ها و پیش‌فرض‌هایشان"));
assert.ok(!app.includes("revised.trim().length<20"),"no forced typing gate");
assert.ok(!app.includes("data-s2-decision"),"no gated quiz inside dialogue");
assert.ok(!app.includes("localStorage.removeItem"));
assert.ok(read("assets/bp-upgrade-20261102.css").includes("@media(max-width:760px)"));
const PARTS=["m1","m2","leaders","techniques","visuals","diseases","quiz"];
for(let n=1;n<=6;n++)for(const p of PARTS){
 const id=n===1?p:"session"+n+"-"+p;
 assert.ok(html.includes('id="'+id+'"'),"legacy route "+id);
}
console.log("PASS: cross-unit peer-only characters in 10 role-specific conversations; visible role assumptions, full dialogues, target skills and debrief; no gated navigation, unchanged 42 course routes.");
