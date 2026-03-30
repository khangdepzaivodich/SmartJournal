// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FlexiJournal {
    struct Trade {
        uint256 date;
        string pair;
        int256 pnl;
        string[] confluences; 
        string note;
    }

    mapping(address => Trade[]) public userTrades;

    // Function to log a trade with your custom list
    function logTrade(
        string memory _pair,
        int256 _pnl,
        string[] memory _confluences,
        string memory _note
    ) public {
        userTrades[msg.sender].push(Trade({
            date: block.timestamp,
            pair: _pair,
            pnl: _pnl,
            confluences: _confluences,
            note: _note
        }));
    }

    // Helper to see the confluences for a specific trade
    function getConfluences(address _user, uint256 _tradeIndex) public view returns (string[] memory) {
        return userTrades[_user][_tradeIndex].confluences;
    }
}