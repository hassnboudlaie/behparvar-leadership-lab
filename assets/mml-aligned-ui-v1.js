/* My Management Lab: aligned scenario, practice, stage-direction and all-option quiz feedback.
   Retains all original localStorage records, route IDs and archived training materials. */
(function(global){
"use strict";
var sources=global.MMLAlignedData&&global.MMLAlignedData.sessions;
var library=global.MMLLessonLibrary;
var PARTS=["m1","m2","leaders","techniques","visuals","diseases","quiz"];
var TITLES=["شروع","گفت‌وگوی کاری","نکته مهم","راه‌حل","مقایسه دو روش","اشتباه رایج","آزمون و اقدام"];
var NUM=["اول","دوم","سوم","چهارم","پنجم","ششم"];
if(!sources||sources.length!==6||!library)throw Error("Aligned curriculum: missing source modules");
function esc(x){return String(x==null?"":x).replace(/[&<>"']/g,function(ch){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]})}
function storageKey(n,role){return "mml_aligned_v1_"+role+"_"+n}
function read(n,role){
 try{var x=JSON.parse(localStorage.getItem(storageKey(n,role))||"null");return x&&typeof x==="object"?x:{notes:{},answers:{},page:0}}catch(e){return {notes:{},answers:{},page:0}}
}
function save(n,role,st){try{localStorage.setItem(storageKey(n,role),JSON.stringify(st))}catch(e){}}
function prose(v){return esc(v).replace(/KPI/g,"شاخص عملکرد").replace(/Checkpoint/g,"زمان بازبینی").replace(/Guardrail/g,"حد ایمنی و کیفیت")}
function faNum(n){return String(n).replace(/\d/g,function(x){return "۰۱۲۳۴۵۶۷۸۹"[Number(x)]})}
/* Work situations in clear everyday Persian. Academic version stays in the optional reader. */
var SIMPLE_SCENARIOS=[
 {m:"آمار واحد شما خوب است؛ اما واحد بعدی می‌گوید سفارش‌ها دیر می‌رسند. مدیرعامل می‌پرسد: نتیجه کار شما واقعاً خوب بوده است؟",s:"شما سرپرست شیفت هستید. وقتی مشکلی پیش می‌آید، خودتان آن را حل می‌کنید. حالا کارکنان حتی برای تصمیم‌های ساده منتظر شما هستند."},
 {m:"فروش به مشتری قول داده سفارش فردا برسد. تولید می‌گوید وقت کافی ندارد و مسئول کیفیت می‌گوید هنوز آزمایش تمام نشده. شما باید برای تحویل تصمیم بگیرید.",s:"شیفت قرار است سفارش را آماده کند، اما مواد هنوز تأیید نشده و یکی از دستگاه‌ها هم باید متوقف شود. تیم از شما می‌پرسد: چه کار کنیم؟"},
 {m:"گزارش تولید می‌گوید خط دو ساعت متوقف بوده، اما گزارش تعمیرات زمان دیگری را نشان می‌دهد. مدیر از شما می‌خواهد علت توقف را پیدا کنید.",s:"قرار بوده دستگاه در این شیفت ۸ ساعت کار کند؛ اما فقط ۶ ساعت کار کرده است. هنوز نمی‌دانید علت چه بوده و باید آن را بررسی کنید."},
 {m:"فروش می‌گوید سفارش مشتری باید فردا تحویل شود. تولید می‌گوید آماده نیست و کیفیت هم هنوز اجازه تحویل نداده است. حالا هر سه نفر در جلسه منتظر تصمیم شما هستند.",s:"برنامه شیفت عوض شده، اما کسی دلیلش را برای کارکنان توضیح نداده است. چند نفر ناراحت‌اند و می‌گویند با این تغییر نمی‌توانند کار را به‌موقع تمام کنند."},
 {m:"سرپرستان هر روز برای تصمیم‌های ساده با شما تماس می‌گیرند. بخش زیادی از وقت شما صرف جواب‌دادن می‌شود. می‌خواهید کارها بدون وابستگی دائمی به شما پیش بروند.",s:"کارکنان برای هر کار ساده از شما اجازه می‌خواهند. می‌خواهید بخشی از تصمیم‌ها را به آن‌ها بسپارید، اما باید روشن کنید چه چیزهایی مجاز است."},
 {m:"هزینه تعمیرات را کم کرده‌اید؛ اما دستگاه‌ها بیشتر خراب می‌شوند و سفارش‌ها دیرتر آماده می‌شوند. مدیرعامل می‌پرسد: آیا این کار واقعاً به نفع شرکت بوده است؟",s:"روش تازه آماده‌سازی شیفت سریع‌تر است، اما معلوم نیست چه کسی باید کنترل نهایی کیفیت را انجام دهد. قبل از اجرای روش تازه چه می‌کنید؟"}
];
function question(n,role){
 var story=SIMPLE_SCENARIOS[n-1],doc=library.DATA[n-1];
 return n>1?(role==="supervisors"?doc.supervisor:doc.manager):(story?(role==="supervisors"?story.s:story.m):(role==="supervisors"?doc.supervisor:doc.manager));
}
function reviewInput(n,part,role,title){
 var state=read(n,role),text=((state.notes||{})[part]||"");
 return '<div class="mml-align-write"><label for="mml-align-note-'+n+'-'+part+'">'+esc(title||"یادداشت من")+'</label>'+
   '<textarea id="mml-align-note-'+n+'-'+part+'" data-mml-align-note="'+n+':'+part+':'+role+'" rows="2" placeholder="پاسخ کوتاه خود را اینجا بنویسید">'+esc(text)+'</textarea>'+
   '</div>';
}
/* Book-based examples are optional, selected by topic rather than old session number. */
var BOOK_CASES={1:[1,0],2:[1,1],3:[3,2],4:[4,0],5:[2,0],6:[6,2]};
function bookExample(n){
 var map=BOOK_CASES[n],all=global.BP_CASE_DATA||{},entry=map&&all[map[0]];
 var c=entry&&entry.cases&&entry.cases[map[1]];
 if(!c||!c.story||!c.source)return "";
 return '<details class="mml-align-book"><summary>نمونه مرتبط از کتاب «حقایق تلخ»</summary>'+
  '<div><h4>'+prose(c.title)+'</h4><p>'+prose(c.story)+'</p>'+
  '<p><strong>سؤال مدیریتی:</strong> '+prose(c.decision||"در این موقعیت چه تصمیمی می‌گیرید؟")+'</p>'+
  '<small>برگرفته از '+prose(c.source)+'؛ بازآفرینی آموزشی، نه گزارش یک رویداد در به‌پرور.</small>'+
  '</div></details>';
}
function context(n,role){
 var m=sources[n-1];
 return '<div class="mml-align-context"><strong>اتفاق آشنا</strong><p>'+prose(question(n,role))+'</p></div>';
}
function bullets(items){return '<ul class="mml-align-bullets">'+items.map(function(v){return '<li>'+prose(v)+'</li>'}).join("")+'</ul>'}
function renderQuiz(n,role){
 var st=read(n,role),data=sources[n-1],items=data.quiz;
 var page=Math.max(0,Math.min(items.length-1,Number(st.page)||0));
 var q=items[page],selected=(st.answers||{})[page],has=selected!==undefined&&selected!==null;
 var count=items.filter(function(_q,i){return st.answers&&st.answers[i]!==undefined}).length;
 var display='<div class="mml-align-quiz" data-mml-align-quiz="'+n+':'+role+'">'+
  '<div class="mml-align-quiz-bar"><strong>سؤال '+faNum(page+1)+' از '+faNum(items.length)+'</strong></div>'+
  '<h4>'+esc(q.q)+'</h4>'+
  '<div class="mml-align-options" role="group" aria-label="پاسخ‌های سؤال '+(page+1)+'">'+
  q.o.map(function(opt,i){var active=has&&Number(selected)===i;
    return '<button type="button" data-mml-align-choice="'+n+':'+page+':'+i+':'+role+'" aria-pressed="'+active+'"><b>'+["الف","ب","ج"][i]+'</b><span>'+prose(opt[0])+'</span></button>';
  }).join("")+'</div>';
 if(has){
  var chosen=q.o[Number(selected)];
  display+='<div class="mml-align-feedback" role="status" aria-live="polite">'+
   '<strong>'+(chosen&&chosen[2]?"انتخاب شما مناسب است.":"این انتخاب در این موقعیت بهترین گزینه نیست.")+'</strong>'+
   '<p>دلیل هر گزینه را جداگانه بررسی کنید:</p>'+
   '<ol>'+q.o.map(function(opt,i){return '<li class="'+(opt[2]?"is-correct":"is-incorrect")+'"><b>گزینه '+["الف","ب","ج"][i]+' — '+(opt[2]?"مناسب":"نامناسب")+'</b><p>'+prose(opt[1])+'</p></li>'}).join("")+'</ol>'+
   '</div>';
 }
 display+='<div class="mml-align-quiz-nav">'+
  '<button type="button" data-mml-align-page="'+n+':'+(page-1)+':'+role+'"'+(page===0?" disabled":"")+'>سؤال قبل</button>'+
  '<button type="button" data-mml-align-page="'+n+':'+(page+1)+':'+role+'"'+(page===items.length-1?" disabled":"")+'>سؤال بعد</button>'+
  '</div>';
 if(count===items.length){
  var correct=items.reduce(function(v,q,i){return v+((q.o[Number(st.answers[i])]||[])[2]?1:0)},0);
  display+='<p class="mml-align-result">نتیجه این تمرین: '+faNum(correct)+' پاسخ مناسب از '+faNum(items.length)+' سؤال. این عدد نمره شایستگی شغلی نیست.</p>';
 }
 return display+"</div>";
}
function render(n,part,role){
 n=Number(n);
 if(!sources[n-1]||PARTS.indexOf(part)<0)return "";
 role=role==="supervisors"?"supervisors":"managers";
 var data=sources[n-1],d=library.DATA[n-1],i=PARTS.indexOf(part),h="";
 var intro='<section class="mml-align-main" data-mml-scene-id="session-'+n+'" data-mml-aligned-part="'+part+'">'+
  
  '<div class="mml-align-skill"><strong>موضوع تمرین:</strong><span>'+prose(data.skill)+'</span></div>';
 if(i===0){
   h=context(n,role)+
    '<section><h3>چه چیزی می‌دانیم؟</h3>'+bullets(data.facts)+'</section>'+
    '<section><h3>قبل از تصمیم چه بپرسم؟</h3><p>از هر نفر بپرسید: چه اتفاقی افتاده؟ چه چیزی جلوی کار را گرفته؟ چه کمکی لازم است؟ سپس قدم بعدی را مشخص کنید.</p></section>'+
    reviewInput(n,part,role,"یک سؤال که باید از تیم بپرسم");
 }else if(i===1){
   h=context(n,role)+
    '<section><h3>گفت‌وگو را اجرا کنید</h3><p>نقش‌های دو یا چهار واحد را بین شرکت‌کنندگان تقسیم کنید. به لحن، مکث، زبان بدن و تغییر موضع هنگام اختلاف توجه کنید.</p>'+
    library.renderRoleplay(n,role)+'</section>'+
    '<section class="mml-align-twist"><h3>اتفاق تازه</h3><p>'+prose(data.twist)+'</p></section>'+
    '<section><h3>دور دوم؛ همان گفت‌وگو را بهتر اجرا کنید</h3><p>همه نقش‌ها در برابر اتفاق تازه موضع خود را بازبینی کنند و سپس یک دور دوباره اجرا کنید. برای تمرین همدلی، نقش‌ها را نیز جابه‌جا کنید.</p>'+
    '<strong>چک‌لیست مشاهده‌گر</strong>'+bullets(data.observe)+'</section>'+
    reviewInput(n,part,role,"کدام جمله و رفتار باید در اجرای دوم تغییر کند؟");
 }else if(i===2){
   h=context(n,role)+
    '<section><h3>درس از این موقعیت</h3><p>'+prose(d.chapters[2][1])+'</p></section>'+
    '<section><h3>اگر مدیر بودی چه می‌دیدی؟</h3><p>'+prose(data.facts[1])+'</p>'+
    '<p>در تصمیم اخیر خودتان کدام نگرانی یا محدودیت را دیر متوجه شدید؟</p></section>'+bookExample(n)+
    reviewInput(n,part,role,"یک نکته که می‌خواهم در کارم امتحان کنم");
 }else if(i===3){
   h=context(n,role)+
    '<section><h3>روش کار در چهار گام</h3><ol class="mml-align-process">'+d.flow.map(function(x,j){return '<li><b>'+(j+1)+'</b><span>'+prose(x)+'</span></li>'}).join("")+'</ol></section>'+
    '<section class="mml-align-twist"><h3>وقتی شرایط عوض می‌شود</h3><p>'+prose(data.twist)+'</p>'+
    '<p><b>کاری که باید تمرین کنی:</b> '+prose(data.technique)+'</p></section>'+
    reviewInput(n,part,role,"با این اطلاعات، قدم بعدی من چیست؟");
 }else if(i===4){
   h=context(n,role)+
    '<section><h3>جدول تصمیم</h3>'+
    '<div class="mml-edu-table-scroll"><table><caption>دو روش را مقایسه کنید</caption><thead><tr><th>موضوع</th><th>روش ضعیف</th><th>روش بهتر</th></tr></thead>'+
    '<tbody>'+d.matrix.map(function(x){return '<tr><th>'+prose(x[0])+'</th><td>'+prose(x[1])+'</td><td>'+prose(x[2])+'</td></tr>'}).join("")+'</tbody></table></div></section>'+
    '<section><h3>مراحل تصمیم</h3><ol class="mml-align-process">'+d.flow.map(function(x,j){return '<li><b>'+(j+1)+'</b><span>'+prose(x)+'</span></li>'}).join("")+'</ol></section>'+
    reviewInput(n,part,role,"در این موقعیت، کدام روش را انتخاب می‌کنم؟ چرا؟");
 }else if(i===5){
   h=context(n,role)+
    '<section><h3>اشتباه رایج</h3><p>'+prose(data.trap)+'</p></section>'+
    '<section><h3>بهتر است چه کنیم؟</h3><p>'+prose(data.technique)+'</p></section>'+
    '<section class="mml-align-twist"><h3>مانع تازه</h3><p>'+prose(data.twist)+'</p></section>'+
    reviewInput(n,part,role,"چطور از تکرار این اشتباه جلوگیری کنم؟");
 }else{
   h=context(n,role)+
    '<section><h3>کدام تصمیم بهتر است؟</h3>'+
    '<div class="mml-align-quiz-mount" data-mml-align-quiz-mount="'+n+':'+role+'">'+renderQuiz(n,role)+'</div></section>'+
    '<section><h3>اقدام من</h3><p>'+prose(data.transfer)+'</p>'+
    reviewInput(n,part,role,"این هفته دقیقاً چه کاری انجام می‌دهم؟")+'</section>';
 }
 return intro+h+'</section>';
}
function changeView(n,role){
 var node=document.querySelector('[data-mml-align-quiz-mount="'+n+':'+role+'"]');
 if(node)node.innerHTML=renderQuiz(n,role);
}
function events(){
 document.addEventListener("click",function(e){
   var item=e.target.closest("[data-mml-align-choice]");
   if(item){
    var x=item.getAttribute("data-mml-align-choice").split(":"),n=Number(x[0]),i=Number(x[1]),choice=Number(x[2]),role=x[3];
    if(!sources[n-1]||!sources[n-1].quiz[i]||choice<0||choice>2)return;
    var st=read(n,role);if(!st.answers)st.answers={};st.answers[i]=choice;st.page=i;
    save(n,role,st);changeView(n,role);
    var next=document.querySelector('[data-mml-align-choice="'+n+':'+i+':'+choice+':'+role+'"]');if(next)next.focus({preventScroll:true});
    return;
   }
   item=e.target.closest("[data-mml-align-page]");
   if(item){
    var a=item.getAttribute("data-mml-align-page").split(":"),n=Number(a[0]),page=Number(a[1]),role=a[2];
    if(!sources[n-1]||page<0||page>=sources[n-1].quiz.length)return;
    var st=read(n,role);st.page=page;save(n,role,st);changeView(n,role);
    var target=document.querySelector('[data-mml-align-quiz="'+n+':'+role+'"] h4');if(target){target.setAttribute("tabindex","-1");target.focus({preventScroll:true})}
   }
 });
 document.addEventListener("input",function(e){
   var input=e.target.closest("[data-mml-align-note]");if(!input)return;
   var a=input.getAttribute("data-mml-align-note").split(":"),n=Number(a[0]),part=a[1],role=a[2];
   if(!sources[n-1]||PARTS.indexOf(part)<0)return;
   var st=read(n,role);if(!st.notes)st.notes={};st.notes[part]=input.value;save(n,role,st);
 });
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",events);else events();
global.MMLAlignedUI={render:render,renderQuiz:renderQuiz,read:read,PARTS:PARTS,topics:sources};
})(window);
