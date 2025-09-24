"use client";

import { FullCustomerProfile } from "@/features/customer/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/features/shared/components/ui/card";
import Image from "next/image";
import { Button } from "@/features/shared/components/ui/button";
import { Textarea } from "@/features/shared/components/ui/textarea";
import { Separator } from "@/features/shared/components/ui/separator";
import { Phone, Mail, Calendar, Edit } from "lucide-react";
import Link from "next/link";

interface CustomerProfileCardProps {
  customer: FullCustomerProfile;
}

export function CustomerProfileCard({ customer }: CustomerProfileCardProps) {
  return (
    <Card>
      <CardHeader className="items-center text-center">
        <Image
          src={
            customer.avatar ||
            `https://api.dicebear.com/7.x/notionists/svg?seed=${customer.id}`
          }
          alt={customer.name}
          width={96}
          height={96}
          className="rounded-full mb-2"
        />
        <CardTitle className="text-2xl">{customer.name}</CardTitle>
        <CardDescription>Khách hàng thân thiết</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center">
            <Mail className="w-4 h-4 mr-3 text-muted-foreground" />
            <span>{customer.email || "Chưa có email"}</span>
          </div>
          <div className="flex items-center">
            <Phone className="w-4 h-4 mr-3 text-muted-foreground" />
            <span>{customer.phone}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-3 text-muted-foreground" />
            <span>
              Lần cuối đến:{" "}
              {new Date(customer.lastVisit).toLocaleDateString("vi-VN")}
            </span>
          </div>
        </div>
        <Separator className="my-4" />
        <div>
          <h4 className="font-semibold mb-2">Ghi chú</h4>
          <Textarea
            placeholder="Thêm ghi chú về khách hàng..."
            defaultValue={customer.notes}
          />
        </div>
        <Button className="w-full mt-4">
          <Edit className="w-4 h-4 mr-2" />
          Lưu thay đổi
        </Button>
      </CardContent>
    </Card>
  );
}
