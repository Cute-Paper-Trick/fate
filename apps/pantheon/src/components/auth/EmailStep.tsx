'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface EmailStepProps {
  onContinue: (identifier: string) => void;
}

export default function EmailStep({ onContinue }: EmailStepProps) {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');

  const validateIdentifier = (value: string): boolean => {
    // Check if it's an email or username
    if (!value || value.trim().length === 0) {
      setError('请输入邮箱地址或用户名');
      return false;
    }

    // If it contains @, validate as email
    if (value.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setError('请输入有效的邮箱地址');
        return false;
      }
    } else {
      // Validate as username (alphanumeric, underscore, hyphen, at least 3 chars)
      const usernameRegex = /^[a-zA-Z0-9_-]{3,}$/;
      if (!usernameRegex.test(value)) {
        setError('用户名至少3个字符，只能包含字母、数字、下划线和连字符');
        return false;
      }
    }

    return true;
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (validateIdentifier(identifier.trim())) {
      onContinue(identifier.trim());
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 dark:from-gray-900 dark:to-gray-800">
      <div className="relative w-full max-w-md">
        {/* Close button */}
        <button
          onClick={() => router.back()}
          className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-400 shadow-md transition-colors hover:bg-gray-50 hover:text-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
          aria-label="关闭"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Main card */}
        <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">
          {/* Logo and title */}
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center">
              <Image
                src="/pantheon.png"
                alt="Pantheon"
                width={64}
                height={64}
                className="rounded-xl"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              登录到 Pantheon
            </h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              欢迎回来！请登录以继续
            </p>
          </div>

          {/* Email/Username input */}
          <form onSubmit={handleContinue}>
            <div className="mb-6">
              <label
                htmlFor="identifier"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                电子邮件地址或用户名
              </label>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setError('');
                }}
                placeholder=""
                autoComplete="username email"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
                required
                autoFocus
              />
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Continue button */}
            <button
              type="submit"
              disabled={!identifier.trim()}
              className="group relative w-full overflow-hidden rounded-lg bg-gray-900 px-4 py-3 font-medium text-white transition-all hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-600 dark:hover:bg-gray-500"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                继续
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </button>
          </form>

          {/* Secured by */}
          <div className="mt-8 flex items-center justify-center gap-8 text-xs text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1">
              Secured by
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Better Auth
            </span>
            <Link href="/help" className="hover:text-gray-600 dark:hover:text-gray-400">
              帮助
            </Link>
            <Link href="/privacy" className="hover:text-gray-600 dark:hover:text-gray-400">
              隐私
            </Link>
            <Link href="/terms" className="hover:text-gray-600 dark:hover:text-gray-400">
              条款
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
