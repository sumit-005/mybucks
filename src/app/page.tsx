import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <h1 className="text-4xl font-bold text-center mb-6">
        Welcome to MYBUCKS
      </h1>
      <p className="text-xl text-center mb-8 max-w-2xl">
        Track group expenses and manage your personal finances in one place.
        Split bills, set budgets, and achieve your savings goals effortlessly.
      </p>
      <div className="flex gap-4">
        <Link
          href="/auth/signup"
          className="btn btn-primary"
        >
          Get Started
        </Link>
        <Link
          href="/auth/login"
          className="btn btn-secondary"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
