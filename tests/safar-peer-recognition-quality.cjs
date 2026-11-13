/* Session 4: points, badge artwork, thresholds and private appreciation contract. */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const read=p=>fs.readFileSync(p,"utf8"),html=read("session4-communication-journey.html");
const source={
 score:read("assets/safar-score-feedback-v1.js"),
 peer:read("assets/safar-peer-appreciation-v1.js"),
 medal:read("assets/safar-industrial-medal-design.js"),
 gallery:read("assets/safar-industrial-medals.js"),
 css:read("assets/safar-recognition-premium-20261113.css")
};
for(const [key,str] of Object.entries(source))if(key!=="css")new vm.Script(str,{filename:key});
const inline=html.match(/<script>\s*([\s\S]*?)<\/script>/);
assert(inline,"Core script present");new vm.Script(inline[1],{filename:"session4 inline core"});
for(const asset of ["safar-score-feedback-v1.js","safar-peer-appreciation-v1.js","safar-recognition-premium-20261113.css"])
 assert(html.includes(asset),"Asset link "+asset);
assert(html.includes('name="peerRating"'),"Private 1–5 rating field");
assert(html.includes('id="saverp"'),"Save peer assessment");
assert(!html.includes('id="peerevidence"'),"Old mandatory long evidence removed");
const dataContext={window:{}};vm.runInNewContext(read("assets/safar-ertebatat-data.js"),dataContext);
const D=dataContext.window.BP_SAFAR_DATA;
assert.equal(D.stages.length,10);
const root={querySelector:()=>null};
const dom={getElementById:()=>root,querySelector:()=>null,addEventListener:()=>{}};
class Observer{observe(){}}
const store={getItem:()=>null,setItem:()=>{}};
const scoreCtx={document:dom,window:{BP_SAFAR_DATA:D},localStorage:store,MutationObserver:Observer,requestAnimationFrame:()=>{}};
vm.runInNewContext(source.score,scoreCtx);
const g=scoreCtx.window.BP_SAFAR_STEP_POINTS;
assert(g);
const answers={},alloc={},rp={},peer={},self={};
D.stages.forEach((st,i)=>{
 answers[i]={q1:st.c1,q2:{best:st.best,worst:st.worst}};
 rp[i]={peerRating:2,at:Date.now()};
 self[i]=[4,4,4];
});
D.incidents.forEach(x=>{alloc[x.stage-1]=x.ideal.slice()});
peer[2]={f:"x",s:"y"};peer[7]={f:"x",s:"y"};
const best={version:3,role:"managers",stage:9,answers,alloc,rp,peer,self};
assert.equal(g.progress(best).sum,100,"Max remains exactly 100");
assert.equal(g.progress(best).quiz,80,"Quiz remains exactly 80");
assert.equal(g.pts(best,0).reflection,0.5,"Each completed self-assessment has small weight");
assert.equal(g.pts(best,0).role,0.5,"Pair practice awards 0.5 points");
assert.equal(Array.from({length:10},(_,i)=>g.pts(best,i).max).reduce((a,b)=>a+b,0),100);
assert.equal(g.pts(best,0).max,9);assert.equal(g.pts(best,2).max,11);
assert.equal(g.progress({answers:{},rp:{},peer:{},alloc:{}}).sum,0);
const artCtx={window:{},document:{querySelector:()=>null}};vm.runInNewContext(source.medal,artCtx);
for(const name of ["gold","silver","bronze"]){
 const v=artCtx.window.BP_SAFAR_BADGE_DESIGN.seal(name,{preview:true});
 assert(v.startsWith("<svg")&&v.endsWith("</svg>"),"SVG "+name);
 assert(v.includes("سفر ارتباطات")&&v.includes("نشان"),"Branding "+name);
 assert(v.includes("radialGradient")&&v.includes("linearGradient"),"Metalwork "+name);
 const awarded=artCtx.window.BP_SAFAR_BADGE_DESIGN.seal(name,{name:"کاربر آزمایشی",score:88});
 assert(awarded.includes("کاربر آزمایشی")&&awarded.includes("۸۸"));
}
assert(source.gallery.includes("bronze:{total:60,quiz:44}"),"Bronze 44 quiz points preserved");
assert(source.gallery.includes("silver:{total:75,quiz:60}"),"Silver conditions preserved");
assert(source.gallery.includes("gold:{total:90,quiz:72}"),"Gold conditions preserved");
assert(source.gallery.includes('class="sf-medal-rule"')&&source.gallery.includes("شرایط کسب نشان"));
const peerCtx={document:dom,window:{},MutationObserver:Observer,requestAnimationFrame:()=>{},
 localStorage:store,location:{href:"https://example.test/session4-communication-journey.html"},URL,history:{replaceState:()=>{}},
 TextEncoder,TextDecoder,Uint8Array,atob,btoa,navigator:{}};
vm.runInNewContext(source.peer,peerCtx);
const decode=peerCtx.window.BP_SAFAR_PEER_APPRECIATION.decode;
const content={version:1,id:"bp-example-1234",from:"همکار",message:"از اینکه حرفم را تا پایان شنیدی، ممنونم.",peerRating:1};
const raw=Buffer.from(JSON.stringify(content)).toString("base64url");
const restored=decode(raw);
assert(restored&&restored.message===content.message&&restored.peerRating===undefined,"Private rating never returned to recipient");
assert.equal(decode("%%%"),null);
assert(!source.peer.includes("rp?.[s.stage].peerRating"),"Sharing must not read peer rating");
const sw=read("sw.js");
for(const file of ["safar-peer-appreciation-v1.js","safar-score-feedback-v1.js","safar-recognition-premium-20261113.css"])assert(sw.includes(file),"PWA offline: "+file);
console.log("PASS: Badge designs and requirements, 100-point exact scoring, optional private appreciation, and offline asset links.");
