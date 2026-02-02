import { useState, useEffect } from 'react';
import Header from './components/Header';
import SystemTray from './components/SystemTray';
import CommandCenter from './components/CommandCenter';
import EvolutionScreen from './components/EvolutionScreen'; // Import EvolutionScreen
import { saveApiKey, getApiKey, saveLlmBaseUrl, getLlmBaseUrl, clearAllLlmSettings, sanitizeInput } from './keyManager';
import db from './db';
import './App.css';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [goal1, setGoal1] = useState('');
  const [goal2, setGoal2] = useState('');
  const [goal3, setGoal3] = useState('');
  const [loading, setLoading] = useState(false);
  const [projectData, setProjectData] = useState(null); // To store LLM response
  const [llmBaseUrl, setLlmBaseUrl] = useState(''); // New state for LLM Base URL
  const [currentScreen, setCurrentScreen] = useState('gateway'); // New state for screen management

  useEffect(() => {
    const storedApiKey = getApiKey();
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
    const storedLlmBaseUrl = getLlmBaseUrl(); // Use new getLlmBaseUrl
    if (storedLlmBaseUrl) {
      setLlmBaseUrl(storedLlmBaseUrl);
    }

    // Load existing project data from IndexedDB
    const loadProjectFromDb = async () => {
      const goals = await db.goals.toArray();
      if (goals.length > 0) {
        const primaryGoal = goals[0];
        const milestones = await db.milestones.where({ goalId: primaryGoal.id }).toArray();
        const loadedProjectData = {
          id: primaryGoal.id,
          projectName: primaryGoal.name,
          description: primaryGoal.description,
          milestones: milestones.map(m => ({
            id: m.id,
            description: m.description,
            completed: m.completed,
          })),
        };
        setProjectData(loadedProjectData);
        setCurrentScreen('commandCenter');
      }
    };
    loadProjectFromDb();
  }, []);

  const handleApiKeyChange = (e) => {
    const newKey = sanitizeInput(e.target.value);
    setApiKey(newKey);
    saveApiKey(newKey);
  };

  const handleLlmBaseUrlChange = (e) => {
    const newUrl = sanitizeInput(e.target.value);
    setLlmBaseUrl(newUrl);
    saveLlmBaseUrl(newUrl); // Use new saveLlmBaseUrl
  };

  const handleGoalChange = (setter) => (e) => setter(sanitizeInput(e.target.value));

  const handleDeleteAllData = async () => {
    if (window.confirm("Are you sure you want to delete all data, including your API Key and all goals/milestones? This cannot be undone.")) {
      clearAllLlmSettings(); // Use new clearAllLlmSettings
      setApiKey('');
      setLlmBaseUrl('');

      const updateMilestoneStatus = async (updatedMilestone) => {
        try {
          await db.milestones.update(updatedMilestone.id, { completed: updatedMilestone.completed });
          // Update the projectData state to reflect the change
          setProjectData(prevProjectData => {
            if (!prevProjectData) return null;
            const updatedMilestones = prevProjectData.milestones.map(m =>
              m.id === updatedMilestone.id ? { ...m, completed: updatedMilestone.completed } : m
            );
            return { ...prevProjectData, milestones: updatedMilestones };
          });
        } catch (error) {
          console.error("Error updating milestone status in DB:", error);
          alert("Failed to update milestone status.");
        }
      };

      const handleSubmitVision = async () => {
        setLoading(true);
        const currentApiKey = getApiKey();

        if (!currentApiKey) {
          alert("Please enter your API Key before submitting your vision.");
          setLoading(false);
          return;
        }

        if (!llmBaseUrl.trim()) {
          alert("Please enter the LLM Base URL before submitting your vision.");
          setLoading(false);
          return;
        }

        if (!llmBaseUrl.startsWith('http')) {
          alert("LLM Base URL must start with 'http' or 'https'.");
          setLoading(false);
          return;
        }

        if (!goal1.trim() || !goal2.trim() || !goal3.trim()) {
          alert("Please fill in all three vision objectives.");
          setLoading(false);
          return;
        }

        try {
          const LLM_API_URL = `${llmBaseUrl.endsWith('/') ? llmBaseUrl.slice(0, -1) : llmBaseUrl}/v1/chat/completions`;

          const prompt = `
          You are a project manager AI. Based on the following three goals, generate a project plan in JSON format.
          The JSON object should have three properties:
          - "projectName": a punchy 1-word name for the project.
          - "description": a 1-sentence description of the project.
          - "milestones": an array of 5-7 prioritized milestones for the project.

          Here are the three goals:
          1. ${goal1}
          2. ${goal2}
          3. ${goal3}

          Please ensure the output is a valid JSON object, and nothing else.
        `;

          const response = await fetch(LLM_API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${currentApiKey}`,
            },
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [{ role: "user", content: prompt }],
              response_format: { type: "json_object" }
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`LLM API error: ${response.status} ${response.statusText} - ${errorData.error?.message || JSON.stringify(errorData)}`);
          }

          const data = await response.json();
          console.log("LLM API Response:", data);

          const llmContent = data.choices[0].message.content;
          const parsedResponse = JSON.parse(llmContent);

          if (!parsedResponse.projectName || !parsedResponse.description || !Array.isArray(parsedResponse.milestones)) {
            throw new Error("LLM response is missing required fields (projectName, description, milestones).");
          }

          // Save generated project to IndexedDB
          const goalId = await db.goals.add({
            name: parsedResponse.projectName,
            description: parsedResponse.description,
            status: 'active', // Default status
          });

          const milestoneDbPromises = parsedResponse.milestones.map(milestoneDescription =>
            db.milestones.add({
              goalId: goalId,
              description: milestoneDescription,
              completed: false,
              dueDate: null, // No due date from LLM for now
            })
          );
          const milestoneIds = await Promise.all(milestoneDbPromises);

          const newProjectData = {
            id: goalId,
            projectName: parsedResponse.projectName,
            description: parsedResponse.description,
            milestones: parsedResponse.milestones.map((desc, index) => ({
              id: milestoneIds[index],
              description: desc,
              completed: false,
            })),
          };

          setProjectData(newProjectData);
          alert("Vision submitted and project data generated!");
          setCurrentScreen('commandCenter');

        } catch (error) {
          console.error("Error submitting vision to LLM:", error);
          alert(`Failed to generate project plan: ${error.message}`);
        } finally {
          setLoading(false);
        }
      };

      const apiKeyStatus = apiKey ? "Active" : "Not Entered";

      const handleShowEvolution = () => setCurrentScreen('evolution');
      const handleBackToCommandCenter = () => setCurrentScreen('commandCenter');

      return (
        <div className="App">
          <Header />
          {currentScreen === 'gateway' && (
            <main className="gateway-screen">
              <h1 className="flicker">THE GATEWAY</h1>
              <div className="api-key-input">
                <label htmlFor="llmBaseUrl">LLM Base URL:</label>
                <input
                  type="text"
                  id="llmBaseUrl"
                  value={llmBaseUrl}
                  onChange={handleLlmBaseUrlChange}
                  placeholder="e.g., https://api.openai.com/v1"
                />
                <label htmlFor="apiKey">API Key:</label>
                <input
                  type="password" /* Masked input */
                  id="apiKey"
                  value={apiKey}
                  onChange={handleApiKeyChange}
                  placeholder="Enter your API Key"
                />
                <p className="key-status">API Key Status: {apiKeyStatus}</p>
              </div>

              <div className="vision-input">
                <h2>VISION INPUT</h2>
                <input
                  type="text"
                  placeholder="Vision 1: What is your primary objective?"
                  value={goal1}
                  onChange={handleGoalChange(setGoal1)}
                  disabled={loading}
                />
                <input
                  type="text"
                  placeholder="Vision 2: What is your secondary objective?"
                  value={goal2}
                  onChange={handleGoalChange(setGoal2)}
                  disabled={loading}
                />
                <input
                  type="text"
                  placeholder="Vision 3: What is your tertiary objective?"
                  value={goal3}
                  onChange={handleGoalChange(setGoal3)}
                  disabled={loading}
                />
                <button className="submit-vision-button" onClick={handleSubmitVision} disabled={loading}>
                  {loading ? "PROCESSING..." : "SUBMIT VISION"}
                </button>
              </div>
              {projectData && (
                <div className="llm-response-display">
                  <h2>Generated Project: {projectData.projectName}</h2>
                  <p>{projectData.description}</p>
                  <h3>Milestones:</h3>
                  <ul>
                    {projectData.milestones.map((milestone, index) => (
                      <li key={index}>{milestone.description}</li>
                    ))}
                  </ul>
                </div>
              )}
            </main>
          )}

          {currentScreen === 'commandCenter' && projectData && (
            <CommandCenter
              projectData={projectData}
              updateMilestoneStatus={updateMilestoneStatus}
              onShowEvolution={handleShowEvolution}
            />
          )}

          {currentScreen === 'evolution' && projectData && (
            <EvolutionScreen
              projectData={projectData}
              onBackToCommandCenter={handleBackToCommandCenter}
              llmBaseUrl={llmBaseUrl}
              apiKey={apiKey}
            />
          )}
          <SystemTray apiKeyStatus={apiKeyStatus} onDeleteAllData={handleDeleteAllData} />
        </div>
      );
    }
  }
}

export default App;
