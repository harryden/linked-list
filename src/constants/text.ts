export const TEXT = {
  common: {
    brand: "Linked List",
    copy: {
      footer: "© 2025 Linked List.",
    },
    buttons: {
      signInWithLinkedIn: "Sign in with LinkedIn",
      joinEvent: "Join Event",
      hostEvent: "Host Event",
      howItWorks: "How It Works",
      myEvents: "My Events",
      getStarted: "Get Started",
      signIn: "Sign In",
      createFirstEvent: "Create Event",
      joinByCode: "Join by Code",
      joinFirstEvent: "Join Event",
      goToDashboard: "Go to Dashboard",
      goToEvent: "Go to Event",
      continueCheckIn: "Check In",
      findingEvent: "Finding event...",
      createEventAndQr: "Create Event",
      creatingEvent: "Creating event...",
      downloadQrCode: "Download QR Code",
      viewEventDashboard: "View Dashboard",
      tryLinkedListNow: "Try Linked List",
      viewQrCode: "View QR Code",
      cancel: "Cancel",
      signOut: "Sign out",
    },
    links: {
      backToDashboard: "Back to Dashboard",
      backToHome: "Back to Home",
      viewPastEvents: "View past events",
      returnHome: "Return Home",
      backToHomeArrow: "← Back to home",
    },
    labels: {
      eventCode: "Event Code",
      dateNotSet: "Date not set",
      timeNotSet: "Time not set",
    },
    ui: {
      breadcrumbMore: "More",
      carouselPrevious: "Previous slide",
      carouselNext: "Next slide",
      paginationPrevious: "Previous",
      paginationNext: "Next",
      paginationMore: "More pages",
      paginationPreviousLabel: "Go to previous page",
      paginationNextLabel: "Go to next page",
      close: "Close",
      toggleSidebar: "Toggle Sidebar",
    },
  },
  landing: {
    hero: {
      titleLine: "Event Check-In.",
      highlight: "Simplified.",
      authenticatedDescription:
        "LinkedIn-verified check-in for your events. One QR code, instant attendee rosters, and verified professional profiles.",
      guestDescription:
        "Generate a QR code. Attendees scan and check in with LinkedIn. Build verified attendee lists in real time.",
      joinButton: "Join Event",
      hostButton: "Host Event",
      demoButton: "How It Works",
      signInButton: "Sign in with LinkedIn",
    },
    features: {
      oneQrCode: {
        title: "One QR Code",
        description:
          "One code per event. Print it, display it, or share the link.",
      },
      linkedinVerified: {
        title: "LinkedIn Verified",
        description:
          "Real attendees with verified LinkedIn profiles. No fake accounts.",
      },
      instantLists: {
        title: "Instant Lists",
        description:
          "Live attendee list with names, headlines, and LinkedIn profiles.",
      },
    },
    howItWorks: {
      title: "How It Works",
      steps: [
        {
          step: "1",
          title: "Create Your Event",
          description:
            "Sign in and create your event. Get your unique QR code instantly.",
        },
        {
          step: "2",
          title: "Attendees Check In",
          description:
            "Attendees scan the code and sign in with LinkedIn. Attendance recorded automatically.",
        },
        {
          step: "3",
          title: "View Your List",
          description:
            "See who's there in real time. Names, headlines, and LinkedIn profiles included.",
        },
      ],
    },
    footerCta: {
      title: "Ready to simplify your events?",
      description: "Start building verified attendee lists today.",
    },
  },
  dashboard: {
    header: {
      welcomePrefix: "Welcome back,",
      tagline: "Manage your event check-ins and attendee rosters.",
      signOutSuccess: "Signed out successfully",
    },
    loading: "Loading dashboard...",
    myEvents: {
      title: "Your Events",
      loading: "Loading events...",
      emptyTitle: "Host your first event.",
      emptyDescription: "Create a QR code to start checking in attendees.",
      viewAttendees: "View attendees →",
    },
    upcoming: {
      title: "Events You've Attended",
      loading: "Loading events...",
      emptyTitle: "No events yet.",
      emptyDescription: "Enter a code to check in.",
      viewAttendeeList: "View attendee list →",
    },
    greetings: {
      newJoiner: "Welcome! Ready to host your first event?",
      firstCheckIn: "You've completed your first check-in.",
      firstHost:
        "You're hosting your first event. Share your code or QR to begin.",
      welcomeBack: "Welcome back, {name}!",
    },
  },
  createEvent: {
    header: {
      backToDashboard: "Back to Dashboard",
      backToHome: "Back to Home",
      backToEvent: "Back to Event",
    },
    form: {
      title: "Create Event",
      description: "Fill in the details to generate your QR code",
      editTitle: "Edit Event",
      editDescription: "Update event details",
      fields: {
        nameLabel: "Event Name *",
        namePlaceholder: "Annual Conference 2025",
        locationLabel: "Location",
        locationPlaceholder: "City Center, Main Hall",
        dateLabel: "Event Date",
        datePlaceholder: "Select date",
        startTimeLabel: "Start Time",
        endTimeLabel: "End Time",
        linkedinUrlLabel: "LinkedIn Event URL (optional)",
        linkedinUrlPlaceholder: "https://www.linkedin.com/events/...",
      },
      submitIdle: "Create Event",
      submitLoading: "Creating event...",
      editSubmitIdle: "Save Changes",
      editSubmitLoading: "Saving...",
    },
    toast: {
      success: "Event created successfully",
      failure: "Failed to create event",
      authRequired: "Sign in to create events",
      missingDateTime: "Select a date and start time",
      invalidTimeRange: "End time must be after start time",
      missingEndTime: "Provide an end time",
    },
  },
  joinEvent: {
    header: {
      title: "Join Event",
      description: "Enter your event code to check in",
    },
    alert: {
      organizer: "You're hosting this event. Open it to manage check-ins.",
    },
    form: {
      label: "Event Code",
      placeholder: "Enter 6-digit code",
      goToEvent: "Go to Event",
      submitIdle: "Check In",
      submitLoading: "Finding event...",
      helperText: "Or scan the QR code at the venue",
    },
    toast: {
      missingCode: "Enter an event code",
      notFound: "Event not found. Check the code and try again.",
      failure: "Failed to find event. Try again.",
      organizerNotice: "You're the organizer of this event",
    },
  },
  auth: {
    brand: "Linked List",
    tagline: "LinkedIn-verified event rosters",
    card: {
      title: "Sign in with LinkedIn",
      description: "Authenticate with your LinkedIn account",
      buttonIdle: "Sign in with LinkedIn",
      buttonLoading: "Connecting...",
    },
    info: {
      title: "What we access:",
      items: [
        {
          title: "Name and profile picture",
          description: "To identify you on the event roster",
        },
        {
          title: "Headline and email",
          description: "For professional networking",
        },
        {
          title: "Read-only access",
          description: "We never post or message on your behalf",
        },
      ],
      consentPrefix:
        "By signing in, you agree to share your LinkedIn profile with event organizers and attendees. Revoke access anytime from your",
      linkedInSettings: "LinkedIn settings.",
    },
    navigation: {
      backToHome: "← Back to home",
    },
    toast: {
      failure: "Authentication failed",
    },
  },
  authCallback: {
    loadingTitle: "Authenticating...",
    loadingDescription: "Completing sign in",
    errorTitle: "Authentication Error",
    errorDescription: "Redirecting to sign in...",
    toast: {
      sessionFailure: "Failed to establish session",
      noSession: "No active session found",
      loadProfileFailure: "Failed to load profile",
      success: "Successfully authenticated",
      genericFailure: "Authentication failed",
    },
  },
  event: {
    header: {
      hostedBy: "Hosted by",
      viewProfile: "View Profile",
      viewSelfProfile: "View Your Profile",
      linkedInMissing: "LinkedIn profile unavailable",
      checkedIn: "You're checked in",
      checkedInShort: "Checked in!",
      options: "Event options",
      edit: "Edit event",
      delete: "Delete event",
      deleteConfirmTitle: "Delete event",
      deleteConfirmDescription:
        "This action cannot be undone. Delete this event?",
      deleteConfirmSubmit: "Delete",
      deleteConfirmCancel: "Cancel",
    },
    attendButton: {
      checkingIn: "Checking in...",
      checkInLinkedIn: "Check In with LinkedIn",
      checkIn: "Check In",
    },
    attendeeList: {
      singular: "Attendee",
      plural: "Attendees",
      loading: "Loading attendees...",
      organizerEmpty: "No attendees yet. Share your code to get started.",
      attendeeEmpty: "No attendees yet. Be the first to check in.",
      exportCsv: "Export CSV",
    },
    page: {
      loading: "Loading event...",
      notFoundTitle: "Event Not Found",
      notFoundDescription: "This event doesn't exist.",
      homeButton: "Go Home",
      guestNotice:
        "By checking in, you agree to share your LinkedIn profile with event attendees.",
      signInPrompt: "Sign In",
      backToDashboard: "Back to Dashboard",
      checkInSuccessBanner: "You're in! The roster is visible below.",
    },
    toast: {
      loadFailure: "Failed to load event",
      checkInSuccess: "Checked in successfully",
      checkInFailure: "Failed to check in",
      alreadyCheckedIn: "Already checked in",
      eventNotFound: "Event not found",
      updateSuccess: "Event updated successfully",
      updateFailure: "Failed to update event",
      deleteSuccess: "Event deleted successfully",
      deleteFailure: "Failed to delete event",
      exportSuccess: "Attendee list exported to CSV",
      exportFailure: "Failed to export attendee list to CSV",
    },
  },
  eventSuccess: {
    loading: "Loading...",
    title: "Event Created",
    description: "Share the code or QR with attendees.",
    codeLabel: "Event Code",
  },
  qrScanner: {
    title: "Scan QR Code",
    permissionDenied:
      "Camera access denied. Enable permissions in your browser settings.",
    instructions: "Position the QR code within the frame",
  },
  qrCodeDialog: {
    title: "Event QR Code",
    description: "Attendees scan this code to check in",
  },
  qrCodePreview: {
    alt: "QR Code",
    generating: "Generating code...",
  },
  locationAutocomplete: {
    placeholder: "Search for a location...",
  },
  notFound: {
    title: "404",
    subtitle: "Page not found",
    link: "Return Home",
  },
  qrScannerErrors: {
    invalidQr: "Invalid event QR code",
    invalidFormat: "Invalid QR code format",
  },
};
