'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardGroup,
  CardHeader,
  Grid,
  GridColumn,
  GridRow
} from 'semantic-ui-react';
import web3 from '@/ethereum/web3';
import { ContributionForm } from '@/components/ContributionForm';
import { CampaignSummary } from '@/types/dto';
import { dateTimeFormat, getCampaignSummary } from '@/utils/contract-utils';
import { LoadingIndicator } from '@/components/LoadingIndicator';

const CampaignShow = ({ params }) => {
  const [campaignSummary, setCampaignSummary] = useState<CampaignSummary | undefined>(undefined);

  const loadCampaign = async () => {
    if (!params?.address) return;
    const summary: CampaignSummary = await getCampaignSummary(params.address as string);
    setCampaignSummary(summary);
  };

  const renderSummary = () => {
    if (!campaignSummary) {
      return (
        <LoadingIndicator />
      );
    }

    const {
      minimumContribution,
      balance,
      requestsCount,
      contributorsCount,
      manager,
      contractAddress,
      targetAmount,
      dateCreated
    } = campaignSummary;
    const list = [
      {
        header: contractAddress,
        meta: 'Campaign Address',
        description: 'The contract address of this campaign. You can view this contract on Etherscan.',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: manager,
        meta: 'Address of Manager',
        description: 'The manager created this campaign and can created requests.',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: web3.utils.fromWei(balance, 'ether'),
        meta: 'Campaign Balance (ether)',
        description: 'The balance is how much money this campaign has left to spend.'
      },
      {
        header: minimumContribution,
        meta: 'Minimum Contribution (wei)',
        description: 'You must contribute at least this much wei to become an contributor.'
      },
      {
        header: web3.utils.fromWei(targetAmount, 'ether'),
        meta: 'Target Amount',
        description: 'The target amount is the amount of money the manager wants to raise.'
      },
      {
        header: requestsCount,
        meta: 'Requests',
        description: 'A request tries to withdraw money from the contract. Requests must be approved by contributors.'
      },
      {
        header: contributorsCount,
        meta: 'Contributors',
        description: 'Number of people who have already donated to this campaign.'
      },
      {
        header: dateTimeFormat(dateCreated),
        meta: 'Date Created',
        description: 'The date this campaign was created.'
      }
    ];
    return <CardGroup items={list} itemsPerRow="2" />;
  };

  useEffect(() => {
    loadCampaign().then(() => console.log('Campaign loaded'));
  }, []);

  return campaignSummary !== undefined ? (
    <Grid>
      <GridRow>
        <GridColumn width={10}>
          <h3>Campaign Details</h3>
          <CardGroup>
            <Card>
              <CardContent>
                <CardHeader>{campaignSummary?.metaData?.title}</CardHeader>
                <CardDescription>
                  {campaignSummary?.metaData?.description}
                </CardDescription>
              </CardContent>
            </Card>
          </CardGroup>
          {renderSummary()}
        </GridColumn>
        <GridColumn width={5} floated="right">
          <h3>Contribute to this Campaign</h3>
          <ContributionForm address={campaignSummary?.contractAddress || ''} refresh={loadCampaign} />
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn>
          <Link href={`/campaigns/${campaignSummary?.contractAddress || ''}/requests`}>
            <Button content="View Requests" primary />
          </Link>
        </GridColumn>
      </GridRow>
    </Grid>
  ) : (
    <LoadingIndicator />
  );
};

export default CampaignShow;
