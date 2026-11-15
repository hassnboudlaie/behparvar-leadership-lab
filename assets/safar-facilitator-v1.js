/* Behparvar facilitator presentation — independent learning data, no learner writes.
 * All stages use the SAME canonical applied curriculum, questions, roleplay and key.
 * Only sessionStorage key bp-safar-facilitator-preview-v1 is written.
 */
(()=>{
"use strict";
const DATA=window.BP_SAFAR_DATA,APPLIED=window.BP_SAFAR_APPLIED,CLASS=window.BP_SAFAR_CLASSROOM?.content||[];
const KEY="bp-safar-facilitator-preview-v1",MINUTE=60000;
const $=(s)=>document.querySelector(s);
const esc=x=>String(x??"").replace(/[&<>"']/g,k=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[k]));
const fa=n=>Number(n??0).toLocaleString("fa-IR");
const ul=(items,cls="")=>'<ul class="'+cls+'">'+(items||[]).map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul>';
if(!DATA?.stages||DATA.stages.length!==10||!APPLIED?.units||APPLIED.units.length!==10){
 $("#facContent").innerHTML='<section class="sf-fac-section"><h2>محتوای سفر بارگذاری نشد</h2><p>اتصال را بررسی و صفحه را دوباره باز کنید؛ داده شرکت‌کنندگان تغییری نکرده است.</p></section>';
 return;
}
const roles={supervisors:"سرپرستان",managers:"مدیران"};
const phases={
 overview:"معرفی مرحله",lesson:"درسنامه و تکنیک‌ها",self:"خودارزیابی",decision1:"آزمون تصمیم اول",
 decision2:"آزمون تصمیم دوم",resource:"چالش ۶ سکه",role:"رول‌پلی و دیالوگ",
 peer:"بازخورد همتایان",wrap:"جمع‌بندی و انتقال",rest:"ایستگاه آرامش",badges:"نشان‌ها و گزارش پایانی"
};
function phaseList(stage){
 return ["overview","lesson","self","decision1","decision2",
  ...(DATA.incidents.some(x=>Number(x.stage)===stage+1)?["resource"]:[]),
  "role",...([2,7].includes(stage)?["peer"]:[]),"wrap",
  ...([2,6].includes(stage)?["rest"]:[]),...(stage===9?["badges"]:[])];
}
function seed(){return {role:"supervisors",stage:0,phase:"overview",reveal:false,duration:60,
 remainingMs:3600000,running:false,lastTick:0}}
function restore(){
 try{
  const q=JSON.parse(sessionStorage.getItem(KEY)||"null");
  if(!q||!roles[q.role])return seed();
  const s={...seed(),...q};
  s.stage=Math.max(0,Math.min(9,Math.trunc(Number(s.stage)||0)));
  if(!phaseList(s.stage).includes(s.phase))s.phase="overview";
  s.duration=Math.max(1,Math.min(180,Math.trunc(Number(s.duration)||60)));
  s.remainingMs=Math.max(0,Number(s.remainingMs)||0);
  if(s.running){s.remainingMs=Math.max(0,s.remainingMs-(Date.now()-Number(s.lastTick||Date.now())));s.lastTick=Date.now();if(s.remainingMs<=0)s.running=false;}
  return s;
 }catch{return seed()}
}
let state=restore();
function save(){try{sessionStorage.setItem(KEY,JSON.stringify(state))}catch(e){$("#facClockStatus").textContent="ذخیره تنظیمات نمایش در این مرورگر امکان‌پذیر نیست."}}
function role(){return state.role==="managers"?"mgr":"sup"}
function indexRole(){return state.role==="managers"?1:0}
function part(){return APPLIED.units[state.stage]}
function lesson(){return DATA.stages[state.stage]}
function classroom(){return CLASS[state.stage]||{}}
function scene(){return part()[role()]||{}}
function incident(){return DATA.incidents.find(x=>Number(x.stage)===state.stage+1)}
function section(title,body,small=""){
 return '<section class="sf-fac-section">'+(small?'<div class="sf-fac-eyebrow">'+esc(small)+'</div>':"")+'<h2>'+esc(title)+'</h2>'+body+'</section>';
}
function caseView(text){
 return '<div class="sf-fac-case"><strong>موقعیت ویژه '+roles[state.role]+': </strong>'+esc(text||"")+'</div>';
}
function listOptions(options,kind,correct,weak,why){
 return '<ol class="sf-fac-options">'+(options||[]).map((option,i)=>{
   const isRight=state.reveal&&(kind==="first"?i===correct:i===correct);
   const isWeak=state.reveal&&kind!=="first"&&i===weak;
   return '<li class="'+(isRight?"is-correct":isWeak?"is-weak":"")+'">'+esc(option)+
    (state.reveal?'<div class="sf-fac-option-label">'+(isRight?(kind==="first"?"گزینه پیشنهادی صحیح":"بهترین اقدام"):isWeak?"ضعیف‌ترین اقدام":"تحلیل گزینه")+'</div>'+
    '<div class="sf-fac-explanation">'+esc(why?.[i]||"")+'</div>':"")+'</li>';
 }).join("")+'</ol>';
}
function overview(){
 const st=lesson(),u=part();
 return section("هدف یادگیری و موقعیت واقعی",
  '<div class="sf-fac-grid"><div class="sf-fac-card"><h3>مهارت محوری</h3><p>'+esc(u.skill)+'</p><h3>تعریف</h3><p>'+esc(u.definition)+'</p></div>'+
  '<div class="sf-fac-card"><h3>خروجی یادگیری</h3><p>'+esc(u.outcome)+'</p><h3>پیوند با محیط کار</h3><p>'+esc(u.behparvar||st.tip)+'</p></div></div>'+
  '<h3>موقعیت شروع گفت‌وگو</h3>'+caseView(scene().case||st[role()])+
  '<h3>پیام مدرس</h3><p>'+esc(u.transfer||st.tip)+'</p>',"چارچوب تدریس");
}
function tools(){
 const u=part(),st=lesson(),items=u.tools||[];
 const cards=items.map((tool,i)=>'<div class="sf-fac-card"><h3>'+fa(i+1)+'. '+esc(tool[0])+'</h3><p>'+esc(tool[1])+'</p><div class="sf-fac-note"><b>مثال گفت‌وگو:</b> '+esc(tool[2])+'</div></div>').join("");
 return section("درسنامه و سه تکنیک اجرایی",
  '<p>'+esc(u.definition)+'</p><div class="sf-fac-grid">'+cards+'</div>'+
  '<h3>اصول کلیدی این مرحله</h3>'+ul(st.lesson)+
  '<h3>دام رایج در اجرا</h3><p class="sf-fac-note">'+esc(u.trap)+'</p>',"توضیح مدرس | بدون قفل و بدون امتیاز");
}
function selfCheck(){
 const c=classroom(),u=part();
 return section("خودارزیابی و گفت‌وگوی تأملی",
  '<p>سه گزاره زیر را از دیدگاه رفتار قابل مشاهده بررسی کنید. در کنسول تسهیل‌گر نیازی به انتخاب یا ثبت نمره نیست.</p>'+
  ul(c.selfCheck?.length?c.selfCheck:DATA.stages[state.stage].lesson)+
  '<div class="sf-fac-note">در اپ شرکت‌کننده، مقیاس ۱ تا ۴ برای سه گزاره استفاده می‌شود. این صفحه هیچ امتیازی ثبت نمی‌کند.</div>'+
  '<h3>پرسش‌های بازتابی برای گروه</h3>'+ul(u.debrief), "Facilitated reflection");
}
function decisionOne(){
 const st=lesson(),roleIdx=indexRole();
 const q=st.q1?.[roleIdx]||"کدام اقدام مناسب‌تر است؟";
 const context=st.q1Context?.[roleIdx]||scene().case||st[role()];
 return section("آزمون تصمیم اول",
   caseView(context)+'<h3>'+esc(q)+'</h3>'+listOptions(st.a1,"first",st.c1,-1,st.why1)+
   (state.reveal?'<div class="sf-fac-note"><b>نقطه بحث:</b> چرا گزینه '+fa(st.c1+1)+' مناسب‌تر است؟ تحلیل گزینه‌ها را به شاخص‌های قابل مشاهده ربط بده.</div>':
   '<div class="sf-fac-note">کلید پاسخ در حالت نمایش پنهان است. برای مرور تشریحی، «نمایش کلید و تحلیل» را فعال کن.</div>'),"Case-based decision | Q1");
}
function decisionTwo(){
 const st=lesson(),q=st.q2?.[indexRole()]||"بهترین و ضعیف‌ترین اقدام کدام است؟";
 const ctx=st.q2Context?.[indexRole()]||scene().case||st[role()];
 return section("آزمون تصمیم دوم",caseView(ctx)+'<h3>'+esc(q)+'</h3>'+
 listOptions(st.a2,"second",st.best,st.worst,st.why2)+
 (state.reveal?'<div class="sf-fac-note"><b>نکته:</b> بهترین: گزینه '+fa(st.best+1)+'؛ ضعیف‌ترین: گزینه '+fa(st.worst+1)+'. پاسخ صحیح را بر اساس قاعده ارتباطی توضیح بده.</div>':
 '<div class="sf-fac-note">دو انتخاب مستقل «بهترین» و «ضعیف‌ترین» را با فراگیران بحث کن؛ تسهیل‌گر برای ادامه نیازی به انتخاب ندارد.</div>'),"Case-based decision | Q2");
}
function resources(){
 const x=incident();if(!x)return section("تخصیص منابع","<p>در این مرحله چالش سکه تعریف نشده است.</p>");
 return section("چالش تخصیص شش سکه",
  '<div class="sf-fac-case">'+esc(x.incident)+'</div><p>شرکت‌کنندگان باید ۶ سکه را میان چهار اولویت توزیع کنند؛ در این کنسول ورود اطلاعات و کسر امتیاز وجود ندارد.</p>'+
  '<div class="sf-fac-grid">'+x.items.map((name,i)=>'<div class="sf-fac-card"><strong>'+esc(name)+'</strong>'+
  (state.reveal?'<p>الگوی مرجع: '+fa(x.ideal?.[i]||0)+' سکه</p>':"")+'</div>').join("")+'</div>'+
  '<p class="sf-fac-footnote">الگوی مرجع تنها یکی از پاسخ‌های قابل دفاع است؛ با منطق، محدودیت‌ها و شواهد درباره جایگزین‌ها بحث کنید.</p>',"Resource-allocation simulation");
}
function roleplay(){
 const u=part(),c=classroom(),v=scene(),rubric=c.observer||[];
 const rolesText=(v.roles||[]).map((name,i)=>'<div class="sf-fac-card"><h3>نقش '+fa(i+1)+': '+esc(name)+'</h3><p>'+esc(v.roleBriefs?.[i]||"")+'</p></div>').join("");
 return section("Role-play | سناریو و گفت‌وگوی نمونه",
  caseView(v.case)+
  '<h3>توزیع نقش‌ها و اطلاعات اولیه</h3><div class="sf-fac-grid">'+rolesText+'</div>'+
  '<h3>دیالوگ نمونه برای نمایش و تحلیل</h3><div class="sf-fac-dialogue">'+(v.dialogue||[]).map(turn=>
    '<p><strong>'+esc(turn[0])+':</strong> '+esc(turn[1])+'</p>').join("")+'</div>'+
  '<h3>چک‌لیست مشاهده‌گر</h3>'+ul(rubric)+
  '<h3>انتقال به محیط واقعی</h3><p>'+esc(u.transfer)+'</p>',
  "نمایش زنده | سناریو مطابق مسیر انتخاب‌شده");
}
function peer(){
 const c=classroom();
 return section("بازخورد همتایان و Appreciation",
 '<p>در اپ اصلی، مشاهده‌گر می‌تواند کیفیت اجرای همکار را از ۱ تا ۵ ارزیابی کند و Feedback رفتاری بدهد. در این صفحه هیچ داده‌ای ثبت نمی‌شود.</p>'+
 '<h3>رفتارهای قابل مشاهده</h3>'+ul(c.observer)+
 '<div class="sf-fac-grid"><div class="sf-fac-card"><h3>قدردانی مشخص</h3><p>یک رفتار مفید که دیده‌ای را نام ببر؛ نه یک صفت کلی.</p></div>'+
 '<div class="sf-fac-card"><h3>پیشنهاد رشد</h3><p>برای گفت‌وگوی بعدی یک تغییر کوچک، قابل اجرا و قابل پیگیری پیشنهاد کن.</p></div></div>'+
 '<p class="sf-fac-note">Recognition باید مبتنی بر رفتار واقعی باشد؛ نه امتیاز هدیه یا مقایسه افراد.</p>',"Practice feedback");
}
function wrap(){
 const u=part();
 return section("جمع‌بندی و انتقال یادگیری",
  '<h3>یک نکته کلیدی</h3><p>'+esc(u.transfer)+'</p>'+
  '<h3>چه چیزی ممکن است از چشم دور بماند؟</h3><p>'+esc(u.trap)+'</p>'+
  '<h3>پرسش‌های پایانی</h3>'+ul(u.debrief)+
  '<div class="sf-fac-note">برای رفتن به هر مرحله یا گام بعدی، هیچ شرط آزمون، امتیاز یا تأیید مدرس وجود ندارد.</div>',"Debrief & Transfer");
}
function rest(){
 const msg=state.stage===2?"یک مکث برای شنیدن":"یک مکث برای همکاری";
 return section("ایستگاه آرامش ـ "+msg,
  '<img src="assets/behparvar-campus.webp" alt="نمایی از مجموعه به‌پرور" style="width:100%;max-height:300px;object-fit:cover;border-radius:12px">'+
  '<p>این ایستگاه در اپ فراگیر ۳۰ ثانیه زمان دارد. در کنسول تسهیل‌گر می‌توانی هر زمانی مکث یا بلافاصله عبور کنی.</p>'+
  '<h3>پیشنهاد اجرای تسهیل‌گری</h3><p>از شرکت‌کنندگان بخواه یک گفت‌وگوی اخیر را مرور و یک اقدام برای بهتر شنیدن یا بهتر همکاری‌کردن مشخص کنند.</p>',"Mindful micro-break");
}
function badges(){
 return section("نشان‌ها و گزارش نهایی ـ پیش‌نمایش",
  '<p>در تجربه فراگیر، امتیاز از ۱۰۰ محاسبه و نشان بر اساس عملکرد واقعی اعطا می‌شود. این صفحه صرفاً شرایط نشان‌ها را نشان می‌دهد و هیچ نشانی صادر نمی‌کند.</p>'+
  '<div class="sf-fac-badges"><span>زرین: ≥۹۰ کل و ≥۷۲ آزمون</span><span>سیمین: ≥۷۵ کل و ≥۶۰ آزمون</span><span>برنزی: ≥۶۰ کل و ≥۴۴ آزمون</span></div>'+
  '<h3>جمع‌بندی تسهیل‌گر</h3><p>ده مرحله را مرور کردی؛ می‌توانی به هر مرحله بازگردی، یک مسیر دیگر انتخاب کنی یا مجدداً تایمر ۶۰ دقیقه‌ای را فعال کنی.</p>'+
  '<div class="sf-fac-note">این بخش پاسخنامه و گواهی شرکت‌کننده نیست. مسیر رقابتی همچنان پاسخ و نمره حقیقی خود را مستقل نگه می‌دارد.</div>',"End-of-journey review");
}
function body(){
 switch(state.phase){
  case "overview":return overview();
  case "lesson":return tools();
  case "self":return selfCheck();
  case "decision1":return decisionOne();
  case "decision2":return decisionTwo();
  case "resource":return resources();
  case "role":return roleplay();
  case "peer":return peer();
  case "wrap":return wrap();
  case "rest":return rest();
  case "badges":return badges();
  default:return overview();
 }
}
function scrollContent(){const node=$("#facContent");node?.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});}
function setPosition(stage,phase,scroll=true){
 state.stage=Math.max(0,Math.min(9,stage));
 state.phase=phaseList(state.stage).includes(phase)?phase:"overview";
 state.reveal=false;
 save();render();
 if(scroll)scrollContent();
}
function navigate(dir){
 let stage=state.stage,seq=phaseList(stage),i=seq.indexOf(state.phase)+dir;
 if(i<0){if(stage===0)return;stage--;seq=phaseList(stage);i=seq.length-1;}
 if(i>=seq.length){if(stage===9)return;stage++;i=0;seq=phaseList(stage);}
 setPosition(stage,seq[i]);
}
function render(){
 $("#facRole").value=state.role;
 $("#facStage").innerHTML=DATA.stages.map((stage,i)=>'<option value="'+i+'">'+fa(i+1)+' · '+esc(stage.title)+'</option>').join("");
 $("#facStage").value=String(state.stage);
 $("#facPhase").innerHTML=phaseList(state.stage).map(p=>'<option value="'+p+'">'+esc(phases[p])+'</option>').join("");
 $("#facPhase").value=state.phase;
 $("#facStages").innerHTML=DATA.stages.map((st,i)=>
  '<button type="button" data-fac-stage="'+i+'" '+(i===state.stage?'aria-current="step"':'')+'>'+fa(i+1)+'. '+esc(st.title)+'</button>').join("");
 const pos=phaseList(state.stage).indexOf(state.phase)+1,len=phaseList(state.stage).length;
 $("#facProgress").textContent="مرحله "+fa(state.stage+1)+" از ۱۰ · بخش "+fa(pos)+" از "+fa(len);
 $("#facPrev").disabled=$("#facPrevBottom").disabled=state.stage===0&&pos===1;
 $("#facNext").disabled=$("#facNextBottom").disabled=state.stage===9&&pos===len;
 $("#facAnswers").setAttribute("aria-pressed",String(state.reveal));
 $("#facAnswers").textContent=state.reveal?"پنهان‌کردن کلید و تحلیل":"نمایش کلید و تحلیل";
 $("#facMinutes").value=String(state.duration);
 $("#facContent").innerHTML='<section class="sf-fac-section sf-fac-intro"><div class="sf-fac-eyebrow" style="color:#dcf1e0">مسیر '+roles[state.role]+' · مرحله '+fa(state.stage+1)+' از ۱۰</div><h2>'+esc(lesson().title)+'</h2><p>'+esc(phases[state.phase])+' · شرح، نمایش و بحث بدون نیاز به ثبت پاسخ</p></section>'+body();
 updateClock();
}
function updateClock(){
 let ms=Math.max(0,state.remainingMs);
 const secs=Math.ceil(ms/1000),m=String(Math.floor(secs/60)).padStart(2,"0"),s=String(secs%60).padStart(2,"0");
 $("#facClock").textContent=m+":"+s;
 $("#facClockStatus").textContent=ms<=0?"زمان تمام شده؛ مرور مراحل همچنان آزاد است":state.running?"در حال شمارش":"متوقف / آماده";
 $("#facTimerToggle").textContent=state.running?"توقف زمان":ms<=0?"شروع زمان تازه":"شروع / ادامه زمان";
 $("#facTimerToggle").setAttribute("aria-pressed",String(state.running));
}
function tick(){
 if(!state.running)return;
 const now=Date.now(),delta=Math.max(0,now-Number(state.lastTick||now));
 state.remainingMs=Math.max(0,state.remainingMs-delta);
 state.lastTick=now;
 if(state.remainingMs===0)state.running=false;
 save();updateClock();
}
$("#facRole").addEventListener("change",e=>{state.role=e.target.value;state.reveal=false;save();render()});
$("#facStage").addEventListener("change",e=>setPosition(Number(e.target.value),"overview"));
$("#facPhase").addEventListener("change",e=>setPosition(state.stage,e.target.value));
$("#facStages").addEventListener("click",e=>{
 const b=e.target.closest("[data-fac-stage]");if(b)setPosition(Number(b.dataset.facStage),"overview");
});
for(const id of ["facPrev","facPrevBottom"])$("#"+id).addEventListener("click",()=>navigate(-1));
for(const id of ["facNext","facNextBottom"])$("#"+id).addEventListener("click",()=>navigate(1));
$("#facAnswers").addEventListener("click",()=>{state.reveal=!state.reveal;save();render()});
$("#facTimerToggle").addEventListener("click",()=>{
 tick();
 if(state.remainingMs<=0)state.remainingMs=state.duration*MINUTE;
 state.running=!state.running;state.lastTick=Date.now();save();updateClock();
});
$("#facTimerReset").addEventListener("click",()=>{
 const n=Number($("#facMinutes").value);
 if(!Number.isInteger(n)||n<1||n>180){alert("مدت زمان باید بین ۱ تا ۱۸۰ دقیقه باشد.");return}
 state.duration=n;state.remainingMs=n*MINUTE;state.running=false;state.lastTick=0;save();updateClock();
});
$("#facFullscreen").addEventListener("click",async()=>{
 try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}
 catch(e){alert("این مرورگر حالت تمام‌صفحه را در دسترس قرار نمی‌دهد.")}
});
$("#facResetPreview").addEventListener("click",()=>{
 if(!confirm("فقط تنظیمات و تایمر کنسول تسهیل‌گر از ابتدا شروع شود؟ داده فراگیران تغییر نمی‌کند."))return;
 state=seed();save();render();scrollContent();
});
document.addEventListener("keydown",e=>{
 if(!e.altKey||e.target.closest("input,select,textarea"))return;
 if(e.key==="ArrowLeft"){e.preventDefault();navigate(1)}
 if(e.key==="ArrowRight"){e.preventDefault();navigate(-1)}
});
window.BP_SAFAR_FACILITATOR={current:()=>({...state}),jump:(stage,phase)=>setPosition(stage,phase),phasesFor:phaseList};
render();save();setInterval(tick,500);
})();