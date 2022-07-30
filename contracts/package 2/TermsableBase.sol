// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/TermReader.sol";

abstract contract TermsableBase is Ownable, TermReader {
    // uint256 _chainId = 137;
    string _globalRenderer = "ABCDEFG";
    string _globalDocTemplate = "LMNOPQRST";
    mapping(string => string) _globalTerms;
    uint256 _lastTermChange = 0;

    function setGlobalRenderer(string memory _newRenderer) external onlyOwner {
        _globalRenderer = _newRenderer;
        _lastTermChange = block.number;
    }

    function renderer() public view returns (string memory) {
        return _globalRenderer;
    }

    function setGlobalTemplate(string memory _newDocTemplate)
        external
        onlyOwner
    {
        _globalDocTemplate = _newDocTemplate;
        _lastTermChange = block.number;
    }

    function docTemplate() external view returns (string memory) {
        return _globalDocTemplate;
    }

    function setGlobalTerm(string memory _key, string memory _value)
        external
        onlyOwner
    {
        _globalTerms[_key] = _value;
        emit GlobalTermAdded(keccak256(bytes(_key)), keccak256(bytes(_value)));
        _lastTermChange = block.number;
    }

    function globalTerm(string memory _key)
        public
        view
        returns (string memory)
    {
        return _globalTerms[_key];
    }

    function currentTermsBlock() public view returns (uint256) {
        return _lastTermChange;
    }
}
