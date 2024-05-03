import 'dotenv/config';
import HDWalletProvider from '@truffle/hdwallet-provider';
import { Web3 } from 'web3';
import compiledFactory from '@/ethereum/build/CampaignFactory.json';

const mnemonic = process.env.MNEMONIC;
const infuraUrl = process.env.NEXT_PUBLIC_INFURA_URL;
const gasLimit = process.env.GAS_LIMIT || '1000000';

if (!mnemonic || !infuraUrl) {
  throw new Error('Please provide mnemonic and infura url.');
}

const provider: HDWalletProvider = new HDWalletProvider(mnemonic, infuraUrl);
// @ts-ignore
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ gas: gasLimit, from: accounts[0] });

  console.log('Contract deployed to', result.options.address);
  provider.engine.stop();
};
deploy().then(() => process.exit(0));
