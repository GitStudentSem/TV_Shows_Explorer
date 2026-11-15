import { request } from "./client";

export interface Health {
  status: "ok";
}

export function fetchHealth(signal: AbortSignal): Promise<Health> {
  return request<Health>("/api/health", { signal });
}
