import Dexie from 'dexie';

const db = new Dexie('ResolutionTrackerDB');
db.version(1).stores({
  goals: '++id, name, description, status', // primary key 'id', indexed properties 'name', 'description', 'status'
  milestones: '++id, goalId, description, completed, dueDate', // primary key 'id', 'goalId' links to goals table
  logs: '++id, goalId, timestamp, message, sentiment', // primary key 'id', 'goalId' links to goals table
});

export default db;
