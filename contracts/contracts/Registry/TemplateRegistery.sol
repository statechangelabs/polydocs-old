// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../termsable/TermsableNoToken.sol";

contract TemplateRegistry is Ownable, TermsableNoToken {
    /// @notice Struct to store Template related data
    struct Template {
        /// @notice Template name
        string name;
        /// @notice Template cid on IPFS
        string cid;
        /// @notice Template reputation score
        int score;
        /// @notice Template metadata
        string MetadataURI;
        /// @notice Template owner(uploader)
        address owner;
    }
    /// @notice Array that stores all the templates
    Template[] private templates;
    /// @notice Mapping that stores the mapping of template cid to template index
    mapping(string => uint256) private indexes;
    /// @notice Minimum fee to score a template
    uint minfee = 0.5 ether;

    /// @notice This event is emitted when a template is added to the registry
    /// @dev This event is emitted when a template is added to the registry
    /// @param owner The owner of the template
    /// @param index The index of the template in the registry
    event TemplateAdded(address owner, uint256 indexed index);

    /// @notice This function let's a user add a template to the registry
    /// @dev This function let's a user add a template of type Template structure to the registry and emits the TemplateAdded event.
    /// @param _template The template of type struct Template to add to the registry
    function add(Template memory _template) public {
        require(_acceptedTerms(msg.sender));
        uint256 index = templates.length;
        templates.push(_template);
        indexes[_template.cid] = index;
        emit TemplateAdded(_template.owner, index);
    }

    /// @notice This function returns the template at a certain index
    /// @dev This function returns the template at a certain index
    /// @param _index The index of the template to return
    /// @return The template of type Template at the given index
    function template(uint256 _index) public view returns (Template memory) {
        return templates[_index];
    }

    /// @notice This function returns the template given a cid
    /// @dev This function returns the template given a cid
    /// @param _cid The cid of the template to return
    /// @return The template of type Template at the given cid
    function templatebyCID(string memory _cid)
        public
        view
        returns (Template memory)
    {
        return templates[indexes[_cid]];
    }

    /// @notice This function returns the number of templates in the registry
    function count() public view returns (uint256) {
        return templates.length;
    }

    /// @notice This function returns the index of a template given a cid
    /// @dev This function returns the index of a template given a cid
    /// @param _cid The cid of the template to return the index of
    /// @return The index of the template in the registry
    function indexOf(string memory _cid) public view returns (uint256) {
        return indexes[_cid];
    }

    /// @notice This function let's a user upvote a template to increase its reputation score
    /// @dev This is a payable function let's a user upvote a template given it's cid to increase its reputation score
    /// @dev This function also checks if the user has paid atleast the minimum fee to score a template
    /// @param _cid The cid of the template to upvote
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

    /// @notice This function let's a user downvote a template to increase its reputation score
    /// @dev This is a payable function let's a user downvote a template given it's cid to decrease its reputation score
    /// @dev This function also checks if the user has paid atleast the minimum fee to score a template
    /// @param _cid The cid of the template to downvote
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

    /// @notice This function returns the reputation score of a template given a cid
    /// @dev This function returns the reputation score of a template given a cid
    /// @param _cid The cid of the template to return the reputation score of
    /// @return The reputation score of the template
    function score(string memory _cid) public view returns (int) {
        for (uint256 i = 0; i < templates.length; i++) {
            if (keccak256(bytes(templates[i].cid)) == keccak256(bytes(_cid))) {
                return templates[i].score;
            }
        }
        return 0;
    }
}
