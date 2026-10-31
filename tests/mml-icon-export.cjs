// Temporary source-to-PNG conversion for proper Android PWA/iOS home-screen icons.
const {chromium}=require('playwright');const fs=require('node:fs');
(async()=>{
 const base=process.env.AUDIT_URL||'http://127.0.0.1:8765/';
 const b=await chromium.launch({headless:true,args:['--no-sandbox']});
 const ctx=await b.newContext({viewport:{width:512,height:512},deviceScaleFactor:1});
 const p=await ctx.newPage();
 for(const size of [192,512]){
   await p.setViewportSize({width:size,height:size});
   await p.setContent('<!doctype html><html><body style="margin:0;background:white"><img src="'+base+'app/icon.svg" alt="" width="'+size+'" height="'+size+'" style="display:block;width:'+size+'px;height:'+size+'px;object-fit:contain"></body></html>',{waitUntil:'load'});
   const el=p.locator('img');await el.evaluate(e=>e.decode());const bytes=await el.screenshot({type:'png'});
   fs.writeFileSync('mml-icon-'+size+'.png',bytes);
   console.log('MML_RASTER_ICON_'+size+'='+bytes.toString('base64'));
   console.log('MML_RASTER_SIZE '+size+' '+bytes.length);
 }
 await b.close();
})().catch(err=>{console.error(err);process.exit(1)});
