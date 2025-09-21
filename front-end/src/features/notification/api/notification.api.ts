// src/features/notification/api/notification.api.ts
import { Appointment } from "@/features/appointment/types";
import { FullCustomerProfile } from "@/features/customer/types";
import { Service } from "@/features/service/types";

// Định nghĩa các loại email để dễ quản lý
type EmailType = "confirmation" | "reschedule" | "cancellation";

/**
 * Hàm giả lập gửi email.
 * Trong một ứng dụng thực tế, hàm này sẽ gọi đến backend API để gửi email thật.
 */
export const sendNotificationEmail = async (
  type: EmailType,
  appointment: Appointment,
  customer: FullCustomerProfile,
  service: Service
) => {
  const appointmentTime = new Date(appointment.date).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  let subject = "";
  let body = "";

  switch (type) {
    case "confirmation":
      subject = `[Serenity Spa] Xác nhận đặt lịch thành công!`;
      body = `
        Chào ${customer.name},

        Lịch hẹn của bạn cho dịch vụ "${
          service.name
        }" vào lúc ${appointmentTime} đã được xác nhận thành công.
        Mã đặt lịch của bạn là: #${appointment.id.slice(0, 8)}

        Cảm ơn bạn đã tin tưởng Serenity Spa.
      `;
      break;

    case "reschedule":
      subject = `[Serenity Spa] Lịch hẹn của bạn đã được thay đổi thành công!`;
      body = `
        Chào ${customer.name},

        Lịch hẹn của bạn cho dịch vực "${service.name}" đã được dời thành công sang thời gian mới:
        **${appointmentTime}**

        Vui lòng kiểm tra lại thông tin. Hẹn gặp lại bạn!
      `;
      break;

    case "cancellation":
      subject = `[Serenity Spa] Xác nhận hủy lịch hẹn`;
      body = `
        Chào ${customer.name},

        Chúng tôi xác nhận lịch hẹn của bạn cho dịch vụ "${service.name}" vào lúc ${appointmentTime} đã được hủy thành công.

        Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi.
        Cảm ơn bạn.
      `;
      break;
  }

  console.log("--- GỬI EMAIL GIẢ LẬP ---");
  console.log(`Đến: ${customer.email}`);
  console.log(`Chủ đề: ${subject}`);
  console.log(`Nội dung:${body}`);
  console.log("------------------------");

  // Giả lập một hành động bất đồng bộ
  await new Promise((resolve) => setTimeout(resolve, 500));
};
