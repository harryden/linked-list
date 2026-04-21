# LinkBack: Verified Professional Networking

LinkBack is a professional networking and event check-in platform designed to eliminate the friction of event registration through verified LinkedIn identities and real-time attendee synchronization.

## Features

- **Frictionless Entry:** One-tap LinkedIn OAuth check-in.
- **Verified Identity:** Attendee data pulled directly from LinkedIn.
- **Real-time Networking:** Live attendee lists that grow dynamically.
- **Organizer Insights:** One-click CSV exports of verified contacts.
- **Short Codes:** 6-digit codes for fast manual entry.

## Tech Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS, Radix UI.
- **Backend:** Supabase (PostgreSQL, Realtime, Edge Functions).
- **Email:** Resend.
- **Testing:** Vitest, Playwright.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/harryden/linked-list.git
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the root of the project (see `.env.example`).

### Running the application

```bash
npm run dev
```

The development server will start at `http://localhost:8080`.

## Contributing

Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a PR.
