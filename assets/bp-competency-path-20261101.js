/* Behparvar competency learning pathway. Screens reveal content on click, not as one long poster.
   Original 6x7 lessons and local answers stay untouched. Educational, non-validated. */
(function(global){"use strict";
const D=global.BPCompetencyData;if(!D)throw Error("Competency data missing");
const session={role:(new URLSearchParams(location.search).get("audience")==="managers"?"managers":"supervisors"),quizRole:null,step:0};
const FA=["الف","ب","ج","د"],DOM={"self":"خودم","others":"دیگران","results":"نتایج کسب‌وکار"};
const ROUTES=new Set(["bp-c-lesson","bp-c-self","bp-c-others","bp-c-results","bp-c-families","bp-c-test","bp-c-report","bp-c-review","bp-c-focus-3","bp-c-focus-4","bp-c-focus-5","bp-c-focus-6"]);
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function fa(n){return String(n).replace(/[0-9]/g,c=>"۰۱۲۳۴۵۶۷۸۹"[Number(c)])}
function link(id,text,cl){return '<a href="#'+id+'" data-open="'+id+'" class="'+(cl||"bp-c-link")+'">'+text+'</a>'}
function root(id){return document.querySelector("#"+id+" .bp-c-root")}
function header(title,lead,back,tag){
 return '<div class="bp-c-top">'+link(back||"session2","⌂ بازگشت","bp-c-back")+'<span>به‌پرور · مدل شایستگی</span></div>'+
 '<header class="bp-c-hero"><div><span class="bp-c-tag">'+(tag||"جلسه دوم")+'</span><h1>'+title+'</h1><p>'+lead+'</p></div><span class="bp-c-hero-mark" aria-hidden="true">◈</span></header>';
}
function roleSwitcher(){
 return '<div class="bp-c-role-switch" role="group" aria-label="انتخاب کاربرد مدل برای نقش"><span>کاربرد مدل برای:</span>'+
 ['supervisors','managers'].map(x=>'<button type="button" data-bp-role="'+x+'" aria-pressed="'+(session.role===x)+'">'+(x==="supervisors"?"👥 سرپرستان":"👔 مدیران")+'</button>').join("")+'</div>';
}
function summary(role){return role==="supervisors"?"تمرکز بر تصمیم‌های روزانه، هماهنگی اجرا، ایمنی، کیفیت و بازخورد نزدیک به کار.":"تمرکز بر تصمیم‌های چندواحدی، منابع، ریسک، توسعه ظرفیت سرپرستان و نتایج کل زنجیره."}
function triang(){
 return '<div class="bp-c-triad" role="img" aria-label="سه حوزه متصل شایستگی: خودم، دیگران، نتایج کسب‌وکار">'+
 '<svg viewBox="0 0 310 178" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M155 33 L65 142 L248 142 Z" fill="none" stroke="#b9d9df" stroke-width="6" stroke-linejoin="round"/><path d="M155 42 L155 119 M65 140 L155 119 L244 140" fill="none" stroke="#d9e7eb" stroke-width="4"/><circle cx="155" cy="113" r="25" fill="#fff" stroke="#138b91" stroke-width="5"/><path d="M148 113l6 6 13-15" fill="none" stroke="#137c85" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="155" cy="29" r="28" fill="#e0f6f3" stroke="#3cabb0" stroke-width="3"/><circle cx="64" cy="145" r="28" fill="#e3f1fc" stroke="#6199bb" stroke-width="3"/><circle cx="246" cy="145" r="28" fill="#fff3df" stroke="#d4a153" stroke-width="3"/><text x="155" y="35" font-size="15" text-anchor="middle" font-weight="800" fill="#124c58">خودم</text><text x="64" y="150" font-size="14" text-anchor="middle" font-weight="800" fill="#234c6c">دیگران</text><text x="246" y="145" font-size="12" text-anchor="middle" font-weight="800" fill="#8c5b19"><tspan x="246" dy="-2">نتایج</tspan><tspan x="246" dy="13">کسب‌وکار</tspan></text></svg>'+
 '<p>سه حوزه به هم وابسته‌اند؛ هیچ‌کدام به‌تنهایی عملکرد مدیریتی را توضیح نمی‌دهد.</p></div>';
}
function modelLesson(){
 const el=root("bp-c-lesson");if(!el)return;
 el.innerHTML=header("درسنامه مدل شایستگی","نقشه را بفهمید، بعد روی هر حوزه کلیک کنید.","session2")+
 '<div class="bp-c-lead-row">'+triang()+
 '<div class="bp-c-concept"><h2>مدل چه می‌گوید؟</h2><p>شایستگی یعنی رفتاری آموختنی و قابل مشاهده که به انجام مسئولانه کار کمک می‌کند؛ نه صرفاً عنوان شغلی یا ویژگی شخصیتی.</p><p>سه حوزه، مسیر ساده یادگیری‌اند. شش خانواده BMCF، طبقه‌بندی تخصصی همان شایستگی‌ها هستند؛ دو مدل مستقل نیستند.</p></div></div>'+
 '<h2 class="bp-c-section-title">چه بخشی را می‌خواهید باز کنید؟</h2>'+
 '<nav class="bp-c-tiles four" aria-label="چهار فصل درسنامه">'+
 link("bp-c-self",'<span class="bp-c-symbol self">◎</span><strong>خودم</strong><small>۳ شایستگی</small>',"bp-c-tile")+
 link("bp-c-others",'<span class="bp-c-symbol others">♧</span><strong>دیگران</strong><small>۴ شایستگی</small>',"bp-c-tile")+
 link("bp-c-results",'<span class="bp-c-symbol results">↗</span><strong>نتایج کسب‌وکار</strong><small>۵ شایستگی</small>',"bp-c-tile")+
 link("bp-c-families",'<span class="bp-c-symbol family">▦</span><strong>شش خانواده</strong><small>پشتوانه مدل</small>',"bp-c-tile")+'</nav>'+
 '<div class="bp-c-footline"><strong>مسیر آموزشی</strong><p>جلسه ۲: شناخت مدل ← جلسه ۳: خودم ← جلسه ۴ و ۵: دیگران ← جلسه ۶: نتایج.</p></div>'+
 roleSwitcher()+'<p class="bp-c-role-hint">'+summary(session.role)+'</p>'+
 '<div class="bp-c-actions">'+link("bp-c-test","🎯 آزمون تشخیصی","bp-c-primary")+
 link("session2","↩ صفحه جلسه دوم","bp-c-secondary")+'</div>';
}
function domainPage(id,domain){
 const el=root(id);if(!el)return;
 const group=D.domains.find(x=>x.id===domain),list=D.skills.filter(s=>s.domain===domain);
 el.innerHTML=header("حوزه "+group.name,group.purpose,"bp-c-lesson","درسنامه · جلسه دوم")+
 '<div class="bp-c-mini-graphic">'+triang()+'</div>'+
 '<h2 class="bp-c-section-title">شایستگی‌ها را جداگانه باز کنید</h2>'+
 '<div class="bp-c-choose-list">'+list.map(s=>'<button type="button" data-bp-skill="'+s.id+'" aria-expanded="false"><span class="bp-c-list-symbol">'+(domain==="self"?"◎":domain==="others"?"♧":"↗")+'</span><span><strong>'+s.name+'</strong><small>رفتار · مثال · شاهد عملکرد</small></span><span aria-hidden="true">⌄</span></button>').join("")+'</div>'+
 '<div class="bp-c-reveal" id="bp-c-skill-detail" hidden></div>'+
 '<div class="bp-c-actions">'+link("bp-c-test","آزمون موقعیت‌های کاری","bp-c-primary")+link("bp-c-lesson","بازگشت به نقشه","bp-c-secondary")+'</div>';
}
function familiesPage(){
 const el=root("bp-c-families");if(!el)return;
 el.innerHTML=header("شش خانواده شایستگی","برای طبقه‌بندی تخصصی شایستگی‌ها؛ نه شش محور آموزشی تازه.","bp-c-lesson","چارچوب BMCF")+
 '<p class="bp-c-evidence-note">هر شایستگی یک خانواده اصلی دارد و ممکن است با خانواده‌های دیگر نیز ارتباط داشته باشد. «تخصصی» بدون تحلیل شغل و آزمون عملی قابل سنجش عمومی نیست.</p>'+
 '<div class="bp-c-family-grid">'+D.families.map((f,i)=>'<button type="button" data-bp-family="'+f.id+'" aria-expanded="false"><span class="bp-c-family-count">'+fa(i+1)+'</span><strong>'+f.name+'</strong><small>مشاهده توضیح و کاربرد ←</small></button>').join("")+'</div>'+
 '<div class="bp-c-reveal" id="bp-c-family-detail" hidden></div>'+
 '<div class="bp-c-actions">'+link("bp-c-lesson","↩ بازگشت به درسنامه","bp-c-secondary")+'</div>';
}
const FOCUS={
3:{title:"خودم؛ پایه قضاوت حرفه‌ای",domain:"self",lead:"خودآگاهی، حل مسئله و تصمیم‌گیری در شرایط واقعی کار.",ids:["self","problem","judgment"],s:"رفتار خود در فشار شیفت را بازبینی می‌کند و علت را پیش از اقدام می‌سنجد.",m:"سوگیری، ریسک و پیامد تصمیم چندواحدی را تحلیل می‌کند."},
4:{title:"دیگران؛ ارتباطات و تعارض",domain:"others",lead:"از گفت‌وگوی دشوار تا توافق قابل اجرا.",ids:["communication","conflict"],s:"بازخورد توصیفی و حل تعارض در تحویل کار روزانه.",m:"مدیریت اختلاف اولویت و اعتماد میان واحدها."},
5:{title:"دیگران؛ تفویض و توسعه",domain:"others",lead:"کاهش وابستگی و ساختن ظرفیت تصمیم‌گیری افراد.",ids:["delegation","coaching"],s:"واگذاری کار در حدود مجاز و مربیگری کوتاه حین اجرا.",m:"تفویض اختیار به سرپرستان و طراحی مسیر توسعه آنان."},
6:{title:"نتایج؛ از برنامه تا اثر واقعی",domain:"results",lead:"برنامه‌ریزی، هماهنگی، عملکرد، زنجیره ارزش و تغییر.",ids:["planning","coordination","performance","business","change"],s:"اولویت‌بندی شیفت، کنترل کیفیت و اصلاح عملیاتی.",m:"تصمیم منابع و سنجش اثر بر مشتری و کل زنجیره."}
};
function focusPage(n){
 const x=FOCUS[n],id="bp-c-focus-"+n,el=root(id);if(!el)return;
 el.innerHTML=header(x.title,x.lead,"session"+n,"جلسه "+fa(n)+" از ۶")+
 '<div class="bp-c-compare">'+roleSwitcher()+'<p class="bp-c-role-hint">'+(session.role==="supervisors"?x.s:x.m)+'</p></div>'+
 '<h2 class="bp-c-section-title">روی هر شایستگی بزنید</h2><div class="bp-c-choose-list">'+x.ids.map(sid=>{
  const s=D.skills.find(d=>d.id===sid);
  return '<button type="button" data-bp-skill="'+sid+'" aria-expanded="false"><span class="bp-c-list-symbol">'+(n===3?"◎":n===6?"↗":"♧")+'</span><span><strong>'+s.name+'</strong><small>یک رفتار قابل مشاهده و تمرین متناسب با نقش</small></span><span aria-hidden="true">⌄</span></button>'
 }).join("")+'</div>'+
 '<div class="bp-c-reveal" id="bp-c-skill-detail" hidden></div>'+
 '<div class="bp-c-actions">'+link("session"+n+"-m1","📚 هفت بخش کاربردی جلسه","bp-c-primary")+
 link("bp-c-lesson","🧭 نقشه کامل مدل","bp-c-secondary")+'</div>';
}
function showSkill(btn){
 const target=btn.closest(".bp-c-view").querySelector("#bp-c-skill-detail");
 const skill=D.skills.find(x=>x.id===btn.dataset.bpSkill);
 if(!target||!skill)return;
 const isOpen=btn.getAttribute("aria-expanded")==="true";
 btn.parentNode.querySelectorAll("[data-bp-skill]").forEach(b=>b.setAttribute("aria-expanded","false"));
 if(isOpen){target.hidden=true;target.innerHTML="";return;}
 btn.setAttribute("aria-expanded","true");target.hidden=false;
 const roleExample=session.role==="supervisors"?skill.s:skill.m;
 target.innerHTML='<span class="bp-c-tag">شایستگی '+skill.name+'</span>'+
 '<h3>رفتار مورد انتظار چیست؟</h3><p>'+skill.behavior+'</p>'+
 '<h3>مثال '+(session.role==="supervisors"?"سرپرستی":"مدیریتی")+'</h3><p>'+roleExample+'</p>'+
 '<h3>چه شاهدی باید ببینیم؟</h3><p>'+skill.evidence+'</p>'+
 '<div class="bp-c-skill-apply"><strong>سؤال بازتابی برای کلاس</strong><p>آخرین بار در کار واقعی چه تصمیم یا گفت‌وگویی با این رفتار مرتبط بود؟ چه چیزی قابل مشاهده بود؟</p></div>'+
 link("session"+skill.session,"تمرین در جلسه "+fa(skill.session)+" ←","bp-c-inline-action");
}
function showFamily(btn){
 const f=D.families.find(x=>x.id===btn.dataset.bpFamily);
 const detail=btn.closest(".bp-c-view").querySelector("#bp-c-family-detail");
 if(!f||!detail)return;
 let open=btn.getAttribute("aria-expanded")==="true";
 btn.parentNode.querySelectorAll("[data-bp-family]").forEach(b=>b.setAttribute("aria-expanded","false"));
 if(open){detail.hidden=true;detail.innerHTML="";return;}
 btn.setAttribute("aria-expanded","true");detail.hidden=false;
 const skills=D.skills.filter(x=>x.family===f.id);
 detail.innerHTML='<h3>'+f.name+'</h3><p>'+f.definition+'</p>'+
 '<strong>نمونه‌های مرتبط در مدل آموزشی:</strong>'+
 (skills.length?'<ul>'+skills.map(x=>'<li>'+x.name+'</li>').join("")+'</ul>':'<p>خانواده تخصصی برای هر شغل جداگانه طراحی و سنجیده می‌شود؛ در آزمون عمومی این دوره نمره ندارد.</p>');
}
function updateLanding(){
 for(let n=2;n<=6;n++){
   const page=document.getElementById("session"+n);
   const home=page&&page.querySelector(".mml-simple-session-home");
   if(!home||home.querySelector(".bp-c-landing-links"))continue;
   const heading=home.querySelector("h1"),goal=home.querySelector(".mml-simple-goal");
   if(n===2){
    if(heading)heading.textContent="جلسه دوم؛ مدل شایستگی‌های مدیریتی";
    if(goal)goal.innerHTML="<strong>در یک نگاه:</strong> مدل را بشناس، موقعیت‌ها را تحلیل کن و بعد حوزه‌ها را در جلسات آینده تمرین کن.";
   }else{
    if(heading)heading.textContent="جلسه "+["","", "","سوم","چهارم","پنجم","ششم"][n]+"؛ "+FOCUS[n].title;
    if(goal)goal.textContent=FOCUS[n].lead;
   }
   const cards=document.createElement("nav");
   cards.className="bp-c-landing-links";
   cards.setAttribute("aria-label","انتخاب بخش یادگیری جلسه");
   if(n===2){
    cards.innerHTML=link("bp-c-lesson",'<span>📖</span><strong>درسنامه و نمودار مدل</strong><small>سه حوزه و شش خانواده را کلیک کنید</small>',"bp-c-landing-card")+
      link("bp-c-test",'<span>🎯</span><strong>آزمون موقعیت‌محور</strong><small>بانک جدا برای مدیران و سرپرستان</small>',"bp-c-landing-card")+
      link("bp-c-report",'<span>📊</span><strong>نتایج و پیشنهاد یادگیری</strong><small>بعد از پاسخ‌گویی فعال می‌شود</small>',"bp-c-landing-card");
   }else{
    cards.innerHTML=link("bp-c-focus-"+n,'<span>🧭</span><strong>شایستگی‌های این جلسه</strong><small>رفتار، مثال و شاهد قابل مشاهده</small>',"bp-c-landing-card");
   }
   const actions=home.querySelector(".mml-simple-entry-actions");
   if(actions)home.insertBefore(cards,actions);
   else home.appendChild(cards);
   if(actions)actions.classList.add("bp-c-old-actions");
 }
 const oldPortal=document.getElementById("competencies");
 if(oldPortal&&!oldPortal.querySelector(".bp-c-portal-link")){
   const head=oldPortal.querySelector(".bp-subpage-heading");
   if(head)head.insertAdjacentHTML("afterend",link("bp-c-lesson","📖 درسنامه و مسیر شش‌جلسه‌ای مدل","bp-c-portal-link"));
 }
 const card=document.querySelector('#course .course-session[data-course-session="2"] small');
 if(card)card.textContent="آشنایی با مدل شایستگی";
}
function key(role){return "bp_competency_session2_v1_"+role}
function load(role){
 try{const x=JSON.parse(localStorage.getItem(key(role))||"null");
  if(x&&x.version===1&&x.answers&&typeof x.answers==="object")return x;
 }catch(e){}
 return {version:1,answers:{}};
}
function save(role,data){try{localStorage.setItem(key(role),JSON.stringify(data));return true}catch(e){return false}}
function choose(role){
 session.quizRole=role;const ans=load(role).answers;
 session.step=D[role].findIndex(q=>!Number.isInteger(ans[q.id]));
 if(session.step<0)session.step=12;
 renderTest();
}
function quizRoleChoice(){
 return '<div class="bp-c-quiz-roles" role="group" aria-label="انتخاب بانک سؤال">'+
 ['supervisors','managers'].map(r=>{
 const count=D[r].filter(q=>Number.isInteger(load(r).answers[q.id])).length;
 return '<button type="button" data-bp-quiz-role="'+r+'" class="'+(session.quizRole===r?"selected":"")+'"><strong>'+(r==="supervisors"?"👥 سرپرستان":"👔 مدیران")+'</strong><small>'+fa(count)+' از ۱۲ پاسخ ثبت‌شده</small></button>';
 }).join("")+'</div>';
}
function renderTest(){
 const el=root("bp-c-test");if(!el)return;
 let html=header("آزمون تشخیصی شایستگی","۱۲ موقعیت کاری برای هر نقش؛ بدون محدودیت زمانی و بدون نمره رسمی.","session2","جلسه دوم");
 html+=quizRoleChoice();
 if(!session.quizRole){
   html+='<div class="bp-c-instructions"><h2>پیش از شروع</h2><p>بانک مناسب نقش خود را انتخاب کنید. چهار گزینه در هر سؤال می‌توانند بخشی از راه‌حل باشند؛ باید مناسب‌ترین اقدام را با توجه به محدودیت‌ها انتخاب کنید.</p>'+
   '<p>پس از هر انتخاب، توضیح همان گزینه و دلایل سه گزینه دیگر نمایش داده می‌شود.</p></div>'+
   '<p class="bp-c-evidence-note">این پرسش‌ها برای یادگیری سناریویی طراحی شده‌اند و آزمون استاندارد منابع انسانی نیستند.</p>';
   el.innerHTML=html;return;
 }
 const role=session.quizRole,qs=D[role],saved=load(role).answers;
 if(session.step===12){
   html+='<div class="bp-c-finished"><h2>✅ پاسخ‌گویی این مسیر تکمیل شد</h2><p>داشبورد آموزشی و توضیح پاسخ‌های شما آماده است.</p>'+
   link("bp-c-report","📊 دیدن داشبورد نتایج","bp-c-primary")+'</div>';
   el.innerHTML=html;return;
 }
 const q=qs[session.step],a=saved[q.id],answered=Number.isInteger(a),skill=D.skills.find(s=>s.id===q.skill);
 const questionIndex=session.step+1,done=qs.filter(x=>Number.isInteger(saved[x.id])).length;
 html+='<div class="bp-c-quiz-progress"><span>سؤال '+fa(questionIndex)+' از ۱۲</span><span>'+esc(skill.name)+'</span><div class="bp-c-progress-track"><i style="width:'+Math.round(done/12*100)+'%"></i></div></div>'+
 '<div class="bp-c-question"><span class="bp-c-tag">'+DOM[skill.domain]+'</span>'+
 '<h2>'+esc(q.stem)+'</h2><div class="bp-c-options" role="group" aria-label="گزینه‌های سؤال">'+
 q.options.map((x,i)=>'<button type="button" data-bp-option="'+i+'" '+(answered?"disabled":"")+' class="'+(answered&&i===q.answer?"correct":answered&&i===a?"chosen":"")+'"><span>'+FA[i]+'</span><strong>'+esc(x)+'</strong></button>').join("")+
 '</div></div>';
 if(answered){
   const success=a===q.answer;
   html+='<section class="bp-c-feedback"><h3>'+(success?"✓ تحلیل انتخاب شما":"🔎 بازنگری انتخاب شما")+'</h3>'+
   '<p>'+(!success?"انتخاب شما: "+FA[a]+"؛ ":"")+'مناسب‌ترین پاسخ آموزشی در این موقعیت: <strong>گزینه '+FA[q.answer]+'</strong>.</p>'+
   '<p class="bp-c-answer-why">'+esc(q.reasons[q.answer])+'</p>'+
   '<details><summary>چرا هر یک از چهار گزینه مناسب‌تر یا ضعیف‌تر است؟</summary>'+
   q.reasons.map((x,i)=>'<div class="bp-c-feedback-line"><strong>گزینه '+FA[i]+(i===q.answer?" · مناسب‌تر":"")+'</strong><p>'+esc(x)+'</p></div>').join("")+
   '</details></section>';
 }
 html+='<div class="bp-c-actions">'+(answered?
   (session.step===11?link("bp-c-report","📊 مشاهده نتیجه نهایی","bp-c-primary"):'<button type="button" data-bp-next class="bp-c-primary">سؤال بعدی ←</button>'):
   '<span class="bp-c-instruction-mini">یک گزینه را انتخاب کنید؛ پاسخ ثبت و تشریح نمایش داده می‌شود.</span>')+
 link("bp-c-lesson","↩ درسنامه","bp-c-secondary")+'</div>';
 el.innerHTML=html;
}
function answer(i){
 const role=session.quizRole;if(!role||session.step>=12)return;
 const q=D[role][session.step],st=load(role);
 if(Number.isInteger(st.answers[q.id]))return;
 st.answers[q.id]=i;
 save(role,st);
 renderTest();
}
function collect(role){
 const responses=load(role).answers,bank=D[role];
 const done=bank.filter(q=>Number.isInteger(responses[q.id]));
 const count=done.length,correct=done.filter(q=>responses[q.id]===q.answer).length;
 const parts=(by,key)=>by.map(item=>{
 const qs=done.filter(q=>key(q)===item.id);
 const ok=qs.filter(q=>responses[q.id]===q.answer).length;
 return {...item,count:qs.length,correct:ok,percent:qs.length?Math.round(100*ok/qs.length):null};
 });
 const domains=parts(D.domains,q=>D.skills.find(s=>s.id===q.skill).domain);
 const families=parts(D.families,q=>D.skills.find(s=>s.id===q.skill).family);
 const skills=D.skills.map(s=>{
  const q=bank.find(x=>x.skill===s.id),ans=responses[q.id];
  return {...s,answered:Number.isInteger(ans),correct:Number.isInteger(ans)&&ans===q.answer};
 });
 return {role,responses,count,correct,percent:count?Math.round(correct/count*100):0,domains,families,skills};
}
function bars(domain){
 const val=domain.percent;
 return '<div class="bp-c-bar-row"><div class="bp-c-bar-label"><strong>'+domain.name+'</strong><span>'+(val==null?"سنجش‌نشده":fa(val)+"٪")+'</span></div>'+
 '<div class="bp-c-progress-track"><i style="width:'+(val||0)+'%"></i></div>'+
 '<small>'+(domain.count?fa(domain.correct)+" پاسخ همسو از "+fa(domain.count):"پرسشی در این بخش وجود ندارد")+'</small></div>';
}
function report(){
 const el=root("bp-c-report");if(!el)return;
 const role=session.quizRole||(["supervisors","managers"].find(r=>load(r)&&Object.keys(load(r).answers).length===12));
 let h=header("داشبورد آموزشی شایستگی","پروفایل پاسخ‌ها؛ مسیر تمرین، نه رتبه‌بندی مدیران و سرپرستان.","session2","جلسه دوم");
 if(!role){el.innerHTML=h+'<div class="bp-c-instructions"><h2>هنوز آزمونی تکمیل نشده است</h2><p>بانک متناسب با نقش خود را انتخاب کنید و سؤال‌ها را پاسخ دهید.</p>'+link("bp-c-test","🎯 شروع آزمون","bp-c-primary")+'</div>';return}
 session.quizRole=role;
 const p=collect(role),complete=p.count===12;
 h+='<div class="bp-c-report-role"><strong>مسیر: '+(role==="supervisors"?"سرپرستان":"مدیران")+'</strong><small>'+fa(p.count)+' از ۱۲ پاسخ ثبت شده</small></div>';
 if(!complete){
  h+='<div class="bp-c-instructions"><h2>ارزیابی هنوز کامل نیست</h2><p>برای مقایسه سه حوزه و شش خانواده باید هر ۱۲ موقعیت پاسخ داده شود.</p>'+link("bp-c-test","ادامه سؤال‌ها","bp-c-primary")+'</div>';el.innerHTML=h;return;
 }
 h+='<section class="bp-c-results-overview"><div class="bp-c-donut" style="--pct:'+p.percent+'%"><span><strong>'+fa(p.percent)+'٪</strong><small>پاسخ همسو</small></span></div><div class="bp-c-domain-bars"><h2>سه حوزه اصلی</h2>'+p.domains.map(bars).join("")+'</div></section>'+
 '<h2 class="bp-c-section-title">شش خانواده BMCF</h2>'+
 '<div class="bp-c-family-score-grid">'+p.families.map(f=>'<div class="bp-c-family-score"><strong>'+f.name+'</strong><span>'+(f.percent==null?"ارزیابی نشده":fa(f.percent)+"٪")+'</span><div class="bp-c-progress-track"><i style="width:'+(f.percent||0)+'%"></i></div><small>'+(f.id==="functional"?"وابسته به آزمون فنی هر شغل":fa(f.count)+" سؤال در این خانواده")+'</small></div>').join("")+'</div>';
 const strengths=p.skills.filter(s=>s.correct),needs=p.skills.filter(s=>!s.correct);
 h+='<div class="bp-c-strength-grid"><section><h2>✓ موقعیت‌های با پاسخ همسو</h2><p>'+(strengths.length?strengths.slice(0,4).map(s=>s.name).join(" · "):"در این نوبت موردی ثبت نشد")+'</p></section>'+
 '<section><h2>↗ موضوعات پیشنهادی برای تمرین</h2><p>'+(needs.length?needs.slice(0,4).map(s=>s.name).join(" · "):"برای تثبیت، تمرین واقعی را ادامه دهید")+'</p></section></div>'+
 '<h2 class="bp-c-section-title">۱۲ شایستگی؛ جزئیات قابل بازکردن</h2>'+
 '<div class="bp-c-competency-details">'+p.domains.map(d=>{
  const subset=p.skills.filter(s=>s.domain===d.id);
  return '<details><summary>'+d.name+' · '+fa(d.correct)+' از '+fa(d.count)+' پاسخ همسو</summary>'+
   '<ul>'+subset.map(s=>'<li><strong>'+s.name+'</strong><span>'+(s.correct?"همسو با پاسخ آموزشی":"پیشنهاد مرور و تمرین")+'</span>'+link("bp-c-focus-"+(s.session===3?3:s.session===4?4:s.session===5?5:6),"درس مرتبط ←","bp-c-mini-link")+'</li>').join("")+'</ul></details>';
 }).join("")+'</div>';
 const weakest=p.domains.slice().sort((a,b)=>(a.percent||0)-(b.percent||0))[0];
 let priority=p.skills.find(s=>!s.correct&&s.domain===weakest.id)||needs[0]||p.skills[0];
 h+='<div class="bp-c-learning-action"><h2>پیشنهاد یادگیری</h2><p>برای تمرین «'+priority.name+'»، درسنامه جلسه '+fa(priority.session)+' را باز کنید، یک رفتار مشخص انتخاب و در کار واقعی بازبینی کنید.</p>'+
 link("bp-c-focus-"+(priority.session===3?3:priority.session===4?4:priority.session===5?5:6),"بازکردن درس مرتبط ←","bp-c-primary")+'</div>'+
 '<p class="bp-c-evidence-note">تفسیر محدود: تنها یک موقعیت برای هر شایستگی بررسی شده است؛ درصدها نسبت پاسخ‌های همسو با کلید آموزشی هستند، نه اندازه‌گیری معتبر سطح شایستگی یا قابلیت مقایسه اشخاص. خانواده «تخصصی» خارج از دامنه این پرسش‌های عمومی است.</p>'+
 '<div class="bp-c-actions">'+link("bp-c-review","مرور پاسخ‌ها و تشریح","bp-c-secondary")+
 '<button type="button" class="bp-c-reset" data-bp-restart>شروع دوباره همین بانک</button></div>';
 el.innerHTML=h;
}
function review(){
 const el=root("bp-c-review");if(!el)return;
 const role=session.quizRole||"supervisors",qs=D[role],responses=load(role).answers;
 let h=header("مرور پاسخ‌ها و تشریح","هر سؤال را جداگانه باز کنید؛ پاسخ و علت هر گزینه قابل بررسی است.","bp-c-report","بازخورد آموزشی");
 h+='<div class="bp-c-review-list">'+qs.map((q,i)=>{
   const selected=responses[q.id],answered=Number.isInteger(selected);
   return '<details><summary><strong>'+fa(i+1)+'. '+D.skills.find(x=>x.id===q.skill).name+'</strong><span>'+(answered?(selected===q.answer?"✓ همسو":"↗ نیاز به بازنگری"):"بدون پاسخ")+'</span></summary>'+
   '<p>'+esc(q.stem)+'</p>'+
   q.options.map((o,j)=>'<div class="bp-c-feedback-line"><strong>گزینه '+FA[j]+(j===q.answer?" · مناسب‌تر":"")+(j===selected?" · انتخاب شما":"")+'</strong><p>'+esc(o)+'</p><small>'+esc(q.reasons[j])+'</small></div>').join("")+'</details>';
 }).join("")+'</div><div class="bp-c-actions">'+link("bp-c-report","↩ داشبورد نتایج","bp-c-primary")+'</div>';
 el.innerHTML=h;
}
function render(route){
 if(!ROUTES.has(route))return;
 if(route==="bp-c-lesson")modelLesson();
 else if(route==="bp-c-self")domainPage(route,"self");
 else if(route==="bp-c-others")domainPage(route,"others");
 else if(route==="bp-c-results")domainPage(route,"results");
 else if(route==="bp-c-families")familiesPage();
 else if(route==="bp-c-test")renderTest();
 else if(route==="bp-c-report")report();
 else if(route==="bp-c-review")review();
 else if(/^bp-c-focus-[3-6]$/.test(route))focusPage(Number(route.slice(-1)));
}
function onClick(e){
 const t=e.target.closest("[data-bp-role],[data-bp-skill],[data-bp-family],[data-bp-quiz-role],[data-bp-option],[data-bp-next],[data-bp-restart]");
 if(!t)return;
 if(t.dataset.bpRole){session.role=t.dataset.bpRole;render(location.hash.slice(1));return}
 if(t.dataset.bpSkill){showSkill(t);return}
 if(t.dataset.bpFamily){showFamily(t);return}
 if(t.dataset.bpQuizRole){choose(t.dataset.bpQuizRole);return}
 if("bpOption" in t.dataset){answer(Number(t.dataset.bpOption));return}
 if(t.hasAttribute("data-bp-next")){
   const role=session.quizRole,qs=D[role],ans=load(role).answers;
   const next=qs.findIndex((q,i)=>i>session.step&&!Number.isInteger(ans[q.id]));
   session.step=next<0?12:next;renderTest();return
 }
 if(t.hasAttribute("data-bp-restart")){
   if(!global.confirm("فقط نتیجه آزمون این نقش پاک شود و دوباره شروع کنید؟"))return;
   try{localStorage.removeItem(key(session.quizRole))}catch(e){}
   session.step=0;renderTest();
 }
}
function init(){
 updateLanding();for(const id of ROUTES)render(id);
 document.addEventListener("click",onClick);
 window.addEventListener("hashchange",()=>render(location.hash.slice(1)));
 document.addEventListener("click",e=>{const a=e.target.closest("a[data-open]");if(a&&ROUTES.has(a.dataset.open))requestAnimationFrame(()=>render(a.dataset.open))});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);
else init();
global.BPCompetencyUI={data:D,collect,render};
})(window);