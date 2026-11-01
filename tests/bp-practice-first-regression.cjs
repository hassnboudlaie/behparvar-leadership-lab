"use strict";
/* Practice-first contract: source QA; human classroom evaluation remains required. */
const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict");
const read=p=>fs.readFileSync(p,"utf8");
const dataSource=read("assets/bp-practice-data-20261101.js");
const appSource=read("assets/bp-practice-first-20261101.js");
const sandbox={window:{}};
vm.runInNewContext(dataSource,sandbox,{filename:"practice-data",timeout:2000});
const D=sandbox.window.BPPracticeData;
assert.equal(D.version,1);
assert.equal(D.sessions.length,6);
assert.equal(D.conversations.length,12);
assert.equal(new Set(D.conversations.map(c=>c.id)).size,12);
const distribution={3:3,4:2,5:2,6:5};
for(const [n,expected] of Object.entries(distribution))
 assert.equal(D.conversations.filter(c=>c.session===Number(n)).length,expected,"session "+n);
for(const s of D.sessions){
 assert.ok(s.n>=1&&s.n<=6);
 assert.notEqual(s.supervisors.setting,s.managers.setting,"role-specific situation "+s.n);
 for(const r of ["supervisors","managers"]){
  const c=s[r];
  assert.ok(c.title&&c.setting.length>90&&c.stakeholders&&c.question);
  assert.equal(c.options.length,3);
  assert.ok(c.options.every(o=>o.length===3&&o.every(t=>t.length>20)),"meaningful trade-offs "+s.n+" "+r);
 }
}
for(const c of D.conversations){
 assert.ok(c.id&&c.name&&c.focus&&c.observe);
 for(const r of ["supervisors","managers"]){
  const d=c[r];
  assert.ok(d.setting.length>25);
  assert.equal(d.actors.length,2);
  assert.equal(d.weak.length,2);
  assert.equal(d.better.length,6);
  assert.ok(d.better.every(line=>line.length>20));
  assert.notEqual(d.weak[0],d.better[0]);
 }
 assert.notEqual(c.supervisors.setting,c.managers.setting,"role differentiation "+c.id);
}
new vm.Script(appSource,{filename:"practice-first"});
const stub={readyState:"loading",addEventListener:function(){}};
vm.runInNewContext(appSource,{window:{BPPracticeData:D},document:stub,location:{search:""},URLSearchParams,localStorage:{getItem:()=>null}});
const html=read("index.html"),sw=read("sw.js"),css=read("assets/bp-practice-first-20261101.css");
for(const p of ["bp-practice-data-20261101.js","bp-practice-first-20261101.js","bp-practice-first-20261101.css"]){
 assert.ok(html.includes("assets/"+p),"document reference "+p);
 assert.ok(sw.includes("./assets/"+p),"PWA precache "+p);
}
assert.ok(!html.includes('<img class="bp-welcome-photo" <img'));
assert.ok(!appSource.includes("localStorage.removeItem"));
assert.ok(appSource.includes("bp_practice_"));
assert.ok(appSource.includes("role()"));
assert.ok(css.includes("@media(max-width:800px)"));
assert.ok(css.includes("prefers-reduced-motion"));
assert.ok(appSource.includes("aria-pressed"));
for(let n=1;n<=6;n++){
 for(const part of ["m1","m2","leaders","techniques","visuals","diseases","quiz"]){
  const id=n===1?part:"session"+n+"-"+part;
  assert.ok(html.includes('id="'+id+'"'),"preserve legacy route "+id);
 }
}
const profileUI=read("assets/bp-competency-path-20261101.js");
assert.ok(profileUI.includes("مثال برای مدیران"));
assert.ok(profileUI.includes("مثال برای سرپرستان"));
assert.ok(profileUI.includes("پاسخ شما بدون نمایش کلید"));
console.log("PASS: 6 role-specific scenarios; 24 dialogue scripts for 12 competencies; 42 routes; independent action keys; diagnostic blinding; local-first assets.");
