import { AuthView } from '@daveyplate/better-auth-ui';
import { authViewPaths } from '@daveyplate/better-auth-ui/server';
import { Flexbox } from 'react-layout-kit';

// import SignInPage from '@/components/auth/SignInPage';

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(authViewPaths).map((path) => ({ path }));
}

export default async function AuthPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params;

  return (
    <Flexbox align="center" height="100vh" justify="center" width="100vw">
      <AuthView path={path} />
    </Flexbox>
  );
}
