/* Behparvar session 4: voluntary early exit, proportional assessment and supportive closing.
 * Only locally recorded, fully completed stages enter the settled grade.
 * A partial journey is never represented as completion of all 10 stages.
 */
(()=>{"use strict";
const KEY="bp-session5-communication-journey-v1";
const root=document.getElementById("root");
const stages=window.BP_SAFAR_DATA?.stages||[];
const incidents=window.BP_SAFAR_DATA?.incidents||[];
if(!root||stages.length!==10)return;
const fa=n=>Number(n||0).toLocaleString("fa-IR");
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||"null")}catch(e){return null}};
const valid=(s,i)=>{const a=s.answers?.[i]||{},self=s.self?.[i]||[];
 return a.q1!==undefined&&a.q2?.best!==undefined&&a.q2?.worst!==undefined&&
 self.length===3&&self.every(v=>Number.isInteger(v)&&v>=1&&v<=4);
};
const maxStage=i=>9+(incidents.some(x=>x.stage===i+1)?2:0)+([2,7].includes(i)?2:0);
function settle(s){
 const study=s.mode==="study";
 const completed=study?[]:stages.map((_,i)=>i).filter(i=>valid(s,i));
 const rows=completed.map(i=>{
  const st=stages[i],a=s.answers[i],self=s.self?.[i]||[];
  const quiz=(a.q1===st.c1?4:0)+(a.q2.best===st.best?2:0)+(a.q2.worst===st.worst?2:0);
  let bonus=(!s.s5gameVersion&&s.rp?.[i]?0.5:0)+(self.length===3&&self.every(v=>Number.isInteger(v)&&v>=1&&v<=4)?(s.s5gameVersion?1:0.5):0)+(s.peer?.[i]&&[2,7].includes(i)?2:0);
  const inc=incidents.find(x=>x.stage===i+1),values=s.alloc?.[i];
  if(inc&&Array.isArray(values)&&values.length===inc.ideal.length){
   const diff=values.reduce((sum,v,j)=>sum+Math.abs(v-inc.ideal[j]),0);
   bonus+=diff===0?2:diff<=2?1:0;
  }
  return {stage:i+1,title:st.title,quiz,bonus,score:quiz+bonus,max:maxStage(i)};
 });
 const raw=rows.reduce((n,x)=>n+x.score,0),max=rows.reduce((n,x)=>n+x.max,0);
 const quiz=rows.reduce((n,x)=>n+x.quiz,0);
 const timePenalty=study?0:(window.BP_SAFAR_OVERTIME?.penalty(s)||0);
 const guidePenalty=study?0:(window.BP_SAFAR_GUIDE?.penalty(s)||0);
 const penalty=timePenalty+guidePenalty;
 const score=Math.max(0,raw-penalty);
 const viewed=study?Math.min(10,Math.max(1,Number(s.studyStage??s.stage??0)+1)):completed.length;
 const skill=["شروع حرفه‌ای و اعتماد","روشن‌سازی پیام","شنود و همدلی","لحن و بیان","بازخورد مؤثر","گفت‌وگوی دشوار","هماهنگی بین‌واحدی","نه‌گفتن محترمانه","بازسازی اعتماد","مذاکره و توافق"];
 const badges=study?[]:completed.map(i=>skill[i]);
 const rpCount=Object.values(s.rp||{}).filter(Boolean).length;
 const peerCount=Object.values(s.peer||{}).filter(Boolean).length;
 if(!study&&rpCount>=3)badges.push("حضور فعال");
 if(!study&&rpCount>=7)badges.push("تکمیل تمرین‌ها");
 if(!study&&peerCount>=2)badges.push("همفکری تیمی");
 // The full-journey time medal is never earned after a voluntary withdrawal.
 const unfinished=!study&&Math.max(0,10-completed.length);
 return {study,completed:completed.length,viewed,rows,score,raw,max,quiz,
   timePenalty,guidePenalty,penalty,badges,unfinished,
   ongoing:!study&&!valid(s,Math.min(9,Math.max(0,Number(s.stage)||0)))&&unfinished>0,
   ratio:max?Math.round(100*score/max):null};
}
function coach(s,r){
 if(r.study)return "برای یادگیری همیشه لازم نیست تا آخر مسیر پیش بروی. همین بخشی که مرور کردی می‌تواند مبنای یک گفت‌وگوی بهتر در محیط کار باشد.";
 if(!r.completed)return "درک می‌کنم که شاید الان زمان مناسبی برای ادامه نباشد. شروع‌کردن هم یک انتخاب آگاهانه است؛ هر زمان آماده بودی، می‌توانی سفر تازه‌ای آغاز کنی.";
 if(r.completed<=3)return "می‌بینم که برای شروع این مسیر وقت و توجه گذاشتی. لازم نیست همه ده مرحله را همین امروز تمام کنی؛ مهارت‌هایی را که تمرین کردی در گفت‌وگوی بعدی به کار بگیر.";
 if(r.completed<=7)return "تا اینجا بخش معناداری از مسیر را طی کردی. تصمیم برای توقف، تلاش‌های قبلی‌ات را کم‌ارزش نمی‌کند؛ یک مهارت مشخص را برای تمرین در محل کار انتخاب کن.";
 return "تا آستانه پایان سفر پیش رفتی و دستاوردهای ثبت‌شده‌ات محفوظ است. اگر زمانی خواستی، می‌توانی در یک تلاش تازه روی مرحله‌های باقی‌مانده تمرکز کنی.";
}
function label(r){
 if(r.study)return "مطالعه آزاد، بدون درجه رقابتی";
 if(!r.completed)return "هنوز درجه عملکردی ثبت نشده";
 if(r.ratio>=90)return "عملکرد برجسته در مراحل طی‌شده";
 if(r.ratio>=75)return "عملکرد خوب در مراحل طی‌شده";
 if(r.ratio>=60)return "عملکرد رو به رشد در مراحل طی‌شده";
 return "فرصت یادگیری بیشتر در مراحل طی‌شده";
}
function requestExit(){
 const s=read();if(!s||s.withdrawn||s.finished||(!s.startedAt&&s.mode!=="study"))return;
 const r=settle(s);
 const summary=r.study?
  "تا اینجا "+fa(r.viewed)+" مرحله را در حالت مطالعه مرور کردی. این حالت نمره یا نشان ندارد.":
  "تعداد مراحل کامل: "+fa(r.completed)+" از ۱۰\nامتیاز قطعی: "+fa(r.score)+" از "+fa(r.max)+
  "\nنشان‌های کسب‌شده: "+fa(r.badges.length)+
  (r.ongoing?"\nفعالیت‌های مرحله نیمه‌تمام در نمره قطعی وارد نمی‌شوند.":"");
 if(!confirm("پایان زودهنگام سفر و دریافت کارنامه\n\n"+summary+
 "\n\nپیشرفت و پاسخ‌ها نگهداری می‌شوند؛ این تلاش بسته می‌شود و فقط با آغاز سفر تازه می‌توانی دوباره رقابت کنی.\n\nآیا می‌خواهی کارنامه‌ات صادر شود؟"))return;
 s.withdrawn=true;s.finished=true;s.finishedAt=Date.now();s.withdrawalReport=r;
 s.events=Array.isArray(s.events)?s.events:[];
 s.events.push({type:"voluntary-exit",at:s.finishedAt,completed:r.completed,score:r.score,max:r.max});
 try{localStorage.setItem(KEY,JSON.stringify(s))}
 catch(e){alert("امکان ذخیره کارنامه وجود ندارد. لطفاً فضای ذخیره‌سازی مرورگر را بررسی کن؛ سفر فعلی حفظ شده است.");return}
 window.location.reload();
}
function reportHTML(s,r){
 const grade=r.study?"بدون امتیاز":fa(r.score)+" / "+fa(r.max);
 return '<section class="sf-exit-report" id="sfExitReport" dir="rtl">'+
 '<div class="result-hero sf-exit-hero"><span class="sf-exit-kicker">کارنامه پایان زودهنگام · جلسه چهارم</span>'+
 '<h1>این‌جا سفر را به انتخاب خودت به پایان رساندی</h1>'+
 '<p>مسیر '+(s.role==="managers"?"مدیران":"سرپرستان")+' · '+esc(s.name||"شرکت‌کننده به‌پرور")+'</p>'+
 '<div class="sf-exit-figures"><div><strong>'+fa(r.study?r.viewed:r.completed)+' / ۱۰</strong><span>'+(r.study?"مرحله مرورشده":"مرحله کامل‌شده")+'</span></div>'+
 '<div><strong>'+grade+'</strong><span>امتیاز مراحل کامل</span></div>'+
 '<div><strong>'+fa(r.badges.length)+'</strong><span>نشان مهارتی/مشارکتی</span></div></div>'+
 '<div class="sf-exit-level">'+esc(label(r))+'</div></div>'+
 '<section class="sf-exit-coach" aria-label="پیام کوچ"><div class="sf-exit-coach-mark" aria-hidden="true">◎</div>'+
 '<div><strong>پیام همراه سفر</strong><p>'+esc(coach(s,r))+'</p>'+
 '<p class="sf-exit-reflection">یک پرسش برای ادامه رشد: کدام رفتار ارتباطی را از این تجربه به محیط کار می‌بری؟</p></div></section>'+
 (!r.study?'<section class="sf-exit-ledger"><h2>تسویه‌حساب امتیازها</h2><div class="sf-exit-ledger-grid">'+
 '<span>امتیاز کسب‌شده از مراحل کامل</span><b>'+fa(r.raw)+'</b>'+
 '<span>سقف همان مراحل</span><b>'+fa(r.max)+'</b>'+
 '<span>کسر وقت اضافه</span><b>− '+fa(r.timePenalty)+'</b>'+
 '<span>کسر راهنما</span><b>− '+fa(r.guidePenalty)+'</b>'+
 '<span class="sf-exit-final">امتیاز قطعی</span><strong class="sf-exit-final">'+fa(r.score)+' / '+fa(r.max)+'</strong></div>'+
 '<p class="sf-exit-footnote">این نتیجه فقط برای مراحل تکمیل‌شده است، نه نمره کل ۱۰ مرحله. از این کارنامه نمی‌توان مدال تکمیل تمام سفر را دریافت کرد.'+
 (r.ongoing?' فعالیت‌های ثبت‌شده در مرحله نیمه‌تمام محفوظ‌اند اما در نمره قطعی این تلاش محاسبه نشده‌اند.':'')+'</p></section>':
 '<section class="sf-exit-ledger"><h2>خلاصه مطالعه آزاد</h2><p>این مسیر آموزشی بدون آزمون، امتیاز و نشان طراحی شده است؛ '+fa(r.viewed)+' مرحله مرور شده است.</p></section>')+
 (r.rows.length?'<section class="sf-exit-ledger"><h2>ریز عملکرد مراحل کامل</h2><div class="sf-exit-rows">'+
 r.rows.map(x=>'<div class="sf-exit-stage"><span>مرحله '+fa(x.stage)+' · '+esc(x.title)+'</span><strong>'+fa(x.score)+' / '+fa(x.max)+'</strong></div>').join('')+
 '</div></section>':'')+
 (r.badges.length?'<section class="sf-exit-ledger"><h2>نشان‌های کسب‌شده</h2><div class="sf-exit-tags">'+r.badges.map(x=>'<span>'+esc(x)+'</span>').join('')+'</div>'+
 '<p class="sf-exit-footnote">نشان‌های مهارتی از مجموعه نشان‌های پایین صفحه قابل دریافت هستند؛ مدال زرین، سیمین یا برنزی فقط برای تکمیل هر ۱۰ مرحله است.</p></section>':'')+
 '<div class="sf-exit-actions"><button class="btn" id="sfExitDownload" type="button">دریافت تصویر کارنامه</button>'+
 '<button class="btn alt" id="sfExitPrint" type="button">چاپ / ذخیره PDF</button>'+
 '<a href="index.html#course" class="btn alt">بازگشت به جلسات</a></div>'+
 '<p class="sf-exit-footnote">کارنامه در سوابق همین دستگاه نگهداری می‌شود. با پاک‌شدن اطلاعات مرورگر ممکن است سوابق از بین بروند.</p></section>';
}
function renderReport(s){
 if(!s?.withdrawn)return;
 const r=s.withdrawalReport||settle(s);
 if(root.querySelector("#sfExitReport"))return;
 root.innerHTML=reportHTML(s,r);
 document.body.classList.add("sf-withdrawn");
}
async function png(s,r){
 const canvas=document.createElement("canvas");canvas.width=1200;canvas.height=1500;
 const ctx=canvas.getContext("2d");if(!ctx){alert("دریافت تصویر در این مرورگر پشتیبانی نمی‌شود.");return;}
 try{await document.fonts?.ready}catch(e){}
 ctx.fillStyle="#f7f9f7";ctx.fillRect(0,0,1200,1500);
 ctx.fillStyle="#163f37";ctx.fillRect(0,0,1200,340);
 ctx.direction="rtl";ctx.textAlign="right";
 const txt=(t,x,y,size=37,color="#193b35",bold=false)=>{
  ctx.fillStyle=color;ctx.font=(bold?"bold ":"")+size+'px Vazirmatn, Tahoma, sans-serif';
  ctx.fillText(t,x,y,1040);
 };
 txt("به‌پرور  |  سفر ارتباطات",1080,105,35,"#d8eadf",true);
 txt("کارنامه پایان زودهنگام",1080,204,65,"#ffffff",true);
 txt(s.name||"شرکت‌کننده به‌پرور",1080,291,36,"#ffffff");
 txt("مسیر: "+(s.role==="managers"?"مدیران":"سرپرستان"),1080,425);
 txt("مراحل کامل‌شده: "+fa(r.study?r.viewed:r.completed)+" از ۱۰",1080,515,43,"#163f37",true);
 txt(r.study?"مطالعه آزاد — بدون نمره":"امتیاز مراحل کامل: "+fa(r.score)+" از "+fa(r.max),1080,605,48,"#163f37",true);
 txt(label(r),1080,690,32);
 ctx.fillStyle="#d8e5df";ctx.fillRect(90,740,1020,2);
 txt("ریز امتیازها و کسورات",1080,815,36,"#163f37",true);
 txt("امتیاز خام: "+fa(r.raw)+" | کسر زمان: "+fa(r.timePenalty)+" | کسر راهنما: "+fa(r.guidePenalty),1080,887,28);
 txt("تعداد نشان‌های کسب‌شده: "+fa(r.badges.length),1080,958,31);
 txt("پیام همراه سفر",1080,1060,36,"#163f37",true);
 const message="تلاش ثبت‌شده‌ات ارزشمند است. یک رفتار قابل اجرا را انتخاب کن و در گفت‌وگوی بعدی به کار بگیر.";
 txt(message,1080,1128,27);
 txt("این کارنامه گواه تکمیل همه ده مرحله نیست.",1080,1260,26,"#6d6457");
 txt("یادگیری ادامه دارد؛ با ریتم خودت پیش برو.",1080,1350,28,"#163f37",true);
 const link=document.createElement("a");link.download="Behparvar-Safar-Early-Exit-Report.png";
 link.href=canvas.toDataURL("image/png");link.click();
}
function enhance(){
 const s=read();if(!s)return;
 if(s.withdrawn){renderReport(s);return;}
 const active=(!s.finished&&!!s.startedAt)||(!s.finished&&s.mode==="study");
 const actions=document.querySelector(".top-actions");
 if(!active){document.getElementById("sfGracefulExitTop")?.remove();return;}
 if(actions&&!document.getElementById("sfGracefulExitTop")){
  const button=document.createElement("button");button.id="sfGracefulExitTop";
  button.type="button";button.className="sf-graceful-exit-trigger";
  button.textContent="پایان زودهنگام و کارنامه";actions.append(button);
 }
 const bottom=root.querySelector(".actions, .sf-mode-next, .sf-mode-action");
 if(bottom&&!bottom.querySelector("#sfGracefulExitInline")){
  const b=document.createElement("button");b.type="button";b.id="sfGracefulExitInline";
  b.className="sf-graceful-exit-inline";b.textContent="انصراف و دریافت کارنامه";
  bottom.append(b);
 }
 const overdue=document.querySelector("#sfOvertimeExit");
 if(overdue)overdue.textContent="انصراف و دریافت کارنامه";
 const paused=document.querySelector(".sf-mode-pause-panel");
 if(paused&&!paused.querySelector("#sfGracefulExitPause")){
  const b=document.createElement("button");b.type="button";b.id="sfGracefulExitPause";
  b.textContent="پایان سفر و دریافت کارنامه";b.className="sf-graceful-exit-inline";
  paused.append(b);
 }
}
document.addEventListener("click",e=>{
 const b=e.target.closest("button");if(!b)return;
 if(["sfGracefulExitTop","sfGracefulExitInline","sfGracefulExitPause","sfOvertimeExit","sfOvertimeExitTop"].includes(b.id)){
  // Capture phase prevents the existing timeout exit from silently losing the report.
  const s=read();if(s&&!s.finished&&(s.startedAt||s.mode==="study")){
   e.preventDefault();e.stopImmediatePropagation();requestExit();
  }
  return;
 }
 const s=read();if(!s?.withdrawn)return;
 if(b.id==="sfExitDownload"){e.preventDefault();png(s,s.withdrawalReport||settle(s));}
 if(b.id==="sfExitPrint"){e.preventDefault();window.print();}
},true);
let pending=false;
const observer=new MutationObserver(()=>{
 if(pending)return;pending=true;
 requestAnimationFrame(()=>{pending=false;enhance();});
});
observer.observe(root,{childList:true,subtree:false});
const other=new MutationObserver(()=>enhance());
other.observe(document.body,{childList:true,subtree:false});
enhance();
window.BP_SAFAR_GRACEFUL_EXIT={settle,renderReport,requestExit};
})();
