import {createMemoryClient, MemoryClient} from '@tevm/memory-client';
import {EIP1193ProviderWithoutEvents, extendProviderWithAccounts} from 'eip-1193-accounts-wrapper';
import {setupEnvironment} from '@rocketh/web';
import {config, extensions} from 'template-ethereum-contracts/rocketh/config.js';
import DeployScript from 'template-ethereum-contracts/deploy/001_deploy_greetings_registry.js';
import {mnemonicToAccount, privateKeyToAccount} from 'viem/accounts';
import {createPublicClient, createWalletClient, custom, defineChain} from 'viem';
import {createCurriedJSONRPC} from 'remote-procedure-call';

function wait(ms: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

async function main() {
	const USE_TEVM = true;
	const MANUAL = false;

	const interval = 2000;
	const memoryClient = createMemoryClient({
		miningConfig: MANUAL
			? {
					type: 'manual',
				}
			: {
					type: 'interval',
					blockTime: interval,
				},
		// loggingLevel: 'debug',
	});
	if (MANUAL) {
		setInterval(async () => {
			console.log(`mining...`);
			const result = await memoryClient.tevmMine();
			// console.log(`...complete`, result);
			if (result.blockHashes) {
				for (const blockHash of result.blockHashes) {
					// const numberOfTransactions = await memoryClient.getBlockTransactionCount({blockHash});
					// console.log({numberOfTransactions});
					const block = await memoryClient.getBlock({blockHash, includeTransactions: true});
					console.log(block.transactions.map((v) => `tx ${v.hash} included`));
				}
			}
		}, interval);
	}

	const client = USE_TEVM ? memoryClient : createCurriedJSONRPC('http://localhost:8545');

	let provider: EIP1193ProviderWithoutEvents = client as any;

	provider = ((p) => {
		return {
			async request(args: {method: string; params?: any[]}) {
				// fix tevm not supporting "earliest"
				if (args.method == 'eth_getBlockByNumber' && args.params?.[0] === 'earliest') {
					return p.request({
						method: 'eth_getBlockByNumber',
						params: ['0x0', args?.params[1]] as any,
					});
				}
				return p.request(args as any);
			},
		} as any;
	})(provider);

	const chainId = await provider.request({method: 'eth_chainId'});
	const chain = defineChain({
		id: Number(chainId),
		name: 'test',
		nativeCurrency: {symbol: 'ETH', name: 'Ether', decimals: 18},
		rpcUrls: {default: {http: []}},
	});

	const publicClient = createPublicClient({
		transport: custom(provider),
		chain,
	});
	const account = mnemonicToAccount('test test test test test test test test test test test junk');
	const walletClient = createWalletClient({
		transport: custom(provider),
		chain,
		account,
	});

	const txHash = await walletClient.sendTransaction({
		type: 'eip1559',
		gas: 60000n,
		maxFeePerGas: 1000000n,
		maxPriorityFeePerGas: 100000n,
		nonce: 0,
	});

	await wait(interval + 1000);
	console.log(`should be mined by then`);
	let receipt;
	try {
		console.log(`getting receipt for ${txHash}...`);
		receipt = await publicClient.getTransactionReceipt({hash: txHash});
	} catch (err) {
		console.error(err);
	}

	if (!receipt) {
		console.error(`no receipt`);
		await memoryClient.tevmMine();
		receipt = await publicClient.getTransactionReceipt({hash: txHash});
		if (!receipt) {
			console.error(`no receipt`);
		} else {
			console.log(`receipt`, receipt);
		}
	}
}

main();
