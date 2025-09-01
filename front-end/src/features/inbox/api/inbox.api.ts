import { Conversation, Message } from "@/features/inbox/types";
import { v4 as uuidv4 } from "uuid";

const CONVERSATIONS_API_URL = "http://localhost:3001/conversations";

export const getConversations = async (): Promise<Conversation[]> => {
  try {
    const response = await fetch(CONVERSATIONS_API_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to fetch conversations.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
};

// Hàm gửi tin nhắn mới
export const sendMessage = async ({
  conversationId,
  text,
}: {
  conversationId: string;
  text: string;
}): Promise<Conversation> => {
  // Lấy cuộc hội thoại hiện tại
  const getConvResponse = await fetch(
    `${CONVERSATIONS_API_URL}/${conversationId}`
  );
  if (!getConvResponse.ok) {
    throw new Error("Không thể tải cuộc hội thoại để gửi tin nhắn.");
  }
  const conversation: Conversation = await getConvResponse.json();

  // Tạo tin nhắn mới
  const newMessage: Message = {
    id: `msg-${uuidv4()}`,
    sender: "staff", // Mặc định người gửi từ dashboard là nhân viên
    text,
    timestamp: new Date().toISOString(),
  };

  // Cập nhật lại cuộc hội thoại
  const updatedConversation = {
    ...conversation,
    messages: [...conversation.messages, newMessage],
    lastMessage: text,
    lastMessageTimestamp: newMessage.timestamp,
    isRead: true, // Nhân viên đã xem và trả lời
  };

  // Gửi lại toàn bộ cuộc hội thoại đã cập nhật lên server
  const response = await fetch(`${CONVERSATIONS_API_URL}/${conversationId}`, {
    method: "PUT", // Dùng PUT để thay thế toàn bộ đối tượng
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedConversation),
  });

  if (!response.ok) {
    throw new Error("Gửi tin nhắn thất bại.");
  }

  return await response.json();
};
