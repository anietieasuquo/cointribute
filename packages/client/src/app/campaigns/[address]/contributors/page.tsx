'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { Grid, GridColumn, GridRow, Table, TableBody, TableHeader, TableHeaderCell, TableRow } from 'semantic-ui-react';
import getCampaignInstance from '@/ethereum/campaign';
import { CampaignContributor, CampaignSummary } from '@/types/dto';
import { getCampaignContributions, getCampaignSummary, getContributorRankAndPercentage } from '@/utils/contract-utils';
import { ContributorRow } from '@/components/ContributorRow';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { PageHeader } from '@/components/PageHeader';
import web3 from '@/ethereum/web3';

const getCampaignContributors = (async (address: string): Promise<CampaignContributor[]> => {
  console.log('Loading campaign from ethereum server...', address);
  const campaign = getCampaignInstance(address);
  const promises = await Promise.all([
    getCampaignSummary(address, campaign),
    getCampaignContributions(address, campaign)
  ]);
  const summary: CampaignSummary = promises[0];
  const contributionsResult = promises[1];

  if (!summary || !contributionsResult) throw new Error('Contributors not found.');

  let count = 0;
  return (await Promise.all(
    Array(summary.contributorsCount).fill(0).map(async (element, index) => {
      const request = (await campaign.methods.contributorsList(index).call()) as any;
      if (!request) throw new Error('Contributor not found.');
      const contributorAddress = request.contributor as string;
      const percentageAndRank = getContributorRankAndPercentage(contributorAddress, contributionsResult);
      return {
        id: String(++count),
        contributor: contributorAddress,
        totalContribution: Number(request.totalContribution),
        shareHolding: percentageAndRank.percentage,
        rank: percentageAndRank.rank,
        lastContributionDate: Number(request.lastContributionDate)
      };
    })
  ));
});

const ContributorsIndex = ({ params }) => {
  const campaignAddress = params.address as string;
  const [contributors, setContributors] = useState<CampaignContributor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentAddress, setCurrentAddress] = useState<string>('');

  const loadCampaign = useCallback(async () => {
    const campaignContributors = await getCampaignContributors(campaignAddress);
    setContributors(campaignContributors);

    const accounts = await web3.eth.getAccounts();
    setCurrentAddress(accounts[0]);
  }, [campaignAddress]);

  useEffect(() => {
    setLoading(true);
    loadCampaign().finally(() => setLoading(false));
  }, [loadCampaign]);

  return (
    <div>
      <PageHeader title="Contributors" />
      {loading ? (<LoadingIndicator />) :
        <Grid>
          <GridRow>
            <GridColumn>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell>ID</TableHeaderCell>
                    <TableHeaderCell>Address</TableHeaderCell>
                    <TableHeaderCell>Contributions (ether)</TableHeaderCell>
                    <TableHeaderCell>Shares</TableHeaderCell>
                    <TableHeaderCell>Rank</TableHeaderCell>
                    <TableHeaderCell>Last Contribution Date</TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contributors.map((contributor, index) => (
                    <ContributorRow
                      key={index}
                      index={index}
                      campaignAddress={campaignAddress}
                      contributor={contributor}
                      currentAddress={currentAddress}
                    />
                  ))}
                </TableBody>
              </Table>
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn>
              <div>Found {contributors.length} contributors.</div>
            </GridColumn>
          </GridRow>
        </Grid>
      }
    </div>
  );
};

export default ContributorsIndex;
