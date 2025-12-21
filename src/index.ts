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
	await client.tevmReady();

	let provider = extendProviderWithAccounts(client as any, {
		accounts: {
			mnemonic: 'test test test test test test test test test test test junk',
		},
	});

	provider = ((p) => {
		return {
			request(args: {method: string; params?: any[]}) {
				if (args.method === 'eth_getBlockByNumber' && args.params?.[0] === 'earliest') {
					return p.request({
						method: 'eth_getBlockByNumber',
						params: ['0x0', args?.params[1]] as any,
					});
				}
				return p.request(args as any);
			},
		} as any;
	})(provider);

	const {loadAndExecuteDeploymentsFromModules} = setupEnvironment(config, extensions);
	await loadAndExecuteDeploymentsFromModules([{id: 'DeployScript', module: DeployScript}], {
		provider: provider,
		environment: 'tevm',
		logLevel: 7,
	});
}

main();
