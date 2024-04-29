'use client';
import React from 'react';
import { Layout } from '@/components/Layout';

const CampaignLayout = ({ children }: Readonly<{ children: React.ReactNode; }>) => {
  return (
    <Layout>
      {children}
    </Layout>
  );
};

export default CampaignLayout;
