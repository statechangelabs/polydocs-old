// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface TokenTermReader {
    /// @notice Event emitted when a new token term is added.
    /// @dev Event emitted when a new token term is added.
    /// @param _term The term being added to the contract.
    /// @param _tokenId The token id of the token for which the term is being added.
    /// @param _value The value of the term being added to the contract.
    event TokenTermAdded(
        bytes32 indexed _term,
        uint256 indexed _tokenId,
        bytes32 _value
    );

    /// @notice This function is used to return the value of the term for a specific token.
    /// @dev This function returns the value of a term given its term for a specific token.
    /// @param _term The term to get
    /// @param _tokenId The token id of the token for which the term's value is being returned.
    /// @return _value The value of the term.
    function tokenTerm(string memory _term, uint256 _tokenId)
        external
        view
        returns (string memory _value);
}
