#!/usr/bin/env node
/* Browser smoke test: original ten-stage Safar is an individual journey. */
"use strict";
const assert=require("node:assert/strict"),{chromium}=require("playwright");
const base=process.env.AUDIT_URL||"http://127.0.0.1:8765/";
(async()=>{
 const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},locale:"fa-IR",isMobile:true,hasTouch:true});
  const errors=[];page.on("pageerror",e=>errors.push(e.message));page.on("dialog",d=>d.accept());
  await page.goto(new URL("session5-communication-journey.html",base).href,{waitUntil:"domcontentloaded"});
  assert((await page.locator("#clock").innerText()).includes("۹۰:۰۰"),"Clock shows a 90-minute baseline");
  await page.locator('[data-role="supervisors"]').click();
  await page.locator("#start").click();
  await page.locator("#sfCoachOverlay").waitFor({state:"visible",timeout:15000});
  await page.locator('[data-coach-choice="1"]').click();
  assert((await page.locator("#sfCoachChoiceResponse").innerText()).length>25,"Coach welcome offers a meaningful choice");
  await page.locator("#sfCoachContinue").click();
  await page.locator("#sfCoachOverlay").waitFor({state:"detached"});
  await page.locator("#sfWizardHead").waitFor({state:"visible"});
  assert.equal(await page.locator('.sf-wizard-step[data-sf-phase="role"]').count(),0,"No roleplay phase");
  assert.equal(await page.locator('.sf-wizard-step[data-sf-phase="peer"]').count(),0,"No peer feedback phase");
  assert.equal(await page.locator("#saverp,#savepeer,.sf-role-rate").count(),0,"No pair activity");
  await page.locator('[data-sf-wizard-focus="risk"]').click();
  assert((await page.locator(".sf-wizard-coach-answer").innerText()).length>15,"On-stage coach has interactive risk lens");
  assert.equal(await page.locator("#sound").isVisible(),false,"Learner does not see sound or facilitator links");
  assert(await page.locator(".sf-learning-card .sf-learn-principle").innerText(),"Lesson contains a practical technique");
  assert.equal(await page.locator("#sfNext").isDisabled(),true,"Reading requires acknowledgement");
  await page.locator("#sfLessonRead").check();
  assert.equal(await page.locator("#sfNext").isEnabled(),true);
  await page.locator("#sfNext").click(); // lesson -> self
  await page.waitForFunction(()=>document.querySelector("#sfWizardHead")?.dataset.phase==="self");
  for(let i=0;i<3;i++)await page.locator('[data-scale="'+i+'"][data-val="1"]').click();
  assert((await page.locator(".sf-self-feedback").innerText()).includes("۳"),"Honest low self-rating yields reflection");
  assert((await page.locator(".sf-self-feedback").innerText()).includes("۱ از ۱"),"Full completion point independent of ratings");
  await page.locator("#sfEvidenceSection summary").click();
  const samples=[
   "در جلسه روز دوشنبه با کارشناس فروش پرسیدم کدام خروجی تا ساعت ۲ آماده می‌شود و پس از آن موعد تحویل روشن شد.",
   "هفته گذشته در شیفت صبح برای مدیر تولید پیام توضیحی فرستادم و نتیجه این بود که مسئول گزارش مشخص شد.",
   "دیروز در جلسه هماهنگی با همکار واحد انبار یک پیشنهاد ثبت کردم و در نتیجه اختلاف درباره زمان تحویل حل شد."
  ];
  for(let i=0;i<3;i++)await page.locator("#sfEvidence"+i).fill(samples[i]);
  await page.locator("#sfSaveEvidence").click();
  assert((await page.locator("#sfEvidenceResult").innerText()).includes("۱٫۵"),"Evidence earns up to 1.5 points");
  assert.equal(await page.locator("#sfSelfFeedbackHolder").isVisible(),true);
  await page.locator("#sfNext").click(); // self -> first decision
  await page.waitForFunction(()=>document.querySelector("#sfWizardHead")?.dataset.phase==="decision1");
  await page.locator("#sfGuideFloating").click();
  await page.locator("#sfGuideReveal").click();
  const help=await page.locator("#sfGuideBody").innerText();
  assert(help.includes("گام عملی")&&help.includes("نمونه جمله")&&help.includes("خطای قابل پیشگیری"),"Paid/free guide is substantive");
  await page.locator("#sfGuideClose").click();
  await page.locator('input[name="q1"]').first().check();
  await page.locator('[data-saveq="1"]').click();
  await page.locator("#sfCoachInline").waitFor({state:"visible",timeout:8000});
  assert.equal(await page.locator("#sfCoachOverlay").count(),0,"Answer feedback is inline, not recurring modal");
  await page.locator('[data-sf-coach-view="next"]').click();
  assert((await page.locator(".sf-coach-choice-answer").innerText()).length>10,"Feedback offers a contextual next step");
  // Use canonical saved data to simulate a completed individual journey.
  await page.evaluate(()=>{
   const KEY="bp-session5-communication-journey-v1",s=JSON.parse(localStorage.getItem(KEY));
   const data=window.BP_SAFAR_DATA;
   s.startedAt=Date.now()-90000;s.stage=9;s.soloVersion=1;s.s5gameVersion=1;s.rubricV2=2;
   s.answers={};s.self={};s.learned={};s.evidence={};s.alloc={};s.rp={0:{peerRating:5}};s.peer={2:{f:"old",s:"old"}};
   const samples=[
    "در جلسه روز دوشنبه با کارشناس فروش پرسیدم کدام خروجی تا ساعت ۲ آماده می‌شود و پس از آن موعد تحویل روشن شد.",
    "هفته گذشته در شیفت صبح برای مدیر تولید پیام توضیحی فرستادم و نتیجه این بود که مسئول گزارش مشخص شد.",
    "دیروز در جلسه هماهنگی با همکار واحد انبار یک پیشنهاد ثبت کردم و در نتیجه اختلاف درباره زمان تحویل حل شد."
   ];
   data.stages.forEach((st,i)=>{s.answers[i]={q1:st.c1,q2:{best:st.best,worst:st.worst}};s.self[i]=[1,1,1];s.learned[i]=true;s.evidence[i]={texts:samples};
    const inc=data.incidents.find(x=>x.stage===i+1);if(inc)s.alloc[i]=inc.ideal.slice();});
   s.guide={uses:[]};s.finished=true;s.finishedAt=Date.now();
   localStorage.setItem(KEY,JSON.stringify(s));
  });
  await page.reload({waitUntil:"domcontentloaded"});
  await page.locator(".result-hero").waitFor({state:"visible"});
  assert.equal(await page.evaluate(()=>window.BP_SAFAR_MEDALS.score(JSON.parse(localStorage.getItem("bp-session5-communication-journey-v1")))),100,"Solo 10x10 grade 100; previous peer records ignored");
  assert((await page.locator("#root").innerText()).includes("۷۰"),"Rubric shows seventy decision points");
  assert(await page.locator("#sfMedalFeature [data-sf-export='png']").isVisible(),"Prestigious final medal is downloadable");
  assert.equal(await page.locator("#sfPeerRecognitionResult").count(),0,"No team recognition report");
  assert(!(await page.locator("#root").innerText()).includes("همفکری تیمی"),"No group badge on final report");
  assert.deepEqual(errors,[],"No browser runtime errors");
  console.log("PASS solo journey: 90-minute timer; no peer phase; interactive coaching and help; honest reflection; earned grade 100");
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
