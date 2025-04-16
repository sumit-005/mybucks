# MYBUCKS - Group Expense & Personal Finance Manager

A modern web application that combines group expense splitting with personal finance management.

## Features

- Group expense tracking and splitting
- Personal finance management
- Receipt OCR for grocery expenses
- Offline support
- PWA capabilities
- Multi-currency support
- Group budgeting
- Savings goals tracking

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Supabase
- PowerSync
- React Query
- Jest & Testing Library
- Husky & lint-staged

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- PowerSync account

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mybucks.git
   cd mybucks
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   POWER_SYNC_URL=your_powersync_url
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run typecheck` - Run TypeScript type checking
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
mybucks/
├── src/
│   ├── app/          # Next.js app router pages
│   ├── components/   # Reusable React components
│   ├── lib/          # Utility functions and configurations
│   ├── hooks/        # Custom React hooks
│   ├── types/        # TypeScript type definitions
│   ├── styles/       # Global styles and Tailwind config
│   └── utils/        # Helper functions
├── public/           # Static assets
└── tests/            # Test files
```

## Contributing

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:
   ```bash
   git commit -m "feat: add your feature"
   ```

3. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
