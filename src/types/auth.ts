export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "admin";
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
