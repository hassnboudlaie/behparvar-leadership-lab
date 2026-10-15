const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/\}\)\(\);\s*$/,'globalThis.__triangleTests={triCases,triCalculate,triPoint,triNormalize,triCurrent,triClassify,triProfiles,getState:()=>state};})();');
const voids=new Set(['meta','link','img','input','br','hr','source']);
class Element{
 constructor(tag,attrs={}){this.tagName=tag;this.attrs=attrs;this.children=[];this.parent=null;this.listeners={};this.style={};this.hidden='hidden' in attrs;this.value='';this.open='open' in attrs;this._text='';this.dataset={};for(const [k,v]of Object.entries(attrs))if(k.startsWith('data-'))this.dataset[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=v;
 this.dataset=new Proxy(this.dataset,{set:(target,k,v)=>{target[k]=String(v);this.attrs['data-'+k.replace(/[A-Z]/g,c=>'-'+c.toLowerCase())]=String(v);return true}});
 this.classList={contains:c=>this.className.split(/\s+/).includes(c),add:c=>{if(!this.classList.contains(c))this.className=(this.className+' '+c).trim()},remove:c=>{this.className=this.className.split(/\s+/).filter(v=>v!==c).join(' ')},toggle:(c,on)=>{const x=on??!this.classList.contains(c);this.classList[x?'add':'remove'](c);return x}};
 }
 get id(){return this.attrs.id}get className(){return this.attrs.class||''}set className(x){this.attrs.class=x}
 setAttribute(k,v){this.attrs[k]=String(v)}getAttribute(k){return this.attrs[k]}
 appendChild(c){c.parent=this;this.children.push(c);return c}
 get textContent(){return this._text+this.children.map(x=>x.textContent).join('')}set textContent(t){this._text=String(t);this.children=[]}
 set innerHTML(t){this._html=t;this.children=[];parse(t,this)}get innerHTML(){return this._html||''}
 addEventListener(name,fn){(this.listeners[name]??=[]).push(fn)}
 click(){if(!this.disabled)this.fire('click')}fire(name){for(const fn of this.listeners[name]||[])fn({target:this,preventDefault(){}})}focus(){}scrollIntoView(){}
 querySelector(s){return this.querySelectorAll(s)[0]||null}
 querySelectorAll(sel){const parts=sel.trim().split(/\s+/);const out=[];const test=(e,p)=>{const attrs=[...p.matchAll(/\[([^=\]]+)(?:="([^"]*)")?\]/g)];for(const[,k,v]of attrs)if(!(k in e.attrs)||(v!==undefined&&e.attrs[k]!==v))return false;p=p.replace(/\[[^\]]*\]/g,'');const id=p.match(/#([^.#]+)/);if(id&&e.id!==id[1])return false;for(const[,c]of p.matchAll(/\.([^.#]+)/g))if(!e.classList.contains(c))return false;const tag=p.match(/^[\w-]+/);return !tag||e.tagName===tag[0]};
 const walk=e=>{for(const c of e.children){if(test(c,parts.at(-1))){let n=c.parent,ix=parts.length-2;while(ix>=0&&n){if(test(n,parts[ix]))ix--;n=n.parent}if(ix<0)out.push(c)}walk(c)}};walk(this);return out;
 }
}
function parse(markup,root=new Element('document')){let cur=root;const tokens=markup.match(/<!--[\s\S]*?-->|<![^>]*>|<[^>]*>|[^<]+/g)||[];for(const t of tokens){if(t.startsWith('<!--')||t.startsWith('<!'))continue;if(t.startsWith('</')){if(cur.parent)cur=cur.parent;continue}if(t.startsWith('<')){const m=t.match(/^<([\w-]+)([\s\S]*?)\/?\s*>$/);if(!m)continue;const attrs={};for(const a of m[2].matchAll(/([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g))attrs[a[1]]=a[2]??a[3]??a[4]??'';const n=cur.appendChild(new Element(m[1],attrs));if(!voids.has(m[1])&&!t.endsWith('/>'))cur=n;}else cur._text+=t;}return root;}
function boot({hash='',data={},blocked=false}={}){
 const doc=parse(html.replace(/<style>[\s\S]*?<\/style>/g,'').replace(/<script>[\s\S]*?<\/script>/g,''));doc.createElement=t=>new Element(t);doc.getElementById=id=>doc.querySelector('#'+id);doc.body=doc.querySelector('body');
 const events={},alerts=[];let reloaded=false;const location={hash,reload:()=>reloaded=true};
 const storage={getItem:k=>{if(blocked)throw Error('blocked');return data[k]||null},setItem:(k,v)=>{if(blocked)throw Error('blocked');data[k]=v},removeItem:k=>{if(blocked)throw Error('blocked');delete data[k]}};
 const context={document:doc,localStorage:storage,location,history:{replaceState:(a,b,h)=>location.hash=h},window:{scrollTo:()=>{},addEventListener:(n,f)=>events[n]=f},alert:t=>alerts.push(t),confirm:()=>true,console};
 vm.runInNewContext(script,context,{timeout:2000});
 return{doc,data,events,alerts,location,test:context.__triangleTests,get reloaded(){return reloaded},q:s=>doc.querySelector(s),all:s=>doc.querySelectorAll(s),active:()=>doc.querySelector('.view.active').id};
}
const app=boot();assert.equal(app.active(),'home');
const routes=['workshop','m1office','home','session','profile','assessment','m1','m1model','m1cases','m1learning','m1action','m2','m3','m4','m5','m6','m7','m8'];
for(const id of routes)assert.equal(boot({hash:'#'+id}).active(),id);
assert.equal(boot({hash:'#does-not-exist'}).active(),'home');
app.q('[data-open="m1"]').click();assert.equal(app.active(),'m1');assert.equal(app.all('#m1 .lesson-index a').length,3);assert.equal(app.all('#m1 .learning-section').length,0);
app.q('[data-open="m1model"]').click();assert.equal(app.active(),'m1model');app.q('#backBtn').click();assert.equal(app.active(),'m1');
app.q('[data-open="m1cases"]').click();assert.equal(app.active(),'m1cases');
assert.equal(app.all('#m1cases .focus-door').length,3);
assert.equal(app.all('#m1cases .save-choice').length,0);
assert.equal(app.all('#m1cases .focus-door').filter(d=>d.open).length,0);
app.q('[data-open="m1office"]').click();assert.equal(app.active(),'m1office');
app.q('[data-open="m1learning"]').click();assert.equal(app.all('#m1learning .save-choice').length,0);
app.q('[data-open="m1action"]').click();assert.equal(app.active(),'m1action');
for(const id of ['m1Situation','m1Action','m1Evidence']){const n=app.q('#'+id);n.value='یادداشت خصوصی '+id;n.fire('input')}
const again=boot({hash:'#m1action',data:app.data});for(const id of ['m1Situation','m1Action','m1Evidence'])assert.equal(again.q('#'+id).value,'یادداشت خصوصی '+id);
again.q('[data-open="session"]').click();for(let i=1;i<=8;i++){again.q('.module-card[data-open="m'+i+'"]').click();assert.equal(again.active(),'m'+i);again.q('#backBtn').click();assert.equal(again.active(),'session')}
assert.equal(again.q('#doneCount').textContent,'۸');again.q('#displayMode').click();assert.ok(again.doc.body.classList.contains('presenting'));again.q('#displayMode').click();assert.ok(!again.doc.body.classList.contains('presenting'));
again.q('[data-open="profile"]').click();again.q('.role[data-value="manager"]').click();again.q('.module-card[data-open="m6"]').click();assert.ok(again.q('#caseIntro').textContent.includes('چند سرپرست'));
again.q('[data-open="m5"]').click();again.q('#calcGrid').click();assert.equal(again.alerts.length,1);
for(let i=0;i<12;i++)again.q('.scale-options button[data-index="'+i+'"][data-value="5"]').click();again.q('#calcGrid').click();assert.ok(again.q('#gridResult').classList.contains('show'));assert.equal(again.q('#marker').style.left,'100%');
const denied=boot({hash:'#m1action',blocked:true});denied.q('#m1Action').value='اقدام';denied.q('#m1Action').fire('input');assert.ok(denied.q('#noteStatus').textContent.includes('دسترس نیست'));
const clean=boot();assert.ok(!/[A-Za-z]{3,}/.test(clean.doc.textContent),'English leaked into visible interface');
const ids=clean.all('[id]').map(e=>e.id);assert.equal(new Set(ids).size,ids.length,'duplicate IDs');
for(const b of clean.all('[data-open]'))assert.ok(routes.includes(b.dataset.open));
for(const link of clean.all('a')){const href=link.getAttribute('href');if(href.startsWith('#'))assert.ok(clean.q(href),'missing '+href)}
console.log('PASS: 18 routes, three core steps, one non-quiz case, optional model/office links, back navigation, private notes persistence, roles, old grid, classroom mode, blocked storage, Persian interface and unique IDs.');

const tri=boot({hash:'#assessment'}),core=tri.test;
assert.equal(tri.all('[data-tri-plot]').length,1);assert.equal(tri.q('[data-tri-dot]').getAttribute('visibility'),'hidden');assert.equal(tri.all('[data-tri-option]').length,3);assert.equal(tri.all('[data-tri-case]').length,8);
core.triCases.forEach(c=>{assert.equal(c.options.length,3);assert.equal(new Set(c.options.map(o=>o.focus)).size,3);c.options.forEach(o=>{assert.equal(o.w.reduce((a,b)=>a+b,0),1);assert.equal(o.w[o.focus],1)})});
tri.q('[data-tri-option="plan"]').click();assert.equal(tri.q('#triDone').textContent,'۱ از ۸ موقعیت');assert.equal(tri.q('[data-tri-dot]').getAttribute('cx'),'210.000');assert.equal(tri.q('[data-tri-dot]').getAttribute('cy'),'60.000');
tri.q('[data-tri-option="support"]').click();assert.equal(tri.q('#triDone').textContent,'۱ از ۸ موقعیت');assert.equal(tri.q('[data-tri-dot]').getAttribute('cx'),'375.000');assert.equal(tri.all('[data-tri-dot]').length,1);
assert.equal(tri.q('#triModelReadout'),null);
tri.q('[data-tri-case="7"]').click();tri.q('#triNext').click();assert.equal(core.triCurrent().item.id,'quality');assert.ok(tri.q('#triCaseStatus').textContent.includes('باقی‌مانده'));
tri.q('#triPrev').click();assert.equal(core.triCurrent().item.id,'shift');
function chooseAll(app,focuses){for(let i=0;i<8;i++){app.q('[data-tri-case="'+i+'"]').click();const opt=app.test.triCases[i].options.find(o=>o.focus===focuses[i]);app.q('[data-tri-option="'+opt.id+'"]').click()}}
const fixtures=[[[0,0,0,0,0,0,0,0],'T'],[[1,1,1,1,1,1,1,1],'P'],[[2,2,2,2,2,2,2,2],'C'],[[0,0,0,0,1,1,1,1],'TP'],[[0,0,0,0,2,2,2,2],'TC'],[[1,1,1,1,2,2,2,2],'PC'],[[0,0,0,1,1,1,2,2],'M']];
for(const [focuses,key] of fixtures){const a=boot({hash:'#assessment'});chooseAll(a,focuses);const result=a.test.triCalculate(a.test.getState().triangle.answers);assert.equal(a.test.triClassify(result.raw),key);assert.equal(result.complete,8);assert.equal(result.percentages.reduce((a,b)=>a+b,0),100);a.q('#triNext').click();assert.equal(a.q('#triQuestion').hidden,true);assert.equal(a.q('#triReport').hidden,false);assert.equal(a.q('#triPersonalAnalysis').hidden,true);assert.equal(a.q('#triResultTitle').textContent,a.test.triProfiles[key].title);a.q('#triAnalysisBtn').click();assert.equal(a.q('#triPersonalAnalysis').hidden,false);assert.equal(a.all('#triPersonalAnalysis h4').length,4);assert.ok(a.q('#triPersonalAnalysis').textContent.includes(a.test.triProfiles[key].action));a.q('#triAnalysisBtn').click();assert.equal(a.q('#triPersonalAnalysis').hidden,true)}
chooseAll(tri,[0,0,0,0,0,0,0,0]);assert.equal(tri.q('#triProgressBar').style.width,'100%');tri.q('#triNext').click();tri.q('#triAnalysisBtn').click();
const persisted=boot({hash:'#assessment',data:tri.data});assert.equal(persisted.q('#triReport').hidden,false);assert.equal(persisted.q('#triPersonalAnalysis').hidden,false);assert.equal(persisted.q('[data-tri-dot]').getAttribute('cy'),'60.000');
persisted.q('[data-tri-action]').click();assert.equal(persisted.active(),'m1action');persisted.q('#m1Action').value='انتظار روشن';persisted.q('#m1Action').fire('input');
persisted.q('[data-open="assessment"]').click();persisted.q('[data-tri-edit]').click();assert.equal(persisted.q('#triReport').hidden,true);assert.equal(persisted.q('#triQuestion').hidden,false);persisted.q('[data-tri-option="support"]').click();assert.equal(persisted.test.triCalculate(persisted.test.getState().triangle.answers).complete,8);assert.equal(persisted.q('#triNext').textContent,'مشاهده نتیجه');persisted.q('#triNext').click();assert.equal(persisted.q('#triPersonalAnalysis').hidden,true);
persisted.q('#triRestart').click();assert.equal(persisted.q('[data-tri-dot]').getAttribute('visibility'),'hidden');assert.equal(persisted.q('#triDone').textContent,'۰ از ۸ موقعیت');assert.equal(persisted.q('#m1Action').value,'انتظار روشن');
const oldState={answers:{m1Action:'یادداشت قدیمی'},triangle:{version:1,answers:{shift:{first:'plan',second:'support'}}}};
const legacy=boot({hash:'#assessment',data:{behparvar_session1_v4:JSON.stringify(oldState)}});assert.equal(legacy.test.getState().triangle.version,2);assert.equal(legacy.test.triCalculate(legacy.test.getState().triangle.answers).complete,0);assert.equal(legacy.test.getState().trianglePrevious.answers.shift.first,'plan');assert.equal(legacy.q('#m1Action').value,'یادداشت قدیمی');
const invalid=core.triNormalize({version:2,current:100,answers:{shift:'fake',quality:{first:'schedule'}},finished:true,analysisOpen:true});assert.equal(invalid.current,0);assert.equal(invalid.finished,false);assert.equal(Object.keys(invalid.answers).length,0);
const blocked=boot({hash:'#assessment',blocked:true});blocked.q('[data-tri-option="plan"]').click();assert.equal(blocked.q('[data-tri-dot]').getAttribute('visibility'),'visible');assert.ok(blocked.q('#triCaseStatus').textContent.includes('ذخیره مرورگر'));
assert.equal(core.triPoint(null),null);for(let i=0;i<3;i++){const s=[0,0,0];s[i]=1;const p=core.triPoint(s);assert.equal(p.x,[210,375,45][i]);assert.equal(p.y,[60,295,295][i])}
let seed=816;function rand(n){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed%n}
for(let run=0;run<1000;run++){const ans={},expected=[0,0,0];for(const c of core.triCases){if(rand(4)===0)continue;const o=c.options[rand(3)];ans[c.id]=o.id;expected[o.focus]++}const result=core.triCalculate(ans);assert.equal(JSON.stringify(result.raw),JSON.stringify(expected));assert.equal(result.total,expected.reduce((a,b)=>a+b,0));if(result.total){assert.equal(result.percentages.reduce((a,b)=>a+b,0),100);const p=core.triPoint(result.shares);assert.ok(p.x>=45&&p.x<=375&&p.y>=60&&p.y<=295)}}
again.q('#reset').click();assert.ok(again.reloaded);assert.equal(Object.keys(again.data).length,0);
console.log('PASS: single-choice replacement, all 7 profile branches, private analysis toggle, completion/missing-case flow, one live SVG, 100% extreme scores, 1000 independent score fixtures, persistence, v1 archive, scoped reset and no-storage operation.');

// The guide accounts for all 120 minutes and every link leads to a real lesson.
const guide=boot({hash:'#workshop'});
assert.equal(guide.all('#workshop [data-minutes]').reduce((n,e)=>n+Number(e.dataset.minutes),0),120);
for(const a of guide.all('#workshop [data-open]')){a.click();assert.equal(guide.active(),a.dataset.open)}
const oldAnswers={m1scenario:'balanced',m1office:'clarify',m1choice:'context',m1Action:'یک رفتار مشخص'};
const retained=boot({data:{behparvar_session1_v4:JSON.stringify({answers:oldAnswers})}});
assert.equal(JSON.stringify(retained.test.getState().answers),JSON.stringify(oldAnswers));
// Handout links reveal the selected tool; printing expands and then restores disclosures.
const handout=fs.readFileSync(__dirname+'/handout-module-1.html','utf8');
const handoutScript=handout.match(/<script>([\s\S]*?)<\/script>/)[1];
const handDoc=parse(handout.replace(/<style>[\s\S]*?<\/style>/g,'').replace(/<script>[\s\S]*?<\/script>/g,''));
handDoc.getElementById=id=>handDoc.querySelector('#'+id);
const handLocation={hash:''},handEvents={};let prints=0;
vm.runInNewContext(handoutScript,{document:handDoc,location:handLocation,window:{addEventListener:(n,f)=>handEvents[n]=f,print:()=>prints++}});
assert.equal(handDoc.querySelectorAll('.resource-tool').length,3);
assert.ok(handDoc.querySelectorAll('.resource-tool').every(x=>!x.open));
handLocation.hash='#language';handEvents.hashchange();assert.equal(handDoc.getElementById('language').open,true);
handEvents.beforeprint();assert.ok(handDoc.querySelectorAll('.resource-tool').every(x=>x.open));handEvents.afterprint();assert.equal(handDoc.getElementById('delegate').open,false);assert.equal(handDoc.getElementById('language').open,true);
handDoc.getElementById('printHandout').click();assert.equal(prints,1);
for(const link of handDoc.querySelectorAll('a')){const href=link.getAttribute('href');if(href.startsWith('#'))assert.ok(handDoc.querySelector(href));if(href.startsWith('./#'))assert.ok(routes.includes(href.slice(3)))}
for(const text of [html,handout]){assert.ok(!text.includes('data:font/woff2;base64,'));assert.ok(text.includes('assets/vazirmatn.woff2'))}
console.log('PASS: full 120-minute guide, legacy notes retained, three linked handout tools, print expansion/restoration and shared local font.');
const journey=boot({hash:'#assessment'});assert.equal(journey.test.getState().visited.m1,true);chooseAll(journey,[0,1,2,0,1,2,0,1]);journey.q('#triNext').click();journey.q('[data-tri-continue]').click();assert.equal(journey.active(),'m1cases');journey.q('#m1cases [data-open="m1learning"]').click();assert.equal(journey.active(),'m1learning');journey.q('#m1learning [data-open="m2"]').click();assert.equal(journey.active(),'m2');
const free=boot({hash:'#m1'});free.q('#m1 [data-open="m1learning"]').click();assert.equal(free.active(),'m1learning');assert.equal(free.test.triCalculate(free.test.getState().triangle.answers).complete,0);
console.log('PASS: assessment → case → takeaway → module two; optional skipping; module-one seen status.');
