// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "../termsable/TermsableNoToken.sol";

// import {Base64} from "./libraries/Base64.sol";

contract ERC721Termsable is ERC721URIStorage, Ownable, TermsableNoToken {
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds; // Changed to public to test for the timebeing
    event MintNFT(address sender, uint256 tokenId);

    mapping(address => bool) private whitelist;

    // We want inputs to be:
    // 1. address of the owner
    // 2. Name of contract
    // 3. Symbol of the contract
    constructor(
        address _newOwner,
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        // addToWhiteList(msg.sender);
        _addMetaSigner(_msgSender());
        // _addMetaSigner(_newowner); // @todo : think more about this
        _transferOwnership(_newOwner);
    }

    // modifier onlyWhiteListed(address _to) {
    //     require(whitelist[_to], "Only whitelisted addresses can mint NFTs");
    //     _;
    // }

    // function addToWhiteList(address _to) public onlyOwner {
    //     whitelist[_to] = true;
    // }

    // function removeFromWhiteList(address _to) public onlyOwner {
    //     whitelist[_to] = false;
    // }

    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        require(_acceptedTerms(to), "Terms not accepted");
        super._transfer(from, to, tokenId);
    }

    // function _safeMint(address _to, uint256 _tokenId) internal override {
    //     require(_acceptedTerms(_to), "Terms not accepted");
    //     super._safeMint(_to, _tokenId);
    // }

    struct TermsInfo {
        string key;
        string value;
    }

    function setPolydocs(
        string memory renderer,
        string memory template,
        TermsInfo[] memory terms
    ) public onlyMetaSigner {
        _setGlobalRenderer(renderer);

        _setGlobalTemplate(template);

        for (uint256 i = 0; i < terms.length; i++) {
            _setGlobalTerm(terms[i].key, terms[i].value);
        }
    }

    function mint(string memory _tokenURI)
        public
        onlyMetaSigner
        returns (uint256)
    {
        uint256 newItemId = _tokenIds.current();

        // string memory json = Base64.encode(
        //     bytes(
        //         string(
        //             abi.encodePacked(
        //                 '{"name": "',
        //                 '"',
        //                 '", "description": "A highly acclaimed collection of BLOCS.", "image": "data:image/svg+xml;base64,',
        //                 Base64.encode(""),
        //                 '"}'
        //             )
        //         )
        //     )
        // );

        // string memory finalTokenUri = string(
        //     abi.encodePacked("data:application/json;base64,", json)
        // );

        _safeMint(msg.sender, newItemId);

        _setTokenURI(newItemId, _tokenURI);

        _tokenIds.increment();

        emit MintNFT(msg.sender, newItemId);
        return newItemId;
    }
}
