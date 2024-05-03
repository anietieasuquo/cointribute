import React from 'react';
import { Header, Segment } from 'semantic-ui-react';

const NotFoundMessage = ({ content }: { content: string; }) => {
  return (
    <Segment>
      <Header as="h3">There are no {content}!</Header>
    </Segment>
  );
};

export { NotFoundMessage };
