/* End-to-end proof: stage 2 context, private self reflection, no trainer, celebration, final review and projector QR. */
"use strict";
const assert=require("node:assert/strict"),{chromium}=require("playwright");
const base=process.env.AUDIT_URL||"http://127.0.0.1:8765/";
(async()=>{
 const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 try{
  const context=await browser.newContext({viewport:{width:390,height:844},locale:"fa-IR",isMobile:true,hasTouch:true});
  await context.addInitScript(()=>{
   document.addEventListener("DOMContentLoaded",()=>{
    const observer=new MutationObserver(()=>{
     const close=document.querySelector("#sfCoachClose");
     if(close&&!document.querySelector(".sf-celebration-image"))close.click();
    });
    observer.observe(document.body,{childList:true,subtree:true});
   });
  });
  const page=await context.newPage(),errors=[];
  page.on("pageerror",e=>errors.push(e.message));
  page.on("dialog",d=>d.accept());
  const url=new URL("session4-communication-journey.html",base).href;
  await page.goto(url,{waitUntil:"domcontentloaded"});
  assert.equal(await page.locator(".sf-classroom-qr-link a").getAttribute("href"),"session4-classroom-qr.html");
  await page.locator('[data-role="supervisors"]').click();
  await page.locator("#start").click();
  await page.locator("#sfWizardHead").waitFor();
  await page.evaluate(()=>{
   const s=JSON.parse(localStorage.getItem("bp-communication-journey-v3"));
   assertLocal(s.curriculumV4===4);
   s.stage=1;localStorage.setItem("bp-communication-journey-v3",JSON.stringify(s));
   function assertLocal(ok){if(!ok)throw new Error("Missing curriculum version")}
  });
  await page.reload({waitUntil:"domcontentloaded"});
  await page.locator("#sfWizardHead").waitFor();
  assert((await page.locator("#sfWizardHead h2").innerText()).includes("سوءتفاهم"));
  assert.equal(await page.locator("#sfScoreStrip").count(),1);
  await page.locator("#sfNext").click();
  await page.waitForFunction(()=>document.querySelector("#sfWizardHead")?.dataset.phase==="self");
  for(const [i,v] of [[0,4],[1,3],[2,2]]){
   await page.locator('[data-scale="'+i+'"][data-val="'+v+'"]').click();
  }
  const self=await page.locator(".sf-self-feedback").innerText();
  assert(self.includes("۹ از ۱۲")&&self.includes("۰٫۵"),"Reflection score and low-weight points must be visible");
  assert(self.includes("پیام مربی"),"Specific mentoring response visible");
  await page.locator("#sfNext").click();
  await page.waitForFunction(()=>document.querySelector("#sfWizardHead")?.dataset.phase==="decision1");
  const p1=await page.locator(".question:not(.sf-question-hidden)").innerText();
  assert(p1.includes("بارگیری")&&p1.includes("موجودی")&&p1.includes("سرپرست"),"Question 1 has enough scene context");
  await page.locator('.question input[name="q1"][value="1"]').check();
  await page.locator('[data-saveq="1"]').click();
  assert.equal(await page.locator(".reviewentry").count(),0,"No answer key mid-journey");
  await page.locator("#sfNext").click();
  await page.waitForFunction(()=>document.querySelector("#sfWizardHead")?.dataset.phase==="decision2");
  const p2=await page.locator(".question:not(.sf-question-hidden)").innerText();
  assert(p2.includes("بهترین")&&p2.includes("ضعیف‌ترین"),"Second decision is explicit");
  await page.locator("#best").selectOption("1");
  await page.locator("#worst").selectOption("3");
  await page.locator('[data-saveq="2"]').click();
  await page.locator("#sfNext").click();
  await page.waitForFunction(()=>document.querySelector("#sfWizardHead")?.dataset.phase==="role");
  // No observer or teacher is required: practice is optional; core decisions are complete.
  await page.locator("#sfNext").click();
  await page.waitForFunction(()=>document.querySelector("#sfWizardHead")?.dataset.phase==="wrap");
  const wrap=await page.locator("#sfWizardWrap").innerText();
  assert(wrap.includes("۸٫۵")&&wrap.includes("۹"),"Stage wrap shows earned / possible points, including 0.5 reflection");
  await page.locator("#sfNext").click();
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem("bp-communication-journey-v3")).stage===2);
  await page.locator("#sfCoachOverlay .sf-celebration-image").waitFor({state:"visible",timeout:10000});
  assert(await page.locator("#sfCoachOverlay").innerText().then(x=>x.includes("۸٫۵")),"Stage celebration shows points");
  assert(await page.locator(".sf-celebration-image").evaluate(e=>e.complete&&e.naturalWidth>0),"Stage celebration illustration loads");
  // Simulate a finished learning history to verify the answer key is end-only.
  await page.evaluate(()=>{
   const s=JSON.parse(localStorage.getItem("bp-communication-journey-v3")),data=window.BP_SAFAR_DATA.stages;
   data.forEach((d,i)=>{
    if(i!==1)s.answers[i]={q1:i===0?(d.c1+1)%4:d.c1,q2:{best:d.best,worst:d.worst}};
    s.self[i]=[3,3,3];
   });
   s.finished=true;s.finishedAt=Date.now();
   localStorage.setItem("bp-communication-journey-v3",JSON.stringify(s));
  });
  await page.reload({waitUntil:"domcontentloaded"});
  await page.locator("#sfFinalReviewNotice").waitFor();
  assert.equal(await page.locator(".reviewentry").count(),10,"Full ten-stage final debrief");
  assert(await page.locator(".sf-final-answer-status.correct").count()>0);
  assert(await page.locator(".sf-final-answer-status.incorrect").count()>0,"Incorrect status marked only at finish");
  assert(await page.locator("#sfFinalReviewNotice").innerText().then(x=>x.includes("۳۰ تشخیص")));
  const qr=await context.newPage();
  await qr.goto(new URL("session4-classroom-qr.html",base).href,{waitUntil:"domcontentloaded"});
  assert(await qr.locator(".qr img").evaluate(e=>e.complete&&e.naturalWidth>100),"Offline QR asset renders");
  assert((await qr.locator("main").innerText()).includes("ورود به جلسه چهارم"));
  assert.deepEqual(errors,[]);
  console.log("PASS: Stage 2 complete context, self-score and mentor, self-paced progression, picture/score celebration, end-only answer review, offline projector QR.");
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
