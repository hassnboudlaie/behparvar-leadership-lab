#!/usr/bin/env node
/* Safar contextual guide: two free stage/phase hints; all later new hints cost 2.
 * Reopening a granted hint never charges; free reading has no guide charges.
 */
"use strict";
const assert=require("node:assert/strict"),{chromium}=require("playwright");
const base=process.env.AUDIT_URL||"http://127.0.0.1:8765/";
(async()=>{
 const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 try{
  const context=await browser.newContext({viewport:{width:390,height:844},locale:"fa-IR",isMobile:true,hasTouch:true});
  await context.addInitScript(()=>{
   if(location.pathname.endsWith("/session4-communication-journey.html")&&!localStorage.getItem("bp-communication-journey-v3")){
    localStorage.setItem("bp-communication-journey-v3",JSON.stringify({
     version:3,role:"supervisors",name:"آزمایش راهنما",startedAt:Date.now(),stage:0,
     answers:{},orders:{},self:{},alloc:{},rp:{},peer:{},events:[],finished:false,finishedAt:0,sound:false,mode:"competitive",guide:{uses:[]}
    }));
   }
  });
  const page=await context.newPage(),errors=[];
  page.on("pageerror",e=>errors.push(e.message));page.on("dialog",d=>d.accept());
  await page.goto(new URL("session4-communication-journey.html",base).href,{waitUntil:"domcontentloaded"});
  const btn=page.locator("#sfGuideFloating");
  await btn.waitFor({state:"visible"});
  await btn.click();await page.locator("#sfGuideReveal").waitFor();
  assert((await page.locator("#sfGuideBody").innerText()).includes("رایگان"));
  await page.locator("#sfGuideReveal").click();
  assert.equal(await page.locator(".sf-guide-content").count(),1,"First hint revealed");
  let snapshot=await page.evaluate(()=>JSON.parse(localStorage.getItem("bp-communication-journey-v3")));
  assert.equal(snapshot.guide.uses.length,1);
  assert.equal(snapshot.guide.uses[0].cost,0);
  await page.locator("#sfGuideClose").click();
  await btn.click();
  assert.equal(await page.locator("#sfGuideReveal").count(),0,"Reopening same hint is free");
  await page.locator("#sfGuideClose").click();
  // Move to next stage without answering; the coach is a companion, not a quiz shortcut.
  async function stage(i){
   await page.evaluate(n=>{const s=JSON.parse(localStorage.getItem("bp-communication-journey-v3"));s.stage=n;localStorage.setItem("bp-communication-journey-v3",JSON.stringify(s));},i);
   await page.reload({waitUntil:"domcontentloaded"});
   await page.locator("#sfGuideFloating").waitFor({state:"visible"});
   await page.locator("#sfGuideFloating").click();
  }
  await stage(1);
  await page.locator("#sfGuideReveal").click();
  snapshot=await page.evaluate(()=>JSON.parse(localStorage.getItem("bp-communication-journey-v3")));
  assert.equal(snapshot.guide.uses.length,2);
  assert.equal(snapshot.guide.uses[1].cost,0);
  await page.locator("#sfGuideClose").click();
  await stage(2);
  const third=await page.locator("#sfGuideBody").innerText();
  assert(third.includes("۲ امتیاز")||third.includes("−۲"));
  await page.locator("#sfGuideReveal").click();
  snapshot=await page.evaluate(()=>JSON.parse(localStorage.getItem("bp-communication-journey-v3")));
  assert.equal(snapshot.guide.uses.length,3);
  assert.equal(snapshot.guide.uses[2].cost,2);
  await page.locator("#sfGuideClose").click();
  await stage(3);
  await page.locator("#sfGuideReveal").click();
  snapshot=await page.evaluate(()=>JSON.parse(localStorage.getItem("bp-communication-journey-v3")));
  assert.deepEqual(snapshot.guide.uses.map(x=>x.cost),[0,0,2,2]);
  const points=await page.evaluate(()=>{
   const s=JSON.parse(localStorage.getItem("bp-communication-journey-v3"));
   window.BP_SAFAR_DATA.stages.forEach((x,i)=>{s.answers[i]={q1:x.c1,q2:{best:x.best,worst:x.worst}};s.self[i]=[4,4,4];});
   const gross=JSON.parse(JSON.stringify(s));gross.guide={uses:[]};
   return {raw:window.BP_SAFAR_SESSION.grade(gross).total,
     grade:window.BP_SAFAR_SESSION.grade(s).total,
     progress:window.BP_SAFAR_STEP_POINTS.progress(s).sum,
     medals:window.BP_SAFAR_MEDALS.score(s),
     guidePenalty:window.BP_SAFAR_GUIDE.penalty(s)};
  });
  assert.equal(points.guidePenalty,4);
  assert.equal(points.grade,points.raw-4);
  assert.equal(points.grade,points.progress);
  assert.equal(points.grade,points.medals);
  await page.locator("#sfGuideClose").click();
  await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem("bp-communication-journey-v3"));s.mode="study";s.startedAt=0;s.stage=8;s.studyStage=8;localStorage.setItem("bp-communication-journey-v3",JSON.stringify(s));});
  await page.reload({waitUntil:"domcontentloaded"});
  await page.locator("#sfGuideFloating").click();
  assert.equal(await page.locator("#sfGuideReveal").count(),0,"Free reading opens guide without cost");
  assert.equal(await page.locator(".sf-guide-content").count(),1);
  const study=await page.evaluate(()=>JSON.parse(localStorage.getItem("bp-communication-journey-v3")));
  assert.equal(study.guide.uses.length,4,"Study reading does not consume score-based hints");
  assert.deepEqual(errors,[],"No page runtime errors");
  console.log("PASS: always-visible guide, two free hints, 2pt each thereafter, free reopening, identical net scores and study-mode free guidance.");
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
