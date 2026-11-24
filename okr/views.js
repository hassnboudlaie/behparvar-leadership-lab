const viewTitles={
 'strategy:map':'نقشه استراتژی','goals:all':'اهداف فعال','goals:risk':'اهداف خارج از مسیر',
 'goals:kpi':'تابلوی KPI','goals:map':'درخت اهداف','dash:overview':'داشبورد عملکرد'
};
function viewFavorites(){
 try{const a=JSON.parse(localStorage.getItem('behparvar-okr-views-'+(cloud?.userId||'demo'))||'[]');return Array.isArray(a)?a.filter(k=>Object.hasOwn(viewTitles,k)):[]}catch{return []}
}
function toggleView(){
 const key=page+':'+sub;if(!viewTitles[key])return;
 const a=viewFavorites(),next=a.includes(key)?a.filter(k=>k!==key):a.concat(key);
 try{localStorage.setItem('behparvar-okr-views-'+(cloud?.userId||'demo'),JSON.stringify(next));render()}catch{alert('ذخیره علاقه‌مندی در مرورگر امکان‌پذیر نیست.')}
}
function teamMemberIds(t){const meta=data.teamMeta?.[t]||{};return [...new Set([meta.leadId,...(meta.memberIds||[])].filter(Boolean))]}
function orgTeamFields(m){
 const members=organizationDirectory.map(p=>[p.user_id,p.display_name]);
 return options('leadId','مدیر تیم',[['','تعیین نشده'],...members],m.leadId||'')+'<fieldset><legend>اعضای تیم</legend>'+members.map(([id,n])=>'<label class="check"><input name="memberIds" type="checkbox" value="'+esc(id)+'" '+(m.memberIds?.includes(id)?'checked':'')+'>'+esc(n)+'</label>').join('')+'</fieldset>';
}
let teamPane='goals',teamPeriod='',dashboardPeriod='';
function periodFilter(id,value,goals){
 const periods=[...new Set(goals.map(g=>g.period||data.period).filter(Boolean))];
 return '<label>دوره زمانی <select id="'+id+'"><option value="">همه دوره‌ها</option>'+periods.map(p=>'<option value="'+esc(p)+'" '+(p===value?'selected':'')+'>'+esc(p)+'</option>').join('')+'</select></label>';
}
function teamWorkspace(t){
 const all=data.goals.filter(g=>g.team===t),goals=all.filter(g=>!teamPeriod||(g.period||data.period)===teamPeriod);
 const tabs=[['goals','اهداف'],['members','اعضا'],['review','بازبینی تیم']];
 const meta=data.teamMeta[t]||{};
 const members=cloud?teamMemberIds(t).map(id=>[memberName(id),'org-person:'+id]):[...new Set(all.map(g=>g.owner).filter(Boolean))].map(n=>[n,'person:'+encodeURIComponent(n)]);
 const reviews=data.businessCycles.filter(b=>b.team===t&&(!teamPeriod||b.period===teamPeriod));
 const content=teamPane==='members'?members.map(([n,action])=>'<div class="action">'+av(n)+btn(action,esc(n),'secondary')+'</div>').join('')||'عضوی ثبت نشده است.':teamPane==='review'?reviews.map(r=>'<div class="action">'+btn('biz-open:'+r.id,esc(r.name),'secondary')+esc(r.period)+'</div>').join('')||'بازبینی ثبت نشده است.':table(goals);
 return heading(esc(t),esc(meta.lead||''),!cloud||cloud.role==='admin'?btn('team-meta:'+encodeURIComponent(t),'تنظیم تیم','secondary'):'')+'<div class="tabline">'+tabs.map(([k,n])=>'<button class="'+(teamPane===k?'selected':'')+'" data-act="team-pane:'+k+'">'+n+'</button>').join('')+'</div>'+periodFilter('team-period',teamPeriod,all)+panel(tabs.find(row=>row[0]===teamPane)[1],content);
}
function teamDirectory(){
 const body=data.teams.map(t=>{
  const a=data.goals.filter(g=>g.team===t&&isOpenGoal(g)),meta=data.teamMeta[t]||{},ids=teamMemberIds(t);
  return '<tr><td>'+btn('team-profile:'+encodeURIComponent(t),esc(t),'secondary')+'</td><td>'+esc(meta.lead||'—')+'</td><td>'+fa(cloud?ids.length:new Set(a.map(g=>g.owner).filter(Boolean)).size)+'</td><td>'+fa(data.teams.filter(k=>data.teamMeta[k]?.parent===t).length)+'</td><td>'+fa(a.length)+'</td><td>'+bar(averageScore(a.filter(g=>g.kind==='Objective')))+'</td></tr>';
 }).join('');
 return heading('همه تیم‌ها','',!cloud||cloud.role==='admin'?btn('add-team','＋ تیم جدید'):'')+'<input id="find-team" type="search" aria-label="جست‌وجوی تیم" placeholder="جست‌وجوی تیم…">'+panel('فهرست تیم‌ها','<div class="tablewrap"><table id="team-directory"><thead><tr>'+['تیم','مدیر تیم','اعضا','تیم‌های زیرمجموعه','اهداف فعال','پیشرفت OKR'].map(n=>'<th>'+n+'</th>').join('')+'</tr></thead><tbody>'+body+'</tbody></table></div>');
}
function customDashboard(){
 const board=(data.dashboardConfig.customBoards||[]).find(b=>b.id===sub);if(!board)return '';
 const scoped=data.goals.filter(g=>(!board.team||g.team===board.team)&&(!board.period||(g.period||data.period)===board.period));
 const goals=scoped.filter(g=>g.kind==='Objective'&&isOpenGoal(g)),kpis=scoped.filter(g=>g.kind==='KPI'&&isOpenGoal(g));
 return heading(esc(board.name),'',!cloud||cloud.role==='admin'?btn('edit-board:'+board.id,'ویرایش داشبورد','secondary'):'')+'<div class="performance-grid"><div class="performance-wide">'+panel('روند شاخص',kpis.map(g=>'<h3>'+esc(g.name)+'</h3>'+trend(g.history.filter(h=>Number.isFinite(h.value)),Number(g.target))).join('')||'شاخصی ثبت نشده است.')+'</div>'+panel('یادداشت',esc(board.note||'—'))+panel('پیشرفت کلی اهداف',progressGauge(averageScore(goals)))+panel('اهداف بر اساس وضعیت',statusChart(goals))+panel('تعداد اهداف',fa(goals.length))+'</div>';
}
function configureBoard(id){
 if(cloud&&cloud.role!=='admin')return;
 const board=(data.dashboardConfig.customBoards||[]).find(b=>b.id===id)||{};
 modal(id?'ویرایش داشبورد':'داشبورد جدید','<form id="customBoard" data-id="'+esc(id||'')+'">'+field('name','نام داشبورد',board.name)+options('team','دامنه سازمانی',[['','سازمان و همه تیم‌ها'],...data.teams.map(t=>[t,t])],board.team||'')+options('period','دوره زمانی',[['','همه دوره‌ها'],...[...new Set(data.goals.map(g=>g.period||data.period))].map(p=>[p,p])],board.period||'')+'<label>یادداشت تحلیلی<textarea name="note">'+esc(board.note||'')+'</textarea></label>'+dialogFooter()+'</form>');
}
document.addEventListener('input',e=>{if(e.target.id==='find-team'){const q=e.target.value.trim();document.querySelectorAll('#team-directory tbody tr').forEach(r=>r.hidden=!r.cells[0].textContent.includes(q))}});
document.addEventListener('change',e=>{if(e.target.id==='team-period'){teamPeriod=e.target.value;render()}if(e.target.id==='dashboard-period'){dashboardPeriod=e.target.value;render()}});
