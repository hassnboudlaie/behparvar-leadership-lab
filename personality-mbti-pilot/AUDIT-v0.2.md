# MBTI-Inspired Behparvar Pilot — Content / Language / Measurement Audit (v0.2)
**Audit date:** 2026-11-17
**Scope:** `personality-mbti-pilot/index.html` on feature branch (not production).
**Auditor:** AI-assisted first-pass review, **not independent psychometric/expert validation**.
**Decision:** READY FOR EXPERT AND COGNITIVE REVIEW; NOT READY FOR OPERATIONAL PSYCHOLOGICAL ASSESSMENT.

## A. Decision: one version for managers and supervisors

**Single common questionnaire** should be used for both groups:
- Personality preference constructs (E/I, S/N, T/F, J/P) should not depend on job title.
- Different question sets create untested score differences, impede comparison, and double the validation workload.
- Short, general-life and generic-organizational situations are preferred over Behparvar-specific operational scenarios.
- The prototype changes only one **non-scored development exercise** after completion, selected as manager or supervisor. Item wording, scoring, thresholds and reported preferences are identical.
- After data collection, test differential item functioning (DIF) or measurement invariance by role; a common form is not automatically proof of cross-role equivalence.

## B. Questions and wording — changes made

| Audit check | Observed/implemented | Status |
|---|---|---|
| Four theory-defined preference pairs | E/I, S/N, T/F, J/P represented by separate item keys | Passed structural check |
| 48 items; 12 per preference pair | Confirmed in source data | Passed structural check |
| Balanced first-phrase pole | 6 A/6 B first-pole positions per pair | Passed structural check |
| Interleaving | Item order EI → SN → TF → JP repeated 12 times; avoids twelve same-dimension questions in sequence | Implemented |
| Simple Persian, short expressions | Rewritten both statements in each item; 96 clauses now roughly 8 words on average | Implemented; must test with readers |
| General scenarios | Generic conversations, reports, decisions, meetings, schedules, relationships; no Behparvar-specific vocabulary | Implemented |
| Role split | Common core items; only coaching examples depend on role | Implemented |
| Real Vazirmatn | `../assets/vazirmatn.woff2` referenced and font object verified in repo | Passed source check, not visual render check |
| Keyboard answer focus | Focus restored to chosen response after reactive rendering | Implemented |
| Questions with one clearly preferred “correct” answer | Reduced morally loaded language and evaluated balance across poles | Human bias review still needed |
| Reverse / pole direction | Six items per dimension put alternative pole first, so position alone is not scored | Passed structural check |

### Example of before/after editing (not an official MBTI item)
- Before: “وقتی پروژه‌ای را بررسی می‌کنم، ترجیح می‌دهم از داده‌ها و شرایط موجود شروع کنم.”
- After: “برای فهم موضوع، اول یک مثال واقعی می‌خواهم.”
- Opposite pole: “برای فهم موضوع، اول تصویر کلی را می‌خواهم.”
This avoids unnecessary role context and focuses on a single response preference.

### Content cautions to test with psychologists and users

**E/I**: Must measure natural preferred direction of attention/energy, **not** shyness, confidence, ability to speak publicly or social competence. Interpersonal breadth vs depth can confound network size and familiarity.

**S/N**: Must distinguish reliance on concrete observable details vs patterns/possibilities, **not** intelligence, creativity, being strategic, or having a “modern” mindset.

**T/F**: Must distinguish priorities in judging/decision making, **not** logical intelligence versus emotionality, morality, being “nice,” fairness, or empathy competence. Both descriptions must be equally socially acceptable.

**J/P**: Must distinguish preference for closure/structure vs flexibility/open possibilities, **not** discipline, responsibility, punctuality, professional competence or diligence.

**Method risk**: Paired choices with a center option may produce specific response effects; the 4D factor structure cannot be inferred merely because items were assigned to four dimensions. The design is not formally equivalent to an official MBTI questionnaire.

## C. Psychometric evidence status (as of 2026-11-17)

| Evidence | Current status | Why it matters |
|---|---|---|
| Item-domain mapping | Preliminary theoretical, assistant-authored | Experts must independently review all items |
| Content validity / expert agreement | **Not measured** | Need expert relevance/clarity ratings and disagreement resolution |
| Comprehensibility / response process | **Not measured** | Need think-aloud interviews with typical participants |
| Internal consistency (alpha / omega) | **No real response data** | Cannot responsibly report any coefficient |
| Test–retest consistency | **No repeat samples** | Need dimension-score ICC/correlations and whole-code agreement |
| Four-dimensional construct validity | **Not measured** | Factor structure and discriminant evidence needed |
| Convergent validity | **Not measured** | Need an appropriate separately authorized reference measure |
| DIF / invariance between roles | **Not measured** | Need to test common-scale assumptions |
| Cutoff uncertainty calibration | **Not validated** | `0.34` in UI is a temporary heuristic; not psychometric confidence |
| Copyright equivalence to official MBTI | **No** | This is an independently authored, unvalidated, MBTI-inspired educational pilot |

The reported reliability/validity studies of the official licensed MBTI instrument CANNOT be attributed to this new set of questions.

## D. Release gates and recommended validation workflow

1. **Scientific content mapping**: Two/three independent qualified psychometrics/personality specialists score all 48 items for relevancy to dimension, balance of response desirability, absence of double-barreled ambiguity, and plain-language clarity. Revise and version before sampling.
2. **Cognitive interviews**: Provisional 12–20 participants (managers and supervisors) complete items while explaining the intended meaning; note any conflicting interpretation, jargon, unfamiliar context or ambiguous response anchor. Define a clear decision rule for rewriting.
3. **Readability & UX pilot**: Provisional 30–50 volunteer participants; measure completion time, missed items, mobile readability, response switching, and substantive comments. Pair-item wording may need further reductions.
4. **Field psychometrics**: Pre-register model/hypotheses; size an appropriately diverse sample using power/simulation. Examine distributions, dimensionality with ordinal factor methods when suitable, reliability with uncertainty intervals (omega/alpha if defensible for these response forms), and alternative model fit.
5. **Test–retest**: Repeat 4–6 weeks later in a defensible subgroup; report **continuous dimension stability**, **each-letter agreement**, and **whole four-letter code agreement**, including uncertainty and near-midpoint transitions.
6. **Fairness**: Examine DIF or invariance across manager/supervisor roles and other justified groups if sufficient consent and sample size. Non-invariance may prompt item rework or group-specific interpretation (not automatic separate versions).
7. **External validity & safety**: Examine convergence with independent validated constructs, while explicitly testing contrary expectations. No hiring, ranking, diagnosis, leadership selection or competence claims.
8. **Independent sign-off**: Technical manual, item bank version, reproducible analysis scripts, privacy/consent process, and approval of allowed report language. No production integration before this gate.

Planning note: quantitative work may require hundreds of responses depending on item properties, model, and precision. **Sample size is not a universal fixed threshold.** A preliminary participant count cannot manufacture validity.

## E. Technical QA completed

- Embedded JavaScript parsed successfully.
- All 48 item pairs parsed; 12 each dimension.
- Six per first-pole direction for each pair.
- Scoring regression: all center responses → 0/0/0/0; corresponding selected first letter → +2 each; second letter → −2 each.
- Score result shown only after all 48 answers.
- Shared form and optional non-scored role exercise.
- Font asset fetched by SHA from GitHub as base64, and CSS path checked.
- No answers persisted or intentionally transmitted by questionnaire JavaScript.

**Not yet run:** Real browser device matrix, automated Playwright E2E, accessibility screen-reader check, detailed font/render screenshot, full manual independent item review, participant study, empirical psychometric validation.

## F. Source and ethics notes

- MBTI institutional information: https://www.themyersbriggs.com/en-US/Support/MBTI-Facts
- Official MBTI ethics: https://www.myersbriggs.org/using-type-as-a-professional/mbti-code-of-ethics/
- Critical scientific paper: https://pubmed.ncbi.nlm.nih.gov/2709300/
- Content validity framework (relevance, comprehensiveness, comprehensibility): https://pubmed.ncbi.nlm.nih.gov/40562250/

**Interpretation principle**: Do not imply MBTI type is an indication of managerial competence. A hypothetical code is a conversation opener; the participant may disagree and should be supported in reflecting on a best-fit preference, rather than be assigned a lifelong label.
