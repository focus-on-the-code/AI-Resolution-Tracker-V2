resolution-tracker-v2/
├── public/                # Static assets (favicon, manifest)
├── src/                   # The heart of your application
│   ├── assets/            # Global images and base CSS files
│   ├── components/        # Individual UI building blocks
│   │   ├── Header.jsx     # Navigation and branding
│   │   ├── Tracker.jsx    # The core logic for tracking goals
│   │   ├── GoalCard.jsx   # Individual resolution items
│   │   └── ProgressBar.jsx # Visual feedback component
│   ├── App.jsx            # The "Orchestrator" (connects all components)
│   ├── main.jsx           # The entry point that renders the app
│   └── index.css          # Global styling (Tailwind or standard CSS)
├── .gitignore             # Tells GitHub which files to ignore (like node_modules)
├── index.html             # The single HTML file the browser loads
├── package.json           # Your project's manifest and dependency list
└── vite.config.js         # Configuration for the build tool