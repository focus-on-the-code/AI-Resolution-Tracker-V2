# Vaporwave Resolution Tracker

## Project Overview
The Vaporwave Resolution Tracker is a unique web application designed to help users define their objectives and track their progress through a distinct vaporwave aesthetic. It leverages Large Language Models (LLMs) to decompose high-level goals into actionable milestones and provides sentiment analysis to gauge project "vibe."

## Features
-   **API Key & LLM Base URL Configuration**: Securely store and manage your LLM API key and custom base URL in local storage, allowing flexibility across providers (OpenAI-compatible).
-   **Vision Input & Decomposition**: Input three primary objectives, which are then processed by an LLM to generate a project name, a concise description, and a list of 5-7 prioritized milestones.
-   **Command Center (Tabbed Interface)**: Navigate between your goals (currently displaying the same project data across tabs, designed for future multi-goal support).
-   **Milestone Tracking**: Mark milestones as completed with a simple toggle, and have their status persisted.
-   **Context-Isolated Strategy Chat**: Engage in a dedicated chat with an AI assistant for each goal, maintaining separate conversational contexts.
-   **Evolution Screen (Vibe Analysis)**: Access a dedicated screen to review completed milestones and interact with a "Vibe Analyst" AI.
-   **Vibe Analyst Chat**: Input queries to the Vibe Analyst AI, which performs sentiment analysis on your project's progress and provides insights.
-   **Dynamic Vibe Meter**: A visual indicator that changes color (neon shift) based on the sentiment analysis results from the Vibe Analyst AI.
-   **Data Management**: Easily delete all stored data (API key, goals, milestones, logs) from the system tray.
-   **Vaporwave Aesthetic**: Immersive neon glows, grid patterns, and flickering animations for a distinct visual experience.

## Technologies Used
-   **Frontend**: React.js
-   **Styling**: CSS Modules / Plain CSS
-   **State Management**: React Hooks (`useState`, `useEffect`, `useRef`)
-   **Local Storage**: For API Key and LLM Base URL persistence
-   **IndexedDB**: Powered by `Dexie.js` for structured storage of goals, milestones, and logs.
-   **Build Tool**: Vite
-   **LLM Interaction**: Dynamic API calls to OpenAI-compatible endpoints (e.g., OpenAI, Google Gemini, Anthropic, OpenRouter) for goal decomposition and sentiment analysis.

## Setup Instructions (Local Development)

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd resolution-tracker-v2
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run the development server**:
    ```bash
    npm run dev
    ```
    The application will typically open in your browser at `http://localhost:5173`.

## Usage

1.  **Gateway Screen**:
    *   Enter your **LLM Base URL** (e.g., `https://api.openai.com/v1` for OpenAI) and your corresponding **API Key**. These are saved locally in your browser's local storage.
    *   Input your three primary objectives in the "Vision Input" fields.
    *   Click "SUBMIT VISION" to have the LLM decompose your goals into a project plan.
2.  **Command Center**:
    *   After the LLM processes your vision, you will be redirected to the Command Center.
    *   Use the tabs ("Goal 1", "Goal 2", "Goal 3") to navigate. Currently, all tabs display the same project data.
    *   Toggle milestones as they are completed. Their status is saved locally.
    *   Use the "Strategy Chat" sidebar within each tab for context-isolated discussions with an AI.
    *   Click the "EVOLUTION" button to proceed to the Evolution Screen.
3.  **Evolution Screen**:
    *   View your completed milestones.
    *   Interact with the "Vibe Analyst Chat" to get sentiment analysis of your project's progress. The AI will analyze your completed milestones and your questions to determine the project's "vibe."
    *   Observe the "Vibe Meter" which visually updates based on the AI's sentiment analysis (Positive, Neutral, Negative).
4.  **System Tray**: Located at the bottom right, it shows your API Key status and allows you to "DELETE ALL DATA," clearing all local storage and IndexedDB entries.

## Deployment to GitHub Pages

To deploy this application to GitHub Pages, follow these steps:

1.  **Install `gh-pages` package**:
    ```bash
    npm install --save-dev gh-pages
    ```
2.  **Configure `package.json`**:
    Add a `homepage` field and update your scripts:
    ```json
    {
      "name": "resolution-tracker-v2",
      "private": true,
      "version": "0.0.0",
      "type": "module",
      "homepage": "https://<your-github-username>.github.io/<your-repo-name>/",
      "scripts": {
        "dev": "vite",
        "build": "vite build",
        "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
        "preview": "vite preview",
        "predeploy": "npm run build",
        "deploy": "gh-pages -d dist"
      },
      // ... other dependencies
    }
    ```
    Replace `<your-github-username>` and `<your-repo-name>` with your actual GitHub username and repository name.

3.  **Configure `vite.config.js`**:
    Update `vite.config.js` to use relative paths for assets:
    ```javascript
    import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'

    // https://vitejs.dev/config/
    export default defineConfig({
      plugins: [react()],
      base: './', // Add this line for GitHub Pages deployment
    })
    ```

4.  **Deploy**:
    ```bash
    npm run deploy
    ```
    This command will build your application and push the `dist` folder contents to a `gh-pages` branch in your repository. Your site should then be accessible at the URL specified in your `homepage` field.

## Screenshots (Coming Soon!)
*(Placeholder for future screenshots of the Gateway, Command Center, and Evolution screens)*

## Future Enhancements (from PLAN.md)
-   **Multi-Goal Support**: Refine the Command Center to manage and display distinct project data for each of the three goals.
-   **LLM Log Analysis**: Store LLM interactions and responses in IndexedDB for auditing and further analysis.
-   **Advanced Vibe Analysis**: Implement more sophisticated prompts for the Vibe Analyst to provide deeper insights and track historical sentiment trends.
-   **User Customization**: Allow users to customize neon colors, fonts, and other aesthetic elements.
-   **Notifications**: Implement browser notifications for milestone deadlines or important AI insights.
-   **Export/Import Data**: Functionality to export project data (goals, milestones, logs) and import existing data.
-   **API Key Encryption**: Implement client-side encryption for the API key stored in local storage for enhanced security.
