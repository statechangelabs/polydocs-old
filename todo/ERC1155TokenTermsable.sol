// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "../termsable/TokenTermsable.sol";

// import {Base64} from "./libraries/Base64.sol";

contract ERC1155TokenTermsable is
    ERC1155Supply,
    ERC1155Burnable,
    Ownable,
    TokenTermsable
{
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds;
    event MintNFT(address sender, uint256 tokenId, uint256 amount);

    string internal name_;
    string internal symbol_;

    // string uri;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _uri
    ) ERC1155(_uri) {
        name_ = _name;
        symbol_ = _symbol;
    }

    function name() public view returns (string memory) {
        return name_;
    }

    function symbol() public view returns (string memory) {
        return symbol_;
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override(ERC1155, ERC1155Supply) {
        for (uint256 i = 0; i < ids.length; i++) {
            require(_acceptedTerms(to, ids[i]), "Terms not accepted");
        }
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    // function _mint(
    //     address _to,
    //     uint256 _tokenId,
    //     uint256 _amount,
    //     bytes memory _data
    // ) internal override {
    //     require(_acceptedTerms(_to, _tokenId), "Terms not accepted");
    //     super._mint(_to, _tokenId, _amount, _data);
    // }

    function mint(uint256 amount) public {
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

        _mint(msg.sender, newItemId, amount, "");

        _setURI(finalTokenUri);

        // _tokenIds.increment();
        console.log(
            "%s NFTs w/ ID %s has been minted to %s",
            amount,
            newItemId,
            msg.sender
        );

        emit MintNFT(msg.sender, newItemId, amount);
    }
}
