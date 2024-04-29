'use client';
import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Button,
  Grid,
  GridColumn,
  GridRow,
  Message,
  MessageHeader,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow
} from 'semantic-ui-react';
import getCampaignInstance from '@/ethereum/campaign';
import { RequestRow } from '@/components/RequestRow';
import { CampaignRequest, CampaignSummary, UserMessage } from '@/types/dto';
import { getCampaignSummary } from '@/utils/contract-utils';
import web3 from '@/ethereum/web3';

const getCampaignRequests = (async (address: string): Promise<CampaignRequest[]> => {
  console.log('Loading campaign from ethereum server...', address);
  const campaign = getCampaignInstance(address);
  const summary: CampaignSummary = await getCampaignSummary(address);
  return (await Promise.all(
    Array(summary.requestsCount).fill(0).map(async (element, index) => {
      const request = (await campaign.methods.requests(index).call()) as any;
      return {
        id: request.id,
        description: request.description,
        value: Number(request.value),
        recipient: request.recipient,
        complete: request.complete,
        approvalCount: Number(request.approvalCount),
        contributorsCount: summary.contributorsCount
      };
    })
  ));
});

const RequestIndex = ({ params }) => {
  const campaignAddress = params.address as string;
  const [message, setMessage] = useState<UserMessage | undefined>(undefined);
  const [isManager, setIsManager] = useState<boolean>(false);
  const [requests, setRequests] = useState<CampaignRequest[]>([]);

  const loadCampaign = useCallback(async () => {
    const summary: CampaignSummary = await getCampaignSummary(campaignAddress);
    const accounts = await web3.eth.getAccounts();
    setIsManager(accounts[0] === summary.manager);

    const requests = await getCampaignRequests(campaignAddress);
    setRequests(requests);
  }, [campaignAddress]);

  useEffect(() => {
    loadCampaign().then(() => console.log('Campaign loaded'));
  }, [loadCampaign]);

  return (
    <div>
      <Grid>
        <GridRow className="equal width">
          <GridColumn>
            <h3>Requests</h3>
          </GridColumn>
          <GridColumn>
            {isManager && (
              <Link href={`/campaigns/${campaignAddress}/requests/new`}>
                <Button content="Add Request" primary floated="right" icon="plus circle" />
              </Link>
            )}
          </GridColumn>
        </GridRow>
      </Grid>
      {!!message && (
        <Message negative={message.type === 'error'} positive={message.type === 'success'}>
          <MessageHeader>{message.type === 'error' ? 'Oops' : 'Success'}</MessageHeader>
          <p style={{ overflowWrap: 'break-word' }}>{message.content}</p>
        </Message>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Amount (ether)</TableCell>
            <TableCell>Recipient</TableCell>
            <TableCell>Approvals</TableCell>
            <TableCell>Approve</TableCell>
            <TableCell>Finalize</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request, index) => (
            <RequestRow
              key={index}
              index={index}
              request={request}
              campaignAddress={campaignAddress}
              isManager={isManager}
              refresh={loadCampaign}
              setMessage={setMessage}
            />
          ))}
        </TableBody>
      </Table>
      <div>Found {requests.length} requests.</div>
    </div>
  );
};

export default RequestIndex;
