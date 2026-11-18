/* Read-only browser evidence for Behparvar's complete learning app.
 * Dedicated audit PR only. Never writes participant answers or published content.
 */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const BASE = process.env.BEHPARVAR_URL || 'http://127.0.0.1:4173/';
const OUT = path.resolve(__dirname, '..', 'artifacts', 'behparvar-full-audit');
fs.mkdirSync(OUT, { recursive: true });

const VIEWS = [
  { id: 'welcome', label: 'home' },
  { id: 'course', label: 'course-catalogue' },
  { id: 'home', label: 'session-1' },
  { id: 'session2', label: 'session-2' },
  { id: 'session5', label: 'session-5' },
  { id: 'session6', label: 'session-6' },
  { id: 'competencies', label: 'competency-model' }
];
async function metrics(page) {
 return page.evaluate(() => {
  const viewport = { width: innerWidth, height: innerHeight };
  const visible = el => {
   const r = el.getBoundingClientRect(), css = getComputedStyle(el);
   return css.display !== 'none' && css.visibility !== 'hidden' &&
     r.width > 0 && r.height > 0;
  };
  const el = document.querySelector('.view.active');
  const main = document.getElementById('main');
  const actions = [...document.querySelectorAll('button, a, summary')]
    .filter(x => visible(x) && (() => {const r=x.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight})());
  const brokenImages = [...document.images]
    .filter(x => visible(x) && x.complete && x.naturalWidth === 0)
    .map(x => x.getAttribute('src')).slice(0,10);
  const obstructions = [...document.querySelectorAll('header, nav, footer, .bp-studio-nav, .bp-cross-nav')]
    .filter(visible).map(x=>{
      const r=x.getBoundingClientRect();
      return {element:x.tagName.toLowerCase(),className:String(x.className).slice(0,90),
        height:Math.round(r.height),top:Math.round(r.top),bottom:Math.round(r.bottom)};
    }).filter(x=>x.top<innerHeight&&x.bottom>0).slice(0,15);
  return {
   route: location.hash,
   activeView: el?.id || null,
   title: el?.querySelector('h1,h2')?.innerText?.slice(0,110) || null,
   horizontalOverflowPx: Math.max(0,document.documentElement.scrollWidth-document.documentElement.clientWidth),
   bodyOverflowPx: Math.max(0,document.body.scrollWidth-document.documentElement.clientWidth),
   visibleActionsAboveFold: actions.length,
   firstFoldActions:actions.slice(0,12).map(x=>x.innerText.trim().replace(/\s+/g,' ').slice(0,65)),
   visibleImagesBroken:brokenImages,
   fontFamily:getComputedStyle(main||document.body).fontFamily,
   fontFaceLoaded: document.fonts.check('18px Vazirmatn'),
   nav:obstructions,
   viewport
  };
 });
}
async function capturePage(browser, device, vp) {
 const context = await browser.newContext({
  viewport:vp,deviceScaleFactor:1,reducedMotion:'reduce',
  isMobile:device==='mobile',hasTouch:device==='mobile'
 });
 const page = await context.newPage();
 page.setDefaultTimeout(14000);
 const jsErrors=[], failedRequests=[], badResponses=[];
 page.on('pageerror',e=>jsErrors.push(e.message));
 page.on('requestfailed',r=>failedRequests.push({url:r.url(),failure:r.failure()?.errorText}));
 page.on('response',r=>{if(r.status()>=400)badResponses.push({url:r.url(),code:r.status()})});
 const records=[];
 for(const view of VIEWS) {
   const url=BASE+'#'+view.id;
   try {
    const r=await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
    await page.waitForLoadState('networkidle',{timeout:18000}).catch(()=>{});
    await page.waitForTimeout(450);
    const active=page.locator('.view.active');
    await active.waitFor({state:'visible',timeout:10000});
    const item=await metrics(page);
    item.requested=view.id;
    item.httpStatus=r?.status()||null;
    records.push(item);
    await page.screenshot({path:path.join(OUT,device+'-'+view.label+'.png'),animations:'disabled',fullPage:false});
    if(['welcome','course','session2'].includes(view.id))
      await page.screenshot({path:path.join(OUT,device+'-'+view.label+'-full.png'),animations:'disabled',fullPage:true});
   } catch(e) {
    records.push({requested:view.id,error:String(e)});
    try {await page.screenshot({path:path.join(OUT,device+'-'+view.label+'-ERROR.png')})} catch(_e) {}
   }
 }
 const third=await context.newPage();
 third.on('pageerror',e=>jsErrors.push('session3: '+e.message));
 try {
  const r=await third.goto(BASE+'session3-self-assessment.html',{waitUntil:'domcontentloaded',timeout:30000});
  await third.waitForTimeout(650);
  await third.screenshot({path:path.join(OUT,device+'-session-3.png'),animations:'disabled',fullPage:false});
  records.push({requested:'session-3',httpStatus:r?.status(),title:await third.title(),
    horizontalOverflowPx:await third.evaluate(()=>Math.max(0,document.documentElement.scrollWidth-document.documentElement.clientWidth)),
    heading:(await third.locator('h1,h2').allInnerTexts()).slice(0,7)});
 }catch(e){records.push({requested:'session-3',error:String(e)})}
 await context.close();
 return {device,viewport:vp,records,jsErrors,failedRequests:failedRequests.slice(0,25),
   badResponses:badResponses.slice(0,25)};
}
async function main() {
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try {
  const result=[];
  for(const [device,vp] of [['desktop',{width:1366,height:768}],['mobile',{width:390,height:844}]])
    result.push(await capturePage(browser,device,vp));
  fs.writeFileSync(path.join(OUT,'full-app-audit.json'),JSON.stringify(result,null,2));
  console.log('FULL APP EVIDENCE REPORT\n'+JSON.stringify(result,null,2));
  const bad=result.flatMap(x=>x.records.filter(y=>y.error||y.activeView&&y.activeView!==y.requested));
  const js=result.flatMap(x=>x.jsErrors);
  if(bad.length||js.length){
    console.error('AUDIT FINDINGS: '+bad.length+' routes with errors/mismatches; '+js.length+' page errors');
    process.exitCode=1;
  }
 } finally {await browser.close()}
}
main().then(captureMarketingJpgs).catch(err=>{console.error('AUDIT HARNESS FAILED',err);process.exitCode=1});

// Read-only marketing evidence: 10 original app screenshots exported as JPEG.
// All captures come from actual HTML routes. No generated or altered app UIs.
async function captureMarketingJpgs() {
 const targets = [
  ['01-original-app','index.html#course',0],
  ['02-communication-training','session4-communication-journey.html',0],
  ['03-training-ten-stages','session4-communication-journey.html',780],
  ['04-personality-preferences','session4-mbti.html',0],
  ['05-real-assessment-items','session4-mbti.html',880],
  ['06-competitive-journey','session5-communication-journey.html',0],
  ['07-scoring-system','session5-communication-journey.html',720],
  ['08-recognition-badges','session5-communication-journey.html',1510],
  ['09-facilitator-mode','session5-facilitator.html',0],
  ['10-business-results-path','session6-business-results.html',0]
 ];
 const dir=path.join(OUT,'original-app-jpg');
 fs.mkdirSync(dir,{recursive:true});
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:540,height:675},deviceScaleFactor:2,isMobile:true,hasTouch:true,reducedMotion:'reduce'});
 const findings=[];
 try{
  for(let i=0;i<targets.length;i++){
   const [name,route,scroll]=targets[i];
   const page=await context.newPage();
   try{
    const res=await page.goto(BASE+route,{waitUntil:'domcontentloaded',timeout:30000});
    await page.waitForTimeout(1000);
    await page.evaluate(async y=>{await document.fonts.ready;window.scrollTo(0,y);},scroll);
    await page.waitForTimeout(400);
    await page.screenshot({path:path.join(dir,name+'.jpg'),type:'jpeg',quality:93,animations:'disabled'});
    findings.push({name,route,requestedScroll:scroll,actualScroll:await page.evaluate(()=>scrollY),httpStatus:res?.status()});
   }catch(e){findings.push({name,route,error:String(e)});}
   finally{await page.close();}
  }
  fs.writeFileSync(path.join(dir,'source-manifest.json'),JSON.stringify(findings,null,2));
  // Preserve read-only source snapshot so the final JPEG album can use deeper
  // original UI states without re-creating or inventing any screens.
  const {spawnSync}=require('node:child_process');
  const tar=spawnSync('tar',['--exclude=.git','--exclude=node_modules','--exclude=artifacts','-czf',path.join(OUT,'behparvar-source-snapshot.tar.gz'),'-C',path.resolve(__dirname,'..'),'.'],{encoding:'utf8'});
  if(tar.status!==0)console.error('Source archive warning',tar.stderr);

  console.log('Marketing source JPGs captured',findings);
 }finally{await context.close();await browser.close();}
}
