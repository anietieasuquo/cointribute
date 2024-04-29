import web3 from './web3';
import { Contract } from 'web3';
import Campaign from '@/ethereum/build/Campaign.json';

const getCampaignInstance = (address: string): Contract<any> => {
  return new web3.eth.Contract(Campaign.abi, address);
};
export default getCampaignInstance;
