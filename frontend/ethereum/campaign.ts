import web3 from '@ethereum/web3';
import Campaign from '@ethereum/build/Campaign.json';

const getCampaignInstance = (address: string) => {
  return new web3.eth.Contract(Campaign.abi, address);
};
export default getCampaignInstance;
