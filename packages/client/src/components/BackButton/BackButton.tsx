'use client';
import React from 'react';
import { Button } from 'semantic-ui-react';
import { useRouter } from 'next/navigation';

const BackButton = () => {
  const router = useRouter();

  return (
    <div>
      <Button onClick={() => router.back()} content="Back" floated="right" icon="angle left" />
    </div>
  );
};

export { BackButton };
