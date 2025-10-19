/**
 * Simple JSON-based authentication system
 * For production, use a proper database and authentication service
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');
const SESSIONS_FILE = path.join(process.cwd(), 'data', 'sessions.json');

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: number;
  lastLogin?: number;
}

export interface Session {
  id: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
}

export interface UserData {
  id: string;
  email: string;
  name: string;
  createdAt: number;
  lastLogin?: number;
}

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Load users from JSON file
function loadUsers(): User[] {
  ensureDataDir();
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
    return [];
  }
  const data = fs.readFileSync(USERS_FILE, 'utf-8');
  return JSON.parse(data);
}

// Save users to JSON file
function saveUsers(users: User[]) {
  ensureDataDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Load sessions from JSON file
function loadSessions(): Session[] {
  ensureDataDir();
  if (!fs.existsSync(SESSIONS_FILE)) {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify([], null, 2));
    return [];
  }
  const data = fs.readFileSync(SESSIONS_FILE, 'utf-8');
  return JSON.parse(data);
}

// Save sessions to JSON file
function saveSessions(sessions: Session[]) {
  ensureDataDir();
  fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
}

// Hash password using SHA-256
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Generate random session ID
function generateSessionId(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Register new user
export function registerUser(email: string, password: string, name: string): { success: boolean; error?: string; user?: UserData } {
  try {
    const users = loadUsers();
    
    // Check if user already exists
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'Email already registered' };
    }
    
    // Validate email
    if (!email.includes('@') || !email.includes('.')) {
      return { success: false, error: 'Invalid email address' };
    }
    
    // Validate password
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }
    
    // Validate name
    if (!name.trim()) {
      return { success: false, error: 'Name is required' };
    }
    
    // Create new user
    const user: User = {
      id: crypto.randomUUID(),
      email: email.toLowerCase(),
      passwordHash: hashPassword(password),
      name: name.trim(),
      createdAt: Date.now(),
    };
    
    users.push(user);
    saveUsers(users);
    
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      }
    };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Registration failed. Please try again.' };
  }
}

// Login user
export function loginUser(email: string, password: string): { success: boolean; error?: string; sessionId?: string; user?: UserData } {
  try {
    const users = loadUsers();
    
    // Find user
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }
    
    // Verify password
    const passwordHash = hashPassword(password);
    if (user.passwordHash !== passwordHash) {
      return { success: false, error: 'Invalid email or password' };
    }
    
    // Update last login
    user.lastLogin = Date.now();
    saveUsers(users);
    
    // Create session
    const sessions = loadSessions();
    const session: Session = {
      id: generateSessionId(),
      userId: user.id,
      createdAt: Date.now(),
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
    };
    
    sessions.push(session);
    saveSessions(sessions);
    
    return {
      success: true,
      sessionId: session.id,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Login failed. Please try again.' };
  }
}

// Validate session
export function validateSession(sessionId: string): { valid: boolean; user?: UserData } {
  try {
    const sessions = loadSessions();
    const session = sessions.find(s => s.id === sessionId);
    
    if (!session) {
      return { valid: false };
    }
    
    // Check if session is expired
    if (session.expiresAt < Date.now()) {
      // Remove expired session
      const updatedSessions = sessions.filter(s => s.id !== sessionId);
      saveSessions(updatedSessions);
      return { valid: false };
    }
    
    // Get user
    const users = loadUsers();
    const user = users.find(u => u.id === session.userId);
    
    if (!user) {
      return { valid: false };
    }
    
    return {
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      }
    };
  } catch (error) {
    console.error('Session validation error:', error);
    return { valid: false };
  }
}

// Logout user
export function logoutUser(sessionId: string): { success: boolean } {
  try {
    const sessions = loadSessions();
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    saveSessions(updatedSessions);
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false };
  }
}

// Clean up expired sessions (should be run periodically)
export function cleanupExpiredSessions() {
  try {
    const sessions = loadSessions();
    const now = Date.now();
    const activeSessions = sessions.filter(s => s.expiresAt > now);
    saveSessions(activeSessions);
    console.log(`Cleaned up ${sessions.length - activeSessions.length} expired sessions`);
  } catch (error) {
    console.error('Cleanup error:', error);
  }
}
