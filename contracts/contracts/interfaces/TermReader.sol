// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface TermReader {
    /// @notice This event is fired when a token term is added.
    /// @dev Event when a new Global term is added to the contract
    /// @param _term The term being added to the contract
    /// @param _value value of the term added to the contract
    event GlobalTermAdded(bytes32 indexed _term, bytes32 _value);

    /// @notice This function is used to return the value of the term
    /// @dev Function to return the value of the term
    /// @param _term  The term to get
    /// @return _value The value of the term
    function globalTerm(string memory _term)
        external
        view
        returns (string memory _value);
}
