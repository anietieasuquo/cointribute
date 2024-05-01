'use client';
import web3 from './web3';
import 'dotenv/config';
import CampaignFactory from './build/CampaignFactory.json';

const factoryAddress: string = '0x232943f6216D17737d330C7eD588e3C6E4CD3a35';

if (!factoryAddress) {
  throw new Error('Please provide factory address.');
}

const instance = new web3.eth.Contract(CampaignFactory.abi, factoryAddress);

export default instance;
