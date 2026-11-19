/* Behparvar educational MBTI-style report renderer v0.8. All conclusions are descriptive hypotheses, never hiring/performance judgments. */
"use strict";
function renderExpandedProfile(code){
 const area=$("expandedProfile");area.replaceChildren();
 const profile=EXPANDED[code];
 if(!profile){
  area.append(node("p","در یک یا چند بُعد، پاسخ‌های شما امتیاز کاملاً برابر داده‌اند. بدون افزودن پرسش یا تحمیل یک ترجیح، نمی‌توان یک پروفایل اختصاصی از ۱۶ تیپ را به‌عنوان نتیجه فردی ارائه کرد.","profile-intro"));
  area.append(node("p","در عوض، چهار طیف و شواهد هر بُعد را بررسی کنید. برای توسعه ارتباطی، تمرین‌های عمومی مبتنی بر رفتار قابل‌مشاهده همچنان قابل استفاده‌اند."));
  return;
 }
 const narrative=node("div",undefined,"profile-narrative");
 profile.identity.forEach(paragraph=>narrative.append(node("p",paragraph)));area.append(narrative);
 const grid=node("div",undefined,"profile-grid");
 const sections=[
  ["ظرفیت‌ها و نقاط قوت احتمالی",profile.strength],
  ["سبک ارتباط و تعامل",profile.communication],
  ["موقعیت‌های نیازمند توجه",profile.watchout],
  ["نمونه کاربردی برای مدیران",profile.manager],
  ["نمونه کاربردی برای سرپرستان",profile.supervisor]
 ];
 sections.forEach(([heading,body])=>{
  const card=node("article",undefined,"profile-detail");
  card.append(node("h3",heading),node("p",body));grid.append(card);
 });
 area.append(grid);
}
scenarioRender=function(code,role){
 const area=$("typeScenario");if(!area)return;area.replaceChildren();
 const info=TYPE_INSIGHTS[code],profile=EXPANDED[code];
 if(!info||!profile){
  area.append(node("p","در یک یا چند بُعد امتیازها برابرند؛ در نتیجه نسبت‌دادن یک واکنش یا توصیه اختصاصی به تیپ چهارحرفی مشخص، مبنای کافی ندارد. موقعیت‌های کاری را بدون برچسب قطعی می‌توان بررسی کرد."));
  return;
 }
 const rows=[
  ["وضعیت فرضی","فرض کنید: "+info.situation],
  ["واکنش احتمالی",info.first],
  ["چه چیزی ممکن است از توجه دور بماند؟",info.risk],
  ["اقدام پیشنهادی برای "+(role==="manager"?"مدیر":"سرپرست"),profile[role]]
 ];
 rows.forEach(([heading,body],i)=>{
  const wrap=node("div",undefined,"scenario-row"+(i===3?" next-step":""));
  wrap.append(node("strong",heading),node("p",body));area.append(wrap);
 });
};
function upgradedReport(){
 latestEvidence=dimensionEvidence();
 const data=latestEvidence,code=AXES.map(a=>data[a.id].letter).join("");
 const complete=!code.includes("?");
 const insight=complete?TYPE_INSIGHTS[code]:null;
 const profile=complete?EXPANDED[code]:null;
 if(complete&&(!TYPE_DETAILS[code]||!TYPE_PROFILES[code]||!profile||!insight))
  throw Error("توصیف تیپ در اطلاعات برنامه موجود نیست: "+code);
 $("type").textContent=code;
 $("heroTypeTitle").textContent=complete?(insight.title+" · "+code):"در یک یا چند بُعد، ترجیح غالب مشخص نیست";
 $("heroSummary").textContent=complete?profile.identity[0]:
  "جمع پاسخ‌های یک یا چند بُعد، دو ترجیح را به صورت برابر نشان می‌دهد. بدون سؤال تکمیلی یا حدس، امکان تعیین کد کامل چهارحرفی وجود ندارد. علامت سؤال در کد، نشانگر همین عدم‌قطعیت است.";
 $("reportHeading").textContent=demoMode?"نمونه گزارش ترجیحات شخصیتی":"نقشه ترجیحات شخصیتی شما";
 $("reportStatus").textContent=demoMode?"نمونه نمایشی · پاسخ‌های فرضی":"گزارش فردی · ۴۸ پاسخ";
 $("reportStatus").classList.toggle("sample",demoMode);
 $("sampleNote").hidden=!demoMode;
 $("exitDemo").hidden=!demoMode;
 $("typeDirectory").replaceChildren();
 for(const otherCode of Object.keys(TYPE_INSIGHTS)){
  const item=node("div",undefined,"type-entry"+(otherCode===code?" active":""));
  item.append(node("b",otherCode),node("span",otherCode.split("").map(l=>STANDARD_TERMS[l]).join(" · ")));
  if(otherCode===code)item.setAttribute("aria-current","true");
  $("typeDirectory").append(item);
 }
 $("heroTraits").replaceChildren();
 for(const a of AXES){
  const d=data[a.id];
  const label=d.letter==="?"?"بدون جهت غالب":STANDARD_TERMS[d.letter];
  $("heroTraits").append(node("span",(d.letter==="?"?a.a+"/"+a.b:d.letter)+" · "+label,"trait-chip"));
 }
 const ties=AXES.filter(a=>data[a.id].total===0).map(a=>a.title);
 const near=AXES.filter(a=>Math.abs(data[a.id].total)>0&&Math.abs(data[a.id].total)<=2).map(a=>a.title);
 const notes=[];
 if(ties.length)notes.push("در بُعد «"+ties.join("» و «")+"» دو ترجیح امتیاز مساوی دارند؛ حرف آن بُعد تعیین نشده است.");
 if(near.length)notes.push("در بُعد «"+near.join("» و «")+"» نتیجه نزدیک میانه است و نسبت به تغییر پاسخ حساس است.");
 $("typeNote").textContent=notes.length?notes.join(" "):
  "کد نمایش‌داده‌شده جهت غالب پاسخ‌های همین نوبت را خلاصه می‌کند؛ نه توانایی، کیفیت کار یا ویژگی تغییرناپذیر فرد.";
 $("reportMathNote").textContent="هر بُعد شامل ۱۲ سؤال است. برای هر پاسخ، با توجه به جهت گزینه انتخابی، امتیازی بین منفی ۲ تا مثبت ۲ ثبت می‌شود و جمع هر بُعد در بازه منفی ۲۴ تا مثبت ۲۴ قرار می‌گیرد. اگر جمع صفر باشد، کد همان بُعد با «؟» نمایش داده می‌شود؛ برای تعیین آن هیچ سؤال مستقیم یا وزن اضافی اعمال نمی‌شود. امتیازها درصد شخصیت یا نمره هنجاری نیستند.";
 $("typeOverview").textContent=complete?
  "این الگوی ترجیح از "+AXES.map(a=>STANDARD_TERMS[data[a.id].letter]+" ("+data[a.id].letter+")").join("، ")+" تشکیل می‌شود. چهار حرف درباره جهت‌گیری ترجیحی‌اند و توانایی، هوش، شایستگی یا عملکرد را نمی‌سنجند.":
  "یک یا چند بُعد در پاسخ‌ها مساوی شده‌اند؛ بنابراین کد کامل چهارحرفی تعیین نمی‌شود. برای فهم پاسخ‌ها، چهار طیف و شواهد واقعی انتخاب‌های خود را بررسی کنید.";
 const communication=$("typeCommunication");communication.replaceChildren();
 AXES.forEach(a=>{
  const d=data[a.id],p=node("p");
  p.append(node("strong",a.title+": "),document.createTextNode(d.letter==="?"?"بدون ترجیح غالب در این نوبت":d.letter+" — "+STANDARD_TERMS[d.letter]));
  communication.append(p);
 });
 renderExpandedProfile(code);
 scenarioRender(code,$("contextRole").value);
 const actions=$("typeActions");actions.replaceChildren();
 const actionList=node("ol");
 const suggestions=profile?.actions||[
  "در یک موقعیت واقعی، شیوه دریافت اطلاعات و تصمیم‌گیری خود را مشاهده و با یک مثال دقیق ثبت کنید. هیچ نیازی به تحمیل تیپ قطعی نیست.",
  "در گفت‌وگوی بعدی درباره ترجیح همکار در دریافت اطلاعات و زمان تصمیم‌گیری سؤال بپرسید. تفاوت سبک لزوماً نشانه ضعف نیست.",
  "برای یک رفتار ارتباطی قابل‌مشاهده هدف کوچک تعیین کنید و بعد از اجرا بازخورد بگیرید. توسعه مهارت به برچسب شخصیتی وابسته نیست."
 ];
 suggestions.forEach(t=>actionList.append(node("li",t)));actions.append(actionList);
 $("dimensions").replaceChildren();
 AXES.forEach((a,index)=>{
  const d=data[a.id],card=node("article",undefined,"dimension-card");
  const heading=node("div",undefined,"dim-title");
  heading.append(node("h3",a.title),node("span",("۰"+(index+1)).slice(-2)+" / ۰۴","dim-index"));
  card.append(heading);
  card.append(node("p",d.total===0?"دو ترجیح امتیاز مساوی دارند":(d.total>0?a.nameA:a.nameB),"dim-choice"));
  card.append(node("p",d.total===0?
   "در این نوبت، جمع پاسخ‌های شما جهت غالبی را نشان نمی‌دهد؛ تعیین قطعی ترجیح این بُعد ممکن نیست.":
   (d.total>0?a.aText:a.bText),"dim-desc"));
  const poles=node("div",undefined,"dim-poles");
  poles.append(node("span",a.a+" · "+a.nameA),node("span",a.b+" · "+a.nameB));
  card.append(poles);
  const track=node("div",undefined,"dim-track");track.setAttribute("role","img");
  track.setAttribute("aria-label",a.title+": جمع امتیاز "+d.total+" از منفی ۲۴ تا مثبت ۲۴؛ این عدد درصد شخصیت نیست.");
  const position=50+(d.total/24)*45;
  const fill=node("div",undefined,"dim-fill");
  fill.style.left=Math.min(50,position)+"%";fill.style.width=Math.abs(position-50)+"%";
  const dot=node("div",undefined,"dim-point");dot.style.left=position+"%";
  track.append(fill,dot);card.append(track);
  const faNum=n=>Math.abs(n).toLocaleString("fa-IR");
  const score=d.total===0?"امتیاز خالص این بُعد: صفر (دو سوی ترجیح برابرند)":
   "امتیاز خالص به سوی "+(d.total>0?a.nameA:a.nameB)+": "+faNum(d.total)+" از حداکثر ۲۴"+(Math.abs(d.total)<=2?" · نتیجه مرزی":"");
  card.append(node("p",score,"dim-meta"));
  const evidence=node("details",undefined,"dim-evidence");
  evidence.append(node("summary","مشاهده شواهد پاسخ‌های این بُعد"));
  const list=node("ol");
  if(d.total===0){
   d.rows.filter(r=>r.value>0).slice(0,1).forEach(r=>list.append(node("li","سؤال "+(r.i+1)+": "+r.selected)));
   d.rows.filter(r=>r.value<0).slice(0,1).forEach(r=>list.append(node("li","سؤال "+(r.i+1)+": "+r.selected)));
   if(!list.children.length)list.append(node("li","همه پاسخ‌های این بُعد در حالت میانی ثبت شده‌اند."));
  }else{
   d.forward.slice(0,2).forEach(r=>list.append(node("li","سؤال "+(r.i+1)+": "+r.selected)));
   if(d.counter.length)list.append(node("li","یک پاسخ با جهت متفاوت، سؤال "+(d.counter[0].i+1)+": "+d.counter[0].selected));
  }
  evidence.append(list);card.append(evidence);$("dimensions").append(card);
 });
 const flags=[];
 if(new Set(replies).size===1)flags.push("همه پاسخ‌ها با یک گزینه یکسان ثبت شده‌اند.");
 if(started!==null&&(Date.now()-started)/1000<120)flags.push("زمان پاسخ‌دهی کمتر از دو دقیقه بوده است.");
 $("quality").textContent=flags.length?
  "نکته درباره کیفیت پاسخ‌ها: "+flags.join(" ")+" این نشانه‌ها به‌تنهایی کیفیت پاسخ‌دهی را تعیین نمی‌کنند.":
  "تکمیل ۴۸ سؤال، به‌معنای تأیید روایی، پایایی یا دقت روان‌سنجی این پرسشنامه اختصاصی نیست.";
 const synthesis=$("synthesis");synthesis.replaceChildren();
 synthesis.append(node("p","پرسش تأملی: کدام بخش این گزارش با تجربه واقعی شما سازگارتر است و برای بررسی آن چه مثال مشخصی از محیط کار دارید؟"));
 refreshRoleReflection();
 show("report");$("reportHeading").focus();
}
