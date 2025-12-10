import Issue from '../models/Issue.js';

export const resolvers = {
  Issue: {
    // Field resolvers
    commentCount: (issue) => {
      return issue.comments?.length || 0;
    },
  },

  Query: {
    issue: async (_, { id }) => {
      try {
        const issue = await Issue.findById(id);
        return issue;
      } catch (error) {
        console.error('Error fetching issue:', error);
        throw new Error('Failed to fetch issue');
      }
    },

    issues: async (_, { status, category, limit = 20, offset = 0 }) => {
      try {
        const query = {};
        if (status) query.status = status;
        if (category) query.category = category;

        const issues = await Issue.find(query)
          .sort({ createdAt: -1 })
          .limit(limit)
          .skip(offset);
        return issues;
      } catch (error) {
        console.error('Error fetching issues:', error);
        throw new Error('Failed to fetch issues');
      }
    },

    issuesByLocation: async (_, { latitude, longitude, maxDistance = 5000 }) => {
      try {
        const issues = await Issue.find({
          location: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [longitude, latitude],
              },
              $maxDistance: maxDistance,
            },
          },
        });
        return issues;
      } catch (error) {
        console.error('Error fetching issues by location:', error);
        throw new Error('Failed to fetch issues by location');
      }
    },

    issuesBySubmitter: async (_, { submitterId }) => {
      try {
        const issues = await Issue.find({ submitterId });
        return issues;
      } catch (error) {
        console.error('Error fetching submitter issues:', error);
        throw new Error('Failed to fetch issues');
      }
    },

    myIssues: async (_, { submitterId }) => {
      try {
        const issues = await Issue.find({ submitterId }).sort({ createdAt: -1 });
        return issues;
      } catch (error) {
        console.error('Error fetching my issues:', error);
        throw new Error('Failed to fetch issues');
      }
    },
  },

  Mutation: {
    createIssue: async (_, { input }) => {
      try {
        const newIssue = new Issue({
          title: input.title,
          description: input.description,
          location: {
            type: 'Point',
            coordinates: [input.longitude, input.latitude],
            address: input.address,
          },
          category: input.category,
          priority: input.priority || 'medium',
          submitterId: input.submitterId,
          submitterName: input.submitterName,
          status: 'open',
        });

        const savedIssue = await newIssue.save();
        return savedIssue;
      } catch (error) {
        console.error('Error creating issue:', error);
        throw new Error('Failed to create issue');
      }
    },

    updateIssue: async (_, { id, input }) => {
      try {
        const issue = await Issue.findByIdAndUpdate(id, input, { new: true });
        return issue;
      } catch (error) {
        console.error('Error updating issue:', error);
        throw new Error('Failed to update issue');
      }
    },

    deleteIssue: async (_, { id }) => {
      try {
        const result = await Issue.findByIdAndDelete(id);
        return !!result;
      } catch (error) {
        console.error('Error deleting issue:', error);
        throw new Error('Failed to delete issue');
      }
    },

    updateStatus: async (_, { id, status }) => {
      try {
        const updateData = { status };
        if (status === 'resolved') {
          updateData.completedAt = new Date();
        }
        const issue = await Issue.findByIdAndUpdate(id, updateData, { new: true });
        return issue;
      } catch (error) {
        console.error('Error updating status:', error);
        throw new Error('Failed to update status');
      }
    },

    assignIssue: async (_, { id, assignedTo }) => {
      try {
        const issue = await Issue.findByIdAndUpdate(
          id,
          { assignedTo, assignedAt: new Date(), status: 'assigned' },
          { new: true }
        );
        return issue;
      } catch (error) {
        console.error('Error assigning issue:', error);
        throw new Error('Failed to assign issue');
      }
    },

    addVolunteer: async (_, { id, userId, name }) => {
      try {
        const issue = await Issue.findByIdAndUpdate(
          id,
          {
            $push: {
              volunteers: { userId, name, joinedAt: new Date() },
            },
          },
          { new: true }
        );
        return issue;
      } catch (error) {
        console.error('Error adding volunteer:', error);
        throw new Error('Failed to add volunteer');
      }
    },

    removeVolunteer: async (_, { id, userId }) => {
      try {
        const issue = await Issue.findByIdAndUpdate(
          id,
          {
            $pull: { volunteers: { userId } },
          },
          { new: true }
        );
        return issue;
      } catch (error) {
        console.error('Error removing volunteer:', error);
        throw new Error('Failed to remove volunteer');
      }
    },

    upvoteIssue: async (_, { id }) => {
      try {
        const issue = await Issue.findByIdAndUpdate(
          id,
          { $inc: { upvotes: 1 } },
          { new: true }
        );
        return issue;
      } catch (error) {
        console.error('Error upvoting issue:', error);
        throw new Error('Failed to upvote issue');
      }
    },
  },
};
