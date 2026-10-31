# My Management Lab — unified Behparvar management competency laboratory

**Design baseline:** 2026-10-31 · educational design prototype, not an organizationally validated job-competency model.

## Product decision
- Canonical public web app: \`https://hassnboudlaie.github.io/behparvar-leadership-lab/\`.
- One responsive and installable Progressive Web App (PWA). The canonical root contains all existing lessons, discussions, quizzes, cases and local user data. The legacy \`/app/\` URL redirects historic links to this root, including reader hash, selected audience, passport and coach links.
- Do **not** recreate or silently overwrite stored historical answers. Existing storage keys \`behparvar_session1_v4\`, \`behparvar_session2_v1\` through \`behparvar_session6_v1\`, and \`behparvar_app_v1\` are preserved. New skill ratings and action notes live under \`mml_competency_v1\`.
- No backend, account, centralized analytics or AI-chat service. All learner responses remain local to the browser; users on shared devices must take care. A publicly hosted GitHub Pages app is **not** a secure destination for company-confidential data.
- Preserve six sessions, seven free-navigation sections in each session, two independent audience paths, and existing work including the first-session triangle model (not a psychometric test).

## Academic foundations, and what the sources actually support

### A. Whetten & Cameron (2011), *Developing Management Skills*, 8th ed.
It distinguishes management **behaviors** from personality dispositions and describes management skills as observable, improvable and sometimes paradoxical. Part I covers Self-Awareness (printed p.45), Managing Personal Stress (p.105), and Analytical/Creative Problem Solving (p.167). Part II covers Supportive Communication (p.233), Power and Influence (p.279), Motivating Others (p.323), Managing Conflict (p.373). Part III covers Empowerment and Delegation (p.439), Effective Teams (p.489), and Leading Positive Change (p.533). Supplements cover Presentations (p.591), Interviews (p.619), and Meetings (p.651).

Use the original **five-step sequence** for each substantive skill:
1. **Skill Assessment:** identify present behaviors with reflective prompts, structured observation or exercise (not automatically a validated test);
2. **Skill Learning:** define principles and behavioral guidelines;
3. **Skill Analysis:** examine specific effective and ineffective behavior in a credible case;
4. **Skill Practice:** structured roleplay, feedback and second attempt;
5. **Skill Application:** real-life assignment, follow-up and reflection.

Especially important principles from *Supportive Communication* (printed pp.247–260, summary pp.264–265): descriptive rather than evaluative, problem rather than person orientation, specificity, validation, ownership, congruence and supportive listening. Apply these as observational rubrics for the voice, nonverbal signals, listening and next-step agreements in scripted scenarios.

### B. DDI (2015), *Learning and Assessment Links*
This is a catalog of integrated talent-management and development offerings, **not** a single instructional textbook or an unrestricted source of licensed diagnostic tests. Key references:
- **Success Profiles** (printed pp.11–18): distinguish Work Experience, Knowledge & Skills, Personal Attributes, and Competencies, then plan, gather evidence, create a provisional profile and confirm with subject-matter experts. It is essential not to call all four "competencies."
- **Competency Management and Job Analysis** (printed p.17): align behaviors with business strategy, job requirements and stakeholders, validate/confirm role requirements.
- **Manager Ready** (printed pp.30–32): nine assessment domains include coaching for success/improvement, managing relationships, guiding interactions, problem analysis, judgment, delegation/empowerment, gaining commitment and planning/organizing. The proprietary instrument scores **observed** responses to realistic tasks; this web prototype does not claim to implement Manager Ready.
- **Assessing Talent: People Leader** (printed pp.26–27) supports simulations, roleplay, feedback and development plans; the catalog distinguishes frontline and mid-level leaders.
- **Competency Links** (printed pp.162–189) connect selected behavioral competencies to courses; do not present this catalog mapping as Behparvar-validated priorities.

The present BMCF is an **original Behparvar draft** that draws on those structures; it has not undergone criterion validation, local job analysis, or measurement validation. Names/trademarks of DDI are used solely as citations, not as product branding or endorsements.

## Draft BMCF — competency families and role differentiation
Six non-mutually exclusive families: core, managerial, functional (job-family specific), organizational/business, personal and interpersonal. Each item gets one **primary** family and optional secondary link, with an explicit behavior and work product. Avoid conflating business knowledge with proof of managerial competence.

Twelve cross-cutting development priorities in the interface: planning/organizing; coordination; performance management; problem solving; judgment; supportive communication; conflict management; delegation; coaching/developing others; self-awareness/management; business acumen; continuous improvement/change.

For supervisors, minimum target levels are usually 3 (independent application), with 2 for enterprise-level business acumen/change in this **instructional** draft. For managers, target 4 (capability building across units) is suggested; these are NOT formal HR grade requirements without role validation. Suggested four-level descriptors: awareness, guided application, reliable independent application, and advanced application with developing others.

**Functional** competencies require separate requirements for each job family (e.g., feed formulation, quality assurance, livestock operations, equipment maintenance, finance, logistics); the generic training content cannot certify them.

## 6-session program and lesson-level evidence

| Session | Supervisor emphasis | Manager emphasis | Core competency pair | Observable practice |
|---|---|---|---|---|
| 1. Role & competencies | from expert to supervisor | whole-chain business responsibility | self-management + business acumen | role map and a work-behavior reflection |
| 2. Planning & coordination | shift, hand-offs, quality release, maintenance constraints | capacity, cross-unit agreements and resource trade-offs | planning + coordination | integrated plan with owner, due date and constraint |
| 3. Control & problem solving | identify deviation and corrective action | comparable KPIs, baseline/actual, systems issues | performance + problem solving | one-page deviation analysis, later evidence |
| 4. Communication & conflict | descriptive feedback and attentive listening | cross-functional conflict and culture | supportive communication + conflict | roleplay observation, revised dialogue |
| 5. Delegation & development | structured delegation and coaching at work | coaching supervisors / stretch work | delegation + coaching | delegated work agreement and follow-up |
| 6. Business & continuous improvement | understand upstream/downstream effects | environmental scanning, operational strategy and pilots | business acumen + change | small measured improvement pilot |

The existing **seven clickable sections** remain stable per session; add the five-step learning process *inside* them:
1. \`m1\`: skill assessment and self-report plus evidence needs;
2. \`m2\`: conversations and Roleplay;
3. \`leaders\`: learning and reflection on exemplary/ineffective management behavior;
4. \`techniques\`: explicit behavioral guidelines;
5. \`visuals\`: case analysis (plus all existing media/content);
6. \`diseases\`: blind spots, assumptions and failure modes;
7. \`quiz\`: application/transfer and the pre-existing quiz (not removed).

### Conversation scenarios
- **Supervisors:** five characters representing production, quality, maintenance, inventory and shipping; uncertain quality release and maintenance capacity cannot be bypassed for throughput. Dialogue captures tension, vocal tone, body language and joint decision responsibilities.
- **Managers:** five characters representing operations, quality, sales, finance and HR; hypothetical 9% input cost increase and 7%→12% late deliveries must never be presented as actual Behparvar measurements. Require shared definitions of metrics, whole-chain trade-offs, a quality guardrail, a named process owner and a time-bounded pilot.

**Observer rubric:** (1) states specific facts, (2) acknowledges others and their constraints, (3) separates person and problem, (4) tests at least two interpretations, (5) preserves safety and technical authority, (6) states owner/date/follow-up. Good intentions and multiple-choice answers alone are not valid behavioral evidence.

## Data interpretation and privacy
Self-ratings are reflective prompts. They are **not** the DDI assessment, a normed score, an official proficiency certification or proof of performance. No automated high-stakes decisions. For an actual role profile, combine job data, interviews, critical incidents, supervisor observation and content-expert validation; obtain consent and provide fair, consistent assessment procedures.

Learning Passport = manual review history and bookmarks only. After-course development = simple individual action notes; not a centralized tracking system. Installing this PWA does not create accounts or synchronize across devices.

## Beginner-friendly guided learning refresh — 2026-10-31

**UX rule:** "Deep content, light screen." The learner sees one question, one grounded example, one short three-step guide and at most one small practice interaction at a time. Original teaching assets remain available in collapsed supplementary sections; do not remove existing notes or answers. Mobile-first and RTL remain mandatory.

### Three primary user-facing development domains
1. **خودم / Develop Self**: self-awareness, problem solving and professional judgment.
2. **دیگران / Enable Others**: supportive communication, conflict management, delegation and developing colleagues.
3. **کسب‌وکار / Improve the Business**: planning, cross-functional coordination, performance management, business acumen and continuous improvement.

The prior six professional competency families remain available as internal taxonomy for HR/learning design, not as six equal top-level navigation items. Six sessions and seven clickable subsections in each are unchanged.

### Verified Behparvar context, and evidence limits
Public corporate description: Behparvar Industries Development and Expansion Company operates across the poultry meat production chain and associated investment, organization, management, commerce and services with over three decades of operations. See public company profile: https://www.linkedin.com/company/behparvargroup/ . The original site and repository include `assets/behparvar-campus.webp`, `assets/feed-official.webp` and `assets/production-official.webp` as contextual photographs; reuse these sparingly.
Do **not** represent any invented product, cost, staffing, delivery, downtime, quality metric or organizational unit as verified Behparvar data. Learning scenarios are transparently fictional but faithful to the cross-functional problems inherent in poultry-chain operations. Quality, food safety, biosecurity and technical approval constraints always take precedence over schedule pressure.

### Supplementary pedagogy sources (not copied content)
- **Open University / OpenLearn**: `Managing and managing people` for transition into management, basic roles and limitations; `Effective communication in the workplace` and `Leadership and followership` for introductory bite-sized, approachable learning and reflection. https://www.open.edu/openlearn/money-business/leadership-management/managing-and-managing-people/content-section-0
- **Pearson MyLab Management** (formerly associated with the label MyManagementLab): *Mini Sims*, reflective inventory, instant feedback and personalized study plans as product **pattern inspirations**, not as content/license. Official: https://www.pearson.com/en-gb/higher-education/products-services/mylab/mylab-management.html . No Pearson proprietary test, lesson, simulation, image, scoring rubric or copyrighted text is transplanted. The local name "My Management Lab" could be mistaken for Pearson's similarly named existing product; conduct trademark/branding clearance before commercial distribution, and do not suggest affiliation or endorsement.
- Primary intellectual foundations remain Whetten & Cameron, *Developing Management Skills*, 8th ed. (2011): assessment → learning → analysis → practice → application; and DDI, *Learning and Assessment Links* (2015): job-relevant success profiles and observable competencies.

### Changes included
- Original novice-friendly examples: 12 role-sensitive mini lessons (`assets/mml-guided-lessons.js`), each with common mistake, improved example, three steps, a three-option decision and immediate contextual feedback.
- One short natural dialogue per lesson (12 total) including *tone*, body language and a more professional alternative; Session 1 retains the full five-person scripted roundtable as optional expanded content.
- **Single entry dashboard** with three domain cards; the duplicate 6-session grid and bulky detail tiles are removed, with additional academic content in accordions.
- Deliberate visual strategy: one existing corporate image on the dashboard, selected operating-context photos, one simple planning table (Session 2), illustrative performance bar chart clearly labeled **hypothetical** (Session 3), a realistic dialogue before/after (Session 4), a delegation sequence (Session 5), and a conceptual value-chain flow (Session 6).
- **Guided IDP**: one action, when, evidence. Persist under existing `mml_competency_v1` without clearing previous behavior/action notes or root assessments.
- Existing learning content moved into explicit, accessible `details` drawers and not deleted; the first-session triangle, the old quizzes, and note keys remain intact.
- No login or back-end synching; browser-local data cannot be used for organizational certification.

### Release gate
Run `node tests/mml-guided-regression.cjs`, legacy `verify-six-sessions.js`, `verify-seven-structure.js`, and `verify-session-core.js`. The former expects a full visible view and the latter tests original navigation and data. Verify actual Android Chrome, Safari iOS and desktop manually after deployment. No learner should be told their behavioral competence is validated based solely on the app rating.

---

## Release and validation checklist
- [x] Source lessons kept as a canonical single root, app iframe retired via legacy redirect
- [x] Deepened six-session/two-track content with behavioral statements, cases, scenarios, self-ratings and action notes
- [x] Added a root manifest, service worker and install control
- [x] Preserved original data and legacy routes in implementation
- [x] New educational scripts syntactically checked
- [ ] Cross-device visual QA on Chrome Android, Safari iOS, desktop
- [ ] Confirm installed app icon and launch behavior in target browsers
- [ ] Test online-to-offline transition and update propagation on real devices
- [ ] Organizational validation of job families, target levels and scoring rubrics
- [ ] Accessibility screen-reader review and formal behavioral-assessment reliability

The product is an initial operational implementation, **not** a final validated management assessment system.
