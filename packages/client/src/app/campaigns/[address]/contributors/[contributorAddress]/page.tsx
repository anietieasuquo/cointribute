'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { CardGroup, Grid, GridColumn, GridRow } from 'semantic-ui-react';
import web3 from '@/ethereum/web3';
import { CampaignContributor } from '@/types/dto';
import {
  amountString,
  dateTimeFormat,
  getCampaignContributions,
  getContributorRankAndPercentage
} from '@/utils/contract-utils';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import '@/app/campaigns/[address]/contributors/[contributorAddress]/styles.scss';
import getCampaignInstance from '@/ethereum/campaign';
import { NotFoundMessage } from '@/components/NotFoundMessage';
import { PageHeader } from '@/components/PageHeader';

const ContributorShow = ({ params }) => {
  const [contributor, setContributor] = useState<CampaignContributor | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const loadCampaign = useCallback(async () => {
    if (!params?.address || !params?.contributorAddress) return;
    const campaign = getCampaignInstance(params.address as string);
    if (!campaign) throw new Error('Campaign not found.');
    const result = await Promise.all([
      campaign.methods.getContributorSummary(params.contributorAddress).call(),
      getCampaignContributions(params.address as string, campaign)
    ]);

    const contributorResult = result[0];
    const contributionsResult = result[1];

    if (!contributorResult || !contributionsResult) throw new Error('Contributor not found.');
    const contributorAddress = contributorResult[0] as string;
    const percentageAndRank = getContributorRankAndPercentage(contributorAddress, contributionsResult);

    const summary: CampaignContributor = {
      id: contributorResult[0] as string,
      contributor: contributorAddress,
      totalContribution: Number(contributorResult[1]),
      lastContributionDate: Number(contributorResult[2]),
      shareHolding: percentageAndRank.percentage,
      rank: percentageAndRank.rank
    };
    setContributor(summary);
  }, [params]);

  const renderSummary = () => {
    if (!contributor) {
      return (
        <LoadingIndicator />
      );
    }

    const {
      contributor: address,
      totalContribution,
      lastContributionDate,
      shareHolding,
      rank
    } = contributor;
    const list = [
      {
        header: address,
        meta: 'Contributor Address',
        description: 'The address of the contributor.',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: web3.utils.fromWei(totalContribution, 'ether'),
        meta: 'Total Contribution (ether)',
        description: 'The total amount of ether contributed to this campaign.'
      },
      {
        header: amountString(shareHolding, true),
        meta: 'Share Holding',
        description: 'The percentage of the total contributions made by this contributor.'
      },
      {
        header: rank,
        meta: 'Rank',
        description: 'The rank of this contributor based on the total contributions made.'
      },
      {
        header: dateTimeFormat(lastContributionDate),
        meta: 'Last Contribution Date',
        description: 'The date and time of the last contribution made by this contributor.'
      }
    ];
    return <CardGroup items={list} itemsPerRow="2" />;
  };

  useEffect(() => {
    setLoading(true);
    loadCampaign().finally(() => setLoading(false));
  }, [loadCampaign]);

  return (
    <div>
      <PageHeader title="Contributor" />
      {loading ? (<LoadingIndicator />) :
        <Grid>
          <GridRow>
            <GridColumn>
              {contributor ? renderSummary() : <NotFoundMessage content="contributor" />}
            </GridColumn>
          </GridRow>
        </Grid>
      }
    </div>
  );
};

export default ContributorShow;
