#!/usr/bin/env node
/* Safar: complete all ten stages through actual learner controls on mobile. */
"use strict";
const {chromium}=require("playwright");
const assert=require("node:assert/strict");
const target=process.env.AUDIT_URL||"http://127.0.0.1:8765/";
const key="bp-session5-communication-journey-v1";
(async()=>{
 const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,locale:"fa-IR",reducedMotion:"reduce"});
  const errors=[];page.on("pageerror",error=>errors.push(error.message));page.on("dialog",dialog=>dialog.accept());
  await page.goto(new URL("session5-communication-journey.html",target).href,{waitUntil:"domcontentloaded"});
  await page.locator('[data-role="supervisors"]').click();
  await page.locator("#start").click();
  await page.locator("#sfCoachOverlay").waitFor({state:"visible"});
  await page.locator("#sfCoachContinue").click();
  const phase=()=>page.locator("#sfWizardHead").getAttribute("data-phase");
  const next=async expected=>{
   await page.locator("#sfNext").click();
   await page.waitForFunction(p=>document.querySelector("#sfWizardHead")?.dataset.phase===p,expected,{timeout:10000});
   assert.equal(await phase(),expected);
  };
  const stageIndex=()=>page.evaluate(k=>JSON.parse(localStorage.getItem(k)).stage,key);
  const stages=await page.evaluate(()=>window.BP_SAFAR_DATA.stages.map(s=>({c1:s.c1,best:s.best,worst:s.worst})));
  let oldScore=0;
  for(let i=0;i<10;i++){
   await page.waitForFunction(n=>{
    const node=document.querySelector("#sfWizardHead");
    return node?.dataset.phase==="lesson"&&Number(JSON.parse(localStorage.getItem("bp-session5-communication-journey-v1")).stage)===n;
   },i,{timeout:15000});
   assert.equal(await page.locator("#sfLessonRead").isChecked(),false);
   assert.equal(await page.locator("#sfNext").isDisabled(),true);
   await page.locator("#sfLessonRead").check();
   await next("self");
   const first=page.locator('[data-scale="0"][data-val="1"]');
   await first.scrollIntoViewIfNeeded();
   const before=await page.evaluate(()=>scrollY);
   await first.click();
   const after=await page.evaluate(()=>scrollY);
   assert(Math.abs(after-before)<110,"Selecting self rating did not unexpectedly jump to top on stage "+(i+1));
   await page.locator('[data-scale="1"][data-val="2"]').click();
   await page.locator('[data-scale="2"][data-val="3"]').click();
   assert((await page.locator(".sf-self-feedback").innerText()).includes("بازتاب کوچ"));
   assert(!(await page.locator(".sf-self-feedback").innerText()).includes("از ۱۲"));
   await next("decision1");
   await page.locator('input[name="q1"][value="'+stages[i].c1+'"]').check();
   await page.locator('[data-saveq="1"]').click();
   await next("decision2");
   await page.locator("#best").selectOption(String(stages[i].best));
   await page.locator("#worst").selectOption(String(stages[i].worst));
   await page.locator('[data-saveq="2"]').click();
   const resource=await page.evaluate(index=>window.BP_SAFAR_DATA.incidents.some(c=>c.stage===index+1),i);
   if(resource)await next("resource");
   await next("wrap");
   const record=await page.evaluate(({k,index})=>{
     const s=JSON.parse(localStorage.getItem(k)),r=window.BP_SAFAR_RUBRIC,part=r.points(s,index),total=r.total(s);
     return{stage:s.stage,part:part.earned,max:part.max,score:total.total};
   },{k:key,index:i});
   assert.equal(record.part,8.5,"Completed with correct quiz and without evidence yields 8.5");
   assert.equal(record.max,10,"Fixed ten-point ceiling at every stage");
   assert.equal(record.score,oldScore+8.5,"Cumulative score consistent after stage "+(i+1));
   assert((await page.locator("#sfWizardWrap").innerText()).includes("نکته طلایی"));
   oldScore=record.score;
   if([2,6].includes(i)){
    await page.evaluate(k=>{
      const s=JSON.parse(localStorage.getItem(k));
      sessionStorage.setItem("bp-safar-rest-"+s.startedAt+":"+s.stage,String(Date.now()-32000));
    },key);
    await next("rest");
    await page.waitForFunction(()=>!document.querySelector("#sfNext")?.disabled,{timeout:4500});
   }
   if(i!==9){
    await page.locator("#sfNext").click();
   }else{
    await page.locator("#sfNext").click();
    await page.locator(".result-hero").waitFor({state:"visible",timeout:12000});
   }
  }
  const final=await page.evaluate(k=>{
   const s=JSON.parse(localStorage.getItem(k));
   const r=window.BP_SAFAR_RUBRIC.total(s);
   return {finished:s.finished,score:r.total,quiz:r.quiz,parts:r.parts.map(x=>x.earned)};
  },key);
  assert.equal(final.finished,true);
  assert.equal(final.score,85);
  assert.equal(final.quiz,70);
  assert.deepEqual(final.parts,Array(10).fill(8.5));
  assert(await page.locator("#sfMedalFeature [data-sf-export='png']").isVisible(),"Silver medal can be exported");
  assert.deepEqual(errors,[],"No browser script errors");
  console.log("PASS full 10-stage mobile journey, learning ack, scroll stability, both decisions, optional allocations, two rests, consistent scoring and downloadable medal");
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
