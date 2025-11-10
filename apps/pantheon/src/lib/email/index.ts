import { Resend } from 'resend';

import { mailEnv } from '@/envs/mail';

import ResetPassword from './templates/ResetPassword';

const resend = new Resend(mailEnv.RESEND_API_KEY);

export const sendResetPasswordEmail = async (to: string, url: string) => {
  const res = await resend.emails.send({
    // from: 'Pantheon<noreply@notify.goood.space>',
    from: 'GooodSpace <noreply@goood.space>',
    to,
    subject: '[Pantheon]：更改 Pantheon 密码的说明',
    react: ResetPassword({ url, to }),
  });
  console.log(res);
};

export const sendVerificationEmail = async (to: string, url: string) => {
  const res = await resend.emails.send({
    // from: 'Pantheon<noreply@notify.goood.space>',
    from: 'GooodSpace <noreply@goood.space>',
    to,
    subject: '[Pantheon]：验证您的 GooodSpace 账户',
    react: ResetPassword({ url, to }),
  });
  console.log(res);
};
