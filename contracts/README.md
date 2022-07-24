# Polydocs contracts and mixins

## Mixins
* TermReader.sol - Interface for termsreader contracts
* Termsable.sol - Mixin for logic to support signing agreements before executing transfer transactions

## Reference contracts
* Test20
* Test721_Notoken - NFT contract that allows someone to accept terms for the whole collection
* Test721_Token  -NFT Contract where terms are stored per-token, so one has to accept terms for each token they would buy
* Test20
* Test 1155_NoToken - mixed token contract with global terms agreement
* Test1155_Token - mixed token contract with per-token agreement (maybe useful for shares vs governance?)

## Future directinos
* TemplateRegistery - list and ability to vote on the credibility of templates to start to build *reputation* management