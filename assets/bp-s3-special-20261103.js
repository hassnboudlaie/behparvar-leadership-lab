/* Behparvar Session 3 special: independent role-specific educational interactions. */
(function(g){"use strict";
const CASES=g.BPS3Cases||[],R={supervisors:"سرپرستان",managers:"مدیران"};
const QUIZZES={
supervisors:[
{q:"خدمات مشتری یک رسید واریز دریافت کرده، اما بانک هنوز وصول را تأیید نکرده است. هماهنگی بهتر کدام است؟",o:[
["تعیین مالک تطبیق و زمان گزارش، با حفظ توقف تا تأیید.","درست؛ هم مسئولیت و موعد اطلاع‌رسانی روشن است، هم کنترل مالی حذف نمی‌شود."],
["آزادسازی سفارش چون مشتری تصویر رسید دارد.","نادرست؛ رسید تصویری به‌تنهایی تأیید وصول و مجوز آزادسازی نیست."],
["ارجاع کل موضوع به مالی و قطع پاسخ‌گویی به مشتری.","نادرست؛ خدمات مشتری هنوز مسئول اعلام وضعیت معتبر و محترمانه است."]],a:0},
{q:"دو واحد مرتب می‌گویند «فرم ارسال شد»، اما گیرنده آن را ناقص می‌داند. اقدام پایدارتر چیست؟",o:[
["گفت‌وگوی دوستانه بیشتر بدون تغییر گردش کار.","ناکافی؛ علت ساختاریِ ورودی ناقص و تأیید دریافت باقی می‌ماند."],
["تعریف فیلدهای الزامی، مالک تأیید، نسخه معتبر و تأیید دریافت.","درست؛ ابهام را به معیار تحویل قابل مشاهده و پیگیری تبدیل می‌کند."],
["سپردن همه کارها به یک سرپرست پرتلاش.","نادرست؛ مالکیت واحدهای تخصصی را مبهم می‌کند و گلوگاه تازه می‌سازد."]],a:1},
{q:"دسترسی نیروی جدید هنوز تأیید نشده اما آموزش مقدماتی ممکن است. چه باید کرد؟",o:[
["برای جلوگیری از تأخیر حساب کامل ساخته شود.","نادرست؛ فوریت کار، اختیار دسترسی محرمانه ایجاد نمی‌کند."],
["تا فردا تمام فعالیت‌ها متوقف بمانند.","ناکافی؛ می‌توان بخش‌های آموزشی مجاز را بدون دسترسی حساس اجرا کرد."],
["آموزش عمومی شروع و تأیید نقش با مالک و موعد پیگیری شود.","درست؛ کار موازی مجاز، مرز اختیار و هماهنگی زمانی را ترکیب می‌کند."]],a:2},
{q:"در فایل کارکرد، انتقال موفق ثبت شده ولی مالی نسخه نهایی را نمی‌شناسد. نقطه شکست چیست؟",o:[
["کندبودن کارکنان مالی در پاسخ‌دادن.","بی‌پشتوانه؛ درباره رفتار اشخاص بدون مشاهده شواهد قضاوت شده است."],
["فقدان قاعده مشترک برای نسخه معتبر و تأیید پذیرش.","درست؛ موفقیت انتقال فنی با پذیرش محتوای معتبر یکسان نیست."],
["نیاز به ارسال فایل در پیام‌رسان برای همه اعضا.","نادرست؛ نسخه و محرمانگی داده‌ها را مبهم‌تر می‌کند."]],a:1}
],
managers:[
{q:"HR و IT شاخص‌های داخلی سبز دارند اما کارکنان روز اول آماده نیستند. کدام تصمیم درست‌تر است؟",o:[
["تنبیه واحدی که آخرین اقدام را انجام داده است.","نادرست؛ مالکیت انتهابه‌انتهای فرایند و وابستگی‌ها دیده نمی‌شوند."],
["انتقال تمام مسئولیت استخدام و ورود به IT.","نادرست؛ تأیید نقش و زمان‌بندی استخدام در واحدهای دیگر باقی می‌ماند."],
["تعریف شاخص آمادگی واقعی، نقطه تحویل و نقش هر واحد.","درست؛ نتیجه واقعی را جایگزین شاخص‌های جزیره‌ای می‌کند."]],a:2},
{q:"در کمپین فروش، قیمت و موجودی با تأخیر به‌روز می‌شوند و مالی از سود سفارش نگران است. کدام گزینه حرفه‌ای‌تر است؟",o:[
["پایلوت محدود با سقف سفارش، تازگی داده، کنترل مالی و شرط توقف.","درست؛ هم از فرصت استفاده می‌کند، هم ریسک را قابل پایش نگه می‌دارد."],
["اجرای سراسری و بررسی خطا پس از یک هفته.","نادرست؛ وعده‌های اشتباه و آسیب مشتری پیش از اصلاح رخ می‌دهد."],
["تعویق نامحدود تا حذف تمام عدم قطعیت‌ها.","ناکافی؛ می‌توان با دامنه و شروط کنترل‌شده شواهد به دست آورد."]],a:0},
{q:"مدیر فروش و مالی درباره قرارداد بزرگ اختلاف دارند. کدام سازوکار تصمیم مشترک می‌سازد؟",o:[
["اولویت دادن خودکار به فروش، چون مشتری منتظر است.","نادرست؛ هزینه وصول و ظرفیت عملیاتی از قلم می‌افتد."],
["مقایسه سناریوها بر اساس سود، نقدینگی و ظرفیت و ارجاع خارج از اختیار.","درست؛ معیارهای متفاوت به تصمیم مشترک و مجاز تبدیل می‌شوند."],
["سپردن تصمیم به مالی بدون بررسی احتمال پذیرش مشتری.","ناکافی؛ ارزش تجاری و فرصت بازار باید با ریسک مالی سنجیده شود."]],a:1},
{q:"موفقیت انتقال داده سامانه کارکرد بالاست؛ هنوز خطاهای محاسبه مزایای شیفت وجود دارد. اقدام مدیران چیست؟",o:[
["راه‌اندازی کامل چون شاخص فنی قابل قبول است.","نادرست؛ دقت حقوق و استمرار عملیات از معیار فنی جداست."],
["لغو دائمی تغییر تا هیچ ایرادی وجود نداشته باشد.","ناکافی؛ امکان آزمون محدود و کنترل‌شده وجود دارد."],
["پایلوت با محاسبه موازی، مالک ریسک، حق توقف و تصمیم مرحله‌ای.","درست؛ آمادگی کسب‌وکار و کنترل اثر بر کارکنان را هم‌زمان می‌سنجد."]],a:2}
]};
let role="supervisors",activeCase=null;
const observerDrafts=new Map(),quizAnswers={supervisors:{},managers:{}};
function esc(v){return String(v==null?"":v).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]});}
function fa(v){return String(v).replace(/\d/g,function(d){return "۰۱۲۳۴۵۶۷۸۹"[Number(d)]});}
function faText(v){return esc(v).replace(/\bIT\b/g,"فناوری اطلاعات").replace(/\bHR\b/g,"منابع انسانی");}
function readRole(){
 const q=new URLSearchParams(location.search).get("audience");if(R[q])return q;
 try{const s=JSON.parse(localStorage.getItem("behparvar_session1_v4")||"{}");if(R[s.audience])return s.audience;}catch(e){}
 return "supervisors";
}
function list(items){return "<ul>"+items.map(t=>"<li>"+faText(t)+"</li>").join("")+"</ul>";}
function root(){return document.getElementById("caseDetail");}
function caseKey(){return role+":"+activeCase;}
function currentCase(){return CASES.find(c=>c.id===activeCase);}
function renderCards(){
 document.getElementById("caseList").innerHTML=CASES.map(c=>'<button type="button" data-case-open="'+esc(c.id)+'"><span>'+c.icon+" "+c.mode+'</span><strong>'+faText(c[role].title)+'</strong><small>'+faText(c.units)+'</small><b>گفت‌وگو، لحظه‌های مهارتی و چک‌لیست ←</b></button>').join("");
}
function renderCase(){
 const c=currentCase(),el=root();if(!el)return;
 if(!c){el.hidden=true;document.getElementById("caseList").hidden=false;el.innerHTML="";return;}
 const d=c[role],rubric=[...d.check,"پیش‌فرض‌ها با سؤال و شواهد بازنگری شدند.","در پایان، مالک اقدام، زمان و مرز اختیار مشخص بود."];
 const speech=d.dialogue.map(([name,line],i)=>'<div class="turn'+(d.moments[i]?" highlight":"")+'"><span class="turnnum">'+fa(i+1)+'</span><div class="turnbody"><strong>'+faText(name)+'</strong><p>'+faText(line)+'</p>'+(d.moments[i]?'<aside class="moment"><strong>💡 لحظه مهارتی</strong><p>'+faText(d.moments[i])+'</p></aside>':"")+'</div></div>').join("");
 const checklist=rubric.map((t,i)=>'<div class="criterion"><strong>'+fa(i+1)+'. '+faText(t)+'</strong><div class="criterion-grid"><label>ارزیابی<select data-observer name="rating'+i+'"><option value="">انتخاب کنید</option><option>مشاهده شد</option><option>تا حدی مشاهده شد</option><option>مشاهده نشد</option><option>شاهد کافی نیست</option></select></label><label>شاهد مشخص از گفت‌وگو<input data-observer type="text" name="evidence'+i+'" placeholder="نوبت یا جمله مشخص"></label></div></div>').join("");
 el.innerHTML='<button class="back" type="button" data-case-back>→ بازگشت به فهرست چهار پرونده</button><h3>'+faText(d.title)+'</h3><p class="disclaimer">موقعیت آموزشی و فرضی است؛ نام‌ها، اعداد و رویدادها گزارش واقعی به‌پرور نیستند.</p>'+
 '<nav class="case-nav"><button type="button" data-case-jump="scene">📍 اتفاق آشنا</button><button type="button" data-case-jump="dialogue">💬 گفت‌وگوی نمونه</button><button type="button" data-case-jump="observer">✅ چک‌لیست و تحلیل</button></nav>'+
 '<section class="case-section scene" id="scene"><h3>۱. اتفاق آشنا؛ موقعیت با جزئیات</h3>'+d.scene.map(s=>"<p>"+faText(s)+"</p>").join("")+'<div class="roles">'+d.roles.map(s=>'<span>👤 '+faText(s)+'</span>').join("")+'</div><h3>داده‌های در دسترس</h3>'+list(d.signals)+'<details><summary>حدود اختیار و محدودیت‌ها</summary>'+list(d.limits)+'</details></section>'+
 '<section class="case-section" id="dialogue"><h3>۲. گفت‌وگوی نمونه و نقاط عطف</h3>'+speech+'</section>'+
 '<section class="case-section" id="observer"><h3>۳. چک‌لیست مشاهده و بازخورد کلاس</h3><p>افراد دیگر کلاس باید برای هر ارزیابی، جمله یا رفتار مشخص ارائه کنند؛ «شاهد کافی نیست» نیز پاسخ مجاز است.</p>'+
 '<label class="observer">نام مشاهده‌گر (اختیاری)<input type="text" data-observer name="observerName"></label>'+checklist+'<p id="observerStatus" role="status"></p>'+
 '<div class="analytical"><h3>سؤالات تحلیلی برای یافتن نقاط عطف</h3>'+d.questions.map((t,i)=>'<label><strong>'+fa(i+1)+'. '+faText(t)+'</strong><textarea data-observer name="question'+i+'" rows="2" placeholder="تحلیل با استناد به گفت‌وگو"></textarea></label>').join("")+
 '<label><strong>قوی‌ترین رفتار مشاهده‌شده</strong><textarea data-observer name="strength" rows="2"></textarea></label><label><strong>کدام رفتار بهتر می‌توانست انجام شود؟</strong><textarea data-observer name="improvement" rows="2"></textarea></label></div>'+
 '<details><summary>📖 جمع‌بندی مدرس و توافق حرفه‌ای</summary><p><strong>نقطه عطف:</strong> '+faText(d.expert)+'</p><p><strong>توافق قابل قبول:</strong> '+faText(d.outcome)+'</p></details>'+
 '<div class="actions"><button id="copyObserver" type="button">📋 کپی گزارش مشاهده‌گر</button><span id="copyStatus" role="status"></span></div><textarea id="reportPreview" class="report-preview" hidden readonly aria-label="متن گزارش برای کپی دستی"></textarea><p class="disclaimer">یادداشت مشاهده‌گر تا زمانی که این صفحه باز است فقط در حافظه همین صفحه می‌ماند و به سرور ارسال نمی‌شود.</p></section>';
 el.hidden=false;document.getElementById("caseList").hidden=true;
 const saved=observerDrafts.get(caseKey());if(saved){el.querySelectorAll("[data-observer]").forEach(x=>{if(Object.prototype.hasOwnProperty.call(saved,x.name))x.value=saved[x.name];});}updateObserverStatus();
}
function updateObserverStatus(){
 const el=root(),out=document.getElementById("observerStatus");if(!out||!el)return;
 const ratings=[...el.querySelectorAll("select[name^='rating']")],done=ratings.filter(x=>x.value).length;
 const missing=ratings.filter((x,i)=>x.value&&x.value!=="شاهد کافی نیست"&&!el.querySelector("[name='evidence"+i+"']")?.value.trim()).length;
 out.textContent="ارزیابی "+fa(done)+" از "+fa(ratings.length)+" معیار"+(missing?" · ⚠️ "+fa(missing)+" ارزیابی هنوز شاهد مشخص ندارد":"");
}
function saveDraft(){
 const el=root();if(!el||!activeCase)return;
 const obj={};el.querySelectorAll("[data-observer]").forEach(x=>obj[x.name]=x.value);
 observerDrafts.set(caseKey(),obj);updateObserverStatus();
}
function report(){
 const c=currentCase(),el=root();if(!c||!el)return;
 const d=c[role],get=n=>el.querySelector("[name='"+n+"']")?.value?.trim()||"ثبت نشده";
 const criteria=[...d.check,"پیش‌فرض‌ها با سؤال و شواهد بازنگری شدند.","در پایان، مالک اقدام، زمان و مرز اختیار مشخص بود."];
 const rows=["به‌پرور | گزارش مشاهده‌گر جلسه سوم","مسیر: "+R[role],"پرونده: "+d.title,"نام: "+get("observerName"),"","چک‌لیست"];
 criteria.forEach((t,i)=>rows.push(fa(i+1)+". "+t+" | "+get("rating"+i)+" | شاهد: "+get("evidence"+i)));
 rows.push("","پرسش‌های تحلیلی");
 d.questions.forEach((t,i)=>rows.push(fa(i+1)+". "+t+"\n"+get("question"+i)));
 rows.push("","قوی‌ترین رفتار: "+get("strength"),"فرصت بهبود: "+get("improvement"));
 const content=rows.join("\n"),preview=document.getElementById("reportPreview"),status=document.getElementById("copyStatus");
 preview.value=content;preview.hidden=false;
 if(navigator.clipboard?.writeText)navigator.clipboard.writeText(content).then(()=>status.textContent="گزارش کپی شد.").catch(()=>status.textContent="کپی خودکار ممکن نشد؛ متن زیر را دستی کپی کنید.");
 else status.textContent="متن گزارش برای کپی دستی در کادر زیر است.";
}
function renderQuiz(){
 const panel=document.getElementById("quizList"),items=QUIZZES[role],answers=quizAnswers[role];
 panel.innerHTML=items.map((q,i)=>'<article class="question"><h3>'+fa(i+1)+'. '+faText(q.q)+'</h3><div class="options">'+q.o.map(([t],j)=>'<button type="button" data-quiz="'+i+':'+j+'" aria-pressed="'+String(answers[i]===j)+'">'+fa(j+1)+'. '+faText(t)+'</button>').join("")+'</div>'+(answers[i]===undefined?"":'<div class="rationales"><strong>'+(answers[i]===q.a?"✅ پاسخ قابل دفاع":"🔎 پاسخ نیازمند بازنگری")+'</strong>'+q.o.map(([t,why],j)=>'<p><b>'+fa(j+1)+'. '+(j===q.a?"گزینه مناسب":"گزینه دیگر")+'</b> — '+faText(why)+'</p>').join("")+'</div>')+'</article>').join("");
}
function planKey(){return "behparvar_s3_idp_v1_"+role;}
function loadPlan(){
 let data={};try{data=JSON.parse(localStorage.getItem(planKey())||"{}")||{};}catch(e){}
 document.querySelectorAll("[data-idp]").forEach(x=>{if(typeof data[x.dataset.idp]==="string")x.value=data[x.dataset.idp];});
 document.getElementById("idpStatus").textContent=data.behavior?"برنامه ذخیره‌شده این مسیر بازیابی شد.":"";
}
function savePlan(){
 const data={};document.querySelectorAll("[data-idp]").forEach(x=>data[x.dataset.idp]=x.value.trim());
 const status=document.getElementById("idpStatus");
 try{localStorage.setItem(planKey(),JSON.stringify(data));status.textContent="برنامه این مسیر روی همین دستگاه ذخیره شد.";}catch(e){status.textContent="ذخیره در مرورگر ممکن نشد؛ متن را خودتان نگه دارید.";}
}
function init(){
 if(!CASES.length)return;
 role=readRole();document.getElementById("roleLabel").textContent=R[role];
 document.querySelectorAll("[data-self-assessment-link]").forEach(a=>{a.href="session3-self-assessment.html?audience="+encodeURIComponent(role);});
 document.querySelectorAll("[data-role]").forEach(b=>{b.setAttribute("aria-pressed",String(b.dataset.role===role));b.addEventListener("click",()=>{if(b.dataset.role===role)return;const u=new URL(location.href);u.searchParams.set("audience",b.dataset.role);location.assign(u.href);});});
 renderCards();renderQuiz();loadPlan();
 document.getElementById("caseList").addEventListener("click",e=>{const b=e.target.closest("[data-case-open]");if(!b)return;activeCase=b.dataset.caseOpen;renderCase();root().scrollIntoView({block:"start",behavior:"auto"});});
 root().addEventListener("click",e=>{
 const b=e.target.closest("button");if(!b)return;
 if(b.hasAttribute("data-case-back")){activeCase=null;renderCase();document.getElementById("cases").scrollIntoView({block:"start",behavior:"auto"});return;}
 if(b.dataset.caseJump){const to=root().querySelector("#"+b.dataset.caseJump);if(to){to.scrollIntoView({block:"start",behavior:"smooth"});to.setAttribute("tabindex","-1");to.focus({preventScroll:true});}return;}
 if(b.id==="copyObserver")report();
 });
 root().addEventListener("input",e=>{if(e.target.matches("[data-observer]"))saveDraft();});
 root().addEventListener("change",e=>{if(e.target.matches("[data-observer]"))saveDraft();});
 document.getElementById("quizList").addEventListener("click",e=>{const b=e.target.closest("[data-quiz]");if(!b)return;const [i,j]=b.dataset.quiz.split(":").map(Number);quizAnswers[role][i]=j;renderQuiz();});
 document.getElementById("saveIdp").addEventListener("click",savePlan);
 document.getElementById("clearIdp").addEventListener("click",()=>{
 if(!confirm("فقط برنامه توسعه فردی همین مسیر از این مرورگر پاک شود؟"))return;
 try{localStorage.removeItem(planKey());}catch(e){}
 document.querySelectorAll("[data-idp]").forEach(x=>x.value="");
 document.getElementById("idpStatus").textContent="برنامه این مسیر از مرورگر پاک شد.";
 });
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})(window);
