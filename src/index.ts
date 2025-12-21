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

	const hash = await provider.request({
		method: 'eth_sendRawTransaction',
		params: [
			'0x02f86b820384808080825208943fab184622dc19b6109349b94811493bf2a45362872386f26fc1000080c080a0ea1b2974ab2beb274ffc4847e1acf226001de6fb1dcde0cf10178b8f29e3c05aa017a02e1f90cf9c5df1d8f9431ca1bb586e8f5abca7ae52ccec9f201d553987a4',
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
}

main();
