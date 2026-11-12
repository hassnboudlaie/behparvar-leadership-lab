/* Safar Ertebatat — wizard navigation v3
 * Each stage is a click-through set of independent focused pages.
 * Preserves the original assessment/timer/score rules and locked answers.
 * Client-side presentation layer only; not secure user authentication.
 */
(()=>{"use strict";
const root=document.getElementById("root");
if(!root)return;
const source=window.BP_SAFAR_DATA;
if(!source?.stages?.length)return;
const STAGES=source.stages,INCIDENTS=source.incidents||[];
const STORAGE="bp-communication-journey-v2",NAVKEY="bp-safar-nested-v3";
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fa=n=>Number(n??0).toLocaleString("fa-IR");
const card=(f)=>Array.from(root.children).find(node=>node.classList?.contains("card")&&f(node));
const state=()=>{try{let o=JSON.parse(localStorage.getItem(STORAGE)||"null");return o?.version===2?o:null}catch(e){return null}};
const navState=()=>{try{return JSON.parse(sessionStorage.getItem(NAVKEY)||"null")}catch(e){return null}};
const persist=(o)=>{try{sessionStorage.setItem(NAVKEY,JSON.stringify(o))}catch(e){}};
const labels={lesson:"یادگیری",self:"خودارزیابی",decision1:"تصمیم ۱",decision2:"تصمیم ۲",resource:"تخصیص منابع",role:"تمرین و بازخورد",peer:"بازخورد تکمیلی",wrap:"جمع‌بندی",rest:"ایستگاه آرامش"};
const icons={lesson:"📖",self:"✍️",decision1:"🎯",decision2:"⚖️",resource:"🪙",role:"💬",peer:"🔎",wrap:"✓",rest:"🌿"};
let tracked=null;
let currentPhase="lesson",scheduled=false;
function sequence(s){
 return ["lesson","self","decision1","decision2",...(INCIDENTS.some(x=>x.stage===s.stage+1)?["resource"]:[]),"role",...([2,7].includes(s.stage)?["peer"]:[]),"wrap",...([2,6].includes(s.stage)?["rest"]:[])];
}
function phaseKey(s){return String(s.startedAt)+":"+String(s.stage)}
const REST_MS=30000;
const restStorageKey=s=>"bp-safar-rest-"+phaseKey(s);
function restStart(s){
 const key=restStorageKey(s);
 let started=Number(sessionStorage.getItem(key)||0);
 if(!started||started>Date.now()){started=Date.now();try{sessionStorage.setItem(key,String(started))}catch(e){}}
 return started;
}
function restRemaining(s){return Math.max(0,REST_MS-(Date.now()-restStart(s)));}
function restStation(s){
 const first=s.stage===2;
 return '<div class="sf-rest-canvas '+(first?'rest-one':'rest-two')+'">'+
 '<img class="sf-rest-photo" src="assets/behparvar-campus.webp" alt="منظره واقعی سرسبز، رودخانه و مجموعه صنعتی به‌پرور" loading="eager">'+
 '<div class="sf-rest-shade"><span class="sf-rest-kicker">ایستگاه آرامش '+(first?'اول':'دوم')+' از دو ایستگاه</span>'+
 '<h3>'+(first?'یک مکث برای شنیدن':'یک مکث برای همکاری')+'</h3>'+
 '<p>'+(first?'گاهی برای شنیدن بهتر، باید سرعت خودمان را کمی کم کنیم.':'گاهی بهترین قدم بعدی، دیدن مسئله از زاویه دیگری است.')+'</p></div></div>'+
 '<div class="sf-rest-body"><div class="sf-rest-seconds"><span id="sfRestSeconds">۳۰</span><small>ثانیه استراحت</small></div>'+
 '<div><strong>یک تمرین کوچک برای همین لحظه</strong><p id="sfBreathText">'+(first?'چند لحظه به رودخانه نگاه کن؛ تنش شانه‌ها را رها کن.':'به مسیر حرکت آب نگاه کن؛ یک گفت‌وگوی دشوار را بدون قضاوت به یاد بیاور.')+'</p>'+
 '<button type="button" id="sfBreathe" class="sf-rest-breathe">◉ یک دم و بازدم آگاهانه</button></div></div>'+
 '<p class="sf-rest-foot">این ۳۰ ثانیه بخشی از زمان ۶۰دقیقه‌ای سفر است. بعد از اتمام، دکمه ادامه فعال می‌شود.</p>';
}
function ensureState(s){
 const k=phaseKey(s);
 if(tracked!==k){
  tracked=k;
  const n=navState();
  currentPhase=n?.key===k&&sequence(s).includes(n.phase)?n.phase:"lesson";
  persist({key:k,phase:currentPhase});
 }
}
function setPhase(s,p){
 if(!sequence(s).includes(p))return;
 currentPhase=p;persist({key:phaseKey(s),phase:p});if(p==="rest")restStart(s);
 apply(true);
 window.scrollTo({top:0,behavior:window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches?"auto":"smooth"});
}
function eligibility(s,p){
 const a=s.answers?.[s.stage]||{};
 if(p==="self")return (s.self?.[s.stage]||[]).filter(v=>Number(v)>=1&&Number(v)<=4).length===3;
 if(p==="decision1")return Number.isInteger(a.q1)&&a.q1>=0&&a.q1<4;
 if(p==="decision2")return !!a.q2&&Number.isInteger(a.q2.best)&&Number.isInteger(a.q2.worst);
 if(p==="wrap")return !!a.q2&&Number.isInteger(a.q1);
 if(p==="rest")return restRemaining(s)===0;
 return true;
}
function skipNotice(s,p){
 if(p==="resource"&&!s.alloc?.[s.stage])return "چالش تخصیص منابع هنوز ثبت نشده. می‌خواهی بدون امتیاز آن ادامه بدهی؟";
 if(p==="role"&&!s.rp?.[s.stage])return "تمرین دونفره هنوز تأیید نشده است. می‌خواهی بدون امتیاز آن ادامه بدهی؟";
 if(p==="peer"&&!s.peer?.[s.stage])return "بازخورد تحلیلی تکمیلی هنوز ثبت نشده است. می‌خواهی بدون امتیاز آن ادامه بدهی؟";
 return "";
}
function companion(s,p){
 const tips=STAGES[s.stage]?.tip||"در گفت‌وگو، دیدگاه مقابل را جدی بگیر.";
 const messages={
  lesson:"خوش اومدی به مهارت این مرحله. "+tips,
  self:"حالا به رفتار خودت فکر کن. این پاسخ‌ها برای شناخت بهتر مهارته، نه قضاوت درباره تو.",
  decision1:"رسیدیم به اولین انتخاب. قبل از ثبت، پیامد هر گزینه رو برای رابطه و نتیجه بررسی کن.",
  decision2:"این بار دو کار داری: بهترین و ضعیف‌ترین اقدام رو جدا تشخیص بده. عجله نکن.",
  resource:"شرایط تغییر کرده و منابع محدودن؛ همه کارها رو نمی‌شه هم‌زمان در اولویت اول گذاشت.",
  role:"حالا با یک همکار گفت‌وگو کن. یه نکته: شنیدن، سؤال خوب و توافق روشن رو فراموش نکن.",
  peer:"فقط بگو چه رفتاری واقعاً دیدی و یک پیشنهاد اجرایی بده.",
  wrap:"آفرین، این مرحله رو پشت سر گذاشتی! پاسخ‌ها ثبت شدن؛ تحلیل و امتیاز در پایان سفر دیده می‌شن.",
  rest:"حالا وقت یه استراحت کوتاهه. شانه‌هات رو رها کن و با دقت به تصویر نگاه کن؛ تا چند ثانیه دیگه ادامه می‌دیم."
 };
 return messages[p]||messages.lesson;
}
function panelFor(s,p){
 if(p==="lesson")return card(n=>!!n.querySelector(".bullets"));
 if(p==="self")return card(n=>!!n.querySelector(".self-list"));
 if(p==="decision1"||p==="decision2")return card(n=>!!n.querySelector(".question"));
 if(p==="resource")return card(n=>n.classList.contains("alert"));
 if(p==="role")return card(n=>!!n.querySelector(".charrow"));
 if(p==="peer")return card(n=>(n.textContent||"").includes("چالش تکمیلی: بازخورد تحلیلی"));
 if(p==="wrap")return root.querySelector("#sfWizardWrap");
 if(p==="rest")return root.querySelector("#sfWizardRest");
 return null;
}
function headHTML(s){
 const seq=sequence(s),pos=Math.max(0,seq.indexOf(currentPhase)),stage=STAGES[s.stage];
 return '<div class="sf-wizard-head-top"><div><small>جلسه چهارم · سفر ارتباطات · '+esc(s.role==="managers"?"مسیر مدیران":"مسیر سرپرستان")+'</small>'+
 '<h2>'+esc(stage.icon)+" "+esc(stage.title)+'</h2></div><span class="phase-counter">گام '+fa(pos+1)+' از '+fa(seq.length)+'</span></div>'+
 '<details class="sf-wizard-mini-map"><summary>🧭 نقشه ۱۰ مرحله · در حال انجام مرحله '+fa(s.stage+1)+'</summary><div class="map-inner">'+
 STAGES.map((t,i)=>(i<s.stage?"✓ ":i===s.stage?"● ":"🔒 ")+fa(i+1)+" "+esc(t.title)).join(" | ")+'</div></details>'+
 '<div class="sf-wizard-steps" role="group" aria-label="گام‌های داخل مرحله">'+seq.map((p,i)=>
 '<button type="button" data-sf-phase="'+p+'" class="sf-wizard-step '+(i<pos?"done":i===pos?"current":"future")+'" '+(i>pos?"disabled":"")+' aria-current="'+(i===pos?"step":"false")+'"><span>'+icons[p]+'</span>'+labels[p]+'</button>'
 ).join("")+'</div>';
}
function renderTop(s){
 const anchor=root.querySelector(".progressrow")||root.querySelector(".statusbar")||root.querySelector(".minibanner");
 const top=document.createElement("section");
 top.id="sfWizardHead";
 top.className="sf-wizard-head sf-wizard-visible";
 top.innerHTML=headHTML(s);
 if(anchor)anchor.insertAdjacentElement("afterend",top);else root.prepend(top);
 const guide=document.createElement("div");
 guide.id="sfWizardCoach";
 guide.className="sf-wizard-coach sf-wizard-visible";
 guide.innerHTML='<strong>💛 همراه سفر</strong>'+esc(companion(s,currentPhase));
 top.insertAdjacentElement("afterend",guide);
 const nav=document.createElement("nav");
 nav.id="sfWizardNav";
 nav.className="sf-wizard-nav sf-wizard-visible";
 nav.setAttribute("aria-label","پیشروی در سفر ارتباطات");
 const seq=sequence(s),i=seq.indexOf(currentPhase),eligible=eligibility(s,currentPhase);
 const next=i===seq.length-1?(s.stage===9?"پایان سفر و مشاهده نتیجه":"ثبت مرحله و ورود به مرحله بعد"):"ادامه به "+labels[seq[i+1]];
 nav.innerHTML='<button type="button" id="sfPrev" class="btn previous-step" '+(i===0?"disabled":"")+'>→ گام قبل</button>'+
 '<small>'+(eligible?(skipNotice(s,currentPhase)?"فعالیت تکمیلی ثبت نشده؛ در صورت عبور، امتیاز آن منظور نمی‌شود.":"آماده ادامه مسیر هستی."):"برای ادامه، ابتدا فعالیت این صفحه را کامل و ثبت کن.")+'</small>'+
 '<button type="button" id="sfNext" class="btn primary-step" '+(!eligible?"disabled":"")+'>'+esc(next)+' ←</button>';
 root.append(nav);
 const wrap=document.createElement("section");
 wrap.id="sfWizardWrap";
 wrap.className="sf-wrap-card sf-wizard-visible";
 wrap.innerHTML='<div class="soft-icon">✓</div><h3>مرحله '+fa(s.stage+1)+' تکمیل شد</h3><p>پاسخ‌های این مرحله ثبت شدند. برای مرور تحلیلی و دریافت امتیاز، سفر ۱۰مرحله‌ای را کامل کن.</p>'+
 ([2,5,9].includes(s.stage)?'<span class="sf-milestone">✦ نقطه عطف سفر</span>':"");
 nav.insertAdjacentElement("beforebegin",wrap);
 if([2,6].includes(s.stage)){
  const rest=document.createElement("section");rest.id="sfWizardRest";rest.className="sf-rest-station sf-wizard-visible";
  rest.innerHTML=restStation(s);
  nav.insertAdjacentElement("beforebegin",rest);
  if(currentPhase==="rest")restStart(s);
 }
}
function syncVisibility(s){
 const chosen=panelFor(s,currentPhase);
 const questionCard=(currentPhase==="decision1"||currentPhase==="decision2")?chosen:null;
 if(questionCard){
  const questions=questionCard.querySelectorAll(".question");
  questions.forEach((el,i)=>el.classList.toggle("sf-question-hidden",currentPhase==="decision1"?i!==0:i!==1));
 }
 for(const n of root.children){
  let show=n.classList?.contains("minibanner")||n.classList?.contains("statusbar")||n.classList?.contains("progressrow")||
  n.id==="sfWizardHead"||n.id==="sfWizardCoach"||n.id==="sfWizardNav"||n===chosen;
  if(n.id==="sfWizardWrap"&&currentPhase==="wrap")show=true;
  if(n.id==="sfWizardWrap"&&currentPhase!=="wrap")show=false;
  if(n.id==="sfWizardRest"&&currentPhase!=="rest")show=false;
  n.classList?.toggle("sf-wizard-visible",!!show);
  if(n.classList?.contains("card"))n.classList.toggle("sf-wizard-pane",n===chosen);
 }
 // Hide question one or two within the same quiz card, preserving each locked answer.
 if(questionCard){
  const questions=questionCard.querySelectorAll(".question");
  questions.forEach((el,i)=>el.classList.toggle("sf-question-hidden",currentPhase==="decision1"?i!==0:i!==1));
 }
}
function clearWizard(){
 if(root.dataset.sfWizard==="on"){
  delete root.dataset.sfWizard;
  root.classList.remove("sf-wizard-page");
  document.body.classList.remove("sf-wizard-on");
 }
}
function apply(force=false){
 const s=state();
 if(!s||!s.startedAt||s.finished){
  tracked=null;clearWizard();return;
 }
 ensureState(s);
 const top=root.querySelector("#sfWizardHead");
 if(!force&&top&&top.dataset.key===phaseKey(s)&&top.dataset.phase===currentPhase){
  syncVisibility(s);return;
 }
 for(const id of ["sfWizardHead","sfWizardCoach","sfWizardWrap","sfWizardRest","sfWizardNav"])
  root.querySelector("#"+id)?.remove();
 root.dataset.sfWizard="on";
 root.classList.add("sf-wizard-page");document.body.classList.add("sf-wizard-on");
 renderTop(s);
 const head=root.querySelector("#sfWizardHead");
 head.dataset.key=phaseKey(s);
 head.dataset.phase=currentPhase;
 syncVisibility(s);
}
function forward(){
 const s=state();if(!s||s.finished)return;
 const seq=sequence(s),idx=seq.indexOf(currentPhase);
 if(!eligibility(s,currentPhase)){alert("ابتدا فعالیت این صفحه را ثبت کن تا گام بعد باز شود.");return}
 // Optional activities can be skipped without repeated modal confirmations.
 // The existing stage-completion check confirms any missing bonuses once.
 const notice=skipNotice(s,currentPhase);
 if(idx===seq.length-1){
  if(currentPhase==="rest"&&restRemaining(s)>0)return;
  const coreNext=root.querySelector("#next");
  if(coreNext&&!coreNext.disabled)coreNext.click();
  else alert("ابتدا خودارزیابی و هر دو سؤال را تکمیل کن.");
  return;
 }
 setPhase(s,seq[idx+1]);
}
function backward(){
 const s=state();if(!s||s.finished)return;
 const seq=sequence(s),idx=seq.indexOf(currentPhase);
 if(idx>0)setPhase(s,seq[idx-1]);
}
function schedule(){
 if(scheduled)return;scheduled=true;
 requestAnimationFrame(()=>{scheduled=false;apply()});
}
const observer=new MutationObserver(schedule);
observer.observe(root,{childList:true,subtree:false});
document.addEventListener("click",e=>{
 const next=e.target.closest("#sfNext");if(next){e.preventDefault();forward();return}
 const prev=e.target.closest("#sfPrev");if(prev){e.preventDefault();backward();return}
 const direct=e.target.closest("[data-sf-phase]");
 if(direct&&!direct.disabled){e.preventDefault();const s=state();if(!s||s.finished)return;
  const seq=sequence(s),target=direct.getAttribute("data-sf-phase");
  if(seq.indexOf(target)<=seq.indexOf(currentPhase))setPhase(s,target);
 }
});
document.addEventListener("keydown",e=>{
 if(e.key==="ArrowLeft"&&e.altKey&&root.dataset.sfWizard==="on"){e.preventDefault();forward()}
 if(e.key==="ArrowRight"&&e.altKey&&root.dataset.sfWizard==="on"){e.preventDefault();backward()}
});
document.addEventListener("click",e=>{
 if(e.target.closest("#sfBreathe")){
  const txt=root.querySelector("#sfBreathText"),btn=root.querySelector("#sfBreathe");
  if(txt)txt.textContent="یک نفس آرام بکش؛ سپس بازدم را کمی طولانی‌تر کن. ببین چطور توجهت به همین لحظه برمی‌گردد.";
  if(btn){btn.textContent="✓ یک لحظه آگاهانه برای خودت ساختی";btn.classList.add("acknowledged");}
 }
});
function tickRest(){
 const s=state();if(!s||s.finished||currentPhase!=="rest"||root.dataset.sfWizard!=="on")return;
 const remaining=restRemaining(s),el=root.querySelector("#sfRestSeconds");
 if(el)el.textContent=fa(Math.ceil(remaining/1000));
 const button=root.querySelector("#sfNext");
 if(button)button.disabled=remaining>0;
 const hint=root.querySelector("#sfWizardNav small");
 if(hint)hint.textContent=remaining>0?"از این مکث کوتاه استفاده کن؛ ادامه تا "+fa(Math.ceil(remaining/1000))+" ثانیه دیگر فعال می‌شود.":"چه خوب! ایستگاه آرامش کامل شد؛ آماده ادامه سفر هستی.";
}
setInterval(tickRest,250);
apply();
})();