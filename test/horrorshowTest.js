const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Horror Show NFT Contract", () =>{
    let HorrorShowContract, deployer, user1, user2

    beforeEach(async ()=>{
        const horrorContractFactory = await ethers.getContractFactory("HorrorShow")
        HorrorShowContract = await horrorContractFactory.deploy()
        await HorrorShowContract.deployed()

        const accounts = await ethers.getSigners()
        deployer = accounts[0]
        user1 = accounts[1]
        user2 = accounts[2]


    })
    it("checks the contract was deployed", async ()=>{
        console.log(`Horror Show deployed to ${HorrorShowContract.address}`)
    })
    it("checks the owner of the contract", async ()=>{
        expect(await HorrorShowContract.owner()).to.equal(deployer.address)
    })
    it("checks the collection name", async () =>{
        expect(await HorrorShowContract.name()).to.equal("HorrorShow")
    })
    it("checks the symbol", async () =>{
        expect(await HorrorShowContract.symbol()).to.equal("HRS")
    })
    it("checks the ")
})