# FastFrench

A modern, fast, and engaging French language learning Progressive Web App (PWA).

## Features

- Interactive lessons with bite-sized content
- Progress tracking and streaks
- Beautiful French-inspired UI design
- Works offline (PWA)
- Mobile-first responsive design
- Gamified learning experience

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: Zustand
- **Backend**: Supabase
- **PWA**: vite-plugin-pwa

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env` and add your Supabase credentials:

```bash
cp .env.example .env
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/     # Reusable UI components
├── features/       # Feature-specific components
├── hooks/          # Custom React hooks
├── lib/            # Utilities and configurations
├── pages/          # Page components
├── types/          # TypeScript type definitions
├── App.tsx         # Main app component with routing
├── main.tsx        # App entry point
└── index.css       # Global styles and Tailwind config
```

## PWA Features

This app is a Progressive Web App with:
- Offline support
- Install to home screen
- App-like experience
- Service worker caching

## Supabase Setup

To configure the backend:

1. Create a Supabase project at https://supabase.com
2. Add your project URL and anon key to `.env`
3. Run the migrations in the `supabase` directory (if available)

## Design Philosophy

The app features a French-inspired color scheme:
- Primary: Navy Blue (#1e3a8a) - representing the French flag
- Accent: Red (#dc2626) - representing the French flag
- Background: Cream and white tones for readability
- Smooth animations with spring physics for delightful interactions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
