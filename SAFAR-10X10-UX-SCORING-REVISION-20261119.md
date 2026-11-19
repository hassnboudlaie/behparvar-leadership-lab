# Behparvar — Safar Competitive Journey · UX / Scoring / Awards Revision
**Date:** 2026-11-19  
**Canonical route:** \`session5-communication-journey.html\` (via \`session4-communication-journey.html\`)  
**Scope:** Participant-only competition, individual assessments, scoring, evidence, feedback, badges.

## Approved changes
1. **Participant Focus:** During a live journey, hide the sound switch, “all sessions” links, facilitator console links, the oversized introductory banner, redundant status panel, badge toasts, and mid-journey badge collection. Preserve the countdown, the main stage navigation, the always-available learning guide and essential pause/exit/overtime controls.
2. **Lesson Screen:** Every one of ten stages starts with a short curriculum-derived technique, one authentic example, a practical takeaway and a decision criterion from the applied curriculum. The checkbox **«مطالعه کردم»** is the prerequisite for moving on in the new rubric, worth **0.5 point**.
3. **Non-jumping Self-Assessment:** User ratings are saved and selected button styles updated in place, without rebuilding the whole root. Wizard buttons and earned score reflect the new state without scrolling to the page top.
4. **Self-Assessment Wording:** 30 unique, behavior-specific, plain-language prompts. Four mutually exclusive frequency anchors reference the **last four relevant situations** (0; 1; 2–3; 4).
5. **Voluntary Behavioral Evidence:** Three optional, distinct descriptions, one for each self-item. All three sufficiently substantive descriptions unlock **0.5 point**; the on-device coach awards an additional **0–1 point** using an inspectable rule-based rubric. It checks situation/time, identifiable action, observable consequence and specificity. Repeated, minimal or incomplete descriptions do not unlock evidence credit. **It is not LLM semantic verification, factual authentication or human assessor approval**, and must never be represented as such.
6. **One Stage, Ten Points:** The Stage 1/2 denominator mismatch is removed. All ten stages have a **fixed maximum of 10 points**, and the full journey **100 points**. Optional six-coin decisions are still available as individual learning practice but do not generate points outside this ceiling.
7. **Fair Points:** Recording a choice earns defined completion points. Correct choices earn additional points. Answer correctness and explanatory rationale remain locked until the final review. The target is that a serious average participant can plausibly achieve Bronze/Silver, without guaranteeing an empirical medal distribution.
8. **Stage Wrap:** Show the actual stage score out of 10, running total out of 100, a bold **«نکته طلایی»** and a distinct actionable transfer prompt for each skill.
9. **Premium Awards:** The original Behparvar logo is embedded/drawn from \`#brandlogo\` for exported assets. A dedicated authored golden quote accompanies each of the ten skill badges. The premium printable/downloadable final medals use a navy/red/white executive palette and metal-specific bronze, silver or gold accents. Keep only the premium medal, not a redundant emoji-style medal.
10. **No Pair Work:** All roleplay/team/peer actions and their medals remain removed from the competitive journey.
11. **Active Attempt Upgrade:** In-progress solo attempts are migrated to the ten-point rubric with an exact local backup saved under \`bp-session5-communication-journey-v1-pre-rubric-v2-<startedAt>\`. Earlier completed stages are grandfathered for the new reading-acknowledgment requirement. Finished archives keep their original scores.

## Rubric · Every stage (10.0 points)
| Component | Award | Max |
| --- | --- | ---: |
| Read lesson and check “مطالعه کردم” | Completion | 0.5 |
| Answer all 3 behavioral self-items | Completion independent of self-ratings | 1.0 |
| Record 3 valid, different examples | Evidence submission | 0.5 |
| On-device coach evaluates clarity/specificity of examples | Evidence quality | 1.0 |
| Question 1 — submit a choice | Completion | 1.5 |
| Question 1 — correct decision | Performance | 2.0 |
| Question 2 — submit best and worst choices | Completion | 1.5 |
| Question 2 — identify best action | Performance | 1.0 |
| Question 2 — identify weakest action | Performance | 1.0 |
| **Total** | | **10.0** |

- Knowledge/decision-related subtotal: **70**.
- Learning/self-assessment/evidence subtotal: **30**.
- Typical fully completed stage before answer correctness or evidence awards: **4.5/10**.
- All ten stages: **100 maximum**, including evidence; evidence never raises a stage above 10.
- Validating three pieces of evidence requires distinct, substantive text, not just three text boxes containing repeated sentences.

## Medals
| Award | Minimum net score | Minimum decision score of 70 |
| --- | ---: | ---: |
| Bronze | 55 | 35 |
| Silver | 70 | 45 |
| Gold | 88 | 58 |

An earned medal requires **both** thresholds. This is a design calibration; no actual cohort distribution is available yet. No promise that an average employee must obtain Silver.

## Implementation files
- \`assets/safar-rubric-v2-20261119.js\`: Single canonical 10x10 calculation and inspectable local evidence evaluator.
- \`assets/safar-self-items-plain-20261119.js\`: 30 rewritten questions and distinct response anchors.
- \`assets/safar-participant-ux-v2.js\` and \`.css\`: Lesson, checkbox, evidence, stable self-inputs, subdued participant view.
- \`assets/safar-golden-quotes-20261119.js\`: Ten original skill statements.
- \`session5-communication-journey.html\`: Participant state, entry, events, migration and result grading.
- \`assets/safar-wizard-session5-20261117.js\`: Learning gate, wrap-up and stage navigation.
- \`assets/safar-score-feedback-v1.js\`, \`assets/safar-graceful-exit-v1.js\`, \`assets/safar-industrial-medals.js\`, \`assets/safar-approved-recognition-20261115.js\`: Score/withdrawal/award parity.
- \`assets/safar-industrial-medal-design.js\`: Executive final medal vector design.
- \`sw.js\`: PWA cache upgrade.
- \`tests/safar-rubric-v2.cjs\`, \`tests/safar-solo-browser.cjs\`: Static plus mobile browser acceptance checks.

## QA & Truthfulness
- Static test exercises 10 fixed maxima, all-correct maximum 85 without evidence/100 with meaningful evidence, independent self-ratings 1 vs 4, no fabricated pair scores, honest medal floors, and required UI files.
- Browser test covers the 90-minute clock, start welcome coach, mandatory lesson checkbox, on-screen reflective feedback, optional evidence evaluation, no peer phase, final medal preview, and clean final scoring.
- Distinct questions/answers have been inspected for obvious high lexical overlap; canonical keys and pedagogical explanations were not changed solely for superficial difference.
- Any **GitHub Actions** test result must be checked against the exact deployed commit; this file does not claim a run passed unless confirmed.
- Browser-local scores are non-tamper-proof; do not present them as secure organizational assessment without an authenticated backend.
