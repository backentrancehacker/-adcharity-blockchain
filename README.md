## Overview
@adcharity/blockchain is a package to create and manage simple blockchains. It relies on crypto-js for reliable and easy encryption.

## Usage
There are two classes in @adcharity/blockchain, the `Chain` and `Block`.

### Block
A block accepts one parameter, data in either JSON format or normal types (such as string). Example:
```
new Block({
	from: 'AdCharity',
	recipient: 'Friend',
	amount: 50
})
```

### Chain
You can initialize the chain with a difficulty, which defaults to 4. Difficulty makes it harder to spam the chain with blocks. Example:
```
const Coin = new Chain(10)
```
The Chain has several useable methods including `integrity` and `addBlock`. 
Integrity checks if the blockchain is actually valid. It returns a boolean (true or false) and determines if any of the hashes have been altered. Example: 
```
if(Coin.integrity()) {
	// the blockchain is safe
}
```
addBlock adds a block from the `Block` class. Example: 
```
Coin.addBlock(new Block({
	key: 'value'
}))
```
The chain itself auto manages the genesis block, hashes, and timestamps.

