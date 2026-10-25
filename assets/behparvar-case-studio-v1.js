(function studio(){
"use strict";
const data=globalThis.BP_CASE_DATA||{};
const audience=new URL(location.href).searchParams.get("audience");
const role=audience==="supervisors"?"supervisors":"managers";
const roleName=role==="supervisors"?"سرپرستان":"مدیران";
const esc=x=>String(x??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const fa=x=>Number(x).toLocaleString("fa-IR");
const storageKey=n=>"behparvar_case_studio_v1_"+n+"_"+role;
const stages=["موقعیت","تصمیم","ایفای نقش","اقدام"];
const active={},state={};
function get(n){
 if(state[n])return state[n];
 let r={};try{r=JSON.parse(localStorage.getItem(storageKey(n))||"{}")||{}}catch(e){}
 state[n]={choices:r.choices||{},notes:r.notes||{},observations:r.observations||{},twists:r.twists||{}};return state[n];
}
function store(n){try{localStorage.setItem(storageKey(n),JSON.stringify(get(n)))}catch(e){}}
function mount(n){
 const section=document.getElementById(n===1?"m2":`session${n}-m2`);
 if(!section)return;
 const root=document.createElement("div");root.className="bp-case-studio";root.id=`bp-studio-${n}`;
 if(n===1){
  const old=section.querySelector("#conversationList");
  if(old){
   section.insertBefore(root,old);
   const wrap=document.createElement("details");wrap.className="bp-studio-legacy";
   const title=document.createElement("summary");title.textContent="گفت‌وگوها و تمرین‌های قبلی جلسه اول";wrap.appendChild(title);
   old.parentElement.insertBefore(wrap,old);wrap.appendChild(old);
  }else section.querySelector(".page-heading")?.after(root);
 }else{
  const container=section.querySelector(".future-content-shell");
  if(!container)return;
  container.insertBefore(root,container.firstChild);
  const empty=Array.from(container.children).find(node=>node.tagName==="P"&&node.textContent.includes("هنوز اضافه نشده"));
  if(empty)empty.remove();
  if(n===2){
   const prev=container.querySelector("#bp3-m2");
   if(prev){
    const wrap=document.createElement("details");wrap.className="bp-studio-legacy";
    const title=document.createElement("summary");title.textContent="تمرین‌های پیشرفته قبلی جلسه دوم";
    wrap.appendChild(title);prev.parentElement.insertBefore(wrap,prev);wrap.appendChild(prev);
   }
  }
 }
 const intro=document.getElementById(`session${n}`);
 if(intro){
  const hd=intro.querySelector(".page-heading h2");
  if(hd&&hd.textContent.startsWith("جلسه "))hd.textContent=data[n].title;
  const p=intro.querySelector(".page-heading p");
  if(p&&p.textContent.includes("هنوز اضافه نشده"))p.textContent="چهار موقعیت کاری با تصمیم‌گیری و ایفای نقش حرفه‌ای؛ در بخش گفت‌وگوهای کاری.";
  const a=document.createElement("a");a.href=`#session${n}-m2`;a.className="btn primary bp-case-session-link";a.textContent="ورود به چهار کیس و ایفای نقش ←";
  intro.querySelector(".page-heading")?.appendChild(a);
 }
 render(n);
}
function head(n){
 const d=data[n];
 return `<div class="bp-case-intro"><span>بهپرور · جلسه ${fa(n)} · ${roleName}</span><h3>${esc(d.title)}</h3><p>${esc(d.subtitle)}</p></div>`;
}
function library(n){
 const list=data[n].cases.map((c,i)=>`<button class="bp-case-list-row" data-bpc-open="${n}:${i}"><span>${fa(i+1)}</span><strong>${esc(c.title)}</strong><small>${esc(c.tag)}</small><i>←</i></button>`).join("");
 return `${head(n)}<p class="bp-case-helper">چهار کیس برای این جلسه آماده است؛ برای تمرین کلاسی، یکی را انتخاب کنید.</p><div class="bp-case-list" role="group">${list}</div><p class="bp-case-disclaimer">سناریوها بازآفرینی آموزشی با الهام از کتاب «حقایق تلخ درباره مدیریت منابع انسانی» هستند؛ رخداد واقعی تأییدشده بهپرور نیستند.</p>`;
}
function frame(n,i,step){
 const c=data[n].cases[i];
 const nav=stages.map((label,j)=>`<span class="${j===step?"current":j<step?"done":""}">${fa(j+1)}. ${label}</span>`).join("");
 return `${head(n)}<div class="bp-case-frame"><div class="bp-case-top"><button data-bpc-close="${n}">→ بازگشت به چهار کیس</button><span>کیس ${fa(i+1)} از ۴</span></div><h3>${esc(c.title)}</h3><small>موضوع: ${esc(c.tag)} · الهام از ${esc(c.source)}</small><div class="bp-case-progress">${nav}</div>`;
}
function showStory(n,i){
 const c=data[n].cases[i];
 return `<article class="bp-case-activity"><span class="bp-case-kicker">۱ · موقعیت واقعی‌نما</span><p class="bp-case-story">${esc(c.story)}</p><h4>${esc(c.decision)}</h4><p class="bp-case-helper">ابتدا تعارض منافع و محدودیت‌ها را تشخیص دهید؛ سپس گزینه‌ها را بررسی کنید.</p><button class="bp-case-next" data-bpc-step="${n}:${i}:1">بررسی سه تصمیم ←</button></article>`;
}
function showDecision(n,i){
 const c=data[n].cases[i],v=get(n).choices[c.id],chosen=Number.isInteger(v)&&v>=0&&v<3;
 const choices=c.choices.map((opt,j)=>`<button class="bp-case-option ${v===j?"selected":""}" data-bpc-choice="${n}:${i}:${j}" aria-pressed="${v===j}"><span>${fa(j+1)}</span><b>${esc(opt[0])}</b></button>`).join("");
 const feedback=chosen?`<div class="bp-case-feedback"><strong>فرصت این تصمیم</strong><p>${esc(c.choices[v][1])}</p><strong>ریسک یا هزینه</strong><p>${esc(c.choices[v][2])}</p></div><div class="bp-case-principle"><strong>درس مدیریتی</strong><p>${esc(c.principle)}</p></div><div class="bp-case-actions"><button data-bpc-step="${n}:${i}:0">مرحله قبل</button><button class="bp-case-next" data-bpc-step="${n}:${i}:2">ایفای نقش ←</button></div>`:`<p class="bp-case-helper">هر سه واکنش ممکن است در موقعیتی قابل دفاع باشند؛ بعد از انتخاب، پیامد همان گزینه را ببینید.</p>`;
 return `<article class="bp-case-activity"><span class="bp-case-kicker">۲ · تصمیم تحت محدودیت</span><h4>${esc(c.decision)}</h4><div class="bp-case-options">${choices}</div>${feedback}</article>`;
}
function showRoleplay(n,i){
 const c=data[n].cases[i],s=get(n);
 const profiles=c.roles[role].map((person,j)=>`<details class="bp-role-card"><summary>نقش ${fa(j+1)} · ${esc(person[0])}</summary><p>${esc(person[1])}</p><small>فقط برگه خودتان را بخوانید؛ از ابتدا دنبال توافق فوری نباشید.</small></details>`).join("");
 const checks=c.observe.map((v,j)=>`<label><input type="checkbox" data-bpc-check="${n}:${i}:${j}" ${s.observations[c.id]?.[j]?"checked":""}><span>${esc(v)}</span></label>`).join("");
 const twist=s.twists[c.id]?`<p class="bp-case-twist">${esc(c.twist)}</p>`:"";
 return `<article class="bp-case-activity"><span class="bp-case-kicker">۳ · ایفای نقش حرفه‌ای</span><h4>دو نفر، دو دغدغه واقعی</h4><p class="bp-case-helper">۸ تا ۱۰ دقیقه؛ هر نفر فقط اطلاعات نقش خود را می‌خواند. نفر سوم رفتارها را مشاهده می‌کند.</p><div class="bp-role-grid">${profiles}</div><div class="bp-role-goal"><strong>مسئله قابل مذاکره</strong><p>${esc(c.decision)}</p><small>اگر تصمیم نهایی ممکن نیست، معلوم کنید چه داده‌ای، از چه کسی و تا چه زمانی لازم است.</small></div><div class="bp-role-event"><button data-bpc-twist="${n}:${i}">${s.twists[c.id]?"بستن اطلاعات تازه":"پس از سه دقیقه: اتفاق جدید را ببینید"}</button>${twist}</div><h4>ناظر چه رفتاری دید؟</h4><div class="bp-observer">${checks}</div><p class="bp-case-helper">این چک‌لیست، سنجش رفتار در یک تمرین است؛ آزمون شخصیت یا ارزیابی رسمی عملکرد نیست.</p><div class="bp-case-actions"><button data-bpc-step="${n}:${i}:1">مرحله قبل</button><button class="bp-case-next" data-bpc-step="${n}:${i}:3">جمع‌بندی و اقدام ←</button></div></article>`;
}
function showAction(n,i){
 const c=data[n].cases[i],s=get(n);
 return `<article class="bp-case-activity"><span class="bp-case-kicker">۴ · انتقال به کار</span><h4>یک تغییر واقعی از فردا</h4><div class="bp-case-principle"><strong>پیشنهاد کاربردی</strong><p>${esc(c.transfer)}</p></div><label class="bp-case-note-label" for="bpc-note-${n}-${i}">اقدام خودتان را بنویسید (اختیاری)</label><textarea rows="3" maxlength="900" id="bpc-note-${n}-${i}" data-bpc-note="${n}:${i}" placeholder="در چه موقعیتی، با چه کسی، تا چه زمانی؟">${esc(s.notes[c.id]||"")}</textarea><p class="bp-case-helper">یادداشت فقط در مرورگر همین دستگاه نگهداری می‌شود.</p><div class="bp-case-actions"><button data-bpc-step="${n}:${i}:2">مرحله قبل</button><button class="bp-case-next" data-bpc-close="${n}">بازگشت به کیس‌های جلسه ←</button></div></article>`;
}
function render(n){
 const host=document.getElementById(`bp-studio-${n}`);if(!host)return;
 const a=active[n];if(!a){host.innerHTML=library(n);return}
 if(!data[n].cases[a.i]){delete active[n];host.innerHTML=library(n);return}
 const pages=[showStory,showDecision,showRoleplay,showAction];
 host.innerHTML=frame(n,a.i,a.step)+pages[a.step](n,a.i)+"</div>";
}
function go(n,i,step,scroll=false){
 const c=data[n]?.cases[i];if(!c)return;
 if(step>1&&!Number.isInteger(get(n).choices[c.id]))step=1;
 active[n]={i,step:Math.min(3,Math.max(0,step))};render(n);
 if(scroll)document.getElementById(`bp-studio-${n}`)?.scrollIntoView({block:"start",behavior:"auto"});
}
document.addEventListener("click",e=>{
 const b=e.target.closest("[data-bpc-open],[data-bpc-close],[data-bpc-step],[data-bpc-choice],[data-bpc-twist]");
 if(!b)return;
 if(b.dataset.bpcOpen){const [n,i]=b.dataset.bpcOpen.split(":").map(Number);go(n,i,0,true)}
 if(b.dataset.bpcClose){const n=Number(b.dataset.bpcClose);delete active[n];render(n);document.getElementById(`bp-studio-${n}`)?.scrollIntoView({block:"start",behavior:"auto"})}
 if(b.dataset.bpcStep){const [n,i,step]=b.dataset.bpcStep.split(":").map(Number);go(n,i,step,true)}
 if(b.dataset.bpcChoice){const [n,i,j]=b.dataset.bpcChoice.split(":").map(Number);const c=data[n]?.cases[i];if(c){get(n).choices[c.id]=j;store(n);render(n)}}
 if(b.dataset.bpcTwist){const [n,i]=b.dataset.bpcTwist.split(":").map(Number);const c=data[n]?.cases[i];if(c){const v=get(n);v.twists[c.id]=!v.twists[c.id];store(n);render(n)}}
});
document.addEventListener("change",e=>{
 const b=e.target.closest("[data-bpc-check]");if(!b)return;
 const [n,i,j]=b.dataset.bpcCheck.split(":").map(Number),c=data[n]?.cases[i];if(!c)return;
 const v=get(n);if(!v.observations[c.id])v.observations[c.id]={};v.observations[c.id][j]=b.checked;store(n)
});
document.addEventListener("input",e=>{
 const b=e.target.closest("[data-bpc-note]");if(!b)return;
 const [n,i]=b.dataset.bpcNote.split(":").map(Number),c=data[n]?.cases[i];if(c){get(n).notes[c.id]=b.value.slice(0,900);store(n)}
});
Object.keys(data).map(Number).sort((a,b)=>a-b).forEach(mount);
})();