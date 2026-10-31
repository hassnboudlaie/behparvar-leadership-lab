/* Canonical My Management Lab pedagogy QA; zero dependencies. */
"use strict";
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),assert=require("node:assert/strict");
const read=name=>fs.readFileSync(path.join(__dirname,name),"utf8");
const code={
 lessons:read("assets/mml-lesson-library-v1.js"),
 data:read("assets/mml-aligned-content-v1.js"),
 ui:read("assets/mml-aligned-ui-v1.js"),
 integration:read("assets/mml-visual-refresh-20261031.js"),
 html:read("index.html"),sw:read("sw.js"),css:read("assets/mml-aligned-ui-v1.css")
};
const items=new Map();
const context={
 window:{},
 document:{readyState:"loading",addEventListener:()=>{}},
 localStorage:{getItem:k=>items.get(k)||null,setItem:(k,v)=>items.set(k,v)}
};
for(const n of ["lessons","data","ui"])vm.runInNewContext(code[n],context,{filename:n,timeout:4000});
const cases={};vm.runInNewContext(read("assets/behparvar-cases-1-3.js"),cases,{timeout:4000});
vm.runInNewContext(read("assets/behparvar-cases-4-6.js"),cases,{timeout:4000});
context.window.BP_CASE_DATA=cases.BP_CASE_DATA;
const library=context.window.MMLLessonLibrary,can=context.window.MMLAlignedData,ui=context.window.MMLAlignedUI;
const PARTS=["m1","m2","leaders","techniques","visuals","diseases","quiz"];
assert.equal(can.sessions.length,6);
assert.equal(library.DATA.length,6);
assert.ok(typeof library.renderRoleplay==="function");
assert.equal(ui.PARTS.join(","),PARTS.join(","));
let pages=0,questions=0,reasons=0,roleplays=0;
for(let n=1;n<=6;n++){
 const t=can.sessions[n-1],lesson=library.DATA[n-1];
 assert.equal(t.title,lesson.name,"Mismatch in canonical session "+n);
 assert.equal(t.quiz.length,3,"Quiz length for session "+n);
 assert.ok(ui.render(n,"leaders","managers").includes("mml-align-book"),"Book illustration not mapped to session "+n);
 assert.ok(ui.render(n,"leaders","managers").includes("برگرفته از"),"Book provenance not disclosed");

 for(const q of t.quiz){
   assert.equal(q.o.length,3);
   assert.equal(q.o.filter(v=>v[2]===1).length,1);
   assert.equal(new Set(q.o.map(v=>v[1])).size,3,"Repeated feedback for different options");
   q.o.forEach(function(option){assert.ok(option[1].length>20,"Feedback too short");assert.ok(/^(درست|نادرست)/.test(option[1]))});
   questions++;reasons+=q.o.length;
 }
 for(const role of ["managers","supervisors"]){
   for(const part of PARTS){
    const output=ui.render(n,part,role);
    assert.ok(output.includes('data-mml-scene-id="session-'+n+'"'),"Missing continuous scenario");
    assert.ok(output.includes(t.skill),"Missing skill focus");
    assert.ok(output.includes(part==="quiz"?"data-mml-align-quiz-mount":part==="m2"?"اتفاق تازه":"اتفاق آشنا"));
    if(part==="m2"){
      assert.ok(output.includes("دور دوم")&&output.includes("چک‌لیست مشاهده‌گر")&&output.includes("لحن، حالت چهره و زبان بدن"));
      roleplays++;
    }
    pages++;
   }
   assert.notEqual(ui.render(n,"m1","managers"),ui.render(n,"m1","supervisors"),"Unsegmented audiences");
 }
}
assert.equal(pages,84);
assert.equal(questions,18);
assert.equal(reasons,54);
assert.equal(roleplays,12);
items.set("mml_aligned_v1_managers_2",JSON.stringify({page:0,answers:{0:1},notes:{"m1":"نمونه یادداشت"}}));
const q=ui.renderQuiz(2,"managers");
assert.ok(q.includes("دلیل هر گزینه را جداگانه بررسی کنید"));
for(const str of can.sessions[1].quiz[0].o.map(o=>o[1]))assert.ok(q.includes(str),"Missing unique answer feedback");
assert.equal(ui.read(2,"managers").notes.m1,"نمونه یادداشت");
assert.equal(items.size,1,"Initialization must not write learner state");
for(const name of ["assets/mml-aligned-content-v1.js","assets/mml-aligned-ui-v1.js"]){
 assert.ok(code.html.includes('src="'+name),name+" not loaded");
 assert.ok(code.sw.includes("./"+name),name+" not cached offline");
}
assert.ok(code.html.indexOf("mml-lesson-library-v1.js")<code.html.indexOf("mml-aligned-content-v1.js"));
assert.ok(code.html.indexOf("mml-aligned-content-v1.js")<code.html.indexOf("mml-aligned-ui-v1.js"));
assert.ok(code.html.indexOf("mml-aligned-ui-v1.js")<code.html.indexOf("mml-visual-refresh-20261031.js"));
assert.ok(code.integration.includes("main.innerHTML=aligned.render(n,part,selectedRole)"));
assert.ok(code.integration.includes('archive.hidden=!new URLSearchParams(location.search).has("instructor")'));
for(const name of ["assets/session2-experiential-v5.js","assets/behparvar-case-studio-v1.js","assets/beparvar-book-lab-2026.js"]){
 assert.ok(code.html.includes('src="'+name),"Missing preserved legacy module "+name);
}
assert.ok(code.html.includes("behparvar_session1_v4"));
assert.ok(code.css.includes("mml-align-feedback"));
new vm.Script(code.ui);
new vm.Script(code.integration);
console.log("PASS aligned curriculum: "+pages+" role-specific lesson views, "+roleplays+" staged role-plays, "+questions+" questions, "+reasons+" unique option rationales");
console.log("PASS original sources, offline resources, learner state, hidden instructor archive and script order");
