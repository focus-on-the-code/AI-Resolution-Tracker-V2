# @PLAN.md: Vaporwave Resolution Tracker

## Phase 1: Environment & Neon Shell
- [x] **Step 1.1:** Create directory `./resolution-tracker/` and initialize `index.html`, `style.css`, and `app.js`. (Completed by `npm create vite` in current directory, using `src/index.css`, `src/App.jsx`, `src/main.jsx`)
- [x] **Step 1.2:** Implement the Vaporwave CSS foundation: Midnight background, neon glow effects, and the perspective wireframe grid.
- [x] **Step 1.3:** Build **Screen 1 (The Gateway)**: API Key input (masked), Key Status Indicator, and the "Vision Input" (3 text fields for goals).

## Phase 2: The Vault (Storage & Security)
- [x] **Step 2.1:** Integrate **Dexie.js** via CDN to set up the IndexedDB schema (Tables: `goals`, `milestones`, `logs`).
- [x] **Step 2.2:** Build the `keyManager.js` logic to Save/Delete the API key from `localStorage`.
- [x] **Step 2.3:** Implement the "System Tray": A persistent UI element to check API status and delete data.

## Phase 3: The Vision Workshop (Goal Decomp)
- [x] **Step 3.1:** Create the "Submit Vision" logic. Trigger the LLM to take the 3 goals and return a JSON object containing:
    - A punchy 1-word Project Name.
    - A 1-sentence description.
    - 5-7 prioritized milestones.
- [x] **Step 3.2:** Build **Screen 2 (The Command Center)**: The tabbed interface allowing navigation between Goal 1, 2, and 3.

## Phase 4: The Dashboard & Strategy Chat
- [x] **Step 4.1:** Build the "Strategy Chat" sidebar for each goal tab. 
- [x] **Step 4.2:** Implement "Context-Isolation": Ensure the chat in Tab 2 only "knows" about Goal 2.
- [x] **Step 4.3:** Create the "Milestone Toggle": Logic to check/uncheck steps and save state to IndexedDB.

## Phase 5: The Reflection Suite (Vibe Analysis)
- [x] **Step 5.1:** Build **Screen 3 (Evolution)**: A dynamic expansion that reveals the "Completed Milestones" area and the "Vibe Analyst" chat window.
- [x] **Step 5.2:** Implement the Sentiment Analysis prompt: The AI analyzes logs and updates a visual "Vibe Meter" (Neon color shift).
- [x] **Step 5.3:** Final Polish: Add neon flickering animations and a "Safety Audit" for all inputs.