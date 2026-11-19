#!/usr/bin/env node
/* Behparvar · Safar 10 x 10 scoring, evidence and individual UX contract. */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm"),path=require("node:path");
const root=path.resolve(__dirname,".."),read=p=>fs.readFileSync(path.join(root,p),"utf8");
const ctx={window:{},localStorage:{getItem:()=>null}};
for(const p of ["assets/safar-ertebatat-data.js","assets/safar-self-items-plain-20261119.js","assets/safar-rubric-v2-20261119.js"])
 vm.runInNewContext(read(p),ctx,{filename:p});
const data=ctx.window.BP_SAFAR_DATA,stages=data.stages,R=ctx.window.BP_SAFAR_RUBRIC;
assert.equal(stages.length,10);assert.equal(R.STAGE_MAX,10);
assert.deepEqual(JSON.parse(JSON.stringify(R.MAX)),{lesson:.5,self:2.5,decision1:3.5,decision2:3.5});
assert.equal(new Set(stages.flatMap(s=>s.selfItems)).size,30,"30 distinct plain-language self-items");
assert.equal(ctx.window.BP_SAFAR_SELF_ITEMS.scale.length,5,"Five descriptive anchors");
const copy=()=>({rubricV2:2,soloVersion:1,s5gameVersion:1,learned:{},self:{},evidence:{},answers:{},peer:{},rp:{},alloc:{}});
function prepare(v,correct){
 const s=copy();
 stages.forEach((stage,i)=>{
  s.learned[i]=true;s.self[i]=[v,v,v];
  s.answers[i]={q1:correct?stage.c1:(stage.c1+1)%4,
   q2:{best:stage.best,worst:stage.worst}};
  s.peer[i]={peerRating:5};s.rp[i]={peerRating:5};
 });
 return s;
}
const low=prepare(1,true),high=prepare(5,true),wrong=prepare(1,false);
assert.equal(R.total(low).total,85);
assert.equal(R.total(high).total,85,"Self-endorsement level must not affect competitive score");
assert.equal(R.points(low,0).max,10);
assert.equal(R.points(high,0).selfBase,1,"Level five earns same completion points");
assert.equal(R.points(low,0).lesson,.5);
assert.equal(R.points(low,0).selfBase,1);
assert.equal(R.points(low,0).oneCompletion,1.5);
assert.equal(R.points(low,0).oneCorrect,2);
assert.equal(R.points(low,0).twoCompletion,1.5);
assert.equal(R.points(low,0).twoBest,1);
assert.equal(R.points(low,0).twoWorst,1);
assert.equal(R.points(wrong,0).oneCorrect,0,"Wrong answer still earns completion credit");
const evidence=[
"در جلسه روز دوشنبه با کارشناس فروش پرسیدم کدام خروجی تا ساعت ۲ آماده می‌شود و پس از آن موعد تحویل روشن شد.",
"هفته گذشته در شیفت صبح برای مدیر تولید پیام توضیحی فرستادم و نتیجه این بود که مسئول گزارش مشخص شد.",
"دیروز در جلسه هماهنگی با همکار واحد انبار یک پیشنهاد ثبت کردم و در نتیجه اختلاف درباره زمان تحویل حل شد."
];
const review=R.reviewEvidence(evidence);
assert.equal(review.total,1.5,"Three specific, independently grounded evidence descriptions can earn 1.5");
assert.equal(R.reviewEvidence([evidence[0],evidence[0],evidence[0]]).total,0,"Duplicates must not earn points");
stages.forEach((stage,i)=>low.evidence[i]={texts:evidence.map((text,j)=>
 text+" در همین مهارت، شاهد مستقل: "+stage.selfItems[j]+"؛ این رفتار را در محل کارم انجام دادم و نتیجه آن را پیگیری کردم.")});
assert.equal(R.total(low).total,100,"Ten distinct sets of stage-specific evidence can attain 100");
const repeated=prepare(1,true);stages.forEach((_,i)=>repeated.evidence[i]={texts:evidence});
assert.equal(R.total(repeated).total,86.5,"Reusing identical three cases across all stages must not earn 100");
assert.equal(R.evidenceFor(repeated,1).total,0,"Previously scored cases cannot receive credit again");
assert.equal(R.total(low).total,100,"Ten fully evidenced stages total exactly 100");
assert(R.total(low).parts.every(p=>p.earned===10&&p.max===10));
assert.equal(R.tier(55,35),"bronze");
assert.equal(R.tier(70,45),"silver");
assert.equal(R.tier(88,58),"gold");
assert.equal(R.tier(70,34),null,"Medals need a knowledge score floor");
const html=read("session5-communication-journey.html"),wiz=read("assets/safar-wizard-session5-20261117.js");
assert(html.includes("safar-rubric-v2-20261119.js")&&html.includes("safar-participant-ux-v2.js"));
assert(wiz.includes('if(p==="lesson"&&s.rubricV2===2)'));
assert(wiz.includes("sf-wrap-takeaway"));
assert(read("assets/safar-participant-ux-v2.js").includes('id="sfLessonRead"'));
assert(read("assets/safar-participant-ux-v2.js").includes('id="sfSaveEvidence"'));
assert(read("assets/safar-participant-ux-v2.css").includes('body.sf-wizard-on .top #sound'));
assert(read("assets/safar-approved-recognition-20261115.js").includes("BP_SAFAR_RECOGNITION_COPY"));
assert(read("assets/safar-industrial-medal-design.js").includes("BP_SAFAR_RECOGNITION_COPY"));
console.log("PASS Safar v2: 10x10 points, 85 without evidence, 100 with three quality evidence samples per stage, readable items, low/high self parity, medal floors, lean UI and golden awards");
