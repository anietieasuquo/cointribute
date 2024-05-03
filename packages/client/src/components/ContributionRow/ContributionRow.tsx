'use client';
import React from 'react';
import { TableCell, TableRow } from 'semantic-ui-react';
import web3 from '@/ethereum/web3';
import { CampaignContribution } from '@/types/dto';
import { dateTimeFormat } from '@/utils/contract-utils';
import Link from 'next/link';

const ContributionRow = ({ contribution, campaignAddress, index, currentAddress }: {
  contribution: CampaignContribution;
  campaignAddress: string;
  index: number;
  currentAddress: string;
}) => {
  const { id, contributor, value, dateCreated } = contribution;

  return (
    <TableRow key={id} positive={currentAddress === contributor}>
      <TableCell>{++index}</TableCell>
      <TableCell>
        <Link href={`/campaigns/${campaignAddress}/contributors/${contributor}`}>{contributor}</Link>
      </TableCell>
      <TableCell>{web3.utils.fromWei(value, 'ether')}</TableCell>
      <TableCell>{dateTimeFormat(dateCreated)}</TableCell>
    </TableRow>
  );
};

export { ContributionRow };
