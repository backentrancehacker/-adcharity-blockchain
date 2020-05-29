const key = {
	'public': '04367e66613c084a6f138035b523601d58797801483a1931008e8b827def541909694cc53c5fac10546f5777a7064c05a153247e09a1ef9afa7be184eb742bfcbc',
	'private': '5040b3193597849b5f927bc000b1847188388da4f9830405120b3577d7208f2f'
}

const wallet = generateWallet(key)
const random = generateWallet()

let Litecoin = new Chain(0)

console.log('Initializing transaction.')
const transaction = new Transaction(wallet.address, random.address, 50)
transaction.sign(wallet.key)

Litecoin.addTransaction(transaction)

console.log('Mining')

Litecoin.minePending(wallet.address)
Litecoin.minePending(wallet.address)
Litecoin.addressDetails(wallet.address)
