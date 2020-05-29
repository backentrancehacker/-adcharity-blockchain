const SHA256 = require('crypto-js/sha256')

const EC = require('elliptic').ec
const ec = new EC('secp256k1')

const {generateKey, generateWallet} = require('./key')

const timestamp = () => {
	let today = new Date()
	return `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`
}

class Chain {
	constructor(difficulty, reward) {
		this.blockchain = [this.createGenesis()]
		this.difficulty = difficulty || 4
		this.reward = reward || 1
		
		this.pending = []
	}
	createGenesis() {
		return Object.freeze(new Block('Genesis Block', '0'))
	}
	latestBlock() {
		return this.blockchain[this.blockchain.length - 1]
	}
	addTransaction(transaction) {
		if(!transaction.sender || !transaction.receiver) 
			throw new Error('Transactions must include a sender and receiver.')

		else if(!transaction.integrity())
			throw new Error('Invalid transactions cannot be added.')

		else
			this.pending.push(transaction)
	}
	minePending(address) {
		const block = new Block(this.pending)
		block.index = this.blockchain.length
		block.prevHash = this.latestBlock().hash
		block.mine(this.difficulty)

		this.blockchain.push(block)

		this.pending = [
			new Transaction(null, address, this.reward)
		]
	}
	addressDetails(address) {
		let balance = 0
		for(let block of this.blockchain) {
			for(let t of block.transactions) {
				if(t.sender == address) balance -= t.amount
				if(t.receiver == address) balance += t.amount
			}
		}
		return balance
	}
	integrity() {
		let result
		for(let i = 1; i < this.blockchain.length; i++) {
			const current = this.blockchain[i]
			const prev = this.blockchain[i - 1]

			result = (current.hash == current.calcHash()) && (current.prevHash == prev.hash)
			if(!current.integrity()) return false
		}
		return result
	}
}

class Block {
	constructor(transactions, prevHash) {
		this.index = 0
		this.nonce = 0
		this.timestamp = timestamp()
		this.transactions = transactions
		this.prevHash = prevHash || ''
		this.hash = this.calcHash()
	}
	calcHash() {
		return SHA256(this.index + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString()	
	}
	mine(difficulty) {
		while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
			this.nonce ++ 
			this.hash = this.calcHash()
		}
	}
	integrity() {
		for(const t of this.transactions) {
			if(!t.integrity()) return false
		}
		return true
	}
}

class Transaction {
	constructor(sender, receiver, amount) {
		this.sender = sender
		this.receiver = receiver
		this.amount = amount
	}
	calcHash() {
		return SHA256(this.sender + this.receiver + this.amount).toString()
	}
	sign(key) {
		if(key.getPublic('hex') != this.sender) 
			throw new Error('Cannot send transactions from other wallets.')
		else {
			const hash = this.calcHash()
			const signature = key.sign(hash, 'base64')
			this.signature = signature.toDER('hex')
		}
	}
	integrity() {
		if(this.sender == null) return true
		
		if(!this.signature || this.signature.length == 0) 
			throw new Error('No signature in this transaction.')
			
		else {
			const _public = ec.keyFromPublic(this.sender, 'hex')

			return _public.verify(this.calcHash(), this.signature)
		}
	}
}

module.exports = {
	Chain,
	Transaction,
	generateKey,
	generateWallet
}