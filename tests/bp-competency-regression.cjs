/* Independent contract for BMCF teaching prototype and 2 distinct SJT banks.
   Does not assert psychometric validity. */
"use strict";
const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict");
const source=fs.readFileSync("assets/bp-competency-s2-data-20261101.js","utf8");
const sandbox={window:{}};
vm.runInNewContext(source,sandbox,{filename:"bp-competency-s2-data-20261101.js",timeout:10000});
const D=sandbox.window.BPCompetencyData;
assert.ok(D&&D.version===1);
assert.deepEqual(Array.from(D.domains,x=>x.id),["self","others","results"]);
assert.equal(D.skills.length,12);
assert.deepEqual([..."self others results".split(" ")].map(id=>D.skills.filter(s=>s.domain===id).length),[3,4,5]);
assert.equal(new Set(D.skills.map(s=>s.id)).size,12);
assert.equal(D.families.length,6);
assert.equal(D.skills.filter(s=>s.family==="functional").length,0,
 "generic scenario quiz must not award functional job competence");
assert.ok(D.skills.every(s=>s.session>=3&&s.session<=6));
const expected={3:["self","problem","judgment"],4:["communication","conflict"],5:["delegation","coaching"],6:["planning","coordination","performance","business","change"]};
for(const [n,ids]of Object.entries(expected)){
 assert.deepEqual(Array.from(D.skills.filter(s=>s.session===Number(n)),s=>s.id),ids);
}
const stems={};
for(const role of ["supervisors","managers"]){
 const items=D[role];assert.equal(items.length,12);
 const distribution=Array.from({length:4},(_,i)=>items.filter(q=>q.answer===i).length);
 assert.deepEqual(distribution,[3,3,3,3],"balanced answer key "+role);
 assert.ok(!items.slice(0,4).every((q,i)=>q.answer===items[i+4].answer&&q.answer===items[i+8].answer),
   "answer positions must not repeat in a four-question cycle");
 assert.equal(new Set(items.map(q=>q.skill)).size,12);
 assert.ok(items.every(q=>q.stem.length>=95));
 assert.ok(items.every(q=>q.options.length===4&&q.reasons.length===4));
 assert.ok(items.every(q=>q.options.every(x=>x.length>=55)));
 assert.ok(items.every(q=>q.reasons.every(x=>x.length>=40)));
 assert.ok(items.every(q=>new Set(q.options).size===4&&new Set(q.reasons).size===4));
 assert.ok(items.every(q=>D.skills.find(s=>s.id===q.skill)));
 const correctLen=items.map(q=>q.options[q.answer].length);
 const wrongLen=items.flatMap(q=>q.options.filter((x,i)=>i!==q.answer).map(x=>x.length));
 const mean=a=>a.reduce((v,x)=>v+x,0)/a.length;
 const longest=items.filter(q=>q.options[q.answer].length>=Math.max(...q.options.map(x=>x.length))).length;
 assert.ok(longest<=3,"Systematic longest correct answer cue "+role+": "+longest);
 assert.ok(Math.abs(mean(correctLen)-mean(wrongLen))<14,"Mean answer-length cue "+role);
 stems[role]=items.map(q=>q.stem);
}
assert.ok(stems.supervisors.every((s,i)=>s!==stems.managers[i]),"distinct role-specific scenarios");
const html=fs.readFileSync("index.html","utf8");
const routes=["bp-c-lesson","bp-c-self","bp-c-others","bp-c-results","bp-c-families","bp-c-test","bp-c-report","bp-c-review","bp-c-focus-3","bp-c-focus-4","bp-c-focus-5","bp-c-focus-6"];
for(const id of routes)assert.ok(html.includes('id="'+id+'"'),"missing route "+id);
assert.ok(html.includes("bp-competency-s2-data-20261101.js")&&html.includes("bp-competency-path-20261101.js"));
assert.ok(html.includes("bp-competency-path-20261101.css"));
assert.ok(html.includes('id="session2"')&&html.includes('id="session6"'));
const ui=fs.readFileSync("assets/bp-competency-path-20261101.js","utf8");
assert.ok(ui.includes('bp_competency_session2_v1_'),"dedicated saved diagnostic namespace");
assert.ok(ui.includes("bp-c-evidence-note"),"show study limitations to learner");
console.log("PASS: 3 domains (3/4/5), 6 BMCF families, 12 skills; sessions 3–6 mapping; 12 distinct role questions each, balanced keys, unique rationales and no systematic correct-length cue; all 12 routes; separate saved data.");
