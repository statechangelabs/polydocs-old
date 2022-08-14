// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./TermsableBase.sol";
import "../interfaces/TokenTermReader.sol";
import "../interfaces/TokenSignable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

abstract contract TokenTermsable is
    TermsableBase,
    TokenTermReader,
    TokenSignable
{
    /// @notice Mapping that stores whether the address has accepted terms for a specific token.
    /// @dev This mapping returns a boolean value indicating whether the address has accepted terms for a specific token.
    mapping(address => mapping(uint256 => bool)) hasAcceptedTerms;

    /// @notice This is mapping that store the URL for the agreeemnt for a specific token.
    /// @dev This mapping returns the URL for the agreement for a specific token.
    mapping(string => mapping(uint256 => string)) _tokenTerms;

    /// @notice This is mapping that store the CID of the template for a specific token.
    /// @dev This mapping returns the CID of the template for a specific token.
    mapping(uint256 => string) _tokenDocTemplates;

    /// @notice This is mapping that store the CID of the Renderer for a specific token.
    /// @dev This mapping returns the CID of the Renderer for a specific token.
    mapping(uint256 => string) _tokenRenderers;

    /// @notice This is an internal function that returns whether the address has accepted terms for a specific token.
    /// @dev This function returns a boolean value indicating whether the address has accepted terms for a specific token.
    /// @param to The address to check.
    /// @param tokenId The token id to check.
    /// @return hasAcceptedTerms[to][tokenId] True if the address has accepted terms for a specific token, false otherwise.
    function _acceptedTerms(address to, uint256 tokenId)
        internal
        view
        returns (bool)
    {
        return hasAcceptedTerms[to][tokenId];
    }

    /// @notice This is an external function that returns whether the address has accepted terms for a specific token.
    /// @dev This function returns a boolean value indicating whether the address has accepted terms for a specific token.
    /// @param to The address to check.
    /// @param tokenId The token id to check.
    /// @return _acceptedTerms(to, tokenId) True if the address has accepted terms for a specific token, false otherwise.
    function acceptedTerms(address to, uint256 tokenId)
        external
        view
        returns (bool)
    {
        return _acceptedTerms(to, tokenId);
    }

    /// @notice This is external function that the user can call to accept specific terms for a specific token.
    /// @dev This function accepts specific terms agreement mentioned on a URL for a specific token.
    /// @param tokenId The token id for which the terms are accepted.
    /// @param newtermsUrl The terms that are accepted.
    function acceptTerms(uint256 tokenId, string memory newtermsUrl) external {
        _acceptTerms(tokenId, newtermsUrl);
    }

    /// @notice This function is used to accept the terms at certain url on behalf of the user (metasigner) for a specific token.
    /// @dev This function is called by a metasigner to accept terms on behalf of the signer that wants to accepts terms for a specific token.
    /// @dev It uses ECDSA to recover the signer from the signature and the hash of the termsurl and checks if they match.
    /// @param _signer The address of the signer that wants to accept terms.
    /// @param _newtermsUrl The url of the terms.
    /// @param _signature The signature of the signer that wants to accept terms.
    /// @param _tokenId The token id for which the terms are accepted.
    function acceptTermsFor(
        address _signer,
        string memory _newtermsUrl,
        uint256 _tokenId,
        bytes memory _signature
    ) external {
        bytes32 hash = ECDSA.toEthSignedMessageHash(bytes(_newtermsUrl));
        address _checkedSigner = ECDSA.recover(hash, _signature);
        require(_checkedSigner == _signer);
        _acceptTerms(_tokenId, _newtermsUrl);
    }

    /// @notice This is an internal function that the user can call to accept specific terms for a specific token.
    /// @dev This function accepts specific terms agreement on a URL for a specific token.
    /// @dev It first checks if the terms the user is accepting are the latest terms for the token.
    /// @dev If they are not, it throws an error. If they are, it accepts the terms (updates mapping) and emits the AcceptedTerms event.
    /// @param _tokenId The token id for which the terms are accepted.
    /// @param _newtermsUrl The terms that are accepted.
    function _acceptTerms(uint256 _tokenId, string memory _newtermsUrl)
        internal
        virtual
    {
        require(
            keccak256(bytes(_newtermsUrl)) ==
                keccak256(bytes(_termsUrl(_tokenId))),
            "Terms Url does not match"
        );
        hasAcceptedTerms[msg.sender][_tokenId] = true;
        emit AcceptedTerms(msg.sender, _tokenId, _termsUrl(_tokenId));
    }

    /// @notice This is an external function that returns the URL for the agreement for a specific token.
    /// @dev This function returns the URL for the agreement for a specific token with prefix "ipfs://".
    function termsUrl(uint256 tokenId) external view returns (string memory) {
        return _termsUrlWithPrefix(tokenId, "ipfs://");
    }

    /// @notice This is an internal function that returns the URL for the agreement for a specific token.
    /// @dev This function returns the URL for the agreement for a specific token with prefix "ipfs://".
    function _termsUrl(uint256 tokenId) internal view returns (string memory) {
        return _termsUrlWithPrefix(tokenId, "ipfs://");
    }

    /// @notice This is an internal function that returns the URL for the terms agreement for a specific token.
    /// @dev This function returns the URL for the terms agreement for a specific token. It takes a prefix as an argument.
    /// @dev It concatenates the prefix with tokenRenderer, tokenTemplate, chain Id, address of the contract, latest block height when the terms changed for that token and token Id.
    /// @param tokenId The token id for which the terms URL is returned.
    /// @param prefix The prefix to be added to the URL.
    /// @return _termsURL The URL of the terms agreement for a specific token.
    function _termsUrlWithPrefix(uint256 tokenId, string memory prefix)
        internal
        view
        returns (string memory _termsURL)
    {
        _termsURL = string(
            abi.encodePacked(
                prefix,
                _tokenRenderer(tokenId),
                "/#/",
                _tokenTemplate(tokenId),
                "::",
                Strings.toString(block.chainid),
                "::",
                Strings.toHexString(uint160(address(this)), 20),
                "::",
                Strings.toString(_lastTermChange),
                "::",
                Strings.toString(tokenId)
            )
        );
    }

    /// @notice This is a public function that returns the URL of the agreement for a specific token.
    /// @dev This function returns the URL of the agreement for a specific token.
    /// @param tokenId The token id for which the terms URL is returned.
    /// @param prefix The prefix to be added to the URL.
    /// @return _termsUrlWithPrefix(tokenId, prefix) The URL of the terms agreement for a specific token with a given prefix.
    function termsUrlWithPrefix(uint256 tokenId, string memory prefix)
        public
        view
        returns (string memory)
    {
        return _termsUrlWithPrefix(tokenId, prefix);
    }

    /// @notice This function can be called by the owner to set the CID of the template for a specific token.
    /// @dev This function sets the CID of the template for a specific token.
    /// @param tokenId The token id for which the template is set.
    /// @param newTokenTemplate The CID of the template for a specific token.
    function setTokenTemplate(uint256 tokenId, string memory newTokenTemplate)
        external
        onlyOwner
    {
        _tokenDocTemplates[tokenId] = newTokenTemplate;
        _lastTermChange = block.number;
    }

    /// @notice This function returns the CID of the template for a specific token.
    /// @dev This function returns the CID of the template for a specific token.
    /// @param tokenId The token id for which the template is returned.
    /// @return _tokenTempate(tokenId) The CID of the template for a specific token.
    function tokenTemplate(uint256 tokenId)
        external
        view
        returns (string memory)
    {
        return _tokenTemplate(tokenId);
    }

    /// @notice This is a function that can be called by the owner to set the CID of the renderer for a specific token.
    /// @dev This function sets the CID of the renderer for a specific token.
    /// @param tokenId The token id for which the renderer is set.
    /// @param newRenderer The CID of the renderer for a specific token.
    function setTokenRenderer(uint256 tokenId, string memory newRenderer)
        external
        onlyOwner
    {
        _tokenRenderers[tokenId] = newRenderer;
    }

    /// @notice This function returns the CID of the renderer for a specific token.
    /// @dev This function returns the CID of the renderer for a specific token.
    /// @param tokenId The token id for which the renderer is returned.
    /// @return _tokenRenderer(tokenId) The CID of the renderer for a specific token.
    function tokenRenderer(uint256 tokenId)
        external
        view
        returns (string memory)
    {
        return _tokenRenderer(tokenId);
    }

    /// @notice This is an internal function that returns the CID of the renderer for a specific token.
    /// @dev This function returns the CID of the renderer for a specific token or the global renderer if the token renderer is not set.
    /// @param _tokenId The token id for which the renderer is returned.
    /// @return _tokenRenderers[_tokenId] The CID of the renderer for a specific token or _globalRenderer if the token renderer is not set.
    function _tokenRenderer(uint256 _tokenId)
        internal
        view
        returns (string memory)
    {
        if (bytes(_tokenRenderers[_tokenId]).length == 0)
            return _globalRenderer;
        else return _tokenRenderers[_tokenId];
    }

    /// @notice This is an internal function that returns the CID of the template for a specific token.
    /// @dev This function returns the CID of the renderer for a specific token or the global template if the token template is not set.
    /// @param _tokenId The token id for which the template is returned.
    /// @return _tokenDocTemplates[_tokenId] The CID of the template for a specific token or _globalDocTemplate if the token template is not set.
    function _tokenTemplate(uint256 _tokenId)
        internal
        view
        returns (string memory)
    {
        if (bytes(_tokenDocTemplates[_tokenId]).length == 0)
            return _globalDocTemplate;
        else return _tokenDocTemplates[_tokenId];
    }

    /// @notice This function is used to set a value for a specific term for a specific token.
    /// @dev This function is used to set a value for a specific term for a specific token.
    /// @dev It emits the the TokenTermAdded event and records the last time the terms were changed.
    /// @param _tokenId The token id for which the term is set.
    /// @param _term The term for which the value is set.
    /// @param _value The value for the term.
    function setTokenTerm(
        string memory _term,
        uint256 _tokenId,
        string memory _value
    ) external onlyOwner {
        _tokenTerms[_term][_tokenId] = _value;
        emit TokenTermAdded(
            keccak256(bytes(_term)),
            _tokenId,
            keccak256(bytes(_value))
        );
        _lastTermChange = block.number;
    }

    /// @notice This function is used to get the value for a specific term for a specific token.
    /// @dev This function is used to get the value for a specific term for a specific token. If the term is not set for the specific token,
    /// @dev it returns  the _global term value for the specific term.
    /// @param _tokenId The token id for which the term is returned.
    /// @param _term The term for which the value is returned.
    /// @return _tokenTerms[_term][_tokenId] The value for the term or the global term value if the term is not set.
    function tokenTerm(string memory _term, uint256 _tokenId)
        public
        view
        virtual
        returns (string memory)
    {
        if (bytes(_tokenTerms[_term][_tokenId]).length > 0)
            return _tokenTerms[_term][_tokenId];
        else return _globalTerms[_term];
    }
}
