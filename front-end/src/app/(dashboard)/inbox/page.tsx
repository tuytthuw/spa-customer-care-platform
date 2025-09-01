"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Conversation } from "@/features/inbox/types";
import { getConversations } from "@/features/inbox/api/inbox.api";
import ConversationList from "@/features/inbox/components/ConversationList";
import ChatPanel from "@/features/inbox/components/ChatPanel";

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
  }, [isLoading, conversations, selectedConversation]);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    // Logic đánh dấu đã đọc sẽ được xử lý ở phía server trong tương lai
  };

  if (isLoading) {
    return <div className="p-8">Đang tải hộp thư...</div>;
  }

  return (
    <div className="flex h-full border-t">
      <ConversationList
        conversations={conversations}
        onSelectConversation={handleSelectConversation}
        selectedConversationId={selectedConversation?.id}
      />
      <ChatPanel conversation={selectedConversation} />
    </div>
  );
};

export default InboxPage;
