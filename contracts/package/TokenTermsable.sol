// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./TermsableBase.sol";
import "./interfaces/TokenTermReader.sol";

abstract contract TokenTermsable is TermsableBase, TokenTermReader {
    event AcceptedTerms(address sender, uint256 tokenId, string terms);
    mapping(address => mapping(uint256 => bool)) hasAcceptedTerms;
    mapping(string => mapping(uint256 => string)) _tokenTerms;
    mapping(uint256 => string) _tokenDocTemplates;
    mapping(uint256 => string) _tokenRenderers;

    function _acceptedTerms(address to, uint256 tokenId)
        internal
        view
        returns (bool)
    {
        return hasAcceptedTerms[to][tokenId];
    }

    function acceptedTerms(address to, uint256 tokenId)
        external
        view
        returns (bool)
    {
        return _acceptedTerms(to, tokenId);
    }

    function acceptTerms(uint256 tokenId, string memory _newtermsUrl) external {
        _acceptTerms(tokenId, _newtermsUrl);
    }

    function _acceptTerms(uint256 tokenId, string memory _newtermsUrl)
        internal
        virtual
    {
        require(
            keccak256(bytes(_newtermsUrl)) ==
                keccak256(bytes(termsUrl(tokenId))),
            "Terms Url does not match"
        );
        hasAcceptedTerms[msg.sender][tokenId] = true;
        emit AcceptedTerms(msg.sender, tokenId, termsUrl(tokenId));
    }

    function termsUrl(uint256 tokenId) public view returns (string memory) {
        return _termsUrlWithPrefix(tokenId, "ipfs://");
    }

    function _termsUrlWithPrefix(uint256 tokenId, string memory prefix)
        internal
        view
        returns (string memory)
    {
        return
            string(
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

    function termsUrlWithPrefix(uint256 _tokenId, string memory prefix)
        public
        view
        returns (string memory)
    {
        return _termsUrlWithPrefix(_tokenId, prefix);
    }

    function setTokenTemplate(uint256 tokenID, string memory _newTermsUrl)
        external
        onlyOwner
    {
        _tokenDocTemplates[tokenID] = _newTermsUrl;
        _lastTermChange = block.number;
    }

    function tokenTemplate(uint256 _tokenId)
        external
        view
        returns (string memory)
    {
        return _tokenTemplate(_tokenId);
    }

    function setTokenRenderer(uint256 tokenId, string memory _newRenderer)
        external
        onlyOwner
    {
        _tokenRenderers[tokenId] = _newRenderer;
    }

    function tokenRenderer(uint256 tokenId)
        external
        view
        returns (string memory)
    {
        return _tokenRenderer(tokenId);
    }

    function _tokenRenderer(uint256 _tokenId)
        internal
        view
        returns (string memory)
    {
        if (bytes(_tokenRenderers[_tokenId]).length == 0)
            return _globalRenderer;
        else return _tokenRenderers[_tokenId];
    }

    function _tokenTemplate(uint256 _tokenId)
        internal
        view
        returns (string memory)
    {
        if (bytes(_tokenDocTemplates[_tokenId]).length == 0)
            return _globalDocTemplate;
        else return _tokenDocTemplates[_tokenId];
    }

    function setTokenTerm(
        string memory _key,
        uint256 _tokenId,
        string memory _value
    ) external onlyOwner {
        _tokenTerms[_key][_tokenId] = _value;
        emit TokenTermAdded(
            keccak256(bytes(_key)),
            _tokenId,
            keccak256(bytes(_value))
        );
        _lastTermChange = block.number;
    }

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
