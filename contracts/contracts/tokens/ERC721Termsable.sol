// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "../termsable/TermsableNoToken.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "../interfaces/MetadataURI.sol";

contract ERC721Termsable is
    ERC721URIStorage,
    Ownable,
    TermsableNoToken,
    ERC2981
{
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds; // Changed to public to test for the timebeing
    string private _uri;
    event MintNFT(address sender, uint256 tokenId);

    mapping(address => bool) private _minters;

    modifier onlyMinters() {
        require(
            _minters[_msgSender()] || owner() == _msgSender(),
            "Not an Owner or Minter"
        );
        _;
    }

    constructor(
        address _newOwner,
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        _addMetaSigner(_msgSender());
        _transferOwnership(_newOwner);
    }

    function addMinters(address _minter) external onlyMetaSigner {
        _minters[_minter] = true;
    }

    function removeMinters(address _minter) external onlyMetaSigner {
        _minters[_minter] = false;
    }

    function isMinter(address _minter) public view returns (bool) {
        return _minters[_minter];
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC2981, ERC721)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        require(_acceptedTerms(to), "Terms not accepted");
        super._transfer(from, to, tokenId);
    }

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
        onlyMinters
        returns (uint256)
    {
        require(_acceptedTerms(_msgSender()), "Terms not accepted");
        uint256 newItemId = _tokenIds.current();

        _safeMint(msg.sender, newItemId);

        _setTokenURI(newItemId, _tokenURI);

        _tokenIds.increment();

        emit MintNFT(msg.sender, newItemId);
        return newItemId;
    }

    function mintFor(string memory _tokenURI, address _to)
        public
        onlyMetaSigner
        returns (uint256)
    {
        require(isMinter(_to), "Not a minter");
        require(_acceptedTerms(_to), "Terms not accepted");
        uint256 newItemId = _tokenIds.current();

        _safeMint(_to, newItemId);
        _setTokenURI(newItemId, _tokenURI);
        _tokenIds.increment();
        emit MintNFT(_to, newItemId);
        return newItemId;
    }
}
