import { toNextJsHandler } from 'better-auth/next-js';
import { NextRequest } from 'next/server';

import { auth } from '@/features/cerberus/auth';

// 获取 trustedOrigins 配置
const trustedOrigins = new Set([
  'http://localhost:5090',
  'http://localhost:3000',
  'http://localhost:3010',
  'http://localhost:3001',
  'https://dev-daily-backend.goood.space',
]);

// 添加 CORS headers 的辅助函数
function addCorsHeaders(response: Response, origin: string | null): Response {
  if (origin && trustedOrigins.has(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
  }
  return response;
}

const handler = toNextJsHandler(auth.handler);

// 包装 GET 和 POST 方法以添加 CORS headers
export async function GET(request: NextRequest) {
  const origin = request.headers.get('origin');
  const response = await handler.GET(request);
  return addCorsHeaders(response, origin);
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  const response = await handler.POST(request);
  return addCorsHeaders(response, origin);
}

// 处理 OPTIONS 预检请求
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  const response = new Response(null, { status: 204 });
  return addCorsHeaders(response, origin);
}
