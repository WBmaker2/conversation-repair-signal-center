# Task 12 report — Responsive Accessibility, Sequential Pulse, and Reduced Motion

## Scope and design influence

The `frontend-skill` direction was applied as a bright, calm elementary communication console: warm paper background, deep navy text, one teal-blue signal accent, restrained borders, and no dashboard-card mosaic or external assets. Workspace layout stays readable at narrow widths; interaction emphasis is reserved for the current required repair action.

## RED → GREEN

- Added `src/app/accessibility.test.tsx` for six phase axe checks, one skip link/main landmark, language metadata, choice-label surfaces, and pulse count.
- Added `src/shared/CriticalActionButton.test.tsx` for the two-action union, controlled labels/type, and disabled CSS animation contract.
- Tests were run against the pre-change structure first, then implementation made the contracts pass.

## Implemented contracts

- `App` and direct `MissionFlow` harness renders now produce exactly one first-focusable skip link and one `main#main-content[tabindex="-1"]`; invalid mission fallback includes recovery to the center.
- Center has one service `h1`; mission routes have one mission `h1` and phase `h2`. Phase transitions focus the phase heading only when `session.phase` changes; radio selection and same-phase retry do not steal focus. Returning to center focuses the service heading, while initial center does not bypass the skip link.
- All four choice groups use `fieldset`/`legend` and `.choice-label`; dialogue turns use `.dialogue-list`/`.dialogue-turn` one-column mobile structure and English speaker metadata.
- Critical actions remain a strict `'find-ambiguity' | 'send-confirmation'` union. Only the observe and confirm screens expose one `.gi-pulse` each; ordinary buttons do not. Disabled controls do not match the animation selector.
- CSS is split into `tokens.css`, `base.css`, `layout.css`, `components.css`, and `motion.css`, imported by `index.css`. Controls and choice surfaces have 44px minimum dimensions, relative/clamped type, overflow wrapping, 375px single-column rules, and 3px focus-visible outlines.
- Reduced motion disables animation/scroll motion and transitions, gives enabled pulses a persistent 3px outline, and replaces dialogue motion with a static signal border.

## Verification

- `npm run test:run -- src/app/accessibility.test.tsx src/shared/CriticalActionButton.test.tsx` — 12 passed.
- `npm run test:run` — 17 files, 184 tests passed.
- `npm run typecheck` — passed.
- `npm run lint` — passed with the existing six Fast Refresh test-helper warnings only.
- `npm run check:size` — passed; every source file is under 500 lines.
- `npm run check:audio` and `npm run test:audio-verifier` — passed (20 assets verified; 6 verifier tests passed).
- `npm run build` — passed.
- `npm run verify` — passed.

## File sizes and concerns

Largest changed source file is `src/features/record/CommunicationRecord.tsx` at 189 lines; all changed files are below the 500-line limit. No packages, network calls, persistence, deployment, or unrelated source behavior were added. The existing six Fast Refresh warnings in `src/test/missionHarness.tsx` remain intentionally deferred because removing them would broaden this task beyond runtime behavior.

## Commit

Commit: `38e08312a650143901f62c93ea836360875f8bbf` (`feat: add accessible responsive learning signals`)
