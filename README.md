## Overview
@adcharity/blockchain is a package to create your very own cryptocurrency. It's as easy as `const YourCoin = new Chain()`

## Usage
The main classes in the blockchain are the `Chain` and `Transaction`. 
All classes have an integrity, which determines whether or not the blockchain has been tampered with. 
There are also methods to generate a public/private key pair, as well as a wallet (`generateKey` and `generateWallet`)

### Keys
You can create a key with `generateKey()`. This key is used to build your wallet, but only the `private` key needs to be saved. Running `generateKey()` will print both the public and private keys to the console.

### Wallet
If you already received a key with `generateKey`, you can generate a wallet like so:
```
const wallet = generateWallet(key)
```
For testing purposes, you can also create a wallet with random credentials by omitting the `key` parameter.
```
const random = generateWallet()
```

### Chain
You can initialize the chain with a difficulty and reward. Difficulty, which defaults to `4`, makes it more difficult to spam blocks. The reward is the number of coins received upon mining a transaction, which defaults to `1`.
```
const Coin = new Chain(4, 100)
// Difficulty: 4
// Mining Reward: 100
```
#### Mining
After creating the coin, it is extremely easy to mine coins with a wallet. 
```
Coin.minePending(wallet.address)
```

#### Get Address's Balance
```
Coin.addressDetails(wallet.address)
```

### Transactions
Transactions are initialized with three parameters, the sender address, receiver address, and amount to send.
Transactions must be signed with the sender's key, and then added to the blockchain.
```
const transaction = new Transaction(wallet.address, random.address, 50)
transaction.sign(wallet.key)

Coin.addTransaction(transaction)
```