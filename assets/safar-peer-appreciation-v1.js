/* Session 4 — optional peer appreciation, with private rating and no backend.
 * Sender records voluntary link share; received only on opening link on recipient device.
 * The private 1–5 peer rating is NEVER included in the link or appreciation ledger.
 */
(()=>{"use strict";
const root=document.getElementById("root");
if(!root)return;
const STATE="bp-communication-journey-v3",KEY="bp-safar-appreciation-v1";
const phrases=[
 "از اینکه حرفم را تا پایان شنیدی، ممنونم.",
 "از پرسش روشن و تلاش برای پیدا کردن توافق، قدردانم.",
 "از گفت‌وگوی محترمانه و بدون قضاوت تو ممنونم."
];
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fa=n=>Number(n||0).toLocaleString("fa-IR");
const read=k=>{try{return JSON.parse(localStorage.getItem(k)||"null")}catch(e){return null}};
const save=(k,val)=>{try{localStorage.setItem(k,JSON.stringify(val));return true}catch(e){return false}};
const state=()=>{const s=read(STATE);return s?.version===3?s:null};
const book=()=>{const b=read(KEY);return b?.version===1&&Array.isArray(b.sent)&&Array.isArray(b.received)?b:{version:1,sent:[],received:[]}};
const makeId=()=>crypto?.randomUUID?.()||"bp-"+Date.now()+"-"+Math.random().toString(36).slice(2);
function token(obj){
 const buf=new TextEncoder().encode(JSON.stringify(obj));
 let str="";for(const v of buf)str+=String.fromCharCode(v);
 return btoa(str).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
function decode(value){
 if(!value||value.length>1600)return null;
 try{
  const b64=value.replace(/-/g,"+").replace(/_/g,"/"),raw=atob(b64.padEnd(Math.ceil(b64.length/4)*4,"="));
  const obj=JSON.parse(new TextDecoder("utf-8",{fatal:true}).decode(Uint8Array.from(raw,c=>c.charCodeAt(0))));
  if(obj?.version!==1||!/^[a-zA-Z0-9_-]{8,100}$/.test(obj.id||"")||
   !phrases.includes(obj.message)||typeof obj.from!=="string"||obj.from.length>70)return null;
  return{id:obj.id,from:obj.from,message:obj.message};
 }catch(e){return null}
}
function receive(){
 const url=new URL(location.href),payload=url.searchParams.get("bpAppreciation");
 if(!payload)return;
 url.searchParams.delete("bpAppreciation");
 history.replaceState(history.state,"",url.pathname+url.search+url.hash);
 const item=decode(payload);if(!item)return;
 const b=book(),seen=b.received.some(x=>x.id===item.id);
 if(!seen){b.received.push({...item,at:Date.now()});b.received=b.received.slice(-150);save(KEY,b)}
 const modal=document.createElement("div");modal.className="sf-reception-modal";modal.id="sfReceptionModal";
 modal.setAttribute("role","dialog");modal.setAttribute("aria-label","پیام قدردانی");
 modal.innerHTML='<div class="sf-reception-card"><div class="sf-reception-diamond">✦</div>'+
 '<h2>'+(seen?"این قدردانی قبلاً ثبت شده":"از تو قدردانی شده است")+'</h2>'+
 '<p>'+esc(item.message)+'</p>'+
 '<small>از طرف '+esc(item.from||"همکار")+' · این پیام هیچ نمره محرمانه‌ای ندارد.</small>'+
 '<button type="button" id="sfReceptionClose">متوجه شدم</button></div>';
 document.body.append(modal);
 modal.querySelector("button").addEventListener("click",()=>modal.remove(),{once:true});
}
function counts(s){
 const b=book(),start=Number(s?.startedAt)||0,end=Number(s?.finishedAt)||Infinity;
 return {sent:b.sent.filter(x=>start>0&&x.journey===start).length,
 received:b.received.filter(x=>start>0&&x.at>=start&&x.at<=end).length};
}
function countsUI(s){
 const c=counts(s);
 return '<div class="sf-peer-counts"><div><strong>'+fa(c.sent)+'</strong><span>قدردانی کرده‌ام</span></div>'+
 '<div><strong>'+fa(c.received)+'</strong><span>قدردانی دریافت کرده‌ام</span></div></div>'+
 '<p class="sf-peer-count-note">قدردانی‌کردن بر اساس اشتراک یا کپی لینک در همین گوشی ثبت می‌شود. دریافت فقط پس از بازکردن لینک در گوشی همکار شمرده می‌شود؛ هر دو شمارنده محلی‌اند.</p>';
}
function report(s){
 if(!s.finished||!root.querySelector(".result-hero"))return;
 let el=root.querySelector("#sfPeerRecognitionResult");
 if(!el){el=document.createElement("section");el.id="sfPeerRecognitionResult";el.className="sf-peer-report";
 root.querySelector(".result-hero").insertAdjacentElement("afterend",el)}
 el.innerHTML='<h2>قدردانی در این سفر</h2>'+countsUI(s);
}
function makePanel(s){
 const head=root.querySelector("#sfWizardHead");
 if(!head||head.dataset.phase!=="role")return;
 const card=root.querySelector("#sf-practice")||root.querySelector(".charrow")?.closest(".card");
 if(!card||card.querySelector("#sfPeerThanks"))return;
 const completed=!!s.rp?.[s.stage],already=book().sent.some(x=>x.journey===s.startedAt&&x.stage===s.stage);
 const panel=document.createElement("details");panel.id="sfPeerThanks";panel.className="sf-peer-thanks";
 panel.innerHTML='<summary>قدردانی اختیاری از همکار</summary><div class="sf-thanks-inner">'+
 '<p>اگر رفتار ارزشمندی دیدی، یک جمله قدردانی برای همکارت بفرست. می‌توانی از این بخش عبور کنی؛ هیچ امتیازی به قدردانی تعلق نمی‌گیرد.</p>'+
 (already?'<div class="sf-thanks-sent">✓ قدردانی این مرحله ثبت شد.</div>':
 '<div class="sf-thanks-choices">'+phrases.map((t,i)=>
 '<label><input type="radio" name="sfThanksChoice" value="'+i+'" '+(i===0?"checked":"")+'><span>'+esc(t)+'</span></label>').join("")+'</div>'+
 '<div class="sf-thanks-buttons"><button type="button" class="btn" id="sfShareThanks" '+(!completed?"disabled":"")+'>اشتراک قدردانی</button>'+
 '<button type="button" class="btn alt" id="sfSkipThanks">رد می‌کنم</button></div>')+
 '<small>'+(completed?"نمره ۱ تا ۵ همکار به هیچ‌کس فرستاده نمی‌شود.":"ابتدا ارزیابی محرمانه را ثبت کن؛ سپس در صورت تمایل تشکر بفرست.")+'</small></div>';
 card.append(panel);
}
function refresh(){const s=state();if(!s?.startedAt)return;makePanel(s);report(s)}
async function share(){
 const s=state(),panel=document.querySelector("#sfPeerThanks");
 if(!s?.startedAt||s.finished||!s.rp?.[s.stage]||!panel)return;
 const b=book();if(b.sent.some(x=>x.journey===s.startedAt&&x.stage===s.stage))return;
 const which=Number(panel.querySelector('input[name="sfThanksChoice"]:checked')?.value||0);
 const item={version:1,id:makeId(),message:phrases[which],from:String(s.name||"همکارت").slice(0,70)};
 const url=new URL(location.href);
 url.searchParams.delete("bpAppreciation");url.searchParams.set("bpAppreciation",token(item));url.hash="";
 const btn=panel.querySelector("#sfShareThanks");btn.disabled=true;
 let ok=false;
 try{
  if(typeof navigator.share==="function"){
   await navigator.share({title:"یک قدردانی از همکار",text:item.message,url:url.href});ok=true;
  }else if(navigator.clipboard?.writeText){
   await navigator.clipboard.writeText(url.href);ok=true;
   alert("لینک قدردانی کپی شد. آن را برای همکارت ارسال کن؛ دریافت وقتی شمرده می‌شود که لینک در گوشی او باز شود.");
  }else{
   const input=document.createElement("input");input.readOnly=true;input.value=url.href;input.className="sf-thanks-copy";
   panel.querySelector(".sf-thanks-inner").append(input);input.focus();input.select();
   alert("لینک قدردانی در کادر نمایش داده شد؛ آن را کپی و برای همکارت بفرست.");
  }
 }catch(e){if(e?.name!=="AbortError")alert("اشتراک انجام نشد. دوباره تلاش کن.")}
 if(ok){
  b.sent.push({id:item.id,journey:s.startedAt,stage:s.stage,at:Date.now()});b.sent=b.sent.slice(-150);
  if(!save(KEY,b))alert("ثبت شمارنده قدردانی در این گوشی ناموفق بود.");
  panel.open=false;refresh();
 }else btn.disabled=false;
}
let pending=false;
new MutationObserver(()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;refresh()})}).observe(root,{childList:true,subtree:false});
document.addEventListener("click",e=>{
 if(e.target.closest("#sfShareThanks")){e.preventDefault();share()}
 if(e.target.closest("#sfSkipThanks")){e.preventDefault();document.getElementById("sfPeerThanks").open=false}
});
receive();refresh();
window.BP_SAFAR_PEER_APPRECIATION={counts,decode};
})();