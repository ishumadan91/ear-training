# Ear Training

A mobile ear-training web app. UI is a **Lit + TypeScript** component library
organised by **Atomic Design**, themed with **design tokens**, bundled with
**Vite**, and documented in **Storybook**.

## Commands

| Command                   | Purpose                                  |
| ------------------------- | ---------------------------------------- |
| `npm run dev`             | Vite dev server (renders Practice page)  |
| `npm run storybook`       | Component explorer at :6006              |
| `npm run typecheck`       | `tsc --noEmit`                           |
| `npm run build`           | Type-check + production bundle to `dist` |
| `npm run build-storybook` | Static Storybook to `storybook-static`   |

## Architecture

Atomic Design. Every UI element is a custom element tagged `et-*`, one component
per folder with a co-located `*.stories.ts`.

```
src/
  styles/        tokens.css (source of truth), tokens.ts, global.css, colors.stories.ts
  data/          scales.ts — scales, thaats, keyboard layout, semitone mapping
                 preferences.ts — localStorage settings (validated on read)
  audio/         audio-engine.ts — Web Audio synthesis (piano + guitar)
  components/
    atoms/       et-icon, et-icon-button, et-toggle, et-button, et-divider,
                 et-input-slot, et-badge, et-chip, et-card, et-alert, et-select
    molecules/   et-menu-segment, et-input-row, et-play-button, et-segmented,
                 et-field, et-waveform, et-stat
    organisms/   et-menu-bar, et-practice-content, et-piano, et-settings-panel,
                 et-practice-card, et-stats-bar, et-about-sheet
    templates/   et-practice-template (layout, no state)
    pages/       et-practice-page (owns state, wires events)
  main.ts        app entry (imports the page)
  index.html     Vite root document
docs/design/     colors.md, design-system.md
```

`et-menu-bar`, `et-menu-segment` and `et-toggle` predate the current design and
are no longer used by the Practice screen (settings moved into
`et-settings-panel`). They still build and have stories — remove them once
you're sure no upcoming screen needs them.

Data flows **down** via reactive `@property()`; behaviour flows **up** via
`CustomEvent`s that `bubble` + `compose` (so they cross Shadow DOM). Pages own
state; templates/organisms are presentational.

## Conventions (read before adding components)

- Tag `et-<name>` (kebab); class `Et<Name>` (Pascal); files `et-<name>.ts`.
- **Tokens only** — no raw hex/px-color in components. Pull from `tokens.css`
  (`var(--color-*)`, `var(--space-*)`, `var(--radius-*)`). See
  [docs/design/colors.md](docs/design/colors.md).
- Inputs = `@property`. Outputs = `CustomEvent` (`bubbles: true, composed: true`).
- Co-locate a `*.stories.ts` for every component; cover key states.
- Icons live in `src/components/atoms/icon/icon-registry.ts` and fill with
  `currentColor` (color them via CSS `color`).
- Put a component in the lowest atomic layer that fits; compose upward.

## Color scheme

Bright Teal `#008080` (primary) · Warm Coral `#FF6F61` (CTA) · Light Sand
`#F4F1DE` (bg) · Navy `#003049` (headings) · Dark Slate `#2E2E2E` (text). Teal =
"making sound", Coral = the one primary CTA per screen. Details in
[docs/design/colors.md](docs/design/colors.md).

## Design source

The Practice screen comes from the **"Ear Trainer App"** project on Claude
Design (`claude.ai/design/p/5b268de8-8c9e-4c86-97de-a85a4169d9f1`), read via the
`DesignSync` tool. That project binds the **"Learn with Chordial Guy Design
System"**, whose tokens carry the same palette as ours — `tokens.css` mirrors
its color, radius, shadow and type scales, so the two stay visually identical.
Re-read the design with `DesignSync(get_file)` before changing screen layout.

Earlier screens came from the Figma file **"Mobile-wireframes"** (via the Figma
MCP server); those are superseded for Practice but still describe other flows.

**Scales are degree sets, not note names.** A major scale is `[0,2,4,5,7,9,11]`
in every key. Spelling scales with note names forces a sharps-or-flats choice
the keyboard can't honour, which was a recurring source of unwinnable rounds.

`et-piano` is a real **chromatic** keyboard, **27 keys**, scrolling
horizontally. The span follows the root (`computeRange`) — a fifth below the
tonic to a twelfth above — so the tonic sits inside the keyboard rather than at
its edge; roots from G upward drop an octave to stay in register. It is not
filtered to the active scale: a learner can tap notes outside it, which is what
makes the exercise a genuine test.

**Octave is part of the answer.** A `Note` is
`{name, label, octave, semitone, octaveLabel}`, and `absPitch()`
(`octave × 12 + semitone`) is what playback and grading compare.

**Western and Indian label differently.** Western names are absolute with the
octave number beneath (`C4`). Sargam is abbreviated Bhatkhande (`S R R G G M M
P D D N N` with komal/tivra marks), rotated onto the root, and marks the saptak
instead of numbering octaves.

**The saptak is measured from the tonic, never from C.** `saptakOf(abs, rootAbs)`
returns mandra below the root, madhya for root..root+11, taar from root+12. With
the root at G3 the madhya saptak is G3–F♯4, so F♯3 takes a dot below and G4 a
dot above — C plays no part in it. The root picker shows the octave (`C4`, `G3`)
precisely so that boundary is visible; roots from G upward sit in octave 3.

**The app defaults to Indian notation** on a first run (Bilawal, root C4) — see
`DEFAULT_PREFERENCES`. A returning user's stored choice always wins. Tests that
exercise the Western path must seed preferences rather than lean on the default.

**Marks are drawn in CSS by `et-swara`, not with combining characters.** A
combining low line under "N" lands off-centre in Open Sans, and a komal swara in
the mandra saptak needs a line *and* a dot stacked below the same letter, which
combining marks collide on. `Note` therefore carries `komal` / `tivra` /
`saptak` as data; `noteText()` builds the combining form only for plain-text
contexts (the revealed answer, aria-labels). **Tests must read the `et-swara`
element, not `textContent`** — the glyph lives in its shadow root.

Nothing user-visible may spell a note as text: the keys, the answer slots and
the revealed answer all draw glyphs (`et-swara`, `et-note-list`). `noteAria()`
exists only for spoken labels and spells the marks out in words
("komal Ni, mandra saptak"). A rendered combining mark is a bug — `ui-audit`
walks every shadow root and fails on one.

**Filled answer slots are buttons.** Tapping one replays that note in the
*input* instrument, matching what the key sounded like when it was tapped.

Two placements in that atom are load-bearing and look arbitrary otherwise: the
komal line rides high, close to the letter, so the mandra dot below it has clear
air; and the tivra stroke is offset right of centre so it never lands on the
centred taar dot. Both cases collided before.

## Root note

The root selects **which keys belong to the scale**, and for Indian notation
**where Sa sits**. It is *never* added to a pitch before playing — a key always
sounds the note it is labelled with, or the keyboard is lying to the learner.

- **Western names are absolute.** C is C at every root; only scale membership
  moves. A♯ major is `A♯ C D D♯ F G A`.
- **Sargam is relative.** Sa *is* the tonic, so `keyLabel()` rotates the
  syllables to put Sa on the root: at root A♯ the A♯ key reads Sa and the C key
  reads Re.

`scalePool()` is derived from the keyboard (`allKeys()`) rather than computed
independently. That guarantees two things a separate computation kept breaking:
every pool note is tappable whatever the root, and each note carries the label
of the key that actually sounds it.

Keys outside the scale are **dimmed, not disabled** (`.out-of-scale`) — a hint,
not a rail; tapping a wrong note is how the exercise tests you. The dimming and
the tune pool both read `scalePitchClasses()`, so they can never disagree.

**Notation, scale and root live on the practice screen**, not in Settings — a
pill segmented control plus two pill selects (`et-select variant="badge"`) in a
**sticky** row above the listening card. They change between rounds, so burying
them behind a settings toggle would cost two taps every time. Settings keeps
only difficulty and instrument. The
old Round/Streak/scale/root badges are gone; streak still shows in the stats
card, and `round` is tracked but no longer displayed.

A **backspace** beside the answer slots removes the last entered note. Using it
after a round has been graded clears the feedback and restores the Clear /
Check row — an undo of the grade, which is what the design intends.

The header carries **two** icon buttons (About, Settings). They fire the same
`et-icon-button-click`, so `et-practice-template` names the intent and re-emits
`et-about-toggle` / `et-settings-toggle`. Anything selecting the header button
positionally will grab the wrong one.

## Audio

`src/audio/audio-engine.ts` synthesises everything at runtime — no sample
assets, works offline. **Piano** is additive (triangle fundamental + four sine
partials, lowpass closing as it decays); **guitar** is Karplus-Strong rendered
into an `AudioBuffer`.

Two things there are load-bearing and easy to break:

- The delay line uses **fractional interpolation**. Rounding it to whole samples
  puts the guitar up to ~26 cents sharp, which is disqualifying in a pitch app.
- `resume()` swallows rejections. Safari rejects it when it judges the call
  non-gesture-initiated, and that must not abort scheduling.

Browsers block audio until a user gesture, so the first sound must originate in
a click handler. The engine returns silently when Web Audio is unavailable, so
non-browser DOMs don't throw.

## Grading

Four outcomes, checked in order — see `_onCheck` in `et-practice-page`:

| Outcome | Condition | Score | Streak |
| --- | --- | --- | --- |
| `correct` | every note matches pitch class **and** octave | +1 per note | +1 |
| `octave` | pitch classes all match, octaves don't | half, rounded up | — |
| `transposed` | every note off by the *same* interval | +1 | — |
| `wrong` | anything else | 0 | — |

Only `correct` extends the streak. `octave` and `transposed` render amber
(`et-alert tone="warning"`, `et-input-slot state="octave"`).

Any outcome other than `correct` reveals the tune in the banner's second line
(`et-alert detail`), spelled the way the *scale* spells it — `E♭4`, even though
the learner taps the key labelled `D♯4`.

**Pitch classes come from `semitoneOf()`, never from indexing the keyboard's
label list.** The keyboard spells black keys with sharps (`D♯`) while several
Western scale pools spell them with flats (`E♭`); a label lookup returns -1 for
every flat, which would make those scales unwinnable.

## Preferences

`src/data/preferences.ts` persists **settings only** — notation, scale, root,
difficulty, instrument — under `ear-training:preferences`. Progress (score,
streak, accuracy, round) is deliberately *not* stored, so every visit starts a
clean session and a stale streak can't look like a fresh one.

Two things there are load-bearing:

- **Everything is validated on read.** Stored values are user-editable and
  outlive schema changes, so each field falls back to its default if
  unrecognised. `scaleKey` is checked *against the resolved notation* — a thaat
  stored under `western` is meaningless and resets to Major.
- **Every access is wrapped in try/catch.** Safari in private mode throws
  rather than returning null. Losing persistence is fine; taking the app down
  with it is not.

Accuracy is `number | null`. It reads `–` until a round has actually been
graded — showing 100% up front would claim a perfect record nobody earned.

**First-visit onboarding.** `hasSeenAbout()` / `markAboutSeen()` sit under their
own key (`ear-training:about-seen`), so clearing settings doesn't replay
onboarding and vice versa. The page opens the About sheet once on a first visit
and marks it seen **at open, not at dismiss** — marking on dismiss would replay
it forever for anyone who reloads without closing it. Where storage is
unavailable the flag reads false and the sheet opens every launch: it fails
toward showing the help, never toward hiding it.

## Instruments

The tune plays on the selected instrument and **the learner's taps answer on
the other one** (`inputInstrument()`), so timbre can never be used as a crutch —
only pitch.

Playing a tune sets `settingsLocked`, which disables **root, scale and
instrument** for the rest of the round: the learner has heard a tune in a given
key on a given instrument, and moving any of those underneath a half-entered
answer is confusing. Dealing a new tune releases the lock, so a pending change
takes effect from the next tune onwards. (The design only locks the instrument;
extending it to root and scale was a deliberate follow-up.)

## Workflow helpers

- Skill `.claude/skills/new-component` — scaffold a new atomic component + story.
- Agent `.claude/agents/figma-to-component.md` — turn a Figma node into tokenized
  Lit components following these conventions.
