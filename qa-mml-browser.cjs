/* Read-only Chromium UI smoke test for My Management Lab.
   Run in CI with Playwright. Tests mobile homepage, session navigation, 3 learning modes, RTL.
   Does not submit answers, reset learning data, or write app state. */
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
 await page.waitForSelector("#course .course-session.mml-course-tile",{timeout:20000});
 await measure("mobile landing: 6 course cards",async()=>assert.equal(await page.locator("#course .course-session.mml-course-tile").count(),6));
 await measure("mobile RTL and guided learning cycle",async()=>{
  assert.equal(await page.locator("html").getAttribute("dir"),"rtl");
  assert.equal(await page.locator("#course .mml-study-guide .mml-study-step").count(),3);
  assert.ok(await page.locator("#course .mml-session-area").isVisible());
 });
 await page.screenshot({path:path.join(artifact,"mobile-home-390.png"),fullPage:true});
 await measure("session four route",async()=>{
  await page.locator('#course .course-session[data-course-session="4"]').click();
  await page.waitForSelector("#session4.view.active",{timeout:10000});
 });
 await measure("managers route and seven-part learning",async()=>{
  await page.locator('#session4 [data-session-audience="managers"]').click();
  await page.waitForSelector("#session4-m1.view.active",{timeout:10000});
  assert.equal(await page.locator("#session4-m1 .mml-mode-controls button").count(),3);
 });
 await measure("lesson table and figure visible",async()=>{
  const lesson=page.locator("#session4-m1 .mml-edu-panel");
  await lesson.locator(".mml-edu-lesson h3").waitFor({state:"visible"});
  assert.ok(await lesson.locator("table").isVisible());
  assert.ok(await lesson.locator(".mml-edu-figure").isVisible());
 });
 await page.screenshot({path:path.join(artifact,"mobile-session4-lesson.png"),fullPage:true});
 await measure("mode switching without replacing original training",async()=>{
  await page.locator('#session4-m1 [data-mode="main"]').click();
  assert.ok(await page.locator("#session4-m1 .mml-legacy").isVisible());
  assert.ok(!await page.locator("#session4-m1 .mml-edu-panel").isVisible());
  await page.locator('#session4-m1 [data-mode="guided"]').click();
  assert.ok(await page.locator("#session4-m1 .mml-layer").isVisible());
  await page.locator('#session4-m1 [data-mode="lesson"]').click();
  assert.ok(await page.locator("#session4-m1 .mml-edu-panel").isVisible());
 });
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
