/* My Management Lab — unified, additive competency layer.
   Educational prototype. No proprietary DDI assessments or psychometric claims.
   Keeps the original 6x7 training routes, stored answers, and separate audience records. */
(function () {
  "use strict";
  var PARTS=["m1","m2","leaders","techniques","visuals","diseases","quiz"];
  var TITLES=["وضعیت من","گفت‌وگوی کاری","نکته و مثال","راهنمای اجرا","تمرین تصمیم","خطاهای رایج","برنامه اقدام من"];
  var SKILLS=[
    {id:"planning",fa:"برنامه‌ریزی و سازماندهی",en:"Planning & Organizing",group:"مدیریتی",s:3,m:4,behavior:"هدف را به فعالیت، مسئول، منابع، موعد و شاخص تبدیل می‌کند.",evidence:"برنامه اجرایی با مالک اقدام و پایش پیشرفت"},
    {id:"coordination",fa:"هماهنگی بین‌واحدی",en:"Cross-functional Coordination",group:"سازمانی",s:3,m:4,behavior:"وابستگی‌های واحدها را قبل از تصمیم شناسایی و برای تحویل مشترک توافق ایجاد می‌کند.",evidence:"توافق بین‌واحدی با موعد و تعهدات روشن"},
    {id:"performance",fa:"کنترل و مدیریت عملکرد",en:"Performance Management",group:"مدیریتی",s:3,m:4,behavior:"انحراف از استاندارد را با داده تشخیص می‌دهد و اقدام اصلاحی را پیگیری می‌کند.",evidence:"مقایسه خط پایه، هدف، واقعیت و اقدام اصلاحی"},
    {id:"problem",fa:"حل مسئله و تحلیل علل",en:"Analytical Problem Solving",group:"عمومی",s:3,m:4,behavior:"بین علامت و علت مسئله تفکیک کرده و چند گزینه اجرایی را ارزیابی می‌کند.",evidence:"تعریف مسئله، علل محتمل، گزینه‌ها و نتیجه"},
    {id:"judgment",fa:"قضاوت حرفه‌ای و تصمیم‌گیری",en:"Professional Judgment",group:"مدیریتی",s:3,m:4,behavior:"ریسک، استاندارد، حدود اختیار و پیامد تصمیم را هم‌زمان لحاظ می‌کند.",evidence:"صورت‌جلسه تصمیم همراه با فرضیات و محدودیت‌ها"},
    {id:"communication",fa:"ارتباط حمایتی و گوش‌دادن",en:"Supportive Communication",group:"میان‌فردی",s:3,m:4,behavior:"درباره رفتار مشخص و مسئله گفت‌وگو می‌کند، نه درباره شخصیت فرد.",evidence:"نمونه بازخورد توصیفی و توافق بر گام بعدی"},
    {id:"conflict",fa:"مدیریت تعارض",en:"Conflict Management",group:"میان‌فردی",s:3,m:4,behavior:"اختلاف مواضع را به نیازها، محدودیت‌ها و گزینه‌های حل مشترک تبدیل می‌کند.",evidence:"توافق قابل اجرا که الزامات فنی را نقض نمی‌کند"},
    {id:"delegation",fa:"تفویض اختیار و توانمندسازی",en:"Delegation & Empowerment",group:"مدیریتی",s:3,m:4,behavior:"نتیجه، اختیار، مرز تصمیم و زمان بازبینی را قبل از واگذاری روشن می‌کند.",evidence:"تفویض مشخص با معیار تحویل و نقاط کنترل"},
    {id:"coaching",fa:"بازخورد و توسعه دیگران",en:"Coaching & Developing Others",group:"میان‌فردی",s:3,m:4,behavior:"با سؤال، تمرین و بازخورد به یادگیری و مسئولیت‌پذیری افراد کمک می‌کند.",evidence:"توافق توسعه فرد با رفتار و شواهد قابل مشاهده"},
    {id:"self",fa:"خودآگاهی و خودمدیریتی",en:"Self-Awareness & Self-Management",group:"فردی",s:3,m:4,behavior:"واکنش خود، سبک تصمیم و تأثیرش بر دیگران را بازبینی می‌کند.",evidence:"بازتاب مکتوب و تغییر رفتار در یک موقعیت واقعی"},
    {id:"business",fa:"شناخت کسب‌وکار و زنجیره ارزش",en:"Business Acumen",group:"سازمانی و کسب‌وکار",s:2,m:4,behavior:"اثر تصمیم واحد را بر کیفیت، هزینه، مشتری و عملکرد کل زنجیره توضیح می‌دهد.",evidence:"نقشه ساده وابستگی‌ها و اثر اقتصادی تصمیم"},
    {id:"change",fa:"بهبود مستمر و مدیریت تغییر",en:"Continuous Improvement & Change",group:"سازمانی",s:2,m:4,behavior:"بهبود محدود، قابل سنجش و قابل پیگیری طراحی می‌کند.",evidence:"اقدام آزمایشی با شاخص قبل/بعد و درس‌آموخته"}
  ];
  var FAMILIES=[
    ["عمومی | Core","حل مسئله، سواد داده، مسئولیت‌پذیری و یادگیری مستمر"],
    ["مدیریتی | Managerial","برنامه‌ریزی، سازماندهی، هماهنگی، سرپرستی، هدایت، کنترل، تصمیم‌گیری و تفویض"],
    ["تخصصی | Functional","دانش عملیاتی مرتبط با نقش، کیفیت، ایمنی زیستی، نگهداری تجهیزات و استانداردهای فنی؛ وابسته به Job Family"],
    ["سازمانی و کسب‌وکار | Business","زنجیره ارزش، فرهنگ، شناخت دیگر واحدها، بهره‌وری و تحلیل محیط"],
    ["فردی | Personal","خودآگاهی، خودمدیریتی، انضباط، تاب‌آوری و پذیرش بازخورد"],
    ["میان‌فردی | Interpersonal","گفت‌وگوی حرفه‌ای، تعارض، نفوذ، همکاری، Coaching و توسعه کارکنان"]
  ];
  var PROGRAM=[
   {name:"شناخت نقش و شایستگی",ids:["self","business"],s:{question:"وقتی از کارشناس به سرپرست تبدیل می‌شوم، دقیقاً چه چیز باید تغییر کند؟",outcome:"تمایز انجام درست کار خود با مسئولیت‌پذیری نسبت به خروجی تیم؛ شناسایی دو رفتار توسعه‌ای.",case:"کارشناس ممتاز تولید به سمت سرپرستی ارتقا یافته؛ خود مشکلات فنی را حل می‌کند، اما کارکنان منتظر تصمیم او می‌مانند.",tool:"نقشه نقش: تصمیم‌های شخصی، تصمیم‌های تیمی، حدود اختیار، سه وابستگی بین‌واحدی.",blind:"تخصص فنی بالا را با توانایی اداره افراد و فرایند یکسان گرفتن.",action:"در یک شیفت، سه تصمیمی را که نباید شخصاً انجام می‌دادید ثبت کنید."},m:{question:"مدیر به‌پرور بودن چه تفاوتی با اداره صرفاً یک دپارتمان دارد؟",outcome:"ترسیم اثر واحد بر مشتری، کیفیت، هزینه، افراد و سایر واحدها؛ تشخیص پیامدهای ناخواسته تصمیم.",case:"شاخص واحد مطلوب است، ولی تأخیر تحویل و هزینه کل زنجیره افزایش یافته است.",tool:"نقشه زنجیره ارزش، ذی‌نفعان تصمیم و موفقیت مشترک.",blind:"بهینه‌سازی KPI واحد به قیمت تضعیف عملکرد زنجیره.",action:"یک تصمیم اخیر واحد را از دید دو دپارتمان دیگر بازبینی کنید."}},
   {name:"برنامه‌ریزی، سازماندهی و هماهنگی",ids:["planning","coordination"],s:{question:"چگونه برنامه شیفت را به تعهد قابل اجرا تبدیل کنم؟",outcome:"اولویت‌بندی کار، تقسیم مسئولیت و بازبینی محدودیت مواد، تجهیزات، افراد و کیفیت پیش از شروع.",case:"در شروع شیفت، مواد اولیه تأیید نشده و توقف برنامه‌ریزی‌شده یک تجهیز با زمان حمل هم‌پوشانی دارد.",tool:"چک‌لیست پنج‌گانه هدف، محدودیت، مسئول، موعد، نقطه کنترل.",blind:"فشار بر سرعت اجرا بدون سنجش ظرفیت یا الزامات کیفیت.",action:"برای یک تحویل حساس، برنامه مشترک کوتاه با دو واحد مرتبط تدوین کنید."},m:{question:"چگونه منابع و تعهدات چند واحد را با هم هم‌راستا کنم؟",outcome:"تصمیم‌گیری درباره ظرفیت، هزینه فرصت، سطح خدمت و تعارض اولویت‌های دپارتمانی.",case:"فروش وعده تحویل فوری داده، عملیات ظرفیت محدودی دارد و کیفیت آزادسازی محصول را مشروط کرده است.",tool:"ماتریس وابستگی واحدها و برنامه آزمایشی S&OP ساده‌شده.",blind:"برنامه ایده‌آل روی کاغذ بدون توافق درباره اجرا و مسئولیت.",action:"یک جلسه هماهنگی هفتگی با سه شاخص مشترک طراحی کنید."}},
   {name:"کنترل عملکرد و حل مسئله",ids:["performance","problem"],s:{question:"وقتی عملکرد از استاندارد فاصله می‌گیرد چه کار کنم؟",outcome:"ثبت انحراف، تفکیک نشانه از علت و اجرای اقدام اصلاحی در حدود اختیار.",case:"افت بازده یک خط در دو شیفت رخ داده؛ داده‌های توقف، کیفیت و نیروی انسانی تصویر متفاوتی دارند.",tool:"برگه یک‌صفحه‌ای Standard → Actual → Gap → Cause → Action.",blind:"سرزنش فرد یا عجله در اقدام بدون تأیید علت.",action:"یک انحراف واقعی را ثبت و بعد از ۷ روز اثربخشی اقدام را بررسی کنید."},m:{question:"چه شاخص‌هایی سلامت کل فرایند را نشان می‌دهند؟",outcome:"تعریف عملیاتی شاخص‌ها و تشخیص علت‌های سیستمی در چند واحد.",case:"هزینه بعضی نهاده‌ها افزایش یافته اما داده هزینه و تأخیر تحویل در واحدها تعریف یکسانی ندارند.",tool:"KPI Tree با Baseline، Target، Actual، Owner و Risk Guardrail.",blind:"انتخاب شاخص‌های نمایشی یا مقایسه عددهای با تعریف متفاوت.",action:"برای یک مسئله بین‌واحدی، سه شاخص و یک Guardrail تعریف کنید."}},
   {name:"ارتباطات، تعارض و رفتار سازمانی",ids:["communication","conflict"],s:{question:"چگونه گفت‌وگوی دشوار را بدون دفاعی‌شدن طرف مقابل پیش ببرم؟",outcome:"استفاده از بازخورد مشخص، شنیدن دیدگاه فرد و تمرکز بر مسئله به جای برچسب‌زنی.",case:"کارکنان از تغییر دیرهنگام برنامه گلایه دارند و سرپرست گمان می‌کند آنها تعهد کافی ندارند.",tool:"رفتار مشاهده‌شده → پیامد → پرسش روشن‌کننده → توافق اقدام.",blind:"تعبیر هر اعتراض به بی‌انضباطی یا مقاومت.",action:"یک گفت‌وگوی دشوار را با توصیف رفتار و گوش‌دادن باز اجرا کنید."},m:{question:"چگونه اختلاف منافع دپارتمان‌ها را به تصمیم مشترک تبدیل کنم؟",outcome:"تشخیص منبع تعارض، حمایت از امنیت روانی و مدیریت اختلاف اولویت‌ها.",case:"فروش، کیفیت و عملیات بر سر وعده مشتری اختلاف دارند؛ هر واحد برداشت متفاوتی از تصمیم قبلی دارد.",tool:"نقشه مواضع، منافع، محدودیت‌ها، داده و گزینه توافق.",blind:"حل تعارض با دستور از بالا بدون رفع ابهام فرایند و نقش.",action:"یک تعارض جاری را با تعریف مشترک مسئله بازچارچوب‌بندی کنید."}},
   {name:"هدایت، تفویض و توسعه افراد",ids:["delegation","coaching"],s:{question:"چطور کار را واگذار کنم بدون اینکه کنترل از دست برود؟",outcome:"تفویض با مسئولیت، اختیار و استاندارد؛ بازخورد و آموزش حین کار.",case:"کارکنان برای تصمیم‌های عادی مرتب به سرپرست مراجعه می‌کنند و او هر روز اضافه‌کار دارد.",tool:"پنج سؤال تفویض: نتیجه؟ اختیار؟ منابع؟ محدودیت؟ زمان بازبینی؟",blind:"تفویض کار بدون اختیار یا انجام دوباره کار به جای آموزش.",action:"یک فعالیت را با مرز تصمیم و دو نقطه بازبینی واگذار کنید."},m:{question:"چگونه سرپرستان را برای تصمیم‌های دشوار آماده کنم؟",outcome:"توسعه قابلیت سرپرستان، Coaching و مدیریت فرصت یادگیری واقعی.",case:"مدیر برای رفع عقب‌ماندگی به جای سرپرست تصمیم می‌گیرد و سپس از ضعف استقلال او گلایه دارد.",tool:"Development Conversation و IDP مبتنی بر تجربه، تمرین و Feedback.",blind:"تبدیل Coaching به دادن دستور یا پاسخ آماده.",action:"برای یک سرپرست، یک Stretch Assignment کم‌ریسک با بازخورد تعیین کنید."}},
   {name:"شناخت کسب‌وکار و بهبود مستمر",ids:["business","change"],s:{question:"کار من در زنجیره به‌پرور چه اثری بر سایر واحدها دارد؟",outcome:"درک وابستگی‌های عملیات و پیشنهاد بهبود کوچک اما قابل سنجش.",case:"خطای ساده در ثبت یا اطلاع‌رسانی باعث دوباره‌کاری انبار و اختلال ارسال می‌شود.",tool:"نقشه قبل/بعد فرایند و آزمایش چهار‌هفته‌ای بهبود.",blind:"محدود کردن مسئولیت به آخرین مرز سازمانی واحد.",action:"با همکار یک واحد دیگر، یک گلوگاه کوچک را مشترکاً اصلاح کنید."},m:{question:"کدام قابلیت مدیریتی برای رشد پایدار کسب‌وکار حیاتی‌تر است؟",outcome:"تحلیل محیط، شناسایی ریسک‌های زنجیره و اولویت‌بندی اقدامات تحول.",case:"نوسان نهاده، محدودیت ظرفیت و فشار بازار گزینه‌های تصمیم متفاوتی می‌سازند.",tool:"تحلیل محیط، فرضیات کلیدی، اولویت‌های تغییر و Pilot چهار‌هفته‌ای.",blind:"انتخاب پروژه تحول بدون مالک، شاخص یا ظرفیت اجرا.",action:"یک اقدام تغییر را با هدف، مالک، ریسک و بازبینی چهار هفته‌ای شروع کنید."}}
  ];
  var CASES={
    supervisors:{
      name:"پنج سرپرست، یک محموله و سه محدودیت",
      context:"سناریوی آموزشی فرضی در زنجیره تولید خوراک طیور. کیفیت مواد اولیه هنوز تأیید نشده، تجهیزات به بررسی نیاز دارند و واحد پرورش منتظر تحویل است. هیچ عددی متعلق به گزارش واقعی به‌پرور نیست.",
      people:[["احمدی","تولید"],["رضایی","کنترل کیفیت"],["کریمی","نت"],["محمدی","انبار"],["حسینی","ارسال"]],
      lines:[
        ["احمدی","با صدای نسبتاً بلند و دست‌های باز روی میز؛ بی‌قرار","ما امروز تعهد تحویل داشتیم. چرا تازه اول شیفت می‌فهمیم مواد قابل مصرف نیست؟"],
        ["رضایی","آرام، محکم، با نگاه مستقیم","مغایرت ثبت شده، اما تا زمان تأیید نهایی آزادسازی نداریم. عقب‌ماندگی تولید این محدودیت را حذف نمی‌کند."],
        ["محمدی","کمی تدافعی؛ پرونده را جلو می‌گذارد","من دیروز وضعیت را فرستادم. موجودی جایگزین هست، ولی استفاده‌اش بدون تأیید فرمولاسیون مجاز نیست."],
        ["حسینی","رو به جمع، با لحن فوری اما محترمانه","خودرو آماده است، ولی واحد پرورش هم باید بداند دقیقاً چه زمانی تحویل می‌گیرد. وعده نامطمئن از تأخیر صادقانه بدتر است."],
        ["کریمی","مکث کوتاه؛ دست روی گزارش فنی","درست، اما بررسی تجهیز را هم نباید حذف کنیم. توقف امروز شاید از خرابی سنگین فردا جلوگیری کند."],
        ["احمدی","لحن را پایین می‌آورد و یادداشت برمی‌دارد","پس موضوع را تفکیک کنیم: مواد، تجهیز و تعهد حمل. هر محدودیت چه زمانی روشن می‌شود و چه کسی مسئول پاسخ است؟"],
        ["رضایی","با اعتمادبه‌نفس و بدون عقب‌نشینی از استاندارد","نتیجه بررسی تکمیلی را اعلام می‌کنم؛ مجوز مصرف فقط طبق روال فنی خواهد بود."],
        ["محمدی","رو به رضایی و کریمی","من فهرست مواد جایگزین را می‌دهم تا فقط گزینه‌های مجاز بررسی شوند."],
        ["کریمی","به احمدی نگاه می‌کند؛ قاطع","زمان آماده‌به‌کاری تجهیز را با حاشیه اطمینان اعلام می‌کنم. قول غیرواقعی نمی‌دهم."],
        ["حسینی","گوشی را کنار می‌گذارد و خلاصه می‌کند","من زمان جدید را مشروط اطلاع می‌دهم و درباره نیاز فوری واحد دریافت‌کننده اطلاعات می‌گیرم."],
        ["رضایی","لحن تأملی","یک نکته: هر پنج واحد شاید دستورالعمل خودش را رعایت کرده باشد، ولی خروجی مشترک هنوز مشکل دارد."],
        ["احمدی","با مکث و نگاه به همه","پس فقط مشکل امروز را جمع نکنیم. از فردا وضعیت کیفیت، موجودی، آماده‌به‌کاری و حمل باید قبل از تعهد نهایی مشترک دیده شود."]
      ],
      question:"اگر مسئول هماهنگی باشید، قبل از فشار بر تولید چه تصمیم و چه داده‌ای ضروری است؟",
      feedback:"رفتار مطلوب: تعریف مشترک مسئله، حفظ خط قرمز کیفیت/ایمنی، مسئول‌گذاری، زمان‌بندی، اطلاع‌رسانی بدون وعده ساختگی و یادگیری فرایندی."
    },
    managers:{
      name:"پنج مدیر و مسئله عملکرد کل زنجیره",
      context:"داده‌های فرضی آموزشی: رشد ۹٪ هزینه بخشی از نهاده‌ها طی سه ماه، افزایش تأخیر تحویل از ۷٪ به ۱۲٪. ارقام واقعی به‌پرور نیستند و هدف، تمرین تحلیل بین‌واحدی است.",
      people:[["نادری","عملیات"],["موسوی","کیفیت"],["رستمی","بازرگانی"],["صالحی","مالی"],["کاویانی","منابع انسانی"]],
      lines:[
        ["رستمی","با لحن گلایه کنترل‌شده؛ رو به عملیات","ما جلوی مشتری پاسخگو هستیم. تغییر دیرهنگام زمان تحویل، اعتماد را فرسوده می‌کند."],
        ["نادری","با انگشت به برنامه ظرفیت اشاره می‌کند","اما بخشی از سفارش‌ها پس از تثبیت برنامه اضافه می‌شود. آیا هزینه تغییر برنامه در تصمیم فروش دیده شده؟"],
        ["موسوی","صاف نشسته؛ لحن آرام و جدی","قبل از بحث زمان، محدودیت کنترل کیفیت را روشن کنیم. کیفیت متغیر قابل معامله نیست."],
        ["صالحی","با تأمل؛ جدول عددی را نشان می‌دهد","حتی عدد تأخیر هم در گزارش فروش و تولید تعریف یکسانی ندارد. با داده ناسازگار به نتیجه محکم نمی‌رسیم."],
        ["کاویانی","با نگاه به جمع، بدون سرزنش","کارکنان از تغییر مداوم اولویت‌ها فرسوده شده‌اند. آیا مسئله واقعاً انگیزش است، یا طراحی نامناسب فرایند تصمیم؟"],
        ["نادری","کمی مکث می‌کند؛ صدایش نرم‌تر می‌شود","ممکن است بخشی از فشار از ما آمده باشد. خوب است تفاوت تغییرات برنامه‌ریزی‌شده و اضطراری را بررسی کنیم."],
        ["رستمی","رو به صالحی","پس یک شاخص مشترک تحویل تعریف کنیم و اثر تصمیم بر مشتری را نیز بسنجیم."],
        ["صالحی","با لحن تحلیلی","سه سنجه می‌خواهم: هزینه قابل کنترل، تحویل به‌موقع و سودآوری سفارش. تعریف و منبع هر سه روشن باشد."],
        ["موسوی","با تأکید و بدون بالا بردن صدا","در کنار آنها یک Guardrail کیفیت قرار دهیم؛ موفقیت مالی با عبور از حدهای فنی، موفقیت نیست."],
        ["کاویانی","حالت پرسشگر؛ قلم در دست","چه کسی سرپرستان را در تصمیم‌های روزمره پشتیبانی می‌کند؟ اگر اختیار مبهم بماند، جلسه مدیران به‌تنهایی کافی نیست."],
        ["نادری","رو به تمام گروه؛ جمع‌بندی","یک Pilot چهار‌هفته‌ای بین فروش، عملیات، کیفیت و مالی اجرا کنیم. مالک فرایند، نقاط تصمیم و گزارش هفتگی مشخص باشد."],
        ["رستمی","با لبخند کوتاه و لحن واقع‌گرا","پس موفقیت فقط فروش بیشتر نیست؛ باید سفارشی بگیریم که کل زنجیره بتواند قابل اتکا و اقتصادی اجرا کند."]
      ],
      question:"آیا بهبود KPI یک واحد، بدون توجه به Guardrail کیفیت و نتیجه سایر واحدها، موفقیت مدیریتی است؟",
      feedback:"رفتار مطلوب: دیدن زنجیره ارزش، تعریف مشترک داده، بررسی Trade-off، محافظت از استانداردها، تعیین مالک فرایند و Pilot قابل سنجش."
    }
  };

  var GUIDE=window.MML_GUIDE_V2;
  var ZONES=[
    {name:"خودم",en:"Develop Self",ids:["self","problem","judgment"],desc:"آگاهی از رفتار خود، حل مسئله و تصمیم درست.",image:""},
    {name:"دیگران",en:"Enable Others",ids:["communication","conflict","delegation","coaching"],desc:"گفت‌وگو، همکاری، هدایت و رشد کارکنان.",image:""},
    {name:"کسب‌وکار",en:"Improve the Business",ids:["planning","coordination","performance","business","change"],desc:"برنامه‌ریزی، هماهنگی، عملکرد و بهبود زنجیره.",image:""}
  ];
  function guide(n){return GUIDE.lessons[n-1][role==="managers"?"m":"s"]}
  function roleTerm(){return role==="managers"?"مدیر":"سرپرست"}
  function zoneCards(){
    return '<div class="mml-zone-grid">'+ZONES.map(function(z,i){
      var img=[["◎","خودم"],["♧","دیگران"],["◈","کسب‌وکار"]][i];
      return '<div class="mml-zone mml-zone-'+i+'"><span class="mml-zone-icon" aria-hidden="true">'+img[0]+'</span><b>'+z.name+'</b><small dir="ltr">'+z.en+'</small><p>'+z.desc+'</p><details><summary>شایستگی‌های این دسته</summary><ul>'+z.ids.map(function(id){return '<li>'+esc(item(id).fa)+'</li>'}).join("")+'</ul></details></div>';
    }).join("")+'</div>';
  }
  function sources(n){
    return '<details class="mml-evidence"><summary>پشتوانه علمی این جلسه</summary><ul>'+GUIDE.sources[n-1].map(function(x){return '<li>'+esc(x)+'</li>'}).join("")+'</ul><p>مثال‌ها و تمرین‌ها برای به‌پرور تألیف شده‌اند؛ آزمون استاندارد یا محتوای اختصاصی ناشر نیستند.</p></details>';
  }
  function practice(n){
    var g=guide(n),saved=lab.choices&&lab.choices[role+":"+n],chosen=(saved===0||saved===1||saved===2)?saved:null;
    return '<div class="mml-practice" data-mml-practice="'+n+'"><h3>اگر جای او بودی، چه می‌کردی؟</h3><p>'+esc(g.question)+'</p><div class="mml-practice-options">'+g.options.map(function(o,i){return '<button type="button" data-mml-choice="'+n+':'+i+'" aria-pressed="'+(chosen===i)+'"><span>'+["الف","ب","ج"][i]+'</span>'+esc(o)+'</button>'}).join("")+'</div><div class="mml-practice-feedback" aria-live="polite"'+(chosen===null?' hidden':'')+'>'+(chosen===null?"":esc(g.feedback[chosen]))+'</div></div>';
  }
  function miniDialogue(n){
    var g=guide(n);
    return '<div class="mml-mini-dialogue"><h3>گفت‌وگوی کوتاه در محل کار</h3>'+g.role.map(function(d){return '<div class="mml-dialogue-line"><strong>'+esc(d[0])+'</strong><span>'+esc(d[1])+'</span><p>«'+esc(d[2])+'»</p></div>'}).join("")+'</div>';
  }
  function visual(n){
    if(n===1)return '<div class="mml-flow"><span>انجام کار با تخصص خودم</span><b>←</b><span>ممکن‌کردن کار درست توسط تیم</span></div>';
    if(n===2)return '<div class="mml-visual-card"><h3>برگه برنامه یک‌دقیقه‌ای</h3><div class="mml-table-wrap"><table><thead><tr><th>کار</th><th>محدودیت</th><th>مسئول</th><th>زمان بازبینی</th></tr></thead><tbody><tr><td>آماده‌سازی محموله</td><td>تأیید کیفیت</td><td>تولید و کیفیت</td><td>پیش از اعلام تحویل</td></tr></tbody></table></div></div>';
    if(n===3)return '<div class="mml-visual-card"><h3>مثال عددی فرضی: عملکرد خط</h3><div class="mml-bar"><label>هدف تمرینی: ۸ ساعت آماده‌به‌کاری</label><div><span style="width:100%"></span></div></div><div class="mml-bar"><label>عملکرد فرضی: ۶ ساعت</label><div><span style="width:75%"></span></div></div><p>اختلاف: ۲ ساعت. عدد به‌تنهایی علت را نشان نمی‌دهد؛ توقف‌ها را بررسی کن.</p></div>';
    if(n===4)return '<div class="mml-contrast"><div><small>پیش از اصلاح</small><p>«تو همیشه بی‌دقتی!»</p></div><div><small>بعد از اصلاح</small><p>«مغایرت امروز در گزارش ثبت شد. چه چیزی پیش آمد؟»</p></div></div>';
    if(n===5)return '<div class="mml-flow"><span>نتیجه روشن</span><b>←</b><span>اختیار کافی</span><b>←</b><span>زمان بازبینی</span></div>';
    return '<div class="mml-visual-card"><h3>زنجیره ارزش به‌پرور، در یک نگاه</h3><div class="mml-flow"><span>تأمین نهاده</span><b>←</b><span>مرغ مادر و تخم‌مرغ نطفه‌دار</span><b>←</b><span>جوجه‌کشی و جوجه یک‌روزه</span><b>←</b><span>پرورش گوشتی</span><b>←</b><span>کشتار و بسته‌بندی</span><b>←</b><span>توزیع و مشتری</span></div><p>نمای آموزشیِ ساده‌شده بر اساس حوزه‌های فعالیت عمومی گروه؛ نه چارت رسمی یا مسیر الزامی همه محصولات. کیفیت و ایمنی در تمام مراحل جریان دارند.</p></div>';
  }

  function esc(x){return String(x).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
  function readJSON(k){try{return JSON.parse(localStorage.getItem(k)||"null")}catch(e){return null}}
  function writeJSON(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}}
  var previous=readJSON("behparvar_app_v1")||{},oldRoot=readJSON("behparvar_session1_v4")||{};
  var role=new URLSearchParams(location.search).get("audience")||oldRoot.audience||previous.role||"managers";
  if(role!=="managers"&&role!=="supervisors")role="managers";
  var lab=readJSON("mml_competency_v1")||{levels:{},actions:{}};
  if(!lab.levels||typeof lab.levels!=="object")lab.levels={};
  if(!lab.actions||typeof lab.actions!=="object")lab.actions={};
  previous=Object.assign({role:role,done:[],starred:[],last:{session:1,part:"m1",role:role}},previous);
  if(!Array.isArray(previous.done))previous.done=[];
  if(!Array.isArray(previous.starred))previous.starred=[];
  var promptEvent=null;
  var installed=window.matchMedia&&window.matchMedia("(display-mode: standalone)").matches;
  var words=["اول","دوم","سوم","چهارم","پنجم","ششم"];
  function target(n,part){return "#"+(n===1?part:"session"+n+"-"+part)}
  function levelKey(id){return role+":"+id}
  function actionKey(n){return role+":"+n}
  function savePassport(){writeJSON("behparvar_app_v1",previous)}
  function saveLab(){writeJSON("mml_competency_v1",lab)}
  function roleName(){return role==="managers"?"مدیران":"سرپرستان"}
  function track(n){return PROGRAM[n-1][role==="managers"?"m":"s"]}
  function item(id){return SKILLS.find(function(s){return s.id===id})}
  function renderFamilies(){return FAMILIES.map(function(f){return '<div class="mml-family"><strong>'+f[0]+'</strong><span>'+f[1]+'</span></div>'}).join("")}
  function changeRole(next){if(next===role)return;var u=new URL(location.href);u.searchParams.set("audience",next);location.assign(u.href)}
  function roleSwitcher(){
    return '<div class="mml-role-picker" role="group" aria-label="مسیر آموزشی"><button type="button" data-mml-role="supervisors" aria-pressed="'+(role==="supervisors")+'">مسیر سرپرستان</button><button type="button" data-mml-role="managers" aria-pressed="'+(role==="managers")+'">مسیر مدیران</button></div>';
  }
  function renderSkills(ids){
    return ids.map(function(id){var s=item(id);return '<div class="mml-skill"><strong>'+esc(s.fa)+'</strong><small>'+esc(s.en)+' · '+esc(s.group)+'</small><p>'+esc(s.behavior)+'</p><span>شاهد عملکرد: '+esc(s.evidence)+'</span></div>'}).join("");
  }
  function levels(n){
    return PROGRAM[n-1].ids.map(function(id){
      var sk=item(id),v=lab.levels[levelKey(id)]||"";
      return '<label class="mml-level-row"><span><b>'+esc(sk.fa)+'</b><small>'+esc(sk.behavior)+'</small></span><select aria-label="میزان تجربه من در '+esc(sk.fa)+'" data-mml-level="'+esc(id)+'"><option value="">انتخاب من...</option>'+[1,2,3,4].map(function(i){return '<option value="'+i+'"'+(String(i)===String(v)?" selected":"")+'>'+["","۱ · تازه شروع کرده‌ام","۲ · با راهنمایی انجام می‌دهم","۳ · مستقل انجام می‌دهم","۴ · به دیگران هم یاد می‌دهم"][i]+'</option>'}).join("")+'</select></label>';
    }).join("");
  }
  function caseHTML(){
    var c=CASES[role];
    return '<div class="mml-case"><p class="mml-note">Case-based Simulation · همه اعداد و اشخاص آموزشی و فرضی هستند</p><h3>'+esc(c.name)+'</h3><p>'+esc(c.context)+'</p><div class="mml-people">'+c.people.map(function(p){return '<span>'+esc(p[0])+' · '+esc(p[1])+'</span>'}).join("")+'</div><ol class="mml-dialogues">'+c.lines.map(function(line){return '<li><strong>'+esc(line[0])+'</strong><small>لحن / Body language: '+esc(line[1])+'</small><p>'+esc(line[2])+'</p></li>'}).join("")+'</ol><div class="mml-key"><strong>پرسش تسهیلگر</strong><p>'+esc(c.question)+'</p><p>'+esc(c.feedback)+'</p></div></div>';
  }
  function renderSection(n,partIndex){
    var cfg=PROGRAM[n-1],g=guide(n),t=track(n),p=PARTS[partIndex],k=actionKey(n),text="";
    if(partIndex===0){
      text='<p class="mml-lead">آخرین بار که در چنین موقعیتی بودی را به یاد بیاور؛ نه آنچه دوست داری انجام بدهی.</p>'+levels(n)+
      '<div class="mml-hint"><b>راهنما</b><p>اگر هنوز در این کار تجربه نداری، «تازه شروع کرده‌ام» را انتخاب کن. این ابزار برای شناخت نیاز یادگیری است، نه نمره دادن به افراد.</p></div>';
    }else if(partIndex===1){
      text=(n===1?'<details class="mml-script"><summary>گفت‌وگوی کامل پنج '+(role==="managers"?"مدیر":"سرپرست")+' را باز کن</summary>'+caseHTML()+'</details>':miniDialogue(n))+
      '<div class="mml-hint"><b>تمرین دونفره · ۵ دقیقه</b><p>نفر اول نقش '+roleTerm()+' را اجرا می‌کند؛ نفر دوم لحن، گوش‌دادن و مشخص‌بودن قدم بعدی را مشاهده می‌کند. سپس نقش‌ها عوض شود.</p></div>'+'<details class="mml-observer"><summary>چک‌لیست ناظر · سه نکته</summary><label><input type="checkbox"> مسئله و رفتار مشخص بیان شد.</label><label><input type="checkbox"> طرف مقابل شنیده شد، بدون برچسب‌زنی.</label><label><input type="checkbox"> اقدام، مسئول و زمان بعدی روشن است.</label></details>';
    }else if(partIndex===2){
      text='<div class="mml-mini-lesson"><h3>یک نکته کاربردی</h3><p>'+esc(g.lesson)+'</p><h3>یک مثال از محیط کار</h3><p>'+esc(g.example)+'</p></div>'+sources(n);
    }else if(partIndex===3){
      text='<div class="mml-steps"><h3>سه گام قابل اجرا</h3>'+g.steps.map(function(x,i){return '<div class="mml-step"><span>'+(i+1)+'</span><p>'+esc(x)+'</p></div>'}).join("")+'</div><div class="mml-contrast"><div><small>بهتر است نگوییم</small><p>«'+esc(g.poor)+'»</p></div><div><small>بهتر است بگوییم</small><p>«'+esc(g.better)+'»</p></div></div>';
    }else if(partIndex===4){
      text=visual(n)+practice(n);
    }else if(partIndex===5){
      text='<div class="mml-contrast"><div><small>خطای رایج</small><p>'+esc(t.blind)+'</p></div><div><small>بهتر است</small><p>'+esc(g.better)+'</p></div></div><div class="mml-hint"><b>یک سؤال برای خودم</b><p>در آخرین تجربه مشابه، کدام اطلاعات یا نظر یک واحد دیگر را جدی نگرفتم؟</p></div>';
    }else{
      var when=(lab.when||{})[k]||"",proof=(lab.proof||{})[k]||"";
      text='<p class="mml-lead">برای هفته آینده فقط یک کار کوچک انتخاب کن. لازم نیست پروژه بزرگ تعریف کنی.</p>'+
      '<label class="mml-action-label">۱. چه کاری انجام می‌دهم؟<textarea rows="2" data-mml-action="'+n+'" placeholder="'+esc(t.action)+'">'+esc(lab.actions[k]||"")+'</textarea></label>'+
      '<label class="mml-action-label">۲. کی انجام می‌دهم؟<input data-mml-when="'+n+'" placeholder="مثلاً شیفت شنبه یا جلسه هفتگی" value="'+esc(when)+'"></label>'+
      '<label class="mml-action-label">۳. از کجا می‌فهمم بهتر شده؟<input data-mml-proof="'+n+'" placeholder="مثلاً ثبت یک توافق روشن یا کاهش یک خطای تکراری" value="'+esc(proof)+'"></label>'+
      '<p class="mml-save-status" role="status">یادداشت به‌صورت محلی در همین مرورگر ذخیره می‌شود.</p>';
    }
    return '<div class="mml-layer mml-module" data-mml-section="'+n+'-'+p+'"><div class="mml-layer-head"><small>جلسه '+n+' · '+esc(roleName())+'</small><h2>'+esc(TITLES[partIndex])+'</h2></div><div class="mml-body">'+text+'</div><div class="mml-layer-footer"><span>'+cfg.ids.map(function(id){return esc(item(id).fa)}).join(' · ')+'</span><button type="button" data-mml-complete="'+n+':'+p+'">✓ مرور شد</button></div></div>';
  }
  function courseOverview(){
    return '<section class="mml-hub" aria-label="My Management Lab"><div class="mml-hub-head"><div><small>BEHPARVAR · LEARN BY DOING</small><h1>My Management Lab</h1><p>یادگیری مدیریت، از دل کار واقعی</p><span>خودم · دیگران · کسب‌وکار</span></div><img src="assets/behparvar-campus.webp" alt="نمای مجموعه به‌پرور" loading="lazy"></div>'+
    roleSwitcher()+zoneCards()+
    '<details class="mml-more"><summary>نقشه کامل ۱۲ شایستگی</summary><div class="mml-skills-grid">'+renderSkills(SKILLS.map(function(x){return x.id}))+'</div></details>'+
    '<details class="mml-more"><summary>درباره مبنای آموزشی</summary><p>مبنای توسعه مهارت‌ها Whetten & Cameron و چارچوب تعریف شایستگی DDI است. از روش آموزش مرحله‌ای OpenLearn و تمرین همراه با بازخورد در Pearson MyLab Management نیز الهام گرفته‌ایم. مثال‌ها اصیل و متناسب با فضای به‌پرورند.</p><p>این مدل آموزشی است؛ برای ارزیابی رسمی سازمانی به تحلیل شغل و اعتبارسنجی نیاز دارد.</p></details>'+ 
    '<details class="mml-more mml-upcoming"><summary>مربی مدیریت من · بزودی</summary><p>My AI Management Coach هنوز فعال نیست؛ در نسخه‌های بعدی می‌تواند برای تمرین گفت‌وگو و بازتاب تجربه به کار رود.</p></details></section>';
  }
  function sessionIntro(n){
    var c=PROGRAM[n-1],g=guide(n),img=n===2||n===3?"assets/feed-official.webp":n===6?"assets/production-official.webp":null;
    return '<section class="mml-intro"><div class="mml-intro-text"><small>جلسه '+n+' · مسیر '+esc(roleName())+'</small><h2>'+esc(c.name)+'</h2><p>'+esc(g.lesson)+'</p><div class="mml-competency-tags">'+c.ids.map(function(id){return '<span>'+esc(item(id).fa)+'</span>'}).join("")+'</div><a class="mml-switch" href="#course">تغییر مسیر</a></div>'+(img?'<img src="'+img+'" alt="فضای تولید و عملیات مرتبط با زنجیره فعالیت به‌پرور" loading="lazy">':"")+'</section>';
  }
  function renderPassport(){
    var done=previous.done.filter(function(x){return x.indexOf(role+":")===0}),stars=previous.starred.filter(function(x){return x.indexOf(role+":")===0});
    var count=done.length,total=42;
    return '<p>مسیر: <b>'+roleName()+'</b> · بخش‌های مرورشده: <b>'+count+' از '+total+'</b></p><progress value="'+count+'" max="'+total+'" aria-label="پیشرفت مرور"></progress>'+
      '<h3>نشانک‌ها</h3><div>'+ (stars.length?stars.map(function(x){var p=x.split(":");return '<a href="'+target(Number(p[1]),p[2])+'">'+esc("جلسه "+p[1]+" · "+TITLES[PARTS.indexOf(p[2])]||p[2])+'</a>'}).join(" · "):'<p>هنوز نشانکی ثبت نشده است.</p>')+'</div>'+
      '<p class="mml-note">Progress صرفاً مرور دستی بخش‌هاست؛ نشان‌دهنده کسب شایستگی یا تکمیل آزمون‌ها نیست. داده‌ها در همین مرورگر ذخیره می‌شوند.</p>';
  }
  function buildToolbar(){
    var mast=document.querySelector(".masthead");
    if(!mast)return;
    var bar=document.createElement("div");bar.className="mml-toolbar";bar.setAttribute("aria-label","ابزارهای My Management Lab");
    bar.innerHTML='<a href="#course" class="mml-logo">◆ My Management Lab</a><button type="button" data-mml-open="passport">پاسپورت یادگیری</button><button type="button" data-mml-open="coaches">مربیان من · بزودی</button><button type="button" id="mmlInstall">نصب اپ</button>';
    mast.insertAdjacentElement("afterend",bar);
    var dialog=document.createElement("dialog");dialog.id="mmlDialog";dialog.className="mml-dialog";dialog.setAttribute("aria-label","پنجره اطلاعات My Management Lab");
    dialog.innerHTML='<form method="dialog"><button class="mml-close" aria-label="بستن" type="submit">×</button></form><div id="mmlDialogBody"></div>';
    document.body.appendChild(dialog);
    function openDialog(type){
      document.getElementById("mmlDialogBody").innerHTML=type==="passport"?'<h2>Learning Passport</h2>'+renderPassport():
        '<h2>مربیان من</h2><p>My AI Management Coach و مربی رهبری من در این نسخه فقط به‌عنوان قابلیت آینده معرفی شده‌اند.</p><p class="mml-note">بزودی · هنوز سرویس هوش مصنوعی، پاسخ‌گویی خودکار یا تحلیل اطلاعات شخصی فعال نیست.</p>';
      if(typeof dialog.showModal==="function")dialog.showModal();else dialog.setAttribute("open","");
    }
    document.body.addEventListener("click",function(e){
      var button=e.target.closest("[data-mml-open]");if(button)openDialog(button.dataset.mmlOpen);
    });
    document.getElementById("mmlInstall").addEventListener("click",async function(){
      if(promptEvent){var event=promptEvent;promptEvent=null;event.prompt();try{await event.userChoice}catch(e){}return}
      openDialog("install");document.getElementById("mmlDialogBody").innerHTML='<h2>نصب My Management Lab</h2><p>در Chrome یا مرورگر پشتیبانی‌شده، از منوی مرورگر Install app / افزودن به صفحه اصلی را بزنید.</p><p>در iPhone: Safari → Share → Add to Home Screen. در نسخه نصب‌شده، همه مطالب به یک نشانی مشترک متصل می‌شوند.</p><p class="mml-note">اگر مرورگر درخواست نصب نشان نمی‌دهد، احتمالاً نصب قبلاً انجام شده یا قابلیت در آن مرورگر فعال نیست.</p>';
    });
    if(new URLSearchParams(location.search).has("passport"))openDialog("passport");
    if(new URLSearchParams(location.search).has("coach"))openDialog("coaches");
  }
  function updateCompletion(button){
    var p=button.getAttribute("data-mml-complete").split(":"),k=role+":"+p[0]+":"+p[1],exists=previous.done.includes(k);
    if(exists)previous.done=previous.done.filter(function(x){return x!==k});else previous.done.push(k);
    savePassport();button.textContent=exists?"✓ مرور شد":"✓ ثبت شد";button.setAttribute("aria-pressed",String(!exists));
  }
  function wire(){
    document.addEventListener("click",function(e){
      var b=e.target.closest("[data-mml-role]");if(b){changeRole(b.getAttribute("data-mml-role"));return}
      b=e.target.closest("[data-mml-complete]");if(b){updateCompletion(b);return}
      b=e.target.closest("[data-mml-choice]");if(b){
        var a=b.dataset.mmlChoice.split(":"),n=Number(a[0]),choice=Number(a[1]);
        if(!lab.choices)lab.choices={};lab.choices[role+":"+n]=choice;saveLab();
        var container=b.closest("[data-mml-practice]");container.querySelectorAll("[data-mml-choice]").forEach(function(el){el.setAttribute("aria-pressed",String(el===b))});
        var f=container.querySelector(".mml-practice-feedback");f.hidden=false;f.innerHTML="<p>"+esc(guide(n).feedback[choice])+"</p><p><strong>یک جمله کاربردی:</strong> "+esc(guide(n).better)+"</p>";return;
      }
    });
    document.addEventListener("change",function(e){
      var x=e.target.closest("[data-mml-level]");if(x){lab.levels[levelKey(x.dataset.mmlLevel)]=Number(x.value)||null;saveLab()}
    });
    document.addEventListener("input",function(e){
      var x=e.target.closest("[data-mml-action]");if(x){lab.actions[actionKey(Number(x.dataset.mmlAction))]=x.value;saveLab()}
      x=e.target.closest("[data-mml-when]");if(x){if(!lab.when)lab.when={};lab.when[actionKey(Number(x.dataset.mmlWhen))]=x.value;saveLab()}
      x=e.target.closest("[data-mml-proof]");if(x){if(!lab.proof)lab.proof={};lab.proof[actionKey(Number(x.dataset.mmlProof))]=x.value;saveLab()}
    });
    window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();promptEvent=e});
    window.addEventListener("appinstalled",function(){installed=true;promptEvent=null;var b=document.getElementById("mmlInstall");if(b)b.textContent="نصب شده"});
    window.addEventListener("hashchange",function(){
      var hash=location.hash.replace(/^#/,""),m=/^session([2-6])-(m1|m2|leaders|techniques|visuals|diseases|quiz)$/.exec(hash),n=m?Number(m[1]):PARTS.includes(hash)?1:null,p=m?m[2]:hash;
      if(n){previous.last={session:n,part:p,role:role};previous.role=role;savePassport()}
    });
    if("serviceWorker" in navigator){window.addEventListener("load",function(){navigator.serviceWorker.register("./sw.js").catch(function(){})})}
  }
  function init(){
    var c=document.getElementById("course");
    if(!c)return;
    document.body.classList.add("mml-refreshed");
    document.title="My Management Lab | به‌پرور";
    var h=c.querySelector(".course-heading h1");if(h)h.textContent="My Management Lab | به‌پرور";
    var d=document.createElement("div");d.innerHTML=courseOverview();
    c.querySelector(".course-heading").insertAdjacentElement("afterend",d.firstElementChild);
    for(var n=1;n<=6;n++){
      var entry=document.getElementById(n===1?"home":"session"+n);
      if(entry){
        var x=document.createElement("div");x.innerHTML=sessionIntro(n);
        var hd=entry.querySelector(".page-heading, .course-heading");
        if(hd)hd.insertAdjacentElement("afterend",x.firstElementChild);else entry.insertBefore(x.firstElementChild,entry.firstChild);
      }
      PARTS.forEach(function(p,i){
        var view=document.getElementById(n===1?p:"session"+n+"-"+p);
        if(!view)return;
        view.setAttribute("aria-label",TITLES[i]+" · جلسه "+n);
        var node=document.createElement("div");node.innerHTML=renderSection(n,i);
        var hd=view.querySelector(".page-heading, header");
        if(hd)hd.insertAdjacentElement("afterend",node.firstElementChild);else view.insertBefore(node.firstElementChild,view.firstChild);
        view.classList.add("mml-refreshed-view");
        var content=[...view.children].filter(function(e){return e!==hd&&!e.classList.contains("mml-layer")});
        if(content.length){
          var details=document.createElement("details");details.className="mml-legacy";
          var summary=document.createElement("summary");summary.textContent=n===1?"مطالب و تمرین‌های تکمیلی جلسه":"یادداشت‌ها و مطالب قبلی";details.appendChild(summary);
          var inner=document.createElement("div");inner.className="mml-legacy-body";
          content.forEach(function(e){inner.appendChild(e)});
          details.appendChild(inner);view.appendChild(details);
        }
      });
    }
    buildToolbar();wire();
    if(!location.hash||location.hash==='#course')requestAnimationFrame(function(){window.scrollTo({top:0,behavior:'auto'})});
    if(installed){var b=document.getElementById("mmlInstall");if(b)b.textContent="نصب شده"}
  }
  
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();