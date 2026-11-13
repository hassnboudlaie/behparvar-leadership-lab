#!/usr/bin/env node
/* Browser regression: Safar's voluntary paid overtime, persistence and net grading. */
"use strict";
const assert=require("node:assert/strict"),{chromium}=require("playwright");
const base=process.env.AUDIT_URL||"http://127.0.0.1:8765/";
(async()=>{
 const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 try{
  const context=await browser.newContext({viewport:{width:390,height:844},locale:"fa-IR",isMobile:true,hasTouch:true});
  await context.addInitScript(()=>{
   if(location.pathname.endsWith("/session4-communication-journey.html")&&!localStorage.getItem("bp-communication-journey-v3")){
    const state={version:3,role:"supervisors",name:"آزمون وقت اضافه",startedAt:Date.now()-60*60000-2000,
     stage:0,answers:{},self:{},alloc:{},rp:{},peer:{},events:[],finished:false,finishedAt:0,sound:false};
    localStorage.setItem("bp-communication-journey-v3",JSON.stringify(state));
   }
  });
  const page=await context.newPage(),errors=[];
  page.on("pageerror",e=>errors.push(e.message));
  page.on("dialog",async d=>d.accept());
  await page.goto(new URL("session4-communication-journey.html",base).href,{waitUntil:"domcontentloaded"});
  const modal=page.locator("#sfOvertimeOverlay");
  await modal.waitFor({state:"visible",timeout:12000});
  assert.equal(await page.locator(".shell").evaluate(e=>e.inert),true,"Expired learner journey is locked");
  assert.equal(await page.locator("#sfOvertimeMinutes").inputValue(),"5");
  await page.locator("#sfOvertimeMinutes").fill("7");
  const preview=await page.locator("#sfOvertimePreview").innerText();
  assert(preview.includes("۷")&&preview.includes("۴"),"7 minutes costs 4 percentage points");
  await page.locator("#sfOvertimeConfirm").click();
  await modal.waitFor({state:"detached"});
  const first=await page.evaluate(()=>{
   const s=JSON.parse(localStorage.getItem("bp-communication-journey-v3"));
   return {grants:s.overtime.grants,remaining:window.BP_SAFAR_OVERTIME.remainingMs(s),stage:s.stage};
  });
  assert.equal(first.grants[0].minutes,7);
  assert.equal(first.grants[0].penalty,4);
  assert.equal(first.stage,0,"Stage was not reset");
  assert(first.remaining>6*60000&&first.remaining<=7*60000,"Approved time starts when confirmed");
  // Force another expiry without changing any answers to test repeated consent and stacked charges.
  await page.evaluate(()=>{
   const s=JSON.parse(localStorage.getItem("bp-communication-journey-v3"));
   s.overtime.pauseMs-=8*60000;
   localStorage.setItem("bp-communication-journey-v3",JSON.stringify(s));
  });
  await page.reload({waitUntil:"domcontentloaded"});
  await modal.waitFor({state:"visible"});
  await page.locator("#sfOvertimeMinutes").fill("3");
  const secondPreview=await page.locator("#sfOvertimePreview").innerText();
  assert(secondPreview.includes("۶"),"Preview displays cumulative penalty from earlier grants");
  await page.locator("#sfOvertimeConfirm").click();
  await modal.waitFor({state:"detached"});
  const result=await page.evaluate(()=>{
   const s=JSON.parse(localStorage.getItem("bp-communication-journey-v3"));
   const stages=window.BP_SAFAR_DATA.stages;
   stages.forEach((d,i)=>{s.answers[i]={q1:d.c1,q2:{best:d.best,worst:d.worst}};s.self[i]=[4,4,4];});
   const gross={...s,overtime:{pauseMs:0,grants:[]}};
   const pre=window.BP_SAFAR_SESSION.grade(gross),post=window.BP_SAFAR_SESSION.grade(s);
   const step=window.BP_SAFAR_STEP_POINTS.progress(s);
   const metal=window.BP_SAFAR_MEDALS.score(s);
   s.finished=true;s.finishedAt=Date.now();
   localStorage.setItem("bp-communication-journey-v3",JSON.stringify(s));
   return {grants:s.overtime.grants,penalty:post.timePenalty,raw:post.rawTotal,net:post.total,expected:pre.total,step:step.sum,medal:metal};
  });
  assert.deepEqual(result.grants.map(g=>g.minutes),[7,3]);
  assert.equal(result.penalty,6);
  assert.equal(result.net,result.expected-6);
  assert.equal(result.step,result.net);
  assert.equal(result.medal,result.net,"Award engine uses net grade");
  await page.reload({waitUntil:"domcontentloaded"});
  assert.equal(await modal.count(),0,"Finished journey is not blocked");
  const summary=await page.locator(".sf-overtime-breakdown").innerText();
  assert(summary.includes("۶")&&summary.includes("امتیاز خام")&&summary.includes("امتیاز نهایی"));
  assert.deepEqual(errors,[],"No browser runtime errors");
  console.log("PASS: lock at deadline; 7 + 3 minute extensions; 4 + 2 points; persisted stage; all score engines aligned.");
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
