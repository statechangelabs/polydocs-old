# Solidity API

## TermReader

### GlobalTermAdded

```solidity
event GlobalTermAdded(bytes32 term, bytes32 value)
```

### term

```solidity
function term(string _key) external view returns (string)
```

## TokenTermReader

### TokenTermAdded

```solidity
event TokenTermAdded(bytes32 term, uint256 tokenId, bytes32 value)
```

### tokenTerm

```solidity
function tokenTerm(string _key, uint256 _tokenId) external view returns (string)
```

## TermsableBase

### _renderer

```solidity
string _renderer
```

### _docTemplate

```solidity
string _docTemplate
```

### _tokenDocTemplates

```solidity
mapping(uint256 => string) _tokenDocTemplates
```

### _globalTerms

```solidity
mapping(string => string) _globalTerms
```

### _lastTermChange

```solidity
uint256 _lastTermChange
```

### setRenderer

```solidity
function setRenderer(string _newRenderer) external
```

### renderer

```solidity
function renderer() public view returns (string)
```

### setTemplate

```solidity
function setTemplate(string _newDocTemplate) external
```

### docTemplate

```solidity
function docTemplate() external view returns (string)
```

### setGlobalTerm

```solidity
function setGlobalTerm(string _key, string _value) external
```

### term

```solidity
function term(string _key) public view returns (string)
```

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

## TokenTermsable

### AcceptedTerms

```solidity
event AcceptedTerms(address sender, uint256 tokenId, string terms)
```

### hasAcceptedTerms

```solidity
mapping(address => mapping(uint256 => bool)) hasAcceptedTerms
```

### _tokenTerms

```solidity
mapping(string => mapping(uint256 => string)) _tokenTerms
```

### _acceptedTerms

```solidity
function _acceptedTerms(address to, uint256 tokenId) internal view returns (bool)
```

### acceptTerms

```solidity
function acceptTerms(uint256 tokenId, string _newtermsUrl) external
```

### acceptedTerms

```solidity
function acceptedTerms(address to, uint256 tokenId) external view returns (bool)
```

### termsUrl

```solidity
function termsUrl(uint256 tokenId) public view returns (string)
```

### _termsUrlWithPrefix

```solidity
function _termsUrlWithPrefix(uint256 tokenId, string prefix) internal view returns (string)
```

### termsUrlWithPrefix

```solidity
function termsUrlWithPrefix(uint256 _tokenId, string prefix) public view returns (string)
```

### setTokenTemplate

```solidity
function setTokenTemplate(uint256 tokenID, string _newTermsUrl) external
```

### tokenDocTemplate

```solidity
function tokenDocTemplate(string _key, uint256 _tokenId) public view returns (string)
```

### setTokenTerm

```solidity
function setTokenTerm(string _key, uint256 _tokenId, string _value) external
```

### tokenTerm

```solidity
function tokenTerm(string _term, uint256 _tokenId) public view virtual returns (string)
```

## Test1155_NoToken

### _tokenIds

```solidity
struct Counters.Counter _tokenIds
```

### MintNFT

```solidity
event MintNFT(address sender, uint256 tokenId)
```

### name_

```solidity
string name_
```

### symbol_

```solidity
string symbol_
```

### amount

```solidity
uint256 amount
```

### constructor

```solidity
constructor(string _name, string _symbol, string _uri) public
```

### name

```solidity
function name() public view returns (string)
```

### symbol

```solidity
function symbol() public view returns (string)
```

### _beforeTokenTransfer

```solidity
function _beforeTokenTransfer(address operator, address from, address to, uint256[] ids, uint256[] amounts, bytes data) internal virtual
```

### _mint

```solidity
function _mint(address _to, uint256 _tokenId, uint256 _amount, bytes _data) internal
```

### mint

```solidity
function mint() public
```

## Test1155_Token

### _tokenIds

```solidity
struct Counters.Counter _tokenIds
```

### MintNFT

```solidity
event MintNFT(address sender, uint256 tokenId)
```

### name_

```solidity
string name_
```

### symbol_

```solidity
string symbol_
```

### amount

```solidity
uint256 amount
```

### constructor

```solidity
constructor(string _name, string _symbol, string _uri) public
```

### name

```solidity
function name() public view returns (string)
```

### symbol

```solidity
function symbol() public view returns (string)
```

### _beforeTokenTransfer

```solidity
function _beforeTokenTransfer(address operator, address from, address to, uint256[] ids, uint256[] amounts, bytes data) internal virtual
```

### _mint

```solidity
function _mint(address _to, uint256 _tokenId, uint256 _amount, bytes _data) internal
```

### mint

```solidity
function mint() public
```

## Test20

### name_

```solidity
string name_
```

### symbol_

```solidity
string symbol_
```

### amount

```solidity
uint256 amount
```

### constructor

```solidity
constructor(string _name, string _symbol) public
```

### name

```solidity
function name() public view returns (string)
```

_Returns the name of the token._

### symbol

```solidity
function symbol() public view returns (string)
```

_Returns the symbol of the token, usually a shorter version of the
name._

### _beforeTokenTransfer

```solidity
function _beforeTokenTransfer(address from, address to, uint256 _amount) internal virtual
```

### mint

```solidity
function mint(address account, uint256 _amount) external
```

## Test721_NoToken

### _tokenIds

```solidity
struct Counters.Counter _tokenIds
```

### MintNFT

```solidity
event MintNFT(address sender, uint256 tokenId)
```

### constructor

```solidity
constructor() public
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

### _safeMint

```solidity
function _safeMint(address _to, uint256 _tokenId) internal
```

### mint

```solidity
function mint() public
```

## Test721_Token

### _tokenIds

```solidity
struct Counters.Counter _tokenIds
```

### MintNFT

```solidity
event MintNFT(address sender, uint256 tokenId)
```

### constructor

```solidity
constructor() public
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

### _safeMint

```solidity
function _safeMint(address _to, uint256 _tokenId) internal
```

### mint

```solidity
function mint() public
```

