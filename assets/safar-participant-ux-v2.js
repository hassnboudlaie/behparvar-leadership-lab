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
 '<label class="sf-read-ack"><input type="checkbox" id="sfLessonRead" '+(read?"checked":"")+'/>'+
 '<span>مطالعه کردم؛ آماده‌ام به گام بعد بروم. <small>۰٫۵ امتیاز</small></span></label>'+
 '</section>';
}
function selfFeedback(st,s,index){
 const vals=s.self?.[index]||[],complete=vals.length===3&&vals.every(v=>Number.isInteger(v)&&v>=1&&v<=4);
 if(!complete)return '<p class="sf-self-hint">برای هر رفتار، چهار موقعیت اخیر را در نظر بگیر؛ پاسخ ۱ یا ۴ امتیاز بیشتری ندارد.</p>';
 const sum=vals.reduce((n,v)=>n+v,0);
 const mentor=sum<=5?"یک رفتار مشخص برای تمرین در موقعیت بعدی انتخاب کن.":
 sum<=8?"کدام شرایط به تو کمک می‌کند این رفتار را پایدارتر انجام بدهی؟":
 sum<=10?"برای تأیید برداشت مثبت، یک شاهد واقعی ثبت کن.":
 "خوب است که تصویر مثبتی داری؛ آن را با شواهد و پیامد واقعی بررسی کن.";
 return '<div class="sf-self-feedback" role="status"><strong>شاخص خودارزیابی (غیررقابتی): '+fa(sum)+' از ۱۲</strong>'+
 '<span>امتیاز تکمیل: ۱ از ۱؛ مستقل از بالا یا پایین بودن پاسخ‌ها</span><p><strong>بازخورد کوچ:</strong> '+E(mentor+" "+(st.tip||""))+'</p></div>';
}
function evidenceResult(s,index){
 const item=s.evidence?.[index],review=window.BP_SAFAR_RUBRIC.reviewEvidence(item?.texts||[]);
 if(!item)return '<p class="smaller">شواهد اختیاری‌اند. تا وقتی ثبت نشوند امتیاز اضافی ندارند.</p>';
 return '<div class="sf-evidence-result" role="status">'+
 '<strong>نتیجه بررسی شواهد: '+fa(review.total)+' از ۱٫۵ امتیاز افزوده</strong>'+
 '<p>ثبت سه شاهد مستقل: '+fa(review.submission)+' از ۰٫۵ · کیفیت ساختار شواهد: '+fa(review.quality)+' از ۱</p>'+
 '<p><strong>بازخورد کوچ:</strong> '+E(review.notes.join(" "))+'</p>'+
 '<small>ارزیابی کوچ درون‌برنامه‌ای بر اساس وضوح موقعیت، رفتار و پیامد متن انجام می‌شود؛ درستی ادعاها را احراز نمی‌کند.</small></div>';
}
function selfView(st,s,index){
 const vals=s.self?.[index]||[],saved=s.evidence?.[index]?.texts||[];
 const anchors=["تقریباً هیچ‌وقت · ۰ از ۴","گاهی · ۱ از ۴","بیشتر وقت‌ها · ۲ یا ۳ از ۴","تقریباً همیشه · ۴ از ۴"];
 return '<section class="card sf-self-card"><div class="section-head"><span class="number">۲</span>خودارزیابی رفتاری</div>'+
 '<p class="smaller">به چهار موقعیت کاری اخیر فکر کن. پاسخ‌ها فقط برای شناخت رفتار خودت هستند؛ انتخاب سطح بالاتر امتیاز رقابتی بیشتری ندارد.</p>'+
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