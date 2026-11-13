/* Behparvar Safar — explicit, voluntary paid time extensions.
 * All state is browser-local; this is learning gamification, not tamper-proof grading.
 */
(()=>{"use strict";
const BASE_MS=60*60000,MAX_REQUEST_MINUTES=60,BLOCK_MINUTES=5,POINTS_PER_BLOCK=2;
const KEY="bp-communication-journey-v3";
let live=null,overlay=null;
const fa=n=>Number(n||0).toLocaleString("fa-IR");
function grants(s){return Array.isArray(s?.overtime?.grants)?s.overtime.grants:[];}
function spentMinutes(s){return grants(s).reduce((sum,g)=>sum+(Number.isInteger(g.minutes)&&g.minutes>0?g.minutes:0),0);}
function penalty(s){return Math.min(100,grants(s).reduce((sum,g)=>sum+(Number.isInteger(g.penalty)&&g.penalty>0?g.penalty:0),0));}
function remainingMs(s){if(!s?.startedAt)return BASE_MS;const p=s.pause||{},cap=300000,spent=Math.max(0,Math.min(cap,Number(p.spentMs)||0)),active=p.since?Math.max(0,Math.min(cap-spent,Date.now()-p.since)):0;return BASE_MS+spentMinutes(s)*60000+(Number(s.overtime?.pauseMs)||0)+spent+active-(Date.now()-s.startedAt);}
function expired(s){return !!s?.startedAt&&!s.finished&&remainingMs(s)<=0;}
function cleanInput(value){return Number(String(value??"").replace(/[۰-۹]/g,c=>String(c.charCodeAt(0)-1776)).replace(/[٠-٩]/g,c=>String(c.charCodeAt(0)-1632)));}
function price(minutes){return Number.isInteger(minutes)&&minutes>=1&&minutes<=MAX_REQUEST_MINUTES?Math.ceil(minutes/BLOCK_MINUTES)*POINTS_PER_BLOCK:null;}
function hide(){
 if(overlay){overlay.remove();overlay=null;}
 const shell=document.querySelector(".shell");if(shell)shell.inert=false;
 document.body.classList.remove("sf-overtime-locked");
}
function preview(){
 if(!overlay)return;
 const inp=overlay.querySelector("#sfOvertimeMinutes"),details=overlay.querySelector("#sfOvertimePreview"),button=overlay.querySelector("#sfOvertimeConfirm");
 const minutes=cleanInput(inp.value),cost=price(minutes),sum=penalty(live);
 if(cost===null){
  details.textContent="تعداد دقیقه باید عدد صحیح بین ۱ تا ۶۰ باشد.";
  details.classList.add("invalid");button.disabled=true;return;
 }
 details.classList.remove("invalid");button.disabled=false;
 details.innerHTML='<strong>'+fa(minutes)+' دقیقه وقت اضافه</strong><span>کسر این درخواست: '+fa(cost)+' امتیاز از ۱۰۰ ('+fa(cost)+'٪)</span><span>مجموع کسر با احتساب تمدیدهای قبلی: '+fa(Math.min(100,sum+cost))+' امتیاز</span>';
}
function show(s){
 if(overlay)return;
 const div=document.createElement("div");div.id="sfOvertimeOverlay";div.className="sf-overtime-overlay";div.setAttribute("role","presentation");
 div.innerHTML='<section class="sf-overtime-dialog" role="dialog" aria-modal="true" aria-labelledby="sfOvertimeTitle" aria-describedby="sfOvertimeDescription" dir="rtl">'+
 '<div class="sf-overtime-symbol" aria-hidden="true">⏳</div><p class="sf-overtime-kicker">ایستگاه تصمیم‌گیری</p>'+
 '<h2 id="sfOvertimeTitle">۶۰ دقیقه تمام شد؛ سفر هنوز ادامه دارد</h2>'+
 '<p id="sfOvertimeDescription">می‌توانی برای تکمیل مأموریت وقت اضافه بگیری. تصمیم با توست؛ پیش از تأیید، کسر امتیاز را می‌بینی.</p>'+
 '<div class="sf-overtime-rule"><b>قانون وقت اضافه</b><span>هر ۵ دقیقه یا بخشی از آن = ۲ امتیاز کسر از ۱۰۰ (۲٪). حداکثر ۶۰ دقیقه در هر درخواست.</span></div>'+
 '<form id="sfOvertimeForm"><label for="sfOvertimeMinutes">چند دقیقه دیگر نیاز داری؟</label>'+
 '<div class="sf-overtime-inputline"><input id="sfOvertimeMinutes" type="number" inputmode="numeric" min="1" max="60" step="1" value="5" required><span>دقیقه</span></div>'+
 '<div class="sf-overtime-preview" id="sfOvertimePreview" aria-live="polite"></div>'+
 '<button type="submit" class="sf-overtime-confirm" id="sfOvertimeConfirm">تأیید کسر امتیاز و ادامه مأموریت</button></form>'+
 '<p class="sf-overtime-foot">امتیاز هر مرحله طبق روال نمایش داده می‌شود؛ کسر نهایی در مجموع سفر و نشان پایان مأموریت لحاظ خواهد شد.</p></section>';
 document.body.appendChild(div);overlay=div;
 document.querySelector(".shell")?.setAttribute("inert","");
 document.body.classList.add("sf-overtime-locked");
 div.addEventListener("input",e=>{if(e.target.id==="sfOvertimeMinutes")preview();});
 div.querySelector("#sfOvertimeForm").addEventListener("submit",e=>{
  e.preventDefault();
  if(!live||!expired(live))return;
  const minutes=cleanInput(div.querySelector("#sfOvertimeMinutes").value),cost=price(minutes);
  if(cost===null){preview();return;}
  const oldDeadline=live.startedAt+BASE_MS+spentMinutes(live)*60000+(Number(live.overtime?.pauseMs)||0);
  const now=Date.now(),prior=live.overtime&&typeof live.overtime==="object"?live.overtime:{};
  const next={pauseMs:(Number(prior.pauseMs)||0)+Math.max(0,now-oldDeadline),
   grants:[...grants(live),{minutes,penalty:cost,grantedAt:now}]};
  // Persist before reopening the UI; the learner keeps all saved answers and the same stage.
  const old=live.overtime;live.overtime=next;
  try{localStorage.setItem(KEY,JSON.stringify(live));}
  catch(err){live.overtime=old;alert("ثبت وقت اضافه در مرورگر انجام نشد. فضای ذخیره‌سازی را بررسی کن.");return;}
  hide();
  window.dispatchEvent(new CustomEvent("bp-safar-time-extended",{detail:{minutes,penalty:cost,totalPenalty:penalty(live)}}));
  const notice=document.createElement("div");notice.className="sf-overtime-toast";notice.setAttribute("role","status");
  notice.textContent=fa(minutes)+" دقیقه به زمان سفر اضافه شد؛ "+fa(cost)+" امتیاز کسر ثبت شد. ادامه بده!";
  document.body.appendChild(notice);
  setTimeout(()=>notice.remove(),6000);
 });
 preview();
 div.querySelector("#sfOvertimeMinutes").focus();
}
function sync(s){
 live=s;
 const clock=document.getElementById("clock");
 if(clock){clock.classList.toggle("sf-overtime-active",spentMinutes(s)>0&&!!s?.startedAt&&!s.finished);clock.classList.toggle("sf-overtime-ended",expired(s));}
 if(s?.mode==="study"||!s?.startedAt||s.finished){hide();return;}
 if(expired(s))show(s);else hide();
}
window.BP_SAFAR_OVERTIME={remainingMs,expired,penalty,spentMinutes,price,sync};
})();