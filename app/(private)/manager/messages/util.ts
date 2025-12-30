export interface Message {
  id: string;
  senderRole: "admin" | "manager";
  senderName: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export const mapNotificationsToMessages = (
  notifications: any[],
  managerId: string
): Message[] => {
  return notifications?.map((n) => ({
    id: n.id,
    senderRole: n.senderAdminId === managerId ? "manager" : "admin",
    senderName: n.senderAdminId === managerId ? "You" : "System Administrator",
    message: n.message,
    timestamp: new Date(n.createdAt).toLocaleString(),
    isRead: n.isRead,
  }));
};
