/*import Comment from '../models/Comment.js';
import Issue from '../models/Issue.js';
import User from '../../auth-service/models/User.js';
import Volunteer from '../models/Volunteer.js';
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

export default resolvers;*/


import Comment from '../models/Comment.js';
import Issue from '../models/Issue.js';
import Volunteer from '../models/Volunteer.js';

const resolvers = {
  Query: {
    getComments: async (_, { issueId }) => {
      return await Comment.find({ issueId }).populate('authorId', 'username email');
    },
    
    getVolunteers: async (_, { issueId }) => {
      return await Volunteer.find({ issueId }).populate('userId', 'username email');
    },
    
    // Add missing queries from typeDefs
    getIssue: async (_, { id }) => {
      return await Issue.findById(id).populate('createdBy', 'username email');
    },
    
    getIssues: async () => {
      return await Issue.find().populate('createdBy', 'username email').sort({ createdAt: -1 });
    },
    
    getUpvotes: async (_, { issueId }) => {
      const issue = await Issue.findById(issueId);
      return issue ? issue.upvotes || 0 : 0;
    }
  },
  
  Mutation: {
    addComment: async (_, { issueId, content }, { user }) => {
      if (!user) throw new Error('Authentication required');
      
      const comment = new Comment({
        issueId,
        text: content,
        authorId: user.userId,
      });
      
      await comment.save();
      return await comment.populate('authorId', 'username email');
    },
    
    upvoteIssue: async (_, { issueId }, { user }) => {
      if (!user) throw new Error('Authentication required');
      
      const issue = await Issue.findById(issueId);
      if (!issue) throw new Error('Issue not found');
      
      issue.upvotes = (issue.upvotes || 0) + 1;
      await issue.save();
      
      return issue;
    },
    
    volunteerForIssue: async (_, { issueId }, { user }) => {
      if (!user) throw new Error('Authentication required');
      
      // Check if already volunteered
      const existingVolunteer = await Volunteer.findOne({ 
        issueId, 
        userId: user.userId 
      });
      
      if (existingVolunteer) {
        throw new Error('Already volunteered for this issue');
      }
      
      const volunteer = new Volunteer({
        issueId,
        userId: user.userId,
        status: 'pending'
      });
      
      await volunteer.save();
      
      // Add to issue volunteers array
      const issue = await Issue.findById(issueId);
      if (issue) {
        if (!issue.volunteers) issue.volunteers = [];
        if (!issue.volunteers.includes(user.userId)) {
          issue.volunteers.push(user.userId);
          await issue.save();
        }
      }
      
      return await volunteer.populate('userId', 'username email');
    },
    
    // Add missing mutations from typeDefs
    reportIssue: async (_, { title, description, photoUrl, geotag }, { user }) => {
      if (!user) throw new Error('Authentication required');
      
      const issue = new Issue({
        title,
        description,
        photoUrl,
        geotag,
        createdBy: user.userId,
        status: 'open'
      });
      
      await issue.save();
      return await issue.populate('createdBy', 'username email');
    },
    
    updateIssueStatus: async (_, { issueId, status }, { user }) => {
      if (!user) throw new Error('Authentication required');
      
      const issue = await Issue.findById(issueId);
      if (!issue) throw new Error('Issue not found');
      
      issue.status = status;
      issue.updatedAt = new Date();
      await issue.save();
      
      return issue;
    }
  }
};

export default resolvers;