import { task } from 'hardhat/config'
import '@nomiclabs/hardhat-waffle'
import secrets from './secrets.json'

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (args, hre) => {
  const accounts = await hre.ethers.getSigners() //hre comes from hardhat-waffle

  for (const account of accounts) {
    console.log(await account.address)
  }
})
// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: 'localhost',
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
      accounts: [
        '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
        '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
        '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
      ],
    },
    hardhat: {},
    testnet: {
      url: secrets.url,
      //url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      //accounts: {mnemonic: mnemonic
      accounts: [secrets.key],
    },
    mainnet: {
      url: 'https://bsc-dataseed.binance.org/',
      chainId: 56,
      gasPrice: 20000000000,
      accounts: { mnemonic: secrets.mnemonic },
    },
  },
  solidity: {
    version: '0.5.16',
    settings: {
      optimizer: {
        enabled: true,
      },
    },
  },
  paths: {
    sources: './contracts',
    tests: './hardhattest',
    cache: './cache',
    artifacts: './artifacts',
  },
  mocha: {
    timeout: 200000,
  },

  //,
  //solidity: '0.8.4',
}
