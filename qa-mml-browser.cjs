/* Isolated beginner-first mobile Chromium UI QA for My Management Lab.
   Run in CI with Playwright. Tests mobile homepage, session navigation, 3 learning modes, RTL.
   Uses a fresh local-only browser profile; test quiz choices write only to that profile. */
"use strict";
const fs=require("node:fs"),path=require("node:path"),http=require("node:http"),assert=require("node:assert/strict");
const {chromium}=require("playwright");
const root=__dirname;
const mime={".html":"text/html;charset=utf-8",".js":"application/javascript;charset=utf-8",".css":"text/css;charset=utf-8",".svg":"image/svg+xml",".png":"image/png",".webp":"image/webp",".jpg":"image/jpeg",".json":"application/json",".webmanifest":"application/manifest+json",".woff2":"font/woff2"};
function server(){return http.createServer((req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,"http://localhost").pathname);
  const filename=path.resolve(root,"."+pathname,(pathname.endsWith("/")||pathname==="/")?"index.html":"");
  if(!filename.startsWith(root+path.sep)&&filename!==root){res.writeHead(403);res.end();return}
  fs.readFile(filename,(err,bytes)=>{
   if(err){res.writeHead(404);res.end("Missing "+pathname);return}
   res.writeHead(200,{"Content-Type":mime[path.extname(filename)]||"application/octet-stream","Cache-Control":"no-store"});res.end(bytes);
  });
})}
const artifact=path.join(root,"qa-screenshots");fs.mkdirSync(artifact,{recursive:true});
async function run(){
 const app=server();await new Promise(r=>app.listen(0,"127.0.0.1",r));
 const base="http://127.0.0.1:"+app.address().port+"/";
 const browser=await chromium.launch({headless:true});
 const errors=[],results=[];
 async function measure(name,cb){await cb();results.push(name);console.log("PASS "+name)}
 try{
 const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});
 const page=await mobile.newPage();
 page.on("pageerror",err=>errors.push(err.message));
 await page.goto(base,{waitUntil:"load"});
 await page.waitForSelector("#welcome.view.active",{timeout:20000});
 await measure("clean default welcome with five clickable destinations",async()=>{
  assert.equal(await page.locator("#welcome .bp-welcome-tile").count(),5);
  assert.ok(await page.locator("#welcome .bp-welcome-hero").isVisible());
  assert.ok(!await page.locator("#course").isVisible());
  assert.ok(!await page.locator("#workshopSidebar").isVisible());
 });
 await page.screenshot({path:path.join(artifact,"mobile-welcome-390.png"),fullPage:true});
 await page.locator('#welcome .bp-welcome-tile[data-open="competencies"]').click();
 await page.waitForSelector("#competencies.view.active");
 await measure("welcome competency route shows three domains",async()=>{
  assert.equal(await page.locator("#competencies #bp-competency-map .bp-domain-card").count(),3);
  assert.ok(await page.locator("#competencies .bp-domain-grid").isVisible());
 });
 await page.locator('#competencies .bp-inner-top [data-open="welcome"]').click();
 await page.waitForSelector("#welcome.view.active");
 await page.locator('#welcome .bp-welcome-tile[data-open="course"]').click();
 await page.waitForSelector("#course.view.active");
 await page.waitForSelector("#course .course-session.mml-course-tile",{timeout:20000});
 await measure("mobile landing: 6 course cards",async()=>assert.equal(await page.locator("#course .course-session.mml-course-tile").count(),6));
 await measure("three visible competency domains and six emoji session markers",async()=>{
  const domains=page.locator("#course .bp-domain-card");
  assert.equal(await domains.count(),3);
  assert.deepEqual(await domains.locator(".bp-domain-name").allTextContents(),["خودم","دیگران","نتایج کسب‌وکار"]);
  assert.equal(await page.locator("#course .bp-course-emoji").count(),6);
  assert.ok(await page.locator("#course .bp-map-title").isVisible());
 });
 await measure("competency card expands four people skills and links to learning",async()=>{
  const others=page.locator('[data-bp-domain="others"]');
  await others.click();
  assert.equal(await others.getAttribute("aria-expanded"),"true");
  assert.ok(await page.locator("#bp-domain-details").isVisible());
  assert.equal(await page.locator("#bp-domain-details .bp-skill").count(),4);
  assert.equal(await page.locator('#bp-domain-details .bp-skill-link[href="#session4"]').count(),2);
  assert.equal(await page.locator('#bp-domain-details .bp-skill-link[href="#session5"]').count(),2);
  await others.click();
  assert.equal(await others.getAttribute("aria-expanded"),"false");
  assert.ok(!await page.locator("#bp-domain-details").isVisible());
 });
 await measure("mobile RTL, concise course home and no extra toolbar",async()=>{
  assert.equal(await page.locator("html").getAttribute("dir"),"rtl");
  assert.equal(await page.locator("#course .mml-study-guide").count(),0);
  assert.equal(await page.locator(".mml-toolbar").count(),0);
  assert.equal(await page.locator("#course .mml-more").count(),0);
  assert.ok(await page.locator("#course .mml-session-area").isVisible());
 });
 await measure("empty progress indicators are absent",async()=>assert.equal(await page.locator("#course .mml-course-progress").count(),0));
 await page.screenshot({path:path.join(artifact,"mobile-home-390.png"),fullPage:true});
 await measure("session four route",async()=>{
  await page.locator('#course .course-session[data-course-session="4"]').click();
  await page.waitForSelector("#session4.view.active",{timeout:10000});
 });
 await measure("session landing is one purpose and two clear role choices",async()=>{
  const landing=page.locator("#session4 .mml-simple-session-home");
  assert.ok(await landing.isVisible());
  await page.waitForFunction(()=>document.body.classList.contains("mml-session-entry-screen"));
  assert.ok(!await page.locator("#sidebarMobileBar").isVisible());
  assert.equal(await landing.locator("h1").count(),1);
  assert.equal(await landing.locator("[data-session-audience]").count(),2);
  assert.ok(!await page.locator("#session4 .session-audience-picker").isVisible());
 });
 await page.screenshot({path:path.join(artifact,"mobile-session4-entry.png"),fullPage:false});
 await measure("manager route opens one clear main lesson",async()=>{
  await page.locator('#session4 [data-session-audience="managers"]').click();
  await page.waitForSelector("#session4-m1.view.active",{timeout:10000});
  await page.waitForFunction(()=>!document.body.classList.contains("mml-session-entry-screen"));
  assert.equal(await page.locator("#session4-m1 .mml-mode-controls button").count(),0);
  assert.ok(await page.locator("#session4-m1 .mml-aligned-panel").isVisible());
  assert.equal((await page.locator("#session4-m1 .mml-reader-heading h2").textContent()).trim(),"شروع");
  assert.ok(await page.locator("#session4-m1 .mml-reader-navigation .mml-reader-next").isVisible());
 });
 await measure("mobile drawer is uncluttered and keyboard-accessible",async()=>{
  await page.locator("#sidebarToggle").click();
  assert.ok(await page.locator("body").evaluate(el=>el.classList.contains("sidebar-open")));
  const sidebar=page.locator("#workshopSidebar");
  assert.equal(await sidebar.locator(".site-nav a").count(),7);
  assert.equal(await sidebar.locator(".sidebar-link-label").allTextContents().then(x=>x.join("|")),
   "شروع|گفت‌وگوی کاری|نکته مهم|راه‌حل|مقایسه دو روش|اشتباه رایج|آزمون و اقدام");
  assert.ok(await sidebar.locator("#sidebarHome").isVisible());
  assert.ok(await sidebar.locator("#sidebarCourse").isVisible());
  await page.screenshot({path:path.join(artifact,"mobile-sidebar-open-390.png"),fullPage:false});
  await page.locator("#sidebarClose").click();
  assert.ok(!await page.locator("body").evaluate(el=>el.classList.contains("sidebar-open")));
 });

 await measure("mobile text is at least 20 CSS px in core reading and choices",async()=>{
  const size=await page.locator("#session4-m1 .mml-align-main p").first().evaluate(x=>parseFloat(getComputedStyle(x).fontSize));
  assert.ok(size>=20,"Main reading was only "+size+"px");
 });
 await page.screenshot({path:path.join(artifact,"mobile-session4-first-lesson.png"),fullPage:true});
 await measure("deeper reading is optional, not an extra tab",async()=>{
  const more=page.locator("#session4-m1 .mml-reader-more");
  assert.ok(await more.isVisible());
  assert.ok(!await more.locator(".mml-edu-panel").isVisible());
  await more.locator(":scope > summary").click();
  assert.ok(await more.locator(".mml-edu-panel").isVisible());
  assert.ok(await more.locator("table").isVisible());
  await more.locator(":scope > summary").click();
  assert.equal(await page.locator("#session4-m1 .mml-mode-controls").count(),0);
 });
 await measure("role play stays within the same work case",async()=>{
  await page.locator("#session4-m1 .mml-reader-navigation .mml-reader-next").click();
  await page.waitForSelector("#session4-m2.view.active");
  const reader=page.locator("#session4-m2 .mml-aligned-panel");
  assert.ok(await reader.isVisible());
  assert.ok(await reader.getByText("اتفاق تازه").isVisible());
  assert.ok(await reader.getByText("دور دوم", {exact:false}).first().isVisible());
  assert.ok(await reader.locator(".mml-edu-drama li").count()>=5);
  assert.ok(!await page.locator("#session4-m2 .mml-instructor-archive").isVisible());
 });
 await page.screenshot({path:path.join(artifact,"mobile-session4-roleplay.png"),fullPage:false});
 await measure("quiz explains each choice and keeps the answer",async()=>{
  await page.evaluate(()=>document.querySelector('.site-nav [data-open="session4-quiz"]').click());
  await page.waitForSelector("#session4-quiz.view.active");
  const quiz=page.locator("#session4-quiz .mml-align-quiz");
  assert.ok(await quiz.isVisible());
  const optionFont=await quiz.locator(".mml-align-options button").first().evaluate(x=>parseFloat(getComputedStyle(x).fontSize));
  assert.ok(optionFont>=20,"Choices were only "+optionFont+"px");
  await quiz.locator('[data-mml-align-choice="4:0:1:managers"]').click();
  assert.equal(await quiz.locator(".mml-align-feedback li").count(),3);
  assert.equal(await quiz.locator(".mml-align-feedback .is-incorrect").count(),2);
  const explanations=await quiz.locator(".mml-align-feedback li p").allTextContents();
  assert.equal(new Set(explanations).size,3);
  const stored=await page.evaluate(()=>localStorage.getItem("mml_aligned_v1_managers_4"));
  assert.ok(stored&&JSON.parse(stored).answers[0]===1);
 });
 await measure("mobile lesson has visible 30px-class heading and sticker",async()=>{
  const heading=page.locator("#session4-quiz .mml-reader-heading h2");
  assert.ok(await heading.isVisible(),"Lesson title must not be hidden on mobile");
  const size=await heading.evaluate(el=>parseFloat(getComputedStyle(el).fontSize));
  assert.ok(size>=28,"Lesson heading too small: "+size);
  assert.ok(await page.locator("#session4-quiz .bp-lesson-icon").isVisible());
 });
 await page.screenshot({path:path.join(artifact,"mobile-session4-quiz-large-type.png"),fullPage:false});
 await measure("mobile horizontal overflow",async()=>{
  const bounds=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:window.innerWidth}));
  assert.ok(bounds.scroll<=bounds.width+5,JSON.stringify(bounds));
 });
 const desktop=await browser.newContext({viewport:{width:1366,height:900},deviceScaleFactor:1});
 const wide=await desktop.newPage();wide.on("pageerror",err=>errors.push(err.message));
 await wide.goto(base,{waitUntil:"load"});
 await wide.waitForSelector("#course .mml-course-tile");
 await wide.screenshot({path:path.join(artifact,"desktop-home-1366.png"),fullPage:true});
 await measure("desktop 6 course cards",async()=>assert.equal(await wide.locator("#course .mml-course-tile").count(),6));
 assert.equal(errors.length,0,"Browser errors: "+JSON.stringify(errors));
 await mobile.close();await desktop.close();
 }finally{await browser.close();await new Promise(r=>app.close(r))}
 const output={timestamp:new Date().toISOString(),passed:results,errors:errors,notes:"Visual screenshots require manual review; browser smoke is functional only."};
 fs.writeFileSync(path.join(artifact,"report.json"),JSON.stringify(output,null,2));
 console.log("QA screenshots and report created");
}
run().catch(err=>{console.error("FAIL Browser QA: "+(err.stack||err));process.exitCode=1});
