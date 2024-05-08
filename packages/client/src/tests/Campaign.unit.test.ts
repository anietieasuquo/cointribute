import ganache from 'ganache';
import { Web3 } from 'web3';
import compiledFactory from '@/ethereum/build/CampaignFactory.json';
import compiledCampaign from '@/ethereum/build/Campaign.json';

const web3 = new Web3(ganache.provider());
const gasPrice = '9900000';

describe('Campaigns', () => {
  let accounts;
  let factory;
  let campaignAddress;
  let campaign;
  beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(compiledFactory.abi)
      .deploy({ data: compiledFactory.evm.bytecode.object })
      .send({ from: accounts[0], gas: gasPrice });

    const numbers = [
      100,
      Date.now(),
      30,
      1000,
      1000,
      100,
      Date.now()
    ];
    const strings = [
      'Test contract title',
      'Test contract subtitle',
      'Test contract description',
      'Art',
      'Drawing',
      'US',
      'https://image.io/1',
      'Free tour',
      'Free tour around the world',
      'https://image.io/2',
      'Art'
    ];

    await factory.methods.createCampaign(numbers, strings).send({
      from: accounts[0],
      gas: gasPrice
    });

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    campaign = new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
  });

  it('deploys a factory and a campaign', () => {
    expect(factory.options.address).toBeTruthy();
    expect(campaign.options.address).toBeTruthy();
  });

  it('marks caller as the campaign manager', async () => {
    const summary = await campaign.methods.getSummary().call();
    expect(accounts[0]).toEqual(summary[4]);
  });

  it('allows people to contribute money and marks them as contributors', async () => {
    await campaign.methods.contribute().send({
      value: '200',
      from: accounts[1]
    });
    const isContributor = await campaign.methods.getContributorSummary(accounts[1]).call();
    expect(isContributor).toBeTruthy();
  });

  it('requires a minimum contribution', async () => {
    try {
      await campaign.methods.contribute().send({
        value: '5',
        from: accounts[1]
      });
      expect(true).toBeFalsy();
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });

  it('allows a manager to make a payment request', async () => {
    await campaign.methods
      .createRequest('Buy batteries', '100', accounts[1])
      .send({
        from: accounts[0],
        gas: '1000000'
      });
    const request = await campaign.methods.requests(0).call();

    expect('Buy batteries').toEqual(request.description);
  });

  it('processes requests', async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('1', 'ether')
    });

    await campaign.methods
      .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
      .send({ from: accounts[0], gas: '1000000' });

    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: '1000000'
    });

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: '1000000'
    });

    let balance = Number(await web3.eth.getBalance(accounts[1]));
    balance = Number(web3.utils.fromWei(balance, 'ether'));
    balance = parseFloat(String(balance));
    expect(balance > 104).toBeTruthy();
  });
});
