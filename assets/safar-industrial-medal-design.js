/* Industrial communication seals - visual generator. Uses the genuine logo
 * found in the app DOM. No fake/recreated corporate marks.
 */
(()=>{"use strict";
const palettes={
 gold:{name:"زرین",title:"معمار ارتباط مؤثر",range:"۹۰+ کل، ۷۲+ آزمون",stars:3,teeth:16,
 dark:"#925F22",mid:"#D7AB58",light:"#FFF1C5",bg:"#15384D",bg2:"#286276",ink:"#14374A"},
 silver:{name:"سیمین",title:"هماهنگ‌ساز گفت‌وگو",range:"۷۵+ کل، ۶۰+ آزمون",stars:2,teeth:12,
 dark:"#667D93",mid:"#B6C5D1",light:"#F7FAFD",bg:"#193B52",bg2:"#45677E",ink:"#1D465B"},
 bronze:{name:"برنزی",title:"پایه‌گذار تعامل حرفه‌ای",range:"۶۰+ کل، ۴۴+ آزمون",stars:1,teeth:10,
 dark:"#85573D",mid:"#CA926E",light:"#FBE0C9",bg:"#1C3C4C",bg2:"#5D625C",ink:"#214452"}
};
const escape=x=>String(x??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const fa=x=>Number(x||0).toLocaleString("fa-IR");
const logo=()=>{const x=document.querySelector("#brandlogo")?.getAttribute("src")||"";return x.startsWith("data:image/png;base64,")?x:""};
function gear(cx,cy,count){
 const steps=[];for(let i=0;i<count;i++)for(const [f,r] of [[0,167],[.15,188],[.38,188],[.53,167]]){
 const angle=-Math.PI/2+Math.PI*2*(i+f)/count;
 steps.push((steps.length?"L":"M")+(cx+Math.cos(angle)*r).toFixed(1)+" "+(cy+Math.sin(angle)*r).toFixed(1))
 }return steps.join(" ")+" Z";
}
function seal(type,opts={}){
 const p=palettes[type];if(!p)return"";
 const preview=!!opts.preview,score=opts.score;
 const name=preview?"نمونه نشان آموزشی":String(opts.name||"شرکت‌کننده به‌پرور").slice(0,55);
 const role=opts.role==="managers"?"مسیر مدیران":"مسیر سرپرستان";
 const date=opts.date||new Intl.DateTimeFormat("fa-IR",{year:"numeric",month:"long",day:"numeric"}).format(new Date());
 const uid="sf4-"+type+"-"+(preview?"preview":"earned");
 const metal="url(#"+uid+"-metal)",inside="url(#"+uid+"-inside)",bg="url(#"+uid+"-bg)";
 const stars=Array.from({length:p.stars},(_,i)=>{
  const cx=450+(i-(p.stars-1)/2)*58,cy=673,points=[];
  for(let j=0;j<10;j++){let a=-Math.PI/2+j*Math.PI/5,r=j%2?9:21;points.push((cx+Math.cos(a)*r).toFixed(1)+","+(cy+Math.sin(a)*r).toFixed(1))}
  return '<polygon points="'+points.join(" ")+'" fill="'+p.light+'" stroke="'+p.dark+'" stroke-width="3"/>';
 }).join("");
 const marks=Array.from({length:24},(_,i)=>{
  const a=-Math.PI/2+i*Math.PI/12;
  return '<line x1="'+(450+146*Math.cos(a)).toFixed(1)+'" y1="'+(466+146*Math.sin(a)).toFixed(1)+'" x2="'+(450+(i%3===0?160:154)*Math.cos(a)).toFixed(1)+'" y2="'+(466+(i%3===0?160:154)*Math.sin(a)).toFixed(1)+'" stroke="'+p.light+'" stroke-width="'+(i%3===0?3:2)+'" opacity=".68"/>';
 }).join("");
 const details=preview?"حد نصاب: "+p.range:"امتیاز نهایی: "+fa(score)+" از ۱۰۰";
 const genuine=logo();
 return '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1180" viewBox="0 0 900 1180" role="img" aria-label="نشان '+p.name+' سفر ارتباطات به‌پرور">'+
 '<defs><linearGradient id="'+uid+'-bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="'+p.bg+'"/><stop offset=".62" stop-color="'+p.bg2+'"/><stop offset="1" stop-color="'+p.bg+'"/></linearGradient>'+
 '<linearGradient id="'+uid+'-metal" x1="0" y1="0" x2=".9" y2="1"><stop stop-color="'+p.light+'"/><stop offset=".36" stop-color="'+p.mid+'"/><stop offset="1" stop-color="'+p.dark+'"/></linearGradient>'+
 '<radialGradient id="'+uid+'-inside"><stop stop-color="#FFFFFF"/><stop offset=".96" stop-color="'+p.light+'"/></radialGradient></defs>'+
 '<rect width="900" height="1180" rx="32" fill="'+bg+'"/>'+
 '<rect x="24" y="24" width="852" height="1132" rx="24" fill="none" stroke="'+p.mid+'" stroke-width="3"/>'+
 '<rect x="42" y="42" width="816" height="1096" rx="15" fill="none" stroke="'+p.light+'" stroke-width="1" opacity=".3"/>'+
 '<path d="M100 239 H800 M100 810 H800 M100 1080 H800" stroke="'+p.light+'" opacity=".4" stroke-width="2"/>'+
 '<rect x="293" y="52" width="314" height="100" rx="18" fill="#F5FAFC" stroke="'+p.mid+'" stroke-width="3"/>'+
 (genuine?'<image href="'+genuine+'" x="309" y="65" width="282" height="74" preserveAspectRatio="xMidYMid meet"/>':
 '<text x="450" y="116" text-anchor="middle" font-family="Tahoma" font-size="46" font-weight="bold" fill="'+p.ink+'">به‌پرور</text>')+
 '<text x="450" y="194" text-anchor="middle" direction="rtl" font-family="Vazirmatn,Tahoma,Arial" font-size="25" font-weight="700" fill="#E2F1F5">آکادمی توسعه مهارت‌های مدیریتی</text>'+
 '<text x="450" y="230" text-anchor="middle" direction="rtl" font-family="Vazirmatn,Tahoma,Arial" font-size="33" font-weight="900" fill="#FFFFFF">سفر ارتباطات</text>'+
 '<path d="M345 555 L304 688 L351 672 L385 716 L416 597 Z" fill="'+p.dark+'" stroke="'+p.light+'" stroke-width="3" opacity=".95"/>'+
 '<path d="M553 555 L594 688 L547 672 L513 716 L484 597 Z" fill="'+p.mid+'" stroke="'+p.light+'" stroke-width="3" opacity=".95"/>'+
 '<path d="M333 605 L357 613 M566 605 L540 615" fill="none" stroke="'+p.light+'" stroke-width="6" opacity=".65"/>'+
 '<path d="'+gear(450,466,p.teeth)+'" fill="'+metal+'" stroke="'+p.dark+'" stroke-width="5"/>'+
 '<circle cx="450" cy="466" r="164" fill="'+p.bg+'" stroke="'+p.light+'" stroke-width="8"/>'+
 '<circle cx="450" cy="466" r="148" fill="'+inside+'" stroke="'+p.dark+'" stroke-width="4"/>'+
 marks+
 '<circle cx="450" cy="466" r="123" fill="none" stroke="'+p.mid+'" stroke-width="3" opacity=".8"/>'+'<path d="M347 356 l15 -14 M535 356 l15 -14 M347 578 l15 14 M535 578 l15 14" fill="none" stroke="'+p.dark+'" opacity=".5" stroke-width="4"/>'+
 '<circle cx="450" cy="324" r="6" fill="'+p.dark+'"/><circle cx="450" cy="608" r="6" fill="'+p.dark+'"/>'+
 '<path d="M361 498 C397 447 434 449 456 470 S507 506 545 456" fill="none" stroke="'+p.bg2+'" stroke-width="7" stroke-linecap="round"/>'+
 '<circle cx="360" cy="500" r="12" fill="'+p.bg+'"/><circle cx="542" cy="456" r="12" fill="'+p.bg+'"/>'+
 '<path d="M356 398 q0 -25 27 -25 h111 q27 0 27 25 v30 q0 25 -27 25 h-64 l-33 25 4 -25 h-18 q-27 0 -27 -25 z" fill="#F7FBFD" stroke="'+p.bg+'" stroke-width="8"/>'+
 '<path d="M402 441 q0 -24 28 -24 h98 q28 0 28 24 v30 q0 24 -28 24 h-26 l5 27 -38 -27 h-39 q-28 0 -28 -24 z" fill="'+p.light+'" stroke="'+p.bg2+'" stroke-width="8"/>'+
 '<circle cx="444" cy="457" r="9" fill="'+p.ink+'"/><circle cx="474" cy="457" r="9" fill="'+p.ink+'"/><circle cx="504" cy="457" r="9" fill="'+p.ink+'"/>'+
 stars+
 '<text x="450" y="709" text-anchor="middle" direction="rtl" font-family="Vazirmatn,Tahoma,Arial" font-size="20" font-weight="750" fill="#E7EDE7">سفر مهارت‌های ارتباطی · صنعت به‌پرور</text>'+
 '<text x="450" y="741" text-anchor="middle" direction="rtl" font-family="Vazirmatn,Tahoma,Arial" font-size="64" font-weight="900" fill="'+p.light+'">نشان '+p.name+'</text>'+
 '<text x="450" y="784" text-anchor="middle" direction="rtl" font-family="Vazirmatn,Tahoma,Arial" font-size="28" font-weight="700" fill="#E5F1F6">'+p.title+'</text>'+
 '<rect x="131" y="831" width="638" height="93" rx="18" fill="#FAFCFD"/>'+
 '<text x="450" y="873" text-anchor="middle" direction="rtl" font-family="Vazirmatn,Tahoma,Arial" font-size="'+(name.length>32?25:32)+'" font-weight="900" fill="'+p.ink+'">'+escape(name)+'</text>'+
 '<text x="450" y="905" text-anchor="middle" direction="rtl" font-family="Vazirmatn,Tahoma,Arial" font-size="17" fill="#627988">'+(preview?"پیش‌نمایش طراحی":"دریافت‌کننده نشان آموزشی")+'</text>'+
 '<text x="450" y="979" text-anchor="middle" direction="rtl" font-family="Vazirmatn,Tahoma,Arial" font-size="30" font-weight="850" fill="'+p.light+'">'+escape(details)+'</text>'+
 '<text x="450" y="1020" text-anchor="middle" direction="rtl" font-family="Vazirmatn,Tahoma,Arial" font-size="24" fill="#E4F0F4">'+(preview?"شایستگی ارتباط و همکاری":escape(role))+'</text>'+
 '<text x="450" y="1064" text-anchor="middle" direction="rtl" font-family="Vazirmatn,Tahoma,Arial" font-size="24" fill="'+p.mid+'">'+(preview?"مهارت • صنعت • تعامل":escape(date))+'</text>'+
 '<text x="450" y="1122" text-anchor="middle" direction="rtl" font-family="Vazirmatn,Tahoma,Arial" font-size="17" fill="#E1ECF2">نشان آموزشی مهارت؛ نه گواهی رسمی صلاحیت شغلی</text></svg>';
}
window.BP_SAFAR_BADGE_DESIGN={seal,palettes};
})();
