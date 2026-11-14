#!/usr/bin/env node
/* Impeccable final release gate — reproducible axe + browser + PWA review.
 * Automated checks do not replace physical-device and human WCAG evaluation.
 */
"use strict";
const { chromium, webkit } = require("playwright");
const { AxeBuilder } = require("@axe-core/playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const BASE = process.env.AUDIT_URL || "http://127.0.0.1:8765/";
const DIR = path.resolve(__dirname, "../audit-artifacts");
fs.mkdirSync(DIR, { recursive: true });
const report = { version: "2026-11-14-final", at: new Date().toISOString(), base: BASE,
  cases: [], axeFindings: [], failures: [], offline: {}, webkit: {} };
const pages = [
  ["home", "index.html"],
  ["self-development", "session3-self-assessment.html"],
  ["teamship", "session3-teamship.html"],
  ["teamship-assessment", "session3-teamship-assessment.html"],
  ["communication", "session4-communication-journey.html"]
];
const WCAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
function fail(label, detail) { report.failures.push({ label, detail: String(detail) }); }
async function examine(page, id, pathName, scan = true) {
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  try {
    await page.goto(new URL(pathName, BASE).href, { waitUntil: "load", timeout: 45000 });
    await page.waitForTimeout(300);
    const metrics = await page.evaluate(() => {
      const el = document.documentElement;
      const interactive = [...document.querySelectorAll("button,a,summary,input,select")];
      const visible = x => { const b=x.getBoundingClientRect(),s=getComputedStyle(x);
        return b.width>0&&b.height>0&&s.display!=="none"&&s.visibility!=="hidden"; };
      return {
        dir: el.getAttribute("dir"),
        width: innerWidth,
        scrollWidth: el.scrollWidth,
        overflow: el.scrollWidth - el.clientWidth,
        hasMain: !!document.querySelector("main,[role='main']"),
        headings: [...document.querySelectorAll("h1,[role='heading'][aria-level='1']")]
          .filter(visible).map(x=>x.textContent.trim().slice(0,80)),
        visibleButtons: interactive.filter(visible).length,
        undersizedControls: interactive.filter(visible)
          .filter(x=>{const b=x.getBoundingClientRect();return b.height<44||b.width<24;})
          .slice(0,10).map(x=>({text:(x.innerText||x.getAttribute("aria-label")||"").trim().slice(0,38),
            height:Math.round(x.getBoundingClientRect().height)})),
        lcp: performance.getEntriesByType("largest-contentful-paint").at(-1)?.startTime || null,
        cls: performance.getEntriesByType("layout-shift")
          .filter(x=>!x.hadRecentInput).reduce((sum,x)=>sum+x.value,0)
      };
    });
    const row = { id, ...metrics, scriptErrors: errors };
    report.cases.push(row);
    if (metrics.dir !== "rtl") fail(id, "RTL document direction missing");
    if (metrics.overflow > 1) fail(id, "Horizontal overflow: " + metrics.overflow + "px");
    if (!metrics.hasMain) fail(id, "No main landmark");
    if (!metrics.headings.length) fail(id, "No visible level-one heading");
    if (errors.length) fail(id, "JavaScript errors: "+errors.slice(0,3).join(" | "));
    if (scan) {
      const axe = await new AxeBuilder({ page }).withTags(WCAG).analyze();
      for (const v of axe.violations) {
        const finding = { case: id, id: v.id, impact: v.impact,
          help: v.help, count: v.nodes.length,
          nodes: v.nodes.slice(0,5).map(n=>({target:n.target,summary:n.failureSummary?.slice(0,350)})) };
        report.axeFindings.push(finding);
        if (["critical","serious"].includes(v.impact)) {
          fail(id, "axe "+v.id+" ("+v.impact+") x"+v.nodes.length+" at "+v.nodes.slice(0,2).map(n=>n.target.join(" ")).join(", "));
        }
      }
    }
    await page.screenshot({ path: path.join(DIR,id+".png"), fullPage:false });
  } catch(e) { fail(id,"Test exception: "+String(e.stack||e).slice(0,700)); }
}
async function evaluateOffline(browser) {
  const context = await browser.newContext({viewport:{width:390,height:844}, serviceWorkers:"allow"});
  const page = await context.newPage();
  try {
    await page.goto(new URL("index.html",BASE).href,{waitUntil:"load"});
    await page.evaluate(async()=>{ if(!("serviceWorker" in navigator))throw Error("Worker not supported");
      await navigator.serviceWorker.ready;});
    await page.waitForFunction(() => !!navigator.serviceWorker.controller,{timeout:30000});
    const assets = await page.evaluate(async()=>{
      const names=await caches.keys();
      const current=names.find(n=>n.includes("impeccable-final-v60"));
      if(!current)return{names,current:null};
      const c=await caches.open(current);
      const checks=["./index.html","./session3-teamship.html",
        "./session4-communication-journey.html",
        "./assets/bp-impeccable-unified-navigation-20261114.css",
        "./assets/safar-impeccable-accessibility-20261114.js",
        "./assets/bp-pwa-register-20261114.js"];
      const present={};
      for(const p of checks)present[p]=!!(await c.match(p));
      return{names,current,present};
    });
    report.offline.cache=assets;
    assert.ok(assets.current,"Current SW cache absent");
    for(const [item,present] of Object.entries(assets.present)) assert.ok(present,"Uncached "+item);
    await context.setOffline(true);
    for(const p of ["session3-teamship.html","session4-communication-journey.html"]){
      const response=await page.goto(new URL(p,BASE).href,{waitUntil:"domcontentloaded",timeout:20000});
      await page.waitForTimeout(250);
      report.offline[p]={status:response?.status(),text:await page.locator("body").innerText().then(x=>x.length)};
      assert.ok((await page.locator("body").innerText()).length>150,p+" offline body missing");
      assert.ok(await page.locator('script[src*="bp-impeccable-unified-navigation"]').count(),p+" offline navigation absent");
    }
    report.offline.success=true;
  }catch(e){ report.offline.success=false; fail("offline", e.message); }
  finally{ await context.close(); }
}
async function run() {
  const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
  try {
    for(const [id,p] of pages) {
      const context=await browser.newContext({viewport:{width:390,height:844}, locale:"fa-IR",deviceScaleFactor:2});
      const page=await context.newPage();
      await examine(page, id+"-mobile", p);
      if(id==="communication"){
        try{
          await page.locator('[data-role="managers"]').click();
          await page.locator("#sfStartStudy").click();
          await page.waitForTimeout(200);
          await examineState(page,"communication-study");
          await page.locator('button[data-sf-study-step="1"]').first().click();
          assert.match(await page.locator("body").innerText(),/پیشرفت مطالعه:\s*۲۰٪/);
          await page.reload({waitUntil:"load"});
          assert.match(await page.locator("body").innerText(),/پیشرفت مطالعه:\s*۲۰٪/);
        }catch(e){fail("study-flow",e.message);}
      }
      if(id==="teamship"){
        try {await page.locator('[data-route="intro"]').click();await page.waitForTimeout(120);
          await examineState(page,"teamship-detail");}
        catch(e){fail("teamship-detail",e.message);}
      }
      await context.close();
    }
    const desktop=await browser.newContext({viewport:{width:1366,height:900},locale:"fa-IR"});
    const desk=await desktop.newPage();
    await examine(desk,"home-desktop","index.html");
    await desktop.close();
    await evaluateOffline(browser);
  }finally{ await browser.close(); }

  const safari=await webkit.launch({headless:true});
  try{
    const c=await safari.newContext({viewport:{width:390,height:844},locale:"fa-IR"});
    const p=await c.newPage();
    await p.goto(new URL("session4-communication-journey.html",BASE).href,{waitUntil:"load"});
    report.webkit=await p.evaluate(()=>({width:innerWidth,overflow:document.documentElement.scrollWidth-innerWidth,
      mode:document.body.dataset.bpPage,hasGuide:!!document.querySelector(".sf-guide-floating")}));
    if(report.webkit.overflow>1)fail("webkit","Safari-engine horizontal overflow");
    await c.close();
  }finally{await safari.close();}
}
async function examineState(page,id) {
  const axe=await new AxeBuilder({page}).withTags(WCAG).analyze();
  const severe=axe.violations.filter(v=>["critical","serious"].includes(v.impact));
  report.cases.push({id,interactive:true,violationCount:axe.violations.length});
  for(const v of axe.violations) {
    report.axeFindings.push({case:id,id:v.id,impact:v.impact,help:v.help,count:v.nodes.length,
      nodes:v.nodes.slice(0,4).map(n=>({target:n.target,summary:n.failureSummary?.slice(0,250)}))});
  }
  for(const v of severe)fail(id,"axe "+v.id+" ("+v.impact+") x"+v.nodes.length+
    " at "+v.nodes.slice(0,2).map(n=>n.target.join(" ")).join(", "));
}
(async()=>{
  try{await run();}catch(e){fail("fatal",e.stack||e.message);}
  const file=path.join(DIR,"impeccable-final-report.json");
  fs.writeFileSync(file,JSON.stringify(report,null,2));
  console.log("IMPECCABLE_SUMMARY "+JSON.stringify({
    cases:report.cases.length,violations:report.axeFindings.length,
    severe:report.failures.length,offline:report.offline.success,webkit:report.webkit,report:file
  }));
  for(const v of report.axeFindings) console.log("AXE "+JSON.stringify(v).slice(0,650));
  for(const f of report.failures)console.error("FAIL "+f.label+": "+f.detail);
  process.exit(report.failures.length?1:0);
})();
