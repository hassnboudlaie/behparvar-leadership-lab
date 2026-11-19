/* Behparvar · Signature Medals 2026: elegant, branded vector rewards; scoring unchanged. */
(()=>{"use strict";
const palettes={"gold":{"name":"زرین","title":"گفت‌وگوهایی که اثر می‌گذارند","dark":"#855C2A","mid":"#D5AB62","light":"#FFF4D5","rim":"#D6B06F","ink":"#1D355A","face":"#123C71","ribbon":"#A32443","edge":"#CC4359","story":["اثرِ گفت‌وگو را","در رفتارهای بعد از آن می‌بینیم."]},"silver":{"name":"سیمین","title":"شنیدن، سنجیدن، پیش رفتن","dark":"#536478","mid":"#BFCBDD","light":"#FFFFFF","rim":"#D7E2EF","ink":"#213C65","face":"#225B89","ribbon":"#1D598D","edge":"#5793C4","story":["وقتی بهتر می‌شنویم،","روشن‌تر تصمیم می‌گیریم."]},"bronze":{"name":"برنزی","title":"شروعِ یک گفت‌وگوی بهتر","dark":"#855239","mid":"#C99370","light":"#FFEBD8","rim":"#E7B58C","ink":"#1C474F","face":"#23616B","ribbon":"#24736A","edge":"#52A49A","story":["هر گفت‌وگوی بهتر،","از یک تصمیم کوچک آغاز می‌شود."]}};
const seal=function seal(type,opts={}){
 const p=palettes[type];if(!p)return"";
 const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const fa=n=>Number(n||0).toLocaleString("fa-IR");
 const copy=window.BP_SAFAR_RECOGNITION_COPY?.medals?.[type]||{};
 const preview=!!opts.preview,name=esc(String(opts.name||"شرکت‌کننده به‌پرور").trim().slice(0,56));
 const date=esc(String(opts.date||new Intl.DateTimeFormat("fa-IR",{year:"numeric",month:"long",day:"numeric"}).format(new Date())));
 const src=document.querySelector("#brandlogo")?.getAttribute("src")||"";
 const logo=src.startsWith("data:image/png;base64,")?src:"";
 const id="bp-signature-medal-"+type+"-"+(preview?"preview":"personal");
 const font='font-family="Vazirmatn,Tahoma,Arial,sans-serif"';
 const ticks=Array.from({length:24},(_,i)=>{
  const a=i*Math.PI/12,ri=194,ro=i%3===0?207:199;
  return `<path d="M${(450+ri*Math.sin(a)).toFixed(1)} ${(500-ri*Math.cos(a)).toFixed(1)}L${(450+ro*Math.sin(a)).toFixed(1)} ${(500-ro*Math.cos(a)).toFixed(1)}" stroke="${p.light}" stroke-width="${i%3===0?2.2:1.2}" opacity="${i%3===0?.68:.35}"/>`;
 }).join("");
 const bottom=preview?
 `<rect x="296" y="1048" width="308" height="58" rx="15" fill="#E9EDF5" opacity=".14" stroke="${p.mid}" stroke-width="1.4"/>
 <text x="450" y="1087" text-anchor="middle" direction="rtl" ${font} font-size="25" fill="#F3F5FA">پیش‌نمایش طراحی</text>`:
 `<rect x="99" y="1035" width="702" height="82" rx="16" fill="#FFFEFB" stroke="${p.mid}" stroke-width="2"/>
 <text x="450" y="1086" text-anchor="middle" direction="rtl" ${font} font-size="${name.length>34?27:name.length>23?33:40}" font-weight="800" fill="#173964">${name}</text>
 <text x="450" y="1148" text-anchor="middle" direction="rtl" ${font} font-size="22" fill="#F4F6FB">${fa(opts.score)} امتیاز از ۱۰۰ · ${date}</text>`;
 return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1180" viewBox="0 0 900 1180" role="img" aria-label="مدال ${esc(p.name)} به‌پرور">
 <defs>
 <linearGradient id="${id}-back" x1="0%" y1="0%" x2="100%" y2="100%"><stop stop-color="#0B1D37"/><stop offset=".55" stop-color="#163B6B"/><stop offset="1" stop-color="#0C203C"/></linearGradient>
 <linearGradient id="${id}-metal" x1="8%" y1="5%" x2="92%" y2="95%"><stop stop-color="${p.dark}"/><stop offset=".18" stop-color="${p.light}"/><stop offset=".40" stop-color="${p.mid}"/><stop offset=".61" stop-color="${p.dark}"/><stop offset=".84" stop-color="${p.light}"/><stop offset="1" stop-color="${p.mid}"/></linearGradient>
 <radialGradient id="${id}-face" cx="35%" cy="23%" r="85%"><stop stop-color="${p.face}"/><stop offset=".74" stop-color="${p.face}"/><stop offset="1" stop-color="${p.ink}"/></radialGradient>
 <linearGradient id="${id}-ribbon" x1="10%" y1="0%" x2="90%" y2="100%"><stop stop-color="${p.edge}"/><stop offset=".52" stop-color="${p.ribbon}"/><stop offset="1" stop-color="${p.ink}"/></linearGradient>
 <filter id="${id}-shade" x="-32%" y="-32%" width="164%" height="164%"><feDropShadow dx="0" dy="10" stdDeviation="11" flood-color="#020D20" flood-opacity=".34"/></filter>
 </defs>
 <rect width="900" height="1180" rx="25" fill="url(#${id}-back)"/>
 <rect x="23" y="23" width="854" height="1134" rx="18" fill="none" stroke="${p.mid}" stroke-width="2" opacity=".66"/>
 <rect x="38" y="38" width="824" height="1104" rx="12" fill="none" stroke="${p.light}" stroke-width=".85" opacity=".23"/>
 <path d="M66 126V66H126M774 66H834V126M66 1054V1114H126M774 1114H834V1054" fill="none" stroke="${p.mid}" stroke-width="3" opacity=".7"/>
 <rect x="290" y="59" width="320" height="100" rx="15" fill="#FFFEFB" stroke="${p.mid}" stroke-width="2.6"/>
 ${logo?`<image href="${logo}" x="310" y="76" width="280" height="68" preserveAspectRatio="xMidYMid meet"/>`:`<text x="450" y="118" text-anchor="middle" direction="rtl" ${font} font-size="46" font-weight="900" fill="#183F76">به‌پرور</text>`}
 <text x="450" y="213" text-anchor="middle" direction="rtl" ${font} font-size="29" font-weight="750" fill="#F1F3F9">سفر شایستگی‌های ارتباطی</text>
 <path d="M290 244H420M480 244H610" stroke="${p.mid}" stroke-width="1.6" opacity=".76"/><circle cx="450" cy="244" r="5" fill="${p.light}"/>
 <g filter="url(#${id}-shade)">
 <path d="M349 258H427L464 375 429 492 332 292Z" fill="url(#${id}-ribbon)" stroke="${p.mid}" stroke-width="4"/>
 <path d="M474 258H551L570 292 472 492 436 375Z" fill="url(#${id}-ribbon)" stroke="${p.mid}" stroke-width="4"/>
 <path d="M372 267H401L457 383 443 422ZM501 267H526L456 422 442 384Z" fill="${p.light}" opacity=".2"/>
 <path d="M334 642L418 684 401 790 365 758 317 782Z M482 684L566 642 583 782 535 758 499 790Z" fill="url(#${id}-ribbon)" stroke="${p.mid}" stroke-width="3.5"/>
 <circle cx="450" cy="500" r="235" fill="${p.dark}" stroke="${p.light}" stroke-width="3.2"/>
 <circle cx="450" cy="500" r="224" fill="url(#${id}-metal)" stroke="${p.light}" stroke-width="2.4"/>
 <circle cx="450" cy="500" r="211" fill="url(#${id}-face)" stroke="${p.dark}" stroke-width="5"/>
 <circle cx="450" cy="500" r="195" fill="none" stroke="${p.light}" stroke-width="1.8" opacity=".75"/>
 ${ticks}
 <path d="M325 414C365 360 411 341 450 348C495 344 542 366 578 414" fill="none" stroke="${p.light}" stroke-width="3" opacity=".3"/>
 <path d="M342 581C395 637 499 642 557 581" fill="none" stroke="${p.light}" stroke-width="2.4" opacity=".29"/>
 <path d="M321 465Q321 425 361 425H473Q513 425 513 465V500Q513 529 480 529H409L374 552V529H362Q321 529 321 493Z" fill="${p.ink}" stroke="${p.light}" stroke-width="7"/>
 <path d="M436 476Q436 447 469 447H534Q568 447 568 481V517Q568 542 541 542H514L537 568 488 543H470Q436 543 436 515Z" fill="${p.face}" stroke="${p.mid}" stroke-width="7"/>
 <circle cx="383" cy="481" r="8" fill="${p.light}"/><circle cx="416" cy="481" r="8" fill="${p.light}"/>
 <path d="M480 505L499 521 529 488" fill="none" stroke="${p.light}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
 </g>
 <path d="M311 767H418M482 767H589" stroke="${p.mid}" stroke-width="2" opacity=".72"/><path d="M450 756L461 767 450 778 439 767Z" fill="${p.light}"/>
 <text x="450" y="846" text-anchor="middle" direction="rtl" ${font} font-size="77" font-weight="900" fill="${p.light}">مدال ${esc(p.name)}</text>
 <text x="450" y="902" text-anchor="middle" direction="rtl" ${font} font-size="33" font-weight="780" fill="#FAFAFE">${esc(copy.title||p.title)}</text>
 <rect x="125" y="932" width="650" height="79" rx="15" fill="#071B34" opacity=".75" stroke="${p.mid}" stroke-width="1.2"/>
 <text x="450" y="966" text-anchor="middle" direction="rtl" ${font} font-size="23" font-weight="600" fill="#E2EAF5">${esc(p.story[0])}</text>
 <text x="450" y="995" text-anchor="middle" direction="rtl" ${font} font-size="23" font-weight="600" fill="#E2EAF5">${esc(p.story[1])}</text>
 ${bottom}
 </svg>`;
};
window.BP_SAFAR_BADGE_DESIGN={seal,palettes};
})();
