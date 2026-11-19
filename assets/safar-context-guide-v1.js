/* Behparvar Safar | always-available contextual learning coach, two free new hints.
 * Each new stage/phase hint after two is 2 points, with explicit learner consent.
 * Reopening a previously unlocked hint never costs more. Reading mode is always free.
 * Browser-local gamification, not a secure official examination.
 */
(()=>{"use strict";
const KEY="bp-session5-communication-journey-v1",FREE=2,COST=2;
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
const fieldTools=[
["دو ستون بساز: «چه چیزی باید تحویل شود؟» و «چطور می‌توان محترمانه درخواست کرد؟». تعهد کاری را با لحن پیام اشتباه نگیر.",
 "بعد از گفت‌وگو، تصور کن نفر مقابل باید یک پیام دوخطی برای اجرای کار بنویسد. اگر مالک کار یا موعد هنوز مبهم است، پیگیری ناقص مانده.",
 "«موعد تحویل ثابت است؛ دوست دارم بدانم کدام بخش درخواست من فرصت توضیح نداده است؟»"],
["عبارت دقیقِ مورد اختلاف را جداگانه یادداشت کن؛ کنار آن برداشت هر طرف را بنویس. فرض را جای واقعیت ننشان.",
 "از دید کسی که جلسه حضور نداشته، توافق را بخوان: آیا خروجی، صاحب تصمیم و شرط پذیرش قابل تشخیص‌اند؟",
 "«وقتی گفتیم امروز آماده است، منظور کدام خروجی و کدام سطح تأیید بود؟»"],
["یک ادعای کلی را به یک رخداد مشخص تبدیل کن؛ بدون این کار دفاع یا وعده‌دادن هر دو زودهنگام‌اند.",
 "از خودت بپرس آیا در اقدام بعدی، فرد احساس شنیده‌شدن دارد و هنوز امکان بررسی داده‌ها باقی می‌ماند؟",
 "«آخرین باری که این اتفاق افتاد چه زمانی بود؟ چه چیزی دیدی که تو را به این برداشت رساند؟»"],
["پیام را به «تصمیم، دلیل لازم، اقدام بعد» بشکن؛ سپس یک مکث برای دریافت واکنش در نظر بگیر.",
 "اگر مخاطب فقط حرفت را تکرار کند، آیا واقعاً می‌تواند اقدام لازم را مستقل انجام دهد؟",
 "«تصمیم فعلی این است؛ دلیلش این محدودیت است؛ لطفاً بگو قدم بعدی را چطور انجام می‌دهی.»"],
["دو رفتار را جدا کن: رفتار مؤثرِ قابل مشاهده و رفتاری که باید تغییر کند؛ از قضاوت درباره شخصیت پرهیز کن.",
 "به دنبال نشانه‌ای بگرد که فرد هم مسئولیت اقدام را می‌پذیرد و هم حمایت و موعد بازبینی روشن است.",
 "«در گزارش دیروز، بخش تحلیل دقیق بود؛ برای نسخه بعد چه کمکی نیاز داری تا زمان تحویل هم حفظ شود؟»"],
["بین ریسک فنی، فشار موعد و اختیار تصمیم مرزبندی کن؛ راه‌حلی که از استاندارد ایمنی عبور کند، راه‌حل نیست.",
 "در پایان بررسی کن آیا اقدامی مجاز، مسئول روشن و نقطه پیگیری وجود دارد یا فقط اختلاف به آینده منتقل شده است.",
 "«فشار زمان را می‌فهمم؛ بدون تأیید فنی این بخش را تغییر نمی‌دهم. برای مسیر مجاز چه گزینه‌ای داریم؟»"],
["درخواست را با چهار جزء بازنویسی کن: خروجی، موعد، وابستگی و ظرفیت. جمله مبهم را قابل مذاکره کن.",
 "به این فکر کن که طرف مقابل چگونه می‌تواند زودتر از موعد، بروز مانع را اطلاع دهد.",
 "«چه بخشی را با ظرفیت فعلی تا سه‌شنبه می‌توانی تحویل دهی و کدام وابستگی نیاز به تصمیم مشترک دارد؟»"],
["پشت ضرب‌الاجل اعلام‌شده، نیاز واقعی را شناسایی کن. نهِ صرف و بلهِ بدون اختیار هر دو می‌توانند مسئله را بدتر کنند.",
 "آیا اقدام تو مرز تعهد را صادقانه نگه می‌دارد و در عین حال یک گزینه عملی در اختیار ذی‌نفع می‌گذارد؟",
 "«این موعد برای کدام پیامد ضروری است؟ می‌توانم این بخش را قطعی کنم، اما درباره بخش دیگر باید بررسی کنم.»"],
["سه سطر بنویس: «آنچه می‌دانم»، «آنچه هنوز نیاز به بررسی دارد»، «زمان پاسخ بعدی». به جای توجیه زودهنگام.",
 "اگر کار به واحد دیگری منتقل شود، چه کسی همچنان مالک اطلاع‌رسانی به ذی‌نفع است؟",
 "«می‌فهمم این تأخیر چه اثری داشته؛ این بخش را تأیید می‌کنم و نتیجه بررسی باقی‌مانده را فردا اطلاع می‌دهم.»"],
["پیش از اقناع، معیار تصمیم طرف مقابل را حدس نزن: از ریسک، ظرفیت و اختیار او سؤال کن.",
 "یک توافق را مثل صورت‌جلسه آزمایش کن: مسئول، موعد، داده مجاز و شیوه بازبینی باید معلوم باشد.",
 "«از نظر شما ریسک اصلی کدام است؟ دو گزینه با پیامدهای متفاوت داریم؛ کدام برای اجرا واقع‌بینانه‌تر است؟»"]
];
function coaching(s,ctx){
 const i=ctx.index,p=ctx.phase,unit=units[i]||{},item=fieldTools[i],skill=unit.skill||data?.stages?.[i]?.title||"ارتباط حرفه‌ای";
 const doneQ=s.answers?.[i]||{};
 let method="",example="",check="",trap=unit.trap||"تصمیمی که قابل اجرا و پیگیری نباشد، لزوماً تصمیم خوبی نیست.";
 if(p==="decision1"){
  method=item[0];example=item[2];
  check=doneQ.q1!==undefined?"بعد از ثبت پاسخ: آیا می‌توانی بدون دیدن کلید، دلیل انتخاب خودت را در یک جمله مشخص توضیح بدهی؟":"قبل از ثبت پاسخ، سه گزینه را از نظر اختیار، اثر بر رابطه و امکان پیگیری مقایسه کن؛ فقط لحن خوب کافی نیست.";
 }else if(p==="decision2"){
  method=item[1];example=item[2];
  check=doneQ.q2!==undefined?"اکنون فکر کن کدام پیامد گزینه انتخاب‌شده ممکن است در اجرا تو را غافلگیر کند.":"بدون جست‌وجوی جواب، برای هر گزینه یک پیامد مثبت و یک ریسک عملی روی کاغذ بنویس؛ سپس قوی‌ترین و ضعیف‌ترین را جدا انتخاب کن.";
 }else if(p==="self"){
  method="یک رفتار مرتبط با «"+skill+"» را انتخاب کن و آخرین نوبتِ انجام یا انجام‌ندادن آن را به یاد بیاور. برای یافتن شاهد، این موقعیت را مرور کن: "+item[0];
  example="نمونه جمله متناسب با این مهارت: "+item[2]+"؛ سپس بنویس در موقعیت واقعی خودت چه کاری کردی.";
  check="در کدام موقعیت واقعی به این نتیجه رسیدی؟ اگر انتخاب خود را با آزمون «"+item[1]+"» بسنجی، شاهدت چیست؟";
  trap="تفاوت پاسخ‌های ۱ تا ۴، امتیاز رقابتی را تغییر نمی‌دهد؛ این ابزار برای خودآگاهی است.";
 }else if(p==="resource"){
  method="برای این موقعیت، اول این مرز را روشن کن: "+item[0]+" سپس شش سکه را بر اساس فوریت و شدت پیامد تخصیص بده.";
  example="پیش از تقسیم سکه‌ها این گفت‌وگوی ذهنی را تمرین کن: "+item[2];
  check="اگر یک سکه از گزینه اول کم کنی، چه خطری ایجاد می‌شود؟ برای بازبینی، این معیار را هم به کار ببر: "+item[1];
  trap=unit.trap||"تقسیم مساوی منابع همیشه به معنای تخصیص عادلانه نیست.";
 }else if(p==="rest"){
  method="چشم را از متن بردار، شانه را آزاد کن و سه بازدم آهسته انجام بده.";
  example="پس از مکث، فقط هدف تصمیم بعدی را در ذهن مرور کن؛ این ایستگاه آزمون نیست.";
  check="آیا با ذهن متمرکزتر از قبل به مرحله بعد برمی‌گردی؟";
  trap="برای این ۳۰ ثانیه لازم نیست هیچ پاسخ جدیدی تولید کنی.";
 }else if(p==="wrap"){
  method="یک رفتار از این مرحله را به قالب «چه وقت، با چه کسی، دقیقاً چه کار خواهم کرد؟» بنویس.";
  example=item[2];
  check="چه نشانه قابل مشاهده‌ای به تو می‌گوید این رفتار را در محیط کار واقعاً انجام داده‌ای؟";
 }else{
  method="به‌جای مرور دوباره تعریف، این تکنیک را در یک موقعیت کاری آشنا با جمله خودت تمرین کن: "+item[0];
  example=item[2];
  check="در اجرای واقعی، چه محدودیت اختیاری یا زمانی باید قبل از شروع روشن شود؟";
 }
 return '<div class="sf-guide-content"><span class="sf-guide-skill">'+esc(skill)+'</span>'+
 '<div class="sf-guide-idea"><b>گام عملی برای همین موقعیت</b><p>'+esc(method)+'</p></div>'+
 '<div class="sf-guide-idea"><b>نمونه جمله یا شاهد اجرایی</b><p>'+esc(example)+'</p></div>'+
 '<div class="sf-guide-reflect"><b>آزمون تصمیم خودت</b><p>'+esc(check)+'</p></div>'+
 '<div class="sf-guide-idea"><b>خطای قابل پیشگیری</b><p>'+esc(trap)+'</p></div>'+
 '<p class="sf-guide-boundary">این راهنما روش تحلیل و اجرای فردی را آموزش می‌دهد، نه شماره گزینه صحیح را. کلید و ارزیابی درست/غلط در پایان سفر باز می‌شود.</p></div>';
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