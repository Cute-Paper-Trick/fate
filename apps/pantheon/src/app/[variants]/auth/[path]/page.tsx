import { AuthView } from '@daveyplate/better-auth-ui';
import { authViewPaths } from '@daveyplate/better-auth-ui/server';
import { Flexbox } from 'react-layout-kit';

// import SignInPage from '@/components/auth/SignInPage';

// export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(authViewPaths).map((path) => ({ path }));
}

export default async function AuthPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params;

  console.log(path);
  return (
    <Flexbox align="center" height="100vh" justify="center" width="100vw">
      <AuthView path={path} />
      {path === 'sign-in' && (
        <Flexbox paddingBlock={10}>
          <p>
            首次登录请使用<a href="https://goood.space/public/invitation.html">初始密码</a>
          </p>
        </Flexbox>
      )}
    </Flexbox>
  );
}
