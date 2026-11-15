/* Emergency pre-class regression: expired-time escape + isolated facilitator preview.
 * Never modifies the production app; local HTTP server with fresh browser contexts.
 */
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
fs.mkdirSync("artifacts/facilitator-evidence",{recursive:true});
const {chromium}=require("playwright");
const BASE=process.env.BEHPARVAR_URL||"http://127.0.0.1:4173/";
const MAIN=new URL("session4-communication-journey.html",BASE).href;
const FAC=new URL("session4-facilitator.html",BASE).href;
const KEY="bp-communication-journey-v3";
function expiredAttempt(){
 return {version:3,curriculumV4:4,appliedCurriculumV2:2,contentV5:5,
  role:"supervisors",name:"تست کنترل کلاس",stage:3,
  startedAt:Date.now()-65*60000,finished:false,finishedAt:0,
  answers:{},orders:{},self:{},alloc:{},rp:{},peer:{},events:[],
  mode:"competitive",overtime:{pauseMs:0,grants:[]},
  pause:{since:0,spentMs:0,usedOnce:false},guide:{uses:[]},sound:false};
}
async function setupExpired(page){
 await page.goto(MAIN,{waitUntil:"domcontentloaded"});
 await page.evaluate(({s,k})=>localStorage.setItem(k,JSON.stringify(s)),{s:expiredAttempt(),k:KEY});
 await page.reload({waitUntil:"domcontentloaded"});
 await page.locator("#sfOvertimeOverlay").waitFor({state:"visible",timeout:15000});
}
async function run(){
 const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 try{
  const small=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,locale:"fa-IR"});
  const fac=await small.newPage(),errors=[];
  fac.on("pageerror",e=>errors.push("Facilitator "+e.message));
  let response=await fac.goto(FAC,{waitUntil:"domcontentloaded"});
  await fac.locator("#facStage option").first().waitFor({state:"attached"});
  assert.equal(response.status(),200);
  assert.equal(await fac.locator("#facStage option").count(),10,"all 10 stages are available");
  await fac.screenshot({path:"artifacts/facilitator-evidence/mobile-facilitator-home.png",animations:"disabled"});
  await fac.locator("#facAdvanced summary").click();
  assert(await fac.locator("#facAdvanced").getAttribute("open")!==null,"presenter controls expand");
  assert.equal(await fac.locator("#facRole option").count(),2,"both role pathways available");
  assert.equal(await fac.locator("#sfOvertimeOverlay").count(),0,"facilitator has no learner timeout dialog");
  assert.equal(await fac.locator("#facSummaryClock").textContent(),"60:00");
  await fac.locator("#facRole").selectOption("managers");
  await fac.locator("#facStage").selectOption("9");
  await fac.locator("#facPhase").selectOption("decision1");
  assert((await fac.locator("#facContent").innerText()).includes("آزمون تصمیم اول"),"question accessible without prior tasks");
  assert.equal(await fac.locator(".sf-fac-options li").count(),4);
  await fac.locator("#facAnswers").click();
  assert.equal(await fac.locator(".sf-fac-options li.is-correct").count(),1,"answer key explicit only after reveal");
  await fac.screenshot({path:"artifacts/facilitator-evidence/mobile-facilitator-answer-key.png",animations:"disabled"});
  await fac.locator("#facRole").selectOption("supervisors");
  assert.equal(await fac.locator("#facAnswers").getAttribute("aria-pressed"),"false","changing audience hides answer key");
  await fac.locator("#facPhase").selectOption("badges");
  assert((await fac.locator("#facContent").innerText()).includes("نشان‌ها"),"badge criteria accessible");
  await fac.locator("#facStage").selectOption("3");
  await fac.locator("#facPhase").selectOption("resource");
  assert((await fac.locator("#facContent").innerText()).includes("چالش تخصیص شش سکه"));
  await fac.locator("#facPhase").selectOption("role");
  assert(await fac.locator(".sf-fac-dialogue p").count()>=3,"roleplay dialogue present");
  await fac.screenshot({path:"artifacts/facilitator-evidence/mobile-facilitator-roleplay.png",animations:"disabled"});
  await fac.locator("#facTimerToggle").click();
  assert((await fac.evaluate(()=>window.BP_SAFAR_FACILITATOR.current())).running,"clock starts");
  await fac.waitForTimeout(1150);
  await fac.locator("#facTimerToggle").click();
  assert(!(await fac.evaluate(()=>window.BP_SAFAR_FACILITATOR.current())).running,"clock stops");
  await fac.locator("#facMinutes").fill("5");
  await fac.locator("#facTimerReset").click();
  assert.equal(await fac.locator("#facSummaryClock").textContent(),"05:00","timer can reset to arbitrary duration");
  await fac.reload({waitUntil:"domcontentloaded"});
  await fac.locator("#facStage option").first().waitFor({state:"attached"});
  assert.equal(await fac.locator("#facSummaryClock").textContent(),"05:00","timer state persists in facilitator-only session storage");
  const hasOverflow=await fac.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+1);
  assert(!hasOverflow,"facilitator mobile viewport no overflow");
  await small.close();
  const desktop=await browser.newContext({viewport:{width:1366,height:768}});
  const dp=await desktop.newPage();
  await dp.goto(FAC,{waitUntil:"domcontentloaded"});
  await dp.locator("#facStage option").first().waitFor({state:"attached"});
  await dp.screenshot({path:"artifacts/facilitator-evidence/desktop-facilitator-home.png",animations:"disabled"});
  assert(!(await dp.evaluate(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+1)),"facilitator desktop no overflow");
  await desktop.close();

  const learner=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const p=await learner.newPage();
  p.on("pageerror",e=>errors.push("Participant "+e.message));
  p.on("dialog",d=>d.accept());

  await setupExpired(p);
  await p.screenshot({path:"artifacts/facilitator-evidence/mobile-timeout-recovery.png",animations:"disabled"});
  for(const b of ["#sfOvertimeExitTop","#sfOvertimeRestart","#sfOvertimeStudy","#sfOvertimeExit"])
   assert(await p.locator(b).isVisible(),b+" visible in expired-time modal");
  await p.locator("#sfOvertimeExitTop").click();
  await p.waitForURL(/index\.html#course/,{timeout:12000});
  assert((await p.evaluate(k=>JSON.parse(localStorage.getItem(k)),KEY)).startedAt>0,
    "leave-to-course preserves learner progress");

  await setupExpired(p);
  await p.locator("#sfOvertimeRestart").click();
  await p.waitForFunction(k=>JSON.parse(localStorage.getItem(k)||"{}").startedAt===0,KEY,{timeout:12000});
  await p.locator("#sfOvertimeOverlay").waitFor({state:"detached",timeout:12000});
  assert.equal(await p.locator("#sfOvertimeOverlay").count(),0,"restart removes forced dialog");

  await setupExpired(p);
  await p.locator("#sfOvertimeStudy").click();
  await p.waitForFunction(k=>JSON.parse(localStorage.getItem(k)||"{}").mode==="study",KEY,{timeout:12000});
  await p.locator(".sf-study-shell").waitFor({state:"visible",timeout:12000});
  assert.equal(await p.locator("#sfOvertimeOverlay").count(),0,"free study bypasses expired time");

  // An expired participant attempt must never be reset by opening presenter preview.
  await setupExpired(p);
  const before=await p.evaluate(k=>localStorage.getItem(k),KEY);
  await p.goto(FAC,{waitUntil:"domcontentloaded"});
  await p.locator("#facStage option").first().waitFor({state:"attached"});
  const after=await p.evaluate(k=>localStorage.getItem(k),KEY);
  assert.equal(after,before,"facilitator does not overwrite participant answers, score or timer");
  assert.equal(await p.locator("#sfOvertimeOverlay").count(),0,"facilitator remains available on a blocked participant device");
  await learner.close();
  assert.deepEqual(errors,[],"no uncaught JS errors");
  console.log("PASS facilitator: 10 stages, 2 roles, unlocked substeps/roleplays, keys, independent timer, mobile RTL");
  console.log("PASS recovery: expired modal offers exit/restart/study, progress preservation and facilitator bypass");
 }finally{await browser.close()}
}
run().catch(e=>{console.error(e.stack||e);process.exit(1)});
