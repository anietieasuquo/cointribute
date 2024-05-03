import React from 'react';
import { Image, Loader, Segment } from 'semantic-ui-react';

const LoadingIndicator = () => {
  return (
    <Segment>
      <Loader active />
      <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
    </Segment>
  );
};

export { LoadingIndicator };
