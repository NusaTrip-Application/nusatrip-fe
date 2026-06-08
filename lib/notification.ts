type NotificationType = "success" | "error" | "info";

interface NotificationEvent {
  message: string;
  type: NotificationType;
}

type Listener = (event: NotificationEvent) => void;
let listeners: Listener[] = [];

export const notification = {
  subscribe: (listener: Listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
  show: (message: string, type: NotificationType = "info") => {
    listeners.forEach(l => l({ message, type }));
  },
  success: (message: string) => notification.show(message, "success"),
  error: (message: string) => notification.show(message, "error"),
  info: (message: string) => notification.show(message, "info"),
};
