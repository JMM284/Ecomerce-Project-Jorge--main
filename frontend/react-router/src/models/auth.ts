export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
}