import React, { useState, useEffect, useRef } from 'react';
import { sanitizeInput } from '../keyManager'; // Import sanitizeInput
import './GoalTab.css';

function GoalTab({ goalData, goalName, chatHistory, onSendMessage, onMilestoneToggle }) {
  const [currentMessage, setCurrentMessage] = useState('');
  const [milestonesState, setMilestonesState] = useState([]);
  const chatHistoryRef = useRef(null);

  useEffect(() => {
    // Initialize milestones state from goalData, ensuring each has a 'completed' property
    if (goalData && goalData.milestones) {
      const initialMilestones = goalData.milestones.map((milestone, index) => ({
        id: index, // Simple ID for now, will use DB ID later
        description: milestone,
        completed: false, // Default to false
        // Potentially add a 'status' or 'dbId' here when integrated with Dexie
      }));
      setMilestonesState(initialMilestones);
    }
  }, [goalData]);

  useEffect(() => {
    // Scroll to the bottom of the chat history when it updates
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleLocalSendMessage = () => {
    if (currentMessage.trim()) {
      onSendMessage({ sender: 'user', message: currentMessage });
      setCurrentMessage('');
    }
  };

  const handleMilestoneToggle = (id) => {
    setMilestonesState(prevMilestones => {
      const updatedMilestones = prevMilestones.map(milestone =>
        milestone.id === id ? { ...milestone, completed: !milestone.completed } : milestone
      );
      // If onMilestoneToggle prop is provided, call it
      if (onMilestoneToggle) {
        const toggledMilestone = updatedMilestones.find(milestone => milestone.id === id);
        onMilestoneToggle(toggledMilestone);
      }
      return updatedMilestones;
    });
  };

  if (!goalData) {
    return <div className="goal-tab-loading">No goal data available.</div>;
  }

  return (
    <div className="goal-tab-container">
      <div className="goal-content">
        <h2 className="flicker">{goalName}: {goalData.projectName}</h2>
        <p className="description">{goalData.description}</p>
        <h3 className="flicker">Milestones:</h3>
        <ul className="milestone-list">
          {milestonesState.map((milestone) => (
            <li key={milestone.id} className={milestone.completed ? 'completed-milestone' : ''}>
              <input
                type="checkbox"
                id={`milestone-${milestone.id}`}
                checked={milestone.completed}
                onChange={() => handleMilestoneToggle(milestone.id)}
              />
              <label htmlFor={`milestone-${milestone.id}`}>{milestone.description}</label>
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-sidebar">
        <h4>Strategy Chat</h4>
        <div className="chat-history" ref={chatHistoryRef}>
          {chatHistory.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}`}>
              <strong>{msg.sender === 'user' ? 'You' : 'AI'}:</strong> {msg.message}
            </div>
          ))}
        </div>
        <div className="chat-input-area">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(sanitizeInput(e.target.value))}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleLocalSendMessage();
              }
            }}
            placeholder="Type your strategy here..."
          />
          <button onClick={handleLocalSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default GoalTab;
