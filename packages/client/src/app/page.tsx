'use client';
import React from 'react';
import { Layout } from '@/components/Layout';
import CampaignIndex from '@/app/campaigns/page';


export default () => {
  return (
    <Layout>
      <CampaignIndex showBack={false} />
    </Layout>
  );
};
