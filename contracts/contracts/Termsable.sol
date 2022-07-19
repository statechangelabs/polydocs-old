// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
// import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";
// import "hardhat/console.sol";
// import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./TermReader.sol";

abstract contract TermsableBase is Ownable, TermReader {
    // uint256 _chainId = 137;
    string _renderer = "ABCDEFG";
    string _docTemplate = "LMNOPQRST";
    mapping(uint256 => string) _tokenDocTemplates;
    mapping(string => string) _globalTerms;
    uint256 _lastTermChange = 0;

    function setRenderer(string memory _newRenderer) external onlyOwner {
        _renderer = _newRenderer;
        _lastTermChange = block.number;
    }

    function renderer() public view returns (string memory) {
        return _renderer;
    }

    function setTemplate(string memory _newDocTemplate) external onlyOwner {
        _docTemplate = _newDocTemplate;
        _lastTermChange = block.number;
    }

    function docTemplate() external view returns (string memory) {
        return _docTemplate;
    }

    function setGlobalTerm(string memory _key, string memory _value)
        external
        onlyOwner
    {
        _globalTerms[_key] = _value;
        emit GlobalTermAdded(keccak256(bytes(_key)), keccak256(bytes(_value)));
        _lastTermChange = block.number;
    }

    function term(string memory _key) public view returns (string memory) {
        return _globalTerms[_key];
    }

    function currentTermsBlock() public view returns (uint256) {
        return _lastTermChange;
    }
}

abstract contract TermsableNoToken is TermsableBase {
    event AcceptedTerms(address sender, string terms);
    mapping(address => bool) _hasAcceptedTerms;

    function acceptedTerms(address _address) public view returns (bool) {
        return _hasAcceptedTerms[_address];
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
                    _renderer,
                    "/#/",
                    _docTemplate,
                    "::",
                    Strings.toString(block.number),
                    "::",
                    Strings.toString(block.chainid),
                    "::",
                    Strings.toHexString(uint160(address(this)), 20),
                    "::",
                    Strings.toString(_lastTermChange)
                )
            );
    }
}

abstract contract TokenTermsable is TermsableBase, TokenTermReader {
    event AcceptedTerms(address sender, uint256 tokenId, string terms);
    mapping(address => mapping(uint256 => bool)) hasAcceptedTerms;
    mapping(string => mapping(uint256 => string)) _tokenTerms;

    function _acceptedTerms(address to, uint256 tokenId)
        internal
        view
        returns (bool)
    {
        return hasAcceptedTerms[to][tokenId];
    }

    function acceptTerms(uint256 tokenId, string memory _newtermsUrl) external {
        require(
            keccak256(bytes(_newtermsUrl)) ==
                keccak256(bytes(termsUrl(tokenId))),
            "Terms Url does not match"
        );
        hasAcceptedTerms[msg.sender][tokenId] = true;
        emit AcceptedTerms(msg.sender, tokenId, termsUrl(tokenId));
    }

    function acceptedTerms(address to, uint256 tokenId)
        external
        view
        returns (bool)
    {
        return _acceptedTerms(to, tokenId);
    }

    function termsUrl(uint256 tokenId) public view returns (string memory) {
        return _termsUrlWithPrefix(tokenId, "ipfs://");
    }

    function _termsUrlWithPrefix(uint256 tokenId, string memory prefix)
        internal
        view
        returns (string memory)
    {
        if (bytes(_tokenDocTemplates[tokenId]).length == 0) {
            return
                string(
                    abi.encodePacked(
                        prefix,
                        _renderer,
                        "/#/",
                        _docTemplate,
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
        } else {
            return
                string(
                    abi.encodePacked(
                        prefix,
                        _renderer,
                        "/#/",
                        _tokenDocTemplates[tokenId],
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

    function tokenDocTemplate(string memory _key, uint256 _tokenId)
        public
        view
        returns (string memory)
    {
        if (bytes(_tokenTerms[_key][_tokenId]).length > 0)
            return _tokenTerms[_key][_tokenId];
        else return _globalTerms[_key];
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
