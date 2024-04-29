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
}
