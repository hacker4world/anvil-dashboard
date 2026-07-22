import { apiClient } from "./axios.client";



export async function fetchAllNotifications() {
  return apiClient.post("/notifications/list");
}
