import { CampaignSummary, MetaData, Reward } from '@/types/dto';
import getCampaignInstance from '@/ethereum/campaign';
import { Contract } from 'web3';

const getCampaignSummary = async (address: string, instance?: Contract<any>): Promise<CampaignSummary> => {
  console.log('Loading campaign from ethereum...', address);
  const campaign = instance ? instance : getCampaignInstance(address);
  if (!campaign) throw new Error('Campaign not found.');
  const result = await campaign.methods.getSummary().call();
  if (!result) throw new Error('Campaign not found.');
  return {
    minimumContribution: Number(result[0]),
    balance: Number(result[1]),
    requestsCount: Number(result[2]),
    contributorsCount: Number(result[3]),
    manager: result[4] as string,
    targetAmount: Number(result[5]),
    dateCreated: Number(result[6]),
    reward: result[7] as Reward,
    metaData: result[8] as MetaData,
    contractAddress: address
  };
};

const dateTimeFormat = (time: number | Date): string => {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds();

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export { getCampaignSummary, dateTimeFormat };
