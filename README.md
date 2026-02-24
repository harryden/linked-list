# Linked List

This project is a web application that allows users to create and manage events. Users can create events, and other users can join them.

## Features

*   User authentication
*   Create, view, and join events
*   Dashboard to manage your events

## Tech Stack

*   **Frontend:** React, Vite, TypeScript, shadcn/ui
*   **Backend:** Supabase
*   **Testing:** Vitest, React Testing Library

## Getting Started

### Prerequisites

*   Node.js (v18 or later)
*   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/harryden/linked-list.git
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the root of the project and add your Supabase URL and anonymous key:
    ```
    VITE_PUBLIC_SUPABASE_URL=your-supabase-url
    VITE_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
    ```

### Running the application

```bash
npm run dev
```

This will start the development server at `http://localhost:5173`.

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for more information on how to get started.
