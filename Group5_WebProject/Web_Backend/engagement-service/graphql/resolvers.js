import Comment from '../models/Comment.js';
import Volunteer from '../models/Volunteer.js';
const resolvers = {
  Query: {
    getComments: async (_, { issueId }) => {
      return await Comment.find({ issueId }).sort({ createdAt: -1 });
    },
    
    getVolunteers: async (_, { issueId }) => {
      return await Volunteer.find({ issueId }).sort({ createdAt: -1 });
    }
  },
  
  Mutation: {
    addComment: async (_, { issueId, content }, { user }) => {
      try {
        if (!user) throw new Error('Authentication required');
        
        const comment = new Comment({
          issueId,
          content,
          authorId: user.userId,
          author: user.username,
          createdAt: new Date()
        });
        
        await comment.save();
        return {
          id: comment._id.toString(),
          issueId: comment.issueId,
          content: comment.content,
          authorId: comment.authorId,
          author: comment.author,
          createdAt: comment.createdAt.toISOString()
        };
      } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
      }
    },
    
    upvoteIssue: async (_, { issueId }, { user }) => {
      try {
        if (!user) throw new Error('Authentication required');
        
        // Call the issue service to upvote using proper GraphQL mutation with variables
        const issueServiceUrl = 'http://localhost:4003/graphql';
        
        const mutation = `
          mutation UpvoteIssue($id: ID!) {
            upvoteIssue(id: $id) {
              id
              upvotes
            }
          }
        `;
        
        const response = await fetch(issueServiceUrl, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token || ''}`
          },
          body: JSON.stringify({ 
            query: mutation,
            variables: { id: issueId }
          })
        });
        
        const data = await response.json();
        if (data.errors) {
          throw new Error(data.errors[0].message);
        }
        
        return data.data?.upvoteIssue;
      } catch (error) {
        console.error('Error upvoting issue:', error);
        throw error;
      }
    },
    
    volunteerForIssue: async (_, { issueId }, { user }) => {
      try {
        if (!user) throw new Error('Authentication required');
        
        // Check if already volunteered
        const existingVolunteer = await Volunteer.findOne({ 
          issueId, 
          userId: user.userId 
        });
        
        if (existingVolunteer) {
          throw new Error('Already volunteered for this issue');
        }
        
        // Call the issue service to add volunteer using proper GraphQL mutation with variables
        const issueServiceUrl = 'http://localhost:4003/graphql';
        
        const mutation = `
          mutation AddVolunteer($id: ID!, $userId: String!, $name: String!) {
            addVolunteer(id: $id, userId: $userId, name: $name) {
              id
              volunteers {
                userId
                name
              }
            }
          }
        `;
        
        const response = await fetch(issueServiceUrl, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token || ''}`
          },
          body: JSON.stringify({ 
            query: mutation,
            variables: {
              id: issueId,
              userId: user.userId,
              name: user.username
            }
          })
        });
        
        const data = await response.json();
        if (data.errors) {
          throw new Error(data.errors[0].message);
        }
        
        // Save volunteer record locally too
        const volunteer = new Volunteer({
          issueId,
          userId: user.userId,
          status: 'active',
          createdAt: new Date()
        });
        
        await volunteer.save();
        
        return data.data?.addVolunteer;
      } catch (error) {
        console.error('Error volunteering for issue:', error);
        throw error;
      }
    }
  }
};

export default resolvers;