/* My Management Lab: zero-dependency regression suite.
   Verifies source and authored content, not a substitute for graphical browser QA. */
"use strict";
const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict"),path=require("node:path");
const root=__dirname;
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const html=read("index.html"),sw=read("sw.js"),libraryCode=read("assets/mml-lesson-library-v1.js");
const homeJS=read("assets/mml-learning-home-v1.js"),homeCSS=read("assets/mml-learning-home-v1.css");
const readerJS=read("assets/mml-visual-refresh-20261031.js"),readerCSS=read("assets/mml-teaching-ui-v1.css");
const ctx={window:{}};vm.runInNewContext(libraryCode,ctx,{filename:"mml-lesson-library-v1.js"});
const lib=ctx.window.MMLLessonLibrary,errs=[],asserted=[];
function check(name,fn){try{fn();asserted.push(name)}catch(err){errs.push(name+": "+err.message)}}
const PARTS=["m1","m2","leaders","techniques","visuals","diseases","quiz"];
check("six sessions, seven chapters",()=>{
 assert.equal(lib.DATA.length,6);assert.deepEqual(Array.from(lib.PARTS),PARTS);
 lib.DATA.forEach((x,i)=>{assert.equal(x.chapters.length,7,"Session "+(i+1));assert.ok(x.name&&x.goals.length===2)});
});
check("42 routes remain in HTML",()=>{
 for(let n=1;n<=6;n++)for(let p of PARTS){
  const route=n===1?p:"session"+n+"-"+p;
  assert.ok(html.includes('id="'+route+'"'),"Missing hash route "+route);
 }
});
check("84 authored page renders with accessible tables",()=>{
 for(let n=1;n<=6;n++)for(let p of PARTS)for(let role of ["managers","supervisors"]){
  const output=lib.render(n,p,role);
  assert.ok(output.includes("<h3")&&output.includes("<h4"),"Headings "+n+p+role);
  assert.ok(output.includes("هدف یادگیری")&&output.includes("تمرین بازتابی"));
  assert.ok(output.includes("<table")&&output.includes('<th scope="col">'));
  assert.ok(output.includes("مبانی علمی"));
 }
});
check("12 staged role-plays include nonverbal instructions",()=>{
 for(let n=1;n<=6;n++)for(let role of ["managers","supervisors"]){
  const output=lib.render(n,"m2",role);
  assert.ok(output.includes("mml-edu-drama"));
  assert.ok(output.includes("لحن، حالت چهره و زبان بدن:"));
  assert.ok(output.includes("راهنمای تسهیلگر"));
 }
});
check("learning modes and reading defaults intact",()=>{
 assert.ok(readerJS.includes('data-mode="lesson"'));
 assert.ok(readerJS.includes('data-mode="main"'));
 assert.ok(readerJS.includes('data-mode="guided"'));
 assert.ok(readerJS.includes('show(i===6?"main"'));
});
check("learning progress never claims competency",()=>{
 assert.ok(homeJS.includes("مرور"));
 assert.ok(homeJS.includes("نه نمره شایستگی"));
 assert.ok(homeJS.includes("behparvar_app_v1"));
 assert.ok(!homeJS.includes("localStorage.setItem"));
 assert.ok(!libraryCode.includes("localStorage.setItem"));
});
check("mobile, RTL, low-motion accessible",()=>{
 assert.ok(homeCSS.includes("@media(max-width:780px)"));
 assert.ok(readerCSS.includes("direction:rtl"));
 assert.ok(homeCSS.includes("prefers-reduced-motion"));
 assert.ok(homeCSS.includes(".mml-study-step"));
});
check("core learner records retained",()=>{
 assert.ok(html.includes("behparvar_session1_v4"));
 assert.ok(html.includes("futureStorageKey"));
 assert.ok(html.includes('data-audience-entry="managers"'));
 assert.ok(html.includes('data-audience-entry="supervisors"'));
});
check("loaded asset order and offline scope",()=>{
 const assets=["assets/mml-lesson-library-v1.js","assets/mml-visual-refresh-20261031.js","assets/mml-learning-home-v1.js"];
 let last=0;for(const p of assets){const i=html.indexOf('src="'+p);assert.ok(i>last,"Script order: "+p);last=i;assert.ok(sw.includes("./"+p),"PWA precache: "+p)}
 for(const p of ["assets/mml-teaching-ui-v1.css","assets/mml-learning-home-v1.css"]){
  assert.ok(html.includes('href="'+p));assert.ok(sw.includes("./"+p));
 }
});
check("all new scripts parse",()=>{
 for(const p of ["assets/mml-lesson-library-v1.js","assets/mml-visual-refresh-20261031.js","assets/mml-learning-home-v1.js"]){
  new vm.Script(read(p),{filename:p});
 }
});
for(const n of asserted)console.log("PASS "+n);
for(const e of errs)console.error("FAIL "+e);
console.log(asserted.length+"/"+(asserted.length+errs.length)+" source checks passed");
if(errs.length)process.exitCode=1;
