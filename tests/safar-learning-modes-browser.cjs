#!/usr/bin/env node
/* Browser E2E: independent no-score learning and fair one-time 5-minute pause. */
"use strict";
const assert=require("node:assert/strict"),{chromium}=require("playwright");
const base=process.env.AUDIT_URL||"http://127.0.0.1:8765/";
(async()=>{
 const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},locale:"fa-IR",isMobile:true,hasTouch:true});
  const errors=[];page.on("pageerror",e=>errors.push(e.message));page.on("dialog",d=>d.accept());
  const url=new URL("session4-communication-journey.html",base).href;
  await page.goto(url,{waitUntil:"domcontentloaded"});
  await page.locator('[data-role="supervisors"]').click();
  assert.equal(await page.locator("#sfStartStudy").isEnabled(),true,"Study path enabled after picking role");
  await page.locator("#sfStartStudy").click();
  await page.locator(".sf-study-hero").waitFor();
  assert((await page.locator("#clock").innerText()).includes("مطالعه آزاد"));
  assert.equal(await page.locator("#sfScoreStrip").count(),0);
  assert.equal(await page.locator("#sfOvertimeOverlay").count(),0);
  assert.equal(await page.locator("#sfPauseTime").count(),0);
  assert.equal(await page.locator(".sf-study-tool").count(),3);
  assert.equal(await page.locator(".sf-study-dialogue p").count(),6);
  assert.equal(await page.locator(".sf-study-panel").count(),4);
  await page.locator(".sf-study-pager.bottom [data-sf-study-step='1']").click();
  assert((await page.locator(".sf-study-hero").innerText()).includes("مرحله ۲ از ۱۰"));
  await page.reload({waitUntil:"domcontentloaded"});
  assert((await page.locator(".sf-study-hero").innerText()).includes("مرحله ۲ از ۱۰"),"Study progress persisted");
  await page.locator("#sfRestartJourney").click();
  assert.equal(await page.locator("#start").count(),1,"Restart returns to mode selector");
  assert.equal(await page.locator(".sf-study-hero").count(),0);
  await page.locator('[data-role="managers"]').click();
  await page.locator("#start").click();
  await page.locator("#sfPauseTime").click();
  await page.locator("#sfModePauseCountdown").waitFor({state:"visible"});
  const p1=await page.evaluate(()=>window.BP_SAFAR_OVERTIME.remainingMs(JSON.parse(localStorage.getItem("bp-communication-journey-v3"))));
  await page.waitForTimeout(1250);
  const p2=await page.evaluate(()=>window.BP_SAFAR_OVERTIME.remainingMs(JSON.parse(localStorage.getItem("bp-communication-journey-v3"))));
  assert(Math.abs(p1-p2)<250,"Clock frozen during break");
  await page.reload({waitUntil:"domcontentloaded"});
  await page.locator("#sfModePauseCountdown").waitFor({state:"visible"});
  await page.locator("#sfModeResume").click();
  assert.equal(await page.locator("#sfModePauseCountdown").count(),0);
  assert.equal(await page.locator("#sfPauseTime").isDisabled(),true,"One pause per mission");
  const p3=await page.evaluate(()=>window.BP_SAFAR_OVERTIME.remainingMs(JSON.parse(localStorage.getItem("bp-communication-journey-v3"))));
  await page.waitForTimeout(1100);
  const p4=await page.evaluate(()=>window.BP_SAFAR_OVERTIME.remainingMs(JSON.parse(localStorage.getItem("bp-communication-journey-v3"))));
  assert(p3-p4>800,"Clock resumes after break");
  await page.locator("#sfSwitchStudy").click();
  await page.locator(".sf-study-hero").waitFor();
  assert.equal(await page.locator("#sfPauseTime").count(),0);
  assert.equal(await page.locator("#sfOvertimeOverlay").count(),0);
  assert.equal(await page.locator("#sfScoreStrip").count(),0);
  assert.equal(await page.locator("#sfMedalGallery").count(),0);
  assert.deepEqual(errors,[],"No JavaScript errors");
  console.log("PASS: reading mode no timer/score/medal and persists; one fair pause freezes and auto-resumes; switching modes resets competition.");
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
