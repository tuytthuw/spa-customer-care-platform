"use client";

import * as React from "react";
import FullCalendar from "@fullcalendar/react";
import { CalendarOptions } from "@fullcalendar/core";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import interactionPlugin from "@fullcalendar/interaction";
import { cn } from "@/lib/utils";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";

export interface FullCalendarUIProps extends CalendarOptions {
  className?: string;
}

const FullCalendarUI = React.forwardRef<FullCalendar, FullCalendarUIProps>(
  ({ className, ...props }, ref) => {
    return (
      <>
        <div className={cn("h-full w-full", className)}>
          <FullCalendar
            ref={ref}
            plugins={[
              resourceTimelinePlugin,
              timeGridPlugin,
              interactionPlugin,
              dayGridPlugin,
            ]}
            schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
            height="100%"
            locale="vi"
            buttonText={{
              today: "Hôm nay",
              day: "Ngày",
              week: "Tuần",
              month: "Tháng", // Thêm text cho các nút khác
            }}
            editable={true}
            droppable={true}
            {...props}
          />
        </div>

        {/* --- CSS GHI ĐÈ TOÀN DIỆN --- */}
        <style jsx global>{`
          /* --- Biến màu gốc của FullCalendar được gán lại bằng biến màu của chúng ta --- */
          .fc {
            --fc-border-color: hsl(var(--border));
            --fc-daygrid-event-dot-width: 8px;
            --fc-list-event-dot-width: 10px;
            --fc-event-text-color: hsl(var(--foreground));
            --fc-event-bg-color: hsl(var(--primary));
            --fc-event-border-color: hsl(var(--primary));
            --fc-button-bg-color: hsl(var(--primary));
            --fc-button-text-color: hsl(var(--primary-foreground));
            --fc-button-border-color: hsl(var(--primary));
            --fc-button-hover-bg-color: hsl(var(--primary) / 0.9);
            --fc-button-hover-border-color: hsl(var(--primary) / 0.9);
            --fc-button-active-bg-color: hsl(var(--primary) / 0.9);
            --fc-button-active-border-color: hsl(var(--primary) / 0.9);
            --fc-today-bg-color: hsl(var(--accent));
          }

          /* --- Tùy chỉnh các nút bấm --- */
          .fc .fc-button {
            border-radius: var(--radius-md);
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
            font-weight: 500;
            transition: background-color 0.2s;
          }
          .fc .fc-button-primary:not(:disabled).fc-button-active,
          .fc .fc-button-primary:not(:disabled):active {
            background-color: var(--primary);
            border-color: var(--primary);
          }
          .fc .fc-button-group > .fc-button {
            border-radius: 0;
          }
          .fc .fc-button-group > .fc-button:first-child {
            border-top-left-radius: var(--radius-md);
            border-bottom-left-radius: var(--radius-md);
          }
          .fc .fc-button-group > .fc-button:last-child {
            border-top-right-radius: var(--radius-md);
            border-bottom-right-radius: var(--radius-md);
          }

          /* --- Tùy chỉnh tiêu đề (Tên tháng/năm) --- */
          .fc .fc-toolbar-title {
            color: var(--foreground);
            font-size: 1.25rem;
            font-weight: 600;
          }

          /* --- Màu sắc cho các sự kiện dựa trên className --- */
          .fc-event.fc-event-technician {
            background-color: hsl(var(--chart-1) / 0.2) !important;
            border-color: hsl(var(--chart-1)) !important;
          }
          .fc-event.fc-event-room {
            background-color: hsl(var(--chart-2) / 0.2) !important;
            border-color: hsl(var(--chart-2)) !important;
          }
          .fc-event.fc-event-equipment {
            background-color: hsl(var(--chart-3) / 0.2) !important;
            border-color: hsl(var(--chart-3)) !important;
          }
          .fc-event .fc-event-title {
            color: hsl(var(--foreground));
            font-weight: 500;
          }

          /* --- Các thành phần khác --- */
          .fc .fc-resource-area-cushion {
            /* Cột tên tài nguyên */
            font-weight: 600;
            color: var(--foreground);
            padding: 0.75rem;
          }
          .fc-theme-standard .fc-list-day-cushion {
            /* Nền của ngày trong chế độ list */
            background-color: var(--muted);
          }

          /* --- Tùy chỉnh giao diện TimeGrid --- */
          .fc-timegrid-event-harness {
            margin-right: 4px; /* Tạo khoảng hở giữa các event */
          }
          .fc-timegrid-event {
            border-radius: var(--radius-sm);
            padding: 4px 6px;
          }
        `}</style>
      </>
    );
  }
);
FullCalendarUI.displayName = "FullCalendarUI";

export { FullCalendarUI };
