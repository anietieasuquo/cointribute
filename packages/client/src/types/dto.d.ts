export interface Reward {
  title: string;
  description: string;
  value: number;
  imageUrl: string;
  category: string;
  availableQuantity: number;
  deadLine: number;
}

export interface MetaData {
  title: string;
  subTitle: string;
  description: string;
  category: string;
  subCategory: string;
  location: string;
  imageUrl: string;
  launchDate: number;
  durationInDays: number;
}

export interface CampaignSummary {
  minimumContribution: number;
  balance: number;
  requestsCount: number;
  contributorsCount: number;
  manager: string;
  contractAddress: string;
  targetAmount: number;
  dateCreated: number;
  contributionsCount?: number;
  reward?: Reward;
  metaData?: MetaData;
}

export interface UserMessage {
  type: 'error' | 'success';
  content: string;
}

export interface RequestApproval {
  address: string;
  approved: boolean;
}

export interface CampaignRequest {
  id: string;
  description: string;
  value: number;
  recipient: string;
  complete: boolean;
  approvalCount: number;
  contributorsCount: number;
  approvals?: RequestApproval[];
  dateCreated: number;
}

export interface CampaignContribution {
  id: string;
  contributor: string;
  value: number;
  dateCreated: number;
}

export interface CampaignContributor {
  id: string;
  contributor: string;
  totalContribution: number;
  lastContributionDate: number;
  shareHolding: number;
  rank: number;
}

export interface ContributorRankAndPercentage {
  percentage: number;
  rank: number;
}
