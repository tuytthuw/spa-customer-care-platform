export interface Message {
  id: string;
  sender: "customer" | "staff" | "bot";
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  customerId: string;
  lastMessage: string;
  lastMessageTimestamp: string;
  isRead: boolean;
  messages: Message[];
}
