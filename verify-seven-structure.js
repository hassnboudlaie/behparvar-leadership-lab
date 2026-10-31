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

const parts=['m1','m2','leaders','techniques','visuals','diseases','quiz'];
const words=['اول','دوم','سوم','چهارم','پنجم','ششم'];
const firstKey='behparvar_session1_v4';
for(const role of ['managers','supervisors']){
 const a=boot({audience:role});assert.equal(a.active(),'course');assert.equal(a.all('[data-course-session]').length,6);assert.equal(a.all('#home .module-card').length,7);
 const untouched=JSON.stringify(a.test.getState());
 for(let n=2;n<=6;n++){
  a.q('[data-course-session="'+n+'"]').click();assert.equal(a.active(),'session'+n);assert.equal(a.all('#workshopNavigation a').length,7);assert.equal(a.q('#workshopSidebar').hidden,false);
  for(const part of parts){
   a.q('.site-nav [data-open="session'+n+'-'+part+'"]').click();assert.equal(a.active(),'session'+n+'-'+part);assert.equal(a.q('#workshopSidebar').hidden,false);assert.equal(a.all('#workshopNavigation a').length,7);assert.ok(a.q('#sidebarSessionTitle').textContent.includes(words[n-1]));assert.ok(a.doc.title.includes('جلسه '+words[n-1]));assert.equal(a.q('#sidebarHome').dataset.open,'session'+n);assert.equal(a.q('#reset').hidden,true);assert.ok(a.all('[data-first-session-resource]').every(x=>x.hidden));assert.equal(a.q('.site-nav [aria-current="page"]').dataset.open,'session'+n+'-'+part);assert.ok(a.q('#session'+n+'-'+part).textContent.includes('یادداشت من برای این بخش'));
   for(const link of a.all('#workshopNavigation a'))assert.ok(link.dataset.open.startsWith('session'+n+'-'));
   a.q('#sidebarHome').click();assert.equal(a.active(),'session'+n);
  }
 }
 assert.equal(JSON.stringify(a.test.getState()),untouched,'visiting all future sections leaves first-session learning state intact');
 a.q('[data-course-session="1"]').click();a.q('.site-nav [data-open="m1"]').click();assert.equal(a.active(),'m1');assert.equal(a.q('#sidebarHome').dataset.open,'home');assert.ok(a.q('#sidebarSessionTitle').textContent.includes('اول'));assert.equal(a.q('#reset').hidden,false);assert.ok(a.all('[data-first-session-resource]').every(x=>!x.hidden));
}
// Independent notes for each future session, part and audience; never write through session one's key.
const seed={schema:5,audience:'managers',legacyClaimed:true,legacyState:{},roleStates:{managers:{answers:{workshop_when:'یادداشت جلسه اول',workshop_conversation:'clear'},grid:{0:5},visited:{}}}};
const data={[firstKey]:JSON.stringify(seed)},snapshot=data[firstKey];
const a=boot({audience:'managers',hash:'#session2-m1',data});
const note2=a.q('#future-note-2-m1');note2.value='یادداشت مدیران جلسه دوم';note2.fire('input');assert.equal(data[firstKey],snapshot);
a.q('[data-course-session="3"]').click();a.q('.site-nav [data-open="session3-m1"]').click();const note3=a.q('#future-note-3-m1');assert.equal(note3.value,'');note3.value='یادداشت جلسه سوم';note3.fire('input');assert.equal(data[firstKey],snapshot);
assert.equal(JSON.parse(data.behparvar_session2_v1).roleStates.managers.notes.m1,note2.value);assert.equal(JSON.parse(data.behparvar_session3_v1).roleStates.managers.notes.m1,note3.value);
const role2=boot({audience:'supervisors',hash:'#session2-m1',data});assert.equal(role2.q('#future-note-2-m1').value,'');role2.q('#future-note-2-m1').value='یادداشت سرپرستان جلسه دوم';role2.q('#future-note-2-m1').fire('input');assert.equal(data[firstKey],snapshot);
const resumed=boot({audience:'managers',hash:'#session2-m1',data});assert.equal(resumed.q('#future-note-2-m1').value,note2.value);assert.equal(resumed.q('#future-note-3-m1').value,note3.value);assert.equal(resumed.q('#future-note-2-m2').value,'');
resumed.q('#reset').click();assert.equal(data[firstKey],snapshot,'session-one reset cannot run from a future session');assert.equal(JSON.parse(data.behparvar_session2_v1).roleStates.supervisors.notes.m1,'یادداشت سرپرستان جلسه دوم');
const first=boot({audience:'managers',hash:'#action',data});assert.equal(first.q('#actionWhen').value,'یادداشت جلسه اول');assert.equal(first.q('[data-question="conversation"][data-value="clear"]').getAttribute('aria-pressed'),'true');assert.equal(first.q('.scale-options button[data-index="0"][data-value="5"]').getAttribute('aria-pressed'),'true');
for(let n=2;n<=6;n++){
 const gate=boot({audience:null,hash:'#session'+n+'-quiz'});assert.equal(gate.active(),'session'+n);assert.ok(gate.q('#session'+n+'Prompt').textContent.includes('ابتدا'));gate.q('#session'+n+' [data-session-audience="supervisors"]').click();assert.equal(gate.location.hash,'#session'+n+'-quiz');assert.equal(new URL(gate.location.href).searchParams.get('audience'),'supervisors');
}
const mobile=boot({audience:'managers',width:390,hash:'#session6-techniques'});mobile.q('#sidebarToggle').click();assert.equal(mobile.q('#sidebarToggle').getAttribute('aria-expanded'),'true');assert.ok(mobile.q('#sidebarToggle').getAttribute('aria-label').includes('ششم'));assert.equal(mobile.q('#main').getAttribute('inert'),'');mobile.q('.site-nav [data-open="session6-quiz"]').click();assert.equal(mobile.active(),'session6-quiz');assert.equal(mobile.q('#sidebarBackdrop').hidden,true);assert.equal(mobile.q('#main').getAttribute('inert'),undefined);mobile.q('#sidebarHome').click();assert.equal(mobile.active(),'session6');
const blocked=boot({audience:'managers',hash:'#session4-m2',blocked:true});blocked.q('#future-note-4-m2').value='یادداشت موقت';blocked.q('#future-note-4-m2').fire('input');assert.ok(blocked.q('#future-note-4-m2-status').textContent.includes('در دسترس نیست'));assert.equal(blocked.active(),'session4-m2');
const broken=boot({audience:'managers',hash:'#session5-quiz',data:{behparvar_session5_v1:'{"roleStates":{"managers":{"notes":["invalid"]}}}'}});assert.equal(broken.q('#future-note-5-quiz').value,'');
const ids=a.all('[id]').map(e=>e.id);assert.equal(new Set(ids).size,ids.length);for(const link of a.all('a')){const href=link.getAttribute('href')||'';if(href.startsWith('#'))assert.ok(a.q(href),'broken link '+href)}
console.log('PASS: seven sections in all six sessions; 70 future-section visits for both audiences; session-aware sidebar/roles/deep links; per-session/role/section notes; first-session content and storage preserved; reset isolation; mobile drawer; blocked/malformed storage; unique IDs and links.');
