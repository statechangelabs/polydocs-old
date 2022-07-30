# Solidity API

## TermsableBase

### _globalRenderer

```solidity
string _globalRenderer
```

The default value of the global renderer.

_The default value of the global renderer._

### _globalDocTemplate

```solidity
string _globalDocTemplate
```

The default value of the global template.

_The default value of the global template._

### _globalTerms

```solidity
mapping(string => string) _globalTerms
```

Mapping that store the global terms.

_This mapping stores the global terms._

### _lastTermChange

```solidity
uint256 _lastTermChange
```

This is the latest block height at which the terms were updated.

_This is the latest block height at which the terms were updated. 0 by default._

### setGlobalRenderer

```solidity
function setGlobalRenderer(string _newRenderer) external
```

Function to set the Global Renderer.

_This function lets the owner of the contract set the global renderer of the terms._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _newRenderer | string | The new renderer to use for the terms. |

### renderer

```solidity
function renderer() public view returns (string)
```

Function that returns the global renderer.

_This function returns the global renderer of the terms._

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | _globalRenderer The global renderer of the terms. |

### setGlobalTemplate

```solidity
function setGlobalTemplate(string _newDocTemplate) external
```

Function to set the Global Document Template.

_This function lets the owner of the contract set the global document template of the terms._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _newDocTemplate | string | The new document template to use for the terms. |

### docTemplate

```solidity
function docTemplate() external view returns (string)
```

Function that returns the global document template.

_This function returns the global document template of the terms._

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | _globalDocTemplate The global document template of the terms. |

### setGlobalTerm

```solidity
function setGlobalTerm(string _term, string _value) external
```

Function to set the Global Term/// @notice Explain to an end user what this does

_This function lets the owner of the contract set the global terms_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _term | string | The term to set. |
| _value | string | The value of the term to set. |

### globalTerm

```solidity
function globalTerm(string _term) public view returns (string)
```

This function returns the global value of the term

_This function returns the global value of the term_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _term | string | The term to get. |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | _globalTerms[_term] The global value of the term |

### currentTermsBlock

```solidity
function currentTermsBlock() public view returns (uint256)
```

Function to get block of the latest term change.

_This function returns the block number of the last term change._

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | _lastTermChange The block number of the last term change. |

## TermsableNoToken

### AcceptedTerms

```solidity
event AcceptedTerms(address sender, string terms)
```

Event that is emitted when a terms are accepted.

_This event is emitted when a terms are accepted._

| Name | Type | Description |
| ---- | ---- | ----------- |
| sender | address | The address that accepted the terms. |
| terms | string | The terms that were accepted. |

### _hasAcceptedTerms

```solidity
mapping(address => bool) _hasAcceptedTerms
```

Mapping that stores whether the address has accepted terms.

_This mapping returns a boolean value indicating whether the address has accepted terms._

### _acceptedTerms

```solidity
function _acceptedTerms(address _to) internal view returns (bool)
```

This is an internal function that returns whether the address has accepted terms.

_This function returns a boolean value indicating whether the address has accepted terms._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _to | address | The address to check. |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | True if the address has accepted terms, false otherwise. |

### acceptedTerms

```solidity
function acceptedTerms(address _address) external view returns (bool)
```

This is an external function that returns whether the address has accepted terms.

_This function returns a boolean value indicating whether the address has accepted terms._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _address | address | The address to check. |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | True if the address has accepted terms, false otherwise. |

### acceptTerms

```solidity
function acceptTerms(string _newtermsUrl) external
```

This is an external function called by a user that wants to accepts the agreement at certain url

_This function is called by a user that wants to accepts terms. It checks if the terms url for the agreement is the latest one.
It then updates the mapping _hasAcceptedTerms and emits the AcceptedTerms event._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _newtermsUrl | string | The url of the terms. |

### termsUrl

```solidity
function termsUrl() public view returns (string)
```

This function returns the url of the terms.

_This function returns the url of the terms with the prefix "ipfs://"._

### termsUrlWithPrefix

```solidity
function termsUrlWithPrefix(string prefix) public view returns (string)
```

This function returns the url of the terms with a given prefix

_This function returns the url of the terms with the prefix_

| Name | Type | Description |
| ---- | ---- | ----------- |
| prefix | string | The prefix of the url. return _termsUrlWithPrefix(prefix) The url of the terms with the prefix. |

### _termsUrlWithPrefix

```solidity
function _termsUrlWithPrefix(string prefix) public view returns (string _termsURL)
```

This is an internal function that returns the url of the agreement with a given prefix.

_This function returns the url of the agreement with the prefix.
It uses the global renderer, template, chain id, contract address of the deployed contract and the latest block height to concatenate the url._

| Name | Type | Description |
| ---- | ---- | ----------- |
| prefix | string | The prefix of the url. |

| Name | Type | Description |
| ---- | ---- | ----------- |
| _termsURL | string | The url of the agreement with the prefix. |

## TokenTermsable

### AcceptedTerms

```solidity
event AcceptedTerms(address sender, uint256 tokenId, string terms)
```

Event that is emitted when a terms are accepted.

_This event is emitted when a terms are accepted by an address for a specific token and terms agreement_

| Name | Type | Description |
| ---- | ---- | ----------- |
| sender | address | The address that accepted the terms. |
| tokenId | uint256 | The token id for which the terms are accepted. |
| terms | string | The terms that were accepted. |

### hasAcceptedTerms

```solidity
mapping(address => mapping(uint256 => bool)) hasAcceptedTerms
```

Mapping that stores whether the address has accepted terms for a specific token.

_This mapping returns a boolean value indicating whether the address has accepted terms for a specific token._

### _tokenTerms

```solidity
mapping(string => mapping(uint256 => string)) _tokenTerms
```

This is mapping that store the URL for the agreeemnt for a specific token.

_This mapping returns the URL for the agreement for a specific token._

### _tokenDocTemplates

```solidity
mapping(uint256 => string) _tokenDocTemplates
```

This is mapping that store the CID of the template for a specific token.

_This mapping returns the CID of the template for a specific token._

### _tokenRenderers

```solidity
mapping(uint256 => string) _tokenRenderers
```

This is mapping that store the CID of the Renderer for a specific token.

_This mapping returns the CID of the Renderer for a specific token._

### _acceptedTerms

```solidity
function _acceptedTerms(address to, uint256 tokenId) internal view returns (bool)
```

This is an internal function that returns whether the address has accepted terms for a specific token.

_This function returns a boolean value indicating whether the address has accepted terms for a specific token._

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | The address to check. |
| tokenId | uint256 | The token id to check. |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | hasAcceptedTerms[to][tokenId] True if the address has accepted terms for a specific token, false otherwise. |

### acceptedTerms

```solidity
function acceptedTerms(address to, uint256 tokenId) external view returns (bool)
```

This is an external function that returns whether the address has accepted terms for a specific token.

_This function returns a boolean value indicating whether the address has accepted terms for a specific token._

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | The address to check. |
| tokenId | uint256 | The token id to check. |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | _acceptedTerms(to, tokenId) True if the address has accepted terms for a specific token, false otherwise. |

### acceptTerms

```solidity
function acceptTerms(uint256 tokenId, string newtermsUrl) external
```

This is external function that the user can call to accept specific terms for a specific token.

_This function accepts specific terms agreement mentioned on a URL for a specific token._

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The token id for which the terms are accepted. |
| newtermsUrl | string | The terms that are accepted. |

### _acceptTerms

```solidity
function _acceptTerms(uint256 _tokenId, string _newtermsUrl) internal virtual
```

This is an internal function that the user can call to accept specific terms for a specific token.

_This function accepts specific terms agreement on a URL for a specific token.
It first checks if the terms the user is accepting are the latest terms for the token.
If they are not, it throws an error. If they are, it accepts the terms (updates mapping) and emits the AcceptedTerms event._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _tokenId | uint256 | The token id for which the terms are accepted. |
| _newtermsUrl | string | The terms that are accepted. |

### termsUrl

```solidity
function termsUrl(uint256 tokenId) public view returns (string)
```

This is an public function that returns the URL for the agreement for a specific token.

_This function returns the URL for the agreement for a specific token with prefix "ipfs://"._

### _termsUrlWithPrefix

```solidity
function _termsUrlWithPrefix(uint256 tokenId, string prefix) internal view returns (string _termsURL)
```

This is an internal function that returns the URL for the terms agreement for a specific token.

_This function returns the URL for the terms agreement for a specific token. It takes a prefix as an argument.
It concatenates the prefix with tokenRenderer, tokenTemplate, chain Id, address of the contract, latest block height when the terms changed for that token and token Id._

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The token id for which the terms URL is returned. |
| prefix | string | The prefix to be added to the URL. |

| Name | Type | Description |
| ---- | ---- | ----------- |
| _termsURL | string | The URL of the terms agreement for a specific token. |

### termsUrlWithPrefix

```solidity
function termsUrlWithPrefix(uint256 tokenId, string prefix) public view returns (string)
```

This is a public function that returns the URL of the agreement for a specific token.

_This function returns the URL of the agreement for a specific token._

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The token id for which the terms URL is returned. |
| prefix | string | The prefix to be added to the URL. |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | _termsUrlWithPrefix(tokenId, prefix) The URL of the terms agreement for a specific token with a given prefix. |

### setTokenTemplate

```solidity
function setTokenTemplate(uint256 tokenId, string newTokenTemplate) external
```

This function can be called by the owner to set the CID of the template for a specific token.

_This function sets the CID of the template for a specific token._

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The token id for which the template is set. |
| newTokenTemplate | string | The CID of the template for a specific token. |

### tokenTemplate

```solidity
function tokenTemplate(uint256 tokenId) external view returns (string)
```

This function returns the CID of the template for a specific token.

_This function returns the CID of the template for a specific token._

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The token id for which the template is returned. |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | _tokenTempate(tokenId) The CID of the template for a specific token. |

### setTokenRenderer

```solidity
function setTokenRenderer(uint256 tokenId, string newRenderer) external
```

This is a function that can be called by the owner to set the CID of the renderer for a specific token.

_This function sets the CID of the renderer for a specific token._

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The token id for which the renderer is set. |
| newRenderer | string | The CID of the renderer for a specific token. |

### tokenRenderer

```solidity
function tokenRenderer(uint256 tokenId) external view returns (string)
```

This function returns the CID of the renderer for a specific token.

_This function returns the CID of the renderer for a specific token._

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The token id for which the renderer is returned. |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | _tokenRenderer(tokenId) The CID of the renderer for a specific token. |

### _tokenRenderer

```solidity
function _tokenRenderer(uint256 _tokenId) internal view returns (string)
```

This is an internal function that returns the CID of the renderer for a specific token.

_This function returns the CID of the renderer for a specific token or the global renderer if the token renderer is not set._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _tokenId | uint256 | The token id for which the renderer is returned. |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | _tokenRenderers[_tokenId] The CID of the renderer for a specific token or _globalRenderer if the token renderer is not set. |

### _tokenTemplate

```solidity
function _tokenTemplate(uint256 _tokenId) internal view returns (string)
```

This is an internal function that returns the CID of the template for a specific token.

_This function returns the CID of the renderer for a specific token or the global template if the token template is not set._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _tokenId | uint256 | The token id for which the template is returned. |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | _tokenDocTemplates[_tokenId] The CID of the template for a specific token or _globalDocTemplate if the token template is not set. |

### setTokenTerm

```solidity
function setTokenTerm(string _term, uint256 _tokenId, string _value) external
```

This function is used to set a value for a specific term for a specific token.

_This function is used to set a value for a specific term for a specific token.
It emits the the TokenTermAdded event and records the last time the terms were changed._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _term | string | The term for which the value is set. |
| _tokenId | uint256 | The token id for which the term is set. |
| _value | string | The value for the term. |

### tokenTerm

```solidity
function tokenTerm(string _term, uint256 _tokenId) public view virtual returns (string)
```

This function is used to get the value for a specific term for a specific token.

_This function is used to get the value for a specific term for a specific token. If the term is not set for the specific token,
it returns  the _global term value for the specific term._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _term | string | The term for which the value is returned. |
| _tokenId | uint256 | The token id for which the term is returned. |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | _tokenTerms[_term][_tokenId] The value for the term or the global term value if the term is not set. |

## TermReader

### GlobalTermAdded

```solidity
event GlobalTermAdded(bytes32 _term, bytes32 _value)
```

This event is fired when a token term is added.

_Event when a new Global term is added to the contract_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _term | bytes32 | The term being added to the contract |
| _value | bytes32 | value of the term added to the contract |

### globalTerm

```solidity
function globalTerm(string _term) external view returns (string _value)
```

This function is used to return the value of the term

_Function to return the value of the term_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _term | string | The term to get |

| Name | Type | Description |
| ---- | ---- | ----------- |
| _value | string | The value of the term |

## TokenTermReader

### TokenTermAdded

```solidity
event TokenTermAdded(bytes32 _term, uint256 _tokenId, bytes32 _value)
```

Event emitted when a new token term is added.

_Event emitted when a new token term is added._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _term | bytes32 | The term being added to the contract. |
| _tokenId | uint256 | The token id of the token for which the term is being added. |
| _value | bytes32 | The value of the term being added to the contract. |

### tokenTerm

```solidity
function tokenTerm(string _term, uint256 _tokenId) external view returns (string _value)
```

This function is used to return the value of the term for a specific token.

_This function returns the value of a term given its term for a specific token._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _term | string | The term to get |
| _tokenId | uint256 | The token id of the token for which the term's value is being returned. |

| Name | Type | Description |
| ---- | ---- | ----------- |
| _value | string | The value of the term. |

## TermsableBase

### _globalRenderer

```solidity
string _globalRenderer
```

### _globalDocTemplate

```solidity
string _globalDocTemplate
```

### _globalTerms

```solidity
mapping(string => string) _globalTerms
```

### _lastTermChange

```solidity
uint256 _lastTermChange
```

### setGlobalRenderer

```solidity
function setGlobalRenderer(string _newRenderer) external
```

Function to set the Global Renderer.

_This function lets the owner of the contract set the global renderer of the terms._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _newRenderer | string | The new renderer to use for the terms. |

### renderer

```solidity
function renderer() public view returns (string)
```

Function that returns the global renderer.

_This function returns the global renderer of the terms._

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | _globalRenderer The global renderer of the terms. |

### setGlobalTemplate

```solidity
function setGlobalTemplate(string _newDocTemplate) external
```

Function to set the Global Document Template.

_This function lets the owner of the contract set the global document template of the terms._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _newDocTemplate | string | The new document template to use for the terms. |

### docTemplate

```solidity
function docTemplate() external view returns (string)
```

Function that returns the global document template.

### setGlobalTerm

```solidity
function setGlobalTerm(string _key, string _value) external
```

### globalTerm

```solidity
function globalTerm(string _key) public view returns (string)
```

This function is used to return the value of the term

_Function to return the value of the term_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _key | string | - The key of the term being returned |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string |  |

### currentTermsBlock

```solidity
function currentTermsBlock() public view returns (uint256)
```

## TermsableNoToken

### AcceptedTerms

```solidity
event AcceptedTerms(address sender, string terms)
```

### _hasAcceptedTerms

```solidity
mapping(address => bool) _hasAcceptedTerms
```

### _acceptedTerms

```solidity
function _acceptedTerms(address _to) internal view returns (bool)
```

### acceptedTerms

```solidity
function acceptedTerms(address _address) external view returns (bool)
```

### acceptTerms

```solidity
function acceptTerms(string _newtermsUrl) public
```

### termsUrl

```solidity
function termsUrl() public view returns (string)
```

### termsUrlWithPrefix

```solidity
function termsUrlWithPrefix(string prefix) public view returns (string)
```

### _termsUrlWithPrefix

```solidity
function _termsUrlWithPrefix(string prefix) public view returns (string)
```

## TermReader

### GlobalTermAdded

```solidity
event GlobalTermAdded(bytes32 _term, bytes32 _value)
```

This event is fired when a token term is added.

_Event when a new Global term is added to the contract_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _term | bytes32 | - The term being added to the contract |
| _value | bytes32 | - value of the term added to the contract |

### globalTerm

```solidity
function globalTerm(string _key) external view returns (string _value)
```

This function is used to return the value of the term

_Function to return the value of the term_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _key | string | - The key of the term being returned |

| Name | Type | Description |
| ---- | ---- | ----------- |
| _value | string | The value of the term |

## TermsableBase

### _globalRenderer

```solidity
string _globalRenderer
```

### _globalDocTemplate

```solidity
string _globalDocTemplate
```

### _globalTerms

```solidity
mapping(string => string) _globalTerms
```

### _lastTermChange

```solidity
uint256 _lastTermChange
```

### setGlobalRenderer

```solidity
function setGlobalRenderer(string _newRenderer) external
```

Function to set the Global Renderer.

_This function lets the owner of the contract set the global renderer of the terms._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _newRenderer | string | The new renderer to use for the terms. |

### renderer

```solidity
function renderer() public view returns (string)
```

Function that returns the global renderer.

_This function returns the global renderer of the terms._

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | _globalRenderer The global renderer of the terms. |

### setGlobalTemplate

```solidity
function setGlobalTemplate(string _newDocTemplate) external
```

Function to set the Global Document Template.

_This function lets the owner of the contract set the global document template of the terms._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _newDocTemplate | string | The new document template to use for the terms. |

### docTemplate

```solidity
function docTemplate() external view returns (string)
```

Function that returns the global document template.

_This function returns the global document template of the terms._

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | _globalDocTemplate The global document template of the terms. |

### setGlobalTerm

```solidity
function setGlobalTerm(string _term, string _value) external
```

Function to set the Global Term/// @notice Explain to an end user what this does

_This function lets the owner of the contract set the global terms_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _term | string | The term to set. |
| _value | string | The value of the term to set. |

### globalTerm

```solidity
function globalTerm(string _term) public view returns (string)
```

This function returns the global value of the term

_This function returns the global value of the term_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _term | string | The term to get. |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | _globalTerms[_term] The global value of the term |

### currentTermsBlock

```solidity
function currentTermsBlock() public view returns (uint256)
```

Function to get block of the latest term change.

_This function returns the block number of the last term change._

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | _lastTermChange The block number of the last term change. |

## TermsableBase

### _globalRenderer

```solidity
string _globalRenderer
```

### _globalDocTemplate

```solidity
string _globalDocTemplate
```

### _globalTerms

```solidity
mapping(string => string) _globalTerms
```

### _lastTermChange

```solidity
uint256 _lastTermChange
```

### setGlobalRenderer

```solidity
function setGlobalRenderer(string _newRenderer) external
```

Function to set the Global Renderer.

_This function lets the owner of the contract set the global renderer of the terms._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _newRenderer | string | The new renderer to use for the terms. |

### renderer

```solidity
function renderer() public view returns (string)
```

Function that returns the global renderer.

_This function returns the global renderer of the terms._

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | _globalRenderer The global renderer of the terms. |

### setGlobalTemplate

```solidity
function setGlobalTemplate(string _newDocTemplate) external
```

Function to set the Global Document Template.

_This function lets the owner of the contract set the global document template of the terms._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _newDocTemplate | string | The new document template to use for the terms. |

### docTemplate

```solidity
function docTemplate() external view returns (string)
```

Function that returns the global document template.

### setGlobalTerm

```solidity
function setGlobalTerm(string _key, string _value) external
```

### globalTerm

```solidity
function globalTerm(string _key) public view returns (string)
```

This function is used to return the value of the term

_Function to return the value of the term_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _key | string | - The key of the term being returned |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string |  |

### currentTermsBlock

```solidity
function currentTermsBlock() public view returns (uint256)
```

## TermReader

### GlobalTermAdded

```solidity
event GlobalTermAdded(bytes32 _term, bytes32 _value)
```

This event is fired when a token term is added.

_Event when a new Global term is added to the contract_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _term | bytes32 | - The term being added to the contract |
| _value | bytes32 | - value of the term added to the contract |

### globalTerm

```solidity
function globalTerm(string _key) external view returns (string _value)
```

This function is used to return the value of the term

_Function to return the value of the term_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _key | string | - The key of the term being returned |

| Name | Type | Description |
| ---- | ---- | ----------- |
| _value | string | The value of the term |

## TokenTermReader

### TokenTermAdded

```solidity
event TokenTermAdded(bytes32 _term, uint256 _tokenId, bytes32 _value)
```

Event emitted when a new token term is added.

_Event emitted when a new token term is added._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _term | bytes32 | The term being added to the contract. |
| _tokenId | uint256 | The token id of the token for which the term is being added. |
| _value | bytes32 | The value of the term being added to the contract. |

### tokenTerm

```solidity
function tokenTerm(string _key, uint256 _tokenId) external view returns (string _value)
```

This function is used to return the value of the term for a specific token.

_This function returns the value of a term given its key for a specific token._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _key | string | The key of the term |
| _tokenId | uint256 | The token id of the token for which the term's value is being returned. |

| Name | Type | Description |
| ---- | ---- | ----------- |
| _value | string | The value of the term. |

