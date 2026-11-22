/* Behparvar Session 4: actual education hub + competition browser QA.
 * Runs against a local static checkout, never a live participant session.
 * Does not alter scoring, save keys, test answers or timing rules.
 */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const {chromium}=require("playwright");
const TARGET=process.env.BEHPARVAR_URL||"http://127.0.0.1:4173/session5-communication-journey.html";
const HUB=new URL("session4-communication-journey.html",TARGET).href;
const OUT=path.resolve(__dirname,"../artifacts/session4-browser");
fs.mkdirSync(OUT,{recursive:true});
const key="bp-session5-communication-journey-v1";
async function inspect(name,viewport,browser){
 const ctx=await browser.newContext({viewport,isMobile:name==="mobile",hasTouch:name==="mobile",reducedMotion:"reduce",locale:"fa-IR"});
 const p=await ctx.newPage();p.setDefaultTimeout(12000);
 const errors=[];p.on("pageerror",e=>errors.push(e.message));
 const snap=async suffix=>p.screenshot({path:path.join(OUT,name+"-"+suffix+".png"),fullPage:false,animations:"disabled"});
 const overflow=async()=>p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
 try{
  const a=await p.goto(HUB,{waitUntil:"domcontentloaded",timeout:30000});
  assert.equal(a.status(),200);
  await p.locator("#landing .option-journey").waitFor({state:"visible"});
  assert.equal(await p.locator("#landing .option").count(),3);
  assert.equal(await p.locator('#landing a[href="session5-communication-journey.html"]').count(),1);
  assert.equal(await p.locator("header .brand img").count(),1);
  await snap("three-path-hub");
  await p.locator("#goLearning").click();
  await p.locator('[data-role="managers"]').click();
  assert.equal(await p.locator('[data-role="managers"]').getAttribute("aria-pressed"),"true");
  await p.locator("#stagebar").selectOption("1");
  assert.match(await p.locator("#stageCount").innerText(),/۲ از ۱۰/);
  assert.equal(await p.locator(".roleplay-panel").count(),1);
  await snap("teaching");
  await p.locator("#backHome").click();
  assert.equal(await p.locator("#landing").isVisible(),true);
  const hubOverflow=await overflow();assert.ok(hubOverflow<=5,"Hub overflow "+hubOverflow);
  const b=await p.goto(TARGET,{waitUntil:"domcontentloaded",timeout:30000});
  assert.equal(b.status(),200);
  await p.locator("#root .introgrid").waitFor({state:"visible"});
  assert.equal(await p.evaluate(()=>window.BP_SAFAR_DATA?.stages?.length),10);
  assert.equal(await p.locator(".role-card").count(),2);
  assert.equal(await p.locator("#start").isDisabled(),true);
  await snap("journey-welcome");
  await p.locator('.role-card[data-role="managers"]').click();
  assert.equal(await p.locator("#start").isEnabled(),true);
  p.on("dialog",d=>d.accept());
  await p.locator("#start").click();
  await p.waitForTimeout(300);
  const diagnostic=await p.evaluate(k=>({
    saved:JSON.parse(localStorage.getItem(k)||"null")?.startedAt||0,
    current:document.querySelector("#root")?.innerText?.slice(0,320)||"",
    wizard:!!document.querySelector("#sfWizardHead"),
    bodyMode:document.body.className,
    rootChildren:document.querySelector("#root")?.children.length
  }),key);
  console.log("JOURNEY_START_DIAGNOSTIC",JSON.stringify({device:name,...diagnostic,errors}));
  await p.locator("#sfWizardHead").waitFor({state:"visible",timeout:12000});
  const state=await p.evaluate(k=>JSON.parse(localStorage.getItem(k)||"null"),key);
  assert.equal(state?.role,"managers");assert.equal(state?.mode,"competitive");assert.equal(state?.stage,0);
  assert.ok(state?.startedAt>0);
  const phases=await p.locator("[data-sf-phase]").allTextContents();
  assert.ok(!phases.some(x=>x.includes("بازخورد همتا")||x.includes("تمرین و بازخورد")),"Competition is entirely individual");
  await snap("journey-stage-one");
  const gameOverflow=await overflow();assert.ok(gameOverflow<=5,"Game overflow "+gameOverflow);
  assert.deepEqual(errors,[],"JavaScript errors");
  return {device:name,hubOverflow,gameOverflow,stage:state.stage,role:state.role,phases:phases.length,errors};
 }finally{await ctx.close()}
}
(async()=>{
 const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 try{const report=[];for(const x of [{name:"laptop",viewport:{width:1366,height:768}},{name:"mobile",viewport:{width:390,height:844}}])report.push(await inspect(x.name,x.viewport,browser));
 fs.writeFileSync(path.join(OUT,"report.json"),JSON.stringify(report,null,2));
 console.log("PASS Behparvar responsive education, solo competitive journey, 90-minute timer and preserved state",JSON.stringify(report));
 }finally{await browser.close()}
})().catch(err=>{console.error("FAILED:",err);process.exitCode=1});
