import {createMemoryClient, MemoryClient} from '@tevm/memory-client';
import {createPublicClient, createWalletClient, custom, defineChain} from 'viem';
import {privateKeyToAccount} from 'viem/accounts';

async function main() {
	const client = createMemoryClient({
		miningConfig: {
			type: 'auto',
		},
	});
	// Initialize client
	await client.tevmReady();

	const chainId = await client.request({method: 'eth_chainId'});
	console.log('Chain ID', chainId);

	const chain = defineChain({
		id: parseInt(chainId, 16),
		name: 'TevmMemoryChain',
		nativeCurrency: {name: 'Ether', symbol: 'ETH', decimals: 18},
		rpcUrls: {default: {http: ['']}},
	});

	const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
	const account = privateKeyToAccount(privateKey);

	const walletClient = createWalletClient({
		chain,
		account,
		transport: custom(client),
	});
	const publicClient = createPublicClient({
		chain,
		transport: custom(client),
	});

	const txHash = await walletClient.sendTransaction({
		to: account.address,
		value: 1000000000000000000n, // 1 ETH
	});
	console.log('tx hash:', txHash);

	const receipt = await publicClient.waitForTransactionReceipt({
		hash: txHash,
	});
	console.log(receipt);
}

main();
