/* Safar participant experience v2: compact learning, reflection, evidence coach.
 * Content is derived from Behparvar's authored lessons, with no invented answer key.
 */
(()=>{"use strict";
const E=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fa=n=>Number(n||0).toLocaleString("fa-IR");
function lessonView(st,s,index){
 const p=String(st.lesson?.[0]||st.tip||"");
 const colon=p.indexOf(":"),sep=p.indexOf(" مثال: ");
 const title=colon>0?p.slice(0,colon):"تکنیک این مرحله";
 const how=colon>0?p.slice(colon+1,sep>0?sep:undefined).trim():p.slice(0,sep>0?sep:undefined);
 const example=sep>=0?p.slice(sep+7):"";
 const unit=window.BP_SAFAR_APPLIED?.units?.[index]||{};
 const read=!!s.learned?.[index];
 return '<section class="card sf-learning-card" aria-label="یادگیری کوتاه">'+
 '<div class="section-head"><span class="number">۱</span>تکنیک کوتاه · '+E(st.title)+'</div>'+
 '<p class="sf-learn-intro">پیش از تصمیم، این نکته را در یک دقیقه مرور کن.</p>'+
 '<div class="bullets sf-learn-principle"><strong>'+E(title)+'</strong><p>'+E(how)+'</p>'+
 (example?'<blockquote>'+E(example)+'</blockquote>':"")+'</div>'+
 '<p class="sf-learn-takeaway"><strong>نکته اجرایی:</strong> '+E(unit.transfer||st.tip||"این مهارت را در موقعیت بعدی به کار بگیر.")+'</p>'+
 '<p class="sf-learn-lens"><strong>معیار انتخاب در آزمون:</strong> '+E(unit.decisionLens||st.tip||"پیامد هر گزینه را بررسی کن.")+'</p>'+
 '<label class="sf-read-ack"><input type="checkbox" id="sfLessonRead" '+(read?"checked":"")+'/>'+
 '<span>مطالعه کردم؛ آماده‌ام به گام بعد بروم. <small>۰٫۵ امتیاز</small></span></label>'+
 '</section>';
}
function selfFeedback(st,s,index){
 const vals=s.self?.[index]||[],complete=vals.length===3&&vals.every(v=>Number.isInteger(v)&&v>=1&&v<=5);
 if(!complete)return '<p class="sf-self-hint">سه رفتار را بر اساس تجربه واقعی خودت بررسی کن. هیچ گزینه‌ای پاسخ صحیح یا امتیاز بالاتر نیست.</p>';
 const mean=vals.reduce((n,v)=>n+v,0)/3;
 const description=mean<1.8?"بر اساس پاسخ‌های خودت، این رفتارها هنوز به بخشی از روال ارتباطی روزمره تبدیل نشده‌اند.":
 mean<2.6?"این رفتارها را در موقعیت‌های محدودی به کار می‌بری و فرصت تمرین بیشتری دارند.":
 mean<3.5?"در برخی گفت‌وگوها این رفتارها را انجام می‌دهی، اما هنوز در همه موقعیت‌ها یکسان نیستند.":
 mean<4.5?"از نگاه خودت، در بسیاری از موقعیت‌های کاری این رفتارها را به کار می‌بری.":
 "بر اساس برداشت خودت، این رفتارها در بیشتر موقعیت‌های اخیر حضور داشته‌اند.";
 const strongest=vals.indexOf(Math.max(...vals)),priority=vals.indexOf(Math.min(...vals)),items=st.selfItems||[];
 const focus=items[priority]||"یک رفتار ارتباطی مشخص";
 const observed=items[strongest]||"یکی از رفتارهای این مهارت";
 return '<div class="sf-self-feedback sf-self-narrative" role="status">'+
 '<strong>بازتاب کوچ از خودارزیابی تو</strong><p>'+E(description)+'</p>'+
 '<p><b>رفتاری که بیشتر گزارش کرده‌ای:</b> '+E(observed)+'</p>'+
 '<p><b>فرصت تمرین و رشد:</b> '+E(focus)+'</p>'+
 '<p class="sf-self-coach-next"><b>گام بعد:</b> در گفت‌وگوی بعدی، یک نمونه واقعی از این رفتار را مشاهده و برای خودت ثبت کن.</p>'+
 '<small>این یک توصیف مبتنی بر برداشت خودت است، نه نمره توانمندی یا ارزیابی عملکرد واقعی. تکمیل سه پاسخ در امتیاز فعالیت لحاظ شده است.</small></div>';
}
function evidenceResult(s,index){
 const item=s.evidence?.[index],review=window.BP_SAFAR_RUBRIC.evidenceFor(s,index);
 if(!item)return '<p class="smaller">شواهد اختیاری‌اند. تا وقتی ثبت نشوند امتیاز اضافی ندارند.</p>';
 return '<div class="sf-evidence-result" role="status">'+
 '<strong>نتیجه بررسی شواهد: '+fa(review.total)+' از ۱٫۵ امتیاز افزوده</strong>'+
 '<p>ثبت سه شاهد مستقل: '+fa(review.submission)+' از ۰٫۵ · کیفیت ساختار شواهد: '+fa(review.quality)+' از ۱</p>'+
 '<p><strong>بازخورد کوچ:</strong> '+E(review.notes.join(" "))+'</p>'+
 '<small>ارزیابی کوچ درون‌برنامه‌ای بر اساس وضوح موقعیت، رفتار و پیامد متن انجام می‌شود؛ درستی ادعاها را احراز نمی‌کند.</small></div>';
}
function selfView(st,s,index){
 const vals=s.self?.[index]||[],saved=s.evidence?.[index]?.texts||[];
 const anchors=["هرگز · هیچ‌کدام از چهار موقعیت اخیر","به‌ندرت · یک موقعیت از چهار","گاهی · دو موقعیت از چهار","اغلب · سه موقعیت از چهار","تقریباً همیشه · هر چهار موقعیت"];
 return '<section class="card sf-self-card"><div class="section-head"><span class="number">۲</span>خودارزیابی رفتاری</div>'+
 '<p class="smaller">به چهار موقعیت کاری اخیر فکر کن. فقط توصیف کن چقدر این رفتار را انجام داده‌ای؛ مقیاس پنج‌گزینه‌ای است و هیچ گزینه‌ای امتیاز رقابتی بالاتری ندارد.</p>'+
 '<div class="self-list">'+(st.selfItems||st.lesson).map((q,i)=>
 '<div class="self-item"><p><strong>'+fa(i+1)+'.</strong> '+E(q)+'</p><div class="scalebtns">'+anchors.map((label,j)=>
 '<button type="button" aria-pressed="'+(vals[i]===j+1?"true":"false")+'" class="scalebtn '+(vals[i]===j+1?"selected":"")+'" data-scale="'+i+'" data-val="'+(j+1)+'">'+label+'</button>'
 ).join("")+'</div></div>').join("")+'</div>'+
 '<div id="sfSelfFeedbackHolder">'+selfFeedback(st,s,index)+'</div>'+
 '<details id="sfEvidenceSection" class="sf-evidence-details"><summary>ثبت داوطلبانه شواهد و دریافت امتیاز بیشتر · تا ۱٫۵ امتیاز</summary>'+
 '<p>اگر مایل هستی، برای هر رفتار یک مثال واقعی و متفاوت ثبت کن: <strong>چه زمانی، چه کاری انجام دادی و چه نتیجه‌ای دیدی؟</strong></p>'+
 '<p class="sf-evidence-explainer">سه شاهد معتبر و متمایز = ۰٫۵ امتیاز؛ بررسی کیفیت ساختار توسط کوچ = تا ۱ امتیاز. به‌همراه ۱ امتیاز تکمیل، سقف خودارزیابی این مرحله ۲٫۵ امتیاز است.</p>'+
 (st.selfItems||[]).map((q,i)=>
 '<label class="sf-evidence-label" for="sfEvidence'+i+'"><strong>شاهد '+fa(i+1)+' · '+E(q)+'</strong></label>'+
 '<textarea class="field sf-evidence-input" id="sfEvidence'+i+'" rows="3" maxlength="900" placeholder="موقعیت، رفتار خودم، نتیجه قابل مشاهده">'+E(saved[i]||"")+'</textarea>'
 ).join("")+
 '<button type="button" class="btn alt" id="sfSaveEvidence">ثبت شواهد و دریافت بازخورد کوچ</button>'+
 '<div id="sfEvidenceResult">'+evidenceResult(s,index)+'</div></details></section>';
}
window.BP_SAFAR_UI_V2={lessonView,selfFeedback,evidenceResult,selfView};
})();