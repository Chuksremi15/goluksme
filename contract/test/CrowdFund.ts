import { expect } from "chai";
import { ethers } from "hardhat";
import { CrowdFund } from "../typechain-types";

describe("CrowdFund", function () {
  let crowdFund: CrowdFund;
  let owner: any, donor: any, protocol: any;
  let campaignId: number;

  beforeEach(async function () {
    [owner, donor, protocol] = await ethers.getSigners();

    // Deploy contract
    const CrowdFund = await ethers.getContractFactory("CrowdFund");
    crowdFund = await CrowdFund.deploy();
    await crowdFund.waitForDeployment();

    // Initialize contract with protocol wallet
    await crowdFund.initialize(await protocol.getAddress());

    // Create a campaign
    const tx = await crowdFund.connect(owner).createCampaign(
      "Medical Fund", // title
      "data123", // dataId
      ethers.parseEther("10"), // target
      86400, // 1 day duration
    );

    const receipt = await tx.wait();
    if (!receipt) throw new Error("Transaction receipt is null");
    const log = receipt.logs[0];
    campaignId = Number((log as any).args[0]); // Extract campaignId from event
  });

  it("should create a campaign", async function () {
    const campaign = await crowdFund.getCampaign(campaignId);
    expect(campaign.owner).to.equal(await owner.getAddress());
    expect(campaign.title).to.equal("Medical Fund");
    expect(campaign.target).to.equal(ethers.parseEther("10"));
  });

  it("should allow donations", async function () {
    await crowdFund.connect(donor).donate(campaignId, { value: ethers.parseEther("1") });
    const campaign = await crowdFund.getCampaign(campaignId);
    expect(campaign.fundsRaised).to.equal(ethers.parseEther("1"));
  });

  it("should allow owner to withdraw with protocol fee", async function () {
    await crowdFund.connect(donor).donate(campaignId, { value: ethers.parseEther("1") });

    const initialOwnerBalance = await ethers.provider.getBalance(owner);
    const initialProtocolBalance = await ethers.provider.getBalance(protocol);

    const tx = await crowdFund.connect(owner).withdraw(campaignId);
    const receipt = await tx.wait();
    const gasUsed = receipt ? receipt.gasUsed * receipt.gasPrice : BigInt(0); // Calculate gas cost

    const protocolFee = (ethers.parseEther("1") * BigInt(30)) / BigInt(10000); // 0.03%
    const expectedAmount = ethers.parseEther("1") - protocolFee;

    const finalOwnerBalance = await ethers.provider.getBalance(owner);
    const finalProtocolBalance = await ethers.provider.getBalance(protocol);

    expect(finalOwnerBalance).to.equal(initialOwnerBalance + expectedAmount - gasUsed);
    expect(finalProtocolBalance).to.equal(initialProtocolBalance + protocolFee);
  });

  it("should fail withdrawal if not the owner", async function () {
    await expect(crowdFund.connect(donor).withdraw(campaignId)).to.be.revertedWith("Not campaign owner");
  });
});
