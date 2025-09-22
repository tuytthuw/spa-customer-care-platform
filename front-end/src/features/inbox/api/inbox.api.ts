import { Conversation, Message } from "@/features/inbox/types";
import { v4 as uuidv4 } from "uuid";

const CONVERSATIONS_API_URL = `${process.env.NEXT_PUBLIC_API_URL}/conversations`;

export const getConversations = async (): Promise<Conversation[]> => {
  try {
    const response = await fetch(CONVERSATIONS_API_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Failed to fetch conversations.");
    }
    // Sắp xếp để tin nhắn chưa đọc lên đầu
    const conversations: Conversation[] = await response.json();
    return conversations.sort((a, b) => {
      if (a.isRead !== b.isRead) {
        return a.isRead ? 1 : -1;
      }
      return (
        new Date(b.lastMessageTimestamp).getTime() -
        new Date(a.lastMessageTimestamp).getTime()
      );
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
};

// Hàm gửi tin nhắn mới (cho nhân viên)
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

// ✅ MỚI: Hàm xử lý tin nhắn từ khách hàng
export const handleCustomerSendMessage = async (
  text: string,
  customerId: string = "guest-user"
): Promise<void> => {
  // Vì là demo, chúng ta sẽ giả sử guest-user chỉ có 1 cuộc hội thoại
  // Trong thực tế, bạn sẽ dùng userId hoặc một định danh duy nhất trong localStorage
  const convRes = await fetch(
    `${CONVERSATIONS_API_URL}?customerId=${customerId}`
  );
  const existingConvs: Conversation[] = await convRes.json();

  const newMessage: Message = {
    id: `msg-${uuidv4()}`,
    sender: "customer",
    text,
    timestamp: new Date().toISOString(),
  };

  if (existingConvs.length > 0) {
    // Cập nhật cuộc hội thoại đã có
    const conversation = existingConvs[0];
    const updatedConversation = {
      ...conversation,
      messages: [...conversation.messages, newMessage],
      lastMessage: text,
      lastMessageTimestamp: newMessage.timestamp,
      isRead: false, // Tin nhắn mới từ khách, nhân viên chưa đọc
    };
    await fetch(`${CONVERSATIONS_API_URL}/${conversation.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedConversation),
    });
  } else {
    // Tạo cuộc hội thoại mới
    const newConversation: Conversation = {
      id: `conv-${uuidv4()}`,
      customerId,
      lastMessage: text,
      lastMessageTimestamp: newMessage.timestamp,
      isRead: false,
      messages: [
        {
          id: `msg-${uuidv4()}`,
          sender: "bot",
          text: "Xin chào! Tôi có thể giúp gì cho bạn?",
          timestamp: new Date().toISOString(),
        },
        newMessage,
      ],
    };
    await fetch(CONVERSATIONS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newConversation),
    });
  }
};
