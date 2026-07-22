import { fetchAllNotifications } from "@/services/notifications.service";
import { useEffect, useState } from "react";

export enum NotificationType {
  ALL = "all",
  NEW_ACCOUNT = "new-account",
  NEW_IMPORT = "new-import",
  NEW_EXPORT = "new-export",
  NEW_REQUEST = "new-request",
  NEW_RETURN = "new-return",
  STOCK_ALERT = "stock-alert",
}

export interface Notification {
  id: number;
  date: string;
  message: string;
  type: NotificationType;
}

export const notificationTypes = [
  {
    value: "all",
    label: "Tous",
  },
  {
    value: "new-account",
    label: "Nouveau compte",
  },
  {
    value: "new-import",
    label: "Nouvelle Entrée",
  },
  {
    value: "new-export",
    label: "Nouvelle Sortie",
  },
  {
    value: "new-request",
    label: "Demandes d'articles",
  },
  {
    value: "new-return",
    label: "Retours d'articles",
  },
  {
    value: "stock-alert",
    label: "Alertes du stock",
  },
];

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<
    Notification[]
  >([]);
  const [activeFilter, setActiveFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAllNotifications().then((response) => {
      setNotifications(response.data.data.items);
      setFilteredNotifications(response.data.data.items);
    });
  }, []);

  useEffect(() => {
    if (activeFilter === "all") setFilteredNotifications([...notifications]);
    else {
      setFilteredNotifications(
        notifications.filter((n) => n.type === activeFilter),
      );
    }
  }, [activeFilter]);

  return {
    notifications,
    filteredNotifications,
    setFilteredNotifications,
    activeFilter,
    setActiveFilter,
    isLoading,
    setIsLoading,
  };
}
