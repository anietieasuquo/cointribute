import React from 'react';
import { Menu } from 'semantic-ui-react';
import Link from 'next/link';

const Header = () => {
  return (
    <Menu style={{ marginTop: '10px' }}>
      <Link href="/" legacyBehavior>
        <a className="item">CrowdCoin</a>
      </Link>

      <Menu.Menu position="right">
        <Link href="/" legacyBehavior>
          <a className="item">Campaigns</a>
        </Link>
        <Link href="/campaigns/new" legacyBehavior>
          <a className="item">+</a>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};

export { Header };
