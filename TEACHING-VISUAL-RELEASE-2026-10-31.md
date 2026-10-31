# My Management Lab — educational and visual release (2026-10-31)

## Purpose and unchanged contracts
- Retains canonical 6 sessions × 7 selectable sections × 2 role routes (Managers/Supervisors).
- Preserves original lesson and assessment content, route hashes, classroom view, prior notes, existing local storage keys, role-specific states, and PWA installation.
- Uses Behparvar navy `#132c68`; restrained burgundy/teal for feedback and emphasis.
- All pedagogical case narratives are fictional, not factual claims about specific employees or an actual incident.

## New educational architecture
- 42 topic-specific authored teaching chapters, rendered in both manager and supervisor contexts (84 combinations).
- Each chapter includes: meaningful heading and learning outcomes; an explained core concept; contextual workplace application; a 3-row comparison table; a process flow or conceptual figure; a reflection/application question; a caution regarding simplistic interpretations; and an expandable source note.
- Diagrams: Blake–Mouton-inspired conceptual task/people grid, workflow maps, a hypothetical 8-hour target vs 6-hour actual bar chart, a conversation process flow, an authorization ladder, and PDCA-style improvement flow.
- Visuals are schematic, not empirically calibrated scores. In the one numeric teaching chart, numbers are explicitly fictional.
- 12 fully scripted role-plays (6 topics × Managers/Supervisors), with speaking turns, voice/body-language instructions and facilitator feedback.

## Lesson mode switching
- Tab 1: «📘 درسنامه، جدول و نمودار»
- Tab 2: «محتوای اصلی و تمرین‌ها»
- Tab 3: «مرور سریع و تمرین هدایت‌شده» (for the final section, the label is «برنامه اقدام من»).
- Session 1 defaults to original deeply authored course content; Sessions 2–6 default to the teaching reader in non-quiz sections.
- Final-quiz sections default to original content to avoid hiding assessments.
- No changes to scoring algorithms or auto-claims that viewing constitutes competency acquisition.
- No new storage writes are introduced by the authored teaching library.

## Educational source policy
- Source concepts include Whetten & Cameron (Developing Management Skills), Blake & Mouton (Managerial Grid), DDI competency-method inspirations, Ruth King (The Ugly Truth About Managing People / «حقایق تلخ درباره مدیریت منابع انسانی») and the general PDCA improvement cycle.
- The written lessons are original educational paraphrases and organizational simulations, **not** reproduced copyrighted text, direct quotes, formal psychometric instruments or verified outcomes of a scientific intervention.
- Existing book-based cases and historically sourced leader material remain accessible in original content modes; none is deleted.

## Files
- `assets/mml-lesson-library-v1.js` — source-backed lesson content, table/diagram renderer, contextual roleplay scripts.
- `assets/mml-teaching-ui-v1.css` — adaptive RTL reading layout, tables, conceptual figures, script styling.
- `assets/mml-visual-refresh-20261031.js` — integrates teaching reader as third mode while preserving original guided/legacy panels.
- `index.html` — includes new teaching assets and updates outdated session placeholders.
- `sw.js` — refreshed offline cache, network-first strategy.

## Verification and honest limits
- Syntax was checked for both authored library and updated UI integration.
- Source tests confirmed six sessions, seven chapters each, and successful render for 84 role × section combinations.
- All 12 role-play scripts were verified for existence; all 84 rendered pages included a table and educational source drawer; 36 figure instances were verified across both role routes.
- Original 42 hash routes and prior storage keys remain present in index.html; no learning-state writes in the new library.
- The public GitHub Pages endpoint was reachable and served the new lesson library and stylesheet files.
- **Not yet verified**: actual browser clicks, screenshots across narrow devices, font rendering, service-worker update behavior on every installed PWA, and end-to-end preservation of saved notes/quiz state under interaction. Live browser automation was unavailable at audit time due to the external browser provider's exhausted wallet. Passing static tests is not a substitute for device-level QA.

## Manual acceptance checklist
1. Open fresh site and already-installed PWA on Android and iOS.
2. Visit Sessions 1 and 4, switch Manager/Supervisor, open all three content modes.
3. Confirm tables scroll horizontally within viewport, diagram labels are legible and Role Plays show delivery cues.
4. Check previous quiz results and saved notes before/after refresh (do not reset).
5. Open session-specific quiz, verify there is no answer leakage, and confirm that Back returns to the previous view.
6. Validate PWA update, offline fallback, loading on 320/360/390px and a desktop classroom display.
