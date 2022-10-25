const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Horror Show NFT Contract", () =>{
    let HorrorShowContract, deployer, user1, user2

    const SAMPLE_URI = "SAMPLE URI"

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
        expect(await HorrorShowContract.admin()).to.equal(deployer.address)
    })
    it("checks the collection name", async () =>{
        expect(await HorrorShowContract.name()).to.equal("HorrorShow")
    })
    it("checks the symbol", async () =>{
        expect(await HorrorShowContract.symbol()).to.equal("HRS")
    })
    it("checks the current count", async () =>{
        expect(await HorrorShowContract._tokenIdCounter()).to.equal(0)
    })
    describe("whitelist and mint functions", () =>{
        beforeEach(async () =>{
            await HorrorShowContract.connect(deployer).addToWhitelist(user1.address);
            await HorrorShowContract.connect(deployer).setWhitelistMintLimit(10)
        })
        it("checks the user is added to whitelist", async ()=>{
            expect(await HorrorShowContract.canWhitelistMint(user1.address)).to.equal(true)
        })
        it("checks the add to whitelist fail case", async () =>{
            await expect( HorrorShowContract.connect(user1).addToWhitelist(user2.address)).to.be.reverted
        })
        it("checks the whitelist max mint limit", async () =>{
            expect(await HorrorShowContract.whitelistMaxMint()).to.equal(10)
        })
        it("checks the address whitelist was removed", async () =>{
            await HorrorShowContract.connect(deployer).removeFromWhitelist(user1.address)
            expect(await HorrorShowContract.canWhitelistMint(user1.address)).to.equal(false)
        })
        it("checks the contract was paused", async () =>{
            await HorrorShowContract.connect(deployer).pauseContract()
            expect(await HorrorShowContract.contractPaused()).to.equal(true)
        })
        it("checks the contract paused fail case", async()=>{
            console.log("test for paused contract fail case")
        })
    })
    describe("whitelist minting functions", () =>{
        beforeEach(async () =>{
            await HorrorShowContract.connect(deployer).addToWhitelist(user1.address);
            await HorrorShowContract.connect(deployer).setWhitelistMintLimit(3)
            await HorrorShowContract.connect(user1).whitelistMint(user1.address, SAMPLE_URI)
        })
        it("checks the token count", async () =>{
            expect(await HorrorShowContract._tokenIdCounter()).to.equal(1)
        })
        it("checks the token uri", async () =>{
            expect(await HorrorShowContract.tokenURI(1)).to.equal(SAMPLE_URI)
        })
        it("checks the owner of the token", async () =>{
            expect(await HorrorShowContract.balanceOf(user1.address)).to.equal(1)
        })
        it("checks the whitelist mint fail case", async () =>{
            await expect(HorrorShowContract.connect(user2).whitelistMint(user2.address, SAMPLE_URI)).to.be.reverted
        })
        it("checks the max whitelist mint fail case", async () =>{
            await HorrorShowContract.connect(user1).whitelistMint(user1.address, SAMPLE_URI)
            await HorrorShowContract.connect(user1).whitelistMint(user1.address, SAMPLE_URI)
            await expect( HorrorShowContract.connect(user1).whitelistMint(user1.address, SAMPLE_URI)).to.be.reverted
        })
        
    })
    describe("full mint functions", async () =>{
        beforeEach(async () =>{
            await HorrorShowContract.connect(user2).safeMint(user2.address, SAMPLE_URI)
        })
        it("checks the token count", async () =>{
            expect(await HorrorShowContract._tokenIdCounter()).to.equal(1)
        })
        it("checks the token uri", async () =>{
            expect(await HorrorShowContract.tokenURI(1)).to.equal(SAMPLE_URI)
        })
        it("checks the owner of the token", async () =>{
            expect(await HorrorShowContract.balanceOf(user2.address)).to.equal(1)
        })
        it("checks the paused contract fail case", async () =>{
            await HorrorShowContract.connect(deployer).pauseContract()
            await expect(HorrorShowContract.safeMint(user2.address, SAMPLE_URI)).to.be.reverted
        })
    })
})