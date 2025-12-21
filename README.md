```bash
pnpm i
pnpm tsx src/index.ts
```

and you get (after few seconds)

```
Chain ID 0x384
tx hash: 0x53c3aa1b3228a30826a540891bb64a36d6eb71cd6540434bf5b6ffc03a1a6a76
/home/wighawag/dev/github.com/bug-reproduction/tevm-transaction-not-found/node_modules/.pnpm/viem@2.37.13_typescript@5.9.3_zod@4.2.1/node_modules/viem/utils/buildRequest.ts:167
                  throw new InvalidParamsRpcError(err)
                        ^

InvalidParamsRpcError: Invalid parameters were provided to the RPC method.
Double check you have provided the correct parameters.

Details: Transaction not found
Version: viem@2.37.13
    at delay.count.count (/home/wighawag/dev/github.com/bug-reproduction/tevm-transaction-not-found/node_modules/.pnpm/viem@2.37.13_typescript@5.9.3_zod@4.2.1/node_modules/viem/utils/buildRequest.ts:167:25)
    at async attemptRetry (/home/wighawag/dev/github.com/bug-reproduction/tevm-transaction-not-found/node_modules/.pnpm/viem@2.37.13_typescript@5.9.3_zod@4.2.1/node_modules/viem/utils/promise/withRetry.ts:44:22) {
  details: 'Transaction not found',
  docsPath: undefined,
  metaMessages: undefined,
  shortMessage: 'Invalid parameters were provided to the RPC method.\n' +
    'Double check you have provided the correct parameters.',
  version: '2.37.13',
  code: -32602,
  [cause]: InvalidParamsRpcError: Invalid parameters were provided to the RPC method.
  Double check you have provided the correct parameters.

  Details: Transaction not found
  Version: viem@2.37.13
      at delay.count.count (/home/wighawag/dev/github.com/bug-reproduction/tevm-transaction-not-found/node_modules/.pnpm/viem@2.37.13_typescript@5.9.3_zod@4.2.1/node_modules/viem/utils/buildRequest.ts:167:25)
      at async attemptRetry (/home/wighawag/dev/github.com/bug-reproduction/tevm-transaction-not-found/node_modules/.pnpm/viem@2.37.13_typescript@5.9.3_zod@4.2.1/node_modules/viem/utils/promise/withRetry.ts:44:22) {
    details: 'Transaction not found',
    docsPath: undefined,
    metaMessages: undefined,
    shortMessage: 'Invalid parameters were provided to the RPC method.\n' +
      'Double check you have provided the correct parameters.',
    version: '2.37.13',
    code: -32602,
    [cause]: { code: -32602, message: 'Transaction not found' }
  }
}

Node.js v24.11.1
```
