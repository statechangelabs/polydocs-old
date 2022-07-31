// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract Verify {
    function validateSigner(
        string memory url,
        bytes memory sig,
        address _signer
    ) public view returns (address signer) {
        bytes32 hash = ECDSA.toEthSignedMessageHash(bytes(url));
        signer = ECDSA.recover(hash, sig);
        require(signer == _signer);
    }
}
