# Blog Platform - React + TypeScript + TanStack Query

A production-ready blog application built with React, TypeScript, TanStack Query, and JSON Server.

## Tech Stack

- **React 18** with TypeScript
- **Vite** - Build tool
- **TanStack Query** - Server state management
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **JSON Server** - Mock REST API
- **Lucide React** - Icons

## Features

- View all blogs in a responsive card layout
- Click on a blog to view full details
- Create new blog posts with form validation
- Real-time updates with optimistic UI
- Loading skeletons for better UX
- Error handling and fallback states
- Two-column responsive layout
- Clean separation of concerns

## Project Structure

```
src/
├── api/              # API client functions
│   └── blogs.ts
├── components/       # React components
│   ├── ui/          # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   └── skeleton.tsx
│   ├── BlogCard.tsx
│   ├── BlogDetail.tsx
│   ├── CreateBlogForm.tsx
│   ├── BlogCardSkeleton.tsx
│   └── BlogDetailSkeleton.tsx
├── hooks/            # React Query hooks
│   └── useBlogs.ts
├── pages/            # Page components
│   └── HomePage.tsx
├── types/            # TypeScript types
│   └── blog.ts
├── lib/              # Utility functions
│   └── utils.ts
├── App.tsx
├── main.tsx
└── index.css
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

### Running the Application

You need to run TWO processes:

1. **Terminal 1 - JSON Server (Backend):**
```bash
npm run server
```
This starts the JSON Server on `http://localhost:3001`

2. **Terminal 2 - React App (Frontend):**
```bash
npm run dev
```
This starts the Vite dev server on `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run server` - Start JSON Server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## API Endpoints

The JSON Server provides the following endpoints:

- `GET /blogs` - Fetch all blogs
- `GET /blogs/:id` - Fetch a single blog
- `POST /blogs` - Create a new blog

## Usage

1. **View Blogs**: All blogs are displayed in the left panel as cards
2. **View Details**: Click on any blog card to see full details in the right panel
3. **Create Blog**: Click "Create Blog" button in the header to open the creation form
4. **Form Fields**:
   - Title (required)
   - Categories (comma-separated, e.g., "TECH, FINANCE")
   - Description (required)
   - Cover Image URL (required)
   - Content (required)

## State Management

All server state is managed using TanStack Query:

- `useBlogs()` - Fetches all blogs
- `useBlog(id)` - Fetches a single blog by ID
- `useCreateBlog()` - Creates a new blog with automatic cache invalidation

## Key Features Implementation

### TanStack Query Configuration

- Query client configured with sensible defaults
- Automatic refetch disabled on window focus
- Retry logic for failed requests
- Cache invalidation on successful mutations

### Responsive Design

- Mobile-first approach
- Two-column layout on desktop
- Sticky blog detail panel
- Responsive cards and typography

### Error Handling

- Graceful error states for failed API calls
- User-friendly error messages
- Retry mechanisms built-in

### Loading States

- Skeleton components for better perceived performance
- Loading indicators on forms
- Disabled states during mutations

## Sample Data

The application comes with 3 sample blog posts covering topics in:
- Fintech
- Sustainable Energy
- Remote Work

You can modify the data in `db.json` or create new blogs through the UI.

## Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## This project demonstrates:

- Clean architecture with separation of concerns
- Proper TypeScript typing throughout
- React Query best practices
- Custom hooks for reusable logic
- Component composition
- Form handling with controlled inputs
- Error boundaries and loading states
- Responsive design principles
- Modern React patterns (hooks, functional components)
- Professional UI/UX with shadcn/ui
