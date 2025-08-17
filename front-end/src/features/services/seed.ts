export type Service = {
  id: string;
  name: string;
  durationMin: number;
  price: number;
};
export const SERVICES: Service[] = [
  { id: "svc-basic", name: "Facial Basic", durationMin: 60, price: 300_000 },
  { id: "svc-deep", name: "Deep Cleaning", durationMin: 75, price: 450_000 },
  { id: "svc-mask", name: "Hydrating Mask", durationMin: 45, price: 250_000 },
];
