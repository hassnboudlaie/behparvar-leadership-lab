#!/usr/bin/env node
"use strict";
/* Premium awards integration and downloadable vector artwork contract. */
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),assert=require("node:assert/strict");
const root=path.resolve(__dirname,".."),get=p=>fs.readFileSync(path.join(root,p),"utf8");
const medalSrc=get("assets/safar-industrial-medal-design.js"),badgeSrc=get("assets/safar-skill-badge-art-20261119.js");
const page=get("session5-communication-journey.html"),gallery=get("session5-awards-gallery.html"),reco=get("assets/safar-approved-recognition-20261115.js"),medals=get("assets/safar-industrial-medals.js");
for(const s of [medalSrc,badgeSrc,reco,medals])new vm.Script(s);
const window={},logo="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";
const document={querySelector:q=>q==="#brandlogo"?{getAttribute:()=>logo}:null};
vm.runInNewContext(medalSrc,{window,document,Intl,Date,Number,String,Array,Math,Object});
vm.runInNewContext(badgeSrc,{window,Intl,Date,Number,String,Array,Math,Object});
for(const kind of ["gold","silver","bronze"]){
 const svg=window.BP_SAFAR_BADGE_DESIGN.seal(kind,{preview:true});
 assert(svg.startsWith("<svg")&&svg.includes("</svg>"),"Medal has full SVG for "+kind);
 assert(svg.includes("ribbon")&&svg.includes("<image href="),"Medal ribbon and official logo for "+kind);
 assert(svg.includes("مدال ")&&svg.includes(window.BP_SAFAR_BADGE_DESIGN.palettes[kind].title),"Medal branding and tier-specific skill motto");
 assert(gallery.includes("behparvar-safar-medal-"+kind+"-official.svg"),"Gallery includes "+kind);
 assert(get("assets/previews/behparvar-safar-medal-"+kind+"-official.svg").includes("ribbon"),"Official preview matches current medal");
}
const icon='<path d="M10 32h44"/>';
for(let i=0;i<11;i++){
 const art=window.BP_SAFAR_SKILL_BADGE_ART.badge({kind:i===10?"participation":"skill",idx:i,icon});
 assert(art.startsWith("<svg")&&art.includes("</svg>")&&art.includes("linearGradient"),"Premium art "+i);
}
assert.equal((gallery.match(/class="bp-recognition-badge is-preview"/g)||[]).length,10,"Ten skill previews do not claim actual attainment");
assert(page.includes("safar-skill-badge-art-20261119.js"),"Main app loads badge renderer");
assert(page.includes("safar-awards-premium-20261119.css"),"Main app loads premium CSS");
assert(page.includes("safar-recognition-copy-20261119.js")&&page.includes("signature-v1"),"Main app pins signature copy and invalidates old caches");
assert(reco.includes("BP_SAFAR_SKILL_BADGE_ART")&&reco.includes("data-bp-download"),"Live cards use actual vector and retain downloads");
assert(reco.includes("displayTitle")&&reco.includes("این یادگار همراه توست"),"Learner cards use human, skill-specific recognition");
assert(reco.includes("linesOf(")&&reco.includes("meta.next"),"Personal downloadable card carries an action point");
const narrative=get("assets/safar-recognition-copy-20261119.js"),quotes=get("assets/safar-golden-quotes-20261119.js");
new vm.Script(narrative);new vm.Script(quotes);
vm.runInNewContext(narrative,{window});
vm.runInNewContext(quotes,{window});
assert.equal(window.BP_SAFAR_RECOGNITION_COPY.skills.length,10,"Ten authored recognition narratives");
assert.equal(window.BP_SAFAR_GOLDEN_QUOTES.length,10,"Ten stage reflection lines");
assert(window.BP_SAFAR_RECOGNITION_COPY.skills.every(skill=>skill.title&&skill.quote&&skill.next&&skill.official&&skill.message&&skill.reflection),"Each award has a meaningful purpose and next action");
assert(window.BP_SAFAR_RECOGNITION_COPY.skills.every(skill=>gallery.includes(skill.quote)&&gallery.includes(skill.title)),"Gallery matches actual user-facing copy");
assert(reco.includes('ctx.drawImage(bitmap'),"PNG exports use the new skill artwork");
assert(medals.includes('format==="pdf"')&&medals.includes('format==="png"')&&medals.includes('format==="svg"'),"Medal download formats retained");
console.log("PASS signature awards: three branded medals, ten human-authored badges, correct preview, and personal PNG/PDF/SVG outputs");
