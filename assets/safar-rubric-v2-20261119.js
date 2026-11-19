/* Behparvar Safar · 10×10 evidence-aware rubric (new attempts only).
 * Pure client-side, transparent rule-based coach; NOT AI semantic grading or verified job performance.
 * Legacy scores remain available to previous journeys and archived records.
 */
(()=>{"use strict";
const STAGE_MAX=10;
const MAX={lesson:.5,self:2.5,decision1:3.5,decision2:3.5};
const TIERS={bronze:{total:55,quiz:35},silver:{total:70,quiz:45},gold:{total:88,quiz:58}};
const temporal=/(امروز|دیروز|هفته|ماه|روز|سال|شیفت|جلسه|پروژه|مشتری|کارشناس|گزارش|آخرین|قبلی|گذشته|صبح|عصر|هنگام|وقتی|نوبت|ساعت|مورخ|تاریخ|بار|حین|در جریان|موقع|بارگیری|تولید)/;
const action=/(پرسید|گفت|نوشتم|نوشت|بیان|توضیح|ثبت|روشن|هماهنگ|گوش|شنید|پیگیری|ارسال|فرستاد|تأیید|تایید|مکث|خلاصه|توافق|اشاره|پیشنهاد|گذاشت|کردم|کردیم|دادم|گرفت|انتخاب|رد کردم|اطلاع|تقسیم|یادداشت|بررسی|اصلاح|تعیین)/;
const consequence=/(نتیجه|باعث|بنابراین|در نتیجه|پس از|بعد از|موجب|کم شد|کاهش|بهبود|پذیرفت|فهمید|متوجه|جلوگیری|پیش رفت|حل شد|روشن شد|مطمئن|قابل پیگیری|موعد|توافق|قرار شد|تحویل|نهایی|به موقع|به‌موقع|تغییر کرد|به همین دلیل)/;
const specificity=/(\\d|[۰-۹]|دقیقه|ساعت|نفر|واحد|گروه|کارشناس|سرپرست|مدیر|مشتری|همکار|فنی|تولید|انبار|عملیات|کیفیت|تحویل|گزارش|پیام|ایمیل|جلسه|شیفت|سفارش|برنامه|نارضایتی|اعتراض|قرارداد|ارسال)/;
const normalize=x=>String(x??"").normalize("NFKC").replace(/[ي]/g,"ی").replace(/[ك]/g,"ک").replace(/\s+/g," ").trim();
function meaningful(text){
 const t=normalize(text);
 return t.length>=25&&t.length<=900&&t.split(" ").filter(Boolean).length>=5;
}
function similarity(a,b){
 const tokens=t=>new Set(normalize(t).replace(/[^\p{L}\p{N}\s]/gu,"").split(/\s+/).filter(x=>x.length>2));
 const A=tokens(a),B=tokens(b);
 if(!A.size||!B.size)return 0;
 let shared=0;for(const word of A)if(B.has(word))shared++;
 return shared/(A.size+B.size-shared);
}
function reviewEvidence(texts){
 const arr=Array.isArray(texts)?texts.slice(0,3).map(normalize):[];
 const unique=arr.length===3&&arr.every(meaningful)&&similarity(arr[0],arr[1])<.75&&similarity(arr[0],arr[2])<.75&&similarity(arr[1],arr[2])<.75;
 if(!unique)return{complete:false,submission:0,quality:0,total:0,criteria:[false,false,false,false],notes:["برای دریافت اعتبار شواهد، برای هر رفتار یک موقعیت واقعی و متفاوت با حداقل ۲۵ نویسه ثبت کن."]};
 const counts=[0,0,0,0],per=[];
 for(const t of arr){
  const checks=[temporal.test(t),action.test(t),consequence.test(t),specificity.test(t)];
  checks.forEach((ok,i)=>{if(ok)counts[i]++});
  per.push(checks);
 }
 // Conservative quarter-point steps; all evidence must be distinctive and complete.
 const quality=Math.round(counts.reduce((a,b)=>a+b,0)/3)/4;
 const notes=[];
 if(counts[0]<3)notes.push("زمان یا موقعیت مشخص را برای هر سه شاهد روشن‌تر کن.");
 if(counts[1]<3)notes.push("دقیقاً بگو خودت چه جمله‌ای گفتی یا چه اقدامی انجام دادی.");
 if(counts[2]<3)notes.push("اثر مشاهده‌شده یا نتیجه قابل پیگیری رفتار را اضافه کن.");
 if(counts[3]<3)notes.push("به جای توصیف کلی، فرد، واحد، پیام، گزارش یا نمونه مشخص را نام ببر.");
 if(!notes.length)notes.push("شواهد از نظر ساختار زمانی، اقدام و نتیجه روشن‌اند. تطابق آن‌ها با واقعیت فقط از متن قابل احراز نیست.");
 return{complete:true,submission:.5,quality,total:Math.round((.5+quality)*100)/100,criteria:counts.map(c=>c===3),notes,per};
}
function validSelf(s,i){
 const a=s?.self?.[i];
 return Array.isArray(a)&&a.length===3&&a.every(v=>Number.isInteger(v)&&v>=1&&v<=4);
}
function points(s,i){
 const st=window.BP_SAFAR_DATA?.stages?.[i],ans=s?.answers?.[i]||{},self=validSelf(s,i);
 const learned=!!s?.learned?.[i],lesson=learned?.5:0;
 const e=reviewEvidence(s?.evidence?.[i]?.texts||[]);
 const selfBase=self?1:0,submission=self?e.submission:0,coachQuality=self?e.quality:0;
 const oneSaved=Number.isInteger(ans.q1)&&ans.q1>=0&&ans.q1<=3;
 const twoSaved=Number.isInteger(ans.q2?.best)&&Number.isInteger(ans.q2?.worst)&&ans.q2.best!==ans.q2.worst;
 const oneCorrect=oneSaved&&ans.q1===st?.c1?2:0;
 const twoBest=twoSaved&&ans.q2.best===st?.best?1:0;
 const twoWorst=twoSaved&&ans.q2.worst===st?.worst?1:0;
 const oneCompletion=oneSaved?1.5:0,twoCompletion=twoSaved?1.5:0;
 const decision1=oneCompletion+oneCorrect,decision2=twoCompletion+twoBest+twoWorst;
 const selfPoints=selfBase+submission+coachQuality;
 const earned=lesson+selfPoints+decision1+decision2;
 return{lesson,selfBase,submission,coachQuality,selfPoints,decision1,decision2,oneCompletion,oneCorrect,twoCompletion,twoBest,twoWorst,
   reflection:selfPoints,one:decision1,two:decision2,quiz:decision1+decision2,
   resources:0,role:0,peer:0,max:STAGE_MAX,earned:Math.min(STAGE_MAX,Math.round(earned*100)/100),evidence:e};
}
function total(s){
 const parts=Array.from({length:10},(_,i)=>points(s,i));
 const score=parts.reduce((n,x)=>n+x.earned,0),quiz=parts.reduce((n,x)=>n+x.quiz,0);
 const lessons=parts.reduce((n,x)=>n+x.lesson,0);
 const selfPoints=parts.reduce((n,x)=>n+x.selfPoints,0);
 const timePenalty=window.BP_SAFAR_OVERTIME?.penalty(s)||0,guidePenalty=window.BP_SAFAR_GUIDE?.penalty(s)||0;
 const totalPenalty=timePenalty+guidePenalty;
 return{rawTotal:Math.round(score*100)/100,total:Math.max(0,Math.round((score-totalPenalty)*100)/100),
 quiz:Math.round(quiz*100)/100,lessons,selfPoints,resources:0,roles:0,feedback:0,
 timePenalty,guidePenalty,totalPenalty,parts,breakdown:parts.map((p,i)=>({name:window.BP_SAFAR_DATA?.stages?.[i]?.title||"مهارت",score:p.earned}))};
}
function tier(score,quiz){
 if(score>=TIERS.gold.total&&quiz>=TIERS.gold.quiz)return"gold";
 if(score>=TIERS.silver.total&&quiz>=TIERS.silver.quiz)return"silver";
 if(score>=TIERS.bronze.total&&quiz>=TIERS.bronze.quiz)return"bronze";
 return null;
}
window.BP_SAFAR_RUBRIC={STAGE_MAX,MAX,TIERS,reviewEvidence,meaningful,points,total,tier};
})();