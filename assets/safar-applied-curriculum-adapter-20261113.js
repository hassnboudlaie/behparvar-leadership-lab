/* Applied curriculum revision, ten stages preserved.
 * Companion layer loaded AFTER canonical content-quality-v4; preserves new-stage answer keys and prior attempts.
 * Names of cases are educational scenarios, NOT documented actual incidents.
 */
(function(){
 "use strict";
 const scope=window;
 const bundle=scope.BP_SAFAR_APPLIED;
 const d=scope.BP_SAFAR_DATA;
 const c=scope.BP_SAFAR_CLASSROOM?.content;
 const r=scope.BP_SAFAR_RESTORED_CONTENT?.content;
 if(!bundle?.units||bundle.units.length!==10||!d?.stages||d.stages.length!==10||!Array.isArray(c)||!Array.isArray(r))return;
 let existing=null;try{existing=JSON.parse(localStorage.getItem("bp-communication-journey-v3")||"null")}catch(e){}
 // A prior attempt is scored against its original learning material. New content begins with a new journey.
 if(existing?.startedAt&&!existing.appliedCurriculumV2)return;
 const checks=[["شنیدن برداشت مخاطب بدون دفاع فوری","روشن‌کردن هدف و انتظار در مرز اختیار","توافق بر شیوه اعلام مانع و پیگیری"],["جداکردن واقعیت پیام از برداشت اولیه","پرسش درباره خروجی، مسئول، موعد و شرط تأیید","بازگویی و تأیید برداشت مشترک"],["درخواست نمونه مشخص پیش از قضاوت","بازتاب دقیق احساس و داده، همراه با تأیید مخاطب","تفکیک همدلی از وعده یا تصمیم شتاب‌زده"],["پیام کوتاه با تصمیم، دلیل و اقدام","مکث و لحن متناسب با موضوع","آزمون فهم واقعی و دعوت به پرسش"],["بازخورد درباره شواهد و اثر، نه شخصیت","تفویض با روشن‌کردن مرز اختیار و منابع","توافق بر حمایت و زمان بازبینی"],["تفکیک شواهد فنی از فشار تحویل","جرأت‌ورزی بدون حمله به فرد یا واحد","اقدام فوری مجاز با مالک و زمان پیگیری"],["تعریف خروجی، موعد و وابستگی درخواست","شنیدن ظرفیت و محدودیت واحد مقابل","توافق متقابل با نقطه هشدار پیش از موعد"],["کشف دلیل واقعی فوریت درخواستی","بیان شفاف مرز تعهد بدون توجیه طولانی","پیشنهاد گزینه قابل اجرا با مالک پاسخ"],["شنیدن اثر شکایت بر کار مخاطب","تفکیک معلوم از نامعلوم و قول معتبر","تعیین موعد اطلاع‌رسانی حتی بدون نتیجه قطعی"],["پرسش از معیارهای تصمیم قبل از پیشنهاد","مقایسه دو گزینه با پیامد واقعی","ثبت دیجیتال مجاز با مسئول، موعد و بازبینی"]];
 const variants=[{"sup":["«الان فقط این کار رو انجام بده، بعداً صحبت می‌کنیم.»","«موعد ثابته؛ بگو کجا مانع داری تا روش هماهنگی رو روشن کنیم.»"],"mgr":["«نیروهای واحد شما باید از شنبه حاضر باشند.»","«نیاز پروژه رو می‌گم؛ ظرفیت و تعهدهای شما رو هم بررسی کنیم.»"]},{"sup":["«گفتی آماده‌ست، پس باید بارگیری کنیم.»","«آماده‌سازی اولیه یا تأیید بارگیری؟ چه کسی تا چه زمانی تأیید می‌کنه؟»"],"mgr":["«عملیات قولش رو زیر پا گذاشته.»","«وعده قطعی بوده یا مشروط؟ شرط موجودی و مسئول پاسخ چه کسی است؟»"]},{"sup":["«این تقسیم کاملاً منصفانه است، بحث نکن.»","«سه نمونه مشخص بگو تا معیار تقسیم و داده واقعی رو بررسی کنیم.»"],"mgr":["«مقصر تأخیر معلومه؛ واحد دیگر همکاری نکرد.»","«رویداد، تغییر دامنه و داده‌ها رو کنار هم بگذاریم و بعد مسئولیت رو بررسی کنیم.»"]},{"sup":["«مصوبه‌ست؛ همه باید اجرا کنن.»","«روش از شنبه تغییر می‌کنه؛ دلیلش کاهش خطاست. بعد از نمونه اجرا، مانع‌ها رو می‌شنوم.»"],"mgr":["«مشکلی نیست؛ محدودیت زود برداشته می‌شه.»","«محدودیت یک‌ماهه مصوبه؛ برای استثنای مجاز، مسیر بررسی مستند داریم.»"]},{"sup":["«گزارش رو بده خودم انجام بدم.»","«تکمیل با تو؛ من مانع ورودی بین واحدها رو پیگیری می‌کنم. فردا مرور می‌کنیم.»"],"mgr":["«از این به بعد تمام هماهنگی‌ها با خود من.»","«تعهدهای واحد با شما؛ بن‌بست بین‌واحدی رو در سطح مدیریت حمایت می‌کنم.»"]},{"sup":["«کیفیت باید امروز تأیید کنه.»","«پاسخ معتبر کیفیت رو در موعد می‌گیریم و برنامه جایگزین مجاز می‌سازیم.»"],"mgr":["«برای مشتری بگیم آماده‌ست تا فرصت بگیریم.»","«فقط وضعیت واقعی و گزینه مشروط به تأیید رو به مشتری اعلام می‌کنیم.»"]},{"sup":["«واحد شما باید کار ما رو اول انجام بده.»","«حداقل خروجی امروز چی می‌تونه باشه؟ نقطه هشدار و مسئول هر طرف رو ثبت کنیم.»"],"mgr":["«پروژه واحد ما اولویت اول همه واحدهاست.»","«اثر هر گزینه بر تعهد کل شرکت و ظرفیت واقعی رو کنار هم بررسی کنیم.»"]},{"sup":["«باشه انجام می‌دیم، یه طوری جمعش می‌کنیم.»","«کل کار امروز ممکن نیست؛ کدام بخش حیاتی است تا گزینه‌ای قابل تعهد بسازیم؟»"],"mgr":["«من این درخواست رو فعلاً تأیید می‌کنم.»","«بدون منابع مجاز نمی‌تونم تعهد بدم؛ کاهش دامنه یا تأیید منابع رو بررسی کنیم.»"]},{"sup":["«مشکل از واحد دیگه بود، ما کاری نکردیم.»","«می‌فهمم پاسخ‌های متناقض برنامه شما رو مختل کرده؛ تا دو وضعیت معتبر رو اعلام می‌کنم.»"],"mgr":["«دیگه چنین مشکلی هرگز رخ نمی‌ده.»","«معیار اصلاح و موعد گزارش رو روشن می‌کنیم؛ تضمین بدون شاهد نمی‌دیم.»"]},{"sup":["«در گروه می‌نویسم همه با هم توافق کردیم.»","«موضوع، مسئول‌ها، موعد و نقطه بازبینی رو در کانال مجاز کوتاه ثبت می‌کنیم.»"],"mgr":["«چون پروژه مهمه باید منابع رو آزاد کنید.»","«با معیارهای شما دو سناریو می‌سازیم؛ سقف اختیار و بازبینی رو در صورت‌جلسه ثبت می‌کنیم.»"]}];
 for(let i=0;i<10;i++){
  const u=bundle.units[i],s=d.stages[i],lesson=r[i],classroom=c[i];
  s.sup=u.sup.case;s.mgr=u.mgr.case;
  s.roleSup=u.sup.roles.join(" / ")+"؛ محدودیت و اقدام قابل پیگیری را تمرین کنید.";
  s.roleMgr=u.mgr.roles.join(" / ")+"؛ بدون تعهد خارج از اختیار به توافق برسید.";
  s.lesson=u.tools.map(t=>t[0]+": "+t[1]+" مثال: "+t[2]);
  s.q1Context=[u.sup.case,u.mgr.case];
  s.q2Context=[u.sup.case,u.mgr.case];
  s.tip=u.transfer;
  lesson.outcome=u.outcome;lesson.tools=u.tools;lesson.trap=u.trap;lesson.transfer=u.transfer;
  lesson.debrief=u.debrief;
  lesson.role=lesson.role||{};lesson.role.supervisors=u.sup.roleBriefs;lesson.role.managers=u.mgr.roleBriefs;
  lesson.compare={supervisors:variants[i].sup,managers:variants[i].mgr};
  classroom.skill=u.skill;classroom.definition=u.definition;
  classroom.do=u.tools[0][1];classroom.avoid=u.trap;classroom.moment=u.transfer;
  classroom.question=u.debrief[0];classroom.observer=checks[i];
  classroom.supervisor={...classroom.supervisor,roles:u.sup.roles,dialogue:u.sup.dialogue};
  classroom.manager={...classroom.manager,roles:u.mgr.roles,dialogue:u.mgr.dialogue};
 }
 d.appliedCurriculumVersion=2;
})();
