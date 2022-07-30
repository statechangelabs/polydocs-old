// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface TermReader {
    event GlobalTermAdded(bytes32 indexed term, bytes32 value);

    function globalTerm(string memory _key)
        external
        view
        returns (string memory);
}
