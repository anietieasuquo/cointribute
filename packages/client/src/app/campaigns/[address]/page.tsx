'use client';
import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, CardGroup, Grid, GridColumn, GridRow, Image, Modal, Segment } from 'semantic-ui-react';
import web3 from '@/ethereum/web3';
import { ContributionForm } from '@/components/ContributionForm';
import { CampaignSummary } from '@/types/dto';
import { dateTimeFormat, getCampaignSummary } from '@/utils/contract-utils';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { RewardDetails } from '@/components/RewardDetails';
import { CampaignAdditionalDetails } from '@/components/CampaignAdditionalDetails';
import '@/app/campaigns/[address]/styles.scss';
import { PageHeader } from '@/components/PageHeader';
import { NotFoundMessage } from '@/components/NotFoundMessage';
import { ipfsToUrl } from '@/utils/common-utils';
import { metadata } from '@/app/layout';

const CampaignShow = ({ params }) => {
  const [campaignSummary, setCampaignSummary] = useState<CampaignSummary | undefined>(undefined);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const loadCampaign = useCallback(async () => {
    if (!params?.address) return;
    const summary: CampaignSummary = await getCampaignSummary(params.address as string);
    setCampaignSummary(summary);
  }, [params]);

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
      contributionsCount,
      manager,
      contractAddress,
      targetAmount,
      dateCreated,
      metaData
    } = campaignSummary;
    const list = [
      {
        header: metaData?.title,
        fluid: true,
        meta: 'Campaign Title',
        description: metaData?.description,
        style: { overflowWrap: 'break-word', width: '100%' },
        image: (
          <img
            src={ipfsToUrl(metaData?.imageUrl!)}
            alt={`Campaign image for ${metaData?.title}`}
          />
        ),
        color: 'teal',
        onClick: () => setShowModal(!showModal),
        className: 'campaign-hero'
      },
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
        meta: 'Target Amount (ether)',
        description: 'The target amount is the amount of money the manager wants to raise.'
      },
      {
        header: requestsCount,
        meta: 'Requests',
        description: 'A request tries to withdraw money from the contract. Requests must be approved by contributors.',
        as: 'a',
        href: `/campaigns/${contractAddress}/requests`,
        color: 'blue',
        raised: true
      },
      {
        header: contributorsCount,
        meta: 'Contributors',
        description: 'Number of people who have already donated to this campaign.',
        as: 'a',
        href: `/campaigns/${contractAddress}/contributors`,
        color: 'blue',
        raised: true
      },
      {
        header: contributionsCount,
        meta: 'Contributions',
        description: 'Number of contributions made to this campaign.',
        as: 'a',
        href: `/campaigns/${contractAddress}/contributions`,
        color: 'blue',
        raised: true
      },
      {
        header: dateTimeFormat(Number(dateCreated)),
        meta: 'Date Created',
        description: 'The date this campaign was created.'
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
      <PageHeader title="Campaign Details">
        <Link href="/campaigns/new">
          <Button content="New Campaign" icon="add circle" primary floated="right" />
        </Link>
      </PageHeader>
      {loading ? (<LoadingIndicator />) : campaignSummary === undefined ?
        <NotFoundMessage content="campaign details" /> : (
          <Grid>
            <GridRow>
              <GridColumn width={11}>
                {renderSummary()}
                <Modal
                  onClose={() => setShowModal(false)}
                  onOpen={() => setShowModal(true)}
                  open={showModal}
                  header={`Campaign: ${campaignSummary?.metaData?.title} - ${campaignSummary?.metaData?.subTitle}`}
                  content={<Image src={ipfsToUrl(campaignSummary?.metaData?.imageUrl!)}
                                  style={{ width: '100%', height: 'auto' }} />}
                  actions={['Close']}
                  centered={true}
                  dimmer={true}
                  size="large"
                />
              </GridColumn>
              <GridColumn width={5} floated="right">
                <Grid>
                  <GridRow>
                    <GridColumn>
                      <Segment inverted>
                        <h3>Contribute to this Campaign</h3>
                        <ContributionForm address={campaignSummary?.contractAddress || ''} refresh={loadCampaign} />
                      </Segment>
                    </GridColumn>
                  </GridRow>
                  <GridRow>
                    <GridColumn>
                      <Segment>
                        <h3>Additional Details</h3>
                        <CampaignAdditionalDetails data={campaignSummary?.metaData!} />
                      </Segment>
                    </GridColumn>
                  </GridRow>
                  <GridRow>
                    <GridColumn>
                      <Segment>
                        <h3>Reward</h3>
                        <RewardDetails reward={campaignSummary?.reward!} />
                      </Segment>
                    </GridColumn>
                  </GridRow>
                </Grid>
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
        )}
    </div>
  );
};

export default CampaignShow;
