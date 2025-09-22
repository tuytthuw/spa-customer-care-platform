// src/features/inbox/components/ChatPanel.tsx

import { Conversation } from "@/features/inbox/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, ArrowLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage } from "@/features/inbox/api/inbox.api";
import { useState } from "react";
import { useCustomers } from "@/features/customer/hooks/useCustomers";

interface ChatPanelProps {
  conversation: Conversation | null;
  onBack: () => void;
}

const ChatPanel = ({ conversation, onBack }: ChatPanelProps) => {
  const queryClient = useQueryClient();
  const [input, setInput] = useState("");

  const { data: customers = [] } = useCustomers();

  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      setInput("");
    },
    onError: (error) => {
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

  const customer = customers.find((c) => c.id === conversation.customerId);

  return (
    <div className="flex-1 flex flex-col h-full">
      <header className="p-4 border-b flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Avatar>
          <AvatarImage
            src={
              customer?.avatar ||
              `https://api.dicebear.com/7.x/notionists/svg?seed=${customer?.id}`
            }
          />
          <AvatarFallback>{customer?.name?.[0]}</AvatarFallback>
        </Avatar>
        <h3 className="font-semibold">{customer?.name || "Khách vãng lai"}</h3>
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
          <Input
            placeholder="Nhập tin nhắn..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={sendMessageMutation.isPending}
          />
          <Button onClick={handleSend} disabled={sendMessageMutation.isPending}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default ChatPanel;
