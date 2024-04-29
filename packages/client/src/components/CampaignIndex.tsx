'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardGroup } from 'semantic-ui-react';
import Link from 'next/link';
import factory from '@/ethereum/factory';
import { LoadingIndicator } from '@/components/LoadingIndicator';

const getDeployedCampaigns = async (): Promise<string[]> => {
  try {
    console.log('Loading campaigns from ethereum...');
    const campaigns: string[] = await factory.methods.getDeployedCampaigns().call();
    console.log('CampaignIndex loaded from ethereum:', campaigns);
    return campaigns;
  } catch (err: any) {
    console.error('Failed to load campaigns from ethereum:', err);
    return [];
  }
};

const CampaignIndex = () => {
  const [campaigns, setCampaigns] = useState<string[]>([]);

  useEffect(() => {
    const loadCampaigns = async () => {
      const campaigns: string[] = await getDeployedCampaigns();
      setCampaigns(campaigns);
    };
    loadCampaigns().then();
  }, []);

  const renderCampaigns = () => {
    if (campaigns.length === 0) {
      return (<LoadingIndicator />);
    }

    const items = campaigns.map((address: string) => {
      return {
        header: address,
        description: (
          <Link href={`/campaigns/${address}`} className="item">View Campaign</Link>
        ),
        fluid: true,
        meta: 'Campaign Address',
        style: { overflowWrap: 'break-word' }
      };
    });
    return (<CardGroup items={items} itemsPerRow="3" />);
  };
  return (
    <div>
      {renderCampaigns()}
    </div>
  );
};

export { CampaignIndex };
