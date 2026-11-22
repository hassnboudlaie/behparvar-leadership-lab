/* Independent Behparvar strategy-learning tools. Each tool has its own local report and storage. */
(()=>{"use strict";
const tool=document.body.dataset.tool;
const $=id=>document.getElementById(id), esc=s=>String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const fresh=()=>({role:"",pest:{},porter:{},swot:{s:[],w:[],o:[],t:[]},ansoff:"",q:{first:"",second:"",rows:{}},seven:{},bsc:{},action:""});
const key="bp-s6-strategic-"+tool+"-v3";
let st=fresh();
try{let saved=JSON.parse(localStorage.getItem(key)||"null");if(!saved){const legacy=JSON.parse(localStorage.getItem("bp-s6-strategic-toolkit-v2")||"null");if(legacy)saved=legacy}if(saved&&typeof saved==="object")st={...fresh(),...saved,swot:{...fresh().swot,...(saved.swot||{})},q:{...fresh().q,...(saved.q||{})}};}catch(e){}
function val(path){return path.split(".").reduce((x,k)=>x?.[k],st)}
function set(path,v){const a=path.split(".");let o=st;for(let i=0;i<a.length-1;i++)o=o[a[i]]??(o[a[i]]={});o[a[a.length-1]]=v}
function store(){try{localStorage.setItem(key,JSON.stringify({role:st.role,[tool]:st[tool]}));$("saveStatus").textContent="پاسخ‌های همین ابزار روی این دستگاه ذخیره شد."}catch(e){$("saveStatus").textContent="ذخیره محلی امکان‌پذیر نیست. گزارش را دریافت کنید."}}
const pest=[
{id:"p",name:"سیاست و تجارت",desc:"چه تصمیم‌های کلان می‌توانند شکل صنعت خوراک را تغییر دهند؟",opts:[["1","تغییر سیاست واردات نهاده‌های خوراک"],["2","تغییر سیاست‌های حمایتی صنعت دام و طیور"],["3","تغییر روابط تجاری و دسترسی به بازارهای خارجی"]]},
{id:"e",name:"شرایط اقتصادی",desc:"کدام روند اقتصادی برای آینده شرکت مهم‌تر است؟",opts:[["1","نوسان بلندمدت هزینه مواد اولیه"],["2","تغییر قدرت خرید دامداران و مرغداران"],["3","افزایش هزینه سرمایه‌گذاری و تأمین مالی"]]},
{id:"s",name:"نیاز و انتظار بازار",desc:"آینده مشتریان و شیوه انتخاب آنان به چه سمتی می‌رود؟",opts:[["1","تقاضای بیشتر برای خوراک تخصصی و متناسب با نیاز"],["2","توجه بیشتر به اعتبار کیفیت و سلامت محصول"],["3","انتظار خدمات علمی و مشاوره در کنار محصول"]]},
{id:"t",name:"فناوری",desc:"چه فناوری‌هایی می‌توانند مزیت رقابتی آینده را بسازند؟",opts:[["1","فرمولاسیون و پژوهش تغذیه پیشرفته"],["2","ردیابی دیجیتال کیفیت در زنجیره تأمین"],["3","تحلیل داده برای شناخت تقاضا و بازار"]]},
{id:"l",name:"قانون و استاندارد",desc:"کدام تحول قانونی بر جهت‌گیری شرکت اثر می‌گذارد؟",opts:[["1","سخت‌گیرانه‌تر شدن استانداردهای کیفیت و ایمنی"],["2","تغییر الزامات مجوز تولید و عرضه"],["3","تغییر قوانین محیط کار و تجارت"]]},
{id:"n",name:"محیط‌زیست و منابع",desc:"چه تغییر بلندمدتی در منابع طبیعی مهم است؟",opts:[["1","تأثیر تغییر اقلیم بر عرضه نهاده‌های کشاورزی"],["2","افزایش اهمیت تولید کم‌ضایعات و مصرف انرژی"],["3","افزایش انتظار بازار نسبت به پایداری تولید"]]}
];
const porter=[
{id:"r",name:"رقابت شرکت‌های موجود",desc:"رقبای کنونی چقدر انتخاب‌های رشد به‌پرور را محدود می‌کنند؟"},
{id:"c",name:"قدرت مشتریان",desc:"مشتریان بزرگ چقدر می‌توانند قیمت و شرایط بازار را تعیین کنند؟"},
{id:"s",name:"قدرت تأمین‌کنندگان",desc:"فروشندگان مواد اولیه چقدر بر سودآوری صنعت اثر دارند؟"},
{id:"e",name:"ورود رقبای جدید",desc:"آیا ورود تولیدکننده جدید به این بازار آسان است؟"},
{id:"a",name:"جایگزین‌ها",desc:"آیا روش‌های دیگر تأمین یا ساخت خوراک، بازار فعلی را تهدید می‌کنند؟"}
];
const swot=[
{id:"s",name:"قوت | توان داخلی شرکت",desc:"کدام توانمندی می‌تواند مزیت رقابتی بسازد؟",opts:[["1","تجربه و اعتبار در صنعت خوراک"],["2","دانش تولید و پژوهش در تغذیه"],["3","رابطه پایدار با گروه‌های مشتری"],["4","توان تولید و کنترل کیفیت"]]},
{id:"w",name:"ضعف | محدودیت داخلی",desc:"کدام محدودیت ممکن است رشد آینده را دشوار کند؟",opts:[["1","وابستگی زیاد به یک بازار یا گروه مشتری"],["2","تنوع کم کانال‌های فروش"],["3","محدودیت سرمایه یا ظرفیت لازم برای توسعه"],["4","هماهنگ نبودن برنامه‌های کلان واحدها"]]},
{id:"o",name:"فرصت | بیرون شرکت",desc:"کدام امکان بیرونی ظرفیت رشد دارد؟",opts:[["1","رشد تقاضا برای محصولات تخصصی‌تر"],["2","بازارهای منطقه‌ای تازه"],["3","فرصت همکاری راهبردی با شرکت‌های هم‌صنعت"],["4","فناوری جدید برای متمایز شدن"]]},
{id:"t",name:"تهدید | بیرون شرکت",desc:"کدام تحول بیرونی ممکن است جایگاه شرکت را به خطر بیندازد؟",opts:[["1","نوسان و کمبود بلندمدت مواد اولیه"],["2","جنگ قیمتی رقبا"],["3","تغییر ناگهانی قوانین صنعت"],["4","کم‌شدن قدرت خرید مشتریان"]]}
];
const strats=[
{id:"penetration",name:"جایگاه قوی‌تر در بازار کنونی",desc:"محصول کنونی، بازار کنونی",why:"افزایش سهم بازار و حفظ مشتری در بازار فعلی.",test:"اندازه بازار، سهم فعلی و علت انتخاب رقبا را بررسی کنید."},
{id:"market",name:"ورود به بازارهای جغرافیایی جدید",desc:"محصول کنونی، بازار جدید",why:"گسترش فروش محصولات فعلی در مناطق یا گروه‌های مشتری تازه.",test:"ظرفیت بازار تازه، شبکه توزیع و رقیب اصلی را بسنجید."},
{id:"product",name:"توسعه محصولات تخصصی جدید",desc:"محصول جدید، بازار کنونی",why:"خلق پیشنهاد ارزشی تازه برای مشتریان کنونی.",test:"نیاز بازار، توان تحقیق و توسعه، و سرمایه لازم را بسنجید."},
{id:"diversify",name:"ورود به کسب‌وکار یا بازار جدید",desc:"محصول جدید، بازار جدید",why:"ایجاد جریان رشد تازه با ریسک و عدم‌قطعیت بیشتر.",test:"تناسب با شایستگی‌های شرکت و ریسک مالی را بررسی کنید."}
];
const seven=[
{id:"strategy",name:"راهبرد",desc:"آیا جهت رشد و اولویت‌های شرکت برای همه واحدها روشن است؟"},
{id:"structure",name:"ساختار",desc:"آیا تقسیم مسئولیت و اختیار برای اجرای راهبرد مناسب است؟"},
{id:"systems",name:"سیستم‌ها",desc:"آیا بودجه‌ریزی، اطلاعات و نظام ارزیابی از راهبرد پشتیبانی می‌کنند؟"},
{id:"values",name:"ارزش‌های مشترک",desc:"آیا ارزش‌های کیفیت، اعتماد و یادگیری پشت تصمیم‌های کلان دیده می‌شوند؟"},
{id:"skills",name:"مهارت‌های کلیدی",desc:"آیا تخصص‌های مورد نیاز راهبرد آینده وجود دارد؟"},
{id:"staff",name:"ترکیب نیروی انسانی",desc:"آیا ترکیب نیرو و جانشین‌پروری با برنامه رشد سازگار است؟"},
{id:"style",name:"سبک رهبری",desc:"آیا شیوه رهبری، همکاری بین واحدها را در اجرای راهبرد تقویت می‌کند؟"}
];
const bsc=[
{id:"f",name:"مالی | ارزش اقتصادی",desc:"از نظر اقتصادی چه نتیجه راهبردی می‌خواهیم؟",opts:[["1","رشد سودآوری پایدار","افزایش"],["2","بهبود بازده سرمایه‌گذاری","افزایش"],["3","کاهش وابستگی درآمد به یک بازار","کاهش"]]},
{id:"c",name:"مشتری و بازار",desc:"می‌خواهیم در ذهن و انتخاب مشتری چه جایگاهی داشته باشیم؟",opts:[["1","افزایش سهم بازار هدف","افزایش"],["2","افزایش حفظ مشتریان کلیدی","افزایش"],["3","رشد رضایت مشتریان راهبردی","افزایش"]]},
{id:"p",name:"توان فرایندهای اصلی",desc:"کدام قابلیت سازمانی باید مزیت آینده را ایجاد کند؟",opts:[["1","افزایش توان نوآوری و عرضه محصول جدید","افزایش"],["2","افزایش قابلیت اطمینان زنجیره تأمین","افزایش"],["3","افزایش یکپارچگی برنامه‌ریزی کلان واحدها","افزایش"]]},
{id:"l",name:"افراد و آینده‌سازی",desc:"چه ظرفیت انسانی برای اجرای راهبرد لازم است؟",opts:[["1","افزایش آمادگی جانشینان نقش‌های کلیدی","افزایش"],["2","افزایش پوشش شایستگی‌های استراتژیک","افزایش"],["3","افزایش مشارکت کارکنان در نوآوری","افزایش"]]}
];


const fallback=[
{id:"d1",name:"امنیت تأمین مواد اولیه",tag:"عامل بیرونی"},
{id:"d2",name:"توان فرمولاسیون و کیفیت محصولات",tag:"عامل درونی"},
{id:"d3",name:"سرمایه و ظرفیت لازم برای توسعه",tag:"عامل درونی"},
{id:"d4",name:"تقاضا برای خوراک تخصصی",tag:"عامل بیرونی"},
{id:"d5",name:"شدت رقابت قیمتی صنعت",tag:"عامل بیرونی"},
{id:"d6",name:"دسترسی به بازارهای جغرافیایی جدید",tag:"عامل بیرونی"}
];
function getOpt(arr,k){return (arr||[]).find(x=>x[0]===k)?.[1]||""}
function choices(arr,path,caption){return '<select data-path="'+esc(path)+'" aria-label="'+esc(caption)+'"><option value="">'+esc(caption)+'</option>'+arr.map(x=>'<option value="'+esc(x[0])+'"'+(String(val(path)??"")===String(x[0])?' selected':'')+'>'+esc(x[1])+'</option>').join("")+'</select>'}
function radio(arr,path){return '<div class="options">'+arr.map(x=>'<label><input type="radio" name="'+esc(path)+'" data-path="'+esc(path)+'" value="'+esc(x[0])+'"'+(val(path)===x[0]?' checked':'')+'><span>'+esc(x[1])+'</span></label>').join("")+'</div>'}
function question(title,desc,inside){return '<div class="question"><h3>'+esc(title)+'</h3><p>'+esc(desc)+'</p>'+inside+'</div>'}
function selectRow(text,html){return '<div class="pair"><span>'+esc(text)+'</span>'+html+'</div>'}
const effects=[["o","فرصت مهم برای آینده"],["t","تهدید احتمالی برای آینده"],["x","برای قضاوت شواهد کافی نداریم"]];
const levels=[["1","کم"],["2","متوسط"],["3","زیاد"],["x","اطلاع کافی ندارم"]];
const fit=[["yes","هم‌راستا"],["no","نیازمند تقویت"],["x","اطلاع کافی ندارم"]];
function renderForm(){
let markup="";
if(tool==="pest"){
markup=pest.map(d=>question(d.name,d.desc,radio(d.opts,"pest."+d.id+".factor")+selectRow("برداشت شما از اثر این روند:",choices(effects,"pest."+d.id+".impact","اثر احتمالی را انتخاب کنید")))).join("");
}else if(tool==="porter"){
markup=porter.map(d=>question(d.name,d.desc,selectRow("شدت این نیروی رقابتی:",choices(levels,"porter."+d.id,"شدت فشار را انتخاب کنید")))).join("");
}else if(tool==="swot"){
markup='<div class="swot-grid">'+swot.map(d=>question(d.name,d.desc+" (حداکثر دو مورد انتخاب کنید؛ بر اساس شناخت خود از شرکت)",'<div class="options">'+d.opts.map(x=>'<label><input type="checkbox" data-many="'+d.id+'" value="'+x[0]+'"'+((st.swot[d.id]||[]).includes(x[0])?" checked":"")+'><span>'+esc(x[1])+'</span></label>').join("")+'</div>')).join("")+'</div>';
}else if(tool==="ansoff"){
markup='<div class="choice-grid">'+strats.map(d=>'<label><input type="radio" name="ansoff" data-path="ansoff" value="'+d.id+'"'+(st.ansoff===d.id?' checked':'')+'><strong>'+esc(d.name)+'</strong><small>'+esc(d.desc)+' — '+esc(d.why)+'</small></label>').join("")+'</div>';
}else if(tool==="qspm"){
markup='<div class="strategy-pair"><label>راهبرد اول'+choices(strats.map(d=>[d.id,d.name]),"q.first","راهبرد اول")+'</label><label>راهبرد دوم'+choices(strats.map(d=>[d.id,d.name]),"q.second","راهبرد دوم")+'</label></div>'+
'<div class="scroll-table"><table><thead><tr><th scope="col">عامل مؤثر بر آینده</th><th scope="col">اهمیت<br><small>۱ تا ۵</small></th><th scope="col">جذابیت راهبرد اول<br><small>۰ تا ۴</small></th><th scope="col">جذابیت راهبرد دوم<br><small>۰ تا ۴</small></th></tr></thead><tbody>'+
fallback.map(f=>'<tr><th scope="row">'+esc(f.name)+'<br><small>'+esc(f.tag)+'</small></th><td>'+choices([[1,"۱"],[2,"۲"],[3,"۳"],[4,"۴"],[5,"۵"]],"q.rows."+f.id+".w","اهمیت")+'</td><td>'+choices([[0,"۰ - بی‌ارتباط"],[1,"۱ - کم"],[2,"۲ - متوسط"],[3,"۳ - زیاد"],[4,"۴ - بسیار زیاد"]],"q.rows."+f.id+".a","جذابیت اول")+'</td><td>'+choices([[0,"۰ - بی‌ارتباط"],[1,"۱ - کم"],[2,"۲ - متوسط"],[3,"۳ - زیاد"],[4,"۴ - بسیار زیاد"]],"q.rows."+f.id+".b","جذابیت دوم")+'</td></tr>').join("")+'</tbody></table></div><p class="hint">اهمیت یک عامل برای هر دو راهبرد یکسان است. جذابیت یعنی آن عامل چقدر انتخاب هر راهبرد را موجه می‌کند. اگر یک عامل به هیچ‌کدام ارتباط ندارد، برای هر دو گزینه صفر بگذارید.</p>';
}else if(tool==="seven"){
markup=seven.map(d=>question(d.name,d.desc,selectRow("ارزیابی اولیه:",choices(fit,"seven."+d.id,"وضعیت را انتخاب کنید")))).join("");
}else if(tool==="bsc"){
markup=bsc.map(d=>question(d.name,d.desc,selectRow("هدف و شاخص پیشنهادی:",choices(d.opts.map(o=>[o[0],o[1]]),"bsc."+d.id+".metric","یک هدف راهبردی انتخاب کنید"))+selectRow("افق زمانی این هدف:",choices([["year","یک‌ساله"],["three","سه‌ساله"],["research","ابتدا نیازمند تعیین خط مبنا"]],"bsc."+d.id+".horizon","افق زمانی را انتخاب کنید")))).join("");
}
$("toolForm").innerHTML=markup;
document.querySelectorAll('input[name="role"]').forEach(x=>{x.checked=x.value===st.role;});
renderReport();
}
function analysis(){
let lines=[],insight="",remaining=0,total=0,completeness=0;
const state=x=>x==="o"?"فرصت":x==="t"?"تهدید":"نیازمند بررسی";
if(tool==="pest"){
total=pest.length;const impacts={o:[],t:[],x:[]};
for(const d of pest){const f=val("pest."+d.id+".factor"),e=val("pest."+d.id+".impact");
if(f&&e){completeness++;impacts[e]?.push(d.name);lines.push(d.name+" — "+getOpt(d.opts,f)+"؛ ارزیابی اولیه: "+state(e));}else lines.push(d.name+" — تکمیل نشده");}
remaining=total-completeness;
insight="ابعاد فرصت: "+(impacts.o.join("، ")||"ثبت نشده")+" | ابعاد تهدید: "+(impacts.t.join("، ")||"ثبت نشده")+". این تحلیل از محیط بیرونی است، نه تأیید وضعیت داخلی شرکت.";
}else if(tool==="porter"){
total=porter.length;const highs=[];for(const d of porter){const v=val("porter."+d.id);if(v)completeness++;if(v==="3")highs.push(d.name);lines.push(d.name+" — "+(getOpt(levels,v)||"تکمیل نشده"));}
remaining=total-completeness;
insight="فشارهای بالقوه زیاد: "+(highs.join("، ")||"موردی انتخاب نشده")+". جمع‌بندی درباره جذابیت صنعت به داده واقعی و مقایسه با رقبا نیاز دارد.";
}else if(tool==="swot"){
total=4;for(const d of swot){const arr=(st.swot[d.id]||[]).map(k=>getOpt(d.opts,k)).filter(Boolean);if(arr.length)completeness++;lines.push(d.name+" — "+(arr.join("، ")||"تکمیل نشده"));}
remaining=total-completeness;
insight="این چهار دسته یک تصویر اولیه از مسائل راهبردی‌اند. گزینه‌های قوت و ضعف باید با شواهد درون شرکت و فرصت و تهدید با اطلاعات بازار تأیید شوند؛ فهرست به‌تنهایی استراتژی نیست.";
}else if(tool==="ansoff"){
total=1;const d=strats.find(x=>x.id===st.ansoff);completeness=d?1:0;remaining=1-completeness;
lines=d?["مسیر پیشنهادی رشد: "+d.name,"نوع محصول و بازار: "+d.desc,"منطق رشد: "+d.why,"پیش‌نیاز بررسی: "+d.test]:["هنوز مسیر رشد انتخاب نشده است."];
insight="انتخاب یک خانه در ماتریس آنسوف «فرضیه رشد» است، نه مجوز سرمایه‌گذاری. باید با توان شرکت و پتانسیل بازار راستی‌آزمایی شود.";
}else if(tool==="qspm"){
total=fallback.length+1;const a=strats.find(x=>x.id===val("q.first")),b=strats.find(x=>x.id===val("q.second"));
const distinct=!!(a&&b&&a.id!==b.id);completeness=distinct?1:0;
if(!a||!b)lines.push("دو راهبرد را برای مقایسه انتخاب کنید.");
else if(!distinct)lines.push("راهبردهای اول و دوم باید متفاوت باشند.");
else lines.push("راهبرد اول: "+a.name+" | راهبرد دوم: "+b.name);
let wa=0,wb=0,tw=0,valid=true,used=0;
for(const f of fallback){const r=st.q.rows?.[f.id]||{};const complete=r.w!=null&&r.w!==""&&r.a!=null&&r.a!==""&&r.b!=null&&r.b!=="";
if(complete){if((String(r.a)==="0")!==(String(r.b)==="0"))valid=false;else completeness++;tw+=Number(r.w);wa+=Number(r.w)*Number(r.a);wb+=Number(r.w)*Number(r.b);used++;lines.push(f.name+" — اهمیت: "+r.w+"، جذابیت اول: "+r.a+"، جذابیت دوم: "+r.b);}
else lines.push(f.name+" — تکمیل نشده");}
remaining=total-completeness;
if(!valid){insight="در یک عامل، صفر فقط وقتی درست است که آن عامل برای هیچ‌کدام از دو راهبرد مرتبط نباشد؛ لطفاً صفر را برای هر دو انتخاب کنید یا هر دو را از ۱ تا ۴ امتیاز دهید.";completeness=Math.min(completeness,total-1);remaining=total-completeness;}
else if(distinct&&used===fallback.length&&tw>0){const A=wa/tw,B=wb/tw;lines.push("امتیاز وزنی راهبرد اول: "+A.toFixed(2),"امتیاز وزنی راهبرد دوم: "+B.toFixed(2));insight=A>B?"بر پایه قضاوت‌های فعلی، «"+a.name+"» امتیاز بیشتری دارد.":B>A?"بر پایه قضاوت‌های فعلی، «"+b.name+"» امتیاز بیشتری دارد.":"بر پایه قضاوت‌های فعلی، امتیاز دو راهبرد یکسان است.";insight+=" وزن اهمیت هر عامل بر مجموع اهمیت‌ها تقسیم شده و در جذابیت ضرب شده است. نتیجه به داده‌ها و داوری افراد وابسته است.";}
else insight="برای نتیجه معتبر آموزشی، دو راهبرد متفاوت و امتیازهای هر شش عامل را کامل کنید.";
}else if(tool==="seven"){
total=seven.length;let gaps=[],uncertain=[];for(const d of seven){const v=val("seven."+d.id);if(v)completeness++;if(v==="no")gaps.push(d.name);if(v==="x")uncertain.push(d.name);lines.push(d.name+" — "+(getOpt(fit,v)||"تکمیل نشده"));}
remaining=total-completeness;insight="ابعاد نیازمند تقویت در برداشت اولیه: "+(gaps.join("، ")||"موردی انتخاب نشده")+". ابعاد با شواهد ناکافی: "+(uncertain.join("، ")||"موردی ثبت نشده")+". آمادگی اجرای راهبرد نیازمند هم‌راستایی هفت عامل است، نه صرفاً خوب بودن تک‌تک آن‌ها.";
}else if(tool==="bsc"){
total=bsc.length;let count=0;for(const d of bsc){const m=val("bsc."+d.id+".metric"),h=val("bsc."+d.id+".horizon");if(m&&h)completeness++;if(m)count++;lines.push(d.name+" — "+(getOpt(d.opts,m)||"هدف تعیین نشده")+"؛ "+({year:"افق یک‌ساله",three:"افق سه‌ساله",research:"ابتدا تعیین خط مبنا"}[h]||"افق تعیین نشده"));}
remaining=total-completeness;insight="چهار منظر، یک پیش‌نویس کارت امتیازی راهبردی ساخته‌اند. برای نسخه اجرایی باید مقدار مبنا، هدف عددی معتبر، مسئول شاخص و ارتباط علت‌ومعلولی اهداف مشخص شود؛ صرفِ انتخاب چهار شاخص معادل BSC نهایی نیست.";
}
return {lines,insight,remaining,total,done:completeness};
}
function renderReport(){
const r=analysis(),pct=r.total?Math.round(r.done/r.total*100):0;
$("statusPill").textContent=r.remaining===0?"تکمیل‌شده":"پیش‌نویس · "+r.done+" از "+r.total+" مورد";
$("toolProgress").style.width=pct+"%";
$("toolResult").innerHTML='<p class="output-status">'+(r.remaining===0?"پاسخ‌های این ابزار تکمیل شده‌اند.":"برای تکمیل این ابزار، "+r.remaining+" مورد باقی مانده است.")+'</p><div class="output-list">'+r.lines.map(l=>'<div class="output-line">'+esc(l)+'</div>').join("")+'</div><p class="output-insight"><strong>برداشت از تحلیل:</strong> '+esc(r.insight)+'</p><p class="output-caveat">وضعیت این گزارش: '+(r.remaining===0?"تکمیل‌شده":"پیش‌نویس")+' | فرضیه‌های آموزشی و انتخاب‌های کاربر؛ بدون تأیید داده‌های واقعی شرکت.</p>';
}
function reportText(){const r=analysis(),head=$("toolTitle").textContent.trim();return "به‌پرور | جلسه ششم\n"+head+"\nگزارش اختصاصی این ابزار — "+(r.remaining===0?"تکمیل‌شده":"پیش‌نویس")+"\nنقش پاسخ‌دهنده: "+(st.role==="manager"?"مدیر":st.role==="supervisor"?"سرپرست":"تعیین نشده")+"\n\n"+r.lines.join("\n")+"\n\nبرداشت از تحلیل:\n"+r.insight+"\n\nیادداشت روش‌شناختی: پاسخ‌ها فرضیه‌های آموزشی‌اند؛ نتایج واقعی به داده معتبر، شواهد و بررسی جمعی نیاز دارند.\n";}
function download(){
const blob=new Blob(["\uFEFF"+reportText()],{type:"text/plain;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");
a.href=url;a.download="Behparvar-Session6-"+tool.toUpperCase()+"-Report.txt";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
document.addEventListener("change",e=>{
const el=e.target;if(!el)return;
if(el.dataset.many){const a=st.swot[el.dataset.many]||[];if(el.checked&&a.length>=2){el.checked=false;$("saveStatus").textContent="در هر خانه SWOT فقط دو گزینه انتخاب کنید.";return}
st.swot[el.dataset.many]=el.checked?[...a,el.value]:a.filter(x=>x!==el.value);
}else if(el.dataset.path)set(el.dataset.path,el.value);
else if(el.name==="role")st.role=el.value;
else return;
store();renderReport();
});
$("download").addEventListener("click",download);
$("print").addEventListener("click",()=>window.print());
$("reset").addEventListener("click",()=>{if(!confirm("فقط پاسخ‌های همین ابزار حذف و از ابتدا آغاز شود؟"))return;st=fresh();store();renderForm();$("saveStatus").textContent="پاسخ‌های همین ابزار پاک شدند.";});
renderForm();
})();