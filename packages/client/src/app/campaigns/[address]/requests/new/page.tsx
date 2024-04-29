'use client';
import React, { useState } from 'react';
import { Button, Form, Input, Message, MessageHeader } from 'semantic-ui-react';
import getCampaignInstance from '@/ethereum/campaign';
import web3 from '@/ethereum/web3';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CampaignSummary } from '@/types/dto';
import { getCampaignSummary } from '@/utils/contract-utils';

const RequestNew = ({ params }) => {
  const router = useRouter();
  const contractAddress = params.address as string;
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('0');
  const [recipient, setRecipient] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const checkValidations = () => {
    if (!description || description.length === 0) {
      setErrorMessage('Description is required.');
      return false;
    }

    if (!value || isNaN(Number(value)) || Number(value) <= 0) {
      setErrorMessage('Value must be a number.');
      return false;
    }

    if (!recipient || recipient.length === 0) {
      setErrorMessage('Recipient is required.');
      return false;
    }

    return true;
  };

  const handleCreate = async (e: any) => {
    e.preventDefault();
    try {
      if (!checkValidations()) return;

      const accounts = await web3.eth.getAccounts();
      const campaign = getCampaignInstance(contractAddress);
      const summary: CampaignSummary = await getCampaignSummary(contractAddress, campaign);

      if (accounts[0] !== summary.manager) {
        setErrorMessage('Only the manager can create requests.');
        return false;
      }

      setErrorMessage(undefined);
      setLoading(true);
      console.log('Creating campaign request with description:', description);
      await campaign.methods.createRequest(description, web3.utils.toWei(value, 'ether'), recipient).send({
        from: accounts[0]
      });
      router.push(`/campaigns/${contractAddress}/requests`);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Create a Request</h3>
      <div style={{ margin: '10px 0' }}>
        <Link href={`/campaigns/${contractAddress}/requests`} aria-disabled={loading}>
          Back
        </Link>
      </div>
      <Form onSubmit={handleCreate} error={errorMessage !== undefined}>
        <Form.Field>
          <label>Description</label>
          <Input
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
        </Form.Field>
        <Form.Field>
          <label>Amount</label>
          <Input
            label="ether"
            labelPosition="right"
            onChange={(e) => setValue(e.target.value)}
            disabled={loading}
          />
        </Form.Field>
        <Form.Field>
          <label>Recipient</label>
          <Input
            onChange={(e) => setRecipient(e.target.value)}
            disabled={loading}
          />
        </Form.Field>
        {errorMessage !== undefined && (
          <Message negative>
            <MessageHeader>Oops</MessageHeader>
            <p style={{ overflowWrap: 'break-word' }}>{errorMessage}</p>
          </Message>
        )}
        <Button content="Create Request" primary onClick={handleCreate} disabled={loading} loading={loading} />
      </Form>
    </div>
  );
};

export default RequestNew;
