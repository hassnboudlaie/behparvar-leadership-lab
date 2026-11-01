/* Persian-first learner interface. Only changes rendered labels, not stored user responses,
   training data, identifiers, citations, source code, or external links. */
(function(){"use strict";
const dictionary=[
 [/\bMy Management Lab\b/g,"به‌پرور"],
 [/\bDevelop Self\b/g,"رشد فردی"],
 [/\bEnable Others\b/g,"توانمندسازی دیگران"],
 [/\bImprove the Business\b/g,"بهبود کسب‌وکار"],
 [/\bCore Competencies\b/g,"شایستگی‌های عمومی"],
 [/\bManagerial Competencies\b/g,"شایستگی‌های مدیریتی"],
 [/\bFunctional Competencies\b/g,"شایستگی‌های تخصصی"],
 [/\bInterpersonal Competencies\b/g,"شایستگی‌های میان‌فردی"],
 [/\bSelf-Management\b/g,"خودمدیریتی"],
 [/\bLeadership\b/g,"رهبری"],
 [/\bBaseline\b/g,"مقدار مبنا"],
 [/\bTarget\b/g,"هدف"],
 [/\bActual\b/g,"مقدار واقعی"],
 [/\bGuardrail\b/g,"حد کنترل"],
 [/\bKPI\b/g,"شاخص عملکرد"],
 [/\bPilot\b/g,"اجرای آزمایشی"],
 [/\bCoaching\b/g,"مربیگری"],
 [/\bRole[ -]Play\b/g,"گفت‌وگوی نقش‌آفرینی"],
 [/\bCase Study\b/g,"مطالعه موردی"],
 [/\bLearn\b/g,"یادگیری"],
 [/\bPractice\b/g,"تمرین"],
 [/\bApply\b/g,"به‌کارگیری"],
 [/\bBMCF\b/g,"مدل شایستگی به‌پرور"]
];
function update(){
 const active=document.querySelector("#app .view.active");
 if(!active)return;
 const walker=document.createTreeWalker(active,NodeFilter.SHOW_TEXT);
 const updates=[];let node;
 while((node=walker.nextNode())){
  const parent=node.parentElement;
  if(!parent||parent.closest("script,style,textarea,input,code,pre,select,option,.mml-evidence,.mml-sources,.resources"))continue;
  let value=node.nodeValue||"",changed=value;
  if(!/[A-Za-z]/.test(value))continue;
  for(const [rx,out] of dictionary){changed=changed.replace(rx,out)}
  if(changed!==value)updates.push([node,changed]);
 }
 updates.forEach(([n,v])=>n.nodeValue=v);
}
function init(){
 const home=document.getElementById("bp-global-home");
 const masthead=document.querySelector("#app .masthead");
 if(home&&masthead) masthead.appendChild(home);
 update();
 document.addEventListener("click",e=>{
  if(e.target.closest("[data-open],[data-bp-skill],[data-bp-family],[data-bp-role],[data-bp-next],[data-bp-option]"))requestAnimationFrame(update);
 });
 window.addEventListener("hashchange",()=>requestAnimationFrame(update));
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();