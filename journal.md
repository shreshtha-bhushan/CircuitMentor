# AI-Powered Electronics Design & Learning Platform (CircuitMentor)
## 8-Week Development Journal

**Team Members:**
1. Shreshtha Bhushan — 1024030940
2. Bhaagwat Sharma — 1024030815
3. Gautam Bhattacharya — 1024030817
4. Gagan Tyagi — 1024031100

**Live deployment:** https://circuit-mentor-eight.vercel.app
**Repository:** https://github.com/shreshtha-bhushan/CircuitMentor

---

## Project Overview

**CircuitMentor** is a browser-based electronics workspace with a built-in AI mentor. The student builds the circuit themselves, visually, while the AI gives context-aware guidance: it explains concepts, points out mistakes, answers "what-if?" questions and suggests the next step.

The central philosophy of the project is:

> **AI guides. Student builds. Student learns.**

The AI has no write access to the student's circuit. It reads a structured snapshot of the live workspace (components, values, pins, connections, rule-check findings and simulation results) together with the project objective, and uses that context to mentor the student.

### Eight-week summary

| Week | Focus | Result |
|---|---|---|
| 1 | Problem definition and product direction | Student-first scope agreed |
| 2 | System architecture, AI context and RAG research | Context pipeline and knowledge-layer design |
| 3 | Workspace, component model and mentor behaviour | Interaction loop and hint ladder defined |
| 4 | Requirements, UML design and presentation | SRS, UML diagrams, mid-term presentation |
| 5 | Interactive workspace and Electrical Rules Check | Working SVG canvas, parts library, 7 ERC rules |
| 6 | Backend, authentication and persistence | FastAPI + PostgreSQL + Google sign-in |
| 7 | AI mentor, DC simulator and knowledge base | Streaming context-aware mentor, DC simulation |
| 8 | Learning tasks, testing, deployment and documentation | Deployed platform, ~74 automated tests, final report |

---

# Week 1 — Problem Definition, Product Direction and Initial Research

## Problem Faced

The first challenge was defining the scope. Electronics design covers circuit design, PCB layout, simulation, component selection, routing and manufacturing. A scope that broad would be impossible to deliver and would pull the project away from its educational purpose.

The team also had to decide what role the AI should play. A system that builds the whole circuit automatically would remove the student from the learning process.

## Relevant Context

The team studied existing tools (Tinkercad Circuits, Fritzing, KiCad, Falstad) and general-purpose AI chatbots. Beginner-friendly tools offer no guidance. Professional EDA tools are too complex for beginners. Chatbots cannot see the student's circuit.

## Key Observation

**Student involvement must remain central.** The AI should help the student understand what they are doing, find mistakes, explore alternatives and finish the project themselves. It should not replace the student's design work.

## Solution / Direction

The project was defined as an **AI-Powered Electronics Design & Learning Platform** rather than an autonomous PCB designer. The core features identified were:

- Interactive electronics workspace with a visual component library
- Student-controlled circuit construction
- Context-aware AI mentor
- Error detection and explanation
- Progressive assistance from hints to direct solutions
- "What-if?" questions and alternative components
- Electronics knowledge retrieval (RAG) as the knowledge layer
- Project and task-based guidance

## Individual Contributions

### Shreshtha Bhushan
- Led the competitor study of Tinkercad, Fritzing, KiCad and Falstad, and summarised the gaps for beginners.
- Proposed the "mentor, not autopilot" role for the AI and drafted the problem statement.
- Sketched the first workspace concept: library on the left, canvas in the centre, mentor dock on the right.
- Set up the GitHub repository and the team's working conventions.

### Bhaagwat Sharma
- Researched the educational requirements of an AI-assisted electronics platform.
- Defined the student-first design philosophy and wrote the project objectives.
- Drafted the scope statement separating the platform from a fully autonomous EDA system.

### Gautam Bhattacharya
- Researched the technical direction: rendering approaches for an interactive canvas, and how circuits can be represented as data.
- Proposed the initial technology stack (React front end, Python FastAPI back end, PostgreSQL).
- Structured the first-week presentation outline.

### Gagan Tyagi
- Took notes during team discussions.

## Outcome

The team settled on a clear direction: an interactive electronics learning environment where the student builds the circuit and the AI acts as a mentor.

---

# Week 2 — System Architecture, AI Context and RAG Research

## Problem Faced

A normal chatbot only receives the user's text. The mentor also needs to know the current circuit, the project objective and how far the student has got.

## Relevant Context

Three inputs to the AI were considered:

1. **Student prompt**: what the student is asking.
2. **Runtime circuit state**: structured components, values, pins and connections.
3. **Workspace screenshot**: visual arrangement of the parts.

## Key Observation

**Structured runtime state should be the main source of circuit information.** A language model cannot reliably infer electrical connections from an image. The structured state was defined to include component ID, type, value, pins, connections, and power/ground nets.

## RAG Research

The team researched Retrieval-Augmented Generation as a way to ground the mentor in reliable electronics knowledge instead of relying only on the model's general knowledge. Knowledge categories identified:

- Component datasheets, pinouts and specifications
- Electronics concepts and troubleshooting information
- Project procedures, component alternatives and trade-offs

A two-stage plan was agreed:

1. A **curated component knowledge base** of short, verified notes per part (pinout, ratings, common mistakes).
2. A **full RAG pipeline** with document chunking, embeddings and a vector store (pgvector) for datasheets and tutorials.

## Proposed AI Pipeline

**Student → Workspace → Runtime State + Prompt → Context Builder → Knowledge Retrieval → LLM Reasoning → Mentor Response → Student Action**

## Individual Contributions

### Shreshtha Bhushan
- Designed the end-to-end AI pipeline and the context builder concept.
- Researched RAG approaches (chunking, embeddings, pgvector) and wrote the two-stage knowledge-layer plan.
- Compared LLM providers and proposed OpenRouter as a single gateway to several models.

### Bhaagwat Sharma
- Defined the runtime circuit-state format (components, pins, nets, values).
- Documented how the workspace would expose state to the AI.
- Studied what visual context a screenshot adds over structured state.

### Gautam Bhattacharya
- Designed the back-end architecture and the API boundaries between workspace, server and AI service.
- Researched how to turn wires into electrical nets (union-find) for rule checking.
- Drafted the system architecture diagram.

### Gagan Tyagi
- Formatted the week's architecture notes.

## Outcome

The team had an architecture for a context-aware mentor: structured circuit information, project context, retrieved electronics knowledge and LLM reasoning.

---

# Week 3 — Workspace, Component Model and AI Mentor Behaviour

## Problem Faced

The concept had to be turned into concrete student interactions: what happens when a student makes a mistake, asks a question, swaps a component or is stuck.

## Key Observation — Progressive Assistance

The AI should not hand over the full solution straight away. A four-level hint ladder was defined:

**Nudge → Hint → Explanation → Direct Solution**

Example: for a reversed LED, the mentor first asks the student to check the LED's orientation. Only if the student is still stuck does it explain anode and cathode, and finally give the correction.

## "What-If?" Interaction

Students can ask hypothetical questions such as "What if I use a 330 Ω resistor?" or "What happens if I connect the LED directly to 9 V?" The mentor should reason from the actual values in the circuit and show the calculation, not just answer yes or no.

## Project and Task Context

Guided tasks were designed as step lists (objective → components → power and ground → connections → verify → test) so the mentor can point the student to the next step. The automatic-dustbin project (ultrasonic sensor + microcontroller + servo) was used as the reference example.

## Individual Contributions

### Shreshtha Bhushan
- Designed the four-level hint ladder and the mentor's response rules.
- Wrote the "what-if?" interaction specification.
- Designed the mentor dock UI and its context chips.

### Bhaagwat Sharma
- Designed the canvas interactions: place, drag, rotate, delete and pin-to-pin wiring.
- Defined the component model and the first part list (resistor, LED, battery, switch, ground).
- Wrote the guided-task format with the dustbin example.

### Gautam Bhattacharya
- Defined the first Electrical Rules Check (ERC) rules: missing current-limiting resistor, reversed LED, missing ground and supply short.
- Designed how ERC findings attach to components on the canvas.
- Prepared the system-functionality slides.

### Gagan Tyagi
- Collected example circuits for the team to discuss.

## Outcome

The central interaction loop was defined:

**Student builds → state updates → rules check → AI guides → student corrects → AI re-evaluates**

---

# Week 4 — Requirements, UML Design and Presentation

## Problem Faced

The concepts had to become a formal specification with requirements and UML models, and a clear line between MVP and future work, ready for the mid-term evaluation.

## Work Done

- **Functional requirements**: project management, component library, place and connect components, structured circuit state, contextual AI guidance, error detection, "what-if?" responses, guided tasks, knowledge retrieval.
- **Non-functional requirements**: usability, performance, reliability, security, scalability, maintainability.
- **UML and structured analysis**: Use Case diagram with templates, Activity and Swimlane diagrams, DFD Levels 0–2, Class, Sequence, Collaboration, State Chart, Component and Deployment diagrams.
- **Testing plan**: unit, integration, system and user testing.
- **MVP boundary**: breadboard/schematic workspace, ERC, DC simulation and AI mentor in scope; PCB routing, transient simulation and manufacturing outputs as future scope.

## Individual Contributions

### Shreshtha Bhushan
- Wrote the AI-related functional requirements and the mentor sequence diagram.
- Built the mid-term presentation (architecture, AI and RAG pipeline, technology stack slides).
- Drew the Component and Deployment diagrams.

### Bhaagwat Sharma
- Wrote the use-case templates and user stories.
- Drew the Use Case, Activity, Swimlane and State Chart diagrams.
- Drafted the requirements specification.

### Gautam Bhattacharya
- Drew DFD Levels 0–2 and the Class and Collaboration diagrams.
- Wrote the testing plan.
- Defined the MVP boundary and future scope.

### Gagan Tyagi
- Proofread the requirements section.

## Outcome

The team presented a complete, consistent design at the mid-term evaluation.

---

# Week 5 — Interactive Workspace and Electrical Rules Check (Implementation)

## Problem Faced

Implementation started with a vertical slice: an LED, a resistor and a battery placed and wired by the student, with a broken circuit detected immediately.

## Work Done

- **Front end set up** with React 19, TypeScript (strict), Vite, Tailwind CSS and Radix UI primitives, using a shared design-token file (`tokens.css`).
- **SVG canvas**: pan and zoom, placing, dragging, rotating and deleting components, and pin-to-pin wiring with orthogonal wire routing (`wireRouter.ts`).
- **Component library** with search: resistor, LED, 9 V and 3 V batteries, ground, push-button, SPST switch, potentiometer, capacitor, diode, NPN transistor, Arduino Uno, breadboard, DC motor, servo and ultrasonic sensor.
- **Net builder**: wires are converted into electrical nets using a union-find algorithm (`erc/nets.ts`).
- **Electrical Rules Check**: seven deterministic rules running client-side on every change:
  `LED_NO_RESISTOR`, `LED_REVERSED`, `NO_GROUND_PATH`, `OPEN_LOOP_LOAD`, `SHORTED_COMPONENT`, `UNCONNECTED_PIN`, `VCC_GND_SHORT`.
- **ERC findings panel** that highlights the offending component on hover. Inspector panel for editing component values.

## Individual Contributions

### Shreshtha Bhushan
- Set up the front-end project, design tokens and UI component primitives.
- Built the Library panel, Inspector and Command Palette, and keyboard shortcuts.
- Integrated the ERC findings panel with canvas highlighting.

### Bhaagwat Sharma
- Implemented the SVG canvas: viewport, hit-testing, place, drag, rotate and delete.
- Implemented pin-to-pin wiring and the orthogonal wire router.
- Built the floating toolbar and the live circuit preview.

### Gautam Bhattacharya
- Implemented union-find net derivation (`nets.ts`).
- Implemented all seven ERC rules (`rules.ts`) and wrote 21 unit tests for them.
- Defined the part metadata (pins, polarity, ratings) used by the rules.

### Gagan Tyagi
- Tested the canvas manually and reported two UI glitches.

## Outcome

A student can now build a circuit and see rule violations immediately, with no server or AI involved.

---

# Week 6 — Back End, Authentication and Persistence

## Problem Faced

Projects needed to be saved per user, so the platform needed sign-in, a database and a REST API.

## Work Done

- **FastAPI back end** with async SQLAlchemy 2.0 and Pydantic v2 validation.
- **Google sign-in** using the OAuth 2.0 authorization-code flow with PKCE; session JWT stored in an `httpOnly` cookie.
- **PostgreSQL schema** with four Alembic migrations:
  1. `0001` users, projects and circuit data (JSONB)
  2. `0002` project task ID and progress
  3. `0003` composite indexes and constraints
  4. `0004` chat messages and circuit snapshots
- **REST routers**: `/v1/auth`, `/v1/projects` (CRUD), `/v1/parts`, `/v1/messages` (chat history and circuit snapshots), plus `/ready` health check.
- **Dashboard** listing the user's projects, and a **login page** wired to Google sign-in.
- Docker Compose for a local PostgreSQL instance.

## Individual Contributions

### Shreshtha Bhushan
- Implemented Google OAuth with PKCE, JWT sessions and secure cookies.
- Built the Dashboard and Login pages and the typed API client (`lib/api.ts`).
- Wrote the auth and project API tests.

### Bhaagwat Sharma
- Implemented project save and load from the canvas, and the circuit snapshot history.
- Built the landing page and settings modal.

### Gautam Bhattacharya
- Designed the PostgreSQL schema and wrote the four Alembic migrations.
- Implemented the projects, parts and messages routers.
- Set up Docker Compose and the API Dockerfile.

### Gagan Tyagi
- Helped check the database setup instructions in the README.

## Outcome

Users sign in with Google, and their projects, circuits, chat history and snapshots are stored in PostgreSQL.

---

# Week 7 — AI Mentor, DC Simulator and Knowledge Base

## Problem Faced

The mentor had to use the student's actual circuit, stream its answers, follow the hint ladder and never claim to have changed the circuit. Students also needed to see whether their circuit actually works.

## Work Done

- **Circuit context builder** (`buildCircuitContext.ts`): serialises components, values, pins, nets, selection, ERC findings and simulation results into a validated `<circuit_state>` block.
- **Mentor service** (`/v1/mentor/stream`): streams responses over Server-Sent Events through OpenRouter (Claude 3.5 Haiku by default) with direct Anthropic as an alternative.
  - Pydantic schemas validate every field of the incoming context.
  - Prompt-injection guard strips `<circuit_state>` tags and control characters from user text.
  - `derive_circuit_facts()` parses ohms, volts and farads and adds facts such as expected LED current, so the model reasons from real numbers.
  - Hint level 1–4 sent with every request to enforce the hint ladder.
  - "What-if?" answers must reason from the actual netlist values and show the calculation.
  - The mentor never states or implies that it changed the circuit.
- **Mentor dock** with streaming text, context chips and an on-canvas hint layer.
- **DC simulator** (`dcSim.ts`): computes loop currents, voltage drops, power dissipation and LED states (off, lit, overcurrent, reversed), and detects short circuits. Results feed both the UI and the mentor's context.
- **Component knowledge base — first stage of the knowledge layer**: `apps/api/knowledge/parts.json` holds verified notes for 16 parts (pinout, ratings and common mistakes), loaded by the mentor service at start-up.
- **Full RAG pipeline (designed, in progress)**: datasheet and tutorial ingestion, chunking, embeddings and pgvector retrieval are designed, but not yet integrated into the mentor's responses.

## Individual Contributions

### Shreshtha Bhushan
- Built the mentor service: SSE streaming, OpenRouter/Anthropic clients, system prompt, hint-ladder enforcement and prompt-injection guard.
- Implemented `derive_circuit_facts()` and the circuit-state serialiser.
- Wrote the component knowledge base and the mentor API tests.

### Bhaagwat Sharma
- Implemented the client-side context builder and its tests.
- Built the Mentor Dock, context chips and the hint layer on the canvas.
- Implemented the `useMentor` streaming hook.

### Gautam Bhattacharya
- Implemented the DC simulator and its 11 unit tests.
- Connected simulation results to component telemetry in the Inspector and to the mentor's context.
- Benchmarked the simulator and ERC on larger circuits.

### Gagan Tyagi
- Tried sample questions with the mentor and noted the responses.

## Outcome

The mentor answers questions about the student's actual circuit, gives graded hints, works through "what-if?" questions with real values, and streams its answers live.

---

# Week 8 — Learning Tasks, Testing, Deployment and Documentation

## Work Done

### Guided learning
- Five guided tasks with step checks: *Light an LED Safely*, *Add a Control Switch*, *Series vs Parallel Loads*, *Debug: Direct Rail Short Circuit* and *Debug: Reversed LED Polarity*.
- Progress and statistics tracking per student (`learning/stats.ts`), plus concept explanations (`learning/concepts.ts`).

### Testing
- **Front end (Vitest)**: about 53 tests covering ERC (21), DC simulation (11), learning statistics (12), tasks (5) and the context builder (4).
- **Back end (pytest)**: about 21 tests covering authentication, projects, messages, the mentor endpoint and system/health.
- **CI**: a GitHub Actions workflow runs type-checking and tests on every push.
- Manual system testing of the complete flow: sign in → create project → build → ERC → simulate → ask mentor → fix → save.

### Deployment
- Front end deployed on **Vercel**; API deployed on **Render** as a Docker service with a `/ready` health check.
- A keep-alive GitHub workflow pings the API every 5 minutes and warms the database connection to avoid cold starts.

### Documentation
- Final project report with requirements, use-case templates, user stories, all UML diagrams (redrawn to course conventions and checked for DFD balancing), test cases and screenshots.
- `README.md`, `ARCHITECTURE.md`, `SYSTEM_DESIGN.md`, `RUNBOOK.md` and final presentation.

## Individual Contributions

### Shreshtha Bhushan
- Set up the Vercel and Render deployments, environment configuration and keep-alive workflow.
- Set up the GitHub Actions CI pipeline.
- Wrote the README and runbook, and led the final report and presentation.

### Bhaagwat Sharma
- Implemented the guided-task engine, step checks and the five tasks.
- Implemented progress statistics with tests.
- Redrew the Use Case, Activity, Swimlane and State Chart diagrams for the final report.

### Gautam Bhattacharya
- Wrote the back-end integration tests and ran the end-to-end system tests.
- Redrew DFD Levels 0–2 (with balancing checks) and the Class, Collaboration, Component and Deployment diagrams.
- Wrote the test-case section of the report.

### Gagan Tyagi
- Proofread the final report.

## Outcome

CircuitMentor is deployed and usable end to end. A student can sign in, build a circuit, see rule violations and simulation results, get graded, context-aware help from the AI mentor, complete guided tasks and save their work.

---

# Team Contribution Summary

| Member | Primary Responsibility |
|---|---|
| **Shreshtha Bhushan** | AI mentor, authentication, front-end platform, deployment, CI, report and presentation lead |
| **Bhaagwat Sharma** | Canvas and wiring, context builder, mentor dock, guided tasks, requirements and UML |
| **Gautam Bhattacharya** | ERC engine, DC simulator, database and API, testing, DFDs and UML |
| **Gagan Tyagi** | Proofreading and note-taking |

---

# Implementation Status

| Feature | Status |
|---|---|
| Interactive SVG workspace and 16-part library | Implemented |
| Electrical Rules Check (7 rules) | Implemented |
| DC circuit simulator | Implemented |
| Google sign-in, projects, chat history, snapshots | Implemented |
| Context-aware streaming AI mentor with hint ladder and "what-if?" reasoning | Implemented |
| Guided learning tasks and progress tracking | Implemented |
| Component knowledge base (`parts.json`) | Implemented (first stage of knowledge layer) |
| Full RAG pipeline (embeddings, vector store, datasheet retrieval) | Designed, in progress |
| PCB routing, transient simulation, manufacturing outputs | Future scope |

---

# Future Scope

- Complete the RAG pipeline: ingest datasheets and tutorials, store embeddings in pgvector, and retrieve relevant passages into the mentor's context.
- Transient and AC simulation, oscilloscope and waveform views.
- PCB layout and routing, and manufacturing outputs.
- Microcontroller code co-simulation.
- A larger component library and more guided tasks.

---

# Conclusion

Over eight weeks, CircuitMentor went from a broad idea about AI in electronics to a deployed learning platform. Students build circuits themselves. Deterministic rule checking and simulation tell them exactly what is wrong, and an AI mentor that reads their actual circuit helps them understand why and what to try next.

> **Don't build the circuit for the student. Build the student's ability to build the circuit.**
