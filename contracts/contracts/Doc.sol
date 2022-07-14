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

// import {Base64} from "./libraries/Base64.sol";

contract Doc is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    event MintNFT(address sender, uint256 tokenId);
    event AcceptedTerms(address sender, uint256 tokenId, string terms);

    mapping(address => mapping(uint256 => bool)) hasAcceptedTerms;
    mapping(uint256 => string) tokenTermURLs;

    string _termsURL = "https://example.com/terms";

    constructor() ERC721("GOAT BLOCS", "GOAT") {
        console.log("This is my NFT contract. Woah!");
    }

    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        require(_acceptedTerms(to, tokenId), "Terms not accepted");
        super._transfer(from, to, tokenId);
    }

    function _acceptedTerms(address to, uint256 tokenId)
        internal
        view
        returns (bool)
    {
        return hasAcceptedTerms[to][tokenId];
    }

    function acceptTerms(uint256 tokenId, string _termsURL) external {
        require(_termsURL == termsURL(tokenId), "Terms URL does not match");
        hasAcceptedTerms[msg.sender][tokenId] = true;
        emit AcceptedTerms(msg.sender, tokenId, termsURL(tokenId));
    }

    function acceptedTerms(
        address to,
        uint256 tokenId,
    ) external view returns (bool) {
        return hasAcceptedTerms[to][tokenId];
    }

    function termsURL(uint256 tokenId) public view returns (string memory) {
        if (bytes(tokenTermURLs[tokenId]).length == 0) {
            return _termsURL;
        } else {
            return tokenTermURLs[tokenId];
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

    function mint() public {
        uint256 newItemId = _tokenIds.current();

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        '"',
                        '", "description": "A highly acclaimed collection of BLOCS.", "image": "data:image/svg+xml;base64,',
                        Base64.encode(""),
                        '"}'
                    )
                )
            )
        );

        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        _safeMint(msg.sender, newItemId);

        _setTokenURI(newItemId, finalTokenUri);

        _tokenIds.increment();
        console.log(
            "An NFT w/ ID %s has been minted to %s",
            newItemId,
            msg.sender
        );

        emit MintNFT(msg.sender, newItemId);
    }
}
