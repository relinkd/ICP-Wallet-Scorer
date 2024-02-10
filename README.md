# {r}elinkd

## About {r}elinkd 
Digital identity + scores protocol and dapp. We're building a decentralized identity protocol, aggregating on-chain and off-chain credentials into the scores for creating trustworthy self-sovereign identity and personal brand profiles.
<br>

## Web3 advantages
The codebase here implements the main components of the ecosystem:
 <br>
<li>user score computation canister</li>
<li>user score NFT mint canister</li>
<li>decentralized front-end with the whole flow of score interaction</li>
<li>ICP <> EVM multiwallet and sponsored transactions for the ICP computation</li>
<br>

## How is it built

**Current {r}elinkd architecture =>** ICP score calculating and decentralized frontend, Gitcoin Passport, Polygon ID, Lens, Alchemy
**ICP integration tech stack =>** React, Azle, Rust, TypeScript

![scheme](https://github.com/relinkd/ICP-Wallet-Scorer/blob/main/relinkd_scheme.png)

## Resources

https://relinkd.xyz/

https://twitter.com/relinkdxyz

https://github.com/relinkd/ICP-Wallet-Scorer

https://discord.com/invite/Z5TTh7uNTj
  
## Setting up the project

```
npm install
echo -n "key" | base64 -w 0
source env.sh

dfx start --background
dfx deploy
```
