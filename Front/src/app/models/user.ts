export interface User {
    id?: string;
    username: string;
    email: string;
    password?: string;
  }
  
  export type SignUpPayload = Omit<User, 'id'>;