'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { Grid, GridColumn, GridRow, Table, TableBody, TableHeader, TableHeaderCell, TableRow } from 'semantic-ui-react';
import { CampaignContribution } from '@/types/dto';
import { getCampaignContributions } from '@/utils/contract-utils';
import { ContributionRow } from '@/components/ContributionRow';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { PageHeader } from '@/components/PageHeader';
import web3 from '@/ethereum/web3';

const ContributionsIndex = ({ params }) => {
  const campaignAddress = params.address as string;
  const [contributions, setContributions] = useState<CampaignContribution[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentAddress, setCurrentAddress] = useState<string>('');

  const loadCampaign = useCallback(async () => {
    const campaignContributions = await getCampaignContributions(campaignAddress);
    setContributions(campaignContributions);

    const accounts = await web3.eth.getAccounts();
    setCurrentAddress(accounts[0]);
  }, [campaignAddress]);

  useEffect(() => {
    setLoading(true);
    loadCampaign().finally(() => setLoading(false));
  }, [loadCampaign]);

  return (
    <div>
      <PageHeader title="Contributions" />
      {loading ? (<LoadingIndicator />) :
        <Grid>
          <GridRow>
            <GridColumn>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell>ID</TableHeaderCell>
                    <TableHeaderCell>Contributor</TableHeaderCell>
                    <TableHeaderCell>Amount (ether)</TableHeaderCell>
                    <TableHeaderCell>Contribution Date</TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contributions.map((contribution, index) => (
                    <ContributionRow
                      key={index}
                      index={index}
                      campaignAddress={campaignAddress}
                      contribution={contribution}
                      currentAddress={currentAddress}
                    />
                  ))}
                </TableBody>
              </Table>
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn>
              <div>Found {contributions.length} contributions.</div>
            </GridColumn>
          </GridRow>
        </Grid>
      }
    </div>
  );
};

export default ContributionsIndex;
