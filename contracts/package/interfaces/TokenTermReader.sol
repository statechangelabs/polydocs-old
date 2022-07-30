// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface TokenTermReader {
    event TokenTermAdded(
        bytes32 indexed term,
        uint256 indexed tokenId,
        bytes32 value
    );

    function tokenTerm(string memory _key, uint256 _tokenId)
        external
        view
        returns (string memory);
}
