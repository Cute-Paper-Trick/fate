import { AuthView } from '@daveyplate/better-auth-ui';
import { authViewPaths } from '@daveyplate/better-auth-ui/server';

import SignInPage from '@/components/auth/SignInPage';

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(authViewPaths).map((path) => ({ path }));
}

export default async function AuthPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params;

  // Use custom sign-in page
  // if (path === 'sign-in') {
  //   return <SignInPage />;
  // }

  // For other auth paths, you can add more custom pages or use default
  return (
    <main className="container flex grow flex-col items-center justify-center self-center p-4 md:p-6">
      <div className="text-center">
        <p className="text-gray-500">Auth page: {path}</p>
      </div>
      <AuthView path={path} />
    </main>
  );
}
