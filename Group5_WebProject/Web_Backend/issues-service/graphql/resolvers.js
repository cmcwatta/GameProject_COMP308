import Issue from '../models/Issue.js';
import Notification from '../models/Notification.js';
import { config } from '../config/config.js';
import axios from 'axios';

const resolvers = {
  Query: {
    getIssue: async (_, { id }, context) => {
      if (!context.user) throw new Error('Authentication required');
      
      const issue = await Issue.findById(id);
      if (!issue) throw new Error('Issue not found');
      
      // Authorization check
      if (context.user.role === 'resident' && issue.reporterId !== context.user.id) {
        throw new Error('Not authorized to view this issue');
      }
      
      return issue;
    },
    
    getIssues: async (_, { 
      status, 
      category, 
      priority, 
      reporterId, 
      assignedTo,
      page = 1, 
      limit = 10,
      near,
      radius = 1 // in kilometers
    }, context) => {
      if (!context.user) throw new Error('Authentication required');
      
      let query = {};
      
      // Filter based on user role
      if (context.user.role === 'resident') {
        query.reporterId = context.user.id;
      } else if (context.user.role === 'municipal_staff') {
        if (assignedTo === 'me') {
          query['assignedTo.userId'] = context.user.id;
        }
      }
      
      // Apply filters
      if (status) query.status = status;
      if (category) query.category = category;
      if (priority) query.priority = priority;
      if (reporterId) query.reporterId = reporterId;
      if (assignedTo && assignedTo !== 'me') query['assignedTo.userId'] = assignedTo;
      
      // Location-based filtering
      if (near) {
        const [lat, lng] = near.split(',').map(Number);
        query['location.coordinates'] = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat]
            },
            $maxDistance: radius * 1000 // Convert km to meters
          }
        };
      }
      
      const skip = (page - 1) * limit;
      
      const issues = await Issue.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
      
      return issues;
    },
    
    getMyIssues: async (_, __, context) => {
      if (!context.user) throw new Error('Authentication required');
      
      return await Issue.find({ reporterId: context.user.id })
        .sort({ createdAt: -1 });
    },
    
    getAssignedIssues: async (_, __, context) => {
      if (!context.user || context.user.role !== 'municipal_staff') {
        throw new Error('Staff access required');
      }
      
      return await Issue.find({ 'assignedTo.userId': context.user.id })
        .sort({ priority: -1, createdAt: -1 });
    },
    
    searchIssues: async (_, { query }, context) => {
      if (!context.user) throw new Error('Authentication required');
      
      return await Issue.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { 'location.address': { $regex: query, $options: 'i' } }
        ]
      }).sort({ createdAt: -1 }).limit(20);
    },
    
    // Dashboard queries (Issue Management Dashboard - 10 marks)
    getIssueStats: async (_, __, context) => {
      if (!context.user || !['municipal_staff', 'admin'].includes(context.user.role)) {
        throw new Error('Staff access required');
      }
      
      const total = await Issue.countDocuments();
      const open = await Issue.countDocuments({ 
        status: { $in: ['reported', 'under_review', 'assigned', 'in_progress'] } 
      });
      const resolved = await Issue.countDocuments({ status: 'resolved' });
      
      // Get stats by category
      const categoryStats = await Issue.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]);
      
      // Get stats by status
      const statusStats = await Issue.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);
      
      // Get stats by priority
      const priorityStats = await Issue.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ]);
      
      return {
        total,
        open,
        resolved,
        byCategory: categoryStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        byStatus: statusStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        byPriority: priorityStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {})
      };
    },
    
    getHeatmapData: async (_, { days = 30 }, context) => {
      if (!context.user || !['municipal_staff', 'admin'].includes(context.user.role)) {
        throw new Error('Staff access required');
      }
      
      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - days);
      
      const heatmapData = await Issue.aggregate([
        {
          $match: {
            createdAt: { $gte: dateThreshold },
            'location.coordinates': { $exists: true }
          }
        },
        {
          $group: {
            _id: {
              lat: { $round: ['$location.coordinates.coordinates[1]', 4] },
              lng: { $round: ['$location.coordinates.coordinates[0]', 4] }
            },
            count: { $sum: 1 },
            address: { $first: '$location.address' }
          }
        },
        {
          $project: {
            coordinates: ['$_id.lng', '$_id.lat'],
            address: 1,
            count: 1,
            intensity: { $divide: ['$count', 10] }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 100 }
      ]);
      
      return heatmapData;
    },
    
    getRecentActivity: async (_, { limit = 10 }, context) => {
      if (!context.user) throw new Error('Authentication required');
      
      let query = {};
      if (context.user.role === 'resident') {
        query.reporterId = context.user.id;
      }
      
      return await Issue.find(query)
        .sort({ updatedAt: -1 })
        .limit(limit);
    },
    
    // Notification queries
    getNotifications: async (_, { unreadOnly = false }, context) => {
      if (!context.user) throw new Error('Authentication required');
      
      const query = { userId: context.user.id };
      if (unreadOnly) {
        query.isRead = false;
      }
      
      return await Notification.find(query)
        .sort({ createdAt: -1 })
        .limit(50);
    },
    
    getNotificationCount: async (_, __, context) => {
      if (!context.user) throw new Error('Authentication required');
      
      return await Notification.countDocuments({ 
        userId: context.user.id, 
        isRead: false 
      });
    }
  },
  
  Mutation: {
    createIssue: async (_, { 
      title, 
      description, 
      category = 'other', 
      location, 
      photos = [] 
    }, context) => {
      if (!context.user) throw new Error('Authentication required');
      
      // Create issue
      const issue = new Issue({
        title,
        description,
        category,
        location: {
          address: location.address,
          coordinates: {
            type: 'Point',
            coordinates: location.coordinates
          },
          ward: location.ward,
          neighborhood: location.neighborhood
        },
        photos: photos.map(url => ({ url })),
        reporterId: context.user.id,
        reporter: {
          username: context.user.username,
          email: context.user.email,
          role: context.user.role
        }
      });
      
      // Call AI service for categorization
      try {
        const aiResponse = await axios.post(config.aiServiceUrl, {
          query: `
            mutation {
              analyzeIssue(description: "${description}") {
                category
                priority
                sentiment
                keywords
                urgencyScore
              }
            }
          `
        });
        
        const aiData = aiResponse.data.data.analyzeIssue;
        issue.aiCategory = aiData.category;
        issue.priority = aiData.priority;
        issue.aiMetadata = {
          sentiment: aiData.sentiment,
          keywords: aiData.keywords,
          urgencyScore: aiData.urgencyScore
        };
      } catch (error) {
        console.error('AI service error:', error.message);
        // Continue without AI analysis
      }
      
      await issue.save();
      
      // Create notification for staff
      if (context.user.role === 'resident') {
        await Notification.create({
          userId: 'staff', // This would be all staff users in production
          title: 'New Issue Reported',
          message: `New ${issue.category} issue reported by ${context.user.username}`,
          type: 'new_issue_nearby',
          issueId: issue._id,
          priority: issue.priority === 'critical' ? 'urgent' : 'high'
        });
      }
      
      return issue;
    },
    
    updateIssue: async (_, { id, title, description, category, priority }, context) => {
      if (!context.user) throw new Error('Authentication required');
      
      const issue = await Issue.findById(id);
      if (!issue) throw new Error('Issue not found');
      
      // Authorization check
      if (context.user.role === 'resident' && issue.reporterId !== context.user.id) {
        throw new Error('Not authorized to update this issue');
      }
      
      if (title) issue.title = title;
      if (description) issue.description = description;
      if (category) issue.category = category;
      if (priority) issue.priority = priority;
      
      await issue.save();
      
      // Create update notification
      await Notification.create({
        userId: issue.reporterId,
        title: 'Issue Updated',
        message: `Your issue "${issue.title}" has been updated`,
        type: 'issue_update',
        issueId: issue._id
      });
      
      return issue;
    },
    
    updateIssueStatus: async (_, { id, status }, context) => {
      if (!context.user || context.user.role !== 'municipal_staff') {
        throw new Error('Staff access required');
      }
      
      const issue = await Issue.findById(id);
      if (!issue) throw new Error('Issue not found');
      
      issue.status = status;
      
      if (status === 'resolved') {
        issue.resolution = {
          notes: 'Issue resolved by municipal staff',
          resolvedAt: new Date(),
          resolvedBy: {
            userId: context.user.id,
            username: context.user.username
          }
        };
      }
      
      await issue.save();
      
      // Create status update notification
      await Notification.create({
        userId: issue.reporterId,
        title: 'Issue Status Updated',
        message: `Your issue "${issue.title}" status changed to ${status}`,
        type: 'issue_update',
        issueId: issue._id,
        data: { newStatus: status }
      });
      
      return issue;
    },
    
    assignIssue: async (_, { issueId, userId }, context) => {
      if (!context.user || context.user.role !== 'municipal_staff') {
        throw new Error('Staff access required');
      }
      
      const issue = await Issue.findById(issueId);
      if (!issue) throw new Error('Issue not found');
      
      // In production, would fetch user details from auth service
      issue.assignedTo = {
        userId,
        username: 'Staff Member',
        email: 'staff@municipality.ca'
      };
      issue.status = 'assigned';
      
      await issue.save();
      
      return issue;
    },
    
    addComment: async (_, { issueId, text }, context) => {
      if (!context.user) throw new Error('Authentication required');
      
      const issue = await Issue.findById(issueId);
      if (!issue) throw new Error('Issue not found');
      
      // Authorization check
      if (context.user.role === 'resident' && issue.reporterId !== context.user.id) {
        throw new Error('Not authorized to comment on this issue');
      }
      
      issue.comments.push({
        userId: context.user.id,
        username: context.user.username,
        text,
        createdAt: new Date()
      });
      
      await issue.save();
      
      return issue;
    },
    
    voteIssue: async (_, { issueId, vote }, context) => {
      if (!context.user) throw new Error('Authentication required');
      
      const issue = await Issue.findById(issueId);
      if (!issue) throw new Error('Issue not found');
      
      if (vote === 'up') {
        issue.votes.upvotes += 1;
      } else if (vote === 'down') {
        issue.votes.downvotes += 1;
      }
      
      await issue.save();
      
      return issue;
    },
    
    // Notification mutations
    markNotificationRead: async (_, { id }, context) => {
      if (!context.user) throw new Error('Authentication required');
      
      const notification = await Notification.findById(id);
      if (!notification) throw new Error('Notification not found');
      
      if (notification.userId !== context.user.id) {
        throw new Error('Not authorized');
      }
      
      notification.isRead = true;
      notification.readAt = new Date();
      await notification.save();
      
      return notification;
    },
    
    markAllNotificationsRead: async (_, __, context) => {
      if (!context.user) throw new Error('Authentication required');
      
      await Notification.updateMany(
        { userId: context.user.id, isRead: false },
        { $set: { isRead: true, readAt: new Date() } }
      );
      
      return true;
    },
    
    deleteNotification: async (_, { id }, context) => {
      if (!context.user) throw new Error('Authentication required');
      
      const notification = await Notification.findById(id);
      if (!notification) throw new Error('Notification not found');
      
      if (notification.userId !== context.user.id) {
        throw new Error('Not authorized');
      }
      
      await notification.deleteOne();
      return true;
    },
    
    // Admin mutations
    bulkUpdateIssues: async (_, { ids, status }, context) => {
      if (!context.user || context.user.role !== 'municipal_staff') {
        throw new Error('Staff access required');
      }
      
      await Issue.updateMany(
        { _id: { $in: ids } },
        { $set: { status } }
      );
      
      return await Issue.find({ _id: { $in: ids } });
    },
    
    generateReport: async (_, { startDate, endDate }, context) => {
      if (!context.user || context.user.role !== 'municipal_staff') {
        throw new Error('Staff access required');
      }
      
      const query = {};
      if (startDate && endDate) {
        query.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }
      
      const issues = await Issue.find(query);
      
      // Generate CSV report
      const report = issues.map(issue => ({
        id: issue._id,
        title: issue.title,
        category: issue.category,
        status: issue.status,
        priority: issue.priority,
        address: issue.location.address,
        createdAt: issue.createdAt,
        reporter: issue.reporter.username
      }));
      
      return JSON.stringify(report);
    }
  },
  
  Issue: {
    daysOpen: (issue) => {
      if (issue.status === 'resolved' && issue.resolution?.resolvedAt) {
        return Math.floor((issue.resolution.resolvedAt - issue.createdAt) / (1000 * 60 * 60 * 24));
      }
      return Math.floor((Date.now() - issue.createdAt) / (1000 * 60 * 60 * 24));
    }
  }
};

export default resolvers;
           