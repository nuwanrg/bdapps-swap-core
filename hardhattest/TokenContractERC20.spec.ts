import { expandTo18Decimals } from '../test/shared/utilities'
import { Contract, Wallet } from 'ethers'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import '@nomiclabs/hardhat-waffle'
import { ethers } from 'hardhat'
import chasdfi, { expect } from 'chai'
import { Provider } from '@ethersproject/abstract-provider'
import { constants } from 'ethers'

describe('Test TokenContractERC20', () => {
  //console.log('My Test')
  const TOTAL_SUPPLY = expandTo18Decimals(100)
  const TEST_AMOUNT = expandTo18Decimals(10)
  let erc20Contract: Contract
  let adminWallet: SignerWithAddress
  let otherWallet: SignerWithAddress
  let provider: Provider

  beforeEach(async () => {
    console.log('Before Each')
    ;[adminWallet, otherWallet] = await ethers.getSigners()

    console.log('Admin wallet: ', adminWallet.address)
    console.log('Other wallet: ', otherWallet.address)

    const ERC20Factory = await ethers.getContractFactory('TokenContractERC20')
    erc20Contract = await ERC20Factory.deploy(TOTAL_SUPPLY)
    console.log('==== Contract Details ====')
    console.log('Address', erc20Contract.address)
    //Wait untill transaction is mined.
    await erc20Contract.deployed()
    console.log('Deploy Transaction Hash', erc20Contract.deployTransaction.hash)

    //Get balance
    provider = ethers.getDefaultProvider()
    const contractBalance = await provider.getBalance(erc20Contract.address)
    console.log('Contract Balance ', contractBalance.toNumber())
    console.log('Provider Block Number ', await provider.getBlockNumber())
    const tokenName = await erc20Contract.name.call()
    console.log('Contract name:', tokenName)
    //console.log(erc20Contract.functions)

    //Network
    const network = await provider.getNetwork()
    //console.log('Network ', network)
  })

  it('approve', async () => {
    await expect(erc20Contract.approve(otherWallet.address, TEST_AMOUNT))
      .to.emit(erc20Contract, 'Approval')
      .withArgs(adminWallet.address, otherWallet.address, TEST_AMOUNT)
    expect(await erc20Contract.allowance(adminWallet.address, otherWallet.address)).to.eq(TEST_AMOUNT)
  })

  it('transfer', async () => {
    console.log('Balance of Admin wallet ', (await erc20Contract.balanceOf(adminWallet.address)).toString())
    console.log('Balance of Other wallet ', (await erc20Contract.balanceOf(otherWallet.address)).toString())
    await expect(erc20Contract.transfer(otherWallet.address, TEST_AMOUNT))
      .to.emit(erc20Contract, 'Transfer')
      .withArgs(adminWallet.address, otherWallet.address, TEST_AMOUNT)
    console.log(
      'Balance of Admin wallet after transfer',
      (await erc20Contract.balanceOf(adminWallet.address)).toString()
    )
    console.log('Balance of Other wallet ', (await erc20Contract.balanceOf(otherWallet.address)).toString())
    expect(await erc20Contract.balanceOf(adminWallet.address)).to.eq(TOTAL_SUPPLY.sub(TEST_AMOUNT))
    expect(await erc20Contract.balanceOf(otherWallet.address)).to.eq(TEST_AMOUNT)
    console.log((await provider.getBalance(erc20Contract.address)).toNumber())
  })

  it('transfer:fail', async () => {
    await expect(erc20Contract.transfer(otherWallet.address, TOTAL_SUPPLY.add(1))).to.be.reverted
    await expect(erc20Contract.connect(otherWallet).transfer(adminWallet, 1)).to.be.reverted
  })

  it('TransferFrom', async () => {
    //console.log(constants.MaxUint256.toString())

    await erc20Contract.approve(otherWallet.address, TEST_AMOUNT)
    await expect(erc20Contract.connect(otherWallet).transferFrom(adminWallet.address, otherWallet.address, TEST_AMOUNT))
      .to.emit(erc20Contract, 'Transfer')
      .withArgs(adminWallet.address, otherWallet.address, TEST_AMOUNT)
    const allow: Number = await erc20Contract.allowance(adminWallet.address, otherWallet.address)
    console.log('allow', allow.toString())
    //expect(await erc20Contract.allowance(adminWallet.address, otherWallet.address)).to.eq(TEST_AMOUNT)
    expect(await erc20Contract.balanceOf(otherWallet.address)).to.eq(TEST_AMOUNT)
    expect(await erc20Contract.balanceOf(adminWallet.address)).to.eq(TOTAL_SUPPLY.sub(TEST_AMOUNT))

    //await erc20Contract.tranferFrom(adminWallet.address, otherWallet.address, TEST_AMOUNT)
  })
})
