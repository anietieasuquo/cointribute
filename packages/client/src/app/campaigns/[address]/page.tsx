'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, CardGroup, Grid, GridColumn, GridRow, Image, Modal, Segment } from 'semantic-ui-react';
import web3 from '@/ethereum/web3';
import { ContributionForm } from '@/components/ContributionForm';
import { CampaignSummary } from '@/types/dto';
import { dateTimeFormat, getCampaignSummary } from '@/utils/contract-utils';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { RewardDetails } from '@/components/RewardDetails';
import { CampaignAdditionalDetails } from '@/components/CampaignAdditionalDetails';

const CampaignShow = ({ params }) => {
  const [campaignSummary, setCampaignSummary] = useState<CampaignSummary | undefined>(undefined);
  const [showModal, setShowModal] = useState<boolean>(false);

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
          <img src="https://react.semantic-ui.com/images/avatar/large/matthew.png"
               style={{ height: '250px', width: 'auto', maxWidth: '100%', overflow: 'hidden', objectFit: 'cover' }}
               alt={`Campaign image for ${metaData?.title}`}
          />
        ),
        color: 'teal',
        onClick: () => setShowModal(!showModal)
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
        description: 'Number of people who have already donated to this campaign.'
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
    loadCampaign().then(() => console.log('Campaign loaded'));
  }, []);

  return campaignSummary !== undefined ? (
    <Grid>
      <GridRow>
        <GridColumn width={11}>
          {renderSummary()}
          <Modal
            onClose={() => setShowModal(false)}
            onOpen={() => setShowModal(true)}
            open={showModal}
            header={`Campaign: ${campaignSummary?.metaData?.title} - ${campaignSummary?.metaData?.subTitle}`}
            content={<Image src="https://react.semantic-ui.com/images/avatar/large/matthew.png"
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
  ) : (
    <LoadingIndicator />
  );
};

export default CampaignShow;
