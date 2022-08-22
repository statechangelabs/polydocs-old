# Solidity API

## MetadataURI

### UpdatedURI

```solidity
event UpdatedURI(string uri)
```

Event that is emitted when contract URI is updated.

_This event is emitted when contract URI is updated._

| Name | Type | Description |
| ---- | ---- | ----------- |
| uri | string | The new contract URI. |

### URI

```solidity
function URI() external view returns (string _uri)
```

This function is used to return the contract URI

_Function to return the contract URI_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _uri | string | The contract URI |

## Signable

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

### termsUrlWithPrefix

```solidity
function termsUrlWithPrefix(string prefix) external view returns (string)
```

This function returns the terms url with a given prefix.

_This function returns the terms url with a given prefix._

| Name | Type | Description |
| ---- | ---- | ----------- |
| prefix | string | The prefix to add to the terms url. |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | The terms url with the prefix. |

### termsUrl

```solidity
function termsUrl() external view returns (string)
```

This function returns the terms url.

_This function returns the terms url._

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | The terms url. |

### acceptTerms

```solidity
function acceptTerms(string _newtermsUrl) external
```

This function is used to accept the terms at certain url

_This function is called by a user that wants to accepts terms._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _newtermsUrl | string | The url of the terms. |

### acceptTermsFor

```solidity
function acceptTermsFor(address _signer, string _newtermsUrl, bytes _signature) external
```

This function is used to accept the terms at certain url on behalf of the user (metasigner)

_This function is called by a metasigner to accept terms on behalf of the signer that wants to accepts terms._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _signer | address | The address of the signer that wants to accept terms. |
| _newtermsUrl | string | The url of the terms. |
| _signature | bytes | The signature of the signer that wants to accept terms. |

### acceptedTerms

```solidity
function acceptedTerms(address _address) external view returns (bool)
```

This function returns whether or not a user has accepted the terms.

_This function returns whether or not a user has accepted the terms._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _address | address | The address of the user. |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | True if the user has accepted the terms, false otherwise. |

## TermReader

### GlobalTermChanged

```solidity
event GlobalTermChanged(bytes32 _term, bytes32 _value)
```

This event is fired when a token term is added.

_Event when a new Global term is added to the contract_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _term | bytes32 | The term being added to the contract |
| _value | bytes32 | value of the term added to the contract |

### GlobalRendererChanged

```solidity
event GlobalRendererChanged(string _renderer)
```

This event is emitted when the global renderer is updated.

_This event is emitted when the global renderer is updated._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _renderer | string | The new renderer. |

### GlobalTemplateChanged

```solidity
event GlobalTemplateChanged(string _template)
```

This event is emitted when the global template is updated.

_This event is emitted when the global template is updated._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _template | string | The new template. |

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

## TokenSignable

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

### acceptTermsFor

```solidity
function acceptTermsFor(address _signer, string _newtermsUrl, uint256 _tokenId, bytes _signature) external
```

This function is used to accept the terms at certain url on behalf of the user (metasigner) for a specific token.

_This function is called by a metasigner to accept terms on behalf of the signer that wants to accepts terms for a specific token.
It uses ECDSA to recover the signer from the signature and the hash of the termsurl and checks if they match._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _signer | address | The address of the signer that wants to accept terms. |
| _newtermsUrl | string | The url of the terms. |
| _tokenId | uint256 | The token id for which the terms are accepted. |
| _signature | bytes | The signature of the signer that wants to accept terms. |

### termsUrl

```solidity
function termsUrl(uint256 tokenId) external view returns (string)
```

This is an external function that returns the URL for the agreement for a specific token.

_This function returns the URL for the agreement for a specific token with prefix "ipfs://"._

### termsUrlWithPrefix

```solidity
function termsUrlWithPrefix(uint256 tokenId, string prefix) external view returns (string)
```

This is an external function that returns the URL of the agreement for a specific token.

_This function returns the URL of the agreement for a specific token._

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The token id for which the terms URL is returned. |
| prefix | string | The prefix to be added to the URL. |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | _termsUrlWithPrefix(tokenId, prefix) The URL of the terms agreement for a specific token with a given prefix. |

## TokenTermReader

### TokenTermChanged

```solidity
event TokenTermChanged(bytes32 _term, uint256 _tokenId, bytes32 _value)
```

Event emitted when a new token term is added.

_Event emitted when a new token term is added._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _term | bytes32 | The term being added to the contract. |
| _tokenId | uint256 | The token id of the token for which the term is being added. |
| _value | bytes32 | The value of the term being added to the contract. |

### TokenRendererChanged

```solidity
event TokenRendererChanged(uint256 _tokenId, string _renderer)
```

This event is emitted when the global renderer is updated.

_This event is emitted when the global renderer is updated._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _tokenId | uint256 | The token id of the token for which the renderer is being updated. |
| _renderer | string | The new renderer. |

### TokenTemplateChanged

```solidity
event TokenTemplateChanged(uint256 _tokenId, string _template)
```

This event is emitted when the global template is updated.

_This event is emitted when the global template is updated._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _tokenId | uint256 | The token id of the token for which the template is being updated. |
| _template | string | The new template. |

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

## TemplateRegistry

### Template

```solidity
struct Template {
  string name;
  string cid;
  int256 score;
  string MetadataURI;
  address owner;
}
```

### templates

```solidity
struct TemplateRegistry.Template[] templates
```

Array that stores all the templates

### indexes

```solidity
mapping(string => uint256) indexes
```

Mapping that stores the mapping of template cid to template index

### minfee

```solidity
uint256 minfee
```

Minimum fee to score a template

### TemplateAdded

```solidity
event TemplateAdded(address owner, uint256 index)
```

This event is emitted when a template is added to the registry

_This event is emitted when a template is added to the registry_

| Name | Type | Description |
| ---- | ---- | ----------- |
| owner | address | The owner of the template |
| index | uint256 | The index of the template in the registry |

### add

```solidity
function add(struct TemplateRegistry.Template _template) public
```

This function let's a user add a template to the registry

_This function let's a user add a template of type Template structure to the registry and emits the TemplateAdded event._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _template | struct TemplateRegistry.Template | The template of type struct Template to add to the registry |

### template

```solidity
function template(uint256 _index) public view returns (struct TemplateRegistry.Template)
```

This function returns the template at a certain index

_This function returns the template at a certain index_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _index | uint256 | The index of the template to return |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct TemplateRegistry.Template | The template of type Template at the given index |

### templatebyCID

```solidity
function templatebyCID(string _cid) public view returns (struct TemplateRegistry.Template)
```

This function returns the template given a cid

_This function returns the template given a cid_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _cid | string | The cid of the template to return |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct TemplateRegistry.Template | The template of type Template at the given cid |

### count

```solidity
function count() public view returns (uint256)
```

This function returns the number of templates in the registry

### indexOf

```solidity
function indexOf(string _cid) public view returns (uint256)
```

This function returns the index of a template given a cid

_This function returns the index of a template given a cid_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _cid | string | The cid of the template to return the index of |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | The index of the template in the registry |

### upvote

```solidity
function upvote(string _cid) public payable
```

This function let's a user upvote a template to increase its reputation score

_This is a payable function let's a user upvote a template given it's cid to increase its reputation score
This function also checks if the user has paid atleast the minimum fee to score a template_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _cid | string | The cid of the template to upvote |

### downvote

```solidity
function downvote(string _cid) public payable
```

This function let's a user downvote a template to increase its reputation score

_This is a payable function let's a user downvote a template given it's cid to decrease its reputation score
This function also checks if the user has paid atleast the minimum fee to score a template_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _cid | string | The cid of the template to downvote |

### score

```solidity
function score(string _cid) public view returns (int256)
```

This function returns the reputation score of a template given a cid

_This function returns the reputation score of a template given a cid_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _cid | string | The cid of the template to return the reputation score of |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | int256 | The reputation score of the template |

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

### _uri

```solidity
string _uri
```

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

### _metaSigners

```solidity
mapping(address => bool) _metaSigners
```

Returns whether the address is allowed to accept terms on behalf of the signer.

_This function returns whether the address is allowed to accept terms on behalf of the signer._

### onlyMetaSigner

```solidity
modifier onlyMetaSigner()
```

This modifier requires that the msg.sender is either the owner of the contract or an approved metasigner

### addMetaSigner

```solidity
function addMetaSigner(address _signer) external
```

Adds a meta signer to the list of signers that can accept terms on behalf of the signer.

_This function adds a meta signer to the list of signers that can accept terms on behalf of the signer.
This function is only available to the owner of the contract._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _signer | address | The address of the signer that can accept terms on behalf of the signer. |

### _addMetaSigner

```solidity
function _addMetaSigner(address _signer) internal
```

Adds a meta signer to the list of signers that can accept terms on behalf of the signer.

_This internal function adds a meta signer to the list of signers that can accept terms on behalf of the signer._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _signer | address | The address of the signer that can accept terms on behalf of the signer. |

### removeMetaSigner

```solidity
function removeMetaSigner(address _signer) external
```

Removes a meta signer from the list of signers that can accept terms on behalf of the signer.

_This function removes a meta signer from the list of signers that can accept terms on behalf of the signer.
This function is only available to the owner of the contract._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _signer | address | The address of the signer that can no longer accept terms on behalf of the signer. |

### _removeMetaSigner

```solidity
function _removeMetaSigner(address _signer) internal
```

Removes a meta signer from the list of signers that can accept terms on behalf of the signer.

_This internal function removes a meta signer from the list of signers that can accept terms on behalf of the signer._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _signer | address | The address of the signer that can no longer accept terms on behalf of the signer. |

### isMetaSigner

```solidity
function isMetaSigner(address _signer) public view returns (bool)
```

Returns whether the address is allowed to accept terms on behalf of the signer.

_This function returns whether the address is allowed to accept terms on behalf of the signer._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _signer | address | The address of the signer that can accept terms on behalf of the signer. |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | Whether the address is allowed to accept terms on behalf of the signer. |

### setGlobalRenderer

```solidity
function setGlobalRenderer(string _newRenderer) external
```

Function to set the Global Renderer.

_This function lets the owner of the contract set the global renderer of the terms._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _newRenderer | string | The new renderer to use for the terms. |

### _setGlobalRenderer

```solidity
function _setGlobalRenderer(string _newRenderer) internal
```

Function to set the Global Renderer.

_This internal function sets the global renderer of the terms.
It emits the GlobalRendererChanged event when renderer is updated._

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

### _setGlobalTemplate

```solidity
function _setGlobalTemplate(string _newDocTemplate) internal
```

Function to set the Global Document Template.

_This internal function sets the global document template of the terms.
It emits the GlobalTemplateChanged event when template is updated._

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

### _setGlobalTerm

```solidity
function _setGlobalTerm(string _term, string _value) internal
```

Function to set the Global Term

_This internal function sets the global terms
It emits the GlobalTermChanged event when term is updated._

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

### setURI

```solidity
function setURI(string _newURI) external
```

Function to set the contract URI

_This function lets the owner of the contract or a metasigner set the contract URI.
It emits UpdatedURI event when URI is updated._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _newURI | string | The URI to set. |

### URI

```solidity
function URI() public view returns (string)
```

Function to get the contract URI

_This function returns the contract URI._

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | _uri The contract URI. |

## TermsableNoToken

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

### acceptTermsFor

```solidity
function acceptTermsFor(address _signer, string _newtermsUrl, bytes _signature) external
```

This function is used to accept the terms at certain url on behalf of the user (metasigner)

_This function is called by a metasigner to accept terms on behalf of the signer that wants to accepts terms.
It uses ECDSA to recover the signer from the signature and the hash of the termsurl and checks if they match._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _signer | address | The address of the signer that wants to accept terms. |
| _newtermsUrl | string | The url of the terms. |
| _signature | bytes | The signature of the signer that wants to accept terms. |

### _acceptTerms

```solidity
function _acceptTerms(address _signer, string _newtermsUrl) internal
```

This is an internal function called by a user that wants to accepts the agreement at certain url

_This function is called by a the external function which is called by a user that wants to accepts terms.
It updates the mapping _hasAcceptedTerms and emits the AcceptedTerms event._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _signer | address | The address of the signer that wants to accept terms. |
| _newtermsUrl | string | The url of the terms. |

### termsUrl

```solidity
function termsUrl() external view returns (string)
```

This function returns the url of the terms.

_This function returns the url of the terms with the prefix "ipfs://"._

### _termsUrl

```solidity
function _termsUrl() internal view returns (string)
```

This internal function returns the url of the terms.

_This internal function returns the url of the terms with the prefix "ipfs://"._

### termsUrlWithPrefix

```solidity
function termsUrlWithPrefix(string prefix) external view returns (string)
```

This function returns the url of the terms with a given prefix

_This function returns the url of the terms with the prefix_

| Name | Type | Description |
| ---- | ---- | ----------- |
| prefix | string | The prefix of the url. return _termsUrlWithPrefix(prefix) The url of the terms with the prefix. |

### _termsUrlWithPrefix

```solidity
function _termsUrlWithPrefix(string prefix) internal view returns (string _termsURL)
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

### acceptTermsFor

```solidity
function acceptTermsFor(address _signer, string _newtermsUrl, uint256 _tokenId, bytes _signature) external
```

This function is used to accept the terms at certain url on behalf of the user (metasigner) for a specific token.

_This function is called by a metasigner to accept terms on behalf of the signer that wants to accepts terms for a specific token.
It uses ECDSA to recover the signer from the signature and the hash of the termsurl and checks if they match._

| Name | Type | Description |
| ---- | ---- | ----------- |
| _signer | address | The address of the signer that wants to accept terms. |
| _newtermsUrl | string | The url of the terms. |
| _tokenId | uint256 | The token id for which the terms are accepted. |
| _signature | bytes | The signature of the signer that wants to accept terms. |

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
function termsUrl(uint256 tokenId) external view returns (string)
```

This is an external function that returns the URL for the agreement for a specific token.

_This function returns the URL for the agreement for a specific token with prefix "ipfs://"._

### _termsUrl

```solidity
function _termsUrl(uint256 tokenId) internal view returns (string)
```

This is an internal function that returns the URL for the agreement for a specific token.

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

### _setTokenTemplate

```solidity
function _setTokenTemplate(uint256 tokenId, string newTokenTemplate) internal virtual
```

This is an internal function that sets the CID of the template for a specific token.

_This function sets the CID of the template for a specific token. It emits TokenTemplateChanged._

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

### _setTokenRenderer

```solidity
function _setTokenRenderer(uint256 tokenId, string newRenderer) internal virtual
```

This is an internal function that sets the CID of the renderer for a specific token.

_This function sets the CID of the renderer for a specific token. It emits TokenRendererChanged._

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

### _setTokenTerm

```solidity
function _setTokenTerm(string _term, uint256 _tokenId, string _value) internal virtual
```

This is an internal function that sets a value for a specific term for a specific token.

_This function is used to set a value for a specific term for a specific token. It emits the the TokenTermChanged event._

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

## ERC721Termsable

### _tokenIds

```solidity
struct Counters.Counter _tokenIds
```

### _uri

```solidity
string _uri
```

### MintNFT

```solidity
event MintNFT(address sender, uint256 tokenId)
```

### constructor

```solidity
constructor(address _newOwner, string _name, string _symbol) public
```

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) public view virtual returns (bool)
```

### _transfer

```solidity
function _transfer(address from, address to, uint256 tokenId) internal virtual
```

_Transfers `tokenId` from `from` to `to`.
 As opposed to {transferFrom}, this imposes no restrictions on msg.sender.

Requirements:

- `to` cannot be the zero address.
- `tokenId` token must be owned by `from`.

Emits a {Transfer} event._

### TermsInfo

```solidity
struct TermsInfo {
  string key;
  string value;
}
```

### setPolydocs

```solidity
function setPolydocs(string renderer, string template, struct ERC721Termsable.TermsInfo[] terms) public
```

### mint

```solidity
function mint(string _tokenURI) public returns (uint256)
```

## ERC721TokenTermsable

### _tokenIds

```solidity
struct Counters.Counter _tokenIds
```

### _uri

```solidity
string _uri
```

### MintNFT

```solidity
event MintNFT(address sender, uint256 tokenId)
```

### constructor

```solidity
constructor(address _newOwner, string _name, string _symbol) public
```

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) public view virtual returns (bool)
```

### _transfer

```solidity
function _transfer(address from, address to, uint256 tokenId) internal virtual
```

_Transfers `tokenId` from `from` to `to`.
 As opposed to {transferFrom}, this imposes no restrictions on msg.sender.

Requirements:

- `to` cannot be the zero address.
- `tokenId` token must be owned by `from`.

Emits a {Transfer} event._

### tokenTerm

```solidity
function tokenTerm(string _term, uint256 _tokenId) public view returns (string)
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

### TermsInfo

```solidity
struct TermsInfo {
  string key;
  string value;
}
```

### setPolydocs

```solidity
function setPolydocs(uint256 _tokenId, string renderer, string template, struct ERC721TokenTermsable.TermsInfo[] terms) public
```

### mint

```solidity
function mint(string _tokenURI) public returns (uint256)
```

