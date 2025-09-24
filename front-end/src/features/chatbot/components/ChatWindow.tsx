"use client";

import { motion } from "framer-motion";
import { Send, User } from "lucide-react";
import { Button } from "@/features/shared/components/ui/button";
import { Input } from "@/features/shared/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/features/shared/components/ui/card";
import { ScrollArea } from "@/features/shared/components/ui/scroll-area";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContexts"; // ✅ Import useAuth
import { useMutation, useQueryClient } from "@tanstack/react-query"; // ✅ Import
import { handleCustomerSendMessage } from "@/features/inbox/api/inbox.api"; // ✅ Import
import { toast } from "sonner"; // ✅ Import

interface Message {
  text: string;
  sender: "user" | "bot" | "staff" | "customer"; // Mở rộng sender type
}

const ChatWindow = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth(); // Lấy thông tin user nếu đã đăng nhập
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessageMutation = useMutation({
    mutationFn: (text: string) => handleCustomerSendMessage(text, user?.id),
    onSuccess: () => {
      // Sau khi gửi thành công, làm mới lại danh sách hội thoại ở dashboard
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      toast.info("Tin nhắn của bạn đã được gửi tới nhân viên tư vấn.");
    },
    onError: (error) => {
      toast.error(`Gửi thất bại: ${error.message}`);
    },
  });

  const handleSend = () => {
    if (input.trim()) {
      // Thêm tin nhắn vào UI ngay lập tức để có trải nghiệm tốt hơn
      setMessages([...messages, { text: input, sender: "customer" }]);
      // Gọi mutation để gửi tin nhắn lên server
      sendMessageMutation.mutate(input.trim());
      setInput("");
    }
  };

  const handleRequestAgent = () => {
    setMessages((prev) => [
      ...prev,
      {
        text: "Yêu cầu của bạn đã được gửi đến nhân viên tư vấn. Vui lòng chờ trong giây lát.",
        sender: "bot",
      },
    ]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="w-80 h-96 mb-4"
    >
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>Hỗ trợ trực tuyến</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
          <ScrollArea className="h-full pr-4">
            <div className="flex flex-col gap-3">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === "customer" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-lg px-3 py-2 ${
                      msg.sender === "customer"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <div className="p-2 border-t">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleRequestAgent}
          >
            <User className="mr-2 h-4 w-4" /> Gặp nhân viên tư vấn
          </Button>
        </div>
        <CardFooter>
          <div className="flex w-full items-center space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Nhập tin nhắn..."
              disabled={sendMessageMutation.isPending}
            />
            <Button
              onClick={handleSend}
              type="submit"
              size="icon"
              disabled={sendMessageMutation.isPending}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ChatWindow;
