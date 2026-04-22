# Issue Backlog

This document consolidates findings from multiple QA reviews (including AI analysis of user flows and UI state). The goal is to track these as atomic units of work, eventually migrating them to GitHub Issues to be tackled one PR at a time.

## 🔴 Critical Bugs & Logic Flaws (Blockers)

1. **Initial Application Crash (Auth)**
   - **Description:** The first attempt to interact with the app triggers a hard "Something went wrong" error page on `/auth`. Requires a manual refresh to proceed.
   - **Impact:** Complete blocker for new users. Broken state machine around authenticated vs unauthenticated states.

2. **Broken Auth Flow Loop**
   - **Description:** After a reload, user lands on "Pick up where you left off" (LinkedIn auth), returns to landing, tries again, and hits the same loop. Auth state is not persisted or redirect is misconfigured.
   - **Impact:** Feels unreliable; high abandonment risk.

3. **The "Midnight Boundary" Bug (Event Creation)**
   - **Description:** The event creation form does not allow an event to run past midnight (e.g., start 20:50, end 00:49). System assumes end time is earlier than start time on the same day due to lack of an "End Date" field.
   - **Impact:** Prevents creating late-night/multi-day events.

4. **Broken Feedback Widget**
   - **Description:** The support/feedback widget fails to send messages, throwing a red "Could not send feedback" error upon submission (likely due to stale auth state attempting an RPC call).
   - **Impact:** Users cannot report the very bugs they are experiencing.

---

## 🟠 Major UX Issues & State Glitches

5. **Confusing Primary Action Hierarchy**
   - **Description:** On landing, "Sign in", "Join with code", and "Create event" compete. "Create event" appears available when logged out, leading to errors.
   - **Fix:** Gate "Create event" properly or trigger auth first.

6. **No Feedback During Loading**
   - **Description:** Loading screens are blank with a small spinner and no context (e.g., "Creating your event...").
   - **Impact:** User doesn't know what is happening or if it worked.

7. **Error Screen Tone & Trust**
   - **Description:** Error messages are generic ("An unexpected error occurred..."). Need actionable paths (Retry, Go Back) and empathetic tone.

8. **Dashboard Counter Mismatch**
   - **Description:** After deleting an event, the top stats say "7 events hosted" while the list below says "No events found".

9. **Race Condition on Deletion**
   - **Description:** Deleting an event flashes a "Failed to load event" toast right before the "Event deleted successfully" message.

10. **Phantom Screen Flash**
    - **Description:** Clicking "Sign in with LinkedIn" briefly flashes the "Join Event" pin-code screen before the OAuth redirect.

---

## 🟡 Medium UX & Polish Issues

11. **Landing Page Clarity & Onboarding**
    - **Description:** The headline "The guest list, rebuilt as a network" is conceptual. Needs concrete subheadings ("Turn event check-ins into meaningful connections"). Needs clear paths for Host vs. Attendee.

12. **"Join with code" is Under-explained**
    - **Description:** No hint on where to get the code or what it looks like.

13. **LinkedIn Permission Screen Friction**
    - **Description:** No explanation of *why* permissions are needed ("We use this to match you with people you meet").

14. **Inconsistent Validation Styling**
    - **Description:** Form mixes custom UI error text (time) with browser-native tooltips (URLs).

15. **Raw Database Slugs in UI**
    - **Description:** Breadcrumb shows raw slug (e.g., `HARRYS-EVENT-XZUNWL`) instead of the human-readable event name.

16. **Empty State Actions**
    - **Description:** System allows exporting an "Attendee CSV" even when zero people have checked in.

17. **"Pristine" Form Submissions**
    - **Description:** "Edit event" form allows saving unchanged data, triggering a database update.

18. **Modal Overlay Hierarchy**
    - **Description:** QR code modal opened from dropdown leaves dropdown visible behind it.

19. **Tedious Time Selection**
    - **Description:** Custom time dropdowns are slow. Consider a unified time-picker or text-entry.
