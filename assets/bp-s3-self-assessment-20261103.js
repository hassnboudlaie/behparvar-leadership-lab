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
  "describe": "وقتی تحت فشارم یا از من انتقاد می‌شود، رفتار خودم را مدیریت می‌کنم.",
  "questions": [
   {
    "s": "وقتی از کارم انتقاد شد، قبل از جواب‌دادن پرسیدم دقیقاً کدام بخش باید بهتر شود.",
    "m": "وقتی کسی با نظر من مخالفت کرد، قبل از پاسخ‌دادن دلیل مخالفتش را پرسیدم."
   },
   {
    "s": "وقتی از موضوعی در کار ناراحت شدم، قبل از صحبت کمی مکث کردم.",
    "m": "وقتی گفت‌وگوی کاری پرتنش شد، مکث کردم تا آرام‌تر و روشن‌تر پاسخ دهم."
   },
   {
    "s": "وقتی فکر کردم کسی کارش را درست انجام نداده، قبل از قضاوت از خودش توضیح خواستم.",
    "m": "پیش از قضاوت درباره کار یک نفر، توضیح او را هم شنیدم."
   },
   {
    "s": "بعد از گفت‌وگویی که خوب پیش نرفت، دفعه بعد شیوه صحبت‌کردنم را تغییر دادم.",
    "m": "بعد از جلسه‌ای که خوب پیش نرفت، در جلسه بعد یک رفتار خودم را تغییر دادم."
   }
  ]
 },
 {
  "id": "efficacy",
  "icon": "🌱",
  "name": "خودکارآمدی و پیگیری",
  "area": "توانمندی مکمل · حوزه خودم",
  "describe": "برای شروع کارهای سخت قدم برمی‌دارم و وقتی مانعی پیش می‌آید، ادامه می‌دهم.",
  "questions": [
   {
    "s": "وقتی کاری سخت به من سپرده شد، اولین قدم مشخص را برای شروع آن برداشتم.",
    "m": "وقتی با کاری تازه و سخت روبه‌رو شدم، یک قدم کوچک و کم‌خطر برای شروع آن مشخص کردم."
   },
   {
    "s": "وقتی کار بزرگی داشتم، آن را به چند کار کوچک‌تر تقسیم کردم.",
    "m": "برای پیش‌بردن یک هدف دشوار، چند قدم مشخص و زمان بررسی پیشرفت را تعیین کردم."
   },
   {
    "s": "وقتی راه انجام کاری را نمی‌دانستم، از فرد مناسب کمک خواستم و کار را ادامه دادم.",
    "m": "وقتی برای انجام کاری دانش کافی نداشتم، از فرد آگاه کمک گرفتم و کار را جلو بردم."
   },
   {
    "s": "وقتی روش اول جواب نداد، راه دیگری را امتحان کردم.",
    "m": "وقتی برنامه اول نتیجه نداد، یک راه جایگزین را بررسی و امتحان کردم."
   }
  ]
 },
 {
  "id": "time",
  "icon": "⏰",
  "name": "مدیریت زمان و اولویت‌ها",
  "area": "توانمندی مکمل · حوزه خودم",
  "describe": "کارهای مهم را جلو می‌برم و درباره زمان انجام کارها قول واقع‌بینانه می‌دهم.",
  "questions": [
   {
    "s": "در شروع روز کاری، دو کار مهم‌تر خودم را مشخص کردم.",
    "m": "در شروع هفته، دو کار مهمی را که بیشترین اثر را بر نتیجه دارند، مشخص کردم."
   },
   {
    "s": "برای انجام یک کار مهم، زمانی را کنار گذاشتم که کمتر کسی مزاحمم شود.",
    "m": "برای کاری که به فکر و تمرکز نیاز داشت، زمانی را بدون جلسه یا وقفه کنار گذاشتم."
   },
   {
    "s": "قبل از قبول کار تازه، بررسی کردم برای انجام آن وقت کافی دارم یا نه.",
    "m": "قبل از قبول یک تعهد تازه، بررسی کردم چه کار مهم دیگری ممکن است عقب بیفتد."
   },
   {
    "s": "وقتی فهمیدم کاری به‌موقع تمام نمی‌شود، قبل از موعد به فرد مربوط خبر دادم.",
    "m": "وقتی احتمال تأخیر در یک تعهد وجود داشت، زودتر برای تغییر زمان یا گرفتن کمک اقدام کردم."
   }
  ]
 },
 {
  "id": "problem",
  "icon": "🔍",
  "name": "حل مسئله و بررسی علت‌ها",
  "area": "شایستگی اصلی · حوزه خودم",
  "describe": "قبل از راه‌حل‌دادن، مشکل را روشن می‌کنم و بعد نتیجه راه‌حل را می‌سنجم.",
  "questions": [
   {
    "s": "وقتی مشکلی پیش آمد، قبل از پیشنهاد راه‌حل پرسیدم دقیقاً چه اتفاقی افتاده است.",
    "m": "وقتی نتیجه کاری خوب نبود، قبل از تصمیم پرسیدم مشکل دقیقاً چه بوده است."
   },
   {
    "s": "برای فهمیدن یک مشکل کاری، از فردی که موضوع را از نزدیک دیده بود سؤال کردم.",
    "m": "برای فهم یک مشکل، از افرادی که با آن سروکار داشتند اطلاعات گرفتم."
   },
   {
    "s": "وقتی فکر کردم علت مشکل را پیدا کرده‌ام، یک دلیل دیگر را هم بررسی کردم.",
    "m": "قبل از اینکه بگویم علت مشکل را پیدا کرده‌ام، دست‌کم یک دلیل دیگر را هم بررسی کردم."
   },
   {
    "s": "بعد از اجرای یک راه‌حل، دوباره بررسی کردم مشکل حل شده یا نه.",
    "m": "بعد از تغییر یک روش کاری، بررسی کردم نتیجه واقعاً بهتر شده یا نه."
   }
  ]
 },
 {
  "id": "judgment",
  "icon": "⚖️",
  "name": "قضاوت حرفه‌ای و تصمیم‌گیری",
  "area": "شایستگی اصلی · حوزه خودم",
  "describe": "قبل از تصمیم، راه‌های ممکن و پیامدهای آن را می‌بینم.",
  "questions": [
   {
    "s": "قبل از یک تصمیم کاری، فکر کردم این تصمیم چه اثری بر کار یا افراد دیگر دارد.",
    "m": "قبل از یک تصمیم مهم، بررسی کردم این تصمیم چه اثری بر افراد و نتیجه کار دارد."
   },
   {
    "s": "وقتی دو راه برای انجام کاری داشتم، خوبی و دردسر هر راه را مقایسه کردم.",
    "m": "وقتی چند راه برای تصمیم داشتم، فایده و خطر هر راه را مقایسه کردم."
   },
   {
    "s": "وقتی تصمیمی از اختیارم خارج بود، آن را با توضیح کافی به مسئول مربوط ارجاع دادم.",
    "m": "وقتی تصمیمی از اختیارم خارج بود، اطلاعات لازم را برای فرد تصمیم‌گیرنده آماده کردم."
   },
   {
    "s": "وقتی اطلاعاتم برای تصمیم کافی نبود، قبل از اقدام سؤال بیشتری پرسیدم.",
    "m": "وقتی اطلاعات کامل نبود، روشن کردم چه چیزی را هنوز نمی‌دانیم و باید بررسی کنیم."
   }
  ]
 },
 {
  "id": "learning",
  "icon": "📈",
  "name": "یادگیری و توسعه فردی",
  "area": "توانمندی مکمل · حوزه خودم",
  "describe": "درباره کارم بازخورد می‌گیرم و آن را به تغییر واقعی رفتار تبدیل می‌کنم.",
  "questions": [
   {
    "s": "از یک همکار پرسیدم کدام بخش رفتار کاری من می‌تواند بهتر شود.",
    "m": "از همکار یا عضو تیم پرسیدم کدام رفتار مدیریتی من نیاز به بهترشدن دارد."
   },
   {
    "s": "بعد از شنیدن بازخورد، مشخص کردم دفعه بعد چه کاری را متفاوت انجام می‌دهم.",
    "m": "بعد از دریافت بازخورد، یک رفتار مشخص را برای تغییر در جلسه یا گفت‌وگوی بعدی انتخاب کردم."
   },
   {
    "s": "رفتاری را که می‌خواستم بهتر کنم، در یک موقعیت واقعی کاری تمرین کردم.",
    "m": "رفتار جدید را در یک جلسه یا گفت‌وگوی واقعی کاری تمرین کردم."
   },
   {
    "s": "بعد از تمرین، بررسی کردم آیا تغییر رفتارم نتیجه بهتری داشته است.",
    "m": "بعد از تمرین، از فردی که شاهد رفتارم بود پرسیدم آیا تغییری دیده است."
   }
  ]
 }
];
const COMPETENCY_GUIDES={
 "self": {
  "meaning": "یعنی وقتی از حرف یا رفتار دیگران ناراحت می‌شوم، متوجه واکنش خودم باشم و نگذارم عصبانیت یا برداشت عجولانه، گفت‌وگو و تصمیمم را خراب کند.",
  "general": [
   "وقتی همکارم با حرف من مخالف است، پیش از پاسخ از او می‌پرسم دلیلش چیست.",
   "وقتی کاری مطابق انتظار پیش نرفته، به‌جای مقصر دانستن فوری دیگران، اتفاق را بررسی می‌کنم.",
   "پس از یک گفت‌وگوی ناموفق، دفعه بعد لحن یا شیوه پرسیدن خودم را اصلاح می‌کنم."
  ],
  "supervisors": [
   "سرپرست در برابر اعتراض یکی از کارکنان، اول توضیح او را می‌شنود و بعد پاسخ می‌دهد.",
   "سرپرست وقتی چند درخواست فوری هم‌زمان می‌رسد، با آرامش موضوع‌ها را اولویت‌بندی می‌کند."
  ],
  "managers": [
   "مدیر هنگام شنیدن نقد یک تصمیم، از همکاران می‌خواهد نکته مبهم را مشخص کنند.",
   "مدیر وقتی جلسه پرتنش می‌شود، پیش از تصمیم‌گیری بحث را به واقعیت‌های قابل بررسی برمی‌گرداند."
  ],
  "not": "اینکه همیشه ساکت بمانم، هیچ‌وقت ناراحت نشوم یا با همه موافقت کنم؛ مهم این است که واکنش خودم را آگاهانه انتخاب کنم."
 },
 "efficacy": {
  "meaning": "یعنی باور داشته باشم که می‌توانم از عهده یک کار مشخص برآیم و این باور را با شروع‌کردن، کمک‌گرفتن و ادامه‌دادن کار نشان دهم؛ حتی وقتی کار آسان نیست.",
  "general": [
   "وقتی با کاری تازه روبه‌رو می‌شوم، به‌جای گفتن «نمی‌توانم»، اولین قدم عملی را مشخص می‌کنم.",
   "اگر روش اول جواب نداد، راه دیگری را امتحان می‌کنم و کار را بی‌دلیل رها نمی‌کنم.",
   "وقتی چیزی را بلد نیستم، از همکار باتجربه کمک می‌گیرم و دوباره اقدام می‌کنم."
  ],
  "supervisors": [
   "سرپرست برای تهیه گزارشی که قبلاً انجام نداده، ابتدا نمونه گزارش را می‌بیند و بعد نسخه خودش را آماده می‌کند.",
   "سرپرست وقتی یک کار عقب افتاده، آن را به چند قدم کوچک تقسیم می‌کند و انجام آن‌ها را پیگیری می‌کند."
  ],
  "managers": [
   "مدیر برای بهبود یک فرایند دشوار، به‌جای انتظار برای راه‌حل کامل، یک تغییر محدود را آزمایش می‌کند.",
   "مدیر وقتی تجربه کافی در موضوعی ندارد، مشورت می‌گیرد اما مسئولیت تصمیم و پیگیری را رها نمی‌کند."
  ],
  "not": "اعتمادبه‌نفس زیاد در همه موضوع‌ها، ادعای دانستن همه‌چیز یا اصرار بر انجام کار بدون کمک؛ خودکارآمدی به یک کار مشخص مربوط است."
 },
 "time": {
  "meaning": "یعنی بین کارهای مهم و کارهای صرفاً فوری فرق بگذارم، برای کارهای مهم وقت کنار بگذارم و تعهدی بدهم که واقعاً بتوانم انجام دهم.",
  "general": [
   "در شروع روز یا هفته، دو کار مهم‌تر را مشخص می‌کنم.",
   "برای کاری که تمرکز می‌خواهد، مدتی پیام‌ها و وقفه‌های غیرضروری را کنار می‌گذارم.",
   "اگر می‌بینم کاری به موعد نمی‌رسد، زودتر اطلاع می‌دهم و زمان یا کمک لازم را هماهنگ می‌کنم."
  ],
  "supervisors": [
   "سرپرست قبل از قبول درخواست تازه، بررسی می‌کند چه کاری ممکن است عقب بیفتد.",
   "سرپرست پیگیری یک کار مهم را بین تماس‌ها و درخواست‌های روزانه فراموش نمی‌کند."
  ],
  "managers": [
   "مدیر وقت مشخصی را برای تصمیم‌های مهم می‌گذارد و همه زمانش را به جلسه‌ها اختصاص نمی‌دهد.",
   "مدیر وقتی چند درخواست هم‌زمان دارد، اولویت را براساس اثر آن‌ها بر نتیجه کار تعیین می‌کند."
  ],
  "not": "اینکه همیشه سرم شلوغ باشد، همه درخواست‌ها را بپذیرم یا فقط سریع‌تر کار کنم."
 },
 "problem": {
  "meaning": "یعنی قبل از اینکه راه‌حل بدهم، دقیق بفهمم مشکل چیست، از افراد مرتبط بپرسم چرا رخ داده و بعد بررسی کنم راه‌حلم واقعاً جواب داده یا نه.",
  "general": [
   "وقتی یک کار با تأخیر انجام می‌شود، فقط نمی‌گویم «باید سریع‌تر کار کنیم»؛ می‌پرسم چه چیزی مانع شده است.",
   "قبل از تغییر یک روش، نظر فردی را می‌پرسم که هر روز با آن کار می‌کند.",
   "بعد از انجام یک تغییر، بررسی می‌کنم مشکل کمتر شده یا هنوز تکرار می‌شود."
  ],
  "supervisors": [
   "سرپرست وقتی اشتباهی تکرار می‌شود، از افراد درگیر می‌خواهد روند کار را توضیح دهند تا محل مشکل معلوم شود.",
   "سرپرست پس از توافق بر یک راه‌حل، دوباره از همکاران می‌پرسد آیا مشکل برطرف شده است."
  ],
  "managers": [
   "مدیر برای افت کیفیت یا تأخیر در خدمت‌رسانی، قبل از تصمیم نظر چند واحد مرتبط را می‌شنود.",
   "مدیر پیش از اجرای یک راه‌حل پرهزینه، یک راه ساده‌تر را هم بررسی می‌کند و بعد نتیجه را می‌سنجد."
  ],
  "not": "اینکه فوراً مقصر پیدا کنم، اولین پیشنهاد را بپذیرم یا فقط جلسه‌ای درباره مشکل برگزار کنم."
 },
 "judgment": {
  "meaning": "یعنی هنگام تصمیم‌گیری، راه‌های ممکن، فایده و دردسر هر راه و حدود اختیار خودم را در نظر بگیرم؛ نه اینکه عجولانه یک گزینه را انتخاب کنم.",
  "general": [
   "وقتی دو راه برای انجام کار وجود دارد، نتیجه خوب و خطر هرکدام را مقایسه می‌کنم.",
   "اگر اطلاعاتم کافی نیست، قبل از تصمیم سؤال می‌پرسم.",
   "اگر اختیار تصمیم با من نیست، موضوع و اطلاعات لازم را روشن به مسئول مربوط منتقل می‌کنم."
  ],
  "supervisors": [
   "سرپرست قبل از تغییر برنامه کار افراد، اثر آن را بر همکاران و تعهدهای قبلی بررسی می‌کند.",
   "سرپرست هنگام برخورد با درخواست غیرمعمول، به‌جای قول قطعی، اختیار و امکان اجرا را بررسی می‌کند."
  ],
  "managers": [
   "مدیر قبل از تخصیص منابع محدود، اثر انتخابش بر اولویت‌های سازمان را می‌سنجد.",
   "مدیر در تصمیمی که پیامد مهم دارد، دلیل انتخاب و زمانی برای بررسی دوباره نتیجه تعیین می‌کند."
  ],
  "not": "اینکه همیشه مطمئن باشم، تصمیم را بی‌نهایت عقب بیندازم یا بدون توجه به دیگران فقط سریع تصمیم بگیرم."
 },
 "learning": {
  "meaning": "یعنی از دیگران بازخورد بگیرم، بفهمم چه کاری را می‌توانم بهتر انجام دهم و در موقعیت واقعی بعدی رفتارم را تغییر دهم.",
  "general": [
   "بعد از یک گفت‌وگو، از فرد مقابل می‌پرسم کدام بخش صحبت من می‌توانست واضح‌تر باشد.",
   "از یک بازخورد، یک تغییر مشخص برای دفعه بعد انتخاب می‌کنم.",
   "پس از امتحان یک روش جدید، بررسی می‌کنم نتیجه بهتر شده یا نه."
  ],
  "supervisors": [
   "سرپرست از یکی از همکاران می‌پرسد توضیح دادن او برای انجام کار کافی و روشن بوده است یا نه.",
   "سرپرست بعد از دریافت بازخورد، در گفت‌وگوی بعدی همان نکته را اصلاح می‌کند."
  ],
  "managers": [
   "مدیر پس از یک جلسه از اعضای تیم می‌پرسد کدام رفتار او به مشارکت بهتر کمک کرده یا مانع آن شده است.",
   "مدیر بازخورد درباره شیوه تصمیم‌گیری خود را در جلسه بعد به یک تغییر قابل مشاهده تبدیل می‌کند."
  ],
  "not": "فقط شرکت در کلاس، خواندن مطالب تازه یا جمع‌کردن مدرک آموزشی؛ یادگیری باید در رفتار کاری هم دیده شود."
 }
};
const IDEAS={"self":{"s":["در گفت‌وگوی دشوار، قبل از جواب‌دادن یک سؤال برای فهم بهتر بپرسم.","در سه گفت‌وگوی واقعی، پیش از بیان نظر خود، یک سؤال روشن‌کننده بپرسم.","یک گفت‌وگوی کاری که در آن اختلاف‌نظر دارم.","سه مثال کوتاه از پرسیدن سؤال و یک بازخورد از فرد مقابل."],"m":["در جلسه‌ای که با نظر من مخالفت می‌شود، ابتدا دلیل مخالفت را بشنوم.","در سه جلسه یا گفت‌وگوی حساس، یک سؤال بپرسم و بعد نظر خود را بیان کنم.","جلسه‌ای که در آن درباره یک تصمیم اختلاف‌نظر وجود دارد.","سه نمونه از گفت‌وگو و بازخورد یک همکار درباره شیوه واکنش من."]},"efficacy":{"s":["وقتی کاری دشوار است، به‌جای عقب‌انداختن آن، اولین قدم را شروع کنم.","یک کار عقب‌افتاده را به سه قدم تقسیم کنم و هر هفته پیشرفت آن را بررسی کنم.","کاری که شروع آن را به‌خاطر دشواری عقب انداخته‌ام.","انجام دو قدم مشخص و ثبت یک مانع و راه عبور از آن."],"m":["برای کاری که شروع یا تصمیم آن عقب افتاده، یک اقدام کوچک و عملی تعیین کنم.","در یک موضوع معطل‌مانده، دو اقدام مشخص با تاریخ اجرا تعیین کنم و نتیجه را بررسی کنم.","موضوعی که تصمیم یا اجرای آن در واحد من به تأخیر افتاده است.","ثبت دو اقدام با تاریخ انجام و یک بررسی نتیجه بعد از اجرا."]},"time":{"s":["کارهای واقعاً مهم را در برنامه هر روز جلوتر قرار دهم.","در هشت روز کاری، دو اولویت ابتدای روز را بنویسم و آخر روز نتیجه را بررسی کنم.","یک روز کاری پرمشغله با درخواست‌های هم‌زمان.","هشت یادداشت کوتاه درباره اولویت‌ها و علت عقب‌افتادن کارها."],"m":["برای کارهای مهمی که نیاز به تمرکز دارند، در برنامه هفتگی وقت مشخص بگذارم.","در چهار هفته، هر هفته یک بازه بدون جلسه برای یک کار مهم تعیین و اجرا کنم.","یک تصمیم یا گزارش مهم که در میان جلسه‌ها عقب می‌افتد.","چهار بازه تمرکز انجام‌شده و نتیجه کار پیش‌رفته در هر بازه."]},"problem":{"s":["پیش از پیشنهاد راه‌حل، از افراد درگیر بپرسم مشکل دقیقاً چیست.","برای دو مشکل واقعی، ابتدا موضوع را روشن کنم، یک دلیل دیگر را بررسی کنم و نتیجه راه‌حل را بسنجم.","یک مشکل تکراری که روی کار یا خدمت اثر می‌گذارد.","دو یادداشت ساده از مشکل، راه‌حل و نتیجه بعد از اقدام."],"m":["قبل از تصمیم درباره یک مشکل، از افراد مرتبط توضیح و مثال بخواهم.","برای دو مشکل مهم، دو دلیل احتمالی را با هم مقایسه کنم و بعد از اقدام نتیجه را بررسی کنم.","یک مشکل که روی نتیجه کار تیم یا واحد اثر دارد.","دو بررسی کوتاه شامل نظر افراد مرتبط و نتیجه تصمیم."]},"judgment":{"s":["در تصمیم‌های مهم، دو راه را مقایسه و دلیل انتخاب را بگویم.","برای سه تصمیم کاری، قبل از انتخاب خوبی و دردسر دو راه ممکن را یادداشت کنم.","تصمیمی که بیش از یک راه برای انجام آن دارم.","سه یادداشت تصمیم با دلیل انتخاب و نتیجه بعد از اجرا."],"m":["در تصمیم‌های مهم، پیامد دو گزینه را برای افراد و نتیجه کار بررسی کنم.","برای دو تصمیم، دو گزینه را با یک خطر و یک پیامد هرکدام مقایسه و ثبت کنم.","تصمیمی درباره زمان، منابع یا روش انجام کار.","دو تصمیم ثبت‌شده همراه با دلیل انتخاب و زمان بازبینی."]},"learning":{"s":["یک بازخورد را به یک تغییر مشخص در رفتار کاری تبدیل کنم.","هر هفته از یک فرد مرتبط بازخورد بگیرم و یک تغییر رفتاری کوچک را تمرین کنم.","یک رفتار کاری که می‌خواهم در گفت‌وگو یا پیگیری بهتر شود.","دو مثال واقعی از تغییر رفتار و بازخورد درباره نتیجه."],"m":["برای بهتر شدن یک رفتار مدیریتی، بازخورد بگیرم و آن را در عمل امتحان کنم.","در دو موقعیت کاری، بازخورد بگیرم، رفتارم را تغییر دهم و نتیجه را دوباره بپرسم.","یک جلسه یا گفت‌وگو که می‌خواهم در آن مؤثرتر عمل کنم.","دو دور بازخورد و توضیح یک تغییر مشاهده‌شده."]}};
const GOALS={"self":{"s":"در چهار هفته آینده، در سه گفت‌وگوی دشوار قبل از پاسخ یک سؤال روشن‌کننده بپرسم.","m":"در چهار هفته آینده، در سه گفت‌وگوی مدیریتی ابتدا دلیل مخالفت را بپرسم و سپس نظر بدهم."},"efficacy":{"s":"در چهار هفته، یک کار دشوار را به سه قدم تقسیم کنم و دست‌کم دو قدم را انجام دهم.","m":"در چهار هفته، برای یک موضوع عقب‌افتاده دو اقدام عملی تعیین و نتیجه آن‌ها را بررسی کنم."},"time":{"s":"در چهار هفته، دست‌کم هشت روز دو اولویت اصلی کارم را بنویسم و نتیجه را مرور کنم.","m":"در چهار هفته، چهار بازه تمرکز برای کارهای مهم برنامه‌ریزی و اجرا کنم."},"problem":{"s":"در چهار هفته، برای دو مشکل واقعی قبل از اقدام سؤال بپرسم و نتیجه راه‌حل را بررسی کنم.","m":"در چهار هفته، دو مسئله کاری را با نظر افراد مرتبط بررسی و نتیجه تصمیم را پیگیری کنم."},"judgment":{"s":"در چهار هفته، برای سه تصمیم کاری دو راه را مقایسه و نتیجه تصمیم را یادداشت کنم.","m":"در چهار هفته، دو تصمیم مهم را با مقایسه گزینه‌ها و پیامدها ثبت و بازبینی کنم."},"learning":{"s":"در چهار هفته، حداقل دو بازخورد دریافت کنم و یک رفتارم را در کار واقعی تغییر دهم.","m":"در چهار هفته، دو بار بازخورد بگیرم، رفتارم را تمرین کنم و دوباره نتیجه را بپرسم."}};
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
const QUESTION_VERSION="20261107-practical-v2";
let role="supervisors",state={schema:2,questionVersion:QUESTION_VERSION,legacySnapshot:null,answers:{},notes:{},outcomes:{},plan:null,planDraft:null,reflection:"",personName:"",profileViewed:false,planNeedsReview:false},activeDim=0,profile=null;
const el=id=>document.getElementById(id),k=(id,i)=>id+"-"+i;
const fa=n=>String(n).replace(/\d/g,c=>"۰۱۲۳۴۵۶۷۸۹"[+c]);
const esc=v=>String(v==null?"":v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function initialRole(){
 const q=new URLSearchParams(location.search).get("audience");
 if(ROLE_LABEL[q])return q;
 try{const raw=JSON.parse(localStorage.getItem("behparvar_session1_v4")||"{}");if(ROLE_LABEL[raw.audience])return raw.audience;}catch(e){}
 return "supervisors";
}
function read(){try{const v=JSON.parse(localStorage.getItem(STORAGE+role)||"{}");if(v&&typeof v==="object"&&!Array.isArray(v))return {schema:2,questionVersion:typeof v.questionVersion==="string"?v.questionVersion:"legacy",legacySnapshot:v.legacySnapshot&&typeof v.legacySnapshot==="object"?v.legacySnapshot:null,answers:v.answers&&typeof v.answers==="object"?v.answers:{},notes:v.notes&&typeof v.notes==="object"?v.notes:{},outcomes:v.outcomes&&typeof v.outcomes==="object"?v.outcomes:{},plan:v.plan&&typeof v.plan==="object"?v.plan:null,planDraft:v.planDraft&&typeof v.planDraft==="object"?v.planDraft:null,reflection:typeof v.reflection==="string"?v.reflection:"",personName:typeof v.personName==="string"?v.personName:"",profileViewed:v.profileViewed===true,planNeedsReview:v.planNeedsReview===true};}catch(e){}return {schema:2,questionVersion:QUESTION_VERSION,legacySnapshot:null,answers:{},notes:{},outcomes:{},plan:null,planDraft:null,reflection:"",personName:"",profileViewed:false,planNeedsReview:false};}
function save(){try{localStorage.setItem(STORAGE+role,JSON.stringify(state));return true;}catch(e){return false;}}

function migrateQuestionsIfNeeded(){
 if(state.questionVersion===QUESTION_VERSION)return "";
 const hadAnswers=Object.keys(state.answers||{}).length>0;
 const previous=JSON.parse(JSON.stringify(state));
 if(hadAnswers&&!state.legacySnapshot){
   state.legacySnapshot={version:previous.questionVersion||"legacy",answers:previous.answers||{},plan:previous.plan||previous.planDraft||null,reflection:previous.reflection||"",date:new Date().toLocaleDateString("fa-IR")};
 }
 state.answers={};state.profileViewed=false;state.reflection="";
 if(state.plan||state.planDraft){
  state.planDraft=state.planDraft||state.plan;
  state.plan=null;
 }
 state.planNeedsReview=false;state.questionVersion=QUESTION_VERSION;
 if(!save()){state=previous;return "مرورگر امکان ذخیره نسخه تازه را نداد. برای جلوگیری از نسبت‌دادن پاسخ‌های قدیمی به سؤال‌های جدید، لطفاً از مرورگر دیگری استفاده کنید.";}
 return hadAnswers?"سؤال‌های این کارگاه ساده‌تر و کاربردی‌تر شده‌اند. پاسخ‌های نسخه قبلی در بخش «سوابق نسخه قبل» حفظ شده‌اند؛ برای پروفایل به‌روز، پرسش‌های جدید را پاسخ دهید.":"";
}
function renderLegacySnapshot(){
 const box=el("selfLegacy");
 if(!box)return;
 const old=state.legacySnapshot;
 box.hidden=!old;
 if(!old)return;
 const total=Object.keys(old.answers||{}).length;
 const records=AREAS.map(d=>{
  const scores=d.questions.map((_,i)=>old.answers[k(d.id,i)]).filter(n=>Number.isInteger(n)&&n>=1&&n<=5);
  const mean=scores.length>=3?(scores.reduce((a,b)=>a+b,0)/scores.length).toFixed(1):"—";
  return '<tr><th>'+esc(d.name)+'</th><td>'+fa(scores.length)+'</td><td>'+fa(mean)+'</td></tr>';
 });
 el("selfLegacyRecords").innerHTML='<p>پاسخ‌های '+fa(total)+' پرسشِ نسخه پیشین حفظ شده است. این اعداد با پرسش‌های بازنویسی‌شده فعلی قابل مقایسه مستقیم نیستند.</p>'+
 '<table><thead><tr><th>حوزه</th><th>پاسخ معتبر</th><th>میانگین نسخه قبل</th></tr></thead><tbody>'+records.join("")+'</tbody></table>'+
 (old.plan?'<p>یک IDP قدیمی نیز در سوابق مرورگر محفوظ است؛ لازم است با نتایج جدید بازبینی شود.</p>':"");
}
function setStage(name){const badge={assessment:"discover",profile:"insight",idp:"action"}[name];document.querySelectorAll("[data-reward]").forEach(x=>x.setAttribute("aria-current",x.dataset.reward===badge?"step":"false"));}
function countDone(dim){return AREAS[dim].questions.reduce((n,_,i)=>n+(Object.prototype.hasOwnProperty.call(state.answers,k(AREAS[dim].id,i))?1:0),0);}
function totalDone(){return AREAS.reduce((s,_,i)=>s+countDone(i),0);}
/* Three personal milestones, not a ranking or competency score. */
function rewardStatus(){
 const discover=totalDone()===24;
 const insight=discover&&state.profileViewed===true&&String(state.reflection||"").trim().length>=8;
 const p=state.plan;
 const action=discover&&!!p&&!state.planDraft&&!state.planNeedsReview&&["goal","behavior","practice","evidence","review"].every(k=>typeof p[k]==="string"&&p[k].trim().length>0)&&hasPersonalCase(p);
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
 el("selfQuestions").innerHTML='<div class="bp-self-domain-head"><span class="bp-self-area">'+esc(d.area)+'</span><h3 id="selfDimTitle" tabindex="-1">'+d.icon+' '+esc(d.name)+'</h3><p>'+esc(d.describe)+'</p><p class="bp-self-scale-reminder"><strong>یادآوری پاسخ‌ها:</strong> ۱ = تقریباً هرگز · ۲ = به‌ندرت · ۳ = گاهی · ۴ = اغلب · ۵ = تقریباً همیشه</p></div>'+
 d.questions.map((q,i)=>{
 const id=k(d.id,i),value=state.answers[id],title=role==="managers"?q.m:q.s;
 const options=[1,2,3,4,5,0];
 return '<fieldset class="bp-self-question"><legend>'+fa(i+1)+'. '+esc(title)+'</legend><div class="bp-self-answers">'+options.map(v=>'<label'+(v===0?' class="na"':'')+'><input type="radio" name="self-'+id+'" data-answer="'+esc(id)+'" value="'+v+'" aria-label="'+(v===0?"فرصت مشاهده نداشتم":fa(v)+"، "+LEVEL_LABELS[v-1])+'"'+(value===v?' checked':'')+'><span>'+(v===0?"فرصت مشاهده نداشتم":fa(v))+'</span></label>').join("")+'</div></fieldset>';
 }).join("")+
 '<details class="bp-self-note"><summary>📝 نمونه واقعی از کار من (اختیاری)</summary>'+
 '<p>برای تحلیل قابل اتکا، یک رفتار مشخص و نتیجه قابل مشاهده آن را بنویسید. این دو نوشته به امتیاز شما اضافه نمی‌کنند و محرمانه روی همین دستگاه می‌مانند.</p>'+
 '<label for="selfNote">موقعیت و اقدام من: چه اتفاقی افتاد و من دقیقاً چه کردم؟</label>'+
 '<textarea id="selfNote" rows="3" maxlength="900" placeholder="مثلاً در یک گفت‌وگوی دشوار، پیش از پاسخ سؤال روشن‌کننده پرسیدم.">'+esc(state.notes[d.id]||"")+'</textarea>'+
 '<label for="selfOutcome">پیامد قابل مشاهده: چه تغییری رخ داد یا چه بازخوردی گرفتم؟</label>'+
 '<textarea id="selfOutcome" rows="2" maxlength="700" placeholder="مثلاً همکارم اطلاعات تازه‌ای گفت و توانستیم تصمیم را اصلاح کنیم.">'+esc((state.outcomes||{})[d.id]||"")+'</textarea>'+
 '<p class="bp-self-evidence-disclaimer">خروجی این نوشته پس از تکمیل پرسش‌ها در «پروفایل فردی ← شواهد رفتاری» و در گزارش PDF دیده می‌شود. برنامه کیفیت متن را به‌صورت خودکار قضاوت نمی‌کند.</p></details>';
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
 let out='<svg viewBox="65 0 470 430" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="نمودار شعاعی شش شایستگی، با محورهای یک تا پنج" focusable="false">';
 for(let n=1;n<=5;n++){out+='<polygon points="'+rows.map((_,i)=>coords(r*n/5,i).join(",")).join(" ")+'" fill="'+(n%2===0?"#edf3fa":"none")+'" stroke="#cfdae9" stroke-width="1.3"/>';}
 rows.forEach((d,i)=>{const [x,y]=coords(r,i);out+='<line x1="'+cx+'" y1="'+cy+'" x2="'+x+'" y2="'+y+'" stroke="#c2d0e1" stroke-width="1.5"/>';});
 out+='<polygon points="'+rows.map((d,i)=>coords(r*d.mean/5,i).join(",")).join(" ")+'" fill="#467daa" fill-opacity=".24" stroke="#194c7b" stroke-width="3.5" stroke-linejoin="round"/>';
 rows.forEach((d,i)=>{let [x,y]=coords(r*d.mean/5,i);out+='<circle cx="'+x+'" cy="'+y+'" r="5" fill="#17487b" stroke="#fff" stroke-width="2"/>';});
 short.forEach((s,i)=>{let [x,y]=coords(r+48,i);out+='<text x="'+x+'" y="'+y+'" text-anchor="middle" font-size="20" font-weight="700" fill="#17376c" direction="rtl">'+esc(s)+'</text>';});
 out+='<text x="'+cx+'" y="'+(cy-r-11)+'" text-anchor="start" font-size="14" fill="#546983">۵</text></svg>';
 place.innerHTML=out;
}


const EVIDENCE_QUESTIONS={
 self:"در این موقعیت، کدام واکنش یا برداشت اولیه را تغییر دادید؟",
 efficacy:"کدام گام نخست را انجام دادید و برای عبور از مانع از چه کمکی استفاده کردید؟",
 time:"برای حفظ اولویت، چه کاری را به تعویق انداختید یا درباره زمان آن مذاکره کردید؟",
 problem:"کدام شواهد، علت احتمالی را از نشانه ظاهری مسئله جدا کرد؟",
 judgment:"کدام گزینه یا ریسک را بررسی کردید و با چه معیاری تصمیم گرفتید؟",
 learning:"از چه بازخوردی استفاده کردید و در رفتار بعدی چه تغییری ایجاد شد؟"
};
function evidenceRecords(rows){
 return rows.map(d=>{
  const situation=String((state.notes||{})[d.id]||"").trim();
  const outcome=String((state.outcomes||{})[d.id]||"").trim();
  const status=!situation&&!outcome?"شاهد مکتوب ثبت نشده":!situation?"پیامد نوشته شده، اما موقعیت و اقدام مشخص نیست":!outcome?"موقعیت و اقدام ثبت شده، اما پیامد یا بازخورد هنوز روشن نیست":"موقعیت، اقدام و پیامد خودگزارش‌شده ثبت شده‌اند";
  const interpretation=d.mean===null?"برای این حوزه، شواهد پرسشنامه برای نمره‌دهی کافی نیست.": "در پاسخ‌های چهار هفته اخیر، میانگین فراوانی رفتارهای این حوزه "+(Math.round(d.mean*10)/10).toLocaleString("fa-IR")+" از ۵ بوده است.";
  return {...d,situation,outcome,status,interpretation,question:EVIDENCE_QUESTIONS[d.id]};
 });
}
function evidenceMarkup(rec){
 return '<article class="bp-self-evidence-card"><h4>'+rec.icon+" "+esc(rec.name)+'</h4>'+
 '<p class="bp-self-evidence-status">'+esc(rec.status)+'</p>'+
 (rec.situation?'<p><strong>موقعیت و اقدام ثبت‌شده:</strong> '+esc(rec.situation)+'</p>':"")+
 (rec.outcome?'<p><strong>پیامد گزارش‌شده:</strong> '+esc(rec.outcome)+'</p>':"")+
 '<p><strong>تفسیر پرسشنامه:</strong> '+esc(rec.interpretation)+'</p>'+
 '<p><strong>پرسش بازاندیشی:</strong> '+esc(rec.question)+'</p></article>';
}
function practiceIndicator(target){
 const area=AREAS.find(d=>d.id===target);
 if(!area)return "هنوز شایستگی اولویت‌دار مشخص نشده است.";
 const items=area.questions.map((q,i)=>({score:state.answers[k(area.id,i)],text:role==="managers"?q.m:q.s})).filter(v=>Number.isInteger(v.score)&&v.score>=1&&v.score<=5);
 if(items.length<3)return "در این حوزه هنوز پاسخ قابل مشاهده کافی وجود ندارد؛ ابتدا موقعیت‌های واقعی را ثبت کنید.";
 const low=Math.min(...items.map(v=>v.score)),high=Math.max(...items.map(v=>v.score));
 if(low===high)return "پاسخ‌های این حوزه به هم نزدیک‌اند. برای انتخاب تمرین، به مهم‌ترین چالش واقعی خود و بازخورد همکاران نگاه کنید.";
 const item=items.find(v=>v.score===low);
 return "در پاسخ‌های شما، این رفتار کمتر از بعضی رفتارهای دیگر همین حوزه تکرار شده است: «"+item.text+"» ("+fa(low)+" از ۵). این فقط سرنخی برای انتخاب تمرین است، نه برچسب ضعف.";
}
function narrativeParagraphs(rows){
 const valid=rows.filter(d=>d.mean!==null).sort((a,b)=>a.mean-b.mean);
 const total=rows.reduce((n,d)=>n+d.answered,0);
 const paragraphs=[
 "این پروفایل از پاسخ‌های خود شما درباره رفتارهای چهار هفته اخیر ساخته شده است. "+fa(total)+" پاسخ قابل محاسبه از ۲۴ پرسش وجود دارد؛ امتیازها میزان فراوانی رفتارهای گزارش‌شده را نشان می‌دهند، نه رتبه یا کیفیت ذاتی فرد."
 ];
 if(!valid.length)paragraphs.push("برای تفسیر عددی هیچ‌یک از شش حوزه، شواهد کافی وجود ندارد. بهتر است ابتدا موقعیت‌های کاری بیشتری را مشاهده کنید.");
 else if(valid.length===1)paragraphs.push("فقط برای «"+valid[0].name+"» امتیاز قابل تفسیر وجود دارد. از یک حوزه نمی‌توان نقاط قوت و نیازهای توسعه را با یکدیگر مقایسه کرد.");
 else{
  const gap=valid[valid.length-1].mean-valid[0].mean;
  if(gap<0.5)paragraphs.push("شش حوزه قابل مشاهده از نظر فراوانی رفتارها الگوی نسبتاً نزدیک به هم دارند. این تفاوت‌های کوچک مبنای مناسبی برای اعلام قوت یا ضعف قطعی نیستند.");
  else{
   const low=valid.filter(d=>d.mean<=valid[0].mean+0.1);
   const high=valid.filter(d=>d.mean>=valid[valid.length-1].mean-0.1);
   paragraphs.push("در مقایسه درون‌فردی، "+(high.length>1?fa(high.length)+" حوزه":"حوزه «"+high[0].name+"»")+" رفتارهای نسبتاً پرتکرارتری داشته‌اند. "+(low.length>2?fa(low.length)+" حوزه با امتیاز تقریباً یکسان در پایین دامنه قرار دارند؛ انتخاب یکی از آن‌ها بدون توجه به نیاز کار شما توجیهی ندارد.":"حوزه «"+low.map(x=>x.name).join(" و ")+"» نسبتاً کمتر تکرار شده است.")+" این نتیجه فقط فرضیه‌ای برای بازاندیشی است.");
  }
 }
 if(valid.length<rows.length)paragraphs.push("در "+fa(rows.length-valid.length)+" حوزه تعداد رفتارهای قابل مشاهده کافی نبوده است؛ در این حوزه‌ها از ارائه امتیاز خودداری شده است.");
 const evidenceCount=rows.filter(d=>String((state.notes||{})[d.id]||"").trim()||String((state.outcomes||{})[d.id]||"").trim()).length;
 paragraphs.push("برای "+fa(evidenceCount)+" حوزه شاهد رفتاری مکتوب ثبت کرده‌اید. این شاهدها توسط سیستم به‌صورت توصیفی کنار امتیازها قرار می‌گیرند؛ درستی، کیفیت یا رابطه علت و معلولی متن آزاد بدون مشاهده و بازخورد مستقل قابل تأیید نیست.");
 return paragraphs;
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
 const records=evidenceRecords(profile);
 const examples=records.filter(d=>d.situation||d.outcome);
 const evidenceBox=el("selfExamplesDetails");evidenceBox.hidden=!examples.length;
 el("selfEvidenceExamples").innerHTML=examples.length?examples.map(evidenceMarkup).join(""):"";
 el("selfNarrativeText").innerHTML=narrativeParagraphs(profile).map(p=>"<p>"+esc(p)+"</p>").join("");
 const gap=known.length>1?known[known.length-1].mean-known[0].mean:0;
 if(!known.length){
  el("selfStrengthText").textContent="برای دیدن الگوی رفتاری، در دست‌کم یک حوزه به پاسخ قابل مشاهده بیشتری نیاز است.";
  el("selfOpportunityText").textContent="پس از مشاهده چند رفتار واقعی، یک حوزه را برای تمرین انتخاب کنید.";
 }else if(known.length===1){
  el("selfStrengthText").textContent="در حوزه «"+known[0].name+"» داده کافی برای بازاندیشی ثبت شده است.";
  el("selfOpportunityText").textContent="برای سایر حوزه‌ها پاسخ کافی وجود ندارد؛ اولویت را بر اساس نیاز واقعی کارتان انتخاب کنید.";
 }else if(gap<0.5){
  el("selfStrengthText").textContent="امتیاز حوزه‌ها به هم نزدیک‌اند؛ این تفاوت کوچک، قوت مشخصی را ثابت نمی‌کند. شواهد و بازخوردها را هم بررسی کنید.";
  el("selfOpportunityText").textContent="وقتی امتیازها نزدیک‌اند، اولویت توسعه را بر اساس مهم‌ترین چالش کاری انتخاب کنید، نه رتبه امتیازها.";
 }else{
  const top=known.filter(x=>x.mean>=known[known.length-1].mean-0.1);
  const low=known.filter(x=>x.mean<=known[0].mean+0.1);
  el("selfStrengthText").textContent=top.map(x=>x.name).join(" و ")+" در پاسخ‌های شما نسبتاً بیشتر گزارش شده‌اند؛ با نمونه رفتار و بازخورد بررسی کنید.";
  el("selfOpportunityText").textContent=low.length>=3?fa(low.length)+" حوزه از نظر فراوانی گزارش‌شده در یک سطح نزدیک‌تر به پایین قرار دارند و نمی‌توان از میان آن‌ها صرفاً براساس امتیاز یک اولویت را تعیین کرد. حوزه مهم‌تر برای کارتان را خودتان انتخاب کنید.":low.map(x=>x.name).join(" و ")+" نسبتاً کمتر گزارش شده‌اند؛ یکی از آن‌ها می‌تواند موضوع تمرین باشد، اما انتخاب نهایی با شماست.";
 }
 const target=el("selfIdpTarget");
 target.innerHTML='<option value="">یک حوزه توسعه را خودتان انتخاب کنید…</option>'+known.map(x=>'<option value="'+x.id+'">'+x.icon+" "+esc(x.name)+" — "+(Math.round(x.mean*10)/10).toLocaleString("fa-IR")+"</option>").join("");
 if(!known.length){
 el("selfGenerateIdp").disabled=true;el("selfIdpRecommendation").textContent="برای ایجاد IDP مبتنی بر نتیجه، حداقل سه رفتار در یکی از حوزه‌ها باید قابل مشاهده باشد. می‌توانید پاسخ‌ها را اصلاح کنید.";
 el("selfIdpFields").innerHTML="";el("selfSaveIdp").disabled=true;
 }else{
 const draft=state.planDraft&&known.some(x=>x.id===state.planDraft.target)?state.planDraft:null;
 const stored=state.plan&&known.some(x=>x.id===state.plan.target)?state.plan:null;
 const current=draft||stored;
 target.value=current?current.target:"";
 el("selfGenerateIdp").disabled=!current;
 el("selfSaveIdp").disabled=!current;
 if(current)buildIdpFields(current);
 else{
  el("selfIdpRecommendation").innerHTML="<p>امتیاز پایین به‌تنهایی اولویت توسعه را تعیین نمی‌کند. از میان شش حوزه، موردی را انتخاب کنید که تغییر آن بیشترین کمک را به کار واقعی شما می‌کند.</p>";
  el("selfIdpFields").innerHTML="";
 }
 el("selfCompletion").hidden=true;
 }
 el("selfPlanOwnership").checked=false;
 el("results").hidden=false;
 el("results").scrollIntoView({block:"start",behavior:"smooth"});
}
function recommend(target){
 const area=AREAS.find(x=>x.id===target)||AREAS[0],v=IDEAS[area.id][role==="managers"?"m":"s"];
 const goal=GOALS[area.id][role==="managers"?"m":"s"],behavior=v[0],practice=v[1],situation=String((state.notes||{})[area.id]||"").trim().slice(0,600),evidence=v[3];
 return {target,goal,behavior,practice,situation,evidence,
 support:role==="managers"?"یک مدیر همتا یا سرپرست مرتبط؛ بازخورد بر اساس رفتار مشاهده‌شده":"یکی از همکاران همتا یا مدیر مستقیم؛ بازخورد روی رفتار مشخص",
 obstacle:"اگر فشار کار یا تغییر اولویت مانع شد، دامنه تمرین را کاهش می‌دهم و زمان بازنگری را شفاف می‌کنم.",
 review:"بازبینی کوتاه پس از ۱۴ روز؛ ارزیابی نهایی بعد از چهار هفته"};
}
function buildIdpFields(data){
 const chosen=AREAS.find(x=>x.id===data.target);
 el("selfIdpRecommendation").innerHTML='<strong>حوزه انتخابی: '+(chosen?chosen.icon+" "+esc(chosen.name):"")+'</strong>'+
 '<p>این پیشنهاد نقطه شروع است؛ آن را با مسئولیت شغلی و تجربه واقعی خودتان هماهنگ کنید.</p>'+
 '<p class="bp-idp-practice-insight"><strong>رفتار مشخص برای بررسی:</strong> '+esc(practiceIndicator(data.target))+'</p>';
 const field=([id,label,type,wide])=>'<label'+(wide||id==="review"?' class="wide"':'')+'>'+esc(label)+(type==="textarea"?'<textarea data-plan="'+id+'" rows="'+(id==="situation"?"3":"2")+'" placeholder="'+(id==="situation"?"یک موقعیت واقعی از کار خودتان را با جزئیات کافی بنویسید؛ بدون اطلاعات محرمانه.":"")+'">'+esc(data[id]||"")+'</textarea>':'<input data-plan="'+id+'" value="'+esc(data[id]||"")+'">')+'</label>';
 const core=["goal","behavior","practice","situation","evidence","review"];
 const primary=PLAN_FIELDS.filter(([id])=>core.includes(id));
 const optional=PLAN_FIELDS.filter(([id])=>!core.includes(id));
 el("selfIdpFields").innerHTML=primary.map(field).join("")+
 '<p class="bp-idp-case-hint">برای اینکه برنامه واقعاً شخصی باشد، یک موقعیت مشخص از کار خودتان را بنویسید. نمونه موقعیت: '+esc(IDEAS[data.target][role==="managers"?"m":"s"][2])+'</p>'+
 '<details class="bp-self-idp-optional"><summary>جزئیات اختیاری برنامه: فرد حمایت‌کننده و موانع</summary><div class="bp-self-idp-optional-grid">'+optional.map(field).join("")+'</div></details>';
 el("selfIdpStatus").textContent=state.planNeedsReview?"پاسخ‌ها تغییر کرده‌اند. لطفاً برنامه قبلی را بازبینی و دوباره ذخیره کنید.":state.planDraft?"پیش‌نویس قبلی شما بازیابی شد؛ برای نهایی‌شدن آن را ذخیره کنید.":state.plan?"برنامه ذخیره‌شده بازیابی شد؛ در صورت اصلاح دوباره ذخیره کنید.":"پیشنهاد اولیه آماده است؛ آن را با شرایط واقعی کارتان هماهنگ کنید.";
}
function currentPlan(){
 const target=el("selfIdpTarget").value;const data={target};
 el("selfIdpFields").querySelectorAll("[data-plan]").forEach(x=>{data[x.dataset.plan]=x.value.trim();});
 return data;
}
function hasPersonalCase(p){
 if(!p||!p.target)return false;
 const text=String(p.situation||"").trim();
 const sample=IDEAS[p.target]?.[role==="managers"?"m":"s"]?.[2]||"";
 return text.length>=12&&text!==sample;
}
function savePlan(){
 if(el("results").hidden||!el("selfIdpFields").querySelector("[data-plan]"))return;
 const p=currentPlan();
 if(!p.goal||!p.behavior||!p.practice||!p.evidence||!p.review){
  el("selfIdpStatus").textContent="برای تکمیل IDP، هدف، رفتار قابل مشاهده، تمرین، یک موقعیت واقعی، شاهد پیشرفت و زمان بازبینی را مشخص کنید.";return;
 }
 if(!hasPersonalCase(p)){
  el("selfIdpStatus").textContent="برای شخصی‌سازی IDP، یک موقعیت واقعی از کار خودتان (حداقل یک جمله کوتاه) در بخش «موقعیت کاری تمرین» بنویسید؛ نمونه پیشنهادی آماده کافی نیست.";return;
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
 const rows=profile||compute(),records=evidenceRecords(rows);
 const parts=["به‌پرور | گزارش توسعه شایستگی‌های معطوف به خود","پروفایل فردی و برنامه توسعه (IDP)",
 "نام / کد: "+(state.personName||"درج نشده"),"مسیر: "+ROLE_LABEL[role],
 "تاریخ: "+new Date().toLocaleDateString("fa-IR"),
 "مبنای داده: خودگزارشی رفتاری چهار هفته اخیر؛ نه آزمون روان‌سنجی",
 "","داشبورد شش شایستگی"];
 for(const d of rows)parts.push(d.name+": "+(d.mean===null?"شواهد کافی نیست":(Math.round(d.mean*10)/10).toLocaleString("fa-IR")+" از ۵")+" | "+fa(d.answered)+" پاسخ قابل محاسبه");
 parts.push("","تفسیر نتایج");narrativeParagraphs(rows).forEach(v=>parts.push(v));
 parts.push("","شواهد رفتاری و پرسش‌های بازاندیشی");
 for(const d of records.filter(x=>x.situation||x.outcome)){
  parts.push(d.name,"موقعیت و رفتار: "+(d.situation||"ثبت نشده"),"پیامد: "+(d.outcome||"ثبت نشده"),"تحلیل توصیفی: "+d.status+"؛ "+d.interpretation,"پرسش بازاندیشی: "+d.question);
 }
 if(!records.some(x=>x.situation||x.outcome))parts.push("برای این اجرا شاهد رفتاری مکتوب وارد نشده است.");
 parts.push("","بازاندیشی فردی",state.reflection||"ثبت نشده","",
 "خلاصه نقاط اتکا و اولویت‌ها","نقطه اتکا: "+el("selfStrengthText").textContent,"فرصت توسعه: "+el("selfOpportunityText").textContent);
 const p=currentPlan(),d=AREAS.find(x=>x.id===p.target);
 parts.push("","برنامه توسعه فردی","اولویت: "+(d?.name||"تعیین نشده"));
 PLAN_FIELDS.forEach(([id,label])=>parts.push(label+": "+(p[id]||"تکمیل نشده")));
 parts.push("","مسئول تحلیل نهایی و تصمیم توسعه‌ای: خود فرد؛ با امکان دریافت بازخورد از مدرس یا همکار به انتخاب فرد.",
 "این گزارش با قواعد توصیفی تولید شده است؛ محتوای متن آزاد، تأیید یا نمره‌دهی خودکار نمی‌شود.");
 return parts.join("\n");
}
function copyReport(){
 const v=reportText(),preview=el("selfReportPreview");preview.value=v;preview.hidden=false;
 const status=el("selfIdpStatus");
 if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(v).then(()=>status.textContent="پروفایل و IDP کپی شدند.").catch(()=>status.textContent="کپی خودکار ممکن نشد؛ متن آماده در کادر پایین را دستی کپی کنید.");
 else status.textContent="متن گزارش در کادر پایین برای کپی دستی آماده است.";
}
function buildPrintableReport(){
 const rows=profile||compute(),records=evidenceRecords(rows);
 const plan=currentPlan(),selected=AREAS.find(d=>d.id===plan.target);
 const isFinal=!!state.plan&&!state.planDraft&&!state.planNeedsReview&&hasPersonalCase(state.plan);
 const known=rows.filter(d=>d.mean!==null).length;
 const observed=rows.reduce((sum,d)=>sum+d.answered,0);
 const label=state.personName||"پروفایل فردی بدون نام";
 const date=new Date().toLocaleDateString("fa-IR");
 const badge=isFinal?"برنامه توسعه ثبت‌شده":"پیش‌نویس · نیازمند شخصی‌سازی";
 const valueOf=d=>d.mean===null?"—":(Math.round(d.mean*10)/10).toLocaleString("fa-IR");
 const barOf=d=>'<div class="bp-pdf-score-row"><div class="bp-pdf-score-label"><strong>'+esc(d.name)+'</strong><span>'+(d.mean===null?"شواهد کافی نیست":valueOf(d)+" از ۵")+'</span></div><div class="bp-pdf-bar"><i style="width:'+(d.mean===null?0:Math.round(d.mean/5*100))+'%"></i></div><small>'+fa(d.answered)+" پاسخ از ۴ رفتار"+'</small></div>';
 const radar=el("selfRadarChart").innerHTML;
 const metrics=[
  ["۶","حوزه شایستگی"],["۲۴","رفتار بررسی‌شده"],[fa(observed),"پاسخ قابل محاسبه"],[fa(known),"حوزه با پاسخ کافی"]
 ].map(([number,title])=>'<div class="bp-pdf-metric"><strong>'+number+'</strong><small>'+title+'</small></div>').join("");
 const narratives=narrativeParagraphs(rows).map(txt=>'<p>'+esc(txt)+'</p>').join("");
 const evidences=records.filter(d=>d.situation||d.outcome);
 const evidenceCards=evidences.length?evidences.map(d=>'<article class="bp-pdf-evidence">'+
  '<h3>'+esc(d.name)+'</h3><p><strong>موقعیت و اقدام:</strong> '+esc(d.situation||"ثبت نشده")+'</p>'+
  '<p><strong>پیامد مشاهده‌شده:</strong> '+esc(d.outcome||"ثبت نشده")+'</p>'+
  '<p class="bp-pdf-evidence-status">'+esc(d.status)+'. '+esc(d.interpretation)+'</p>'+
  '<p><strong>پرسش تحلیلی:</strong> '+esc(d.question)+'</p></article>').join(""):
  '<div class="bp-pdf-evidence-prompt"><strong>برای تبدیل نتیجه به یادگیری واقعی:</strong><p>یک اتفاق کاری مشخص انتخاب کنید و سه چیز را ثبت کنید: چه اتفاقی افتاد؟ شما چه کردید؟ نتیجه یا بازخورد چه بود؟</p><p>فعلاً هیچ شاهد مکتوبی وارد نشده است؛ بنابراین نتیجه عددی فقط بر مبنای خودگزارشی است و با مشاهده مستقل تأیید نشده است.</p></div>';
 const required=["goal","behavior","practice","evidence","review"];
 const fields=PLAN_FIELDS.map(([id,title])=>'<div class="bp-pdf-idp-item'+(required.includes(id)?" critical":"")+'"><span>'+esc(title)+'</span><p>'+esc(plan[id]||"تکمیل نشده")+'</p></div>').join("");
 const summary=[
  ["نقطه اتکای نسبی",el("selfStrengthText").textContent],
  ["اولویت احتمالی توسعه",el("selfOpportunityText").textContent]
 ].map(([heading,content])=>'<section class="bp-pdf-summary"><h3>'+esc(heading)+'</h3><p>'+esc(content)+'</p></section>').join("");
 el("selfPrintPlan").innerHTML=
 '<div class="bp-pdf-page bp-pdf-dashboard">'+
 '<header class="bp-pdf-head"><div><span class="bp-pdf-brand">به‌پرور | MY MANAGEMENT LAB</span><h1>گزارش توسعه شایستگی‌های معطوف به خود</h1><p>Personal Competency Development Profile · IDP</p></div><span class="bp-pdf-status">'+badge+'</span></header>'+
 '<div class="bp-pdf-meta"><span><b>شرکت‌کننده:</b> '+esc(label)+'</span><span><b>مسیر:</b> '+esc(ROLE_LABEL[role])+'</span><span><b>تاریخ:</b> '+date+'</span></div>'+
 '<div class="bp-pdf-metrics">'+metrics+'</div>'+
 '<div class="bp-pdf-section-title"><h2>داشبورد شش شایستگی</h2><span>مقیاس فراوانی رفتار ۱ تا ۵</span></div>'+
 '<div class="bp-pdf-charts"><div class="bp-pdf-radar">'+radar+'</div><div class="bp-pdf-bars">'+rows.map(barOf).join("")+'</div></div>'+
 '<div class="bp-pdf-section-title"><h2>تفسیر نتایج</h2><span>تحلیل توصیفی خودگزارشی</span></div>'+
 '<div class="bp-pdf-narrative">'+narratives+'</div>'+
 '<div class="bp-pdf-summaries">'+summary+'</div>'+
 '<p class="bp-pdf-method">روش محاسبه: میانگین پاسخ‌های قابل مشاهده هر حوزه؛ حداقل ۳ پاسخ از ۴ برای نمایش امتیاز. این یک ابزار آموزشی خودگزارشی است و آزمون روان‌سنجی یا ارزیابی عملکرد سازمانی محسوب نمی‌شود.</p>'+
 '</div>'+
 '<div class="bp-pdf-page bp-pdf-development">'+
 '<header class="bp-pdf-minihead"><strong>به‌پرور · گزارش فردی توسعه</strong><span>'+esc(label)+' | '+date+'</span></header>'+
 '<div class="bp-pdf-section-title"><h2>شواهد رفتاری و تحلیل بازاندیشانه</h2><span>'+fa(evidences.length)+' حوزه دارای شاهد مکتوب</span></div>'+
 '<p class="bp-pdf-lead">شواهد توسط شرکت‌کننده نوشته شده‌اند؛ تحلیل زیر، آن‌ها را در کنار امتیازهای رفتاری قرار می‌دهد و پرسش‌های بررسی بیشتر را ارائه می‌کند. صحت و کیفیت روایت بدون مشاهده یا بازخورد مستقل تأیید نمی‌شود.</p>'+
 '<div class="bp-pdf-evidence-grid">'+evidenceCards+'</div>'+
 '<section class="bp-pdf-reflection"><h3>برداشت و بازاندیشی فردی</h3><p>'+esc(state.reflection||"ثبت نشده")+'</p></section>'+
 '<div class="bp-pdf-section-title"><h2>برنامه توسعه فردی (IDP)</h2><span>'+badge+'</span></div>'+
 '<div class="bp-pdf-focus"><strong>شایستگی اولویت‌دار:</strong> '+esc(selected?.name||"انتخاب نشده")+'</div>'+
 '<div class="bp-pdf-specific"><strong>سرنخ رفتاری برگرفته از پاسخ‌ها</strong><p>'+esc(practiceIndicator(plan.target))+'</p></div>'+
 '<div class="bp-pdf-idp-grid">'+fields+'</div>'+
 '<div class="bp-pdf-follow"><strong>Follow-through | اقدام بعدی</strong><p>تمرین رفتار انتخاب‌شده را در محیط واقعی شروع کنید؛ پس از دو هفته شواهد پیشرفت را مرور و در پایان هفته چهارم هدف را بازبینی کنید.</p></div>'+
 '<footer class="bp-pdf-footer"><span>محرمانه برای توسعه فردی · بدون ارسال خودکار به مدرس</span><span>خروجی آموزشی به‌پرور</span></footer>'+
 '</div>';
}
function setup(){
 role=initialRole();state=read();const versionNotice=migrateQuestionsIfNeeded();el("selfRoleName").textContent=ROLE_LABEL[role];renderLegacySnapshot();
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
 renderNav();renderQuestions();if(versionNotice)el("selfMessage").textContent=versionNotice;
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
  const draft=recommend(target);state.planDraft=draft;save();buildIdpFields(draft);el("selfGenerateIdp").disabled=false;el("selfSaveIdp").disabled=false;updateRewards();
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
 window.addEventListener("beforeprint",()=>{if(!el("results").hidden)buildPrintableReport();});
 el("selfClearAll").addEventListener("click",()=>{
 if(!confirm("تمام پاسخ‌ها و برنامه توسعه فردی همین مسیر روی این دستگاه پاک شوند؟"))return;
 try{localStorage.removeItem(STORAGE+role);}catch(e){}
 state={schema:2,questionVersion:QUESTION_VERSION,legacySnapshot:null,answers:{},notes:{},outcomes:{},plan:null,planDraft:null,reflection:"",personName:"",profileViewed:false,planNeedsReview:false};el("selfPersonName").value="";el("selfReflection").value="";el("selfCompletion").hidden=true;el("selfPlanOwnership").checked=false;profile=null;activeDim=0;el("results").hidden=true;renderQuestions();el("selfMessage").textContent="اطلاعات این مسیر در صفحه پاک شدند.";el("assessment").scrollIntoView({block:"start",behavior:"auto"});
 });
 if(totalDone()===24)el("selfMessage").textContent="پاسخ‌های قبلی شما بازیابی شدند. برای دیدن تحلیل، «مشاهده پروفایل و IDP» را انتخاب کنید.";
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",setup);else setup();
})(window);
