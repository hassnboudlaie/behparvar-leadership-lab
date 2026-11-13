/* Behparvar Safar | always-available contextual learning coach, two free new hints.
 * Each new stage/phase hint after two is 2 points, with explicit learner consent.
 * Reopening a previously unlocked hint never costs more. Reading mode is always free.
 * Browser-local gamification, not a secure official examination.
 */
(()=>{"use strict";
const KEY="bp-communication-journey-v3",FREE=2,COST=2;
const data=window.BP_SAFAR_DATA,units=window.BP_SAFAR_APPLIED?.units||[];
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fa=n=>Number(n||0).toLocaleString("fa-IR");
let boundState=null,boundSave=null,panel=null,button=null,lastContext="";
function state(){if(boundState)return boundState();try{return JSON.parse(localStorage.getItem(KEY)||"null")}catch{return null;}}
function reads(s){return Array.isArray(s?.guide?.uses)?s.guide.uses.filter(x=>typeof x.key==="string"):[];}
function penalty(s){return Math.min(100,reads(s).reduce((n,x)=>n+(Number.isInteger(x.cost)&&x.cost>0?x.cost:0),0));}
function uses(s){return reads(s).length;}
function phase(s){
 if(s.mode==="study")return"study";
 const head=document.getElementById("sfWizardHead");
 return head?.dataset?.key===String(s.startedAt)+":"+String(s.stage)?head.dataset.phase||"lesson":"lesson";
}
function context(s){
 const i=s.mode==="study"?Math.min(9,Math.max(0,Number(s.studyStage)||0)):Math.min(9,Math.max(0,Number(s.stage)||0));
 return{index:i,phase:phase(s),key:i+":"+phase(s)};
}
function current(s){return !!s?.version&&s.mode==="study"||!!s?.version&&!!s.startedAt&&!s.finished;}
function unlocked(s,key){return s.mode==="study"||reads(s).some(x=>x.key===key);}
function coaching(s,ctx){
 const unit=units[ctx.index]||{},stage=data?.stages?.[ctx.index]||{};
 const p=ctx.phase,skill=unit.skill||stage.title||"گفت‌وگو و تعامل حرفه‌ای";
 const tools=unit.tools||[],one=tools[0]||[],two=tools[1]||[];
 let observation="",practice="",question="";
 if(p==="study"||p==="lesson"){
  observation=unit.definition||"اول هدف گفت‌وگو و انتظار قابل مشاهده را روشن کن.";
  practice=(one[0]?one[0]+": ":"")+(one[1]||"رفتار قابل مشاهده خود را انتخاب کن.");
  question="در موقعیت کاری تو، کدام جمله یا رفتار نشان می‌دهد این مهارت واقعاً به کار رفته است؟";
 }else if(p==="self"){
  observation="برای خودارزیابی به یک موقعیت واقعی در دو هفته اخیر برگرد، نه برداشت کلی درباره شخصیت خودت.";
  practice="به این فکر کن چه کاری انجام دادی، دیگران چه رفتاری دیدند و نتیجه چه بود. نمره بالا یا پایین، برچسب شخصیتی نیست.";
  question="چه شاهد مشخصی برای انتخاب این سطح داری؟";
 }else if(p==="decision1"){
  observation="قبل از انتخاب، واقعیت‌های موقعیت، برداشت افراد و محدوده اختیار خودت را از هم تفکیک کن.";
  practice="گزینه‌ها را با سه معیار بسنج: حفظ احترام، روشن‌شدن مسئله، و امکان اقدام بعدی. هیچ گزینه‌ای را فقط به خاطر لحن خوشایند انتخاب نکن.";
  question="کدام پیامد ناخواسته ممکن است بعد از انتخاب تو ظاهر شود؟";
 }else if(p==="decision2"){
  observation="برای انتخاب بهترین و ضعیف‌ترین اقدام، دو ارزیابی مستقل انجام بده.";
  practice="ابتدا پیامد هر گزینه بر اعتماد، تصمیم اجرایی و پیگیری را بسنج. گزینه‌ای که فقط مسئله را به تعویق می‌اندازد را دقیق‌تر بررسی کن.";
  question="اگر این تصمیم هفته بعد اجرا شود، چه چیزی قابل مشاهده و قابل پیگیری است؟";
 }else if(p==="resource"){
  observation="شش سکه محدود هستند؛ قرار نیست همه گزینه‌ها سهم برابر بگیرند.";
  practice="پیش از تخصیص، اثر، فوریت و امکان اجرای هر اقدام را مقایسه کن؛ دست‌کم دو اقدام انتخاب کن و مجموع را دقیقاً شش نگه دار.";
  question="اگر فقط یک سکه باقی بماند، کدام اقدام بیشترین اثر را دارد و چرا؟";
 }else if(p==="role"){
  observation="در گفت‌وگوی دونفره، هدف قانع‌کردن فوری دیگری نیست؛ باید فهم مشترک و یک اقدام قابل اجرا شکل بگیرد.";
  practice=(two[0]?two[0]+": ":"")+(two[1]||"با پرسش باز شروع کن، سپس برداشت خود را خلاصه و توافق مشخص ایجاد کن.");
  question="مشاهده‌گر دقیقاً چه جمله یا رفتاری را می‌تواند در چک‌لیست ثبت کند؟";
 }else if(p==="peer"){
  observation="بازخورد را به رفتار قابل مشاهده بده، نه به نیت، شخصیت یا نتیجه‌گیری کلی درباره فرد.";
  practice="یک جمله یا رفتار واقعی را توصیف کن، اثر آن را بگو و تنها یک پیشنهاد عملی برای دفعه بعد ارائه بده.";
  question="چه شاهد رفتاری برای ادعایی که نوشته‌ای داری؟";
 }else if(p==="rest"){
  observation="این ایستگاه بخشی از یادگیری است، نه عقب‌ماندن از مسیر.";
  practice="نگاهت را از صفحه دور کن، شانه‌ها را رها کن و چند نفس آرام بکش.";
  question="با چه کیفیت توجهی می‌خواهی به گفت‌وگوی بعدی برگردی؟";
 }else{
  observation=unit.transfer||"آنچه آموختی را به یک رفتار کوچک و قابل اجرا تبدیل کن.";
  practice="یک عبارت یا اقدام را انتخاب کن که فردا در رابطه با همکار، مدیر یا ذی‌نفع استفاده‌اش می‌کنی.";
  question="چه چیزی کمک می‌کند همین رفتار را واقعاً اجرا و پیگیری کنی؟";
 }
 return '<div class="sf-guide-content"><span class="sf-guide-skill">'+esc(skill)+'</span>'+
 '<div class="sf-guide-idea"><b>دقیق‌تر ببین</b><p>'+esc(observation)+'</p></div>'+
 '<div class="sf-guide-idea"><b>یک تکنیک عملی</b><p>'+esc(practice)+'</p></div>'+
 '<div class="sf-guide-reflect"><b>پرسش راهنما</b><p>'+esc(question)+'</p></div>'+
 '<p class="sf-guide-boundary">راهنما فقط روش فکرکردن را پیشنهاد می‌کند؛ پاسخ صحیح و تحلیل گزینه‌ها تا پایان سفر پنهان می‌مانند.</p></div>';
}
function close(){if(!panel)return;panel.remove();panel=null;button?.setAttribute("aria-expanded","false");lastContext="";button?.focus?.({preventScroll:true});}
function body(s,ctx){
 if(!panel)return;
 lastContext=ctx.key;
 const done=unlocked(s,ctx.key),remaining=Math.max(0,FREE-uses(s)),study=s.mode==="study";
 const intro=study?"مطالعه آزاد · راهنما همیشه رایگان است":done?"راهنمای این گام قبلاً باز شده؛ مشاهده مجدد رایگان است":remaining?"از "+fa(remaining)+" راهنمای رایگان باقی‌مانده استفاده کن":"این راهنمای جدید با کسر "+fa(COST)+" امتیاز فعال می‌شود";
 const details=done?coaching(s,ctx):
 '<div class="sf-guide-locked"><p>اگر به راهنمای این گام نیاز داری، با یک نکته کاربردی و پرسش تأملی کمکت می‌کند تصمیم خودت را بگیری.</p>'+
 '<div class="sf-guide-price">'+(remaining?'<strong>رایگان</strong><span>استفاده '+fa(uses(s)+1)+' از '+fa(FREE)+' رایگان</span>':
 '<strong>−'+fa(COST)+' امتیاز</strong><span>مجموع کسر راهنما پس از تأیید: '+fa(penalty(s)+COST)+' امتیاز</span>')+'</div>'+
 '<button type="button" id="sfGuideReveal" class="sf-guide-reveal">'+(remaining?"دریافت راهنمای رایگان":"تأیید کسر "+fa(COST)+" امتیاز و دریافت راهنما")+'</button></div>';
 panel.querySelector("#sfGuideSubtitle").textContent=intro;
 panel.querySelector("#sfGuideBody").innerHTML=details;
}
function open(){
 const s=state();if(!current(s))return;
 const ctx=context(s);
 const aside=document.createElement("div");aside.className="sf-guide-backdrop";aside.id="sfGuideBackdrop";
 aside.innerHTML='<aside class="sf-guide-drawer" dir="rtl" role="dialog" aria-modal="true" aria-labelledby="sfGuideTitle">'+
 '<header class="sf-guide-heading"><div><span>همراه یادگیری</span><h2 id="sfGuideTitle">راهنمای این گام</h2><p id="sfGuideSubtitle"></p></div>'+
 '<button type="button" id="sfGuideClose" class="sf-guide-close" aria-label="بستن راهنما">×</button></header>'+
 '<div id="sfGuideBody" class="sf-guide-body"></div></aside>';
 document.body.appendChild(aside);panel=aside;button?.setAttribute("aria-expanded","true");
 aside.querySelector("#sfGuideClose").addEventListener("click",close);
 aside.addEventListener("click",e=>{if(e.target===aside)close();});
 aside.querySelector("#sfGuideBody").addEventListener("click",e=>{
  if(e.target.closest("#sfGuideReveal"))reveal();
 });
 body(s,ctx);aside.querySelector("#sfGuideClose").focus({preventScroll:true});
}
function reveal(){
 const s=state();if(!current(s))return;
 const ctx=context(s);if(unlocked(s,ctx.key)){body(s,ctx);return;}
 const history=reads(s),cost=history.length<FREE?0:COST;
 if(cost>0&&window.BP_SAFAR_OVERTIME?.expired(s)){close();window.BP_SAFAR_OVERTIME.sync(s);return;}
 const entry={key:ctx.key,stage:ctx.index,phase:ctx.phase,cost,at:Date.now()};
 const original=s.guide;
 s.guide={uses:[...history,entry]};
 try{localStorage.setItem(KEY,JSON.stringify(s));}
 catch(e){s.guide=original;alert("ثبت راهنما در این مرورگر ممکن نیست؛ لطفاً حافظه مرورگر را بررسی کن.");return;}
 boundSave?.();
 body(s,ctx);refresh();
 window.dispatchEvent(new CustomEvent("bp-safar-guide-used",{detail:{cost,count:uses(s),totalPenalty:penalty(s)}}));
}
function refresh(){
 const s=state(),visible=current(s);
 if(!visible){if(button){button.remove();button=null;}if(panel)close();return;}
 if(!button){
  button=document.createElement("button");button.type="button";button.id="sfGuideFloating";button.className="sf-guide-floating";
  button.setAttribute("aria-haspopup","dialog");button.setAttribute("aria-expanded","false");
  button.addEventListener("click",()=>panel?close():open());document.body.appendChild(button);
 }
 const remaining=Math.max(0,FREE-uses(s));
 button.innerHTML='<span class="sf-guide-symbol" aria-hidden="true">?</span><span class="sf-guide-label">راهنمای همراه</span>'+
 '<small>'+(s.mode==="study"?"رایگان":remaining?fa(remaining)+" نوبت رایگان":"راهنمای جدید: −"+fa(COST)+" امتیاز")+'</small>';
 button.setAttribute("aria-label","راهنمای همراه، "+(s.mode==="study"?"رایگان":remaining?fa(remaining)+" نوبت رایگان باقی‌مانده":"راهنمای جدید با دو امتیاز کسر"));
 const ctx=context(s);if(panel&&lastContext!==ctx.key)body(s,ctx);
}
function bind(getState,save){boundState=getState;boundSave=save;refresh();}
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&panel)close();});
const root=document.getElementById("root");
if(root){
 let scheduled=false;
 new MutationObserver(()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;refresh();});}).observe(root,{childList:true,subtree:false});
}
window.addEventListener("bp-safar-time-extended",refresh);
window.addEventListener("bp-safar-guide-used",refresh);
window.BP_SAFAR_GUIDE={FREE,COST,bind,refresh,uses,penalty,unlocked,context};
})();