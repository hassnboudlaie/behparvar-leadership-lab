/* Session 2 browser acceptance: dialogue-first learning, role-specific 2/4 person cases. */
"use strict";
const {chromium}=require("playwright"),assert=require("node:assert/strict");
(async()=>{
 const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 const base=process.env.AUDIT_URL||"http://127.0.0.1:8765/";
 const errors=[];
 try{
  const ctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,locale:"fa-IR"});
  const page=await ctx.newPage();
  page.on("pageerror",e=>errors.push(String(e)));
  await page.goto(base+"?audience=supervisors",{waitUntil:"load"});
  await page.locator('#welcome [data-open="bp-c-clinic-2"]').click();
  await page.locator("#bp-c-clinic-2.view.active").waitFor();
  assert.equal(await page.locator("#bp-c-clinic-2 [data-simple-case]").count(),4);
  await page.locator('[data-simple-case="pair-signal"]').click();
  assert.equal(await page.locator("#bp-c-clinic-2 .bp-simple-roles article").count(),2);
  assert.ok((await page.locator("#bp-c-clinic-2 .bp-simple-scene").innerText()).length>100);
  assert.ok(await page.locator("#bp-c-clinic-2 .bp-simple-line").count()>=10);
  assert.ok((await page.locator("#bp-c-clinic-2 .bp-simple-target").innerText()).includes("شایستگی‌های هدف"));
  assert.equal(await page.locator("#bp-c-clinic-2 .bp-simple-checks input").count(),5);
  await page.locator("#bp-c-clinic-2 .bp-simple-checks input").first().check();
  assert.equal(await page.locator("#bp-c-clinic-2 .bp-simple-checks input").first().isChecked(),true);
  await page.locator("#bp-c-clinic-2 [data-simple-back]").first().click();
  await page.locator('[data-simple-case="group-handover"]').click();
  assert.equal(await page.locator("#bp-c-clinic-2 .bp-simple-roles article").count(),4);
  assert.ok(await page.locator("#bp-c-clinic-2 .bp-simple-line").count()>=12);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  assert.ok(overflow<=1,"horizontal overflow: "+overflow);
  await page.locator("#bp-c-clinic-2 [data-simple-role='managers']").click();
  assert.equal(await page.locator("#bp-c-clinic-2 [data-simple-case]").count(),4);
  await page.locator('[data-simple-case="group-handover"]').click();
  assert.ok((await page.locator("#bp-c-clinic-2 .bp-simple-scene").innerText()).includes("فروش"));
  assert.equal(await page.locator("#bp-c-clinic-2 .bp-simple-roles article").count(),4);
  assert.equal(await page.evaluate(()=>localStorage.getItem("bp_competency_session2_v1_managers")),null);
  assert.deepEqual(errors,[]);
  await ctx.close();
  console.log("PASS: two/four person scripts, role cards, observable targets, dialogue feedback, role changes, mobile no overflow and no diagnostic data modifications.");
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
