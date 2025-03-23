# Event Manager

A modern, full-featured event management application built with Next.js and TypeScript. This application allows users to create, manage, and track events with a beautiful and intuitive interface.

## Features

-   Interactive calendar view with multiple display options (day, week, month, list)
-   Secure authentication using NextAuth.js
    -   GitHub authentication (more authentication providers coming soon)
-   Responsive design with Tailwind CSS
-   Modern and clean user interface
-   Real-time state management with Zustand
-   Server-side rendering for optimal performance
-   Event creation and management
-   Event search and filtering
-   User-friendly interface for event management

## Tech Stack

-   **Framework**: Next.js 15.1.6
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **Database**: Prisma ORM
-   **Authentication**: NextAuth.js
-   **State Management**: Zustand
-   **Calendar**: FullCalendar
-   **Date Handling**: React DatePicker
-   **Development Tools**:
    -   ESLint for code linting
    -   TypeScript for type safety
    -   PostCSS for CSS processing

## Getting Started

### Prerequisites

-   Node.js (Latest LTS version recommended)
-   npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/kolbeinngr/event-manager.git
cd event-manager
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the necessary environment variables (see `.env.example` for reference).

4. Set up the database:

```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── components/        # Reusable components
│   ├── events/           # Event-related pages
│   ├── create-event/     # Event creation page
│   └── server/           # Server-side utilities
├── store/                 # Zustand state management
├── types/                 # TypeScript type definitions
└── middleware.ts         # Next.js middleware
```

## Roadmap

### Next Up

-   UI for inviting attendees, including CSV import.
-   Improved and cleaner UI design
-   Event history and backup functionality
-   Image upload support for events
-   Enhanced mobile responsiveness
-   Email notifications for event updates
-   Recurring events support
-   Event categories and tags
-   Rich text editor for event descriptions
-   Advanced search and filtering options

### Future Features

-   Social media integration (Looking into the following)
    -   Facebook Events
    -   LinkedIn Events
    -   Workplace by Meta
    -   X (Twitter) Events
-   Mobile app version
-   Multi-language support
-   Analytics dashboard
-   Calendar sync with popular platforms (Google Calendar, iCal)
-   Event comments and discussions
-   Event checklists and tasks
-   Attendance tracking and reporting
-   Enhanced privacy settings
-   Event templates

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - [Kolbeinn Grímsson](mailto:grimsson@frostbit.is)

Project Link: [https://github.com/kolbeinngr/event-manager](https://github.com/kolbeinngr/event-manager)
