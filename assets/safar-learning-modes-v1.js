/* Safar Ertebatat — choice of competitive mission or untimed reading.
 * Browser-local pause: one voluntary five-minute pause per competitive journey.
 */
(()=>{"use strict";
const KEY="bp-communication-journey-v3",NAV="bp-safar-nested-v3",BREAK_MS=5*60000;
const data=window.BP_SAFAR_DATA,applied=window.BP_SAFAR_APPLIED;
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fa=n=>Number(n||0).toLocaleString("fa-IR");
const fetchState=()=>{try{return JSON.parse(localStorage.getItem(KEY)||"null")}catch{return null}};
let pauseOverlay=null;
const pauseSpent=s=>Math.max(0,Math.min(BREAK_MS,Number(s?.pause?.spentMs)||0));
const pauseCurrent=s=>s?.pause?.since?Math.max(0,Math.min(BREAK_MS-pauseSpent(s),Date.now()-s.pause.since)):0;
function stopOverlay(){if(!pauseOverlay)return;pauseOverlay.remove();pauseOverlay=null;document.querySelector(".shell")?.removeAttribute("inert");document.body.classList.remove("sf-modes-paused");}
function restart(s){
 const message=s.mode==="study"?"مطالعه آزاد از مرحله اول شروع شود؟ پیشرفت مطالعه فعلی پاک می‌شود.":s.finished?"نتیجه فعلی در سوابق همین دستگاه باقی می‌ماند. مأموریت تازه‌ای شروع کنیم؟":"شروع مجدد، پاسخ‌ها و امتیازهای مأموریت فعلی را پاک می‌کند. مطمئنی؟";
 if(!confirm(message))return;
 if(s.finished&&window.BP_SAFAR_SESSION?.grade){
  // The finished session is archived by the existing result view before reset.
 }
 stopOverlay();
 const fresh={version:3,role:"",name:s.name||"",startedAt:0,stage:0,answers:{},orders:{},self:{},alloc:{},rp:{},peer:{},events:[],finished:false,finishedAt:0,sound:!!s.sound,mode:"competitive",overtime:{pauseMs:0,grants:[]}};
 try{localStorage.setItem(KEY,JSON.stringify(fresh));sessionStorage.removeItem(NAV)}catch{alert("ذخیره‌سازی مرورگر در دسترس نیست.");return;}
 location.reload();
}
function switchStudy(s){
 if(s.mode==="study")return;
 if(!confirm("به حالت مطالعه آزاد برویم؟ پیشرفت مرحله‌ای حفظ می‌شود، اما امتیازها و پاسخ‌های رقابتی این تلاش دیگر برای دریافت نشان استفاده نمی‌شوند. برای رقابت دوباره باید مأموریت تازه‌ای شروع کنی."))return;
 stopOverlay();
 const stage=Math.min(9,Math.max(0,Number(s.stage)||0));
 s.mode="study";s.studyStage=stage;s.stage=stage;s.startedAt=0;s.finished=false;
 s.answers={};s.orders={};s.self={};s.alloc={};s.rp={};s.peer={};s.events=[];
 s.overtime={pauseMs:0,grants:[]};s.pause={since:0,spentMs:0,usedOnce:false};
 try{localStorage.setItem(KEY,JSON.stringify(s));sessionStorage.removeItem(NAV)}catch{alert("ثبت تغییر حالت ممکن نشد.");return;}
 location.reload();
}
function startPause(s,save,render){
 if(s.mode==="study"||!s.startedAt||s.finished)return;
 if(s.pause?.since)return;
 if(s.pause?.usedOnce){alert("مکث پنج‌دقیقه‌ای این مأموریت قبلاً استفاده شده است. می‌توانی بدون وقفه ادامه بدهی یا مطالعه آزاد را انتخاب کنی.");return;}
 if(window.BP_SAFAR_OVERTIME?.expired(s)){window.BP_SAFAR_OVERTIME.sync(s);return;}
 if(!confirm("یک مکث حداکثر ۵ دقیقه‌ای بدون کسر امتیاز داری. زمان در پایان ۵ دقیقه خودکار ادامه می‌یابد. مکث را شروع کنیم؟"))return;
 s.pause={spentMs:0,since:Date.now(),usedOnce:true};
 save();render();showPause(s,save,render);
}
function resume(s,save,render,automatic=false){
 if(!s.pause?.since)return;
 s.pause.spentMs=Math.min(BREAK_MS,pauseSpent(s)+Math.max(0,Date.now()-s.pause.since));
 s.pause.since=0;
 save();stopOverlay();render();
 if(automatic){
  const el=document.createElement("div");el.className="sf-mode-toast";el.textContent="مکث ۵ دقیقه‌ای تمام شد؛ مأموریت ادامه دارد.";el.setAttribute("role","status");document.body.appendChild(el);setTimeout(()=>el.remove(),5000);
 }
}
function showPause(s,save,render){
 if(pauseOverlay)return;
 const o=document.createElement("div");o.className="sf-mode-pause-backdrop";
 o.innerHTML='<section class="sf-mode-pause-panel" role="dialog" aria-modal="true" aria-labelledby="sfModePauseTitle" dir="rtl">'+
 '<div class="sf-mode-pause-emoji">⏸</div><small>زمان مأموریت موقتاً متوقف شده</small><h2 id="sfModePauseTitle">یک مکث کوتاه، سپس ادامه سفر</h2>'+
 '<p>تا ۵ دقیقه می‌توانی استراحت کنی. پس از آن تایمر خودکار فعال می‌شود؛ این مکث امتیاز کسر نمی‌کند.</p>'+
 '<strong id="sfModePauseCountdown">۰۵:۰۰</strong>'+
 '<button type="button" id="sfModeResume" class="sf-mode-mainbtn">▶ ادامه مأموریت</button>'+
 '<button type="button" id="sfModePauseStudy" class="sf-mode-textbtn">ادامه مسیر به‌صورت مطالعه آزاد، بدون امتیاز</button></section>';
 document.body.appendChild(o);pauseOverlay=o;
 document.querySelector(".shell")?.setAttribute("inert","");
 document.body.classList.add("sf-modes-paused");
 o.querySelector("#sfModeResume").addEventListener("click",()=>resume(s,save,render));
 o.querySelector("#sfModePauseStudy").addEventListener("click",()=>switchStudy(s));
 o.querySelector("#sfModePauseCountdown").textContent=format(BREAK_MS-pauseSpent(s)-pauseCurrent(s));
}
function format(ms){const t=Math.max(0,Math.ceil(ms/1000));return String(Math.floor(t/60)).padStart(2,"0")+":"+String(t%60).padStart(2,"0");}
function syncPause(s,save,render){
 if(s.mode==="study"||!s.startedAt||s.finished){stopOverlay();return false;}
 if(s.pause?.since){
  const left=BREAK_MS-pauseSpent(s)-pauseCurrent(s);
  if(left<=0){resume(s,save,render,true);return false;}
  showPause(s,save,render);
  const count=pauseOverlay?.querySelector("#sfModePauseCountdown");if(count)count.textContent=format(left);
  return true;
 }
 stopOverlay();return false;
}
function studyHTML(s){
 const i=Math.min(9,Math.max(0,Number(s.studyStage)||0)),st=data?.stages?.[i],unit=applied?.units?.[i];
 if(!st||!unit)return '<section class="sf-study-shell">محتوای مرحله در دسترس نیست.</section>';
 const job=s.role==="managers"?"mgr":"sup",scene=unit[job];
 const tools=unit.tools||[];
 return '<div class="sf-study-shell" dir="rtl">'+
 '<div class="sf-study-hero"><span class="sf-study-kicker">مسیر مطالعه آزاد · بدون تایمر، امتیاز یا نشان</span><h1>'+esc(st.icon)+" "+esc(st.title)+'</h1>'+
 '<div class="sf-study-progress"><b>مرحله '+fa(i+1)+' از ۱۰</b><span>پیشرفت مطالعه: '+fa(Math.round((i+1)*10))+'٪</span></div></div>'+
 '<div class="sf-study-pager"><button type="button" data-sf-study-step="'+(i-1)+'" '+(i===0?"disabled":"")+'>مرحله قبل</button>'+
 '<button type="button" data-sf-study-step="'+(i+1)+'" '+(i===9?"disabled":"")+'>مرحله بعد ←</button></div>'+
 '<details class="sf-study-index"><summary>مشاهده فهرست ۱۰ مرحله</summary><div class="sf-study-indexgrid">'+
 data.stages.map((step,j)=>'<button type="button" data-sf-study-step="'+j+'" '+(i===j?'aria-current="step"':'')+'>'+fa(j+1)+'. '+esc(step.title)+'</button>').join("")+'</div></details>'+
 '<article class="sf-study-panel"><span class="sf-study-label">این مهارت به چه معناست؟</span><h2>'+esc(unit.skill)+'</h2><p>'+esc(unit.definition)+'</p>'+
 '<div class="sf-study-outcome"><strong>در محیط کار چه کمکی می‌کند؟</strong><p>'+esc(unit.outcome)+'</p></div></article>'+
 '<article class="sf-study-panel"><span class="sf-study-label">سه تکنیک کاربردی</span><div class="sf-study-toolgrid">'+tools.map((t,j)=>
 '<div class="sf-study-tool"><h3>'+fa(j+1)+'. '+esc(t[0])+'</h3><p>'+esc(t[1])+'</p><blockquote>'+esc(t[2])+'</blockquote></div>').join("")+'</div></article>'+
 '<article class="sf-study-panel"><span class="sf-study-label">یک موقعیت واقعی و ملموس</span><h2>'+esc(s.role==="managers"?"موقعیت مدیر":"موقعیت سرپرست")+'</h2>'+
 '<p class="sf-study-case">'+esc(scene.case)+'</p><div class="sf-study-dialogue"><h3>گفت‌وگوی نمونه</h3>'+
 (scene.dialogue||[]).map(turn=>'<p><strong>'+esc(turn[0])+':</strong> '+esc(turn[1])+'</p>').join("")+'</div></article>'+
 '<article class="sf-study-panel sf-study-mentor"><span class="sf-study-label">همراه یادگیری</span><h2>چه نکته‌ای را با خودت می‌بری؟</h2><p>'+esc(unit.transfer)+'</p>'+
 '<p class="sf-study-caution"><b>حواست باشد:</b> '+esc(unit.trap)+'</p>'+
 '<details><summary>دو پرسش برای فکرکردن (اختیاری)</summary><div class="sf-study-reflect">'+(unit.debrief||[]).map(q=>'<p>'+esc(q)+'</p>').join("")+'</div></details></article>'+
 '<div class="sf-study-pager bottom"><button type="button" data-sf-study-step="'+(i-1)+'" '+(i===0?"disabled":"")+'>→ قبلی</button>'+
 (i===9?'<button type="button" id="sfStudyFinished" class="sf-mode-mainbtn">مطالعه ۱۰ مرحله را به پایان رساندم</button>':
 '<button type="button" data-sf-study-step="'+(i+1)+'" class="sf-mode-mainbtn">ادامه به مرحله '+fa(i+2)+' ←</button>')+'</div>'+
 '</div>';
}
function renderStudy(s){
 document.body.classList.add("sf-study-mode");document.body.classList.remove("sf-wizard-on","sf-modes-paused");
 document.getElementById("root").innerHTML=studyHTML(s);
 const clock=document.getElementById("clock");if(clock){clock.textContent="مطالعه آزاد";clock.setAttribute("aria-label","مطالعه بدون محدودیت زمانی");clock.classList.add("sf-study-clock");}
 stopOverlay();syncControls(s);
}
function nextStudy(s,step,save,render){
 if(s.mode!=="study")return;
 const n=Number(step);if(!Number.isInteger(n)||n<0||n>=10)return;
 s.studyStage=n;s.stage=n;save();render();
 window.scrollTo({top:0,behavior:window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches?"auto":"smooth"});
}
function syncControls(s){
 const host=document.querySelector(".top-actions");if(!host)return;
 let nav=host.querySelector("#sfModeControls");
 if(!nav){nav=document.createElement("nav");nav.id="sfModeControls";nav.className="sf-mode-controls";nav.setAttribute("aria-label","ابزارهای مدیریت سفر");host.insertBefore(nav,host.querySelector("a[href]")||null);}
 const mode=s.mode||"competitive",active=!!s.startedAt&&!s.finished,study=mode==="study";
 let html="";
 if(active){
  html+='<button type="button" id="sfPauseTime" '+(s.pause?.usedOnce?'disabled title="مکث این سفر استفاده شده است"':'')+'>⏸ مکث زمان</button>';
  html+='<button type="button" id="sfSwitchStudy">مطالعه آزاد</button>';
 }
 if(active||study||s.finished)html+='<button type="button" id="sfRestartJourney" class="sf-mode-restart">↻ شروع مجدد</button>';
 if(study)html+='<span class="sf-mode-nopoints">بدون امتیاز</span>';
 if(nav.innerHTML!==html)nav.innerHTML=html;
 const btn=document.getElementById("sound");if(btn)btn.hidden=study;
}
function initListeners(getState,save,render){
 const handler=e=>{
  const button=e.target.closest("button");if(!button)return;
  const s=getState();
  if(button.id==="sfPauseTime"){e.preventDefault();startPause(s,save,render);}
  if(button.id==="sfSwitchStudy"){e.preventDefault();switchStudy(s);}
  if(button.id==="sfRestartJourney"){e.preventDefault();restart(s);}
  if(button.id==="sfStartStudy"){
   if(!s)return;
   const role=document.querySelector(".role-card.active")?.dataset.role||s.role;
   if(!["managers","supervisors"].includes(role))return;
   s.mode="study";s.role=role;s.studyStage=0;s.stage=0;s.name=document.getElementById("learner")?.value.trim()||s.name;
   s.startedAt=0;s.finished=false;s.answers={};s.self={};s.alloc={};s.rp={};s.peer={};
   save();render();
  }
  if(button.dataset.sfStudyStep!==undefined){e.preventDefault();nextStudy(s,button.dataset.sfStudyStep,save,render);}
  if(button.id==="sfStudyFinished"){e.preventDefault();const target=document.querySelector(".sf-study-hero");if(target){target.insertAdjacentHTML("beforeend",'<p class="sf-study-complete">✓ هر ۱۰ مرحله را مرور کردی. برای سنجش مهارت می‌توانی یک مأموریت رقابتی جدید شروع کنی.</p>');target.scrollIntoView({behavior:"smooth"});}}
 };
 document.addEventListener("click",handler);
}
window.BP_SAFAR_MODES={BREAK_MS,pauseSpent,pauseCurrent,syncPause,syncControls,initListeners,renderStudy};
})();
