const EC = require('elliptic').ec

const ec = new EC('secp256k1')

const generateKey = () => {
	const pair = ec.genKeyPair()

	const key = {
		'private': pair.getPrivate('hex')
	}

	console.log(key)
	return key
}

const generateWallet = (keys) => {
	if(!keys) keys = generateKey()
	
	const myKey = ec.keyFromPrivate(keys['private'])
	const myAddress = myKey.getPublic('hex')

	return {
		key: myKey,
		address: myAddress
	}
}

module.exports = {
	generateKey,
	generateWallet
}
