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
 await page.evaluate(()=>location.hash='#session4-m2');await page.waitForTimeout(200);
 const lesson=await page.evaluate(()=>{const x=document.querySelector('#session4-m2 .mml-layer');return {visible:!!x,bodyText:x?.textContent.length,bodyFont:x?getComputedStyle(x).fontSize:null,overflow:document.documentElement.scrollWidth-innerWidth,oldAccordion:!!document.querySelector('#session4-m2 details.mml-legacy')}});
 console.log('MML_WEBKIT '+JSON.stringify({home,lesson,errors}));
 await browser.close();
 assert.equal(home.width,390);
 assert.equal(home.tiles,6);
 assert.equal(home.scrollWidth,390);
 assert.ok(lesson.visible&&lesson.bodyText>80&&lesson.oldAccordion);
 assert.ok(lesson.overflow<=0);
 assert.equal(errors.length,0);
})().catch(e=>{console.error(e);process.exit(1)});
