#!/usr/bin/env node
/* Impeccable CSS/PWA release contract: make future design drift detectable.
 * The large historic !important budget is frozen pending a dedicated
 * screenshot-verified refactor; never mass-delete accessibility overrides.
 */
"use strict";
const fs=require("node:fs"),assert=require("node:assert/strict"),vm=require("node:vm");
const root=require("node:path").resolve(__dirname,"..");
const read=p=>fs.readFileSync(require("node:path").join(root,p),"utf8");
const pages=["index.html","session3-self-assessment.html","session3-teamship.html",
 "session3-teamship-assessment.html","session4-communication-journey.html"];
const uiCss="assets/bp-impeccable-unified-navigation-20261114.css";
const uiJs="assets/bp-impeccable-unified-navigation-20261114.js";
const pwa="assets/bp-pwa-register-20261114.js";
const sw=read("sw.js");
const core=JSON.parse(sw.match(/const CORE=(\[[\s\S]*?\]);/)?.[1]||"null");
assert(Array.isArray(core),"PWA core list missing");
assert.equal(new Set(core).size,core.length,"Duplicate assets in PWA pre-cache");
const listed=new Set(core.map(x=>x.replace(/^\.\//,"")));
for(const file of listed)if(file)assert(fs.existsSync(require("node:path").join(root,file)),file+" not found");
for(const file of pages){
 const html=read(file);
 assert(html.includes('lang="fa"')&&html.includes('dir="rtl"'),file+" language or RTL missing");
 const head=html.slice(0,html.indexOf("</head>"));
 for(const target of [uiCss,uiJs,pwa]){
   assert.equal(html.split(target).length-1,1,file+" asset inserted more or less than once: "+target);
   assert(listed.has(target),target+" absent from offline cache");
 }
 assert(head.includes(uiCss),file+" UI CSS not in the actual document head");
 const assets=[...html.matchAll(/<(?:script|link)\b[^>]*?(?:src|href)=["']([^"']+)/g)]
   .map(x=>x[1].split("?")[0]).filter(x=>x.startsWith("assets/"));
 for(const asset of assets) {
   assert(listed.has(asset),file+" depends on an asset not precached: "+asset);
   assert(fs.existsSync(require("node:path").join(root,asset)),file+" references missing file: "+asset);
 }
}
for(const file of [uiJs,pwa])new vm.Script(read(file),{filename:file});
const style=read(uiCss);
const base=read("assets/bp-life-standard-system-20261113.css");
function verifyBraces(css,file){
 let depth=0;
 for(const c of css){if(c==="{")depth++;else if(c==="}")depth--;assert(depth>=0,file+" unexpected }");}
 assert.equal(depth,0,file+" unbalanced CSS braces");
}
verifyBraces(style,uiCss);verifyBraces(base,"legacy stylesheet");
const historicalImportant=(base.match(/!important/g)||[]).length;
const newImportant=(style.match(/!important/g)||[]).length;
assert(historicalImportant<=220,"Legacy CSS important count expanded; refactor deliberately");
assert(newImportant<=10,"New UI layer is accumulating !important overrides");
assert(sw.includes("impeccable-final-v60"),"PWA version must be refreshed for final release");
assert(read("index.html").includes('<h1 id="bp-welcome-title">'),
 "Visible home-page title should retain the H1 semantics");
console.log("PASS impeccable CSS/PWA contract "+JSON.stringify({
  routes:pages.length,cachedAssets:core.length,legacyImportant:historicalImportant,newImportant
}));
