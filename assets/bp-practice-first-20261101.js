/* Behparvar — practice-first learning layer.
 * Additive only: six existing session entries, 42 lesson routes and legacy records are not changed. */
(function (global) {
"use strict";
var D=global.BPPracticeData;
if(!D||!Array.isArray(D.sessions)||D.sessions.length!==6||D.conversations.length!==12)throw Error("Practice-first teaching data unavailable");
var WORDS=["اول","دوم","سوم","چهارم","پنجم","ششم"];
var TITLES=["شناخت نقش مدیریتی و سرپرستی","آشنایی با مدل شایستگی‌های مدیریتی","شایستگی‌های معطوف به خود","ارتباطات و مدیریت تعارض","تفویض اختیار، توانمندسازی و توسعه دیگران","مدیریت نتایج کسب‌وکار و بهبود مستمر"];
var THEMES=[
 ["نقش روشن","حدود اختیار","بازبینی مسئولانه"],
 ["خودم","دیگران","نتایج کسب‌وکار"],
 ["مسئله و داده","گزینه و ریسک","تصمیم در حد اختیار"],
 ["شنیدن دیدگاه","منافع مشترک","توافق قابل پیگیری"],
 ["نتیجه و مسئولیت","اختیار و منابع","بازخورد و پاسخ‌گویی"],
 ["هدف و مقدار واقعی","علت انحراف","اقدام آزمایشی و بازبینی"]
];
var AVAILABLE={1:["self"],2:[],3:["self","problem","judgment"],4:["communication","conflict"],5:["delegation","coaching"],6:["planning","coordination","performance","business","change"]};
function esc(v){return String(v==null?"":v).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function fa(v){return String(v).replace(/[0-9]/g,function(c){return "۰۱۲۳۴۵۶۷۸۹"[Number(c)]})}
function role(){
 var fromUrl=new URLSearchParams(location.search).get("audience");
 if(fromUrl==="supervisors"||fromUrl==="managers")return fromUrl;
 try{var old=JSON.parse(localStorage.getItem("behparvar_session1_v4")||"{}");if(old.audience==="supervisors"||old.audience==="managers")return old.audience}catch(e){}
 try{var state=JSON.parse(localStorage.getItem("behparvar_app_v1")||"{}");if(state.role==="supervisors"||state.role==="managers")return state.role}catch(e){}
 return null;
}
function roleName(v){return v==="managers"?"مدیران":"سرپرستان"}
function key(kind,n,r){return "bp_practice_"+kind+"_v1_"+r+"_session"+n}
function read(kind,n,r){try{var obj=JSON.parse(localStorage.getItem(key(kind,n,r))||"{}");return obj&&typeof obj==="object"&&!Array.isArray(obj)?obj:{}}catch(e){return {}}}
function save(kind,n,r,obj){try{localStorage.setItem(key(kind,n,r),JSON.stringify(obj));return true}catch(e){return false}}
function entry(n){return document.getElementById(n===1?"home":"session"+n)}
function holder(n){return document.getElementById("bp-practice-"+n)}
function announce(n,msg){var e=holder(n)&&holder(n).querySelector("[data-bp-save-status]");if(e)e.textContent=msg||""}
function button(n,name,label){return '<button type="button" data-bp-practice-tab="'+n+":"+name+'" aria-controls="bp-practice-stage-'+n+'" aria-pressed="false">'+label+'</button>'}
function initLanding(){
 D.sessions.forEach(function(s){
  var n=s.n,page=entry(n);if(n===2)return; // Session two uses the canonical competency model, dialogue and observer lab, never a parallel legacy workshop.
  if(!page||holder(n))return;
  var host=document.createElement("section");
  host.className="bp-practice";host.id="bp-practice-"+n;
  host.setAttribute("aria-label","کارگاه عملی جلسه "+fa(n));
  host.innerHTML='<details class="bp-practice-shell"><summary><span>🎯 کارگاه عملی جلسه '+fa(n)+'</span><small>موقعیت کاری، گفت‌وگو و اقدام در محیط کار</small></summary>'+
   '<div class="bp-practice-inner"><nav class="bp-practice-tabs" aria-label="مراحل یادگیری">'+
   button(n,"scene","📍 یک اتفاق آشنا")+button(n,"dialogue","🎭 گفت‌وگوی دونفره")+button(n,"transfer","🎯 اقدام من در محیط کار")+
   '</nav><div class="bp-practice-stage" id="bp-practice-stage-'+n+'" hidden></div><p class="bp-practice-save" data-bp-save-status role="status" aria-live="polite"></p></div></details>';
  var target=n===1?page.querySelector(".home-entry"):page.querySelector(".mml-simple-session-home");
  if(!target)target=page.querySelector(".page-heading");
  if(target)target.insertAdjacentElement("afterend",host);else page.appendChild(host);
  host.querySelector("summary").addEventListener("click",function(){
   if(!host.querySelector(".bp-practice-stage").dataset.tab)requestAnimationFrame(function(){switchTab(n,"scene")});
  });
 });
 updateTitles();
}
function updateTitles(){
 var sessionTitles={
  "2":"مدل شایستگی‌های مدیریتی","3":"شایستگی‌های معطوف به خود","4":"ارتباطات و مدیریت تعارض",
  "5":"تفویض اختیار و توسعه دیگران","6":"نتایج کسب‌وکار و بهبود مستمر"
 };
 for(var n=2;n<=6;n++){
  var el=entry(n),h=el&&el.querySelector(".mml-simple-session-home h1");
  if(h)h.textContent="جلسه "+WORDS[n-1]+"؛ "+sessionTitles[n];
 }
 document.querySelectorAll('#scenarios .bp-scenario-links a').forEach(function(a,i){
  if(i>=6)return;
  var st=a.querySelector("strong");if(st)st.textContent=fa(i+1)+" · "+TITLES[i];
 });
}
function roleMissing(n){
 return '<div class="bp-practice-info"><p>ابتدا مسیر مدیران یا سرپرستان را انتخاب کنید تا موقعیت و گفت‌وگوی متناسب با نقش شما نمایش داده شود.</p>'+
 '<a href="#'+(n===1?"home":"session"+n)+'" data-open="'+(n===1?"home":"session"+n)+'">انتخاب مسیر ←</a></div>';
}
function scene(n){
 var r=role();if(!r)return roleMissing(n);
 var s=D.sessions[n-1][r],saved=read("scene",n,r);
 var chosen=Number.isInteger(saved.choice)&&saved.choice>=0&&saved.choice<3?saved.choice:-1;
 var options=s.options.map(function(o,i){return '<button type="button" data-bp-scene-choice="'+n+":"+i+'" aria-pressed="'+(chosen===i)+'"><span>'+fa(i+1)+'</span>'+esc(o[0])+'</button>'}).join("");
 var response=chosen<0?"":'<div class="bp-practice-feedback"><h4>پیامد انتخاب شما</h4><strong>فرصت احتمالی</strong><p>'+esc(s.options[chosen][1])+'</p><strong>هزینه یا ریسک</strong><p>'+esc(s.options[chosen][2])+'</p>'+
 '<small>این یک تمرین تصمیم‌گیری است، نه آزمون تشخیصی. گزینه‌ها را با داده‌های واقعی موقعیت بسنجید.</small></div>';
 return '<div class="bp-practice-step"><span class="bp-practice-kicker">📍 یک اتفاق آشنا · '+roleName(r)+'</span><h3>'+esc(s.title)+'</h3>'+
 '<p class="bp-practice-context">'+esc(s.setting)+'</p><p><strong>افراد درگیر:</strong> '+esc(s.stakeholders)+'</p>'+
 diagram(n)+'<h4>'+esc(s.question)+'</h4><div class="bp-practice-options">'+options+'</div>'+response+
 (chosen>=0?'<button type="button" class="bp-practice-next" data-bp-practice-tab="'+n+":"+(n===2?"transfer":"dialogue")+'">مرحله بعد ←</button>':"")+'</div>';
}
function diagram(n){
 return '<div class="bp-practice-flow" role="group" aria-label="مراحل تصمیم">'+THEMES[n-1].map(function(x,i){
  return '<span><b>'+fa(i+1)+'</b><strong>'+esc(x)+'</strong></span>';
 }).join('<i aria-hidden="true">←</i>')+'</div>';
}
function weakLine(arr,actors){
 return arr.map(function(line,i){return '<p class="bp-speech"><strong>'+esc(actors[i%2])+':</strong> «'+esc(line)+'»</p>'}).join("");
}
function dialogue(n,selected){
 var r=role();if(!r)return roleMissing(n);
 var ids=AVAILABLE[n];
 if(!ids.length)return '<div class="bp-practice-info"><h3>آشنایی با مدل</h3><p>گفت‌وگوهای اختصاصی هر شایستگی در جلسات سوم تا ششم قرار دارند. در جلسه دوم، مدل و آزمون تشخیصی را مرور کنید.</p>'+
 '<a href="#bp-c-lesson" data-open="bp-c-lesson">مشاهده مدل شایستگی ←</a></div>';
 var current=ids.includes(selected)?selected:ids[0];
 var c=D.conversations.find(function(x){return x.id===current});
 var d=c[r],actors=d.actors;
 var buttons=ids.map(function(id){var s=D.conversations.find(function(x){return x.id===id});return '<button type="button" data-bp-dialogue-id="'+id+'" aria-pressed="'+(id===current)+'">'+esc(s.name)+'</button>'}).join("");
 return '<div class="bp-practice-step"><span class="bp-practice-kicker">🎭 گفت‌وگوی دونفره · '+roleName(r)+'</span>'+
 '<h3>یک شایستگی انتخاب کنید</h3><div class="bp-practice-skills">'+buttons+'</div>'+
 '<div class="bp-practice-drama"><h4>'+esc(c.name)+'</h4><p><strong>موقعیت:</strong> '+esc(d.setting)+'</p>'+
 '<div class="bp-practice-weak"><h4>گفت‌وگوی اولیه</h4>'+weakLine(d.weak,actors)+'</div>'+
 '<details><summary>رفتارها و پیامدها را تحلیل کنید</summary><p>در گفت‌وگوی اول، کدام فرض یا رفتار بررسی نشده است؟ چه اثری بر اعتماد، مسئولیت‌پذیری و تصمیم بعدی می‌گذارد؟</p><p><strong>محور مشاهده:</strong> '+esc(c.focus)+'</p></details>'+
 '<details><summary>گفت‌وگوی بهبودیافته را ببینید</summary><div class="bp-practice-better">'+weakLine(d.better,actors)+'</div></details>'+
 '<details><summary>نوبت شماست · راهنمای اجرای ۳ تا ۵ دقیقه‌ای</summary>'+
 '<ol><li>دو نفر نقش «'+esc(actors[0])+'» و «'+esc(actors[1])+'» را بگیرند. هر نفر دغدغه خود را بدون پیش‌فرض قطعی بیان کند.</li>'+
 '<li>ابتدا مکالمه اولیه را اجرا و سپس با جمله‌های بهتر دوباره شروع کنید. هر نفر دست‌کم یک پرسش روشن‌کننده بپرسد.</li>'+
 '<li>لحن آرام و محکم، بدن باز، نگاه محترمانه و مکث پیش از پاسخ رعایت شود. اختلاف واقعی پنهان نشود.</li>'+
 '<li>در پایان، اقدام، مسئول و زمان مرور را مشخص و از طرف مقابل بخواهید توافق را بازگو کند.</li></ol>'+
 '<p><strong>چک‌لیست مشاهده‌گر:</strong> '+esc(c.observe)+'</p></details></div>'+
 '<button type="button" class="bp-practice-next" data-bp-practice-tab="'+n+':transfer">ثبت اقدام من ←</button></div>';
}
function transfer(n){
 var r=role();if(!r)return roleMissing(n);
 var v=read("action",n,r),names=[
  ["behavior","کدام رفتار مدیریتی را بهتر می‌کنم؟","یک رفتار مشخص"],
  ["opportunity","اولین فرصت اجرای آن چه زمانی است؟","مثلاً تحویل شیفت فردا"],
  ["result","بعد از اجرا چه اتفاقی افتاد؟","پس از اجرا تکمیل کنید"],
  ["next","نوبت بعد چه چیزی را متفاوت انجام می‌دهم؟","یک اصلاح کوچک"]
 ];
 return '<div class="bp-practice-step"><span class="bp-practice-kicker">🎯 اقدام من در محیط کار · '+roleName(r)+'</span>'+
 '<h3>یک تغییر کوچک و قابل اجرا</h3><div class="bp-practice-action">'+names.map(function(row){
  return '<label>'+row[1]+'<textarea rows="2" maxlength="450" data-bp-practice-note="'+n+":"+row[0]+'" placeholder="'+esc(row[2])+'">'+esc(v[row[0]]||"")+'</textarea></label>';
 }).join("")+'</div><p class="bp-practice-footnote">این یادداشت فقط در همین مرورگر و برای این مسیر ذخیره می‌شود؛ به معنی ارزیابی عملکرد یا تأیید مهارت نیست.</p></div>';
}
function switchTab(n,tab,selected){
 var h=holder(n);if(!h)return;
 var stage=h.querySelector(".bp-practice-stage");if(!stage)return;
 stage.dataset.tab=tab;stage.hidden=false;
 stage.innerHTML=tab==="scene"?scene(n):tab==="dialogue"?dialogue(n,selected):transfer(n);
 h.querySelectorAll("[data-bp-practice-tab]").forEach(function(b){b.setAttribute("aria-pressed",String(b.getAttribute("data-bp-practice-tab")===n+":"+tab))});
 if(tab==="dialogue"||tab==="scene")announce(n,"");
}
function init(){
 initLanding();
 document.addEventListener("click",function(ev){
  var tab=ev.target.closest("[data-bp-practice-tab]");
  if(tab&&tab.closest(".bp-practice")){
   var parts=tab.getAttribute("data-bp-practice-tab").split(":");
   switchTab(Number(parts[0]),parts[1]);return;
  }
  var option=ev.target.closest("[data-bp-scene-choice]");
  if(option&&option.closest(".bp-practice")){
   var z=option.dataset.bpSceneChoice.split(":").map(Number),r=role();if(!r)return;
   var ok=save("scene",z[0],r,{choice:z[1]});
   switchTab(z[0],"scene");
   announce(z[0],ok?"انتخاب شما در این دستگاه ثبت شد.":"ذخیره در این مرورگر در دسترس نیست.");
   return;
  }
  var s=ev.target.closest("[data-bp-dialogue-id]");
  if(s&&s.closest(".bp-practice")){
   var box=s.closest(".bp-practice"),n=Number(box.id.replace("bp-practice-",""));
   switchTab(n,"dialogue",s.dataset.bpDialogueId);
  }
 });
 document.addEventListener("input",function(ev){
  var el=ev.target.closest("[data-bp-practice-note]");if(!el||!el.closest(".bp-practice"))return;
  var parts=el.dataset.bpPracticeNote.split(":"),n=Number(parts[0]),field=parts[1],r=role();if(!r)return;
  var record=read("action",n,r);record[field]=el.value.slice(0,450);
  var ok=save("action",n,r,record);
  announce(n,ok?"✓ ذخیره شد":"ذخیره مرورگر در دسترس نیست؛ متن را کپی کنید.");
 });
 window.addEventListener("pageshow",updateTitles);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
global.BPPracticeLayer={role:role,topics:TITLES,dialogues:D.conversations.length};
})(window);
