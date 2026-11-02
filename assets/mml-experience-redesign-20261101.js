/* Behparvar — visual learning experience v2, 2026-11-01.
 * Adds an accessible, clickable 3-domain competency map, 12 observable skills,
 * recognizable session/lesson icons, and a readable hierarchy.
 * No storage writes, route rewrites, or changes to course/assessment data. */
(function () {
  "use strict";
  var SESSIONS=[
  {emoji:"🧭",hint:"رهبری"},
  {emoji:"🧩",hint:"مدل شایستگی‌های مدیریتی"},
  {emoji:"🧠",hint:"شایستگی‌های معطوف به خود"},
  {emoji:"👥",hint:"شایستگی‌های معطوف به دیگران"},
  {emoji:"🎯",hint:"شایستگی‌های معطوف به نتایج کسب‌وکار"},
  {emoji:"🚀",hint:"مدیریت پیشرفته"}
];
  var SECTIONS=[
    {emoji:"🧩",title:"شروع"},
    {emoji:"🎭",title:"گفت‌وگوی کاری"},
    {emoji:"💡",title:"نکته مهم"},
    {emoji:"🛠️",title:"راه‌حل"},
    {emoji:"⚖️",title:"مقایسه دو روش"},
    {emoji:"🚦",title:"اشتباه رایج"},
    {emoji:"✅",title:"آزمون و اقدام"}
  ];
  /* Each item mirrors the 12 documented cross-cutting priorities; the
     session routes are learning entry points, not competency certifications. */
  var DOMAINS=[
    {id:"self",emoji:"🧠",name:"خودم",en:"Develop Self",tag:"۳ شایستگی",
      blurb:"رفتار خودم را می‌شناسم، مسئله را درست می‌فهمم و تصمیم سنجیده می‌گیرم.",
      skills:[
       ["خودآگاهی و خودمدیریتی","رفتار و واکنش خود را در موقعیت دشوار مشاهده و اصلاح می‌کنم.","یک نمونه بازاندیشی رفتاری و اقدام اصلاحی",1],
       ["حل مسئله و تحلیل علل","پیش از اقدام، علت را از نشانه جدا می‌کنم.","تعریف مسئله، بررسی علل و نتیجه تصمیم",3],
       ["قضاوت حرفه‌ای و تصمیم‌گیری","ریسک، حدود اختیار و پیامد انتخاب‌ها را بررسی می‌کنم.","تصمیم مستند همراه با فرض‌ها و محدودیت‌ها",3]
      ]},
    {id:"others",emoji:"👥",name:"دیگران",en:"Enable Others",tag:"۴ شایستگی",
      blurb:"گفت‌وگو می‌کنم، تعارض را مدیریت می‌کنم و رشد همکاران را ممکن می‌سازم.",
      skills:[
       ["ارتباط حمایتی و گوش‌دادن","به رفتار و مسئله مشخص می‌پردازم، نه قضاوت درباره شخصیت افراد.","یک گفت‌وگوی توصیفی و توافق بر گام بعد",4],
       ["مدیریت تعارض","نیازها و محدودیت‌های دو طرف را روشن و راه‌حل مشترک پیدا می‌کنم.","توافق اجرایی بدون نقض الزامات فنی",4],
       ["تفویض اختیار و توانمندسازی","نتیجه، اختیار و نقطه بازبینی را پیش از واگذاری روشن می‌کنم.","توافق تفویض با معیار تحویل",5],
       ["بازخورد و توسعه دیگران","با سؤال، تمرین و بازخورد یادگیری همکاران را حمایت می‌کنم.","برنامه توسعه با رفتار قابل مشاهده",5]
      ]},
    {id:"results",emoji:"🎯",name:"نتایج کسب‌وکار",en:"Improve the Business",tag:"۵ شایستگی",
      blurb:"برنامه را به عملکرد، هماهنگی بین واحدها و بهبود قابل‌سنجش تبدیل می‌کنم.",
      skills:[
       ["برنامه‌ریزی و سازماندهی","برای هدف، فعالیت، مسئول، منابع، زمان و معیار نتیجه مشخص می‌کنم.","برنامه اجرایی با مالک اقدام و پایش",2],
       ["هماهنگی بین‌واحدی","وابستگی واحدها را زود تشخیص می‌دهم و برای تحویل مشترک توافق می‌سازم.","توافق بین‌واحدی با تعهدات روشن",2],
       ["کنترل و مدیریت عملکرد","انحراف را با داده می‌سنجم و اقدام اصلاحی را پیگیری می‌کنم.","مقایسه Baseline، Target، Actual و Action",3],
       ["شناخت کسب‌وکار و زنجیره ارزش","اثر تصمیم واحد خود را بر سایر حلقه‌های زنجیره بررسی می‌کنم.","نقشه اثر تصمیم بر زنجیره ارزش",6],
       ["بهبود مستمر و مدیریت تغییر","یک تغییر کوچک را اجرا و اثر آن را قبل و بعد اندازه‌گیری می‌کنم.","Pilot با مالک اقدام، شاخص و نتیجه",6]
      ]}
  ];
  function elem(tag,cl,txt) {
    var el=document.createElement(tag);
    if(cl)el.className=cl;
    if(txt!==undefined)el.textContent=txt;
    return el;
  }
  function icon(txt,cl) {
    var x=elem("span",cl||"bp-emoji",txt);
    x.setAttribute("aria-hidden","true");
    return x;
  }
  function addCompetencyMap(){
    var hub=document.querySelector("#course .mml-hub");
    var sessions=hub&&hub.querySelector(".mml-session-area");
    if(!hub||!sessions||hub.querySelector(".bp-competency-map"))return;
    var section=elem("section","bp-competency-map");
    section.id="bp-competency-map";
    section.setAttribute("aria-labelledby","bp-competency-title");
    var heading=elem("div","bp-map-heading");
    var eyebrow=elem("p","bp-map-eyebrow","🧭 نقشه رشد مدیریتی به‌پرور");
    var title=elem("h2","bp-map-title","مدیریت از سه نقطه شروع می‌شود");
    title.id="bp-competency-title";
    var desc=elem("p","bp-map-lead","روی هر حوزه بزنید؛ شایستگی‌ها، رفتار مورد انتظار و جلسه مرتبط را ببینید.");
    heading.append(eyebrow,title,desc);
    var track=elem("div","bp-map-connector");
    track.setAttribute("aria-hidden","true");
    track.append(elem("span","bp-map-line"),elem("span","bp-map-dot"));
    var cards=elem("div","bp-domain-grid");
    cards.setAttribute("role","group");
    cards.setAttribute("aria-label","سه حوزه اصلی شایستگی");
    var panel=elem("div","bp-domain-details");
    panel.id="bp-domain-details";
    panel.hidden=true;
    var selected="";
    DOMAINS.forEach(function(d,n){
      var button=elem("button","bp-domain-card bp-domain-"+d.id);
      button.type="button";button.dataset.bpDomain=d.id;
      button.setAttribute("aria-controls",panel.id);
      button.setAttribute("aria-expanded","false");
      var top=elem("span","bp-domain-top");
      top.append(icon(d.emoji,"bp-domain-emoji"),elem("span","bp-domain-count",d.tag));
      var name=elem("strong","bp-domain-name",d.name);
      var en=elem("span","bp-domain-en",d.en);en.dir="ltr";
      var sub=elem("span","bp-domain-blurb",d.blurb);
      var cta=elem("span","bp-domain-cta","شایستگی‌ها را ببینید  ←");
      button.append(top,name,en,sub,cta);
      cards.append(button);
      button.addEventListener("click",function(){
        selected=selected===d.id?"":d.id;
        cards.querySelectorAll("button").forEach(function(b){
          var active=b.dataset.bpDomain===selected;
          b.classList.toggle("bp-selected",active);
          b.setAttribute("aria-expanded",String(active));
        });
        if(!selected){panel.hidden=true;panel.replaceChildren();return;}
        var current=DOMAINS.find(function(z){return z.id===selected});
        panel.replaceChildren();
        var phead=elem("div","bp-detail-heading");
        phead.append(icon(current.emoji,"bp-detail-emoji"));
        var pcopy=elem("div","bp-detail-title");
        pcopy.append(elem("h3","",current.name+"؛ از مفهوم تا رفتار"),elem("p","","برای تمرین هر شایستگی، جلسه مرتبط را باز کنید."));
        phead.append(pcopy);
        var close=elem("button","bp-detail-close","بستن ×");close.type="button";
        close.setAttribute("aria-label","بستن شایستگی‌های "+current.name);
        close.addEventListener("click",function(){button.click();button.focus()});
        phead.append(close);
        panel.append(phead);
        var skillGrid=elem("div","bp-skill-grid");
        current.skills.forEach(function(s,i){
          var skill=elem("article","bp-skill");
          var row=elem("div","bp-skill-heading");
          row.append(elem("span","bp-skill-number",(i+1).toLocaleString("fa-IR")),elem("h4","",s[0]));
          skill.append(row);
          skill.append(elem("p","bp-skill-behavior",s[1]));
          var evidence=elem("p","bp-skill-evidence");
          evidence.append(icon("✓","bp-evidence-symbol"),elem("strong","","شاهد عملکرد: "),document.createTextNode(s[2]));
          skill.append(evidence);
          var a=elem("a","bp-skill-link","📚 تمرین در جلسه "+s[3].toLocaleString("fa-IR")+" ←");
          a.href=s[3]===1?"#home":"#session"+s[3];
          a.setAttribute("data-open",s[3]===1?"home":"session"+s[3]);
          skill.append(a);skillGrid.append(skill);
        });
        panel.append(skillGrid);
        panel.hidden=false;
      });
    });
    section.append(heading,track,cards,panel);
    sessions.parentNode.insertBefore(section,sessions);
    var sessionHeading=sessions.querySelector(".mml-session-heading h2");
    if(sessionHeading)sessionHeading.textContent="📚 شش جلسه یادگیری کاربردی";
  }
  function refreshSessionIcons(){
    document.querySelectorAll("#course .course-session[data-course-session]").forEach(function(card){
      var index=Number(card.dataset.courseSession)-1;
      var data=SESSIONS[index];
      if(!data)return;
      var ico=card.querySelector(".mml-course-tile-icon");
      if(!ico)return;
      ico.textContent=data.emoji;
      ico.classList.add("bp-course-emoji");
      ico.setAttribute("aria-hidden","true");
      var number=card.querySelector(".course-session-number");
      if(number)number.setAttribute("aria-hidden","true");
    });
    document.querySelectorAll(".mml-simple-session-home").forEach(function(home){
      if(home.querySelector(".bp-session-kicker"))return;
      var where=home.querySelector(".mml-reader-where");
      var title=home.querySelector("h1");
      var m=where&&where.textContent.match(/جلسه\s+(اول|دوم|سوم|چهارم|پنجم|ششم)/);
      if(!m||!title)return;
      var words=["اول","دوم","سوم","چهارم","پنجم","ششم"];
      var i=words.indexOf(m[1]);
      if(i<0)return;
      var tag=elem("span","bp-session-kicker");
      tag.append(icon(SESSIONS[i].emoji,"bp-session-kicker-icon"),document.createTextNode("کارگاه "+(i+1).toLocaleString("fa-IR")+" از ۶"));
      title.parentNode.insertBefore(tag,title);
    });
  }
  function refreshLessonIcons(){
    document.querySelectorAll(".mml-reader-heading").forEach(function(header){
      if(header.querySelector(".bp-lesson-icon"))return;
      var h=header.querySelector("h2");
      if(!h)return;
      var index=SECTIONS.findIndex(function(s){return s.title===h.textContent.trim()});
      if(index<0)return;
      var badge=icon(SECTIONS[index].emoji,"bp-lesson-icon");
      header.insertBefore(badge,h);
      header.classList.add("bp-reader-heading");
    });
    document.querySelectorAll("#workshopNavigation > a").forEach(function(link,i){
      if(i>=SECTIONS.length||link.querySelector(".bp-nav-emoji"))return;
      var badge=icon(SECTIONS[i].emoji,"bp-nav-emoji");
      var label=link.querySelector(".sidebar-link-label");
      if(label)link.insertBefore(badge,label);
    });
    document.querySelectorAll(".mml-align-context > strong").forEach(function(el){
      if(el.querySelector(".bp-context-emoji"))return;
      el.prepend(icon("📍","bp-context-emoji"));
    });
    document.querySelectorAll(".mml-align-main .mml-align-skill > strong").forEach(function(el){
      if(el.querySelector(".bp-context-emoji"))return;
      el.prepend(icon("🎯","bp-context-emoji"));
    });
    document.querySelectorAll(".mml-simple-role-options button").forEach(function(button){
      if(button.querySelector(".bp-role-emoji"))return;
      var value=(button.textContent||"").trim();
      button.prepend(icon(value.includes("سرپرست")?"👷":"👔","bp-role-emoji"));
      button.classList.add("bp-role-button");
    });
  }
  function init(){
    if(!document.body.classList.contains("mml-refreshed"))return;
    addCompetencyMap();
    refreshSessionIcons();
    refreshLessonIcons();
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);
  else init();
})();