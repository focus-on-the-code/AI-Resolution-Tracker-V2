const API_KEY_STORAGE_KEY = 'resolutionTrackerApiKey';

export const saveApiKey = (apiKey) => {
  try {
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    return true;
  } catch (error) {
    console.error("Error saving API key to localStorage:", error);
    return false;
  }
};

export const getApiKey = () => {
  try {
    return localStorage.getItem(API_KEY_STORAGE_KEY);
  } catch (error) {
    console.error("Error retrieving API key from localStorage:", error);
    return null;
  }
};

export const deleteApiKey = () => {
  try {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error("Error deleting API key from localStorage:", error);
    return false;
  }
};

// Basic input sanitization function
export const sanitizeInput = (input) => {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(input));
  return div.innerHTML;
};
