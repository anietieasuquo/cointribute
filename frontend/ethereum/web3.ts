import 'dotenv/config';
import Web3 from 'web3';
import { RegisteredSubscription } from 'web3-eth';

const infuraUrl = process.env.INFURA_URL;

if (!infuraUrl) {
  throw new Error('Please provide infura url.');
}

let web3: Web3<RegisteredSubscription>;

// @ts-ignore
if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  console.log('Injected ethereum detected.');
// @ts-ignore
  window.ethereum.request({ method: 'eth_requestAccounts' });
// @ts-ignore
  web3 = new Web3(window.ethereum);
} else {
  console.log('No web3 instance injected, using infura.');
  const provider = new Web3.providers.HttpProvider(infuraUrl);
  web3 = new Web3(provider);
}

export default web3;
