"use strict";
/* Behparvar mobile-first integrity — static contract checks, no participant data. */
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const cssPath="assets/bp-mobile-first-ux-20261115.css";
const css=read(cssPath);
const htmlFiles=[
 "index.html",
 "session4-communication-journey.html",
 "session3-self-assessment.html",
 "session3-teamship.html",
 "session3-special.html",
 "session3-teamship-assessment.html",
 "handout-module-1.html"
];
let checks=0;
function ok(v,why){assert.ok(v,why);checks++}
for(const file of htmlFiles){
 const html=read(file);
 ok(html.includes('dir="rtl"'),file+" remains right-to-left");
 ok(html.includes('assets/bp-mobile-first-ux-20261115.css?v=1'),file+" links mobile CSS");
 ok(html.indexOf('assets/bp-mobile-first-ux-20261115.css?v=1')<html.indexOf('</head>'),file+" stylesheet within head");
}
ok(css.includes("Mobile-first UX v1"),"source provenance");
ok(css.includes("max-width:700px"),"phone breakpoint");
ok(css.includes("max-width:380px"),"narrow phone breakpoint");
ok(css.includes(".bp-welcome-grid"),"single-column learning menu");
ok(css.includes(".course-sessions"),"session list mobile layout");
ok(css.includes(".sf-guide-floating"),"floating coach is preserved");
ok(css.includes(".bp-recognition-grid"),"downloadable recognition layout preserved");
ok(css.includes(".cover-surface img"),"real poster is not cropped");
ok(css.includes("prefers-reduced-motion"),"motion access respected");
ok(css.includes("focus-visible"),"keyboard focus visible");
ok(css.includes("env(safe-area-inset-bottom"),"gesture-safe mobile actions");
const sw=read("sw.js");
ok(sw.includes("mml-root-20261115-mobile-ux-v61"),"fresh PWA version");
ok(sw.includes("./assets/bp-mobile-first-ux-20261115.css?v=1"),"new style available offline");
const journey=read("session4-communication-journey.html");
for(const term of ["safar-overtime-v1.js","safar-journey-coach-v5.js","safar-score-feedback-v1.js","safar-peer-appreciation-v1.js","safar-approved-recognition-20261115.js","id=\"clock\""]){
 ok(journey.includes(term),"preserved journey module "+term);
}
for(const term of ["state.stage===9","function grade()","id=\"next\""]){
 ok(journey.includes(term),"original progression retained "+term);
}
let depth=0,min=0;
for(const c of css.replace(/\/\*[\s\S]*?\*\//g,"")){if(c==="{")depth++;if(c==="}")depth--;min=Math.min(min,depth)}
ok(depth===0&&min===0,"CSS braces balanced");
console.log("PASS Behparvar mobile UX integrity:",checks,"checks; 7 routes, original session logic and offline support preserved.");
