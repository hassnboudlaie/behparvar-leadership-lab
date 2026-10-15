# Behparvar attention triangle — educational prototype, version 1

This workshop exercise is an original, unvalidated situational preference activity. It is not the Blake–Mouton Leadership Grid, a psychometric instrument, a personality diagnosis or a performance ranking. Blake–Mouton's two-dimensional framework is described separately at https://www.symlog.com/resources/blake-mouton.

The eight cases are fictional, grounded in the company’s publicly described poultry production and distribution chain. They are not evidence of real company incidents. Existing safety, quality and decision-authority requirements are constraints, not response options participants can trade away.

Each case offers four plausible management actions. Participants rank two distinct actions: an initial priority and a follow-up. Every option has a transparent three-component weight vector in task, people, context order. All vectors have the same positive total of six. The first action contributes twice its vector; the follow-up contributes once. There are no correct-answer labels or ability scores.

For aggregate weights S=(T,P,C), relative shares are S/sum(S). A first selection alone contributes its initial-priority vector with double weight; the dashboard clearly marks the result provisional. Each completed case contributes 18 total weight units. Integer percentages use largest-remainder rounding so they sum to 100. Position uses the unrounded shares, not displayed integers.

The SVG vertices are task=(210,60), people=(375,295), context=(45,295). The displayed point is the barycentric weighted average of these vertices. Grid lines are constant shares at 20%, 40%, 60%, 80%. A dashed center reference is (210,216.6667). The data marker remains hidden until at least one valid first choice exists.

This is a compositional display: an increase in one share reduces the others. It cannot establish absolute competence or show high or low ability across all three dimensions independently. A central point means similar relative shares in these selected cases, not an objectively optimal style. Interpretation is descriptive, local to these cases and intended for reflection.

Choices and results are kept in the existing browser-local workshop state under `triangle.version=1`. There is no server submission or participant comparison. The dedicated reset clears only this exercise. Invalid, duplicate or unknown choice IDs are discarded when restoring saved state. Existing workshop answers and notes are preserved.

Validation: full application script syntax check, DOM interaction harness, manual scoring fixtures, vertex/center coordinate checks, 1,000 varied scoring fixtures, rounded-percent sums, live update of both SVGs, change/rerank behavior, free navigation, reload persistence, partial/final reports, scoped reset and blocked-storage handling. Browser visual QA was unavailable in the authoring environment.
