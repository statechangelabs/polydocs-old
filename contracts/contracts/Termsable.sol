// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
// import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";
// import "hardhat/console.sol";
// import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface TermReader {
    event GlobalTermAdded(bytes32 indexed term, bytes32 value);
    event TokenTermAdded(
        bytes32 indexed term,
        uint256 indexed tokenId,
        bytes32 value
    );

    function getTerm(string memory _key, uint256 _tokenId)
        external
        view
        returns (string memory);
}

abstract contract Termsable is Ownable, TermReader {
    event AcceptedTerms(address sender, uint256 tokenId, string terms);
    uint256 _chainId = 137;
    string _renderer = "ABCDEFG";
    mapping(address => mapping(uint256 => bool)) hasAcceptedTerms;
    mapping(uint256 => string) tokenTermURLs;

    string _termsURL = "LMNOPQRST";
    mapping(string => string) _globalTerms;
    mapping(string => mapping(uint256 => string)) _tokenTerms;

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
                        "/",
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
                        "/",
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

    function getTerm(string memory _key) public view returns (string memory) {
        return _globalTerms[_key];
    }

    function getTokenTerm(string memory _key, uint256 _tokenId)
        public
        view
        returns (string memory)
    {
        if (bytes(_tokenTerms[_key][_tokenId]).length > 0)
            return _tokenTerms[_key][_tokenId];
        else return _globalTerms[_key];
    }

    function setGlobalTerm(string memory _key, string memory _value)
        external
        onlyOwner
    {
        _globalTerms[_key] = _value;
        emit GlobalTermAdded(keccak256(bytes(_key)), keccak256(bytes(_value)));
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
    }
}
