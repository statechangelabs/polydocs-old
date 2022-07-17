// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract Termsable is Ownable {
    event AcceptedTerms(address sender, uint256 tokenId, string terms);
    uint256 _chainId = 137;
    string _renderer = "ABCDEFG";
    mapping(address => mapping(uint256 => bool)) hasAcceptedTerms;
    mapping(uint256 => string) tokenTermURLs;

    string _termsURL = "LMNOPQRST";

    function _acceptedTerms(address to, uint256 tokenId)
        internal
        view
        returns (bool)
    {
        return hasAcceptedTerms[to][tokenId];
    }

    function acceptTerms(uint256 tokenId, string memory _newtermsURL) external {
        require(
            keccak256(bytes(_newtermsURL)) ==
                keccak256(bytes(termsURL(tokenId))),
            "Terms URL does not match"
        );
        hasAcceptedTerms[msg.sender][tokenId] = true;
        emit AcceptedTerms(msg.sender, tokenId, termsURL(tokenId));
    }

    function acceptedTerms(address to, uint256 tokenId)
        external
        view
        returns (bool)
    {
        return hasAcceptedTerms[to][tokenId];
    }

    function termsURL(uint256 tokenId) public view returns (string memory) {
        if (bytes(tokenTermURLs[tokenId]).length == 0) {
            return
                string(
                    abi.encodePacked(
                        "ipfs://",
                        _renderer,
                        "/#/",
                        _termsURL,
                        "/",
                        Strings.toString(_chainId),
                        ":",
                        Strings.toHexString(uint160(address(this)), 20),
                        "/",
                        Strings.toString(tokenId),
                        "/",
                        Strings.toString(block.number)
                    )
                );
        } else {
            return
                string(
                    abi.encodePacked(
                        ("ipfs://"),
                        _renderer,
                        "/#/",
                        tokenTermURLs[tokenId],
                        "/",
                        Strings.toString(_chainId),
                        ":",
                        Strings.toHexString(uint160(address(this)), 20),
                        "/",
                        Strings.toString(tokenId),
                        "/",
                        Strings.toString(block.number)
                    )
                );
        }
    }

    function setTermsURL(uint256 tokenID, string memory _newTermsURL)
        external
        onlyOwner
    {
        tokenTermURLs[tokenID] = _newTermsURL;
    }

    function setDefaultTerms(string memory _newTermsURL) external onlyOwner {
        _termsURL = _newTermsURL;
    }

    function defaultTerms() external view returns (string memory) {
        return _termsURL;
    }
}
