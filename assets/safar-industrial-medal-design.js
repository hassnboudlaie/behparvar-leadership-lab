/* Behparvar | jewel-toned premium ribboned medallions, 900 x 1180.
   SVG design only; award thresholds, PDF/PNG/SVG pipeline unchanged. */
(()=>{"use strict";
const palettes={
 gold:{name:"زرین",title:"تمایز در ارتباط حرفه‌ای",dark:"#8B4C22",mid:"#F5BB48",light:"#FFF9DD",rim:"#E5A832",glint:"#FFF1A8",ink:"#33194F",face:"#572577",ribbon:"#A31D4C",ribbonEdge:"#ED526C"},
 silver:{name:"سیمین",title:"تسلط بر گفت‌وگوی حرفه‌ای",dark:"#486484",mid:"#BDDAF3",light:"#FFFFFF",rim:"#9BB8D8",glint:"#EFFAFF",ink:"#143B74",face:"#1556A2",ribbon:"#1556B2",ribbonEdge:"#60B5FA"},
 bronze:{name:"برنزی",title:"پایه‌گذاری تعامل مؤثر",dark:"#8E4A28",mid:"#E1A372",light:"#FFF0D4",rim:"#C98752",glint:"#FFE0A2",ink:"#174D54",face:"#0C756F",ribbon:"#087761",ribbonEdge:"#4DBA9B"}
};
const escape=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fa=n=>Number(n||0).toLocaleString("fa-IR");
function seal(type,opts={}){
 const p=palettes[type];if(!p)return"";
 const preview=!!opts.preview,name=String(opts.name||"شرکت‌کننده به‌پرور").trim().slice(0,56);
 const date=String(opts.date||new Intl.DateTimeFormat("fa-IR",{year:"numeric",month:"long",day:"numeric"}).format(new Date()));
 const src=document.querySelector("#brandlogo")?.getAttribute("src")||"";
 const logo=src.startsWith("data:image/png;base64,")?src:"";
 const id="sf-mint-"+type+"-"+(preview?"preview":"earned"),met="url(#"+id+"-metal)",bg="url(#"+id+"-bg)",face="url(#"+id+"-face)",ribbon="url(#"+id+"-ribbon)";
 const font='font-family="Vazirmatn,Tahoma,Arial,sans-serif"';
 const score=fa(opts.score),kind=escape(p.name);
 const golden=escape({gold:"گفت‌وگوی اثرگذار، به اقدام پایدار تبدیل می‌شود.",silver:"شنیدن دقیق و تصمیم روشن، پایه اعتماد است.",bronze:"رشد ارتباطی با یک رفتار کوچک آغاز می‌شود."}[type]);
 const ticks=Array.from({length:40},(_,i)=>{
  const angle=i*Math.PI/20,ri=i%5===0?184:188,ro=194;
  return '<path d="M'+(450+ri*Math.sin(angle)).toFixed(1)+' '+(469-ri*Math.cos(angle)).toFixed(1)+
   'L'+(450+ro*Math.sin(angle)).toFixed(1)+' '+(469-ro*Math.cos(angle)).toFixed(1)+
   '" stroke="'+p.light+'" stroke-width="'+(i%5===0?2.3:1)+'" opacity="'+(i%5===0?".68":".32")+'"/>';
 }).join("");
 const plaque=preview?'<path d="M330 952H570" stroke="'+p.mid+'" opacity=".48"/>'+
 '<text x="450" y="1014" text-anchor="middle" direction="rtl" '+font+' font-size="25" fill="#C3D5CB">نمونه نشان</text>':
 '<rect x="125" y="955" width="650" height="95" rx="15" fill="#F8FAFF"/>'+
 '<text x="450" y="1012" text-anchor="middle" direction="rtl" '+font+' font-size="'+(name.length>34?"28":name.length>24?"33":"40")+'" font-weight="850" fill="#153b83">'+escape(name)+'</text>'+
 '<text x="450" y="1098" text-anchor="middle" direction="rtl" '+font+' font-size="24" fill="#E7E4CB">'+score+' امتیاز از ۱۰۰ · '+escape(date)+'</text>';
 return '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1180" viewBox="0 0 900 1180" role="img" aria-label="نشان '+kind+' سفر ارتباطات به‌پرور">'+
 '<defs><linearGradient id="'+id+'-bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#071936"/><stop offset=".54" stop-color="#163F7D"/><stop offset="1" stop-color="#091C40"/></linearGradient>'+
 '<linearGradient id="'+id+'-metal" x1=".12" y1=".03" x2=".89" y2="1"><stop stop-color="'+p.dark+'"/><stop offset=".19" stop-color="'+p.light+'"/><stop offset=".42" stop-color="'+p.mid+'"/><stop offset=".67" stop-color="'+p.dark+'"/><stop offset=".85" stop-color="'+p.glint+'"/><stop offset="1" stop-color="'+p.dark+'"/></linearGradient>'+
 '<radialGradient id="'+id+'-face" cx=".40" cy=".26" r=".82"><stop stop-color="'+p.face+'"/><stop offset=".65" stop-color="'+p.face+'"/><stop offset="1" stop-color="'+p.ink+'"/></radialGradient>'+
 '<linearGradient id="'+id+'-ribbon" x1="0" y1="0" x2="1" y2="1"><stop stop-color="'+p.ribbonEdge+'"/><stop offset=".25" stop-color="'+p.ribbon+'"/><stop offset=".52" stop-color="'+p.ribbonEdge+'"/><stop offset=".83" stop-color="'+p.ribbon+'"/><stop offset="1" stop-color="'+p.ink+'"/></linearGradient>'+
 '<filter id="'+id+'-shadow" x="-35%" y="-35%" width="170%" height="170%"><feDropShadow dx="0" dy="20" stdDeviation="18" flood-color="#031913" flood-opacity=".34"/></filter>'+
 '</defs>'+
 '<rect width="900" height="1180" rx="28" fill="'+bg+'"/>'+
 '<rect x="26" y="26" width="848" height="1128" rx="19" fill="none" stroke="'+p.mid+'" stroke-width="2.3" opacity=".78"/>'+
 '<rect x="43" y="43" width="814" height="1094" rx="12" fill="none" stroke="'+p.light+'" stroke-width=".9" opacity=".2"/>'+
 '<path d="M73 131V75H129 M771 75H827V131 M73 1049V1105H129 M771 1105H827V1049" stroke="'+p.mid+'" stroke-width="2" opacity=".58" fill="none"/>'+
 '<rect x="287" y="59" width="326" height="100" rx="16" fill="#F9FBFF" stroke="'+p.mid+'" stroke-width="2"/>'+
 (logo?'<image href="'+logo+'" x="307" y="73" width="286" height="69" preserveAspectRatio="xMidYMid meet"/>':
 '<text x="450" y="120" text-anchor="middle" '+font+' font-size="43" font-weight="900" fill="#155343">به‌پرور</text>')+
 '<text x="450" y="220" text-anchor="middle" direction="rtl" '+font+' font-size="30" font-weight="800" fill="#F7F6E9">سفر ارتباطات</text>'+
 '<path d="M326 252H419 M481 252H574" stroke="'+p.mid+'" stroke-width="2" opacity=".56"/>'+
 '<path d="M450 240L462 252 450 264 438 252Z" fill="'+p.glint+'"/>'+
 '<g filter="url(#'+id+'-shadow)">'+
 '<path d="M310 264L406 264 466 448 395 537 266 303Z" fill="'+ribbon+'" stroke="'+p.mid+'" stroke-width="6"/>'+
 '<path d="M495 264L591 264 635 303 505 537 434 448Z" fill="'+ribbon+'" stroke="'+p.mid+'" stroke-width="6"/>'+
 '<path d="M340 273L388 273 460 444 430 460Z M511 273L558 273 470 461 444 444Z" fill="'+p.light+'" opacity=".72"/>'+
 '<path d="M304 650L407 683 401 778 359 745 303 788Z M493 683L596 650 597 788 542 745 499 778Z" fill="'+ribbon+'" stroke="'+p.mid+'" stroke-width="5"/>'+
 '<circle cx="450" cy="469" r="215" fill="#081D42" stroke="'+p.dark+'" stroke-width="4"/>'+
 '<circle cx="450" cy="469" r="208" fill="'+met+'" stroke="'+p.light+'" stroke-width="2.3"/>'+
 '<circle cx="450" cy="469" r="198" fill="'+p.ink+'" stroke="'+p.dark+'" stroke-width="1.6"/>'+
 ticks+
 '<circle cx="450" cy="469" r="178" fill="'+face+'" stroke="'+p.light+'" stroke-width="2.5"/>'+
 '<circle cx="450" cy="469" r="161" fill="none" stroke="'+p.mid+'" stroke-width="1.8" opacity=".47"/>'+
 '<path d="M335 395A147 147 0 0 1 502 335" stroke="'+p.light+'" stroke-width="3.2" opacity=".28" fill="none" stroke-linecap="round"/>'+
 '<path d="M565 542A147 147 0 0 1 403 605" stroke="'+p.light+'" stroke-width="3.2" opacity=".25" fill="none" stroke-linecap="round"/>'+
 // Abstract emblem: opposing listening paths that meet in a single shared diamond.
 '<path d="M336 466C359 397 405 373 460 391C489 400 512 418 526 438" fill="none" stroke="'+p.mid+'" stroke-width="14" stroke-linecap="round"/>'+
 '<path d="M564 472C541 541 495 565 440 547C411 538 388 520 374 500" fill="none" stroke="'+p.light+'" stroke-width="14" stroke-linecap="round"/>'+
 '<circle cx="338" cy="466" r="10" fill="'+p.light+'"/><circle cx="562" cy="472" r="10" fill="'+p.mid+'"/>'+
 '<rect x="354" y="419" width="194" height="108" rx="48" fill="'+p.dark+'" opacity=".18"/>'+
 '<path d="M356 441Q356 411 389 411H518Q551 411 551 447V486Q551 517 518 517H467L423 540 431 515H389Q356 515 356 482Z" fill="'+face+'" stroke="'+p.light+'" stroke-width="7"/>'+
 '<circle cx="408" cy="465" r="9" fill="'+p.glint+'"/><circle cx="451" cy="465" r="9" fill="'+p.glint+'"/><circle cx="494" cy="465" r="9" fill="'+p.glint+'"/>'+
 '<path d="M450 364L460 393 491 394 467 413 476 443 450 426 424 443 433 413 409 394 440 393Z" fill="'+met+'" stroke="'+p.light+'" stroke-width="2.5"/>'+
 '</g>'+
 '<path d="M286 727H408 M492 727H614" stroke="'+p.mid+'" stroke-width="2" opacity=".63"/>'+
 '<path d="M450 717L460 727 450 737 440 727Z" fill="'+p.glint+'"/>'+
 '<text x="450" y="825" text-anchor="middle" direction="rtl" '+font+' font-size="78" font-weight="900" fill="'+p.light+'">مدال '+kind+'</text>'+
 '<text x="450" y="866" text-anchor="middle" direction="rtl" '+font+' font-size="26" font-weight="750" fill="#F5F7FE">'+escape(p.title)+'</text>'+
 '<text x="450" y="920" text-anchor="middle" direction="rtl" '+font+' font-size="21" font-weight="680" fill="'+p.light+'">'+golden+'</text>'+
 plaque+
 '<path d="M337 1133H563" stroke="'+p.mid+'" opacity=".47"/>'+
 '</svg>';
}
window.BP_SAFAR_BADGE_DESIGN={seal,palettes};
})();