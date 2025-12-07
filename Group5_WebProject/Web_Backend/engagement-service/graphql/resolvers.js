import Comment from '../models/Comment.js';
import Issue from '../models/Issue.js';
import User from '../../auth-service/models/User.js';

const resolvers = {
	Query: {
		getComments: async (_, { issueId }) => {
			return await Comment.find({ issue: issueId }).populate('author');
		},
		getUpvotes: async (_, { issueId }) => {
			const issue = await Issue.findById(issueId);
			return issue ? issue.upvotes || 0 : 0;
		},
		getVolunteers: async (_, { issueId }) => {
			const issue = await Issue.findById(issueId).populate('volunteers');
			return issue ? issue.volunteers : [];
		},
	},
	Mutation: {
		addComment: async (_, { issueId, text }, { user }) => {
			if (!user) throw new Error('Authentication required');
			const comment = new Comment({
				issue: issueId,
				text,
				author: user.userId,
			});
			await comment.save();
			return await comment.populate('author');
		},
		upvoteIssue: async (_, { issueId }, { user }) => {
			if (!user) throw new Error('Authentication required');
			const issue = await Issue.findById(issueId);
			if (!issue) throw new Error('Issue not found');
			issue.upvotes = (issue.upvotes || 0) + 1;
			await issue.save();
			return issue.upvotes;
		},
		volunteerForIssue: async (_, { issueId }, { user }) => {
			if (!user) throw new Error('Authentication required');
			const issue = await Issue.findById(issueId);
			if (!issue) throw new Error('Issue not found');
			if (!issue.volunteers) issue.volunteers = [];
			if (!issue.volunteers.includes(user.userId)) {
				issue.volunteers.push(user.userId);
				await issue.save();
			}
			return await issue.populate('volunteers');
		},
	},
};

export default resolvers;