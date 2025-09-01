import { Conversation } from "@/features/inbox/types";
// **XÓA BỎ mockCustomers**
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCustomers } from "@/features/customer/api/customer.api";
import { FullCustomerProfile } from "@/features/customer/types";
import { sendMessage } from "@/features/inbox/api/inbox.api";
import { useState } from "react";

interface ChatPanelProps {
  conversation: Conversation | null;
}

const ChatPanel = ({ conversation }: ChatPanelProps) => {
  const queryClient = useQueryClient();
  const [input, setInput] = useState("");

  // Fetch danh sách khách hàng
  const { data: customers = [] } = useQuery<FullCustomerProfile[]>({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  // Mutation để gửi tin nhắn**
  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      // Làm mới lại danh sách hội thoại để cập nhật tin nhắn cuối và trạng thái
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      setInput(""); // Xóa nội dung trong ô input
    },
    onError: (error) => {
      // Bạn có thể dùng toast ở đây để thông báo lỗi
      console.error("Gửi tin nhắn thất bại:", error);
    },
  });

  const handleSend = () => {
    if (input.trim() && conversation) {
      sendMessageMutation.mutate({
        conversationId: conversation.id,
        text: input.trim(),
      });
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">
          Chọn một cuộc trò chuyện để bắt đầu
        </p>
      </div>
    );
  }

  //Tìm khách hàng từ dữ liệu API**
  const customer = customers.find((c) => c.id === conversation.customerId);

  return (
    <div className="flex-1 flex flex-col h-full">
      <header className="p-4 border-b flex items-center gap-4">
        <Avatar>
          <AvatarImage
            src={
              customer?.avatar ||
              `https://api.dicebear.com/7.x/notionists/svg?seed=${customer?.id}`
            }
          />
          <AvatarFallback>{customer?.name?.[0]}</AvatarFallback>
        </Avatar>
        <h3 className="font-semibold">{customer?.name || "Khách hàng"}</h3>
      </header>
      <ScrollArea className="flex-1 p-4 bg-muted/20">
        <div className="flex flex-col gap-4">
          {conversation.messages.map((msg) => (
            <div
              key={msg.id}
              className={cn("flex", {
                "justify-end": msg.sender === "staff",
                "justify-start": msg.sender !== "staff",
              })}
            >
              <div
                className={cn("rounded-lg px-4 py-2 max-w-xs", {
                  "bg-primary text-primary-foreground": msg.sender === "staff",
                  "bg-card border": msg.sender !== "staff",
                })}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <footer className="p-4 border-t">
        <div className="flex items-center gap-2">
          <Input placeholder="Nhập tin nhắn..." />
          <Button>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default ChatPanel;
