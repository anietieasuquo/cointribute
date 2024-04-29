'use client';
import React, { FormEvent, useState } from 'react';
import { Button, Form, Input, Message, MessageHeader } from 'semantic-ui-react';
import getCampaignInstance from '@/ethereum/campaign';
import web3 from '@/ethereum/web3';
import { UserMessage } from '@/types/dto';

const ContributionForm = ({ address, refresh }: { address: string, refresh: () => void; }) => {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<UserMessage | undefined>(undefined);

  const handleContribute = async (event: FormEvent) => {
    event.preventDefault();
    try {
      if (!value || isNaN(Number(value))) {
        setMessage({ type: 'error', content: 'Contribution must be a number.' });
        return;
      }

      if (!value || isNaN(Number(value)) || Number(value) <= 0) {
        setMessage({ type: 'error', content: 'Contribution must be a number greater than 0.' });
        return;
      }

      setMessage(undefined);
      setLoading(true);
      console.log('Creating contribution with minimum contribution:', value);
      const campaign = getCampaignInstance(address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(value, 'ether')
      });
      console.log('Contribution created:', value);
      setMessage({ type: 'success', content: 'Contribution created!' });
      refresh();
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', content: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form onSubmit={handleContribute} error={!!message && message.type === 'error'}>
        <Form.Field>
          <Input
            label="ether"
            labelPosition="right"
            onChange={(e) => setValue(e.target.value)}
            disabled={loading}
          />
        </Form.Field>
        {message !== undefined && (
          <Message negative={message.type === 'error'} positive={message.type === 'success'}>
            <MessageHeader>{message.type === 'error' ? 'Oops' : 'Success'}</MessageHeader>
            <p style={{ overflowWrap: 'break-word' }}>{message.content}</p>
          </Message>
        )}
        <Button content="Contribute" primary onClick={handleContribute} disabled={loading} loading={loading} />
      </Form>
    </div>
  );
};

export { ContributionForm };
