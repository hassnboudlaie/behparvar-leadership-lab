/* Behparvar | Session 3 individual competency assessment.
   Educational self-report, not a validated psychometric or personnel selection instrument. */
(function(g){"use strict";
const ROLE_LABEL={supervisors:"سرپرستان",managers:"مدیران"},STORAGE="behparvar_s3_self_assessment_v1_";
const LEVEL_LABELS=["تقریباً هرگز","به‌ندرت","گاهی","اغلب","تقریباً همیشه"];
const AREAS=[
 {
  "id": "self",
  "icon": "🧠",
  "name": "خودآگاهی و خودتنظیمی",
  "area": "شایستگی اصلی · حوزه خودم",
  "describe": "شناخت واکنش‌های خود، جداکردن واقعیت از برداشت، و اصلاح رفتار در موقعیت‌های دشوار.",
  "questions": [
   {
    "s": "وقتی از موضوعی ناراحت یا تحت فشار بودم، پیش از پاسخ‌دادن مکث کردم.",
    "m": "وقتی برای تصمیم یا گفت‌وگویی تحت فشار بودم، پیش از واکنش مکث کردم."
   },
   {
    "s": "در اختلاف‌نظرها، آنچه واقعاً رخ داده بود را از برداشت شخصی خود جدا کردم.",
    "m": "پیش از قضاوت درباره عملکرد یا یک مسئله، واقعیت‌ها را از فرض‌های خود جدا کردم."
   },
   {
    "s": "وقتی از من انتقاد شد، پیش از دفاع‌کردن یک سؤال برای فهم بهتر پرسیدم.",
    "m": "هنگام شنیدن نظر مخالف، پیش از دفاع از تصمیم خود سؤال روشن‌کننده پرسیدم."
   },
   {
    "s": "پس از یک گفت‌وگوی ناموفق، رفتار خودم را مرور و در موقعیت بعدی اصلاح کردم.",
    "m": "بعد از یک گفت‌وگو یا تصمیم کم‌اثر، نقش رفتار خودم را بررسی و اصلاح کردم."
   }
  ]
 },
 {
  "id": "efficacy",
  "icon": "🌱",
  "name": "خودکارآمدی و پیگیری",
  "area": "توانمندی مکمل · حوزه خودم",
  "describe": "شروع مسئولانه کارهای دشوار، استفاده از کمک مناسب و ادامه‌دادن تا رسیدن به نتیجه.",
  "questions": [
   {
    "s": "وقتی کاری تازه یا دشوار پیش آمد، به‌جای عقب‌انداختن آن، اولین گام شدنی را برداشتم.",
    "m": "وقتی با مسئولیتی تازه یا پیچیده روبه‌رو شدم، اولین گام عملی را مشخص و شروع کردم."
   },
   {
    "s": "برای کاری که ابتدا سخت به نظر می‌رسید، آن را به چند گام کوچک تقسیم کردم.",
    "m": "برای پیشبرد یک هدف پیچیده، آن را به گام‌های قابل اجرا و قابل پیگیری تقسیم کردم."
   },
   {
    "s": "وقتی راه انجام کار را نمی‌دانستم، کمک یا اطلاعات لازم را پیدا کردم و دوباره اقدام کردم.",
    "m": "وقتی دانش یا تجربه کافی نداشتم، از افراد مناسب کمک گرفتم و تصمیم یا اقدام خود را پیش بردم."
   },
   {
    "s": "پس از برخورد با مانع، راه دیگری را امتحان کردم و کار را بدون دلیل رها نکردم.",
    "m": "وقتی برنامه اولیه با مانع روبه‌رو شد، راه جایگزین را سنجیدم و پیگیری را ادامه دادم."
   }
  ]
 },
 {
  "id": "time",
  "icon": "⏰",
  "name": "مدیریت زمان و اولویت‌ها",
  "area": "توانمندی مکمل · حوزه خودم",
  "describe": "انتخاب کارهای مهم، مدیریت تمرکز و تعهدهای زمانی واقع‌بینانه.",
  "questions": [
   {
    "s": "در شروع روز کاری، مهم‌ترین خروجی‌ها را مشخص کردم.",
    "m": "در برنامه کاری خود، کارهای اثرگذار بر نتیجه را بر درخواست‌های کم‌اهمیت مقدم دانستم."
   },
   {
    "s": "برای کار مهمی که تمرکز می‌خواست، زمان مشخص و نسبتاً بدون وقفه کنار گذاشتم.",
    "m": "برای کارهای مهمی که به فکر و تمرکز نیاز داشتند، زمان مشخصی را محافظت کردم."
   },
   {
    "s": "پیش از پذیرفتن کار تازه، زمان و ظرفیت واقعی خود را در نظر گرفتم.",
    "m": "پیش از قبول تعهد جدید، منابع، زمان و تعهدهای قبلی را سنجیدم."
   },
   {
    "s": "وقتی احتمال تأخیر وجود داشت، زودتر اطلاع دادم و درباره اولویت یا زمان توافق کردم.",
    "m": "وقتی تحقق یک تعهد در خطر بود، به‌موقع موضوع را مطرح و برنامه را بازتنظیم کردم."
   }
  ]
 },
 {
  "id": "problem",
  "icon": "🔍",
  "name": "حل مسئله و تحلیل علت‌ها",
  "area": "شایستگی اصلی · حوزه خودم",
  "describe": "تعریف دقیق مسئله، بررسی علت‌های محتمل و پیگیری اثر راه‌حل.",
  "questions": [
   {
    "s": "پیش از پیشنهاد راه‌حل، مسئله را با یک مثال یا شاهد مشخص توضیح دادم.",
    "m": "پیش از انتخاب راه‌حل، مسئله، دامنه اثر و شواهد آن را روشن کردم."
   },
   {
    "s": "برای یک مشکل تکراری، تلاش کردم علت اصلی را از نشانه ظاهری جدا کنم.",
    "m": "در بررسی مشکل، علت‌های احتمالی را از نشانه‌های آشکار آن جدا کردم."
   },
   {
    "s": "پیش از قطعی‌دانستن علت، دست‌کم یک توضیح دیگر را هم بررسی کردم.",
    "m": "پیش از نتیجه‌گیری، چند علت محتمل را با شواهد مقایسه کردم."
   },
   {
    "s": "پس از اجرای یک راه‌حل، بررسی کردم که مشکل واقعاً کمتر شده است.",
    "m": "پس از اجرای راه‌حل، با یک معیار مشخص بررسی کردم که نتیجه بهتر شده است."
   }
  ]
 },
 {
  "id": "judgment",
  "icon": "⚖️",
  "name": "قضاوت حرفه‌ای و تصمیم‌گیری",
  "area": "شایستگی اصلی · حوزه خودم",
  "describe": "سنجش گزینه‌ها، پیامدها، محدودیت اختیار و عدم قطعیت.",
  "questions": [
   {
    "s": "پیش از یک تصمیم مهم، پیامد آن را برای کار و افراد مرتبط سنجیدم.",
    "m": "پیش از تصمیم مهم، اثر آن را بر افراد، منابع و اهداف کاری بررسی کردم."
   },
   {
    "s": "وقتی چند راه وجود داشت، دلیل انتخاب یکی از آن‌ها را مشخص کردم.",
    "m": "وقتی چند گزینه وجود داشت، پیامد و ریسک آن‌ها را با معیار روشن مقایسه کردم."
   },
   {
    "s": "در موضوعی خارج از اختیار خود، به‌جای تصمیم خودسرانه، اطلاعات لازم را به مسئول مربوط دادم.",
    "m": "وقتی موضوع از اختیارم فراتر بود، گزینه‌ها و شواهد را برای تصمیم در سطح مناسب آماده کردم."
   },
   {
    "s": "وقتی اطلاعات کافی نبود، فرض‌های خود را روشن کردم و برای بررسی دوباره زمان گذاشتم.",
    "m": "وقتی اطلاعات ناقص بود، فرض‌ها و ریسک تصمیم را روشن و زمان بازنگری تعیین کردم."
   }
  ]
 },
 {
  "id": "learning",
  "icon": "📈",
  "name": "یادگیری و توسعه فردی",
  "area": "توانمندی مکمل · حوزه خودم",
  "describe": "گرفتن بازخورد، تمرین در کار واقعی و بررسی تغییر رفتار.",
  "questions": [
   {
    "s": "درباره یکی از رفتارهای کاری خود از فردی مرتبط بازخورد مشخص خواستم.",
    "m": "درباره اثر یکی از رفتارهای مدیریتی خود، از همکار یا عضو تیم بازخورد مشخص گرفتم."
   },
   {
    "s": "از بازخوردی که گرفتم، یک تغییر کوچک و مشخص در رفتارم تعریف کردم.",
    "m": "بازخورد دریافت‌شده را به یک تغییر رفتاری روشن تبدیل کردم."
   },
   {
    "s": "آن تغییر را در یک موقعیت واقعی کاری تمرین کردم.",
    "m": "برای تمرین رفتار جدید، یک موقعیت واقعی در کار انتخاب کردم و آن را اجرا کردم."
   },
   {
    "s": "پس از تمرین، بررسی کردم که رفتارم بهتر شده یا هنوز به اصلاح نیاز دارد.",
    "m": "پس از تمرین، با شواهد یا بازخورد بررسی کردم که رفتار مورد نظرم تغییر کرده است."
   }
  ]
 }
];
const IDEAS={
self:{s:["در گفت‌وگوهای حساس، پیش از پاسخ شتاب‌زده یک سؤال روشن‌کننده بپرسم.","در سه موقعیت واقعی، مشاهده را از برداشت جدا و پیام آغازین را بازنویسی کنم.","گفت‌وگوی تحویل کار یا پاسخ به اعتراض همکار.","تعداد گفت‌وگوهایی که با سؤال روشن‌کننده شروع شد و یک بازخورد از همکار."],m:["در اختلاف‌های میان‌واحدی، فرض اولیه خود را آشکار و پیش از تصمیم آزمون کنم.","در سه نشست با همتایان، یک فرض اولیه و یک شاهد مخالف یا تأییدکننده را ثبت کنم.","نشست تصمیم‌گیری میان واحدهای مالی، منابع انسانی، فروش یا عملیات.","سه تصمیم با فرض ثبت‌شده و بازخورد یکی از مدیران همتا."]},
efficacy:{s:["در مواجهه با کار دشوار، یک اقدام قابل کنترل را با کمک مناسب شروع کنم.","یک وظیفه جدید را به سه گام تقسیم و هر هفته مانع و پیشرفت را مرور کنم.","پذیرش یک مسئولیت جدید یا حل مسئله تکرارشونده شیفت.","تکمیل دو گام واقعی و توضیح یک مانع که با حمایت مناسب حل شده است."],m:["در مسئله پیچیده، اقدام آزمایشی کم‌ریسک را طراحی و تا بازنگری پیگیری کنم.","یک موضوع مبهم را به دو اقدام محدود با معیار نتیجه و دریافت بازخورد تبدیل کنم.","جلسه هماهنگی با واحد مالی، فروش یا فناوری اطلاعات.","ثبت دو اقدام، یک بازنگری و شواهد تغییر در پیشرفت کار."]},
time:{s:["برای روز کاری، سه اولویت واقعی تعریف و پیش از قول جدید ظرفیت را بررسی کنم.","آغاز هر شیفت، سه خروجی بنویسم و پایان شیفت میزان تحقق و علت انحراف را مرور کنم.","برنامه شیفت، تحویل روزانه یا پشتیبانی مشتری.","ثبت دست‌کم هشت روز کاری همراه با اولویت، زمان واقعی و علت تغییر برنامه."],m:["زمان تصمیم‌سازی مهم را حفاظت و تعهدات چندواحدی را واقع‌بینانه تنظیم کنم.","در هر هفته دو بازه تمرکز ثبت و هنگام پذیرش پروژه جدید هزینه فرصت را بررسی کنم.","برنامه هفتگی مدیریت و جلسات مشترک منابع انسانی، فروش یا مالی.","اجرای حداقل چهار بازه تمرکز و ثبت دو تصمیم اولویت‌گذاری با دلیل."]},
problem:{s:["پیش از اقدام اصلاحی، یک مسئله را با شواهد و علت احتمالی توصیف کنم.","برای دو مسئله روزمره، مشاهده، دو علت محتمل، اقدام و نتیجه را ثبت کنم.","اختلاف داده، تحویل شیفت یا خطای خدمت‌رسانی.","دو برگه تحلیل مسئله همراه با شاهد و نتیجه بعد از اقدام."],m:["در یک مسئله میان‌واحدی، چند فرضیه را با داده بررسی و نتیجه اقدام را پایش کنم.","برای دو مسئله، یک معیار خط پایه، دو فرضیه علّی و یک شاخص بازنگری تعیین کنم.","تحلیل انحراف خدمات، هزینه، فروش یا فرایند داخلی.","دو گزارش مسئله با داده اولیه، علت آزموده‌شده و نتیجه پایش."]},
judgment:{s:["برای تصمیم حساس، معیار، مرز اختیار و پیامد کار را روشن کنم.","در سه تصمیم، گزینه انتخابی، یک ریسک و صاحب اختیار را کوتاه ثبت کنم.","توقف سفارش، کنترل کیفیت، ارجاع مورد مالی یا امنیت اطلاعات.","سه تصمیم ثبت‌شده با معیار، ریسک و اقدام در مرز اختیار."],m:["برای تصمیم‌های کلیدی، گزینه‌ها و Trade-off را روشن و قابل بازنگری کنم.","برای دو تصمیم چندواحدی، حداقل دو گزینه و پیامدهای مالی، انسانی و اجرایی را مقایسه کنم.","جلسه قرارداد، تغییر فرایند یا سرمایه‌گذاری محدود.","دو یادداشت تصمیم با گزینه‌ها، ریسک و زمان بازنگری."]},
learning:{s:["بازخورد را به یک رفتار مشخص در کار تبدیل و اثرش را پیگیری کنم.","هر هفته از یک همکار بازخورد رفتاری بگیرم و یک تغییر کوچک را در عمل آزمایش کنم.","تحویل شیفت، گفت‌وگو با همکار یا ارائه گزارش.","چهار بازخورد ثبت‌شده و دو مثال از تغییر واقعی رفتار."],m:["بازخورد همتایان را به هدف توسعه رفتاری و تمرین در کار تبدیل کنم.","در دو جلسه مهم، از همتایان بازخورد بگیرم و یک رفتار مشخص را در جلسه بعد اصلاح کنم.","تسهیل جلسه بین‌واحدی یا گفت‌وگوی بازخورد با سرپرستان.","دو چرخه بازخورد، تمرین و مشاهده تغییر رفتار."]}
};
const GOALS={
self:{s:"تا چهار هفته آینده، در سه گفت‌وگوی کاری دشوار واکنش خود را سنجیده مدیریت و نتیجه را با بازخورد بررسی کنم.",m:"تا چهار هفته آینده، در سه نشست بین‌واحدی پیش‌فرض‌هایم را پیش از قضاوت بررسی و کیفیت گفت‌وگو را با بازخورد بسنجم."},
efficacy:{s:"در چهار هفته آینده، برای یک وظیفه دشوار سه گام اجرایی تعریف و حداقل دو گام را با پیگیری کامل انجام دهم.",m:"در چهار هفته آینده، در یک چالش مبهم میان‌واحدی دو اقدام محدود با معیار نتیجه اجرا و بازنگری کنم."},
time:{s:"طی چهار هفته، در دست‌کم هشت روز کاری اولویت‌ها را مشخص و تعهدات زمانی واقع‌بینانه ثبت کنم.",m:"در چهار هفته آینده، حداقل چهار بازه تمرکز را حفظ و دو تصمیم اولویت‌گذاری مستند انجام دهم."},
problem:{s:"در چهار هفته آینده، دو مسئله واقعی را با شواهد و آزمون علت تحلیل و نتیجه اقدام را پیگیری کنم.",m:"در چهار هفته آینده، برای دو مسئله بین‌واحدی چند علت محتمل را بررسی و اثر تصمیم را با داده پایش کنم."},
judgment:{s:"طی چهار هفته، برای سه تصمیم حساس معیار، ریسک و مرز اختیار را روشن و قابل پیگیری ثبت کنم.",m:"در چهار هفته آینده، دو تصمیم مهم را با مقایسه گزینه‌ها، ریسک و پیامدهای بین‌واحدی مستند کنم."},
learning:{s:"در چهار هفته آینده، چهار بازخورد رفتاری دریافت و حداقل دو تغییر مشخص را در کار آزمایش کنم.",m:"در چهار هفته آینده، دو چرخه کامل دریافت بازخورد، اصلاح رفتار و مرور اثر را در جلسات مدیریتی اجرا کنم."}
};
const PLAN_FIELDS=[
["goal","هدف توسعه‌ای","textarea",true],
["behavior","رفتار قابل مشاهده","textarea",true],
["practice","اقدام و تمرین واقعی","textarea",true],
["situation","موقعیت کاری تمرین","textarea",false],
["evidence","شاهد پیشرفت و معیار موفقیت","textarea",true],
["support","فرد بازخورددهنده / حمایت مورد نیاز","text",false],
["obstacle","مانع محتمل و راه مواجهه","textarea",false],
["review","زمان بررسی پیشرفت","text",false]
];
let role="supervisors",state={schema:1,answers:{},notes:{},plan:null,personName:""},activeDim=0,profile=null;
const el=id=>document.getElementById(id),k=(id,i)=>id+"-"+i;
const fa=n=>String(n).replace(/\d/g,c=>"۰۱۲۳۴۵۶۷۸۹"[+c]);
const esc=v=>String(v==null?"":v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function initialRole(){
 const q=new URLSearchParams(location.search).get("audience");
 if(ROLE_LABEL[q])return q;
 try{const raw=JSON.parse(localStorage.getItem("behparvar_session1_v4")||"{}");if(ROLE_LABEL[raw.audience])return raw.audience;}catch(e){}
 return "supervisors";
}
function read(){try{const v=JSON.parse(localStorage.getItem(STORAGE+role)||"{}");if(v&&typeof v==="object"&&!Array.isArray(v))return {schema:1,answers:v.answers&&typeof v.answers==="object"?v.answers:{},notes:v.notes&&typeof v.notes==="object"?v.notes:{},plan:v.plan&&typeof v.plan==="object"?v.plan:null,personName:typeof v.personName==="string"?v.personName:""};}catch(e){}return {schema:1,answers:{},notes:{},plan:null};}
function save(){try{localStorage.setItem(STORAGE+role,JSON.stringify(state));return true;}catch(e){return false;}}
function countDone(dim){return AREAS[dim].questions.reduce((n,_,i)=>n+(Object.prototype.hasOwnProperty.call(state.answers,k(AREAS[dim].id,i))?1:0),0);}
function totalDone(){return AREAS.reduce((s,_,i)=>s+countDone(i),0);}
function updateProgress(){
 const done=totalDone();el("selfProgressPercent").textContent=fa(Math.round(100*done/24))+"٪";
 el("selfProgressFill").style.width=(done/24*100)+"%";
 el("selfCounter").textContent=fa(done)+" از ۲۴ رفتار پاسخ داده شده";
 el("selfDimNav").querySelectorAll("button").forEach((b,i)=>{const n=countDone(i);b.dataset.complete=String(n===4);b.setAttribute("aria-current",i===activeDim?"step":"false");const small=b.querySelector("small");if(small)small.textContent=n===4?"✓ تکمیل شده":fa(n)+" از ۴ پاسخ";});
}
function renderNav(){
 el("selfDimNav").innerHTML=AREAS.map((d,i)=>'<button type="button" data-dim="'+i+'" aria-current="'+(i===activeDim?"step":"false")+'"><span>'+d.icon+" "+esc(d.name)+'</span><small>'+fa(countDone(i))+' از ۴ پاسخ</small></button>').join("");
}
function renderQuestions(focus=false){
 const d=AREAS[activeDim];
 el("selfQuestions").innerHTML='<div class="bp-self-domain-head"><span class="bp-self-area">'+esc(d.area)+'</span><h3 id="selfDimTitle" tabindex="-1">'+d.icon+' '+esc(d.name)+'</h3><p>'+esc(d.describe)+'</p></div>'+
 d.questions.map((q,i)=>{
 const id=k(d.id,i),value=state.answers[id],title=role==="managers"?q.m:q.s;
 const options=[1,2,3,4,5,0];
 return '<fieldset class="bp-self-question"><legend>'+fa(i+1)+'. '+esc(title)+'</legend><div class="bp-self-answers">'+options.map(v=>'<label'+(v===0?' class="na"':'')+'><input type="radio" name="self-'+id+'" data-answer="'+esc(id)+'" value="'+v+'"'+(value===v?' checked':'')+'><span>'+(v===0?"فرصت مشاهده نداشتم":fa(v)+" · "+LEVEL_LABELS[v-1])+'</span></label>').join("")+'</div></fieldset>';
 }).join("")+
 '<details class="bp-self-note"><summary>📝 یک نمونه واقعی از رفتارم (اختیاری)</summary><label for="selfNote">یک موقعیت واقعی و کوتاه بنویسید؛ از اطلاعات محرمانه استفاده نکنید.</label><textarea id="selfNote" rows="2" placeholder="مثلاً در جلسه اخیر، پیش از تصمیم نظر واحد مالی را پرسیدم.">'+esc(state.notes[d.id]||"")+'</textarea></details>';
 el("selfPrev").disabled=activeDim===0;
 el("selfNext").textContent=activeDim===AREAS.length-1?"مرور پاسخ‌ها":"حوزه بعدی ←";
 renderNav();updateProgress();
 if(focus){el("selfDimTitle").focus({preventScroll:true});el("assessment").scrollIntoView({block:"start",behavior:"smooth"});}
}
function compute(){
 return AREAS.map(d=>{
 let valid=[],na=0;
 d.questions.forEach((q,i)=>{const x=state.answers[k(d.id,i)];if(x===0)na++;else if(Number.isInteger(x)&&x>=1&&x<=5)valid.push(x);});
 const mean=valid.length>=3?valid.reduce((a,b)=>a+b,0)/valid.length:null;
 return {id:d.id,name:d.name,icon:d.icon,mean,answered:valid.length,na,describe:d.describe,category:d.area};
 });
}
function resultOrder(rows){return rows.filter(x=>x.mean!==null).sort((a,b)=>a.mean-b.mean);}
function drawRadar(rows){
 const place=el("selfRadarChart"),valid=rows.every(x=>x.mean!==null);
 if(!valid){place.innerHTML='<div class="bp-self-radar-empty">برای رسم نمودار شعاعی، در همه شش شایستگی حداقل سه رفتار قابل مشاهده لازم است. نمودارهای میله‌ایِ حوزه‌های دارای شواهد کافی در ادامه نمایش داده شده‌اند.</div>';return;}
 const cx=300,cy=215,r=130,coords=(n,i)=>{const angle=(-90+i*60)*Math.PI/180;return [(cx+Math.cos(angle)*n).toFixed(1),(cy+Math.sin(angle)*n).toFixed(1)];};
 const short=["خودآگاهی","خودکارآمدی","مدیریت زمان","حل مسئله","قضاوت حرفه‌ای","یادگیری مستمر"];
 let out='<svg viewBox="0 0 600 440" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="نمودار شعاعی شش شایستگی، با محورهای یک تا پنج" focusable="false">';
 for(let n=1;n<=5;n++){out+='<polygon points="'+rows.map((_,i)=>coords(r*n/5,i).join(",")).join(" ")+'" fill="'+(n%2===0?"#edf3fa":"none")+'" stroke="#cfdae9" stroke-width="1.3"/>';}
 rows.forEach((d,i)=>{const [x,y]=coords(r,i);out+='<line x1="'+cx+'" y1="'+cy+'" x2="'+x+'" y2="'+y+'" stroke="#c2d0e1" stroke-width="1.5"/>';});
 out+='<polygon points="'+rows.map((d,i)=>coords(r*d.mean/5,i).join(",")).join(" ")+'" fill="#467daa" fill-opacity=".24" stroke="#194c7b" stroke-width="3.5" stroke-linejoin="round"/>';
 rows.forEach((d,i)=>{let [x,y]=coords(r*d.mean/5,i);out+='<circle cx="'+x+'" cy="'+y+'" r="5" fill="#17487b" stroke="#fff" stroke-width="2"/>';});
 short.forEach((s,i)=>{let [x,y]=coords(r+48,i);out+='<text x="'+x+'" y="'+y+'" text-anchor="middle" font-size="17" font-weight="700" fill="#17376c" direction="rtl">'+esc(s)+'</text>';});
 out+='<text x="'+cx+'" y="'+(cy-r-11)+'" text-anchor="start" font-size="14" fill="#546983">۵</text></svg>';
 place.innerHTML=out;
}

function showResult(){
 const missing=AREAS.findIndex((d,i)=>countDone(i)<4);
 if(missing!==-1){activeDim=missing;renderQuestions(true);el("selfMessage").textContent="برای ساخت پروفایل، ابتدا به همه ۲۴ عبارت پاسخ دهید. در صورت نداشتن فرصت مشاهده، همان گزینه را انتخاب کنید.";return;}
 profile=compute();
 const known=resultOrder(profile);
 el("selfMessage").textContent="";
 el("selfParticipantLabel").textContent=state.personName?"پروفایل شخصی: "+state.personName:"پروفایل شخصی بدون نام";
 drawRadar(profile);
 const note=profile.filter(x=>x.mean===null);
 el("selfEvidenceNote").textContent="میانگین‌های زیر بر اساس گزارش رفتاری خود شما در چهار هفته اخیرند؛ مقایسه با دیگران یا گواهی شایستگی نیستند."+(note.length?" برای "+note.map(x=>x.name).join(" و ")+"، تعداد رفتارهای قابل مشاهده کمتر از سه مورد بوده و نمره ارائه نمی‌شود.":"");
 el("selfProfileChart").innerHTML=profile.map(d=>
 '<div class="bp-self-chart-item"><div><strong>'+d.icon+" "+esc(d.name)+'</strong><small>'+(d.mean===null?"شواهد کافی نیست":fa(d.answered)+" پاسخ قابل محاسبه")+'</small></div><div class="bp-self-track" role="img" aria-label="'+esc(d.name)+" "+(d.mean===null?"داده کافی نیست":"میانگین "+(Math.round(d.mean*10)/10).toLocaleString("fa-IR")+" از پنج")+'"><span style="width:'+(d.mean===null?0:Math.round(d.mean/5*100))+'%"></span></div><div class="bp-self-chart-number">'+(d.mean===null?"—":(Math.round(d.mean*10)/10).toLocaleString("fa-IR")+" / ۵")+'</div></div>').join("");
 const examples=AREAS.filter(d=>String(state.notes[d.id]||"").trim());
 const evidenceBox=el("selfExamplesDetails");evidenceBox.hidden=!examples.length;el("selfEvidenceExamples").innerHTML=examples.map(d=>"<p><strong>"+d.icon+" "+esc(d.name)+":</strong> "+esc(state.notes[d.id])+"</p>").join("");
 const strong=[...known].reverse().slice(0,2),opps=known.slice(0,2);
 el("selfStrengthText").textContent=strong.length?strong.map(x=>x.name).join(" و ")+" در این دوره بیشتر در رفتارهای گزارش‌شده دیده شده‌اند؛ از این ظرفیت‌ها برای تمرین حوزه دیگر کمک بگیرید.":"برای جمع‌بندی نقطه اتکا، شواهد قابل مشاهده بیشتری ثبت کنید.";
 el("selfOpportunityText").textContent=opps.length?opps.map(x=>x.name).join(" و ")+" در چهار هفته اخیر کمتر تکرار شده‌اند. این نتیجه برچسب ضعف نیست؛ می‌تواند مبنای انتخاب تمرین بعدی شما باشد.":"برای پیشنهاد یک اولویت توسعه، پاسخ قابل مشاهده بیشتری لازم است.";
 const target=el("selfIdpTarget");
 target.innerHTML=known.map(x=>'<option value="'+x.id+'">'+x.icon+" "+esc(x.name)+" — "+(Math.round(x.mean*10)/10).toLocaleString("fa-IR")+"</option>").join("");
 if(!known.length){
 el("selfGenerateIdp").disabled=true;el("selfIdpRecommendation").textContent="برای ایجاد IDP مبتنی بر نتیجه، حداقل سه رفتار در یکی از حوزه‌ها باید قابل مشاهده باشد. می‌توانید پاسخ‌ها را اصلاح کنید.";
 el("selfIdpFields").innerHTML="";el("selfSaveIdp").disabled=true;
 }else{
 el("selfGenerateIdp").disabled=false;el("selfSaveIdp").disabled=false;
 const stored=state.plan&&known.some(x=>x.id===state.plan.target)?state.plan:null;
 target.value=stored?stored.target:known[0].id;
 buildIdpFields(stored||recommend(target.value));
 }
 el("results").hidden=false;
 el("results").scrollIntoView({block:"start",behavior:"smooth"});
}
function recommend(target){
 const area=AREAS.find(x=>x.id===target)||AREAS[0],v=IDEAS[area.id][role==="managers"?"m":"s"];
 const goal=GOALS[area.id][role==="managers"?"m":"s"],behavior=v[0],practice=v[1],situation=v[2],evidence=v[3];
 return {target,goal,behavior,practice,situation,evidence,
 support:role==="managers"?"یک مدیر همتا یا سرپرست مرتبط؛ بازخورد بر اساس رفتار مشاهده‌شده":"یکی از همکاران همتا یا مدیر مستقیم؛ بازخورد روی رفتار مشخص",
 obstacle:"اگر فشار کار یا تغییر اولویت مانع شد، دامنه تمرین را کاهش می‌دهم و زمان بازنگری را شفاف می‌کنم.",
 review:"بازبینی کوتاه پس از ۱۴ روز؛ ارزیابی نهایی بعد از چهار هفته"};
}
function buildIdpFields(data){
 const chosen=AREAS.find(x=>x.id===data.target);
 el("selfIdpRecommendation").innerHTML='<strong>اولویت پیشنهادی: '+(chosen?chosen.icon+" "+esc(chosen.name):"")+'</strong><p>این پیشنهاد یک نقطه شروع است، نه نسخه قطعی. آن را با مسئولیت شغلی، بازخورد همکار و محدودیت زمانی خود تطبیق دهید.</p>';
 el("selfIdpFields").innerHTML=PLAN_FIELDS.map(([id,label,type,wide])=>'<label'+(wide?' class="wide"':'')+'>'+esc(label)+(type==="textarea"?'<textarea data-plan="'+id+'" rows="2">'+esc(data[id]||"")+'</textarea>':'<input data-plan="'+id+'" value="'+esc(data[id]||"")+'">')+'</label>').join("");
 el("selfIdpStatus").textContent=state.plan?"برنامه قبلی این مسیر نمایش داده شد؛ تغییرات جدید را ذخیره کنید.":"پیشنهاد اولیه آماده است؛ می‌توانید آن را ویرایش و ذخیره کنید.";
}
function currentPlan(){
 const target=el("selfIdpTarget").value;const data={target};
 el("selfIdpFields").querySelectorAll("[data-plan]").forEach(x=>{data[x.dataset.plan]=x.value.trim();});
 return data;
}
function savePlan(){if(el("results").hidden||!el("selfIdpFields").querySelector("[data-plan]"))return;
 const p=currentPlan();
 if(!p.goal||!p.practice||!p.evidence){el("selfIdpStatus").textContent="برای ذخیره، هدف، تمرین واقعی و شاهد پیشرفت را مشخص کنید.";return;}
 state.plan=p;
 el("selfIdpStatus").textContent=save()?"IDP همراه پاسخ‌ها در همین مرورگر و فقط برای این مسیر ذخیره شد.":"ذخیره مرورگر ممکن نشد؛ از گزینه کپی گزارش استفاده کنید.";
}
function reportText(){
 const rows=["به‌پرور | پروفایل خودارزیابی و برنامه توسعه فردی (IDP)","نام / کد شرکت‌کننده: "+(state.personName||"درج نشده"),"مسیر: "+ROLE_LABEL[role],"مبنای ارزیابی: چهار هفته اخیر | پرسشنامه آموزشی، نه ارزیابی معتبر روان‌سنجی", "","پروفایل شایستگی‌ها"];
 (profile||compute()).forEach(d=>rows.push(d.name+": "+(d.mean===null?"شواهد کافی نیست":(Math.round(d.mean*10)/10).toLocaleString("fa-IR")+" از ۵") ));
 rows.push("","شواهد رفتاری اختیاری");AREAS.forEach(d=>{if(String(state.notes[d.id]||"").trim())rows.push(d.name+": "+state.notes[d.id]);});
 rows.push("","جمع‌بندی","نقطه اتکا: "+el("selfStrengthText").textContent,"فرصت توسعه: "+el("selfOpportunityText").textContent,"","برنامه توسعه فردی");
 const p=currentPlan(),d=AREAS.find(x=>x.id===p.target);rows.push("حوزه: "+(d?.name||""));
 PLAN_FIELDS.forEach(([id,label])=>rows.push(label+": "+(p[id]||"تکمیل نشده")));
 rows.push("","این گزارش صرفاً برای یادگیری و گفت‌وگوی بازخوردی تهیه شده است.");
 return rows.join("\n");
}
function copyReport(){
 const v=reportText(),preview=el("selfReportPreview");preview.value=v;preview.hidden=false;
 const status=el("selfIdpStatus");
 if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(v).then(()=>status.textContent="پروفایل و IDP کپی شدند.").catch(()=>status.textContent="کپی خودکار ممکن نشد؛ متن آماده در کادر پایین را دستی کپی کنید.");
 else status.textContent="متن گزارش در کادر پایین برای کپی دستی آماده است.";
}
function setup(){
 role=initialRole();state=read();el("selfRoleName").textContent=ROLE_LABEL[role];
 el("selfPersonName").value=state.personName||"";
 el("selfPersonName").addEventListener("input",e=>{state.personName=e.target.value.trim().slice(0,60);save();if(profile)el("selfParticipantLabel").textContent=state.personName?"پروفایل شخصی: "+state.personName:"پروفایل شخصی بدون نام";});
 document.querySelectorAll("[data-self-role]").forEach(b=>{
 b.setAttribute("aria-pressed",String(b.dataset.selfRole===role));
 b.addEventListener("click",()=>{
 if(b.dataset.selfRole===role)return;
 const u=new URL(location.href);u.searchParams.set("audience",b.dataset.selfRole);location.assign(u.href);
 });});
 document.querySelectorAll("[data-role-return],[data-role-special]").forEach(a=>{
 const original=a.getAttribute("href");const [path,fragment]=original.split("#");
 a.href=path+"?audience="+encodeURIComponent(role)+(fragment?"#"+fragment:"");
 });
 renderNav();renderQuestions();
 el("selfDimNav").addEventListener("click",e=>{const b=e.target.closest("[data-dim]");if(!b)return;activeDim=Number(b.dataset.dim);renderQuestions(true);});
 el("selfQuestions").addEventListener("change",e=>{
 if(!e.target.matches("[data-answer]"))return;
 state.answers[e.target.dataset.answer]=Number(e.target.value);
 if(!save())el("selfMessage").textContent="مرورگر اجازه ذخیره نداده است؛ پاسخ‌ها تا بازبودن صفحه باقی می‌مانند.";
 updateProgress();renderNav();
 if(!el("results").hidden){el("results").hidden=true;el("selfMessage").textContent="پس از اصلاح پاسخ‌ها، دکمه مشاهده پروفایل را بزنید تا تحلیل تازه محاسبه شود.";}
 });
 el("selfQuestions").addEventListener("input",e=>{
 if(e.target.id==="selfNote"){state.notes[AREAS[activeDim].id]=e.target.value;save();}
 });
 el("selfPrev").addEventListener("click",()=>{if(activeDim>0){activeDim--;renderQuestions(true);}});
 el("selfNext").addEventListener("click",()=>{if(activeDim<5){activeDim++;renderQuestions(true);}else if(totalDone()===24)showResult();else el("selfMessage").textContent="برای مشاهده گزارش، ابتدا همه حوزه‌ها را پاسخ دهید.";});
 el("selfViewResult").addEventListener("click",showResult);
 el("selfEditAnswers").addEventListener("click",()=>{el("assessment").scrollIntoView({block:"start",behavior:"smooth"});});
 el("selfGenerateIdp").addEventListener("click",()=>{
 if(!el("selfIdpTarget").value)return;
 const target=el("selfIdpTarget").value;state.plan=null;buildIdpFields(recommend(target));el("selfIdpStatus").textContent="پیشنهاد تازه جایگزین متن فرم شد؛ برای نگهداری آن «ذخیره IDP» را بزنید.";
 });
 el("selfSaveIdp").addEventListener("click",savePlan);
 el("selfCopyReport").addEventListener("click",copyReport);
 el("selfPrintReport").addEventListener("click",()=>{if(!el("results").hidden)window.print();});
 el("selfClearAll").addEventListener("click",()=>{
 if(!confirm("تمام پاسخ‌ها و برنامه توسعه فردی همین مسیر روی این دستگاه پاک شوند؟"))return;
 try{localStorage.removeItem(STORAGE+role);}catch(e){}
 state={schema:1,answers:{},notes:{},plan:null,personName:""};el("selfPersonName").value="";profile=null;activeDim=0;el("results").hidden=true;renderQuestions();el("selfMessage").textContent="اطلاعات این مسیر در صفحه پاک شدند.";el("assessment").scrollIntoView({block:"start",behavior:"auto"});
 });
 if(totalDone()===24)el("selfMessage").textContent="پاسخ‌های قبلی شما بازیابی شدند. برای دیدن تحلیل، «مشاهده پروفایل و IDP» را انتخاب کنید.";
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",setup);else setup();
})(window);
