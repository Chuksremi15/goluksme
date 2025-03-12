import { expect } from "chai";
import { ethers } from "hardhat";
import { CrowdFund } from "../typechain-types";

describe("CrowdFund", function () {
  let crowdFund: CrowdFund;
  let owner: any, donor: any, protocol: any;

  beforeEach(async function () {
    [owner, donor, protocol] = await ethers.getSigners();

    const CrowdFund = await ethers.getContractFactory("CrowdFund");
    crowdFund = await CrowdFund.deploy();
    await crowdFund.waitForDeployment();

    await crowdFund.initialize(protocol.address);

    await crowdFund.connect(owner).createCampaign("Medical Fund", "data123", ethers.parseEther("10"));
  });

  it("should create a campaign", async function () {
    const campaign = await crowdFund.getCampaign(owner.address);
    expect(campaign.owner).to.equal(owner.address);
    expect(campaign.title).to.equal("Medical Fund");
    expect(campaign.target).to.equal(ethers.parseEther("10"));
  });

  it("should prevent creating a campaign if one already exists", async function () {
    await expect(
      crowdFund.connect(owner).createCampaign("Duplicate", "data999", ethers.parseEther("5")),
    ).to.be.revertedWith("You already have a campaign");
  });

  it("should allow donations and track count", async function () {
    await crowdFund.connect(donor).donate(owner.address, { value: ethers.parseEther("1") });
    const campaign = await crowdFund.getCampaign(owner.address);
    expect(campaign.totalDonations).to.equal(ethers.parseEther("1"));
    expect(campaign.donationCount).to.equal(1);
  });

  it("should allow owner to withdraw with protocol fee and fail if amount is zero", async function () {
    await expect(crowdFund.connect(owner).withdraw()).to.be.revertedWith("cannot withdraw 0");

    await crowdFund.connect(donor).donate(owner.address, { value: ethers.parseEther("1") });

    const initialOwnerBalance = await ethers.provider.getBalance(owner.address);
    const initialProtocolBalance = await ethers.provider.getBalance(protocol.address);

    const tx = await crowdFund.connect(owner).withdraw();
    const receipt = await tx.wait();
    const gasUsed = receipt ? receipt.gasUsed * receipt.gasPrice : BigInt(0);

    const protocolFee = (ethers.parseEther("1") * BigInt(30)) / BigInt(10000);
    const expectedAmount = ethers.parseEther("1") - protocolFee;

    const finalOwnerBalance = await ethers.provider.getBalance(owner.address);
    const finalProtocolBalance = await ethers.provider.getBalance(protocol.address);

    expect(finalOwnerBalance).to.equal(initialOwnerBalance + expectedAmount - gasUsed);
    expect(finalProtocolBalance).to.equal(initialProtocolBalance + protocolFee);
  });

  it("should close the campaign, withdraw remaining funds, and delete the campaign", async function () {
    await crowdFund.connect(donor).donate(owner.address, { value: ethers.parseEther("2") });

    await expect(crowdFund.connect(owner).closeCampaign())
      .to.emit(crowdFund, "Withdrawn")
      .withArgs(owner.address, ethers.parseEther("2"))
      .to.emit(crowdFund, "CampaignClosed")
      .withArgs(
        owner.address,
        "Medical Fund",
        "data123",
        ethers.parseEther("10"),
        ethers.parseEther("2"),
        ethers.parseEther("2"),
      );

    // Expect `getCampaign` to revert because the campaign no longer exists
    await expect(crowdFund.getCampaign(owner.address)).to.be.revertedWith("Campaign does not exist");

    // Now owner should be able to create a new campaign
    await expect(crowdFund.connect(owner).createCampaign("New Campaign", "dataNew", ethers.parseEther("5")))
      .to.emit(crowdFund, "CampaignCreated")
      .withArgs("dataNew", owner.address, "New Campaign", ethers.parseEther("5"));
  });

  it("should fail withdrawal if not the owner", async function () {
    await expect(crowdFund.connect(donor).withdraw()).to.be.reverted;
  });

  it("should emit CampaignCreated event", async function () {
    // Close the existing campaign to allow a new one
    await crowdFund.connect(owner).closeCampaign();

    await expect(crowdFund.connect(owner).createCampaign("Education Fund", "data456", ethers.parseEther("5")))
      .to.emit(crowdFund, "CampaignCreated")
      .withArgs("data456", owner.address, "Education Fund", ethers.parseEther("5"));
  });

  it("should emit Donated event", async function () {
    await expect(crowdFund.connect(donor).donate(owner.address, { value: ethers.parseEther("2") }))
      .to.emit(crowdFund, "Donated")
      .withArgs(owner.address, donor.address, ethers.parseEther("2"));
  });

  it("should emit Withdrawn event", async function () {
    await crowdFund.connect(donor).donate(owner.address, { value: ethers.parseEther("3") });

    await expect(crowdFund.connect(owner).withdraw())
      .to.emit(crowdFund, "Withdrawn")
      .withArgs(owner.address, ethers.parseEther("3"));
  });

  it("should fail donation with zero ETH", async function () {
    await expect(crowdFund.connect(donor).donate(owner.address, { value: 0 })).to.be.revertedWith("Must send LKS");
  });

  it("should fail campaign creation with invalid inputs", async function () {
    // Close the existing campaign first
    await crowdFund.connect(owner).closeCampaign();

    await expect(crowdFund.connect(owner).createCampaign("", "data789", ethers.parseEther("5"))).to.be.revertedWith(
      "Title cannot be empty",
    );
    await expect(crowdFund.connect(owner).createCampaign("Valid Title", "", ethers.parseEther("5"))).to.be.revertedWith(
      "Data ID cannot be empty",
    );
    await expect(crowdFund.connect(owner).createCampaign("Invalid", "data789", 0)).to.be.revertedWith(
      "Target must be greater than zero",
    );
  });
});
