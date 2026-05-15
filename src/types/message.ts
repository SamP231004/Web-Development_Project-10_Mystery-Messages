export interface Message {
  _id: string;
  content: string;
  createdAt: string;
}

export interface AuthUser {
  _id: string;
  username: string;
  email: string;
  isVerified: boolean;
  isAcceptingMessages: boolean;
}
