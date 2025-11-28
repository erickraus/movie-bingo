# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Movie Bingo is an Astro Framework static site that generates bingo cards using details found throughout movies, making Movie Night more engaging and competitive. Users can search for pre-configured movies or create custom bingo cards with their own keywords.

## Tech Stack

- **Framework**: Astro 5.16.2 (static site generation)
- **Styling**: Tailwind CSS with dark mode support
- **UI Components**: React (for interactive components only)
- **Content**: MDX support + Astro Content Collections
- **Adapter**: Cloudflare (for deployment to Cloudflare Pages)
- **Language**: TypeScript (strict mode)

## Development Commands

```bash
# Start development server (localhost:4321)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── config/              # JSON configuration files
│   ├── config.json      # Site title and description
│   ├── menu.json        # Header and footer navigation
│   ├── theme.json       # Light/dark theme values
│   └── 404.json         # Random error messages
├── content/
│   ├── config.ts        # Content collection schemas
│   └── movies/          # Movie data (YAML files)
├── components/
│   ├── layouts/         # Layout components
│   │   ├── MainLayout.astro    # Main layout with theme switcher
│   │   ├── Header.astro        # Header with navigation
│   │   ├── Footer.astro        # Footer
│   │   └── PageTitle.astro     # Page title component
│   ├── mdx/             # Custom MDX components
│   ├── BingoCardGenerator.tsx  # React component for generating cards
│   ├── SearchMovies.tsx        # React search component
│   ├── MoviesTable.tsx         # Sortable/paginated table
│   └── FeaturedMovies.astro    # Featured movies grid
└── pages/
    ├── index.astro      # Homepage with search
    ├── custom.astro     # Custom card creator
    ├── about.astro      # About page
    ├── terms.astro      # Terms of use
    ├── 404.astro        # 404 page
    └── movies/
        ├── index.astro      # All movies table
        └── [title].astro    # Dynamic movie page

```

## Architecture

### Content Collections

Movies are stored as YAML files in `src/content/movies/`. Each movie has:

- `title`: string (required)
- `difficulty`: 'easy' | 'normal' | 'hard' (required)
- `keywords`: array of strings (required, max 16 chars each)
- `featured`: boolean (optional, shows on homepage)

Example: `src/content/movies/the-wizard-of-oz.yaml`

### Component Approach

**Astro Components** (.astro files):

- Used for static/server-side content
- Layouts, page templates, MDX components
- Featured movies, page titles, etc.

**React Components** (.tsx files):

- Used only where client-side interactivity is required
- BingoCardGenerator (form state, card generation)
- SearchMovies (live search filtering)
- MoviesTable (sorting, pagination)

All React components use `client:load` directive in Astro files.

### Theme Switching

- Tailwind configured with `darkMode: 'class'`
- Theme state stored in localStorage
- Inline script in MainLayout prevents flash on page load
- Toggle button in Header.astro manages theme switching

### Bingo Card Generator Logic

The BingoCardGenerator component:

1. Accepts optional props (title, keywords) for pre-configured movies
2. Validates inputs (title max 125 chars, keywords max 16 chars)
3. Shuffles keywords and distributes across N cards (1-16)
4. Creates 5x5 grid with "FREE" in center (index 12)
5. Reuses keywords if insufficient for all cards
6. Supports print mode with CSS `@media print`

### Dynamic Routing

`/movies/[title].astro` uses `getStaticPaths()` to generate pages for all movies in the content collection at build time.

## Key Design Decisions

1. **Simplicity over complexity**: React only used where necessary for interactivity
2. **Component reusability**: BingoCardGenerator works for both pre-configured and custom cards
3. **Accessibility**: Proper semantic HTML, ARIA labels, keyboard navigation
4. **Print support**: Cards optimized for printing with clean layouts
5. **Dark mode**: Full theme support with localStorage persistence

- When asked to create keywords: always mix them up so themy don't occur during a sequential timeline in the movie, use things that occur multiple times in the movie, for example quotes, props, non-main characters, situations, specific locations. Do not use generic things like main characters or primary locations like a city
