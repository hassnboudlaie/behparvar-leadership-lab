/* به‌پرور: گفت‌وگوهای مهارت‌محور، بدون زنجیره مراحل قفل‌شونده */
(function(g){"use strict";
const C=[...(g.BPS2PairCases||[]),...(g.BPS2GroupCases||[])],D=g.BPCompetencyData,HOST="bp-c-clinic-2";
if(!D||C.length!==5)return;
const roleName={supervisors:"سرپرستان",managers:"مدیران"};
const reflections={
"group-empowerment":{intro:"چهار واحد باید اختیار و مسئولیت را در تیم خود تفویض کنند و هم‌زمان با همتایان به توافق برسند.",skill:"تفویض اختیار با خروجی، صاحب‌صلاحیت، حدود تصمیم، منابع، حمایت، شاهد و موعد بازبینی؛ توانمندسازی با بازخورد واقعی.",analysis:"تفویض با رهاکردن کار فرق دارد: فرد واجدصلاحیت درباره کار مجاز تصمیم می‌گیرد، سرپرست یا مدیر حمایت و کنترل متناسب می‌دهد و واحدهای همتا به یکدیگر دستور نمی‌دهند.",failure:"وقتی یک نفر کار کارکنان همه واحدها را کنترل کند یا بدون صلاحیت امضا واگذار شود، هم اعتماد تخریب می‌شود و هم ریسک عملیاتی بالا می‌رود.",outcome:"هر واحد خروجی، شخص دارای اختیار، منابع، مرز ارجاع و شاهد قابل مشاهده را تعیین و در یک توافق میان‌واحدی به‌هم متصل کند.",practice:"برای اجرای دوباره نقش‌ها را عوض کنید و یک خطای واقعی‌نما اضافه کنید؛ روشن کنید چه اختیاری حفظ، محدود یا ارجاع می‌شود."},
"pair-signal":{
 intro:"یک اختلاف واقعی‌نما درباره کیفیت و تعهد تحویل؛ هدف، روشن‌شدن وضعیت بدون مقصرسازی است.",
 skill:"مکث پیش از قضاوت، گوش‌دادن به محدودیت طرف مقابل، جداکردن وضعیت واقعی از فرض، و تصمیم در حدود اختیار.",
 analysis:"گفت‌وگوی حرفه‌ای مسئله را از «چه کسی مقصر است؟» به «چه چیزی می‌دانیم و چه تصمیمی مجاز است؟» تغییر می‌دهد. کیفیت باید امکان گزارش ابهام را داشته باشد و تولید هم زمان معتبر برای برنامه‌ریزی بداند.",
 failure:"اگر دو طرف فقط از واحد خود دفاع کنند، اختلاف شخصی می‌شود و احتمال خروج بدون مجوز یا وعده غیرواقعی بالا می‌رود.",
 outcome:"در پایان هر دو نفر باید بر یک وضعیت مشترک، مسئول پیگیری و ساعت اطلاع‌رسانی توافق کنند. مجوز فنی را هیچ‌کدام دور نمی‌زنند.",
 practice:"یک‌بار با لحن دفاعی و یک‌بار با سؤال باز و خلاصه‌کردن حرف مقابل اجرا کنید؛ تفاوت نتیجه را ببینید."
},
"pair-delegation":{
 intro:"دو سرپرست یا دو مدیر از واحدهای متفاوت، زیر فشار ظرفیت و محدودیت‌های واقعی باید مسئولیت‌ها را هماهنگ کنند.",
 skill:"توافق با همتای سازمانی، تقسیم مسئولیت درون هر واحد، شفاف‌کردن مرز اختیار، سؤال‌کردن به جای دستور دادن و تعیین نقطه بازبینی.",
 analysis:"هیچ مدیر یا سرپرستی به واحد دیگر دستور مستقیم نمی‌دهد. هر نفر مالک تعهد واحد خودش است؛ توافق مشترک باید از داده، اختیار، شواهد مهارت و نقطه بازبینی تشکیل شود.",
 failure:"وقتی یک واحد به همتای خود دستور بدهد، اختلاف بر سر اقتدار شکل می‌گیرد؛ وقتی وعده ظرفیت یا صلاحیت بدون شاهد داده شود، اعتماد و ایمنی آسیب می‌بیند.",
 outcome:"دو نفر باید نتیجه مشترک، کار اختصاصی هر واحد، خط قرمز فنی یا ایمنی، مرز ارجاع و زمان بازبینی را به زبان خودشان بازگو کنند.",
 practice:"این بار از هر دو نقش بخواهید پیش‌فرض‌شان درباره واحد مقابل را بررسی و یک مسئول از تیم خود معرفی کنند."
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
"group-empowerment":{supervisors:{2:"self",5:"delegation",8:"coaching",12:"performance",18:"coordination",23:"judgment"},managers:{4:"delegation",7:"coordination",10:"coaching",17:"judgment",22:"performance"}},
"pair-signal":{supervisors:{3:"communication",4:"self",11:"judgment",15:"coordination"},managers:{4:"self",8:"judgment",13:"conflict",17:"performance"}},
"pair-delegation":{supervisors:{4:"self",7:"coordination",10:"delegation",17:"performance"},managers:{3:"coaching",8:"coordination",14:"self",18:"performance"}},
"group-handover":{supervisors:{6:"conflict",11:"coordination",17:"judgment",23:"performance"},managers:{5:"self",8:"problem",17:"business",21:"coordination"}},
"group-capacity":{supervisors:{8:"self",12:"planning",17:"delegation",20:"performance"},managers:{5:"coaching",8:"problem",15:"change",20:"coordination"}}
};
const expertNotes={
"group-empowerment":{supervisors:"نقطه عطف: سرپرست تولید به‌جای دستور مستقیم به کارکنان سه واحد دیگر، مسئولیت هر همتای سازمانی را می‌پذیرد و در واحد خودش با مرز اختیار، حمایت و بازخورد تفویض می‌کند.",managers:"نقطه عطف: چهار مدیر از کاهش تعداد امضاها به سازوکار توسعه صلاحیت، اختیار متناسب با ریسک، پایلوت با شاخص محافظ و ارزیابی رفتاری می‌رسند."},
"pair-signal":{supervisors:"لحظه تغییر: تولید از «کیفیت دیر خبر داده» به سؤال درباره داده و زمان اعلام نتیجه می‌رسد؛ کیفیت هم تأخیر اطلاع‌رسانی را می‌پذیرد، اما مجوز آزادسازی را معامله نمی‌کند.",managers:"لحظه تغییر: دو مدیر به‌جای دفاع از KPI داخلی، درباره اعتماد مشتری، هزینه کل و حد فنی غیرقابل مذاکره به زبان مشترک می‌رسند."},
"pair-delegation":{supervisors:"لحظه تغییر: سرپرست تولید به‌جای دستور به تیم تعمیرات، تعهد گزارش وضعیت از همتای خود می‌گیرد؛ هر سرپرست صرفاً به تیم خودش مأموریت می‌دهد.",managers:"لحظه تغییر: مدیر عملیات پیش‌فرض «منابع انسانی فقط آیین‌نامه دارد» را بازنگری می‌کند و با مدیر منابع انسانی درباره ظرفیت معتبر و توسعه مهارت توافق می‌سازد."},
"group-handover":{supervisors:"لحظه تغییر: سؤال سرپرست انبار درباره معنی «آماده» باعث می‌شود چهار واحد بفهمند چهار وضعیت متفاوت را با یک واژه گزارش می‌کرده‌اند.",managers:"لحظه تغییر: چهار مدیر از درآمد، ظرفیت، کیفیت و هزینه واحدی به تصمیم شرکتی درباره تحویل معتبر و اقتصادی منتقل می‌شوند."},
"group-capacity":{supervisors:"لحظه تغییر: هر سرپرست به‌جای دفاع از واحد خودش، کار موازیِ مجاز و داده موردنیاز سرپرست دیگر را روشن می‌کند.",managers:"لحظه تغییر: مدیران گزینه خرید تجهیز را از یک راه‌حل قطعی به یک سناریو در کنار اصلاح فرآیند و پایلوت قابل سنجش تبدیل می‌کنند."}
};

let chosen=null,activeRole=null;
function esc(x){return String(x==null?"":x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function fa(x){return String(x).replace(/\d/g,c=>"۰۱۲۳۴۵۶۷۸۹"[Number(c)])}
function container(){return document.querySelector("#"+HOST+" .bp-s2-root")}
function getRole(){if(activeRole)return activeRole;const q=new URLSearchParams(location.search).get("audience");if(q==="managers"||q==="supervisors")return q;try{const x=JSON.parse(localStorage.getItem("behparvar_app_v1")||"{}");if(x.role==="managers"||x.role==="supervisors")return x.role}catch(e){}return null}
function top(){return '<div class="bp-simple-top"><a href="#welcome" data-open="welcome">⌂ خانه</a><a href="#session2" data-open="session2">جلسه دوم</a></div><header class="bp-simple-hero"><span>تمرین کاربردی در محیط کار</span><h1>🎭 گفت‌وگوهای دو‌نفره و چهار‌نفره</h1><p>همه نقش‌ها مدیر یا سرپرست واحدهای متفاوت‌اند. ابتدا اجرا کنید، سپس گفت‌وگوی نمونه و تحلیل را باز کنید.</p></header>'}
function chooser(role){return '<div class="bp-simple-rolebar" role="group" aria-label="مسیر تمرین"><span>مسیر:</span>'+["supervisors","managers"].map(r=>'<button type="button" data-simple-role="'+r+'" aria-pressed="'+(r===role)+'">'+roleName[r]+'</button>').join("")+'</div>'}
function skillNames(c){return c.skills.map(x=>D.skills.find(s=>s.id===x)).filter(Boolean).map(s=>s.name)}
function cards(role){return '<section class="bp-simple-grid" aria-label="انتخاب موقعیت">'+C.map(c=>'<button type="button" class="bp-simple-case" data-simple-case="'+esc(c.id)+'"><span>'+(c.format==="pair"?"👥 دو نفره":"🗣️ چهار نفره")+'</span><strong>'+esc(c[role].title)+'</strong><small>'+esc(reflections[c.id].intro)+'</small><b>بازکردن تمرین</b></button>').join("")+'</section>'}
function roleCards(d){
 return '<section class="bp-simple-section"><h2>۱. کارت شخصیت‌ها و پیش‌فرض‌های پنهان</h2><p>هر نفر کارت نقش خودش را بخواند. کارت‌ها درباره شخصیت ساختگی هستند، نه همکار واقعی شما.</p><div class="bp-simple-roles">'+d.roles.map((r,i)=>
 '<article><span>نقش '+fa(i+1)+' · واحد مستقل</span><h3>'+esc(r[0])+'</h3>'+
 '<p><strong>دغدغه واقعی:</strong> '+esc(r[1])+'</p>'+
 '<p><strong>فرض درباره واحد مقابل:</strong> '+esc(r[4]||"")+'</p>'+
 '<p><strong>سبک گفت‌وگو زیر فشار:</strong> '+esc(r[5]||"")+'</p>'+
 '<p><strong>خط قرمز:</strong> '+esc(r[2])+'</p>'+
 '<p><strong>اختیار توافق:</strong> '+esc(r[3])+'</p>'+
 '<details class="bp-simple-private"><summary>🔒 اطلاعات اختصاصی این شخصیت</summary><p>'+esc(r[6]||"")+'</p></details>'+
 '</article>').join("")+'</div></section>';
}
function conversation(c,d,role){
 const lines=d.improved&&d.improved.length?d.improved:d.initial;
 const labels=turnAnchors[c.id]&&turnAnchors[c.id][role]||{};
 const nameById=Object.fromEntries(D.skills.map(x=>[x.id,x.name]));
 const size=c.format==="pair"?"دو نفره":"چهار نفره";
 const timing=c.format==="pair"?"اجرای اول: ۵ دقیقه · تغییر رویکرد: ۴ دقیقه · بازخورد: ۵ دقیقه":"آماده‌سازی نقش‌ها: ۳ دقیقه · نشست: ۱۰ دقیقه · بازخورد: ۶ دقیقه";
 return '<section class="bp-simple-section"><h2>۲. اجرای گفت‌وگوی '+size+'</h2>'+
 '<div class="bp-simple-target"><strong>🎯 شایستگی‌هایی که باید در رفتار دیده شوند</strong><div>'+skillNames(c).map(x=>'<span>'+esc(x)+'</span>').join("")+'</div><p>'+esc(reflections[c.id].skill)+'</p></div>'+
 '<div class="bp-simple-run"><strong>🎬 نوبت شماست؛ اول بدون نمونه اجرا کنید</strong>'+
 '<p>'+esc(d.scene)+'</p><p>هر نفر با دغدغه و فرض اولیه شخصیت خود شروع کند. لازم نیست خیلی زود توافق کنید؛ ابتدا اختلاف را با سؤال، داده و محدودیت‌های واقعی روشن کنید.</p>'+
 '<p class="bp-simple-timing">⏱ '+esc(timing)+'</p></div>'+
 '<details class="bp-simple-twist"><summary>🔀 کارت اتفاق تازه؛ مدرس در میانه اجرا باز کند</summary><p>'+esc(d.twist)+'</p></details>'+
 '<details class="bp-simple-script"><summary>📖 دیدن گفت‌وگوی نمونه و لحظه‌های مهارتی</summary><p>این فقط یک اجرای ممکن است، نه پاسخ حفظی. توجه کنید کجا پیش‌فرض‌ها به چالش کشیده می‌شوند و چه‌طور توافق ساخته می‌شود.</p>'+
 '<div class="bp-simple-dialogue">'+lines.map(([n,t],i)=>
 '<div class="bp-simple-line"><span class="bp-simple-speaker">'+esc(d.roles[n][0])+'</span><p>'+esc(t)+'</p>'+
 (labels[i]?'<small class="bp-simple-turnskill">مهارت قابل مشاهده: '+esc(nameById[labels[i]]||labels[i])+'</small>':"")+
 '</div>').join("")+'</div></details>'+
 '<div class="bp-simple-nobias"><strong>🔄 اجرای دوباره:</strong> نقش‌ها را عوض کنید یا یک پیش‌فرض را تغییر دهید؛ دوباره مذاکره کنید و ببینید کیفیت توافق چه تغییری می‌کند. '+esc(reflections[c.id].practice)+'</div></section>';
}
function analysis(c,d,role){
 const a=reflections[c.id];
 return '<section class="bp-simple-section bp-simple-analysis"><h2>۳. تحلیل و بازخورد مبتنی بر رفتار</h2>'+
 '<div class="bp-simple-evidence"><strong>🔎 نقطه عطف گفت‌وگو</strong><p>'+esc(expertNotes[c.id][role])+'</p></div>'+
 '<div class="bp-simple-insights"><article><h3>✅ رفتار حرفه‌ای</h3><p>'+esc(a.analysis)+'</p></article>'+
 '<article><h3>⚠️ رفتار پرخطر</h3><p>'+esc(a.failure)+'</p></article>'+
 '<article><h3>🎯 توافق قابل قبول</h3><p>'+esc(a.outcome)+'</p></article></div>'+
 '<h3>چک‌لیست مشاهده‌گر</h3><p>فقط رفتار قابل مشاهده را علامت بزنید، نه شخصیت یا نیت همکار را.</p>'+
 '<div class="bp-simple-checks">'+d.checklist.map(t=>'<label><input type="checkbox"><span>'+esc(t)+'</span></label>').join("")+'</div>'+
 '<div class="bp-simple-feedback"><label>💬 جمله یا رفتاری که مؤثر بود<textarea rows="2" placeholder="مثلاً: وقتی ... پرسید، بحث از اتهام به بررسی داده تغییر کرد."></textarea></label>'+
 '<label>🛠 یک رفتار مشخص برای بهترشدن<textarea rows="2" placeholder="مثلاً: پیش از پیشنهاد راه‌حل، نگرانی واحد مقابل را بازگو کند."></textarea></label></div>'+
 '<h3>سه سؤال تحلیلی برای گفت‌وگوی کلاسی</h3><ol>'+d.debrief.slice(0,3).map(t=>'<li>'+esc(t)+'</li>').join("")+'</ol>'+
 '<p class="bp-simple-action"><strong>انتقال به محیط کار:</strong> '+esc(d.action)+'</p></section>';
}
function empowermentMechanism(c){
 if(c.id!=="group-empowerment")return "";
 const parts=["۱. خروجی مورد انتظار","۲. صاحب مسئولیت و صلاحیت","۳. اختیار و خط قرمز","۴. منابع و حمایت","۵. شاهد عملکرد","۶. موعد بازنگری و ارجاع"];
 return '<aside class="bp-simple-empower"><h3>🧩 سازوکار عملی تفویض اختیار</h3><p>در هر واحد، این شش جزء را قبل از واگذاری روشن کنید. یک واحد حق دستور به کارکنان واحد دیگر را ندارد.</p><ol>'+parts.map(t=>'<li>'+esc(t)+'</li>').join("")+'</ol></aside>';
}
function casePage(c,role){
 const d=c[role];
 return '<div class="bp-simple-caseback"><button type="button" data-simple-back>→ همه تمرین‌ها</button><strong>'+esc(d.title)+'</strong><span>'+fa(d.roles.length)+' مدیر/سرپرست هم‌سطح</span></div>'+
 '<section class="bp-simple-scene"><h2>اتفاق آشنا؛ اختلاف میان واحدها</h2><p>'+esc(d.scene)+'</p></section>'+
 roleCards(d)+empowermentMechanism(c)+conversation(c,d,role)+analysis(c,d,role)+
 '<button type="button" class="bp-simple-bottom" data-simple-back>انتخاب گفت‌وگوی بعدی</button>';
}
function render(){
 const el=container();if(!el)return;
 const r=getRole(),c=C.find(x=>x.id===chosen);
 el.innerHTML=top()+chooser(r)+(r?(c?casePage(c,r):cards(r)):
 '<section class="bp-simple-choose"><h2>ابتدا مشخص کنید در کدام مسیر هستید</h2><p>برای دیدن گفت‌وگوهای مخصوص سرپرستان یا مدیران، یکی از دو گزینه بالا را انتخاب کنید.</p></section>');
}
function init(){render();document.addEventListener("click",e=>{const t=e.target.closest("#"+HOST+" [data-simple-case],#"+HOST+" [data-simple-back],#"+HOST+" [data-simple-role]");if(!t)return;if(t.dataset.simpleRole){activeRole=t.dataset.simpleRole;chosen=null}else if(t.dataset.simpleCase)chosen=t.dataset.simpleCase;else if(t.hasAttribute("data-simple-back"))chosen=null;render();const root=container();if(root)root.scrollIntoView({block:"start",behavior:"smooth"});});window.addEventListener("hashchange",()=>{if(location.hash==="#"+HOST)render();});}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})(window);
