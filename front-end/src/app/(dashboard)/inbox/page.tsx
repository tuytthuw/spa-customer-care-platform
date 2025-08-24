"use client";

import { useState } from "react";
import { mockConversations } from "@/lib/mock-data";
import { Conversation } from "@/types/conversation";
import ConversationList from "@/features/inbox/ConversationList";
import ChatPanel from "@/features/inbox/ChatPanel";

const InboxPage = () => {
  const [conversations, setConversations] =
    useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(conversations[0] || null);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    // Đánh dấu là đã đọc
    setConversations((convs) =>
      convs.map((c) => (c.id === conversation.id ? { ...c, isRead: true } : c))
    );
  };

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
