import { expandTo18Decimals } from '../test/shared/utilities'
import { Contract, Wallet } from 'ethers'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import '@nomiclabs/hardhat-waffle'
import { ethers } from 'hardhat'
import chasdfi, { expect } from 'chai'
import { Provider } from '@ethersproject/abstract-provider'
import { constants } from 'ethers'
import { ecsign } from 'ethereumjs-util'
import { BigNumber } from 'ethers'
import { hexlify, keccak256, defaultAbiCoder, toUtf8Bytes } from 'ethers/lib/utils'

import { getApprovalDigest } from '../test/shared/utilities'

describe('Test erc20ContractContractERC20', () => {
  //console.log('My Test')
  const TOTAL_SUPPLY = expandTo18Decimals(100)
  const TEST_AMOUNT = expandTo18Decimals(10)
  let erc20Contract: Contract
  let adminWallet: SignerWithAddress
  let otherWallet: SignerWithAddress
  let anotherTestWallet: SignerWithAddress
  // let adminWallet: Wallet
  // let otherWallet: Wallet
  // let anotherTestWallet: Wallet
  let newWallet: Wallet
  let newOtherWallet: Wallet
  let provider: Provider

  beforeEach(async () => {
    console.log('Before Each')
    provider = ethers.provider //ethers.getDefaultProvider()
    ;[adminWallet, otherWallet] = await ethers.getSigners()
    anotherTestWallet = await ethers.getSigner('0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199')

    console.log('Admin wallet: ', adminWallet.address, (await provider.getBalance(adminWallet.address)).toString())
    console.log('Other wallet: ', otherWallet.address, (await provider.getBalance(otherWallet.address)).toString())
    console.log(
      'Another test wallet: ',
      anotherTestWallet.address,
      (await provider.getBalance(anotherTestWallet.address)).toString()
    )

    const ERC20Factory = await ethers.getContractFactory('TokenContractERC20')
    erc20Contract = await ERC20Factory.deploy(TOTAL_SUPPLY)
    console.log('==== Contract Details ====')
    console.log('Contract Address', erc20Contract.address)
    //Wait untill transaction is mined.
    await erc20Contract.deployed()
    console.log('Contract Deployed Transaction Hash', erc20Contract.deployTransaction.hash)

    //Get balance

    const contractBalance = await provider.getBalance(erc20Contract.address)
    console.log('Contract Balance ', contractBalance.toString())
    console.log('Provider Block Number ', await provider.getBlockNumber())
    const erc20ContractName = await erc20Contract.name.call()
    console.log('Contract name:', erc20ContractName)
    //console.log(erc20Contract.functions)

    //Network
    //const network = await provider.getNetwork()
    //console.log('Network ', network)
  })
  /*
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
*/
  it('TransferFrom', async () => {
    //console.log('anotherTestWallet', anotherTestWallet)

    await erc20Contract.transfer(otherWallet.address, 100000)
    await erc20Contract.transfer(anotherTestWallet.address, 100000)

    console.log('OtherWallet before', (await erc20Contract.balanceOf(otherWallet.address)).toString())
    console.log('anotherTestWallet  before', (await erc20Contract.balanceOf(anotherTestWallet.address)).toString())
    console.log('adminWallet before', (await erc20Contract.balanceOf(adminWallet.address)).toString())

    await erc20Contract.approve(otherWallet.address, 15000)
    let bal = (await otherWallet.getBalance()).toString()

    const balanceInEth = await provider.getBalance(otherWallet.address) //ethers.utils.formatEther(await adminWallet.getBalance())
    await erc20Contract.connect(otherWallet).transferFrom(adminWallet.address, anotherTestWallet.address, 1500)
    console.log('anotherTestWallet  after', (await erc20Contract.balanceOf(anotherTestWallet.address)).toString())
  })

  it('permit', async () => {
    const nonce = await erc20Contract.nonces(adminWallet.address)
    const deadline = constants.MaxUint256
    const digest = await getApprovalDigest(
      erc20Contract,
      { owner: adminWallet.address, spender: otherWallet.address, value: TEST_AMOUNT },
      nonce,
      deadline
    )
    const accounts = await ethers.getSigners()
    for (const account of accounts) {
      console.log(await account)
    }

    const { v, r, s } = ecsign(
      Buffer.from(digest.slice(2), 'hex'),
      Buffer.from(
        /*adminWallet.privateKey*/ '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'.slice(2),
        'hex'
      )
    )

    await expect(
      erc20Contract.permit(adminWallet.address, otherWallet.address, TEST_AMOUNT, deadline, v, hexlify(r), hexlify(s))
    )
      .to.emit(erc20Contract, 'Approval')
      .withArgs(adminWallet.address, otherWallet.address, TEST_AMOUNT)
    expect(await erc20Contract.allowance(adminWallet.address, otherWallet.address)).to.eq(TEST_AMOUNT)
    expect(await erc20Contract.nonces(adminWallet.address)).to.eq(BigNumber.from(1))
  })
})
