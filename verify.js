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
 removeAttribute(k){delete this.attrs[k]}setAttribute(k,v){this.attrs[k]=String(v)}getAttribute(k){return this.attrs[k]}
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
 const context={document:doc,localStorage:storage,location,history:{replaceState:(a,b,h)=>location.hash=h,pushState:(a,b,h)=>location.hash=h},window:{scrollTo:()=>{},addEventListener:(n,f)=>events[n]=f},alert:t=>alerts.push(t),confirm:()=>true,console};
 vm.runInNewContext(script,context,{timeout:2000});
 return{doc,data,events,alerts,location,test:context.__triangleTests,get reloaded(){return reloaded},q:s=>doc.querySelector(s),all:s=>doc.querySelectorAll(s),active:()=>doc.querySelector('.view.active').id};
}
const app=boot();
assert.equal(app.active(),'home');
assert.equal(app.all('.module-card').length,6,'exactly six workshop sections');
for(const id of ['home','m1','m2','leaders','techniques','visuals','diseases','action','assessment'])assert.equal(boot({hash:'#'+id}).active(),id);
const aliases={session:'home',workshop:'home',profile:'home',m3:'leaders',m4:'techniques',m5:'visuals',m6:'diseases',m7:'m1',m8:'action',m1cases:'m2',m1model:'m1',m1learning:'action',m1action:'action',m1office:'m2'};
for(const [old,target] of Object.entries(aliases))assert.equal(boot({hash:'#'+old}).active(),target,'old bookmark '+old);
assert.equal(boot({hash:'#unknown'}).active(),'home');
const ids=app.all('[id]').map(e=>e.id);assert.equal(new Set(ids).size,ids.length,'unique IDs');
for(const a of app.all('[data-open]')){a.click();assert.equal(app.active(),a.dataset.open)}
for(const a of app.all('a')){const href=a.getAttribute('href');if(href.startsWith('#'))assert.ok(app.q(href),'broken anchor '+href)}
for(const key of ['conversation','nadella','mulally','tech_credibility','tech_charisma','tech_reward','tech_recognition','nitpicker']){
 const options=app.all('[data-question="'+key+'"]');assert.equal(options.length,3);
 const messages=new Set();for(const b of options){b.click();assert.equal(app.q('#'+key+'Feedback').hidden,false);messages.add(app.q('#'+key+'Feedback').textContent);assert.equal(app.all('[data-question="'+key+'"][aria-pressed="true"]').length,1)}assert.equal(messages.size,3,'distinct feedback for '+key);
}
const returned=boot({data:app.data});for(const key of ['conversation','nadella','mulally','tech_credibility','tech_charisma','tech_reward','tech_recognition','nitpicker'])assert.equal(returned.q('#'+key+'Feedback').hidden,false,'answer restored');
app.q('[data-leader="mulally"]').click();assert.equal(app.q('#leader-nadella').hidden,true);assert.equal(app.q('#leader-mulally').hidden,false);app.q('[data-leader="nadella"]').click();assert.equal(app.q('#leader-mulally').hidden,true);
app.q('#calcGrid').click();assert.equal(app.alerts.length,1,'missing answers');
for(let i=0;i<12;i++)app.q('.scale-options button[data-index="'+i+'"][data-value="5"]').click();
app.q('#calcGrid').click();assert.equal(app.q('#marker').style.left,'100%');assert.equal(app.q('#marker').style.bottom,'100%');assert.ok(app.q('#gridResult').classList.contains('show'));
app.q('.scale-options button[data-index="1"][data-value="1"]').click();assert.ok(!app.q('#gridResult').classList.contains('show'),'changed answer invalidates analysis');assert.equal(app.q('#marker').style.display,'none');
for(let i=0;i<12;i++)app.q('.scale-options button[data-index="'+i+'"][data-value="'+(i%2?1:5)+'"]').click();app.q('#calcGrid').click();assert.equal(app.q('#marker').style.left,'100%');assert.equal(app.q('#marker').style.bottom,'0%');
for(let i=0;i<12;i++)app.q('.scale-options button[data-index="'+i+'"][data-value="3"]').click();app.q('#calcGrid').click();assert.equal(app.q('#marker').style.left,'50%');assert.equal(app.q('#marker').style.bottom,'50%');
app.q('[data-question="action"][data-value="clarify"]').click();app.q('#actionWhen').value='فردا ساعت ۹';app.q('#actionWhen').fire('input');
const resumed=boot({hash:'#action',data:app.data});assert.equal(resumed.q('#actionWhen').value,'فردا ساعت ۹');assert.equal(resumed.q('[data-question="action"][data-value="clarify"]').getAttribute('aria-pressed'),'true');
const legacyNotes=boot({data:{behparvar_session1_v4:JSON.stringify({answers:{m1Situation:'تحویل شیفت',m1Action:'یادداشت قبلی',m1Evidence:'شاهد قبلی'},grid:{0:5}})}});assert.ok(legacyNotes.q('#previousNotes').textContent.includes('یادداشت قبلی'));assert.equal(legacyNotes.q('.scale-options button[data-index="0"][data-value="5"]').getAttribute('aria-pressed'),'true');
const blockedNotes=boot({blocked:true});blockedNotes.q('#actionWhen').value='متن';blockedNotes.q('#actionWhen').fire('input');assert.ok(blockedNotes.q('#noteStatus').textContent.includes('دسترس نیست'));
app.q('#displayMode').click();assert.ok(app.doc.body.classList.contains('presenting'));app.q('#displayMode').click();assert.ok(!app.doc.body.classList.contains('presenting'));
app.q('#reset').click();assert.ok(app.reloaded);assert.equal(Object.keys(app.data).length,0);
assert.ok(!html.includes('یک کیس، سه نگاه'));assert.ok(!html.includes('چه چیزی با خودم می‌برم'));assert.ok(!html.includes('ماژول ۸'));
const handout=fs.readFileSync(__dirname+'/handout-module-1.html','utf8');for(const file of [html,handout])assert.ok(file.includes('assets/vazirmatn.woff2'));
assert.ok(handout.includes('./#m1'));assert.ok(handout.includes('./#m2'));assert.ok(handout.includes('./#leaders'));
console.log('PASS: 6 sections; 9 views; 14 legacy bookmarks; 24 option-specific feedbacks; saved answers, notes and prior notes; grid scores and stale-result invalidation; class mode; blocked storage; reset; anchors and handout.');
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
persisted.q('[data-tri-action]').click();assert.equal(persisted.active(),'action');persisted.q('#actionWhen').value='فردا';persisted.q('#actionWhen').fire('input');
persisted.q('[data-open="assessment"]').click();persisted.q('[data-tri-edit]').click();assert.equal(persisted.q('#triReport').hidden,true);assert.equal(persisted.q('#triQuestion').hidden,false);persisted.q('[data-tri-option="support"]').click();assert.equal(persisted.test.triCalculate(persisted.test.getState().triangle.answers).complete,8);assert.equal(persisted.q('#triNext').textContent,'مشاهده نتیجه');persisted.q('#triNext').click();assert.equal(persisted.q('#triPersonalAnalysis').hidden,true);
persisted.q('#triRestart').click();assert.equal(persisted.q('[data-tri-dot]').getAttribute('visibility'),'hidden');assert.equal(persisted.q('#triDone').textContent,'۰ از ۸ موقعیت');assert.equal(persisted.q('#actionWhen').value,'فردا');
const oldState={answers:{m1Action:'یادداشت قدیمی'},triangle:{version:1,answers:{shift:{first:'plan',second:'support'}}}};
const legacy=boot({hash:'#assessment',data:{behparvar_session1_v4:JSON.stringify(oldState)}});assert.equal(legacy.test.getState().triangle.version,2);assert.equal(legacy.test.triCalculate(legacy.test.getState().triangle.answers).complete,0);assert.equal(legacy.test.getState().trianglePrevious.answers.shift.first,'plan');assert.ok(legacy.q('#previousNotes').textContent.includes('یادداشت قدیمی'));
const invalid=core.triNormalize({version:2,current:100,answers:{shift:'fake',quality:{first:'schedule'}},finished:true,analysisOpen:true});assert.equal(invalid.current,0);assert.equal(invalid.finished,false);assert.equal(Object.keys(invalid.answers).length,0);
const blocked=boot({hash:'#assessment',blocked:true});blocked.q('[data-tri-option="plan"]').click();assert.equal(blocked.q('[data-tri-dot]').getAttribute('visibility'),'visible');assert.ok(blocked.q('#triCaseStatus').textContent.includes('ذخیره مرورگر'));
assert.equal(core.triPoint(null),null);for(let i=0;i<3;i++){const s=[0,0,0];s[i]=1;const p=core.triPoint(s);assert.equal(p.x,[210,375,45][i]);assert.equal(p.y,[60,295,295][i])}
let seed=816;function rand(n){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed%n}
for(let run=0;run<1000;run++){const ans={},expected=[0,0,0];for(const c of core.triCases){if(rand(4)===0)continue;const o=c.options[rand(3)];ans[c.id]=o.id;expected[o.focus]++}const result=core.triCalculate(ans);assert.equal(JSON.stringify(result.raw),JSON.stringify(expected));assert.equal(result.total,expected.reduce((a,b)=>a+b,0));if(result.total){assert.equal(result.percentages.reduce((a,b)=>a+b,0),100);const p=core.triPoint(result.shares);assert.ok(p.x>=45&&p.x<=375&&p.y>=60&&p.y<=295)}}

console.log('PASS: retained triangle; seven profiles, completion, editing, private analysis, persistence, migration, scoped reset and 1,000 scoring fixtures.');

const techniquesTest=boot({hash:'#techniques'});
const techniqueIds=['credibility','charisma','reward','recognition'];
for(const id of techniqueIds){
 techniquesTest.q('.technique-switch [data-technique="'+id+'"]').click();
 assert.equal(techniquesTest.all('.technique-page').filter(e=>!e.hidden).length,1,'one technique visible');
 assert.equal(techniquesTest.q('#technique-'+id).hidden,false);
 assert.equal(techniquesTest.q('.technique-switch [data-technique="'+id+'"]').getAttribute('aria-pressed'),'true');
 assert.ok(techniquesTest.q('#technique-'+id+' .key-message strong').textContent.length>10,'visible key message');
 assert.ok(techniquesTest.all('#technique-'+id+' .roleplay-dialogue p').length>=6,'at least six dialogue turns');
 assert.ok(techniquesTest.q('#technique-'+id+' .roleplay-roles').textContent.includes('نفر اول'));
 assert.ok(techniquesTest.q('#technique-'+id+' .roleplay-roles').textContent.includes('نفر دوم'));
 assert.ok(techniquesTest.q('#technique-'+id+' .roleplay-observe').textContent.includes('تکنیک را کجا دیدیم'));
 techniquesTest.q('[data-question="tech_'+id+'"]').click();
 assert.equal(techniquesTest.q('#tech_'+id+'Feedback').hidden,false);
}
const techniqueReload=boot({hash:'#techniques',data:techniquesTest.data});
assert.equal(techniqueReload.q('#technique-recognition').hidden,false,'last open technique restored');
for(const id of techniqueIds)assert.equal(techniqueReload.q('#tech_'+id+'Feedback').hidden,false,'technique response restored');
const timing=html.match(/<summary>زمان‌بندی جلسه و ابزارهای همراه<\/summary><p>(.*?)<strong>/)[1];
const minutes=[...timing.matchAll(/([۰-۹]+) دقیقه/g)].map(m=>Number(m[1].replace(/[۰-۹]/g,c=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(c))));
assert.equal(minutes.reduce((a,b)=>a+b,0),120,'four-module plan fits two hours');
assert.equal(techniquesTest.all('.technique-switch button').length,4);
console.log('PASS: 4 clickable techniques; one panel visible; 4 role-plays with 25 turns; key messages; all responses and last panel persist; total workshop time 120 minutes.');

const gallery=boot({hash:'#visuals'});
const pictureIds=['support','together','fairness','impact'];
assert.equal(gallery.all('.picture-switch button').length,4);
for(const id of pictureIds){
 gallery.q('.picture-switch [data-picture="'+id+'"]').click();
 assert.equal(gallery.all('.picture-page').filter(e=>!e.hidden).length,1,'one picture visible');
 assert.equal(gallery.q('#picture-'+id).hidden,false);
 assert.equal(gallery.q('.picture-switch [data-picture="'+id+'"]').getAttribute('aria-pressed'),'true');
 assert.ok(gallery.q('#picture-'+id+' .key-message strong').textContent.length>10);
 assert.ok(gallery.q('#picture-'+id+' .picture-discussion p').textContent.length>10);
 const img=gallery.q('#picture-'+id+' img');
 assert.ok(fs.existsSync(__dirname+'/'+img.getAttribute('src')));
 assert.ok(img.getAttribute('alt').length>15);
}
const galleryResume=boot({hash:'#visuals',data:gallery.data});
assert.equal(galleryResume.q('#picture-impact').hidden,false,'last picture persists');
assert.ok(handout.includes('./#visuals'));
console.log('PASS: four picture selectors, one picture visible, separate existing assets, alt text, key messages, discussion questions and persisted picture selection.');

const illnesses=boot({hash:'#diseases'});
assert.equal(illnesses.active(),'diseases');
assert.equal(illnesses.all('.illness-card').length,1,'one first sample');
assert.equal(illnesses.q('#nitpickerLesson').hidden,true,'lesson starts collapsed');
illnesses.q('#nitpickerToggle').click();assert.equal(illnesses.q('#nitpickerLesson').hidden,false);assert.equal(illnesses.q('#nitpickerToggle').getAttribute('aria-expanded'),'true');
assert.ok(illnesses.q('#nitpickerLesson .key-message strong').textContent.includes('چه چیزی را بهتر'));
assert.equal(illnesses.all('#nitpickerLesson .dialogue p').length,5);
assert.equal(illnesses.all('#diseaseBook a').length,3);
assert.ok(illnesses.q('#diseaseBook').textContent.includes('سیروس پرهام'));
assert.ok(illnesses.all('#diseaseBook a').some(a=>a.getAttribute('href').includes('OL5981245M')));
assert.ok(illnesses.all('#diseaseBook a').some(a=>a.getAttribute('href').includes('managers-disease')));
illnesses.q('[data-question="nitpicker"][data-value="decision"]').click();assert.equal(illnesses.q('#nitpickerFeedback').hidden,false);
const illnessReload=boot({hash:'#diseases',data:illnesses.data});assert.equal(illnessReload.q('#nitpickerLesson').hidden,false);assert.equal(illnessReload.q('[data-question="nitpicker"][data-value="decision"]').getAttribute('aria-pressed'),'true');
illnessReload.q('#nitpickerToggle').click();assert.equal(illnessReload.q('#nitpickerLesson').hidden,true);assert.equal(illnessReload.q('#nitpickerToggle').getAttribute('aria-expanded'),'false');
assert.ok(handout.includes('./#diseases'));
console.log('PASS: sixth section, one expandable lesson, five-turn example, bold lesson, source links, exercise feedback and open/choice persistence.');
