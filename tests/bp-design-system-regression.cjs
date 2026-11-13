/* Behparvar design-system safety net.
   Visual shell must remain additive and not replace any curriculum engine.
 */
"use strict";
const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const read=(p)=>fs.readFileSync(path.join(root,p),"utf8");
const pages=["index.html","session3-self-assessment.html","session3-teamship.html",
  "session3-teamship-assessment.html","session4-communication-journey.html"];
const css="assets/bp-life-standard-system-20261113.css";
const js="assets/bp-life-standard-shell-20261113.js";
for(const page of pages){
 const body=read(page);
 assert(body.includes(css),page+" must load shared styles");
 assert(body.includes(js),page+" must load shared nav script");
 assert(body.includes('lang="fa"'),page+" must remain Persian");
 assert(body.includes('dir="rtl"'),page+" must remain RTL");
 assert(body.includes("</html>"),page+" must remain complete");
}
const html=read("index.html");
for(const id of ["welcome","competencies","course","scenarios","progress","home",
 "session2","session4","session5","session6","bp-c-clinic-2"]){
 assert(new RegExp('id="'+id+'"').test(html),"Missing original route: "+id);
}
assert((html.match(/class="bp-welcome-tile/g)||[]).length===5,"Five original home destinations must stay");
assert((html.match(/data-course-session="[1-6]"/g)||[]).length>=6,"Six sessions must stay");
assert(html.includes('id="bp-install-action"'),"PWA install action must remain in source");
assert(html.includes('id="bp-global-home"'),"Legacy Home shortcut must be preserved");
const shell=read(js);
new vm.Script(shell,{filename:js});
assert(shell.includes('grid.insertAdjacentElement("afterend",install)'),
 "Install CTA must stay outside the collapsed help");
assert(shell.includes('document.getElementById("bp-global-home")'),
 "Legacy Home link must remain available to existing navigation tests");
for(const route of ["welcome","competencies","course","scenarios","progress"]){
 assert(shell.includes('["'+route+'"'),"Missing destination "+route);
}
assert(!/localStorage\.(setItem|removeItem)|sessionStorage\.(setItem|removeItem)/.test(shell),
 "Visual layer must never mutate stored learner answers");
assert(!shell.includes("correctAnswers"),"Visual layer must not affect question scoring");
const styles=read(css);
let depth=0;
for(const ch of styles){if(ch==="{")depth++;else if(ch==="}")depth--;assert(depth>=0,"Malformed CSS nesting");}
assert.equal(depth,0,"Unbalanced CSS rules");
for(const token of [".bp-studio-nav",".bp-studio-link",".bp-view-trail",
 ".bp-install-disclosure",".bp-cross-nav","bp-on-welcome","bp-model-step"]){
 assert(styles.includes(token),"Visual system is missing "+token);
}
const manifest=JSON.parse(read("manifest.webmanifest"));
assert.equal(manifest.theme_color,"#103e38");
const worker=read("sw.js");
assert(worker.includes(css)&&worker.includes(js),"New visual assets should be PWA cached");
for(const page of pages){
 assert(!read(page).includes("life-organization/"),
  "Benchmark assets must not be copied into Behparvar pages");
}
console.log("PASS: Behparvar cross-page style, navigation, RTL, routes, install CTA, PWA and learner-state isolation");
