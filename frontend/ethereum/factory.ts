import 'dotenv/config';
import web3 from '@ethereum/web3';
import CampaignFactory from '@ethereum/build/CampaignFactory.json';

const factoryAddress = process.env.FACTORY_ADDRESS;

if (!factoryAddress) {
  throw new Error('Please provide factory address.');
}

const instance = new web3.eth.Contract(CampaignFactory.abi, factoryAddress);

export default instance;
