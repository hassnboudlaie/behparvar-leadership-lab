/* Behparvar · Safar: ten distinct, metallic, high-resolution SVG skill awards.
 * Branded original vector motifs. User's examples are style references, not reused stock artwork.
 */
(()=>{"use strict";
const colors=[
 ["#0B4D96","#3BAFF6","#15356E"],["#087B85","#52D4DA","#064E6D"],["#6742C1","#C18AFF","#3C287C"],
 ["#C03D6F","#FF92C1","#722D6C"],["#1B8C50","#83DD8C","#16563F"],["#E36B22","#FFBC50","#95411D"],
 ["#135AB5","#76B8FF","#152F74"],["#059C9D","#81E4D6","#0B556E"],["#8C4DC5","#D8A3F4","#522A83"],
 ["#A72D4A","#F48BA0","#661D49"],["#2F76B2","#D2EBFA","#17446B"]
];
function badge(item){
 const idx=item?.kind==="participation"?10:Math.max(0,Math.min(9,Number(item.idx)||0));
 const [dark,shine,deep]=colors[idx],id="bp-skill-art-"+idx;
 const icon=item?.icon||'<path d="M32 10v44M12 32h40"/>';
 const leaves=Array.from({length:6},(_,i)=>{
  const y=172-i*18,x=53+i*2;
  return '<ellipse cx="'+x+'" cy="'+y+'" rx="8" ry="16" transform="rotate('+-31+' '+x+' '+y+')" fill="url(#'+id+'-metal)" stroke="#FFF2BE" stroke-width="1"/>'+
 '<ellipse cx="'+(240-x)+'" cy="'+y+'" rx="8" ry="16" transform="rotate(31 '+(240-x)+' '+y+')" fill="url(#'+id+'-metal)" stroke="#FFF2BE" stroke-width="1"/>';
 }).join("");
 return '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="280" viewBox="0 0 240 280" role="img" aria-label="نشان مهارتی به‌پرور">'+
 '<defs>'+
 '<linearGradient id="'+id+'-metal" x1=".1" y1=".1" x2=".92" y2=".86"><stop stop-color="#B37821"/><stop offset=".16" stop-color="#FFF9DB"/><stop offset=".32" stop-color="#F5C45B"/><stop offset=".56" stop-color="#A96921"/><stop offset=".78" stop-color="#FFE69A"/><stop offset="1" stop-color="#965C21"/></linearGradient>'+
 '<linearGradient id="'+id+'-face" x1="0" y1="0" x2="1" y2="1"><stop stop-color="'+shine+'"/><stop offset=".38" stop-color="'+dark+'"/><stop offset="1" stop-color="'+deep+'"/></linearGradient>'+
 '<linearGradient id="'+id+'-ribbon" x1="0" y1="0" x2="1" y2="1"><stop stop-color="'+shine+'"/><stop offset=".52" stop-color="'+dark+'"/><stop offset="1" stop-color="'+deep+'"/></linearGradient>'+
 '<filter id="'+id+'-shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#152349" flood-opacity=".28"/></filter>'+
 '</defs>'+
 '<path d="M65 168L100 181 92 262 61 238 32 266 32 171Z M141 180L177 167 208 171 208 266 179 238 148 263Z" fill="url(#'+id+'-ribbon)" stroke="#E8B862" stroke-width="3"/>'+
 '<path d="M51 186L75 189 72 245 60 235 48 246Z M166 189L190 186 192 246 179 235 168 245Z" fill="#FFFFFF" opacity=".3"/>'+
 '<g filter="url(#'+id+'-shadow)">'+
 '<path d="M120 19L170 35 205 80 211 148 178 207 120 232 62 207 29 148 35 80 70 35Z" fill="#8A5219" stroke="#FFF4C5" stroke-width="5"/>'+
 '<path d="M120 27L166 44 197 85 202 147 173 198 120 223 67 198 38 147 43 85 74 44Z" fill="url(#'+id+'-metal)" stroke="#FFEABA" stroke-width="2.5"/>'+
 '<path d="M120 40L159 56 184 91 190 145 164 189 120 209 76 189 50 145 56 91 81 56Z" fill="url(#'+id+'-face)" stroke="'+shine+'" stroke-width="3"/>'+
 '<path d="M120 51L154 67 174 95 180 143 155 180 120 199 85 180 60 143 66 95 86 67Z" fill="none" stroke="#FFFFFF" stroke-width="1.8" opacity=".57"/>'+
 '<path d="M81 82Q110 55 157 75" fill="none" stroke="#FFFFFF" stroke-width="4" opacity=".3" stroke-linecap="round"/>'+
 leaves+
 '<circle cx="120" cy="131" r="62" fill="'+deep+'" opacity=".54" stroke="#F8E5AB" stroke-width="2.5"/>'+
 '<g transform="translate(67 79) scale(1.65)" fill="none" stroke="#FFF7DD" stroke-width="3.1" stroke-linecap="round" stroke-linejoin="round">'+icon+'</g>'+
 '<path d="M120 200L125 213 139 213 128 222 132 237 120 228 108 237 112 222 101 213 115 213Z" fill="url(#'+id+'-metal)" stroke="#FFF9DC" stroke-width="1.5"/>'+
 '</g>'+
 '</svg>';
}
window.BP_SAFAR_SKILL_BADGE_ART={badge,colors};
})();