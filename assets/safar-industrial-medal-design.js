/* Behparvar Session 4 | premium, restrained recognition seals.
   SVG output remains 900x1180 for existing PNG/PDF/SVG exporters.
   All ranking/eligibility/calculation logic is external and unchanged.
   Genuine Behparvar logo is taken from the existing app DOM. */
(()=>{"use strict";
const palettes={
 gold:{name:"زرین",title:"معمار ارتباط مؤثر",range:"۹۰+ کل، ۷۲+ آزمون",
  dark:"#9B713B",mid:"#D9B875",light:"#FFF1C7",rim:"#C8A261",glint:"#FBDF9F",ink:"#163E36"},
 silver:{name:"سیمین",title:"هماهنگ‌ساز گفت‌وگو",range:"۷۵+ کل، ۶۰+ آزمون",
  dark:"#607A80",mid:"#C2D0CF",light:"#F8FCF9",rim:"#A8BCBC",glint:"#E5F1EF",ink:"#173F38"},
 bronze:{name:"برنزی",title:"پایه‌گذار تعامل حرفه‌ای",range:"۶۰+ کل، ۴۴+ آزمون",
  dark:"#966746",mid:"#C89773",light:"#FFE2C6",rim:"#B88460",glint:"#EAB995",ink:"#183B33"}
};
const escape=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fa=x=>Number(x||0).toLocaleString("fa-IR");
const logo=()=>{const x=document.querySelector("#brandlogo")?.getAttribute("src")||"";return x.startsWith("data:image/png;base64,")?x:""};
function seal(type,opts={}){
 const p=palettes[type];if(!p)return"";
 const preview=!!opts.preview;
 const rawName=String(opts.name||"شرکت‌کننده به‌پرور").trim().slice(0,58);
 const name=preview?"":escape(rawName);
 const date=escape(opts.date||new Intl.DateTimeFormat("fa-IR",{year:"numeric",month:"long",day:"numeric"}).format(new Date()));
 const score=fa(opts.score);
 const role=opts.role==="managers"?"مدیران":"سرپرستان";
 const uid="sf4-luxe-"+type+"-"+(preview?"preview":"earned");
 const metal="url(#"+uid+"-metal)",base="url(#"+uid+"-base)",inner="url(#"+uid+"-inner)";
 const typeName=escape(p.name),genuine=logo();
 const font='font-family="Vazirmatn,Tahoma,Arial,sans-serif"';
 return '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1180" viewBox="0 0 900 1180" role="img" aria-label="نشان '+typeName+' سفر ارتباطات به‌پرور">'+
 '<defs>'+
 '<linearGradient id="'+uid+'-base" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0A2F2A"/><stop offset=".52" stop-color="#155145"/><stop offset="1" stop-color="#092E2A"/></linearGradient>'+
 '<linearGradient id="'+uid+'-metal" x1=".05" y1="0" x2=".93" y2="1"><stop stop-color="'+p.dark+'"/><stop offset=".25" stop-color="'+p.light+'"/><stop offset=".47" stop-color="'+p.mid+'"/><stop offset=".77" stop-color="'+p.dark+'"/><stop offset="1" stop-color="'+p.glint+'"/></linearGradient>'+
 '<radialGradient id="'+uid+'-inner" cx=".48" cy=".36" r=".8"><stop stop-color="#20594A"/><stop offset="1" stop-color="#10382F"/></radialGradient>'+
 '<filter id="'+uid+'-shadow" x="-30%" y="-30%" width="160%" height="175%"><feDropShadow dx="0" dy="22" stdDeviation="18" flood-color="#031F18" flood-opacity=".33"/></filter>'+
 '</defs>'+
 '<rect width="900" height="1180" rx="26" fill="'+base+'"/>'+
 '<rect x="30" y="29" width="840" height="1122" rx="21" fill="none" stroke="'+p.mid+'" stroke-width="2.4" opacity=".75"/>'+
 '<rect x="46" y="45" width="808" height="1090" rx="15" fill="none" stroke="'+p.light+'" stroke-width="1" opacity=".16"/>'+
 '<rect x="293" y="52" width="314" height="100" rx="18" fill="#FFFCF5"/>'+
 (genuine?'<image href="'+genuine+'" x="309" y="65" width="282" height="74" preserveAspectRatio="xMidYMid meet"/>':
 '<text x="450" y="116" text-anchor="middle" font-family="Tahoma,Arial" font-size="42" font-weight="bold" fill="#16453B">به‌پرور</text>')+
 '<text x="450" y="218" text-anchor="middle" direction="rtl" '+font+' font-weight="850" font-size="35" fill="#F8F7ED">سفر ارتباطات</text>'+
 '<path d="M328 249 H427 M473 249 H572" stroke="'+p.mid+'" stroke-width="2.3" opacity=".66"/>'+
 '<path d="M450 241 l8 8 -8 8 -8 -8Z" fill="'+p.glint+'"/>'+
 '<g filter="url(#'+uid+'-shadow)">'+
 '<circle cx="450" cy="497" r="198" fill="#0A302A" stroke="'+p.dark+'" stroke-width="3"/>'+
 '<circle cx="450" cy="497" r="184" fill="'+metal+'" stroke="'+p.light+'" stroke-width="3"/>'+
 '<circle cx="450" cy="497" r="163" fill="'+inner+'" stroke="'+p.dark+'" stroke-width="3"/>'+
 '<circle cx="450" cy="497" r="150" fill="none" stroke="'+p.light+'" stroke-width="2" opacity=".54"/>'+
 '<circle cx="450" cy="497" r="130" fill="none" stroke="'+p.mid+'" stroke-width="1.5" opacity=".22"/>'+
 '<path d="M342 488 A126 126 0 0 1 450 372" fill="none" stroke="'+p.light+'" stroke-width="3" opacity=".47"/>'+
 '<path d="M559 508 A126 126 0 0 1 453 623" fill="none" stroke="'+p.light+'" stroke-width="3" opacity=".32"/>'+
 '<g fill="none" stroke="'+p.light+'" stroke-width="9" stroke-linejoin="round" stroke-linecap="round">'+
 '<path d="M355 416 h125 a40 40 0 0 1 40 40 v43 a40 40 0 0 1 -40 40 h-51 l-41 36 7-36 h-40 a40 40 0 0 1 -40-40 v-43 a40 40 0 0 1 40-40Z"/>'+
 '<path d="M481 450 h60 a41 41 0 0 1 41 41 v35 a41 41 0 0 1 -41 41 h-18 l6 31 -39-31 h-9" opacity=".8"/>'+
 '</g>'+
 '<g fill="'+p.glint+'"><circle cx="383" cy="477" r="8"/><circle cx="422" cy="477" r="8"/><circle cx="461" cy="477" r="8"/></g>'+
 '</g>'+
 '<text x="450" y="769" text-anchor="middle" direction="rtl" '+font+' font-size="70" font-weight="900" fill="'+p.light+'">نشان '+typeName+'</text>'+
 (preview?"":'<text x="450" y="821" text-anchor="middle" direction="rtl" '+font+' font-size="27" font-weight="650" fill="#E9E7D7">'+escape(p.title)+'</text>')+
 (preview?
 '<path d="M260 875 H640" stroke="'+p.mid+'" opacity=".42"/>'+
 '<text x="450" y="982" text-anchor="middle" direction="rtl" '+font+' font-size="27" font-weight="650" fill="#DDE8D9">نمونه نشان</text>':
 '<rect x="129" y="865" width="642" height="111" rx="18" fill="#F9F8F1"/>'+
 '<text x="450" y="932" text-anchor="middle" direction="rtl" '+font+' font-size="'+(rawName.length>35?27:rawName.length>25?33:39)+'" font-weight="850" fill="#16483D">'+name+'</text>'+
 '<text x="637" y="1035" text-anchor="middle" direction="rtl" '+font+' font-size="27" font-weight="750" fill="#F5E7C6">'+score+' از ۱۰۰</text>'+
 '<text x="266" y="1035" text-anchor="middle" direction="rtl" '+font+' font-size="25" font-weight="650" fill="#DCE9E1">'+date+'</text>'+
 '<path d="M450 1009 V1050" stroke="'+p.mid+'" stroke-width="1" opacity=".53"/>'+
 '<text x="450" y="1089" text-anchor="middle" direction="rtl" '+font+' font-size="23" fill="#D5E4D9">جلسه چهارم · مسیر '+role+'</text>'
 )+
 '<text x="450" y="1122" text-anchor="middle" direction="rtl" '+font+' font-size="17" letter-spacing=".2" fill="#B9CDBF">نشان آموزشی به‌پرور</text>'+
 '</svg>';
}
window.BP_SAFAR_BADGE_DESIGN={seal,palettes};
})();
