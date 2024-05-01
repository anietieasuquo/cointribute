'use client';
import React, { SyntheticEvent, useState } from 'react';
import {
  Button,
  Form,
  Grid,
  GridColumn,
  GridRow,
  Input,
  Message,
  MessageHeader,
  Segment,
  Select
} from 'semantic-ui-react';
import { DateTimeInput } from 'semantic-ui-calendar-react';
import { useRouter } from 'next/navigation';
import web3 from '@/ethereum/web3';
import { categories, countries, subCategories } from '@cointribute/common';
import { stringToTimestamp } from '@/utils/contract-utils';
import factory from '@/ethereum/factory';

const CampaignNew = () => {
  const router = useRouter();
  const [minimumContribution, setMinimumContribution] = useState('');
  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [launchDate, setLaunchDate] = useState('');
  const [durationInDays, setDurationInDays] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [rewardTitle, setRewardTitle] = useState('');
  const [rewardDescription, setRewardDescription] = useState('');
  const [rewardValue, setRewardValue] = useState('');
  const [rewardImageUrl, setRewardImageUrl] = useState('');
  const [rewardCategory, setRewardCategory] = useState('');
  const [rewardAvailabilityQuantity, setRewardAvailabilityQuantity] = useState('');
  const [rewardDeadLine, setRewardDeadLine] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const handleCreate = async (event: SyntheticEvent) => {
    event.preventDefault();
    try {
      const allFields = [
        minimumContribution,
        title,
        subTitle,
        description,
        category,
        subCategory,
        location,
        imageUrl,
        launchDate,
        durationInDays,
        targetAmount,
        rewardTitle,
        rewardDescription,
        rewardValue,
        rewardImageUrl,
        rewardCategory,
        rewardAvailabilityQuantity,
        rewardDeadLine
      ];

      console.log('All Fields:', allFields);

      const numberFields = [
        minimumContribution,
        durationInDays,
        targetAmount,
        rewardValue,
        rewardAvailabilityQuantity
      ];

      if (allFields.some((field) => !field)) {
        setErrorMessage('All fields are required.');
        return;
      }

      if (numberFields.some((field) => field && (isNaN(Number(field)) || Number(field) <= 0))) {
        setErrorMessage('The following fields must be non-zero numbers: Minimum Contribution, Duration, Target Amount, Reward Amount, Reward Available Quantity.');
        return;
      }

      setErrorMessage(undefined);
      setLoading(true);
      console.log('Creating campaign with minimum contribution:', minimumContribution);
      const accounts = await web3.eth.getAccounts();
      const numbers = [
        Number(minimumContribution),
        stringToTimestamp(launchDate),
        Number(durationInDays),
        Number(targetAmount),
        Number(rewardValue),
        Number(rewardAvailabilityQuantity),
        stringToTimestamp(rewardDeadLine)
      ];
      const strings = [
        title,
        subTitle,
        description,
        category,
        subCategory,
        location,
        imageUrl,
        rewardTitle,
        rewardDescription,
        rewardImageUrl,
        rewardCategory
      ];
      console.log('Numbers:', numbers);
      console.log('Strings:', strings);
      await factory.methods.createCampaign(numbers, strings).send({
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
        <Grid>
          <GridRow className="equal width">
            <GridColumn>
              <Segment>
                <Form.Field>
                  <label>Title</label>
                  <Input
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={loading}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Subtitle</label>
                  <Input
                    onChange={(e) => setSubTitle(e.target.value)}
                    disabled={loading}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Description</label>
                  <Input
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={loading}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Category</label>
                  <Select
                    options={categories}
                    placeholder="Select Category"
                    defaultValue="Art"
                    onChange={(e, { value }) => setCategory(value as string)}
                    disabled={loading}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Sub Category</label>
                  <Select
                    options={subCategories}
                    placeholder="Select Sub Category"
                    defaultValue="Flight"
                    onChange={(e, { value }) => setSubCategory(value as string)}
                    disabled={loading}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Location</label>
                  <Input type="text" placeholder="Search..." action>
                    <input />
                    <Select
                      compact
                      options={countries}
                      defaultValue="US"
                      onChange={(e, { text }) => setLocation(text as string)}
                      disabled={loading}
                    />
                    <Button type="submit">Search</Button>
                  </Input>
                </Form.Field>
                <Form.Field>
                  <label>Image</label>
                  <Input
                    type="file"
                    onChange={(e) => setImageUrl(e.target.value)}
                    disabled={loading}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Launch Date</label>
                  <DateTimeInput
                    name="launchDate"
                    placeholder="Date Time"
                    value={launchDate}
                    iconPosition="left"
                    onChange={(event, { value }) => setLaunchDate(value)}
                    disabled={loading}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Duration</label>
                  <Input
                    label="days"
                    labelPosition="right"
                    onChange={(e) => setDurationInDays(e.target.value)}
                    disabled={loading}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Minimum Contribution</label>
                  <Input
                    label="wei"
                    labelPosition="right"
                    onChange={(e) => setMinimumContribution(e.target.value)}
                    disabled={loading}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Target Amount</label>
                  <Input
                    label="wei"
                    labelPosition="right"
                    onChange={(e) => setTargetAmount(e.target.value)}
                    disabled={loading}
                  />
                </Form.Field>
              </Segment>
            </GridColumn>
            <GridColumn>
              <Segment>
                <Form.Field>
                  <label>Reward Title</label>
                  <Input
                    onChange={(e) => setRewardTitle(e.target.value)}
                    disabled={loading}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Reward Description</label>
                  <Input
                    onChange={(e) => setRewardDescription(e.target.value)}
                    disabled={loading}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Reward Category</label>
                  <Select
                    options={categories}
                    placeholder="Select Category"
                    defaultValue="Art"
                    onChange={(e, { value }) => setRewardCategory(value as string)}
                    disabled={loading}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Reward Image</label>
                  <Input
                    type="file"
                    onChange={(e) => setRewardImageUrl(e.target.value)}
                    disabled={loading}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Reward Deadline</label>
                  <DateTimeInput
                    name="rewardDeadLine"
                    placeholder="Date Time"
                    value={rewardDeadLine}
                    iconPosition="left"
                    onChange={(event, { value }) => setRewardDeadLine(value)}
                    disabled={loading}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Reward Available Quantity</label>
                  <Input
                    onChange={(e) => setRewardAvailabilityQuantity(e.target.value)}
                    disabled={loading}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Reward Amount</label>
                  <Input
                    label="wei"
                    labelPosition="right"
                    onChange={(e) => setRewardValue(e.target.value)}
                    disabled={loading}
                  />
                </Form.Field>
              </Segment>
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn>
              {errorMessage !== undefined && (
                <Message negative>
                  <MessageHeader>Oops</MessageHeader>
                  <p>{errorMessage}</p>
                </Message>
              )}
              <Button content="New Campaign" primary onClick={handleCreate} disabled={loading} loading={loading} />
            </GridColumn>
          </GridRow>
        </Grid>
      </Form>
    </div>
  );
};

export default CampaignNew;
