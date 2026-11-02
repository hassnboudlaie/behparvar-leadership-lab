/* Behparvar install entry. Native browser install prompt when available; accurate manual guidance otherwise. */
(function(){
"use strict";
let deferred=null;
function el(id){return document.getElementById(id)}
function standalone(){return window.matchMedia&&window.matchMedia("(display-mode: standalone)").matches||navigator.standalone===true}
function platform(){
 const ua=navigator.userAgent||"";
 if(/iPhone|iPad|iPod/i.test(ua))return "ios";
 if(/Android/i.test(ua))return "android";
 return "desktop";
}
function message(){
 const p=platform();
 if(p==="ios")return "در Safari روی «اشتراک‌گذاری» بزنید و «افزودن به صفحه اصلی» را انتخاب کنید. در برخی نسخه‌ها مسیر «More» لازم است. نصب مستقیم با دکمهٔ وب در iPhone فعال نیست.";
 if(p==="android")return "در منوی مرورگر (سه‌نقطه)، «نصب برنامه» یا «افزودن به صفحه اصلی» را انتخاب کنید. در Chrome و برخی مرورگرهای اندروید، پیشنهاد نصب ممکن است به‌صورت پنجره خودکار ظاهر شود.";
 return "در Chrome یا Edge گزینه نصب در نوار نشانی یا منوی مرورگر نمایش داده می‌شود. اگر گزینه نصب در دسترس نیست، می‌توانید از همین نسخه وب استفاده کنید.";
}
function sync(){
 const btn=el("bp-install-action"),help=el("bp-install-help");if(!btn||!help)return;
 if(standalone()){btn.hidden=true;help.hidden=true;return}
 btn.hidden=false;
 btn.textContent=deferred?"📲 نصب اپلیکیشن به‌پرور":"📲 نصب روی گوشی یا رایانه";
}
function openGuide(){const help=el("bp-install-help");if(!help)return;help.textContent=message();help.hidden=false;}
async function requestInstall(){
 if(standalone()){sync();return}
 if(!deferred){openGuide();return}
 const ev=deferred;deferred=null;
 try{
  await ev.prompt();
  const result=await ev.userChoice;
  if(result&&result.outcome==="accepted"){
    const help=el("bp-install-help");if(help){help.textContent="درخواست نصب پذیرفته شد. تکمیل نصب را در دستگاه بررسی کنید.";help.hidden=false}
  }else openGuide();
 }catch(e){openGuide()}
 sync();
}
window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();deferred=e;sync();});
window.addEventListener("appinstalled",function(){deferred=null;sync();});
function init(){const btn=el("bp-install-action");if(btn)btn.addEventListener("click",requestInstall);sync()}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();