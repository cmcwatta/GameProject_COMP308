import Issue from '../models/Issue.js';
import Comment from '../models/Comment.js';
import Alert from '../models/Alert.js';

const resolvers = {
    Query: {
        getIssue: async (_, { id }) => {
            const issue = await Issue.findById(id);
            if (!issue) throw new Error('Issue not found');
            return issue;
        },

        listIssues: async (_, { category, status, priority, skip = 0, limit = 50 }) => {
            const query = {};
            if (category) query.category = category;
            if (status) query.status = status;
            if (priority) query.priority = priority;

            const issues = await Issue.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            return issues;
        },

        getIssuesNearby: async (_, { latitude, longitude, radius }) => {
            const issues = await Issue.find({
                'location.latitude': {
                    $gte: latitude - radius / 111,
                    $lte: latitude + radius / 111
                },
                'location.longitude': {
                    $gte: longitude - radius / (111 * Math.cos(latitude * Math.PI / 180)),
                    $lte: longitude + radius / (111 * Math.cos(latitude * Math.PI / 180))
                }
            });
            return issues;
        },

        getIssueComments: async (_, { issueId, skip = 0, limit = 50 }) => {
            const comments = await Comment.find({ issueId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            return comments;
        },

        getUserAlerts: async (_, { userId, unreadOnly = false }) => {
            const query = { userId };
            if (unreadOnly) query.isRead = false;

            const alerts = await Alert.find(query).sort({ createdAt: -1 });
            return alerts;
        }
    },

    Mutation: {
        createIssue: async (_, { title, description, category, latitude, longitude, address, priority, tags, photo }, { user }) => {
            if (!user) throw new Error('Not authenticated');

            const issue = new Issue({
                title,
                description,
                category,
                priority: priority || 'medium',
                status: 'open',
                reportedBy: user.userId,
                location: {
                    address: address || '',
                    latitude,
                    longitude
                },
                tags: tags || []
            });

            await issue.save();
            return issue;
        },

        updateIssueStatus: async (_, { id, status, notes }, { user }) => {
            if (!user) throw new Error('Not authenticated');

            const issue = await Issue.findById(id);
            if (!issue) throw new Error('Issue not found');

            issue.status = status;
            if (status === 'resolved') {
                issue.resolvedAt = new Date();
            }
            issue.updatedAt = new Date();

            await issue.save();

            // Create alert for watchers
            const subscribers = await Alert.find({ issueId: id });
            for (const alert of subscribers) {
                const newAlert = new Alert({
                    userId: alert.userId,
                    type: 'status_update',
                    issueId: id,
                    title: `Issue Status Updated: ${issue.title}`,
                    message: `Status changed to: ${status}. ${notes || ''}`,
                    priority: issue.priority
                });
                await newAlert.save();
            }

            return issue;
        },

        assignIssueToStaff: async (_, { id, staffId }, { user }) => {
            if (!user) throw new Error('Not authenticated');

            const issue = await Issue.findById(id);
            if (!issue) throw new Error('Issue not found');

            if (!issue.assignedTo.includes(staffId)) {
                issue.assignedTo.push(staffId);
            }

            issue.updatedAt = new Date();
            await issue.save();

            return issue;
        },

        addComment: async (_, { issueId, content, authorId, photo }, { user }) => {
            if (!user) throw new Error('Not authenticated');

            const issue = await Issue.findById(issueId);
            if (!issue) throw new Error('Issue not found');

            const comment = new Comment({
                issueId,
                authorId: user.userId,
                content,
                attachments: photo ? [photo] : []
            });

            await comment.save();

            // Update comment count
            issue.commentCount += 1;
            issue.updatedAt = new Date();
            await issue.save();

            return comment;
        },

        markCommentHelpful: async (_, { commentId }, { user }) => {
            if (!user) throw new Error('Not authenticated');

            const comment = await Comment.findByIdAndUpdate(
                commentId,
                { $inc: { helpfulVotes: 1 } },
                { new: true }
            );

            if (!comment) throw new Error('Comment not found');
            return comment;
        },

        deleteIssue: async (_, { id }, { user }) => {
            if (!user) throw new Error('Not authenticated');

            const issue = await Issue.findById(id);
            if (!issue) throw new Error('Issue not found');

            if (issue.reportedBy.toString() !== user.userId && user.role !== 'admin') {
                throw new Error('Unauthorized');
            }

            await Issue.findByIdAndDelete(id);
            await Comment.deleteMany({ issueId: id });

            return true;
        },

        createAlert: async (_, { userId, type, title, message, issueId, priority }, { user }) => {
            if (!user || user.role !== 'admin') {
                throw new Error('Unauthorized');
            }

            const alert = new Alert({
                userId,
                type,
                title,
                message,
                issueId,
                priority: priority || 'normal',
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
            });

            await alert.save();
            return alert;
        },

        markAlertAsRead: async (_, { id }, { user }) => {
            if (!user) throw new Error('Not authenticated');

            const alert = await Alert.findByIdAndUpdate(
                id,
                { isRead: true },
                { new: true }
            );

            if (!alert) throw new Error('Alert not found');
            return alert;
        }
    }
};

export default resolvers;
