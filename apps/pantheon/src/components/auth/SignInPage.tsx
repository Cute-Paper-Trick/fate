'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import EmailStep from './EmailStep';
import PasswordStep from './PasswordStep';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [identifier, setIdentifier] = useState('');
  const [showPasswordStep, setShowPasswordStep] = useState(false);

  const handleContinue = (value: string) => {
    setIdentifier(value);
    setShowPasswordStep(true);
  };

  const handleBackToEmail = () => {
    setShowPasswordStep(false);
  };

  // If password step is active, show password input page
  if (showPasswordStep && identifier) {
    return (
      <PasswordStep
        identifier={identifier}
        callbackUrl={callbackUrl}
        onBack={handleBackToEmail}
      />
    );
  }

  // Show email/username input step
  return <EmailStep onContinue={handleContinue} />;
}
