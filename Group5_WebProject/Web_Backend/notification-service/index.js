import express from 'express';
import { WebSocketServer } from 'ws';
import mongoose from 'mongoose';
import cors from 'cors';
import { config } from './config/config.js';
import Notification from './models/Notification.js';

const app = express();

// Connect to MongoDB
mongoose.connect(config.database.uri)
  .then(() => console.log('✅ Notification Service connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Middleware
app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials
}));
app.use(express.json());

// WebSocket server
const wss = new WebSocketServer({ port: config.wsPort });
const clients = new Map(); // userId -> WebSocket

wss.on('connection', (ws, req) => {
  console.log('🔌 New WebSocket connection');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'authenticate' && data.userId) {
        // Store connection with userId
        clients.set(data.userId, ws);
        console.log(`✅ User ${data.userId} connected via WebSocket`);
        
        // Send pending notifications
        sendPendingNotifications(data.userId, ws);
      }
      
      if (data.type === 'mark_read' && data.notificationId) {
        markNotificationAsRead(data.notificationId, data.userId);
      }
    } catch (error) {
      console.error('❌ WebSocket message error:', error);
    }
  });
  
  ws.on('close', () => {
    // Remove disconnected client
    for (const [userId, client] of clients.entries()) {
      if (client === ws) {
        clients.delete(userId);
        console.log(`🔻 User ${userId} disconnected from WebSocket`);
        break;
      }
    }
  });
  
  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
  });
});

// Send pending notifications to a user
async function sendPendingNotifications(userId, ws) {
  try {
    const pendingNotifications = await Notification.find({
      userId,
      read: false
    }).sort({ createdAt: -1 }).limit(10);
    
    for (const notification of pendingNotifications) {
      ws.send(JSON.stringify({
        type: 'notification',
        data: notification
      }));
    }
  } catch (error) {
    console.error('❌ Error sending pending notifications:', error);
  }
}

// Mark notification as read
async function markNotificationAsRead(notificationId, userId) {
  try {
    await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { read: true }
    );
  } catch (error) {
    console.error('❌ Error marking notification as read:', error);
  }
}

// Send notification to user
export async function sendNotification(userId, notificationData) {
  try {
    // Save to database
    const notification = new Notification({
      userId,
      ...notificationData
    });
    
    await notification.save();
    
    // Send via WebSocket if user is connected
    const client = clients.get(userId);
    if (client && client.readyState === WebSocketServer.OPEN) {
      client.send(JSON.stringify({
        type: 'notification',
        data: notification
      }));
    }
    
    console.log(`📨 Notification sent to user ${userId}: ${notification.title}`);
    return notification;
  } catch (error) {
    console.error('❌ Error sending notification:', error);
    throw error;
  }
}

// Send urgent alert to all users in area
export async function sendUrgentAlert(area, message, issueId) {
  try {
    const notification = {
      type: 'urgent_alert',
      title: `Urgent Alert: ${area}`,
      message,
      data: { area, issueId, timestamp: new Date() }
    };
    
    // Broadcast to all connected clients
    let sentCount = 0;
    clients.forEach((client, userId) => {
      if (client.readyState === WebSocketServer.OPEN) {
        client.send(JSON.stringify({
          type: 'urgent_alert',
          data: notification
        }));
        sentCount++;
      }
    });
    
    console.log(`🚨 Urgent alert sent to ${sentCount} users in ${area}`);
    return { success: true, sentTo: sentCount };
  } catch (error) {
    console.error('❌ Error sending urgent alert:', error);
    throw error;
  }
}

// REST API endpoints

// Get user notifications
app.get('/notifications/:userId', async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    const notifications = await Notification.find({ 
      userId: req.params.userId 
    })
    .sort({ createdAt: -1 })
    .skip(parseInt(offset))
    .limit(parseInt(limit));
    
    const total = await Notification.countDocuments({ 
      userId: req.params.userId 
    });
    
    res.json({
      notifications,
      pagination: {
        total,
        offset: parseInt(offset),
        limit: parseInt(limit),
        hasMore: total > parseInt(offset) + notifications.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark notification as read
app.patch('/notifications/:id/read', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }
    
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId },
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark all notifications as read
app.patch('/notifications/read-all', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }
    
    const result = await Notification.updateMany(
      { userId, read: false },
      { read: true }
    );
    
    res.json({
      success: true,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Notification Service',
    timestamp: new Date().toISOString(),
    websocket: {
      connectedClients: clients.size,
      port: config.wsPort
    },
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Send test notification (for testing only)
app.post('/test-notification', async (req, res) => {
  try {
    const { userId, title, message } = req.body;
    
    const notification = await sendNotification(userId, {
      type: 'test',
      title: title || 'Test Notification',
      message: message || 'This is a test notification',
      data: { test: true }
    });
    
    res.json({
      success: true,
      notification
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start HTTP server
app.listen(config.port, () => {
  console.log(`🚀 Notification Service running on port ${config.port}`);
  console.log(`📡 WebSocket server running on port ${config.wsPort}`);
  console.log(`✅ Health check: http://localhost:${config.port}/health`);
  console.log(`🔌 WebSocket connect: ws://localhost:${config.wsPort}`);
});

// Export functions for other services to use


// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('🔻 Shutting down Notification Service...');
  
  // Close WebSocket connections
  wss.clients.forEach(client => {
    client.close();
  });
  
  // Close MongoDB connection
  await mongoose.connection.close();
  
  console.log('✅ Notification Service shut down');
  process.exit(0);
});