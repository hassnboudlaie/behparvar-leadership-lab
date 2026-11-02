/* End-to-end Session 2 continuity: entry -> seven-part reader -> one canonical
   dialogue studio -> peer observer -> revised 12-situation diagnostic.
   Run with the local same-origin server used by mobile audit. */
"use strict";
const {chromium}=require("playwright");
const assert=require("node:assert/strict");
const base=process.env.AUDIT_URL||"http://127.0.0.1:8765/";
(async()=>{
 const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 const errors=[];
 try{
  const ctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,locale:"fa-IR"});
  const page=await ctx.newPage();
  page.on("pageerror",err=>errors.push(String(err)));
  await page.goto(base+"?audience=supervisors#session2-m2",{waitUntil:"load"});
  await page.locator("#session2-m2.view.active .mml-aligned-panel").waitFor();
  const reader="#session2-m2 .mml-aligned-panel";
  const studioCards=page.locator(reader+" [data-simple-open-case]");
  assert.equal(await studioCards.count(),5,"all five cases available directly from seven-part reader");
  const readerText=await page.locator(reader).innerText();
  assert.ok(readerText.includes("چک‌لیست مشاهده‌گر"),"observation is purpose of session-two reader");
  for(const obsolete of ["دور دوم؛ همان گفت‌وگو","کارت اتفاق تازه","همه نقش‌ها در برابر اتفاق تازه","۶ دقیقه بازی نقش"]){
    assert.ok(!readerText.includes(obsolete),"obsolete session two stage: "+obsolete);
  }
  await page.locator(reader+' [data-simple-open-case="group-empowerment"]').click();
  await page.locator("#bp-c-clinic-2.view.active").waitFor();
  assert.equal(await page.locator("#bp-c-clinic-2 .bp-simple-roles article").count(),4);
  assert.ok((await page.locator("#bp-c-clinic-2 .bp-simple-roles h3").allInnerTexts()).every(x=>x.startsWith("سرپرست")));
  assert.ok((await page.locator("#bp-c-clinic-2 .bp-simple-dialogue").innerText()).includes("نوبت ۱"));
  assert.equal(await page.locator("#bp-c-clinic-2 .bp-simple-inpage [data-simple-jump]").count(),3);
  await page.locator("#bp-c-clinic-2 [data-simple-jump='checklist']").click();
  assert.equal(await page.locator("#bp-c-clinic-2 [data-simple-section='checklist'] [data-simple-check-item]").count(),5);
  assert.equal(await page.locator("#bp-c-clinic-2 [data-simple-section='checklist'] [data-simple-evidence]").count(),5);
  await page.locator("#bp-c-clinic-2 [data-simple-eval]").first().selectOption("کاملاً مشاهده شد");
  await page.locator("#bp-c-clinic-2 [data-simple-evidence]").first().fill("نوبت ۳: سرپرست تولید برداشت قبلی را اصلاح کرد");
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  assert.ok(overflow<=1,"unexpected mobile horizontal overflow: "+overflow);
  await page.evaluate(()=>{location.hash="#session2-techniques"});
  await page.locator("#session2-techniques.view.active .mml-aligned-panel").waitFor();
  const techniques=await page.locator("#session2-techniques .mml-aligned-panel").innerText();
  assert.ok(!techniques.includes("اتفاق تازه")&&!techniques.includes("دور دوم"),"no stale replay in session-two method");
  await page.evaluate(()=>{location.hash="#session2-diseases"});
  await page.locator("#session2-diseases.view.active .mml-aligned-panel").waitFor();
  const diseases=await page.locator("#session2-diseases .mml-aligned-panel").innerText();
  assert.ok(!diseases.includes("مانع تازه"),"remove obsolete activity card");
  await page.evaluate(()=>{location.hash="#session2-quiz"});
  await page.locator("#session2-quiz.view.active .mml-aligned-panel").waitFor();
  const practice=await page.locator("#session2-quiz .mml-aligned-panel").innerText();
  assert.ok(practice.includes("سه سؤال تمرینی")&&practice.includes("۱۲سؤالی"),"three short questions distinguished from SJT");
  await page.evaluate(()=>{
    const old=Object.fromEntries(window.BPCompetencyData.supervisors.map(q=>[q.id,q.answer]));
    localStorage.setItem("bp_competency_session2_v1_supervisors",JSON.stringify({version:1,answers:old}));
    location.hash="#bp-c-test";
  });
  await page.locator("#bp-c-test.view.active").waitFor();
  await page.locator("#bp-c-test [data-bp-quiz-role='supervisors']").click();
  assert.ok(await page.locator("#bp-c-test .bp-c-question h2").isVisible(),"revised assessment starts independently");
  const stem=await page.locator("#bp-c-test .bp-c-question h2").innerText();
  assert.ok(stem.includes("سرپرست")&&stem.includes("کنترل کیفیت"),"first scenario is cross-unit");
  const before=await page.evaluate(()=>localStorage.getItem("bp_competency_session2_v1_supervisors"));
  assert.equal(await page.evaluate(()=>localStorage.getItem("bp_competency_session2_v2_supervisors")),null);
  const answer=await page.evaluate(()=>window.BPCompetencyData.supervisors[0].answer);
  await page.locator('#bp-c-test [data-bp-option="'+answer+'"]').click();
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem("bp_competency_session2_v2_supervisors")));
  assert.equal(saved.version,2);
  assert.equal(Object.keys(saved.answers).length,1);
  assert.equal(await page.evaluate(()=>localStorage.getItem("bp_competency_session2_v1_supervisors")),before,"old responses remain unchanged");
  await page.goto(base+"?audience=managers#session2-m2",{waitUntil:"load"});
  await page.locator("#session2-m2.view.active [data-simple-open-case='pair-delegation']").waitFor();
  await page.locator("#session2-m2 [data-simple-open-case='pair-delegation']").click();
  await page.locator("#bp-c-clinic-2.view.active").waitFor();
  assert.deepEqual(await page.locator("#bp-c-clinic-2 .bp-simple-roles h3").allInnerTexts(),["مدیر عملیات","مدیر منابع انسانی"],"direct links preserve selected manager path");
  assert.deepEqual(errors,[],"no JavaScript page errors");
  await ctx.close();
  console.log("PASS session 2: five canonical case links, no obsolete replay/twist, selected audience, readable observer shortcuts, distinct 3/12-question assessments, versioned SJT and retained historical responses.");
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});