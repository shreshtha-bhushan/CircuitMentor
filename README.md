# CircuitMentor

<p align="center">
  <strong>An AI-mentored circuit simulation and interactive electronics learning platform.</strong><br>
  Real-time browser-based simulation, deterministic Electrical Rules Checking (ERC), and a Socratic AI Mentor that guides without giving away the answers.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20%2B-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js 20+" />
  <img src="https://img.shields.io/badge/Python-3.12%2B-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python 3.12+" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript Strict" />
  <img src="https://img.shields.io/badge/FastAPI-Async-009688?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/PostgreSQL-16%20%2B%20pgvector-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL 16 + pgvector" />
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" alt="License MIT" />
</p>

---

## ⚡ Overview

**CircuitMentor** rethinks how electronics engineering is learned. Instead of opaque error messages or passive ChatGPT-style answers, CircuitMentor combines a high-performance interactive circuit canvas with:

1. **Deterministic Rule Engine (ERC)** running offline in Web Workers to catch shorts, floating pins, reverse polarity, and missing resistors in under 2 ms.
2. **Socratic AI Mentor** that provides layered hints rather than spoon-feeding solutions. When proposing circuit changes, it renders a **ghost overlay** diff that students review and apply manually.
3. **CRDT-Powered State** (Yjs) ensuring schematic, netlist, simulation, and collaborative sessions stay in continuous sync with zero drift.

---

## 🏛️ Core Invariants

Every design decision in CircuitMentor adheres to four core invariants:

* **I-1 · The AI never mutates the circuit.** The pedagogical core is student agency. The AI mentor has no mutation tool in its schema; it proposes changes via rendered *ghost overlay diffs* that the student must manually accept.
* **I-2 · Determinism before inference.** Error detection belongs to a deterministic Electrical Rules Check (ERC) engine, not an LLM. The rule engine runs locally at ~2 ms with 0% hallucination. The LLM's role is to *explain* the finding, not discover it.
* **I-3 · One source of truth.** The circuit document is a Yjs CRDT document. Canvas graphics, SPICE netlist, ERC diagnostics, and AI context are all derived projections of this single state.
* **I-4 · Offline-first canvas & simulation.** Circuit editing, netlist compilation, and circuit simulation execute client-side in browser Web Workers. Network connectivity is only required for AI mentor interactions and cloud synchronization.

---

## 📐 Architecture Topology

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  CLIENT  (React 19 · TypeScript Strict · Vite · Radix UI Primitives)         │
│                                                                             │
│  ┌───────────────┐  ┌──────────────────────┐  ┌───────────────────────┐     │
│  │ Editor Shell  │  │  Canvas Runtime      │  │  Mentor Dock          │     │
│  │ layout/routing│  │  schematic·breadboard│  │  SSE stream · hints   │     │
│  └───────┬───────┘  └──────────┬───────────┘  └───────────┬───────────┘     │
│          └────────────┬────────┴──────────────────────────┘                 │
│                ┌──────▼────────┐                                            │
│                │  Yjs Document │  ← Single Source of Truth (CRDT)           │
│                │  y-indexeddb  │                                            │
│                └──────┬────────┘                                            │
│         ┌─────────────┼─────────────┬──────────────┐                        │
│    ┌────▼────┐  ┌─────▼─────┐ ┌─────▼──────┐ ┌─────▼──────┐  Worker Pool    │
│    │ Netlist │  │    ERC    │ │  MNA/SPICE │ │  avr8js    │  (Comlink)      │
│    │ Compiler│  │   Engine  │ │   Solver   │ │  MCU Core  │                 │
│    └─────────┘  └───────────┘ └────────────┘ └────────────┘                 │
└───────────────────────────────┬─────────────────────────────────────────────┘
                     HTTPS/SSE  │  WSS (Yjs Sync)
┌───────────────────────────────▼─────────────────────────────────────────────┐
│  API  (FastAPI · Python 3.12 · Async)                                       │
│  ┌──────────┬───────────┬──────────┬────────────────┬──────────────────┐    │
│  │ Projects │  Parts    │ Learning │ Mentor         │ Retrieval (RAG)  │    │
│  │ Service  │  Catalog  │ Service  │ Orchestrator   │ Service          │    │
│  └────┬─────┴─────┬─────┴────┬─────┴───────┬────────┴────────┬─────────┘    │
└───────┼───────────┼──────────┼─────────────┼─────────────────┼──────────────┘
        │           │          │             │                 │
   ┌────▼───────────▼──────────▼─────────────▼─────┐   ┌───────▼──────────┐
   │  PostgreSQL 16 + pgvector (HNSW)              │   │  LLM Provider    │
   │  projects · parts · tasks · progress · chunks │   │  embeddings/rag  │
   └───────────────────────────────────────────────┘   └──────────────────┘
```

---

## ✨ Features

- **Interactive SVG Canvas**: Fluid pan, zoom, drag-and-drop component placement, rotation, and orthogonal pin-to-pin wire routing with collision avoidance.
- **26+ Component Catalog**: Passive components (resistors, capacitors, inductors), active semiconductors (diodes, BJTs, MOSFETs), logic gates, voltage/current sources, ground, and measurement instruments (multimeter, oscilloscope).
- **Instant Electrical Rules Checking (ERC)**: Immediate feedback for floating inputs, short circuits, missing pull-ups/pull-downs, and reverse polarity.
- **Socratic AI Mentor**: Context-aware guidance powered by FastAPI, pgvector RAG, and an adaptive 3-tier hint ladder (nudge $\rightarrow$ concept $\rightarrow$ structural suggestion).
- **Fast Keyboard & Command Workflow**: `Cmd+K` / `Ctrl+K` command palette built on `cmdk`, quick part insertion, and centralized hotkey registry.
- **Dark Workspace Design System**: Pure monochrome palette with iOS 26 system blue accent, glassmorphic detached panels, and concentric corner radius hierarchy (`tokens.css`).
- **Google OAuth & Dashboard**: Protected project management, live circuit previews, and server-side sessions.

---

## 📂 Repository Structure

CircuitMentor is organized as a monorepo using **pnpm workspaces**:

```text
CircuitMentor/
├── apps/
│   ├── web/                    # Frontend SPA (React 19, TypeScript, Vite)
│   │   ├── src/
│   │   │   ├── components/     # Canvas, Toolbar, Inspector, MentorDock, etc.
│   │   │   │   └── ui/         # Radix UI / shadcn/ui primitives (ADR-008)
│   │   │   ├── lib/            # Parts catalog, hotkey registry, utils
│   │   │   ├── App.tsx         # Main router & app layout
│   │   │   └── index.css       # Design tokens and global utility styles
│   │   ├── index.html
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── api/                    # Backend services (FastAPI, Python 3.12)
│       ├── app/                # Main application, routers, services, config
│       ├── alembic/            # Database schema migrations
│       ├── alembic.ini
│       ├── Dockerfile
│       └── requirements.txt
│
├── docker-compose.yml          # PostgreSQL (pgvector) and Redis services
├── tokens.css                  # Shared CSS design token source of truth
├── ARCHITECTURE.md             # In-depth architectural specification and ADRs
├── DESIGN.md                   # Complete visual design specification
├── IMPLEMENTATION_PLAN.md      # Phased execution plan & roadmap
├── package.json                # Root workspace orchestrator
└── pnpm-workspace.yaml         # Workspace definition
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your system:
- **Node.js**: `v20.0.0` or higher
- **pnpm**: `v9.0.0` or higher (`npm install -g pnpm`)
- **Python**: `3.12` or higher
- **Docker & Docker Compose**: For local PostgreSQL and Redis

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/<username>/CircuitMentor.git
cd CircuitMentor

# Install frontend dependencies across workspace
pnpm install
```

### 2. Configure Environment

Copy the example environment configuration:

```bash
cp .env.example .env
```

Set your configuration values (database credentials, JWT secret, and optional LLM API key) in `.env`.

### 3. Start Database & Redis (Docker)

```bash
pnpm docker:up
```

This boots:
- **PostgreSQL 16** with `pgvector` enabled on port `5432`
- **Redis 7** on port `6379`

### 4. Setup Backend API

In a separate terminal or virtual environment:

```bash
cd apps/api
python -m venv .venv

# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
```

Run database migrations:

```bash
pnpm api:migrate
# or directly from apps/api: alembic upgrade head
```

Seed initial component catalog and reference data:

```bash
pnpm api:seed
```

### 5. Launch Development Servers

Start the frontend and backend in development mode:

```bash
# Frontend development server (http://localhost:5173)
pnpm dev

# Backend API server (http://localhost:8000)
pnpm api:dev
```

---

## 🛠️ Monorepo Scripts Reference

All primary tasks can be run from the root workspace using `pnpm`:

| Command | Action |
|---|---|
| `pnpm dev` | Start web frontend dev server (`vite`) |
| `pnpm build` | Compile TypeScript and produce production frontend bundle |
| `pnpm typecheck` | Run `tsc --noEmit` across `@circuitmentor/web` |
| `pnpm lint` | Run ESLint across web source code |
| `pnpm api:dev` | Start FastAPI with Uvicorn auto-reload on `:8000` |
| `pnpm api:migrate` | Apply latest Alembic database migrations |
| `pnpm api:seed` | Seed component catalog and default lab tasks |
| `pnpm docker:up` | Spin up PostgreSQL (with pgvector) and Redis containers |
| `pnpm docker:down` | Stop and tear down local Docker containers |

---

## ⌨️ Essential Keyboard Shortcuts

| Key | Action |
|---|---|
| <kbd>Cmd/Ctrl</kbd> + <kbd>K</kbd> | Open Command Palette (search parts, run ERC, navigate) |
| <kbd>Space</kbd> + Drag | Pan across schematic canvas |
| <kbd>R</kbd> | Rotate selected component 90° clockwise |
| <kbd>Backspace</kbd> / <kbd>Delete</kbd> | Delete selected component or wire segment |
| <kbd>Cmd/Ctrl</kbd> + <kbd>Z</kbd> | Undo canvas action |
| <kbd>Cmd/Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd> | Redo canvas action |
| <kbd>?</kbd> | Open Shortcuts Reference Sheet |

---

## 📑 Architectural Decision Records (ADRs)

CircuitMentor documents significant technical and design trade-offs in [ARCHITECTURE.md](file:///c:/Users/BHUSHAN/Desktop/tiet/V%20Sem/SE/CircuitMentor/ARCHITECTURE.md):

* **ADR-001**: Single-document Yjs CRDT for all circuit topology state.
* **ADR-002**: Pure SVG canvas over Canvas2D/WebGL for crisp line-art rendering and accessibility.
* **ADR-003**: Deterministic rule-based ERC preceding any LLM mentor invocation.
* **ADR-004**: Offline MNA/SPICE execution via Web Workers (Comlink).
* **ADR-005**: Ghost overlay diffs for AI-suggested circuit alterations (I-1 invariant).
* **ADR-006**: PostgreSQL with `pgvector` HNSW indexes for hybrid semantic/lexical RAG.
* **ADR-007**: Single-accent `#0A84FF` dark workspace design system with strict status semantics.
* **ADR-008**: Radix UI primitives with `cmdk` and `shadcn/ui` styling conventions.

---

## 👥 Team

| Name | Role & Track |
|---|---|
| **Bhaagwat Sharma** | Canvas & Interaction (SVG renderer, Yjs document, pointer interaction, responsive shell) |
| **Gautam Bhattacharya** | Engines (Netlist compiler, MNA solver, ERC rule engine, Web Worker pool) |
| **Shrestha Bhushan** | AI & Retrieval (Mentor orchestrator, tool schema, hint ladder, RAG pipeline) |
| **Gagan Tyagi** | Platform & Design System (FastAPI services, Postgres schema, auth, tokens, CI/CD) |

---

## 📄 License

This project is licensed under the [MIT License](file:///c:/Users/BHUSHAN/Desktop/tiet/V%20Sem/SE/CircuitMentor/LICENSE).
