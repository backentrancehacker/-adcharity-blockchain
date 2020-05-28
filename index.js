const SHA256 = require('crypto-js/sha256')

class Chain {
	constructor(difficulty) {
		this.blockchain = [this.createGenesis()]
		this.difficulty = difficulty || 4
	}
	createGenesis() {
		return new Block('Genesis Block', '0')
	}
	latestBlock() {
		return this.blockchain[this.blockchain.length - 1]
	}
	addBlock(block) {
		block.prevHash = this.latestBlock().hash
		block.index = this.blockchain.length
		block.proof(this.difficulty)
		this.blockchain.push(block)
	}
	integrity() {
		for(let i = 1; i < this.blockchain.length; i++) {
			const current = this.blockchain[i]
			const prev = this.blockchain[i - 1]

			return current.hash == current.computeHash() && current.prevHash == prev.hash
		}
	}
}

class Block {
	constructor(data, prevHash) {
		this.index = 0
		this.nonce = 0
		this.timestamp = this.timestamp()
		this.data = data
		this.prevHash = prevHash || ''
		this.hash = this.computeHash()
	}
	timestamp() {
		let today = new Date()
		return `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`
	}
	computeHash() {
		return SHA256(this.index + this.timestamp + JSON.stringify(this.data) + this.nonce).toString()	
	}
	proof(difficulty) {
		while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
			this.nonce ++ 
			this.hash = this.computeHash()
		}
	}
}


module.exports = {
	Chain,
	Block
}