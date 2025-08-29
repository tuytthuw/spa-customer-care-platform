"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TreatmentPlan } from "@/types/treatmentPlan";
import { getCustomers, FullCustomerProfile } from "@/services/customerService";
import { getTreatmentPlans } from "@/services/treatmentPlanService";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { TreatmentPackage } from "@/types/treatment"; // Import type này

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandGroup,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NewTreatmentPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null
  );
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [openCustomerSearch, setOpenCustomerSearch] = useState(false);

  const { data: customers = [], isLoading: loadingCustomers } = useQuery<
    FullCustomerProfile[]
  >({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });

  const { data: treatmentPlans = [], isLoading: loadingPlans } = useQuery<
    TreatmentPlan[]
  >({
    queryKey: ["treatmentPlans"],
    queryFn: getTreatmentPlans,
  });

  const addCustomerTreatmentMutation = useMutation({
    // Định nghĩa kiểu dữ liệu cho biến newPackage
    mutationFn: (
      newPackage: Omit<TreatmentPackage, "serviceId"> & { serviceId?: string }
    ) =>
      fetch("http://localhost:3001/customerTreatments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPackage),
      }).then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customerTreatments"] });
      toast.success("Bán liệu trình thành công!");
      router.push(`/customers/${selectedCustomerId}`);
    },
    onError: (error) => {
      toast.error(`Đã xảy ra lỗi: ${error.message}`);
    },
  });

  const handleConfirmSale = () => {
    if (!selectedCustomerId || !selectedPlanId) {
      toast.error("Vui lòng chọn khách hàng và liệu trình.");
      return;
    }

    const customer = customers.find((c) => c.id === selectedCustomerId);
    const plan = treatmentPlans.find((p) => p.id === selectedPlanId);

    if (!customer || !plan) {
      toast.error("Không tìm thấy thông tin khách hàng hoặc liệu trình.");
      return;
    }

    const newPackage: Omit<TreatmentPackage, "serviceId"> & {
      serviceId?: string;
    } = {
      id: `ct-${uuidv4()}`,
      customerId: customer.id,
      treatmentPlanId: plan.id,
      purchaseDate: new Date().toISOString(),
      totalSessions: plan.totalSessions,
      completedSessions: 0,
      sessions: Array.from({ length: plan.totalSessions }).map((_, i) => ({
        id: `cts-${uuidv4()}`,
        date: "",
        technicianId: "",
        status: "upcoming",
        notes: `Buổi ${i + 1}`,
      })),
    };
    if (plan.serviceIds && plan.serviceIds.length > 0) {
      newPackage.serviceId = plan.serviceIds[0];
    }

    addCustomerTreatmentMutation.mutate(newPackage);
  };

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);
  const selectedPlan = treatmentPlans.find((p) => p.id === selectedPlanId);

  // Sử dụng các biến loading
  if (loadingCustomers || loadingPlans) {
    return <div className="p-8">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Bán Liệu Trình Mới</CardTitle>
          <CardDescription>
            Chọn khách hàng và gói liệu trình để tạo hóa đơn mới.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="font-medium">Khách hàng</label>
            <Popover
              open={openCustomerSearch}
              onOpenChange={setOpenCustomerSearch}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    !selectedCustomer && "text-muted-foreground"
                  )}
                >
                  {selectedCustomer
                    ? selectedCustomer.name
                    : "Chọn khách hàng..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput placeholder="Tìm khách hàng..." />
                  <CommandList>
                    <CommandEmpty>Không tìm thấy.</CommandEmpty>
                    <CommandGroup>
                      {customers.map((customer) => (
                        <CommandItem
                          value={customer.name}
                          key={customer.id}
                          onSelect={() => {
                            setSelectedCustomerId(customer.id);
                            setOpenCustomerSearch(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              customer.id === selectedCustomerId
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {customer.name} - {customer.phone}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="font-medium">Liệu trình</label>
            <Select onValueChange={setSelectedPlanId}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn một liệu trình..." />
              </SelectTrigger>
              <SelectContent>
                {treatmentPlans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name} -{" "}
                    {new Intl.NumberFormat("vi-VN").format(plan.price)} VNĐ
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedPlan && (
            <div className="p-4 bg-muted rounded-lg border">
              <p className="font-semibold">{selectedPlan.name}</p>
              <p className="text-sm text-muted-foreground">
                Tổng số buổi: {selectedPlan.totalSessions}
              </p>
              <p className="text-lg font-bold mt-2">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(selectedPlan.price)}
              </p>
            </div>
          )}

          <Button
            onClick={handleConfirmSale}
            disabled={
              !selectedCustomerId ||
              !selectedPlanId ||
              addCustomerTreatmentMutation.isPending
            }
            className="w-full"
          >
            {addCustomerTreatmentMutation.isPending
              ? "Đang xử lý..."
              : "Xác nhận & Thanh toán"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
