// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./TermsableBase.sol";

abstract contract TermsableNoToken is TermsableBase {
    event AcceptedTerms(address sender, string terms);
    mapping(address => bool) _hasAcceptedTerms;

    function _acceptedTerms(address _to) internal view returns (bool) {
        return _hasAcceptedTerms[_to];
    }

    function acceptedTerms(address _address) external view returns (bool) {
        return _acceptedTerms(_address);
    }

    function acceptTerms(string memory _newtermsUrl) public {
        require(
            keccak256(bytes(_newtermsUrl)) == keccak256(bytes(termsUrl())),
            "Terms Url does not match"
        );
        _hasAcceptedTerms[msg.sender] = true;
        emit AcceptedTerms(msg.sender, termsUrl());
    }

    function termsUrl() public view returns (string memory) {
        return _termsUrlWithPrefix("ipfs://");
    }

    function termsUrlWithPrefix(string memory prefix)
        public
        view
        returns (string memory)
    {
        return _termsUrlWithPrefix(prefix);
    }

    function _termsUrlWithPrefix(string memory prefix)
        public
        view
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    prefix,
                    _globalRenderer,
                    "/#/",
                    _globalDocTemplate,
                    "::",
                    // Strings.toString(block.number),
                    // "::",
                    Strings.toString(block.chainid),
                    "::",
                    Strings.toHexString(uint160(address(this)), 20),
                    "::",
                    Strings.toString(_lastTermChange)
                )
            );
    }
}
