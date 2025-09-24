// src/features/prepaid-card/components/TransactionHistory.tsx
"use client";

import { PrepaidCardTransaction } from "@/features/prepaid-card/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/features/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/features/shared/components/ui/table";
import { Badge } from "@/features/shared/components/ui/badge";
import { cn } from "@/lib/utils";

interface TransactionHistoryProps {
  transactions: PrepaidCardTransaction[];
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

export default function TransactionHistory({
  transactions,
}: TransactionHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lịch sử giao dịch</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ngày</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead className="text-right">Số tiền</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length > 0 ? (
              transactions
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                ) // Sắp xếp giao dịch mới nhất lên đầu
                .map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      {new Date(tx.createdAt).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          tx.type === "deposit" ? "default" : "secondary"
                        }
                      >
                        {tx.type === "deposit" ? "Nạp tiền" : "Thanh toán"}
                      </Badge>
                    </TableCell>
                    <TableCell>{tx.description}</TableCell>
                    <TableCell
                      className={cn("text-right font-medium", {
                        "text-success": tx.type === "deposit",
                        "text-destructive": tx.type === "payment",
                      })}
                    >
                      {tx.type === "deposit" ? "+" : ""}
                      {formatCurrency(tx.amount)}
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Chưa có giao dịch nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
