/* Deep learning clinic contract; never claims psychometric validation. */
"use strict";
const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict");
const read=x=>fs.readFileSync(x,"utf8"),sandbox={window:{}};
for(const p of ["assets/bp-competency-s2-data-20261101.js","assets/bp-s2-pair-cases-20261101.js","assets/bp-s2-group-cases-20261101.js"]){
 const script=read(p);new vm.Script(script,{filename:p});vm.runInNewContext(script,sandbox,{filename:p,timeout:10000});
}
const D=sandbox.window.BPCompetencyData;
const cases=[...sandbox.window.BPS2PairCases,...sandbox.window.BPS2GroupCases];
assert.equal(cases.length,4,"two pairs and two groups");
assert.equal(cases.filter(c=>c.format==="pair").length,2);
assert.equal(cases.filter(c=>c.format==="group").length,2);
assert.equal(new Set(cases.map(c=>c.id)).size,4);
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
  assert.ok(p.scene.length>=120,"rich contextual scene "+c.id+" "+role);
  assert.equal(p.signals.length,3);
  assert.equal(p.constraints.length,3);
  assert.ok(p.roles.every(x=>x.length===4&&x.every(v=>v.length>=10)));
  assert.ok(p.initial.length>=participants*2);
  assert.ok(p.improved.length>=participants*3);
  assert.ok(p.initial.every(x=>x.length===2&&Number.isInteger(x[0])&&x[0]>=0&&x[0]<participants&&x[1].length>=15));
  assert.ok(p.improved.every(x=>x.length===2&&Number.isInteger(x[0])&&x[0]>=0&&x[0]<participants&&x[1].length>=18));
  assert.equal(p.options.length,3);
  assert.ok(p.options.every(o=>o.length===3&&o.every(x=>x.length>=22)));
  assert.ok(p.twist.length>=100);
  assert.equal(p.debrief.length,3);
  assert.equal(p.checklist.length,5);
  assert.ok(p.debrief.every(x=>x.length>=50));
  assert.ok(p.checklist.every(x=>x.length>=35));
  assert.ok(p.action.length>=40);
  assert.deepEqual(Array.from(new Set(p.initial.map(x=>x[0]))).sort(),Array.from({length:participants},(_,i)=>i));
  assert.deepEqual(Array.from(new Set(p.improved.map(x=>x[0]))).sort(),Array.from({length:participants},(_,i)=>i));
 }
 assert.notEqual(c.supervisors.scene,c.managers.scene,"role-specific complexity "+c.id);
 assert.notEqual(c.supervisors.title,c.managers.title,"role-specific authority "+c.id);
}
const html=read("index.html"),app=read("assets/bp-s2-clinic-20261101.js"),sw=read("sw.js");
new vm.Script(app,{filename:"bp-s2-clinic-20261101.js"});
for(const p of ["bp-s2-pair-cases-20261101.js","bp-s2-group-cases-20261101.js","bp-s2-clinic-20261101.js","bp-s2-clinic-20261101.css"]){
 assert.ok(html.includes("assets/"+p));
 assert.ok(sw.includes("./assets/"+p));
}
assert.ok(html.includes('id="bp-c-clinic-2"'));
assert.ok(html.includes('"bp-c-clinic-2":"تمرین‌های دونفره و چهار‌نفره"'));
assert.ok(read("assets/bp-competency-path-20261101.js").includes('link("bp-c-clinic-2"'));
assert.ok(!app.includes("localStorage.removeItem"));
assert.ok(app.includes("bp_s2_clinic_v1_"));
assert.ok(app.includes("revised.trim().length<20"));
assert.ok(app.includes("aria-pressed"));
assert.ok(app.includes("این گزارش صرفاً برای بازاندیشی آموزشی است"));
assert.ok(read("assets/bp-s2-clinic-20261101.css").includes("@media(max-width:780px)"));
const PARTS=["m1","m2","leaders","techniques","visuals","diseases","quiz"];
for(let n=1;n<=6;n++)for(const p of PARTS){
 const id=n===1?p:"session"+n+"-"+p;
 assert.ok(html.includes('id="'+id+'"'),"legacy route "+id);
}
console.log("PASS: two 2-person and two 4-person cases x two roles (8 exercises), 24+ person role cards, 8+ initial and improved scripts, role separation, decision tradeoffs, 42 preserved routes and offline assets.");
