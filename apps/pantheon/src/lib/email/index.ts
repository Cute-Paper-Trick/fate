import { Resend } from 'resend';

import { mailEnv } from '@/envs/mail';

import ResetPassword from './templates/ResetPassword';

const resend = new Resend(mailEnv.RESEND_API_KEY);

export const sendResetPasswordEmail = async (to: string, url: string) => {
  const res = await resend.emails.send({
    // from: 'Pantheon<noreply@notify.goood.space>',
    from: 'Acme <onboarding@resend.dev>',
    to,
    subject: '[Pantheon]：更改 Pantheon 密码的说明',
    react: ResetPassword({ url, to }),
  });
  console.log(res);
};
