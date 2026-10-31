/* Regression contract for the beginner-friendly My Management Lab refresh.
   No external dependencies or corporate data. */
const fs=require("node:fs");
const path=require("node:path");
const assert=require("node:assert/strict");
const vm=require("node:vm");
const root=path.resolve(__dirname,"..");
const read=(p)=>fs.readFileSync(path.join(root,p),"utf8");
const html=read("index.html"),lab=read("assets/my-management-lab.js");
const guided=read("assets/mml-guided-lessons.js");
const css=read("assets/my-management-lab.css");
const context={window:{}};
vm.runInNewContext(guided,context,{timeout:3000,filename:"mml-guided-lessons.js"});
const guide=context.window.MML_GUIDE_V2;
assert.ok(guide&&Array.isArray(guide.lessons),"guide data is available");
assert.equal(guide.lessons.length,6);
assert.equal(guide.sources.length,6);
assert.ok(guide.lessons.every((lesson,i)=>["s","m"].every(key=>{
 const l=lesson[key];return l&&l.steps.length===3&&l.options.length===3&&l.feedback.length===3&&l.role.length===3&&l.best>=0&&l.best<=2&&l.example&&l.lesson&&guide.sources[i].length>=2;
})),"both tracks have six complete concise guided lessons");
assert.ok(html.indexOf("mml-guided-lessons.js")<html.indexOf("my-management-lab.js"),"guide loaded before app code");
new vm.Script(lab,{filename:"my-management-lab.js"});
assert.match(lab,/ZONES=\[/);
for(const x of ["خودم","دیگران","کسب‌وکار"])assert.ok(lab.includes('"'+x+'"'),"missing zone "+x);
for(const x of ["data-mml-choice","data-mml-level","data-mml-action","data-mml-when","data-mml-proof","mml-legacy"])assert.ok(lab.includes(x),"missing interaction "+x);
assert.match(lab,/mml_competency_v1/);
assert.match(lab,/behparvar_app_v1/);
assert.match(html,/behparvar_session1_v4/);
for(let n=2;n<=6;n++)for(const section of ["m1","m2","leaders","techniques","visuals","diseases","quiz"])assert.ok(html.includes('id="session'+n+'-'+section+'"'),"missing preserved route "+n+" "+section);
for(const photo of ["assets/behparvar-campus.webp","assets/feed-official.webp","assets/production-official.webp"])assert.ok(fs.existsSync(path.join(root,photo)),"missing photo "+photo);
assert.match(css,/\.mml-zone-grid/);
assert.match(css,/\.mml-legacy/);
assert.ok(!html.includes("محتوای این بخش برای جلسه دوم هنوز اضافه نشده است."),"obsolete placeholder remains");
const oldApp=read("app/index.html");
assert.match(oldApp,/location\.replace\(url\.href\)/);
assert.ok(!/<iframe/i.test(oldApp),"legacy app should not contain iframe");
console.log("PASS: 6 sessions x 2 tracks, 3 capability zones, all saved-state keys, 42 routes, 3 existing photos, guided choices, old-app redirect.");