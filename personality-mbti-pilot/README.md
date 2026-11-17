# به‌پرور — ابزار پژوهشی ترجیحات شخصیتی بر مبنای چهار جفت E/I، S/N، T/F، J/P
## Research Protocol · Version 0.5 · November 2026

> **IMPORTANT**: This is **not** the official MBTI® instrument. It uses 48 **original** paired-preference items, with no reproduction or adaptation of the licensed MBTI questionnaire. It **has not been validated** in Persian or in any other language. It does not carry the validity, norms, internal-consistency values, or trademark authorization of the official MBTI® assessment.

## 1. Purpose and scope

A voluntary, facilitated self-reflection learning experience for Behparvar managers/supervisors:
- Explore personal preferences for attention and energy (E/I), information gathering (S/N), decision criteria (T/F), and approaching structure/closure (J/P).
- Generate a **display-only four-letter candidate code** by the sign of the raw sums; show **?** only when a dimension's signed sum is exactly zero. Warn explicitly about fragile small-score differences. No code is a validated diagnosis or official type result.
- Provide questions for coaching conversations, perspective-taking, communication and team collaboration.
- **Never** use scores or codes as a criterion for recruitment, promotion, layoffs, performance evaluation, diagnosis, or suitability for leadership.
- Never assert that a code is a stable innate identity, an exclusive box, an ability score, or evidence of managerial competence.

## 2. Source distinction and licensing

Official Myers-Briggs Company information:
- Four preference pairs: https://www.themyersbriggs.com/en-US/Access-Resources/All-About-the-MBTI-Assessment
- Permissions: https://www.myersbriggs.org/using-type-as-a-professional/mbti-permission-trademarks/
- Copyright and licensing: https://www.themyersbriggs.com/en-US/Support/Copyright-and-Permissions

The *conceptual pairs* are broadly described publicly. These **original example questions** are NOT official MBTI items, are not given an official label, and must **not** be claimed to be equivalent to the official assessment. If a truly **official MBTI administration** is needed, arrange licensed instrument access and appropriate authorized practitioner/eligibility arrangements; do not insert copyrighted items into this website.

## 3. Specification of pilot questionnaire

- One-question-at-a-time user journey; two substantive preference statements per item.
- 48 original items; 12 items per dimension, balanced 6/6 by first-statement preference pole, with dimensions interleaved. RTL page displays the first-pole side on the right of each score bar.
- Five response positions (1 = strongly first statement, 2 = somewhat first, 3 = no clear preference between the two, 4 = somewhat second, 5 = strongly second).
- Users may revisit and alter responses. An answer is necessary for each item; no timing penalty and no right/wrong answer.
- Written for adult management-development participants. Several items deliberately refer to ordinary life, to avoid equating personality with supervisory competence.
- **Content audit needed**: Review double-barreled language, valence and social-desirability asymmetry, wording readability, and the conceptual tension between situational workplace preferences and stable person preferences. Several prompts may need revision after interviews.

## 4. Scoring logic — prototype, NOT official MBTI scoring

For each item let `r` be the selected option (1..5), first letter of dimension be `a`, and `firstPole` be letter assigned to the first statement.

```text
raw = 3 - r  // range +2 (strongly first statement) to -2 (strongly second)
signed = raw * (firstPole === a ? 1 : -1)
dimensionScore = mean(signed across 12 items)  // -2 ... +2
```

- Positive means preference toward first code letter (E, S, T, or J); negative toward second (I, N, F, or P).
- Report four two-ended visual bars; **these are not percentages or percentile ranks**.
- Show the first letter when the 12-item **signed sum > 0**, second letter when **< 0**, and **?** when the sum is exactly 0.
- A sum with absolute value 1 or 2 is marked as arithmetically fragile, not as a calibrated confidence interval. No psychological cutoffs are validated.
- Report transparent leaning counts on each axis and selected item text (up to two direct examples and one counterexample).
- Do not force a 16-type result when one or more preferences are ambiguous.
- Distinct type labels (e.g. "The Visionary") or guaranteed fixed-type claims are intentionally omitted.
- Example synthetic tests:
  - All responses = 3 => all axes score zero; four-letter code `????`.
  - Alternating the first/second statement signs according to pole yields positive on all axes => `ESTJ` (for uniformly first-pole preference).
  - Reversing each preference yields negative on all axes => `INFP` (for uniformly second-pole preference).
  - Answer corrections must replace, not append, a value.

## 5. Participant safety, data protection and limitations

- This pilot page stores answers only in JavaScript memory, sends none to an external API, and has no browser persistent storage.
- Refresh/close clears answers. Print/PDF is controlled by the participant through the browser.
- Future remote data collection requires explicit informed consent, restricted access, pseudonymous identities, retention/deletion policy, applicable legal and ethics review, storage security and purpose limitation.
- Instructor dashboard should initially show **only consented, appropriately anonymized group-level patterns**, with suppressed small group statistics.
- Do not interpret ambiguous codes as lack of self-understanding or low performance.
- Provide space for self-identified *best-fit type* through qualified reflection; avoid presenting instrument output as infallible.

## 6. Scientific validation roadmap

### Phase 0 — Theory and blueprints
Define each preference pair operationally, intended inferences, boundaries, item-to-construct matrix, expected links to external constructs, and preregistered scoring/analysis. Account for limitations and criticisms of dichotomous typologies.

### Phase 1 — Content and response process
Have at least 3 independent experts in psychometrics and psychological type review every item; consider expert CVI as supplemental evidence. Run cognitive interviews (initial design target 12–20 diverse managers and supervisors). Look for confusing paired statements, accessibility, acquiescence, preference strength and social-desirability pressure. Revise before the main pilot.

### Phase 2 — Usability and feasibility
Conduct voluntary usability pilot (planning target 30–50) on mobile and desktop; check comprehension, completion rates, question stability, device and browser coverage, disability access. Revise the questionnaire and version it.

### Phase 3 — Reliability and item analysis
Plan sample using simulation/power and expected parameters rather than a magic fixed N. Analyze response distributions, item-rest associations, ordinal alpha/McDonald omega per pair where justified, and temporal stability (test-retest over several weeks, report ICC and uncertainty intervals). Paired dichotomy formats may require tailored response models and a psychometrician's choice of analysis.

### Phase 4 — Construct validity
Test the intended four-factor model vs plausible alternatives with appropriate methods. Measure convergence/discrimination using separately licensed or freely usable validated constructs (not copyrighted MBTI questions). Show limitations of factor correlations, shared method variance, and contradictory evidence.

### Phase 5 — Classification stability
For 16 codes, examine repeatability of each letter and whole code; report transition matrices, Cohen's kappa where appropriate, and effects of uncertainty thresholds. Do not treat strong continuous dimension reliability as proof of type-code stability. Calibrate uncertainty bands using measurement precision; remove arbitrary thresholds if unsupported.

### Phase 6 — Fairness and limits of generalization
When sample and consent permit, test measurement invariance/DIF across relevant groups. Do not use management title as evidence of psychological type. Publish limitations and prohibit discriminatory individual comparison.

### Phase 7 — Independent technical review
A psychometrics specialist audits items, data, code, analyses, confidence claims, sample generalizability, consent and reporting. Only then consider a broad production launch. Keep the description "unvalidated pilot" until supported by empirical evidence.

## 7. Current completion status

Implemented:
- Four axes, 48 original paired statements, consistent 5-option responses, reverse/position-sensitive prototype scoring.
- Direct evidence-linked report: fourletter *tentative display-only* code or question marks for exact ties, four RTL-consistent comparative bars, per-axis response counts, verbatim chosen statements, opposing examples, cautious reflections and role-specific **non-scored** practice prompts.
- Print/PDF via browser, no external response upload, self-contained page under `personality-mbti-pilot/index.html`.
- Separate branch; existing main app and session routes were **not** modified.

Still missing:
- Independent **expert** content review; cognitive interviews; real-user UX testing; measured reliability/validity (no confirmed scale or cutoffs); real accessibility and browser audit; authorized official MBTI license if that is the eventual chosen product; consented organizational analytics if desired.
- Live operational integration to main app intentionally gated.

## 8. Manual QA checklist

- [ ] Check all 48 items against construct blueprint and review Persian wording with target users.
- [x] Each axis has 12 items, 6 per first-statement pole direction; 48-item mapping documented in `ITEM-CONTENT-REVIEW-v0.5.csv`.
- [x] All responses = 3 -> `????`.
- [x] Extreme responses generate `ESTJ` and `INFP` as mathematically expected.
- [x] Synthetic DOM and state checks for answer changes, navigation logic and focus; real-device confirmation still required.
- [x] Report scorer refuses any incomplete item vector.
- [ ] Browser reload clears all responses, no network request for answers.
- [ ] RTL on desktop and 320 px mobile, large tap targets, meaningful keyboard focus.
- [ ] Contrast, keyboard accessibility and screen-reader traversal checked in real devices.
- [ ] Printed report omits app controls.
- [ ] Terms do not imply MBTI certification or official MBTI instrument validity.
- [x] Main branch preserved; all changes remain in an unmerged feature branch.

## 9. Intended next deliverables

Expert content ratings and cognitive-interview protocol are the immediate scientific tasks. Existing artifacts include `AUDIT-THREE-PASS-v0.5.md`, `ITEM-CONTENT-REVIEW-v0.5.csv` and `tests/pilot.test.cjs`. A complete psychometric data study must follow before any stronger claims.

**Status:** Research pilot. No scientific or HR use claim.
