import Comment from '../models/Comment.js';
import Issue from '../models/Issue.js';
import Notification from '../models/Notification.js';
import StatusHistory from '../models/StatusHistory.js';

const calculateSLADeadline = (category) => {
  const now = new Date();
  const slaHours = {
    'Flooding': 24,
    'Safety Hazard': 48,
    'Streetlight': 72,
    'Pothole': 120,
    'Accessibility': 96,
    'Other': 144
  };
  const hours = slaHours[category] || 144;
  return new Date(now.getTime() + hours * 60 * 60 * 1000);
};

const getSLAStatus = (deadline) => {
  const now = new Date();
  const hoursUntilDeadline = (deadline - now) / (60 * 60 * 1000);
  if (hoursUntilDeadline < 0) return 'Overdue';
  if (hoursUntilDeadline < 24) return 'At Risk';
  return 'On Track';
};

const resolvers = {
  Query: {
    getIssue: async (_, { id }) => {
      return await Issue.findById(id).populate('reportedBy assignedTo').populate({
        path: 'statusHistory.changedBy',
        select: 'email name'
      });
    },
    getIssues: async (_, { category, status, priority }) => {
      const filter = {};
      if (category) filter.category = category;
      if (status) filter.status = status;
      if (priority) filter.priority = priority;
      return await Issue.find(filter).populate('reportedBy assignedTo').sort({ createdAt: -1 });
    },
    getIssuesByLocation: async (_, { latitude, longitude, radiusKm }) => {
      const radiusInRadians = radiusKm / 6371;
      return await Issue.find({
        'location.geopoint': {
          $geoWithin: {
            $centerSphere: [[longitude, latitude], radiusInRadians]
          }
        }
      }).populate('reportedBy assignedTo').sort({ createdAt: -1 });
    },
    getIssuesByStatus: async (_, { status }) => {
      return await Issue.find({ status }).populate('reportedBy assignedTo').sort({ createdAt: -1 });
    },
    getIssuesByCategory: async (_, { category }) => {
      return await Issue.find({ category }).populate('reportedBy assignedTo').sort({ createdAt: -1 });
    },
    getComments: async (_, { issueId }) => {
      return await Comment.find({ issue: issueId }).populate('author').sort({ createdAt: -1 });
    },
    getNotifications: async (_, __, { user }) => {
      if (!user) throw new Error('Authentication required');
      return await Notification.find({ userId: user.userId }).sort({ createdAt: -1 });
    },
    getUnreadNotifications: async (_, __, { user }) => {
      if (!user) throw new Error('Authentication required');
      return await Notification.find({ userId: user.userId, read: false }).sort({ createdAt: -1 });
    },
    searchIssues: async (_, { query }) => {
      return await Issue.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } }
        ]
      }).populate('reportedBy assignedTo');
    }
  },
  Mutation: {
    createIssue: async (_, { 
      title, description, category, priority, address, city, state, postalCode, latitude, longitude, photoUrl 
    }, { user }) => {
      if (!user) throw new Error('Authentication required');
      
      const slaDeadline = calculateSLADeadline(category);
      const newIssue = new Issue({
        title,
        description,
        category,
        priority: priority || 'Medium',
        status: 'Open',
        location: {
          address,
          city,
          state,
          postalCode,
          geopoint: {
            type: 'Point',
            coordinates: [longitude, latitude]
          }
        },
        photoUrl,
        reportedBy: user.userId,
        slaDeadline,
        slaStatus: getSLAStatus(slaDeadline),
        upvotes: 0,
        commentCount: 0,
        statusHistory: []
      });
      
      await newIssue.save();
      
      const historyEntry = new StatusHistory({
        issue: newIssue._id,
        status: 'Open',
        changedBy: user.userId,
        reason: 'Issue created'
      });
      await historyEntry.save();
      newIssue.statusHistory.push(historyEntry._id);
      await newIssue.save();
      
      return await newIssue.populate('reportedBy assignedTo');
    },
    
    updateIssueStatus: async (_, { issueId, status, reason }, { user }) => {
      if (!user) throw new Error('Authentication required');
      const issue = await Issue.findById(issueId);
      if (!issue) throw new Error('Issue not found');
      
      issue.status = status;
      await issue.save();
      
      const historyEntry = new StatusHistory({
        issue: issueId,
        status,
        changedBy: user.userId,
        reason: reason || 'Status updated'
      });
      await historyEntry.save();
      issue.statusHistory.push(historyEntry._id);
      await issue.save();
      
      return await issue.populate('reportedBy assignedTo').populate({
        path: 'statusHistory.changedBy',
        select: 'email name'
      });
    },
    
    assignIssue: async (_, { issueId, staffId }, { user }) => {
      if (!user) throw new Error('Authentication required');
      const issue = await Issue.findById(issueId);
      if (!issue) throw new Error('Issue not found');
      
      issue.assignedTo = staffId;
      issue.status = 'Assigned';
      await issue.save();
      
      const historyEntry = new StatusHistory({
        issue: issueId,
        status: 'Assigned',
        changedBy: user.userId,
        reason: `Assigned to staff member ${staffId}`
      });
      await historyEntry.save();
      issue.statusHistory.push(historyEntry._id);
      await issue.save();
      
      await Notification.create({
        userId: staffId,
        issueId,
        type: 'Assignment',
        title: 'Issue Assigned to You',
        message: `Issue "${issue.title}" has been assigned to you.`
      });
      
      return await issue.populate('reportedBy assignedTo');
    },
    
    addComment: async (_, { issueId, content, isStaffResponse }, { user }) => {
      if (!user) throw new Error('Authentication required');
      const issue = await Issue.findById(issueId);
      if (!issue) throw new Error('Issue not found');
      
      const newComment = new Comment({
        issue: issueId,
        author: user.userId,
        content,
        isStaffResponse: isStaffResponse || false,
        isPinned: false,
        upvotes: 0
      });
      
      await newComment.save();
      issue.commentCount = (issue.commentCount || 0) + 1;
      await issue.save();
      
      await Notification.create({
        userId: issue.reportedBy,
        issueId,
        type: 'NewComment',
        title: 'New Comment on Your Issue',
        message: `A new comment was added to "${issue.title}".`
      });
      
      return await newComment.populate('author');
    },
    
    pinComment: async (_, { commentId }, { user }) => {
      if (!user) throw new Error('Authentication required');
      const comment = await Comment.findByIdAndUpdate(commentId, { isPinned: true }, { new: true });
      return await comment.populate('author');
    },
    
    upvoteIssue: async (_, { issueId }, { user }) => {
      if (!user) throw new Error('Authentication required');
      const issue = await Issue.findById(issueId);
      if (!issue) throw new Error('Issue not found');
      issue.upvotes = (issue.upvotes || 0) + 1;
      await issue.save();
      return issue;
    },
    
    upvoteComment: async (_, { commentId }, { user }) => {
      if (!user) throw new Error('Authentication required');
      const comment = await Comment.findById(commentId);
      if (!comment) throw new Error('Comment not found');
      comment.upvotes = (comment.upvotes || 0) + 1;
      await comment.save();
      return await comment.populate('author');
    },
    
    createNotification: async (_, { userId, type, title, message, issueId }) => {
      const notification = new Notification({ userId, type, title, message, issueId, read: false });
      await notification.save();
      return notification;
    },
    
    markNotificationAsRead: async (_, { notificationId }) => {
      return await Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true });
    },
    
    markAllNotificationsAsRead: async (_, __, { user }) => {
      if (!user) throw new Error('Authentication required');
      await Notification.updateMany({ userId: user.userId }, { read: true });
      return true;
    }
  }
};

export default resolvers;