/* Behparvar Signature Insignia · 2026.
 * An executive-learning collection, not arcade trophies. Each canonical skill has
 * one distinct icon/enamel tone and shares the brand navy, crimson & champagne foil.
 * Pure SVG; download and earned-state contracts remain unchanged.
 */
(()=>{"use strict";
const colors=[
 ["#0D4D8A","#4F96C4","#072D56"],  // professional opening
 ["#116C88","#65B1C3","#073F5B"],  // clarity
 ["#166F75","#6EB5AF","#073E48"],  // listening
 ["#4E568F","#9B9FCB","#272E61"],  // expression
 ["#8A3B5C","#CF8FA1","#531E39"],  // feedback
 ["#80524A","#CCA48D","#48302E"],  // difficult dialogue
 ["#326978","#89B7C0","#173B4D"],  // cross functional
 ["#654F79","#B09AC5","#382C51"],  // boundaries
 ["#456C59","#A1C6AD","#244733"],  // trust
 ["#385B91","#94B1D8","#1E3058"],  // negotiation
 ["#776044","#C8B38D","#3D3327"]   // time
];
const foil="#D3AB63",foilHi="#FFF2D0",ink="#102D54";
let serial=0;
function badge(item){
 const idx=item?.kind==="participation"?10:Math.max(0,Math.min(9,Number(item?.idx)||0));
 const [dark,shine,deep]=colors[idx],id="bp-signature-"+idx+"-"+(++serial);
 const index=idx===10?"★":String(idx+1).padStart(2,"0");
 const icon=item?.icon||'<path d="M32 12v40M16 32h32"/>';
 const texture=Array.from({length:8},(_,i)=>{
  const angle=(i-3.5)*Math.PI/14,theta=angle-.5,rad=69;
  const cx=120+Math.sin(angle)*rad,cy=119+Math.cos(angle)*rad;
  return '<circle cx="'+cx.toFixed(2)+'" cy="'+cy.toFixed(2)+'" r="'+(i%2?1.7:2.3)+'" fill="'+foilHi+'" opacity="'+(i%2?".65":".34")+'"/>';
 }).join("");
 return '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="280" viewBox="0 0 240 280" role="img" aria-label="نشان ویژه یادگیری به‌پرور">'+
 '<defs>'+
 '<linearGradient id="'+id+'-foil" x1="0" y1="0" x2=".92" y2=".95"><stop stop-color="#8D662E"/><stop offset=".13" stop-color="#FFF3D5"/><stop offset=".35" stop-color="#C79E56"/><stop offset=".56" stop-color="#E9D09B"/><stop offset=".78" stop-color="#A77C3D"/><stop offset="1" stop-color="#F4D9A9"/></linearGradient>'+
 '<linearGradient id="'+id+'-enamel" x1=".12" y1=".03" x2=".86" y2="1"><stop stop-color="'+shine+'"/><stop offset=".40" stop-color="'+dark+'"/><stop offset="1" stop-color="'+deep+'"/></linearGradient>'+
 '<linearGradient id="'+id+'-ribbon" x1=".06" y1="0" x2=".94" y2="1"><stop stop-color="'+shine+'"/><stop offset=".50" stop-color="'+dark+'"/><stop offset="1" stop-color="'+deep+'"/></linearGradient>'+
 '<filter id="'+id+'-depth" x="-35%" y="-35%" width="170%" height="170%"><feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#142D4B" flood-opacity=".18"/></filter>'+
 '</defs>'+
 // disciplined ribbon, not a mass-market prize rosette
 '<path d="M61 188L102 203 94 271 68 252 40 271 39 194Z M139 203L180 188 201 194 200 271 172 252 146 271Z" fill="url(#'+id+'-ribbon)" stroke="'+foil+'" stroke-width="2.6"/>'+
 '<path d="M53 199L78 208 71 255 62 246 51 255Z M162 208L188 199 188 255 177 246 168 255Z" fill="#FFFFFF" opacity=".19"/>'+
 '<g filter="url(#'+id+'-depth)">'+
 '<path d="M120 7L169 22 206 58 216 124 194 191 154 224 120 237 86 224 46 191 24 124 34 58 71 22Z" fill="#6B522E" stroke="#F8E7BE" stroke-width="3.4"/>'+
 '<path d="M120 13L166 27 201 62 210 124 188 186 151 217 120 230 89 217 52 186 30 124 39 62 74 27Z" fill="url(#'+id+'-foil)"/>'+
 '<path d="M120 22L161 34 192 66 200 125 180 180 145 207 120 217 95 207 60 180 40 125 48 66 79 34Z" fill="url(#'+id+'-enamel)" stroke="'+foilHi+'" stroke-width="1.75"/>'+
 '<path d="M120 34L156 44 181 72 188 125 172 173 140 198 120 208 100 198 68 173 52 125 59 72 84 44Z" fill="none" stroke="#FFFFFF" stroke-width="1.35" opacity=".48"/>'+
 '<path d="M69 70C84 50 104 47 132 43" fill="none" stroke="#FFFFFF" stroke-width="3" opacity=".28" stroke-linecap="round"/>'+
 '<circle cx="120" cy="118" r="67" fill="'+deep+'" opacity=".44" stroke="'+foil+'" stroke-width="1.5"/>'+
 '<circle cx="120" cy="118" r="57" fill="none" stroke="'+foilHi+'" stroke-width="1.1" opacity=".44"/>'+
 texture+
 '<g transform="translate(72 70) scale(1.5)" fill="none" stroke="'+foilHi+'" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round">'+icon+'</g>'+
 '<path d="M94 180H109M131 180H146" stroke="'+foilHi+'" stroke-width="1.6" opacity=".58"/>'+
 '<circle cx="120" cy="180" r="3" fill="'+foilHi+'"/>'+
 '<rect x="91" y="195" width="58" height="25" rx="11" fill="'+ink+'" stroke="'+foil+'" stroke-width="1.7"/>'+
 '<text x="120" y="213" text-anchor="middle" font-family="Vazirmatn,Tahoma,Arial,sans-serif" font-size="15" font-weight="800" fill="'+foilHi+'">'+index+'</text>'+
 '</g>'+
 '</svg>';
}
window.BP_SAFAR_SKILL_BADGE_ART={badge,colors};
})();