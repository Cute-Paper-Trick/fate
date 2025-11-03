'use client';

import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { authClient } from '@/features/cerberus/client';

interface PasswordStepProps {
  identifier: string; // Can be email or username
  callbackUrl: string;
  onBack: () => void;
}

export default function PasswordStep({ identifier, callbackUrl, onBack }: PasswordStepProps) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isEmail = identifier.includes('@');

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Use different sign-in methods based on identifier type
      if (isEmail) {
        await authClient.signIn.email({
          email: identifier,
          password,
          callbackURL: callbackUrl,
        });
      } else {
        // Use username sign-in
        await authClient.signIn.username({
          username: identifier,
          password,
          callbackURL: callbackUrl,
        });
      }
      router.push(callbackUrl);
    } catch (err: any) {
      setError(err?.message || '密码错误，请重试');
      console.error(err);
    } finally {
      setIsLoading(false);
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">输入您的密码</h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">输入与帐户关联的密码</p>
          </div>

          {/* Email/Username display with edit button */}
          <div className="mb-6 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900/50">
            <span className="text-sm text-gray-700 dark:text-gray-300">{identifier}</span>
            <button
              onClick={onBack}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              aria-label="编辑账号"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
          </div>

          {/* Password form */}
          <form onSubmit={handlePasswordSignIn}>
            <div className="mb-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  密码
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  忘记密码?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder=""
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label={showPassword ? '隐藏密码' : '显示密码'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Continue button */}
            <button
              type="submit"
              disabled={isLoading || !password}
              className="group relative mt-4 w-full overflow-hidden rounded-lg bg-gray-900 px-4 py-3 font-medium text-white transition-all hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-600 dark:hover:bg-gray-500"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? '登录中...' : '继续'}
                {!isLoading && (
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
                )}
              </span>
            </button>
          </form>

          {/* Other methods link */}
          <div className="mt-6 text-center">
            <button
              onClick={onBack}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            >
              使用其他方法
            </button>
          </div>

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
