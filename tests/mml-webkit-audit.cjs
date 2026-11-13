/* WebKit Linux rendering parity check — not a test on a physical iPhone or iOS Safari. */
const {webkit}=require('playwright');const assert=require('node:assert/strict');
(async()=>{
 const browser=await webkit.launch({headless:true});
 const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true,locale:'fa-IR'});
 const page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const base=process.env.AUDIT_URL||'http://127.0.0.1:8765/';
 await page.goto(base+'?audience=managers#course',{waitUntil:'domcontentloaded'});
 await page.waitForTimeout(350);
 const home=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,scrollY,homeVisible:!!document.querySelector('.mml-hub h1'),tiles:document.querySelectorAll('#course [data-course-session]').length}));
 // Session 4 now has an official independent workshop; do not hash-navigate
 // to a removed legacy #session4-m2 route (which deliberately redirects).
 await page.goto(new URL('session4-communication-journey.html',base).href,{waitUntil:'domcontentloaded'});
 await page.locator('#root .cover-surface').waitFor({state:'visible'});
 const lesson=await page.evaluate(()=>{
  const x=document.querySelector('#root'),intro=document.querySelector('#root .cover-surface');
  const c=document.querySelector('#root .card');
  return {visible:!!intro&&getComputedStyle(intro).display!=='none',
   bodyText:x?.textContent.length,bodyFont:c?getComputedStyle(c).fontSize:null,
   overflow:document.documentElement.scrollWidth-innerWidth,
   badgeGallery:!!document.querySelector('#sfMedalGallery'),
   clock:!!document.querySelector('#clock')};
 });
 console.log('MML_WEBKIT '+JSON.stringify({home,lesson,errors}));
 await browser.close();
 assert.equal(home.width,390);
 assert.equal(home.tiles,6);
 assert.equal(home.scrollWidth,390);
 assert.ok(lesson.visible&&lesson.bodyText>80&&lesson.badgeGallery&&lesson.clock);
 assert.ok(parseFloat(lesson.bodyFont)>=16);
 assert.ok(lesson.overflow<=0);
 assert.equal(errors.length,0);
})().catch(e=>{console.error(e);process.exit(1)});
