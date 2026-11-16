#!/usr/bin/env node
/* Safar S4: voluntary withdrawal and proportional report browser regression. */
"use strict";
const assert=require("node:assert/strict"),{chromium}=require("playwright");
const key="bp-communication-journey-v3";
const url=process.env.AUDIT_URL||"http://127.0.0.1:8765/session4-communication-journey.html";
(async()=>{
 const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 try{
  async function fresh(){
   const context=await browser.newContext({viewport:{width:390,height:844},locale:"fa-IR",isMobile:true,hasTouch:true});
   const page=await context.newPage(),errors=[];
   page.on("pageerror",e=>errors.push(e.message));
   await page.goto(url,{waitUntil:"domcontentloaded"});
   await page.locator(".role-card[data-role='supervisors']").click();
   return {page,context,errors};
  }
  const a=await fresh(),page=a.page;
  page.once("dialog",d=>d.accept());
  await page.locator("#start").click();
  await page.waitForFunction(()=>!!window.BP_SAFAR_GRACEFUL_EXIT);
  await page.evaluate(key=>{
   const s=JSON.parse(localStorage.getItem(key));
   const st=window.BP_SAFAR_DATA.stages;
   for(let i=0;i<2;i++){
    s.answers[i]={q1:st[i].c1,q2:{best:st[i].best,worst:st[i].worst}};
    s.self[i]=[3,3,3];
   }
   s.stage=2;s.answers[2]={q1:st[2].c1};
   localStorage.setItem(key,JSON.stringify(s));
  },key);
  await page.reload({waitUntil:"domcontentloaded"});
  await page.locator("#sfGracefulExitTop").waitFor();
  const expected=await page.evaluate(key=>window.BP_SAFAR_GRACEFUL_EXIT.settle(JSON.parse(localStorage.getItem(key))),key);
  assert.equal(expected.completed,2);
  assert.equal(expected.max,18);
  assert.equal(expected.raw,17);
  assert.equal(expected.badges.length,2);
  assert.equal(expected.ongoing,true);
  page.once("dialog",d=>d.dismiss());
  await page.locator("#sfGracefulExitTop").click();
  assert.equal((await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key)).finished,false,"Cancelled exit leaves active journey untouched");
  page.once("dialog",d=>d.accept());
  await page.locator("#sfGracefulExitTop").click();
  await page.locator("#sfExitReport").waitFor({timeout:15000});
  let s=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
  assert.equal(s.finished,true);assert.equal(s.withdrawn,true);
  assert.equal(s.withdrawalReport.max,18);
  assert.equal(s.withdrawalReport.score,17);
  assert.equal(await page.locator(".reviewentry").count(),0,"Never reveal answer key for unvisited stages");
  assert.equal(await page.locator("#badgepng").count(),0,"No completion medal on withdrawal");
  assert((await page.locator("#sfExitReport").innerText()).includes("تسویه‌حساب"));
  assert((await page.locator("#sfExitReport").innerText()).includes("پیام همراه سفر"));
  await page.locator("#bp-recognition-collection").waitFor();
  const earned=await page.locator("#bp-recognition-collection .bp-recognition-badge.is-earned").count();
  assert(earned>=2,"Completed stages retain collectible skill badges");
  await page.locator("#sfStartAgain").waitFor();
  page.once("dialog",d=>d.accept());
  await page.locator("#sfStartAgain").click();
  await page.locator("#start").waitFor();
  assert.equal(await page.locator(".sf-history-row").count(),1,"Archived early-exit result remains accessible");
  assert.deepEqual(a.errors,[]);
  await a.context.close();

  const b=await fresh();
  await b.page.locator("#sfStartStudy").click();
  await b.page.locator(".sf-study-hero").waitFor();
  await b.page.locator("#sfGracefulExitTop").waitFor();
  b.page.once("dialog",d=>d.accept());
  await b.page.locator("#sfGracefulExitTop").click();
  await b.page.locator("#sfExitReport").waitFor();
  const study=await b.page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
  assert.equal(study.withdrawalReport.study,true);
  assert.equal(study.withdrawalReport.max,0);
  assert((await b.page.locator("#sfExitReport").innerText()).includes("بدون امتیاز"));
  assert.deepEqual(b.errors,[]);
  await b.context.close();

  const c=await fresh();
  c.page.once("dialog",d=>d.accept());
  await c.page.locator("#start").click();
  await c.page.evaluate(key=>{const s=JSON.parse(localStorage.getItem(key));s.startedAt=Date.now()-3700000;localStorage.setItem(key,JSON.stringify(s));},key);
  await c.page.reload({waitUntil:"domcontentloaded"});
  await c.page.locator("#sfOvertimeExit").waitFor({state:"visible"});
  c.page.once("dialog",d=>d.accept());
  await c.page.locator("#sfOvertimeExit").click();
  await c.page.locator("#sfExitReport").waitFor();
  const expired=await c.page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
  assert.equal(expired.withdrawn,true,"Exiting timeout dialog creates report");
  assert.deepEqual(c.errors,[]);
  await c.context.close();
  console.log("PASS: withdrawal cancellation, two-stage proportional scoring, badges, coaching, local archive, study mode and expired-timer exit.");
 }finally{await browser.close()}
})().catch(e=>{console.error("FAIL",e);process.exit(1)});
