const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/\}\)\(\);\s*$/,'globalThis.__triangleTests={triCases,triCalculate,triPoint,triNormalize,triCurrent,triClassify,triProfiles,quizBank,quizQuestions,quizNormalize,quizScore,audience,audienceData,getState:()=>state};})();');
const voids=new Set(['meta','link','img','input','br','hr','source']);
class Element{
 constructor(tag,attrs={}){this.tagName=tag;this.attrs=attrs;this.children=[];this.parent=null;this.listeners={};this.style={};this.hidden='hidden' in attrs;this.value='';this.open='open' in attrs;this._text='';this.dataset={};for(const [k,v]of Object.entries(attrs))if(k.startsWith('data-'))this.dataset[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=v;
 this.dataset=new Proxy(this.dataset,{set:(target,k,v)=>{target[k]=String(v);this.attrs['data-'+k.replace(/[A-Z]/g,c=>'-'+c.toLowerCase())]=String(v);return true}});
 this.classList={contains:c=>this.className.split(/\s+/).includes(c),add:c=>{if(!this.classList.contains(c))this.className=(this.className+' '+c).trim()},remove:c=>{this.className=this.className.split(/\s+/).filter(v=>v!==c).join(' ')},toggle:(c,on)=>{const x=on??!this.classList.contains(c);this.classList[x?'add':'remove'](c);return x}};
 }
 get id(){return this.attrs.id}get className(){return this.attrs.class||''}set className(x){this.attrs.class=x}
 removeAttribute(k){delete this.attrs[k]}setAttribute(k,v){this.attrs[k]=String(v);if(k.startsWith('data-'))this.dataset[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=String(v)}getAttribute(k){return this.attrs[k]}
 appendChild(c){c.parent=this;this.children.push(c);return c}
 get textContent(){return this._text+this.children.map(x=>x.textContent).join('')}set textContent(t){this._text=String(t);this.children=[]}
 set innerHTML(t){this._html=t;this.children=[];parse(t,this)}get innerHTML(){return this._html||''}
 addEventListener(name,fn){(this.listeners[name]??=[]).push(fn)}
 click(){if(!this.disabled)this.fire('click')}fire(name){for(const fn of this.listeners[name]||[])fn({target:this,preventDefault(){}})}focus(){this.focused=true;let root=this;while(root.parent)root=root.parent;root.activeElement=this}scrollIntoView(){}
 querySelector(s){return this.querySelectorAll(s)[0]||null}
 querySelectorAll(sel){const parts=sel.trim().split(/\s+/);const out=[];const test=(e,p)=>{const attrs=[...p.matchAll(/\[([^=\]]+)(?:="([^"]*)")?\]/g)];for(const[,k,v]of attrs)if(!(k in e.attrs)||(v!==undefined&&e.attrs[k]!==v))return false;p=p.replace(/\[[^\]]*\]/g,'');const id=p.match(/#([^.#]+)/);if(id&&e.id!==id[1])return false;for(const[,c]of p.matchAll(/\.([^.#]+)/g))if(!e.classList.contains(c))return false;const tag=p.match(/^[\w-]+/);return !tag||e.tagName===tag[0]};
 const walk=e=>{for(const c of e.children){if(test(c,parts.at(-1))){let n=c.parent,ix=parts.length-2;while(ix>=0&&n){if(test(n,parts[ix]))ix--;n=n.parent}if(ix<0)out.push(c)}walk(c)}};walk(this);return out;
 }
}
function parse(markup,root=new Element('document')){let cur=root;const tokens=markup.match(/<!--[\s\S]*?-->|<![^>]*>|<[^>]*>|[^<]+/g)||[];for(const t of tokens){if(t.startsWith('<!--')||t.startsWith('<!'))continue;if(t.startsWith('</')){if(cur.parent)cur=cur.parent;continue}if(t.startsWith('<')){const m=t.match(/^<([\w-]+)([\s\S]*?)\/?\s*>$/);if(!m)continue;const attrs={};for(const a of m[2].matchAll(/([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g))attrs[a[1]]=a[2]??a[3]??a[4]??'';const n=cur.appendChild(new Element(m[1],attrs));if(!voids.has(m[1])&&!t.endsWith('/>'))cur=n;}else cur._text+=t;}return root;}
function boot({hash='',data={},blocked=false,audience='managers',display='',width=1280}={}){
 const doc=parse(html.replace(/<style>[\s\S]*?<\/style>/g,'').replace(/<script>[\s\S]*?<\/script>/g,''));doc.createElement=t=>new Element(t);doc.getElementById=id=>doc.querySelector('#'+id);doc.body=doc.querySelector('body');
 const events={},alerts=[];let reloaded=false;const initialUrl=new URL('https://example.test/?'+(audience?'audience='+audience:'')+(display?'&display='+display:'')+hash);const location={hash,href:initialUrl.href,search:initialUrl.search,reload:()=>reloaded=true,assign:h=>{const u=new URL(h,location.href);location.href=u.href;location.hash=u.hash;location.search=u.search;reloaded=true}};
 const storage={getItem:k=>{if(blocked)throw Error('blocked');return data[k]||null},setItem:(k,v)=>{if(blocked)throw Error('blocked');data[k]=v},removeItem:k=>{if(blocked)throw Error('blocked');delete data[k]}};
 const context={URL,document:doc,localStorage:storage,location,history:{replaceState:(a,b,h)=>{location.hash=new URL(h,location.href).hash;location.href=new URL(h,location.href).href},pushState:(a,b,h)=>{location.hash=new URL(h,location.href).hash;location.href=new URL(h,location.href).href}},window:{innerWidth:width,scrollTo:()=>{},addEventListener:(n,f)=>events[n]=f},alert:t=>alerts.push(t),confirm:()=>true,console};
 vm.runInNewContext(fs.readFileSync(__dirname+'/audience-content.js','utf8'),context,{timeout:10000});
 vm.runInNewContext(script,context,{timeout:10000});
 return{doc,data,events,alerts,location,viewport:context.window,test:context.__triangleTests,get reloaded(){return reloaded},q:s=>doc.querySelector(s),all:s=>doc.querySelectorAll(s),active:()=>doc.querySelector('.view.active').id};
}
const app=boot();
assert.equal(app.active(),'course');
assert.equal(app.all('.module-card').length,7,'exactly seven workshop sections');
for(const id of ['home','m1','m2','leaders','techniques','visuals','diseases','quiz','action','assessment'])assert.equal(boot({hash:'#'+id}).active(),id);
const aliases={session:'home',workshop:'home',profile:'home',m3:'leaders',m4:'techniques',m5:'visuals',m6:'diseases',m7:'quiz',m8:'action',m1cases:'m2',m1model:'m1',m1learning:'action',m1action:'action',m1office:'m2'};
for(const [old,target] of Object.entries(aliases))assert.equal(boot({hash:'#'+old}).active(),target,'old bookmark '+old);
assert.equal(boot({hash:'#unknown'}).active(),'course');
const ids=app.all('[id]').map(e=>e.id);assert.equal(new Set(ids).size,ids.length,'unique IDs');
for(const a of app.all('[data-open]')){a.click();assert.equal(app.active(),a.dataset.open)}
for(const a of app.all('a')){const href=a.getAttribute('href');if(href.startsWith('#'))assert.ok(app.q(href),'broken anchor '+href)}
for(const key of ['conversation','conversation_coordination','conversation_change','conversation_workload','nadella','mulally','tech_credibility','tech_charisma','tech_reward','tech_recognition','nitpicker']){
 const options=app.all('[data-question="'+key+'"]');assert.equal(options.length,3);
 const messages=new Set();for(const b of options){b.click();assert.equal(app.q('#'+key+'Feedback').hidden,false);messages.add(app.q('#'+key+'Feedback').textContent);assert.equal(app.all('[data-question="'+key+'"][aria-pressed="true"]').length,1)}assert.equal(messages.size,3,'distinct feedback for '+key);
}
const returned=boot({data:app.data});for(const key of ['conversation','conversation_coordination','conversation_change','conversation_workload','nadella','mulally','tech_credibility','tech_charisma','tech_reward','tech_recognition','nitpicker'])assert.equal(returned.q('#'+key+'Feedback').hidden,false,'answer restored');
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
app.q('#reset').click();assert.ok(app.reloaded);assert.equal(Object.keys(JSON.parse(app.data.behparvar_session1_v4).roleStates.managers.answers).length,0);
assert.ok(!html.includes('یک کیس، سه نگاه'));assert.ok(!html.includes('چه چیزی با خودم می‌برم'));assert.ok(!html.includes('ماژول ۸'));
const handout=fs.readFileSync(__dirname+'/handout-module-1.html','utf8');for(const file of [html,handout])assert.ok(file.includes('assets/vazirmatn.woff2'));
assert.ok(handout.includes('./#m1'));assert.ok(handout.includes('./#m2'));assert.ok(handout.includes('./#leaders'));
console.log('PASS: 7 sections; 10 views; 14 legacy bookmarks; 33 option-specific feedbacks; saved answers, notes and prior notes; grid scores and stale-result invalidation; class mode; blocked storage; reset; anchors and handout.');
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
assert.equal(minutes.reduce((a,b)=>a+b,0),120,'seven-section plan fits two hours');
assert.equal(techniquesTest.all('.technique-switch button').length,4);
console.log('PASS: 4 clickable techniques; one panel visible; 4 role-plays with 25 turns; key messages; all responses and last panel persist; total workshop time 120 minutes.');
for(const role of ['managers','supervisors']){
 const folded=boot({hash:'#techniques',audience:role});
 assert.ok(folded.q('#techniques h2').textContent.includes('فنون رهبری اثربخش'));
 assert.equal(folded.all('.technique-disclosure').length,8,'dialogue and exercise have separate disclosure controls');
 for(const id of techniqueIds){
  folded.q('.technique-switch [data-technique="'+id+'"]').click();
  const prefix='#technique-'+id;
  assert.equal(folded.all(prefix+' .technique-essentials li').length,4,'four practical bullets');
  assert.ok(folded.q(prefix+' .technique-heading p').textContent.length>50,'short plain-language explanation');
  assert.ok(folded.q(prefix+' .key-message strong').textContent.length>20,'bold takeaway');
  assert.equal(folded.all(prefix+' details').length,2,'no nested disclosure overload');
  const dialogue=folded.q(prefix+'-dialogue'),practice=folded.q(prefix+'-practice');
  for(const panel of [dialogue,practice]){
   assert.equal(panel.tagName,'details');assert.equal(panel.open,false,'starts collapsed');
   assert.ok(panel.querySelector('summary').textContent.length>15,'native keyboard-accessible toggle has a clear label');
   assert.equal(panel.getAttribute('open'),undefined);
  }
  assert.ok(dialogue.querySelector('.roleplay-dialogue'));
  assert.equal(dialogue.querySelector('.technique-exercise'),null,'choice exercise has its own control');
  assert.equal(practice.querySelectorAll('[data-question="tech_'+id+'"]').length,3);
  assert.ok(practice.querySelector('.technique-action-practice p').textContent.length>60,'applied practice is available on request');
  dialogue.open=true;practice.open=true;
  const answer=practice.querySelector('[data-question="tech_'+id+'"]');answer.click();
  const value=answer.dataset.value;
  const next=techniqueIds[(techniqueIds.indexOf(id)+1)%4];
  folded.q('.technique-switch [data-technique="'+next+'"]').click();
  assert.equal(dialogue.open,false);assert.equal(practice.open,false,'switching techniques collapses the preceding content');
  folded.q('.technique-switch [data-technique="'+id+'"]').click();
  assert.equal(practice.open,false,'returning to a technique shows the short lesson first');
  assert.equal(folded.q('[data-question="tech_'+id+'"][data-value="'+value+'"]').getAttribute('aria-pressed'),'true','collapsing preserves response');
 }
 const restored=boot({hash:'#techniques',audience:role,data:folded.data});
 assert.ok(restored.all('.technique-disclosure').every(e=>!e.open),'reload keeps examples and exercises collapsed');
 for(const id of techniqueIds)assert.equal(restored.q('#tech_'+id+'Feedback').hidden,false,'saved exercise feedback remains available inside its closed panel');
}
console.log('PASS: both audiences have short technique definitions, four practical bullets, bold takeaways and eight initially collapsed native disclosure panels; dialogue and practice are separate; switching/reloading stays compact and preserves responses.');

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
assert.equal(illnesses.all('.illness-card').length,4,'four selectable diseases');
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
for(const role of ['managers','supervisors']){
 const diseases=boot({hash:'#diseases',audience:role});
 assert.equal(diseases.q('#diseaseList').hidden,false);assert.equal(diseases.q('#diseaseDetail').hidden,true);
 for(const id of ['nitpicker','urgency','takeover','status']){
  diseases.q('[data-disease-open="'+id+'"]').click();
  assert.equal(diseases.q('#diseaseList').hidden,true);assert.equal(diseases.q('#diseaseDetail').hidden,false);
  assert.equal(diseases.all('.illness-lesson').filter(e=>!e.hidden).length,1,'only one lesson is visible');
  assert.equal(diseases.q('#'+id+'Lesson').hidden,false);assert.equal(diseases.q('#'+id+'Lesson h3').focused,true);
  assert.equal(diseases.q('#'+id+'Toggle').getAttribute('aria-expanded'),'true');
  assert.equal(diseases.all('#'+id+'Lesson .disease-pattern h4').length,3,'definition, symptoms and treatment');
  assert.equal(diseases.all('#'+id+'Lesson .disease-pattern li').length,6,'three symptoms and three corrective actions');
  assert.equal(diseases.all('#'+id+'Lesson .dialogue p').length,5,'a complete role-play');
  const key=id==='nitpicker'?id:'disease_'+id;
  const messages=new Set();
  for(const option of diseases.all('[data-question="'+key+'"]')){option.click();messages.add(diseases.q('#'+key+'Feedback').textContent)}
  assert.equal(messages.size,3,'all exercise choices have distinct feedback');
  const again=boot({hash:'#diseases',audience:role,data:diseases.data});
  assert.equal(again.q('#'+id+'Lesson').hidden,false);assert.equal(again.q('#'+key+'Feedback').hidden,false);
  diseases.q('[data-disease-back]').click();assert.equal(diseases.q('#diseaseList').hidden,false);
  assert.equal(diseases.q('#'+id+'Toggle').focused,true,'return focus to the selected card');
  assert.ok(diseases.all('.illness-lesson').every(e=>e.hidden));
 }
 for(const leader of ['nadella','mulally']){
  const story=diseases.q('[data-leader-story="'+leader+'"]');assert.ok(story);
  assert.equal(diseases.all('[data-leader-story="'+leader+'"] p').length,3,'short connected narrative');
  const card=diseases.q('[data-audience-copy="leader-'+leader+'-card"]');
  assert.ok(card.querySelector('.mini-key').textContent.includes('فرضی'),'fictional application clearly separated');
  const links=card.querySelectorAll('.source a').map(e=>e.getAttribute('href'));
  assert.ok(links.some(h=>h.includes(leader==='nadella'?'empathy-innovation-accessibility':'ethix.org/2010/07/15/')),'direct source for actual story');
 }
}
const legacyDisease=boot({hash:'#diseases',data:{behparvar_session1_v4:JSON.stringify({answers:{workshop_nitpickerOpen:true}})}});
assert.equal(legacyDisease.q('#nitpickerLesson').hidden,false,'legacy open lesson retained');
console.log('PASS: four diseases for both roles; one lesson at a time; definition/symptoms/treatment; five-turn role-plays; feedback and state persistence; legacy migration; documented leader narratives.');

// Quiz keys are asserted independently of the scoring function.
const expectedKeys=['C','A','D','B','C','D','A','B','C','D'];
const quiz=boot({hash:'#quiz'}),bank=quiz.test.quizQuestions;
assert.equal(JSON.stringify(quiz.test.quizBank),JSON.stringify(JSON.parse(fs.readFileSync(__dirname+'/quiz-questions.json','utf8')).audiences.managers),'active role and authoring banks match');
assert.equal(bank.length,10);assert.equal(new Set(bank.map(q=>q.id)).size,10);
assert.equal(JSON.stringify([...new Set(bank.map(q=>q.source))].sort()),JSON.stringify(['m1','m2','leaders','techniques','visuals','diseases'].sort()),'all six learning sections covered');
bank.forEach((q,i)=>{
 assert.equal(q.correct,expectedKeys[i]);assert.equal(q.options.length,4);
 assert.equal(q.options.filter(o=>o.value===q.correct).length,1);
 assert.equal(JSON.stringify(q.options.map(o=>o.value)),JSON.stringify(['A','B','C','D']));
 assert.equal(new Set(q.options.map(o=>o.label)).size,4);
 assert.ok(q.basis.length>30&&q.concept.length>10&&q.hint.length>20);
 for(const o of q.options)assert.ok(o.label.length>40&&o.feedback.length>35,'substantive option and explanation');
 assert.ok(quiz.q('#'+q.source));
});
assert.equal(quiz.all('[data-quiz-option]').length,4);
assert.equal(quiz.q('#quizQuestionText').textContent,bank[0].question);
assert.equal(quiz.q('#quizReport').hidden,true);assert.equal(quiz.all('#quizKeyBody tr').length,0);assert.equal(quiz.all('.quiz-review').length,0);assert.equal(quiz.q('#quizScoreTitle').textContent,'');
assert.equal(quiz.q('#quizPrev').disabled,true);assert.equal(quiz.q('#quizNext').disabled,true);
quiz.q('#quizNext').click();assert.equal(quiz.test.getState().quiz.current,0,'cannot skip unanswered question');
quiz.q('[data-quiz-option="A"]').click();assert.equal(quiz.all('[data-quiz-option][aria-pressed="true"]').length,1);assert.equal(quiz.q('#quizReport').hidden,true);assert.equal(quiz.all('.quiz-review').length,0,'no immediate explanation');
quiz.q('#quizNext').click();quiz.q('[data-quiz-option="B"]').click();quiz.q('#quizPrev').click();
assert.equal(quiz.q('[data-quiz-option="A"]').getAttribute('aria-pressed'),'true');quiz.q('[data-quiz-option="C"]').click();
const partialQuiz=boot({hash:'#quiz',data:quiz.data});assert.equal(partialQuiz.test.getState().quiz.answers.q1,'C');assert.equal(partialQuiz.test.getState().quiz.answers.q2,'B');assert.equal(partialQuiz.q('#quizReport').hidden,true);
for(let i=0;i<10;i++){
 assert.equal(partialQuiz.test.getState().quiz.current,i);assert.equal(partialQuiz.q('#quizQuestionText').textContent,bank[i].question);
 partialQuiz.q('[data-quiz-option="'+expectedKeys[i]+'"]').click();
 assert.equal(partialQuiz.all('#quizKeyBody tr').length,0,'answer key withheld even after selecting tenth response');
 assert.equal(partialQuiz.q('#quizReport').hidden,true);
 partialQuiz.q('#quizNext').click();
}
assert.equal(partialQuiz.q('#quizReport').hidden,false);assert.equal(partialQuiz.q('#quizAttempt').hidden,true);assert.equal(partialQuiz.q('#quizScoreTitle').textContent,'۱۰ از ۱۰');
assert.equal(partialQuiz.all('#quizKeyBody tr').length,10);assert.equal(partialQuiz.all('.quiz-review').length,10);assert.equal(partialQuiz.all('.quiz-review-option').length,40);
assert.equal(partialQuiz.all('.quiz-review').filter(e=>e.open).length,0,'analysis is clickable');
partialQuiz.q('[data-quiz-review="q10"]').click();assert.equal(partialQuiz.q('#quiz-review-q10').open,true);
const reportReload=boot({hash:'#quiz',data:partialQuiz.data});assert.equal(reportReload.q('#quizReport').hidden,false);assert.equal(reportReload.q('#quizScoreTitle').textContent,'۱۰ از ۱۰');
for(const q of bank){
 const review=reportReload.q('#quiz-review-'+q.id);assert.ok(review.textContent.includes(q.question));assert.ok(review.textContent.includes(q.basis));
 for(const o of q.options)assert.ok(review.textContent.includes(o.feedback),'all options explained');
 reportReload.q('[data-quiz-source="'+q.id+'"]').click();assert.equal(reportReload.active(),q.source,'source route');
 if(q.leader)assert.equal(reportReload.q('#leader-'+q.leader).hidden,false);
 if(q.source==='m2')assert.equal(reportReload.q('#conversation-report').hidden,false,'quiz source opens the original report case');
 if(q.technique)assert.equal(reportReload.q('#technique-'+q.technique).hidden,false);
 if(q.picture)assert.equal(reportReload.q('#picture-'+q.picture).hidden,false);
 if(q.source==='diseases')assert.equal(reportReload.q('#nitpickerLesson').hidden,false);
}
reportReload.q('#actionWhen').value='یادداشت باقی بماند';reportReload.q('#actionWhen').fire('input');
reportReload.q('[data-question="conversation"][data-value="clear"]').click();
reportReload.q('.scale-options button[data-index="0"][data-value="5"]').click();
chooseAll(reportReload,[0,1,2,0,1,2,0,1]);
const retainedBefore=JSON.stringify({answers:reportReload.test.getState().answers,grid:reportReload.test.getState().grid,triangle:reportReload.test.getState().triangle});
reportReload.q('#quizRestart').click();assert.equal(reportReload.q('#quizReport').hidden,true);assert.equal(reportReload.all('.quiz-review').length,0);assert.equal(reportReload.all('#quizKeyBody tr').length,0);assert.equal(reportReload.q('#quizScoreTitle').textContent,'');assert.equal(reportReload.test.getState().quiz.current,0);assert.equal(Object.keys(reportReload.test.getState().quiz.answers).length,0);
assert.equal(JSON.stringify({answers:reportReload.test.getState().answers,grid:reportReload.test.getState().grid,triangle:reportReload.test.getState().triangle}),retainedBefore,'restart preserves all other exercises and notes');
const withQuizState=q=>({behparvar_session1_v4:JSON.stringify({answers:{workshop_when:'قبلی'},quiz:q})});
const quizInvalid=boot({hash:'#quiz',data:withQuizState({version:2,current:100,submitted:true,answers:{q1:'fake',q2:'A',unknown:'D'}})});
assert.equal(quizInvalid.test.getState().quiz.current,0);assert.equal(quizInvalid.test.getState().quiz.submitted,false);assert.equal(Object.keys(quizInvalid.test.getState().quiz.answers).length,1);
assert.equal(quizInvalid.q('#quizReport').hidden,true);assert.equal(quizInvalid.all('.quiz-review').length,0);
const obsoleteQuiz=boot({hash:'#quiz',data:withQuizState({version:0,current:5,answers:{q1:'C'},submitted:true})});assert.equal(Object.keys(obsoleteQuiz.test.getState().quiz.answers).length,0);assert.equal(obsoleteQuiz.q('#actionWhen').value,'قبلی');
const nineAnswers=Object.fromEntries(bank.slice(1).map((q,i)=>[q.id,expectedKeys[i+1]]));
const incompleteQuiz=boot({hash:'#quiz',data:withQuizState({version:2,current:9,answers:nineAnswers,submitted:true})});assert.equal(incompleteQuiz.q('#quizReport').hidden,true);incompleteQuiz.q('#quizNext').click();assert.equal(incompleteQuiz.test.getState().quiz.current,0,'final submission finds earlier unanswered question');assert.equal(incompleteQuiz.all('.quiz-review').length,0);
incompleteQuiz.q('[data-quiz-option="C"]').click();for(let i=0;i<10;i++)incompleteQuiz.q('#quizNext').click();assert.equal(incompleteQuiz.q('#quizReport').hidden,false);
const keyScores={A:2,B:2,C:3,D:3};
for(const [value,expected] of Object.entries(keyScores)){
 const answers=Object.fromEntries(bank.map(q=>[q.id,value]));const fixture=boot({hash:'#quiz',data:withQuizState({version:2,current:9,answers,submitted:true})});assert.equal(fixture.test.quizScore(answers),expected);assert.equal(fixture.q('#quizScoreTitle').textContent,expected.toLocaleString('fa-IR')+' از ۱۰');
}
const wrongAnswers=Object.fromEntries(bank.map((q,i)=>[q.id,expectedKeys[i]==='A'?'B':'A']));
for(let score=0;score<=10;score++){
 const answers=Object.fromEntries(bank.map((q,i)=>[q.id,i<score?expectedKeys[i]:wrongAnswers[q.id]]));
 assert.equal(quiz.test.quizScore(answers),score,'independent fixture for score '+score);
}
const wrongQuiz=boot({hash:'#quiz',data:withQuizState({version:2,current:9,answers:wrongAnswers,submitted:true})});assert.equal(wrongQuiz.q('#quizScoreTitle').textContent,'۰ از ۱۰');assert.equal(wrongQuiz.all('#quizKeyBody td').filter(e=>e.textContent==='نیاز به مرور').length,10);
const blockedQuiz=boot({hash:'#quiz',blocked:true});for(const value of expectedKeys){blockedQuiz.q('[data-quiz-option="'+value+'"]').click();blockedQuiz.q('#quizNext').click()}assert.equal(blockedQuiz.q('#quizScoreTitle').textContent,'۱۰ از ۱۰');assert.ok(blockedQuiz.q('#quizStatus').textContent.includes('در دسترس نیست'));
assert.ok(handout.includes('./#quiz'));assert.equal(boot({hash:'#action'}).q('.site-nav [data-open="quiz"]').getAttribute('aria-current'),'page');
console.log('PASS: final quiz; 10 conceptual items across all six sections; 4 options each; delayed key and 40 option analyses; navigation, editing, source links, scores 0–10, report/partial persistence, blocked storage, invalid/premature state, version reset, and quiz-only restart.');

const conversations=boot({hash:'#m2'});
const conversationCases=[['report','conversation'],['coordination','conversation_coordination'],['change','conversation_change'],['workload','conversation_workload']];
assert.equal(conversations.q('#conversationList').hidden,false,'list is the initial view');
assert.equal(conversations.q('#conversationDetail').hidden,true);
assert.equal(conversations.all('[data-conversation-open]').length,4);
assert.equal(conversations.all('.conversation-page').length,4);
assert.equal(conversations.all('.conversation-page').filter(p=>!p.hidden).length,0,'no case opens before selection');
for(const [id,key] of conversationCases){
 const card=conversations.q('[data-conversation-open="'+id+'"]');card.click();
 assert.equal(conversations.q('#conversationList').hidden,true);assert.equal(conversations.q('#conversationDetail').hidden,false);
 assert.equal(conversations.all('.conversation-page').filter(p=>!p.hidden).length,1,'only the selected case is visible');
 const panel=conversations.q('#conversation-'+id);assert.equal(panel.hidden,false);
 assert.equal(conversations.all('[data-conversation-open][aria-expanded="true"]').length,1);
 assert.equal(card.getAttribute('aria-controls'),panel.id);assert.equal(card.getAttribute('aria-expanded'),'true');
 assert.equal(panel.querySelector('h3').focused,true,'focus moves to the opened conversation');
 assert.ok(panel.querySelector('.key-message strong').textContent.length>20);
 assert.ok(panel.querySelector('.conversation-heading p').textContent.length>50);
 assert.ok(panel.querySelector('.roleplay-roles').textContent.includes('نفر اول'));
 assert.ok(panel.querySelector('.roleplay-roles').textContent.includes('نفر دوم'));
 const turns=panel.querySelectorAll('.conversation-dialogue p');assert.ok(turns.length>=6&&turns.length<=7,'short usable two-person dialogue');
 assert.equal(new Set(turns.map(p=>p.querySelector('b').textContent)).size,2,'two named speakers');
 assert.ok(panel.querySelector('.conversation-agreement p').textContent.includes('·'),'explicit owners and follow-up');
 assert.ok(/[۰-۹]/.test(panel.querySelector('.conversation-agreement p').textContent),'specific time');
 const exercise=panel.querySelector('.conversation-exercise');assert.equal(exercise.open,false,'exercise stays optional until opened');exercise.open=true;
 const options=panel.querySelectorAll('[data-question="'+key+'"]');assert.equal(options.length,3);
 const feedbacks=new Set();for(const option of options){option.click();feedbacks.add(conversations.q('#'+key+'Feedback').textContent)}assert.equal(feedbacks.size,3);
 assert.equal(conversations.all('[data-question="'+key+'"][aria-pressed="true"]').length,1);
 conversations.all('[data-conversation-back]')[id==='report'||id==='change'?0:1].click();
 assert.equal(conversations.q('#conversationList').hidden,false);assert.equal(conversations.q('#conversationDetail').hidden,true);
 assert.equal(conversations.all('.conversation-page').filter(p=>!p.hidden).length,0);assert.equal(conversations.all('[data-conversation-open][aria-expanded="true"]').length,0);
 assert.equal(card.focused,true,'return restores focus to the selected list card');
}
const conversationResume=boot({hash:'#m2',data:conversations.data});
assert.equal(conversationResume.q('#conversationList').hidden,false,'reload returns to the list');
for(const [id,key] of conversationCases){
 conversationResume.q('[data-conversation-open="'+id+'"]').click();assert.equal(conversationResume.all('[data-question="'+key+'"][aria-pressed="true"]').length,1,'each case response restores independently');
 assert.equal(conversationResume.q('#'+key+'Feedback').hidden,false);
}
conversationResume.q('.site-nav [data-open="leaders"]').click();assert.equal(conversationResume.active(),'leaders');
conversationResume.q('.site-nav [data-open="m2"]').click();assert.equal(conversationResume.active(),'m2');assert.equal(conversationResume.q('#conversation-workload').hidden,false,'navigation retains current conversation until returned to list');
const oldConversation=boot({hash:'#m2',data:{behparvar_session1_v4:JSON.stringify({answers:{workshop_conversation:'clear',workshop_when:'فردا ساعت ۹'},grid:{0:5},quiz:{version:2,current:0,answers:{q1:'C'},submitted:false}})}});
const beforeCaseChanges=JSON.stringify(oldConversation.test.getState());
for(const [id] of conversationCases)oldConversation.q('[data-conversation-open="'+id+'"]').click();oldConversation.q('[data-conversation-back]').click();
assert.equal(JSON.stringify(oldConversation.test.getState()),beforeCaseChanges,'view selection does not alter any saved responses, notes, grid or quiz');
oldConversation.q('[data-conversation-open="report"]').click();assert.equal(oldConversation.q('[data-question="conversation"][data-value="clear"]').getAttribute('aria-pressed'),'true','legacy report response is preserved');assert.equal(oldConversation.q('#actionWhen').value,'فردا ساعت ۹');
const conversationsBlocked=boot({hash:'#m2',blocked:true});for(const [id,key] of conversationCases){conversationsBlocked.q('[data-conversation-open="'+id+'"]').click();conversationsBlocked.q('[data-question="'+key+'"]').click();assert.equal(conversationsBlocked.q('#'+key+'Feedback').hidden,false);conversationsBlocked.q('[data-conversation-back]').click()}
assert.ok(conversationsBlocked.q('#noteStatus').textContent.includes('در دسترس نیست'));
assert.ok(handout.includes('فهرست چهار گفت‌وگو'));
console.log('PASS: four conversation choices; closed initial list; one case at a time; both return controls and focus targets; 27 dialogue turns, distinct roles, lessons and agreements; optional exercises; legacy and new saved responses; navigation, unchanged other state and blocked storage.');

// Audience entry is a local learning-route choice, with independent progress.
const entry=boot({audience:null,hash:'#quiz'});
assert.equal(entry.active(),'home');assert.equal(entry.q('.site-nav').hidden,false);assert.equal(entry.q('#workshopOverview').hidden,true);assert.equal(entry.all('[data-audience-entry]').length,2);
assert.ok(entry.q('#audiencePrompt').textContent.includes('ابتدا'));
entry.q('[data-audience-entry="supervisors"]').click();assert.ok(entry.reloaded);
assert.equal(new URL(entry.location.href).searchParams.get('audience'),'supervisors');assert.equal(entry.location.hash,'#quiz','deep-link target survives route selection');
const supervisor=boot({audience:'supervisors',hash:'#quiz',data:entry.data});assert.equal(supervisor.active(),'quiz');assert.equal(supervisor.test.audience,'supervisors');assert.equal(supervisor.q('#audienceStatus').hidden,false);assert.ok(supervisor.q('#audienceLabel').textContent.includes('سرپرستان'));
const authored=JSON.parse(fs.readFileSync(__dirname+'/quiz-questions.json','utf8')).audiences;
const learningKeys=['conversation','conversation_coordination','conversation_change','conversation_workload','nadella','mulally','tech_credibility','tech_charisma','tech_reward','tech_recognition','nitpicker'];
for(const role of ['managers','supervisors']){
 const a=boot({audience:role});
 assert.equal(a.q('.site-nav').hidden,true);assert.equal(a.q('#workshopOverview').hidden,false);assert.equal(a.q('#workshopOverview').open,false);a.q('[data-open="m1"]').click();assert.equal(a.q('.site-nav').hidden,false);assert.equal(a.q('[data-audience-entry="'+role+'"]').getAttribute('aria-pressed'),'true');
 assert.equal(a.all('[data-audience-copy]').length,Object.keys(a.test.audienceData.copy).length,'all authored role applications are present');
 for(const node of a.all('[data-audience-copy]'))assert.ok(node.textContent.trim().length>10,'role content is nonempty');
 assert.equal(a.test.audienceData.gridStatements.length,12);assert.equal(a.test.triCases.length,8);
 assert.equal(JSON.stringify(a.test.quizBank),JSON.stringify(authored[role]),'quiz bank matches role authoring');
 for(const [id,key] of conversationCases){
  a.q('[data-conversation-open="'+id+'"]').click();assert.equal(a.q('#conversation-'+id).hidden,false);
  assert.equal(a.all('#conversation-'+id+' .conversation-dialogue p').length,id==='coordination'?6:7);
  assert.equal(a.all('[data-question="'+key+'"]').length,3);
 }
 for(const id of techniqueIds){assert.ok(a.all('#technique-'+id+' .roleplay-dialogue p').length>=6);assert.ok(a.q('#technique-'+id+' .roleplay-observe').textContent.includes('تکنیک را کجا دیدیم'))}
 for(const key of learningKeys){const feedbacks=new Set();for(const b of a.all('[data-question="'+key+'"]')){b.click();feedbacks.add(a.q('#'+key+'Feedback').textContent)}assert.equal(feedbacks.size,3,'all role feedback paths work: '+role+'/'+key)}
 a.q('.site-nav [data-open="quiz"]').click();assert.equal(a.q('#quizReport').hidden,true);
 for(let i=0;i<10;i++){
  const q=a.test.quizQuestions[i];assert.equal(q.options.length,4);assert.equal(q.correct,expectedKeys[i]);assert.ok(q.basis.length>30);
  assert.equal(new Set(q.options.map(o=>o.label)).size,4);assert.ok(q.options.every(o=>o.feedback.length>30));
  a.q('[data-quiz-option="'+expectedKeys[i]+'"]').click();assert.equal(a.all('.quiz-review').length,0);a.q('#quizNext').click();
 }
 assert.equal(a.q('#quizScoreTitle').textContent,'۱۰ از ۱۰');assert.equal(a.all('.quiz-review-option').length,40);
 a.q('[data-quiz-source="q2"]').click();assert.equal(a.active(),'m2');assert.equal(a.q('#conversation-report').hidden,false);
 assert.ok(a.all('a').some(link=>link.getAttribute('href')==='handout-module-1.html?audience='+role));
}
const managerContent=boot().test.audienceData,supervisorContent=supervisor.test.audienceData;
for(const key of Object.keys(managerContent.copy))assert.notEqual(managerContent.copy[key],supervisorContent.copy[key],'substantive role variation: '+key);
for(let i=0;i<10;i++)assert.notEqual(authored.managers.questions[i].question,authored.supervisors.questions[i].question,'each quiz scenario is adapted');
assert.ok(supervisor.q('#technique-reward').textContent.includes('قول قطعی نمی‌دهم'),'supervisor does not promise formal reward authority');
assert.ok(supervisor.q('#conversation-change').textContent.includes('تأیید شود'),'approval boundary retained in supervisor conversation');

supervisor.q('[data-open="action"]').click();supervisor.q('#actionWhen').value='اقدام سرپرست در شروع شیفت';supervisor.q('#actionWhen').fire('input');
supervisor.q('[data-open="m1"]').click();supervisor.q('.scale-options button[data-index="0"][data-value="2"]').click();
supervisor.q('[data-open="assessment"]').click();supervisor.q('[data-tri-option="support"]').click();
supervisor.q('[data-open="quiz"]').click();supervisor.q('[data-quiz-option="A"]').click();
supervisor.q('[data-open="home"]').click();supervisor.q('[data-audience-entry="managers"]').click();
const managerRoute=boot({audience:'managers',hash:'#m1',data:supervisor.data});assert.equal(managerRoute.q('#actionWhen').value,'');assert.equal(Object.keys(managerRoute.test.getState().grid).length,0);assert.equal(Object.keys(managerRoute.test.getState().quiz.answers).length,0);assert.equal(Object.keys(managerRoute.test.getState().triangle.answers).length,0);
managerRoute.q('[data-open="action"]').click();managerRoute.q('#actionWhen').value='اقدام مدیر در جلسه سرپرستان';managerRoute.q('#actionWhen').fire('input');managerRoute.q('[data-open="m1"]').click();managerRoute.q('.scale-options button[data-index="0"][data-value="5"]').click();managerRoute.q('[data-open="quiz"]').click();managerRoute.q('[data-quiz-option="C"]').click();
managerRoute.q('[data-open="home"]').click();managerRoute.q('[data-audience-entry="supervisors"]').click();
const supervisorAgain=boot({audience:null,hash:'#action',data:managerRoute.data});assert.equal(supervisorAgain.test.audience,'supervisors','stored selection restores without a URL role');assert.equal(supervisorAgain.q('#actionWhen').value,'اقدام سرپرست در شروع شیفت');assert.equal(supervisorAgain.test.getState().grid[0],2);assert.equal(supervisorAgain.test.getState().quiz.answers.q1,'A');assert.equal(supervisorAgain.test.getState().triangle.answers.shift,'support');
const explicitManager=boot({audience:'managers',hash:'#action',data:supervisorAgain.data});assert.equal(explicitManager.q('#actionWhen').value,'اقدام مدیر در جلسه سرپرستان','explicit URL role chooses its own prior state');assert.equal(explicitManager.test.getState().grid[0],5);assert.equal(explicitManager.test.getState().quiz.answers.q1,'C');
const supervisorSnapshot=JSON.stringify(JSON.parse(explicitManager.data.behparvar_session1_v4).roleStates.supervisors);
explicitManager.q('#reset').click();assert.ok(explicitManager.reloaded);assert.equal(JSON.stringify(JSON.parse(explicitManager.data.behparvar_session1_v4).roleStates.supervisors),supervisorSnapshot,'reset only clears the active route');
const managerAfterReset=boot({audience:'managers',data:explicitManager.data});assert.equal(managerAfterReset.q('#actionWhen').value,'');assert.equal(Object.keys(managerAfterReset.test.getState().quiz.answers).length,0);

const legacyAudienceData={behparvar_session1_v4:JSON.stringify({answers:{workshop_when:'یادداشت پیش از تفکیک',workshop_conversation:'clear'},grid:{0:4},quiz:{version:1,answers:{q1:'C'},submitted:false}})};
const migrateEntry=boot({audience:null,hash:'#home',data:legacyAudienceData});assert.equal(migrateEntry.active(),'home');migrateEntry.q('[data-audience-entry="managers"]').click();
const migratedAudience=boot({audience:'managers',data:migrateEntry.data});assert.equal(migratedAudience.q('#actionWhen').value,'یادداشت پیش از تفکیک');assert.equal(migratedAudience.test.getState().grid[0],4);assert.equal(migratedAudience.test.getState().quizPrevious.answers.q1,'C','old generic quiz is archived');assert.equal(Object.keys(migratedAudience.test.getState().quiz.answers).length,0,'old answers are not scored against new role questions');
migratedAudience.q('[data-audience-entry="supervisors"]').click();const cleanOtherRole=boot({audience:'supervisors',data:migratedAudience.data});assert.equal(cleanOtherRole.q('#actionWhen').value,'');assert.equal(Object.keys(cleanOtherRole.test.getState().grid).length,0,'legacy progress claimed once');assert.ok(JSON.parse(cleanOtherRole.data.behparvar_session1_v4).legacyState.answers.workshop_when);
const invalidAudience=boot({audience:null,hash:'#m4',data:{behparvar_session1_v4:JSON.stringify({schema:5,audience:'invalid',roleStates:[]})}});assert.equal(invalidAudience.active(),'home');invalidAudience.q('[data-audience-entry="supervisors"]').click();assert.equal(invalidAudience.location.hash,'#techniques','legacy deep link survives role gate');
const blockedEntry=boot({audience:null,blocked:true});blockedEntry.q('[data-audience-entry="supervisors"]').click();assert.equal(new URL(blockedEntry.location.href).searchParams.get('audience'),'supervisors');const blockedRole=boot({audience:'supervisors',hash:'#m2',blocked:true});assert.equal(blockedRole.active(),'m2');blockedRole.q('[data-conversation-open="report"]').click();blockedRole.q('[data-question="conversation"][data-value="clear"]').click();assert.equal(blockedRole.q('#conversationFeedback').hidden,false);

function bootHandout(role=null,data={}){
 const doc=parse(handout.replace(/<style>[\s\S]*?<\/style>/g,'').replace(/<script(?:[^>]*)>[\s\S]*?<\/script>/g,''));doc.getElementById=id=>doc.querySelector('#'+id);let prints=0;
 const context={URL,document:doc,location:{href:'https://example.test/handout-module-1.html'+(role?'?audience='+role:'')},localStorage:{getItem:k=>data[k]||null},window:{print:()=>prints++}};
 vm.runInNewContext(fs.readFileSync(__dirname+'/audience-content.js','utf8'),context);vm.runInNewContext(handout.match(/<script>([\s\S]*?)<\/script>/)[1],context);
 return {q:s=>doc.querySelector(s),all:s=>doc.querySelectorAll(s),get prints(){return prints}};
}
const emptyHandout=bootHandout();assert.equal(emptyHandout.q('#handoutContent').hidden,true);assert.equal(emptyHandout.q('#handoutRolePicker').hidden,false);assert.equal(emptyHandout.q('#printHandout').disabled,true);
for(const role of ['managers','supervisors']){const h=bootHandout(role);assert.equal(h.q('#handoutContent').hidden,false);assert.equal(h.q('#handoutRolePicker').hidden,true);assert.ok(h.q('#handoutAudienceLabel').textContent.includes(role==='managers'?'مدیران':'سرپرستان'));assert.equal(h.all('[data-handout-copy]').length,12);assert.ok(h.all('a').some(a=>a.getAttribute('href')==='./?audience='+role+'#m2'));h.q('#printHandout').click();assert.equal(h.prints,1)}
console.log('PASS: two audience entry routes; substantive adaptation in all seven sections, 20 quiz items, 8 conversation and 8 technique role-plays, 24 grid statements and 16 optional cases; URL/stored/deep-link selection; independent answers, notes, grid, quiz and triangle; scoped reset; one-time legacy migration and archived generic quiz; blocked-storage entry; two printable handouts.');

const homeDesign=boot({audience:null,hash:'#home'});
assert.equal(homeDesign.q('#home h1').textContent,'توسعه مهارت‌های رهبری');
assert.ok(homeDesign.q('.home-message').textContent.includes('کارکنان و کسب‌وکار'));
assert.ok(homeDesign.q('.home-description').textContent.includes('یک نسخه ثابت ندارد'));
assert.equal(homeDesign.q('#home h1').focused,true,'home focuses the course title');
assert.equal(homeDesign.doc.body.classList.contains('at-home'),true);
assert.equal(homeDesign.q('#workshopOverview').tagName,'details');assert.equal(homeDesign.q('#workshopOverview').open,false);
assert.equal(homeDesign.q('.home-scene source').getAttribute('media'),'(min-width: 900px)');assert.equal(homeDesign.q('.home-scene source').getAttribute('srcset'),'assets/behparvar-campus.webp');assert.ok(homeDesign.q('.home-scene img').getAttribute('src').startsWith('data:image/svg+xml,'),'mobile picture fallback does not select the campus image');
const homeStateBefore=JSON.stringify(homeDesign.test.getState());
homeDesign.q('#homeDisplayMode').click();assert.equal(homeDesign.doc.body.classList.contains('presenting'),true);assert.equal(homeDesign.q('#displayMode').getAttribute('aria-pressed'),'true');assert.equal(homeDesign.q('#homeDisplayMode').getAttribute('aria-pressed'),'true');assert.equal(new URL(homeDesign.location.href).searchParams.get('display'),'class');assert.equal(JSON.stringify(homeDesign.test.getState()),homeStateBefore,'display choice does not alter learning data');
homeDesign.q('[data-audience-entry="managers"]').click();assert.equal(new URL(homeDesign.location.href).searchParams.get('display'),'class');assert.equal(new URL(homeDesign.location.href).searchParams.get('audience'),'managers');
const classroomEntry=boot({audience:'managers',display:'class',hash:'#m1',data:homeDesign.data});assert.equal(classroomEntry.doc.body.classList.contains('presenting'),true);assert.equal(classroomEntry.q('.site-nav').hidden,false);assert.equal(classroomEntry.q('#audienceStatus').hidden,false);
classroomEntry.q('[data-open="home"]').click();assert.equal(classroomEntry.q('.site-nav').hidden,false);assert.equal(classroomEntry.q('#audienceStatus').hidden,true);assert.equal(classroomEntry.q('#workshopOverview').hidden,false);assert.equal(classroomEntry.q('#workshopOverview').open,false);assert.equal(classroomEntry.q('#home h1').focused,true);
classroomEntry.q('#displayMode').click();assert.equal(classroomEntry.doc.body.classList.contains('presenting'),false);assert.equal(classroomEntry.q('#homeDisplayMode').getAttribute('aria-pressed'),'false');assert.equal(new URL(classroomEntry.location.href).searchParams.has('display'),false);
const classroomDeep=boot({audience:null,display:'class',hash:'#m2'});classroomDeep.q('[data-audience-entry="supervisors"]').click();assert.equal(classroomDeep.location.hash,'#m2');assert.equal(new URL(classroomDeep.location.href).searchParams.get('display'),'class','pending lesson and classroom flag both survive entry');
assert.ok(handout.includes('<h1>توسعه مهارت‌های رهبری</h1>'));
console.log('PASS: redesigned learning-journey home, development title, two route cards, desktop-only campus source, collapsed overview, home/lesson navigation, title focus, synchronized classroom controls, URL persistence and unchanged learning data. Visual browser QA remains unavailable.');
const sidebarRoutes=['m1','m2','leaders','techniques','visuals','diseases','quiz'];
for(const role of ['managers','supervisors']){
 const dashboard=boot({audience:role,hash:'#m1',width:1440,display:'class'});
 assert.equal(dashboard.q('#workshopSidebar').tagName,'aside');
 assert.equal(dashboard.q('#workshopSidebar').parent,dashboard.q('#main').parent,'sidebar and content share a dashboard layout');
 assert.equal(dashboard.q('#workshopSidebar').hidden,false);assert.equal(dashboard.q('#workshopLayout').classList.contains('has-sidebar'),true);
 assert.equal(dashboard.all('#workshopNavigation a').length,7,'seven vertical destinations');
 assert.ok(dashboard.q('#sidebarAudience').textContent.includes(role==='managers'?'مدیران':'سرپرستان'));
 const beforeNav=JSON.stringify(dashboard.test.getState());
 for(const id of sidebarRoutes){
  dashboard.q('.site-nav [data-open="'+id+'"]').click();
  assert.equal(dashboard.active(),id);assert.equal(dashboard.q('.site-nav [aria-current="page"]').dataset.open,id);
  assert.equal(dashboard.all('.site-nav [aria-current="page"]').length,1);
  const labelWord={m1:'سبک',m2:'گفت‌وگو',leaders:'رهبران',techniques:'فنون',visuals:'تصاویر',diseases:'بیماری',quiz:'کوییز'}[id];
  assert.ok(dashboard.q('#sidebarCurrent').textContent.includes(labelWord),'mobile caption identifies the current section');
  assert.equal(dashboard.doc.body.classList.contains('in-workshop'),true);
  assert.equal(dashboard.q('#sidebarBackdrop').hidden,true);assert.equal(dashboard.q('#main').getAttribute('inert'),undefined);
 }
 assert.equal(JSON.stringify(dashboard.test.getState()),beforeNav,'navigation does not alter learning answers');
 dashboard.q('#sidebarHome').click();assert.equal(dashboard.active(),'home');assert.equal(dashboard.q('#workshopSidebar').hidden,false);
 assert.equal(dashboard.q('#sidebarMobileBar').hidden,false);assert.equal(dashboard.q('#workshopLayout').classList.contains('has-sidebar'),true);
 assert.equal(dashboard.doc.body.classList.contains('in-workshop'),true);assert.equal(dashboard.doc.activeElement,dashboard.q('#home h1'));

 const mobile=boot({audience:role,hash:'#m2',width:390});
 assert.equal(mobile.q('#sidebarToggle').getAttribute('aria-expanded'),'false');
 mobile.q('#sidebarToggle').click();
 assert.equal(mobile.doc.body.classList.contains('sidebar-open'),true);assert.equal(mobile.q('#sidebarToggle').getAttribute('aria-expanded'),'true');
 assert.equal(mobile.q('#sidebarBackdrop').hidden,false);assert.equal(mobile.doc.activeElement,mobile.q('#sidebarClose'));
 for(const el of mobile.all('[data-sidebar-background]'))assert.equal(el.getAttribute('inert'),'','background is not keyboard-interactive while drawer is open');
 let prevented=0;
 mobile.events.keydown({key:'Tab',shiftKey:true,preventDefault:()=>prevented++});assert.equal(mobile.doc.activeElement,mobile.q('#sidebarCourse'));
 mobile.events.keydown({key:'Tab',shiftKey:false,preventDefault:()=>prevented++});assert.equal(mobile.doc.activeElement,mobile.q('#sidebarClose'));assert.equal(prevented,2,'keyboard focus stays in the drawer');
 mobile.events.keydown({key:'Escape',preventDefault:()=>prevented++});
 assert.equal(mobile.doc.body.classList.contains('sidebar-open'),false);assert.equal(mobile.doc.activeElement,mobile.q('#sidebarToggle'));
 assert.equal(mobile.q('#sidebarBackdrop').hidden,true);assert.ok(mobile.all('[data-sidebar-background]').every(el=>el.getAttribute('inert')===undefined));
 for(const close of ['sidebarClose','sidebarBackdrop']){
  mobile.q('#sidebarToggle').click();mobile.q('#'+close).click();assert.equal(mobile.q('#sidebarToggle').getAttribute('aria-expanded'),'false');assert.equal(mobile.doc.activeElement,mobile.q('#sidebarToggle'));
 }
 mobile.q('#sidebarToggle').click();mobile.q('.site-nav [data-open="techniques"]').click();
 assert.equal(mobile.active(),'techniques');assert.equal(mobile.doc.body.classList.contains('sidebar-open'),false);
 assert.equal(mobile.doc.activeElement,mobile.q('#techniques h2'));assert.equal(mobile.q('#sidebarCurrent').textContent,'فنون رهبری اثربخش');
 mobile.q('[data-question="tech_credibility"][data-value="own"]').click();
 mobile.q('#sidebarToggle').click();mobile.viewport.innerWidth=1280;mobile.events.resize();
 assert.equal(mobile.q('#sidebarBackdrop').hidden,true);assert.equal(mobile.doc.body.classList.contains('sidebar-open'),false);
 assert.equal(mobile.doc.activeElement,mobile.q('.site-nav [aria-current="page"]'),'focus survives desktop breakpoint');
 mobile.q('#sidebarToggle').click();assert.equal(mobile.q('#sidebarToggle').getAttribute('aria-expanded'),'false','desktop navigation remains nonmodal');
 mobile.viewport.innerWidth=390;mobile.events.resize();mobile.q('#sidebarToggle').click();mobile.q('.site-nav [data-open="m2"]').click();
 const restoredMobile=boot({audience:role,width:390,hash:'#techniques',data:mobile.data});
 assert.equal(restoredMobile.q('[data-question="tech_credibility"][data-value="own"]').getAttribute('aria-pressed'),'true','drawer navigation preserves saved answers');
 assert.equal(restoredMobile.q('#sidebarToggle').getAttribute('aria-expanded'),'false','drawer always starts closed');
}
const guardedSidebar=boot({audience:null,width:390,hash:'#leaders'});assert.equal(guardedSidebar.active(),'home');assert.equal(guardedSidebar.q('#workshopSidebar').hidden,false);assert.equal(guardedSidebar.q('#sidebarMobileBar').hidden,false);
console.log('PASS: right dashboard sidebar with seven destinations for both roles; active section and home transitions; compact mobile drawer, Escape/close/backdrop behavior, inert background, focus loop/restoration, responsive resize, classroom mode and preserved learning state.');

