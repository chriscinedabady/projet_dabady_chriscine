export interface User {
  id?: number | string;
  username: string;
  email: string;
  password?: string;
}

export type SignUpPayload = Omit<User, 'id'>;
