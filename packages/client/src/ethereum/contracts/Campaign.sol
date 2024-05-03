// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract CampaignFactory {
    address payable[] public deployedCampaigns;

    function createCampaign(
        uint[] memory numbers,
        string[] memory strings
    ) public {
        address newCampaign = address(new Campaign(numbers, strings, msg.sender));
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
        uint dateCreated;
        mapping(address => bool) approvals;
    }

    struct Contribution {
        address contributor;
        uint value;
        uint dateCreated;
    }

    struct Contributor {
        address contributor;
        uint totalContribution;
        uint lastContributionDate;
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
    mapping(address => Contributor) private contributors;
    Contributor[] public contributorsList;
    Contribution[] public contributions;
    uint private contributorsCount;
    uint private contributionsCount;
    uint private targetAmount;
    uint private dateCreated;

    constructor (
        uint[] memory numbers,
        string[] memory strings,
        address creator
    ) {
        manager = creator;
        minimumContribution = numbers[0];
        metaData = MetaData({
            title: strings[0],
            subTitle: strings[1],
            description: strings[2],
            category: strings[3],
            subCategory: strings[4],
            location: strings[5],
            imageUrl: strings[6],
            launchDate: numbers[1],
            durationInDays: numbers[2]
        });
        targetAmount = numbers[3];
        reward = Reward({
            title: strings[7],
            description: strings[8],
            value: numbers[4],
            imageUrl: strings[9],
            category: strings[10],
            availableQuantity: numbers[5],
            deadLine: numbers[6]
        });
        dateCreated = block.timestamp;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    modifier onlyContributors() {
        require(msg.sender != manager);
        _;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);

        Contributor memory contributor = Contributor({
            contributor: msg.sender,
            totalContribution: contributors[msg.sender].totalContribution + msg.value,
            lastContributionDate: block.timestamp
        });

        if (contributors[msg.sender].lastContributionDate == 0) {
            contributorsCount++;
            contributorsList.push(contributor);
        }

        contributors[msg.sender] = contributor;
        Contribution memory newContribution = Contribution({
            contributor: msg.sender,
            value: msg.value,
            dateCreated: block.timestamp
        });
        contributions.push(newContribution);
        contributionsCount++;
    }

    function createRequest(string memory description, uint value, address recipient) public restricted {
        Request storage newRequest = requests.push();
        newRequest.id = requests.length + 1;
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
        newRequest.dateCreated = block.timestamp;
    }

    function approveRequest(uint index) public onlyContributors {
        Request storage request = requests[index];

        require(contributors[msg.sender].lastContributionDate != 0);
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

    function getSummary() public view returns (uint, uint, uint, uint, address, uint, uint, Reward memory, MetaData memory, uint) {
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            contributorsCount,
            manager,
            targetAmount,
            dateCreated,
            reward,
            metaData,
            contributionsCount
        );
    }

    function getContributorSummary(address contributor) public view returns (Contributor memory) {
        return contributors[contributor];
    }
}
