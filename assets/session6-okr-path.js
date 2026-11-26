(() => {
 'use strict';
 const {plans,scenarios,units,departments}=window.BehparvarStrategy;
 const storageKey='bp-session6-okr-cascade-v2';
 const format=new Intl.NumberFormat('fa-IR',{useGrouping:false});
 const n=value=>format.format(value);
 const byId=id=>document.getElementById(id);
 const stage=byId('stage'), review=byId('review');
 const option=(value,label,detail='')=>({value,label,detail});
 const step=(id,title,definition,example,question,options,extra={})=>({id,title,definition,example,question,options,...extra});
 let state={answers:{},active:'scenario'};
 try {
  const value=JSON.parse(localStorage.getItem(storageKey));
  if(value && value.answers && typeof value.answers==='object' && !Array.isArray(value.answers)) state=value;
 } catch {}
 const answer=id=>state.answers[id];
 function valid(item){
  const keys=item.options.map(x=>x.value);
  const value=answer(item.id);
  return item.multiple?Array.isArray(value)&&value.length>0&&value.every(x=>keys.includes(x)):keys.includes(value);
 }
 function selectedLabel(item){
  const selected=answer(item.id);
  return item.options.filter(x=>item.multiple?selected?.includes(x.value):x.value===selected).map(x=>x.label).join('، ');
 }
 const list=labels=>labels.map((label,i)=>option(String(i),label));
 function build(){
  const base=[
   step('scenario','موقعیت راهبردی به‌پرور','فرض کارگاه برای ایران امروز، محیط پرنوسان و آینده نامطمئن است. نرخ ارز، هزینه نهاده، انرژی و تقاضا ممکن است هم‌زمان تغییر کنند.','در به‌پرور ممکن است برای یک سفارش، هم تأمین ماده اولیه عقب بیفتد و هم مشتری خریدش را کم کند.','برای طراحی فصل آینده، کدام آینده محتمل را مبنا می‌گیرید؟',Object.entries(scenarios).map(([id,s])=>option(id,s.name,s.story))),
   step('direction','جهت‌گیری راهبردی','رشد و بقا جهت‌گیری‌اند. تمایز و رهبری هزینه شیوه رقابت‌اند. در این تمرین دو ترکیب را می‌سنجید.','به‌پرور می‌تواند برای رشد روی خدمت و کیفیت قابل تشخیص سرمایه‌گذاری کند یا برای بقا با حفظ کیفیت، هزینه هر تن و مصرف نقد را پایین بیاورد.','در سناریوی انتخاب‌شده، چه راهبردی را مبنا می‌گذارید؟',Object.entries(plans).map(([id,p])=>option(id,p.name,p.advantage)),{context:scenarios[answer('scenario')]?.story})
  ];
  const scenario=scenarios[answer('scenario')], direction=answer('direction'), plan=plans[direction];
  if(!scenario||!plan) return base;
  const prefix=answer('scenario')+'-'+direction;
  const growth=direction==='growth';
  const directionSteps=[
   ['ultimate','هدف غایی','هدف غایی اثری است که به‌پرور در بلندمدت برای مشتری و زنجیره پرورش می‌خواهد ایجاد کند.',
    growth?['پرورش‌دهندگان با خوراک باکیفیت و خدمت فنی قابل اتکا، تولید پایدارتر و قابل پیش‌بینی‌تری داشته باشند.','پرورش‌دهندگان با خوراک قابل رهگیری و کیفیت یکنواخت، با اطمینان بیشتری تصمیم بگیرند.']:['پرورش‌دهندگان حتی در دوره اختلال، به خوراک ایمن و قابل تأمین دسترسی داشته باشند.','پایداری زنجیره تولید غذا با دسترسی مداوم به خوراک اقتصادی تقویت شود.']],
   ['mission','مأموریت','مأموریت می‌گوید امروز به چه کسی خدمت می‌کنیم و چگونه به هدف غایی کمک می‌کنیم.',
    growth?['تولید خوراک یکنواخت و ارائه پشتیبانی فنی به پرورش‌دهندگان','عرضه خوراک قابل رهگیری و پاسخ‌گویی فنی به مشتریان هدف']:['تولید و تأمین پایدار خوراک ایمن با بهره‌وری منابع','تأمین اقتصادی خوراک با مدیریت موجودی، اتلاف و کیفیت']],
   ['vision','چشم‌انداز','چشم‌انداز جایگاه مطلوب به‌پرور را در یک افق مشخص توصیف می‌کند.',
    growth?['در سه سال، شریک منتخب مشتریان منطقه برای خوراک با ثبات و خدمت قابل اتکا باشیم.','در سه سال، در بخش هدف بازار با کیفیت مستند و رهگیری محصول شناخته شویم.']:['در سه سال، تأمین‌کننده‌ای پایدار با هزینه رقابتی و تعهد تحویل مطمئن باشیم.','در سه سال، بنگاهی تاب‌آور با کنترل هزینه و توان حفظ تولید در دوره‌های شوک باشیم.']],
   ['values','ارزش سازمانی','ارزش سازمانی برای تصمیم‌های دشوار یک قاعده رفتاری می‌دهد.',
    growth?['ادعای کیفیت را با شواهد آزمون و داده قابل رهگیری پشتیبانی کنیم.','در مواجهه با مغایرت کیفیت، شفاف و سریع به مشتری پاسخ دهیم.']:['برای کاهش هزینه از الزامات ایمنی خوراک عبور نکنیم.','هزینه‌های پنهان و اتلاف را شفاف ثبت و اصلاح کنیم.']],
   ['pillar','رکن راهبردی','رکن راهبردی اولویتی است که تصمیم‌ها و منابع بنگاه را به هدف غایی وصل می‌کند.',
    growth?['تمایز از مسیر کیفیت، رهگیری و خدمت قابل اتکا','رشد در مشتریان هدف از مسیر تجربه متمایز']:['بهره‌وری، کاهش اتلاف و هزینه رقابتی','تاب‌آوری عملیاتی و حفاظت از نقدینگی']]
  ];
  base.push(...directionSteps.map(([id,title,definition,options])=>step(prefix+'-'+id,title,definition,options[0],'کدام عبارت را برای به‌پرور انتخاب می‌کنید؟',list(options))));
  const group=appendScope(base,prefix,'group',direction,scenario);
  const companyId=prefix+'-company';
  base.push(step(companyId,'انتخاب شرکت تابعه','هدف بنگاه می‌تواند مستقیم به دپارتمان‌های مرکزی یا از مسیر یک شرکت تابعه آبشاری شود.','هدف رشد خرید مجدد در بنگاه می‌تواند برای یک شرکت تولیدی به ثبات کیفیت و برای شرکت توزیعی به تحویل به‌موقع تبدیل شود.','این زنجیره از کدام مسیر پایین می‌رود؟',[
   option('direct','مستقیم از بنگاه به دپارتمان‌ها'),option('production',units.production.name+' (نمونه)'),option('distribution',units.distribution.name+' (نمونه)')
  ],{companyName:true}));
  const company=answer(companyId);
  if(!['direct','production','distribution'].includes(company)) return base;
  const child=prefix+'-'+company;
  const companyName=answer(companyId+'-name')?.[company]||units[company]?.name;
  const owner=company==='direct'?group:appendScope(base,child,company,direction,scenario,group,companyName);
  const deptId=child+'-departments';
  base.push(step(deptId,'انتخاب دپارتمان‌ها','اهداف و اقدامات را به واحدهایی بسپارید که می‌توانند بر نتیجه اثر مستقیم یا پشتیبان بگذارند.','برای ثبات کیفیت، خرید می‌تواند ثبات مواد را پیگیری کند و کنترل کیفیت، رهگیری و ریشه‌یابی را بهبود دهد.','کدام دپارتمان‌ها در این زنجیره نقش دارند؟ یک یا چند مورد را انتخاب کنید.',departments.map(id=>option(id,units[id].name)),{multiple:true}));
  const chosen=answer(deptId);
  if(!Array.isArray(chosen)||!chosen.length) return base;
  for(const id of departments.filter(d=>chosen.includes(d))) appendScope(base,child,id,direction,scenario,owner);
  base.push(step(child+'-stress','آزمون سناریویی و مرور پیشرفت','راهبرد را در یک آینده متفاوت آزمایش کنید. اگر نشانه‌های تغییر ظاهر شدند، فرض‌ها و تارگت را بازبینی کنید.','نشانه پایش: '+scenario.signal+' · آستانه بازبینی: '+scenario.trigger,scenario.stress,list(scenario.responses),{context:plan.guardrail+' مرور منظم: هفتگی در مرحله آزمایشی.'}));
  return base;
 }
 function appendScope(steps,prefix,unit,direction,scenario,parent,alias){
  const name=alias||units[unit].name, work=units[unit][direction];
  const node={name};
  const key=prefix+'-'+unit, metricId=key+'-metric', goalId=key+'-goal';
  const context={scope:name,section:key};
  steps.push(step(goalId,'هدف راهبردی','تغییر مطلوب این سطح را مشخص کنید. هدف این واحد باید سهمی روشن در هدف بالادست داشته باشد.',work.objective,'کدام صورت‌بندی را برای این فصل ثبت می‌کنید؟',[
   option('whole',work.objective),option('pilot','در دامنه آزمایشی شروع کنیم: '+work.objective)
  ],{...context,context:parent?'هم‌راستا با '+parent.name+(parent.result?' · '+parent.result:''):undefined}));
  steps.push(step(metricId,'شاخص عملکرد (KPI)','شاخص مشخص می‌کند عملکرد را با چه معیار و واحدی بسنجیم. مقدار مبنا در این تمرین نمونه است.',work.metrics[0].label+' · واحد: '+work.metrics[0].unit,'در این سطح کدام شاخص برای پایش هدف مناسب‌تر است؟',work.metrics.map((m,i)=>option(String(i),m.label,'مقدار مبنا: '+n(m.base)+m.unit)),context));
  const metricIndex=answer(metricId), metric=work.metrics.find((_,i)=>String(i)===metricIndex);
  if(!metric) return node;
  const targetId=key+'-target-'+metricIndex+'-'+answer(goalId);
  const choices=targetOptions(metric,scenario);
  steps.push(step(targetId,'تارگت و نتیجه کلیدی (KR)','تارگت مقدار مقصد شاخص است. نتیجه کلیدی مقدار مبنا، تارگت و مهلت را در یک جمله به هم وصل می‌کند.',kr(metric,choices[0],answer(goalId)),'کدام سطح تغییر با سناریو و ظرفیت این واحد سازگارتر است؟',choices.map((value,i)=>option(String(value),kr(metric,value,answer(goalId)),i===0?'تعهد محتاطانه‌تر در این سناریو':'تعهد بلندپروازانه‌تر با ظرفیت و منابع بیشتر')),context));
  const target=answer(targetId);
  if(!choices.map(String).includes(target)) return node;
  node.result=kr(metric,target,answer(goalId));
  steps.push(step(key+'-action-'+metricIndex,'اقدام اجرایی','اقدام کاری است که واحد مسئول برای تغییر نتیجه کلیدی انجام می‌دهد. اثر اقدام را در مرور هفتگی بررسی کنید.',work.actions[metricIndex],'برای شروع، کدام اقدام را به این واحد می‌سپارید؟',list([work.actions[metricIndex],'روند همین شاخص را برای یک ماه هفتگی بررسی کنیم و پرتکرارترین مانع را با یک پایلوت محدود برطرف کنیم.']),context));
  return node;
 }
 function targetOptions(metric,scenario){
  if(scenario===scenarios.opening) return [metric.balanced,metric.stretch];
  const ratio=scenario===scenarios.shock?0.4:0.7;
  const delta=metric.balanced-metric.base;
  const guarded=metric.base+Math.sign(delta)*Math.max(1,Math.round(Math.abs(delta)*ratio));
  return [...new Set([guarded,metric.balanced])];
 }
 function kr(metric,target,draft){
  return (draft==='pilot'?'در دامنه آزمایشی، ':'')+metric.label+' تا پایان فصل از '+n(metric.base)+metric.unit+' به '+n(Number(target))+metric.unit;
 }
 function escape(value){
  return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
 }
 function save(){
  try{localStorage.setItem(storageKey,JSON.stringify(state));}
  catch{byId('storage-status').textContent='این مرورگر اجازه ذخیره نمی‌دهد. صفحه را تا پایان تمرین باز نگه دارید.';}
 }
 function go(id){
  state.active=id;
  save();
  render(true);
 }
 function render(focus=false){
  const steps=build(), incomplete=steps.findIndex(s=>!valid(s));
  const complete=incomplete<0 && steps.at(-1)?.id.endsWith('-stress');
  let index=steps.findIndex(s=>s.id===state.active);
  if(index<0 && !(complete&&state.active==='summary')) index=Math.max(0,incomplete);
  if(incomplete>=0 && index>incomplete)index=incomplete;
  const item=steps[index];
  const progress=byId('step-progress');
  const answered=steps.filter(valid).length;
  byId('step-label').textContent=item?(item.scope?item.scope+' · ':'')+'گام '+n(index+1):'جمع‌بندی';
  progress.max=steps.length;progress.value=answered;
  review.hidden=!complete||!item;
  if(item) renderStep(item,steps,index);
  else renderSummary(steps);
  if(focus){byId('stage-title').focus({preventScroll:true});window.scrollTo(0,0);}
 }
 function renderStep(item,steps,index){
  const previous=steps[index-1];
  const context=item.context||((previous&&valid(previous)&&!previous.multiple&&!item.companyName&&!item.multiple&& !['scenario','direction'].includes(item.id))?selectedLabel(previous):'');
  const choices=item.options.map(o=>'<label class="choice"><input type="'+(item.multiple?'checkbox':'radio')+'" name="answer" value="'+escape(o.value)+'" '+(!item.multiple?'required ':'')+((item.multiple?answer(item.id)?.includes(o.value):answer(item.id)===o.value)?'checked':'')+'><span>'+escape(o.label)+(o.detail?'<span class="option-detail">'+escape(o.detail)+'</span>':'')+'</span></label>').join('');
  stage.innerHTML='<h2 id="stage-title" tabindex="-1">'+escape(item.title)+'</h2>'+ (context?'<p class="context">'+escape(context)+'</p>':'')+
    '<p>'+escape(item.definition)+'</p><p class="example"><strong>مثال به‌پرور</strong><br>'+escape(item.example)+'</p>'+
    '<form><fieldset><legend>'+escape(item.question)+'</legend>'+choices+'</fieldset>'+(item.companyName?'<label for="company-name">نام شرکت تابعه (اختیاری)</label><input id="company-name" name="companyName" maxlength="80" value="'+escape(answer(item.id+'-name')?.[answer(item.id)]||'')+'">':'')+'<p role="alert" id="choice-error" hidden>دست‌کم یک دپارتمان را انتخاب کنید.</p>'+
    '<div class="actions"><button type="submit" class="primary">'+(item.id.endsWith('-stress')?'دیدن زنجیره کامل':'گام بعدی ←')+'</button>'+
    (previous?'<button type="button" data-step="'+previous.id+'">گام قبل</button>':'')+'</div></form>'+
    (item.id==='scenario'?'<details class="sources"><summary>مبنای سناریوها</summary><p>این سه وضعیت، آینده‌های محتمل برای تمرین‌اند. سیگنال‌ها و آستانه‌ها باید با داده‌های به‌پرور تنظیم شوند.</p><a href="https://www.worldbank.org/ext/en/country/iran" target="_blank" rel="noopener noreferrer">زمینه اقتصاد ایران · بانک جهانی</a><br><a href="https://www.oecd.org/en/publications/strategic-foresight-toolkit-for-resilient-public-policy_bcd2dd12-en.html" target="_blank" rel="noopener noreferrer">سناریونویسی و آزمون راهبرد · OECD</a></details>':'');
  state.active=item.id;
 }
 function renderSummary(steps){
  const scenario=scenarios[answer('scenario')], plan=plans[answer('direction')];
  const outline=new Map();
  for(const item of steps){
   const key=item.section|| (item.id.endsWith('-stress')?'check-in':'foundation');
   const title=item.scope||(key==='check-in'?'مرور و واکنش به تغییر سناریو':'مبنای راهبرد و دامنه آبشار');
   if(!outline.has(key))outline.set(key,{title,items:[]});
   outline.get(key).items.push(item);
  }
  const sections=[...outline.values()].map(({title,items})=>'<h3>'+escape(title)+'</h3><ol class="chain">'+items.map(item=>
    '<li><strong>'+escape(item.title)+'</strong><br>'+escape(selectedLabel(item))+' <button type="button" data-step="'+item.id+'" aria-label="ویرایش '+escape(item.title+(item.scope?' · '+item.scope:''))+'">ویرایش</button></li>'
  ).join('')+'</ol>').join('');
  stage.innerHTML='<h2 id="stage-title" tabindex="-1">زنجیره استراتژی و OKR شما</h2><p class="example">'+escape(scenario.name+' · '+plan.name)+'<br>'+escape(scenario.trigger)+'<br>'+escape(plan.guardrail)+'</p>'+
    sections+'<div class="actions"><button class="primary" type="button" id="print">چاپ یا ذخیره PDF</button></div>';
 }
 stage.addEventListener('change',event=>{
  if(event.target.name!=='answer')return;
  const field=byId('company-name');if(!field)return;
  const id=state.active,company=event.target.value;
  field.disabled=company==='direct';
  if(answer(id)||field.dataset.company)field.value=answer(id+'-name')?.[company]||'';
  field.dataset.company=company;
 });
 stage.addEventListener('submit',event=>{
  event.preventDefault();
  const current=build().find(s=>s.id===state.active);if(!current)return;
  const form=new FormData(event.target), choices=form.getAll('answer');
  if(!choices.length){byId('choice-error').hidden=false;return;}
  state.answers[current.id]=current.multiple?choices:choices[0];
  if(current.companyName&&choices[0]!=='direct'){
   const names=state.answers[current.id+'-name']??={};names[choices[0]]=String(form.get('companyName')||'').trim();
  }
  const revised=build(), index=revised.findIndex(s=>s.id===current.id);
  go(revised[index+1]?.id||'summary');
 });
 stage.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button)return;
  if(button.hasAttribute('data-step'))go(button.dataset.step);
  if(button.id==='print')window.print();
 });
 review.addEventListener('click',()=>go('summary'));
 render();
})();
