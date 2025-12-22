import {parseTransaction} from 'viem';

const args = process.argv.slice(2);
console.log(parseTransaction(args[0] as `0x${string}`));
