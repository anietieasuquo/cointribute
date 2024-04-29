// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract CampaignFactory {
    address payable[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        address newCampaign = address(new Campaign(minimum, msg.sender));
        deployedCampaigns.push(payable(newCampaign));
    }

    function getDeployedCampaigns() public view returns (address payable[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        uint id;
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    struct Reward {
        string title;
        string description;
        uint value;
        string imageUrl;
        string category;
        uint availableQuantity;
        uint deadLine;
    }

    struct MetaData {
        string title;
        string subTitle;
        string description;
        string category;
        string subCategory;
        string location;
        string imageUrl;
        uint launchDate;
        uint durationInDays;
    }

    Request[] public requests;
    Reward private reward;
    MetaData private metaData;
    address private manager;
    uint private minimumContribution;
    mapping(address => bool) private contributors;
    uint private contributorsCount;
    uint private targetAmount;
    uint private dateCreated;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    modifier nonManager() {
        require(msg.sender != manager);
        _;
    }

    constructor (uint minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
        dateCreated = block.timestamp;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);

        if (contributors[msg.sender] != true) {
            contributorsCount++;
        }
        contributors[msg.sender] = true;
    }

    function createRequest(string memory description, uint value, address recipient) public restricted {
        Request storage newRequest = requests.push();
        newRequest.id = requests.length + 1;
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint index) public nonManager {
        Request storage request = requests[index];

        require(contributors[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];

        require(request.approvalCount > (contributorsCount / 2));
        require(!request.complete);

        payable(request.recipient).transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns (uint, uint, uint, uint, address, uint, uint, Reward memory, MetaData memory) {
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            contributorsCount,
            manager,
            targetAmount,
            dateCreated,
            reward,
            metaData
        );
    }
}
