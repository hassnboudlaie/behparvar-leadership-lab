/* Behparvar MBTI mentor report v0.9 — narrative first, 16 types, evidence-aware, RTL.
   Interpretations are educational hypotheses; never classify competence or predict performance. */
"use strict";
const MENTOR=window.BEHPARVAR_MBTI_MENTOR_COPY||{};
const AXIS_SIMPLE={
 EI:{E:"در پاسخ‌های شما، تعامل با محیط و گفت‌وگو کمی پررنگ‌تر است.",I:"در پاسخ‌های شما، تأمل مستقل و فرصت فکرکردن کمی پررنگ‌تر است."},
 SN:{S:"در دریافت اطلاعات، مثال‌های واقعی و تجربه ملموس بیشتر توجهتان را جلب می‌کنند.",N:"در دریافت اطلاعات، الگوها و ارتباط میان ایده‌ها بیشتر توجهتان را جلب می‌کنند."},
 TF:{T:"در انتخاب‌ها، معیار منطقی و اصول مشترک برایتان پررنگ‌تر بوده‌اند.",F:"در انتخاب‌ها، ارزش‌ها و پیامد انسانی تصمیم برایتان پررنگ‌تر بوده‌اند."},
 JP:{J:"در شیوه کار، برنامه روشن و رسیدن به جمع‌بندی برایتان طبیعی‌تر بوده است.",P:"در شیوه کار، انعطاف و بازگذاشتن گزینه‌ها برایتان طبیعی‌تر بوده است."}
};
function renderExpandedProfile(code){
 const area=$("expandedProfile");area.replaceChildren();
 const m=MENTOR[code];
 if(!m){
  const p1=node("p","پاسخ‌های شما در یک یا چند بُعد، دو گرایش را تقریباً به یک اندازه نشان داده‌اند و در آن بُعد مجموع نمره دقیقاً برابر شده است.");
  const p2=node("p","این موضوع ایرادی در شخصیت شما نیست. فقط با این ۴۸ پاسخ نمی‌توان یک کد چهارحرفی کامل تعیین کرد. به‌جای انتخاب یک تیپ به‌صورت حدسی، می‌توانید چهار طیف پایین صفحه را بخوانید و ببینید کدام موقعیت‌ها به تجربه شما نزدیک‌ترند.");
  const narrative=node("div",undefined,"profile-narrative");narrative.append(p1,p2);area.append(narrative);
  const q=node("div",undefined,"mentor-question");q.append(node("strong","پرسشی برای تأمل"),node("span","کدام تفاوت در شیوه ارتباط و تصمیم‌گیری خودتان را در محیط کار بیشتر تجربه می‌کنید؟"));area.append(q);return;
 }
 const narrative=node("div",undefined,"profile-narrative");
 m.story.forEach(p=>narrative.append(node("p",p)));
 area.append(narrative);
 const highlights=node("div",undefined,"mentor-highlights");
 [["ظرفیتی که ممکن است در خودتان ببینید",m.gifts],["جایی که بهتر است کمی بیشتر مراقب باشید",m.watch]].forEach(([heading,copy])=>{
  if(!copy)return;
  const section=node("section",undefined,"mentor-highlight");
  section.append(node("h3",heading),node("p",copy));highlights.append(section);
 });
 area.append(highlights);
 const more=node("details",undefined,"mentor-more");
 more.append(node("summary","کمی بیشتر درباره سبک شما در محیط کار"));
 const grid=node("div",undefined,"profile-grid");
 const parts=[
  ["در ارتباط با دیگران",m.communication],
  ["هنگام تصمیم‌گیری",m.decision],
  ["در همکاری با تیم",m.team],
  ["وقتی شرایط تغییر می‌کند",m.change]
 ];
 parts.forEach(([label,body])=>{
  const item=node("section",undefined,"profile-detail");
  item.append(node("h3",label),node("p",body));grid.append(item);
 });
 more.append(grid);area.append(more);
 const prompt=node("div",undefined,"mentor-question");
 prompt.append(node("strong","یک سؤال برای فکرکردن"),node("span",m.question));
 area.append(prompt);
}
scenarioRender=function(code,role){
 const area=$("typeScenario");area.replaceChildren();
 const original=TYPE_INSIGHTS[code],p=EXPANDED[code],m=MENTOR[code];
 if(!original||!p||!m){
  area.append(node("p","برای این نوبت، ترکیب چهارحرفی کاملاً مشخص نشده است. می‌توانید بدون نسبت‌دادن رفتار به یک تیپ، در گفت‌وگوی بعدی یکی از ترجیحات چهارگانه را مشاهده و درباره‌اش تأمل کنید."));
  return;
 }
 const items=[
  ["فرض کنید",original.situation],
  ["ممکن است اولین نگاهتان این باشد",original.first.replace(/^شما\s*/,"")],
  ["پیشنهاد من برای "+(role==="manager"?"مدیریت":"سرپرستی"),p[role]]
 ];
 items.forEach(([label,body],i)=>{
  const line=node("div",undefined,"scenario-row"+(i===2?" next-step":""));
  line.append(node("strong",label),node("p",body));area.append(line);
 });
};
refreshRoleReflection=function(){
 if(!latestEvidence)return;
 const role=$("contextRole").value,code=AXES.map(a=>latestEvidence[a.id].letter).join("");
 scenarioRender(code,role);
 const ranked=AXES.map(a=>latestEvidence[a.id]).filter(d=>d.total!==0).sort((a,b)=>Math.abs(b.total)-Math.abs(a.total));
 const strongest=ranked[0];
 const tip=strongest?PRACTICE[strongest.axis.id][strongest.letter]:"برای یک گفت‌وگوی کاری، ابتدا روش ترجیحی خودتان را مشاهده و یادداشت کنید.";
 $("roleReflection").textContent="می‌توانید این تمرین را در یک گفت‌وگوی واقعی امتحان کنید: "+tip;
};
function upgradedReport(){
 latestEvidence=dimensionEvidence();
 const data=latestEvidence,code=AXES.map(a=>data[a.id].letter).join("");
 const complete=!code.includes("?"),m=complete?MENTOR[code]:null,p=complete?EXPANDED[code]:null;
 if(complete&&(!m||!p||!TYPE_INSIGHTS[code]))throw Error("توصیف این تیپ در بانک گزارش موجود نیست: "+code);
 $("type").textContent=code;
 $("heroTypeTitle").textContent=complete?m.name:"نتیجه یک یا چند بُعد هنوز مشخص نیست";
 $("heroSummary").textContent=complete?m.lead:"پاسخ‌های شما در یکی از چهار بُعد، ترجیح غالبی را نشان نمی‌دهند. این نتیجه را بدون حدس یا پرسش اضافی، همان‌طور که هست نمایش می‌دهیم.";
 $("reportHeading").textContent=demoMode?"نمونه‌ای از گزارش ترجیحات شخصیتی":"گزارش ترجیحات شخصیتی شما";
 $("reportStatus").textContent=demoMode?"نمونه نمایشی":"گزارش فردی";
 $("reportStatus").classList.toggle("sample",demoMode);
 $("sampleNote").hidden=!demoMode;$("exitDemo").hidden=!demoMode;
 $("heroTraits").replaceChildren();
 AXES.forEach(a=>{
  const d=data[a.id],label=d.letter==="?"?"نامشخص":STANDARD_TERMS[d.letter];
  $("heroTraits").append(node("span",(d.letter==="?"?a.a+"/"+a.b:d.letter)+" · "+label,"trait-chip"));
 });
 const ties=AXES.filter(a=>data[a.id].total===0).map(a=>a.title);
 const near=AXES.filter(a=>Math.abs(data[a.id].total)>0&&Math.abs(data[a.id].total)<=2).map(a=>a.title);
 $("typeNote").textContent=ties.length?"در «"+ties.join("» و «")+"» دو گرایش امتیاز برابر دارند؛ هیچ ترجیحی به‌جای شما انتخاب نشده است.":
  near.length?"در یک یا چند بُعد، پاسخ‌ها به میانه نزدیک‌اند؛ بهتر است توصیف تیپ را به‌عنوان نقطه شروع خودشناسی بخوانید.":"";
 renderExpandedProfile(code);
 scenarioRender(code,$("contextRole").value);
 const actionArea=$("typeActions");actionArea.replaceChildren();
 const tips=m?.suggestions||p?.actions||[
 "در یک گفت‌وگوی واقعی، ببینید هنگام شنیدن موضوع جدید ابتدا به اطلاعات ملموس توجه می‌کنید یا ارتباط‌های پنهان آن. تجربه‌تان را کوتاه یادداشت کنید.",
 "وقتی اختلاف‌نظر رخ می‌دهد، علاوه بر منطق تصمیم، از ارزش‌ها و نگرانی‌های طرف مقابل نیز بپرسید. شنیدن این تفاوت به فهم بهتر کمک می‌کند.",
 "در پایان یک جلسه، درباره زمان تصمیم‌گیری و پیگیری با دیگران توافق کنید. تفاوت در ترجیح برنامه‌ریزی می‌تواند با گفت‌وگو مدیریت شود."
 ];
 const list=node("ol");tips.forEach(t=>list.append(node("li",t)));actionArea.append(list);
 $("dimensions").replaceChildren();
 AXES.forEach((a,index)=>{
  const d=data[a.id],card=node("article",undefined,"dimension-card");
  const head=node("div",undefined,"dim-title");head.append(node("h3",a.title),node("span",(index+1).toLocaleString("fa-IR")+" از ۴","dim-index"));card.append(head);
  card.append(node("p",d.total===0?"دو گرایش امتیاز برابر دارند":("نزدیک‌تر به "+(d.total>0?a.nameA:a.nameB)),"dim-choice"));
  card.append(node("p",d.total===0?"جمع پاسخ‌ها به دو سمت برابر شده است؛ ممکن است انتخاب‌ها متفاوت بوده باشند.":AXIS_SIMPLE[a.id][d.letter],"dim-desc"));
  const poles=node("div",undefined,"dim-poles");poles.append(node("span",a.a+" · "+a.nameA),node("span",a.b+" · "+a.nameB));card.append(poles);
  const track=node("div",undefined,"dim-track");track.setAttribute("role","img");
  track.setAttribute("aria-label",a.title+": "+(d.total===0?"امتیاز دو سمت برابر است":"گرایش پاسخ‌ها به "+(d.total>0?a.nameA:a.nameB))+". نمودار درصد شخصیت را نشان نمی‌دهد.");
  const position=50+(d.total/24)*45;
  const fill=node("div",undefined,"dim-fill");fill.style.left=Math.min(50,position)+"%";fill.style.width=Math.abs(position-50)+"%";
  const marker=node("div",undefined,"dim-point");marker.style.left=position+"%";
  track.append(fill,marker);card.append(track);
  const evidence=node("details",undefined,"dim-evidence");
  evidence.append(node("summary","جزئیات بیشتر این بُعد"));
  const exact=Math.abs(d.total).toLocaleString("fa-IR"),numeric=d.total===0?"امتیاز خالص صفر است":("جمع امتیازهای این بُعد "+exact+" از حداکثر ۲۴ به سمت "+(d.total>0?a.nameA:a.nameB)+" است");
  evidence.append(node("p",numeric+"؛ این عدد درصد یا میزان توانایی شما نیست.","dim-meta"));
  const list=node("ol");
  if(d.total===0){
   d.rows.filter(x=>x.value>0).slice(0,1).forEach(x=>list.append(node("li","سؤال "+(x.i+1).toLocaleString("fa-IR")+": "+x.selected)));
   d.rows.filter(x=>x.value<0).slice(0,1).forEach(x=>list.append(node("li","سؤال "+(x.i+1).toLocaleString("fa-IR")+": "+x.selected)));
   if(!list.children.length)list.append(node("li","همه انتخاب‌های این بُعد میانی بوده‌اند."));
  }else{
   d.forward.slice(0,2).forEach(x=>list.append(node("li","سؤال "+(x.i+1).toLocaleString("fa-IR")+": "+x.selected)));
   if(d.counter.length){
    const x=d.counter[0];list.append(node("li","یک انتخاب متفاوت در سؤال "+(x.i+1).toLocaleString("fa-IR")+": "+x.selected));
   }
  }
  evidence.append(list);card.append(evidence);$("dimensions").append(card);
 });
 $("reportMathNote").textContent="هر بُعد از ۱۲ سؤال تشکیل می‌شود. امتیاز هر پاسخ از منفی ۲ تا مثبت ۲ است و امتیاز خالص هر بُعد از منفی ۲۴ تا مثبت ۲۴ تغییر می‌کند. صفر یعنی تساوی دو گرایش؛ در این حالت علامت «؟» در کد می‌آید. اگر یکی از جمع‌ها به صفر نزدیک باشد، این جهت‌گیری مرزی است و نباید به‌صورت برچسب قطعی تعبیر شود.";
 const flags=[];
 if(new Set(replies).size===1)flags.push("همه پاسخ‌ها با یک گزینه یکسان انتخاب شده‌اند.");
 if(started!==null&&(Date.now()-started)/1000<120)flags.push("زمان پاسخ‌دهی کمتر از دو دقیقه بوده است.");
 $("quality").textContent=flags.length?"نکته درباره پاسخ‌دهی: "+flags.join(" ")+" این موارد به‌تنهایی کیفیت پاسخ را تعیین نمی‌کنند.":"این پرسشنامه هنوز با داده واقعی برای روایی و پایایی اعتبارسنجی نشده است.";
 $("synthesis").replaceChildren();
 refreshRoleReflection();
 show("report");$("reportHeading").focus();
}
