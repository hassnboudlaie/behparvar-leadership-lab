/* End-to-end classroom smoke: adjacent partner, private 1–5 score, optional recognition.
 * Runs on a local same-origin server; no real learner data or external sharing. */
"use strict";
const assert=require("node:assert/strict"),{chromium}=require("playwright");
const base=process.env.AUDIT_URL||"http://127.0.0.1:8765/";
async function closeCoach(page){
 for(let i=0;i<7;i++){
  const overlay=page.locator("#sfCoachOverlay");
  if(!(await overlay.count()))return;
  await page.locator("#sfCoachClose").click();
  await page.waitForTimeout(90);
 }
}
(async()=>{
 const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 try{
  const sender=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,locale:"fa-IR"});
  await sender.addInitScript(()=>{
   Object.defineProperty(navigator,"share",{configurable:true,value:async payload=>{window.__sampleShare=payload;}});
   // End-to-end QA tests the classroom flow, not individual coaching modals.
   // Close expected coaching notifications without invoking their auto-advance button.
   document.addEventListener("DOMContentLoaded",()=>{
    const watcher=new MutationObserver(()=>{
     const close=document.querySelector("#sfCoachClose");
     if(close)close.click();
    });
    watcher.observe(document.body,{childList:true,subtree:true});
   });
  });
  const page=await sender.newPage(),errors=[];
  page.on("pageerror",e=>errors.push(String(e)));
  page.on("dialog",dialog=>dialog.accept());
  await page.goto(new URL("session4-communication-journey.html",base).href,{waitUntil:"domcontentloaded"});
  await page.locator("#sfMedalGallery > summary").click();
  assert.equal(await page.locator("#sfMedalGallery .sf-medal-mini").count(),3);
  assert.equal(await page.locator("#sfMedalGallery .sf-medal-rule").count(),3);
  await page.locator("#sfMedalGallery .sf-medal-rule").last().locator("summary").click();
  const conditions=await page.locator("#sfMedalGallery .sf-medal-rule").last().innerText();
  assert(conditions.includes("۶۰")&&conditions.includes("۴۴"),"Bronze quiz threshold remains 44");
  await page.locator('[data-role="supervisors"]').click();
  await page.locator("#start").click();
  await page.locator("#sfWizardHead").waitFor();
  await closeCoach(page);
  await page.locator("#sfScoreStrip").waitFor();
  assert.equal(await page.locator("#sfScoreStrip").getAttribute("id"),"sfScoreStrip");
  await page.locator("#sfNext").click();
  await page.waitForFunction(()=>document.querySelector("#sfWizardHead")?.dataset.phase==="self");
  await closeCoach(page);
  for(let i=0;i<3;i++){await closeCoach(page);await page.locator('[data-scale="'+i+'"][data-val="2"]').click()}
  await page.locator("#sfNext").click();
  await page.waitForFunction(()=>document.querySelector("#sfWizardHead")?.dataset.phase==="decision1");
  await closeCoach(page);
  await page.locator('.question input[name="q1"]').first().check();
  await page.locator('[data-saveq="1"]').click();
  await page.locator("#sfNext").click();
  await page.waitForFunction(()=>document.querySelector("#sfWizardHead")?.dataset.phase==="decision2");
  await closeCoach(page);
  await page.locator("#best").selectOption("0");
  await page.locator("#worst").selectOption("1");
  await page.locator('[data-saveq="2"]').click();
  await closeCoach(page);
  await page.locator("#sfNext").click();
  await page.waitForFunction(()=>document.querySelector("#sfWizardHead")?.dataset.phase==="role");
  await closeCoach(page);
  await page.locator("#sfPrivateScore").waitFor();
  assert.equal(await page.locator(".sf-rating-options input").count(),5);
  await page.locator(".sf-rating-options label").nth(3).click();
  await page.locator("#saverp").click();
  await closeCoach(page);
  const assessment=await page.evaluate(()=>{
   const s=JSON.parse(localStorage.getItem("bp-communication-journey-v3"));
   return s.rp[0];
  });
  assert.equal(assessment.peerRating,4);
  assert.equal(assessment.mode,"adjacent-peer-private");
  await closeCoach(page);
  await page.locator("#sfPeerThanks summary").click();
  assert(await page.locator("#sfShareThanks").isEnabled(),"Optional giving enabled after assessment");
  await page.locator("#sfShareThanks").click();
  await page.waitForFunction(()=>!!window.__sampleShare);
  const shared=await page.evaluate(()=>window.__sampleShare);
  const payload=new URL(shared.url).searchParams.get("bpAppreciation");
  assert(payload,"Recognition link must contain an opt-in token");
  const decoded=await page.evaluate(token=>window.BP_SAFAR_PEER_APPRECIATION.decode(token),payload);
  assert(decoded&&decoded.peerRating===undefined,"Peer rating never shared");
  const sent=await page.evaluate(()=>JSON.parse(localStorage.getItem("bp-safar-appreciation-v1")).sent.length);
  assert.equal(sent,1);
  const receiver=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,locale:"fa-IR"});
  const other=await receiver.newPage(),receiverErrors=[];
  other.on("pageerror",e=>receiverErrors.push(String(e)));
  other.on("dialog",dialog=>dialog.accept());
  await other.goto(new URL("session4-communication-journey.html",base).href,{waitUntil:"domcontentloaded"});
  await other.locator('[data-role="supervisors"]').click();
  await other.locator("#start").click();
  await other.goto(shared.url,{waitUntil:"domcontentloaded"});
  await other.locator("#sfReceptionModal").waitFor();
  assert((await other.locator("#sfReceptionModal").innerText()).includes("از تو قدردانی شده"));
  await other.locator("#sfReceptionClose").click();
  const counts=await other.evaluate(()=>window.BP_SAFAR_PEER_APPRECIATION.counts(
   JSON.parse(localStorage.getItem("bp-communication-journey-v3"))));
  assert.equal(counts.received,1);
  assert.deepEqual(errors,[],"Sender console should not have uncaught errors");
  assert.deepEqual(receiverErrors,[],"Receiver should not have uncaught errors");
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  assert(overflow<=8,"No horizontal overflow on phone");
  console.log("PASS: premium medals, thresholds, 1–5 private partner rating, score feedback, optional share, and deduplicated receiver count.");
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
