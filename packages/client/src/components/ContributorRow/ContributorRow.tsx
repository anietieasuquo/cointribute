'use client';
import React from 'react';
import { TableCell, TableRow } from 'semantic-ui-react';
import web3 from '@/ethereum/web3';
import { CampaignContributor } from '@/types/dto';
import { amountString, dateTimeFormat } from '@/utils/contract-utils';
import Link from 'next/link';

const ContributorRow = ({ contributor, campaignAddress, index, currentAddress }: {
  contributor: CampaignContributor;
  campaignAddress: string;
  index: number;
  currentAddress: string;
}) => {
  const { contributor: address, totalContribution, shareHolding, rank, lastContributionDate } = contributor;

  return (
    <TableRow key={index} positive={currentAddress === address}>
      <TableCell>{++index}</TableCell>
      <TableCell><Link href={`/campaigns/${campaignAddress}/contributors/${address}`}>{address}</Link></TableCell>
      <TableCell>{web3.utils.fromWei(totalContribution, 'ether')}</TableCell>
      <TableCell>{amountString(shareHolding, true)}</TableCell>
      <TableCell>{rank}</TableCell>
      <TableCell>{dateTimeFormat(lastContributionDate)}</TableCell>
    </TableRow>
  );
};

export { ContributorRow };
