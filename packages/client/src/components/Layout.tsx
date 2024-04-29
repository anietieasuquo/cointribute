'use client';
import React from 'react';
import { Container, GridColumn, GridRow } from 'semantic-ui-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const Layout = (props: any) => {
  return (
    <Container>
      <Header />
      <GridRow>
        <GridColumn>
          {props.children}
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn>
          <Footer />
        </GridColumn>
      </GridRow>
    </Container>
  );
};

export { Layout };
