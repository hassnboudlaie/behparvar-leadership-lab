/* Membership and personal notes are read through the authenticated API only. */
let organizationDirectory=[], organizationMeetings=[], meetingLoad='idle', meetingError='', privateSelection=0;
function clearOrganization(){
 organizationDirectory=[];organizationMeetings=[];meetingLoad='idle';meetingError='';privateSelection++;orgReviews={state:'idle',cycles:[],entries:[],error:''};
}
function memberName(id){return organizationDirectory.find(person=>person.user_id===id)?.display_name||'عضو سازمان'}
function memberField(record){
 if(!cloud)return field('owner','مسئول',record.owner);
 const values=[['',record.owner?'مسئول قبلی: '+record.owner:'تعیین نشده'],...organizationDirectory.map(m=>[m.user_id,m.display_name])];
 return options('ownerId','مسئول',values,record.ownerId||'');
}
function organizationHome(){
 const uid=cloud.userId,leading=data.goals.filter(g=>g.ownerId===uid&&isOpenGoal(g)),supporting=data.goals.filter(g=>g.contributors?.includes(uid)&&isOpenGoal(g));
 const tasks=data.tasks.filter(t=>t.ownerId===uid),teams=data.teams.filter(t=>teamMemberIds(t).includes(uid));
 const reports=organizationDirectory.filter(p=>data.reportingLines?.[p.user_id]===uid);
 const tabs=[['goals','اهداف',new Set([...leading,...supporting]).size],['tasks','اقدامات',tasks.length],['teams','تیم‌ها',teams.length],['reports','همکاران مستقیم',reports.length],['kudos','قدردانی‌ها',null]];
 const selected=tabs.some(([k])=>k===homeTab)?homeTab:'goals';
 let rows='',filters='';
 if(selected==='goals'){
  filters='<div class="segments">'+[['leading','مسئول هدف'],['contributing','مشارکت‌کننده']].map(([k,n])=>'<button data-act="responsibility:'+k+'" aria-pressed="'+(responsibilityFilter===k)+'">'+n+'</button>').join('')+'</div>';
  rows=(responsibilityFilter==='leading'?leading:supporting).map(g=>'<div class="action"><button data-id="'+esc(g.id)+'">'+esc(g.name)+'</button>'+refProgress(g)+'</div>').join('');
 }else if(selected==='tasks')rows=tasks.map(t=>'<p>'+esc(t.name)+' · '+(t.done?'تکمیل‌شده':'باز')+'</p>').join('');
 else if(selected==='teams')rows=teams.map(t=>btn('team-profile:'+encodeURIComponent(t),esc(t),'secondary')).join(' ');
 else if(selected==='reports')rows=reports.map(p=>btn('org-person:'+p.user_id,esc(p.display_name),'secondary')).join(' ');
 const progressActions=leading.filter(g=>!drivenByChildren(g)&&cloud.role==='admin').map(g=>'<div class="action">'+esc(g.name)+btn('checkin:'+g.id,'ثبت پیشرفت')+'</div>').join('');
 if(orgReviews.state==='idle')queueMicrotask(loadOrgReviews);
 const reviews=orgReviews.entries.filter(e=>!e.completed&&e.evaluator_id===uid).map(e=>'<div class="action">'+esc(orgReviews.cycles.find(c=>c.id===e.cycle_id)?.name)+btn('org-entry:'+e.id,'ثبت ارزیابی')+'</div>').join('');
 const pending=orgReviews.state==='error'?'<p>'+esc(orgReviews.error)+'</p>':'';
 return heading(memberName(uid),'خانه')+panel('مرکز اقدامات',progressActions+reviews+pending||'اقدامی ثبت نشده است.')+panel('مسئولیت‌های من','<div class="tabline">'+tabs.map(([k,n,count])=>'<button data-act="home-tab:'+k+'" class="'+(selected===k?'selected':'')+'">'+n+(count===null?'':' · '+fa(count))+'</button>').join('')+'</div>'+filters+(rows||(selected==='kudos'?'<p>داده قدردانی برای این حساب در دسترس نیست.</p>':'<p>موردی ثبت نشده است.</p>')));
}
async function loadMeetings(){
 if(!cloud||meetingLoad==='loading')return;
 const epoch=cloudEpoch;meetingLoad='loading';meetingError='';
 try{
  const rows=await requestCloud('/rest/v1/behparvar_okr_meetings?select=id,host_id,partner_id,scheduled_at,topics,notes,tasks,revision&order=scheduled_at.desc');
  if(epoch!==cloudEpoch)return;
  organizationMeetings=rows;meetingLoad='ready';
 }catch(e){if(epoch!==cloudEpoch)return;meetingLoad='error';meetingError=e.message}
 if(cloud&&page==='meetings')render();
}
function organizationMeetingList(){
 if(meetingLoad==='idle')queueMicrotask(loadMeetings);
 const add=cloud.role==='admin'&&organizationDirectory.length>1?btn('org-schedule','زمان‌بندی جلسه'):'';
 return heading('جلسات یک‌به‌یک','',add)+panel('جلسات من',meetingLoad==='error'?esc(meetingError)+btn('org-refresh','تلاش دوباره'):meetingLoad!=='ready'?'در حال دریافت…':organizationMeetings.map(m=>'<div class="action">'+btn('org-open:'+m.id,esc(memberName(m.host_id===cloud.userId?m.partner_id:m.host_id)),'secondary')+'<time>'+esc(new Date(m.scheduled_at).toLocaleString('fa-IR'))+'</time></div>').join('')||'جلسه‌ای ثبت نشده است.')+(organizationDirectory.length<2&&cloud.role==='admin'?'<p>زمان‌بندی جلسه پس از عضویت همکار دوم در دسترس است.</p>':'');
}
function scheduleMeeting(partner=''){
 const people=organizationDirectory.filter(p=>p.user_id!==cloud.userId);
 modal('زمان‌بندی جلسه بعدی','<form id="orgSchedule">'+options('partner','همکار',people.map(p=>[p.user_id,p.display_name]),partner)+'<label>زمان جلسه <input type="datetime-local" name="scheduled" required></label><label>موضوعات گفت‌وگو<textarea name="topics"></textarea></label>'+dialogFooter()+'</form>');
}
async function openOrgMeeting(id){
 const m=organizationMeetings.find(x=>x.id===id);if(!m)return;
 const epoch=cloudEpoch,selection=++privateSelection;
 modal('جلسه یک‌به‌یک','<p id="loading-private-note">در حال دریافت یادداشت‌ها…</p>');
 const pending=document.querySelector('#loading-private-note');
 try{
  const notes=await requestCloud('/rest/v1/behparvar_okr_private_notes?meeting_id=eq.'+encodeURIComponent(id)+'&select=note,revision');
  if(epoch!==cloudEpoch||selection!==privateSelection||!pending.isConnected)return;
  const other=m.host_id===cloud.userId?m.partner_id:m.host_id,edit=cloud.role==='admin';
  const related=data.goals.filter(g=>g.ownerId===other&&isOpenGoal(g));
  const taskRows=m.tasks.map((t,i)=>'<label class="check"><input type="checkbox" name="done" value="'+i+'" '+(t.done?'checked':'')+'>'+esc(t.name)+' · '+esc(memberName(t.ownerId))+' · '+esc(t.due)+'</label>').join('');
  const fields='<fieldset '+(edit?'':'disabled')+'><label>موضوعات گفت‌وگو<textarea name="topics">'+esc(m.topics)+'</textarea></label><label>یادداشت مشترک<textarea name="notes">'+esc(m.notes)+'</textarea></label><h3>اقدامات جلسه</h3>'+taskRows+(edit?'<label>اقدام جدید<input name="task"></label>'+options('owner','مسئول اقدام',[m.host_id,m.partner_id].map(id=>[id,memberName(id)]),cloud.userId)+'<label>موعد اقدام<input type="date" name="due"></label>':'')+'</fieldset>';
  modal('جلسه با '+esc(memberName(other)),'<p>'+esc(new Date(m.scheduled_at).toLocaleString('fa-IR'))+'</p><form id="orgShared" data-id="'+id+'">'+fields+(edit?'<button class="primary">ذخیره تغییرات جلسه</button>':'')+'</form><form id="orgPrivate" data-id="'+id+'" data-revision="'+(notes[0]?.revision??'')+'"><label>یادداشت خصوصی · فقط برای من<textarea name="note">'+esc(notes[0]?.note??'')+'</textarea></label><button class="primary">ذخیره یادداشت خصوصی</button></form><h3>اهداف همکار</h3>'+related.map(g=>'<p>'+esc(g.name)+'</p>').join('')+(related.length?'':'هدف فعالی به این همکار تخصیص داده نشده است.')+(edit?'<p>'+btn('org-schedule:'+other,'زمان‌بندی جلسه بعدی','secondary')+'</p>':''));
 }catch(e){if(epoch===cloudEpoch&&pending.isConnected)pending.textContent=e.message}
}
window.addEventListener('submit',async e=>{
 const form=e.target;
 if(!cloud||!['orgSchedule','orgShared','orgPrivate'].includes(form.id))return;
 e.preventDefault();e.stopImmediatePropagation();
 if(form.dataset.busy)return;
 const epoch=cloudEpoch,fd=new FormData(form),v=Object.fromEntries(fd),id=form.dataset.id;
 if(form.id!=='orgPrivate'&&cloud.role!=='admin')return;
 form.dataset.busy='1';
 try{
  let path='/rest/v1/behparvar_okr_meetings',method='POST',body;
  if(form.id==='orgSchedule'){
   body={partner_id:v.partner,scheduled_at:new Date(v.scheduled).toISOString(),topics:v.topics};
  }else if(form.id==='orgShared'){
   const m=organizationMeetings.find(x=>x.id===id);if(!m)return;
   const tasks=m.tasks.map((t,i)=>({...t,done:fd.getAll('done').includes(String(i))}));
   if(v.task.trim()){if(!v.due){alert('موعد اقدام را وارد کنید.');return}tasks.push({name:v.task.trim(),due:v.due,ownerId:v.owner,done:false})}
   path+='?id=eq.'+id+'&revision=eq.'+m.revision;method='PATCH';body={topics:v.topics,notes:v.notes,tasks,revision:m.revision+1};
  }else{
   path='/rest/v1/behparvar_okr_private_notes';const rev=form.dataset.revision;
   if(rev==='')body={meeting_id:id,note:v.note};
   else{method='PATCH';path+='?meeting_id=eq.'+id+'&author_id=eq.'+cloud.userId+'&revision=eq.'+Number(rev);body={note:v.note,revision:Number(rev)+1}}
  }
  const result=await requestCloud(path,{method,headers:{Prefer:'return=representation'},body:JSON.stringify(body)});
  if(epoch!==cloudEpoch)return;
  if(!result?.length)throw Error('نسخه جلسه تغییر کرده است. جلسه را دوباره باز کنید.');
  if(form.isConnected)act('close');meetingLoad='idle';await loadMeetings();
 }catch(err){if(epoch===cloudEpoch&&form.isConnected)alert(err.message)}finally{delete form.dataset.busy}
},true);
let orgReviews={state:'idle',cycles:[],entries:[],error:''};
async function loadOrgReviews(){
 if(!cloud||orgReviews.state==='loading')return;
 const epoch=cloudEpoch;orgReviews.state='loading';
 try{
  const [cycles,entries]=await Promise.all([
   requestCloud('/rest/v1/behparvar_okr_cycles?select=*&order=created_at.desc'),
   requestCloud('/rest/v1/behparvar_okr_assessments?select=*&order=id')
  ]);
  if(epoch!==cloudEpoch)return;
  orgReviews={state:'ready',cycles,entries,error:''};
 }catch(e){if(epoch!==cloudEpoch)return;orgReviews.state='error';orgReviews.error=e.message}
 if(cloud&&['people','home'].includes(page))render();
}
function reviewCards(entries){
 return entries.map(e=>{
  const c=orgReviews.cycles.find(c=>c.id===e.cycle_id);
  return '<div class="action"><div><b>'+esc(memberName(e.subject_id))+'</b><p>'+esc(c?.name)+' · '+(e.kind==='self'?'خودارزیابی':'ارزیابی مدیر')+'</p></div>'+btn('org-entry:'+e.id,e.completed?'مشاهده':'تکمیل ارزیابی','secondary')+'</div>';
 }).join('')||'<p>موردی ثبت نشده است.</p>';
}
function organizationReviewPage(){
 if(orgReviews.state==='idle')queueMicrotask(loadOrgReviews);
 const isCycles=sub==='cycles',title=isCycles?'چرخه‌های ارزیابی':'ارزیابی‌های من';
 const head=heading(title,'',isCycles&&cloud.role==='admin'?btn('org-review-new','چرخه ارزیابی جدید'):'');
 if(orgReviews.state==='error')return head+panel('دریافت ارزیابی‌ها',esc(orgReviews.error)+btn('org-review-refresh','تلاش دوباره'));
 if(orgReviews.state!=='ready')return head+'<p>در حال دریافت…</p>';
 if(isCycles)return head+panel('چرخه‌ها',orgReviews.cycles.map(c=>'<div class="action"><div><b>'+esc(c.name)+'</b><p>'+esc(c.description)+'</p></div><time>'+esc(c.deadline)+'</time></div>').join('')||'چرخه‌ای ثبت نشده است.');
 return head+panel('نیازمند پاسخ شما',reviewCards(orgReviews.entries.filter(e=>!e.completed&&e.evaluator_id===cloud.userId)))+panel('ارزیابی‌های گذشته',reviewCards(orgReviews.entries.filter(e=>e.completed)));
}
function cycleSetup(){
 modal('چرخه ارزیابی جدید','<form id="orgCycle">'+field('name','نام چرخه')+'<label>توضیح<textarea name="description"></textarea></label><label>مهلت ارزیابی<input type="date" name="deadline" required></label>'+options('frequency','تناوب',[['once','یک‌بار'],['quarterly','فصلی'],['annual','سالانه']],'once')+options('access','دسترسی به پاسخ تکمیل‌شده',[['private','فقط ارزیاب'],['participant','ارزیاب و ارزیابی‌شونده']],'participant')+options('manager','ارزیاب مدیر',[['','فقط خودارزیابی'],...organizationDirectory.map(p=>[p.user_id,p.display_name])],'')+'<fieldset><legend>شرکت‌کنندگان</legend>'+organizationDirectory.map(p=>'<label class="check"><input type="checkbox" name="participant" value="'+esc(p.user_id)+'">'+esc(p.display_name)+'</label>').join('')+'</fieldset><button class="primary">شروع چرخه</button></form>');
}
function openAssessment(id){
 const entry=orgReviews.entries.find(e=>e.id===id);if(!entry)return;
 const editable=!entry.completed&&entry.evaluator_id===cloud.userId;
 const cycle=orgReviews.cycles.find(c=>c.id===entry.cycle_id);
 modal(esc(cycle?.name||'ارزیابی عملکرد'),'<div class="row">'+esc(memberName(entry.subject_id))+' · '+(entry.kind==='self'?'خودارزیابی':'ارزیابی مدیر')+'</div><p>'+esc(cycle?.description)+'</p>'+(editable?'<form id="orgAssessment" data-id="'+entry.id+'"><label>جمع‌بندی عملکرد<textarea name="answer">'+esc(entry.answer)+'</textarea></label><button>ذخیره پیش‌نویس</button> <button class="primary" value="complete">تکمیل ارزیابی</button></form>':'<p>'+esc(entry.answer)+'</p>'));
}
window.addEventListener('submit',async e=>{
 const f=e.target;
 if(!cloud||!['orgCycle','orgAssessment'].includes(f.id))return;
 e.preventDefault();e.stopImmediatePropagation();if(f.dataset.busy)return;
 const fd=new FormData(f),v=Object.fromEntries(fd),epoch=cloudEpoch;f.dataset.busy='1';
 try{
  let rpc,body;
  if(f.id==='orgCycle'){
   const participants=fd.getAll('participant');
   if(!participants.length||participants.includes(v.manager)){alert('شرکت‌کنندگان را انتخاب کنید. ارزیاب مدیر باید فرد دیگری باشد.');return}
   rpc='behparvar_okr_start_cycle';body={title:v.name,description_text:v.description,deadline_date:v.deadline,repeat_frequency:v.frequency,access_mode:v.access,participants,manager:v.manager||null};
  }else{
   const entry=orgReviews.entries.find(x=>x.id===f.dataset.id);if(!entry)return;
   const finish=e.submitter?.value==='complete';if(finish&&!v.answer.trim()){alert('جمع‌بندی عملکرد را وارد کنید.');return}
   rpc='behparvar_okr_record_assessment';body={entry:entry.id,expected_revision:entry.revision,response_text:v.answer,finish};
  }
  const result=await requestCloud('/rest/v1/rpc/'+rpc,{method:'POST',body:JSON.stringify(body)});
  if(epoch!==cloudEpoch)return;if(!result)throw Error('نسخه ارزیابی تغییر کرده است. ارزیابی‌ها را دوباره باز کنید.');
  if(f.isConnected)act('close');orgReviews.state='idle';await loadOrgReviews();
 }catch(err){if(epoch===cloudEpoch&&f.isConnected)alert(err.message)}finally{delete f.dataset.busy}
},true);
function directoryPage(){
 const person=organizationDirectory.find(p=>p.user_id===profilePerson);
 if(!person)return heading('افراد','')+panel('اعضای سازمان',organizationDirectory.map(p=>'<div class="action"><div class="row">'+av(p.display_name)+esc(p.display_name)+'</div>'+btn('org-person:'+p.user_id,'پروفایل','secondary')+'</div>').join(''));
 const goals=data.goals.filter(g=>g.ownerId===person.user_id);
 return heading(esc(person.display_name),'پروفایل سازمانی',btn('ref-nav:users','همه افراد','secondary'))+panel('اهداف مرتبط',table(goals))+panel('اقدامات',data.tasks.filter(t=>t.ownerId===person.user_id).map(t=>'<p>'+esc(t.name)+'</p>').join('')||'اقدامی به این حساب تخصیص داده نشده است.')+panel('تیم‌ها',data.teams.filter(t=>teamMemberIds(t).includes(person.user_id)).map(esc).join('، ')||'—')+panel('مدیر مستقیم',(data.reportingLines?.[person.user_id]?esc(memberName(data.reportingLines[person.user_id])):'تعیین نشده')+(cloud.role==='admin'?btn('org-manager:'+person.user_id,'تغییر مدیر','secondary'):''));
}
function sparkPanel(){
 drawer('Spark','<p>دستیار اجرای استراتژی</p><ul><li>بازبینی اهداف و نتایج کلیدی</li><li>پیشنهاد شاخص‌های عملکرد</li><li>شفاف‌سازی ارکان راهبردی</li><li>پیش‌نویس بازبینی کسب‌وکار</li></ul><p>اتصال امن مدل برای به‌پرور پیکربندی نشده است.</p>');
}
let responsibilityFilter='leading';
function contributorField(g){
 if(!cloud)return '';
 return '<details><summary>مشارکت‌کنندگان هدف</summary>'+organizationDirectory.map(p=>'<label class="check"><input type="checkbox" name="contributor" value="'+esc(p.user_id)+'" '+((g.contributors||[]).includes(p.user_id)?'checked':'')+'>'+esc(p.display_name)+'</label>').join('')+'</details>';
}
function managerEditor(id){
 const optionsList=organizationDirectory.filter(p=>p.user_id!==id).map(p=>[p.user_id,p.display_name]);
 modal('مدیر مستقیم','<form id="managerAssignment" data-id="'+esc(id)+'">'+options('manager','مدیر مستقیم',[['','بدون مدیر مستقیم'],...optionsList],data.reportingLines?.[id]||'')+dialogFooter()+'</form>');
}
