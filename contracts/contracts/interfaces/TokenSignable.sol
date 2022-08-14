// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface TokenSignable {
    /// @notice Event that is emitted when a terms are accepted.
    /// @dev This event is emitted when a terms are accepted by an address for a specific token and terms agreement
    /// @param sender The address that accepted the terms.
    /// @param terms The terms that were accepted.
    /// @param tokenId The token id for which the terms are accepted.
    event AcceptedTerms(address sender, uint256 tokenId, string terms);

    /// @notice This is an external function that returns whether the address has accepted terms for a specific token.
    /// @dev This function returns a boolean value indicating whether the address has accepted terms for a specific token.
    /// @param to The address to check.
    /// @param tokenId The token id to check.
    /// @return _acceptedTerms(to, tokenId) True if the address has accepted terms for a specific token, false otherwise.
    function acceptedTerms(address to, uint256 tokenId)
        external
        view
        returns (bool);

    /// @notice This is external function that the user can call to accept specific terms for a specific token.
    /// @dev This function accepts specific terms agreement mentioned on a URL for a specific token.
    /// @param tokenId The token id for which the terms are accepted.
    /// @param newtermsUrl The terms that are accepted.
    function acceptTerms(uint256 tokenId, string memory newtermsUrl) external;

    /// @notice This function is used to accept the terms at certain url on behalf of the user (metasigner) for a specific token.
    /// @dev This function is called by a metasigner to accept terms on behalf of the signer that wants to accepts terms for a specific token.
    /// @dev It uses ECDSA to recover the signer from the signature and the hash of the termsurl and checks if they match.
    /// @param _signer The address of the signer that wants to accept terms.
    /// @param _newtermsUrl The url of the terms.
    /// @param _signature The signature of the signer that wants to accept terms.
    /// @param _tokenId The token id for which the terms are accepted.
    function acceptTermsFor(
        address _signer,
        string memory _newtermsUrl,
        uint256 _tokenId,
        bytes memory _signature
    ) external;

    /// @notice This is an external function that returns the URL for the agreement for a specific token.
    /// @dev This function returns the URL for the agreement for a specific token with prefix "ipfs://".
    function termsUrl(uint256 tokenId) external view returns (string memory);

    /// @notice This is an external function that returns the URL of the agreement for a specific token.
    /// @dev This function returns the URL of the agreement for a specific token.
    /// @param tokenId The token id for which the terms URL is returned.
    /// @param prefix The prefix to be added to the URL.
    /// @return _termsUrlWithPrefix(tokenId, prefix) The URL of the terms agreement for a specific token with a given prefix.
    function termsUrlWithPrefix(uint256 tokenId, string memory prefix)
        external
        view
        returns (string memory);
}
