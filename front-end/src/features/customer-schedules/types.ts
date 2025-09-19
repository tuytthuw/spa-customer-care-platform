import { Appointment } from "@/features/appointment/types";
import {
  FullCustomerProfile,
  PurchasedService,
} from "@/features/customer/types";
import { Review } from "@/features/review/types";
import { Service } from "@/features/service/types";
import { Staff } from "@/features/staff/types";
import { TreatmentPackage, TreatmentPlan } from "@/features/treatment/types";

// Định nghĩa một kiểu dữ liệu chung cho tất cả dữ liệu được fetch ở trang schedule
export interface ScheduleDataProps {
  appointments: Appointment[];
  treatments: TreatmentPackage[];
  services: Service[];
  treatmentPlans: TreatmentPlan[];
  staff: Staff[];
  reviews: Review[];
  currentUserProfile: FullCustomerProfile;
}

// Định nghĩa kiểu cho một item cần hành động trong ScheduleListView
export type ActionableItem =
  | { type: "service"; data: PurchasedService }
  | { type: "treatment"; data: TreatmentPackage };
