'use client';
import React from 'react';
import { Grid, GridColumn, GridRow } from 'semantic-ui-react';
import { BackButton } from '@/components/BackButton';
import '@/components/PageHeader/PageHeader.styles.scss';

const PageHeader = ({ title, showBack = true, children }: {
  title: string;
  showBack?: boolean | undefined;
  children?: React.ReactNode;
}) => {
  return (
    <Grid>
      <GridRow className="equal width">
        <GridColumn className="title-container">
          <h3>{title}</h3>
        </GridColumn>
        <GridColumn width={6} floated="right">
          <Grid>
            <GridRow className="equal width">
              {showBack && <GridColumn floated="right">
                <BackButton />
              </GridColumn>}
              {children && <GridColumn floated="right">
                {children}
              </GridColumn>}
            </GridRow>
          </Grid>
        </GridColumn>
      </GridRow>
    </Grid>
  );
};

export { PageHeader };
