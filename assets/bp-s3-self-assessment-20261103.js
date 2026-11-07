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
const IDEAS={"self":{"s":["قبل از پاسخ در گفت‌وگوهای دشوار مکث کنم و سؤال روشن‌کننده بپرسم.","در سه موقعیت واقعی، برداشت خودم را از واقعیت جدا و یک سؤال روشن‌کننده ثبت کنم.","گفت‌وگو با همکار درباره اختلاف‌نظر یا نتیجه کار.","سه نمونه ثبت‌شده و یک بازخورد درباره شیوه پاسخ‌دادن."],"m":["در گفت‌وگوهای دشوار، پیش‌فرض‌های خود را بررسی و با پرسش روشن کنم.","در سه تصمیم یا گفت‌وگوی حساس، یک فرض اولیه را بنویسم و پیش از نتیجه‌گیری آن را بررسی کنم.","جلسه تصمیم‌گیری، بازنگری عملکرد یا گفت‌وگوی مدیریتی.","سه نمونه مستند و یک بازخورد درباره کیفیت گفت‌وگو."]},"efficacy":{"s":["برای کار دشوار، گام نخست قابل انجام را مشخص و پیگیری کنم.","یک مسئولیت چالش‌برانگیز را به سه گام تقسیم و پیشرفت را هر هفته مرور کنم.","مسئولیتی تازه یا مشکلی که انجام آن به تعویق افتاده است.","تکمیل حداقل دو گام و توضیح نحوه عبور از یک مانع."],"m":["برای یک چالش مبهم، اقدام کوچک اما سنجیده را آغاز و پیگیری کنم.","یک مسئله پیچیده را به دو اقدام آزمایشی با معیار مشخص تقسیم و نتیجه را بازنگری کنم.","یک هدف مدیریتی که راه‌حل آن از ابتدا روشن نیست.","دو اقدام ثبت‌شده، یک بازنگری و شاهد پیشرفت."]},"time":{"s":["هر روز مهم‌ترین کارهایم را مشخص و درباره تعهدهای زمانی واقع‌بینانه تصمیم بگیرم.","در آغاز دست‌کم هشت روز کاری، دو اولویت اصلی را ثبت و پایان روز مرور کنم.","برنامه معمول روزانه، پیگیری کارها و درخواست‌های جدید.","هشت روز ثبت اولویت و دو مثال از مدیریت بهتر زمان."],"m":["برای اولویت‌های اثرگذار، زمان تمرکز ایجاد و تعهدها را بازنگری کنم.","هر هفته دو بازه تمرکز پیش‌بینی و پیش از تعهد جدید ظرفیت را بررسی کنم.","برنامه کاری هفتگی، جلسات و تصمیم‌های مهم.","چهار بازه تمرکز تحقق‌یافته و دو تصمیم اولویت‌گذاری مستند."]},"problem":{"s":["پیش از ارائه راه‌حل، مسئله و علت احتمالی را با شواهد بررسی کنم.","برای دو مشکل واقعی، مشاهده، دو علت محتمل، اقدام و نتیجه را کوتاه بنویسم.","هر مسئله تکراری در کار روزمره.","دو برگه تحلیل کوتاه همراه با نتیجه بعد از اقدام."],"m":["مسئله مهم را با داده تعریف و چند علت محتمل را پیش از تصمیم بررسی کنم.","برای دو موضوع، معیار نتیجه، دو فرضیه و زمان بازنگری تعریف کنم.","مسئله‌ای در عملکرد، کیفیت، منابع یا همکاری کاری.","دو تحلیل مسئله همراه با شواهد اولیه و نتیجه بررسی."]},"judgment":{"s":["در تصمیم‌های حساس، دلیل انتخاب و محدودیت اختیارم را روشن کنم.","برای سه تصمیم کاری، گزینه انتخابی، یک پیامد و صاحب اختیار را ثبت کنم.","یک تصمیم کاری با چند راه ممکن یا پیامد مهم.","سه تصمیم مستند با دلیل انتخاب و پیگیری پیامد."],"m":["در تصمیم‌های مهم، گزینه‌ها و پیامدها را قبل از انتخاب مقایسه کنم.","برای دو تصمیم، دست‌کم دو گزینه، یک ریسک و زمان بازنگری را ثبت کنم.","تصمیمی درباره منابع، اولویت‌ها یا تغییر روش کار.","دو یادداشت تصمیم و شواهد بازنگری در موعد تعیین‌شده."]},"learning":{"s":["بازخورد را به یک رفتار مشخص و قابل تمرین تبدیل کنم.","هر هفته از یک فرد مرتبط بازخورد بگیرم و یک تغییر رفتاری را تمرین کنم.","یک فعالیت کاری که امکان دریافت بازخورد دارد.","چهار بازخورد و دو مثال واقعی از رفتار اصلاح‌شده."],"m":["بازخورد همکاران را در تغییر رفتار مدیریتی خود به کار بگیرم.","در دو موقعیت کاری، بازخورد بگیرم و در موقعیت بعدی رفتارم را اصلاح کنم.","گفت‌وگو، جلسه یا تصمیمی که دیگران اثر رفتاری آن را می‌بینند.","دو چرخه بازخورد، تمرین و بررسی اثر."]}};
const GOALS={"self":{"s":"طی چهار هفته، در سه گفت‌وگوی دشوار پیش از پاسخ مکث کنم و با یک سؤال، موضوع را روشن کنم.","m":"طی چهار هفته، در سه گفت‌وگوی مدیریتی فرض اولیه خود را بررسی و نتیجه را با بازخورد بازبینی کنم."},"efficacy":{"s":"در چهار هفته، برای یک کار دشوار سه گام تعریف و دست‌کم دو گام را با پیگیری انجام دهم.","m":"در چهار هفته، یک چالش پیچیده را با دو اقدام محدود پیش ببرم و نتیجه آن‌ها را بررسی کنم."},"time":{"s":"در چهار هفته، در هشت روز کاری دو اولویت اصلی را ثبت و پایان روز ارزیابی کنم.","m":"در چهار هفته، چهار بازه تمرکز اجرا و دو تصمیم مهم درباره اولویت‌ها را مستند کنم."},"problem":{"s":"طی چهار هفته، دو مشکل واقعی را با شواهد و علت‌های محتمل بررسی و نتیجه اقدام را ثبت کنم.","m":"طی چهار هفته، دو مسئله مدیریتی را با شواهد، فرضیه‌های جایگزین و معیار نتیجه بررسی کنم."},"judgment":{"s":"در چهار هفته، سه تصمیم کاری را با دلیل انتخاب، پیامد و حدود اختیار ثبت کنم.","m":"در چهار هفته، دو تصمیم مهم را با مقایسه گزینه‌ها، ریسک و زمان بازنگری مستند کنم."},"learning":{"s":"طی چهار هفته، چهار بازخورد بگیرم و دو تغییر مشخص در رفتار کاری خود تمرین کنم.","m":"طی چهار هفته، دو چرخه دریافت بازخورد، اصلاح رفتار و بازنگری نتیجه را اجرا کنم."}};
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
let role="supervisors",state={schema:2,answers:{},notes:{},outcomes:{},plan:null,planDraft:null,reflection:"",personName:"",profileViewed:false,planNeedsReview:false},activeDim=0,profile=null;
const el=id=>document.getElementById(id),k=(id,i)=>id+"-"+i;
const fa=n=>String(n).replace(/\d/g,c=>"۰۱۲۳۴۵۶۷۸۹"[+c]);
const esc=v=>String(v==null?"":v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function initialRole(){
 const q=new URLSearchParams(location.search).get("audience");
 if(ROLE_LABEL[q])return q;
 try{const raw=JSON.parse(localStorage.getItem("behparvar_session1_v4")||"{}");if(ROLE_LABEL[raw.audience])return raw.audience;}catch(e){}
 return "supervisors";
}
function read(){try{const v=JSON.parse(localStorage.getItem(STORAGE+role)||"{}");if(v&&typeof v==="object"&&!Array.isArray(v))return {schema:2,answers:v.answers&&typeof v.answers==="object"?v.answers:{},notes:v.notes&&typeof v.notes==="object"?v.notes:{},outcomes:v.outcomes&&typeof v.outcomes==="object"?v.outcomes:{},plan:v.plan&&typeof v.plan==="object"?v.plan:null,planDraft:v.planDraft&&typeof v.planDraft==="object"?v.planDraft:null,reflection:typeof v.reflection==="string"?v.reflection:"",personName:typeof v.personName==="string"?v.personName:"",profileViewed:v.profileViewed===true,planNeedsReview:v.planNeedsReview===true};}catch(e){}return {schema:2,answers:{},notes:{},outcomes:{},plan:null,planDraft:null,reflection:"",personName:"",profileViewed:false,planNeedsReview:false};}
function save(){try{localStorage.setItem(STORAGE+role,JSON.stringify(state));return true;}catch(e){return false;}}
function setStage(name){const badge={assessment:"discover",profile:"insight",idp:"action"}[name];document.querySelectorAll("[data-reward]").forEach(x=>x.setAttribute("aria-current",x.dataset.reward===badge?"step":"false"));}
function countDone(dim){return AREAS[dim].questions.reduce((n,_,i)=>n+(Object.prototype.hasOwnProperty.call(state.answers,k(AREAS[dim].id,i))?1:0),0);}
function totalDone(){return AREAS.reduce((s,_,i)=>s+countDone(i),0);}
/* Three personal milestones, not a ranking or competency score. */
function rewardStatus(){
 const discover=totalDone()===24;
 const insight=discover&&state.profileViewed===true&&String(state.reflection||"").trim().length>=8;
 const p=state.plan;
 const action=discover&&!!p&&!state.planDraft&&!state.planNeedsReview&&["goal","behavior","practice","evidence","review"].every(k=>typeof p[k]==="string"&&p[k].trim().length>0);
 return {discover,insight,action,score:(discover?30:0)+(insight?30:0)+(action?40:0)};
}
function updateRewards(){
 const r=rewardStatus();
 el("selfRewardScore").textContent=fa(r.score)+" از ۱۰۰ امتیاز";
 el("selfRewardFill").style.width=r.score+"%";
 el("selfRewardTrack").setAttribute("aria-valuenow",String(r.score));
 for(const [key,title] of [["discover","شناخت خود"],["insight","بینش فردی"],["action","برنامه اقدام"]]){
  const item=document.querySelector('[data-reward="'+key+'"]');
  if(!item)continue;
  item.classList.toggle("earned",r[key]);
  item.setAttribute("aria-label","نشان "+title+"، "+(r[key]?"دریافت شد":"هنوز دریافت نشده"));
 }
 el("selfRewardHint").textContent=!r.discover?"نشان اول: ۲۴ پرسش را کامل کنید.":!r.insight?"نشان دوم: پروفایل را ببینید و یک جمله درباره برداشتتان از نتیجه بنویسید.":!r.action?"نشان سوم: IDP را تکمیل و ذخیره کنید.":"🏅 هر سه نشان دریافت شدند؛ برنامه شما برای پیگیری آماده است.";
 el("selfRewardFinal").textContent=r.score===100?"🏅 آفرین! سه نشان و ۱۰۰ امتیاز مسیر تکمیل شد.":r.action?"برنامه شما ثبت شد. برای دریافت نشان «بینش فردی»، یک جمله درباره پروفایل خود بنویسید.":"";
}
function updateProgress(){
 const done=totalDone();el("selfProgressPercent").textContent=fa(Math.round(100*done/24))+"٪";
 el("selfProgressFill").style.width=(done/24*100)+"%";
 el("selfCounter").textContent=fa(done)+" از ۲۴ پرسش پاسخ داده شده";
 updateRewards();
 el("selfViewResult").hidden=done!==24;
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
 return '<fieldset class="bp-self-question"><legend>'+fa(i+1)+'. '+esc(title)+'</legend><div class="bp-self-answers">'+options.map(v=>'<label'+(v===0?' class="na"':'')+'><input type="radio" name="self-'+id+'" data-answer="'+esc(id)+'" value="'+v+'" aria-label="'+(v===0?"فرصت مشاهده نداشتم":fa(v)+"، "+LEVEL_LABELS[v-1])+'"'+(value===v?' checked':'')+'><span>'+(v===0?"فرصت مشاهده نداشتم":fa(v))+'</span></label>').join("")+'</div></fieldset>';
 }).join("")+
 '<details class="bp-self-note"><summary>📝 شاهد رفتاری من؛ موقعیت و نتیجه (اختیاری)</summary>'+
 '<p>برای تحلیل قابل اتکا، یک رفتار مشخص و نتیجه قابل مشاهده آن را بنویسید. این دو نوشته به امتیاز شما اضافه نمی‌کنند و محرمانه روی همین دستگاه می‌مانند.</p>'+
 '<label for="selfNote">موقعیت و اقدام من: چه اتفاقی افتاد و من دقیقاً چه کردم؟</label>'+
 '<textarea id="selfNote" rows="3" maxlength="900" placeholder="مثلاً در یک گفت‌وگوی دشوار، پیش از پاسخ سؤال روشن‌کننده پرسیدم.">'+esc(state.notes[d.id]||"")+'</textarea>'+
 '<label for="selfOutcome">پیامد قابل مشاهده: چه تغییری رخ داد یا چه بازخوردی گرفتم؟</label>'+
 '<textarea id="selfOutcome" rows="2" maxlength="700" placeholder="مثلاً همکارم اطلاعات تازه‌ای گفت و توانستیم تصمیم را اصلاح کنیم.">'+esc((state.outcomes||{})[d.id]||"")+'</textarea>'+
 '<p class="bp-self-evidence-disclaimer">تحلیل نتیجه در پروفایل فردی نمایش داده می‌شود؛ برنامه کیفیت متن شما را به‌صورت خودکار قضاوت نمی‌کند.</p></details>';
 el("selfPrev").disabled=activeDim===0;
 el("selfNext").textContent=activeDim===AREAS.length-1?"مشاهده پروفایل من ←":"حوزه بعدی ←";
 renderNav();updateProgress();setStage("assessment");
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
 state.profileViewed=true;save();updateRewards();
 const known=resultOrder(profile);
 el("selfMessage").textContent="";
 setStage("profile");
 el("selfReflection").value=state.reflection||"";
 el("selfParticipantLabel").textContent=state.personName?"پروفایل شخصی: "+state.personName:"پروفایل شخصی بدون نام";
 drawRadar(profile);
 const note=profile.filter(x=>x.mean===null);
 el("selfEvidenceNote").textContent="میانگین‌های زیر بر اساس گزارش رفتاری خود شما در چهار هفته اخیرند؛ مقایسه با دیگران یا گواهی شایستگی نیستند."+(note.length?" برای "+note.map(x=>x.name).join(" و ")+"، تعداد رفتارهای قابل مشاهده کمتر از سه مورد بوده و نمره ارائه نمی‌شود.":"");
 el("selfProfileChart").innerHTML=profile.map(d=>
 '<div class="bp-self-chart-item"><div><strong>'+d.icon+" "+esc(d.name)+'</strong><small>'+(d.mean===null?"شواهد کافی نیست":fa(d.answered)+" پاسخ قابل محاسبه")+'</small></div><div class="bp-self-track" role="img" aria-label="'+esc(d.name)+" "+(d.mean===null?"داده کافی نیست":"میانگین "+(Math.round(d.mean*10)/10).toLocaleString("fa-IR")+" از پنج")+'"><span style="width:'+(d.mean===null?0:Math.round(d.mean/5*100))+'%"></span></div><div class="bp-self-chart-number">'+(d.mean===null?"—":(Math.round(d.mean*10)/10).toLocaleString("fa-IR")+" / ۵")+'</div></div>').join("");
 const examples=AREAS.filter(d=>String(state.notes[d.id]||"").trim());
 const evidenceBox=el("selfExamplesDetails");evidenceBox.hidden=!examples.length;el("selfEvidenceExamples").innerHTML=examples.map(d=>"<p><strong>"+d.icon+" "+esc(d.name)+":</strong> "+esc(state.notes[d.id])+"</p>").join("");
 const gap=known.length>1?known[known.length-1].mean-known[0].mean:0;
 const strong=[...known].reverse().slice(0,2),opps=known.slice(0,2);
 if(!known.length){
  el("selfStrengthText").textContent="برای دیدن الگوی رفتاری، در دست‌کم یک حوزه به شواهد بیشتری نیاز است.";
  el("selfOpportunityText").textContent="پس از مشاهده چند رفتار واقعی، یک حوزه را برای تمرین انتخاب کنید.";
 }else if(known.length===1){
  el("selfStrengthText").textContent="در حوزه «"+known[0].name+"» داده کافی برای بازاندیشی ثبت شده است.";
  el("selfOpportunityText").textContent="برای سایر حوزه‌ها مشاهده کافی وجود ندارد. اولویت را بر اساس نیاز واقعی کارتان انتخاب کنید.";
 }else if(gap<0.5){
  el("selfStrengthText").textContent="امتیاز حوزه‌ها به هم نزدیک‌اند؛ این تفاوت کوچک، قوت مشخصی را ثابت نمی‌کند. شواهد و بازخوردها را هم بررسی کنید.";
  el("selfOpportunityText").textContent="وقتی امتیازها نزدیک‌اند، اولویت توسعه را بر اساس مهم‌ترین چالش کاری انتخاب کنید، نه رتبه امتیازها.";
 }else{
  el("selfStrengthText").textContent=strong.map(x=>x.name).join(" و ")+" در پاسخ‌های این دوره نسبتاً بیشتر گزارش شده‌اند؛ با مثال و بازخورد آن را بررسی کنید.";
  el("selfOpportunityText").textContent=opps.map(x=>x.name).join(" و ")+" در این دوره کمتر گزارش شده‌اند؛ یکی از آن‌ها می‌تواند نقطه شروع تمرین باشد.";
 }
 const target=el("selfIdpTarget");
 target.innerHTML=known.map(x=>'<option value="'+x.id+'">'+x.icon+" "+esc(x.name)+" — "+(Math.round(x.mean*10)/10).toLocaleString("fa-IR")+"</option>").join("");
 if(!known.length){
 el("selfGenerateIdp").disabled=true;el("selfIdpRecommendation").textContent="برای ایجاد IDP مبتنی بر نتیجه، حداقل سه رفتار در یکی از حوزه‌ها باید قابل مشاهده باشد. می‌توانید پاسخ‌ها را اصلاح کنید.";
 el("selfIdpFields").innerHTML="";el("selfSaveIdp").disabled=true;
 }else{
 el("selfGenerateIdp").disabled=false;el("selfSaveIdp").disabled=false;
 const draft=state.planDraft&&known.some(x=>x.id===state.planDraft.target)?state.planDraft:null;
 const stored=state.plan&&known.some(x=>x.id===state.plan.target)?state.plan:null;
 const current=draft||stored;
 target.value=current?current.target:known[0].id;
 buildIdpFields(current||recommend(target.value));
 el("selfCompletion").hidden=true;
 }
 el("selfPlanOwnership").checked=false;
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
 const field=([id,label,type,wide])=>'<label'+(wide||id==="review"?' class="wide"':'')+'>'+esc(label)+(type==="textarea"?'<textarea data-plan="'+id+'" rows="2">'+esc(data[id]||"")+'</textarea>':'<input data-plan="'+id+'" value="'+esc(data[id]||"")+'">')+'</label>';
 const core=["goal","behavior","practice","evidence","review"];
 const primary=PLAN_FIELDS.filter(([id])=>core.includes(id));
 const optional=PLAN_FIELDS.filter(([id])=>!core.includes(id));
 el("selfIdpFields").innerHTML=primary.map(field).join("")+
 '<details class="bp-self-idp-optional"><summary>تکمیل اختیاری برنامه: موقعیت تمرین، پشتیبان و موانع</summary><div class="bp-self-idp-optional-grid">'+optional.map(field).join("")+'</div></details>';
 el("selfIdpStatus").textContent=state.planNeedsReview?"پاسخ‌ها تغییر کرده‌اند. لطفاً برنامه قبلی را بازبینی و دوباره ذخیره کنید.":state.planDraft?"پیش‌نویس قبلی شما بازیابی شد؛ برای نهایی‌شدن آن را ذخیره کنید.":state.plan?"برنامه ذخیره‌شده بازیابی شد؛ در صورت اصلاح دوباره ذخیره کنید.":"پیشنهاد اولیه آماده است؛ آن را با شرایط واقعی کارتان هماهنگ کنید.";
}
function currentPlan(){
 const target=el("selfIdpTarget").value;const data={target};
 el("selfIdpFields").querySelectorAll("[data-plan]").forEach(x=>{data[x.dataset.plan]=x.value.trim();});
 return data;
}
function savePlan(){
 if(el("results").hidden||!el("selfIdpFields").querySelector("[data-plan]"))return;
 const p=currentPlan();
 if(!p.goal||!p.behavior||!p.practice||!p.evidence||!p.review){
  el("selfIdpStatus").textContent="برای تکمیل IDP، هدف، رفتار قابل مشاهده، تمرین، شاهد پیشرفت و زمان بازبینی را مشخص کنید.";return;
 }
 if(!el("selfPlanOwnership").checked){
  el("selfIdpStatus").textContent="پیش از ذخیره، برنامه را با شرایط شغلی خودتان بررسی و گزینه تأیید برنامه را انتخاب کنید.";return;
 }
 const previous={plan:state.plan,planDraft:state.planDraft,planNeedsReview:state.planNeedsReview};
 state.plan=p;state.planDraft=null;state.planNeedsReview=false;
 const saved=save();
 if(!saved){
  state.plan=previous.plan;state.planDraft=p;state.planNeedsReview=previous.planNeedsReview;
  el("selfIdpStatus").textContent="ذخیره روی دستگاه ممکن نشد؛ نشان تکمیل IDP فعال نشده است. لطفاً گزارش را کپی یا به PDF تبدیل کنید.";
  el("selfCompletion").hidden=true;updateRewards();return;
 }
 updateRewards();
 el("selfIdpStatus").textContent="IDP نهایی شما در مرورگر همین گوشی ذخیره شد. اکنون نسخه گزارش را نگه دارید.";
 el("selfCompletionText").textContent="حوزه توسعه: "+(AREAS.find(d=>d.id===p.target)?.name||"")+"؛ بازبینی: "+p.review;
 el("selfCompletion").hidden=false;
 setStage("idp");
 el("selfCompletion").scrollIntoView({block:"nearest",behavior:"smooth"});
}
function reportText(){
 const rows=["به‌پرور | کارگاه توسعه شایستگی‌های معطوف به خود","پروفایل فردی و برنامه توسعه (IDP)","تاریخ: "+new Date().toLocaleDateString("fa-IR"),"نام / کد شرکت‌کننده: "+(state.personName||"درج نشده"),"مسیر: "+ROLE_LABEL[role],"مبنای ارزیابی: چهار هفته اخیر | پرسشنامه آموزشی، نه آزمون روان‌سنجی", "","پروفایل شایستگی‌ها"];
 (profile||compute()).forEach(d=>rows.push(d.name+": "+(d.mean===null?"شواهد کافی نیست":(Math.round(d.mean*10)/10).toLocaleString("fa-IR")+" از ۵") ));
 rows.push("","بازاندیشی فردی",state.reflection||"ثبت نشده");
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
function buildPrintableReport(){
 const p=currentPlan(),chosen=AREAS.find(d=>d.id===p.target);
 const rows=profile||compute();
 el("selfPrintPlan").innerHTML='<h2>کارگاه توسعه شایستگی‌های معطوف به خود</h2><p>پروفایل فردی و برنامه توسعه (IDP)</p>'+
 '<p><strong>نام / کد:</strong> '+esc(state.personName||"درج نشده")+' | <strong>مسیر:</strong> '+ROLE_LABEL[role]+' | <strong>تاریخ:</strong> '+new Date().toLocaleDateString("fa-IR")+'</p>'+
 '<h3>نتایج خودگزارشی شش شایستگی</h3><div class="bp-self-print-scores">'+rows.map(d=>'<p>'+d.icon+' <strong>'+esc(d.name)+':</strong> '+(d.mean===null?'شواهد کافی نیست':(Math.round(d.mean*10)/10).toLocaleString("fa-IR")+' از ۵')+'</p>').join("")+'</div>'+
 '<h3>بازاندیشی</h3><p>'+esc(state.reflection||"ثبت نشده")+'</p>'+
 '<h3>برنامه توسعه فردی · '+esc(chosen?.name||"")+'</h3>'+
 PLAN_FIELDS.map(([id,label])=>'<div class="bp-self-print-field"><strong>'+esc(label)+'</strong><p>'+esc(p[id]||"تکمیل نشده")+'</p></div>').join("")+
 '<p class="bp-self-print-foot">این سند صرفاً برای یادگیری و پیگیری شخصی است و نشان‌دهنده رتبه یا صلاحیت رسمی فرد نیست.</p>';
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
 el("selfReflection").addEventListener("input",e=>{state.reflection=e.target.value;save();updateRewards();});
 el("selfDimNav").addEventListener("click",e=>{const b=e.target.closest("[data-dim]");if(!b)return;activeDim=Number(b.dataset.dim);renderQuestions(true);});
 el("selfQuestions").addEventListener("change",e=>{
 if(!e.target.matches("[data-answer]"))return;
 const key=e.target.dataset.answer,next=Number(e.target.value);
 if(state.answers[key]===next)return;
 state.answers[key]=next;
 state.profileViewed=false;
 if(state.plan)state.planNeedsReview=true;
 if(!save())el("selfMessage").textContent="مرورگر اجازه ذخیره نداده است؛ پاسخ‌ها تا بازبودن صفحه باقی می‌مانند.";
 updateProgress();renderNav();
 if(!el("results").hidden){el("results").hidden=true;el("selfMessage").textContent="پاسخ تغییر کرد؛ پروفایل را دوباره ببینید و در صورت داشتن IDP، برنامه را بازبینی و مجدداً ذخیره کنید.";}
 });
 el("selfQuestions").addEventListener("input",e=>{
 if(e.target.id==="selfNote"||e.target.id==="selfOutcome"){
  const id=AREAS[activeDim].id;
  if(e.target.id==="selfNote")state.notes[id]=e.target.value;
  else{state.outcomes=state.outcomes||{};state.outcomes[id]=e.target.value;}
  save();
}
 });
 el("selfPrev").addEventListener("click",()=>{if(activeDim>0){activeDim--;renderQuestions(true);}});
 el("selfNext").addEventListener("click",()=>{
  if(countDone(activeDim)<4){el("selfMessage").textContent="در این حوزه هنوز چند پاسخ باقی مانده است. برای موارد تجربه‌نشده، گزینه «فرصت مشاهده نداشتم» را بزنید.";return;}
  if(activeDim<5){activeDim++;renderQuestions(true);}else showResult();
 });
 el("selfViewResult").addEventListener("click",showResult);
 el("selfEditAnswers").addEventListener("click",()=>{setStage("assessment");el("assessment").scrollIntoView({block:"start",behavior:"smooth"});});
 function suggestIdp(){
  const target=el("selfIdpTarget").value;if(!target)return;
  const draft=recommend(target);state.planDraft=draft;save();buildIdpFields(draft);updateRewards();
  el("selfCompletion").hidden=true;el("selfPlanOwnership").checked=false;
  el("selfIdpStatus").textContent="پیشنهاد متناسب با این حوزه آماده شد. آن را ویرایش و سپس ذخیره کنید.";
 }
 el("selfIdpTarget").addEventListener("change",suggestIdp);
 el("selfGenerateIdp").addEventListener("click",suggestIdp);
 el("selfIdpFields").addEventListener("input",e=>{
  if(!e.target.matches("[data-plan]"))return;
  state.planDraft=currentPlan();save();updateRewards();
  el("selfPlanOwnership").checked=false;
  el("selfCompletion").hidden=true;
  el("selfIdpStatus").textContent="تغییرات به‌صورت پیش‌نویس نگهداری می‌شوند. برای نهایی‌شدن، «ذخیره IDP» را بزنید.";
 });
 el("selfSaveIdp").addEventListener("click",savePlan);
 el("selfCopyReport").addEventListener("click",copyReport);
 el("selfPrintReport").addEventListener("click",()=>{if(el("results").hidden)return;buildPrintableReport();window.print();});
 el("selfClearAll").addEventListener("click",()=>{
 if(!confirm("تمام پاسخ‌ها و برنامه توسعه فردی همین مسیر روی این دستگاه پاک شوند؟"))return;
 try{localStorage.removeItem(STORAGE+role);}catch(e){}
 state={schema:2,answers:{},notes:{},outcomes:{},plan:null,planDraft:null,reflection:"",personName:"",profileViewed:false,planNeedsReview:false};el("selfPersonName").value="";el("selfReflection").value="";el("selfCompletion").hidden=true;el("selfPlanOwnership").checked=false;profile=null;activeDim=0;el("results").hidden=true;renderQuestions();el("selfMessage").textContent="اطلاعات این مسیر در صفحه پاک شدند.";el("assessment").scrollIntoView({block:"start",behavior:"auto"});
 });
 if(totalDone()===24)el("selfMessage").textContent="پاسخ‌های قبلی شما بازیابی شدند. برای دیدن تحلیل، «مشاهده پروفایل و IDP» را انتخاب کنید.";
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",setup);else setup();
})(window);
