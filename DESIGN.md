# CircuitMentor — Design System

**Version** 1.0 · **Theme** Black and blue, dark-first
**Lineage** Apple Human Interface Guidelines (iOS 26 / macOS Tahoe 26, Liquid Glass materials)
**Implementation** `tokens.css`

---

## 1. What this product is

A workspace where an electronics student builds a real circuit and a mentor watches over their shoulder. Two things follow from that sentence and they govern everything below.

**The circuit is the content. Everything else is chrome.** The HIG calls this deference. Here it is literal: the canvas is the only surface that carries saturated colour, and it earns that because on a circuit board colour *is* information — red is the supply rail, black is ground, the glowing one is the net you are probing. Every panel, toolbar, and sheet around it is near-monochrome so that the moment something on the canvas turns amber, your eye goes straight to it.

**The mentor is present, not intrusive.** A tutor that shouts is a tutor students mute. The mentor gets its own voice — a cyan that appears nowhere else — and it speaks at the edges: a dock, a sheet, a halo on a component. It never takes the centre of the screen.

### Design plan

**Colour.** True black for the canvas void, a blue-cast graphite ramp for every surface above it, one systemBlue accent for interaction, one cyan reserved for the mentor, and the four Apple system status hues restricted to circuit state. Six base values:

| | | |
|---|---|---|
| `#000000` | Void | The canvas itself |
| `#05070A` | Base | App background behind panels |
| `#0C1017` | Panel | Sidebars, docks, toolbars |
| `#141A24` | Raised | Cards, popovers, inputs |
| `#0A84FF` | Signal blue | Interaction, selection, focus |
| `#64D2FF` | Mentor cyan | The AI voice, and nothing else |

The graphite ramp is hue-shifted toward 215° rather than neutral grey. Against the true-black canvas the panels read as *cooler* than black, which is what makes the black feel like depth rather than an absent background — the same trick an oscilloscope bezel plays against its screen.

**Type.** One family. SF Pro across the interface, SF Mono for anything that is a value, a designator, a pin name, or a netlist line. The mono is not stylistic — it means "this is a measured quantity," and it is the reason `R1 · 220 Ω · ⅟₄ W` scans as a specification rather than as prose. Two density scales, switched by pointer type: 13 px base for precise pointers (macOS convention, and the density a 12-panel editor needs) and 17 px base for touch (iOS convention, and the size a thumb needs).

**Layout.** Asymmetric three-zone: a narrow icon rail at the far left, the canvas taking all remaining width, a dock on the right that holds either the inspector or the mentor. The canvas is never boxed in a card and never has a border — it bleeds to the panel edges, so the circuit reads as the room you are standing in rather than a picture hanging on a wall. Panels align to a 4 pt grid; canvas content aligns to its own 2.54 mm (0.1 in) pitch grid, because that is the real pitch of a breadboard and everything placed on it must land on it.

**Principles.** Spend boldness once: the canvas. Panels are quiet, tight, and repetitive on purpose. Status colour never decorates — if something is amber, current is flowing somewhere it should not. Motion answers actions; nothing animates on its own.

---

## 2. Colour

### 2.1 Surfaces

Apple's dark mode conveys elevation by making surfaces *lighter*, not by stacking shadows. Follow that. Shadows appear only on genuinely floating things (popovers, sheets, modals), never on inline panels.

| Token | Value | Use |
|---|---|---|
| `--cm-void` | `#000000` | Canvas background only |
| `--cm-base` | `#05070A` | App background, gaps between panels |
| `--cm-panel` | `#0C1017` | Sidebars, docks, toolbars, the mentor rail |
| `--cm-raised` | `#141A24` | Cards, list rows, inputs, popover bodies |
| `--cm-hover` | `#1C2431` | Hover fill on interactive rows |
| `--cm-pressed` | `#243040` | Active/pressed fill |
| `--cm-line` | `rgba(255,255,255,.08)` | Hairline separators, control borders |
| `--cm-line-strong` | `rgba(255,255,255,.14)` | Panel edges, focused control borders |

Never stack more than three surface levels in one region. If you need a fourth, the hierarchy is wrong.

*Note (Architectural Update): Superseding the flush-docked structural chrome rule, the Library panel and Right Dock float as detached, curved (`--cm-r-lg`) glass cards with 16px margins, light-blue tint (6–10%), and `backdrop-filter: blur(24px) saturate(160%)`, while internal cards/rows remain solid `--cm-raised` for WCAG 4.5:1 text contrast.*

### 2.2 Text

| Token | Value | Contrast on `--cm-panel` | Use |
|---|---|---|---|
| `--cm-text` | `#F2F5F9` | 17.4:1 | Primary content, values, headings |
| `--cm-text-secondary` | `#9BA6B4` | 7.4:1 | Labels, metadata, helper text |
| `--cm-text-tertiary` | `#6B7685` | 3.8:1 | Placeholder, disabled hints, units — **never** essential text |
| `--cm-text-disabled` | `#464F5C` | 2.0:1 | Disabled control labels (paired with `aria-disabled`) |

### 2.3 Interaction blue

Apple's `systemBlue` in dark appearance, with a ramp for states.

| Token | Value | Use |
|---|---|---|
| `--cm-blue` | `#0A84FF` | Primary action, selection, focus ring, active tab |
| `--cm-blue-hover` | `#2D97FF` | Hover on filled blue |
| `--cm-blue-pressed` | `#0060DF` | Pressed on filled blue |
| `--cm-blue-text` | `#64A8FF` | Blue text on dark surfaces (the 500 fails contrast as text) |
| `--cm-blue-tint` | `rgba(10,132,255,.14)` | Selected row fill, tinted secondary buttons |
| `--cm-blue-tint-strong` | `rgba(10,132,255,.24)` | Selected + hovered |

`--cm-blue` at `#0A84FF` on `--cm-panel` is 5.8:1 as a fill with white text, but only 4.1:1 as text on the panel. Use `--cm-blue-text` for any blue *text*. This distinction is the one people skip and it is the most common accessibility failure in blue-accented dark themes.

### 2.4 Mentor cyan

Reserved. If cyan appears on something the AI did not produce, it is a bug.

| Token | Value | Use |
|---|---|---|
| `--cm-mentor` | `#64D2FF` | Mentor avatar, streaming caret, citation links, ghost proposal outlines |
| `--cm-mentor-tint` | `rgba(100,210,255,.12)` | Mentor message background, ghost fill |

The system speaks in blue, the mentor speaks in cyan. Once a student has used the app for ten minutes this is invisible and load-bearing — they stop reading labels and start reading hue to know whether a suggestion came from a rule or from the model.

### 2.5 Circuit status

Apple system colours, dark appearance. Restricted to circuit state; never used for UI chrome moods.

| Token | Value | Meaning |
|---|---|---|
| `--cm-ok` | `#30D158` | Simulation converged, ERC clean, task passed |
| `--cm-warn` | `#FF9F0A` | ERC warning, component near a rating limit |
| `--cm-error` | `#FF453A` | ERC error, short circuit, no convergence |
| `--cm-probe` | `#FFD60A` | Active probe, measured value readout |

### 2.6 Wire semantics

On the canvas, colour is data. These are conventions from real benchwork and students should carry them out of the app.

| Token | Value | Meaning |
|---|---|---|
| `--cm-wire-vcc` | `#FF453A` | Positive supply rail |
| `--cm-wire-gnd` | `#98A2B3` | Ground — grey, not black, because black is the canvas |
| `--cm-wire-signal` | `#0A84FF` | General signal net |
| `--cm-wire-bus` | `#64D2FF` | Multi-conductor bus (I²C, SPI) |
| `--cm-wire-selected` | `#FFFFFF` | Selection, with a 3 px blue glow beneath |

**The red collision, resolved.** `--cm-wire-vcc` and `--cm-error` are the same hue, which would make "this wire is the supply" and "this wire is faulty" indistinguishable. So a faulty wire is never recoloured. Instead it keeps its semantic colour and gains a **4 px halo at `rgba(255,69,58,.35)` plus a 6-4 dashed white overlay stroke animating at 1.2 s linear**, with a numbered error badge at the midpoint. Motion and shape carry the fault; hue stays reserved for topology. This also means the fault indication survives colour-blindness and greyscale printing, which the hue-swap would not.

---

## 3. Materials

### 3.1 Liquid Glass

iOS 26 and macOS Tahoe 26 made translucency a distinct functional layer floating above content. Use it exactly where Apple does: **on controls that hover over content**, never on content itself.

*Note (Sidebar Glass Update): Translucency is deliberately extended to the detached Library and Dock sidebars (floating cards with 16px viewport/canvas margins, 4-corner curves `--cm-r-lg`, and light-blue gradient tint over canvas content).*

| Token | Backdrop filter | Fill | Use |
|---|---|---|---|
| `--cm-glass-thin` | `blur(20px) saturate(160%)` | `rgba(12,16,23,.55)` | Floating canvas toolbars, the zoom pill |
| `--cm-glass-regular` | `blur(30px) saturate(180%)` | `rgba(20,26,36,.66)` | Popovers, dropdowns, command palette |
| `--cm-glass-thick` | `blur(44px) saturate(180%)` | `rgba(12,16,23,.82)` | Sheets, modal backdrops |

Every glass surface carries a specular hairline — a 1 px inner highlight along the top edge that reads as the lit edge of a pane:

```css
.glass {
  background: var(--cm-glass-regular-fill);
  backdrop-filter: var(--cm-glass-regular);
  border: 1px solid var(--cm-line);
  box-shadow: var(--cm-hairline-top), var(--cm-shadow-popover);
}
```

**Never put glass over the canvas when something is being measured.** A translucent toolbar over a live waveform makes the waveform unreadable. Floating canvas toolbars switch to `--cm-raised` opaque while a simulation is running. This is a real HIG principle (content legibility outranks material consistency) applied to a case Apple never had.

**Fallbacks are mandatory:**

```css
@supports not (backdrop-filter: blur(1px)) {
  .glass { background: var(--cm-raised); }
}
@media (prefers-reduced-transparency: reduce) {
  .glass { background: var(--cm-raised); backdrop-filter: none; }
}
```

### 3.2 Elevation

| Token | Value | Use |
|---|---|---|
| `--cm-hairline-top` | `inset 0 1px 0 rgba(255,255,255,.07)` | Every raised or glass surface |
| `--cm-shadow-popover` | `0 8px 24px rgba(0,0,0,.48), 0 2px 6px rgba(0,0,0,.36)` | Popovers, dropdowns, tooltips |
| `--cm-shadow-sheet` | `0 -12px 40px rgba(0,0,0,.55)` | Bottom sheets (cast upward) |
| `--cm-shadow-modal` | `0 24px 64px rgba(0,0,0,.60)` | Modals, command palette |
| `--cm-glow-selection` | `0 0 0 1px var(--cm-blue), 0 0 12px rgba(10,132,255,.45)` | Selected canvas element |

---

## 4. Typography

### 4.1 Families

```css
--cm-font: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Inter var", system-ui, sans-serif;
--cm-font-display: "SF Pro Display", -apple-system, BlinkMacSystemFont, "Inter var", sans-serif;
--cm-font-mono: "SF Mono", "JetBrains Mono", ui-monospace, "Menlo", monospace;
```

`SF Pro Display` above 20 px only — it is optically sized for large settings and looks thin at body size. Below 20 px, `SF Pro Text`.

**Where mono is required**, without exception: component designators (`R1`, `U3`), parameter values with units (`220 Ω`, `4.7 µF`), pin names (`PB5`, `A0`), net labels (`N$12`), netlist and code views, simulation readouts, and hex/binary. Mono here is a semantic marker, not a style choice.

### 4.2 Dual scale

Two densities, switched on pointer type rather than viewport width — a 1280 px iPad needs touch density and a 1280 px laptop does not.

| Role | Precise (13 px base) | Coarse (17 px base) | Weight / tracking |
|---|---|---|---|
| Display | 28 / 34 | 34 / 41 | 600, −0.02em |
| Title | 20 / 25 | 22 / 28 | 600, −0.01em |
| Heading | 15 / 20 | 17 / 22 | 600, 0 |
| Body | 13 / 18 | 17 / 22 | 400, 0 |
| Callout | 12 / 16 | 16 / 21 | 400, 0 |
| Label | 12 / 16 | 15 / 20 | 500, 0 |
| Caption | 11 / 14 | 13 / 18 | 400, +0.01em |
| Micro | 10 / 13 | 12 / 16 | 500, +0.02em |
| Mono body | 12 / 17 | 15 / 20 | 400, 0 |
| Mono micro | 10 / 13 | 12 / 16 | 500, 0 |

```css
:root { --cm-scale: 1; }
@media (pointer: coarse) { :root { --cm-scale: 1.308; } }   /* 13 → 17 */
```

Two rules that apply everywhere:

- **Sentence case, always.** Buttons, labels, section headers, menu items, empty states. No capitalised labels, no tracked-out uppercase eyebrows.
- **Prose caps at 68 characters.** Mentor explanations, concept text, task briefs. `max-inline-size: 68ch` on the text container, not on the panel.

### 4.3 Numerals

Tabular figures on anything that changes in place — simulation readouts, probe values, timers. Without them the digits jitter as they update and the whole readout looks unstable.

```css
.value, .readout, .mono { font-variant-numeric: tabular-nums; }
```

---

## 5. Geometry

### 5.1 Radii and the concentric rule

Apple's iOS 26 guidance is explicit that nested corners must be *concentric*: the inner radius equals the outer radius minus the padding between them. A 14 px card with 8 px padding holds 6 px children. Get this wrong and the gap between corners visibly pinches.

| Token | Value | Use |
|---|---|---|
| `--cm-r-xs` | `6px` | Badges, chips, inputs nested inside cards |
| `--cm-r-sm` | `10px` | Buttons, list rows, small controls |
| `--cm-r-md` | `14px` | Cards, popovers, inspector groups |
| `--cm-r-lg` | `20px` | Panels, mentor dock, floating toolbars |
| `--cm-r-xl` | `28px` | Sheets, modals |
| `--cm-r-pill` | `980px` | Pill buttons, segmented controls, the zoom readout |

```css
/* Concentric nesting, expressed so it can't drift */
.card   { --r: var(--cm-r-md); --p: var(--cm-space-2); border-radius: var(--r); padding: var(--p); }
.card > * { border-radius: calc(var(--r) - var(--p)); }
```

### 5.2 Spacing

4 pt grid. Named by step, not by t-shirt size, because t-shirt sizes stop scaling past five values.

| Token | Value | | Token | Value |
|---|---|---|---|---|
| `--cm-space-0` | `2px` | | `--cm-space-5` | `24px` |
| `--cm-space-1` | `4px` | | `--cm-space-6` | `32px` |
| `--cm-space-2` | `8px` | | `--cm-space-7` | `40px` |
| `--cm-space-3` | `12px` | | `--cm-space-8` | `56px` |
| `--cm-space-4` | `16px` | | `--cm-space-9` | `80px` |

The canvas is exempt. Circuit geometry snaps to `--cm-grid-pitch: 10px` at 100% zoom, representing 2.54 mm.

### 5.3 Target sizes

| Pointer | Minimum target | Visual control height |
|---|---|---|
| Precise | 28 × 28 px | 22–28 px |
| Coarse | 44 × 44 px | 36–44 px |

Canvas pins render at 5 px but carry a 44 px transparent hit area on coarse pointers. Visual size and target size are independent; only the target is constrained.

---

## 6. Motion

### 6.1 Curves

Built-in CSS easings are too weak to read as intentional. Use these four and nothing else.

```css
--cm-ease-out:    cubic-bezier(.23, 1, .32, 1);      /* entering, exiting — default */
--cm-ease-in-out: cubic-bezier(.77, 0, .175, 1);     /* on-screen movement, morphs */
--cm-ease-sheet:  cubic-bezier(.32, .72, 0, 1);      /* drawers, sheets — iOS drawer curve */
--cm-ease-linear: linear;                             /* progress, marching-ants, spinners */
```

**Never `ease-in` on a UI element.** It withholds movement at the exact moment the user is watching hardest, so a 300 ms `ease-in` feels slower than a 300 ms `ease-out`.

### 6.2 Durations

```css
--cm-d-press:   120ms;   /* button press feedback */
--cm-d-tooltip: 140ms;
--cm-d-popover: 180ms;   /* dropdowns, menus, the inspector's disclosure */
--cm-d-panel:   240ms;   /* dock open/close, sidebar collapse */
--cm-d-sheet:   360ms;   /* bottom sheet detent changes */
```

Nothing in the interface exceeds 360 ms. If something needs longer, it is not an animation, it is a progress indicator.

### 6.3 What does not animate

| Element | Rule |
|---|---|
| Command palette (⌘K) | **No animation, ever.** Opened a hundred times a session; any animation reads as lag. |
| Tool switching (V, W, R hotkeys) | No animation. Keyboard actions must feel instantaneous. |
| Canvas pan and zoom | No transition — it tracks the pointer 1:1. |
| Undo / redo | No animation. |
| Hover on canvas pins | No animation; instant highlight. Happens hundreds of times per minute. |
| Simulation value readouts | Update instantly. A tweening voltmeter is a lying voltmeter. |

The last one matters technically as well as aesthetically: interpolating a measured value between frames displays numbers the simulation never produced.

### 6.4 Interaction feedback

```css
.pressable { transition: transform var(--cm-d-press) var(--cm-ease-out); }
.pressable:active { transform: scale(.97); }

@media (hover: hover) and (pointer: fine) {
  .pressable:hover { background: var(--cm-hover); }
}
```

Hover is gated behind the media query because touch devices fire hover on tap and leave controls stuck in a hover state afterward.

### 6.5 Entry and exit

Nothing appears from nothing. Popovers start at `scale(.96)` with `opacity: 0`, never `scale(0)`. And they scale from their **trigger**, not from their centre:

```css
.popover {
  transform-origin: var(--transform-origin);   /* supplied by the positioning library */
  transition: transform var(--cm-d-popover) var(--cm-ease-out),
              opacity   var(--cm-d-popover) var(--cm-ease-out);
}
@starting-style { .popover { opacity: 0; transform: scale(.96); } }
```

Modals are the exception and stay `transform-origin: center` — they are not anchored to anything.

Use transitions, not keyframes, for anything that can retrigger rapidly (toasts, ERC findings appearing as the student wires). Keyframes restart from frame zero on interruption; transitions retarget smoothly from wherever they are.

### 6.6 Exit is faster than entry

```css
.sheet[data-state="open"]   { transition-duration: 360ms; }
.sheet[data-state="closed"] { transition-duration: 220ms; }
```

The user has decided; get out of the way.

### 6.7 Reduced motion

Reduced motion means gentler, not absent. Keep opacity and colour transitions, which carry meaning. Remove movement.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-property: opacity, background-color, border-color, color, fill, stroke !important;
    transition-duration: 150ms !important;
  }
  .wire-error { animation: none; stroke-dasharray: 6 4; }   /* dashes stay, marching stops */
}
```

---

## 7. Layout

### 7.1 Studio (≥ 1512 px)

```
┌──┬──────────────┬───────────────────────────────────────┬────────────────┐
│  │              │  ╭─────────────────────────────╮      │  Inspector     │
│⊞ │   Library    │  │ ⊕ ⊖  100%   ▶ Run   ⚑ 2      │glass │  ──────────    │
│  │   ─────────  │  ╰─────────────────────────────╯      │  R1            │
│◈ │  [search]    │                                       │  Resistance    │
│  │              │        ┌────┐                         │  ┌──────────┐  │
│⚙ │  ▣ ▣ ▣       │   ─────┤ R1 ├────●──────┐             │  │ 220 Ω    │  │
│  │  ▣ ▣ ▣       │        └────┘      │     │            │  └──────────┘  │
│  │  ▣ ▣ ▣       │                   ═╪═   ▼ D1          │  Tolerance     │
│  │              │                    │                  │  ┌──────────┐  │
│  │              │                   ─┴─ GND             │  │ 5%       │  │
│  │              │                                       │  └──────────┘  │
│  │              │                                       ├────────────────┤
│  │              │                                       │ ◉ Mentor       │
│  │              │                                       │ Nothing on     │
│  │              │                                       │ that path is   │
│  │              │                                       │ limiting the   │
│  │              │                                       │ current.       │
│  │              │                                       │ ┌────────────┐ │
│  │              │                                       │ │ Ask…    ⌘K │ │
│  │              │                                       │ └────────────┘ │
└──┴──────────────┴───────────────────────────────────────┴────────────────┘
  56      280                    fluid                          360
```

The canvas has no border and no card. It runs edge to edge between the panels, against `--cm-void`. The floating toolbar is glass and sits *over* the canvas rather than above it in a separate strip — this is the single most Apple-feeling decision in the layout, and it is also the one that gives the canvas the most vertical room.

### 7.2 Breakpoints

| Width | Name | Layout |
|---|---|---|
| ≥ 1512 | Studio | Rail 56 · Library 280 · Canvas fluid · Dock 360 (inspector over mentor) |
| 1280–1511 | Desktop | Rail 56 · Library 260 · Canvas fluid · Dock 340 (inspector ⇄ mentor tabs) |
| 1024–1279 | Laptop | Rail 56 · Canvas fluid · Dock 320; library becomes an overlay panel |
| 834–1023 | Tablet landscape | Canvas full-bleed, glass toolbars, library and inspector as sheets |
| 768–833 | Tablet portrait | Canvas above, bottom sheet at medium detent |

**768 px is the supported floor.** Phone is not a target — see §7.3.

### 7.3 Below 768 px — unsupported, by decision

CircuitMentor is not designed, built, or tested for phone widths (see ADR-007 in `ARCHITECTURE.md`). Placing and wiring components has no workable touch mapping at that size, and the product does not ship a degraded second experience to cover it. Sheet detents, drawers, and a phone-scale layout are therefore **not part of this design system** — do not build a phone breakpoint speculatively.

Below 768 px the app renders one static screen and nothing else:

```
┌───────────────────────────┐
│                           │
│                           │
│         ◈                │  ← wordmark
│                           │
│   Use a larger screen     │  ← Title
│                           │
│   CircuitMentor needs a   │  ← Body, --cm-text-secondary
│   tablet or laptop to     │
│   place and wire          │
│   components.             │
│                           │
└───────────────────────────┘
```

`--cm-base` background, centred content, no navigation, no canvas mounted, no network calls beyond auth. This is intentionally the entire phone surface area of the product.

---

## 8. Components

### 8.1 Button

| Variant | Fill | Text | Border | Use |
|---|---|---|---|---|
| Primary | `--cm-blue` | `#FFFFFF` | none | The one action that matters on the screen |
| Tinted | `--cm-blue-tint` | `--cm-blue-text` | none | Secondary, repeatable |
| Plain | transparent | `--cm-text` | none | Toolbar, low emphasis |
| Bordered | `--cm-raised` | `--cm-text` | `--cm-line` | Neutral action in a form |
| Destructive | `--cm-error` | `#FFFFFF` | none | Delete, discard |

Heights: 28 px precise / 44 px coarse. Radius `--cm-r-sm`, or `--cm-r-pill` for toolbar and canvas-floating buttons. **One primary per view.**

```css
.btn {
  height: calc(28px * var(--cm-scale));
  padding-inline: var(--cm-space-3);
  border-radius: var(--cm-r-sm);
  font: 500 var(--cm-text-label);
  transition: transform var(--cm-d-press) var(--cm-ease-out),
              background-color var(--cm-d-press) ease;
}
.btn:active { transform: scale(.97); }
.btn:focus-visible { outline: none; box-shadow: var(--cm-focus-ring); }
```

Labels name the outcome: *Run simulation*, *Save project*, *Place component*. Never *Submit*, never *OK*, never an arrow glyph appended to the text. The toast after *Save project* says *Project saved* — the verb survives the round trip.

### 8.2 Component palette (library)

A virtualized grid of tiles. Each tile is a 64 px symbol on `--cm-raised` with the part name below in Label and the package in Caption/`--cm-text-tertiary`. Selection is a 2 px `--cm-blue` ring plus `--cm-blue-tint` fill — never a scale or lift, because the grid scrolls and lifting tiles during a scroll is visually noisy.

Search is the primary affordance, not the category tree. Students know they need "a resistor" long before they know it lives under "Passive."

### 8.3 Inspector

Grouped list, macOS System Settings pattern: groups on `--cm-raised` at `--cm-r-md`, rows separated by `--cm-line` inset to the label column, group header in Label/`--cm-text-secondary` above the group with `--cm-space-2` beneath.

Parameter rows use a 120 px label column and a fluid value column at `≥ 380px` container width, and stack below it. Values are mono and right-aligned in a stepper field; units live inside the field as a `--cm-text-tertiary` suffix so the student types `220` and sees `220 Ω`.

Unit parsing accepts what an engineer actually types: `4k7` → 4.7 kΩ, `2u2` → 2.2 µF, `1e3` → 1 kΩ, `220R` → 220 Ω. Rejecting `4k7` is a small thing that reads as the tool not knowing the field.

### 8.4 Mentor dock

```
┌─────────────────────────────────────┐
│ ◉ Mentor                    ⋯  ✕    │  ← cyan dot, Heading
├─────────────────────────────────────┤
│                        ┌──────────┐ │
│                        │ why is   │ │  ← student, --cm-raised, right
│                        │ D1 dim?  │ │
│                        └──────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Look at what sits between D1    │ │  ← mentor, --cm-mentor-tint,
│ │ and the 5 V rail.               │ │    left, 3 px cyan left border
│ │                                 │ │
│ │ ⌄ Show me more                  │ │  ← hint escalation, not "Answer"
│ └─────────────────────────────────┘ │
│   ▸ LED forward voltage · p.2       │  ← citation, cyan, mono page ref
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Ask about your circuit          │ │
│ └─────────────────────────────────┘ │
│ R1  D1  Net N$7                     │  ← context chips: what the mentor sees
└─────────────────────────────────────┘
```

Three details that carry the whole panel:

**Context chips.** A row under the input showing exactly what the mentor has in context right now. Students distrust AI that seems to know things it shouldn't and blame it for missing things it can't see. Making context visible fixes both.

**Streaming caret.** A 2 px cyan block cursor at the end of the streaming text, blinking at 1.06 s. Not a spinner — a spinner says "waiting," a caret says "writing."

**The escalation control says *Show me more*, never *Show answer*.** The label is a pedagogical commitment. It is also honest: at L2 the next step genuinely is more explanation, not the solution.

### 8.5 ERC findings

A list, not toasts. Toasts are for transient confirmations; a circuit fault persists until fixed and must stay on screen until it does.

Each row: severity glyph (filled circle `--cm-error`, triangle `--cm-warn`, `ⓘ` `--cm-ok`), title in Label, the quantified detail in Caption/`--cm-text-secondary`. **The glyph shape differs per severity**, not only its colour — the row is readable in greyscale and to a colour-blind student.

Hovering a row highlights the anchored components on the canvas; clicking pans to them and opens the mentor at hint level 1 for that finding's concept. That single interaction is the whole product in one gesture: rule finds it, canvas shows it, mentor explains it.

### 8.6 Command palette (⌘K)

Glass at `--cm-glass-regular`, `--cm-r-lg`, `--cm-shadow-modal`, 560 px wide, anchored 20vh from the top. **No open or close animation.** Results are grouped (Components · Actions · Project · Learn) with group headers in Micro/`--cm-text-tertiary`, matched substrings in `--cm-blue-text` at weight 600.

### 8.7 Canvas states

| State | Treatment |
|---|---|
| Idle | Component at full opacity, hairline stroke `--cm-line-strong` |
| Hover | Pin targets fade in at 60% — instant, no transition |
| Selected | `--cm-glow-selection` on the symbol; wires turn `--cm-wire-selected` |
| Dragging | Symbol at 85% opacity, 10 px snap grid dots appear beneath |
| ERC anchored | 4 px error/warn halo, pulsing opacity `.35 → .6` over 1.6 s ease-in-out |
| Mentor highlight | 4 px `--cm-mentor` halo, static, cleared on the next turn |
| Ghost proposal | Dashed `--cm-mentor` outline at 50% opacity, `--cm-mentor-tint` fill, with inline *Apply* / *Dismiss* — student action required (invariant I-1) |
| Probing | `--cm-probe` dot at the node, tabular readout in a glass pill above it |

### 8.8 Empty and error states

Empty screens are invitations, not decoration. Errors state what happened and what to do, in the interface's voice, without apologising.

| Situation | Copy |
|---|---|
| No projects | **Start your first circuit.** Pick a board, drop in a few components, and wire them up. `[New project]` |
| Empty canvas | **Nothing here yet.** Search the library on the left, or press ⌘K to find a component. |
| ERC clean | **No issues found.** Your circuit passes all 10 checks. |
| Simulation failed to converge | **The simulation didn't settle.** Usually this means a component has no path for current. Check that every part connects back to ground. `[Run electrical check]` |
| Mentor offline | **The mentor can't be reached.** Your circuit, simulation, and error checks all still work offline. `[Try again]` |
| Part not in library | **No match for "{query}".** Try a different name, or use a generic part and set its values yourself. |

Note the convergence message: it names the most probable cause and offers the action that will confirm it. An error that only reports failure wastes the one moment the student is most receptive to learning.

---

## 9. Accessibility

| Requirement | Standard |
|---|---|
| Text contrast | ≥ 4.5:1 body, ≥ 3:1 for ≥ 18.66 px bold or ≥ 24 px |
| Non-text contrast | ≥ 3:1 for control borders, focus rings, canvas symbol strokes |
| Colour independence | Every status is also a shape or a glyph; every fault is also motion or dash pattern |
| Targets | 44 × 44 pt coarse, 28 × 28 px precise |
| Focus | `:focus-visible` only, `--cm-focus-ring` = `0 0 0 3px rgba(10,132,255,.55)`, never removed |
| Keyboard | Full editor operable without a pointer: arrows nudge selection by one grid pitch, `W` starts a wire from the selected pin, Tab cycles pins |
| Motion | `prefers-reduced-motion` respected globally (§6.7) |
| Transparency | `prefers-reduced-transparency` falls back to opaque (§3.1) |
| Contrast mode | `prefers-contrast: more` raises `--cm-line` to `rgba(255,255,255,.22)` and text tokens one step |
| Canvas semantics | The SVG scene exposes `role="application"` with a parallel offscreen list of components and nets, so a screen reader can enumerate the circuit: *"R1, resistor, 220 ohms, connects net N$3 to net N$7."* |

That last row is what makes the SVG renderer decision pay off (ADR-002). A Canvas2D circuit is a black rectangle to a screen reader; an SVG one can describe itself.

---

## 10. What to avoid

Concrete, because "keep it clean" is unactionable.

| Avoid | Instead |
|---|---|
| Gradient washes as panel decoration | Flat surfaces; let the canvas be the only place with colour energy |
| Uppercase tracked-out section labels | Sentence case at Label weight in `--cm-text-secondary` |
| The same radius on every element | The concentric rule (§5.1) — radius encodes nesting depth |
| A card around the canvas | Canvas bleeds to the panel edges |
| Status colour for UI mood (a green "saved" banner) | Status hues are reserved for circuit state; confirmations are neutral |
| Fade-and-slide entrance on every panel and card | One orchestrated moment per view, or none |
| Glass on glass | One translucent layer at a time; the second becomes opaque |
| Spinner on every async action | Optimistic UI; a spinner only past 400 ms, and it spins fast |
| Toasts for persistent problems | ERC list (§8.5) |
| An arrow glyph after button text | The verb is the affordance |
| Tweened numeric readouts | Instant update, tabular figures |

---

## 11. Implementation

Tokens live in `tokens.css` as CSS custom properties on `:root`. Tailwind consumes them through `theme.extend` rather than redefining them, so there is exactly one source of colour truth:

```js
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      void: 'var(--cm-void)',
      panel: 'var(--cm-panel)',
      raised: 'var(--cm-raised)',
      blue: { DEFAULT: 'var(--cm-blue)', text: 'var(--cm-blue-text)', tint: 'var(--cm-blue-tint)' },
      mentor: { DEFAULT: 'var(--cm-mentor)', tint: 'var(--cm-mentor-tint)' },
    },
    borderRadius: { xs: 'var(--cm-r-xs)', sm: 'var(--cm-r-sm)', md: 'var(--cm-r-md)',
                    lg: 'var(--cm-r-lg)', xl: 'var(--cm-r-xl)', pill: 'var(--cm-r-pill)' },
    transitionTimingFunction: { out: 'var(--cm-ease-out)', sheet: 'var(--cm-ease-sheet)' },
  },
}
```

Because the canvas is SVG, these same tokens style circuit elements directly — `stroke: var(--cm-wire-vcc)` on a wire path. One theme system covers chrome and content, which is exactly why the renderer decision was made this way.

Primitives (menu, popover, dialog, tabs, tooltip, select, command) come from **shadcn/ui (built on Radix UI)** — superseding Base UI per ADR-008. Radix primitives are unstyled, fully WAI-ARIA accessible with proper focus trapping and keyboard navigation, and integrate seamlessly with Launch UI registry tooling without dual-primitive bundle bloat. Floating surfaces expose transform origins and accept CircuitMentor's `--glass-*` material hierarchy and `--cm-r-*` concentric radii tokens directly. Sheets use Radix Dialog overlay architecture, and command palettes utilize `cmdk`. Toasts use **Sonner**. Do not reimplement any of these; the accessibility edge cases in a menu alone will take longer than the rest of the panel.
