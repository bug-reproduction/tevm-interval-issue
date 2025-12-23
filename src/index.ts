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
		setTimeout(resolve);
	});
}

async function main() {
	const USE_TEVM = true;

	const interval = 2000;
	const memoryClient = createMemoryClient({
		miningConfig: {
			type: 'interval',
			interval,
		},
		// loggingLevel: 'debug',
	});
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

	const txHash = await walletClient.sendTransaction({});

	await wait(interval + 1000);
	console.log(`should be mined by then`);
	let receipt;
	try {
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
