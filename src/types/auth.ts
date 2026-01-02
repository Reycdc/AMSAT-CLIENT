export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  jenis_kelamin: 'L' | 'P';
  alamat: string | null;
  thumbnail: string | null;
  status: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  roles?: Role[];
  permissions?: Permission[];
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    user: User;
    access_token: string;
    token_type: string;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
