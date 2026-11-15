"use strict";
/* Read-only Chromium smoke across Behparvar entrypoints at 320/390/1440px. */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const http=require("node:http");
const {chromium}=require("playwright");
const ROOT=path.resolve(__dirname,"..");
const OUT=path.join(ROOT,"qa-artifacts","mobile-first-20261115");
fs.mkdirSync(OUT,{recursive:true});
const mime={".html":"text/html; charset=utf-8",".js":"application/javascript; charset=utf-8",
 ".css":"text/css; charset=utf-8",".svg":"image/svg+xml",".webp":"image/webp",
 ".woff2":"font/woff2",".png":"image/png",".json":"application/json"};
const server=http.createServer((request,response)=>{
 try{
  const u=new URL(request.url,"http://127.0.0.1");
  const target=path.resolve(ROOT,"."+decodeURIComponent(u.pathname));
  if(!target.startsWith(ROOT+path.sep)){response.writeHead(403);response.end();return;}
  fs.readFile(target,(e,data)=>{
   if(e){response.writeHead(404);response.end("Not found");return;}
   response.writeHead(200,{"Content-Type":mime[path.extname(target)]||"application/octet-stream"});
   response.end(data);
  });
 }catch(e){response.writeHead(500);response.end(String(e));}
});
async function main(){
 await new Promise(ok=>server.listen(0,"127.0.0.1",ok));
 const browser=await chromium.launch({headless:true});
 try{
  for(const width of [320,390,1440]){
   const page=await browser.newPage({viewport:{width,height:width===1440?900:844},deviceScaleFactor:1});
   try{
    const origin="http://127.0.0.1:"+server.address().port+"/";
    await page.goto(origin+"index.html",{waitUntil:"domcontentloaded"});
    await page.locator('link[href*="bp-mobile-first-ux-20261115.css"]').waitFor({state:"attached"});
    const home=page.locator(".bp-welcome-grid");
    await home.waitFor({state:"attached"});
    if(width<=390){
     const cols=await home.evaluate(e=>getComputedStyle(e).gridTemplateColumns.split(" ").length);
     assert.equal(cols,1,"Home must be a single-column mobile menu");
     assert.equal(await page.locator(".bp-welcome-tile").count(),5,"Five existing learning paths");
    }
    const metrics=await page.evaluate(()=>({
     overflow:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-innerWidth,
     lang:document.documentElement.lang,dir:document.documentElement.dir
    }));
    assert.equal(metrics.dir,"rtl");
    assert.ok(metrics.overflow<=5,"Home overflows by "+metrics.overflow+"px on "+width);
    await page.screenshot({path:path.join(OUT,"home-"+width+".png"),fullPage:true});
    await page.goto(origin+"session4-communication-journey.html",{waitUntil:"domcontentloaded"});
    await page.locator("#root").waitFor({state:"attached"});
    await page.waitForTimeout(200);
    assert.equal(await page.locator('link[href*="bp-mobile-first-ux-20261115.css"]').count(),1);
    assert.equal(await page.locator("#clock").count(),1,"Journey timer exists");
    assert.equal(await page.locator("#root .cover-surface").count(),1,"Journey original poster remains");
    const overflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-innerWidth);
    assert.ok(overflow<=5,"Journey overflows by "+overflow+"px on "+width);
    await page.screenshot({path:path.join(OUT,"journey-"+width+".png"),fullPage:true});
    console.log("PASS",width,"Behparvar mobile home and journey",metrics);
   }finally{await page.close();}
  }
 }finally{await browser.close();server.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;server.close();});
