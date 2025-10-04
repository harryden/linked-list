export const TEXT = {
  common: {
    brand: "LinkBack",
    copy: {
      footer: "© 2025 LinkBack. Powered by LinkedIn.",
    },
    buttons: {
      signInWithLinkedIn: "Sign in with LinkedIn",
      joinEvent: "Join an Event",
      hostEvent: "Host an Event",
      howItWorks: "How It Works",
      myEvents: "My Events",
      getStarted: "Get Started",
      signIn: "Sign In",
      createFirstEvent: "Create Your First Event",
      joinByCode: "Join by Code",
      joinFirstEvent: "Join your first event",
      goToDashboard: "Go to Dashboard",
      goToEvent: "Go to Event",
      continueCheckIn: "Continue to Check-In",
      findingEvent: "Finding Event...",
      createEventAndQr: "Create Event & Generate QR Code",
      creatingEvent: "Creating Event...",
      downloadQrCode: "Download QR Code",
      viewEventDashboard: "View Event Dashboard",
      tryLinkBackNow: "Try LinkBack Now",
      viewQrCode: "View QR Code",
      cancel: "Cancel",
    },
    links: {
      backToDashboard: "Back to Dashboard",
      backToHome: "Back to Home",
      viewPastEvents: "View your past events",
      returnHome: "Return to Home",
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
      titleLine: "Event Check-In,",
      highlight: "Simplified.",
      authenticatedDescription:
        "Streamline your event networking with LinkedIn integration. Check in instantly, connect with attendees, and build your professional network effortlessly.",
      guestDescription:
        "Create a QR code for your event. Attendees scan to check in with LinkedIn. Build verified attendee lists instantly.",
      joinButton: "Join an Event",
      hostButton: "Host an Event",
      demoButton: "How It Works",
      signInButton: "Sign in with LinkedIn",
    },
    features: {
      oneQrCode: {
        title: "One QR Code",
        description:
          "Generate a unique QR code for each event. Display it at your venue or share the link.",
      },
      linkedinVerified: {
        title: "LinkedIn Verified",
        description:
          "Authentic attendee data from LinkedIn. No fake accounts, just real professionals.",
      },
      instantLists: {
        title: "Instant Lists",
        description:
          "View who attended in real-time. Names, headlines, and profile links at your fingertips.",
      },
    },
    howItWorks: {
      title: "How It Works",
      steps: [
        {
          step: "1",
          title: "Create Your Event",
          description:
            "Sign up as an organizer and create your event in seconds. Get a unique QR code instantly.",
        },
        {
          step: "2",
          title: "Attendees Check In",
          description:
            "Guests scan the QR code and authenticate with LinkedIn. Their attendance is recorded automatically.",
        },
        {
          step: "3",
          title: "View Attendee List",
          description:
            "Access the complete list of verified attendees with their LinkedIn profiles, names, and headlines.",
        },
      ],
    },
    footerCta: {
      title: "Ready to streamline your events?",
      description: "Join LinkBack today and start building verified attendee lists.",
    },
  },
  dashboard: {
    header: {
      welcomePrefix: "Welcome back,",
      tagline: "Host events, check in to events, and connect with attendees.",
      signOutSuccess: "Signed out successfully",
    },
    loading: "Loading your dashboard...",
    myEvents: {
      title: "Your Events",
      loading: "Loading your events...",
      emptyTitle: "Ready to host your first event?",
      emptyDescription: "Create your QR in under 10 seconds.",
      viewAttendees: "View attendees →",
    },
    upcoming: {
      title: "Events You've Attended",
      loading: "Loading your upcoming events...",
      emptyTitle: "No check-ins yet.",
      emptyDescription: "Enter your 6-digit event code to get started.",
      viewAttendeeList: "View attendee list →",
    },
  },
  demo: {
    header: {
      title: "See LinkBack in Action",
      subtitle: "Experience how easy event check-ins can be",
    },
    showcase: {
      steps: [
        {
          title: "Organizer Creates Event",
          description:
            "Sign up as an organizer, create your event with a name and optional details",
          checklist: [
            'Enter event name: "Tech Meetup 2025"',
            "Set date and time (optional)",
            "Add LinkedIn event URL (optional)",
            "Get unique QR code instantly",
          ],
        },
        {
          title: "Display QR Code",
          description:
            "Print the QR code or display it digitally at your event entrance",
          note: "Each event gets a unique QR code",
        },
        {
          title: "Attendees Check In",
          description:
            "Guests scan the QR code with their phone and authenticate with LinkedIn",
          privacyNotice: "⚠️ Privacy Notice Shown:",
          privacyCopy:
            '"Your LinkedIn name and headline will be shown to other attendees of this event."',
          confirmation: "Attendance recorded automatically",
        },
        {
          title: "View Attendee List",
          description:
            "Organizers and attendees can see the verified list of who's at the event",
          attendees: [
            {
              name: "Sarah Johnson",
              title: "Senior Product Manager at Tech Corp",
            },
            {
              name: "Michael Chen",
              title: "Software Engineer at StartupXYZ",
            },
            {
              name: "Emma Davis",
              title: "UX Designer at Creative Studio",
            },
          ],
        },
      ],
    },
    notes: {
      helper: "No payments. No friction. Simply login and start connecting.",
    },
  },
  createEvent: {
    header: {
      backToDashboard: "Back to Dashboard",
      backToHome: "Back to Home",
      backToEvent: "Back to Event",
    },
    form: {
      title: "Create New Event",
      description: "Fill in the details below to generate your event QR code",
      editTitle: "Edit Event",
      editDescription: "Update your event details and save the changes",
      fields: {
        nameLabel: "Event Name *",
        namePlaceholder: "Summer Tech Meetup 2025",
        locationLabel: "Location",
        locationPlaceholder: "TechHub Conference Center, San Francisco",
        dateLabel: "Event Date",
        datePlaceholder: "Select the event date",
        startTimeLabel: "Start Time",
        endTimeLabel: "End Time",
        linkedinUrlLabel: "LinkedIn Event URL (optional)",
        linkedinUrlPlaceholder: "https://www.linkedin.com/events/...",
      },
      submitIdle: "Create Event & Generate QR Code",
      submitLoading: "Creating Event...",
      editSubmitIdle: "Save Changes",
      editSubmitLoading: "Saving Changes...",
    },
    toast: {
      success: "Event created successfully!",
      failure: "Failed to create event",
      authRequired: "Please sign in to create events",
      missingDateTime: "Please select an event date and start time",
      invalidTimeRange: "Event end time must be after the start time",
      missingEndTime: "Please provide an end time",
    },
  },
  joinEvent: {
    header: {
      title: "Join an Event",
      description: "Enter your numeric event code to check in",
    },
    alert: {
      organizer: "You are the host of this event. Open your event to manage check-ins.",
    },
    form: {
      label: "Event Code",
      placeholder: "Enter 6-digit code",
      goToEvent: "Go to Event",
      submitIdle: "Continue to Check-In",
      submitLoading: "Finding Event...",
      helperText: "You can also scan a QR code at the event entrance",
    },
    toast: {
      missingCode: "Please enter an event code",
      notFound: "Event not found. Please check the code and try again.",
      failure: "Failed to find event. Please try again.",
    },
  },
  auth: {
    brand: "LinkBack",
    tagline: "Professional event check-in",
    card: {
      title: "Sign in with LinkedIn",
      description: "Authenticate securely using your LinkedIn account",
      buttonIdle: "Continue with LinkedIn",
      buttonLoading: "Connecting to LinkedIn...",
    },
    info: {
      title: "What we access:",
      items: [
        {
          title: "Your name and profile picture",
          description: "To identify you at events",
        },
        {
          title: "Your headline and email",
          description: "For professional networking",
        },
        {
          title: "Read-only access",
          description: "We cannot post or message on your behalf",
        },
      ],
      consentPrefix:
        "By signing in, you agree to share your LinkedIn profile information with event organizers and attendees for networking purposes. You can revoke access anytime from your",
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
    loadingDescription: "Please wait while we complete your sign in",
    errorTitle: "Authentication Error",
    errorDescription: "Redirecting you back to sign in...",
    toast: {
      sessionFailure: "Failed to establish session",
      noSession: "No active session found",
      loadProfileFailure: "Failed to load profile",
      success: "Successfully authenticated!",
      genericFailure: "Authentication failed",
    },
  },
  event: {
    header: {
      hostedBy: "Hosted by",
      viewProfile: "View Profile",
      viewSelfProfile: "View Your Profile",
      linkedInMissing: "LinkedIn profile not available",
      checkedIn: "You're checked in!",
      options: "Event options",
      edit: "Edit event",
      delete: "Delete event",
      deleteConfirmTitle: "Delete event",
      deleteConfirmDescription:
        "Are you sure you want to delete this event? This action cannot be undone.",
      deleteConfirmSubmit: "Yes, delete",
      deleteConfirmCancel: "No, keep it",
    },
    attendButton: {
      checkingIn: "Checking In...",
      checkInLinkedIn: "Check In with LinkedIn",
      checkIn: "Check In to This Event",
    },
    attendeeList: {
      singular: "Attendee",
      plural: "Attendees",
      loading: "Loading attendees...",
      organizerEmpty: "No attendees yet. Share your QR code to get people to check in!",
      attendeeEmpty: "No attendees yet. Be the first to check in!",
    },
    page: {
      loading: "Loading event...",
      notFoundTitle: "Event Not Found",
      notFoundDescription: "The event you're looking for doesn't exist.",
      homeButton: "Go Home",
      guestNotice:
        "By checking in, you agree to share your LinkedIn profile information with event attendees for networking purposes.",
      signInPrompt: "Sign In",
      backToDashboard: "Back to Dashboard",
    },
    toast: {
      loadFailure: "Failed to load event",
      checkInSuccess: "Checked in successfully!",
      checkInFailure: "Failed to check in",
      alreadyCheckedIn: "You're already checked in!",
      eventNotFound: "Event not found",
      updateSuccess: "Event updated successfully!",
      updateFailure: "Failed to update event",
      deleteSuccess: "Event deleted successfully",
      deleteFailure: "Failed to delete event",
    },
  },
  eventSuccess: {
    loading: "Loading...",
    title: "Event Created!",
    description: "Your event is ready. Share the QR code or event code with attendees.",
    codeLabel: "Event Code",
  },
  qrScanner: {
    title: "Scan Event QR Code",
    permissionDenied: "Camera access denied. Please enable camera permissions in your browser settings.",
    instructions: "Position the QR code within the frame to scan",
  },
  qrCodeDialog: {
    title: "Event QR Code",
    description: "Use this QR code to allow attendees to seamlessly register attendance",
  },
  qrCodePreview: {
    alt: "QR Code",
    generating: "Generating QR code...",
  },
  locationAutocomplete: {
    placeholder: "Search for a location...",
  },
  notFound: {
    title: "404",
    subtitle: "Oops! Page not found",
    link: "Return to Home",
  },
  qrScannerErrors: {
    invalidQr: "Invalid event QR code",
    invalidFormat: "Invalid QR code format",
  },
};
