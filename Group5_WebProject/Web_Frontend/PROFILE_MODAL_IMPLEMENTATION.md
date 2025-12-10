# Profile Modal Implementation

## Overview
A professional, modal-based user profile component that displays:
- User basic information (name, email, member since date, location)
- Role badge with color coding
- Issue statistics (Total Issues, Resolved, Pending, High Priority)
- Resolution rate percentage with visual progress bar
- Interactive "View My Issues" button for navigation

## Files Created

### 1. ProfileModal.jsx
**Location:** `Web_Frontend/auth_frontend/src/components/profile/ProfileModal.jsx`

**Features:**
- GraphQL query `GET_USER_ISSUES` to fetch all issues submitted by the user
- Calculates stats dynamically:
  - Total issues count
  - Resolved issues count
  - Pending issues count (open + in_progress)
  - High priority issues count
  - Resolution rate percentage
- Modal overlay with backdrop blur
- User avatar with gradient background
- Role badge with dynamic color coding:
  - Resident: Blue (#3b82f6)
  - Community Advocate: Green (#10b981)
  - Municipal Staff: Rose (#f43f5e)
  - Admin: Purple (#667eea)
- Organized sections:
  - Contact Information (email, member since, location)
  - Your Issue Activity (4-stat grid)
  - Resolution Overview (progress bar + statistics)
  - Action buttons (View My Issues, Close)

**Props:**
- `isOpen` (boolean): Controls modal visibility
- `onClose` (function): Callback to close the modal

**Dependencies:**
- useAuth: Get current user data
- useQuery: Fetch user's issues via GraphQL
- Heroicons: Icon library
- Apollo Client: GraphQL operations

### 2. ProfileModal.css
**Location:** `Web_Frontend/auth_frontend/src/components/profile/ProfileModal.css`

**Styling Features:**
- Smooth animations:
  - fadeIn: Overlay background
  - slideUp: Modal entrance
- Responsive design (mobile-first):
  - Desktop: 500px width, center aligned
  - Tablet (640px): 90% width, optimized spacing
  - Mobile (480px): Full responsive layout
- Color-coded stat cards:
  - Total: Purple gradient
  - Resolved: Green gradient
  - Pending: Amber gradient
  - High Priority: Red gradient
- Interactive elements:
  - Hover effects with transform (translateY)
  - Smooth transitions (cubic-bezier)
  - Button states (hover, focus)
- Resolution rate progress bar with animated fill
- Custom scrollbar styling

## Integration

### DashboardPage.jsx Updates
1. **Import ProfileModal:**
   ```javascript
   import ProfileModal from '../components/profile/ProfileModal';
   ```

2. **Add state for modal control:**
   ```javascript
   const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
   ```

3. **Update Profile button handler:**
   ```javascript
   <button 
     onClick={() => setIsProfileModalOpen(true)}
     className="header-action-btn profile-btn"
   >
     <UserIcon className="w-5 h-5" />
     <span>Profile</span>
   </button>
   ```

4. **Add ProfileModal component in return:**
   ```javascript
   <ProfileModal 
     isOpen={isProfileModalOpen} 
     onClose={() => setIsProfileModalOpen(false)} 
   />
   ```

## User Experience Flow

1. User clicks "Profile" button in header
2. Modal opens with smooth slide-up animation
3. User sees their:
   - Name and role (with color-coded badge)
   - Contact info (email, join date, location)
   - Issue statistics in visual cards
   - Resolution rate as percentage with progress bar
4. User can:
   - Click "View My Issues" to navigate to issues page
   - Click "Close" to dismiss modal
   - Click outside modal to close
   - View all info clearly on any device

## Statistics Calculation

The modal dynamically calculates all stats from the user's GraphQL data:

```javascript
// Resolution Rate = (Resolved Issues / Total Issues) * 100
resolutionRate = Math.round((resolved / total) * 100)

// Pending = Issues with status 'open' or 'in_progress'
pending = issues.filter(i => i.status === 'open' || i.status === 'in_progress').length

// High Priority = Issues with priority 'critical' or 'high'
highPriority = issues.filter(i => i.priority === 'critical' || i.priority === 'high').length
```

## GraphQL Query

The component uses the existing `issuesBySubmitter` query from the Issue Service:

```graphql
query GetUserIssues($submitterId: String!) {
  issuesBySubmitter(submitterId: $submitterId) {
    id
    title
    status
    priority
    createdAt
  }
}
```

## Responsive Breakpoints

- **Desktop (1024px+):** Full-featured 500px modal
- **Tablet (640px-1023px):** 90% width, optimized spacing
- **Mobile (480px-639px):** Full responsive layout, stacked elements
- **Small Mobile (<480px):** Minimal padding, touch-optimized

## Accessibility Features

- Semantic HTML structure
- Clear visual hierarchy with typography
- Color-coded information with text labels (not color-only)
- Keyboard-accessible close button
- Backdrop click to close
- Proper z-index layering (z-index: 1000)

## Future Enhancements

Possible improvements:
1. Add "Edit Profile" functionality
2. Add notification preferences settings
3. Add contribution badges/achievements
4. Export profile data (PDF)
5. Social sharing options
6. Profile completion percentage
7. Recent activity timeline
8. Volunteer hours tracking
