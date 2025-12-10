import Notification from '../models/Notification.js';

export const resolvers = {
  Query: {
    async getNotifications(_, { userId, limit = 50, offset = 0 }) {
      try {
        const notifications = await Notification.find({ userId })
          .sort({ createdAt: -1 })
          .skip(offset)
          .limit(limit);

        const total = await Notification.countDocuments({ userId });

        return {
          notifications,
          total,
          hasMore: total > offset + notifications.length
        };
      } catch (error) {
        console.error('❌ Error fetching notifications:', error);
        throw new Error(`Failed to fetch notifications: ${error.message}`);
      }
    },

    async getNotification(_, { id }) {
      try {
        const notification = await Notification.findById(id);
        if (!notification) {
          throw new Error('Notification not found');
        }
        return notification;
      } catch (error) {
        console.error('❌ Error fetching notification:', error);
        throw new Error(`Failed to fetch notification: ${error.message}`);
      }
    },

    async getUnreadCount(_, { userId }) {
      try {
        const unreadCount = await Notification.countDocuments({
          userId,
          read: false
        });

        return { unreadCount };
      } catch (error) {
        console.error('❌ Error getting unread count:', error);
        throw new Error(`Failed to get unread count: ${error.message}`);
      }
    }
  },

  Mutation: {
    async createNotification(_, { userId, type, title, message, data }) {
      try {
        const notificationData = {
          userId,
          type,
          title,
          message,
          read: false
        };

        // Parse data if it's a JSON string
        if (data) {
          try {
            notificationData.data = typeof data === 'string' ? JSON.parse(data) : data;
          } catch (e) {
            notificationData.data = { raw: data };
          }
        }

        const notification = new Notification(notificationData);
        await notification.save();

        console.log(`📨 Notification created: ${notification.id} for user ${userId}`);
        return notification;
      } catch (error) {
        console.error('❌ Error creating notification:', error);
        throw new Error(`Failed to create notification: ${error.message}`);
      }
    },

    async markAsRead(_, { id, userId }) {
      try {
        const notification = await Notification.findOneAndUpdate(
          { _id: id, userId },
          { read: true },
          { new: true }
        );

        if (!notification) {
          throw new Error('Notification not found');
        }

        console.log(`✅ Notification marked as read: ${id}`);
        return notification;
      } catch (error) {
        console.error('❌ Error marking notification as read:', error);
        throw new Error(`Failed to mark notification as read: ${error.message}`);
      }
    },

    async markAllAsRead(_, { userId }) {
      try {
        const result = await Notification.updateMany(
          { userId, read: false },
          { read: true }
        );

        console.log(`✅ Marked ${result.modifiedCount} notifications as read for user ${userId}`);

        return {
          success: true,
          modifiedCount: result.modifiedCount
        };
      } catch (error) {
        console.error('❌ Error marking all notifications as read:', error);
        throw new Error(`Failed to mark all notifications as read: ${error.message}`);
      }
    },

    async deleteNotification(_, { id, userId }) {
      try {
        const result = await Notification.findOneAndDelete({ _id: id, userId });

        if (!result) {
          throw new Error('Notification not found');
        }

        console.log(`🗑️ Notification deleted: ${id}`);
        return true;
      } catch (error) {
        console.error('❌ Error deleting notification:', error);
        throw new Error(`Failed to delete notification: ${error.message}`);
      }
    }
  }
};
