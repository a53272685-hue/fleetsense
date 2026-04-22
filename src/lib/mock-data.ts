/**
 * Mock data for FleetSense pages.
 * Replace with real API calls once backend is wired.
 */

export type Vehicle = {
  id: string;
  name: string;
  group: string;
  utilization: number;
  idleHours: number;
  lastActive: string;
};

export const mockVehicles: Vehicle[] = [
  {
    id: "V-001",
    name: "Truck 01",
    group: "Fleet A",
    utilization: 78,
    idleHours: 3.2,
    lastActive: "2026-04-17T09:14:00Z",
  },
  {
    id: "V-002",
    name: "Truck 02",
    group: "Fleet A",
    utilization: 62,
    idleHours: 5.8,
    lastActive: "2026-04-17T08:02:00Z",
  },
  {
    id: "V-003",
    name: "Van 14",
    group: "Fleet B",
    utilization: 91,
    idleHours: 1.1,
    lastActive: "2026-04-17T09:30:00Z",
  },
];

export type KpiPoint = { date: string; value: number };

export const utilizationTrend: KpiPoint[] = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(2026, 2, i + 1).toISOString().slice(0, 10),
  value: 60 + Math.round(Math.sin(i / 3) * 15 + Math.random() * 5),
}));
