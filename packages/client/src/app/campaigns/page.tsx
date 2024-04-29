'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from 'semantic-ui-react';
import { CampaignIndex } from '@/components/CampaignIndex';

export default async () => {
  return (
    <div>
      <Link href="/campaigns/new">
        <Button content="New Campaign" icon="add circle" primary floated="right" />
      </Link>
      <CampaignIndex />
    </div>
  );
};
