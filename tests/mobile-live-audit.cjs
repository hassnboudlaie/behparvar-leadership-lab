const { chromium, devices } = require('playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
(async()=>{
 const base=process.env.AUDIT_URL||"http://127.0.0.1:8765/";
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 let report={base,at:new Date().toISOString(),runs:[],manifest:{},checks:[],errors:[]};
 const sessions=["m1","m2","leaders","techniques","visuals","diseases","quiz"];
 const paths=[1,2,5,6].flatMap(n=>sessions.map(p=>n===1?p:'session'+n+'-'+p)); // Sessions 3/4 have canonical standalone workshops
 const configs=[
   {name:'android-a55',width:393,height:873,isMobile:true,deviceScaleFactor:2.75,hasTouch:true},
   {name:'iphone-13-simulated-chromium',width:390,height:844,isMobile:true,deviceScaleFactor:3,hasTouch:true},
   {name:'small-android',width:360,height:740,isMobile:true,deviceScaleFactor:2.6,hasTouch:true},
   {name:'tablet',width:768,height:1024,isMobile:true,deviceScaleFactor:2,hasTouch:true},
   {name:'desktop',width:1440,height:900,isMobile:false,deviceScaleFactor:1,hasTouch:false}
 ];
 for(const cfg of configs){
   const context=await browser.newContext({viewport:{width:cfg.width,height:cfg.height},isMobile:cfg.isMobile,deviceScaleFactor:cfg.deviceScaleFactor,hasTouch:cfg.hasTouch,locale:'fa-IR',colorScheme:'light'});
   const page=await context.newPage();
   const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('console',e=>{if(e.type()==='error')errors.push('console '+e.text())});
   const url=new URL(base);url.searchParams.set('audience','supervisors');url.hash='';
   const response=await page.goto(url.toString(),{waitUntil:'domcontentloaded',timeout:50000});
   await page.waitForTimeout(900);
   const metrics=await page.evaluate(()=>{
     const visible=e=>{let r=e.getBoundingClientRect(),st=getComputedStyle(e);return r.width>0&&r.height>0&&st.visibility!=='hidden'&&st.display!=='none'&&r.bottom>0&&r.top<innerHeight};
     const info=e=>({text:e.textContent.trim().slice(0,75),font:getComputedStyle(e).fontSize,line:getComputedStyle(e).lineHeight,rect:{left:Math.round(e.getBoundingClientRect().left),right:Math.round(e.getBoundingClientRect().right),top:Math.round(e.getBoundingClientRect().top)},targetHeight:Math.round(e.getBoundingClientRect().height)});
     const els=[...document.querySelectorAll('.mml-hub h1,.mml-reader-heading h2,.mml-align-main p,.mml-align-options button,.course-session strong,.course-session small')].filter(visible);
     const missingImages=[...document.querySelectorAll('img')].filter(x=>visible(x)&&!x.complete||visible(x)&&x.naturalWidth===0).map(x=>x.src.slice(-100));
     const smallButtons=[...document.querySelectorAll('button,a,select,summary')].filter(visible).filter(x=>x.getBoundingClientRect().height<44).slice(0,20).map(info);
     return {viewport:{w:innerWidth,h:innerHeight},scrollY:Math.round(scrollY),scrollWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,overflow:Math.max(0,document.documentElement.scrollWidth-innerWidth),fonts:els.slice(0,26).map(info),smallButtons,missingImages,role:document.querySelector('.mml-role-picker button[aria-pressed="true"]')?.textContent.trim(),zones:[...document.querySelectorAll('.mml-zone b')].map(x=>x.textContent.trim()),sessionTiles:[...document.querySelectorAll('#course [data-course-session]')].length};
   });
   await page.screenshot({path:'audit-'+cfg.name+'-home.jpg',type:'jpeg',quality:70});
   if(cfg.name==='android-a55')console.log('MML_SCREENSHOT_HOME='+fs.readFileSync('audit-'+cfg.name+'-home.jpg').toString('base64'));
   let routeCount=0,missingRoutes=[],routeFont=[],routeErrors=[];
   for(let i=0;i<paths.length;i++){
     await page.evaluate(route=>{location.hash='#'+route},paths[i]);
     await page.waitForTimeout(28);
     const check=await page.evaluate(route=>{
       let el=document.getElementById(route);let root=el?.querySelector('.mml-align-main');
       let active=el?.classList.contains('active');let title=el?.querySelector('.mml-reader-heading h2')?.textContent.trim();
       return {active,hasLayer:!!root,title,bodyChars:root?.textContent.trim().length||0,font:root?.querySelector('p')?getComputedStyle(root.querySelector('p')).fontSize:null,overflow:Math.max(0,document.documentElement.scrollWidth-innerWidth)};
     },paths[i]);
     if(check.hasLayer&&check.active&&check.bodyChars>40)routeCount++;else missingRoutes.push({route:paths[i],...check});
     if(i===7){routeFont.push({route:paths[i],...check});await page.screenshot({path:'audit-'+cfg.name+'-lesson.jpg',type:'jpeg',quality:70});
       if(cfg.name==='android-a55')console.log('MML_SCREENSHOT_LESSON='+fs.readFileSync('audit-'+cfg.name+'-lesson.jpg').toString('base64'));}
   }
   // Verify the canonical independent workspaces that replaced obsolete
   // Session 3/4 hash routes; evaluate real pages rather than old placeholders.
   const standalone={};
   for(const [key,file,required] of [
     ['session3','session3-self-assessment.html','#selfApp'],
     ['session4','session4-communication-journey.html','#root .cover-surface']]){
     await page.goto(new URL(file,base).href,{waitUntil:'domcontentloaded'});
     await page.locator(required).waitFor({state:'visible',timeout:15000});
     standalone[key]=await page.evaluate(sel=>({
       visible:!!document.querySelector(sel),
       overflow:Math.max(0,document.documentElement.scrollWidth-innerWidth)
     }),required);
   }
   await page.goto(url.toString(),{waitUntil:'domcontentloaded'});
   await page.waitForTimeout(200);
   await page.evaluate(()=>{location.hash='#session2-visuals'});
   await page.waitForTimeout(160);
   const practice=await page.evaluate(()=>({
      alignedVisible:!!document.querySelector('#session2-visuals .mml-align-main'),
      tableRows:document.querySelectorAll('#session2-visuals .mml-align-main tbody tr').length
   }));
   await page.evaluate(()=>{location.hash='#session2-quiz'});
   await page.waitForTimeout(180);
   const answers=page.locator('#session2-quiz .mml-align-options button');
   await answers.nth(1).click();
   practice.feedbackAfter=await page.locator('#session2-quiz .mml-align-feedback li').count();
   const textarea=page.locator('#session2-quiz [data-mml-align-note="2:quiz:supervisors"]');
   await textarea.fill('QA mobile saved plan');
   await page.reload({waitUntil:'domcontentloaded'});
   await page.waitForTimeout(350);
   const persisted=await page.locator('#session2-quiz [data-mml-align-note="2:quiz:supervisors"]').inputValue().catch(()=>null);
   // Check that the responsive role switch produces different manager content.
   const managerURL=new URL(base);managerURL.searchParams.set('audience','managers');managerURL.hash='session2-m1';
   await page.goto(managerURL.toString(),{waitUntil:'domcontentloaded'});await page.waitForTimeout(150);
   const managerContent=await page.locator('#session2-m1 .mml-align-main').textContent();
   const managerDistinct=managerContent.includes('مدیر')&&managerContent.includes('شاخص')||managerContent.includes('داده')||managerContent.includes('واحد');
   // Service Worker should support return visits when the network drops.
   let offline={tested:false};
   try{
     await page.evaluate(()=>navigator.serviceWorker.ready);
     await context.setOffline(true);
     await page.reload({waitUntil:'domcontentloaded',timeout:20000});
     await page.waitForTimeout(120);
     offline={tested:true,appShell:await page.locator('.masthead').count()>0,lesson:await page.locator('#session2-m1 .mml-align-main').count()>0,origin:page.url()};
   }catch(e){offline={tested:true,error:String(e)}}finally{await context.setOffline(false)}
   const manifest=await page.evaluate(async()=>{const a=document.querySelector('link[rel="manifest"]');if(!a)return null;let r=await fetch(a.href);return {href:a.href,status:r.status,manifest:await r.json().catch(()=>null),serviceWorker:'serviceWorker' in navigator,controller:!!navigator.serviceWorker.controller,displayStandalone:matchMedia('(display-mode:standalone)').matches}});
   const run={name:cfg.name,http:response?.status(),...metrics,routeCount,missingRoutes,routeFont,standalone,practice,persisted,managerDistinct,offline,manifest:{status:manifest?.status,href:manifest?.href,serviceWorker:manifest?.serviceWorker,controller:manifest?.controller,displayStandalone:manifest?.displayStandalone},errors};
   report.runs.push(run);
   if(cfg.name==='android-a55')report.manifest=manifest;
   console.log('MML_RUN_REPORT '+JSON.stringify({...run,fonts:run.fonts.slice(0,9),smallButtons:run.smallButtons.slice(0,8),errors:run.errors.slice(0,12)}));
   await context.close();
 }
 const context=await browser.newContext();
 const page=await context.newPage();
 await page.goto(base,{waitUntil:'load'});
 await page.waitForTimeout(800);
 try{
   const session=await context.newCDPSession(page);
   report.installability={manifest:await session.send('Page.getAppManifest'),errors:await session.send('Page.getInstallabilityErrors')};
 }catch(e){report.installabilityError=String(e)}
 await context.close();await browser.close();
 fs.writeFileSync('mml-audit-report.json',JSON.stringify(report,null,2));
 console.log('MML_SUMMARY '+JSON.stringify({configs:report.runs.length,routes:report.runs.map(r=>r.routeCount),horizontalOverflow:report.runs.map(r=>r.overflow),errors:report.runs.map(r=>r.errors.length),persisted:report.runs.map(r=>r.persisted),installabilityErrors:report.installability?.errors||report.installabilityError}));
 const failed=report.runs.some(r=>r.routeCount!==28||r.overflow>8||r.errors.length>0||r.persisted!=='QA mobile saved plan'||!r.managerDistinct||!r.offline?.appShell||(!r.practice?.alignedVisible)||r.practice?.feedbackAfter!==3||!r.standalone?.session3?.visible||!r.standalone?.session4?.visible||r.standalone.session3.overflow>8||r.standalone.session4.overflow>8);
 if(failed){console.error('FAIL: mobile audit functional or layout thresholds exceeded');process.exitCode=1;}
})();