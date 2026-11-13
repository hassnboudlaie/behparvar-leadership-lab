/* Post-journey diagnostic report — never reveals answer correctness before finish. */
(()=>{"use strict";
const root=document.getElementById("root"),stages=window.BP_SAFAR_DATA?.stages||[];
if(!root||stages.length!==10)return;
const KEY="bp-communication-journey-v3",fa=n=>Number(n||0).toLocaleString("fa-IR");
function decorate(){
 let s;try{s=JSON.parse(localStorage.getItem(KEY)||"null")}catch(e){return}
 if(!s?.finished)return;
 const entries=root.querySelectorAll(".reviewentry");
 if(entries.length!==10)return;
 let correct=0;
 entries.forEach((entry,i)=>{
  if(entry.dataset.sfReviewed)return;
  const a=s.answers?.[i]||{},st=stages[i];
  const good1=a.q1===st.c1,goodBest=a.q2?.best===st.best,goodWorst=a.q2?.worst===st.worst;
  correct+=Number(good1)+Number(goodBest)+Number(goodWorst);
  const h=entry.querySelectorAll("h3");
  if(h[0])h[0].insertAdjacentHTML("afterend",'<div class="sf-final-answer-status '+(good1?"correct":"incorrect")+'">'+(good1?"✓ پاسخ اول درست":"✕ پاسخ اول نیازمند بازبینی")+'</div>');
  if(h[1])h[1].insertAdjacentHTML("afterend",'<div class="sf-final-answer-status '+(goodBest&&goodWorst?"correct":"incorrect")+'">'+
   '<span>تشخیص بهترین اقدام: '+(goodBest?"درست":"نادرست")+'</span>'+
   '<span>تشخیص ضعیف‌ترین اقدام: '+(goodWorst?"درست":"نادرست")+'</span></div>');
  const self=s.self?.[i]||[];
  if(self.length===3){
   const sum=self.reduce((n,v)=>n+Number(v),0);
   const note=document.createElement("p");note.className="sf-final-self-note";
   note.textContent="خودارزیابی رفتاری این مرحله: "+fa(sum)+" از ۱۲ (نتیجه بازتابی، نه آزمون دانش).";
   entry.append(note);
  }
  entry.dataset.sfReviewed="1";
 });
 let hero=root.querySelector(".result-hero"),note=root.querySelector("#sfFinalReviewNotice");
 if(!hero)return;
 if(!note){
  note=document.createElement("div");note.id="sfFinalReviewNotice";note.className="sf-final-review-notice";
  const card=root.querySelector(".reviewentry")?.closest(".card");
  if(card)card.insertBefore(note,card.querySelector(".reviewentry"));
 }
 if(note)note.innerHTML='<strong>کلید و بازخورد کامل اکنون آزاد شد.</strong>'+
  '<p>از ۳۰ تشخیص آموزشی، '+fa(correct)+' تشخیص درست ثبت کردی. برای هر مرحله، پاسخ انتخاب‌شده، کلید و دلیل تک‌تک گزینه‌ها را باز کن. نتیجه خودارزیابی را با مشاهده رفتاری بسنج.</p>';
}
let queued=false;
new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;decorate()})}).observe(root,{childList:true,subtree:false});
decorate();
window.BP_SAFAR_FINAL_REVIEW_V4={decorate};
})();