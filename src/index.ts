import {createMemoryClient} from '@tevm/memory-client';
import {extendProviderWithAccounts} from 'eip-1193-accounts-wrapper';
import {setupEnvironment} from '@rocketh/web';
import {config, extensions} from 'template-ethereum-contracts/rocketh/config.js';
import DeployScript from 'template-ethereum-contracts/deploy/001_deploy_greetings_registry.js';

async function main() {
	const client = createMemoryClient({
		miningConfig: {
			type: 'auto',
		},
		// loggingLevel: 'debug',
	});

	let provider = extendProviderWithAccounts(client as any, {
		accounts: {
			mnemonic: 'test test test test test test test test test test test junk',
		},
	});

	provider = ((p) => {
		return {
			// fix tevm not supporting "earliest"
			async request(args: {method: string; params?: any[]}) {
				if (args.method === 'eth_getBlockByNumber' && args.params?.[0] === 'earliest') {
					return p.request({
						method: 'eth_getBlockByNumber',
						params: ['0x0', args?.params[1]] as any,
					});
				}
				// if (args.method === 'eth_getTransactionByHash') {
				// 	try {
				// 		await p.request({
				// 			method: 'eth_getTransactionByHash',
				// 			params: args.params as any,
				// 		});
				// 	} catch (err) {
				// 		// console.error(err);
				// 		return null;
				// 	}
				// }
				return p.request(args as any);
			},
		} as any;
	})(provider);

	// const gasPrice = await provider.request({
	// 	method: 'eth_gasPrice',
	// });
	// console.log(gasPrice);

	// const feeHistory = await provider.request({
	// 	method: 'eth_feeHistory',
	// 	params: ['0x1', 'latest', [30, 70, 90]],
	// });
	// console.log(feeHistory);

	console.log(`send fund`);
	const hash = await provider.request({
		method: 'eth_sendRawTransaction',
		params: [
			'0x02f87382038480843b9ac9f9843b9aca01825208943fab184622dc19b6109349b94811493bf2a45362872386f26fc1000080c080a0a553177ec2f6086aca6fb93bfead1c059f0835247d4807d0a366d4b257dae225a00c926a27b212667377b95efa68c7fc8e2e8d9471f467a1862f93bef2cab8d062',
		],
	});

	const tx = await provider.request({
		method: 'eth_getTransactionByHash',
		params: [hash],
	});

	// const {loadAndExecuteDeploymentsFromModules} = setupEnvironment(config, extensions);
	// await loadAndExecuteDeploymentsFromModules([{id: 'DeployScript', module: DeployScript}], {
	// 	provider: provider,
	// 	environment: 'tevm',
	// 	logLevel: 7,
	// });

	console.log(`create factory`);
	const hashForFactory = await provider.request({
		method: 'eth_sendRawTransaction',
		params: [
			'0xf8a58085174876e800830186a08080b853604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf31ba02222222222222222222222222222222222222222222222222222222222222222a02222222222222222222222222222222222222222222222222222222222222222',
		],
	});

	const txForFactory = await provider.request({
		method: 'eth_getTransactionByHash',
		params: [hashForFactory],
	});
}

main();
