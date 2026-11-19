#!/usr/bin/env node
/* Current Safar: actual voluntary exit from the five-phase solo wizard. */
"use strict";
const assert=require("node:assert/strict"),{chromium}=require("playwright");
const key="bp-session5-communication-journey-v1";
const url=new URL("session5-communication-journey.html",process.env.AUDIT_URL||"http://127.0.0.1:8765/").href;
(async()=>{
 const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,locale:"fa-IR"});
  const errors=[];page.on("pageerror",e=>errors.push(e.message));page.on("dialog",d=>d.accept());
  await page.goto(url,{waitUntil:"domcontentloaded"});
  await page.locator('[data-role="supervisors"]').click();
  await page.locator("#start").click();
  await page.locator("#sfCoachOverlay").waitFor({state:"visible"});
  await page.locator("#sfCoachContinue").click();
  await page.locator("#sfGracefulExitFixed").waitFor({state:"visible",timeout:10000});
  assert.equal(await page.locator("#sfGracefulExitTop").count(),0,"No competing header exit");
  // Simulate two legitimately completed stages in the same current scoring contract.
  await page.evaluate(key=>{
    const s=JSON.parse(localStorage.getItem(key)),st=window.BP_SAFAR_DATA.stages;
    s.stage=2;s.startedAt=Date.now()-120000;s.selfScaleV5=5;s.rubricV2=2;
    s.answers={};s.self={};s.learned={};s.evidence={};s.alloc={};
    for(let i=0;i<2;i++){
      s.answers[i]={q1:st[i].c1,q2:{best:st[i].best,worst:st[i].worst}};
      s.self[i]=[1,3,5];s.learned[i]=true;
    }
    localStorage.setItem(key,JSON.stringify(s));
  },key);
  await page.reload({waitUntil:"domcontentloaded"});
  const button=page.locator("#sfGracefulExitFixed");
  await button.waitFor({state:"visible",timeout:12000});
  assert(await button.isEnabled());
  const reportBefore=await page.evaluate(key=>window.BP_SAFAR_GRACEFUL_EXIT.settle(JSON.parse(localStorage.getItem(key))),key);
  assert.equal(reportBefore.completed,2);
  assert.equal(reportBefore.max,20);
  assert.equal(reportBefore.score,17);
  await button.click();
  await page.locator("#sfExitReport").waitFor({state:"visible",timeout:15000});
  const final=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
  assert.equal(final.withdrawn,true,"Withdrawal persisted");
  assert.equal(final.finished,true,"Journey finalized");
  assert.equal(final.withdrawalReport.completed,2);
  assert.equal(final.withdrawalReport.max,20);
  assert.equal(final.withdrawalReport.score,17);
  assert.equal(await page.locator("#sfGracefulExitFixed").count(),0,"Exit control removed after conclusion");
  assert((await page.locator("#sfExitReport").innerText()).includes("تسویه‌حساب"));
  assert(await page.locator("#sfExitDownload").isVisible(),"PNG download available");
  assert(await page.locator("#sfExitPrint").isVisible(),"PDF print option available");
  assert.deepEqual(errors,[],"No runtime errors during exit workflow");
  console.log("PASS: persistent solo exit, confirmed early completion 17/20, coach report, PNG/PDF and state persistence");
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
