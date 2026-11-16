/* Behparvar · Session 4 recommended reading / classroom book spotlight.
 * Bibliographic data: Taaghche book 203449 and ISBN 9780071418584.
 * Standalone, non-scoring component; never changes learner state or timer.
 */
(()=>{"use strict";
const ROOT=document.getElementById("root");
if(!ROOT)return;
const COVERS={
 fa:"https://img.taaghche.com/frontCover/203449.jpg",
 en:"https://i5.walmartimages.com/seo/How-to-Talk-to-Anyone-92-Little-Tricks-for-Big-Success-in-Relationships-Paperback-9780071418584_9d3a764c-c8b5-45ea-bd40-486225632f9a.ba3f2555c024677d895a35934ecd6400.jpeg?odnBg=FFFFFF&odnHeight=768&odnWidth=768"
};
const PERSIAN="https://taaghche.com/book/203449/";
const ENGLISH="https://www.walmart.com/ip/How-to-Talk-to-Anyone-92-Little-Tricks-for-Big-Success-in-Relationships-Paperback-9780071418584/2156745";
function cover(lang,large=false){
 const isFa=lang==="fa",label=isFa?"جلد ترجمه فارسی":"جلد نسخه انگلیسی";
 return '<figure class="sf-book-cover '+(large?"large":"")+'">'+
 '<div class="sf-book-cover-frame">'+
 '<img src="'+COVERS[lang]+'" alt="'+label+' کتاب چگونه با هر کسی صحبت کنیم اثر لیل لوندز" loading="'+(large?"lazy":"eager")+'" decoding="async" referrerpolicy="no-referrer">'+
 '<span class="sf-book-image-fallback" aria-hidden="true">'+(isFa?"چگونه با هر کسی صحبت کنیم؟":"How to Talk to Anyone")+'</span>'+
 '</div><figcaption>'+label+'</figcaption></figure>';
}
function panel(){
 return '<details class="sf-book-spotlight" id="sfBookSpotlight">'+
 '<summary class="sf-book-spotlight-summary">'+
 '<span class="sf-book-cover-pair">'+cover("fa")+cover("en")+'</span>'+
 '<span class="sf-book-spotlight-teaser"><span class="sf-book-eyebrow">پرونده ویژه · معرفی کتاب پیش از شروع سفر</span>'+
 '<strong>چگونه با هر کسی صحبت کنیم؟</strong>'+
 '<span class="sf-book-title-en" lang="en" dir="ltr">How to Talk to Anyone</span>'+
 '<span class="sf-book-author">لیل لوندز | ۹۲ ترفند کوچک برای موفقیت بزرگ در روابط</span>'+
 '<span class="sf-book-open-hint">مشاهده جلدها و معرفی کوتاه کتاب <span aria-hidden="true">⌄</span></span>'+
 '</span></summary>'+
 '<div class="sf-book-spotlight-body">'+
 '<div class="sf-book-featured-covers">'+cover("fa",true)+cover("en",true)+'</div>'+
 '<div class="sf-book-description"><h3>درباره کتاب</h3>'+
 '<p>لیل لوندز در این کتاب، ۹۲ تکنیک کوتاه و کاربردی را برای بهتر شروع‌کردن گفت‌وگو، ایجاد برداشت اولیه مناسب، شنیدن و پاسخ‌دادن و برقراری ارتباط مؤثر در موقعیت‌های اجتماعی و کاری گرد آورده است. لحن کتاب ساده و مثال‌محور است؛ نکته‌ها را می‌توان در گفت‌وگوهای واقعی امتحان کرد.</p>'+
 '<h3>ارتباط با سفر ارتباطات به‌پرور</h3>'+
 '<p>برای سرپرست و مدیر، هدف صرفاً خوش‌صحبت‌بودن نیست؛ مهم‌تر این است که با یک شروع محترمانه، شنود دقیق، بیان روشن و بازخورد سازنده، به تفاهم و اقدام مشترک برسیم. این کتاب یک منبع مطالعاتی مکمل برای تمرین این رفتارهاست، نه جایگزین قواعد حرفه‌ای و تصمیم‌گیری موقعیتی دوره.</p>'+
 '<div class="sf-book-class-note"><strong>پیشنهاد معرفی شفاهی در کلاس · حدود ۱ دقیقه</strong>'+
 '<p>«این کتاب نوشته لیل لوندز است. نویسنده ۹۲ تکنیک کوچک پیشنهاد می‌کند که کمک می‌کنند گفت‌وگو را بهتر شروع کنیم، اثر اولیه بهتری بگذاریم و ارتباط مؤثرتری بسازیم. در سفر امروز قرار است چند مهارت مهم‌تر را در موقعیت‌های واقعیِ مدیران و سرپرستان تمرین کنیم؛ نه فقط درباره‌شان بخوانیم.»</p></div>'+
 '<p class="sf-book-edition-note">جلد فارسی نمایش‌داده‌شده مربوط به ترجمه محمد اسدی‌نسب، نشر ارمغان گیلار است. ترجمه‌ها و طرح جلدهای فارسی دیگری نیز منتشر شده‌اند. جلد انگلیسی مربوط به نسخه اصلی سال ۲۰۰۳ است.</p>'+
 '<div class="sf-book-source-links">'+
 '<a href="'+PERSIAN+'" target="_blank" rel="noopener noreferrer">مشاهده مشخصات نسخه فارسی</a>'+
 '<a href="'+ENGLISH+'" target="_blank" rel="noopener noreferrer">مشاهده مشخصات نسخه انگلیسی</a>'+
 '<button type="button" id="sfBookProject">نمایش درشت برای کلاس</button>'+
 '</div></div></div></details>';
}
let dialog=null,focusBefore=null;
function openPresentation(){
 if(dialog)return;
 focusBefore=document.activeElement;
 dialog=document.createElement("div");dialog.className="sf-book-presenter-overlay";dialog.id="sfBookPresenter";
 dialog.innerHTML='<section class="sf-book-presenter-content" role="dialog" aria-modal="true" aria-label="پرونده ویژه کتاب؛ نمایش برای کلاس" dir="rtl">'+
 '<div class="sf-book-presenter-header"><span>به‌پرور · جلسه چهارم · پرونده ویژه کتاب</span>'+
 '<button type="button" id="sfBookPresenterClose" aria-label="بستن نمایش کتاب">بستن ×</button></div>'+
 '<div class="sf-book-presenter-layout">'+
 '<div class="sf-book-presenter-covers">'+cover("fa",true)+cover("en",true)+'</div>'+
 '<div class="sf-book-presenter-copy"><h2>چگونه با هر کسی صحبت کنیم؟</h2>'+
 '<p class="sf-book-presenter-en" lang="en" dir="ltr">How to Talk to Anyone</p>'+
 '<p>نویسنده: لیل لوندز</p>'+
 '<p><strong>۹۲ تکنیک کوتاه برای بهتر ارتباط برقرارکردن</strong></p>'+
 '<ul><li>شروع گفت‌وگو و ایجاد برداشت اولیه مناسب</li>'+
 '<li>توجه به شنیدن، پاسخ و زبان بدن</li>'+
 '<li>تبدیل گفت‌وگو به رابطه مؤثر و همکاری</li></ul>'+
 '<p class="sf-book-presenter-prompt">پرسش آغاز کلاس: یک گفت‌وگوی موفق برای سرپرست یا مدیر، چه تفاوتی با صرفاً خوب حرف‌زدن دارد؟</p>'+
 '</div></div></section>';
 document.body.append(dialog);
 document.body.classList.add("sf-book-presenting");
 dialog.querySelector("#sfBookPresenterClose").focus();
}
function closePresentation(){
 if(!dialog)return;
 dialog.remove();dialog=null;
 document.body.classList.remove("sf-book-presenting");
 focusBefore?.focus?.();
}
function enhance(){
 const start=ROOT.querySelector("#start"),anchor=ROOT.querySelector(".sf-mode-choices");
 if(!start||!anchor){return;}
 if(ROOT.querySelector("#sfBookSpotlight"))return;
 anchor.insertAdjacentHTML("beforebegin",panel());
}
document.addEventListener("click",e=>{
 const book=e.target.closest("#sfBookProject"),close=e.target.closest("#sfBookPresenterClose");
 if(book){e.preventDefault();openPresentation();}
 if(close){e.preventDefault();closePresentation();}
});
document.addEventListener("keydown",e=>{
 if(e.key==="Escape"&&dialog){e.preventDefault();closePresentation();}
 if(e.key==="Tab"&&dialog){
  const button=dialog.querySelector("#sfBookPresenterClose");
  if(!dialog.contains(document.activeElement)){e.preventDefault();button?.focus();}
 }
});
document.addEventListener("error",e=>{
 if(e.target?.matches?.(".sf-book-cover-frame img")){
  const frame=e.target.closest(".sf-book-cover-frame");
  if(frame)frame.classList.add("image-unavailable");
 }
},true);
let queued=false;
new MutationObserver(()=>{
 if(queued)return;
 queued=true;requestAnimationFrame(()=>{queued=false;enhance()});
}).observe(ROOT,{childList:true,subtree:false});
enhance();
window.BP_SAFAR_BOOK_SPOTLIGHT={openPresentation,closePresentation,enhance};
})();