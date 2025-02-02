'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from '@/components/ui/use-toast';

type Notification = {
  id: string;
  type: 'LESSON_BOOKED' | 'LESSON_CANCELLED' | 'PAYMENT_REQUIRED' | 'PAYMENT_VERIFIED' | 'SYSTEM';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  data?: Record<string, any>;
};

export function useNotifications() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/notifications');
      if (!response.ok) throw new Error('Failed to fetch notifications');

      const data = await response.json();
      setNotifications(data);
      setUnreadCount(data.filter((n: Notification) => !n.read).length);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchNotifications();
      // Set up WebSocket connection for real-time updates
      const ws = new WebSocket(
        `${process.env.NEXT_PUBLIC_WS_URL}/notifications?token=${session.token}`
      );

      ws.onmessage = (event) => {
        const notification = JSON.parse(event.data);
        handleNewNotification(notification);
      };

      return () => ws.close();
    }
  }, [session]);

  const handleNewNotification = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);

    // Show toast for new notification
    toast({
      title: notification.title,
      description: notification.message,
      action: notification.data?.action && {
        label: notification.data.action.label,
        onClick: () => handleNotificationAction(notification),
      },
    });
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to mark notification as read');

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update notification';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to mark notifications as read');

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
      setUnreadCount(0);

      toast({
        title: 'Success',
        description: 'All notifications marked as read',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update notifications';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
  };

  const handleNotificationAction = (notification: Notification) => {
    if (!notification.data?.action?.url) return;

    // Handle different types of actions
    switch (notification.type) {
      case 'LESSON_BOOKED':
      case 'LESSON_CANCELLED':
        window.location.href = `/schedule?date=${notification.data.date}`;
        break;
      case 'PAYMENT_REQUIRED':
        window.location.href = `/payments/${notification.data.paymentId}`;
        break;
      default:
        window.location.href = notification.data.action.url;
    }
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    handleNotificationAction,
  };
}