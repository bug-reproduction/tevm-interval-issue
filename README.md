```bash
pnpm i
pnpm tsx src/index.ts
```

And I get

```
/home/wighawag/dev/github.com/bug-reproduction/tevm-transaction-not-found-again/node_modules/.pnpm/viem@2.37.13_typescript@5.9.3_zod@4.2.1/node_modules/viem/utils/buildRequest.ts:168
                  throw new InvalidParamsRpcError(err)
                         ^

InvalidParamsRpcError: Invalid parameters were provided to the RPC method.
Double check you have provided the correct parameters.

Details: Transaction not found
Version: viem@2.37.13
    at withRetry.delay.count.count (/home/wighawag/dev/github.com/bug-reproduction/tevm-transaction-not-found-again/node_modules/.pnpm/viem@2.37.13_typescript@5.9.3_zod@4.2.1/node_modules/viem/utils/buildRequest.ts:168:26)
    at async attemptRetry (/home/wighawag/dev/github.com/bug-reproduction/tevm-transaction-not-found-again/node_modules/.pnpm/viem@2.37.13_typescript@5.9.3_zod@4.2.1/node_modules/viem/utils/promise/withRetry.ts:44:22) {
  details: 'Transaction not found',
  docsPath: undefined,
  metaMessages: undefined,
  shortMessage: 'Invalid parameters were provided to the RPC method.\n' +
    'Double check you have provided the correct parameters.',
  version: '2.37.13',
  code: -32602,
  [cause]: { code: -32602, message: 'Transaction not found' }
}
```

and adding log in viem (node_modules/viem/\_esm/utils/buildRequest.js) line 44: `console.error(args);`

I can see the argument being sent:

```
{
  method: 'eth_getTransactionByHash',
  params: [
    '0x53686ae3d873b1150cf82045fa529338f5ecfbef82186cca547102ab04ed66a6'
  ]
}
```

but if I execute this directly against the memory client it works fine
