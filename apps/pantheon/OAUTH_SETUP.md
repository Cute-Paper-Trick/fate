# OAuth 配置说明

登录页面已经创建完成，但目前 OAuth 登录功能（Google、Apple、GitHub）还需要配置。

## 当前状态

- ✅ 邮箱密码登录/注册已启用
- ⚠️ OAuth 社交登录需要配置

## 如何启用 OAuth 登录

### 1. 修改 `auth.ts` 配置

在 `src/features/cerberus/auth.ts` 中添加社交登录提供商：

```typescript
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import {
  admin,
  apiKey,
  jwt,
  lastLoginMethod,
  openAPI,
  organization,
  username,
} from 'better-auth/plugins';

export const auth = betterAuth({
  // ... 现有配置 ...

  // 添加社交登录配置
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      enabled: !!process.env.GOOGLE_CLIENT_ID,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      enabled: !!process.env.GITHUB_CLIENT_ID,
    },
    apple: {
      clientId: process.env.APPLE_CLIENT_ID || '',
      clientSecret: process.env.APPLE_CLIENT_SECRET || '',
      enabled: !!process.env.APPLE_CLIENT_ID,
    },
  },

  // ... 其他配置 ...
});
```

### 2. 配置环境变量

在 `.env` 或 `.env.local` 文件中添加：

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Apple OAuth (可选)
APPLE_CLIENT_ID=your_apple_client_id
APPLE_CLIENT_SECRET=your_apple_client_secret
```

### 3. 获取 OAuth 凭证

#### Google OAuth
1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建项目或选择现有项目
3. 启用 Google+ API
4. 创建 OAuth 2.0 客户端 ID
5. 设置授权重定向 URI：
   - 开发环境：`http://localhost:5090/api/auth/callback/google`
   - 生产环境：`https://your-domain.com/api/auth/callback/google`

#### GitHub OAuth
1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 点击 "New OAuth App"
3. 填写信息：
   - Homepage URL: `http://localhost:5090` (开发) 或你的域名
   - Authorization callback URL: `http://localhost:5090/api/auth/callback/github`
4. 获取 Client ID 和 Client Secret

#### Apple OAuth
1. 访问 [Apple Developer Portal](https://developer.apple.com/)
2. 创建 Sign in with Apple 服务
3. 配置回调 URL 和获取凭证
4. 注意：Apple OAuth 配置较为复杂，需要额外的证书配置

## 临时禁用 OAuth 按钮

如果你暂时不需要 OAuth 登录，可以修改登录页面组件，隐藏这些按钮：

在 `src/components/auth/SignInPage.tsx` 中，注释掉或删除社交登录按钮部分。

## 测试

配置完成后：
1. 重启开发服务器
2. 访问 `/auth/sign-in`
3. 点击对应的社交登录按钮测试

## 相关文件

- 认证配置：[src/features/cerberus/auth.ts](src/features/cerberus/auth.ts)
- 登录页面：[src/components/auth/SignInPage.tsx](src/components/auth/SignInPage.tsx)
- 注册页面：[src/components/auth/SignUpPage.tsx](src/components/auth/SignUpPage.tsx)
- 路由页面：[src/app/[variants]/auth/[path]/page.tsx](src/app/[variants]/auth/[path]/page.tsx)
