/* Behparvar / Safar Ertebatat – empathic, stage-aware journey coach v5
 * Feedback is displayed only AFTER irreversible answer submission.
 * Correct answers and detailed rationales remain hidden until final review.
 */
(()=>{"use strict";
const root=document.getElementById("root");
const data=window.BP_SAFAR_DATA;
if(!root||!data?.stages||data.stages.length!==10)return;
const KEY="bp-communication-journey-v3";
const lessons=window.BP_SAFAR_RESTORED_CONTENT?.content||[];
const skills=window.BP_SAFAR_CLASSROOM?.content||[];
const fa=n=>Number(n||0).toLocaleString("fa-IR");
const escape=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const state=()=>{try{const s=JSON.parse(localStorage.getItem(KEY)||"null");return s?.version===3?s:null}catch(e){return null}};
const queue=[];let showing=false,lastFocus=null,lastStage=-1,lastPhase="";
const starts=["اول مسیر، به کیفیت شروع گفت‌وگو توجه کن.","پیش از نتیجه‌گیری، خروجی، مسئول، موعد و شرط انجام را با هم روشن کنید.","قبل از راه‌حل، تجربه و برداشت مخاطب را بشنو.","در پیام حساس، لحن و مکث هم بخشی از معنا هستند.","بازخورد به یک رفتار مشخص و قابل تغییر مربوط است.","اختلاف را از شخصیت جدا کن و راه عملی پیدا کن.","محدودیت واحد مقابل را به‌جای حدس‌زدن بپرس.","نهِ محترمانه، بهتر از وعده غیرقابل اجراست.","اعتماد با اطلاع‌رسانی و پیگیری به دست می‌آید.","توافق زمانی ارزش دارد که به اجرا برسد."];
const completion=[
"شروع ارتباط را به یک مهارت قابل تمرین تبدیل کردی.",
"این بار به‌جای حدس نیت، با یک پرسش دقیق اختلاف برداشت را روشن کردی.",
"برای شنیدن واقعی، گاهی پرسش مهم‌تر از پاسخ است.",
"در پیام حساس، وضوح را فدای سرعت نکن.",
"بازخورد وقتی اثر می‌گذارد که اقدام بعدی روشن باشد.",
"در اختلاف، حفظ رابطه و حفظ مرز می‌توانند هم‌زمان اتفاق بیفتند.",
"همکاری بین‌واحدی از فهم محدودیت‌ها شروع می‌شود.",
"مدیریت انتظار یعنی تعهدی بدهی که توان انجامش را داری.",
"پاسخ‌گویی را تا اطلاع‌رسانی نتیجه ادامه بده.",
"در مذاکره، توافقی بساز که دو طرف بتوانند به آن عمل کنند."
];
function fullTip(i){return lessons[i]?.transfer||skills[i]?.moment||starts[i]}
function updateSound(s){
 if(!s?.sound)return;
 try{
  const A=window.AudioContext||window.webkitAudioContext;
  if(!A)return;
  const ctx=new A(),o=ctx.createOscillator(),g=ctx.createGain();
  o.type="sine";o.frequency.value=520;
  g.gain.value=.018;o.connect(g);g.connect(ctx.destination);
  o.start();o.stop(ctx.currentTime+.11);
  o.onended=()=>ctx.close();
 }catch(e){}
}
function draw(msg){
 const prev=document.getElementById("sfCoachOverlay");
 if(prev)prev.remove();
 const s=state();lastFocus=document.activeElement;
 const cover=document.createElement("div");cover.id="sfCoachOverlay";cover.className="sf-coach-overlay";
 cover.setAttribute("role","dialog");cover.setAttribute("aria-modal","true");cover.setAttribute("aria-label","همراه سفر ارتباطات");
 const pct=typeof msg.progress==="number"?Math.min(100,Math.max(0,msg.progress)):null;
 cover.innerHTML='<div class="sf-coach-dialog '+(msg.kind||"info")+'">'+
 '<button class="close-icon" id="sfCoachClose" type="button" aria-label="بستن پیام">×</button>'+
 '<div class="sf-coach-eyebrow">همراه سفر ارتباطات · به‌پرور'+(s?.stage>=0?' · مرحله '+fa(s.stage+1):"")+'</div>'+
 '<div class="sf-coach-spark" aria-hidden="true">'+(msg.icon||"✨")+'</div>'+
 (msg.celebrate?'<img class="sf-celebration-image" src="assets/safar-stage-celebration.svg" alt="مسیر پیشرفت و نشان موفقیت، ویژه به‌پرور" loading="eager">':"")+
 '<h3>'+escape(msg.title)+'</h3><p>'+escape(msg.text)+'</p>'+
 (msg.tip?'<div class="sf-coach-note">💡 '+escape(msg.tip)+'</div>':"")+
 (pct!==null?'<div class="sf-coach-progress" role="progressbar" aria-valuenow="'+pct+'" aria-valuemin="0" aria-valuemax="100"><span style="width:'+pct+'%"></span></div>':"")+
 '<button type="button" id="sfCoachContinue">'+escape(msg.action||"ادامه سفر")+'</button>'+
 (msg.correctness?'<p class="sf-status">پاسخ ثبت و قفل شده است؛ گزینه صحیح و تحلیل کامل در پایان سفر نمایش داده می‌شود.</p>':"")+
 '</div>';
 document.body.append(cover);document.body.classList.add("sf-coach-open");
 showing=true;cover.querySelector("#sfCoachContinue")?.focus();
 if(msg.kind==="event")updateSound(s);
 function end(e){
  if(e)e.preventDefault();
  cover.remove();document.body.classList.remove("sf-coach-open");showing=false;
  try{lastFocus?.focus?.()}catch(e){}
  const follow=!!msg.advance&&e?.currentTarget?.id==="sfCoachContinue";
  if(follow){
   // The wizard's next action remains the authoritative navigation guard.
   setTimeout(()=>document.getElementById("sfNext")?.click(),30);
  }
  setTimeout(showNext,85);
 }
 cover.querySelector("#sfCoachContinue")?.addEventListener("click",end,{once:true});
 cover.querySelector("#sfCoachClose")?.addEventListener("click",end,{once:true});
 // Do not dismiss by tapping outside; the user's choice to continue is intentional.
}
function showNext(){if(showing||!queue.length)return;draw(queue.shift())}
function inform(msg){queue.push(msg);showNext()}
function inlineFeedback(kind,title,message,tip){
 const existing=document.getElementById("sfCoachInline");if(existing)existing.remove();
 const root=document.getElementById("root"),anchor=root?.querySelector("#sfWizardCoach");
 const note=document.createElement("div");note.id="sfCoachInline";
 note.className="sf-coach-inline sf-wizard-visible "+(kind==="correct"?"is-positive":"is-support");
 note.setAttribute("role","status");note.setAttribute("aria-live","polite");
 note.innerHTML='<strong>'+(kind==="correct"?"✨ ":"🌱 ")+escape(title)+'</strong>'+
 '<p>'+escape(message)+'</p><small>💡 '+escape(tip)+'</small>'+
 '<button type="button" id="sfCoachInlineClose" aria-label="بستن پیام">×</button>';
 if(anchor)anchor.insertAdjacentElement("afterend",note);else root?.prepend(note);
 note.querySelector("#sfCoachInlineClose")?.addEventListener("click",()=>note.remove(),{once:true});
}
function feedback(stage,q,answer){
 // Do not leak correctness, the answer key or option rationale before the final review.
 const st=data.stages[stage],valid=q===1?Number.isInteger(answer.q1):!!answer.q2;
 if(!valid)return;
 const title=q===1?"تصمیم اول ثبت شد":"تصمیم دوم ثبت شد";
 const text="انتخابت ثبت و قفل شد. با پایان هر مرحله امتیاز کسب‌شده‌ات را می‌بینی؛ کلید و درست/غلط پاسخ‌ها فقط پس از پایان سفر باز می‌شوند.";
 if(q===1)inlineFeedback("support",title,text,st.tip);
 else inform({kind:"info",icon:"🧭",title,text,tip:"برای رشد حرفه‌ای، قبل از دیدن کلید تلاش کن معیار تصمیم را خودت توضیح بده.",correctness:false,advance:false});
}
function stageComplete(index){
 const s=state();
 const p=window.BP_SAFAR_STEP_POINTS?.pts(s,index);
 const total=window.BP_SAFAR_STEP_POINTS?.progress(s);
 const earned=p?"از "+fa(p.max)+" امتیاز ممکن این مرحله، "+fa(p.earned)+" امتیاز به دست آوردی. ":"";
 const collected=total?" مجموع تا اینجا: "+fa(total.sum)+" از ۱۰۰. ":"";
 const closer=window.BP_SAFAR_STEP_POINTS?.nextMedal(s)||"به مسیر بعدی نزدیک‌تر شده‌ای.";
 inform({kind:"milestone",icon:"✦",celebrate:true,
 title:index===9?"سفر ارتباطات را کامل کردی!":"مرحله "+fa(index+1)+" را با موفقیت به پایان رساندی!",
 text:earned+collected+closer,
 tip:completion[index]+" "+fullTip(index),
 progress:(index+1)*10,action:index===9?"مشاهده تحلیل و نشان":"ورود به مرحله بعد"});
}
function eventMessage(i,startedAt){
 const incident=data.incidents?.find(x=>x.stage===i+1);
 if(!incident)return;
 const key="bp-safar-event-"+String(startedAt)+"-"+i;
 try{if(sessionStorage.getItem(key))return;sessionStorage.setItem(key,"1")}catch(e){}
 inform({kind:"event",icon:"🚨",title:"یک اتفاق غیرمنتظره!",
 text:"شرایط این مرحله تغییر کرده و باید با منابع محدود تصمیم بگیری. همه گزینه‌ها وسوسه‌کننده‌اند؛ اما منابع برای همه کافی نیست.",
 tip:starts[i],action:"چالش منابع رو می‌پذیرم"});
}
document.addEventListener("click",e=>{
 const t=e.target.closest("button");if(!t)return;
 const q=t.dataset?.saveq;
 const isNext=t.id==="next";
 const tracked=q==="1"||q==="2"||["start","savealloc","saverp","savepeer","next"].includes(t.id);
 if(!tracked)return;
 const before=state();
 const at=before?.stage??-1;
 const initial=before?.answers?.[at]||{};
 const beforeQ=q==="1"?initial.q1:initial.q2;
 const fromStarted=before?.startedAt||0;
 const beforeAlloc=before?.alloc?.[at]||null;
 const beforeRP=before?.rp?.[at]||null;
 const beforePeer=before?.peer?.[at]||null;
 const name=t.id;
 // The original synchronous handler performs its irreversible commit first.
 setTimeout(()=>{
  const after=state();
  if(!after)return;
  if(name==="start"&&!fromStarted&&after.startedAt)
   return inform({kind:"milestone",icon:"🧭",title:"خوش اومدی به سفر ارتباطات!",
     text:"ده موقعیت واقعی پیش روته. یک کوچ کنار تو می‌مونه؛ قرار نیست کامل باشی، قراره مهارتت رو به کار بگیری.",
     tip:starts[0],action:"سفر رو شروع می‌کنم",progress:0});
  if(q==="1"&&beforeQ===undefined&&after.answers?.[at]?.q1!==undefined)
   return feedback(at,1,after.answers[at]);
  if(q==="2"&&beforeQ===undefined&&after.answers?.[at]?.q2!==undefined)
   return feedback(at,2,after.answers[at]);
  if(name==="savealloc"&&!beforeAlloc&&after.alloc?.[at])
   return inform({kind:"milestone",icon:"🪙",title:"تصمیم با منابع محدود ثبت شد!",
     text:"با شش سکه تصمیم گرفتی؛ انتخاب‌ها قفل شدند و اثر آن‌ها را در پایان می‌بینی.",
     tip:"گاهی هنر مدیریت، انتخاب‌کردن مهم‌ترین اقدام و کنارگذاشتن کارهای کم‌اولویت‌تر است.",action:"ادامه سفر"});
  if(name==="saverp"&&!beforeRP&&after.rp?.[at])
   return inform({kind:"milestone",icon:"🤝",title:"گفت‌وگوی واقعی ثبت شد!",
     text:"این بار با همکار کناری گفت‌وگو کردی و ارزیابی محرمانه را در گوشی خودت ثبت کردی.",
     tip:fullTip(at),action:"ادامه تمرین"});
  if(name==="savepeer"&&!beforePeer&&after.peer?.[at])
   return inform({kind:"milestone",icon:"🔎",title:"بازخورد همکارت ثبت شد!",
     text:"دیدن رفتار واقعی، از جمله‌های کلی ارزشمندتره. یک مشاهده مشخص، راه بهبود رو روشن می‌کنه.",
     action:"ادامه سفر"});
  if(isNext&&(after.stage>at||after.finished)&&at>=0)stageComplete(at);
 },90);
},true);
function checkStageEvents(){
 const s=state();if(!s||!s.startedAt||s.finished)return;
 const h=root.querySelector("#sfWizardHead");
 if(!h)return;
 const phase=h.dataset.phase||"",step=s.stage;
 if(step===lastStage&&phase===lastPhase)return;
 lastStage=step;lastPhase=phase;
 if(phase==="resource")setTimeout(()=>eventMessage(step,s.startedAt),130);
}
const observer=new MutationObserver(()=>checkStageEvents());
observer.observe(root,{childList:true,subtree:false});
checkStageEvents();
document.addEventListener("keydown",e=>{
 if(e.key==="Escape"&&showing){
  const close=document.getElementById("sfCoachClose");if(close){e.preventDefault();close.click();}
 }
});
window.BP_SAFAR_COACH={feedback,stageComplete};
})();