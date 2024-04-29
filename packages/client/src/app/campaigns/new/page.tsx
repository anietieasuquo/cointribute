'use client';
import React, { SyntheticEvent, useState } from 'react';
import { Button, Form, Input, Message, MessageHeader } from 'semantic-ui-react';
import { useRouter } from 'next/navigation';
import factory from '@/ethereum/factory';
import web3 from '@/ethereum/web3';

const CampaignNew = () => {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const handleCreate = async (event: SyntheticEvent) => {
    event.preventDefault();
    try {
      if (!value || isNaN(Number(value))) {
        setErrorMessage('Contribution must be a number.');
        return;
      }

      if (!value || isNaN(Number(value)) || Number(value) <= 0) {
        setErrorMessage('Minimum contribution is required.');
        return;
      }

      setErrorMessage(undefined);
      setLoading(true);
      console.log('Creating campaign with minimum contribution:', value);
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createCampaign(Number(value)).send({
        from: accounts[0]
      });
      const campaigns: string[] = await factory.methods.getDeployedCampaigns().call();
      console.log('CampaignIndex:', campaigns);
      const created = campaigns[campaigns.length - 1];
      console.log('Created:', created);
      router.push('/');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Create a Campaign</h3>
      <Form onSubmit={handleCreate} error={errorMessage !== undefined}>
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input
            label="wei"
            labelPosition="right"
            onChange={(e) => setValue(e.target.value)}
            disabled={loading}
          />
        </Form.Field>
        {errorMessage !== undefined && (
          <Message negative>
            <MessageHeader>Oops</MessageHeader>
            <p>{errorMessage}</p>
          </Message>
        )}
        <Button content="New Campaign" primary onClick={handleCreate} disabled={loading} loading={loading} />
      </Form>
    </div>
  );
};

export default CampaignNew;
