/* Behparvar: standalone Balanced Scorecard workshop */
(()=>{"use strict";
const $=id=>document.getElementById(id),esc=s=>String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const KEY="bp-s6-bsc-advanced-v1";
const themes=[
{id:"specialist",title:"تمایز با محصولات تخصصی",desc:"ارزش بیشتر با دانش و نوآوری"},
{id:"expansion",title:"توسعه بازارهای جدید",desc:"رشد سنجیده در بازارهای جغرافیایی تازه"},
{id:"resilience",title:"تاب‌آوری و اعتماد مشتری",desc:"پایداری زنجیره ارزش و روابط بلندمدت"},
{id:"profit",title:"رشد سودآور پایدار",desc:"خلق ارزش اقتصادی از سرمایه‌گذاری هدفمند"}
];
const owners=["تیم راهبری شرکت","مالی و برنامه‌ریزی","فروش و بازاریابی","پژوهش و توسعه","تولید و کیفیت","زنجیره تأمین","سرمایه انسانی","کارگروه مشترک چند واحد"];
// Four standard perspectives in an instructional driver-to-result sequence.
const P=[
{id:"l",title:"یادگیری و رشد",en:"Learning & Growth",tag:"پیشران",question:"برای اجرای استراتژی آینده به چه قابلیت‌هایی نیاز داریم؟",intro:"این منظر بر ظرفیت‌های بلندمدت سازمان تمرکز دارد؛ صرفاً تعداد دوره‌های آموزشی نیست.",goals:[
["l1","تقویت توان نوآوری محصول","پوشش شایستگی‌های ضروری توسعه محصول","شایستگی‌های دارای متخصص تأییدشده ÷ کل شایستگی‌های ضروری × ۱۰۰",["برنامه توسعه توان فرمولاسیون و تحقیق","مشارکت پژوهشی بلندمدت با مراکز علمی"],["specialist","profit"],"پژوهش و توسعه"],
["l2","جانشین‌پروری نقش‌های راهبردی","نرخ نقش‌های کلیدی دارای جانشین آماده","نقش‌های دارای جانشین ارزیابی‌شده ÷ کل نقش‌های کلیدی × ۱۰۰",["برنامه جانشین‌پروری مناصب حیاتی","مسیر تربیت مدیران و متخصصان آینده"],["resilience","profit"],"سرمایه انسانی"],
["l3","تقویت تصمیم‌گیری راهبردی مبتنی بر داده","سهم تصمیم‌های توسعه بازار دارای مطالعه معتبر","تصمیم‌های توسعه بازار مبتنی بر مطالعه ÷ کل تصمیم‌های توسعه بازار × ۱۰۰",["نظام تحلیل مستمر بازارهای هدف","توسعه قابلیت بینش مشتری در سازمان"],["expansion","specialist"],"فروش و بازاریابی"]]},
{id:"p",title:"فرایندهای داخلی",en:"Internal Processes",tag:"پیشران",question:"کدام قابلیت اصلی باید مزیت رقابتی بسازد؟",intro:"تمرکز بر فرایندهایی است که استراتژی را محقق می‌کنند، نه جزئیات کار روزمره.",goals:[
["p1","افزایش موفقیت عرضه محصولات تازه","نرخ پروژه‌های توسعه محصول منتهی به عرضه تجاری","پروژه‌های مصوب رسیده به عرضه تجاری ÷ کل پروژه‌های همان گروه × ۱۰۰",["نظام تصمیم‌گیری برای سبد نوآوری","برنامه مشترک پژوهش، تولید و بازار"],["specialist","profit"],"پژوهش و توسعه"],
["p2","تاب‌آورسازی تأمین مواد اولیه","سهم مواد اولیه حیاتی با دو منبع تأمین تأییدشده","اقلام حیاتی با دست‌کم دو منبع ÷ کل اقلام حیاتی × ۱۰۰",["تنوع‌بخشی راهبردی به تأمین‌کنندگان","قراردادهای مشارکتی بلندمدت در زنجیره تأمین"],["resilience","profit"],"زنجیره تأمین"],
["p3","ایجاد قابلیت ورود به بازار تازه","سهم بازارهای هدف دارای برنامه ورود مصوب","بازارهای هدف با مدل ورود مصوب ÷ کل بازارهای هدف تعریف‌شده × ۱۰۰",["برنامه توسعه مرحله‌ای بازارهای جدید","شبکه شرکای تجاری در مناطق منتخب"],["expansion","specialist"],"فروش و بازاریابی"]]},
{id:"c",title:"مشتری و بازار",en:"Customer",tag:"نتیجه میانی",question:"مشتری چرا باید ما را ترجیح دهد؟",intro:"این منظر جایگاه شرکت و ارزش واقعی دریافت‌شده از دید مشتری را نشان می‌دهد.",goals:[
["c1","افزایش وفاداری مشتریان کلیدی","نرخ حفظ مشتریان کلیدی","مشتریان کلیدی فعالِ باقی‌مانده ÷ مشتریان کلیدی ابتدای دوره × ۱۰۰",["برنامه مشارکت بلندمدت با مشتریان کلیدی","نظام شناخت نیاز بخش‌های مشتری"],["resilience","profit"],"فروش و بازاریابی"],
["c2","تقویت جایگاه در بازار تخصصی","سهم فروش شرکت از بازار هدف تخصصی","فروش شرکت در بخش تعریف‌شده ÷ فروش کل همان بخش با واحد یکسان × ۱۰۰",["بازتعریف ارزش پیشنهادی بازار تخصصی","توسعه بازار محصولات دانش‌محور"],["specialist","profit"],"فروش و بازاریابی"],
["c3","حضور پایدار در بازارهای تازه","سهم فروش از مناطق جغرافیایی جدید","فروش مناطق جدید با تعریف ثابت ÷ کل فروش شرکت × ۱۰۰",["تثبیت شبکه توزیع بازارهای منتخب","برنامه رشد مشتریان در مناطق جدید"],["expansion","resilience"],"فروش و بازاریابی"]]},
{id:"f",title:"مالی",en:"Financial",tag:"نتیجه نهایی",question:"استراتژی چه ارزش اقتصادی پایدار ایجاد می‌کند؟",intro:"منظر مالی خلق ارزش اقتصادی را پایش می‌کند؛ افزایش فروش به‌تنهایی کافی نیست.",goals:[
["f1","رشد سودآوری پایدار","حاشیه سود عملیاتی","سود عملیاتی ÷ درآمد فروش × ۱۰۰",["بازآرایی سبد محصولات بر مبنای سودآوری","اولویت‌بندی سرمایه‌گذاری‌های ارزش‌آفرین"],["specialist","profit","resilience"],"مالی و برنامه‌ریزی"],
["f2","تنوع منابع درآمد شرکت","سهم درآمد محصولات یا بازارهای جدید","فروش خالص بخش‌های جدید ÷ کل فروش خالص × ۱۰۰",["سرمایه‌گذاری مرحله‌ای در جریان‌های درآمدی جدید","توسعه سبد بازارهای هدف"],["expansion","specialist"],"تیم راهبری شرکت"],
["f3","افزایش اثربخشی سرمایه‌گذاری راهبردی","سهم پروژه‌های رشد رسیده به بازده مصوب","پروژه‌های قابل ارزیابی با بازده تحقق‌یافته ÷ کل پروژه‌های قابل ارزیابی × ۱۰۰",["نظام ارزیابی سرمایه‌گذاری‌های راهبردی","بازبینی پرتفوی سرمایه‌گذاری برای خلق ارزش"],["profit","resilience"],"مالی و برنامه‌ریزی"]]}
];
const blank=()=>({theme:"",role:"",review:"",parts:{l:{},p:{},c:{},f:{}}});
let s=blank();
try{
const saved=JSON.parse(localStorage.getItem(KEY)||"null");
if(saved&&saved.parts){s={...blank(),...saved,parts:{...blank().parts,...saved.parts}};}
else{const old=JSON.parse(localStorage.getItem("bp-s6-strategic-bsc-v3")||"null");if(old?.bsc){s.role=old.role||"";for(const p of P){const prev=old.bsc[p.id];if(prev?.metric){const conv={l:["l2","l1","l3"],p:["p1","p2","p3"],c:["c2","c1","c3"],f:["f1","f3","f2"]};s.parts[p.id].goal=conv[p.id][Number(prev.metric)-1]||"";s.parts[p.id].horizon=prev.horizon==="year"?"1":prev.horizon==="three"?"3":"";}}}}
}catch(e){}
const part=p=>s.parts[p.id]||{};
const selected=p=>p.goals.find(g=>g[0]===part(p).goal);
const findName=(arr,id)=>arr.find(x=>x.id===id)?.title||"";
function persist(){try{localStorage.setItem(KEY,JSON.stringify(s));$("saveStatus").textContent="پاسخ‌های این BSC در مرورگر ذخیره شدند."}catch(e){$("saveStatus").textContent="ذخیره خودکار ممکن نشد؛ خروجی را دریافت کنید."}}
function radio(name,arr,current){return arr.map(x=>'<label><input type="radio" name="'+esc(name)+'" value="'+esc(x.id)+'"'+(x.id===current?" checked":"")+'><span><strong>'+esc(x.title)+'</strong><small>'+esc(x.desc||"")+'</small></span></label>').join("")}
function select(field,p,caption,arr,value,empty){const id=field+"-"+p;return '<label class="bsc-field"><span>'+esc(caption)+'</span><select data-bsc-field="'+id+'" aria-label="'+esc(caption)+'"><option value="">'+esc(empty||"انتخاب کنید")+'</option>'+arr.map(x=>'<option value="'+esc(x[0])+'"'+(String(value??"")===String(x[0])?" selected":"")+'>'+esc(x[1])+'</option>').join("")+'</select></label>'}
function num(v,negative=false){if(v===null||v===undefined||String(v).trim()==="")return null;const n=Number(v);return Number.isFinite(n)&&n<=(100)&&n>=(negative?-100:0)?n:null;}
function target(p){const z=part(p),o=selected(p);if(!o||!z.delta)return{number:null,text:"تعیین نشده",error:""};
if(z.delta==="later")return{number:null,text:"پس از تأیید خط مبنا تعیین شود",error:""};
const d=z.delta==="hold"?0:Number(z.delta);
const baseline=z.baselineStatus==="known"?num(z.baseline,p.id==="f"&&o[0]==="f1"):null;
if(baseline===null)return{number:null,text:(d===0?"حفظ":"افزایش "+d+" واحد درصد نسبت به")+" خط مبنای واقعی (هنوز ثبت نشده)",error:""};
const proposed=baseline+d;
if(proposed>100)return{number:null,text:"نامعتبر: "+proposed+"٪ بیش از ۱۰۰٪",error:"این هدف از سقف ۱۰۰٪ بیشتر است."};
return{number:proposed,text:proposed.toLocaleString("fa-IR",{maximumFractionDigits:1})+"٪ در مقایسه با خط مبنای "+baseline+"٪",error:""};
}
function drawAll(){
$("themeChoices").innerHTML=radio("bsc-theme",themes,s.theme);
$("reviewChoices").innerHTML=radio("bsc-review",[{id:"quarter",title:"هر سه ماه",desc:"مرور شاخص‌ها و ابتکارها"},{id:"half",title:"هر شش ماه",desc:"مرور نتایج و مفروضات استراتژی"}],s.review);
document.querySelectorAll('input[name="bsc-role"]').forEach(x=>x.checked=x.value===s.role);
drawCards();drawReport();
}
function card(p){
const z=part(p),o=selected(p);
let html='<article class="bsc-perspective" id="bsc-'+p.id+'"><header class="bsc-p-head"><div><span class="bsc-p-kicker">'+esc(p.en)+' | '+esc(p.tag)+'</span><h3>'+esc(p.title)+'</h3><p>'+esc(p.question)+'</p></div><span class="bsc-p-status" id="mark-'+p.id+'"></span></header>'+
'<p class="bsc-explain">'+esc(p.intro)+'</p><div class="bsc-p-controls">';
html+=select("goal",p.id,"۱. هدف راهبردی پیشنهادی",p.goals.map(g=>[g[0],g[1]+(s.theme&&g[5].includes(s.theme)?" · همسو با مسیر انتخابی":"")]),z.goal,"یک هدف برای این منظر");
if(o){
html+='<div class="bsc-kpi"><span>شاخص اصلی نتیجه این هدف</span><strong>'+esc(o[2])+'</strong><details><summary>این شاخص چگونه محاسبه می‌شود؟</summary><p>'+esc(o[3])+'</p></details></div><div class="bsc-columns">';
html+=select("delta",p.id,"۲. هدف بهبود پیشنهادی",[["2","افزایش ۲ واحد درصد"],["5","افزایش ۵ واحد درصد"],["10","افزایش ۱۰ واحد درصد"],["hold","حفظ مقدار فعلی یا بهتر"],["later","پس از جمع‌آوری داده‌ها تعیین شود"]],z.delta);
html+=select("horizon",p.id,"۳. افق زمانی",[["1","یک ساله"],["3","سه ساله"]],z.horizon);
html+=select("baselineStatus",p.id,"۴. وضعیت خط مبنا",[["unknown","داده معتبر نداریم"],["known","خط مبنای واقعی دارم"]],z.baselineStatus);
html+=select("owner",p.id,"۵. مسئول راهبردی پیشنهادی",owners.map(x=>[x,x===o[6]?x+" (پیشنهادی)":x]),z.owner);
html+=select("initiative",p.id,"۶. ابتکار راهبردی",o[4].map((v,i)=>[String(i),v]),z.initiative);
html+='</div>';
if(z.baselineStatus==="known"){
html+='<div class="bsc-numbers"><label>خط مبنای واقعی (%)<input type="number" data-bsc-number="baseline-'+p.id+'" inputmode="decimal" min="'+(p.id==="f"&&o[0]==="f1"?"-100":"0")+'" max="100" step="0.1" value="'+esc(z.baseline??"")+'" placeholder="مقدار ثبت‌شده"></label>'+
'<label>مقدار واقعی جدید، اگر موجود است (%)<input type="number" data-bsc-number="actual-'+p.id+'" inputmode="decimal" min="'+(p.id==="f"&&o[0]==="f1"?"-100":"0")+'" max="100" step="0.1" value="'+esc(z.actual??"")+'" placeholder="اختیاری"></label></div>';
}
html+='<p class="bsc-target-preview">Target: '+esc(target(p).text)+'</p>';
}
return html+'</div></article>';
}
function drawCards(){ $("perspectiveForms").innerHTML=P.map(card).join("");for(const p of P){const m=$("mark-"+p.id);if(m)m.textContent=isComplete(p)?"تکمیل شده":"نیازمند انتخاب";} }
function isComplete(p){
const z=part(p),o=selected(p),t=target(p);
return !!(o&&z.delta&&z.horizon&&z.baselineStatus&&z.owner&&z.initiative!==undefined&&z.initiative!==""&&!(z.baselineStatus==="known"&&num(z.baseline,p.id==="f"&&o[0]==="f1")===null)&&!t.error);
}
function row(p){
const z=part(p),o=selected(p),t=target(p),allowNegative=p.id==="f"&&o?.[0]==="f1";
const base=z.baselineStatus==="known"?(num(z.baseline,allowNegative)===null?"ورودی نامعتبر":z.baseline+"٪"):"بدون خط مبنای ثبت‌شده";
const real=num(z.actual,allowNegative);
return{p,z,o,t,base,real,initiative:o?.[4]?.[Number(z.initiative)]||"—"};
}
function audit(){
const rs=P.map(row),complete=rs.filter(r=>isComplete(r.p)).length,ready=rs.filter(r=>r.t.number!==null).length,missing=[];
if(!s.theme)missing.push("جهت‌گیری راهبردی کل شرکت هنوز انتخاب نشده است.");
if(!s.review)missing.push("دوره بازنگری استراتژی هنوز انتخاب نشده است.");
if(complete<4)missing.push((4-complete)+" منظر هنوز به‌طور کامل تکمیل نشده است.");
for(const r of rs){
if(r.t.error)missing.push(r.p.title+": "+r.t.error);
if(r.o&&s.theme&&!r.o[5].includes(s.theme))missing.push(r.p.title+": پیوند این هدف با جهت‌گیری اصلی نیازمند توضیح و شواهد است.");
if(r.o&&r.z.baselineStatus!=="known")missing.push(r.p.title+": خط مبنا از داده واقعی شرکت استخراج نشده است.");
}
return{rs,complete,ready,missing,done:!!(s.theme&&s.review&&complete===4)};
}
function drawReport(){
const a=audit();
$("statusPill").textContent=a.done?(a.ready===4?"دارای اهداف عددی پیشنهادی":"کاربرگ آموزشی تکمیل‌شده"):"پیش‌نویس";
$("progressText").textContent=a.complete+" از ۴ منظر تکمیل‌شده";
$("readinessText").textContent="هدف عددی قابل محاسبه: "+a.ready+" از ۴ منظر";
$("toolProgress").style.width=((Number(!!s.theme)+Number(!!s.review)+a.complete)/6*100)+"%";
$("strategyMap").innerHTML='<div class="strategy-map-head"><strong>نقشه راهبردی پیشنهادی</strong><p>ارتباط میان اهداف، فرضیه‌ای است که باید در واقعیت سنجیده شود.</p></div><div class="map-theme">جهت‌گیری: '+esc(findName(themes,s.theme)||"تعیین نشده")+'</div><div class="map-chain">'+a.rs.map((r,i)=>'<div class="map-step"><small>'+esc(r.p.title)+'</small><strong>'+esc(r.o?.[1]||"هدف مشخص نشده")+'</strong><span>'+esc(r.p.tag)+'</span></div>'+(i<3?'<div class="map-arrow" aria-hidden="true">↓</div>':"")).join("")+'</div>';
const td=v=>'<td>'+esc(v)+'</td>';
$("scorecardRows").innerHTML=a.rs.map(r=>'<tr><th scope="row">'+esc(r.p.title)+'</th>'+td(r.o?.[1]||"—")+td(r.o?.[2]||"—")+td(r.base)+td(r.t.text+(r.z.horizon?" | "+(r.z.horizon==="1"?"یک ساله":"سه ساله"):""))+td(r.z.owner||"—")+td(r.initiative)+'</tr>').join("");
$("bscAudit").innerHTML='<h3>ممیزی طراحی و آمادگی اجرا</h3>'+(a.missing.length?'<ul>'+a.missing.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul>':'<p>اجزای این تمرین تکمیل شده‌اند. برای تبدیل آن به BSC رسمی، هدف‌ها و پیوندهای علت‌ومعلولی باید با مدیران و شواهد سازمانی تأیید شوند.</p>')+
'<p class="bsc-audit-foot">وضعیت ارقام: تنها بر اساس انتخاب یا ورود کاربر؛ هیچ داده واقعی شرکت به‌صورت خودکار خوانده نشده است.</p>';
}
document.addEventListener("change",e=>{
const t=e.target;
if(t.name==="bsc-theme"){s.theme=t.value;persist();drawAll();return;}
if(t.name==="bsc-role"){s.role=t.value;persist();return;}
if(t.name==="bsc-review"){s.review=t.value;persist();drawReport();return;}
if(t.dataset.bscField){
const [k,pid]=t.dataset.bscField.split("-"),z=s.parts[pid];if(!z)return;
if(k==="goal"&&z.goal!==t.value){z.initiative="";z.owner="";z.baseline="";z.actual="";}z[k]=t.value;
persist();drawCards();drawReport();return;
}
if(t.dataset.bscNumber){
const [k,pid]=t.dataset.bscNumber.split("-");s.parts[pid][k]=t.value;persist();drawCards();drawReport();
}
});
document.addEventListener("input",e=>{
const t=e.target;if(!t.dataset.bscNumber)return;
const [k,pid]=t.dataset.bscNumber.split("-");s.parts[pid][k]=t.value;persist();drawReport();
});
function htmlReport(){
const a=audit(),td=v=>'<td>'+esc(v)+'</td>';
const rows=a.rs.map(r=>'<tr><th>'+esc(r.p.title)+'</th>'+td(r.o?.[1]||"—")+td(r.o?.[2]||"—")+td(r.o?.[3]||"—")+td(r.base)+td(r.t.text)+td(r.z.horizon==="1"?"یک سال":"سه سال")+td(r.z.owner||"—")+td(r.initiative)+'</tr>').join("");
const map=a.rs.map((r,i)=>'<div class="item"><small>'+esc(r.p.title)+'</small><strong>'+esc(r.o?.[1]||"هدف تعیین نشده")+'</strong></div>'+(i===3?"":'<p style="text-align:center">↓</p>')).join("");
return '<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><title>گزارش BSC به‌پرور</title><style>body{font:14px/1.9 Tahoma,Arial,sans-serif;margin:24px;color:#132e5f}table{width:100%;border-collapse:collapse;font-size:12px}th,td{border:1px solid #cbd7e8;padding:8px;text-align:right;vertical-align:top}th{background:#eaf0fb}.item{padding:8px 13px;border:1px solid #b5c6df;border-radius:9px;max-width:500px;margin:auto}.item small,.item strong{display:block}.note{border-right:4px solid #bd1828;padding:10px;background:#f1f4fa}@media print{tr,.item{break-inside:avoid}body{margin:10mm}}</style></head><body><h1>کارت امتیازی متوازن پیشنهادی به‌پرور</h1><p>جهت‌گیری: <b>'+esc(findName(themes,s.theme)||"تعیین نشده")+'</b> | منظرهای تکمیل‌شده: '+a.complete+' از ۴ | بازنگری: '+esc(s.review==="quarter"?"سه‌ماهه":s.review==="half"?"شش‌ماهه":"تعیین نشده")+'</p><h2>نقشه راهبردی پیشنهادی</h2>'+map+'<h2>جدول اهداف، شاخص‌ها، اهداف عددی و ابتکارها</h2><table><thead><tr><th>منظر</th><th>هدف</th><th>شاخص</th><th>تعریف سنجش</th><th>خط مبنا</th><th>Target پیشنهادی</th><th>افق</th><th>متولی</th><th>ابتکار</th></tr></thead><tbody>'+rows+'</tbody></table><h2>موارد نیازمند بررسی</h2><ul>'+a.missing.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul><p class="note">این خروجی یک پیش‌نویس آموزشی است، نه کارت امتیازی مصوب شرکت. اهداف و اعداد باید با داده واقعی و تصمیم مدیران اعتبارسنجی شوند.</p><p>مبنای روش: balancedscorecard.org/bsc-basics-/</p></body></html>';
}
$("download").addEventListener("click",()=>{const blob=new Blob(["\uFEFF"+htmlReport()],{type:"text/html;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="Behparvar-BSC-Strategic-Report.html";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200);});
$("print").addEventListener("click",()=>window.print());
$("reset").addEventListener("click",()=>{if(!window.confirm("فقط اطلاعات کارت امتیازی متوازن پاک شود؟"))return;s=blank();persist();drawAll();});
drawAll();
})();