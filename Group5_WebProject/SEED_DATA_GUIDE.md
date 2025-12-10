# Getting Test Data into the Issue List

The Issue List Page is trying to fetch real data from the Issue Service backend, but the database is empty. Here's how to populate it:

## Quick Start (Recommended)

### 1. Run the Seed Script
Navigate to the issue-service directory and run the seed script:

```bash
cd Web_Backend/issue-service
node seed.js
```

This will:
- Connect to your MongoDB database
- Clear any existing test issues
- Insert 10 sample issues with realistic data
- Show a summary of what was created

**Expected output:**
```
✓ Seeded 10 sample issues
By Status:
  open: 3
  assigned: 2
  in_progress: 2
  resolved: 1
  closed: 0
By Priority:
  low: 2
  medium: 3
  high: 3
  critical: 2
```

### 2. Verify the Issue Service is Running
Make sure the Issue Service backend is running:

```bash
cd Web_Backend/issue-service
npm run dev
```

It should show:
```
Issue Service running on port 4003
GraphQL endpoint: http://localhost:4003/graphql
```

### 3. Refresh the Issue List Page
Go back to `http://localhost:5174/issues` and refresh the page. You should now see 10 sample issues!

## What the Sample Data Includes

The seed script creates 10 realistic issues with:

- **Different statuses**: open, assigned, in_progress, resolved
- **Different priorities**: low, medium, high, critical
- **Different categories**: pothole, streetlight, debris, drainage
- **Real-looking descriptions** and locations in Boulder, CO
- **Upvotes**: 7-31 votes per issue
- **Comments**: 1-8 comments per issue
- **Volunteers**: 0-3 volunteers per issue

## Manual Testing

Once you have sample data, you can:

1. **View the list** - See all 10 issues with filters working
2. **Filter by status** - Try "Open", "In Progress", "Resolved"
3. **Filter by category** - Try "Pothole", "Street Light", etc.
4. **Filter by priority** - Try "High" or "Critical"
5. **Sort results** - Try "Most Recent", "Most Upvotes", etc.
6. **Click "View Details"** - See the full issue page with comments

## Troubleshooting

**Still getting "Failed to fetch"?**

1. Check MongoDB is running:
   ```bash
   mongosh  # or mongo for older versions
   ```

2. Check Issue Service is running on port 4003
3. Check the Issue Service logs for errors
4. Make sure `.env` in issue-service has correct MongoDB URI

**Want to add your own issue?**

Use the "+ Report Issue" button on the dashboard to create a new issue through the UI!

## Reset Data

If you want to start fresh, run the seed script again - it clears the database first.
