/* Session 4 — earned points after each wizard step; keep the canonical 100-point rubric. */
(()=>{"use strict";
const root=document.getElementById("root"),data=window.BP_SAFAR_DATA;
if(!root||!data?.stages||data.stages.length!==10)return;
const KEY="bp-communication-journey-v3";
const fa=n=>Number(n||0).toLocaleString("fa-IR");
function state(){try{const o=JSON.parse(localStorage.getItem(KEY)||"null");return o?.version===3?o:null}catch(e){return null}}
function pts(s,i){
 const st=data.stages[i],a=s.answers?.[i]||{},inc=data.incidents.find(x=>x.stage===i+1),alloc=s.alloc?.[i];
 const one=a.q1===st.c1?4:0,two=(a.q2?.best===st.best?2:0)+(a.q2?.worst===st.worst?2:0);
 let resources=0;if(inc&&Array.isArray(alloc)){const diff=alloc.reduce((sum,n,j)=>sum+Math.abs(n-inc.ideal[j]),0);resources=diff===0?2:diff<=2?1:0}
 const self=s.self?.[i]||[],reflection=self.length===3&&self.every(v=>Number.isInteger(v)&&v>=1&&v<=4)?0.5:0;
 const role=s.rp?.[i]?0.5:0,peer=[2,7].includes(i)&&s.peer?.[i]?2:0;
 return{one,two,resources,role,peer,max:9+(inc?2:0)+([2,7].includes(i)?2:0),earned:one+two+resources+reflection+role+peer,reflection};
}
function progress(s){let sum=0,quiz=0;for(let i=0;i<10;i++){let p=pts(s,i);sum+=p.earned;quiz+=p.one+p.two}const raw=sum,penalty=window.BP_SAFAR_OVERTIME?.penalty(s)||0;return{sum:Math.max(0,raw-penalty),raw,penalty,quiz}}
function nextMedal(s){
 const p=progress(s),tiers=[["برنزی",60,44],["سیمین",75,60],["زرین",90,72]];
 const next=tiers.find(x=>p.sum<x[1]||p.quiz<x[2]);
 if(!next)return"شرایط امتیازی نشان زرین فراهم شده؛ دریافت پس از پایان سفر است.";
 return"تا نشان "+next[0]+": "+fa(Math.max(0,next[1]-p.sum))+" امتیاز کل"+(next[2]>p.quiz?" و "+fa(next[2]-p.quiz)+" امتیاز آزمون":"")+" مانده.";
}
function strip(s){
 const head=root.querySelector("#sfWizardHead");if(!head)return;
 let box=head.querySelector("#sfScoreStrip");
 if(!box){box=document.createElement("div");box.id="sfScoreStrip";box.className="sf-score-strip";head.append(box)}
 const p=pts(s,s.stage),t=progress(s);
 box.innerHTML='<div><span>مرحله جاری</span><strong>'+fa(p.earned)+' از '+fa(p.max)+'</strong></div>'+
 '<div><span>امتیاز سفر</span><strong>'+fa(t.sum)+' از ۱۰۰</strong></div>'+
 '<div class="sf-score-track"><span style="width:'+Math.max(0,Math.min(100,t.sum))+'%"></span></div>'+
 '<small>'+(t.penalty?'امتیاز خام '+fa(t.raw)+' − کسر وقت اضافه '+fa(t.penalty)+' = '+fa(t.sum)+' امتیاز نهایی · ':'')+nextMedal(s)+'</small>';
 const wrap=root.querySelector("#sfWizardWrap p");
 if(wrap)wrap.textContent="این مرحله: "+fa(p.earned)+" امتیاز از "+fa(p.max)+" امتیاز ممکن. مجموع سفر پس از کسر وقت اضافه: "+fa(t.sum)+" از ۱۰۰.";
}
function announce(s,phase,stage){
 const anchor=root.querySelector("#sfWizardCoach");if(!anchor)return;
 root.querySelector("#sfEarnedStep")?.remove();
 const p=pts(s,stage),r=progress(s),map={
  decision1:[p.one,4,"تصمیم اول"],decision2:[p.two,4,"تصمیم دوم"],
  resource:[p.resources,2,"تخصیص منابع"],role:[p.role,1,"گفت‌وگوی دونفره"],
  peer:[p.peer,2,"بازخورد تکمیلی"],self:[p.reflection,0.5,"خودارزیابی"]
 };
 const m=map[phase],label=phase==="wrap"?"مرحله "+fa(stage+1)+": "+fa(p.earned)+" از "+fa(p.max)+" امتیاز":m?m[2]+": "+fa(m[0])+" از "+fa(m[1])+" امتیاز":"گام آموزشی تکمیل شد";
 const el=document.createElement("div");el.id="sfEarnedStep";el.className="sf-step-feedback sf-wizard-visible";
 el.setAttribute("role","status");el.setAttribute("aria-live","polite");
 el.innerHTML='<strong>'+label+'</strong><span>مجموع: '+fa(r.sum)+' از ۱۰۰</span><small>'+(r.penalty?'کسر وقت اضافه: '+fa(r.penalty)+' · ':'')+nextMedal(s)+'</small>';
 anchor.insertAdjacentElement("afterend",el);
}
let pending=false;
const sync=()=>{const s=state();if(s?.startedAt&&!s.finished)strip(s)};
window.addEventListener?.("bp-safar-time-extended",sync);
new MutationObserver(()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;sync()})}).observe(root,{childList:true,subtree:false});
document.addEventListener("click",e=>{
 const b=e.target.closest("#sfNext");if(!b||b.disabled)return;
 const before=state(),h=root.querySelector("#sfWizardHead");if(!before||!h)return;
 const phase=h.dataset.phase,stage=before.stage,start=before.startedAt;
 requestAnimationFrame(()=>requestAnimationFrame(()=>{
  // The wizard rebuilds its header in a MutationObserver-driven animation frame.
  // Announce only after that update, especially on a new major stage.
  const after=state();if(!after||after.startedAt!==start||after.finished)return;
  const newHead=root.querySelector("#sfWizardHead");
  if(after.stage!==stage)announce(after,"wrap",stage);
  else if(newHead&&newHead.dataset.phase!==phase)announce(after,phase,stage);
 }));
},true);
sync();
window.BP_SAFAR_STEP_POINTS={pts,progress,nextMedal};
})();