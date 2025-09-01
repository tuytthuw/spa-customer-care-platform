import { Conversation } from "@/features/inbox/types";
// **XÓA BỎ mockCustomers**
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query"; // **MỚI**
import { getCustomers } from "@/features/customer/api/customer.api"; // **MỚI**
import { FullCustomerProfile } from "@/features/customer/types"; // **MỚI**

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
  // **MỚI: Fetch danh sách khách hàng để lấy tên và avatar**
  const { data: customers = [] } = useQuery<FullCustomerProfile[]>({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  return (
    <aside className="w-80 border-r overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xl font-bold">Hộp thư</h2>
      </div>
      <nav>
        <ul>
          {conversations.map((conv) => {
            // **THAY ĐỔI: Tìm khách hàng từ dữ liệu API**
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
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">
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
