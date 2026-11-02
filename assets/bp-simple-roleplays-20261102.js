/* به‌پرور: گفت‌وگوهای مهارت‌محور، بدون زنجیره مراحل قفل‌شونده */
(function(g){"use strict";
const C=[...(g.BPS2PairCases||[]),...(g.BPS2GroupCases||[])],D=g.BPCompetencyData,HOST="bp-c-clinic-2";
if(!D||C.length!==5)return;
const roleName={supervisors:"سرپرستان",managers:"مدیران"};
const reflections={
"group-empowerment":{intro:"چهار واحد باید اختیار و مسئولیت را در تیم خود تفویض کنند و هم‌زمان با همتایان به توافق برسند.",skill:"تفویض اختیار با خروجی، صاحب‌صلاحیت، حدود تصمیم، منابع، حمایت، شاهد و موعد بازبینی؛ توانمندسازی با بازخورد واقعی.",analysis:"تفویض با رهاکردن کار فرق دارد: فرد واجدصلاحیت درباره کار مجاز تصمیم می‌گیرد، سرپرست یا مدیر حمایت و کنترل متناسب می‌دهد و واحدهای همتا به یکدیگر دستور نمی‌دهند.",failure:"وقتی یک نفر کار کارکنان همه واحدها را کنترل کند یا بدون صلاحیت امضا واگذار شود، هم اعتماد تخریب می‌شود و هم ریسک عملیاتی بالا می‌رود.",outcome:"هر واحد خروجی، شخص دارای اختیار، منابع، مرز ارجاع و شاهد قابل مشاهده را تعیین و در یک توافق میان‌واحدی به‌هم متصل کند."},
"pair-signal":{
 intro:"یک اختلاف واقعی‌نما درباره کیفیت و تعهد تحویل؛ هدف، روشن‌شدن وضعیت بدون مقصرسازی است.",
 skill:"مکث پیش از قضاوت، گوش‌دادن به محدودیت طرف مقابل، جداکردن وضعیت واقعی از فرض، و تصمیم در حدود اختیار.",
 analysis:"گفت‌وگوی حرفه‌ای مسئله را از «چه کسی مقصر است؟» به «چه چیزی می‌دانیم و چه تصمیمی مجاز است؟» تغییر می‌دهد. کیفیت باید امکان گزارش ابهام را داشته باشد و تولید هم زمان معتبر برای برنامه‌ریزی بداند.",
 failure:"اگر دو طرف فقط از واحد خود دفاع کنند، اختلاف شخصی می‌شود و احتمال خروج بدون مجوز یا وعده غیرواقعی بالا می‌رود.",
 outcome:"در پایان هر دو نفر باید بر یک وضعیت مشترک، مسئول پیگیری و ساعت اطلاع‌رسانی توافق کنند. مجوز فنی را هیچ‌کدام دور نمی‌زنند."
},
"pair-delegation":{
 intro:"دو سرپرست یا دو مدیر از واحدهای متفاوت، زیر فشار ظرفیت و محدودیت‌های واقعی باید مسئولیت‌ها را هماهنگ کنند.",
 skill:"توافق با همتای سازمانی، تقسیم مسئولیت درون هر واحد، شفاف‌کردن مرز اختیار، سؤال‌کردن به جای دستور دادن و تعیین نقطه بازبینی.",
 analysis:"هیچ مدیر یا سرپرستی به واحد دیگر دستور مستقیم نمی‌دهد. هر نفر مالک تعهد واحد خودش است؛ توافق مشترک باید از داده، اختیار، شواهد مهارت و نقطه بازبینی تشکیل شود.",
 failure:"وقتی یک واحد به همتای خود دستور بدهد، اختلاف بر سر اقتدار شکل می‌گیرد؛ وقتی وعده ظرفیت یا صلاحیت بدون شاهد داده شود، اعتماد و ایمنی آسیب می‌بیند.",
 outcome:"دو نفر باید نتیجه مشترک، کار اختصاصی هر واحد، خط قرمز فنی یا ایمنی، مرز ارجاع و زمان بازبینی را به زبان خودشان بازگو کنند."
},
"group-handover":{
 intro:"چهار واحد تعریف متفاوتی از «سفارش آماده تحویل» دارند و یک تصمیم مشترک لازم است.",
 skill:"گوش‌دادن میان واحدها، معیار مشترک تحویل، تصمیم مبتنی بر داده و توافق بر مسئول و موعد.",
 analysis:"رسیدن کالا به انبار با امکان خروج قانونی و فنی یکسان نیست. تسهیل جلسه باید تعریف مشترک از آماده‌بودن، مسئول هر گلوگاه و پیام واحد به مشتری ایجاد کند.",
 failure:"وقتی هر واحد فقط شاخص خودش را می‌بیند، تصمیم ظاهراً سریع می‌تواند به برگشت محموله، هزینه یا نقض استاندارد منجر شود.",
 outcome:"تیم باید سه چیز را مشخص کند: وضعیت مجاز/نامجاز هر بخش، تصمیم در محدوده اختیار، و زمان اطلاع‌رسانی مشترک."
},
"group-capacity":{
 intro:"چهار نفر باید زیر محدودیت منابع درباره اولویت و تغییر تصمیم بگیرند.",
 skill:"صورت‌بندی مسئله، مقایسه گزینه‌ها، تفویض روشن، گرفتن بازخورد و طراحی آزمایش کم‌ریسک.",
 analysis:"به‌جای دوگانه «همه تغییرها اکنون» یا «هیچ تغییری نکنیم»، باید گزینه مرحله‌ای با معیار موفقیت، هزینه فرصت، مسئول و شرط توقف سنجیده شود.",
 failure:"پایلوت بدون شاخص و صاحب مسئولیت، فقط یک فعالیت اضافی است؛ وعده دادن بدون ظرفیت هم ریسک عملیاتی می‌سازد.",
 outcome:"توافق نهایی شامل یک اقدام محدود، یک مسئول، معیار نتیجه، تاریخ بررسی و آستانه توقف باشد."
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

const momentNotes={"pair-signal":{"supervisors":{"3":"پذیرش سهم واحد خود در ضعف اطلاع‌رسانی","4":"تبدیل قضاوت عجولانه به سؤال باز","11":"جداکردن زمان اعلام نتیجه از زمان خروج","15":"روشن‌کردن مالک اعلام و دریافت"},"managers":{"4":"تعریف منفعت مشترک مشتری و کیفیت","8":"تفکیک وعده شفاهی از تعهد معتبر","13":"حفظ مرز اختیار فنی و تجاری","17":"توافق بر اقدام و موعد"}},"pair-delegation":{"supervisors":{"4":"درخواست تعهد از همتای سازمانی به‌جای دستور","7":"تشخیص حدود اختیار و مجوز کیفیت","10":"تفویض کار در تیم خود","17":"تعهد اطلاع‌رسانی زودهنگام"},"managers":{"3":"بازنگری فرض کمبود نیروی هم‌زمان","8":"پذیرش مسئولیت عملیات در آموزش","14":"اصلاح لحن در برابر شواهد","18":"شاخص مشترک ظرفیت و ریسک"}},"group-handover":{"supervisors":{"6":"نقطه عطف: چهار تعریف متفاوت از آماده‌بودن","11":"تعهد مسئول مشخص در تولید","17":"مرزبندی زمان گزارش و آزادسازی","23":"پیام مشترک مبتنی بر وضعیت واقعی"},"managers":{"5":"شناسایی شکاف میان دو تعهد","8":"مقایسه سناریوها به جای دفاع واحدی","17":"دیدن هزینه واقعی تصمیم","21":"معیار مشترک کل شرکت"}},"group-capacity":{"supervisors":{"8":"تغییر برداشت درباره واحدهای دیگر","12":"سند معتبر و تعهد انبار","17":"حفظ اختیار سرپرست تعمیرات","20":"برنامه مشروط با شاهد"},"managers":{"5":"به چالش‌کشیدن راه‌حل یک‌گزینه‌ای","8":"تعریف مهلت تصمیم برای پایلوت","15":"مشخص‌کردن معیار بازنگری","20":"پذیرش مشارکت سرپرستان در اجرا"}},"group-empowerment":{"supervisors":{"2":"پذیرش پیامد دخالت در اختیار واحد دیگر","5":"توافق بر عناصر تفویض مسئولانه","8":"شاهد صلاحیت قبل از واگذاری","12":"شرط توقف و ارجاع فنی","18":"تعهد همتای سازمانی","23":"بازگویی حدود اختیار برای اطمینان از فهم"},"managers":{"4":"دسته‌بندی تصمیم براساس ریسک","7":"تفویض در مرز واحد خود","10":"شواهد متناسب با سطح حساسیت","17":"بازخورد و اصلاح به‌جای لغو همه اختیارها","22":"شاخص محافظ کیفیت و ایمنی"}}};
let chosen=null,activeRole=null;
function esc(x){return String(x==null?"":x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function fa(x){return String(x).replace(/\d/g,c=>"۰۱۲۳۴۵۶۷۸۹"[Number(c)])}
function container(){return document.querySelector("#"+HOST+" .bp-s2-root")}
function getRole(){if(activeRole)return activeRole;const q=new URLSearchParams(location.search).get("audience");if(q==="managers"||q==="supervisors")return q;try{const x=JSON.parse(localStorage.getItem("behparvar_app_v1")||"{}");if(x.role==="managers"||x.role==="supervisors")return x.role}catch(e){}return null}
function top(){return '<div class="bp-simple-top"><a href="#welcome" data-open="welcome">⌂ خانه</a><a href="#session2" data-open="session2">جلسه دوم</a></div><header class="bp-simple-hero"><span>تمرین کاربردی در محیط کار</span><h1>🎭 گفت‌وگوهای دو‌نفره و چهار‌نفره</h1><p>همه نقش‌ها مدیر یا سرپرست واحدهای متفاوت‌اند. متن گفت‌وگوی نمونه را بخوانید و نقاط عطف مهارتی را با کمک چک‌لیست کلاس تحلیل کنید.</p></header>'}
function chooser(role){return '<div class="bp-simple-rolebar" role="group" aria-label="مسیر تمرین"><span>مسیر:</span>'+["supervisors","managers"].map(r=>'<button type="button" data-simple-role="'+r+'" aria-pressed="'+(r===role)+'">'+roleName[r]+'</button>').join("")+'</div>'}
function skillNames(c){return c.skills.map(x=>D.skills.find(s=>s.id===x)).filter(Boolean).map(s=>s.name)}
function cards(role){return '<section class="bp-simple-grid" aria-label="انتخاب موقعیت">'+C.map(c=>'<button type="button" class="bp-simple-case" data-simple-case="'+esc(c.id)+'"><span>'+(c.format==="pair"?"👥 دو نفره":"🗣️ چهار نفره")+'</span><strong>'+esc(c[role].title)+'</strong><small>'+esc(reflections[c.id].intro)+'</small><b>مشاهده گفت‌وگو و تحلیل</b></button>').join("")+'</section>'}
function roleCards(d){
 return '<details class="bp-simple-character-cards"><summary>👥 شخصیت‌ها و پیش‌فرض‌هایشان <small>مشاهده اطلاعات نقش‌ها</small></summary>'+
 '<div class="bp-simple-roles">'+d.roles.map((r,i)=>
 '<article><span>نقش '+fa(i+1)+' · '+esc(d.names&&d.names[i]||"شخصیت فرضی")+'</span><h3>'+esc(r[0])+'</h3>'+
 '<p><strong>دغدغه:</strong> '+esc(r[1])+'</p>'+
 '<p><strong>پیش‌فرض درباره دیگران:</strong> '+esc(r[4]||"")+'</p>'+
 '<p><strong>سبک گفت‌وگو:</strong> '+esc(r[5]||"")+'</p>'+
 '<p><strong>خط قرمز:</strong> '+esc(r[2])+'</p>'+
 '<p><strong>اختیار:</strong> '+esc(r[3])+'</p>'+
 '<details class="bp-simple-private"><summary>🔒 اطلاعات اختصاصی این شخصیت</summary><p>'+esc(r[6]||"")+'</p></details>'+
 '</article>').join("")+'</div></details>';
}
function conversation(c,d,role){
 const lines=d.improved&&d.improved.length?d.improved:d.initial;
 const labels=turnAnchors[c.id]&&turnAnchors[c.id][role]||{};
 const notes=momentNotes[c.id]&&momentNotes[c.id][role]||{};
 const names=Object.fromEntries(D.skills.map(x=>[x.id,x.name]));
 return '<section class="bp-simple-section bp-simple-script-section"><h2>۲. گفت‌وگوی نمونه و لحظه‌های مهارتی</h2>'+
 '<div class="bp-simple-target"><strong>🎯 شایستگی‌های قابل مشاهده</strong><div>'+skillNames(c).map(x=>'<span>'+esc(x)+'</span>').join("")+'</div></div>'+
 '<div class="bp-simple-dialogue">'+lines.map(([n,t],i)=>{
   const skill=labels[i];
   const moment=skill?'<aside class="bp-simple-moment"><strong>💡 '+esc(names[skill]||skill)+'</strong><p>'+esc(notes[i]||"رفتار قابل مشاهده و تغییر رویکرد را تشخیص دهید.")+'</p></aside>':"";
   return '<article class="bp-simple-line'+(skill?' bp-simple-highlight':'')+'" data-simple-turn="'+i+'">'+
   '<span class="bp-simple-speaker">'+(d.names&&d.names[n]?'<strong>'+esc(d.names[n])+'</strong><small>'+esc(d.roles[n][0])+'</small>':esc(d.roles[n][0]))+'</span>'+
   '<p>'+esc(t)+'</p>'+moment+'</article>';
 }).join("")+'</div></section>';
}
function analysis(c,d,role){
 const a=reflections[c.id];
 return '<section class="bp-simple-section bp-simple-analysis"><h2>۳. تحلیل و بازخورد مشاهده‌گران</h2>'+
 '<p class="bp-simple-observer-intro">👀 سایر شرکت‌کنندگان کلاس با استفاده از چک‌لیست، گفت‌وگو را مستقلاً تحلیل کنند. در هر معیار، میزان مشاهده و یک شاهد مشخص از جمله‌ها یا رفتارها را ثبت کنید؛ نه قضاوت درباره شخصیت افراد.</p>'+
 '<div class="bp-simple-observer-head"><label>نام مشاهده‌گر (اختیاری)<input data-simple-observer-name type="text" placeholder="نام شما"></label><span>موقعیت: '+esc(d.title)+'</span></div>'+
 '<h3 class="bp-simple-criteria-heading">✅ چک‌لیست مشاهده‌گر · پنج رفتار قابل مشاهده</h3>'+
 '<div class="bp-simple-checks">'+d.checklist.map((t,i)=>
 '<div class="bp-simple-criterion-row" data-simple-check-item>'+
 '<strong class="bp-simple-criterion">'+fa(i+1)+'. '+esc(t)+'</strong>'+
 '<div class="bp-simple-observer-inputs"><label>وضعیت رفتار<select data-simple-eval aria-label="وضعیت رفتار '+fa(i+1)+'">'+
 '<option value="">انتخاب کنید</option><option value="کاملاً مشاهده شد">کاملاً مشاهده شد</option>'+
 '<option value="تا حدی مشاهده شد">تا حدی مشاهده شد</option>'+
 '<option value="مشاهده نشد">مشاهده نشد</option>'+
 '<option value="شاهد کافی نیست">شاهد کافی نیست</option></select></label>'+
 '<label>شاهد مشخص: کدام جمله یا رفتار؟<input data-simple-evidence type="text" placeholder="جمله یا لحظه مشخصی از گفت‌وگو"></label></div></div>').join("")+'</div>'+
 '<h3 class="bp-simple-questions-heading">🔎 سه سؤال تحلیلی؛ پیدا کردن نقاط عطف</h3>'+
 '<div class="bp-simple-reflection">'+d.debrief.slice(0,3).map((q,i)=>
 '<label class="bp-simple-reflection-item"><strong>'+fa(i+1)+'. '+esc(q)+'</strong>'+
 '<textarea data-simple-answer rows="3" placeholder="تحلیل و شاهد خود را بنویسید."></textarea></label>').join("")+'</div>'+
 '<details class="bp-simple-teacher-analysis"><summary>📖 جمع‌بندی مدرس و نقطه عطف پیشنهادی</summary>'+
 '<p><strong>نقطه عطف:</strong> '+esc(expertNotes[c.id][role])+'</p>'+
 '<div class="bp-simple-insights"><article><h3>✅ رفتار حرفه‌ای</h3><p>'+esc(a.analysis)+'</p></article>'+
 '<article><h3>⚠️ رفتار پرخطر</h3><p>'+esc(a.failure)+'</p></article>'+
 '<article><h3>🎯 توافق قابل قبول</h3><p>'+esc(a.outcome)+'</p></article></div></details>'+
 '<h3>💬 نظر خودتان درباره گفت‌وگو</h3>'+
 '<div class="bp-simple-feedback"><label>قوی‌ترین رفتار یا جمله چه بود؟<textarea rows="2" data-simple-strength placeholder="کدام جمله گفت‌وگو را جلو برد و چرا؟"></textarea></label>'+
 '<label>کدام رفتار باید بهتر شود؟<textarea rows="2" data-simple-improvement placeholder="چه سؤال یا پاسخ دقیق‌تری پیشنهاد می‌کنید؟"></textarea></label></div>'+
 '<div class="bp-simple-share"><p>گزارش هر مشاهده‌گر در همین صفحه تکمیل می‌شود؛ برای ارائه به مدرس یا سایر اعضای کلاس می‌توانید متن آن را کپی کنید. هیچ پاسخی به سرور ارسال نمی‌شود.</p>'+
 '<button type="button" class="bp-simple-copy" data-simple-copy>📋 کپی گزارش مشاهده‌گر</button>'+
 '<p data-simple-copy-status role="status" aria-live="polite"></p>'+
 '<div data-simple-report-preview hidden><label>متن گزارش برای کپی دستی<textarea readonly rows="10"></textarea></label></div></div>'+
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
 '<section class="bp-simple-scene"><h2>۱. اتفاق آشنا؛ جزئیات موقعیت</h2><p class="bp-simple-fiction">موقعیت آموزشی و فرضی، الهام‌گرفته از فرایندهای صنعت خوراک دام و طیور؛ نام‌ها، رویدادها و اعداد واقعی نیستند.</p>'+
 '<div class="bp-simple-scenetext">'+String(d.scene).split(/\n\s*\n/).map(t=>t.trim()).filter(Boolean).map(t=>'<p>'+esc(t)+'</p>').join("")+'</div>'+
 '<div class="bp-simple-casefacts"><h3>📋 داده‌های در دسترس</h3><ul>'+d.signals.map(t=>'<li>'+esc(t)+'</li>').join("")+'</ul></div>'+
 '<details class="bp-simple-limits"><summary>حدود اختیار و محدودیت‌ها</summary><ul>'+d.constraints.map(t=>'<li>'+esc(t)+'</li>').join("")+'</ul></details></section>'+
 roleCards(d)+empowermentMechanism(c)+conversation(c,d,role)+analysis(c,d,role)+
 '<button type="button" class="bp-simple-bottom" data-simple-back>انتخاب گفت‌وگوی بعدی</button>';
}
function render(){
 const el=container();if(!el)return;
 const r=getRole(),c=C.find(x=>x.id===chosen);
 el.innerHTML=top()+chooser(r)+(r?(c?casePage(c,r):cards(r)):
 '<section class="bp-simple-choose"><h2>ابتدا مشخص کنید در کدام مسیر هستید</h2><p>برای دیدن گفت‌وگوهای مخصوص سرپرستان یا مدیران، یکی از دو گزینه بالا را انتخاب کنید.</p></section>');
}
function observerReport(){
 const root=container(),c=C.find(x=>x.id===chosen),r=getRole();
 if(!root||!c||!r)return "";
 const d=c[r],get=sel=>root.querySelector(sel)?.value?.trim()||"";
 const rows=[...root.querySelectorAll("[data-simple-check-item]")].map(node=>
  (node.querySelector(".bp-simple-criterion")?.textContent||"")+
  "\nارزیابی: "+(node.querySelector("[data-simple-eval]")?.value||"ثبت نشده")+
  "\nشاهد: "+(node.querySelector("[data-simple-evidence]")?.value||"ثبت نشده"));
 const debrief=[...root.querySelectorAll(".bp-simple-reflection-item")].map(node=>
  (node.querySelector("strong")?.textContent||"پرسش تحلیلی")+
  "\n"+(node.querySelector("textarea")?.value||"پاسخی ثبت نشده"));
 return ["گزارش مشاهده‌گر — جلسه دوم مدل شایستگی‌های به‌پرور",
 "موقعیت: "+d.title,"مسیر: "+roleName[r],
 "نام مشاهده‌گر: "+(get("[data-simple-observer-name]")||"بدون نام"),
 "چک‌لیست مبتنی بر شاهد:",...rows,
 "نقاط عطف و تحلیل:",...debrief,
 "قوی‌ترین رفتار: "+(get("[data-simple-strength]")||"ثبت نشده"),
 "پیشنهاد بهبود: "+(get("[data-simple-improvement]")||"ثبت نشده")].join("\n\n");
}
async function copyObserverReport(){
 const root=container(),status=root&&root.querySelector("[data-simple-copy-status]");
 if(!root||!status)return;
 const report=observerReport();
 try{
  if(!navigator.clipboard?.writeText)throw Error("clipboard unavailable");
  await navigator.clipboard.writeText(report);
  status.textContent="✅ گزارش کپی شد؛ می‌توانید آن را در گروه یا برای مدرس بفرستید.";
 }catch(err){
  const panel=root.querySelector("[data-simple-report-preview]");
  if(panel){
   panel.hidden=false;
   const input=panel.querySelector("textarea");
   input.value=report;input.focus();input.select();
  }
  status.textContent="کپی خودکار در این مرورگر فعال نیست؛ متن گزارش در کادر زیر برای کپی دستی آماده است.";
 }
}

function init(){render();document.addEventListener("click",e=>{if(e.target.closest("#"+HOST+" [data-simple-copy]")){copyObserverReport();return;}const t=e.target.closest("#"+HOST+" [data-simple-case],#"+HOST+" [data-simple-back],#"+HOST+" [data-simple-role]");if(!t)return;if(t.dataset.simpleRole){activeRole=t.dataset.simpleRole;chosen=null}else if(t.dataset.simpleCase)chosen=t.dataset.simpleCase;else if(t.hasAttribute("data-simple-back"))chosen=null;render();const root=container();if(root)root.scrollIntoView({block:"start",behavior:"smooth"});});window.addEventListener("hashchange",()=>{if(location.hash==="#"+HOST)render();});}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})(window);
