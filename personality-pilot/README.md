# Behparvar Personality Development Assessment — Research Pilot 0.1

**Project status:** Research/development only; NOT validated for Persian-speaking Behparvar managers and supervisors.  
**Construct model:** Big Five factor markers (IPIP, 50 items, 10 items each).  
**Not:** The official MBTI, a clinical diagnosis, a selection/retention/promotion instrument, a competence rating, or a validated Persian normative test.

## 1. Purpose and intended use

Offer voluntary self-reflection, manager/coach conversations, personal development planning, and team learning. Report continuous trait scores, clearly separated from management competency assessment. A high trait score is **not** necessarily better; low scores do not indicate poor performance. Avoid deterministic typing.

Individual answers should be visible only to the participant unless consent is explicitly given for a clearly specified purpose. Any future aggregated dashboard must include consent controls, appropriate group-size suppression, role-limited access, retention limits, secure transport/storage, auditability, deletion, and ethics/legal review before deployment.

## 2. Source and ownership

Original instrument: Goldberg's 50-item IPIP Big-Five Factor Markers (1992).

- Public-domain questionnaire: https://www.ipip.ori.org/New_IPIP-50-item-scale.htm
- Scoring instructions: https://www.ipip.ori.org/newScoringInstructions.htm
- IPIP overview and permission: https://www.ipip.ori.org/
- Adaptation guidelines: https://www.intestcom.org/page/14
- Standards for Educational and Psychological Testing: https://www.apa.org/science/programs/testing/standards

IPIP items are public domain; translations and adaptations are allowed. **Permission to translate is not evidence of a translated version's validity.** The Persian wording here is an unreviewed research translation and may require cognitive/cultural revision. It should not be represented as an officially validated Persian instrument.

## 3. Structure and scoring

Five dimensions: **E** Extraversion; **A** Agreeableness; **C** Conscientiousness; **S** Emotional Stability (not Neuroticism); **O** Intellect/Imagination (not necessarily identical to every Openness facet inventory).

The source questionnaire alternates five dimensions; position 1/6/11/... = E, 2/7/12/... = A, 3/8/13/... = C, 4/9/14/... = S, 5/10/15/... = O.

Respond 1 = very inaccurate, 2 = moderately inaccurate, 3 = neither, 4 = moderately accurate, 5 = very accurate. Positive-key items: score = response. Negative-key items: score = 6 − response. Each dimension contains exactly 10 items. Sum score range **10–50**, mean score range **1–5**. The prototype displays dimension means (two decimals), **not percentiles**. It does not convert dimensions into a 16-type MBTI label.

**Scoring key by item number (1-based):**

| Dimension | Positive keyed items | Reverse keyed items |
|---|---|---|
| E | 1, 11, 21, 31, 41 | 6, 16, 26, 36, 46 |
| A | 7, 17, 27, 37, 42, 47 | 2, 12, 22, 32 |
| C | 3, 13, 23, 33, 43, 48 | 8, 18, 28, 38 |
| S | 9, 19 | 4, 14, 24, 29, 34, 39, 44, 49 |
| O | 5, 15, 25, 35, 40, 45, 50 | 10, 20, 30 |

For example, if all 50 responses are 4: means are E=3.0, A=3.2, C=3.2, S=2.4, O=3.4. The scoring behavior must match the IPIP key. Reverse key 4 yields score 2.

No partial dimensional score is published. All 50 questions must be answered to obtain the report. No arbitrary population-norm categories or normative interpretation are implemented. The illustrative coaching text uses descriptive, non-normative wording and is not evidence of a trait cut-off.

## 4. Prototype functionality and boundaries

- Persian RTL, large typography and single-question navigation; answer revisions allowed.
- In-memory responses only. No localStorage, cookies, tracking, server-side logging of answers, or API requests from the assessment script.
- In-browser five-dimension summary; optional print / save to PDF.
- Initial response-pattern alerts for all-identical ratings and extremely rapid completion (<120 sec). These alerts are **not** validated careless-response indices and cannot prove response validity.
- Restart clears current responses. Closing/reloading the page clears responses.
- No individual identity, instructor dashboard, nor HR decision workflow.
- Standalone path `personality-pilot/index.html` on the feature branch. No change to existing classes or home navigation in `main`.

## 5. Psychometric validation program — proposed stages

**Stage 0 — preregister claims:** Define intended use, construct map, scoring specification, consent rules, preplanned exclusions, hypotheses, analysis plan, and acceptable precision. The use claim is development-focused, not screening or competency prediction.

**Stage 1 — content and linguistic validity:** At least two independent Persian translations, consensus synthesis, separate back-translation, review by bilingual psychologists/psychometricians and workplace experts. Flag culture-sensitive content (e.g. party context, vocabulary, abstract ideas, mood-related language). Document any adaptation and maintain item-source traceability. Use expert content-validity ratings when appropriate, but CVI alone is insufficient.

**Stage 2 — response-process evidence:** 12–20 diverse cognitive interviews (think-aloud + probes) across supervisor/manager roles. Examine ambiguity, social desirability, reading burden, interpretation of 5 anchors, mobile usability, and sensitive wording. Revise and freeze the research form with version control.

**Stage 3 — feasibility pilot:** Approximately 30–50 volunteers for administration time, missingness, item distribution, floor/ceiling effects, response styles, technical issues, and feedback. No assertions of reliability/validity from this small pilot. Obtain informed consent and minimize collection of identifiables.

**Stage 4 — main construct validation:** Determine sample size using formal power/simulation and expected loadings, not a fixed rule of thumb. Provisional planning range: 300–500 for exploratory work and an **independent** 300–500 for confirmatory tests, if justified and feasible. Use polychoric correlations or ordinal estimators where warranted; EFA with parallel analysis then independently fitted CFA. Examine item loadings, residuals, model fit (CFI/TLI, RMSEA, SRMR, with full context) and theory-consistent multidimensionality. Do not fit until acceptable by tweaking only to meet index thresholds.

**Stage 5 — reliability and precision:** McDonald's omega, ordinal alpha if defensible, item-rest correlations and score standard error. A target such as omega≥0.70 is a planning heuristic, not a validity guarantee. Test-retest after ~4–6 weeks for a subgroup (provisionally ~100–150): ICC with confidence intervals. Compare subgroups only after precision and invariance evidence. Explicitly report low-confidence interpretations.

**Stage 6 — relationships with external constructs:** Predefine expected convergence with a legally obtained, validated FFM reference; evaluate divergent relationships and theoretically supported correlations. Do not claim prediction of leadership performance, conflict style, or team outcomes without specific validation data. Cross-validate in independent samples.

**Stage 7 — fairness and generalization:** Evaluate measurement invariance and DIF by age band, supervisory level, gender, and other appropriate groups only where consent, privacy, sample sizes, and ethical justification permit. Consider language, literacy and cultural response patterns. Restrict or withdraw interpretations that lack comparable measurement.

**Stage 8 — expert sign-off and publication gate:** Independent psychometric review of the technical manual; document sample, recruitment, analysis scripts, exact item form, deviations, reliability/validity evidence, intended use, exclusions, risks and revision schedule. Only then can claims be upgraded from "research pilot" to the evidence-supported scope (not blanket "guaranteed valid").

## 6. Quality gates / release criteria

**Already implemented (prototype code only):** 50 item response flow, 5 point anchors, keyed scoring, basic results, preliminary coaching prompts, no response upload, privacy notices, print option. Basic source-key arithmetic checked with synthetic responses.

**Not complete:** Independent Persian translation audit; cognitive interviews; actual sample collection; factor analysis; cross-validation; test-retest; invariance; validated response-quality flags; professional technical manual; accessibility and multi-device usability testing with real participants; external compliance/privacy review.

**Strict gate:** Do not merge into main learning pathways or invite operational participant use until a deliberate review of translation, usability and consent. Even after UI QA, preserve “research pilot” until psychometric evidence supports stronger claims.

## 7. Future extensions (not implemented)

- An ethically governed research data collection interface with explicit opt-in and anonymized IDs.
- Psychometric analysis pipeline in R/Python with alpha/omega, CFA and reproducibility checks.
- Individual narrative report and reflective prompts reviewed by coaches and psychometricians.
- Group-level summaries with privacy thresholds and no individual ranking.
- Optional cross-reference with Behparvar competency framework **without equating personality traits with competencies**.

## 8. Audit checkpoints

1. Count: 50 items, 10 per dimension.
2. Each item's scale and key matches original IPIP instrument.
3. All-4 response test returns [E:3.0, A:3.2, C:3.2, S:2.4, O:3.4].
4. All 1 vs all 5 correctly invert reverse-keyed items.
5. Item editing/back navigation does not create duplicate responses.
6. Completion requires every item; report has all five domains.
7. Reload/restart removes response data; no accidental data exfiltration.
8. Layout usable at 320px and at desktop, with keyboard and screen-reader checks.
9. No unsupported percentile, grade, aptitude, clinical, or 16-type claim.
10. Main Behparvar experience remains unchanged until gated review.

*Research-development record created November 2026.*
