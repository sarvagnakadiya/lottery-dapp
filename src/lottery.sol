// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Lottery {
    address public manager;
    address[] public participants;
    address[] public winners;
    uint256 public ticketPrice;

    constructor(uint _ticketPrice) {
        manager = msg.sender;
        ticketPrice = _ticketPrice;
    }

    modifier onlyManager() {
        require(msg.sender == manager, "Only manager can call this function");
        _;
    }

    function updateTicketPrice(uint _ticketPrice) public onlyManager {
        ticketPrice = _ticketPrice;
    }

    function participate() public payable {
        // kept "==" because flat 0.000015
        require(msg.value == ticketPrice, "ticketPrice not matched");
        participants.push(msg.sender);
    }

    function pickWinners(uint256 numberOfWinners) public onlyManager {
        require(participants.length > 0, "No participants in the lottery");
        require(
            numberOfWinners <= participants.length,
            "Not enough participants"
        );

        delete winners;

        for (uint256 i = 0; i < numberOfWinners; i++) {
            uint256 index = random() % participants.length;
            winners.push(participants[index]);
            participants[index] = participants[participants.length - 1];
            participants.pop();
        }
        uint256 prize = address(this).balance / numberOfWinners;
        for (uint256 i = 0; i < winners.length; i++) {
            payable(winners[i]).transfer(prize);
        }

        delete participants;
    }

    function getWinners() public view returns (address[] memory) {
        return winners;
    }

    function getParticipants() public view returns (address[] memory) {
        return participants;
    }

    function random() private view returns (uint256) {
        return
            uint256(keccak256(abi.encodePacked(block.timestamp, participants)));
    }

    receive() external payable {
        participate();
    }
}
