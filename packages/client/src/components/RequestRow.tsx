'use client';
import React, { SyntheticEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Confirm, TableCell, TableRow } from 'semantic-ui-react';
import getCampaignInstance from '@/ethereum/campaign';
import web3 from '@/ethereum/web3';
import { CampaignRequest, UserMessage } from '@/types/dto';

const RequestRow = ({ request, index, campaignAddress, isManager, setMessage, refresh }: {
  request: CampaignRequest;
  index: number;
  campaignAddress: string;
  isManager: boolean;
  setMessage: (message?: UserMessage | undefined) => void;
  refresh: () => void;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    show: boolean;
    message?: string;
    action?: string;
  }>({ show: false });
  const { id, description, value, recipient, approvalCount, complete, contributorsCount } = request;

  const confirmUserAction = (action: string) => {
    return window.confirm(`Are you sure you want to ${action} this request?`);
  };

  const handleApprove = async (event: SyntheticEvent<any>) => {
    event.preventDefault();
    if (!confirmUserAction('approve')) return;
    try {
      setLoading(true);
      setMessage(undefined);
      const campaign = getCampaignInstance(campaignAddress);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.approveRequest(index).send({
        from: accounts[0]
      });
      router.replace(`/campaigns/${campaignAddress}/requests`);
      setMessage({ type: 'success', content: 'Request approved!' });
      refresh();
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', content: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleFinalize = async (event: SyntheticEvent<any>) => {
    event.preventDefault();
    if (!confirmUserAction('finalize')) return;
    try {
      setLoading(true);
      setMessage(undefined);
      const campaign = getCampaignInstance(campaignAddress);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.finalizeRequest(index).send({
        from: accounts[0]
      });
      router.replace(`/campaigns/${campaignAddress}/requests`);
      setMessage({ type: 'success', content: 'Request finalized!' });
      refresh();
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', content: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmation = async (event: SyntheticEvent<any>) => {
    if (!confirmation.show) return;
    if (confirmation.action === 'approve') {
      await handleApprove(event);
    } else if (confirmation.message === 'finalize') {
      await handleFinalize(event);
    }
    setConfirmation({ show: false });
  };

  const showConfirmation = (action: string) => {
    setConfirmation({ show: true, action, message: `Are you sure you want to ${action} this request?` });
  };

  const readyToFinalize = approvalCount > 0.5 * contributorsCount;

  return (
    <>
      <TableRow key={id} disabled={complete} positive={readyToFinalize && !complete}>
        <TableCell>{id}</TableCell>
        <TableCell>{description}</TableCell>
        <TableCell>{web3.utils.fromWei(value, 'ether')}</TableCell>
        <TableCell>{recipient}</TableCell>
        <TableCell>{approvalCount}/{contributorsCount}</TableCell>
        <TableCell>
          <Button
            color="green"
            basic onClick={() => showConfirmation('approve')}
            loading={loading}
            disabled={loading || complete || isManager}>
            Approve
          </Button>
        </TableCell>
        <TableCell>
          <Button
            color="teal"
            basic onClick={() => showConfirmation('finalize')}
            loading={loading}
            disabled={loading || complete || !isManager || !readyToFinalize}>
            Finalize
          </Button>
        </TableCell>
      </TableRow>
      <Confirm
        content={confirmation.message}
        open={confirmation.show}
        cancelButton="Never mind"
        confirmButton="Let's do it"
        onCancel={() => setConfirmation({ show: false })}
        onConfirm={handleConfirmation}
      />
    </>
  );
};

export { RequestRow };
