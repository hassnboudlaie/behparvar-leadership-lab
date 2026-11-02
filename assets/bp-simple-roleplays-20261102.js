/* به‌پرور: گفت‌وگوهای مهارت‌محور، بدون زنجیره مراحل قفل‌شونده */
(function(g){"use strict";
const C=[...(g.BPS2PairCases||[]),...(g.BPS2GroupCases||[])],D=g.BPCompetencyData,HOST="bp-c-clinic-2";
if(!D||C.length!==4)return;
const roleName={supervisors:"سرپرستان",managers:"مدیران"};
const reflections={
"pair-signal":{
 intro:"یک اختلاف واقعی‌نما درباره کیفیت و تعهد تحویل؛ هدف، روشن‌شدن وضعیت بدون مقصرسازی است.",
 skill:"مکث پیش از قضاوت، گوش‌دادن به محدودیت طرف مقابل، جداکردن وضعیت واقعی از فرض، و تصمیم در حدود اختیار.",
 analysis:"گفت‌وگوی حرفه‌ای مسئله را از «چه کسی مقصر است؟» به «چه چیزی می‌دانیم و چه تصمیمی مجاز است؟» تغییر می‌دهد. کیفیت باید امکان گزارش ابهام را داشته باشد و تولید هم زمان معتبر برای برنامه‌ریزی بداند.",
 failure:"اگر دو طرف فقط از واحد خود دفاع کنند، اختلاف شخصی می‌شود و احتمال خروج بدون مجوز یا وعده غیرواقعی بالا می‌رود.",
 outcome:"در پایان هر دو نفر باید بر یک وضعیت مشترک، مسئول پیگیری و ساعت اطلاع‌رسانی توافق کنند. مجوز فنی را هیچ‌کدام دور نمی‌زنند.",
 practice:"یک‌بار با لحن دفاعی و یک‌بار با سؤال باز و خلاصه‌کردن حرف مقابل اجرا کنید؛ تفاوت نتیجه را ببینید."
},
"pair-delegation":{
 intro:"مدیر یا سرپرست می‌خواهد مسئولیت را بسپارد، اما نگران خطا و کنترل کیفیت است.",
 skill:"تعریف نتیجه، روشن‌کردن حدود تصمیم و نقطه کنترل، پرسیدن نظر فرد و حمایت بدون پس‌گرفتن مسئولیت.",
 analysis:"تفویض وقتی واقعی است که فرد بداند کدام تصمیم را مستقل می‌گیرد و کجا باید توقف یا ارجاع کند. سؤال‌های مربیگرانه باید فرد را به ساختن راه‌حل برساند، نه به حدس‌زدن نظر مدیر.",
 failure:"گفتن «کار دست توست» بدون اختیار و منابع، انتقال ریسک است؛ کنترل همه جزئیات نیز استقلال فرد را از بین می‌برد.",
 outcome:"دو نفر در پایان خروجی، اختیار، یک خط قرمز فنی و زمان بازبینی را به زبان خودشان تکرار کنند.",
 practice:"در اجرای دوم، مدیر کمتر حرف بزند و طرف مقابل نحوه انجام و شاخص کنترل را پیشنهاد دهد."
},
"group-handover":{
 intro:"چهار واحد تعریف متفاوتی از «سفارش آماده تحویل» دارند و یک تصمیم مشترک لازم است.",
 skill:"گوش‌دادن میان واحدها، معیار مشترک تحویل، تصمیم مبتنی بر داده و توافق بر مسئول و موعد.",
 analysis:"رسیدن کالا به انبار با امکان خروج قانونی و فنی یکسان نیست. تسهیل جلسه باید تعریف مشترک از آماده‌بودن، مسئول هر گلوگاه و پیام واحد به مشتری ایجاد کند.",
 failure:"وقتی هر واحد فقط شاخص خودش را می‌بیند، تصمیم ظاهراً سریع می‌تواند به برگشت محموله، هزینه یا نقض استاندارد منجر شود.",
 outcome:"تیم باید سه چیز را مشخص کند: وضعیت مجاز/نامجاز هر بخش، تصمیم در محدوده اختیار، و زمان اطلاع‌رسانی مشترک.",
 practice:"یک نفر نقش تسهیلگر را بر عهده گیرد اما جای مدیران دیگر تصمیم نگیرد؛ هر نفر یک داده و یک پیشنهاد بدهد."
},
"group-capacity":{
 intro:"چهار نفر باید زیر محدودیت منابع درباره اولویت و تغییر تصمیم بگیرند.",
 skill:"صورت‌بندی مسئله، مقایسه گزینه‌ها، تفویض روشن، گرفتن بازخورد و طراحی آزمایش کم‌ریسک.",
 analysis:"به‌جای دوگانه «همه تغییرها اکنون» یا «هیچ تغییری نکنیم»، باید گزینه مرحله‌ای با معیار موفقیت، هزینه فرصت، مسئول و شرط توقف سنجیده شود.",
 failure:"پایلوت بدون شاخص و صاحب مسئولیت، فقط یک فعالیت اضافی است؛ وعده دادن بدون ظرفیت هم ریسک عملیاتی می‌سازد.",
 outcome:"توافق نهایی شامل یک اقدام محدود، یک مسئول، معیار نتیجه، تاریخ بررسی و آستانه توقف باشد.",
 practice:"برای بار دوم فرض اصلی خود را نقد کنید: چه اطلاعاتی می‌تواند انتخابتان را تغییر دهد؟"
}
};
const turnAnchors={
"pair-signal":{supervisors:{0:"self",2:"communication",3:"judgment",6:"conflict"},managers:{0:"self",2:"communication",5:"judgment",8:"conflict"}},
"pair-delegation":{supervisors:{0:"self",2:"delegation",4:"coaching",6:"performance"},managers:{0:"self",2:"delegation",4:"coaching",7:"performance"}},
"group-handover":{supervisors:{0:"conflict",3:"performance",6:"coordination",9:"judgment",10:"business"},managers:{0:"business",4:"conflict",9:"coordination",11:"performance",13:"judgment"}},
"group-capacity":{supervisors:{0:"problem",4:"planning",8:"coaching",10:"delegation",11:"change"},managers:{4:"problem",8:"delegation",9:"planning",10:"coaching",13:"change"}}
};
let chosen=null,activeRole=null;
function esc(x){return String(x==null?"":x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function fa(x){return String(x).replace(/\d/g,c=>"۰۱۲۳۴۵۶۷۸۹"[Number(c)])}
function container(){return document.querySelector("#"+HOST+" .bp-s2-root")}
function getRole(){if(activeRole)return activeRole;const q=new URLSearchParams(location.search).get("audience");if(q==="managers"||q==="supervisors")return q;try{const x=JSON.parse(localStorage.getItem("behparvar_app_v1")||"{}");if(x.role==="managers"||x.role==="supervisors")return x.role}catch(e){}return "supervisors"}
function top(){return '<div class="bp-simple-top"><a href="#welcome" data-open="welcome">⌂ خانه</a><a href="#session2" data-open="session2">جلسه دوم</a></div><header class="bp-simple-hero"><span>تمرین کاربردی در محیط کار</span><h1>🎭 گفت‌وگوهای دو‌نفره و چهار‌نفره</h1><p>هر نفر نقش خود را بخواند، گفت‌وگو را اجرا کند و بعد تحلیل را بررسی کنید.</p></header>'}
function chooser(role){return '<div class="bp-simple-rolebar" role="group" aria-label="مسیر تمرین"><span>مسیر:</span>'+["supervisors","managers"].map(r=>'<button type="button" data-simple-role="'+r+'" aria-pressed="'+(r===role)+'">'+roleName[r]+'</button>').join("")+'</div>'}
function skillNames(c){return c.skills.map(x=>D.skills.find(s=>s.id===x)).filter(Boolean).map(s=>s.name)}
function cards(role){return '<section class="bp-simple-grid" aria-label="انتخاب موقعیت">'+C.map(c=>'<button type="button" class="bp-simple-case" data-simple-case="'+esc(c.id)+'"><span>'+(c.format==="pair"?"👥 دو نفره":"🗣️ چهار نفره")+'</span><strong>'+esc(c[role].title)+'</strong><small>'+esc(reflections[c.id].intro)+'</small><b>بازکردن تمرین</b></button>').join("")+'</section>'}
function roleCards(d){return '<section class="bp-simple-section"><h2>۱. مفروضات و ویژگی‌های نقش‌ها</h2><p>هر نفر فقط نقش خودش را اجرا می‌کند؛ قرار نیست شخصیت طرف مقابل را قضاوت کنیم.</p><div class="bp-simple-roles">'+d.roles.map((r,i)=>'<article><span>نقش '+fa(i+1)+'</span><h3>'+esc(r[0])+'</h3><p><strong>وضعیت و دغدغه:</strong> '+esc(r[1])+'</p><p><strong>خط قرمز:</strong> '+esc(r[2])+'</p><p><strong>اختیار مذاکره:</strong> '+esc(r[3])+'</p></article>').join("")+'</div></section>'}
function conversation(c,d,role){
 let lines=d.improved&&d.improved.length?d.improved.map(row=>row.slice()):d.initial.map(row=>row.slice());
 if(c.id==="group-capacity"&&role==="supervisors"&&lines.length>=12){
   lines[8][1]="به‌جای اینکه من برای همه واحدها تصمیم بگیرم، از هر نفر یک پیشنهاد می‌خواهم. شما چه راه امنی برای کاهش تکرار توقف می‌بینید؟";
   lines[11][1]="جمع‌بندی چهار واحد تا ساعت چهار به مدیر می‌رسد. شیفت بعد یک تغییر کوچک در اطلاع‌رسانی را آزمایش می‌کنیم و اثرش را بر تأخیر می‌سنجیم.";
 }
 const labels=turnAnchors[c.id]&&turnAnchors[c.id][role]||{};
 const nameById=Object.fromEntries(D.skills.map(s=>[s.id,s.name]));
 return '<section class="bp-simple-section"><h2>۲. گفت‌وگوی نمونه</h2><p>نقش‌ها را با لحن طبیعی اجرا کنید. لازم نیست جمله‌ها را حفظ کنید؛ ترتیب سؤال، شنیدن، بررسی و توافق مهم است.</p><div class="bp-simple-target"><strong>🎯 شایستگی‌های هدف در این گفت‌وگو</strong><div>'+skillNames(c).map(x=>'<span>'+esc(x)+'</span>').join("")+'</div><p>'+esc(reflections[c.id].skill)+'</p></div><div class="bp-simple-dialogue">'+lines.map(([n,t],i)=>'<div class="bp-simple-line"><span class="bp-simple-speaker">'+esc(d.roles[n][0])+'</span><p>'+esc(t)+'</p>'+(labels[i]?'<small class="bp-simple-turnskill">مهارت در این جمله: '+esc(nameById[labels[i]])+'</small>':"")+'</div>').join("")+'</div><div class="bp-simple-nobias"><strong>نوبت شماست:</strong> بدون نگاه‌کردن به متن، همین موقعیت را یک‌بار دیگر اجرا کنید. '+esc(reflections[c.id].practice)+'</div></section>';
}
function analysis(c,d){const a=reflections[c.id];return '<section class="bp-simple-section bp-simple-analysis"><h2>۳. تحلیل گفت‌وگو و بازخورد</h2><div class="bp-simple-insights"><article><h3>✅ چه چیزی حرفه‌ای بود؟</h3><p>'+esc(a.analysis)+'</p></article><article><h3>⚠️ چه خطایی باید حذف شود؟</h3><p>'+esc(a.failure)+'</p></article><article><h3>🎯 خروجی قابل قبول چیست؟</h3><p>'+esc(a.outcome)+'</p></article></div><h3>چک‌لیست مشاهده</h3><div class="bp-simple-checks">'+d.checklist.map(t=>'<label><input type="checkbox"><span>'+esc(t)+'</span></label>').join("")+'</div><h3>سه پرسش برای بحث کلاسی</h3><ol>'+d.debrief.slice(0,3).map(t=>'<li>'+esc(t)+'</li>').join("")+'</ol><p class="bp-simple-action"><strong>انتقال به محیط کار:</strong> '+esc(d.action)+'</p></section>'}
function casePage(c,role){const d=c[role];return '<div class="bp-simple-caseback"><button type="button" data-simple-back>→ همه تمرین‌ها</button><strong>'+esc(d.title)+'</strong><span>'+fa(d.roles.length)+' نفر</span></div><section class="bp-simple-scene"><h2>اتفاق آشنا</h2><p>'+esc(d.scene)+'</p></section>'+roleCards(d)+conversation(c,d,role)+analysis(c,d)+'<button type="button" class="bp-simple-bottom" data-simple-back>انتخاب گفت‌وگوی بعدی</button>'}
function render(){const el=container();if(!el)return;const r=getRole(),c=C.find(x=>x.id===chosen);el.innerHTML=top()+chooser(r)+(c?casePage(c,r):cards(r));}
function init(){render();document.addEventListener("click",e=>{const t=e.target.closest("#"+HOST+" [data-simple-case],#"+HOST+" [data-simple-back],#"+HOST+" [data-simple-role]");if(!t)return;if(t.dataset.simpleRole){activeRole=t.dataset.simpleRole;chosen=null}else if(t.dataset.simpleCase)chosen=t.dataset.simpleCase;else if(t.hasAttribute("data-simple-back"))chosen=null;render();const root=container();if(root)root.scrollIntoView({block:"start",behavior:"smooth"});});window.addEventListener("hashchange",()=>{if(location.hash==="#"+HOST)render();});}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})(window);
