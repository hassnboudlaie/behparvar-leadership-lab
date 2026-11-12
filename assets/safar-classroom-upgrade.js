/* Session 4 classroom enhancement. Builds upon the isolated Safar app, no other sessions touched. */
(function(){
"use strict";
const root=document.getElementById("root");
const skills=window.BP_SAFAR_CLASSROOM?.content||[];
const restored=window.BP_SAFAR_RESTORED_CONTENT?.content||[];
const stages=window.BP_SAFAR_DATA?.stages||[];
if(!root||skills.length!==10||stages.length!==10)return;
const storageKey="bp-communication-journey-v2";
const escapeHTML=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fa=n=>Number(n||0).toLocaleString("fa-IR");
const readState=()=>{try{const s=JSON.parse(localStorage.getItem(storageKey)||"null");return s&&s.version===2?s:null}catch(e){return null}};
const getRole=s=>s.role==="managers"?"manager":"supervisor";
const getCur=(s)=>skills[s.stage];
let display=null,lastFocus=null,scheduled=false;
function ensureHeader(){
 const actions=document.querySelector(".top-actions");
 if(!actions||actions.querySelector("#sfClassroom"))return;
 const btn=document.createElement("button");
 btn.type="button";btn.id="sfClassroom";btn.className="presenter-trigger";
 btn.textContent="🖥 نمایش کلاس";
 btn.setAttribute("aria-label","نمایش موقعیت و راهنمای گفت‌وگو روی پرده کلاس");
 actions.insertBefore(btn,actions.firstChild);
}
function mapHTML(s){
 return '<details class="sf-stage-map"><summary>🧭 نقشه سفر | مرحله '+fa(s.stage+1)+' از ۱۰ <small>با تکمیل هر مرحله، مرحله بعد باز می‌شود. عنوان همه مراحل را اینجا ببینید.</small></summary>'+
 '<div class="sf-map-grid">'+stages.map((x,i)=>'<div class="sf-map-cell '+(i<s.stage?"done":i===s.stage?"current":"pending")+'"><strong>'+(i<s.stage?"✓":i===s.stage?"●":"🔒")+' '+fa(i+1)+'</strong><span>'+escapeHTML(x.title)+'</span></div>').join("")+'</div></details>';
}
function decorateIntro(){
 if(root.querySelector(".sf-classroom-applied"))return;
 const cover=root.querySelector(".cover-surface");
 if(!cover)return;
 cover.classList.add("sf-classroom-applied");
 const intro=root.querySelector(".introgrid");
 if(intro){
  intro.insertAdjacentHTML("afterend",'<details class="sf-program-outline"><summary>📚 مهارت‌های ۱۰ ایستگاه سفر را ببین</summary><ol>'+
   stages.map((stage,i)=>'<li><strong>'+escapeHTML(stage.title)+'</strong> <span>— '+escapeHTML(restored[i]?.outcome||"")+'</span></li>').join('')+
   '</ol></details>');
 }
}
function decorateStage(s){
 if(root.querySelector(".sf-classroom-applied"))return;
 const status=root.querySelector(".statusbar"),firstBullets=root.querySelector(".card .bullets");
 if(!status||!firstBullets)return;
 const c=getCur(s),stage=stages[s.stage],path=c[getRole(s)],answers=s.answers?.[s.stage]||{};
 const rc=restored[s.stage]||null;
 const done=answers.q1!==undefined&&answers.q2!==undefined;
 const anchor=document.createElement("div");anchor.className="sf-classroom-applied";
 status.insertAdjacentElement("afterend",anchor);
 anchor.outerHTML=mapHTML(s);
 const map=root.querySelector(".sf-stage-map");
 if(map)map.classList.add("sf-classroom-applied");
 const h=root.querySelector("h2");
 if(h)h.insertAdjacentHTML("afterend",'<nav class="sf-subheads" aria-label="بخش‌های یادگیری"><a class="sf-tag" href="#sf-learn">۱. یادگیری</a><a class="sf-tag" href="#sf-quiz">۲. تصمیم‌گیری</a><a class="sf-tag" href="#sf-practice">۳. تمرین و بازخورد</a></nav>');
 const lesson=firstBullets.closest(".card");
 if(lesson){
  lesson.id="sf-learn";
  const title='<section class="sf-skill-card"><span class="pill teal">تکنیک ارتباطی این مرحله</span><h3>'+escapeHTML(c.skill)+'</h3><p>'+escapeHTML(c.definition)+'</p>'+
   '<div class="sf-pair"><div class="sf-do"><b>✓ بهتر است</b>'+escapeHTML(c.do)+'</div><div class="sf-avoid"><b>✕ خطای رایج</b>'+escapeHTML(c.avoid)+'</div></div></section>';
  firstBullets.insertAdjacentHTML("beforebegin",title);
  if(rc){
   const expanded='<div class="sf-learning-outcome"><strong>هدف رفتاری این مرحله</strong>'+escapeHTML(rc.outcome)+'</div>'+
    '<div class="sf-competency-techniques"><h3>سه تکنیک کاربردی</h3>'+
    rc.tools.map((tool,i)=>'<details class="sf-technique" '+(i===0?'open':'')+'><summary>'+(i+1)+' · '+escapeHTML(tool[0])+'</summary>'+
     '<div class="sf-technique-content"><p>'+escapeHTML(tool[1])+'</p><div class="sf-technique-example"><b>مثال در گفت‌وگو</b>'+escapeHTML(tool[2])+'</div></div></details>').join('')+'</div>';
   firstBullets.insertAdjacentHTML("beforebegin",expanded);
   const review=document.createElement("details");review.className="sf-lesson-summary";
   review.innerHTML='<summary>مرور نکته‌های تکمیلی</summary>';
   firstBullets.parentElement.insertBefore(review,firstBullets);review.append(firstBullets);
   const example=rc.compare?.[getRole(s)];
   if(example?.length===2){
    const paired='<details class="sf-role-comparison"><summary>یک نمونه: قبل و بعد از تغییر رفتار</summary><div class="sf-comparison-grid">'+
    '<div class="sf-less-effective"><b>کم‌اثرتر</b>'+escapeHTML(example[0])+'</div>'+
    '<div class="sf-more-effective"><b>مؤثرتر</b>'+escapeHTML(example[1])+'</div></div></details>';
    lesson.querySelector(".case")?.insertAdjacentHTML("afterend",paired);
   }
  }
 }
 // From Alborz session four: observable self-check instead of abstract technique recall.
 const selfItems=root.querySelectorAll(".self-item>p");
 selfItems.forEach((el,i)=>{if(c.selfCheck?.[i])el.textContent=c.selfCheck[i]});
 const q=root.querySelector(".question")?.closest(".card");
 if(q)q.id="sf-quiz";
 const practice=root.querySelector(".charrow")?.closest(".card");
 if(practice){
  practice.id="sf-practice";
  const chars=practice.querySelectorAll(".charrow .character");
  chars.forEach((el,i)=>{if(!path.roles?.[i])return;
   const b=el.querySelector("b");if(b)b.textContent=path.roles[i];
   const brief=rc?.role?.[getRole(s)]?.[i];
   if(brief)el.insertAdjacentHTML("beforeend",'<details class="sf-role-brief"><summary>اطلاعات اختصاصی نقش</summary><p class="sf-private-note">فقط شخص اجراکننده این نقش بخواند.</p><p>'+escapeHTML(brief)+'</p></details>')});
  const checks=practice.querySelectorAll(".checkrow");
  checks.forEach((el,i)=>{
   if(!c.observer?.[i])return;
   const check=el.querySelector("input");
   if(!check)return;
   [...el.childNodes].filter(n=>n!==check).forEach(n=>n.remove());
   el.append(document.createTextNode(c.observer[i]));
  });
  practice.querySelector(".case")?.insertAdjacentHTML("afterend",'<div class="sf-skill-moment">🎯 لحظه مهارتی: '+escapeHTML(c.moment)+'</div>');
  practice.querySelector(".charrow")?.insertAdjacentHTML("afterend",'<p class="sf-preview-notice"><strong>پرسش مشاهده‌گر:</strong> '+escapeHTML(c.question)+'</p>');
  const dialog=path.dialogue||[];
  const example=done&&dialog.length?
    '<details class="sf-dialogue-box"><summary>مشاهده نمونه گفت‌وگو و لحظه‌های رفتاری</summary><p class="sf-dialogue-note">این نمونه بعد از قفل‌شدن دو پاسخ باز شده است. آن را برای تحلیل گفت‌وگو بخوانید؛ حفظ‌کردن متن هدف نیست.</p>'+
    dialog.map(line=>'<div class="sf-dialogue-item"><strong>'+escapeHTML(line[0])+'</strong>'+escapeHTML(line[1])+'</div>').join("")+
    '<p class="sf-reflection"><strong>برای تحلیل جمعی</strong>'+escapeHTML(c.question)+'</p></details>':
    '<div class="sf-preview-notice">🔒 گفت‌وگوی نمونه پس از ثبت قطعی هر دو پاسخ باز می‌شود؛ تحلیل پاسخنامه تا پایان سفر پنهان است.</div>';
  const verify=practice.querySelector(".locked")||practice.querySelector("#peername")||practice.querySelector(".sf-skill-moment");
  if(verify){
   verify.insertAdjacentHTML("beforebegin",example);
   if(rc){
    const debrief='<details class="sf-debrief"><summary><strong>پرسش‌های تحلیل و انتقال مهارت</strong></summary>'+
      rc.debrief.map((v,i)=>'<p>'+(i+1)+' · '+escapeHTML(v)+'</p>').join('')+
      '<div class="sf-common-trap"><strong>خطای رایج</strong> '+escapeHTML(rc.trap)+'</div>'+
      '<div class="sf-next-practice"><strong>تمرین در محیط کار:</strong> '+escapeHTML(rc.transfer)+'</div></details>';
    verify.insertAdjacentHTML("beforebegin",debrief);
   }
  }
 }
 const endActions=root.querySelector(".actions:last-of-type");
 const reflection='<div class="sf-reflection"><strong>این یادت بمونه!</strong>'+escapeHTML(stage.tip)+'<p class="smaller">برای گفت‌وگوی واقعی بعدی‌ات چه رفتاری را می‌خواهی تغییر بدهی؟</p></div>';
 if(endActions)endActions.insertAdjacentHTML("beforebegin",reflection);
}
function decorateReport(s){
 if(root.querySelector(".sf-classroom-applied"))return;
 const hero=root.querySelector(".result-hero");if(!hero)return;
 hero.classList.add("sf-classroom-applied");
 const scores=stages.map((stage,i)=>{
  const a=s.answers?.[i]||{};
  return{title:stage.title,i,score:(a.q1===stage.c1?4:0)+(a.q2?.best===stage.best?2:0)+(a.q2?.worst===stage.worst?2:0)}
 });
 const best=scores.filter(x=>x.score>=6).sort((a,b)=>b.score-a.score).slice(0,2);
 const practice=scores.filter(x=>x.score<=4).sort((a,b)=>a.score-b.score).slice(0,2);
 const strong=best.length?'<p><strong>نقاط اتکای شما در تصمیم‌های موقعیتی:</strong> '+best.map(x=>escapeHTML(x.title)).join("، ")+'</p>':'<p>این سفر فرصت شناسایی و تمرین مهارت‌هاست؛ نتیجه آزمون درباره شخصیت شما قضاوت نمی‌کند.</p>';
 const dev=practice.length?'<p><strong>پیشنهادهای تمرین بیشتر:</strong></p><ul>'+practice.map(x=>'<li><b>'+escapeHTML(x.title)+':</b> '+escapeHTML(stages[x.i].tip)+'</li>').join("")+'</ul>':'<p>در بیشتر موقعیت‌ها تصمیم‌های مناسبی گرفته‌ای. حالا نوبت انتقال مهارت‌ها به محیط کار است.</p>';
 hero.insertAdjacentHTML("afterend",'<section class="sf-report"><h3>🧩 بازتاب یادگیری و گام بعدی</h3>'+strong+dev+
 '<p class="sf-grade-note">این جمع‌بندی صرفاً بر اساس پاسخ‌های سناریویی است؛ ارزیابی رسمی عملکرد شغلی یا احراز صلاحیت نیست.</p>'+
 '<div class="sf-reflection"><strong>گام بعدی</strong>یک گفت‌وگوی واقعی در هفته آینده انتخاب کن، یک تکنیک را تمرین کن و اثر آن را یادداشت کن.</div></section>');
}
function decorate(){
 const s=readState();
 const btn=document.getElementById("sfClassroom");
 if(btn)btn.hidden=!s?.startedAt||!!s.finished;
 if(!s||!s.startedAt){decorateIntro();return}
 if(s.finished){decorateReport(s);return}
 if(s.stage>=0&&s.stage<stages.length)decorateStage(s);
}
function projector(){
 const s=readState();if(!s||!s.startedAt||s.finished)return;
 const c=getCur(s),path=c[getRole(s)],stage=stages[s.stage];
 lastFocus=document.activeElement;
 if(!display){display=document.createElement("section");display.id="sfPresenter";display.className="sf-presenter";display.hidden=true;display.setAttribute("role","dialog");display.setAttribute("aria-modal","true");display.setAttribute("aria-label","نمایش کلاسی سفر ارتباطات");document.body.append(display)}
 display.innerHTML='<div class="sf-presenter-content"><div class="sf-presenter-head"><div><span class="pill gold">نمای کلاس · بدون پاسخنامه یا نمره شخصی</span><h2>مرحله '+fa(s.stage+1)+' · '+escapeHTML(stage.title)+'</h2></div><button type="button" class="btn alt" id="sfClosePresenter">بستن نمایش ×</button></div>'+
 '<div class="sf-presenter-footer"><p>مدت پیشنهادی مرحله: '+fa(stage.time)+' دقیقه</p><strong id="sfScreenClock">۶۰:۰۰</strong></div>'+
 '<div class="sf-presenter-case">'+escapeHTML(s.role==="managers"?stage.mgr:stage.sup)+'</div>'+
 '<div class="sf-presenter-roles">'+path.roles.map(x=>'<span>🎭 '+escapeHTML(x)+'</span>').join("")+'</div>'+
 '<div class="sf-presenter-moment">'+escapeHTML(c.moment)+'</div>'+
 '<p><strong>پرسش برای تحلیل جمعی:</strong> '+escapeHTML(c.question)+'</p>'+
 '<p class="smaller">به‌منظور حفظ محرمانگی، هیچ پاسخ، نمره یا اطلاعات شخصی روی پرده نشان داده نمی‌شود.</p></div>';
 display.hidden=false;document.body.classList.add("sf-projector-open");
 tickScreen();document.getElementById("sfClosePresenter")?.focus();
}
function tickScreen(){
 if(!display||display.hidden)return;const el=document.getElementById("sfScreenClock");if(!el)return;
 const s=readState(),remaining=Math.max(0,3600000-(Date.now()-(s?.startedAt||Date.now()))),mm=String(Math.floor(remaining/60000)).padStart(2,"0"),ss=String(Math.floor(remaining%60000/1000)).padStart(2,"0");
 el.textContent=mm+":"+ss;
}
function closeProjector(){if(!display)return;display.hidden=true;document.body.classList.remove("sf-projector-open");lastFocus?.focus?.()}
function observe(){
 if(scheduled)return;scheduled=true;
 requestAnimationFrame(()=>{scheduled=false;decorate();if(display&&!display.hidden){closeProjector()}});
}
ensureHeader();
const observer=new MutationObserver(observe);
observer.observe(root,{childList:true,subtree:false});
document.addEventListener("click",e=>{
 if(e.target.closest("#sfClassroom")){e.preventDefault();projector()}
 if(e.target.closest("#sfClosePresenter")){e.preventDefault();closeProjector()}
});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&display&&!display.hidden)closeProjector()});
setInterval(tickScreen,1000);
decorate();
})();
