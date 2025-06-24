export interface User {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'member';
  familyId: string;
  verified: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}
