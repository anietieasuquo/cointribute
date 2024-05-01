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

const dateTimeFormat = (_timestamp: number | Date): string => {
  let timestamp = _timestamp instanceof Date ? _timestamp.getTime() : _timestamp;
  if (timestamp.toString().length <= 10) {
    timestamp *= 1000;
  }

  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds();

  const formattedDate = `${year}-${month}-${day}`;
  const formattedTime = `${hours}:${minutes}:${seconds}`;

  return `${formattedDate} ${formattedTime}`;
};

const stringToTimestamp = (strDateTime: string): number => {
  const parts = strDateTime.split(' ');
  const dateParts = parts[0].split('-');
  const dateTimeString: string = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${parts[1]}:00`;
  const dateTime = new Date(dateTimeString);
  return dateTime.getTime();
};

export { getCampaignSummary, dateTimeFormat, stringToTimestamp };
