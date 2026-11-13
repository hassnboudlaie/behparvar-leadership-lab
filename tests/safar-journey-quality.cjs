#!/usr/bin/env node
/* Safar Ertebatat static quality gate. Run: node tests/safar-journey-quality.cjs.
 * Browser behavior and anti-tamper security require separate testing.
 */
"use strict";
const fs=require("node:fs"), path=require("node:path"), vm=require("node:vm");
const dir=path.resolve(__dirname,".."), errors=[], successes=[];
const read=p=>fs.readFileSync(path.join(dir,p),"utf8");
const assert=(x,desc)=>{(x?successes:errors).push(desc)};
const html=read("session4-communication-journey.html");
const scripts=[...html.matchAll(/<script\s+src="([^"]+)"/g)].map(x=>x[1].split("?")[0]);
const styles=[...html.matchAll(/<link\s+rel="stylesheet"\s+href="([^"]+)"/g)].map(x=>x[1].split("?")[0]);
const core=html.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1];
assert(!!core,"Inline journey script present");
for(const file of scripts.concat(styles))assert(fs.existsSync(path.join(dir,file)),"Asset exists: "+file);
for(const file of scripts)try{new vm.Script(read(file));successes.push("Syntax "+file)}catch(e){errors.push("Syntax "+file+" "+e.message)}
if(core)try{new vm.Script(core);successes.push("Syntax inline core")}catch(e){errors.push("Syntax inline core "+e.message)}
const scope={window:{}};
for(const file of ["assets/safar-ertebatat-data.js","assets/safar-quiz-hardening-v2.js","assets/safar-classroom-upgrade-data.js","assets/safar-content-restoration-data.js","assets/safar-applied-curriculum-20261113.js","assets/safar-applied-curriculum-adapter-20261113.js"])vm.runInNewContext(read(file),scope,{filename:file});
const d=scope.window.BP_SAFAR_DATA,st=d.stages,extra=scope.window.BP_SAFAR_CLASSROOM.content,lessons=scope.window.BP_SAFAR_RESTORED_CONTENT.content;
assert(st.length===10&&extra.length===10&&lessons.length===10,"10 stages and complementary curriculum layers");
const applied=scope.window.BP_SAFAR_APPLIED?.units||[];
assert(applied.length===10&&d.appliedCurriculumVersion===2,"Ten-step source-aligned Behparvar curriculum is active");
assert(applied.every((x,i)=>!!x.alborz&&!!x.behparvar&&st[i].sup===x.sup.case&&st[i].mgr===x.mgr.case),"All twenty scenarios derive from referenced Behparvar/Alborz material");
assert(applied.every((x,i)=>x.tools.length===3&&x.sup.dialogue.length===6&&x.mgr.dialogue.length===6&&extra[i].skill===x.skill),"Thirty applied techniques and 20 contextual role-plays integrated");
assert(applied.every((x,i)=>x.sup.roleBriefs.length===2&&x.mgr.roleBriefs.length===2&&x.debrief.length===2),"Every route includes role-specific constraints and debriefing");
assert(st.every(x=>x.sup.length>=180&&x.mgr.length>=180),"Decision contexts contain substantive facts and constraints");
assert(html.includes("safar-applied-quiz-context-20261113.js"),"Quiz pages receive their full situational context");
assert(read("assets/safar-applied-quiz-context-20261113.js").includes('id="sfDecisionContext"'),"Scenario context stays visible without navigating back");
assert(read("assets/safar-applied-curriculum-adapter-20261113.js").includes('d.appliedCurriculumVersion=2'),"Curriculum extension does not replace the assessment engine");
assert(st.reduce((a,x)=>a+x.time,0)===55,"55-minute instructional segment");
assert(st.every(x=>x.a1.length===4&&x.a2.length===4&&x.why1.length===4&&x.why2.length===4),"20 quiz items / 80 options, each analyzed");
assert(st.every(x=>x.best!==x.worst&&[x.c1,x.best,x.worst].every(k=>Number.isInteger(k)&&k>=0&&k<4)),"All answer keys valid");
for(const key of ["c1","best","worst"]){const counts=[0,1,2,3].map(i=>st.filter(x=>x[key]===i).length);assert(Math.max(...counts)-Math.min(...counts)<=2,"Balanced positions: "+key+" ["+counts.join(",")+"]")}
assert(d.incidents.length===3&&d.incidents.every(x=>x.ideal.reduce((a,b)=>a+b,0)===6),"Three six-coin decisions");
assert(extra.every(x=>x.selfCheck.length===3&&x.observer.length===3),"30 behavior self checks / role rubrics");
assert(extra.every(x=>x.supervisor.dialogue.length===6&&x.manager.dialogue.length===6),"20 role-play dialogues / 120 turns");
assert(lessons.reduce((a,x)=>a+x.tools.length,0)===30&&lessons.every(x=>x.debrief.length===2),"30 techniques and 20 debrief questions");
assert((core.match(/alloc:\[0,0,0,0\]/g)||[]).length>=2,"No prefilled bonus-winning six-coin allocations");
assert(core.includes("state.orders[state.stage]"),"Per-user option shuffle is persisted");
assert(core.includes("انتخاب شما:")&&core.includes("بهترین اقدام انتخاب‌شده"),"Locked original answers visible without revealing key");
assert(core.includes("quiz>=72"),"Gold badge requires minimum 72/80 quiz mastery");
const wiz=read("assets/safar-wizard-v3.js");
assert(wiz.includes("REST_MS=30000")&&wiz.includes('[2,6].includes(s.stage)?["rest"]'),"Two 30-second scenic pauses");
assert(read("assets/safar-journey-coach-v5.js").includes('if(q===1)inlineFeedback'),"Contextual nonmodal coaching for first choice");
assert(read("assets/safar-session-controls-v4.js").includes("storeHistory"),"New journeys archive prior achievements");
assert(read("assets/safar-industrial-medals.js").includes("rasterSvg=svg.replace"),"Mobile badge raster export safety");
assert(!html.includes('id="session4-m1"'),"Obsolete session-four content is absent");
if(errors.length){console.error("FAIL ("+errors.length+"):");errors.forEach(x=>console.error(" - "+x));process.exitCode=1}
else console.log("PASS: "+successes.length+" static quality checks.");
console.log("Note: mobile browser UX, official deployment, and secure backend require separate E2E tests.");
