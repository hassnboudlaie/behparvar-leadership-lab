/* Ten-stage contextual assessment brief; canonical answer keys remain unchanged. */
(function(){
"use strict";
const root=document.getElementById("root");
const bank=window.BP_SAFAR_APPLIED&&window.BP_SAFAR_APPLIED.units||[];
if(!root||bank.length!==10)return;
const KEY="bp-communication-journey-v3";
const E=x=>String(x==null?"":x).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
const getState=()=>{try{const v=JSON.parse(localStorage.getItem(KEY)||"null");return v&&v.version===3?v:null}catch(e){return null}};
function enrich(){
 const s=getState();if(!s||!s.startedAt||s.finished)return;
 const stage=bank[s.stage],card=root.querySelector("#sf-quiz")||root.querySelector(".question")?.closest(".card");
 if(!stage||!card||card.querySelector("#sfDecisionContext"))return;
 const role=s.role==="managers"?"mgr":"sup",scenario=stage[role];if(!scenario)return;
 const brief=document.createElement("section");
 brief.id="sfDecisionContext";brief.className="sf-decision-context";
 brief.innerHTML='<div class="sf-decision-context-head"><strong>📌 موقعیت تصمیم‌گیری</strong><span>'+(role==="mgr"?"مسیر مدیران":"مسیر سرپرستان")+'</span></div>'+
 '<p>'+E(scenario.case)+'</p>'+
 '<details class="sf-decision-lens"><summary>در مقایسه گزینه‌ها به چه چیزی توجه کنم؟</summary><p>'+E(stage.decisionLens)+'</p></details>'+
 '<small>سناریوی آموزشی فرضی؛ کلید و تحلیل پاسخ‌ها در پایان سفر نمایش داده می‌شود.</small>';
 const head=card.querySelector(".section-head");if(head)head.insertAdjacentElement("afterend",brief);else card.prepend(brief);
}
let pending=false;
const observer=new MutationObserver(()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;enrich()})});
observer.observe(root,{childList:true,subtree:false});
enrich();
})();