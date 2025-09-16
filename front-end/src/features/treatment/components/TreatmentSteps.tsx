// src/features/treatment/components/TreatmentSteps.tsx
"use client";

import { TreatmentPlan } from "@/features/treatment/types";
import { Service } from "@/features/service/types";
import { CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link"; // Import Link

interface TreatmentStepsProps {
  plan: TreatmentPlan;
  allServices: Service[];
}

export default function TreatmentSteps({
  plan,
  allServices,
}: TreatmentStepsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quy trình</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6 after:absolute after:inset-y-0 after:w-px after:bg-border after:left-0">
          {plan.steps.map((step) => {
            const stepServices = step.serviceIds
              .map((id) => allServices.find((s) => s.id === id))
              .filter((s): s is Service => !!s);

            return (
              <div
                key={step.step}
                className="grid grid-cols-[auto_1fr] gap-x-6 items-start mb-8"
              >
                <div className="flex items-center justify-center -ml-1">
                  <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg ring-8 ring-background">
                    {step.step}
                  </div>
                </div>
                <div className="pt-1.5">
                  <h3 className="text-xl font-semibold">Buổi {step.step}</h3>
                  <div className="mt-2 space-y-3">
                    {stepServices.length > 0 ? (
                      stepServices.map((service) => (
                        <Link
                          key={service.id}
                          href={`/services/${service.id}`}
                          passHref
                        >
                          <div className="p-3 bg-card rounded-md border flex items-center cursor-pointer hover:bg-muted/50 transition-colors">
                            <CheckCircle className="w-4 h-4 mr-3 text-accent" />
                            <span>
                              {service.name} ({service.duration} phút)
                            </span>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <p className="text-muted-foreground">
                        Chưa có dịch vụ cho buổi này.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
