// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface Signable {
    /// @notice Event that is emitted when a terms are accepted.
    /// @dev This event is emitted when a terms are accepted.
    /// @param sender The address that accepted the terms.
    /// @param terms The terms that were accepted.
    event AcceptedTerms(address sender, string terms);

    /// @notice This function returns the terms url with a given prefix.
    /// @dev This function returns the terms url with a given prefix.
    /// @param prefix The prefix to add to the terms url.
    /// @return The terms url with the prefix.
    function termsUrlWithPrefix(string memory prefix)
        external
        view
        returns (string memory);

    /// @notice This function is used to accept the terms at certain url
    /// @dev This function is called by a user that wants to accepts terms.
    /// @param _newtermsUrl The url of the terms.
    function acceptTerms(string memory _newtermsUrl) external;

    /// @notice This function is used to accept the terms at certain url on behalf of the user (metasigner)
    /// @dev This function is called by a metasigner to accept terms on behalf of the signer that wants to accepts terms.
    /// @param _signer The address of the signer that wants to accept terms.
    /// @param _newtermsUrl The url of the terms.
    /// @param _signature The signature of the signer that wants to accept terms.
    function acceptTermsFor(
        address _signer,
        string memory _newtermsUrl,
        bytes memory _signature
    ) external;

    /// @notice This function returns whether or not a user has accepted the terms.
    /// @dev This function returns whether or not a user has accepted the terms.
    /// @param _address The address of the user.
    /// @return True if the user has accepted the terms, false otherwise.
    function acceptedTerms(address _address) external view returns (bool);
}
