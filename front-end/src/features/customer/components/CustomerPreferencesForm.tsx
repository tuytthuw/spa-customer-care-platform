"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Customer, FullCustomerProfile } from "@/features/customer/types";
import { Staff } from "@/features/staff/types";
import { updateCustomerProfile } from "@/features/customer/api/customer.api";

import { Button } from "@/features/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/features/shared/components/ui/form";
import { Textarea } from "@/features/shared/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/features/shared/components/ui/command";
import { Badge } from "@/features/shared/components/ui/badge";
import { X } from "lucide-react";

// Schema validation
const preferencesSchema = z.object({
  allergies: z.string().optional(),
  serviceNotes: z.string().optional(),
  favoriteTechnicianIds: z.array(z.string()).optional(),
});
type PreferencesFormValues = z.infer<typeof preferencesSchema>;

interface CustomerPreferencesFormProps {
  customer: FullCustomerProfile;
  technicians: Staff[];
}

export default function CustomerPreferencesForm({
  customer,
  technicians,
}: CustomerPreferencesFormProps) {
  const queryClient = useQueryClient();
  const form = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      allergies: customer.preferences?.allergies || "",
      serviceNotes: customer.preferences?.serviceNotes || "",
      favoriteTechnicianIds: customer.preferences?.favoriteTechnicianIds || [],
    },
  });

  const mutation = useMutation({
    mutationFn: (data: {
      customerId: string;
      preferences: PreferencesFormValues;
    }) =>
      updateCustomerProfile(data.customerId, { preferences: data.preferences }),
    onSuccess: () => {
      toast.success("Cập nhật tùy chọn cá nhân thành công!");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (error) => {
      toast.error(`Cập nhật thất bại: ${error.message}`);
    },
  });

  const onSubmit = (data: PreferencesFormValues) => {
    mutation.mutate({ customerId: customer.id, preferences: data });
  };

  const selectedTechs =
    form
      .watch("favoriteTechnicianIds")
      ?.map((id) => technicians.find((t) => t.id === id)) || [];

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Tùy chọn Cá nhân</CardTitle>
        <CardDescription>
          Thông tin này sẽ giúp chúng tôi phục vụ bạn tốt hơn. Chỉ nhân viên cần
          biết mới có thể xem được.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="allergies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dị ứng</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="VD: Dị ứng phấn hoa, tinh dầu bạc hà..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="serviceNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sở thích & Yêu cầu đặc biệt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="VD: Thích massage lực mạnh, không thích nhạc quá lớn..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="favoriteTechnicianIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kỹ thuật viên yêu thích</FormLabel>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedTechs.map((tech) =>
                      tech ? (
                        <Badge key={tech.id} variant="secondary">
                          {tech.name}
                          <button
                            type="button"
                            className="ml-2"
                            onClick={() =>
                              field.onChange(
                                field.value?.filter((id) => id !== tech.id)
                              )
                            }
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ) : null
                    )}
                  </div>
                  <Command className="rounded-lg border shadow-md">
                    <CommandInput placeholder="Tìm kiếm kỹ thuật viên..." />
                    <CommandList>
                      <CommandEmpty>Không tìm thấy.</CommandEmpty>
                      <CommandGroup>
                        {technicians.map((tech) => (
                          <CommandItem
                            key={tech.id}
                            onSelect={() => {
                              const currentIds = field.value || [];
                              if (!currentIds.includes(tech.id)) {
                                field.onChange([...currentIds, tech.id]);
                              }
                            }}
                          >
                            {tech.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Đang lưu..." : "Lưu Tùy chọn"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
