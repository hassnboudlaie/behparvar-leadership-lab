/* Behparvar canonical app — browser acceptance and visual evidence.
 * Covers current route architecture: 6-session directory, real standalone
 * Sessions 3/4, Teamship, competency map and mobile navigation.
 * Never modifies assessment answers or production data.
 */
"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs"),path=require("node:path");
const {chromium}=require("playwright");
const base=process.env.AUDIT_URL||"http://127.0.0.1:8765/";
const artifact=path.join(process.cwd(),"qa-screenshots");
fs.mkdirSync(artifact,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
 const reports=[];
 try{
  for(const cfg of [
   {name:"mobile-390",width:390,height:844,isMobile:true,hasTouch:true},
   {name:"desktop-1366",width:1366,height:900,isMobile:false,hasTouch:false}
  ]){
   const context=await browser.newContext({viewport:{width:cfg.width,height:cfg.height},isMobile:cfg.isMobile,hasTouch:cfg.hasTouch,locale:"fa-IR"});
   const page=await context.newPage(),errors=[];
   page.on("pageerror",error=>errors.push(error.message));
   const main=new URL(base);main.searchParams.set("audience","supervisors");
   const checkOverflow=async(label)=>{
    const bounds=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
    assert.ok(bounds.scroll<=bounds.width+8,label+" overflow: "+JSON.stringify(bounds));
   };
   await page.goto(main.href,{waitUntil:"domcontentloaded",timeout:50000});
   await page.locator("#welcome.view.active").waitFor({timeout:20000});
   await page.locator("#bpStudioNav").waitFor();
   assert.equal(await page.locator('#welcome .bp-welcome-tile').count(),5);
   assert.equal(await page.locator('#bpStudioNav .bp-studio-link').count(),5);
   assert.ok(await page.locator('#welcome .bp-welcome-hero').isVisible());
   assert.ok(await page.locator('#welcome #bp-install-action').isVisible());
   await checkOverflow(cfg.name+" home");
   await page.screenshot({path:path.join(artifact,cfg.name+"-welcome.png"),fullPage:true});
   const position=await page.locator("#bpStudioNav").evaluate(el=>getComputedStyle(el).position);
   assert.equal(position,cfg.isMobile?"fixed":"sticky");
   await page.locator('[data-bp-nav="competencies"]').click();
   await page.locator("#competencies.view.active").waitFor();
   assert.equal(await page.locator('#competencies .bp-model-step').count(),3);
   assert.ok(await page.locator("#bp-global-home").isVisible());
   assert.equal(await page.locator("#bp-global-home").evaluate(el=>getComputedStyle(el).position),"static");
   await checkOverflow(cfg.name+" competency");
   await page.screenshot({path:path.join(artifact,cfg.name+"-competencies.png"),fullPage:true});
   await page.locator('[data-bp-nav="course"]').click();
   await page.locator("#course.view.active").waitFor();
   assert.equal(await page.locator('#course [data-course-session]').count(),6);
   await checkOverflow(cfg.name+" sessions");
   await page.screenshot({path:path.join(artifact,cfg.name+"-sessions.png"),fullPage:true});
   await page.locator('#course .course-session[data-course-session="3"]').click();
   await page.locator("#selfApp").waitFor();
   assert.equal(await page.locator('[data-self-role]').count(),2);
   await checkOverflow(cfg.name+" self");
   await page.screenshot({path:path.join(artifact,cfg.name+"-self-assessment.png"),fullPage:false});
   await page.locator('#selfApp .bp-book-entry-action').click();
   await page.locator("#overview").waitFor();
   assert.equal(await page.locator("#tiles").count(),1);
   await checkOverflow(cfg.name+" Teamship");
   await page.screenshot({path:path.join(artifact,cfg.name+"-teamship.png"),fullPage:false});
   await page.goto(new URL("session3-teamship-assessment.html",base).href,{waitUntil:"domcontentloaded"});
   await page.locator("#scales").waitFor();
   assert.ok(await page.locator('input[type="range"]').count()>=10);
   await checkOverflow(cfg.name+" Teamship assessment");
   await page.screenshot({path:path.join(artifact,cfg.name+"-teamship-assessment.png"),fullPage:false});
   await page.goto(new URL("session4-communication-journey.html",base).href,{waitUntil:"domcontentloaded"});
   await page.locator("#root .cover-surface").waitFor();
   await page.locator("#sfMedalGallery").waitFor();
   assert.equal(await page.locator("#sfMedalGallery .sf-medal-mini").count(),3);
   assert.ok(await page.locator("#clock").isVisible());
   await checkOverflow(cfg.name+" communication");
   await page.screenshot({path:path.join(artifact,cfg.name+"-session4.png"),fullPage:false});
   assert.deepEqual(errors,[],cfg.name+" browser errors");
   reports.push({viewport:cfg.name,homeCards:5,sessions:6,standalone:["session3","teamship","teamship-assessment","session4"],errors:errors.length});
   await context.close();
  }
  fs.writeFileSync(path.join(artifact,"browser-qa-report.json"),JSON.stringify(reports,null,2));
  console.log("PASS: canonical Behparvar mobile/desktop UX, responsive navigation, 6 sessions, 5 home cards, competencies, Sessions 3/4 and Teamship");
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
