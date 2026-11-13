/* Behparvar / Safar Ertebatat - results integration + real downloads.
 * Uses score rules identical to the existing in-page grading implementation.
 */
(()=>{"use strict";
const root=document.querySelector("#root"),D=window.BP_SAFAR_BADGE_DESIGN;
const stages=window.BP_SAFAR_DATA?.stages||[],incidents=window.BP_SAFAR_DATA?.incidents||[];
if(!root||!D||stages.length!==10)return;
const KEY="bp-communication-journey-v3",types=["gold","silver","bronze"];
const fa=n=>Number(n??0).toLocaleString("fa-IR");
function getState(){try{const s=JSON.parse(localStorage.getItem(KEY)||"null");return s?.version===3?s:null}catch(e){return null}}
function score(s){
 let quiz=0,rp=0,reflect=0,resources=0,feedback=0;
 stages.forEach((stage,i)=>{
  const a=s.answers?.[i]||{};
  if(a.q1===stage.c1)quiz+=4;
  if(a.q2?.best===stage.best)quiz+=2;
  if(a.q2?.worst===stage.worst)quiz+=2;
  if(s.rp?.[i])rp+=0.5;
  const ratings=s.self?.[i]||[];if(ratings.length===3&&ratings.every(n=>Number.isInteger(n)&&n>=1&&n<=4))reflect+=0.5;
  if([2,7].includes(i)&&s.peer?.[i])feedback+=2;
  const incident=incidents.find(x=>x.stage===i+1),v=s.alloc?.[i];
  if(incident&&Array.isArray(v)){
   const dist=v.reduce((n,val,j)=>n+Math.abs(val-incident.ideal[j]),0);
   resources+=dist===0?2:dist<=2?1:0;
  }
 });
 return Math.max(0,quiz+rp+reflect+resources+feedback-(window.BP_SAFAR_OVERTIME?.penalty(s)||0)-(window.BP_SAFAR_GUIDE?.penalty(s)||0));
}
function quizScore(s){
 let n=0;stages.forEach((stage,i)=>{const a=s.answers?.[i]||{};if(a.q1===stage.c1)n+=4;if(a.q2?.best===stage.best)n+=2;if(a.q2?.worst===stage.worst)n+=2});return n;
}
function tier(value,quiz=80){return value>=90&&quiz>=72?"gold":value>=75&&quiz>=60?"silver":value>=60&&quiz>=44?"bronze":null}
function details(s,total){
 return{name:(s.name||"").trim()||"شرکت‌کننده به‌پرور",
 score:total,role:s.role,date:new Intl.DateTimeFormat("fa-IR",{year:"numeric",month:"long",day:"numeric"}).format(new Date(s.finishedAt||Date.now()))};
}
const rules={
 bronze:{total:60,quiz:44},silver:{total:75,quiz:60},gold:{total:90,quiz:72}
};
function medalCards(s){
 const current=s?score(s):0,quiz=s?quizScore(s):0;
 return '<div class="sf-medal-gallery-grid" aria-label="نشان‌های قابل دریافت">'+types.map(type=>{
  const p=D.palettes[type],r=rules[type],ok=s?.finished&&current>=r.total&&quiz>=r.quiz;
  const progressing=s?.startedAt&&!s.finished&&current>0;
  const status=ok?"کسب شده":progressing?"در حال پیشرفت":"قفل";
  const state=ok?"earned":progressing?"ongoing":"locked";
  return '<article class="sf-medal-mini '+type+' '+state+'" aria-label="نشان '+p.name+'، '+status+'">'+
   '<div class="sf-medal-art">'+D.seal(type,{preview:true})+'</div>'+
   '<div class="sf-medal-caption"><strong>نشان '+p.name+'</strong><span class="sf-medal-state '+state+'">'+status+'</span></div>'+
   '<details class="sf-medal-rule"><summary>شرایط کسب نشان</summary>'+
   '<div class="sf-medal-rule-content"><p><b>'+fa(r.total)+'</b> امتیاز از ۱۰۰ امتیاز کل</p>'+
   '<p><b>'+fa(r.quiz)+'</b> امتیاز از ۸۰ امتیاز آزمون</p>'+
   '<p>پایان سفر ۱۰مرحله‌ای</p></div></details>'+
   '</article>';
 }).join("")+'</div>';
}
function gallery(){
 if(root.querySelector("#sfMedalGallery"))return;
 const stat=root.querySelector(".introgrid");if(!stat)return;
 const item=document.createElement("details");item.id="sfMedalGallery";item.className="sf-medal-gallery";
 item.innerHTML='<summary>نشان‌های پایان سفر</summary>'+medalCards(getState());
 stat.insertAdjacentElement("afterend",item);
}
function finalGallery(s){
 if(root.querySelector("#sfFinalMedalGallery"))return;
 const featured=root.querySelector("#sfMedalFeature");
 if(!featured)return;
 const item=document.createElement("section");item.id="sfFinalMedalGallery";item.className="sf-medal-gallery sf-final-gallery";
 item.innerHTML='<h3>نشان‌ها و شرایط دریافت</h3>'+medalCards(s);
 featured.insertAdjacentElement("afterend",item);
}
function download(blob,name){
 const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;
 document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);
}
async function canvasFrom(svg){
 if(document.fonts?.ready)try{await document.fonts.ready}catch(e){}
 // Raster output draws the logo separately: nested data-URI images inside an SVG can break canvas export on some mobile browsers.
 const rasterSvg=svg.replace(/<image\b[^>]*\/>/g,"");
 const link=URL.createObjectURL(new Blob([rasterSvg],{type:"image/svg+xml;charset=utf-8"}));
 const image=new Image();
 try{
  await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(new Error("SVG rendering failed"));image.src=link});
  const c=document.createElement("canvas");c.width=1800;c.height=2360;
  const ctx=c.getContext("2d");if(!ctx)throw Error("Canvas unavailable");
  ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality="high";
  ctx.fillStyle="#f5f9fc";ctx.fillRect(0,0,c.width,c.height);
  ctx.drawImage(image,0,0,1800,2360);
  const original=document.querySelector("#brandlogo");
  if(original && !original.complete){try{await original.decode()}catch(e){}}
  if(original?.complete&&original.naturalWidth){
    ctx.fillStyle="#f5fafc";ctx.fillRect(590,107,620,176);
    ctx.drawImage(original,618,130,564,148);
  }
  return c;
 }finally{URL.revokeObjectURL(link)}
}
function pdfFromJpeg(jpeg,w,h){
 const enc=new TextEncoder(),parts=[];let size=0;
 const offsets=[0];
 const put=b=>{parts.push(b);size+=b.length};
 const txt=s=>put(enc.encode(s));
 const obj=(num,fn)=>{offsets[num]=size;txt(num+" 0 obj\n");fn();txt("\nendobj\n")};
 txt("%PDF-1.4\n");
 obj(1,()=>txt("<< /Type /Catalog /Pages 2 0 R >>"));
 obj(2,()=>txt("<< /Type /Pages /Count 1 /Kids [3 0 R] >>"));
 obj(3,()=>txt("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /XObject << /Im1 4 0 R >> >> /Contents 5 0 R >>"));
 obj(4,()=>{
  txt("<< /Type /XObject /Subtype /Image /Width "+w+" /Height "+h+" /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length "+jpeg.length+" >>\nstream\n");
  put(jpeg);txt("\nendstream");
 });
 const command="q\n512 0 0 671.3 41.5 85.35 cm\n/Im1 Do\nQ\n";
 obj(5,()=>txt("<< /Length "+enc.encode(command).length+" >>\nstream\n"+command+"endstream"));
 const xref=size;
 txt("xref\n0 6\n0000000000 65535 f \n");
 for(let i=1;i<=5;i++)txt(String(offsets[i]).padStart(10,"0")+" 00000 n \n");
 txt("trailer\n<< /Root 1 0 R /Size 6 >>\nstartxref\n"+xref+"\n%%EOF\n");
 return new Blob(parts,{type:"application/pdf"});
}
async function exportSeal(kind,format,opts){
 const svg=D.seal(kind,opts),stem="Behparvar-Safar-Ertebatat-"+kind+"-"+opts.score;
 if(format==="svg"){download(new Blob([svg],{type:"image/svg+xml;charset=utf-8"}),stem+".svg");return}
 const canvas=await canvasFrom(svg);
 if(format==="png"){
  const blob=await new Promise(resolve=>canvas.toBlob(resolve,"image/png"));
  if(!blob)throw Error("PNG conversion failed");
  download(blob,stem+".png");return;
 }
 if(format==="pdf"){
  const encoded=canvas.toDataURL("image/jpeg",.94).split(",")[1];
  const raw=atob(encoded),binary=Uint8Array.from(raw,c=>c.charCodeAt(0));
  download(pdfFromJpeg(binary,canvas.width,canvas.height),stem+".pdf");
 }
}
function resultPage(s){
 if(root.querySelector("#sfMedalFeature"))return;
 const hero=root.querySelector(".result-hero");if(!hero)return;
 const points=score(s),qpoints=quizScore(s),kind=tier(points,qpoints),section=document.createElement("section");
 hero.classList.add("sf-medal-result-hero");
 section.id="sfMedalFeature";section.className="sf-medal-feature";
 if(!kind){
   section.innerHTML='<h2>نشان پایان سفر</h2><p>امتیاز ثبت شد؛ این بار نشان دریافت نشد.</p>'+
   '<details class="sf-medal-criteria"><summary>شرایط دریافت نشان‌ها</summary>'+
   '<p>برای دیدن شرایط دقیق هر نشان، کارت‌های پایین را باز کن.</p></details>';
 }else{
  const p=D.palettes[kind];
  section.innerHTML='<h2>نشان '+p.name+'</h2>'+
  '<div class="sf-medal-feature-preview">'+D.seal(kind,details(s,points))+'</div>'+
  '<div class="sf-medal-feature-actions"><button type="button" data-sf-export="png">دریافت تصویر</button>'+
  '<button type="button" class="sf-medal-pdf" data-sf-export="pdf">دریافت PDF</button>'+
  '<button type="button" class="sf-medal-svg" data-sf-export="svg">دریافت SVG</button></div>';
  section.addEventListener("click",async ev=>{
   const b=ev.target.closest("button[data-sf-export]");if(!b||b.disabled)return;
   const format=b.dataset.sfExport,caption=b.textContent;
   b.disabled=true;b.textContent="در حال آماده‌سازی فایل…";
   try{await exportSeal(kind,format,details(s,points))}
   catch(e){console.error(e);alert("ساخت خروجی نشان با مشکل روبه‌رو شد. لطفاً دوباره امتحان کن.")}
   finally{b.disabled=false;b.textContent=caption}
  });
 }
 hero.insertAdjacentElement("afterend",section);
}
let scheduled=false;
function refresh(){
 const s=getState();
 if(!s||!s.startedAt){gallery();return}
 if(s.finished){resultPage(s);finalGallery(s)}
}
const watch=new MutationObserver(()=>{
 if(scheduled)return;
 scheduled=true;
 requestAnimationFrame(()=>{scheduled=false;refresh()});
});
watch.observe(root,{childList:true,subtree:false});
refresh();
window.BP_SAFAR_MEDALS={tier,score,quizScore,exportSeal,pdfFromJpeg};
})();
