# Nerdy Network

**Nerdy Network** is a builder-focused social platform for college students - think GitHub + Twitter + Hogwarts for student builders. It's where students log their daily progress, compete in house challenges, and build in public together.

## What is Nerdy Network?

Nerdy Network transforms the traditional college experience into a gamified builder community:

- **Build in Public**: Daily progress logging with 365-day GitHub-style heatmaps
- **House System**: Hogwarts-inspired houses with weekly competitions and leaderboards
- **Gamification**: Streaks, badges, and house points for consistent building
- **Community**: Share projects, get feedback, and connect with fellow builders
- **Accountability**: Track your builder journey and maintain momentum

## Key Features

### Build in Public System
- Daily progress logging with 6 categories (Code, Design, Research, Shipping, Learning, Planning)
- 365-day activity heatmap visualization
- Streak tracking (current + longest)
- Milestone badges (7/30/100 day achievements)
- Auto-sharing progress to community feed

### House System
- 4 Hogwarts-inspired houses
- Quiz-based house sorting
- House-specific feeds and pages
- Weekly house leaderboard
- House points for activities

### Gamification
- Upvote/downvote system
- Quick reactions
- Achievement badges
- Progress intensity tracking
- Weekly top builders

### Community Features
- Create and share posts
- Comment threading
- Hot/New/Top sorting
- Full-text search
- Category filtering
- Edit/delete functionality

### Moderation
- Report system (5 report types)
- Moderator dashboard
- Content flagging
- Action tracking
- Stats visualization

## Tech Stack

### Frontend
- **Framework**: Next.js 15.5.9 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui
- **State Management**: React Server Components
- **Animations**: Framer Motion

### Backend
- **Database**: PostgreSQL (users/auth) + MongoDB (community/content)
- **ORM**: Drizzle (PostgreSQL) + Mongoose (MongoDB)
- **Authentication**: Better Auth with Google OAuth
- **API**: Next.js Server Actions

### Infrastructure
- **Monorepo**: Turbo Repo
- **Deployment**: Vercel (Platform) + Cloudflare (Assets)
- **File Storage**: Cloudflare R2

## Project Structure

```bash
/v0.3
  /apps
    /platform          # Main App (Next.js)
      /app             # App Router pages
      /src
        /actions       # Server actions
        /db            # Database schemas
        /models        # MongoDB models
        /auth          # Authentication
      /@               # Shared components & utils
    /website           # Landing Page
    /mail-server       # Email service
  /docs                # Documentation
  /turbo.json          # Turbo configuration
  /README.md           # This file
```

## Getting Started

### Prerequisites
- Node.js 22.x
- PostgreSQL database
- MongoDB database
- Google OAuth credentials

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/nerdynetco/website.git
cd website
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create `.env` in `apps/platform/`:

```env
# Database
DATABASE_URL="postgresql://..."
MONGODB_URI="mongodb://..."

# Auth
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# App Config
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. **Run database migrations**
```bash
cd apps/platform
npm run db:push
```

5. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see the app!

## Current Status

**Overall Progress**: 40/77 features (52%)

### Completed Systems (100%)
- House System (6/6 features)
- Gamification (7/7 features)
- House Points (4/4 features)
- Moderation (5/5 features)

### In Progress
- Build in Public (9/11 - 82%)
- Community Features (8/12 - 67%)
- User Profile (4/6 - 67%)

### Planned
- Notifications (0/5)
- Projects System (0/6)
- Discovery Features (0/8)

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Create a feature branch from `dev`
2. Make your changes
3. Test thoroughly (`npm run build`)
4. Submit a pull request to `dev`

### Code Style

- TypeScript strict mode
- ESLint + Prettier
- Conventional commits
- Meaningful commit messages

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built with ❤️ by the Nerdy Network team
- Inspired by GitHub, Twitter, and Hogwarts
- Powered by the builder community

## Contact

- **Website**: [nerdynet.co](https://nerdynet.co)
- **Platform**: [app.nerdynet.co](https://app.nerdynet.co)
- **GitHub**: [nerdynetco](https://github.com/nerdynetco/website)

---

**Built for builders, by builders.**
