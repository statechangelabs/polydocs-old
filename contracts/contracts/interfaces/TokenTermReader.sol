// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface TokenTermReader {
    /// @notice Event emitted when a new token term is added.
    /// @dev Event emitted when a new token term is added.
    /// @param _term The term being added to the contract.
    /// @param _tokenId The token id of the token for which the term is being added.
    /// @param _value The value of the term being added to the contract.
    event TokenTermChanged(
        bytes32 indexed _term,
        uint256 indexed _tokenId,
        bytes32 _value
    );

    /// @notice This event is emitted when the global renderer is updated.
    /// @dev This event is emitted when the global renderer is updated.
    /// @param _renderer The new renderer.
    /// @param _tokenId The token id of the token for which the renderer is being updated.
    event TokenRendererChanged(
        uint256 indexed _tokenId,
        string indexed _renderer
    );

    /// @notice This event is emitted when the global template is updated.
    /// @dev This event is emitted when the global template is updated.
    /// @param _template The new template.
    /// @param _tokenId The token id of the token for which the template is being updated.
    event TokenTemplateChanged(
        uint256 indexed _tokenId,
        string indexed _template
    );

    /// @notice This function is used to return the value of the term for a specific token.
    /// @dev This function returns the value of a term given its term for a specific token.
    /// @param _term The term to get
    /// @param _tokenId The token id of the token for which the term's value is being returned.
    /// @return _value The value of the term.
    function tokenTerm(string memory _term, uint256 _tokenId)
        external
        view
        returns (string memory _value);
}
