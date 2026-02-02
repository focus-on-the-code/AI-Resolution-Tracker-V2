import React, { useState, useEffect, useRef } from 'react';
import { sanitizeInput } from '../keyManager'; // Import sanitizeInput
import './EvolutionScreen.css';

function EvolutionScreen({ projectData, onBackToCommandCenter, llmBaseUrl, apiKey }) {
  const [completedMilestones, setCompletedMilestones] = useState([]);
  const [vibeChatHistory, setVibeChatHistory] = useState([]);
  const [currentVibeMessage, setCurrentVibeMessage] = useState('');
  const [vibeSentiment, setVibeSentiment] = useState('neutral'); // 'positive', 'neutral', 'negative'
  const vibeChatHistoryRef = useRef(null);
  const [loadingVibeAnalysis, setLoadingVibeAnalysis] = useState(false);

  useEffect(() => {
    if (projectData && projectData.milestones) {
      setCompletedMilestones(projectData.milestones.filter(m => m.completed));
    }
  }, [projectData]);

  useEffect(() => {
    if (vibeChatHistoryRef.current) {
      vibeChatHistoryRef.current.scrollTop = vibeChatHistoryRef.current.scrollHeight;
    }
  }, [vibeChatHistory]);

  const analyzeVibeWithLLM = async (userMessage) => {
    setLoadingVibeAnalysis(true);
    try {
      if (!llmBaseUrl || !apiKey) {
        throw new Error("LLM Base URL or API Key is missing. Please configure them in the Gateway.");
      }

      const LLM_API_URL = `${llmBaseUrl.endsWith('/') ? llmBaseUrl.slice(0, -1) : llmBaseUrl}/v1/chat/completions`;

      const milestonesText = completedMilestones.length > 0
        ? "Completed milestones: " + completedMilestones.map(m => m.description).join("; ")
        : "No milestones completed yet.";

      const prompt = `
        You are a Vibe Analyst AI. Analyze the overall sentiment and progress of the project "${projectData.projectName}" based on the following:
        - Project Description: "${projectData.description}"
        - Current Completed Milestones: ${milestonesText}
        - User's Question/Comment: "${userMessage}"

        Provide a sentiment analysis ("positive", "neutral", "negative") and a short, encouraging, or insightful message.
        Return your response in JSON format with two properties:
        - "sentiment": "positive" | "neutral" | "negative"
        - "vibeMessage": A short message from the Vibe Analyst.
      `;

      const response = await fetch(LLM_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
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
      const llmContent = data.choices[0].message.content;
      const parsedResponse = JSON.parse(llmContent);

      if (!parsedResponse.sentiment || !parsedResponse.vibeMessage) {
        throw new Error("Vibe Analyst LLM response is missing required fields (sentiment, vibeMessage).");
      }

      setVibeSentiment(parsedResponse.sentiment);
      setVibeChatHistory(prevHistory => [
        ...prevHistory,
        { sender: 'ai', message: parsedResponse.vibeMessage }
      ]);

    } catch (error) {
      console.error("Error analyzing vibe with LLM:", error);
      setVibeChatHistory(prevHistory => [
        ...prevHistory,
        { sender: 'ai', message: `Vibe Analyst encountered an error: ${error.message}` }
      ]);
      setVibeSentiment('neutral'); // Reset to neutral on error
    } finally {
      setLoadingVibeAnalysis(false);
    }
  };

  const handleSendVibeMessage = () => {
    if (currentVibeMessage.trim()) {
      const userMessage = currentVibeMessage;
      setVibeChatHistory(prevHistory => [...prevHistory, { sender: 'user', message: userMessage }]);
      setCurrentVibeMessage('');
      analyzeVibeWithLLM(userMessage);
    }
  };

  const getVibeMeterClass = () => {
    switch (vibeSentiment) {
      case 'positive': return 'positive';
      case 'negative': return 'negative';
      default: return 'neutral';
    }
  };

  return (
    <div className="evolution-screen">
      <button className="back-button" onClick={onBackToCommandCenter}>
        &lt; Back to Command Center
      </button>
      <h1>{projectData?.projectName || 'Project'}: Evolution</h1>

      <div className="evolution-content">
        <div className="completed-milestones-area">
          <h2 className="flicker">Completed Milestones</h2>
          {completedMilestones.length === 0 ? (
            <p>No milestones completed yet. Keep pushing!</p>
          ) : (
            <ul>
              {completedMilestones.map(milestone => (
                <li key={milestone.id}>{milestone.description}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="vibe-analyst-chat">
          <h2 className="flicker">Vibe Analyst Chat</h2>
          <div className="chat-history" ref={vibeChatHistoryRef}>
            {vibeChatHistory.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>
                <strong>{msg.sender === 'user' ? 'You' : 'Vibe AI'}:</strong> {msg.message}
              </div>
            ))}
            {loadingVibeAnalysis && (
              <div className="chat-message ai">
                <strong>Vibe AI:</strong> Analyzing...
              </div>
            )}
          </div>
          <div className="chat-input-area">
            <input
              type="text"
              value={currentVibeMessage}
              onChange={(e) => setCurrentVibeMessage(sanitizeInput(e.target.value))}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendVibeMessage();
                }
              }}
              placeholder="Ask the Vibe Analyst..."
              disabled={loadingVibeAnalysis}
            />
            <button onClick={handleSendVibeMessage} disabled={loadingVibeAnalysis}>
              {loadingVibeAnalysis ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </div>
      </div>

      <div className={`vibe-meter flicker ${getVibeMeterClass()}`}>
        <p>Current Project Vibe: {vibeSentiment.charAt(0).toUpperCase() + vibeSentiment.slice(1)}</p>
      </div>
    </div>
  );
}

export default EvolutionScreen;
