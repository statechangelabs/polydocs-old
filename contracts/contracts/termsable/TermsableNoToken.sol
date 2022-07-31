// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import "./TermsableBase.sol";

abstract contract TermsableNoToken is TermsableBase {
    /// @notice Event that is emitted when a terms are accepted.
    /// @dev This event is emitted when a terms are accepted.
    /// @param sender The address that accepted the terms.
    /// @param terms The terms that were accepted.
    event AcceptedTerms(address sender, string terms);

    /// @notice Mapping that stores whether the address has accepted terms.
    /// @dev This mapping returns a boolean value indicating whether the address has accepted terms.
    mapping(address => bool) _hasAcceptedTerms;

    /// @notice This is an internal function that returns whether the address has accepted terms.
    /// @dev This function returns a boolean value indicating whether the address has accepted terms.
    /// @param _to The address to check.
    /// @return True if the address has accepted terms, false otherwise.
    function _acceptedTerms(address _to) internal view returns (bool) {
        return _hasAcceptedTerms[_to];
    }

    /// @notice This is an external function that returns whether the address has accepted terms.
    /// @dev This function returns a boolean value indicating whether the address has accepted terms.
    /// @param _address The address to check.
    /// @return True if the address has accepted terms, false otherwise.
    function acceptedTerms(address _address) external view returns (bool) {
        return _acceptedTerms(_address);
    }

    /// @notice This is an external function called by a user that wants to accepts the agreement at certain url
    /// @dev This function is called by a user that wants to accepts terms. It checks if the terms url for the agreement is the latest one.
    /// @dev It then updates the mapping _hasAcceptedTerms and emits the AcceptedTerms event.
    /// @param _newtermsUrl The url of the terms.
    function acceptTerms(string memory _newtermsUrl) external {
        require(
            keccak256(bytes(_newtermsUrl)) == keccak256(bytes(termsUrl())),
            "Terms Url does not match"
        );
        _acceptTerms(msg.sender, _newtermsUrl);
    }

    function acceptTermsFor(
        address _signer,
        string memory _newtermsUrl,
        bytes memory _signature
    ) external {
        bytes32 hash = ECDSA.toEthSignedMessageHash(bytes(_newtermsUrl));
        address _checkedSigner = ECDSA.recover(hash, _signature);
        require(_checkedSigner == _signer);
        _acceptedTerms(_signer, _newtermsUrl);
    }

    function _acceptTerms(address _signer, string memory termsUrl) internal {
        _hasAcceptedTerms[msg.sender] = true;
        emit AcceptedTerms(msg.sender, _newtermsUrl);
    }

    /// @notice This function returns the url of the terms.
    /// @dev This function returns the url of the terms with the prefix "ipfs://".
    function termsUrl() public view returns (string memory) {
        return _termsUrlWithPrefix("ipfs://");
    }

    /// @notice This function returns the url of the terms with a given prefix
    /// @dev This function returns the url of the terms with the prefix
    /// @param prefix The prefix of the url.
    /// return _termsUrlWithPrefix(prefix) The url of the terms with the prefix.
    function termsUrlWithPrefix(string memory prefix)
        public
        view
        returns (string memory)
    {
        return _termsUrlWithPrefix(prefix);
    }

    /// @notice This is an internal function that returns the url of the agreement with a given prefix.
    /// @dev This function returns the url of the agreement with the prefix.
    /// @dev It uses the global renderer, template, chain id, contract address of the deployed contract and the latest block height to concatenate the url.
    /// @param prefix The prefix of the url.
    /// @return _termsURL The url of the agreement with the prefix.
    function _termsUrlWithPrefix(string memory prefix)
        public
        view
        returns (string memory _termsURL)
    {
        _termsURL = string(
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
