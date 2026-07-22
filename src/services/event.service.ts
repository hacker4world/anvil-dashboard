import { apiClient } from "./axios.client";

const BASE_PATH = "/custom-events";

export async function createCustomEvent(data: {
  name: string;
  description: string;
  date: string; // ISO string
}) {
  const response = await apiClient.post(BASE_PATH, data);
  return response.data;
}
