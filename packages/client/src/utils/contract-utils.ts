import { CampaignContribution, CampaignSummary, ContributorRankAndPercentage, MetaData, Reward } from '@/types/dto';
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
    contributionsCount: Number(result[9]),
    contractAddress: address
  };
};

const getCampaignContributions = (async (address: string, instance?: Contract<any>): Promise<CampaignContribution[]> => {
  console.log('Loading campaign from ethereum server...', address);
  const campaign = instance ? instance : getCampaignInstance(address);
  const summary: CampaignSummary = await getCampaignSummary(address, campaign);
  let count = 0;
  return (await Promise.all(
    Array(summary.contributionsCount).fill(0).map(async (element, index) => {
      const request = (await campaign.methods.contributions(index).call()) as any;
      return {
        id: String(++count),
        contributor: request.contributor as string,
        value: Number(request.value),
        dateCreated: Number(request.dateCreated)
      };
    })
  ));
});

const stringToTimestamp = (strDateTime: string): number => {
  const parts = strDateTime.split(' ');
  const dateParts = parts[0].split('-');
  const dateTimeString: string = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${parts[1]}:00`;
  const dateTime = new Date(dateTimeString);
  return dateTime.getTime();
};

const amountString = (amount: number, percentage?: boolean | undefined): string => {
  return `${(amount || 0).toFixed(2)}${percentage ? '%' : ''}`;
};

const getContributorRankAndPercentage = (address: string, contributions: CampaignContribution[]): ContributorRankAndPercentage => {
  if (contributions.length === 0) {
    throw new Error('Contributions is empty.');
  }

  const totalContributions: { [key: string]: number } = {};
  let totalAmount = 0;
  contributions.forEach(contribution => {
    totalContributions[contribution.contributor] = (totalContributions[contribution.contributor] || 0) + contribution.value;
    totalAmount += contribution.value;
  });

  const sortedContributors = Object.entries(totalContributions)
    .sort((a, b) => b[1] - a[1]);

  const userIndex = sortedContributors.findIndex(([contributor, _]) => contributor === address);
  if (userIndex === -1) {
    throw new Error('Contributor not found.');
  }

  const contributorTotalContribution = totalContributions[address];
  const percentage = (contributorTotalContribution / (totalAmount > 0 ? totalAmount : 1)) * 100;
  const rank = userIndex + 1;
  return { percentage, rank };
};

export {
  getCampaignSummary,
  getCampaignContributions,
  stringToTimestamp,
  amountString,
  getContributorRankAndPercentage
};
