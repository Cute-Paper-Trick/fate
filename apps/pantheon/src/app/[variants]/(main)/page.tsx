'use client';

// import { useSession, signOut } from "@fate/auth/client";
import { useTranslate } from '@tolgee/react';
import { useRouter } from 'next/navigation';

import styles from './page.module.css';

export default function Home() {
  const { t } = useTranslate();
  const session = {
    user: { name: 111, email: 222, id: 333 },
  };
  // const { data: session, isPending } = useSession();
  const isPending = false;
  const router = useRouter();

  const handleSignOut = async () => {
    // await signOut();
    router.push('/login');
  };

  if (isPending) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <p>加载中...</p>
        </main>
      </div>
    );
  }

  if (!session) {
    router.push('/login');
    return null;
  }

  return (
    <div className={styles.page}>
      <p>{t('app_name')}</p>
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>欢迎回来, {session.user.name || session.user.email}!</h1>
          <button onClick={handleSignOut} className={styles.signOutButton}>
            登出
          </button>
        </div>

        <div className={styles.content}>
          <h2>Pantheon Dashboard</h2>
          <p>你已成功登录到 Pantheon 系统。</p>

          <div className={styles.userInfo}>
            <h3>用户信息</h3>
            <div className={styles.infoItem}>
              <span className={styles.label}>邮箱:</span>
              <span>{session.user.email}</span>
            </div>
            {session.user.name && (
              <div className={styles.infoItem}>
                <span className={styles.label}>姓名:</span>
                <span>{session.user.name}</span>
              </div>
            )}
            <div className={styles.infoItem}>
              <span className={styles.label}>用户 ID:</span>
              <span className={styles.userId}>{session.user.id}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
