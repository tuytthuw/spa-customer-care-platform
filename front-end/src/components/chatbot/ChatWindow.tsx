"use client";

import { motion } from "framer-motion";
import { Send, User } from "lucide-react"; // Import icon User
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Separator } from "@/components/ui/separator"; // Import Separator

interface Message {
  text: string;
  sender: "user" | "bot";
}

const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text: "Cảm ơn bạn đã liên hệ. Chúng tôi sẽ trả lời sớm nhất có thể.",
            sender: "bot",
          },
        ]);
      }, 1000);
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
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-lg px-3 py-2 ${
                      msg.sender === "user"
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
        {/* Thêm nút gặp nhân viên */}
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
            />
            <Button onClick={handleSend} type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ChatWindow;
