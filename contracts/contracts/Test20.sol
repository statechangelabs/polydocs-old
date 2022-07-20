// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Termsable.sol";

contract Test20 is ERC20, Ownable, TermsableNoToken {
    string public name_;
    string public symbol_;
    uint256 amount;

    // string uri;

    constructor(string memory _name, string memory _symbol)
        ERC20(_name, _symbol)
    {}

    function name() public view override returns (string memory) {
        return name_;
    }

    function symbol() public view override returns (string memory) {
        return symbol_;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 _amount
    ) internal virtual override {
        require(acceptedTerms(to), "Terms not accepted");
        super._beforeTokenTransfer(from, to, _amount);
    }

    function mint(address account, uint256 _amount) external onlyOwner {
        require(acceptedTerms(account), "Terms not accepted");
        _mint(account, _amount);
    }
}
