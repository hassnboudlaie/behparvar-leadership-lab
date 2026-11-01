/* Session 2 management competency clinic.
   Role-specific classroom simulations. No modification to diagnostic result or legacy storage. */
(function(g){"use strict";
const cases=[...(g.BPS2PairCases||[]),...(g.BPS2GroupCases||[])];
const M=g.BPCompetencyData;
if(cases.length!==4||!M||M.skills.length!==12)throw Error("Session 2 clinic source incomplete");
const ROOT_ID="bp-c-clinic-2",NAMES={supervisors:"سرپرستان",managers:"مدیران"};
const DOMAIN={self:"خودم",others:"دیگران",results:"نتایج کسب‌وکار"};
const FAMILY=Object.fromEntries(M.families.map(f=>[f.id,f.name]));
let selectedCase=null,step="brief";
const TABS=[["brief","آشنایی با موقعیت"],["talk","دور اول و تصمیم"],["twist","اتفاق تازه"],["rehearse","اجرای بهبودیافته"],["debrief","بازاندیشی و بازخورد"]];
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function fa(v){return String(v).replace(/\d/g,x=>"۰۱۲۳۴۵۶۷۸۹"[Number(x)])}
function role(){
 const param=new URLSearchParams(location.search).get("audience");
 if(param==="supervisors"||param==="managers")return param;
 return null;
}
function storeKey(r){return "bp_s2_clinic_v1_"+r}
function fetchAll(r){try{const x=JSON.parse(localStorage.getItem(storeKey(r))||"{}");return x&&x.version===1&&typeof x.cases==="object"&&x.cases?x:{version:1,cases:{}}}catch(e){return {version:1,cases:{}}}}
function saved(r,id){const st=fetchAll(r);return st.cases[id]&&typeof st.cases[id]==="object"?st.cases[id]:{}}
function update(r,id,field,value){
 const st=fetchAll(r);st.cases[id]={...(st.cases[id]||{}),[field]:value};
 try{localStorage.setItem(storeKey(r),JSON.stringify(st));return true}catch(e){return false}
}
function status(text){const e=document.querySelector("#"+ROOT_ID+" [data-s2-status]");if(e)e.textContent=text||""}
function host(){return document.querySelector("#"+ROOT_ID+" .bp-s2-root")}
function find(id){return cases.find(x=>x.id===id)}
function sessionLink(){return '<a href="#session2" data-open="session2" class="bp-s2-back">→ جلسه دوم</a>'}
function intro(){
 return '<div class="bp-s2-top">'+sessionLink()+'<a href="#welcome" data-open="welcome">⌂ خانه</a></div>'+
 '<header class="bp-s2-hero"><span>جلسه دوم · آزمایشگاه شایستگی</span><h1>🎭 تمرین‌های دونفره و چهار‌نفره</h1><p>تصمیم بگیرید، پیامد را بررسی کنید و همان موقعیت را حرفه‌ای‌تر اجرا کنید.</p></header>';
}
function chooseRole(){
 return '<div class="bp-s2-notice"><h2>ابتدا مسیر یادگیری خود را انتخاب کنید</h2><p>محدوده اختیار و مسئله مدیران و سرپرستان در این تمرین‌ها متفاوت است.</p>'+
 '<div class="bp-s2-role-select"><a href="?audience=supervisors#'+ROOT_ID+'">👥 مسیر سرپرستان</a><a href="?audience=managers#'+ROOT_ID+'">👔 مسیر مدیران</a></div></div>';
}
function skillNames(c){return c.skills.map(id=>{const x=M.skills.find(s=>s.id===id);return x?x.name:""}).filter(Boolean)}
function caseList(r){
 return intro()+'<section class="bp-s2-cases"><h2>تمرین کدام گروه را شروع می‌کنید؟</h2><p class="bp-s2-role-label">مسیر '+NAMES[r]+'</p>'+
 '<div class="bp-s2-card-grid">'+cases.map(c=>{
 const d=c[r],s=saved(r,c.id),amount=c.format==="pair"?"۲ نفر":"۴ نفر";
 return '<button type="button" data-s2-case="'+c.id+'" class="bp-s2-case-card"><span class="bp-s2-chip">'+amount+' · '+c.duration+'</span>'+
 '<strong>'+esc(d.title)+'</strong><span>'+esc(c.name)+'</span><small>'+fa(c.skills.length)+' شایستگی مرتبط'+(s.decision!==undefined?" · تصمیم ثبت شده":"")+'</small></button>';
 }).join("")+'</div></section>'+
 '<details class="bp-s2-facilitator"><summary>راهنمای مدرس و زمان‌بندی کلاس</summary>'+
 '<p>مدل و نمونه آموزشی: ۱۵ دقیقه؛ تمرین دونفره: ۲۵ دقیقه؛ Roundtable چهار‌نفره: ۳۵ دقیقه؛ آزمون تشخیصی مستقل: ۳۰ دقیقه؛ بازاندیشی و جمع‌بندی: ۱۵ دقیقه. جمع: ۱۲۰ دقیقه. در هر نوبت یک کیس دونفره و یک کیس چهار‌نفره انتخاب کنید؛ باقی کیس‌ها برای گروه‌های موازی یا تمرین تکمیلی‌اند.</p>'+
 '<p>در فعالیت چهارنفره ابتدا ۹۰ ثانیه سکوت برای مرور Role Card، سپس گفت‌وگوی اول، تصمیم، اطلاعات تازه، اجرای دوم و جمع‌بندی. زمان‌های اعلام‌شده برای اجرای هر دور هستند و شامل کل Debrief نمی‌شوند.</p></details>'+
 '<div class="bp-s2-links"><a href="#bp-c-lesson" data-open="bp-c-lesson">📖 نقشه مدل شایستگی</a><a href="#bp-c-test" data-open="bp-c-test">🎯 آزمون تشخیصی مستقل</a></div>';
}
function bubbleDialogue(lines,roles){
 return '<div class="bp-s2-dialogue">'+lines.map(([i,t])=>
 '<p class="bp-s2-speech"><strong>'+esc(roles[i][0])+'</strong><span>«'+esc(t)+'»</span></p>').join("")+'</div>';
}
function profileCards(d){
 return '<section><h3>کارت‌های نقش</h3><p class="bp-s2-muted">هر نفر فقط کارت خودش را باز کند. قبل از شروع، افراد مقابل نباید اطلاعات محرمانه نقش شما را بدانند.</p>'+
 '<div class="bp-s2-roles">'+d.roles.map((p,i)=>
 '<details class="bp-s2-role"><summary><span>'+fa(i+1)+'</span><strong>'+esc(p[0])+'</strong><small>بازکردن کارت نقش</small></summary>'+
 '<p>'+esc(p[1])+'</p><p><strong>خط قرمز:</strong> '+esc(p[2])+'</p><p><strong>فضای مذاکره:</strong> '+esc(p[3])+'</p></details>'
 ).join("")+'</div></section>';
}
function evidence(d){
 return '<section class="bp-s2-evidence"><h3>آنچه اکنون می‌دانیم</h3><ul>'+d.signals.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul>'+
 '<details><summary>محدودیت‌ها و مرز اختیار</summary><ul>'+d.constraints.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul></details></section>';
}
function competencyMap(c){
 const ids=c.skills.map(x=>M.skills.find(s=>s.id===x)).filter(Boolean),domains=[...new Set(ids.map(s=>s.domain))];
 const fams=[...new Set(ids.map(s=>s.family))];
 return '<details class="bp-s2-map"><summary>این کیس با کدام شایستگی‌ها ارتباط دارد؟</summary>'+
 '<p><strong>حوزه‌های مرتبط:</strong> '+domains.map(id=>esc(DOMAIN[id])).join(" · ")+'</p>'+
 '<div class="bp-s2-competency-tags">'+ids.map(x=>'<span>'+esc(x.name)+'</span>').join("")+'</div>'+
 '<p><strong>خانواده‌های مرتبط:</strong> '+fams.map(id=>esc(FAMILY[id]||id)).join(" · ")+'</p>'+
 '<p>برای تحلیل مدل، یک تصمیم را از منظر رفتار فردی، کیفیت تعامل و اثر بر نتیجه بررسی کنید؛ حضور چند حوزه به معنای نمره‌دادن به فرد نیست.</p></details>';
}
function nav(c,r){
 const d=c[r],st=saved(r,c.id),pos=TABS.findIndex(x=>x[0]===step);
 return '<nav class="bp-s2-progress" aria-label="مراحل تمرین">'+TABS.map(([id,label],i)=>{
 const locked=i>=2&&st.decision===undefined || i>=3&&(!st.revised||st.revised.trim().length<20);
 return '<button type="button" data-s2-stage="'+id+'" aria-current="'+(id===step?"step":"false")+'" '+(locked?"disabled":"")+'><small>'+fa(i+1)+'</small>'+label+'</button>';
 }).join("")+'</nav>';
}
function forward(label,to,disabled=false){
 return '<button type="button" class="bp-s2-next" data-s2-stage="'+to+'" '+(disabled?"disabled":"")+'>'+label+' ←</button>';
}
function brief(c,r){
 const d=c[r];
 return '<div class="bp-s2-body"><h3>📍 یک اتفاق آشنا</h3><p class="bp-s2-scene">'+esc(d.scene)+'</p>'+
 '<p class="bp-s2-prompt">در دور اول، پیش از دیدن تحلیل یا الگوی پیشنهادی، تصمیم خودتان را بسازید.</p>'+
 evidence(d)+profileCards(d)+
 '<div class="bp-s2-actions">'+forward("گفت‌وگوی اول و تصمیم","talk")+'</div></div>';
}
function talk(c,r,st){
 const d=c[r],chosen=Number.isInteger(st.decision)&&st.decision>=0&&st.decision<d.options.length?st.decision:null;
 return '<div class="bp-s2-body"><h3>دور اول · اختلاف هنوز حل نشده</h3>'+
 '<p>گفت‌وگوی زیر را با نقش‌های خود اجرا یا تحلیل کنید. چه چیزی در آن شنیده نشده است؟</p>'+
 '<details class="bp-s2-sample"><summary>دیدن گفت‌وگوی اولیه</summary>'+bubbleDialogue(d.initial,d.roles)+'</details>'+
 '<h4>'+esc(d.firstPrompt)+'</h4><div class="bp-s2-options">'+d.options.map((x,i)=>'<button type="button" data-s2-decision="'+i+'" aria-pressed="'+(chosen===i)+'"><b>'+["الف","ب","ج"][i]+'</b>'+esc(x[0])+'</button>').join("")+'</div>'+
 (chosen===null?'<p class="bp-s2-muted">نخست تصمیم بگیرید؛ بعد فرصت و ریسک همین انتخاب را خواهید دید.</p>':
 '<div class="bp-s2-feedback" aria-live="polite"><h4>پیامدهای قابل بحث برای انتخاب شما</h4><strong>فرصت</strong><p>'+esc(d.options[chosen][1])+'</p><strong>هزینه یا ریسک</strong><p>'+esc(d.options[chosen][2])+'</p><small>اینجا نمره یا پاسخ قطعی وجود ندارد؛ درباره شرایطی که انتخاب شما تغییر می‌کند گفت‌وگو کنید.</small></div>'+
 '<div class="bp-s2-actions">'+forward("اطلاعات تازه و دور دوم","twist")+'</div>')+
 '</div>';
}
function twist(c,r,st){
 const d=c[r];
 return '<div class="bp-s2-body"><h3>⚡ اتفاق تازه</h3><p class="bp-s2-scene">'+esc(d.twist)+'</p>'+
 '<h4>'+esc(d.secondPrompt)+'</h4>'+
 '<label class="bp-s2-label">پس از اطلاعات تازه، تصمیم یا توافق گروه را با ذکر مسئول و زمان بازبینی بنویسید.'+
 '<textarea data-s2-revised rows="4" maxlength="1200" placeholder="تصمیم، مرز اختیار، مسئول، زمان و فرضی که باید بررسی شود...">'+esc(st.revised||"")+'</textarea></label>'+
 '<p class="bp-s2-muted">پاسخ خودتان را پیش از دیدن نمونه بهبودیافته ثبت کنید.</p>'+
 '<div class="bp-s2-actions">'+forward("مقایسه با گفت‌وگوی بهبودیافته","rehearse",!st.revised||st.revised.trim().length<20)+'</div></div>';
}
function rehearse(c,r,st){
 const d=c[r],count=d.roles.length;
 return '<div class="bp-s2-body"><h3>🎭 نوبت شماست · اجرای بهبودیافته</h3>'+
 '<p class="bp-s2-scene">همان '+fa(count)+' نفر، این‌بار با اطلاعات تازه دوباره مذاکره کنند. متن آماده فقط برای مقایسه است؛ ابتدا خودتان تمرین کنید.</p>'+
 '<div class="bp-s2-runbook"><h4>راهنمای اجرای '+(count===2?"دونفره":"چهارنفره")+'</h4>'+
 '<ol><li>هر نفر بدون افشای همه اطلاعات کارت خود، دغدغه اصلی و محدودیت تصمیم را بیان کند.</li>'+
 '<li>قبل از ارائه راه‌حل، دست‌کم یک پرسش باز بپرسید و برداشت طرف مقابل را دقیق بازگو کنید.</li>'+
 '<li>بجای قضاوت شخصی، داده، اختیار و پیامد بین‌واحدی را از هم جدا کنید.</li>'+
 '<li>درباره گزینه‌های واقعی مذاکره کنید و در پایان مسئول، زمان و شرط بازنگری را مشخص کنید.</li></ol>'+
 '<p>مدت اجرای هر دور: <strong>'+esc(c.duration)+'</strong>. زبان بدن باز، لحن محکم و محترمانه، و مکث قبل از پاسخ ضروری است.</p></div>'+
 '<details class="bp-s2-sample"><summary>مقایسه با نمونه گفت‌وگوی بهبودیافته</summary>'+bubbleDialogue(d.improved,d.roles)+'</details>'+
 competencyMap(c)+
 '<div class="bp-s2-actions">'+forward("بازخورد مشاهده‌گر و جمع‌بندی","debrief")+'</div></div>';
}
function debrief(c,r,st){
 const d=c[r],observed=st.observed&&typeof st.observed==="object"?st.observed:{};
 return '<div class="bp-s2-body"><h3>🔎 تحلیل رفتار و بازخورد همتایان</h3><p>مشاهده‌گر، رفتارهای دیده‌شده را علامت بزند؛ نبودِ رفتار قابل مشاهده مساوی با «فاقد شایستگی» نیست.</p>'+
 '<div class="bp-s2-checks">'+d.checklist.map((x,i)=>'<label><input type="checkbox" data-s2-observe="'+i+'" '+(observed[i]?"checked":"")+'><span>'+esc(x)+'</span></label>').join("")+'</div>'+
 '<details class="bp-s2-sample"><summary>سه پرسش برای گفت‌وگوی تحلیلی</summary><ol>'+d.debrief.map(q=>'<li>'+esc(q)+'</li>').join("")+'</ol></details>'+
 '<div class="bp-s2-reflection">'+
 '<label class="bp-s2-label">کدام فرض یا رفتار شما تغییر کرد؟<textarea data-s2-reflect="learning" rows="2" maxlength="900" placeholder="یک نکته مشخص">'+esc(st.learning||"")+'</textarea></label>'+
 '<label class="bp-s2-label">در محیط کار، چه رفتار کوچکی را امتحان می‌کنید؟<textarea data-s2-reflect="action" rows="2" maxlength="900" placeholder="رفتار، موقعیت، زمان بازبینی">'+esc(st.action||"")+'</textarea></label></div>'+
 '<p class="bp-s2-foot">این گزارش صرفاً برای بازاندیشی آموزشی است؛ نتیجه آزمون تشخیصی یا سطح قطعی خبرگی فرد را تغییر نمی‌دهد.</p>'+
 '<div class="bp-s2-actions"><button type="button" data-s2-list class="bp-s2-next">انتخاب تمرین دیگر ←</button><a href="#bp-c-lesson" data-open="bp-c-lesson" class="bp-s2-outlink">بازگشت به مدل</a></div></div>';
}
function render(){
 const el=host();if(!el)return;
 const r=role();
 if(!r){el.innerHTML=intro()+chooseRole();return}
 const c=selectedCase&&find(selectedCase);
 if(!c){el.innerHTML=caseList(r);return}
 const d=c[r],st=saved(r,c.id);
 if((step==="twist"||step==="rehearse"||step==="debrief")&&st.decision===undefined)step="talk";
 if((step==="rehearse"||step==="debrief")&&(!st.revised||st.revised.trim().length<20))step="twist";
 const main=step==="brief"?brief(c,r):step==="talk"?talk(c,r,st):step==="twist"?twist(c,r,st):step==="rehearse"?rehearse(c,r,st):debrief(c,r,st);
 el.innerHTML=intro()+'<div class="bp-s2-topline"><button type="button" data-s2-list class="bp-s2-back">→ همه تمرین‌ها</button>'+
 '<strong>'+esc(d.title)+'</strong><span>'+fa(d.roles.length)+' نفر · '+esc(c.duration)+'</span></div>'+
 nav(c,r)+main+'<p data-s2-status class="bp-s2-status" role="status" aria-live="polite"></p>';
}
function init(){
 render();
 window.addEventListener("hashchange",()=>{
  if(location.hash==="#"+ROOT_ID)render();
 });
 document.addEventListener("click",event=>{
  const clicked=event.target.closest("#"+ROOT_ID+" [data-s2-case],[data-s2-list],[data-s2-stage],[data-s2-decision]");
  if(!clicked)return;
  const r=role();if(!r)return;
  if(clicked.dataset.s2Case){selectedCase=clicked.dataset.s2Case;step="brief";render();return}
  if(clicked.hasAttribute("data-s2-list")){selectedCase=null;step="brief";render();return}
  if(clicked.dataset.s2Stage){step=clicked.dataset.s2Stage;render();return}
  if(clicked.hasAttribute("data-s2-decision")){
   if(!selectedCase)return;
   const value=Number(clicked.dataset.s2Decision);
   const c=find(selectedCase);if(!c||!Number.isInteger(value)||value<0||value>=c[r].options.length)return;
   const success=update(r,selectedCase,"decision",value);
   render();status(success?"✓ تصمیم این تمرین ذخیره شد.":"ذخیره مرورگر در دسترس نیست.");
  }
 });
 document.addEventListener("input",event=>{
  const el=event.target.closest("#"+ROOT_ID+" textarea");if(!el||!selectedCase)return;
  const r=role();if(!r)return;
  const kind=el.hasAttribute("data-s2-revised")?"revised":el.dataset.s2Reflect;
  if(!["revised","learning","action"].includes(kind))return;
  const ok=update(r,selectedCase,kind,el.value.slice(0,kind==="revised"?1200:900));
  if(kind==="revised"){
   document.querySelectorAll("#"+ROOT_ID+' [data-s2-stage="rehearse"]').forEach(btn=>{btn.disabled=el.value.trim().length<20});
  }
  status(ok?"✓ یادداشت در همین دستگاه ذخیره شد.":"ذخیره ممکن نیست؛ متن را کپی کنید.");
 });
 document.addEventListener("change",event=>{
  const el=event.target.closest("#"+ROOT_ID+" [data-s2-observe]");if(!el||!selectedCase)return;
  const r=role();if(!r)return;
  const st=saved(r,selectedCase),ob={...(st.observed||{})};
  ob[el.dataset.s2Observe]=el.checked;
  const ok=update(r,selectedCase,"observed",ob);
  status(ok?"✓ مشاهده ثبت شد.":"ذخیره در دسترس نیست.");
 });
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
g.BPSession2Clinic={cases,storageKey:storeKey};
})(window);