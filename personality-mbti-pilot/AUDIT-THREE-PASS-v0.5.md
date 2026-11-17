# به‌پرور — ممیزی سه‌مرحله‌ای ابزار ترجیحات شخصیتی
## Three-Pass Scientific, Content, Inference, UX & Technical Audit
**Version:** Research Pilot v0.5  
**Audit date:** 2026-11-17  
**Scope:** `personality-mbti-pilot/index.html` + 48-item expert-review matrix  
**Release status:** DRAFT / NOT VALIDATED / NOT MERGED TO MAIN

> **Critical distinction:** This is an independently written **MBTI-inspired**, four-preference-pair questionnaire; it is **not** the authorized official MBTI® instrument. No reliability or validity coefficient obtained from the official MBTI can be transferred to this questionnaire. No pilot respondents have been collected. Software correctness does not prove psychometric quality.

## Executive decision

- **One shared 48-item instrument** for managers and supervisors; role affects the **optional, non-scored** practice suggestion only.
- Generic organizational/everyday scenarios are preferred. Manager-specific skills must not be confused with personality preferences.
- Report only things directly supported by this pilot's responses: direction, raw signed sum and counts across 12 items per axis, explicit selected response excerpts, opposing responses, and optional reflective exercises.
- Avoid guaranteed personality types, job-performance prediction, leadership competence judgments, team-fit scores, ranked employees, clinical interpretations, norms, precision percentages and fabricated confidence levels.
- Use Persian RTL and existing local **Vazirmatn** font. Production release is gated by research and human-subjects safeguards.

## Round 1 — Construct alignment, language and item-level content

### Checks and remedies
1. All 48 original items were mapped to four conceptual preference pairs (E/I, S/N, T/F, J/P) in `ITEM-CONTENT-REVIEW-v0.5.csv`.
2. Twelve items per axis; first-pole placement balanced at six each, to mitigate a simple "always choose first" scoring bias.
3. The order interleaves EI → SN → TF → JP throughout rather than twelve consecutive items on one construct.
4. Simplified 96 Persian preference clauses; **mean 8.6 whitespace-separated words per clause, maximum 12**. These are editorial statistics, **not evidence of comprehension**.
5. Reduced role jargon, context-specific Behparvar references, awkward Persian, needless clauses, social-exposure framing of introversion, and moral-valence asymmetry of Thinking/Feeling where possible.
6. Reworded T/F fairness and criticism scenarios, E/I social energy/communication scenarios, J/P change and closure scenarios.
7. Replaced midpoint label with “تفاوت مشخصی بین دو عبارت ندارم” to make neutral responses interpretable.

### Flagged for qualified expert review
15 of 48 items have **preliminary editorial risk flags** in the content matrix; these are not research findings, proof of item invalidity, or expert judgments.
- E/I social breadth may be confounded with situation and networking opportunities.
- S/N novelty versus proven practices may be confounded with attitudes toward innovation.
- T/F logical criteria versus concern for others may be confounded with fairness norms, empathy and social desirability.
- J/P planning and schedule may be confounded with organizational constraints and conscientiousness.
- Revisit competing interpretations, desirability symmetry, construct representativeness and double-barreled phrases during cognitive interviews.

**Status:** Internal first-pass mapping complete, independent content validity / I-CVI / CVR **not measured**. Neither clarity nor fit to constructs is fully established by the authoring review.

## Round 2 — Scoring, inference, type & individualized report

### Audited scoring specification
Every question contains two preference statements plus one five-point response:
`1 = strongly statement 1; 2 = somewhat statement 1; 3 = no clear preference; 4 = somewhat statement 2; 5 = strongly statement 2`.
Let `r` be chosen response. For each item:
```
contribution = (3 - r) * (first_statement_pole === first_axis_letter ? 1 : -1)
axis_total = sum(contribution for 12 items)  # -24...+24
axis_mean = axis_total / 12                 # -2...+2
```
The sign of `axis_total` alone determines the **display-only** candidate letter; exact zero results in '?' (no letter assigned). No classification reliability, confidence bounds, or validated interpretation cutoffs are claimed. A small raw difference (1 or 2 points) is flagged explicitly as an arithmetic fragility warning only—not a calibrated SEM or psychometric threshold.

### Before / after change in reports

**Before:** Mainly general paragraphs about broad preferences; unvalidated arbitrary .34 threshold; report could imply a psychological conclusion from code alone.

**Now:** Each axis includes:
- Which axis and preference pair the question group belongs to.
- Number of the 12 answers leaning toward each letter and number with a neutral response.
- Signed raw sum (`-24...+24`) explicitly described as a descriptive index rather than percentile, certainty or ability.
- Two *verbatim clauses from the participant's own selected answers* where available, each linked to its actual numbered item.
- One contradictory selected clause if the participant expressed an opposite preference.
- A limited conditional description, coaching reflection, and optional practice of the opposite pole **without diagnosing a deficit**.
- A role-sensitive exercise that never influences scoring.
- A very clear warning against predictive claims, HR use or official MBTI equivalence.

**Strict inferential chain:** actual response → signed item contribution → aggregate direction + counts → verbatim response evidence → bounded reflection. This is a **transparent descriptive report**, not proof of the questionnaire's construct validity.

### Outcome claims matrix

| User-facing output | Grounding | Evidence level | Must not infer |
|---|---|---|---|
| Candidate four-character code / '?' | Sign of four aggregate item totals | Deterministic descriptive math | Official/validated MBTI type; lifetime identity |
| Axis dominance direction | 12 item-weighted responses | Descriptive within this pilot | Guaranteed personality trait or stable latent class |
| Preference counts (A/B/neutral) | 12 actual responses per axis | Direct factual count | Norms, percentiles, population rarity |
| Quoted selected statements | Exact text of chosen option | Direct respondent evidence | Independent behavioural observations |
| Optional development action | Conditional on the axis with largest absolute raw total | Hypothesis / exercise, explicitly labelled | Evidence of weakness or need for remediation |
| Manager / supervisor context | User-selected role in report | Content-only | Different psychometric score by job role |
| Quality alerts | All-identical answers, duration <120 sec | Unvalidated superficial flag | Lie detection, validated attention check |

## Round 3 — UX, accessibility, privacy, reproducible testing

### Implemented
- Persian RTL end-to-end; 19px minimum text in mobile CSS, large tap buttons; concise labels; single-question focus and back navigation.
- Local `../assets/vazirmatn.woff2` font path checked against the GitHub repository asset; report four-letter code uses Vazirmatn as well.
- Corrected graph direction: **first-pole at the right and second-pole at the left** in RTL layout; marker position tracks signed axis mean correctly.
- Report chart also has accessible descriptive text; headings and controls have focus affordances. Question counter shows *current item* and *answered count*.
- Keyboard focus restored after answer re-render; focus moved to report heading after completion.
- Printed report avoids buttons/navigation and keeps charts legible.
- No answer upload, persistence, cookies or client-side trackers intentionally implemented in the assessment script; reload clears responses.
- Raw participant item texts are inserted with `textContent`, not string-injected HTML markup.
- Separation from the existing class application: no production home page changes, no live class interruption.

### Static / logic checks actually completed
- Parsed embedded script successfully.
- 48 questions × two statements; 12/dimension; 6 first-pole balance per axis.
- Synthetic all-neutral responses → `????`.
- Synthetic all-first-pole responses → `ESTJ`.
- Synthetic all-second-pole responses → `INFP`.
- Synthetic alternating responses → balanced axes and `????`.
- Verified that incomplete answers are refused by score calculation.
- **500 additional deterministic synthetic response profiles**: for every axis, independent score recomputation, counts, candidate letters, evidence quotations vs actual selected item, in-range plot markers, role-independent scoring, and focus restoration.
- Added `tests/pilot.test.cjs` for repeatable zero-dependency Node smoke/regression checks (run locally with `node personality-mbti-pilot/tests/pilot.test.cjs`).

### NOT completed / testing blocker
- No real-device browser screenshot-based QA / browser engine E2E, no actual mobile touch testing, and no screen-reader audit. A TinyFish live browser run was attempted but **was not started** because connector wallet was out of funds. Accordingly, no claim of browser QA success is made.
- Test file was authored and syntax-checked, but a full checkout-based Node execution is not independently verified in this session. Logic tests above were directly executed using a simulated DOM.
- No participant comprehension data, no real-item distributions, no reliability coefficients, no factor analysis, no type-stability estimates, no invariance testing.

## Psychometric validation plan — mandatory before scientific deployment

### A. Preregister claims and item blueprint
The intended use is educational self-awareness and facilitated reflection only. Define exactly which latent preference each item is meant to measure, how scores support only those claims, and plausible alternative explanations. State a priori decision rules before inspecting respondent outcomes. **Avoid retrofitting the questionnaire to produce desirable 16-code distributions.**

### B. Independent experts (Content Validity)
Use a panel of several qualified Persian-speaking personality/psychometrics reviewers; each separately completes the 48-row `ITEM-CONTENT-REVIEW-v0.5.csv` rating item–construct relevance, clarity, preference-pole balance, double-barreled phrasing, and cultural appropriateness. Review agreement and justify revisions. CVI/CVR as applicable can support relevance—not prove complete construct validity. Repeat after wording changes.

### C. Response process and readability
Cognitive interviews with approximately 12–20 volunteers across manager/supervisor groups, diverse ages and writing/reading habits. Ask users to paraphrase both clauses, explain how they chose an answer, highlight unfamiliar words, and describe confusing midpoint choices. Revise items for comprehension **without changing their psychological meaning**.

### D. Pilot / usability feasibility
Approximately 30–50 volunteers for completion, missingness, item distributions, touch targets, screen readers, comfort/privacy, wording concerns. Do not infer psychometric reliability from a convenience mini-pilot.

### E. Empirical psychometrics
Sample size based on model simulation and interval precision, plausibly hundreds of participants; include independent confirmation sample where feasible. Four-factor/bipolar structure must actually be tested; paired response formats and item dependencies warrant a psychometrician's method selection. Report reliability per dimension (suitable omega/alpha with CIs), item characteristics, model-fit indicators, scale correlations, and external convergence/discrimination. An alpha/omega threshold like .70 is an initial screening heuristic, not an automatic certificate.

### F. Temporal stability and code stability
Re-administer after ~4–6 weeks in an appropriate subgroup. Compare continuous dimension-score ICC, letter-by-letter agreement, all-four-code agreement, transitions for near-ties, CIs, and sensitivity to decision rules. An apparently stable axis score is **not** automatically proof of categorical type stability.

### G. Role equivalence and ethical claims
Investigate DIF/invariance between managers and supervisors with adequate group sample size and informed consent. Never use personality outputs in employment selection, ranking, promotion, performance evaluation or competence screening; genuine validation for those claims is outside this pilot's intended use.

### H. Independent final sign-off
Only a documented independent psychometric review, appropriate consent/privacy review and successful browser/accessibility testing can authorize a widened scientific claim or production integration. Until then, release label remains **“Research Pilot — فاقد اعتبارسنجی تجربی”**.

## References

1. The Myers-Briggs Company, **MBTI Facts**, scoring/test–retest evidence for **the official instrument only**: https://www.themyersbriggs.com/en-us/support/mbti-facts
2. Myers-Briggs Foundation, **Best-Fit Type**: https://www.myersbriggs.org/unique-features-of-myers-briggs/best-fit-type/
3. Myers-Briggs Foundation, **Ethical use and limited interpretations**: https://www.myersbriggs.org/using-type-as-a-professional/mbti-code-of-ethics/
4. International Test Commission, **Guidelines for Translating and Adapting Tests**: https://www.intestcom.org/page/14
5. AERA/APA/NCME, **Standards for Educational and Psychological Testing**: https://ncme.org/resources/books/testing-standards/
6. APA, **Guidelines for Psychological Assessment and Evaluation**: https://www.apa.org/about/policy/guidelines-psychological-assessment-evaluation.pdf

## Signed status at the end of three passes

| Audit domain | Completed? | Limitation |
|---|---|---|
| Structural item distribution | Yes | Not proof of content validity |
| Language simplification / polarity review | Internal edit completed | Cognitive interviews required |
| Item-to-construct mapping | All 48 mapped | 15 items flagged; human expert ratings missing |
| Raw scoring and traceable result generation | Yes; 500 synthetic profiles checked | Does not establish score meaning |
| UI code structure, responsive styles, RTL and font source | Source inspected; fixes implemented | Browser and screen-reader test not done |
| Reliability and construct validity | **No** | Requires response data and independent analysis |
| Cross-role score comparability | **No** | DIF/invariance not yet studied |
| Real-world production readiness | **No** | Remains isolated in draft branch |

**The key acceptance standard is not a numeric aesthetic score. It is accuracy of each interpretation relative to actual response evidence, plus independent empirical support for any intended psychological inference.**
