/* Behparvar · Session 4 approved recognition collection
 * Lightweight overlay: existing grading, time rules, score and final-medal downloads are authoritative.
 * Official logo is always read from #brandlogo; all labels use the locally hosted Vazirmatn face.
 */
(()=>{"use strict";
const ROOT=document.getElementById("root"),KEY="bp-communication-journey-v3";
if(!ROOT)return;
const fa=n=>Number(n||0).toLocaleString("fa-IR");
const skillNames=[
"شروع حرفه‌ای و اعتماد","روشن‌سازی پیام","شنود و همدلی","لحن و بیان","بازخورد مؤثر",
"گفت‌وگوی دشوار","هماهنگی بین‌واحدی","نه‌گفتن محترمانه","بازسازی اعتماد","مذاکره و توافق"
];
const icons=[
'<path d="M11 51 28 29 35 38 47 18 56 51H11Z"/><path d="M47 18V7m0 0 13 4-13 5"/><path d="m17 49 12-12 7 5"/>',
'<circle cx="32" cy="32" r="22"/><circle cx="32" cy="32" r="12"/><path d="M32 4v12m0 32v12M4 32h12m32 0h12"/><path d="M26 29h12v9H29l-5 4v-4"/>',
'<path d="M13 34V29a19 19 0 0 1 38 0v5"/><rect x="9" y="31" width="9" height="19" rx="4"/><rect x="46" y="31" width="9" height="19" rx="4"/><path d="M32 47c-12-8-10-15-5-16 3-1 5 1 5 1s3-3 6-1c6 3 5 9-6 16Z"/>',
'<rect x="26" y="11" width="12" height="28" rx="6"/><path d="M19 30a13 13 0 0 0 26 0M32 43v11m-10 0h20M12 21a24 24 0 0 0 0 18M52 21a24 24 0 0 1 0 18"/>',
'<path d="M10 12h44v31H28L16 53V43h-6Z"/><path d="m28 28 6 6 13-14"/><path d="M18 20h6"/>',
'<path d="M7 12h31v21H21L12 41v-8H7ZM57 51H27V37h16l8-8v8h6Z"/><path d="m33 9-9 20h11l-7 20"/>',
'<circle cx="21" cy="22" r="9"/><circle cx="45" cy="42" r="9"/><path d="M21 8v5m0 18v5M7 22h5m18 0h5M11 12l4 4m12 12 4 4M45 28v5m0 18v5M31 42h5m18 0h5M35 32l4 4m12 12 4 4"/><path d="m21 18 4 4-4 5m24 10v10"/>',
'<path d="M20 52V25a4 4 0 0 1 8 0V14a4 4 0 0 1 8 0v11-7a4 4 0 0 1 8 0v10-4a4 4 0 0 1 8 0v17c0 8-6 13-14 13H28Z"/><path d="m7 40 9 9"/>',
'<path d="m12 24 13-10 9 4 16-6m-2 0h8v8"/><path d="M13 47 26 33l8 6 14-12"/><path d="m42 27 6 0v6"/><path d="M10 51h44"/>',
'<path d="M15 8h25l10 10v36H15Z"/><path d="M40 8v11h10M23 27h17M23 35h12"/><path d="m27 46 6 5 12-15"/>'
];
const participation=[
{id:"active",title:"حضور فعال",hint:"ثبت دست‌کم ۳ تمرین دونفره",icon:'<circle cx="32" cy="14" r="8"/><path d="M15 50V39c0-12 34-12 34 0v11M9 28l6 5m40-5-6 5M32 2v5"/>'},
{id:"practice",title:"تکمیل تمرین‌ها",hint:"ثبت دست‌کم ۷ تمرین دونفره",icon:'<rect x="13" y="8" width="38" height="49" rx="3"/><path d="m19 21 5 5 8-10m-13 20 5 5 8-10m4-9h9m-9 15h9"/>'},
{id:"team",title:"همفکری تیمی",hint:"ثبت ۲ بازخورد رفتاری همکار",icon:'<circle cx="18" cy="27" r="6"/><circle cx="46" cy="27" r="6"/><circle cx="32" cy="17" r="7"/><path d="M7 49c0-10 22-10 22 0m6 0c0-10 22-10 22 0M19 55c0-13 26-13 26 0"/>'},
{id:"time",title:"مدیریت زمان",hint:"پایان ۱۰ مرحله در ۶۰ دقیقه بدون وقت اضافه",icon:'<circle cx="30" cy="32" r="22"/><path d="M30 15v18l11 7M22 3h16M45 10l5-5"/>'}
];
const all=[...skillNames.map((title,i)=>({id:"s"+i,title,kind:"skill",idx:i,icon:icons[i],hint:"تکمیل تصمیم‌ها و خودارزیابی ایستگاه "+fa(i+1)})),...participation.map(x=>({...x,kind:"participation"}))];
function state(){try{const x=JSON.parse(localStorage.getItem(KEY)||"null");return x?.version===3?x:null}catch(e){return null}}
function earned(s){
 const completed=s?.withdrawn?10:(s?.finished?10:Math.min(10,Math.max(0,Number(s?.stage)||0)));
 const levels=new Set();
 if(s?.mode!=="competitive"||!s?.startedAt)return levels;
 for(let i=0;i<completed;i++){
  const a=s.answers?.[i]||{},self=s.self?.[i]||[];
  if(a.q1!==undefined&&a.q2!==undefined&&self.length===3&&self.every(n=>Number.isInteger(n)&&n>=1&&n<=4))levels.add("s"+i);
 }
 const count=Object.keys(s.rp||{}).filter(k=>!!s.rp[k]).length;
 if(count>=3)levels.add("active");
 if(count>=7)levels.add("practice");
 const peer=Object.keys(s.peer||{}).filter(k=>!!s.peer[k]).length;
 if(peer>=2)levels.add("team");
 const paused=Number(s.pause?.spentMs)||0,extra=Number(s.overtime?.pauseMs)||0;
 if(s.finished&&!s.withdrawn&&s.finishedAt&&s.startedAt&&s.finishedAt-s.startedAt-paused-extra<=3600000&&
    !(s.overtime?.grants||[]).length)levels.add("time");
 return levels;
}
function symbol(icon){
 return '<svg viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.9" stroke-linecap="round" stroke-linejoin="round">'+icon+'</svg>';
}
function badge(item,yes){
 return '<article class="bp-recognition-badge '+(yes?"is-earned":"is-locked")+'" aria-label="'+item.title+'، '+(yes?"دریافت شده":"دریافت نشده")+'">'+
 '<div class="bp-recognition-shield">'+symbol(item.icon)+'</div>'+
 '<strong>'+item.title+'</strong>'+
 '<span class="bp-recognition-state">'+(yes?"کسب‌شده":item.kind==="skill"?"در انتظار تکمیل":"هنوز کسب نشده")+'</span>'+
 (yes?'<button type="button" class="bp-recognition-download" data-bp-download="'+item.id+'" aria-label="دانلود نشان '+item.title+'">دریافت PNG</button>':
 '<small class="bp-recognition-rule">'+item.hint+'</small>')+'</article>';
}
let lastState=null,lastToast=null;
function shareMenu(s){
 const got=earned(s),n=[...got].filter(x=>x.startsWith("s")).length;
 const competitive=s?.mode==="competitive"||(!s?.startedAt&&s?.mode!=="study");
 if(!competitive)return;
 const intro=!s.startedAt,current=!intro&&!s.finished;
 const section=document.createElement("details");
 section.id="bp-recognition-collection";
 section.className="bp-recognition-collection";
 if(s.finished)section.open=true;
 section.innerHTML='<summary><span class="bp-recognition-summary-copy"><b>نشان‌های سفر ارتباطات</b><small>'+
 (intro?"مهارت‌ها و شرایط کسب نشان":fa(n)+" نشان مهارتی از ۱۰ ایستگاه")+
 '</small></span><span class="bp-recognition-summary-mark" aria-hidden="true">'+fa(n)+'/۱۰</span></summary>'+
 '<div class="bp-recognition-inner"><p>نشان مهارتی پس از تکمیل تصمیم‌ها و خودارزیابی آن ایستگاه ثبت می‌شود. بج‌های مشارکتی فقط با ثبت رفتار قابل مشاهده فعال می‌شوند.</p>'+
 '<h3>نشان‌های مهارتی</h3><div class="bp-recognition-grid">'+all.filter(x=>x.kind==="skill").map(x=>badge(x,got.has(x.id))).join("")+'</div>'+
 '<h3>بج‌های مشارکت</h3><div class="bp-recognition-grid bp-participation-grid">'+all.filter(x=>x.kind==="participation").map(x=>badge(x,got.has(x.id))).join("")+'</div>'+
 '<p class="bp-recognition-note">'+(s.withdrawn?'این سفر زودتر پایان یافته است؛ نشان‌های کسب‌شده محفوظ‌اند، اما مدال تکمیل ۱۰ مرحله صادر نمی‌شود.':'مدال پایان سفر فقط یکی است: زرین، سیمین یا برنزی بر اساس امتیاز نهایی. مشاهده این مجموعه امتیازی ایجاد نمی‌کند.')+'</p>'+
 (got.size?'<button type="button" class="bp-recognition-exportall" id="bpExportEarned">دریافت کارت نشان‌های کسب‌شده (PNG)</button>':"")+
 '</div>';
 const original=root.querySelector("#bp-recognition-collection");
 if(original){const open=original.open;if(!s.finished)section.open=open;original.replaceWith(section);return}
 const anchor=s.finished?(root.querySelector("#sfMedalFeature")||root.querySelector(".result-hero")):(root.querySelector(".introgrid")||root.querySelector(".progressrow"));
 if(anchor)anchor.insertAdjacentElement("afterend",section);
}
function stageSignature(s){return [s?.startedAt,s?.stage,s?.finished,s?.mode,Object.keys(s?.rp||{}).length,Object.keys(s?.peer||{}).length].join(":")}
let signature=null;
function refresh(){
 const s=state();if(!s||s.mode==="study")return;
 const sig=stageSignature(s);
 const rootContains=ROOT.querySelector("#bp-recognition-collection");
 if(rootContains&&signature===sig)return;
 const previously=lastState;
 const newlyCompleted=previously&&s.startedAt===previously.startedAt&&s.stage>previously.stage&&!s.finished;
 signature=sig;
 shareMenu(s);
 if(newlyCompleted)toast(all[previously.stage]);
 lastState={startedAt:s.startedAt,stage:s.stage};
 // Preserve only one final medal: the original feature remains the single authoritative downloadable award.
 const favicon=document.querySelector('link[rel="icon"]'),logo=document.querySelector("#brandlogo");
 if(favicon&&logo?.src?.startsWith("data:image"))favicon.href=logo.src;
}
function toast(item){
 if(!item||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
 document.querySelector("#bp-recognition-toast")?.remove();
 const node=document.createElement("div");node.id="bp-recognition-toast";node.setAttribute("role","status");
 node.innerHTML='<div class="bp-recognition-toast-icon">'+symbol(item.icon)+'</div><div><strong>نشان «'+item.title+'» ثبت شد</strong><span>برای دریافت تصویر، مجموعه نشان‌ها را باز کن.</span></div><button type="button" aria-label="بستن پیام نشان" id="bpCloseBadgeToast">×</button>';
 document.body.append(node);
 if(lastToast)clearTimeout(lastToast);
 lastToast=setTimeout(()=>node.remove(),4200);
}
function saveBlob(blob,file){
 const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=file;
 document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),9000);
}
function svgIcon(item){
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="#f4d89a" stroke-width="2.9" stroke-linecap="round" stroke-linejoin="round">'+item.icon+'</svg>';
}
async function drawLogo(ctx,x,y,w,h){
 const img=document.querySelector("#brandlogo");if(!img)return false;
 if(!img.complete){try{await img.decode()}catch(e){}}
 if(!img.naturalWidth)return false;
 const ratio=Math.min(w/img.naturalWidth,h/img.naturalHeight),width=img.naturalWidth*ratio,height=img.naturalHeight*ratio;
 ctx.fillStyle="#fffaf0";ctx.fillRect(x-16,y-9,w+32,h+18);
 ctx.drawImage(img,x+(w-width)/2,y+(h-height)/2,width,height);
 return true;
}
async function iconBitmap(item){
 const raw=svgIcon(item);
 const u=URL.createObjectURL(new Blob([raw],{type:"image/svg+xml;charset=utf-8"}));
 const img=new Image();
 try{await new Promise((res,rej)=>{img.onload=res;img.onerror=rej;img.src=u});return img}finally{URL.revokeObjectURL(u)}
}
function rounded(ctx,x,y,w,h,r,fill,stroke){
 ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.lineWidth=4;ctx.strokeStyle=stroke;ctx.stroke()}
}
async function exportPng(items,s,fileName){
 const scale=2,cols=items.length===1?1:3,cellW=360,cellH=372,rows=Math.ceil(items.length/cols);
 const w=cols*cellW+70,h=rows*cellH+365;
 const canvas=document.createElement("canvas");canvas.width=w*scale;canvas.height=h*scale;
 const ctx=canvas.getContext("2d");if(!ctx)throw Error("Canvas unavailable");
 ctx.scale(scale,scale);ctx.fillStyle="#f8f4e9";ctx.fillRect(0,0,w,h);
 rounded(ctx,14,14,w-28,h-28,20,"#faf7ee","#d7ad65");
 rounded(ctx,28,29,w-56,190,17,"#0b3535","#c7a35d");
 ctx.textAlign="center";ctx.direction="rtl";
 if(document.fonts){try{await document.fonts.load("800 36px Vazirmatn");await document.fonts.ready}catch(e){}}
 await drawLogo(ctx,(w-220)/2,57,220,64);
 ctx.fillStyle="#f8f2df";ctx.font="800 35px Vazirmatn, Tahoma";
 ctx.fillText("سفر ارتباطات · جلسه چهارم",w/2,169);
 for(let i=0;i<items.length;i++){
  const item=items[i],col=i%cols,row=Math.floor(i/cols),x=35+col*cellW,y=245+row*cellH;
  rounded(ctx,x+10,y+7,cellW-26,cellH-25,18,"#fffdf5","#d4bb8a");
  // Hexagonal shield in the approved deep-teal / restrained-gold palette.
  ctx.beginPath();ctx.moveTo(x+100,y+51);ctx.lineTo(x+cellW-100,y+51);ctx.lineTo(x+cellW-55,y+90);
  ctx.lineTo(x+cellW-55,y+196);ctx.lineTo(x+cellW/2,y+235);ctx.lineTo(x+55,y+196);
  ctx.lineTo(x+55,y+90);ctx.closePath();ctx.fillStyle="#06413d";ctx.fill();
  ctx.strokeStyle="#d5ad60";ctx.lineWidth=7;ctx.stroke();
  const bitmap=await iconBitmap(item);ctx.drawImage(bitmap,x+cellW/2-56,y+94,112,112);
  rounded(ctx,x+28,y+241,cellW-62,63,13,"#f0e5c9","#c9ab6f");
  ctx.fillStyle="#173e3c";ctx.font="800 25px Vazirmatn, Tahoma";ctx.fillText(item.title,x+cellW/2,y+284);
 }
 const name=String(s.name||"شرکت‌کننده به‌پرور").trim().slice(0,64);
 ctx.fillStyle="#16413d";ctx.font="700 26px Vazirmatn, Tahoma";
 ctx.fillText(name,w/2,h-53);
 const blob=await new Promise(res=>canvas.toBlob(res,"image/png"));if(!blob)throw Error("PNG export failed");
 saveBlob(blob,fileName);
}
document.addEventListener("click",async e=>{
 const close=e.target.closest("#bpCloseBadgeToast");if(close){close.closest("#bp-recognition-toast")?.remove();return}
 const button=e.target.closest("[data-bp-download],#bpExportEarned");
 if(!button||button.disabled)return;
 const s=state();if(!s)return;
 const got=earned(s);
 let list=[],file="";
 if(button.id==="bpExportEarned"){list=all.filter(x=>got.has(x.id));file="Behparvar-Session4-Earned-Badges.png"}
 else{const item=all.find(x=>x.id===button.dataset.bpDownload);if(!item||!got.has(item.id))return;list=[item];file="Behparvar-S4-"+item.id+".png"}
 if(!list.length)return;
 const old=button.textContent;button.disabled=true;button.textContent="در حال ساخت تصویر…";
 try{await exportPng(list,s,file)}catch(err){console.error("Behparvar badge download:",err);alert("ساخت تصویر نشان انجام نشد. دوباره تلاش کن.")}
 finally{button.disabled=false;button.textContent=old}
});
let pending=false;
new MutationObserver(()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;refresh()})}).observe(ROOT,{childList:true,subtree:false});
window.BP_SAFAR_RECOGNITION={skillNames,participation,earned,refresh};
refresh();
})();