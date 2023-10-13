## {r}elinkd score on ICP
<br>

This repo contains the {r}elinkd score built on Internet Computer Protocol.
<br>
<br>
<i>relinkd dapp https://relinkd.xyz/ <br>
relinkd twitter https://twitter.com/relinkdxyz <br>
relinkd docs - https://r-elinkd.gitbook.io/ <br>
<br>
Internet Computer - https://internetcomputer.org/ <br>
Internet Computer Docs - https://wiki.internetcomputer.org/wiki/

<br>
</i>

## About {r}elinkd 
{r}elinkd is a reputation protocol that issues an <b>NFT attestation</b> to the users about their on-chain reputation and allows to <b>bundle the credentials in a ZK-manner</b> (generating a credential proof without revealing the wallet addresses) to create unique user identity on-chain and provide<b> benefits for the identity</b> reputation. 
<br>
<br>
## About ICP integration
The codebase here implements the main components of the ecosystem:
 <br>
 <br>
<li>user score computation canister</li>
<li>user score NFT mint canister</li>
<li>decentralized front-end with the whole flow of score interaction</li>
<li>ICP <> EVM multiwallet and sponsored transactions for the ICP computation</li>
<br>
<br>

## Showcase 
...gif 
  
## Setting up the project

```
npm install
echo -n "key" | base64 -w 0
source env.sh

dfx start --background
dfx deploy
```
