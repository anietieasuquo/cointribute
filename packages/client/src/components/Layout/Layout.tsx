'use client';
import React from 'react';
import { Container, Grid, GridColumn, GridRow } from 'semantic-ui-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const Layout = (props: any) => {
  return (
    <Container>
      <Header />
      <Grid>
        <GridRow>
          <GridColumn>
            <div style={{ marginTop: '20px' }}>
              {props.children}
            </div>
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn>
            <Footer />
          </GridColumn>
        </GridRow>
      </Grid>
    </Container>
  );
};

export { Layout };
