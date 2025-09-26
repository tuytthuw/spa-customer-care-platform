import { WorkSchedule } from "../types";

// Giả sử json-server của bạn đang chạy ở port 3001
const API_URL = "http://localhost:3001";

/**
 * Lấy tất cả lịch làm việc từ mock API
 */
export const getWorkSchedules = async (): Promise<WorkSchedule[]> => {
  try {
    const response = await fetch(`${API_URL}/workSchedules`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch work schedules:", error);
    return []; // Trả về mảng rỗng nếu có lỗi
  }
};

/**
 * Cập nhật trạng thái của một yêu cầu duyệt lịch
 * (Trong thực tế, bạn sẽ gửi yêu cầu PATCH/PUT đến server)
 */
export const updateScheduleStatus = async (
  staffId: string,
  weekOf: string,
  status: "approved" | "rejected"
): Promise<{ success: boolean }> => {
  console.log(
    `UPDATING MOCK API: Staff: ${staffId}, Week: ${weekOf}, Status: ${status}`
  );
  // Do json-server không hỗ trợ update trực tiếp với composite key,
  // chúng ta chỉ giả lập rằng việc cập nhật thành công.
  // React Query sẽ tự động gọi lại getWorkSchedules để làm mới UI.
  await new Promise((resolve) => setTimeout(resolve, 500)); // Giả lập độ trễ mạng
  return { success: true };
};
