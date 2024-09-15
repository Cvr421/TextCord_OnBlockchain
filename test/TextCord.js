const { wait } = require("@testing-library/user-event/dist/utils")
const { expect } = require("chai")
const { ethers } = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("TextCord", function () {
let deployer, user
  let textcord
  const NAME = "TextCord"
  const SYMBOL = "TC"

  beforeEach(async () => {
    [deployer,user]=await ethers.getSigners()
    //Deploy Contract
    const TextCord = await ethers.getContractFactory("TextCord")
    textcord= await TextCord.deploy(NAME, SYMBOL)

    //Create a channel
    const transaction =await textcord.connect(deployer).createChannel("general",tokens(1))
    await transaction.wait()
  })

  describe("Deployment", function () {

    it("Set the name", async () => {
      //fetch name
      let result = await textcord.name()
      expect(result).to.equal(NAME)
    })

    it("Sets the Symbol", async () => {
      //fetch symbol
      let result = await textcord.symbol()
      //check symbol
      expect(result).to.equal(SYMBOL);
    })

    it("Sets the owner", async () => {
      //fetch symbol
      let result = await textcord.owner()
      //check symbol
      expect(result).to.equal(deployer.address);
    })

  })

  describe("Creating Channels",function(){
    it('Returns total channels',async()=>{
      const result= await textcord.totalChannels()
      expect(result).to.be.equal(1)
    })
    it('Returns channel attributes',async()=>{
      const channel=await textcord.getChannel(1)
      expect(channel.id).to.be.equal(1);
      expect(channel.name).to.be.equal("general")
      expect(channel.cost).to.be.equal(tokens(1))
    })
  })

 describe("Joining Channels",()=>{
 const ID=1
 const AMOUNT=ethers.utils.parseUnits("1",'ether')

 beforeEach(async()=>{
  const transaction=await textcord.connect(user).mint(ID,{value: AMOUNT});
  await transaction.wait();

 })

 it("Joins the user",async()=>{
  const result=await textcord.hasJoined(ID,user.address);
  expect(result).to.be.equal(true);
 })

 it('Increases total supply',async()=>{
  const result =await textcord.totalSupply();
  expect(result).to.be.equal(ID);
 })

 it('Updates the contract balance', async()=>{
  const result =await ethers.provider.getBalance(textcord.address);
  expect(result).to.be.equal(AMOUNT);
 })

 })

 describe("Withdrawing", () => {
  const ID = 1
  const AMOUNT = ethers.utils.parseUnits("10", 'ether')
  let balanceBefore

  beforeEach(async () => {
    balanceBefore = await ethers.provider.getBalance(deployer.address)

    let transaction = await textcord.connect(user).mint(ID, { value: AMOUNT })
    await transaction.wait()

    transaction = await textcord.connect(deployer).withdraw()
    await transaction.wait()
  })

  it('Updates the owner balance', async () => {
    const balanceAfter = await ethers.provider.getBalance(deployer.address)
    expect(balanceAfter).to.be.greaterThan(balanceBefore)
  })

  it('Updates the contract balance', async () => {
    const result = await ethers.provider.getBalance(textcord.address)
    expect(result).to.equal(0)
  })


})

})
