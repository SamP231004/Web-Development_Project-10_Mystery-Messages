import { AuthUser, Message } from "@/types/message";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>;
  token?: string;
  user?: AuthUser;
};
