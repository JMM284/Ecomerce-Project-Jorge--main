import type { LoginResponse } from "../models/auth";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const API_URL = `${API_BASE_URL}/auth`;

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  // We send JSON to match the backend expectation
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      email: email, 
      password: password,
      username: email // Sending email as username too, just in case
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    // Fix for [object Object]: we make sure the error is a string
    const detail = errorData.detail;
    const message = typeof detail === 'string' ? detail : JSON.stringify(detail);
    throw new Error(message || "Login failed");
  }
  
  return response.json();
};

export async function registerUser(username: string, email: string, password: string) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    const detail = errorData.detail;
    const message = typeof detail === 'string' ? detail : JSON.stringify(detail);
    throw new Error(message || "Registration failed");
  }
  return response.json();
}