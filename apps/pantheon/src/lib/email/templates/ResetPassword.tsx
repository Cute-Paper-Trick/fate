import { Html } from '@react-email/components';

const FORGOT_PASSWORD_URL = 'https://goood.space/auth/forgot-password';

interface ResetPasswordProps {
  url: string;
  to: string;
}

const ResetPassword = ({ url, to }: ResetPasswordProps) => {
  return (
    <Html lang="en">
      <p>您好，</p>
      <p>您已要求重置与此电子邮件地址 ({to}) 关联的 Pantheon 帐户的密码。</p>
      <p>要获取密码重置代码，请单击以下链接：</p>
      <a href={url}>{url}</a>
      <p>您还可以将上述链接复制并粘贴到新的浏览器窗口中，或直接在密码页面输入重置代码：</p>
      <p>{url}</p>
      <p>此密码更改代码自发送此电子邮件起 2 小时后失效。要重新开始密码更改过程，请单击此处：</p>
      <a href={FORGOT_PASSWORD_URL}>{FORGOT_PASSWORD_URL}</a>
      <p>如果您没有发起此请求，请忽略此电子邮件。</p>
      <p>回复此电子邮件不会有人查看或答复。</p>
      <p>谢谢，</p>
      <p>Pantheon 团队</p>
      <section>
        <p>***这是自动通知。回复此电子邮件不会有人查看或答复。</p>
      </section>
    </Html>
  );
};

export default ResetPassword;
