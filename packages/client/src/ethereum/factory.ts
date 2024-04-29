'use client';
import web3 from './web3';
import 'dotenv/config';
import CampaignFactory from './build/CampaignFactory.json';

const factoryAddress: string = '0xF54d08ecBBe78483226A116E6A268Fa977BC0619';

if (!factoryAddress) {
  throw new Error('Please provide factory address.');
}

const instance = new web3.eth.Contract(CampaignFactory.abi, factoryAddress);

export default instance;
