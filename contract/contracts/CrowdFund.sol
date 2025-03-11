// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

import "./utils/Initializable.sol";

contract CrowdFund is Initializable {
    struct Campaign {
        address owner;
        string title;
        string id;
        string dataId;
        uint target;
        uint deadline;
        uint fundsRaised;
        bool withdrawn;
        mapping(address => uint) donations;
    }

    uint public campaignCount;

    mapping(uint => Campaign) public campaigns;

    address public protocolWallet;

    event CampaignCreated(uint indexed campaignId, address indexed owner, string title, uint target);

    event Donated(uint indexed campaignId, address indexed donor, uint amount);

    event Withdrawn(uint indexed campaignId, address indexed owner, uint amount);

    event Refunded(uint indexed campaignId, address indexed donor, uint amount);

    modifier onlyOwner(uint _id) {
        require(msg.sender == campaigns[_id].owner, "Not campaign owner");
        _;
    }

    /// @notice Initializes the loan factory contract
    /// @param protocolWallet_ Protocol wallet address
    function initialize(address protocolWallet_) public initializer {
        protocolWallet = protocolWallet_;
    }

    function createCampaign(string memory _title, string memory _dataId, uint _target, uint _duration) external {
        require(_target > 0, "target must be greater than zero");
        require(_duration > 0, "Duration must be positive");

        campaignCount++;
        Campaign storage newCampaign = campaigns[campaignCount];
        newCampaign.owner = msg.sender;
        newCampaign.title = _title;
        newCampaign.dataId = _dataId;
        newCampaign.target = _target;

        emit CampaignCreated(campaignCount, msg.sender, _title, _target);
    }

    function donate(uint _id) external payable {
        Campaign storage campaign = campaigns[_id];
        require(msg.value > 0, "Must send LKS");

        campaign.fundsRaised += msg.value;
        campaign.donations[msg.sender] += msg.value;

        emit Donated(_id, msg.sender, msg.value);
    }

    function withdraw(uint _id) external onlyOwner(_id) {
        Campaign storage campaign = campaigns[_id];

        uint amount = campaign.fundsRaised;

        // Calculate 0.03% fee
        uint fee = (amount * 30) / 10000; // 30 / 10000 = 0.03%
        uint amountAfterFee = amount - fee;

        // Reset fundsRaised
        campaign.fundsRaised = 0;

        // Send fee to protocol
        (bool feeSent, ) = payable(protocolWallet).call{ value: fee }("");
        require(feeSent, "Failed to send fee");

        // Send remaining amount to campaign owner
        (bool sent, ) = payable(campaign.owner).call{ value: amountAfterFee }("");
        require(sent, "Failed to send funds");

        emit Withdrawn(_id, msg.sender, amount);
    }

    // function refund(uint _id) external {
    //     Campaign storage campaign = campaigns[_id];
    //     require(block.timestamp >= campaign.deadline, "Campaign still running");
    //     require(
    //         campaign.fundsRaised < campaign.target,
    //         "target met, no refunds"
    //     );

    //     uint amount = campaign.donations[msg.sender];
    //     require(amount > 0, "No donations to refund");

    //     campaign.donations[msg.sender] = 0;
    //     (bool sent, ) = payable(msg.sender).call{value: amount}("");
    //     require(sent, "Failed to refund");

    //     emit Refunded(_id, msg.sender, amount);
    // }

    function getCampaign(
        uint _id
    )
        external
        view
        returns (
            address owner,
            string memory title,
            string memory description,
            uint target,
            uint deadline,
            uint fundsRaised,
            bool withdrawn
        )
    {
        Campaign storage campaign = campaigns[_id];
        return (
            campaign.owner,
            campaign.title,
            campaign.dataId,
            campaign.target,
            campaign.deadline,
            campaign.fundsRaised,
            campaign.withdrawn
        );
    }
}
