'use client';
import React from 'react';
import { List, ListItem } from 'semantic-ui-react';
import { Reward } from '@/types/dto';
import web3 from '@/ethereum/web3';
import { dateTimeFormat, ipfsToUrl } from '@/utils/common-utils';

const RewardDetails = ({ reward }: { reward: Reward }) => {
  const { title, description, value, imageUrl, category, availableQuantity, deadLine } = reward;

  return (
    <div>
      <div>
        <img
          src={ipfsToUrl(imageUrl)}
          alt={`Reward image [${title}]`}
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
      <List divided relaxed="very">
        <ListItem
          header={title}
          description="Title"
          value={title}
        />
        <ListItem
          header={description}
          description="Description"
          value={description}
        />
        <ListItem
          header={web3.utils.fromWei(value, 'ether')}
          description="Reward Value (ether)"
          value={String(value)}
        />
        <ListItem header={category} description="Category" value={category} />
        <ListItem
          header={Number(availableQuantity)}
          description="Available Quantity"
          value={String(availableQuantity)}
        />
        <ListItem
          header={dateTimeFormat(Number(deadLine))}
          description="Deadline"
          value={String(deadLine)}
        />
      </List>
    </div>
  );
};

export { RewardDetails };
