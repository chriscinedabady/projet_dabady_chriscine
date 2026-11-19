export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
}

export type SignUpPayload = Omit<User, 'id'>;

export interface LoginPayload {
  identifier: string;
  password: string;
}
