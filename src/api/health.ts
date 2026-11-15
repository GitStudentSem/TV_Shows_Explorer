import { request } from "./client";

export interface Health {
  status: "ok";
}

export function fetchHealth(): Promise<Health> {
  return request<Health>("/api/health");
}
