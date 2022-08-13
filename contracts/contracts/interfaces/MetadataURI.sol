// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface MetadataURI {
    /// @notice Event that is emitted when contract URI is updated.
    /// @dev This event is emitted when contract URI is updated.
    /// @param uri The new contract URI.
    event UpdatedURI(string uri);

    /// @notice This function is used to return the contract URI
    /// @dev Function to return the contract URI
    /// @return _uri The contract URI
    function URI() external view returns (string memory _uri);
}
