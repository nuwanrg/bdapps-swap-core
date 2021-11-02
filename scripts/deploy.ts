import { ethers } from 'hardhat'
import { Contract, Wallet } from 'ethers'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hre from 'hardhat'

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  //const Greeter = await hre.ethers.getContractFactory('Greeter')
  //const greeter = await Greeter.deploy('Hello, Hardhat!')

  //await greeter.deployed()

  //console.log('Greeter deployed to:', greeter.address)

  // We get the MapplexERC20 contract to deploy
  /*  const PancakeERC20 = await hre.ethers.getContractFactory('PancakeERC20')
  const pancakeERC20 = await PancakeERC20.deploy()
  await pancakeERC20.deployed()

  console.log('MapplexERC20 deployed to:', pancakeERC20.address)
  const cakeName = await pancakeERC20.name.call()
  console.log('Contract name:', cakeName)
*/

  //====Deploying Token Contract
  const TokenContract = await hre.ethers.getContractFactory('TokenContract')
  const tokenContract = await TokenContract.deploy()
  await tokenContract.deployed()

  console.log('Token Contract deployed to:', tokenContract.address)
  const tokenName = await tokenContract.name.call()
  console.log('Contract name:', tokenName)
  //====End Deloying Contract

  // PancakeFactory --Not working
  /*
  let adminWallet: SignerWithAddress
  let otherWallet: SignerWithAddress
  ;[adminWallet, otherWallet] = await ethers.getSigners()
  const PancakeFactory = await hre.ethers.getContractFactory(otherWallet.address)
  const pancakeFactory = await PancakeFactory.deploy()
  await pancakeFactory.deployed()
  console.log('PancakeFactory deployed to:', pancakeFactory.address)

  const factoryName = await pancakeFactory.name.call()
  console.log('PancakeFactory name:', factoryName)
*/
  // PancakePair - working
  /*const PancakePair = await hre.ethers.getContractFactory('PancakePair')
  const pancakePair = await PancakePair.deploy()
  await pancakePair.deployed()
  console.log('PancakePair deployed to:', pancakePair.address)

  const pairName = await pancakePair.name.call()
  console.log('PancakeFactory name:', pairName)
  */
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
