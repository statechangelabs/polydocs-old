// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../interfaces/TermReader.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "../interfaces/MetadataURI.sol";

abstract contract TermsableBase is Ownable, TermReader, MetadataURI {
    /// @notice The default value of the global renderer.
    /// @dev The default value of the global renderer.
    string _globalRenderer = "";

    /// @notice The default value of the global template.
    /// @dev The default value of the global template.
    string _globalDocTemplate = "";

    string private _uri;

    /// @notice Mapping that store the global terms.
    /// @dev This mapping stores the global terms.
    mapping(string => string) _globalTerms;

    /// @notice This is the latest block height at which the terms were updated.
    /// @dev This is the latest block height at which the terms were updated. 0 by default.
    uint256 _lastTermChange = 0;

    /// @notice Returns whether the address is allowed to accept terms on behalf of the signer.
    /// @dev This function returns whether the address is allowed to accept terms on behalf of the signer.
    mapping(address => bool) private _metaSigners;

    /// @notice This modifier requires that the msg.sender is either the owner of the contract or an approved metasigner
    modifier onlyMetaSigner() {
        require(
            _metaSigners[_msgSender()] || owner() == _msgSender(),
            "Not a metasigner or Owner"
        );
        _;
    }

    /// @notice Adds a meta signer to the list of signers that can accept terms on behalf of the signer.
    /// @dev This function adds a meta signer to the list of signers that can accept terms on behalf of the signer.
    /// @dev This function is only available to the owner of the contract.
    /// @param _signer The address of the signer that can accept terms on behalf of the signer.
    function addMetaSigner(address _signer) external onlyMetaSigner {
        _addMetaSigner(_signer);
    }

    /// @notice Adds a meta signer to the list of signers that can accept terms on behalf of the signer.
    /// @dev This internal function adds a meta signer to the list of signers that can accept terms on behalf of the signer.
    /// @param _signer The address of the signer that can accept terms on behalf of the signer.
    function _addMetaSigner(address _signer) internal {
        _metaSigners[_signer] = true;
    }

    /// @notice Removes a meta signer from the list of signers that can accept terms on behalf of the signer.
    /// @dev This function removes a meta signer from the list of signers that can accept terms on behalf of the signer.
    /// @dev This function is only available to the owner of the contract.
    /// @param _signer The address of the signer that can no longer accept terms on behalf of the signer.
    function removeMetaSigner(address _signer) external onlyMetaSigner {
        _removeMetaSigner(_signer);
    }

    /// @notice Removes a meta signer from the list of signers that can accept terms on behalf of the signer.
    /// @dev This internal function removes a meta signer from the list of signers that can accept terms on behalf of the signer.
    /// @param _signer The address of the signer that can no longer accept terms on behalf of the signer.
    function _removeMetaSigner(address _signer) internal {
        _metaSigners[_signer] = false;
    }

    /// @notice Returns whether the address is allowed to accept terms on behalf of the signer.
    /// @dev This function returns whether the address is allowed to accept terms on behalf of the signer.
    /// @param _signer The address of the signer that can accept terms on behalf of the signer.
    /// @return Whether the address is allowed to accept terms on behalf of the signer.
    function isMetaSigner(address _signer) public view returns (bool) {
        return _metaSigners[_signer];
    }

    /// @notice Function to set the Global Renderer.
    /// @dev This function lets the owner of the contract set the global renderer of the terms.
    /// @param _newRenderer The new renderer to use for the terms.
    function setGlobalRenderer(string memory _newRenderer)
        external
        onlyMetaSigner
    {
        _setGlobalRenderer(_newRenderer);
    }

    /// @notice Function to set the Global Renderer.
    /// @dev This internal function sets the global renderer of the terms.
    /// @dev It emits the GlobalRendererChanged event when renderer is updated.
    /// @param _newRenderer The new renderer to use for the terms.
    function _setGlobalRenderer(string memory _newRenderer) internal {
        _globalRenderer = _newRenderer;
        emit GlobalRendererChanged(_newRenderer);
        _lastTermChange = block.number;
    }

    /// @notice Function that returns the global renderer.
    /// @dev This function returns the global renderer of the terms.
    /// @return _globalRenderer The global renderer of the terms.
    function renderer() public view returns (string memory) {
        return _globalRenderer;
    }

    /// @notice Function to set the Global Document Template.
    /// @dev This function lets the owner of the contract set the global document template of the terms.
    /// @param _newDocTemplate The new document template to use for the terms.
    function setGlobalTemplate(string memory _newDocTemplate)
        external
        onlyMetaSigner
    {
        _setGlobalTemplate(_newDocTemplate);
    }

    /// @notice Function to set the Global Document Template.
    /// @dev This internal function sets the global document template of the terms.
    /// @dev It emits the GlobalTemplateChanged event when template is updated.
    /// @param _newDocTemplate The new document template to use for the terms.
    function _setGlobalTemplate(string memory _newDocTemplate) internal {
        _globalDocTemplate = _newDocTemplate;
        emit GlobalTemplateChanged(_newDocTemplate);
        _lastTermChange = block.number;
    }

    /// @notice Function that returns the global document template.
    /// @dev This function returns the global document template of the terms.
    /// @return _globalDocTemplate The global document template of the terms.
    function docTemplate() external view returns (string memory) {
        return _globalDocTemplate;
    }

    /// @notice Function to set the Global Term/// @notice Explain to an end user what this does
    /// @dev This function lets the owner of the contract set the global terms
    /// @param _term The term to set.
    /// @param _value The value of the term to set.
    function setGlobalTerm(string memory _term, string memory _value)
        external
        onlyMetaSigner
    {
        _setGlobalTerm(_term, _value);
    }

    /// @notice Function to set the Global Term
    /// @dev This internal function sets the global terms
    /// @dev It emits the GlobalTermChanged event when term is updated.
    /// @param _term The term to set.
    /// @param _value The value of the term to set.
    function _setGlobalTerm(string memory _term, string memory _value)
        internal
    {
        _globalTerms[_term] = _value;
        emit GlobalTermChanged(
            keccak256(bytes(_term)),
            keccak256(bytes(_value))
        );
        _lastTermChange = block.number;
    }

    /// @notice This function returns the global value of the term
    /// @dev This function returns the global value of the term
    /// @param _term The term to get.
    /// @return _globalTerms[_term] The global value of the term
    function globalTerm(string memory _term)
        public
        view
        returns (string memory)
    {
        return _globalTerms[_term];
    }

    /// @notice Function to get block of the latest term change.
    /// @dev This function returns the block number of the last term change.
    /// @return _lastTermChange The block number of the last term change.
    function currentTermsBlock() public view returns (uint256) {
        return _lastTermChange;
    }

    /// @notice Function to set the contract URI
    /// @dev This function lets the owner of the contract or a metasigner set the contract URI.
    /// @dev It emits UpdatedURI event when URI is updated.
    /// @param _newURI The URI to set.
    function setURI(string memory _newURI) external onlyMetaSigner {
        _uri = _newURI;
        _lastTermChange = block.number;
        emit UpdatedURI(_uri);
    }

    /// @notice Function to get the contract URI
    /// @dev This function returns the contract URI.
    /// @return _uri The contract URI.
    function URI() public view returns (string memory) {
        return _uri;
    }
}
