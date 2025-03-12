// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

import "./utils/Initializable.sol";

contract CrowdFund is Initializable {
    struct Campaign {
        address owner;
        string title;
        string dataId;
        uint target;
        uint totalDonations;
        uint totalWithdrawn;
        uint donationCount;
    }

    mapping(address => Campaign) public campaigns;

    address public protocolWallet;

    event CampaignCreated(string dataId, address indexed owner, string title, uint target);
    event CampaignClosed(
        address indexed owner,
        string title,
        string dataId,
        uint target,
        uint totalDonations,
        uint totalWithdrawn
    );
    event Donated(address indexed owner, address indexed donor, uint amount);
    event Withdrawn(address indexed owner, uint amount);

    function initialize(address protocolWallet_) public initializer {
        protocolWallet = protocolWallet_;
    }

    function createCampaign(string memory _title, string memory _dataId, uint _target) external {
        require(campaigns[msg.sender].owner == address(0), "You already have a campaign");

        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_dataId).length > 0, "Data ID cannot be empty");
        require(_target > 0, "Target must be greater than zero");

        Campaign storage newCampaign = campaigns[msg.sender];
        newCampaign.owner = msg.sender;
        newCampaign.title = _title;
        newCampaign.dataId = _dataId;
        newCampaign.target = _target;
        newCampaign.donationCount = 0;

        emit CampaignCreated(_dataId, msg.sender, _title, _target);
    }

    function donate(address _owner) external payable {
        Campaign storage campaign = campaigns[_owner];
        require(campaign.owner != address(0), "Campaign does not exist");
        require(msg.value > 0, "Must send LKS");

        campaign.totalDonations += msg.value;
        campaign.donationCount++;

        emit Donated(_owner, msg.sender, msg.value);
    }

    function withdraw() external {
        Campaign storage campaign = campaigns[msg.sender];
        require(campaign.owner != address(0), "Campaign does not exist");

        uint amount = campaign.totalDonations - campaign.totalWithdrawn;

        require(amount > 0, "cannot withdraw 0");

        uint fee = (amount * 30) / 10000;
        uint amountAfterFee = amount - fee;

        campaign.totalWithdrawn += amount;

        (bool feeSent, ) = payable(protocolWallet).call{ value: fee }("");
        require(feeSent, "Failed to send fee");

        (bool sent, ) = payable(campaign.owner).call{ value: amountAfterFee }("");
        require(sent, "Failed to send funds");

        emit Withdrawn(msg.sender, amount);
    }

    function closeCampaign() external {
        Campaign storage campaign = campaigns[msg.sender];
        require(campaign.owner != address(0), "Campaign does not exist");

        uint remainingAmount = campaign.totalDonations - campaign.totalWithdrawn;
        if (remainingAmount > 0) {
            uint fee = (remainingAmount * 30) / 10000;
            uint amountAfterFee = remainingAmount - fee;

            campaign.totalWithdrawn += remainingAmount;

            (bool feeSent, ) = payable(protocolWallet).call{ value: fee }("");
            require(feeSent, "Failed to send fee");

            (bool sent, ) = payable(campaign.owner).call{ value: amountAfterFee }("");
            require(sent, "Failed to send funds");

            emit Withdrawn(msg.sender, remainingAmount);
        }

        emit CampaignClosed(
            msg.sender,
            campaign.title,
            campaign.dataId,
            campaign.target,
            campaign.totalDonations,
            campaign.totalWithdrawn
        );

        delete campaigns[msg.sender];
    }

    function getCampaign(
        address _owner
    )
        external
        view
        returns (
            address owner,
            string memory title,
            string memory dataId,
            uint target,
            uint totalDonations,
            uint totalWithdrawn,
            uint donationCount
        )
    {
        Campaign storage campaign = campaigns[_owner];

        require(campaign.owner != address(0), "Campaign does not exist");

        return (
            campaign.owner,
            campaign.title,
            campaign.dataId,
            campaign.target,
            campaign.totalDonations,
            campaign.totalWithdrawn,
            campaign.donationCount
        );
    }
}
