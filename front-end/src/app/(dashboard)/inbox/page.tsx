// src/app/(dashboard)/inbox/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Conversation } from "@/features/inbox/types";
import { getConversations } from "@/features/inbox/api/inbox.api";
import ConversationList from "@/features/inbox/components/ConversationList";
import ChatPanel from "@/features/inbox/components/ChatPanel";
import { cn } from "@/lib/utils";

const InboxPage = () => {
  const { data: conversations = [], isLoading } = useQuery<Conversation[]>({
    queryKey: ["conversations"],
    queryFn: getConversations,
  });

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  //Tự động chọn cuộc hội thoại đầu tiên sau khi tải xong
  useEffect(() => {
    if (!isLoading && conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0]);
    }
  }, [isLoading, conversations]);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  if (isLoading) {
    return <div className="p-8">Đang tải hộp thư...</div>;
  }

  return (
    <div className="flex h-full overflow-hidden">
      <div
        className={cn("w-full md:w-80 border-r", {
          "hidden md:block": selectedConversation,
        })}
      >
        <ConversationList
          conversations={conversations}
          onSelectConversation={handleSelectConversation}
          selectedConversationId={selectedConversation?.id}
        />
      </div>
      <div
        className={cn("flex-1 h-full", {
          "hidden md:flex": !selectedConversation,
        })}
      >
        <ChatPanel
          conversation={selectedConversation}
          onBack={() => setSelectedConversation(null)}
        />
      </div>
    </div>
  );
};

export default InboxPage;
