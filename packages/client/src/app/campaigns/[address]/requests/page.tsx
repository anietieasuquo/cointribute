'use client';
import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Button,
  Message,
  MessageHeader,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow
} from 'semantic-ui-react';
import getCampaignInstance from '@/ethereum/campaign';
import { RequestRow } from '@/components/RequestRow';
import { CampaignRequest, CampaignSummary, UserMessage } from '@/types/dto';
import { getCampaignSummary } from '@/utils/contract-utils';
import web3 from '@/ethereum/web3';
import { PageHeader } from '@/components/PageHeader';
import { LoadingIndicator } from '@/components/LoadingIndicator';

const getCampaignRequests = (async (address: string): Promise<CampaignRequest[]> => {
  console.log('Loading campaign from ethereum server...', address);
  const campaign = getCampaignInstance(address);
  const summary: CampaignSummary = await getCampaignSummary(address, campaign);
  return (await Promise.all(
    Array(summary.requestsCount).fill(0).map(async (element, index) => {
      const request = (await campaign.methods.requests(index).call()) as any;
      return {
        id: request.id,
        description: request.description as string,
        value: Number(request.value),
        recipient: request.recipient,
        complete: request.complete,
        approvalCount: Number(request.approvalCount),
        dateCreated: Number(request.dateCreated),
        contributorsCount: summary.contributorsCount
      };
    })
  ));
});

const RequestIndex = ({ params }: { params: { address: string } }) => {
  const campaignAddress = params.address;
  const [message, setMessage] = useState<UserMessage | undefined>(undefined);
  const [isManager, setIsManager] = useState<boolean>(false);
  const [requests, setRequests] = useState<CampaignRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadCampaign = useCallback(async () => {
    const summary: CampaignSummary = await getCampaignSummary(campaignAddress);
    const accounts = await web3.eth.getAccounts();
    setIsManager(accounts[0] === summary.manager);

    const requests = await getCampaignRequests(campaignAddress);
    setRequests(requests);
  }, [campaignAddress]);

  useEffect(() => {
    setLoading(true);
    loadCampaign().finally(() => setLoading(false));
  }, [loadCampaign]);

  return (
    <div>
      <PageHeader title="Requests">
        {isManager && (
          <Link href={`/campaigns/${campaignAddress}/requests/new`}>
            <Button content="Add Request" primary floated="right" icon="plus circle" />
          </Link>
        )}
      </PageHeader>
      {!!message && (
        <Message negative={message.type === 'error'} positive={message.type === 'success'}>
          <MessageHeader>{message.type === 'error' ? 'Oops' : 'Success'}</MessageHeader>
          <p style={{ overflowWrap: 'break-word' }}>{message.content}</p>
        </Message>
      )}
      {loading ? (<LoadingIndicator />) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>ID</TableHeaderCell>
              <TableHeaderCell>Description</TableHeaderCell>
              <TableHeaderCell>Amount (ether)</TableHeaderCell>
              <TableHeaderCell>Recipient</TableHeaderCell>
              <TableHeaderCell>Approvals</TableHeaderCell>
              <TableHeaderCell>Approve</TableHeaderCell>
              <TableHeaderCell>Finalize</TableHeaderCell>
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
      )}
      <div>Found {requests.length} requests.</div>
    </div>
  );
};

export default RequestIndex;
