# AI-Powered Electronics Design & Learning Platform
## 4-Week Development Journal

**Team Members (in order):**
1. Gautam Bhattacharya
2. Bhaagwat Sharma
3. Shreshtha Bhushan
4. Gagan Tyagi

---

## Project Overview

The **AI-Powered Electronics Design & Learning Platform** is designed as an interactive electronics workspace combined with an AI mentor. The platform follows a student-first approach: the student physically and visually builds the circuit or PCB, while the AI provides contextual guidance, explanations, troubleshooting support, and answers to "what-if?" questions.

The central philosophy of the project is:

> **AI guides. Student builds. Student learns.**

The AI is not intended to automatically build or modify the student's circuit. Instead, it understands the project objective, the student's current workspace, the construction process, and relevant electronics knowledge so that it can guide the student through the design and learning process.

---

# Week 1 — Problem Definition, Product Direction and Initial Research

## Problem Faced

The initial challenge was defining the exact scope of the project. Electronics design can include many areas such as circuit design, PCB layout, simulation, component selection, routing, and manufacturing. A broad scope would make the project difficult to implement and could shift the system away from its educational purpose.

Another important question was deciding what role AI should play. A system that automatically creates the entire circuit would reduce the student's involvement and would not strongly support learning.

## Relevant Context

The team discussed the idea of combining an interactive electronics workspace with an AI mentor. The workspace was envisioned as a Tinkercad-like environment in which students can select components visually and construct circuits themselves.

The platform is intended to support both breadboard-style circuit construction and PCB/canvas-based design. The component library is planned to include more than basic components, including sensors, microcontrollers, motors, servos, ICs, and modules.

## Key Observation

The most important observation during the first week was that **student involvement should remain central to the system**.

The AI should not replace the student's design activity. Instead, it should help the student understand what they are doing, identify mistakes, explore alternatives, and complete the project independently.

## Solution / Direction

The team defined the project as an **AI-Powered Electronics Design & Learning Platform** rather than an autonomous PCB designer.

The initial core features were identified as:

- Interactive electronics workspace
- Visual component library
- Student-controlled circuit construction
- Project objective definition and clarification
- Context-aware AI mentor
- Error detection and explanation
- Progressive assistance from hints to direct solutions
- "What-if?" questions and alternative component exploration
- Electronics knowledge retrieval using RAG
- Project/task-based guidance

## Individual Contributions

### 1. Gautam Bhattacharya
- Contributed to research related to the overall electronics platform and its technical direction.
- Contributed to defining the overall system direction.
- Worked on the initial system design and understanding of the platform workflow.
- Helped structure the proposed backend and overall technical direction.
- Contributed ideas for the presentation structure.

### 2. Bhaagwat Sharma
- Researched the educational and technical requirements of an AI-assisted electronics platform.
- Contributed to defining the student-first design philosophy.
- Worked on system design documentation and clarification of the project's scope.
- Helped distinguish the proposed platform from a fully autonomous electronics design system.

### 3. Shreshtha Bhushan
- Contributed to the frontend-oriented understanding of the interactive workspace.
- Discussed how students could interact with components visually.
- Contributed to backend and presentation planning.
- Helped identify important user interactions within the proposed platform.

### 4. Gagan Tyagi
- Contributed to documentation planning.
- Worked on the structure of the project report.
- Helped organize project information for later documentation and presentation.

## Outcome

By the end of Week 1, the team had established a clear project direction: an interactive electronics learning environment where the student remains responsible for building the circuit and the AI acts as a mentor.

---

# Week 2 — System Architecture, AI Context and RAG Research

## Problem Faced

After defining the product direction, the next challenge was determining how the AI could understand what the student was currently doing.

A normal chatbot only receives the user's text. In this project, the AI needs additional information such as the current circuit state, project objective, construction stage, and visual representation of the workspace.

## Relevant Context

The team considered three important inputs for the AI:

1. **User prompt** — what the student is currently asking or trying to understand.
2. **Runtime circuit state** — structured information about components, values, pins, and connections.
3. **Workspace screenshot** — visual information about the current arrangement of components.

Additional project context can include the project objective, current task, previous steps, and relevant construction procedure.

## Key Observation

The team identified that the **structured runtime state should act as the main source of circuit information**, while the screenshot provides visual grounding.

For example, the runtime state can represent information such as:

- Component ID
- Component type
- Component value
- Pins
- Connections
- Power and ground connections

The screenshot can help the AI understand the visual arrangement and context that may not be conveniently represented in structured data.

## RAG Research

The team also explored the role of Retrieval-Augmented Generation (RAG).

RAG is intended to provide the AI with reliable technical knowledge instead of depending entirely on the language model's general knowledge.

Potential knowledge categories include:

- Component datasheets
- Pinouts
- Component specifications
- Electronics concepts
- Circuit construction knowledge
- Troubleshooting information
- Project procedures
- Component alternatives
- Trade-offs between components
- Educational explanations

## Proposed AI Pipeline

The proposed contextual AI flow became:

**Student → Interactive Workspace → Runtime State + Screenshot + Prompt → Context Builder → Knowledge Retrieval / RAG → AI Reasoning → Mentor Response → Student Action**

This separates circuit-state information from general electronics knowledge and allows the AI to produce more relevant guidance.

## Individual Contributions

### 1. Gautam Bhattacharya
- Contributed to research on the system architecture and technical approach.
- Worked on system architecture and backend-oriented planning.
- Contributed to defining the flow of information between the workspace and AI system.
- Helped structure the runtime-state and AI interaction concepts.

### 2. Bhaagwat Sharma
- Researched the AI context requirements.
- Contributed to documentation of runtime state, screenshots, project context, and prompts.
- Studied how RAG could support electronics-specific knowledge.
- Helped document the proposed AI pipeline.

### 3. Shreshtha Bhushan
- Contributed to how the frontend workspace could expose relevant circuit information.
- Considered the interaction between the visual workspace and backend services.
- Helped connect the workspace concept with the proposed AI workflow.

### 4. Gagan Tyagi
- Organized the architectural concepts for project documentation.
- Contributed to recording the RAG and AI workflow for the report.
- Helped maintain documentation consistency.

## Outcome

By the end of Week 2, the team had a clearer architecture for a context-aware AI mentor. The AI was defined as a combination of structured circuit information, project context, retrieved electronics knowledge, and language-model reasoning.

---

# Week 3 — Workspace, Component Model and AI Mentor Behaviour

## Problem Faced

The next challenge was translating the system concept into an understandable student interaction.

It was necessary to define what happens when a student makes a mistake, asks a question, wants to change a component, or needs help with the next step.

## Relevant Context

The workspace is intended to provide a visual component library from which students can select components and build their circuits.

The component scope was expanded beyond simple components such as resistors and LEDs. The proposed platform can include:

- LEDs
- Resistors
- Sensors
- Microcontrollers
- Servo motors
- DC motors
- ICs
- Modules
- Other commonly used electronics components

The student remains responsible for placing and connecting these components.

## Key Observation — Progressive Assistance

The team identified that the AI should not immediately provide the complete solution for every mistake.

A progressive assistance model was discussed:

**Nudge → Hint → Explanation → Direct Solution**

For example, if an LED is connected with incorrect polarity, the AI could initially provide a small hint such as asking the student to reconsider the LED polarity. If the student still cannot solve the issue, the AI can provide a stronger explanation and eventually the direct correction.

This approach keeps the student involved in the learning process.

## "What-If?" Interaction

Another important interaction identified during Week 3 was the ability to ask hypothetical questions.

Examples include:

- "What if I use a 330Ω resistor?"
- "Can I use another sensor?"
- "What happens if I connect the LED directly to 5V?"
- "Can I replace this component with another one?"

The AI should explain the consequences, limitations, alternatives, and trade-offs instead of simply giving a yes/no answer.

## Project and SOP Context

The team also identified the importance of knowing the project's intended construction process.

For example, an automatic dustbin project could be divided into tasks such as:

1. Understand the objective
2. Identify required components
3. Place the ultrasonic sensor
4. Establish power and ground
5. Connect the sensor
6. Place the servo motor
7. Connect the servo
8. Verify the circuit
9. Test the project

The AI can use this task context to guide the student toward the next appropriate step.

## Example Project

An automatic dustbin was used as a conceptual example involving:

- Ultrasonic sensor
- Microcontroller
- Servo motor

The AI would help the student understand the architecture and guide the construction process, but the student would make the actual component placement and connections.

## Individual Contributions

### 1. Gautam Bhattacharya
- Contributed to research and technical exploration related to the interactive workspace.
- Contributed to the system design for the interactive workspace.
- Helped define the component and project workflow.
- Contributed to backend-oriented planning for representing project state.
- Worked on presentation material related to system functionality.

### 2. Bhaagwat Sharma
- Worked on documenting the AI mentor behaviour.
- Contributed to the progressive assistance concept.
- Documented "what-if?" interactions and project task guidance.
- Helped explain the educational reasoning behind keeping the student in control.

### 3. Shreshtha Bhushan
- Contributed to the frontend interaction model.
- Worked on how students could visually select and work with components.
- Contributed to the interaction between frontend workspace functionality and backend logic.
- Helped prepare related presentation material.

### 4. Gagan Tyagi
- Worked on organizing the project documentation.
- Contributed to documenting examples and workflows.
- Helped structure the report sections describing the user journey and mentor behaviour.

## Outcome

By the end of Week 3, the team had defined the central interaction loop:

**Student builds → Workspace state updates → AI checks context → AI guides → Student changes the circuit → AI re-evaluates → Student continues**

The AI was therefore positioned as an active mentor rather than a simple question-answering chatbot.

---

# Week 4 — Integration Planning, Requirements, Documentation and Presentation Preparation

## Problem Faced

The final week focused on bringing the previously defined concepts into one coherent system description.

The project includes several interconnected parts:

- Frontend workspace
- Component library
- Backend
- Runtime circuit state
- AI mentor
- RAG knowledge layer
- Project/task context
- Documentation
- Testing

The team needed to define how these parts fit together and distinguish the MVP from future extensions.

## Relevant Context

The proposed MVP focuses on:

- Interactive circuit/PCB workspace
- Student-controlled construction
- Context-aware AI mentor
- Project objective clarification
- Circuit-state awareness
- Error guidance
- "What-if?" reasoning
- Electronics knowledge retrieval
- Progressive learning assistance

Full professional EDA capabilities are outside the immediate MVP scope.

## Key Observation

A major conclusion from the project planning was that the platform should focus on **learning through construction**, rather than trying to automate professional electronics engineering.

The AI should help students understand:

- Why a component is needed
- Why a connection is correct or incorrect
- What happens when a component is changed
- What alternatives are available
- What the next construction step should be
- How to troubleshoot a problem

## Requirements Planning

### Functional Requirements

The proposed system should be able to:

1. Create and manage electronics projects.
2. Provide a visual component library.
3. Allow students to place and connect components.
4. Maintain structured circuit state.
5. Accept student questions and prompts.
6. Provide project-aware AI guidance.
7. Retrieve relevant electronics knowledge.
8. Explain mistakes and possible corrections.
9. Answer "what-if?" questions.
10. Guide students through project tasks.

### Non-Functional Requirements

The team also considered:

- Usability
- Responsiveness
- Reliability
- Maintainability
- Security
- Scalability
- Clear AI responses
- Consistent circuit-state representation

## Testing Plan

The testing approach was planned around multiple levels:

### Unit Testing
Testing individual modules such as component handling, state representation, and backend logic.

### Integration Testing
Testing communication between the frontend, backend, AI services, and knowledge retrieval components.

### System Testing
Testing complete project workflows from project creation to guided construction and verification.

### User Testing
Testing whether students can understand the AI's guidance and complete construction without the AI taking over the design.

## Future Scope

Potential future extensions include:

- Electrical circuit simulation
- Circuit visualization
- Oscilloscope and waveform views
- More advanced PCB routing
- Manufacturing-oriented outputs
- Hardware integration
- Larger component libraries
- More advanced engineering recommendations

These are considered future directions rather than core MVP capabilities.

## Individual Contributions

### 1. Gautam Bhattacharya
- Consolidated research findings and the overall system design.
- Contributed to backend and integration planning.
- Helped organize the final system architecture.
- Contributed to presentation preparation.

### 2. Bhaagwat Sharma
- Consolidated system design documentation.
- Worked on project requirements and AI workflow documentation.
- Organized the technical explanation of RAG, runtime state, and contextual AI behaviour.
- Contributed to final presentation and documentation preparation.

### 3. Shreshtha Bhushan
- Contributed to frontend and backend integration planning.
- Helped organize the workspace and user interaction flow.
- Contributed to presentation preparation.
- Helped ensure that the proposed interface matched the student-first project direction.

### 4. Gagan Tyagi
- Consolidated report and documentation material.
- Organized project sections and supporting explanations.
- Contributed to testing-plan documentation.
- Helped prepare the final project documentation.

## Outcome

By the end of Week 4, the team had a consolidated understanding of the proposed system, its AI workflow, its student interaction model, its requirements, and its future scope.

The project direction was established around a simple principle:

> **The goal is not to replace the student in the design process, but to make the student better at it.**

---

# Team Contribution Summary

| Member | Primary Responsibility |
|---|---|
| **Gautam Bhattacharya** | System design, research, backend, PPT |
| **Bhaagwat Sharma** | Research, system design documentation |
| **Shreshtha Bhushan** | Frontend, backend, PPT |
| **Gagan Tyagi** | Report, documentation |

---

# Core Technical Concepts

## 1. Interactive Electronics Workspace

The workspace provides the visual environment where the student selects components and constructs the circuit.

The student, rather than the AI, performs the actual design actions.

## 2. Runtime Circuit State

The runtime state provides a structured representation of the current circuit.

It can contain information such as:

- Components
- Component types
- Values
- Pins
- Connections
- Power connections
- Ground connections

This structured representation is important because an AI model should not be expected to infer every electrical connection from a screenshot alone.

## 3. Screenshot Context

A screenshot provides visual information about the current workspace.

It can help the AI understand:

- Component arrangement
- Visual layout
- Workspace context
- Information that may not be obvious from structured state alone

## 4. RAG

Retrieval-Augmented Generation provides relevant electronics knowledge to the AI.

The knowledge layer can eventually contain datasheets, pinouts, component specifications, electronics concepts, troubleshooting information, and project procedures.

## 5. AI Mentor

The AI mentor combines:

- Student prompt
- Current circuit state
- Workspace screenshot
- Project objective
- Current task
- Retrieved electronics knowledge

It then generates contextual guidance.

## 6. Progressive Assistance

The AI can adapt the amount of help provided:

**Nudge → Hint → Explanation → Direct Solution**

This is intended to support learning rather than encourage students to copy solutions immediately.

---

# Overall Project Workflow

```text
Student creates/opens project
            ↓
Student defines project objective
            ↓
AI asks clarification questions if required
            ↓
Student selects components
            ↓
Student builds circuit/PCB
            ↓
Workspace updates runtime state
            ↓
Student asks AI or AI is triggered by a meaningful issue
            ↓
System gathers:
  - Prompt
  - Runtime state
  - Screenshot
  - Project context
            ↓
Relevant knowledge is retrieved
            ↓
AI reasons about the context
            ↓
AI provides guidance
            ↓
Student makes the required changes
            ↓
System checks the updated state
            ↓
Student continues
```

---

# Final Project Philosophy

The platform is designed around the following principle:

> **Don't build the circuit for the student. Build the student's ability to build the circuit.**

The AI acts as a mentor, teacher, examiner, and thought partner. The student remains the primary actor throughout the design process.

The intended final experience is one where a student can receive an unfamiliar electronics project, construct it themselves in an interactive environment, receive contextual guidance when needed, understand why their decisions are correct or incorrect, experiment with alternatives, and complete the project while gaining practical electronics knowledge.

---

# Current Project Direction

The project has been structured into the following major stages:

1. Problem definition
2. Product scope definition
3. Interactive workspace design
4. AI mentor design
5. Runtime state representation
6. RAG and knowledge-layer planning
7. Project/task context
8. Requirements definition
9. Architecture documentation
10. Testing planning
11. Presentation and report preparation

The distinction between **planned**, **designed**, and **implemented** work should be maintained in the final academic documentation. Features that have only been researched or designed should not be presented as completed implementations.

---

# Conclusion

Over the four weeks, the project evolved from a broad idea of using AI in electronics into a more focused **AI-Powered Electronics Design & Learning Platform**.

The key design decision was to keep the student in control of circuit construction while using AI to provide contextual assistance. The system combines an interactive electronics workspace with structured circuit information, project context, electronics knowledge retrieval, and an AI mentor.

The resulting concept is intended to bridge the gap between theoretical electronics knowledge and practical circuit construction.

**AI guides. Student builds. Student learns.**
