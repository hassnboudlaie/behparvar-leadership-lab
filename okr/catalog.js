const connectorCatalog = [
  [
    "API",
    "api"
  ],
  [
    "Asana",
    "progress"
  ],
  [
    "Azure AD / Entra ID",
    "identity"
  ],
  [
    "Azure DevOps",
    "progress"
  ],
  [
    "BambooHR",
    "hr"
  ],
  [
    "ChatGPT",
    "ai"
  ],
  [
    "Claude",
    "ai"
  ],
  [
    "Excel Online",
    "progress"
  ],
  [
    "Google Calendar",
    "calendar"
  ],
  [
    "Google Sheets",
    "progress"
  ],
  [
    "HubSpot",
    "progress"
  ],
  [
    "Factorial",
    "hr"
  ],
  [
    "HubSpot (Legacy)",
    "progress"
  ],
  [
    "Jira",
    "progress"
  ],
  [
    "Linear",
    "progress"
  ],
  [
    "Looker",
    "progress"
  ],
  [
    "MCP",
    "ai"
  ],
  [
    "Microsoft Copilot",
    "ai"
  ],
  [
    "Microsoft Outlook",
    "calendar"
  ],
  [
    "Microsoft Planner",
    "progress"
  ],
  [
    "Microsoft Power BI",
    "progress"
  ],
  [
    "Microsoft Teams",
    "general"
  ],
  [
    "Monday.com",
    "progress"
  ],
  [
    "Okta",
    "identity"
  ],
  [
    "OneLogin",
    "identity"
  ],
  [
    "Perplexity",
    "ai"
  ],
  [
    "SCIM",
    "hr"
  ],
  [
    "SSO",
    "identity"
  ],
  [
    "Salesforce",
    "progress"
  ],
  [
    "Slack",
    "general"
  ],
  [
    "Snowflake",
    "progress"
  ],
  [
    "Tableau",
    "progress"
  ],
  [
    "Trello",
    "progress"
  ],
  [
    "Zapier",
    "general"
  ]
];
const connectorKinds = {
 api:['رابط برنامه‌نویسی','تبادل داده با سامانه‌های سازمان'],
 progress:['پیشرفت','به‌روزرسانی پیشرفت اهداف از داده‌های ابزار'],
 identity:['هویت و دسترسی','اتصال هویت سازمانی و مدیریت دسترسی کاربران'],
 hr:['منابع انسانی','همگام‌سازی اعضا و تیم‌های سازمان'],
 ai:['هوش مصنوعی','پرسش درباره اهداف و شاخص‌های مجاز کاربر'],
 calendar:['تقویم','هماهنگ‌سازی زمان جلسات'],
 general:['همکاری','ارتباط فضای کاری تیم با اهداف سازمان']
};
function connectorPage(){
 const cards=connectorCatalog.map(([name,kind],index)=>{
   const [tag,info]=connectorKinds[kind];
   return '<article class="connector"><header><b dir="ltr">'+esc(name)+'</b></header><p>'+info+'</p><small>'+tag+'</small><button data-act="connector:'+index+'">مشاهده جزئیات</button><footer>وضعیت اتصال <b>متصل نیست</b></footer></article>';
 }).join('');
 return heading('یکپارچه‌سازی‌ها','')+'<input type="search" aria-label="جست‌وجوی اتصال" id="connector-search" placeholder="جست‌وجوی اتصال…"><div class="connectors">'+cards+'</div>';
}
document.addEventListener('input',e=>{
 if(e.target.id==='connector-search'){
  const q=e.target.value.trim().toLowerCase();
  document.querySelectorAll('.connector').forEach(card=>card.hidden=!card.textContent.toLowerCase().includes(q));
 }
});
function connectorDetail(index){
 const entry=connectorCatalog[index];if(!entry)return;
 const [name,kind]=entry,[tag,info]=connectorKinds[kind];
 modal(esc(name),'<p>'+info+'</p><p>'+tag+'</p><p>اتصال برقرار نشده است. راه‌اندازی به پیکربندی سمت سرور و مجوز دسترسی سازمان به این سرویس نیاز دارد.</p>');
}
