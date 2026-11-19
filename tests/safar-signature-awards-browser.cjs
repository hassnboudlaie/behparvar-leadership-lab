#!/usr/bin/env node
"use strict";
/* Real-browser audit: no stock art; narrative consistent; official logo; personal downloads. */
const assert=require("node:assert/strict"),fs=require("node:fs"),{chromium}=require("playwright");
const root=process.env.AUDIT_URL||"http://127.0.0.1:8765/";
(async()=>{
 const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 try{
  const ctx=await browser.newContext({viewport:{width:1280,height:900},locale:"fa-IR",acceptDownloads:true});
  const page=await ctx.newPage(),errors=[];page.on("pageerror",e=>errors.push(e.message));page.on("dialog",d=>d.accept());
  await page.goto(new URL("session5-awards-gallery.html",root).href,{waitUntil:"load"});
  assert.equal(await page.locator(".badges .bp-recognition-badge").count(),10,"All ten skills have distinct visual cards");
  assert.equal(await page.locator(".medal-card img").count(),3,"Exactly three tier medal previews");
  assert(await page.locator(".badges .sf-recognition-quote").first().isVisible(),"Human skill quote visible");
  assert((await page.locator(".badges").innerText()).includes("برای فردا:"),"Every card encourages transfer to work");
  assert.equal(await page.locator(".badges .bp-recognition-state").filter({hasText:"نمونه طراحی، نه نشان کسب‌شده"}).count(),10,"Every badge clearly marks preview, not achievement");
  const images=await page.locator(".medal-card img").evaluateAll(nodes=>nodes.map(x=>({complete:x.complete,width:x.naturalWidth,height:x.naturalHeight})));
  assert(images.every(x=>x.complete&&x.width>300&&x.height>300),"All medal SVGs visually load in browser");
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+8),true,"Gallery fits desktop width");
  await page.setViewportSize({width:390,height:844});
  await page.waitForTimeout(200);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+8),true,"Gallery fits mobile without sideways scrolling");
  await page.goto(new URL("session5-communication-journey.html",root).href,{waitUntil:"domcontentloaded"});
  await page.locator('[data-role="supervisors"]').click();
  await page.locator("#start").click();
  await page.locator("#sfCoachOverlay").waitFor({state:"visible"});
  await page.locator("#sfCoachContinue").click();
  await page.evaluate(()=>{
   const key="bp-session5-communication-journey-v1",s=JSON.parse(localStorage.getItem(key)),d=window.BP_SAFAR_DATA;
   s.stage=9;s.startedAt=Date.now()-90000;s.finished=true;s.finishedAt=Date.now();s.rubricV2=2;s.soloVersion=1;s.s5gameVersion=1;s.selfScaleV5=5;
   s.answers={};s.self={};s.learned={};s.evidence={};s.alloc={};
   const examples=[
     "روز دوشنبه در جلسه با سرپرست تولید مسئله را توضیح دادم و نتیجه را در برنامه پیگیری ثبت کردم.",
     "هفته گذشته هنگام بررسی گزارش با کارشناس فروش سؤال دقیق پرسیدم و پس از آن مسئول اقدام روشن شد.",
     "دیروز در گفت‌وگو با واحد کیفیت خلاصه توافق را ارسال کردم و فردا پاسخ آن را دریافت کردم."
   ];
   d.stages.forEach((stage,i)=>{
     s.answers[i]={q1:stage.c1,q2:{best:stage.best,worst:stage.worst}};
     s.self[i]=[1,3,5];s.learned[i]=true;
     s.evidence[i]={texts:examples.map((t,j)=>t+" نمونه مستقل در مهارت "+stage.selfItems[j])};
   });
   localStorage.setItem(key,JSON.stringify(s));
  });
  await page.reload({waitUntil:"domcontentloaded"});
  await page.locator(".result-hero").waitFor({state:"visible",timeout:15000});
  await page.locator("#sfMedalFeature [data-sf-export='svg']").waitFor({state:"visible",timeout:15000});
  assert((await page.locator("#sfMedalFeature h2").innerText()).includes("گفت‌وگوهایی که اثر می‌گذارند"),"Personal medal uses human tier title");
  assert.equal(await page.locator("#bp-recognition-collection .bp-recognition-badge.is-earned").count(),11,"Ten stage badges and optional time badge");
  const first=page.locator('[data-bp-download="s0"]');
  assert(await first.isVisible(),"Personal skill keepsake can be downloaded");
  const skillDownload=page.waitForEvent("download",{timeout:30000});
  await first.click();
  const png=await skillDownload;
  assert(png.suggestedFilename().endsWith(".png"),"Skill keepsake downloads PNG");
  const pfile=await png.path();
  assert(fs.statSync(pfile).size>10000,"Skill PNG is non-empty and rendered");
  const medalDownload=page.waitForEvent("download",{timeout:30000});
  await page.locator("#sfMedalFeature [data-sf-export='svg']").click();
  const svgDownload=await medalDownload;
  assert(svgDownload.suggestedFilename().endsWith(".svg"),"Medal exports SVG");
  const svg=fs.readFileSync(await svgDownload.path(),"utf8");
  assert(svg.includes("مدال زرین")&&svg.includes("data:image/png;base64,")&&svg.includes("شرکت‌کننده"),"Personal SVG has tier, official logo and personal name");
  assert.deepEqual(errors,[],"No browser runtime exceptions");
  console.log("PASS visual signature awards: desktop/mobile gallery, all badges and medals, unique copy, logo, personal PNG and SVG export");
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
