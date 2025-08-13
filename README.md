# Next.js Full Stack Boilerplate

![Npm](https://img.shields.io/badge/npm-v10.9.2-CB3837?style=flat-square&logo=npm&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-v22.17.0-339933?style=flat-square&logo=nodedotjs&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue?style=flat-square&logo=typescript)
![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat-square&logo=react)
![Next.js](https://img.shields.io/badge/Next.js-15.4.5-black?style=flat-square&logo=next.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-316192?style=flat-square&logo=postgresql&logoColor=white)
![Drizzle](https://img.shields.io/badge/Drizzle-0.44.4-C5F74F?style=flat-square&logo=drizzle&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?style=flat-square&logo=tailwind-css)
![ShadCN](https://img.shields.io/badge/shadcn%2Fui-2.4.0-000000?style=flat-square&logo=shadcnui&logoColor=white)

## Features

- **TypeScript** - with strict type checking
- **Next.js** - with App Directory
- **NextAuth.js v5** - with JWT and session management
- **shadcn/ui** - High-quality React component library
- **Tailwind CSS v4** - Modern utility-first CSS framework
- **Dark theme support** - Light/dark mode toggle with next-themes
- **PostgreSQL** - with Drizzle ORM
- **React Query** - for server state management
- **ESLint + Prettier** - for code quality
- **Rate limiting** - middleware for API protection
- **Turbopack** - for fast development builds

## Quick Start

### Installation

1. **Install dependencies**

```bash
npm install
```

2. **Set Environment variables**

Copy `env.example` to `.env.local`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
AUTH_SECRET="your-secret-key-here"
```

3. **Database setup**

```bash
# Generate migrations
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database (optional)
npm run db:seed
```

4. **Start development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

### Development

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Database Management

- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio
- `npm run db:push` - Push schema changes
- `npm run db:seed` - Seed database with sample data
- `npm run db:clear` - Clear all database data
- `npm run db:backup` - Create database backup
- `npm run db:restore` - Restore from backup
- `npm run db:maintain` - Run database maintenance

## Contributions

Any contribution is welcome!

## License

Licensed under the MIT License

Made with ♥ by [ChingRu/rutopio](https://github.com/rutopio)
