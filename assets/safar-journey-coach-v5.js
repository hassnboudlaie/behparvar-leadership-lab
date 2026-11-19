/* Behparvar / Safar Ertebatat – empathic, stage-aware journey coach v5
 * Feedback is displayed only AFTER irreversible answer submission.
 * Correct answers and detailed rationales remain hidden until final review.
 */
(()=>{"use strict";
const root=document.getElementById("root");
const data=window.BP_SAFAR_DATA;
if(!root||!data?.stages||data.stages.length!==10)return;
const KEY="bp-session5-communication-journey-v1";
const lessons=window.BP_SAFAR_RESTORED_CONTENT?.content||[];
const skills=window.BP_SAFAR_CLASSROOM?.content||[];
const applied=window.BP_SAFAR_APPLIED?.units||[];
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
 (msg.choices?.length?'<div class="sf-coach-decision"><strong>از کدام زاویه می‌خواهی شروع کنی؟</strong><div class="sf-coach-option-list">'+msg.choices.map((c,i)=>'<button type="button" data-coach-choice="'+i+'" aria-pressed="false">'+escape(c.label)+'</button>').join('')+'</div><p id="sfCoachChoiceResponse" role="status" aria-live="polite">یک گزینه را انتخاب کن تا کوچ یک پیشنهاد مشخص بدهد.</p></div>':"")+
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
 cover.querySelectorAll("[data-coach-choice]").forEach(button=>button.addEventListener("click",()=>{
  const n=Number(button.dataset.coachChoice),chosen=msg.choices?.[n];
  if(!chosen)return;
  cover.querySelectorAll("[data-coach-choice]").forEach(x=>x.setAttribute("aria-pressed",String(x===button)));
  const target=cover.querySelector("#sfCoachChoiceResponse");if(target)target.textContent=chosen.response;
 }));
 cover.querySelector("#sfCoachContinue")?.addEventListener("click",end,{once:true});
 cover.querySelector("#sfCoachClose")?.addEventListener("click",end,{once:true});
 // Do not dismiss by tapping outside; the user's choice to continue is intentional.
}
function showNext(){if(showing||!queue.length)return;draw(queue.shift())}
function inform(msg){queue.push(msg);showNext()}
function inlineFeedback(kind,title,message,tip,options){
 document.getElementById("sfCoachInline")?.remove();
 const anchor=root?.querySelector("#sfWizardCoach");
 const note=document.createElement("div");note.id="sfCoachInline";
 note.className="sf-coach-inline sf-wizard-visible "+(kind==="positive"?"is-positive":"is-support");
 note.setAttribute("role","status");note.setAttribute("aria-live","polite");
 note.innerHTML='<strong>◈ '+escape(title)+'</strong>'+
 '<p>'+escape(message)+'</p><small>'+escape(tip||"")+'</small>'+
 (options?'<div class="sf-coach-mini-actions"><button type="button" data-sf-coach-view="risk">ریسک پنهان</button><button type="button" data-sf-coach-view="next">قدم بعدی</button></div><p class="sf-coach-choice-answer" aria-live="polite"></p>':"")+
 '<button type="button" id="sfCoachInlineClose" aria-label="بستن پیام">×</button>';
 if(anchor)anchor.insertAdjacentElement("afterend",note);else root?.prepend(note);
 if(options)note.querySelectorAll("[data-sf-coach-view]").forEach(btn=>btn.addEventListener("click",()=>{
  note.querySelectorAll("[data-sf-coach-view]").forEach(x=>x.setAttribute("aria-pressed",String(x===btn)));
  note.querySelector(".sf-coach-choice-answer").textContent=btn.dataset.sfCoachView==="risk"?options.risk:options.next;
 }));
 note.querySelector("#sfCoachInlineClose")?.addEventListener("click",()=>note.remove(),{once:true});
}
function feedback(stage,q,answer){
 // Deliberately neutral: no right/wrong, score or answer-key leak before final review.
 if(q===1&&!Number.isInteger(answer.q1)||q===2&&!answer.q2)return;
 const unit=applied[stage]||{},first=q===1;
 const observations=[
 ["انتخابت درباره آغاز ارتباط ثبت شد؛ به برداشت مخاطب و مرز توقع کاری هم‌زمان فکر کن.","در پیگیری، تفاوت خوش‌قولی و ثبت تعهد را از دست نده."],
 ["یک تصمیم درباره شفافیت گرفتی؛ حالا ببین کدام برداشت هنوز نیاز به تأیید دارد.","اگر مسئول یا شرط پذیرش مبهم مانده باشد، احتمال سوءتفاهم چقدر است؟"],
 ["در این انتخاب، شنیدن را از موافقت فوری جدا کن.","بعد از شنیدن، آیا می‌توانی بدون قول شتاب‌زده به یک قدم قابل بررسی برسی؟"],
 ["تصمیمت درباره بیان پیام ثبت شد؛ به فرصت واقعیِ پرسش هم فکر کن.","اگر مخاطب تصمیم را جور دیگری فهمیده باشد، چطور متوجه می‌شوی؟"],
 ["انتخابت درباره بازخورد ثبت شد؛ رفتار قابل تغییر را از شخصیت تفکیک کن.","آیا اقدام بعدی با مسئولیت‌پذیری فرد و یک نقطه بازبینی همراه است؟"],
 ["در تعارض، بین فشار کار و محدودیت فنی تفاوت بگذار.","فرض کن فردا درباره این تصمیم پاسخ‌گو هستی؛ چه شاهدی برای دفاع از مرز اختیار داری؟"],
 ["این تصمیم بر همکاری دو واحد اثر دارد؛ هر دو محدودیت را در ذهن نگه دار.","اگر یک واحد نتواند به تعهد برسد، مسیر اطلاع‌رسانی چگونه خواهد بود؟"],
 ["در نه‌گفتن، صداقت درباره امکان اجرا یک سرمایه است.","آیا ذی‌نفع بعد از این گفت‌وگو، گزینه واقعی و حدود تعهد را می‌داند؟"],
 ["انتخابت به اعتماد مربوط است؛ مسئولیت اطلاع‌رسانی را فراموش نکن.","اگر نتیجه بررسی هنوز آماده نیست، چه چیزی را باید صادقانه اعلام کرد؟"],
 ["یک تصمیم درباره اقناع ثبت شد؛ توافق ظاهری را با تعهد قابل اجرا یکی ندان.","چطور می‌فهمی هر طرف مسئول، موعد و شرط تصمیم را یکسان فهمیده است؟"]
 ];
 const text=observations[stage]?.[first?0:1]||"انتخابت ثبت شد؛ اثر واقعی آن را روی رابطه و نتیجه بسنج.";
 const title=first?"تصمیم اول ثبت شد · مکث تحلیلی":"تصمیم دوم ثبت شد · آزمون اجرا";
 const tip=first?"پاسخ تو قفل است؛ کوچ درباره درست یا غلط بودن آن قضاوت نمی‌کند.":"حالا می‌توانی به گام بعد بروی. کلید و تحلیل کامل در پایان سفر نمایش داده می‌شود.";
 inlineFeedback("support",title,text,tip,{
  risk:unit.trap||"احساس رضایت کوتاه‌مدت الزاماً به تصمیم قابل اجرا تبدیل نمی‌شود.",
  next:unit.transfer||unit.decisionLens||"یک اقدام قابل مشاهده با مسئول و زمان مشخص انتخاب کن."
 });
}
function stageComplete(index){
 const s=state();
 if(![2,5,9].includes(index))return; // No repetitive modal after every stage.
 const p=window.BP_SAFAR_STEP_POINTS?.pts(s,index);
 const total=window.BP_SAFAR_STEP_POINTS?.progress(s);
 const earned=p?fa(p.earned)+" از "+fa(p.max)+" امتیاز این مرحله":"مرحله تکمیل شد";
 inform({kind:"milestone",icon:index===9?"★":"✦",celebrate:true,
 title:index===9?"به پایان سفر انفرادی رسیدی":"نقطه عطف "+fa(index+1)+" از ۱۰",
 text:earned+"؛ امتیاز کل تا اینجا: "+fa(total?.sum||0)+" از ۱۰۰. "+completion[index],
 tip:index===9?"نتیجه و پاسخ‌نامه اکنون آماده مرورند.":fullTip(index),
 progress:(index+1)*10,action:index===9?"مرور کارنامه":"مرحله بعدی"});
}
function eventMessage(i,startedAt){
 const incident=data.incidents?.find(x=>x.stage===i+1);
 if(!incident)return;
 const key="bp-safar-event-"+String(startedAt)+"-"+i;
 try{if(sessionStorage.getItem(key))return;sessionStorage.setItem(key,"1")}catch(e){}
 inlineFeedback("support","یک تغییر در منابع؛ آماده تصمیمی تازه‌ای؟",
 "این بار لازم است شش سکه را بین اقدام‌ها تخصیص بدهی. اول ریسک‌های فوری را پیدا کن، بعد درباره بده‌بستان تصمیم بگیر.",
 "تخصیص منابع کاملاً فردی است و در صورت نیاز می‌توانی راهنمای این گام را باز کنی.",
 {risk:applied[i]?.trap||"منابع را صرفاً مساوی تقسیم نکن؛ شدت پیامد مهم است.",
  next:"ابتدا فوری‌ترین ریسک را نام ببر؛ سپس به اقدام‌های قابل تأخیر سکه اختصاص بده."});
}
document.addEventListener("click",e=>{
 const t=e.target.closest("button");if(!t)return;
 const q=t.dataset?.saveq;
 const isNext=t.id==="next";
 const tracked=q==="1"||q==="2"||["start","savealloc","next"].includes(t.id);
 if(!tracked)return;
 const before=state();
 const at=before?.stage??-1;
 const initial=before?.answers?.[at]||{};
 const beforeQ=q==="1"?initial.q1:initial.q2;
 const fromStarted=before?.startedAt||0;
 const beforeAlloc=before?.alloc?.[at]||null;
 const name=t.id;
 // The original synchronous handler performs its irreversible commit first.
 setTimeout(()=>{
  const after=state();
  if(!after)return;
  if(name==="start"&&!fromStarted&&after.startedAt)
   return inform({kind:"milestone",icon:"🧭",title:"خوش اومدی به سفر ارتباطات!",
     text:"ده مرحله کاملاً انفرادی پیش روته. هر بار یک تصمیم واقعی را تمرین می‌کنی، به رفتار خودت نگاه می‌کنی و بازخورد متناسب می‌گیری.",
     tip:"راهنما دو بار رایگان است؛ برای تصمیم‌ها جواب را لو نمی‌دهد.",action:"سفر رو شروع می‌کنم",progress:0,
     choices:[{label:"اول معیار تصمیم را پیدا کنم",response:"قبل از هر پاسخ، معیار خودت را با سه واژه بنویس: اثر، اختیار، پیگیری."},
              {label:"اول ریسک را بشناسم",response:"از خودت بپرس کدام پیامد ناخواسته می‌تواند رابطه یا اجرای کار را آسیب بزند."},
              {label:"اول موقعیت را دقیق بخوانم",response:"واقعیت‌های قطعی را از برداشت‌ها و حدس‌ها جدا کن؛ سپس درباره اقدام تصمیم بگیر."}]});
  if(q==="1"&&beforeQ===undefined&&after.answers?.[at]?.q1!==undefined)
   return feedback(at,1,after.answers[at]);
  if(q==="2"&&beforeQ===undefined&&after.answers?.[at]?.q2!==undefined)
   return feedback(at,2,after.answers[at]);
  if(name==="savealloc"&&!beforeAlloc&&after.alloc?.[at])
   return inlineFeedback("positive","تخصیص منابع ثبت شد","انتخاب شش سکه ذخیره شد. درباره نتیجه تصمیم خودت فکر کن.",
     "این مرحله بر اولویت‌بندی فردی و پذیرش پیامدها تمرکز دارد.");
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