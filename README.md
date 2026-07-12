# Data Science Mastery Application

A polished learning dashboard for building a stronger data science career. This project combines a clean single-page experience with structured learning paths, daily tasks, curated resources, project ideas, interview prep, and career guidance.

## Live Demo

https://datasciencemastery.netlify.app/

## What It Does

- Tracks a structured data science learning journey from fundamentals to advanced topics.
- Shows a dashboard with progress-focused stats and a daily quote.
- Provides daily learning tasks and quick wins to keep momentum high.
- Organizes roadmap stages, skills, resources, projects, interview prep, and career support in one place.
- Uses a modern sidebar layout powered by React Router and Lucide icons.

## Features

- Dashboard with learning stats, progress, and a daily plan
- Roadmap view for guided topic progression
- Daily task generator with completion tracking
- Skills database for targeted practice
- Curated resources and tools
- Project ideas for portfolio building
- Interview preparation content
- Career planning and growth support
- Quick-win notifications to stay consistent

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router DOM
- Lucide React

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Install

```powershell
npm install
```

### Run Locally

```powershell
npm run dev
```

### Build for Production

```powershell
npm run build
```

### Preview the Production Build

```powershell
npm run preview
```

## Project Structure

```text
src/
	App.tsx
	main.tsx
	style.css
	components/
		Career.tsx
		DailyTasks.tsx
		Dashboard.tsx
		Interview.tsx
		Notifications.tsx
		Projects.tsx
		Resources.tsx
		Roadmap.tsx
		Skills.tsx
	data/
		index.ts
		resources.ts
		roadmap.ts
```

## Deployment

This project can be deployed as a standard Vite app on platforms like Vercel, Netlify, or GitHub Pages. Build the app first with `npm run build`, then upload the generated production assets.

## License

No license has been added yet. Add one if you plan to share or distribute the project publicly.
