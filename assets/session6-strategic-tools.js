/* Strategic management toolkit for Behparvar – illustrative, non-validated scenarios. */
(()=>{"use strict";
const K="bp-s6-strategic-toolkit-v2", $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const initial=()=>({role:"",pest:{},porter:{},swot:{s:[],w:[],o:[],t:[]},ansoff:"",q:{first:"",second:"",rows:{}},seven:{},bsc:{},action:""});
let st=initial();
try{const p=JSON.parse(localStorage.getItem(K)||"null");if(p&&typeof p==="object")st={...initial(),...p,swot:{...initial().swot,...p.swot},q:{...initial().q,...p.q}};}catch(e){}
function val(path){return path.split(".").reduce((v,k)=>v?.[k],st)}
function set(path,value){const a=path.split(".");let ob=st;for(let i=0;i<a.length-1;i++)ob=ob[a[i]]??(ob[a[i]]={});ob[a.at(-1)]=value}
function save(){try{localStorage.setItem(K,JSON.stringify(st));$("saveStatus").textContent="انتخاب‌ها فقط در مرورگر این دستگاه ذخیره شدند."}catch(e){$("saveStatus").textContent="مرورگر اجازه ذخیره نداد؛ گزارش متنی را دریافت کنید."}}
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
function label(options,id){return options.find(x=>x[0]===id)?.[1]||""}
function box(title,desc,body){return '<div class="question"><h3>'+esc(title)+'</h3><p>'+esc(desc)+'</p>'+body+'</div>'}
function drop(options,path,placeholder){return '<select data-path="'+esc(path)+'" aria-label="'+esc(placeholder)+'"><option value="">'+esc(placeholder)+'</option>'+options.map(([k,v])=>'<option value="'+esc(k)+'"'+(String(val(path)??"")===String(k)?" selected":"")+'>'+esc(v)+'</option>').join("")+'</select>'}
function radio(options,path){return '<div class="options">'+options.map(([k,v])=>'<label><input data-path="'+esc(path)+'" name="'+esc(path)+'" type="radio" value="'+esc(k)+'"'+(val(path)===k?" checked":"")+'><span>'+esc(v)+'</span></label>').join("")+'</div>'}
function forms(){
$("pestForm").innerHTML=pest.map(d=>box(d.name,d.desc,radio(d.opts,"pest."+d.id+".factor")+'<div class="pair"><span>اثر احتمالی بر آینده:</span>'+drop([["o","فرصت رشد"],["t","تهدید راهبردی"],["x","باید بیشتر بررسی شود"]],"pest."+d.id+".impact","یک گزینه")+'</div>')).join("");
$("porterForm").innerHTML=porter.map(d=>box(d.name,d.desc,'<div class="pair"><span>شدت نیرو:</span>'+drop([["1","کم"],["2","متوسط"],["3","زیاد"],["x","اطلاع کافی ندارم"]],"porter."+d.id,"انتخاب کنید")+'</div>')).join("");
$("swotForm").innerHTML=swot.map(d=>box(d.name,d.desc+" (یک یا دو گزینه)",'<div class="options">'+d.opts.map(([k,v])=>'<label><input type="checkbox" data-many="'+d.id+'" value="'+k+'"'+((st.swot[d.id]||[]).includes(k)?" checked":"")+'><span>'+esc(v)+'</span></label>').join("")+'</div>')).join("");
$("ansoffForm").innerHTML=strats.map(d=>'<label><input data-path="ansoff" name="ansoff" type="radio" value="'+d.id+'"'+(st.ansoff===d.id?" checked":"")+'><strong>'+esc(d.name)+'</strong><small>'+esc(d.desc)+" · "+esc(d.why)+'</small></label>').join("");
$("sevenForm").innerHTML=seven.map(d=>box(d.name,d.desc,'<div class="pair"><span>وضعیت احتمالی:</span>'+drop([["yes","هم‌راستا"],["no","نیازمند تقویت"],["x","داده کافی نداریم"]],"seven."+d.id,"انتخاب کنید")+'</div>')).join("");
$("bscForm").innerHTML=bsc.map(d=>box(d.name,d.desc,'<div class="pair"><span>هدف راهبردی:</span>'+drop(d.opts.map(v=>[v[0],v[1]]),"bsc."+d.id+".metric","انتخاب هدف")+'</div><div class="pair"><span>افق هدف‌گذاری:</span>'+drop([["year","یک ساله"],["three","سه ساله"],["research","ابتدا باید خط مبنا مشخص شود"]],"bsc."+d.id+".horizon","انتخاب بازه")+'</div>')).join("");
const choices='<option value="">انتخاب کنید</option>'+strats.map(x=>'<option value="'+x.id+'">'+esc(x.name)+'</option>').join("");
$("qa").innerHTML=choices;$("qb").innerHTML=choices;$("qa").dataset.path="q.first";$("qb").dataset.path="q.second";$("qa").value=st.q.first;$("qb").value=st.q.second;
document.querySelectorAll('input[name=role]').forEach(x=>x.checked=x.value===st.role);
document.querySelectorAll('input[name=action]').forEach(x=>x.checked=x.value===st.action);
qRows();draw();
}
const fallback=[
{id:"d1",name:"دسترسی پایدار به مواد اولیه",tag:"ریسک بیرونی"},
{id:"d2",name:"توان فنی و کیفیت محصول",tag:"توان داخلی"},
{id:"d3",name:"محدودیت منابع توسعه",tag:"محدودیت داخلی"},
{id:"d4",name:"تقاضای محصولات تخصصی",tag:"فرصت بیرونی"},
{id:"d5",name:"شدت رقابت قیمتی",tag:"تهدید بیرونی"},
{id:"d6",name:"امکان ورود به بازار تازه",tag:"فرصت بیرونی"}
];
function factors(){const fs=[];for(const d of swot)for(const id of st.swot[d.id]||[]){const name=label(d.opts,id);if(name)fs.push({id:d.id+id,name,tag:d.name})}for(const d of fallback){if(fs.length>=6)break;fs.push(d)}return fs}
const attractiveness=[["0","۰ - نامرتبط"],["1","۱ - کم"],["2","۲ - متوسط"],["3","۳ - زیاد"],["4","۴ - بسیار زیاد"]];
function qRows(){
const weights=[["1","۱"],["2","۲"],["3","۳"],["4","۴"],["5","۵"]];
$("qspmRows").innerHTML=factors().map(f=>'<tr><th scope="row">'+esc(f.name)+'<br><small>'+esc(f.tag)+'</small></th><td>'+drop(weights,"q.rows."+f.id+".w","اهمیت ۱ تا ۵")+'</td><td>'+drop(attractiveness,"q.rows."+f.id+".a","تناسب اول")+'</td><td>'+drop(attractiveness,"q.rows."+f.id+".b","تناسب دوم")+'</td></tr>').join("");
}
function qscore(){
const a=st.q.first,b=st.q.second;
if(!a||!b)return{ok:false,text:"دو راهبرد را برای مقایسه انتخاب کنید."};
if(a===b)return{ok:false,text:"برای مقایسه باید دو راهبرد متفاوت انتخاب شوند."};
const rows=factors().map(f=>({...f,...(st.q.rows[f.id]||{})}));
if(rows.some(r=>!r.w||r.a==null||r.a===""||r.b==null||r.b===""))return{ok:false,text:"برای هر عامل، اهمیت و میزان جذابیت هر دو راهبرد را انتخاب کنید."};
if(rows.some(r=>(r.a==="0")!==(r.b==="0")))return{ok:false,text:"اگر عاملی برای این دو راهبرد نامرتبط است، برای هر دو صفر انتخاب کنید؛ وگرنه هر دو را ۱ تا ۴ امتیاز دهید."};
const ws=rows.reduce((s,r)=>s+Number(r.w),0),A=rows.reduce((s,r)=>s+Number(r.w)*Number(r.a)/ws,0),B=rows.reduce((s,r)=>s+Number(r.w)*Number(r.b)/ws,0);
const na=strats.find(x=>x.id===a).name,nb=strats.find(x=>x.id===b).name;
const comparison=Math.abs(A-B)<.05?"امتیازها بسیار نزدیک‌اند و هیچ گزینه‌ای برتری روشنی ندارد.":A>B?na+" امتیاز بیشتری دارد.":nb+" امتیاز بیشتری دارد.";
return{ok:true,A,B,na,nb,text:"امتیاز "+na+": "+A.toFixed(2)+" | امتیاز "+nb+": "+B.toFixed(2)+". "+comparison+" این نتیجه بر پایه قضاوت‌های آموزشی شماست؛ پیش از تصمیم واقعی، شواهد و حساسیت وزن‌ها را بررسی کنید."};
}
const selectedSWOT=()=>swot.map(d=>({name:d.name,items:(st.swot[d.id]||[]).map(x=>label(d.opts,x))}));
function draw(){
$("roleHint").textContent=st.role==="manager"?"مسیر مدیر: تصمیم درباره جهت شرکت، اولویت رشد و تخصیص منابع.":st.role==="supervisor"?"مسیر سرپرست: شناخت انتخاب‌های کلان شرکت و نشان دادن اثر راهبرد بر واحدها؛ پاسخ‌ها درباره آینده کل شرکت‌اند.":"نقش خود را انتخاب کنید؛ همه سؤال‌ها در سطح آینده و راهبرد شرکت‌اند.";
const p=pest.filter(d=>val("pest."+d.id+".factor")&&val("pest."+d.id+".impact")).length;
$("pestResult").innerHTML='<strong>'+p+' از ۶ بُعد بررسی شده است.</strong><p>از خودتان بپرسید: «کدام تغییر بیرونی، در سه سال آینده مسیر شرکت را عوض می‌کند؟»</p>';
const pressures=porter.filter(d=>["1","2","3"].includes(val("porter."+d.id))).map(d=>({name:d.name,value:Number(val("porter."+d.id))}));
const max=pressures.filter(x=>x.value===3).map(x=>x.name);
$("porterResult").innerHTML='<strong>'+porter.filter(d=>val("porter."+d.id)).length+' از ۵ نیرو بررسی شده است.</strong><p>'+esc(max.length?"نیروهای پرفشار احتمالی: "+max.join("، "):"هنوز نیرویی با فشار زیاد انتخاب نشده است.")+'</p>';
const s=selectedSWOT(),nc=s.reduce((n,d)=>n+(d.items.length?1:0),0);
$("swotResult").innerHTML='<strong>'+nc+' خانه از ۴ خانه تکمیل شده است.</strong><p>فرق اصلی را حفظ کنید: قوت و ضعف، مربوط به درون شرکت هستند؛ فرصت و تهدید، از محیط بیرون می‌آیند.</p>';
const a=strats.find(x=>x.id===st.ansoff);
$("ansoffResult").innerHTML=a?'<strong>مسیر رشد انتخابی: '+esc(a.name)+'</strong><p>پیش از تصمیم، این سؤال را بررسی کنید: '+esc(a.test)+'</p>':'یک مسیر رشد را انتخاب کنید تا فرضیه اصلی آن روشن شود.';
const sc=qscore();$("qspmResult").innerHTML='<strong>'+(sc.ok?"نتیجه مقایسه":"مقایسه هنوز کامل نیست")+'</strong><p>'+esc(sc.text)+'</p>';
const issues=seven.filter(d=>val("seven."+d.id)==="no").map(x=>x.name);
$("sevenResult").innerHTML='<strong>'+seven.filter(d=>val("seven."+d.id)).length+' از ۷ بُعد بررسی شده است.</strong><p>'+esc(issues.length?"برای اجرای راهبرد، این بخش‌ها ممکن است نیازمند تقویت باشند: "+issues.join("، "):"هنوز مانع اجرایی انتخاب نشده است؛ وضعیت را با شواهد شرکت بررسی کنید.")+'</p>';
$("bscResult").innerHTML='<strong>'+bsc.filter(d=>val("bsc."+d.id+".metric")&&val("bsc."+d.id+".horizon")).length+' از ۴ منظر تکمیل شده است.</strong><p>شاخص‌ها هدف پیشنهادی‌اند؛ بدون داده واقعی نمی‌توان مقدار پیشرفت شرکت را اعلام کرد.</p>';
const count=[p===6,porter.every(d=>val("porter."+d.id)),nc===4,!!a,sc.ok,seven.every(d=>val("seven."+d.id)),bsc.every(d=>val("bsc."+d.id+".metric")&&val("bsc."+d.id+".horizon"))].filter(Boolean).length;
$("completionLabel").textContent=count+" از ۷ ابزار تکمیل شده است";$("progressFill").style.width=(count/7*100)+"%";
let items=[
["PESTLE | تحولات محیطی",pest.map(d=>{const k=val("pest."+d.id+".factor");return k?d.name+": "+label(d.opts,k)+" ("+({o:"فرصت",t:"تهدید",x:"نیازمند بررسی"}[val("pest."+d.id+".impact")]||"اثر نامشخص")+")":null}).filter(Boolean).join("؛ ")],
["پنج نیروی پورتر",porter.map(d=>val("porter."+d.id)?d.name+": "+({1:"کم",2:"متوسط",3:"زیاد",x:"نامشخص"}[val("porter."+d.id)]):null).filter(Boolean).join("؛ ")],
["SWOT | عوامل کلیدی",s.map(x=>x.items.length?x.name+": "+x.items.join("، "):null).filter(Boolean).join("؛ ")],
["آنسوف | مسیر رشد",a?a.name+" — "+a.why:""],
["QSPM | انتخاب بین دو راهبرد",sc.ok?sc.text:"هنوز تکمیل نشده"],
["7S | آمادگی اجرای راهبرد",seven.map(d=>val("seven."+d.id)?d.name+": "+({yes:"هم‌راستا",no:"نیازمند تقویت",x:"نامشخص"}[val("seven."+d.id)]):null).filter(Boolean).join("؛ ")],
["BSC | ترجمه راهبرد به اهداف",bsc.map(d=>{const k=val("bsc."+d.id+".metric");const target=val("bsc."+d.id+".horizon");return k?d.name+": "+label(d.opts,k)+(target?" ("+({year:"افق یک‌ساله",three:"افق سه‌ساله",research:"نیازمند تعیین خط مبنا"}[target])+")":""):""}).filter(Boolean).join("؛ ")]
];
$("reportBody").innerHTML=items.map(([h,t])=>'<div class="report-row"><strong>'+esc(h)+'</strong><p>'+esc(t||"هنوز انتخابی ثبت نشده است.")+'</p></div>').join("");
}
function report(){const rows=[...$("reportBody").querySelectorAll(".report-row")].map(el=>el.innerText.trim());const act={data:"بررسی داده‌ها و شواهد",discuss:"گفت‌وگوی راهبردی با تیم",pilot:"تعریف آزمایش محدود پیش از تصمیم کلان"}[st.action]||"هنوز انتخاب نشده است";return "به‌پرور | کاربرگ جلسه ششم | ابزارهای مدیریت استراتژیک\n\n"+rows.join("\n\n")+"\n\nگام بعدی: "+act+"\n\nتوجه: فرضیه‌ها و امتیازها آموزشی‌اند و نشان‌دهنده عملکرد تأییدشده شرکت نیستند.\n";}
document.addEventListener("change",ev=>{
const el=ev.target;if(!el)return;
if(el.dataset.many){const id=el.dataset.many;const a=st.swot[id]||[];if(el.checked&&a.length>=2){el.checked=false;$("saveStatus").textContent="در هر خانه SWOT حداکثر دو مورد انتخاب کنید.";return}st.swot[id]=el.checked?[...a,el.value]:a.filter(x=>x!==el.value);qRows();}
else if(el.dataset.path){set(el.dataset.path,el.value)}
else if(el.name==="role"){st.role=el.value}
else if(el.name==="action"){st.action=el.value}
else return;
save();draw();
});
$("download").addEventListener("click",()=>{const blob=new Blob([report()],{type:"text/plain;charset=utf-8"});const url=URL.createObjectURL(blob);const anchor=document.createElement("a");anchor.href=url;anchor.download="Behparvar-Session6-Strategic-Tools.txt";document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),2000)});
$("print").addEventListener("click",()=>window.print());
$("reset").addEventListener("click",()=>{if(confirm("همه انتخاب‌های این کاربرگ حذف و تحلیل از ابتدا آغاز شود؟")){st=initial();save();forms()}});
forms();
})();