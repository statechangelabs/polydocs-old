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
import "./Termsable.sol";

// import {Base64} from "./libraries/Base64.sol";

contract Test721_NoToken is ERC721URIStorage, Ownable, TermsableNoToken {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    event MintNFT(address sender, uint256 tokenId);

    constructor() ERC721("GOAT BLOCS", "GOAT") {
        console.log("This is my NFT contract. Woah!");
    }

    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        require(_acceptedTerms(to), "Terms not accepted");
        super._transfer(from, to, tokenId);
    }

    // function tokenTerm(
    //     string memory _term,
    //     uint256 _tokenId //changed from external to public
    // ) public view override returns (string memory) {
    //     bytes32 keyHash = keccak256(bytes(_term));
    //     if (keyHash == keccak256("name")) {
    //         return name();
    //     }
    //     if (keyHash == keccak256("symbol")) {
    //         return symbol();
    //     }
    //     return super.tokenTerm(_term, _tokenId);
    // }

    function _safeMint(address _to, uint256 _tokenId) internal override {
        require(_acceptedTerms(_to), "Terms not accepted");
        super._safeMint(_to, _tokenId);
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
