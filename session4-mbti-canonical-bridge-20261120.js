/* Single-source editorial mapping for all sixteen preference types.
   The original MBTI assessment is not reproduced here; these are educational interpretations.
   Source framing: Myers & Briggs Foundation type descriptions and type dynamics.
   The sixteen entries share a reporting contract, not interchangeable generic advice. */
(function(){
"use strict";
const catalog=window.BEHPARVAR_MBTI_CANONICAL||{};
const codes=["ISTJ","ISFJ","INFJ","INTJ","ISTP","ISFP","INFP","INTP","ESTP","ESFP","ENFP","ENTP","ESTJ","ESFJ","ENFJ","ENTJ"];
const dynamics={
 ISTJ:["Si","Te"],ISFJ:["Si","Fe"],INFJ:["Ni","Fe"],INTJ:["Ni","Te"],
 ISTP:["Ti","Se"],ISFP:["Fi","Se"],INFP:["Fi","Ne"],INTP:["Ti","Ne"],
 ESTP:["Se","Ti"],ESFP:["Se","Fi"],ENFP:["Ne","Fi"],ENTP:["Ne","Ti"],
 ESTJ:["Te","Si"],ESFJ:["Fe","Si"],ENFJ:["Fe","Ni"],ENTJ:["Te","Ni"]
};
if(Object.keys(catalog).length!==16||Object.keys(catalog).some(c=>!codes.includes(c))){
 throw new Error("فهرست ۱۶ تیپ شخصیتی ناقص یا دارای کد ناشناخته است.");
}
const mentor=window.BEHPARVAR_MBTI_MENTOR_COPY||{};
const expanded=window.BEHPARVAR_MBTI_EXPANDED_PROFILES||{};
const insights=window.BEHPARVAR_MBTI_TYPE_INSIGHTS||{};
for(const code of codes){
 const p=catalog[code],required=["name","lead","story","blend","gifts","watch","communication","decision","team","change","question","suggestions","scenario"];
 if(!p||required.some(k=>!p[k])||!Array.isArray(p.story)||p.story.length!==2||!Array.isArray(p.suggestions)||p.suggestions.length!==3)throw new Error("پروفایل کامل نیست: "+code);
 const role=p.scenario;
 if(["situation","first","manager","supervisor"].some(k=>typeof role[k]!=="string"||role[k].trim().length<15))throw new Error("سناریوی تیپ ناقص است: "+code);
 for(const text of [p.name,p.lead,...p.story,p.blend,p.gifts,p.watch,p.communication,p.decision,p.team,p.change,p.question,...p.suggestions]){
  if(typeof text!=="string"||text.trim().length<15)throw new Error("متن گزارش ناقص است: "+code);
 }
 mentor[code]={
  name:p.name,lead:p.lead,story:p.story,blend:p.blend,gifts:p.gifts,watch:p.watch,
  communication:p.communication,decision:p.decision,team:p.team,change:p.change,
  question:p.question,suggestions:p.suggestions,dynamics:dynamics[code]
 };
 expanded[code]={
  identity:[p.story[0],p.blend],strength:p.gifts,communication:p.communication,
  watchout:p.watch,manager:role.manager,supervisor:role.supervisor,
  actions:p.suggestions
 };
 insights[code]={
  title:p.name,summary:p.story[0]+" "+p.blend,situation:role.situation,
  first:role.first,risk:p.watch,manager:role.manager,supervisor:role.supervisor,
  source:"https://www.myersbriggs.org/my-mbti-personality-type/the-16-mbti-personality-types/",
  dynamicsSource:"https://www.myersbriggs.org/unique-features-of-myers-briggs/type-dynamics-overview/"
 };
}
window.BEHPARVAR_MBTI_MENTOR_COPY=mentor;
window.BEHPARVAR_MBTI_EXPANDED_PROFILES=expanded;
window.BEHPARVAR_MBTI_TYPE_INSIGHTS=insights;
window.BEHPARVAR_MBTI_PROFILE_VERSION="2026-11-20-all16-aligned";
window.BEHPARVAR_MBTI_PROFILE_CODES=codes;
})();
