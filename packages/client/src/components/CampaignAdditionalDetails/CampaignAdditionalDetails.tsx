'use client';
import React from 'react';
import { List, ListItem } from 'semantic-ui-react';
import { MetaData } from '@/types/dto';
import { dateTimeFormat } from '@/utils/contract-utils';

const CampaignAdditionalDetails = ({ data }: { data: MetaData }) => {
  const { category, subCategory, location, durationInDays, launchDate } = data;

  return (
    <List divided relaxed="very">
      <ListItem header={category} description="Category" value={category} />
      <ListItem header={subCategory} description="Sub Category" value={subCategory} />
      <ListItem header={location} description="Location" value={location} />
      <ListItem header={Number(durationInDays)} description="Duration in Days" value={String(durationInDays)} />
      <ListItem
        header={dateTimeFormat(Number(launchDate))}
        description="Launch Date"
        value={dateTimeFormat(Number(launchDate))}
      />
    </List>
  );
};

export { CampaignAdditionalDetails };
