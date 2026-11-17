/*
 * Behparvar MBTI-inspired pilot — zero-dependency smoke/regression tests.
 * Run from repository root: node personality-mbti-pilot/tests/pilot.test.cjs
 * This is SOFTWARE testing, not psychometric validation.
 */
"use strict";
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,"../..");
const html=fs.readFileSync(path.join(root,"personality-mbti-pilot/index.html"),"utf8");
const js=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(js,"Embedded application script should exist");
assert.ok(fs.existsSync(path.join(root,"assets/vazirmatn.woff2")),"Vazirmatn font should exist");
assert.ok(html.includes('../assets/vazirmatn.woff2'),"Font CSS path should match repository");
assert.ok(html.includes('dir="rtl"'),"Page should be RTL");
assert.ok(!/localStorage|sessionStorage|XMLHttpRequest|\bfetch\s*\(|sendBeacon/.test(js),"Responses must not be persisted or transmitted");
const items=JSON.parse(js.match(/const ITEMS=(\[[\s\S]*?\]);\nconst AXES=/)[1]);
assert.equal(items.length,48);
const DIMENSIONS=["EI","SN","TF","JP"];
for(const k of DIMENSIONS){
 const rows=items.filter(q=>q[0]===k);
 assert.equal(rows.length,12,k+" must contain 12 items");
 assert.equal(rows.filter(q=>q[1]===k[0]).length,6,k+" must alternate first-pole placement");
}
for(const q of items){assert.ok(q[2].trim()&&q[3].trim(),"No empty statement");}
assert.equal(new Set(items.map(q=>q[2]+"|"+q[3])).size,48,"No repeated question pairs");
function mockNode(tag="div"){
 return {tag,children:[],style:{},attrs:{},textContent:"",classList:{toggle(){}},
 setAttribute(k,v){this.attrs[k]=v},append(...x){this.children.push(...x)},replaceChildren(...x){this.children=x},
 addEventListener(event,fn){(this.handlers??={})[event]=fn},focus(){this.focused=true}};
}
const elements=new Map();
const document={createElement:mockNode,getElementById(id){if(!elements.has(id))elements.set(id,mockNode());return elements.get(id)}};
const window={scrollTo(){},print(){}};
const sandbox={document,window,Date,Math};
vm.createContext(sandbox);
vm.runInContext(js+"\n;globalThis.pilot={ITEMS,replies,dimensionEvidence,report,render,setStarted:(v)=>started=v,refreshRoleReflection};",sandbox,{timeout:3000});
const p=sandbox.pilot;
function go(getResponse,expectType,expectedScore){
 p.replies.forEach((_,i)=>p.replies[i]=getResponse(items[i],i));
 p.setStarted(Date.now()-600000);document.getElementById("contextRole").value="manager";p.report();
 const data=p.dimensionEvidence();
 assert.equal(document.getElementById("type").textContent,expectType,"Code should match raw item responses");
 assert.equal(document.getElementById("dimensions").children.length,4,"Report must include four dimensions");
 for(const a of DIMENSIONS){
  const d=data[a];assert.equal(d.rows.length,12);assert.equal(d.aCount+d.bCount+d.neutral,12);
  if(expectedScore!==undefined)assert.equal(d.total,expectedScore);
 }
 return data;
}
go(()=>3,"????",0);
go(q=>q[1]===q[0][0]?1:5,"ESTJ",24);
go(q=>q[1]===q[0][0]?5:1,"INFP",-24);
go((q,i)=>i%2?2:4,"????",0);
const data=go((q,i)=>i%3===0?(q[1]===q[0][0]?1:5):i%3===1?3:(q[1]===q[0][0]?5:1),document.getElementById("type").textContent);
assert.ok(Object.values(data).every(d=>d.aCount+d.bCount+d.neutral===12));
const prevScore=JSON.stringify(Object.values(data).map(d=>d.total));
const r=document.getElementById("contextRole");r.value="manager";p.refreshRoleReflection();
const managerText=document.getElementById("roleReflection").textContent;
r.value="supervisor";p.refreshRoleReflection();
const supervisorText=document.getElementById("roleReflection").textContent;
assert.notEqual(managerText,supervisorText,"Only non-scored role example must vary");
assert.equal(prevScore,JSON.stringify(Object.values(p.dimensionEvidence()).map(d=>d.total)),"Role must not change scoring");
p.replies[0]=null;assert.throws(()=>p.dimensionEvidence(),/همه پرسش‌ها/);
console.log("PASS: 48 balanced items, scoring poles/ties, evidence counts, role independence, no persistence, RTL and Vazirmatn references.");
