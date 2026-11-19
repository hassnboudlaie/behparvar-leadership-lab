#!/usr/bin/env node
/* Safar 2026-11-19 — individual-only scoring and coaching contract.
 * New attempts are 90 minutes, 100 attainable points, without peer requirements. */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path"),vm=require("node:vm");
const dir=path.resolve(__dirname,".."),read=p=>fs.readFileSync(path.join(dir,p),"utf8");
const html=read("session5-communication-journey.html");
const core=html.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1];
assert(core,"Competition core JavaScript is present");
new vm.Script(core);
const modules=["assets/safar-wizard-session5-20261117.js","assets/safar-journey-coach-v5.js","assets/safar-context-guide-v1.js","assets/safar-score-feedback-v1.js","assets/safar-industrial-medals.js","assets/safar-graceful-exit-v1.js","assets/safar-approved-recognition-20261115.js"];
for(const p of modules)new vm.Script(read(p));
const wizard=read(modules[0]),coach=read(modules[1]),guide=read(modules[2]),scores=read(modules[3]),medals=read(modules[4]),exit=read(modules[5]),recognition=read(modules[6]);
const segment=(s,a,b)=>{const i=s.indexOf(a),j=s.indexOf(b,i+a.length);assert(i>=0&&j>i,"Missing segment "+a);return s.slice(i,j)};
assert(core.includes("state.soloVersion=1"),"New competition is solo");
assert(!core.includes("+roleView()+peerView()"),"Pair and peer activity not rendered");
assert(!html.includes("safar-peer-appreciation-v1.js"),"No peer-sharing module");
assert(!core.includes('id="saverp"')&&!core.includes('id="savepeer"'),"Pair input controls absent");
assert(!/\"role\"|\"peer\"/.test(segment(wizard,"function sequence(s)","function phaseKey(s)")),"Wizard has no pair/peer phases");
assert(!recognition.includes('id:"team"')&&!recognition.includes('id:"active"')&&!recognition.includes('id:"practice"'),"No group/role badges");
assert(guide.includes("FREE=2,COST=2"),"Two free then paid guide preserved");
assert(guide.includes("fieldTools=[")&&guide.includes("گام عملی برای همین موقعیت"),"Contextual actionable help");
assert(coach.includes("data-coach-choice")&&coach.includes("data-sf-coach-view"),"Welcome and inline feedback are interactive");
assert(coach.includes("![2,5,9].includes(index)"),"Coach overlay restricted to milestones");
const ctx={window:{}};vm.runInNewContext(read("assets/safar-ertebatat-data.js"),ctx);
const stages=ctx.window.BP_SAFAR_DATA.stages,incidents=ctx.window.BP_SAFAR_DATA.incidents;
assert.equal(stages.length,10,"Ten stages");
const pointFn=new Function("data",segment(scores,"function pts(s,i)","function progress(s)")+"return pts;");
const points=pointFn({stages,incidents});
const fakeWindow={BP_SAFAR_OVERTIME:{penalty:()=>0},BP_SAFAR_GUIDE:{penalty:()=>0}};
const progress=new Function("pts","window",segment(scores,"function progress(s)","function nextMedal(")+"return progress;")(points,fakeWindow);
const medalScore=new Function("stages","incidents","window",segment(medals,"function score(s)","function quizScore(s)")+"return score;")(stages,incidents,fakeWindow);
const grade=new Function("state","stages","incidents","overtime","hintCoach",segment(core,"function grade(){","function medal(")+"return grade;");
const run=n=>{
 const s={version:3,soloVersion:1,s5gameVersion:1,startedAt:Date.now(),mode:"competitive",answers:{},self:{},alloc:{},rp:{},peer:{}};
 stages.forEach((st,i)=>{s.answers[i]={q1:st.c1,q2:{best:st.best,worst:st.worst}};s.self[i]=[n,n,n];s.rp[i]={peerRating:5};s.peer[i]={f:"example",s:"example"};const inc=incidents.find(x=>x.stage===i+1);if(inc)s.alloc[i]=inc.ideal.slice()});
 const result=grade(s,stages,incidents,fakeWindow.BP_SAFAR_OVERTIME,fakeWindow.BP_SAFAR_GUIDE)();
 assert.equal(result.total,100);
 assert.equal(result.quiz,84);
 assert.equal(progress(s).sum,100);
 assert.equal(medalScore(s),100);
 assert.equal(points(s,2).one,6);
 assert.equal(points(s,7).one,6);
 assert.equal(points(s,2).peer,0);
 assert.equal(points(s,7).role,0);
 return result.total;
};
assert.equal(run(1),run(4),"Maximum/minimum self-ratings earn same points");
console.log("PASS: 90-minute solo journey / no team badges / +2 solo decisions / 100-point parity / contextual guide and coach");
