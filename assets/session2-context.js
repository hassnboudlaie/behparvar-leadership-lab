
/* BEHPARVAR Session 2 — contextual learning, separate from existing course engine. */
(function(){
'use strict';
const role=new URLSearchParams(location.search).get('audience')==='supervisors'?'supervisors':'managers';
const isSupervisor=role==='supervisors';
const roleFa=isSupervisor?'سرپرستان':'مدیران';
const storageKey='behparvar_session2_experience_v2_'+role;
let saved={};
try{saved=JSON.parse(localStorage.getItem(storageKey)||'{}')||{}}catch(e){}
const state={ratings:saved.ratings||{},cases:saved.cases||{},quiz:saved.quiz||{},quizFinished:!!saved.quizFinished,tabs:saved.tabs||{},practice:saved.practice||{}};
const store=()=>{try{localStorage.setItem(storageKey,JSON.stringify(state))}catch(e){}};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const modules=['m1','m2','leaders','techniques','visuals','diseases','quiz'];
const names=['سبک من','گفت‌وگوهای کاری','درس‌های رهبران','فنون رهبری','تصاویر مدیریتی','بیماری‌های مدیریتی','کوییز پایانی'];
function chrome(name,headline,lead){
 return '<div class="bp2-hero"><span class="bp2-eyebrow">جلسه دوم · رابطه حرفه‌ای با کارکنان · مسیر '+roleFa+'</span><h3>'+headline+'</h3><p>'+lead+'</p><div class="bp2-kpis"><span>موقعیت‌های نزدیک به محیط کار</span><span>انتخاب و پیامد</span><span>تمرین قابل اجرا</span></div></div>';
}
function note(message){return '<div class="bp2-callout">'+message+'</div>'}
function panel(title,content){return '<div class="bp2-panel"><h4>'+title+'</h4>'+content+'</div>'}
function button(text,attrs='',active=false){const extra=/class="([^"]+)"/.exec(attrs);if(extra)attrs=attrs.replace(extra[0],'');return '<button type="button" class="bp2-btn'+(extra?' '+extra[1]:'')+(active?' active':'')+'" '+attrs+' aria-pressed="'+active+'">'+text+'</button>'}
const context=isSupervisor?
 'در فضای شیفت، تحویل کار، هماهنگی با اپراتورهای باتجربه و فشار تحویل به‌موقع':
 'در تعامل میان مدیر، سرپرستان، واحدهای تولید، منابع انسانی و کیفیت';
const scenarios=[
 {title:'مدیر تازه‌منصوب و نیروی باسابقه',tag:'احترام و اقتدار',
  story:isSupervisor?'شما سرپرست تازه‌منصوب هستید. یکی از اپراتورهای باتجربه در جمع می‌گوید: «این روال را سال‌هاست انجام می‌دهیم؛ لازم نیست برای ما توضیح بدهید.»':'شما مدیر یک واحد شده‌اید. کارشناس باسابقه در جلسه می‌گوید: «ما قبل از آمدن شما هم همین کار را انجام می‌دادیم؛ چرا باید تغییر کنیم؟»',
  options:[
   ['در جمع تأکید می‌کنم تصمیم نهایی با من است.','مرزبندی بدون شنیدن نگرانی، اقتدار را به تقابل قدرت تبدیل می‌کند.','ابتدا گفت‌وگوی دونفره، سپس توضیح معیار کار در جمع.'],
   ['تجربه او را تأیید می‌کنم، نگرانی‌اش را می‌پرسم و سپس انتظار مشخص می‌گذارم.','انتخاب متوازن: احترام به تجربه، شنیدن دلیل مقاومت و حفظ مسئولیت تصمیم‌گیری.','در گفت‌وگوی خصوصی بپرسید: «کدام بخش این تغییر از نظر شما ریسک دارد؟»',1],
   ['برای جلوگیری از تنش، اجرای روال جدید را به او واگذار می‌کنم.','صمیمیت یا اجتناب از تعارض، جای تعیین انتظار و پاسخگویی را نمی‌گیرد.','زمان و معیار بازبینی را روشن کنید.']
  ]},
 {title:'انتقال کار بین دو واحد',tag:'شفافیت و اعتماد',
  story:isSupervisor?'در تحویل شیفت، اطلاعات توقف دستگاه کامل منتقل نشده و شیفت بعدی ناراضی است. دو نفر یکدیگر را مقصر می‌دانند.':'سرپرست تولید می‌گوید واحد کیفیت دیر پاسخ می‌دهد؛ واحد کیفیت می‌گوید مدارک ناقص است. کارکنان از پیام‌های متناقض سردرگم شده‌اند.',
  options:[
   ['بدون بررسی، از یکی از دو طرف می‌خواهم عذرخواهی کند.','داوری فوری قبل از روشن‌شدن واقعیت، احتمال دفاعی‌شدن را بالا می‌برد.','داده، انتظار و نقطه تحویل را بررسی کنید.'],
   ['دو روایت را می‌شنوم؛ سپس خروجی، مسئول و موعد انتقال را مکتوب می‌کنیم.','گوش‌دادن بی‌طرفانه همراه با تعریف تعهد مشترک، ابهام را کاهش می‌دهد.','یک توافق کوتاه سه‌جزئی ثبت کنید: چه چیزی، چه کسی، چه زمانی.',1],
   ['موضوع را رها می‌کنم تا با یکدیگر حل کنند.','تیم ممکن است خودراهبر باشد؛ اما ابهام تکرارشونده نیازمند تسهیلگری و استاندارد است.','مانع سیستمی ارتباط را برطرف کنید.']
  ]},
 {title:'کارمند ساکت در جلسه',tag:'گوش‌دادن فعال',
  story:isSupervisor?'یکی از کارکنان بعد از تغییر برنامه شیفت کمتر صحبت می‌کند و چند بار پاسخ کوتاه داده است. سایرین علت را حدس می‌زنند.':'سرپرست توانمندی در نشست هماهنگی کمتر مشارکت می‌کند و پس از جلسه تصمیم‌ها را با تأخیر پیگیری می‌کند.',
  options:[
   ['جلوی جمع از او می‌پرسم چرا ناراضی است.','گفت‌وگوی حساس در جمع می‌تواند امنیت روانی را کاهش دهد.','فضای مناسب و محرمانه فراهم کنید.'],
   ['در خلوت مشاهدات دقیق را مطرح می‌کنم و بدون پیش‌داوری می‌پرسم چه اتفاقی افتاده است.','این شیوه بین مشاهده، تفسیر و قضاوت تفکیک می‌گذارد؛ راه را برای روشن‌شدن مسئله باز می‌کند.','با بازتاب شنیده‌ها و سؤال تأییدی ادامه دهید.',1],
   ['فرض می‌کنم موضوع شخصی است و پیگیری نمی‌کنم.','احترام به حریم مهم است، اما اثر رفتاری بر کار و ارتباط تیم نیز نیازمند گفت‌وگوست.','برای بررسی وضعیت کاری قرار کوتاه بگذارید.']
  ]},
 {title:'صمیمیت و درخواست استثنا',tag:'مرز حرفه‌ای',
  story:isSupervisor?'همکار نزدیکتان می‌خواهد این بار دیر رسیدنش را ثبت نکنید، چون «سال‌هاست با هم کار می‌کنیم».':'سرپرستی که رابطه دوستانه‌ای با شما دارد درخواست می‌کند گزارش ناقصش این ماه بدون اصلاح تأیید شود.',
  options:[
   ['برای حفظ رابطه، استثنا قائل می‌شوم.','امتیاز شخصی ممکن است احساس بی‌عدالتی و بی‌اعتمادی در تیم ایجاد کند.','معیار یکسان را برای همه توضیح دهید.'],
   ['با احترام درخواست را می‌شنوم، اما قاعده و راه اصلاح مجاز را روشن می‌کنم.','صمیمیت همراه با انصاف و قاطعیت؛ رابطه حفظ می‌شود بی‌آنکه استاندارد مخدوش شود.','جمله تمرینی: «موضوعت را می‌فهمم؛ اما ثبت و رسیدگی باید مطابق یک معیار باشد.»',1],
   ['با لحن تند یادآوری می‌کنم که دوستی در محیط کار معنا ندارد.','مرزبندی ضروری است، تحقیر و تندی ضرورتی ندارد.','مرز را بدون برچسب‌زدن به فرد بیان کنید.']
  ]}
];
const axes=[
 {id:'listen',name:'شنیدن و فهمیدن',short:'شنیدن',questions:[
 isSupervisor?'وقتی اپراتور از برنامه شیفت انتقاد می‌کند، قبل از دفاع، دلیلش را می‌پرسم.':'وقتی سرپرست با تصمیم من مخالف است، قبل از توضیح تصمیم، نگرانی‌اش را روشن می‌کنم.',
 'پس از شنیدن موضوع، برداشت خود را بازتاب می‌دهم و می‌پرسم «درست فهمیدم؟»'],action:'در گفت‌وگوی بعدی پیش از ارائه راه‌حل، یک سؤال باز و یک بازتاب شنیده‌ها مطرح کنید.'},
 {id:'trust',name:'اعتبار و اعتماد',short:'اعتماد',questions:['قول‌هایی که به کارکنان داده‌ام را در موعد مقرر پیگیری می‌کنم.','وقتی پاسخ موضوعی را نمی‌دانم، به‌جای حدس‌زدن زمان مشخصی برای بررسی می‌دهم.'],action:'یکی از قول‌های معوق را شفاف تعیین تکلیف و نتیجه را به فرد اعلام کنید.'},
 {id:'bound',name:'مرزبندی منصفانه',short:'مرزبندی',questions:['در برخورد با همکار نزدیک، همان معیار حرفه‌ای دیگران را اجرا می‌کنم.','هنگام نه‌گفتن، دلیل و مسیر مجاز جایگزین را محترمانه بیان می‌کنم.'],action:'برای یک درخواست دشوار، جمله‌ای کوتاه با احترام + مرز + گزینه مجاز آماده کنید.'},
 {id:'clarity',name:'شفافیت انتظار',short:'وضوح',questions:[
 isSupervisor?'هنگام واگذاری کار شیفت، خروجی، زمان تحویل و نحوه گزارش را روشن می‌کنم.':'هنگام واگذاری کار به سرپرست، خروجی، موعد و اختیار تصمیم‌گیری او را روشن می‌کنم.',
 'پیش از پایان گفت‌وگو از طرف مقابل می‌خواهم برداشتش از توافق را بیان کند.'],action:'یک انتظار مبهم را به «خروجی قابل مشاهده + موعد + معیار کیفیت» تبدیل کنید.'}
];
const questions=axes.flatMap(axis=>axis.questions.map(q=>({text:q,axis:axis.id})));
const techniques=[
 {title:'شنیدن سه‌مرحله‌ای',en:'Listen – Reflect – Confirm',why:'هنگام مقاومت، نارضایتی یا سکوت کارمند؛ هدف شنیدن بدون موافقت خودکار است.',steps:['سؤال باز: «چه چیزی برایت دشوار شده؟»','بازتاب: «آنچه می‌شنوم این است که…»','تأیید: «درست برداشت کردم؟»'],exercise:'یک گفت‌وگوی دو دقیقه‌ای را بدون قطع‌کردن حرف طرف مقابل تمرین کنید.',warning:'همدلی، به‌معنای پذیرفتن تمام درخواست‌ها نیست.'},
 {title:'توافق سه‌گانه',en:'Outcome – Owner – Deadline',why:'وقتی برداشت‌ها از کار متفاوت است یا تحویل میان شیفت‌ها و واحدها دچار ابهام می‌شود.',steps:['نتیجه مورد انتظار را مشخص کنید.','مسئول انجام و حدود اختیار را نام ببرید.','موعد و روش گزارش‌دادن را توافق کنید.'],exercise:'یک دستور مبهم واقعی را به توافق سه‌جزئی بازنویسی کنید.',warning:'«سریع انجام بده» انتظار قابل سنجش نیست.'},
 {title:'مرزبندی محترمانه',en:'Respect – Boundary – Alternative',why:'در درخواست استثنا، رابطه نزدیک یا تقاضای خارج از اختیار.',steps:['موقعیت و دغدغه فرد را به رسمیت بشناسید.','قاعده یا محدودیت را بدون سرزنش بگویید.','مسیر مجاز جایگزین را توضیح دهید.'],exercise:'با یک همکار، درخواست تبعیض‌آمیز را در ۴۵ ثانیه پاسخ دهید.',warning:'قاطعیت را با خشونت کلامی اشتباه نگیرید.'},
 {title:'اعتماد از مسیر پیگیری',en:'Promise – Follow-through – Repair',why:'وقتی کارکنان به گفته‌های مدیر اتکا نمی‌کنند یا وعده‌های گذشته بی‌پاسخ مانده است.',steps:['فقط تعهدی بدهید که اختیار و ظرفیت اجرای آن را دارید.','موعد و وضعیت پیگیری را شفاف کنید.','اگر تأخیر شد، مسئولیت بپذیرید و موعد تازه بدهید.'],exercise:'یک وعده ناتمام را شناسایی و نحوه تعیین تکلیف آن را یادداشت کنید.',warning:'اعتماد با نمایش قدرت ساخته نمی‌شود؛ با رفتار سازگار شکل می‌گیرد.'}
];
const leaders=[
 {title:'ساتیا نادلا',theme:'از دانستن همه‌چیز به یادگیری',lesson:'در گفت‌وگوی دشوار، کنجکاوی پیش از دفاع‌کردن می‌تواند راه فهم مسئله را باز کند.',prompt:'وقتی همکار باتجربه تصمیم شما را زیر سؤال می‌برد، چه سؤالی می‌پرسید؟',application:'قبل از پاسخ، از او بخواهید یک ریسک مشخص را توضیح دهد.'},
 {title:'آلن مولالی',theme:'واقعیت روی میز، نه پنهان‌کاری',lesson:'در جلسات هماهنگی، طرح مسئله بدون سرزنش، شرط حل مسئله مشترک است.',prompt:'در کدام جلسه واحدی، افراد از گزارش اشتباه یا تأخیر می‌ترسند؟',application:'با تشکر از بیان مسئله، تمرکز را از مقصر به گام بعدی تغییر دهید.'},
 {title:'مری بارا',theme:'شنیده‌شدن هشدارها',lesson:'برای اینکه افراد مسئله را زود مطرح کنند، مدیر باید واکنش قابل پیش‌بینی و محترمانه نشان دهد.',prompt:'آخرین بار که خبری ناخوشایند شنیدید، اولین جمله شما چه بود؟',application:'جمله آغازین را به «ممنون که زود مطرح کردی؛ چه می‌دانیم؟» تغییر دهید.'},
 {title:'اد کتمول',theme:'صراحت همراه با احترام',lesson:'کیفیت گفت‌وگو با آزادی مطرح‌کردن مشکل و تفکیک ایده از هویت فرد بهتر می‌شود.',prompt:'چگونه می‌توانید به ایده‌ای انتقاد کنید بی‌آنکه صاحب آن را تخریب کنید؟',application:'نقد را با مشاهده، اثر و سؤال اصلاحی بیان کنید.'}
];
const diseases=[
 {title:'گوش‌دادن نمایشی',symptom:'فرد صحبت می‌کند اما مدیر هم‌زمان راه‌حل می‌دهد یا حرف او را تکمیل می‌کند.',effect:'اطلاعات ناقص می‌ماند و کارکنان کمتر مسئله را مطرح می‌کنند.',fix:'یک دقیقه حرف را قطع نکنید؛ برداشت خود را بازتاب دهید؛ بعد پیشنهاد بدهید.',watch:'در سه گفت‌وگوی این هفته چند بار حرف طرف مقابل را قطع کردم؟'},
 {title:'دستورهای مبهم',symptom:'عبارت‌هایی مانند «زودتر»، «بهتر» و «مثل همیشه» بدون معیار مشخص.',effect:'تفسیر متفاوت، دوباره‌کاری و سرزنش بعدی.',fix:'خروجی، مسئول، موعد و استاندارد تحویل را روشن کنید.',watch:'کدام کار اخیر را بدون تعیین موعد یا معیار واگذار کرده‌ام؟'},
 {title:'صمیمیت بدون مرز',symptom:'برای برخی کارکنان به‌دلیل نزدیکی، قاعده متفاوت اعمال می‌شود.',effect:'کاهش احساس انصاف و دشوارشدن پاسخگویی.',fix:'ملاک یکسان اعلام کنید؛ درخواست را بشنوید و استثنای مجاز را از امتیاز شخصی جدا کنید.',watch:'اگر فرد دیگری همین درخواست را می‌داد، پاسخ من یکسان بود؟'},
 {title:'بی‌اعتنایی به تجربه',symptom:'سرپرست جوان نظر نیروی قدیمی را نادیده می‌گیرد یا مدیر باتجربه سؤال فرد جوان را بی‌ارزش می‌داند.',effect:'تقابل جای یادگیری را می‌گیرد و تجربه ضمنی پنهان می‌شود.',fix:'از فرد درباره ریسک، تجربه و پیشنهادش بپرسید؛ سپس تصمیم و دلیل آن را روشن بیان کنید.',watch:'این هفته از چه کسی چیزی یاد گرفتم که قبلاً فرض می‌کردم می‌دانم؟'}
];
const quiz=[
 {q:'همکار باتجربه در جمع با رویه جدید مخالفت می‌کند؛ پاسخ اولیه مناسب‌تر چیست؟',o:['تذکر حیثیتی در جمع','شنیدن نگرانی در موقعیت مناسب، سپس بیان انتظار','صرف‌نظر از اجرای رویه'],a:1,why:'احترام و اقتدار، با شنیدن و شفافیت قابل جمع‌اند.'},
 {q:'کدام جمله بیشتر نشان‌دهنده گوش‌دادن فعال است؟',o:['«حالا بگذار من توضیح بدهم.»','«فهمیدم، حتماً حق با توست.»','«به نظر می‌رسد نگرانی‌ات زمان تحویل است؛ درست فهمیدم؟»'],a:2,why:'بازتاب و بررسی فهم، بدون توافق شتاب‌زده.'},
 {q:'در واگذاری کار، کدام مجموعه ابهام را کمتر می‌کند؟',o:['کار سریع و خوب','نتیجه، مسئول و موعد روشن','ارجاع به تجربه قبلی'],a:1,why:'انتظار باید مشاهده‌پذیر و پیگیری‌پذیر باشد.'},
 {q:'کارمند نزدیک درخواست استثنای خارج از قاعده دارد. چه می‌کنید؟',o:['محترمانه مرز و مسیر مجاز را بیان می‌کنم.','برای حفظ اعتماد می‌پذیرم.','او را به‌خاطر درخواست سرزنش می‌کنم.'],a:0,why:'اعتماد پایدار نیازمند انصاف و مرزبندی است.'},
 {q:'در برابر سکوت غیرمعمول یکی از اعضای تیم، کدام رویکرد مناسب‌تر است؟',o:['برداشت خود را قطعی تلقی می‌کنم.','در خلوت مشاهده را مطرح و دلیل را می‌پرسم.','در جمع علت ناراحتی را مطالبه می‌کنم.'],a:1,why:'مشاهده را باید از تفسیر جدا کرد.'},
 {q:isSupervisor?'در تحویل شیفت، اطلاعات ناقص رسیده؛ نخستین اقدام چیست؟':'دو واحد یکدیگر را عامل تأخیر می‌دانند؛ نخستین اقدام چیست؟',o:['تعیین مقصر بدون بررسی','بررسی دو روایت و توافق بر نقطه تحویل','سپردن کامل مسئله بدون پیگیری'],a:1,why:'واقعیت مشترک و معیار انتقال پیش از سرزنش.'},
 {q:'وقتی به قول خود در موعد مقرر نمی‌رسید، چه می‌کنید؟',o:['از موضوع عبور می‌کنم.','تا پرسیدند توضیح می‌دهم.','تأخیر را اعلام و موعد تازه و قابل اتکا می‌دهم.'],a:2,why:'پاسخگویی به تعهدات، بنیان اعتبار مدیریتی است.'},
 {q:'همدلی حرفه‌ای با کارکنان به چه معناست؟',o:['تأیید همه خواسته‌ها','درک دیدگاه فرد همراه با حفظ مسئولیت تصمیم','پرهیز از هر گفت‌وگوی دشوار'],a:1,why:'همدلی به‌معنای موافقت یا حذف مرز نیست.'},
 {q:'برای مدیریت تفاوت سنی یا سابقه، کدام رفتار مفیدتر است؟',o:['تعریف برتری یک گروه بر دیگری','اجتناب از تعامل بین نسل‌ها','پرسش از تجربه فرد و شفاف‌سازی معیار تصمیم'],a:2,why:'شناخت تجربه افراد از کلیشه‌سازی مؤثرتر است.'},
 {q:'در پایان گفت‌وگوی مهم چه چیزی را بررسی می‌کنید؟',o:['برداشت مشترک از اقدام و موعد','فقط تمام‌شدن جلسه','اینکه مدیر بیشتر صحبت کرده باشد'],a:0,why:'توافق عملی، خروجی گفت‌وگوی اثربخش است.'}
];
function renderAssess(){
 const answered=Object.keys(state.ratings).filter(k=>state.ratings[k]>=1&&state.ratings[k]<=3).length;
 let out=chrome('سبک من','آینه ارتباط حرفه‌ای من','هشت رفتار مشخص؛ نه برچسب شخصیت، نه آزمون روان‌سنجی. الگوی رفتار هفته گذشته را مرور کنید.');
 out+=panel('خودبازبینی رفتارهای قابل مشاهده','<p class="bp2-small">برای هر عبارت یک گزینه انتخاب کنید. نتیجه صرفاً خودبازتابی آموزشی است.</p><div class="bp2-progress"><span style="width:'+(100*answered/questions.length)+'%"></span></div><p class="bp2-small">'+answered+' از '+questions.length+' پاسخ</p>'+questions.map((q,i)=>'<div class="bp2-q"><div class="bp2-q-title">'+(i+1)+'. '+q.text+'</div><div class="bp2-row">'+['به ندرت','گاهی','اغلب'].map((label,j)=>button(label,'data-bp2-rate="'+i+':'+(j+1)+'"',state.ratings[i]===j+1)).join('')+'</div></div>').join(''));
 if(answered){
 const vals=axes.map(axis=>{let indices=questions.map((x,i)=>x.axis===axis.id?i:-1).filter(i=>i>=0&&state.ratings[i]);let v=indices.reduce((n,i)=>n+state.ratings[i],0)/indices.length||0;return {axis:axis,avg:v,num:indices.length}});
 let low=vals.filter(v=>v.num).sort((a,b)=>a.avg-b.avg)[0];
 out+=panel('بازتاب انتخاب‌های من','<p class="bp2-small">هر نوار، میانگین پاسخ‌های خودتان در همان بُعد است؛ مقایسه با دیگران یا نمره صلاحیت نیست.</p><div class="bp2-bars">'+vals.map(v=>'<div><div class="bp2-row" style="justify-content:space-between"><strong>'+v.axis.name+'</strong><span class="bp2-small">'+v.num+' از '+v.axis.questions.length+' رفتار</span></div><div class="bp2-bar-track"><span style="width:'+(v.avg?Math.round(v.avg/3*100):0)+'%"></span></div></div>').join('')+'</div>'+note((answered<8?'برای تحلیل کامل به همه هشت رفتار پاسخ دهید. ':'')+'<strong>یک اقدام پیشنهادی متناسب با پاسخ‌های شما:</strong> '+low.axis.action));
 }
 out+=panel('پرسش منتور','<p>کدام رفتار شما ممکن است از نظر خودتان سازنده باشد، اما از نگاه کارکنان متفاوت تجربه شود؟</p>'+note('تمرین محیط کار: یک گفت‌وگوی واقعی را انتخاب کنید و بعد از آن بپرسید «چه چیزی کمک کرد بهتر همدیگر را بفهمیم؟»'));
 return out;
}
function renderCases(){
 let idx=Number(state.tabs.cases||0);if(idx<0||idx>3)idx=0;
 let c=scenarios[idx],answer=state.cases[idx];
 let out=chrome('گفت‌وگوها','آزمایشگاه چهار موقعیت به‌پرور','در هر موقعیت یک انتخاب انجام دهید، اثر ارتباطی آن را ببینید و سپس گفت‌وگو را تمرین کنید.');
 out+='<div class="bp2-tabs" aria-label="انتخاب کیس">'+scenarios.map((x,i)=>button('کیس '+(i+1),'data-bp2-tab="cases:'+i+'"',i===idx)).join('')+'</div>';
 out+=panel(c.title,'<span class="bp2-tag">'+c.tag+'</span><div class="bp2-story"><p>'+c.story+'</p></div><h5>اقدام اول شما چیست؟</h5>'+c.options.map((o,i)=>button(o[0],'class="bp2-choice" data-bp2-case="'+idx+':'+i+'"',answer===i)).join('')+(answer!==undefined?'<div class="bp2-feedback"><strong>بازخورد انتخاب شما</strong><p>'+c.options[answer][1]+'</p><p><b>اقدام بعدی:</b> '+c.options[answer][2]+'</p></div>':'<p class="bp2-small">انتخاب شما قابل تغییر است؛ پاسخ را بدون قضاوت از نظر پیامد بررسی کنید.</p>')+
 '<details><summary>Role Play · گفت‌وگوی دونفره</summary><p>نقش اول: مدیر یا سرپرست؛ نقش دوم: کارمند. دو دقیقه اجرا کنید؛ سپس نقش‌ها را عوض کنید.</p><p><strong>مشاهده‌گر بررسی کند:</strong> آیا سؤال باز پرسیده شد؟ آیا تجربه فرد شنیده شد؟ آیا انتظار نهایی روشن بود؟</p></details>');
 out+=panel('چهار نکته کاربردی','<div class="bp2-grid">'+['با مشاهده شروع کنید، نه برچسب.','برای شنیدن، از سؤال باز استفاده کنید.','احترام را با عقب‌نشینی از معیار اشتباه نگیرید.','توافق را با اقدام و موعد ببندید.'].map(x=>'<div class="bp2-mini">'+x+'</div>').join('')+'</div>');
 return out;
}
function renderLeaders(){
 let idx=Number(state.tabs.leaders||0);if(idx<0||idx>3)idx=0;let x=leaders[idx];
 let out=chrome('درس‌های رهبران','چهار نگاه، یک مسئله واقعی','این نمونه‌ها برداشت آموزشی از رویکردهای شناخته‌شده‌اند، نه نقل‌قول مستقیم یا بازسازی واقعه خاص.');
 out+='<div class="bp2-tabs">'+leaders.map((v,i)=>button(v.title,'data-bp2-tab="leaders:'+i+'"',i===idx)).join('')+'</div>';
 out+=panel(x.title+' · '+x.theme,'<span class="bp2-tag">Leadership reflection</span><p>'+x.lesson+'</p>'+note('<b>موقعیت به‌پرور:</b> '+x.prompt)+'<h5>از تجربه به رفتار</h5><p>'+x.application+'</p><details><summary>تمرین Mentor Reflection</summary><p>آخرین موقعیت مشابه خودتان را با سه جمله بازنویسی کنید: چه دیدم؟ چگونه واکنش نشان دادم؟ دفعه بعد چه تغییری می‌دهم؟</p></details>');
 return out;
}
function renderTechniques(){
 let idx=Number(state.tabs.techniques||0);if(idx<0||idx>3)idx=0;let x=techniques[idx];
 let out=chrome('فنون رهبری','جعبه‌ابزار رابطه حرفه‌ای','هر تکنیک یک کاربرد مشخص، دستور اجرای کوتاه و تمرین آماده کلاس دارد.');
 out+='<div class="bp2-tabs">'+techniques.map((v,i)=>button('فن '+(i+1),'data-bp2-tab="techniques:'+i+'"',i===idx)).join('')+'</div>';
 out+=panel(x.title,'<span class="bp2-tag" dir="ltr">'+x.en+'</span><h5>چه وقت به کار می‌آید؟</h5><p>'+x.why+'</p><h5>سه گام اجرایی</h5><ol>'+x.steps.map(y=>'<li>'+y+'</li>').join('')+'</ol>'+note('<b>تمرین کارگاهی:</b> '+x.exercise)+'<div class="bp2-feedback warn"><strong>خطای رایج</strong>'+x.warning+'</div><label for="bp2-practice">جمله یا اقدام فردای من</label><textarea id="bp2-practice" data-bp2-practice="'+idx+'" placeholder="یک جمله کاربردی برای محیط کار خود بنویسید…">'+esc(state.practice[idx]||'')+'</textarea><p class="bp2-small" id="bp2-practice-status">یادداشت روی همین مرورگر ذخیره می‌شود.</p>');
 return out;
}
function visualGraphic(idx){
 const base='viewBox="0 0 640 176" role="img" xmlns="http://www.w3.org/2000/svg"';
 const box=(x,w,text,color)=>'<rect x="'+x+'" y="44" width="'+w+'" height="83" rx="18" fill="'+color+'"/><text x="'+(x+w/2)+'" y="92" text-anchor="middle" font-size="23" font-family="Tahoma" fill="#fff">'+text+'</text>';
 const line=(x1,x2)=>'<path d="M'+x1+' 86 H'+x2+'" stroke="#3a6699" stroke-width="5" stroke-linecap="round"/><path d="M'+(x2-13)+' 78 l13 8 -13 8" fill="none" stroke="#3a6699" stroke-width="4"/>';
 if(idx===0)return '<svg '+base+' aria-label="شنیدن سپس بازتاب سپس توافق">'+box(12,173,'شنیدن','#244879')+line(187,224)+box(226,179,'بازتاب','#35759b')+line(407,442)+box(444,182,'توافق','#216b72')+'</svg>';
 if(idx===1)return '<svg '+base+' aria-label="احترام و قاطعیت دو ضلع رابطه حرفه‌ای"><circle cx="258" cy="87" r="75" fill="#326aa7" opacity=".86"/><circle cx="371" cy="87" r="75" fill="#bc3156" opacity=".78"/><text x="213" y="94" fill="white" font-size="22" font-family="Tahoma" text-anchor="middle">احترام</text><text x="417" y="94" fill="white" font-size="22" font-family="Tahoma" text-anchor="middle">قاطعیت</text><text x="317" y="84" fill="white" font-size="18" font-family="Tahoma" text-anchor="middle">رابطه</text><text x="317" y="107" fill="white" font-size="18" font-family="Tahoma" text-anchor="middle">حرفه‌ای</text></svg>';
 if(idx===2)return '<svg '+base+' aria-label="سه ضلع انتظار روشن">'+box(12,173,'خروجی','#244879')+line(187,224)+box(226,179,'مسئول','#35759b')+line(407,442)+box(444,182,'موعد','#216b72')+'</svg>';
 return '<svg '+base+' aria-label="چرخه اعتماد"><circle cx="122" cy="86" r="63" fill="#244879"/><circle cx="318" cy="86" r="63" fill="#35759b"/><circle cx="514" cy="86" r="63" fill="#216b72"/><text x="122" y="95" fill="white" text-anchor="middle" font-size="24" font-family="Tahoma">قول</text><text x="318" y="95" fill="white" text-anchor="middle" font-size="24" font-family="Tahoma">پیگیری</text><text x="514" y="95" fill="white" text-anchor="middle" font-size="24" font-family="Tahoma">اعتبار</text><path d="M189 86 H249 M384 86 H446" stroke="#6a85a8" stroke-width="5"/></svg>';
}
function renderVisuals(){
 const items=[
 ['از شنیدن تا توافق','گوش‌دادن فقط سکوت نیست؛ شنیدن، بازتاب‌دادن و بستن گفت‌وگو با تعهد روشن یک زنجیره است.','آخرین گفت‌وگو را در کدام گام قطع کردید؟'],
 ['اقتدار با احترام','دوگانه غلطِ «یا صمیمی یا مقتدر» را کنار بگذارید؛ احترام و مرز حرفه‌ای هم‌زمان ممکن‌اند.','در کدام موقعیت مرزبندی را به تعویق انداختید؟'],
 ['انتظار روشن','«کار را پیگیری کن» دستور مبهم است؛ خروجی، مسئول و موعد باید دیده شوند.','یک دستور مبهم دیروز را دقیق بازنویسی کنید.'],
 ['اعتماد رفتار است','اعتماد با قول کم‌تعداد اما قابل‌اتکا و پیگیری شفاف ساخته می‌شود.','کدام قول باز مانده و امروز باید روشن شود؟']
 ];
 let idx=Number(state.tabs.visuals||0);if(idx<0||idx>3)idx=0;let x=items[idx];
 let out=chrome('تصاویر مدیریتی','چهار تصویر برای دیدن رابطه','روی هر تصویر کلیک کنید و آن را به یکی از موقعیت‌های واقعی خود در به‌پرور وصل کنید.');
 out+='<div class="bp2-tabs">'+items.map((v,i)=>button('تصویر '+(i+1),'data-bp2-tab="visuals:'+i+'"',i===idx)).join('')+'</div>';
 out+=panel(x[0],'<div class="bp2-illustration">'+visualGraphic(idx)+'</div><p>'+x[1]+'</p>'+note('<b>پرسش گفت‌وگوی گروهی:</b> '+x[2])+'<p class="bp2-small">نمودار آموزشی مفهومی؛ تصویر واقعی از محیط شرکت نیست.</p>');
 return out;
}
function renderDiseases(){
 let idx=Number(state.tabs.diseases||0);if(idx<0||idx>3)idx=0;let x=diseases[idx];
 let out=chrome('بیماری‌های مدیریتی','چهار عادت که رابطه را فرسوده می‌کند','عنوان «بیماری» استعاره آموزشی است؛ منظور تشخیص روان‌شناختی افراد نیست.');
 out+='<div class="bp2-tabs">'+diseases.map((v,i)=>button('عادت '+(i+1),'data-bp2-tab="diseases:'+i+'"',i===idx)).join('')+'</div>';
 out+=panel(x.title,'<div class="bp2-grid"><div class="bp2-mini"><strong>نشانه قابل مشاهده</strong>'+x.symptom+'</div><div class="bp2-mini"><strong>پیامد سازمانی</strong>'+x.effect+'</div><div class="bp2-mini"><strong>مداخله اصلاحی</strong>'+x.fix+'</div><div class="bp2-mini"><strong>پرسش خودبازبینی</strong>'+x.watch+'</div></div>'+note('<b>تعهد کوچک:</b> برای یک هفته یک نشانه را مشاهده و تعداد دفعات آن را ثبت کنید؛ بعد راه اصلاح را آزمایش کنید.'));
 return out;
}
function renderQuiz(){
 let answered=Object.keys(state.quiz).filter(i=>Number.isInteger(state.quiz[i])&&state.quiz[i]>=0&&state.quiz[i]<=2).length;
 let out=chrome('کوییز پایانی','ده تصمیم کوچک، یک تصویر بزرگ','پاسخ‌ها از موقعیت‌های کاری الهام گرفته‌اند؛ می‌توانید پیش از مشاهده نتیجه آن‌ها را تغییر دهید.');
 out+='<div class="bp2-progress"><span style="width:'+(answered*10)+'%"></span></div><p class="bp2-small">'+answered+' از ۱۰ موقعیت پاسخ داده شده</p>';
 quiz.forEach((q,i)=>{
 const a=state.quiz[i];out+=panel('موقعیت '+(i+1),'<p class="bp2-q-title">'+q.q+'</p>'+q.o.map((s,j)=>button(s,'class="bp2-choice" data-bp2-quiz="'+i+':'+j+'"',a===j)).join('')+(state.quizFinished?'<div class="bp2-feedback '+(a===q.a?'':'warn')+'"><strong>'+(a===q.a?'پاسخ مناسب انتخاب شد':'گزینه قابل بهبود')+'</strong><p>'+q.why+'</p><p><b>پاسخ پیشنهادی:</b> '+q.o[q.a]+'</p></div>':''));
 });
 let score=quiz.reduce((n,q,i)=>n+(state.quiz[i]===q.a?1:0),0);
 out+=panel('جمع‌بندی و انتقال به کار','<div class="bp2-row">'+button(state.quizFinished?'بازمحاسبه تحلیل':'تحلیل ده انتخاب','data-bp2-finish="1"'+(answered<10?' disabled':''),false)+button('شروع دوباره کوییز','data-bp2-reset="1"')+'</div>'+(state.quizFinished?'<p class="bp2-score">'+score+' / ۱۰</p><p>'+(score>=8?'در این سناریوها قضاوت ارتباطی شما غالباً با اصول جلسه هم‌راستا بوده است.':score>=5?'در چند موقعیت نیاز به روشن‌ترکردن مرزبندی یا گوش‌دادن دارید.':'پیشنهاد می‌شود چهار کیس و فنون جلسه را دوباره تمرین کنید.')+'</p>'+note('<b>گام بعدی:</b> '+(score>=8?'یک گفت‌وگوی هدفمند با کارکنان اجرا و نتیجه را ثبت کنید.':'دو سؤال با پاسخ نامناسب را انتخاب و یک Role Play کوتاه انجام دهید.')):'<p class="bp2-small">برای مشاهده تحلیل، هر ده موقعیت را پاسخ دهید.</p>')+'<p class="bp2-small">این امتیاز فقط تمرین یادگیری است؛ سنجش شایستگی یا عملکرد شغلی محسوب نمی‌شود.</p>');
 return out;
}
const renderers={m1:renderAssess,m2:renderCases,leaders:renderLeaders,techniques:renderTechniques,visuals:renderVisuals,diseases:renderDiseases,quiz:renderQuiz};
function render(section){
 const root=document.getElementById('bp2-'+section);if(!root)return;
 root.innerHTML=renderers[section]();
}
modules.forEach((section,i)=>{
 const view=document.getElementById('session2-'+section);if(!view)return;
 const shell=view.querySelector('.future-content-shell');if(!shell)return;
 const empty=shell.querySelector(':scope > p');if(empty&&empty.textContent.includes('هنوز اضافه نشده'))empty.remove();
 const root=document.createElement('div');root.id='bp2-'+section;root.className='bp2';shell.insertBefore(root,shell.firstChild);
 render(section);
});
const entry=document.getElementById('session2');
if(entry){
 const heading=entry.querySelector('.page-heading h2');if(heading)heading.textContent='ایجاد رابطه حرفه‌ای و اثربخش';
 const p=entry.querySelector('.page-heading p');if(p)p.textContent='اعتماد، گوش‌دادن، مرزبندی، تفاوت تجربه و انتظار روشن؛ در هفت بخش تعاملی و دو مسیر شغلی.';
 const hint=entry.querySelector('.session-dashboard-hint');if(hint){hint.innerHTML='<strong>مسیر '+roleFa+'</strong> · از منوی هفت‌بخشی سمت راست، هر بخش را مستقل باز کنید و در هر زمان بازگردید. ترتیب اجباری نیست.';}
}
const courseLink=document.querySelector('[data-course-session="2"]');
if(courseLink){courseLink.classList.add('ready');const small=courseLink.querySelector('small');if(small)small.textContent='رابطه حرفه‌ای با کارکنان · ۷ بخش تعاملی';}
document.querySelectorAll('#session2 .page-heading,#session2-m1 .page-heading,#session2-m2 .page-heading,#session2-leaders .page-heading,#session2-techniques .page-heading,#session2-visuals .page-heading,#session2-diseases .page-heading,#session2-quiz .page-heading').forEach((x,i)=>{if(i===0)return;let p=x.querySelector('p');if(!p){p=document.createElement('p');x.appendChild(p)}p.textContent='رابطه حرفه‌ای، اعتماد، شنیدن و تنظیم انتظارات در '+context+'.'});
document.addEventListener('click',function(ev){
 const target=ev.target.closest('[data-bp2-rate],[data-bp2-case],[data-bp2-quiz],[data-bp2-tab],[data-bp2-finish],[data-bp2-reset]');
 if(!target)return;
 const key=target.dataset;
 if(key.bp2Rate){const [i,v]=key.bp2Rate.split(':').map(Number);state.ratings[i]=v;store();render('m1')}
 if(key.bp2Case){const [i,v]=key.bp2Case.split(':').map(Number);state.cases[i]=v;store();render('m2')}
 if(key.bp2Quiz){const [i,v]=key.bp2Quiz.split(':').map(Number);state.quiz[i]=v;state.quizFinished=false;store();render('quiz')}
 if(key.bp2Tab){const [tab,idx]=key.bp2Tab.split(':');state.tabs[tab]=Number(idx);store();render(tab==='cases'?'m2':tab)}
 if(key.bp2Finish){if(Object.keys(state.quiz).filter(i=>state.quiz[i]!==undefined).length===10){state.quizFinished=true;store();render('quiz')}}
 if(key.bp2Reset){if(window.confirm('فقط پاسخ‌های کوییز جلسه دوم در همین مسیر پاک شوند؟ سایر یادداشت‌ها حفظ می‌شوند.')){state.quiz={};state.quizFinished=false;store();render('quiz')}}
});
document.addEventListener('input',function(ev){
 const t=ev.target;if(!t.matches('[data-bp2-practice]'))return;
 state.practice[t.dataset.bp2Practice]=t.value;store();
 const status=document.getElementById('bp2-practice-status');if(status)status.textContent='روی مرورگر همین دستگاه ذخیره شد؛ برای مدرس ارسال نمی‌شود.';
});
})();
