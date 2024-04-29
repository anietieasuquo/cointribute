'use client';
import React from 'react';
import Link from 'next/link';
import { Button, Grid, GridColumn, GridRow } from 'semantic-ui-react';
import { CampaignIndex } from '@/components/CampaignIndex';
import { Layout } from '@/components/Layout';


export default () => {
  return (
    <Layout>
      <Grid>
        <GridRow className="equal width">
          <GridColumn className="middle aligned">
            <h3>Open Campaigns</h3>
          </GridColumn>
          <GridColumn floated="right">
            <Link href="/campaigns/new">
              <Button content="New Campaign" icon="add circle" primary floated="right" />
            </Link>
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn>
            <CampaignIndex />
          </GridColumn>
        </GridRow>
      </Grid>
    </Layout>
  );
};
