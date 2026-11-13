/* Behparvar | precision minted executive medallions, 900 x 1180.
   SVG design only; award thresholds, PDF/PNG/SVG pipeline unchanged. */
(()=>{"use strict";
const palettes={
 gold:{name:"زرین",title:"تمایز در ارتباط حرفه‌ای",dark:"#956C33",mid:"#D7B26B",light:"#FFF0C5",rim:"#D0A85C",glint:"#F8DC9C",ink:"#183C34"},
 silver:{name:"سیمین",title:"تسلط بر گفت‌وگوی حرفه‌ای",dark:"#607A80",mid:"#B9C9CB",light:"#F5FAF9",rim:"#B1C9C9",glint:"#E7F0ED",ink:"#183C34"},
 bronze:{name:"برنزی",title:"پایه‌گذاری تعامل مؤثر",dark:"#875C42",mid:"#C5916B",light:"#FFE2C4",rim:"#BD845D",glint:"#F1C8A4",ink:"#183C34"}
};
const escape=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fa=n=>Number(n||0).toLocaleString("fa-IR");
function seal(type,opts={}){
 const p=palettes[type];if(!p)return"";
 const preview=!!opts.preview,name=String(opts.name||"شرکت‌کننده به‌پرور").trim().slice(0,56);
 const date=String(opts.date||new Intl.DateTimeFormat("fa-IR",{year:"numeric",month:"long",day:"numeric"}).format(new Date()));
 const src=document.querySelector("#brandlogo")?.getAttribute("src")||"";
 const logo=src.startsWith("data:image/png;base64,")?src:"";
 const id="sf-mint-"+type+"-"+(preview?"preview":"earned"),met="url(#"+id+"-metal)",bg="url(#"+id+"-bg)",face="url(#"+id+"-face)";
 const font='font-family="Vazirmatn,Tahoma,Arial,sans-serif"';
 const score=fa(opts.score),kind=escape(p.name);
 const ticks=Array.from({length:40},(_,i)=>{
  const angle=i*Math.PI/20,ri=i%5===0?184:188,ro=194;
  return '<path d="M'+(450+ri*Math.sin(angle)).toFixed(1)+' '+(469-ri*Math.cos(angle)).toFixed(1)+
   'L'+(450+ro*Math.sin(angle)).toFixed(1)+' '+(469-ro*Math.cos(angle)).toFixed(1)+
   '" stroke="'+p.light+'" stroke-width="'+(i%5===0?2.3:1)+'" opacity="'+(i%5===0?".68":".32")+'"/>';
 }).join("");
 const plaque=preview?'<path d="M330 952H570" stroke="'+p.mid+'" opacity=".48"/>'+
 '<text x="450" y="1014" text-anchor="middle" direction="rtl" '+font+' font-size="25" fill="#C3D5CB">نمونه نشان</text>':
 '<rect x="125" y="945" width="650" height="105" rx="15" fill="#F7F6ED"/>'+
 '<text x="450" y="1007" text-anchor="middle" direction="rtl" '+font+' font-size="'+(name.length>34?"28":name.length>24?"33":"40")+'" font-weight="850" fill="#124B3E">'+escape(name)+'</text>'+
 '<text x="450" y="1098" text-anchor="middle" direction="rtl" '+font+' font-size="24" fill="#E7E4CB">'+score+' امتیاز از ۱۰۰ · '+escape(date)+'</text>';
 return '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1180" viewBox="0 0 900 1180" role="img" aria-label="نشان '+kind+' سفر ارتباطات به‌پرور">'+
 '<defs><linearGradient id="'+id+'-bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0A3029"/><stop offset=".54" stop-color="#145549"/><stop offset="1" stop-color="#092D28"/></linearGradient>'+
 '<linearGradient id="'+id+'-metal" x1=".12" y1=".03" x2=".89" y2="1"><stop stop-color="'+p.dark+'"/><stop offset=".19" stop-color="'+p.light+'"/><stop offset=".42" stop-color="'+p.mid+'"/><stop offset=".67" stop-color="'+p.dark+'"/><stop offset=".85" stop-color="'+p.glint+'"/><stop offset="1" stop-color="'+p.dark+'"/></linearGradient>'+
 '<radialGradient id="'+id+'-face" cx=".40" cy=".26" r=".82"><stop stop-color="#286455"/><stop offset=".65" stop-color="#12463B"/><stop offset="1" stop-color="#082D27"/></radialGradient>'+
 '<filter id="'+id+'-shadow" x="-35%" y="-35%" width="170%" height="170%"><feDropShadow dx="0" dy="20" stdDeviation="18" flood-color="#031913" flood-opacity=".34"/></filter>'+
 '</defs>'+
 '<rect width="900" height="1180" rx="28" fill="'+bg+'"/>'+
 '<rect x="26" y="26" width="848" height="1128" rx="19" fill="none" stroke="'+p.mid+'" stroke-width="2.3" opacity=".78"/>'+
 '<rect x="43" y="43" width="814" height="1094" rx="12" fill="none" stroke="'+p.light+'" stroke-width=".9" opacity=".2"/>'+
 '<path d="M73 131V75H129 M771 75H827V131 M73 1049V1105H129 M771 1105H827V1049" stroke="'+p.mid+'" stroke-width="2" opacity=".58" fill="none"/>'+
 '<rect x="287" y="59" width="326" height="100" rx="16" fill="#F9F8EF" stroke="'+p.mid+'" stroke-width="2"/>'+
 (logo?'<image href="'+logo+'" x="307" y="73" width="286" height="69" preserveAspectRatio="xMidYMid meet"/>':
 '<text x="450" y="120" text-anchor="middle" '+font+' font-size="43" font-weight="900" fill="#155343">به‌پرور</text>')+
 '<text x="450" y="220" text-anchor="middle" direction="rtl" '+font+' font-size="30" font-weight="800" fill="#F7F6E9">سفر ارتباطات</text>'+
 '<path d="M326 252H419 M481 252H574" stroke="'+p.mid+'" stroke-width="2" opacity=".56"/>'+
 '<path d="M450 240L462 252 450 264 438 252Z" fill="'+p.glint+'"/>'+
 '<g filter="url(#'+id+'-shadow)">'+
 '<circle cx="450" cy="469" r="215" fill="#0A2D28" stroke="'+p.dark+'" stroke-width="4"/>'+
 '<circle cx="450" cy="469" r="208" fill="'+met+'" stroke="'+p.light+'" stroke-width="2.3"/>'+
 '<circle cx="450" cy="469" r="198" fill="#0B372F" stroke="'+p.dark+'" stroke-width="1.6"/>'+
 ticks+
 '<circle cx="450" cy="469" r="178" fill="'+face+'" stroke="'+p.light+'" stroke-width="2.5"/>'+
 '<circle cx="450" cy="469" r="161" fill="none" stroke="'+p.mid+'" stroke-width="1.8" opacity=".47"/>'+
 '<path d="M335 395A147 147 0 0 1 502 335" stroke="'+p.light+'" stroke-width="3.2" opacity=".28" fill="none" stroke-linecap="round"/>'+
 '<path d="M565 542A147 147 0 0 1 403 605" stroke="'+p.light+'" stroke-width="3.2" opacity=".25" fill="none" stroke-linecap="round"/>'+
 // Abstract emblem: opposing listening paths that meet in a single shared diamond.
 '<path d="M336 466C359 397 405 373 460 391C489 400 512 418 526 438" fill="none" stroke="'+p.mid+'" stroke-width="14" stroke-linecap="round"/>'+
 '<path d="M564 472C541 541 495 565 440 547C411 538 388 520 374 500" fill="none" stroke="'+p.light+'" stroke-width="14" stroke-linecap="round"/>'+
 '<circle cx="338" cy="466" r="10" fill="'+p.light+'"/><circle cx="562" cy="472" r="10" fill="'+p.mid+'"/>'+
 '<path d="M450 420L500 469 450 519 400 469Z" fill="'+met+'" stroke="'+p.light+'" stroke-width="3"/>'+
 '<path d="M450 438L482 469 450 500 418 469Z" fill="'+face+'" stroke="'+p.light+'" stroke-width="2.5"/>'+
 '</g>'+
 '<path d="M286 727H408 M492 727H614" stroke="'+p.mid+'" stroke-width="2" opacity=".63"/>'+
 '<path d="M450 717L460 727 450 737 440 727Z" fill="'+p.glint+'"/>'+
 '<text x="450" y="825" text-anchor="middle" direction="rtl" '+font+' font-size="78" font-weight="900" fill="'+p.light+'">نشان '+kind+'</text>'+
 '<text x="450" y="883" text-anchor="middle" direction="rtl" '+font+' font-size="26" font-weight="560" fill="#D9E6DC">'+escape(p.title)+'</text>'+
 plaque+
 '<path d="M337 1133H563" stroke="'+p.mid+'" opacity=".47"/>'+
 '</svg>';
}
window.BP_SAFAR_BADGE_DESIGN={seal,palettes};
})();