# QA Checklist

This checklist tracks the core use cases to prevent regressions. Perform these checks before merging any significant PR.

## Core Flows

### 1. Authentication

- [ ] **LinkedIn Login:** Can sign in via LinkedIn.
- [ ] **Persistent Session:** Refreshing the page keeps the user logged in.
- [ ] **Error Handling:** Invalid/Expired sessions show a helpful message, not a crash.

### 2. Event Creation

- [ ] **Validation:** Cannot submit without a name, location, or date.
- [ ] **Time Logic:** Start time must be before end time.
- [ ] **Autocomplete:** Location search returns valid suggestions.
- [ ] **Success Flow:** Redirects to the event page after creation.

### 3. Event Page

- [ ] **Visibility:** Public can see the event details.
- [ ] **Check-in:** Attendees can join/unattend.
- [ ] **Real-time:** Attendee list updates instantly when someone joins.
- [ ] **Feedback:** Feedback dialog opens and submits successfully.

### 4. Organizer Tools

- [ ] **Export:** Clicking export downloads a valid CSV/spreadsheet.
- [ ] **Management:** (If implemented) Deleting or editing an event works.

## Edge Cases

- [ ] **404 Handling:** Visiting a non-existent event slug shows the custom 404 page.
- [ ] **Offline/Slow Network:** UI shows appropriate loading/error states.
- [ ] **Empty States:** "No attendees yet" message shows when applicable.
