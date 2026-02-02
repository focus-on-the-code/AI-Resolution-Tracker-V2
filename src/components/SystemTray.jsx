import React from 'react';
import './SystemTray.css';

function SystemTray({ apiKeyStatus, onDeleteAllData }) {
  return (
    <div className="system-tray">
      <p className="api-status-indicator">API Status: {apiKeyStatus}</p>
      <button onClick={onDeleteAllData} className="delete-data-button">DELETE ALL DATA</button>
    </div>
  );
}

export default SystemTray;
