# CircuitMentor — Implementation Plan

**Horizon** 16 weeks, 2-week sprints · **Team** 4 · **Companion** `ARCHITECTURE.md`, `DESIGN.md`

---

## 0. Sequencing principle

Build the **vertical slice first, then widen it**. The tempting order — finish the canvas, then the parts library, then the simulator, then the AI — leaves you at week 12 with four things that have never spoken to each other, and it is the single most common way student projects of this size fail.

The order below gets one LED, one resistor, one broken circuit, one ERC finding, and one mentor explanation working end to end by week 4. Everything after that is widening a path that already runs.

The second ordering rule: **ERC before AI.** The rule engine is what the mentor explains. Building the mentor first means building it against nothing, and you will end up with a chatbot you then have to rewrite.

---

## 1. Ownership

| Track | Owner | Scope |
|---|---|---|
| **Canvas & interaction** | Bhaagwat Sharma | SVG renderer, Yjs document, pointer interactions, undo, responsive shell |
| **Engines** | Gautam Bhattacharya | Netlist compiler, MNA solver, ERC rules, worker pool, avr8js co-sim |
| **AI & retrieval** | Shrestha Bhushan | Mentor orchestrator, tool schema, hint ladder, RAG ingestion and retrieval, evals |
| **Platform & design system** | Gagan Tyagi | FastAPI services, Postgres schema, auth, design-system primitives, CI, deploy |

Cross-cutting rule: whoever owns a track owns its tests. A track is not done when it works on the owner's machine; it is done when CI proves it works.

---

## Phase 0 · Foundation — Week 1

**Goal** Nobody is blocked on setup after this week.

| Deliverable | Owner |
|---|---|
| Monorepo (pnpm workspaces): `apps/web`, `apps/api`, `packages/engine`, `packages/ui`, `packages/schema` | Gagan |
| Vite + React 19 + TS strict; `tokens.css` wired; Tailwind reading tokens via `theme.extend` | Gagan |
| FastAPI skeleton, Postgres + pgvector via Docker Compose, Alembic migration 0001 | Gagan |
| OpenAPI → TS client generation in the build (`openapi-typescript`) | Gagan |
| CI: typecheck, lint, unit, `size-limit` budget, Lighthouse CI on the editor route | Gagan |
| ADR log started; the seven ADRs from `ARCHITECTURE.md` §10 committed | All |

**Exit criteria** `pnpm dev` starts web + api + db. A PR that pushes the bundle past 220 kB gzip fails CI. A PR that breaks types fails CI.

**Watch for** Skipping the size budget "for now." Retrofitting a bundle budget onto a project that already ships `ngspice.wasm` in the main chunk is a week of work; enforcing it from day one is free.

---

## Phase 1 · Walking skeleton — Weeks 2–4

**Goal** One LED, one resistor, one wire, one ERC finding, one mentor explanation — all the way through.

| Deliverable | Owner |
|---|---|
| Yjs document model: `components`, `wires`, `meta`; `UndoManager` scoped to `'user'` origin | Bhaagwat |
| SVG canvas: viewport transform on one `<g>`, pan, zoom, hit-testing | Bhaagwat |
| Place, drag, rotate, delete a component; DOM-mutation during drag, single Yjs commit on pointerup | Bhaagwat |
| Pin-to-pin wiring with orthogonal routing | Bhaagwat |
| Parts catalog format + 6 parts: resistor, LED, battery, switch, wire, ground | Gautam |
| `deriveNets()` union-find, including breadboard strip topology | Gautam |
| Two ERC rules: `LED_NO_CURRENT_LIMIT`, `NO_GROUND_REFERENCE` | Gautam |
| ERC findings list with canvas anchors; hover-to-highlight | Bhaagwat + Gagan |
| Mentor SSE endpoint; context builder with `goal + ercFindings + netlist` layers only | Shrestha |
| Mentor dock, streaming, context chips | Shrestha + Gagan |
| Design-system primitives: Button, Panel, ListRow, Field, Sheet (Base UI + tokens) | Gagan |

**Exit criteria** — demo script, run live, not recorded:
1. Create a project, place an LED and a battery, wire them directly.
2. `LED_NO_CURRENT_LIMIT` appears in the findings list within 20 ms of the wire committing.
3. Click the finding → canvas pans and haloes D1 → mentor opens at hint level 1.
4. Mentor's first response is an *orienting* hint, not the answer.
5. Ask "why?" twice → escalates L1 → L2 → L3, with the L3 response explaining forward voltage.
6. Place a 220 Ω resistor in series → the finding disappears.
7. Reload the page with the network off → the circuit is still there, ERC still runs.

**Watch for** The mentor's L1 response leaking the answer. Write the answer-leak eval (§Phase 6) as a *manual checklist* now, before the automated harness exists. If step 4 fails, the pedagogical premise is unproven and everything after is built on sand.

---

## Phase 2 · Editor depth — Weeks 5–6

**Goal** Make the canvas good enough that a student would choose it over paper.

| Deliverable | Owner |
|---|---|
| Breadboard renderer with strip topology and hole snapping | Bhaagwat |
| Multi-select: marquee, shift-click, group move/rotate/delete | Bhaagwat |
| Copy/paste/duplicate with designator reassignment | Bhaagwat |
| Wire editing: waypoints, reroute, junction dots, net labels | Bhaagwat |
| Alignment guides and pitch snapping at `--cm-grid-pitch` | Bhaagwat |
| Inspector: parameter forms with engineering-notation parsing (`4k7`, `2u2`, `220R`) | Gagan |
| Library: virtualized grid, search-first, 40 parts across passives, semis, MCU, sensors | Gautam |
| Command palette (⌘K), no animation | Gagan |
| Keyboard editing: arrows nudge by one pitch, `W` wires from selection, Tab cycles pins | Bhaagwat |

**Exit criteria** Build the Automatic Dustbin circuit from the SRS — ultrasonic sensor, servo, Arduino Uno, resistor — entirely from the keyboard, in under four minutes, with no mouse. Canvas frame time stays under 8 ms p95 while dragging a 6-component selection.

**Watch for** Drag routing through React. If `pointermove` produces a Yjs update, you will see it immediately as a stuttering drag and an unusable undo stack. The DOM-mutation pattern in `ARCHITECTURE.md` §7.3 is not an optimisation to add later.

---

## Phase 3 · Simulation — Weeks 6–8

*Overlaps Phase 2. Gautam works ahead on the engines while Bhaagwat finishes the editor.*

| Deliverable | Owner |
|---|---|
| Worker pool via Comlink; abort on document mutation | Gautam |
| MNA solver: stamping, LU with partial pivoting, Newton-Raphson for diodes | Gautam |
| Tier classifier: T0 ideal / T1 MNA / T2 SPICE | Gautam |
| `ngspice` WASM integration, lazy-loaded, transient analysis | Gautam |
| Probe tool: click a node, read voltage; click a component, read current | Bhaagwat |
| Live LED brightness and motor rotation driven by solved current | Bhaagwat |
| Non-convergence surfaced as a diagnostic, not a crash | Gautam |
| Remaining 8 ERC rules from `ARCHITECTURE.md` §4 | Gautam |
| Golden-file test suite: 30 reference circuits with known node voltages | Gautam |

**Exit criteria** Solver output matches LTspice within 1% on all 30 golden circuits. A 5 V → 220 Ω → red LED → GND circuit reports ≈13.6 mA and the LED renders at proportional brightness. Deleting the resistor produces `LED_NO_CURRENT_LIMIT` *with the quantified current in the message*, within 20 ms.

**Watch for** Diode convergence. Exponential models overflow without damping. The damped update after iteration 20 in `solveDC` is there for a reason — do not remove it when it "seems to work."

---

## Phase 4 · MCU co-simulation — Weeks 9–10

| Deliverable | Owner |
|---|---|
| Server-side sketch compilation: `avr-gcc` in a gVisor sandbox, no network, 10 s CPU cap | Gagan |
| `avr8js` integration, ATmega328P, Arduino Uno pin mapping | Gautam |
| Event-driven analog resync (`ARCHITECTURE.md` §3.2) | Gautam |
| Code editor panel: CodeMirror 6, Arduino syntax, compile errors mapped to line numbers | Gagan |
| Serial monitor | Gagan |
| Digital pin state visualised on the canvas | Bhaagwat |

**Exit criteria** Blink runs at the correct rate with the LED visibly toggling on the canvas. A sketch reading an ultrasonic sensor and driving a servo runs at ≥ 0.5× real time. A compile error shows on the correct line with the compiler's message, not a generic failure.

**Watch for** The sandbox. A compiler endpoint without CPU, memory, and network caps is a remote code execution hole, and this is the one phase where "we'll harden it later" is not an acceptable trade.

---

## Phase 5 · RAG — Weeks 10–11

*Overlaps Phase 4.*

| Deliverable | Owner |
|---|---|
| Ingestion: PyMuPDF layout extraction, table-aware chunking, row serialization | Shrestha |
| Instruction-scrubbing pass before embedding (injection defence) | Shrestha |
| Embedding + `tsvector`, HNSW index, `part_id` metadata | Shrestha |
| Hybrid retrieval with RRF (k=60) + cross-encoder rerank to top 4 | Shrestha |
| Canvas-scoped filtering: retrieve only from parts actually placed | Shrestha |
| Citation rendering with page references in the mentor dock | Shrestha |
| Corpus: 40 datasheets covering the parts library, plus 3 electronics references | Shrestha |

**Exit criteria** On a 50-question retrieval set built from the datasheets, recall@4 ≥ 0.85. Part-number queries (`PB5`, `ATmega328P pin 13`) hit ≥ 0.95 — this is what the sparse half of the hybrid is for, and dense-only will visibly fail here. Every mentor claim sourced from a datasheet carries a citation that opens the right page.

---

## Phase 6 · Mentor depth and evaluation — Weeks 11–13

| Deliverable | Owner |
|---|---|
| Full tool schema; explicit assertion in tests that no mutation tool exists in Mentor mode | Shrestha |
| Hint ladder state machine with `editsSinceLastHint` gating | Shrestha |
| `propose_change` → ghost overlay with student-required Apply/Dismiss | Shrestha + Bhaagwat |
| What-if handling: fork the netlist, simulate the hypothetical, explain the delta | Shrestha + Gautam |
| Component recommendation grounded in the catalog, never invented parts | Shrestha |
| Prompt caching, semantic cache, small-model routing | Shrestha |
| Per-user token budgets in Redis, sliding window | Gagan |
| **Eval harness**: 60 seeded-fault circuits, 5 metrics, runs in CI on every prompt change | Shrestha |

**Exit criteria** Against `ARCHITECTURE.md` §9.4 targets: ERC recall 1.00, explanation accuracy ≥ 0.90, **answer-leak at L1–L2 ≤ 0.02**, citation validity ≥ 0.95, TTFT p95 ≤ 1.5 s. A what-if question ("what if I use 1 kΩ instead of 220 Ω?") returns a simulated, quantified answer rather than a generic one.

**Watch for** Answer leak is the metric that quietly kills the product. A model that jumps to the solution at L1 scores well on helpfulness, accuracy, and latency while destroying the entire premise. Gate deploys on it.

---

## Phase 7 · Learning layer — Weeks 13–14

| Deliverable | Owner |
|---|---|
| Task model: brief, starting circuit, acceptance predicates over the netlist | Gautam |
| Automated task evaluation (predicates, not LLM grading — reproducibility is required) | Gautam |
| Concept graph linking ERC rules → concepts → tasks | Shrestha |
| Progress view: concept mastery, hint-level distribution | Gagan |
| Task authoring format so faculty can add tasks without code | Gagan |
| Seed track: 12 tasks from a single LED through an ultrasonic-triggered servo | All |

**Exit criteria** A student completes all 12 tasks. Each is auto-graded within 200 ms with no LLM call. The faculty dashboard shows hint-level distribution per concept.

**Watch for** LLM-graded submissions. Two identical circuits must receive identical grades, every time. Acceptance predicates over the netlist give you that; a model does not.

---

## Phase 8 · Responsive, polish, hardening — Weeks 15–16

| Deliverable | Owner |
|---|---|
| All five breakpoints from `DESIGN.md` §7.2 (768 px floor) implemented and tested on device | Bhaagwat |
| Touch interaction model: two-tap wiring, long-press marquee, 44 pt targets | Bhaagwat |
| Below-768px notice screen (`DESIGN.md` §7.3) — no phone layout, no canvas mount | Bhaagwat |
| Container queries on inspector and mentor panels | Gagan |
| Motion audit against `DESIGN.md` §6 — no `ease-in`, nothing over 360 ms, palette unanimated | Gagan |
| Accessibility audit: axe clean, full keyboard pass, screen-reader circuit enumeration | Gagan |
| `prefers-reduced-motion`, `prefers-reduced-transparency`, `prefers-contrast` all verified | Gagan |
| Empty and error states from `DESIGN.md` §8.8 | Gagan |
| Share links as scoped capability tokens; Postgres row-level security | Gagan |
| Deploy: frontend on CDN, API containerised, managed Postgres, daily backups | Gagan |

**Exit criteria** Lighthouse ≥ 90 across the board on the editor route. Zero axe violations. A blindfolded keyboard-only pass places, wires, simulates, and asks about a circuit. On a physical iPad down to 768 px portrait, a student places, wires, and simulates a circuit using touch alone. A window narrowed below 768 px shows the notice screen and mounts no canvas.

**Watch for** Leaving responsive work to the end and then discovering the layout assumed a mouse. Mitigate by testing on a physical tablet at the end of every phase from Phase 2 onward, not by rewriting in week 15.

---

## 2. Use-case coverage

Every use case from the SRS, mapped to where it becomes real.

| # | Use case | Phase | Notes |
|---|---|---|---|
| UC-01 | Create / manage project | 1 | Yjs doc + snapshots |
| UC-02 | Select components | 1 → 2 | 6 parts, then 40 |
| UC-03 | Build circuit | 1 → 2 | Schematic first, breadboard in 2 |
| UC-04 | Connect components | 1 → 2 | Wiring, then waypoints and labels |
| UC-05 | Ask AI mentor | 1 → 6 | Skeleton in 1, full tool schema in 6 |
| UC-06 | Receive guidance | 1 → 6 | Hint ladder lands in 6 |
| UC-07 | What-if questions | 6 | Needs the simulator (3) to answer quantitatively |
| UC-08 | Component recommendations | 6 | Grounded in the catalog, never invented |
| UC-09 | Detect circuit errors | 1 → 3 | 2 rules, then all 10 |
| UC-10 | Learn concepts | 5 → 7 | RAG citations, then the concept graph |
| UC-11 | Complete assigned tasks | 7 | Predicate-graded |
| UC-12 | Save project | 1 | Offline-first via `y-indexeddb` |

---

## 3. Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| MNA solver fails to converge on non-linear circuits | High | High | Damped Newton from day one; 30 golden circuits in CI; T0 fallback so the UI never hangs |
| Co-simulation too slow for real-time feel | Medium | High | Event-driven resync, not lockstep; degrade to T0 ideal digital and say so in the UI |
| Mentor gives away answers | High | **Critical** | Hint ladder as a state machine, not a prompt; answer-leak eval gates deploys |
| Mentor hallucinates component specs | Medium | High | Catalog-grounded recommendations; citation validity eval; refuse-if-unretrieved policy |
| Canvas performance collapses past ~150 components | Medium | Medium | DOM-mutation drag, viewport culling, memo boundaries — all in Phase 1–2, not retrofitted |
| LLM cost per student per lab session | Medium | Medium | ERC handles detection; prompt + semantic caching; per-user Redis budgets |
| Sketch compilation endpoint abused | Low | **Critical** | gVisor sandbox, no network, CPU/memory caps, rate limits — Phase 4 exit gate |
| Responsive work discovered too late | Medium | Medium | Physical tablet test at every phase exit from Phase 2 |
| Scope creep into PCB routing / gerber export | High | Medium | Explicitly out of scope; revisit only after Phase 8 ships |

---

## 4. Explicitly out of scope for this horizon

Naming these now prevents them from arriving as "small additions" in week 12.

- PCB autorouting, copper pours, DRC, gerber export
- Multiplayer editing (the CRDT makes it *possible* later; it is not in this plan)
- AC/noise/Monte-Carlo analysis
- Non-AVR microcontrollers (ESP32, STM32, RP2040)
- Custom part authoring by students
- LMS integration, grade export
- Native mobile apps
- Any phone-width experience (< 768 px) — unsupported by decision, see ADR-007 in `ARCHITECTURE.md`

---

## 5. Definition of done

A phase is done when all of the following hold. No exceptions, including the last week.

1. Exit criteria demonstrated live, on a clean checkout, by someone who did not write the code.
2. Unit tests for every engine function; Playwright coverage for the phase's exit demo.
3. No new `any`, no new `@ts-expect-error`, no skipped tests.
4. Bundle and Lighthouse budgets green.
5. Zero axe violations on any new surface.
6. Any architectural decision that diverged from `ARCHITECTURE.md` recorded as a new ADR — including the reasoning and the alternative rejected.
