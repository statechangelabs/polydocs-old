// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../termsable/TermsableNoToken.sol";

contract TemplateRegistry is Ownable, TermsableNoToken {
    struct Template {
        string name;
        string cid;
        int score;
        string MetadataURI;
        address owner;
    }

    Template[] private templates;
    mapping(string => uint256) private indexes;
    uint minfee = 0.5 ether;

    event TemplateAdded(address owner, uint256 indexed index);

    function add(Template memory _template) public {
        require(_acceptedTerms(msg.sender));
        uint256 index = templates.length;
        templates.push(_template);
        indexes[_template.cid] = index;
        emit TemplateAdded(_template.owner, index);
    }

    function template(uint256 _index) public view returns (Template memory) {
        return templates[_index];
    }

    function templatebyCID(string memory _cid)
        public
        view
        returns (Template memory)
    {
        return templates[indexes[_cid]];
    }

    function count() public view returns (uint256) {
        return templates.length;
    }

    function indexOf(string memory _cid) public view returns (uint256) {
        return indexes[_cid];
    }

    function upvote(string memory _cid) public payable {
        require(
            msg.value >= minfee,
            "You must pay at least the minimum fee to upvote"
        );
        for (uint256 i = 0; i < templates.length; i++) {
            if (keccak256(bytes(templates[i].cid)) == keccak256(bytes(_cid))) {
                templates[i].score += int(msg.value);
            }
        }
    }

    function downvote(string memory _cid) public payable {
        require(
            msg.value >= minfee,
            "You must pay at least the minimum fee to downvote"
        );
        for (uint256 i = 0; i < templates.length; i++) {
            if (keccak256(bytes(templates[i].cid)) == keccak256(bytes(_cid))) {
                templates[i].score -= int(msg.value);
            }
        }
    }

    function score(string memory _cid) public view returns (int) {
        for (uint256 i = 0; i < templates.length; i++) {
            if (keccak256(bytes(templates[i].cid)) == keccak256(bytes(_cid))) {
                return templates[i].score;
            }
        }
        return 0;
    }
}
