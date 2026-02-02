import React, { useState } from 'react';
import GoalTab from './GoalTab';
import './CommandCenter.css';

function CommandCenter({ projectData, updateMilestoneStatus, onShowEvolution }) {
  const [activeTab, setActiveTab] = useState(0); // 0 for Goal 1, 1 for Goal 2, 2 for Goal 3
  const [chatHistories, setChatHistories] = useState([[], [], []]); // Separate chat history for each of 3 goals

  const handleSendMessage = (tabIndex, message) => {
    setChatHistories(prevChatHistories => {
      const newChatHistories = [...prevChatHistories];
      const currentTabHistory = [...newChatHistories[tabIndex], message];
      newChatHistories[tabIndex] = currentTabHistory;
      return newChatHistories;
    });

    // Simulate AI response for context isolation demonstration
    setTimeout(() => {
      setChatHistories(prevChatHistories => {
        const newChatHistories = [...prevChatHistories];
        const aiResponse = { sender: 'ai', message: `AI for ${goals[tabIndex].name}: Understood "${message.message}".` };
        newChatHistories[tabIndex] = [...newChatHistories[tabIndex], aiResponse];
        return newChatHistories;
      });
    }, 1000);
  };

  if (!projectData) {
    return <div className="command-center-loading">Loading Project Data...</div>;
  }

  const goals = [
    { id: 0, name: "Goal 1", data: projectData },
    { id: 1, name: "Goal 2", data: projectData },
    { id: 2, name: "Goal 3", data: projectData },
  ];

  return (
    <div className="command-center">
      <div className="tab-navigation">
        {goals.map((goal, index) => (
          <button
            key={goal.id}
            className={`tab-button ${activeTab === index ? 'active' : ''} flicker`}
            onClick={() => setActiveTab(index)}
          >
            {goal.name}
          </button>
        ))}
        <button className="evolution-button flicker" onClick={onShowEvolution}>
          EVOLUTION
        </button>
      </div>
      <div className="tab-content">
        <GoalTab
          goalData={goals[activeTab].data}
          goalName={goals[activeTab].name}
          chatHistory={chatHistories[activeTab]}
          onSendMessage={(message) => handleSendMessage(activeTab, message)}
          onMilestoneToggle={updateMilestoneStatus}
        />
      </div>
    </div>
  );
}

export default CommandCenter;
