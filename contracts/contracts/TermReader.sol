// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface TermReader {
    event GlobalTermAdded(bytes32 indexed term, bytes32 value);

    function globalTerm(string memory _key)
        external
        view
        returns (string memory);
}

interface TokenTermReader is TermReader {
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
