'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, CardGroup, Icon } from 'semantic-ui-react';
import factory from '@/ethereum/factory';
import { NotFoundMessage } from '@/components/NotFoundMessage';
import { PageHeader } from '@/components/PageHeader';
import { CampaignSummary } from '@/types/dto';
import { getCampaignSummary } from '@/utils/contract-utils';
import { dateTimeFormat, ipfsToUrl, limit } from '@/utils/common-utils';
import { useRouter } from 'next/navigation';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import web3 from '@/ethereum/web3';
import '@/app/campaigns/styles.scss';

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

const loadCampaigns = async () => {
  const deployedCampaigns: string[] = await getDeployedCampaigns();
  const campaigns: CampaignSummary[] = await Promise.all(
    deployedCampaigns.map((address: string) => getCampaignSummary(address))
  );
  return campaigns;
};

const CampaignIndex = ({ showBack = true }: { showBack?: boolean | undefined; }) => {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<CampaignSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      const list: CampaignSummary[] = await loadCampaigns();
      setCampaigns(list);
    };
    setLoading(true);
    load().then(() => setLoading(false));
  }, []);

  const navigateToCampaign = (address: string) => {
    console.log('Navigating to campaign:', address);
    router.push(`/campaigns/${address}`);
  };

  const renderCampaigns = () => {
    if (campaigns.length === 0) {
      return (<NotFoundMessage content="campaigns" />);
    }

    const items = campaigns.map(({
                                   contractAddress,
                                   metaData,
                                   dateCreated,
                                   requestsCount,
                                   contributionsCount,
                                   reward
                                 }: CampaignSummary) => {
      const { title, description, imageUrl } = metaData || {};
      const { value: rewardValue, title: rewardTitle } = reward || {};
      return {
        header: title,
        image: (
          <img
            src={ipfsToUrl(imageUrl!)}
            alt={`Campaign image for ${title}`}
          />
        ),
        description: (
          <div>
            <p>{limit(description || '', 100)}</p>
            <p>Reward: {rewardTitle} ({web3.utils.fromWei(rewardValue || 0, 'ether')} ether)</p>
          </div>
        ),
        meta: contractAddress,
        extra: (
          <div className="extras">
            <div title="Number of contributors"><Icon name="users" /> {contributionsCount}</div>
            <div title="Number of requests"><Icon name="handshake outline" /> {requestsCount}</div>
            <div title="Date created"><Icon name="calendar check outline" /> {dateTimeFormat(dateCreated)}</div>
          </div>
        ),
        color: 'teal',
        style: { overflowWrap: 'break-word' },
        className: 'campaign-hero',
        onClick: () => navigateToCampaign(contractAddress)
      };
    });
    return (<CardGroup items={items} itemsPerRow="3" />);
  };

  return (
    <div>
      <PageHeader title="Open Campaigns" showBack={showBack}>
        <Link href="/campaigns/new">
          <Button content="New Campaign" icon="add circle" primary floated="right" />
        </Link>
      </PageHeader>
      {loading ? (<LoadingIndicator />) : renderCampaigns()}
    </div>
  );
};

export default CampaignIndex;
