/* Safar Ertebatat v4 — local session lifecycle and independent learning history.
 * Fully local; server-side certification is NOT claimed.
 */
(()=>{"use strict";
const root=document.getElementById("root");
const stages=window.BP_SAFAR_DATA?.stages||[];
if(!root||stages.length!==10)return;
const MAIN="bp-communication-journey-v3",HISTORY="bp-safar-communication-history-v1",NAV="bp-safar-nested-v3";
const escape=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fa=n=>Number(n||0).toLocaleString("fa-IR");
const read=(key)=>{try{return JSON.parse(localStorage.getItem(key)||"null")}catch(e){return null}};
const current=()=>read(MAIN);
const records=()=>{const x=read(HISTORY);return Array.isArray(x)?x:[]};
function grade(s){
 let quiz=0,roles=0,selfPoints=0,resources=0,feedback=0;
 stages.forEach((stage,i)=>{
  const a=s.answers?.[i]||{};
  quiz+=(a.q1===stage.c1?4:0)+(a.q2?.best===stage.best?2:0)+(a.q2?.worst===stage.worst?2:0);
  roles+=s.rp?.[i]?0.5:0;
  const ratings=s.self?.[i]||[];if(ratings.length===3&&ratings.every(n=>Number.isInteger(n)&&n>=1&&n<=4))selfPoints+=0.5;
  feedback+=s.peer?.[i]&&[2,7].includes(i)?2:0;
  const inc=window.BP_SAFAR_DATA.incidents?.find(x=>x.stage===i+1);
  const v=s.alloc?.[i];
  if(inc&&Array.isArray(v)){const dif=v.reduce((n,val,j)=>n+Math.abs(val-inc.ideal[j]),0);resources+=dif===0?2:dif<=2?1:0;}
 });
 return {quiz,roles,selfPoints,resources,feedback,total:quiz+roles+selfPoints+resources+feedback};
}
function badge(s){const p=grade(s),x=p.total,q=p.quiz;return x>=90&&q>=72?"زرین":x>=75&&q>=60?"سیمین":x>=60&&q>=44?"برنزی":"بدون نشان"}
function storeHistory(s){
 const rows=records(),id=String(s.startedAt);
 if(rows.some(x=>x.id===id))return rows;
 const p=grade(s);
 const row={id,role:s.role,startedAt:s.startedAt,finishedAt:s.finishedAt,name:s.name||"",score:p.total,quiz:p.quiz,level:badge(s),snapshot:s};
 const next=[row,...rows].slice(0,8);
 try{localStorage.setItem(HISTORY,JSON.stringify(next))}catch(e){console.warn("Local archive unavailable",e)}
 return next;
}
function newJourney(){
 const s=current();if(!s)return;
 const msg=s.finished?
 "نتیجه سفر فعلی در سوابق همین دستگاه نگهداری می‌شود. یک سفر جدید با مسیر یا پاسخ‌های تازه شروع کنیم؟":
 "سفر فعلی هنوز کامل نشده است. اگر سفر جدیدی شروع کنی، پاسخ‌های ثبت‌شده فعلی جایگزین می‌شوند. ادامه می‌دهی؟";
 if(!confirm(msg))return;
 if(s.finished)storeHistory(s);
 const fresh={version:3,curriculumV4:4,role:"",name:s.name||"",startedAt:0,stage:0,answers:{},orders:{},self:{},alloc:{},rp:{},peer:{},events:[],finished:false,finishedAt:0,sound:!!s.sound};
 try{localStorage.setItem(MAIN,JSON.stringify(fresh));sessionStorage.removeItem(NAV)}catch(e){alert("ذخیره‌سازی مرورگر فعال نیست؛ امکان شروع ایمن سفر جدید وجود ندارد.");return}
 window.location.reload();
}
function restore(id){
 const s=current(),archive=records().find(x=>x.id===id);
 if(!archive?.snapshot)return;
 if(s?.startedAt&&!s.finished){alert("ابتدا سفر جاری را تکمیل کن؛ نمی‌توان یک سفر نیمه‌تمام را بدون از دست‌دادن پاسخ‌ها جایگزین کرد.");return}
 if(!confirm("نتیجه این سفر قدیمی روی دستگاه باز شود؟"))return;
 try{localStorage.setItem(MAIN,JSON.stringify(archive.snapshot));sessionStorage.removeItem(NAV)}catch(e){alert("ذخیره‌سازی در مرورگر انجام نشد.");return}
 window.location.reload();
}
function historyView(){
 const rows=records();
 return '<details class="sf-history"><summary>📁 سوابق سفر در همین دستگاه ('+fa(rows.length)+')</summary>'+
 (rows.length?rows.map(x=>
 '<div class="sf-history-row"><div><strong>'+escape(x.role==="managers"?"مسیر مدیران":"مسیر سرپرستان")+'</strong>'+
 '<small>'+fa(x.score)+'/۱۰۰ · '+escape(x.level)+' · '+new Intl.DateTimeFormat("fa-IR",{dateStyle:"medium"}).format(new Date(x.finishedAt||x.startedAt))+'</small></div>'+
 '<button type="button" data-sf-restore="'+escape(x.id)+'">مشاهده نتیجه</button></div>').join(""):
 '<p>پس از تکمیل نخستین سفر، سوابق اینجا نگهداری می‌شود.</p>')+
 '<p class="sf-history-note">سوابق فقط در مرورگر همین دستگاه ذخیره می‌شوند؛ با پاک‌شدن داده مرورگر ممکن است از بین بروند.</p></details>';
}
function decorate(){
 const s=current(),hero=root.querySelector(".result-hero");
 if(hero){
  if(!root.querySelector("#sfNewJourney")){
   if(s?.finished)storeHistory(s);
   const box=document.createElement("div");box.id="sfNewJourney";box.className="sf-session-controls";
   box.innerHTML='<button id="sfStartAgain" type="button" class="btn">↻ شروع سفر جدید یا مسیر دیگر</button>'+historyView();
   const badge=root.querySelector("#sfMedalFeature"),anchor=badge||hero;
   anchor.insertAdjacentElement("afterend",box);
  }
 }else if(!s?.startedAt&&root.querySelector(".introgrid")&&!root.querySelector("#sfPastHistory")){
  const wrap=document.createElement("div");wrap.id="sfPastHistory";wrap.innerHTML=historyView();
  const cover=root.querySelector("#sfMedalGallery")||root.querySelector(".introgrid");
  cover.insertAdjacentElement("afterend",wrap);
 }
}
document.addEventListener("click",e=>{
 if(e.target.closest("#sfStartAgain")){e.preventDefault();newJourney()}
 const b=e.target.closest("[data-sf-restore]");
 if(b){e.preventDefault();restore(b.dataset.sfRestore)}
});
let pending=false;
const obs=new MutationObserver(()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;decorate()})});
obs.observe(root,{subtree:false,childList:true});
decorate();
window.BP_SAFAR_SESSION={grade,badge};
})();