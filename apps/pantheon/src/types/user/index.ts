import { Session } from '@/features/cerberus/client';

// export type FateUser {
//   id: string;
//   createdAt: Date;
//   updatedAt: Date;
//   email: string;
//   emailVerified: boolean;
//   name: string;
//   image?: string | null | undefined;
// }

export type FateUser = Session['user'];
