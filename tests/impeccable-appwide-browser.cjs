/* All canonical reader routes, both audiences; no production writes. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.AUDIT_URL||'http://127.0.0.1:8765/';
const parts=['m1','m2','leaders','techniques','visuals','diseases','quiz'];
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 let checked=0;const errors=[];
 try{
  for(const role of ['supervisors','managers']){
   const ctx=await browser.newContext({viewport:{width:390,height:844}}),page=await ctx.newPage();
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+'?audience='+role,{waitUntil:'load'});
   // Sessions 3/4 have dedicated live applications covered by final-release QA.
   for(const n of [1,2,5,6])for(const part of parts){
    const id=n===1?part:'session'+n+'-'+part;
    await page.goto(base+'?audience='+role+'#'+id);
    const view=page.locator('#'+id+'.active');await view.waitFor();
    assert.equal(await view.locator('[data-mml-scene-id="session-'+n+'"]').count(),1,id+' canonical content');
    assert.equal(await view.locator('[data-mml-align-note$=":'+role+'"]').count(),1,id+' role alignment');
    const width=await page.evaluate(()=>({client:innerWidth,scroll:document.documentElement.scrollWidth}));
    assert.ok(width.scroll<=width.client+1,id+' overflow '+JSON.stringify(width));
    if(part==='m2'&&n!==2){
     const input=view.locator('[data-mml-observe]').first();await input.check();
     await page.reload();await input.waitFor();assert.equal(await input.isChecked(),true,'observer persistence');
    }
    if(part==='m1'){
     await view.locator('.mml-micro-practice summary').click();
     const input=view.locator('[data-mml-rehearse]');await input.check();
     const note=view.locator('[data-mml-align-note]');await note.fill('نمونه تمرین آزمایشی');
     await page.reload();await note.waitFor();assert.equal(await note.inputValue(),'نمونه تمرین آزمایشی');
     assert.equal(await input.isChecked(),true,'micro practice persistence');
     fs.mkdirSync('audit-artifacts',{recursive:true});
     await page.screenshot({path:'audit-artifacts/appwide-'+role+'-'+n+'.png'});
    }
    checked++;
   }
   await ctx.close();
  }
  assert.deepEqual(errors,[]);
  console.log('PASS appwide reader '+checked+' routes, role selection, notes, rehearsal, observations, mobile overflow');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
