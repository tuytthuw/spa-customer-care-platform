// src/features/inbox/components/ConversationList.tsx
import { Conversation } from "@/features/inbox/types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/features/shared/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "@/features/customer/api/customer.api";
import { FullCustomerProfile } from "@/features/customer/types";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId?: string | null;
  onSelectConversation: (conversation: Conversation) => void;
}

const ConversationList = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
}: ConversationListProps) => {
  const { data: customers = [] } = useQuery<FullCustomerProfile[]>({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  return (
    <aside className="w-full md:w-80 border-r flex flex-col h-full bg-card">
      <div className="p-4 border-b flex-shrink-0">
        <h2 className="text-xl font-bold">Hộp thư</h2>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul>
          {conversations.map((conv) => {
            const customer = customers.find((c) => c.id === conv.customerId);
            const isSelected = conv.id === selectedConversationId;
            return (
              <li key={conv.id}>
                <button
                  onClick={() => onSelectConversation(conv)}
                  className={cn(
                    "w-full text-left p-4 hover:bg-muted/50 flex items-start gap-4",
                    { "bg-muted": isSelected }
                  )}
                >
                  <Avatar>
                    <AvatarImage
                      src={
                        customer?.avatar ||
                        `https://api.dicebear.com/7.x/notionists/svg?seed=${customer?.id}`
                      }
                    />
                    <AvatarFallback>{customer?.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold truncate">
                        {customer?.name || "Khách hàng"}
                      </h3>
                      {!conv.isRead && (
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                      )}
                    </div>
                    <p
                      className={cn("text-sm text-muted-foreground truncate", {
                        "font-bold text-foreground": !conv.isRead,
                      })}
                    >
                      {conv.lastMessage}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default ConversationList;
