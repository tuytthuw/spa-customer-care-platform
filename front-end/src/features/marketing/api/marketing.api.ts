"use server";

import { FullCustomerProfile } from "@/features/customer/types";

interface SendBulkEmailsData {
  recipients: FullCustomerProfile[];
  subject: string;
  content: string;
}

/**
 * Giả lập việc gửi email marketing hàng loạt.
 * Trong thực tế, hàm này sẽ gọi đến backend, và backend sẽ sử dụng một dịch vụ
 * email như SendGrid, Mailgun, hoặc AWS SES để gửi email thật.
 */
export const sendBulkEmails = async (
  data: SendBulkEmailsData
): Promise<{ success: string }> => {
  const { recipients, subject, content } = data;

  if (recipients.length === 0) {
    throw new Error("Không có khách hàng nào được chọn để gửi email.");
  }

  console.log("--- BẮT ĐẦU GỬI EMAIL MARKETING HÀNG LOẠT ---");
  console.log(`Tiêu đề: ${subject}`);
  console.log(`Nội dung: ${content}`);
  console.log(`Gửi đến ${recipients.length} khách hàng:`);
  recipients.forEach((customer) => {
    console.log(` - ${customer.name} <${customer.email}>`);
  });
  console.log("--- KẾT THÚC GỬI EMAIL ---");

  // Giả lập độ trễ mạng
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    success: `Đã gửi email thành công đến ${recipients.length} khách hàng.`,
  };
};
