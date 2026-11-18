/* Integration contract: the gamified Session-4 route retains a canonical
 * stored-state key across its independent JS modules. Never migrate/delete the old key. */
"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,".."),read=p=>fs.readFileSync(path.join(root,p),"utf8");
const k="bp-session5-communication-journey-v1",legacy="bp-communication-journey-v3";
const html=read("session5-communication-journey.html");
assert(html.includes('const K="'+k+'"'),"Game must write the canonical key");
assert(html.includes('LEGACY_K="'+legacy+'"'),"Read-only compatibility fallback must remain");
assert(html.includes("localStorage.getItem(K)||localStorage.getItem(LEGACY_K)"),"Preserve pre-existing learner records");
assert(html.includes("+roleView()+peerView()"),"Optional two-person roleplay must be rendered");
assert(html.includes('id="saverp"'),"Private peer rating must be actionable");
for(const file of ["assets/safar-overtime-v1.js","assets/safar-learning-modes-v1.js","assets/safar-context-guide-v1.js","assets/safar-wizard-session5-20261117.js","assets/safar-journey-coach-v5.js","assets/safar-session-controls-v4.js","assets/safar-score-feedback-v1.js","assets/safar-peer-appreciation-v1.js","assets/safar-final-review-v4.js","assets/safar-approved-recognition-20261115.js","assets/safar-graceful-exit-v1.js"]){
 const source=read(file);
 assert(source.includes(k),"Canonical state key missing: "+file);
 assert(!source.includes(legacy),"Old key must not control modules in current game: "+file);
 assert(html.includes(file),"Game does not load module "+file);
}
const wiz=read("assets/safar-wizard-session5-20261117.js");
assert(wiz.includes('"role",...([2,7]'),"Roleplay is present in each stage navigation");
assert(wiz.includes('bp-safar-nested-session5-v1'),"Wizard navigation must not share an unrelated journey");
const sw=read("sw.js");
assert(sw.includes("./session5-communication-journey.html"),"Competition route must remain offline");
console.log("PASS Safar state-key contract, all "+11+" modules, legacy recovery, roleplay visibility and offline app entry");
