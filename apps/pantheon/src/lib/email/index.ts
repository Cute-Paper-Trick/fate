import { Resend } from 'resend';

import { appEnv } from '@/envs/app';
import { mailEnv } from '@/envs/mail';

export const resend = new Resend(mailEnv.RESEND_API_KEY);

export const sendResetPasswordEmail = async ({
  resetPasswordLink,
  email,
}: {
  resetPasswordLink: string;
  email: string;
}) => {
  resend.emails.send({
    template: {
      id: '7cb68618-cd30-44aa-8ca9-08ee7d68b296',
      variables: {
        email,
        reset_password_link: resetPasswordLink,
        app_url: appEnv.APP_URL,
      },
    },
    to: email,
  });
};

export const sendVerificationEmail = async ({
  email,
  verificationLink,
}: {
  email: string;
  verificationLink: string;
}) => {
  resend.emails.send({
    template: {
      id: 'f1513ab4-60ff-41ee-bfd6-c1c92e7fc853',
      variables: {
        email,
        verify_email_link: verificationLink,
        app_url: appEnv.APP_URL,
      },
    },
    to: email,
  });
};
