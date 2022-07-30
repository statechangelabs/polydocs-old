// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/TermReader.sol";

abstract contract TermsableBase is Ownable, TermReader {
    // uint256 _chainId = 137;
    string _globalRenderer = "ABCDEFG";
    string _globalDocTemplate = "LMNOPQRST";
    mapping(string => string) _globalTerms;
    uint256 _lastTermChange = 0;

    /// @notice Function to set the Global Renderer.
    /// @dev This function lets the owner of the contract set the global renderer of the terms.
    /// @param _newRenderer The new renderer to use for the terms.
    function setGlobalRenderer(string memory _newRenderer) external onlyOwner {
        _globalRenderer = _newRenderer;
        _lastTermChange = block.number;
    }

    /// @notice Function that returns the global renderer.
    /// @dev This function returns the global renderer of the terms.
    /// @return _globalRenderer The global renderer of the terms.
    function renderer() public view returns (string memory) {
        return _globalRenderer;
    }

    /// @notice Function to set the Global Document Template.
    /// @dev This function lets the owner of the contract set the global document template of the terms.
    /// @param _newDocTemplate The new document template to use for the terms.
    function setGlobalTemplate(string memory _newDocTemplate)
        external
        onlyOwner
    {
        _globalDocTemplate = _newDocTemplate;
        _lastTermChange = block.number;
    }

    /// @notice Function that returns the global document template.
    /// @dev This function returns the global document template of the terms.
    /// @return _globalDocTemplate The global document template of the terms.
    function docTemplate() external view returns (string memory) {
        return _globalDocTemplate;
    }

    /// @notice Function to set the Global Term/// @notice Explain to an end user what this does
    /// @dev This function lets the owner of the contract set the global terms
    /// @param _term The term to set.
    /// @param _value The value of the term to set.
    function setGlobalTerm(string memory _term, string memory _value)
        external
        onlyOwner
    {
        _globalTerms[_term] = _value;
        emit GlobalTermAdded(keccak256(bytes(_term)), keccak256(bytes(_value)));
        _lastTermChange = block.number;
    }

    /// @notice This function returns the global value of the term
    /// @dev This function returns the global value of the term
    /// @param _term The term to get.
    /// @return _globalTerms[_term] The global value of the term
    function globalTerm(string memory _term)
        public
        view
        returns (string memory)
    {
        return _globalTerms[_term];
    }

    /// @notice Function to get block of the latest term change.
    /// @dev This function returns the block number of the last term change.
    /// @return _lastTermChange The block number of the last term change.
    function currentTermsBlock() public view returns (uint256) {
        return _lastTermChange;
    }
}
