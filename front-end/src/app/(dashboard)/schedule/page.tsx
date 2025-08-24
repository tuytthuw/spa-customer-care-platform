"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { mockAppointments as initialAppointments } from "@/lib/mock-data";
import { Appointment } from "@/types/appointment";
import { AppointmentDetailsModal } from "@/features/schedule/AppointmentDetailsModal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RegisterScheduleModal } from "@/features/schedule/RegisterScheduleModal";

export default function SchedulePage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] =
    useState<Appointment[]>(initialAppointments);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false); // State for registration modal

  // Filter appointments for the selected date and technician
  const technicianId = "tech-1"; // Assuming this is the logged-in technician
  const dailyAppointments = appointments.filter((app) => {
    const appDate = new Date(app.date);
    const selectedDate = date || new Date();
    return (
      app.technicianId === technicianId &&
      appDate.toDateString() === selectedDate.toDateString()
    );
  });

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsModalOpen(true);
  };

  // Handler for updating appointment notes and status
  const handleUpdateAppointment = (
    id: string,
    notes: string,
    status: "completed"
  ) => {
    console.log(
      `Updating appointment ${id} with notes: "${notes}" and status: ${status}`
    );
    setAppointments((current) =>
      current.map((app) =>
        app.id === id ? { ...app, technicianNotes: notes, status: status } : app
      )
    );
  };

  // Handler for saving the registered schedule
  const handleSaveSchedule = (scheduleData: any) => {
    console.log("Saving schedule registration:", {
      staffId: technicianId,
      status: "pending",
      ...scheduleData,
    });
    // In a real app, you would call an API to save this request
  };

  return (
    <>
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        {/* Header with the new registration button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold tracking-tight">Lịch làm việc</h2>
          <Button onClick={() => setIsRegisterModalOpen(true)}>
            Đăng ký lịch tuần tới
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="p-3"
                />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">
              Lịch hẹn ngày {date ? date.toLocaleDateString("vi-VN") : ""}
            </h2>
            <div className="space-y-4">
              {dailyAppointments.length > 0 ? (
                dailyAppointments.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => handleAppointmentClick(app)}
                    className="w-full text-left"
                  >
                    <Card className="hover:bg-muted/50 transition-colors">
                      <CardContent className="p-4">
                        <p className="font-semibold">10:00 - Chăm sóc da</p>
                        <p className="text-sm text-muted-foreground">
                          Khách hàng: Nguyễn Thị A
                        </p>
                      </CardContent>
                    </Card>
                  </button>
                ))
              ) : (
                <p>Không có lịch hẹn nào trong ngày này.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals are kept outside the main layout grid for better stacking context */}
      <AppointmentDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        appointment={selectedAppointment}
        onUpdateAppointment={handleUpdateAppointment}
      />
      <RegisterScheduleModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSave={handleSaveSchedule}
      />
    </>
  );
}
